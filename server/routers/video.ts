import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getDb } from '../db';
import { jobs, clips } from '../../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import { isValidYouTubeUrl, validateVideo } from '../youtubeDownloader';
import ytdl from '@distube/ytdl-core';
import { hasEnoughCredits } from '../creditsManager';
import { getSignedUrl } from '../storage';
import { PackageSize } from '../../shared/types';
import { getPackagePreset } from '../presets';
import { videoQueue } from '../lib/jobQueue';
import { generateJobZip } from '../zipGenerator';

// Usando protectedProcedure - requer autenticação

export const videoRouter = router({
  // Criar novo job
  create: protectedProcedure
    .input(z.object({
      youtubeUrl: z.string().url(),
      // Sistema de pacotes (NOVO)
      packageSize: z.enum(['5', '10', '50', '100']).optional(),
      // Configurações legadas (mantidas para compatibilidade)
      clipDuration: z.number().min(30).max(180).optional(),
      withSubtitles: z.boolean().default(true),
      vertical: z.string().optional(), // Opcional quando não há conteúdo secundário
      secondaryContentType: z.enum(['none', 'platform', 'user', 'emoji']).optional(),
      secondaryContentId: z.string().optional(), // Pode ser ID de vídeo ou emoji
      headline: z.string().max(100).optional(),
      // Configurações avançadas (opcionais)
      targetDurationSec: z.number().optional(),
      overlapSec: z.number().optional(),
      segmentationMode: z.enum(['fixed', 'semantic', 'hybrid']).optional(),
      // Seleção de trecho do vídeo
      startTime: z.number().min(0).optional().nullable(),
      endTime: z.number().min(0).optional().nullable(),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      // Verificar termos (opcional - pode ser false)
      // Removido validação obrigatória - usuário pode processar sem aceitar termos

      // Validar URL do YouTube
      if (!isValidYouTubeUrl(input.youtubeUrl)) {
        throw new Error('URL do YouTube inválida');
      }

      // OTIMIZAÇÃO: Validação rápida (timeout curto)
      try {
        const info = await ytdl.getInfo(input.youtubeUrl, {
          requestOptions: {
            timeout: 10000, // 10s timeout para validação rápida
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            }
          }
        });
        const validation = validateVideo(
          info, 
          input.startTime ?? undefined, 
          input.endTime ?? undefined
        );
        if (!validation.valid) {
          throw new Error(validation.error || 'Vídeo inválido');
        }
      } catch (error: any) {
        if (error.message.includes('inválido')) {
          throw error;
        }
        throw new Error(`Erro ao validar vídeo: ${error.message}`);
      }

      // Obter conexão do banco
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // Determinar packageSize e aplicar preset
      let packageSize: PackageSize | null = null;
      let preset = null;
      let creditsNeeded = 1; // Default: 1 crédito

      if (input.packageSize) {
        packageSize = parseInt(input.packageSize) as PackageSize;
        preset = getPackagePreset(packageSize);
        creditsNeeded = packageSize; // 1 crédito por clipe
      }

      // Verificar créditos suficientes
      const hasCredits = await hasEnoughCredits(userId, creditsNeeded);
      if (!hasCredits) {
        throw new Error(`Créditos insuficientes. Necessário: ${creditsNeeded}`);
      }

      // Preparar valores do job
      const jobValues: any = {
        userId: userId,
        sourceUrl: input.youtubeUrl,
        startTime: input.startTime !== undefined ? input.startTime : null,
        endTime: input.endTime !== undefined ? input.endTime : null,
        withSubtitles: input.withSubtitles,
        withRetention: input.secondaryContentType !== 'none',
        vertical: input.vertical || null,
        secondaryContentType: input.secondaryContentType || null,
        secondaryContentId: input.secondaryContentId ? Number(input.secondaryContentId) : null,
        headline: input.headline || null,
        status: 'pending',
        progress: 0,
      };

      // Se usar sistema de pacotes, aplicar preset
      if (packageSize && preset) {
        jobValues.packageSize = packageSize;
        jobValues.targetDurationSec = input.targetDurationSec || preset.targetDurationSec;
        jobValues.overlapSec = (input.overlapSec || preset.overlapSec).toString();
        jobValues.segmentationMode = input.segmentationMode || preset.segmentationMode;
        jobValues.durationTolerance = preset.durationTolerance.toString();
        // Manter clipDuration para compatibilidade
        jobValues.clipDuration = input.clipDuration || preset.targetDurationSec;
      } else {
        // Sistema legado
        jobValues.clipDuration = input.clipDuration || 60;
      }

      // Criar job
      const result = await db.insert(jobs).values(jobValues);

      // Obter ID do job inserido
      const jobId = Number(result[0].insertId);

      // Adicionar job à fila (processamento assíncrono)
      await videoQueue.add({ 
        jobId,
        userId,
        sourceUrl: input.youtubeUrl,
        startTime: input.startTime,
        endTime: input.endTime,
        packageSize: packageSize || undefined,
        clipDuration: input.clipDuration,
        withSubtitles: input.withSubtitles,
        vertical: input.vertical,
        secondaryContentType: input.secondaryContentType,
        secondaryContentId: input.secondaryContentId,
        headline: input.headline,
        ...preset,
      }, {
        jobId: jobId.toString(), // ID único para o job
        priority: 1, // Prioridade padrão
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });

      console.log(`[VideoRouter] Job ${jobId} adicionado à fila`);

      return { jobId, creditsNeeded };
    }),

  // Obter status do job
  getStatus: protectedProcedure
    .input(z.object({ jobId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      const [job] = await db
        .select()
        .from(jobs)
        .where(
          and(
            eq(jobs.id, input.jobId),
            eq(jobs.userId, userId)
          )
        )
        .limit(1);

      if (!job) {
        throw new Error('Job não encontrado');
      }

      return {
        id: job.id,
        status: job.status,
        progress: job.progress,
        errorMessage: job.errorMessage,
        totalClips: job.totalClips,
      };
    }),

  // Listar jobs do usuário
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const userId = ctx.user.id;

      return await db
        .select({
          id: jobs.id,
          status: jobs.status,
          progress: jobs.progress,
          totalClips: jobs.totalClips,
          errorMessage: jobs.errorMessage,
          createdAt: jobs.createdAt,
        })
        .from(jobs)
        .where(eq(jobs.userId, userId))
        .orderBy(desc(jobs.createdAt))
        .limit(50);
    }),

  // Retry job falhado
  retry: protectedProcedure
    .input(z.object({ jobId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      // Verificar se job existe e pertence ao usuário
      const [job] = await db
        .select()
        .from(jobs)
        .where(
          and(
            eq(jobs.id, input.jobId),
            eq(jobs.userId, userId)
          )
        )
        .limit(1);

      if (!job) {
        throw new Error('Job não encontrado');
      }

      if (job.status !== 'failed') {
        throw new Error('Apenas jobs falhados podem ser reprocessados');
      }

      // Resetar status do job
      await db
        .update(jobs)
        .set({
          status: 'pending',
          progress: 0,
          errorMessage: null,
        })
        .where(eq(jobs.id, input.jobId));

      // Adicionar job à fila novamente
      await videoQueue.add({ jobId: input.jobId }, {
        jobId: input.jobId.toString(),
        priority: 1,
      });

      console.log(`[VideoRouter] Job ${input.jobId} adicionado à fila para retry`);

      return { success: true, jobId: input.jobId };
    }),

  // Download de clipes processados
  downloadClip: protectedProcedure
    .input(z.object({ clipId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      const [clip] = await db
        .select()
        .from(clips)
        .where(eq(clips.id, input.clipId))
        .limit(1);

      if (!clip) {
        throw new Error('Clipe não encontrado');
      }

      // Verificar se o job pertence ao usuário
      const [job] = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, clip.jobId))
        .limit(1);

      if (!job || job.userId !== userId) {
        throw new Error('Acesso negado');
      }

      // Gerar signed URL do S3 (válida por 1 hora)
      if (clip.videoKey) {
        const signedUrl = await getSignedUrl(clip.videoKey, 3600);
        return {
          videoUrl: signedUrl,
          videoKey: clip.videoKey,
        };
      }

      // Fallback para URL pública se não tiver key
      return {
        videoUrl: clip.videoUrl,
        videoKey: clip.videoKey,
      };
    }),

  // Obter detalhes de um job com clipes e scores
  getById: protectedProcedure
    .input(z.object({ jobId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      const [job] = await db
        .select()
        .from(jobs)
        .where(
          and(
            eq(jobs.id, input.jobId),
            eq(jobs.userId, userId)
          )
        )
        .limit(1);

      if (!job) {
        throw new Error('Job não encontrado');
      }

      // Buscar clipes do job
      const jobClips = await db
        .select()
        .from(clips)
        .where(eq(clips.jobId, input.jobId))
        .orderBy(clips.clipNumber);

      return {
        job: {
          id: job.id,
          status: job.status,
          progress: job.progress,
          totalClips: job.totalClips,
          createdAt: job.createdAt,
          sourceUrl: job.sourceUrl,
          vertical: job.vertical,
          packageSize: job.packageSize,
        },
        clips: jobClips.map(clip => ({
          id: clip.id,
          clipNumber: clip.clipNumber,
          videoUrl: clip.videoUrl,
          thumbnailUrl: clip.thumbnailUrl,
          duration: clip.duration,
          retentionScore: clip.retentionScore,
          transcription: clip.transcriptionText,
        })),
      };
    }),

  // Obter link de download para todos os clipes de um job (ZIP)
  getDownloadLink: protectedProcedure
    .input(z.object({ jobId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      const [job] = await db
        .select()
        .from(jobs)
        .where(
          and(
            eq(jobs.id, input.jobId),
            eq(jobs.userId, userId)
          )
        )
        .limit(1);

      if (!job) {
        throw new Error('Job não encontrado');
      }

      if (job.status !== 'completed') {
        throw new Error('Job ainda não foi concluído');
      }

      // Gerar ZIP com todos os clipes
      const { zipKey } = await generateJobZip(input.jobId);
      
      // Retornar URL assinada do ZIP (válida por 1 hora)
      const signedUrl = await getSignedUrl(zipKey, 3600);
      
      return { url: signedUrl, zipKey };
    }),
});

