import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import Stripe from 'stripe';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { PLANS, PlanKey } from '../config/plans';
import { logger } from '../lib/logger';

// Inicializar Stripe (apenas se a chave estiver configurada)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  });
}

// Helper para gerar URL absoluta
function absoluteUrl(path: string) {
  const baseUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173';
  return `${baseUrl}${path}`;
}

export const paymentRouter = router({
  // Obter planos disponíveis
  getPlans: protectedProcedure.query(async () => {
    return Object.values(PLANS).map(plan => ({
      key: plan.key,
      name: plan.name,
      monthlyCredits: plan.monthlyCredits,
      prices: plan.prices,
    }));
  }),

  // Criar sessão de checkout (subscription)
  createCheckoutSession: protectedProcedure
    .input(z.object({
      planKey: z.enum(['starter', 'creator', 'pro']),
      interval: z.enum(['month', 'year']),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!stripe) {
        throw new Error('Stripe não está configurado. Configure STRIPE_SECRET_KEY no .env');
      }

      const userId = ctx.user.id;
      const plan = PLANS[input.planKey as PlanKey];
      
      if (!plan) {
        throw new Error('Plano inválido');
      }

      const priceId = plan.prices[input.interval]?.stripePriceId;
      if (!priceId) {
        throw new Error('ID de preço Stripe não configurado para este plano');
      }

      // Obter ou criar customer no Stripe
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [user] = await db
        .select({ email: users.email, stripeCustomerId: users.stripeCustomerId, name: users.name })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user?.email) {
        throw new Error('Email do usuário não encontrado');
      }

      let customerId = user.stripeCustomerId;

      // Criar customer se não existir
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
          metadata: { userId: userId.toString() },
        });
        customerId = customer.id;
        
        // Salvar customerId no banco
        await db
          .update(users)
          .set({ stripeCustomerId: customerId })
          .where(eq(users.id, userId));
      }

      // Criar sessão de checkout no Stripe
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: absoluteUrl('/dashboard?checkout=success'),
        cancel_url: absoluteUrl('/pricing?checkout=cancel'),
        allow_promotion_codes: true,
        metadata: {
          userId: userId.toString(),
          planKey: input.planKey,
        },
      });

      logger.info(`[Payment] Checkout session criada para usuário ${userId}, plano ${input.planKey}`);

      return { url: session.url };
    }),

  // Obter subscription atual do usuário
  getSubscription: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const { subscriptions: subscriptionsTable } = await import('../../drizzle/schema');
      
      const [subscription] = await db
        .select()
        .from(subscriptionsTable)
        .where(eq(subscriptionsTable.userId, ctx.user.id))
        .limit(1);

      if (!subscription) {
        return null;
      }

      return {
        id: subscription.id,
        planKey: subscription.planKey,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      };
    }),

  // Cancelar subscription
  cancelSubscription: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (!stripe) {
        throw new Error('Stripe não está configurado');
      }

      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const { subscriptions: subscriptionsTable } = await import('../../drizzle/schema');
      
      const [subscription] = await db
        .select()
        .from(subscriptionsTable)
        .where(eq(subscriptionsTable.userId, ctx.user.id))
        .limit(1);

      if (!subscription) {
        throw new Error('Subscription não encontrada');
      }

      // Cancelar no Stripe
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Atualizar no banco
      await db
        .update(subscriptionsTable)
        .set({ 
          cancelAtPeriodEnd: true,
          updatedAt: new Date(),
        })
        .where(eq(subscriptionsTable.id, subscription.id));

      logger.info(`[Payment] Subscription ${subscription.id} cancelada pelo usuário ${ctx.user.id}`);

      return { success: true };
    }),

  // Obter histórico de créditos (ledger)
  getCreditHistory: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const { creditLedgers } = await import('../../drizzle/schema');
      const { desc } = await import('drizzle-orm');
      
      const history = await db
        .select()
        .from(creditLedgers)
        .where(eq(creditLedgers.userId, ctx.user.id))
        .orderBy(desc(creditLedgers.createdAt))
        .limit(50);

      return history.map(entry => ({
        id: entry.id,
        delta: entry.delta,
        reason: entry.reason,
        meta: entry.meta || null, // Já vem como objeto do Drizzle
        createdAt: entry.createdAt,
      }));
    }),
});

