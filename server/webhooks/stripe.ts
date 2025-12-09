/**
 * Webhook handler do Stripe
 * Processa eventos de pagamento e assinaturas
 */

import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getDb } from '../db';
import { users, subscriptions, creditLedgers } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../lib/logger';

// Planos disponíveis (deve corresponder com server/config/plans.ts)
const PLANS: Record<string, { monthlyCredits: number; name: string }> = {
  starter: { monthlyCredits: 10, name: 'Starter' },
  creator: { monthlyCredits: 50, name: 'Creator' },
  pro: { monthlyCredits: 200, name: 'Pro' },
};

export async function stripeWebhookHandler(req: Request, res: Response) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-11-17.clover',
  });

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  if (!sig || !webhookSecret) {
    logger.error('[Stripe Webhook] Signature ou secret ausente');
    return res.status(400).send('Webhook signature missing');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    logger.info(`[Stripe Webhook] Evento recebido: ${event.type}`);
  } catch (err: any) {
    logger.error(`[Stripe Webhook] Erro ao verificar signature: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId: string = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
        
        // Buscar usuário pelo customerId
        const db = await getDb();
        if (!db) {
          throw new Error('Database not available');
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (!user) {
          logger.error(`[Stripe Webhook] Usuário não encontrado para customer ${customerId}`);
          return res.status(400).send('Webhook Error: User not found');
        }

        // Inferir planKey do priceId
        const priceId = sub.items.data[0]?.price?.id;
        const planKey = inferPlanKeyFromPrice(priceId);
        if (!planKey) {
          logger.error(`[Stripe Webhook] PlanKey não encontrado para priceId ${priceId}`);
          return res.status(400).send('Webhook Error: Plan not found');
        }

        const plan = PLANS[planKey];
        if (!plan) {
          logger.error(`[Stripe Webhook] Plano não encontrado: ${planKey}`);
          return res.status(400).send('Webhook Error: Invalid plan');
        }

        // Atualizar ou criar subscription
        const billingInterval = sub.items.data[0]?.price?.recurring?.interval || 'month';

        // Verificar se subscription já existe
        const [existing] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, sub.id))
          .limit(1);

        if (existing) {
          // Atualizar subscription existente
          await db
            .update(subscriptions)
            .set({
              priceId: priceId || '',
              planKey,
              billingInterval,
              status: sub.status,
              currentPeriodStart: new Date((sub as any).current_period_start * 1000),
              currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end || false,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, existing.id));
        } else {
          // Criar nova subscription
          await db.insert(subscriptions).values({
            userId: user.id,
            stripeCustomerId: customerId,
            stripeSubscriptionId: sub.id,
            priceId: priceId || '',
            planKey,
            billingInterval,
            status: sub.status,
            currentPeriodStart: new Date((sub as any).current_period_start * 1000),
            currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end || false,
          });
        }

        logger.info(`[Stripe Webhook] Subscription ${sub.id} criada/atualizada para usuário ${user.id}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId: string = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id || '';

        if (!customerId) {
          logger.error(`[Stripe Webhook] CustomerId ausente no invoice ${invoice.id}`);
          return res.status(400).send('Webhook Error: Missing customerId');
        }

        const db = await getDb();
        if (!db) {
          throw new Error('Database not available');
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (!user) {
          logger.error(`[Stripe Webhook] Usuário não encontrado para customer ${customerId}`);
          return res.status(400).send('Webhook Error: User not found');
        }

        // Inferir planKey do priceId
        const lineItem = invoice.lines.data[0];
        const priceId = (lineItem as any)?.price?.id;
        const planKey = inferPlanKeyFromPrice(priceId);
        if (!planKey) {
          logger.error(`[Stripe Webhook] PlanKey não encontrado para invoice ${invoice.id}`);
          return res.status(400).send('Webhook Error: Plan not found');
        }

        const plan = PLANS[planKey];
        if (!plan) {
          logger.error(`[Stripe Webhook] Plano não encontrado: ${planKey}`);
          return res.status(400).send('Webhook Error: Invalid plan');
        }

        const creditsToGrant = plan.monthlyCredits;

        // Adicionar créditos via ledger
        await db.insert(creditLedgers).values({
          userId: user.id,
          delta: creditsToGrant,
          reason: `Pagamento recebido - Plano ${plan.name}`,
          meta: { invoiceId: invoice.id, planKey } as any, // JSON field
        });

        // Atualizar créditos do usuário
        const { sql } = await import('drizzle-orm');
        await db
          .update(users)
          .set({
            credits: sql`credits + ${creditsToGrant}`,
          })
          .where(eq(users.id, user.id));

        logger.info(`[Stripe Webhook] ${creditsToGrant} créditos concedidos ao usuário ${user.id}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const db = await getDb();
        if (!db) {
          throw new Error('Database not available');
        }

        await db
          .update(subscriptions)
          .set({ 
            status: 'canceled',
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));

        logger.info(`[Stripe Webhook] Subscription ${sub.id} cancelada`);
        break;
      }

      default:
        logger.warn(`[Stripe Webhook] Evento não tratado: ${event.type}`);
    }
  } catch (err: any) {
    logger.error(`[Stripe Webhook] Erro ao processar evento: ${err.message}`, { error: err });
    return res.status(500).send('Webhook handler error');
  }

  res.json({ received: true });
}

/**
 * Infere o planKey a partir do priceId do Stripe
 */
function inferPlanKeyFromPrice(priceId?: string | null): string | null {
  if (!priceId) return null;

  // Mapear priceIds para planKeys (configurado via env vars)
  const priceMapping: Record<string, string> = {
    [process.env.STRIPE_PRICE_STARTER_MONTH || '']: 'starter',
    [process.env.STRIPE_PRICE_STARTER_YEAR || '']: 'starter',
    [process.env.STRIPE_PRICE_CREATOR_MONTH || '']: 'creator',
    [process.env.STRIPE_PRICE_CREATOR_YEAR || '']: 'creator',
    [process.env.STRIPE_PRICE_PRO_MONTH || '']: 'pro',
    [process.env.STRIPE_PRICE_PRO_YEAR || '']: 'pro',
  };

  // Remover entradas vazias
  Object.keys(priceMapping).forEach(key => {
    if (!key) delete priceMapping[key];
  });

  return priceMapping[priceId] || null;
}

