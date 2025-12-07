import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { createUser, loginUser, getUserById } from '../auth';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { storagePut } from '../storage';
import { randomBytes } from 'crypto';

export const authRouter = router({
  // Cadastro
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
      language: z.enum(['pt-BR', 'es', 'en']).optional(),
    }))
    .mutation(async ({ input }) => {
      const user = await createUser({
        email: input.email,
        password: input.password,
        name: input.name,
        language: input.language,
      });

      // Gerar token
      const { generateToken } = await import('../auth');
      const token = generateToken(user.id, user.email || '');

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          credits: user.credits,
          language: user.language,
          avatarUrl: user.avatarUrl,
        },
        token,
      };
    }),

  // Login
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await loginUser(input.email, input.password);
    }),

  // Obter perfil do usuário
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;

      const user = await getUserById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        language: user.language,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        acceptedTerms: user.acceptedTerms || false,
        tiktokUsername: user.tiktokUsername,
        instagramUsername: user.instagramUsername,
        youtubeChannelId: user.youtubeChannelId,
        youtubeShortsEnabled: user.youtubeShortsEnabled,
        onboardingAt: user.onboardingAt,
        onboardingUseCase: user.onboardingUseCase,
        onboardingNiche: user.onboardingNiche,
        role: user.role || 'user',
      };
    }),

  // Atualizar perfil
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(2).optional(),
      bio: z.string().optional(),
      language: z.enum(['pt-BR', 'es', 'en']).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      await db
        .update(users)
        .set({
          ...(input.name && { name: input.name }),
          ...(input.bio !== undefined && { bio: input.bio }),
          ...(input.language && { language: input.language }),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true };
    }),

  // Aceitar termos de uso
  acceptTerms: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      await db
        .update(users)
        .set({
          acceptedTerms: true,
          acceptedTermsAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true };
    }),

  // Upload de foto de perfil
  uploadAvatar: protectedProcedure
    .input(z.object({
      file: z.any(), // File object
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      // Converter File para Buffer
      const fileBuffer = Buffer.from(await input.file.arrayBuffer());
      const fileExtension = input.file.name.split('.').pop() || 'jpg';
      const avatarKey = `avatars/${userId}/${randomBytes(16).toString('hex')}.${fileExtension}`;

      // Upload para S3
      const { url: avatarUrl } = await storagePut(
        avatarKey,
        fileBuffer,
        input.file.type || 'image/jpeg'
      );

      // Atualizar no banco
      await db
        .update(users)
        .set({
          avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { avatarUrl };
    }),

  // Atualizar redes sociais
  updateSocialMedia: protectedProcedure
    .input(z.object({
      tiktokUsername: z.string().optional(),
      instagramUsername: z.string().optional(),
      youtubeChannelId: z.string().optional(),
      youtubeShortsEnabled: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      await db
        .update(users)
        .set({
          ...(input.tiktokUsername !== undefined && { tiktokUsername: input.tiktokUsername }),
          ...(input.instagramUsername !== undefined && { instagramUsername: input.instagramUsername }),
          ...(input.youtubeChannelId !== undefined && { youtubeChannelId: input.youtubeChannelId }),
          ...(input.youtubeShortsEnabled !== undefined && { youtubeShortsEnabled: input.youtubeShortsEnabled }),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true };
    }),
});

