import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getDb } from '../db';
import { users, jobs, clips } from '../../drizzle/schema';
import { eq, desc, sql, count, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

/**
 * Procedimento protegido - requer role ADMIN
 */
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, ctx.user.id))
    .limit(1);

  if (!user || user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Acesso negado. Apenas administradores podem acessar esta área.',
    });
  }

  return next({ ctx });
});

export const adminRouter = router({
  // Dashboard - Métricas gerais
  getDashboard: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [totalUsers] = await db
        .select({ count: count() })
        .from(users);

      const [totalJobs] = await db
        .select({ count: count() })
        .from(jobs);

      const [totalClips] = await db
        .select({ count: count() })
        .from(clips);

      const [completedJobs] = await db
        .select({ count: count() })
        .from(jobs)
        .where(eq(jobs.status, 'completed'));

      const [failedJobs] = await db
        .select({ count: count() })
        .from(jobs)
        .where(eq(jobs.status, 'failed'));

      const [totalCredits] = await db
        .select({ total: sql<number>`SUM(${users.credits})` })
        .from(users);

      // Usuários novos nos últimos 7 dias
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [newUsers] = await db
        .select({ count: count() })
        .from(users)
        .where(sql`${users.createdAt} >= ${sevenDaysAgo}`);

      return {
        users: {
          total: totalUsers.count,
          newLast7Days: newUsers.count,
        },
        jobs: {
          total: totalJobs.count,
          completed: completedJobs.count,
          failed: failedJobs.count,
        },
        clips: {
          total: totalClips.count,
        },
        credits: {
          total: Number(totalCredits.total) || 0,
        },
      };
    }),

  // Listar usuários
  getUsers: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const offset = (input.page - 1) * input.limit;

      let query = db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          credits: users.credits,
          onboardingUseCase: users.onboardingUseCase,
          onboardingNiche: users.onboardingNiche,
          onboardingAt: users.onboardingAt,
          createdAt: users.createdAt,
        })
        .from(users);

      let allUsers;
      let totalCount;

      if (input.search) {
        const searchPattern = `%${input.search}%`;
        allUsers = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            credits: users.credits,
            onboardingUseCase: users.onboardingUseCase,
            onboardingNiche: users.onboardingNiche,
            onboardingAt: users.onboardingAt,
            createdAt: users.createdAt,
          })
          .from(users)
          .where(
            sql`${users.name} LIKE ${searchPattern} OR ${users.email} LIKE ${searchPattern}`
          )
          .orderBy(desc(users.createdAt))
          .limit(input.limit)
          .offset(offset);

        const [countResult] = await db
          .select({ count: count() })
          .from(users)
          .where(
            sql`${users.name} LIKE ${searchPattern} OR ${users.email} LIKE ${searchPattern}`
          );
        totalCount = countResult;
      } else {
        allUsers = await query
          .orderBy(desc(users.createdAt))
          .limit(input.limit)
          .offset(offset);

        const [countResult] = await db
          .select({ count: count() })
          .from(users);
        totalCount = countResult;
      }

      return {
        users: allUsers,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: totalCount.count,
          totalPages: Math.ceil(totalCount.count / input.limit),
        },
      };
    }),

  // Editar usuário (créditos, role)
  updateUser: adminProcedure
    .input(z.object({
      userId: z.number(),
      credits: z.number().optional(),
      role: z.enum(['user', 'admin']).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const updateData: any = {
        updatedAt: new Date(),
      };

      if (input.credits !== undefined) {
        updateData.credits = input.credits;
      }

      if (input.role !== undefined) {
        updateData.role = input.role;
      }

      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Adicionar créditos a um usuário (soma ao valor atual)
  addCredits: adminProcedure
    .input(z.object({
      userId: z.number(),
      credits: z.number().min(1),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      await db
        .update(users)
        .set({
          credits: sql`${users.credits} + ${input.credits}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Adicionar créditos por email (útil para admins)
  addCreditsByEmail: adminProcedure
    .input(z.object({
      email: z.string().email(),
      credits: z.number().min(1),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, input.email.toLowerCase()))
        .limit(1);

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuário não encontrado',
        });
      }

      await db
        .update(users)
        .set({
          credits: sql`${users.credits} + ${input.credits}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      return { success: true, userId: user.id };
    }),

  // Listar jobs
  getJobs: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      status: z.enum(['pending', 'downloading', 'transcribing', 'cutting', 'rendering', 'completed', 'failed']).optional(),
      userId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const offset = (input.page - 1) * input.limit;

      let conditions: any[] = [];

      if (input.status) {
        conditions.push(eq(jobs.status, input.status));
      }

      if (input.userId) {
        conditions.push(eq(jobs.userId, input.userId));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const allJobs = await db
        .select({
          id: jobs.id,
          userId: jobs.userId,
          sourceUrl: jobs.sourceUrl,
          status: jobs.status,
          progress: jobs.progress,
          totalClips: jobs.totalClips,
          errorMessage: jobs.errorMessage,
          createdAt: jobs.createdAt,
          updatedAt: jobs.updatedAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        })
        .from(jobs)
        .leftJoin(users, eq(jobs.userId, users.id))
        .where(whereClause)
        .orderBy(desc(jobs.createdAt))
        .limit(input.limit)
        .offset(offset);

      const [totalCount] = await db
        .select({ count: count() })
        .from(jobs)
        .where(whereClause);

      return {
        jobs: allJobs,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: totalCount.count,
          totalPages: Math.ceil(totalCount.count / input.limit),
        },
      };
    }),

  // Reprocessar job (resetar status para pending)
  reprocessJob: adminProcedure
    .input(z.object({
      jobId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      await db
        .update(jobs)
        .set({
          status: 'pending',
          progress: 0,
          errorMessage: null,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, input.jobId));

      return { success: true };
    }),

  // Gerenciar Vídeos de Retenção da Plataforma
  listPlatformRetentionVideos: adminProcedure
    .input(z.object({
      vertical: z.string().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const { retentionVideos } = await import('../../drizzle/schema');
      const offset = (input.page - 1) * input.limit;

      let conditions: any[] = [sql`${retentionVideos.userId} IS NULL`]; // Apenas vídeos da plataforma

      if (input.vertical) {
        conditions.push(eq(retentionVideos.vertical, input.vertical));
      }

      const whereClause = and(...conditions);

      const allVideos = await db
        .select()
        .from(retentionVideos)
        .where(whereClause)
        .orderBy(desc(retentionVideos.createdAt))
        .limit(input.limit)
        .offset(offset);

      const [totalCount] = await db
        .select({ count: count() })
        .from(retentionVideos)
        .where(whereClause);

      return {
        videos: allVideos,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: totalCount.count,
          totalPages: Math.ceil(totalCount.count / input.limit),
        },
      };
    }),

  uploadPlatformRetentionVideo: adminProcedure
    .input(z.object({
      file: z.any(),
      vertical: z.string(),
      name: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const { storagePut } = await import('../storage');
      const { randomBytes } = await import('crypto');
      const schema = await import('../../drizzle/schema');
      const { retentionVideos } = schema;

      // Converter File para Buffer
      const fileBuffer = Buffer.from(await input.file.arrayBuffer());
      const fileExtension = input.name.split('.').pop() || 'mp4';
      const videoKey = `platform-retention-videos/${randomBytes(16).toString('hex')}.${fileExtension}`;

      // Upload para S3/R2
      const { url: videoUrl } = await storagePut(
        videoKey,
        fileBuffer,
        input.file.type || 'video/mp4'
      );

      // Salvar no banco (userId = NULL significa vídeo da plataforma)
      const result = await db.insert(retentionVideos).values({
        userId: null, // NULL = vídeo da plataforma (todos podem usar)
        vertical: input.vertical,
        name: input.name,
        videoKey,
        videoUrl,
        duration: 0, // TODO: Obter duração real
        isActive: true,
      });

      const videoId = Number(result[0].insertId);

      return { success: true, videoId };
    }),

  deletePlatformRetentionVideo: adminProcedure
    .input(z.object({
      videoId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const schema = await import('../../drizzle/schema');
      const { retentionVideos } = schema;

      await db
        .update(retentionVideos)
        .set({ isActive: false })
        .where(and(eq(retentionVideos.id, input.videoId), sql`${retentionVideos.userId} IS NULL`));

      return { success: true };
    }),

  // Gerenciar Emojis 3D
  listEmojis: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const schema = await import('../../drizzle/schema');
      const { genericEmojis } = schema;
      const offset = (input.page - 1) * input.limit;

      const allEmojis = await db
        .select()
        .from(genericEmojis)
        .orderBy(desc(genericEmojis.createdAt))
        .limit(input.limit)
        .offset(offset);

      const [totalCount] = await db
        .select({ count: count() })
        .from(genericEmojis);

      return {
        emojis: allEmojis,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: totalCount.count,
          totalPages: Math.ceil(totalCount.count / input.limit),
        },
      };
    }),

  uploadEmoji: adminProcedure
    .input(z.object({
      file: z.any(),
      name: z.string(),
      emoji: z.string(),
      category: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const { storagePut } = await import('../storage');
      const { randomBytes } = await import('crypto');
      const schema = await import('../../drizzle/schema');
      const { genericEmojis } = schema;

      // Converter File para Buffer
      const fileBuffer = Buffer.from(await input.file.arrayBuffer());
      const fileExtension = input.name.split('.').pop() || 'mp4';
      const videoKey = `platform-emojis/${randomBytes(16).toString('hex')}.${fileExtension}`;

      // Upload para S3/R2
      const { url: videoUrl } = await storagePut(
        videoKey,
        fileBuffer,
        input.file.type || 'video/mp4'
      );

      // Salvar no banco
      const result = await db.insert(genericEmojis).values({
        name: input.name,
        emoji: input.emoji,
        videoKey,
        videoUrl,
        category: input.category || null,
        isActive: true,
      });

      const emojiId = Number(result[0].insertId);

      return { success: true, emojiId };
    }),

  deleteEmoji: adminProcedure
    .input(z.object({
      emojiId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const schema = await import('../../drizzle/schema');
      const { genericEmojis } = schema;

      await db
        .update(genericEmojis)
        .set({ isActive: false })
        .where(eq(genericEmojis.id, input.emojiId));

      return { success: true };
    }),

  // Garantir que admins tenham 10000 créditos
  ensureAdminCredits: adminProcedure
    .mutation(async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const ADMIN_EMAILS = [
        'daniel.braun@hotmail.com',
        'josyasborba@hotmail.com',
      ].map(e => e.toLowerCase());

      const { inArray } = await import('drizzle-orm');
      
      // Buscar usuários admin
      const adminUsers = await db
        .select()
        .from(users)
        .where(inArray(users.email, ADMIN_EMAILS));

      // Atualizar créditos para 10000
      const updated: string[] = [];
      for (const user of adminUsers) {
        if (user.credits < 10000) {
          await db
            .update(users)
            .set({ credits: 10000 })
            .where(eq(users.id, user.id));
          
          updated.push(`${user.email} → 10000 créditos`);
        }
      }

      return { 
        success: true, 
        message: updated.length > 0 
          ? `Créditos atualizados: ${updated.join(', ')}`
          : 'Todos os admins já têm 10000+ créditos',
        updated 
      };
    }),
});

