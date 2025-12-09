import { downloadYouTubeVideo, cleanupFiles } from './youtubeDownloader';
import { transcribeAudio, splitIntoSequentialClips, splitIntoSequentialClipsWithOverlap } from './transcription';
import { processClip } from './videoProcessor';
import { getJobById, updateJobStatus, createClip, getRetentionVideosByVertical, getDb } from './db';
import { decrementUserCredits } from './creditsManager';
import { PackageSize } from '../shared/types';
import { getPackagePreset } from './presets';
import { segmentWithAI } from './aiSegmenter';
import { jobs } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { calculateRetentionScore } from './retentionScorer';
import { generateThumbnail } from './thumbnailGenerator';
import { logger } from './lib/logger';
import fs from 'fs';

/**
 * Processa job completo end-to-end
 */
export async function processVideoJob(jobId: number): Promise<void> {
  const tempFiles: string[] = [];

  try {
    const job = await getJobById(jobId);
    if (!job) throw new Error('Job não encontrado');

    logger.info(`[Job ${jobId}] Iniciando processamento...`);

    // 1. Download do YouTube (com corte se startTime/endTime estiverem definidos)
    await updateJobStatus(jobId, 'downloading', 10);
    const { videoPath, audioPath, title, duration } = await downloadYouTubeVideo(
      job.sourceUrl!,
      '/tmp/viral-clips',
      job.startTime !== null ? job.startTime : undefined,
      job.endTime !== null ? job.endTime : undefined
    );
    tempFiles.push(videoPath, audioPath);

    const downloadMessage = (job.startTime !== null && job.endTime !== null)
      ? `Download concluído (trecho ${job.startTime}s-${job.endTime}s): ${title} (${duration}s)`
      : `Download concluído: ${title} (${duration}s)`;
    logger.info(`[Job ${jobId}] ${downloadMessage}`);

    // 2. Transcrição com Whisper
    await updateJobStatus(jobId, 'transcribing', 30);
    const transcription = await transcribeAudio(audioPath, 'pt');

    // Se o vídeo foi cortado, ajustar os timestamps da transcrição
    // (os timestamps do Whisper são relativos ao início do áudio, então já estão corretos)
    // Mas precisamos garantir que os segmentos estejam dentro do range correto
    const adjustedTranscription = (job.startTime !== null && job.endTime !== null)
      ? {
          ...transcription,
          segments: transcription.segments.filter(seg => 
            seg.start >= 0 && seg.end <= duration
          )
        }
      : transcription;

    logger.info(`[Job ${jobId}] Transcrição: ${adjustedTranscription.segments.length} segmentos`);

    // 3. Dividir em clipes sequenciais
    await updateJobStatus(jobId, 'cutting', 50);
    
    let clips: Array<{ start: number; end: number; text: string; partNumber: number; index?: number; total?: number; overlapWithNext?: number }>;
    
    // Usar novo sistema de pacotes se packageSize estiver definido
    if (job.packageSize) {
      const packageSize = job.packageSize as PackageSize;
      const preset = getPackagePreset(packageSize);
      
      const targetDuration = job.targetDurationSec || preset.targetDurationSec;
      const overlapSec = job.overlapSec ? parseFloat(job.overlapSec) : preset.overlapSec;
      const mode = (job.segmentationMode || preset.segmentationMode) as 'fixed' | 'semantic' | 'hybrid';
      const tolerance = job.durationTolerance ? parseFloat(job.durationTolerance) : preset.durationTolerance;
      
      // Tentar usar IA se disponível, senão usar algoritmo
      const useAI = process.env.USE_AI_SEGMENTATION === 'true';
      
      if (useAI && job.vertical) {
        try {
          clips = await segmentWithAI(
            adjustedTranscription,
            packageSize,
            job.vertical,
            targetDuration,
            overlapSec,
            mode,
            job.headline || undefined
          );
          logger.info(`[Job ${jobId}] ${clips.length} clipes criados com IA (Package ${packageSize}, Nicho: ${job.vertical})`);
        } catch (error: any) {
          logger.warn(`[Job ${jobId}] Erro na segmentação com IA, usando algoritmo:`, { error: error.message });
          clips = splitIntoSequentialClipsWithOverlap(
            adjustedTranscription,
            packageSize,
            targetDuration,
            overlapSec,
            mode,
            tolerance
          );
          logger.info(`[Job ${jobId}] ${clips.length} clipes criados com algoritmo (Package ${packageSize})`);
        }
      } else {
        // Usar segmentação algorítmica
        clips = splitIntoSequentialClipsWithOverlap(
          adjustedTranscription,
          packageSize,
          targetDuration,
          overlapSec,
          mode,
          tolerance
        );
        console.log(`[Job ${jobId}] ${clips.length} clipes criados com algoritmo (Package ${packageSize})`);
      }
    } else {
      // Fallback para sistema legado
      clips = splitIntoSequentialClips(adjustedTranscription, job.clipDuration || 75);
      console.log(`[Job ${jobId}] ${clips.length} clipes criados (Legado)`);
    }

    // 4. Obter vídeo de retenção
    let retentionVideoPath: string | undefined;
    
    if (job.withRetention) {
      const retentionVideos = await getRetentionVideosByVertical(job.vertical || 'geral');
      if (retentionVideos.length > 0) {
        const randomVideo = retentionVideos[Math.floor(Math.random() * retentionVideos.length)];
        retentionVideoPath = randomVideo.videoUrl || undefined; // URL do S3
        logger.info(`[Job ${jobId}] Vídeo de retenção: ${randomVideo.name}`);
      }
    }

    // 5. Processar cada clipe
    await updateJobStatus(jobId, 'rendering', 60);

    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const progress = 60 + Math.floor((i / clips.length) * 35);
      await updateJobStatus(jobId, 'rendering', progress);

      logger.info(`[Job ${jobId}] Processando clipe ${i + 1}/${clips.length}...`);

      const processedClip = await processClip({
        videoPath,
        retentionVideoPath,
        clipStart: clip.start,
        clipEnd: clip.end,
        partNumber: clip.partNumber,
        totalParts: clips.length,
        headline: job.headline || undefined,
        withSubtitles: job.withSubtitles === true,
        transcriptionSegments: adjustedTranscription.segments,
        vertical: job.vertical || 'geral'
      });

      // Gerar thumbnail do clipe processado (usando arquivo local temporário)
      let thumbnailKey: string | undefined;
      let thumbnailUrl: string | undefined;
      try {
        if (processedClip.localPath && fs.existsSync(processedClip.localPath)) {
          const thumbnailResult = await generateThumbnail(processedClip.localPath, duration);
          thumbnailKey = thumbnailResult.thumbnailKey;
          thumbnailUrl = thumbnailResult.thumbnailUrl;
        }
      } catch (error: any) {
        logger.warn(`[Job ${jobId}] Erro ao gerar thumbnail:`, { error: error.message });
        // Continuar mesmo se thumbnail falhar
      }
      
      // Cleanup do arquivo local após gerar thumbnail
      if (processedClip.localPath && fs.existsSync(processedClip.localPath)) {
        try {
          fs.unlinkSync(processedClip.localPath);
        } catch (error: any) {
          logger.warn(`[Job ${jobId}] Erro ao limpar arquivo local:`, { error: error.message });
        }
      }

      // Calcular score de retenção
      const retentionScore = calculateRetentionScore(
        adjustedTranscription.segments.filter(seg => 
          seg.start >= clip.start && seg.end <= clip.end
        ),
        duration,
        job.vertical || undefined
      );

      // Salvar no banco
      const db = await getDb();
      if (db) {
        const { clips: clipsTable } = await import('../drizzle/schema');
        await db.insert(clipsTable).values({
          jobId,
          clipNumber: processedClip.partNumber,
          videoKey: processedClip.videoKey,
          videoUrl: processedClip.videoUrl,
          startTime: processedClip.startTime,
          endTime: processedClip.endTime,
          duration: duration,
          retentionScore: retentionScore.score,
          transcriptionText: clip.text,
          thumbnailKey: thumbnailKey || null,
          thumbnailUrl: thumbnailUrl || null,
        });
      } else {
        // Fallback para função antiga
        await createClip({
          jobId,
          videoKey: processedClip.videoKey,
          videoUrl: processedClip.videoUrl,
          startTime: processedClip.startTime,
          endTime: processedClip.endTime,
          partNumber: processedClip.partNumber,
          transcriptionText: clip.text,
          thumbnailKey: thumbnailKey,
          thumbnailUrl: thumbnailUrl,
        });
      }

      logger.info(`[Job ${jobId}] Clipe ${i + 1} processado - Score: ${retentionScore.score}/100`);
    }

    // 6. Atualizar totalClips no job
    await updateJobStatus(jobId, 'completed', 100);
    
    // Atualizar totalClips no banco
    const db = await getDb();
    if (db) {
      await db
        .update(jobs)
        .set({ totalClips: clips.length })
        .where(eq(jobs.id, jobId));
    }
    
    // Consumir créditos: quantidade total de uma vez
    const creditsToConsume = clips.length;
    await decrementUserCredits(job.userId, creditsToConsume);
    
    logger.info(`[Job ${jobId}] Processamento concluído! ${creditsToConsume} créditos consumidos.`);

  } catch (error: any) {
    logger.error(`[Job ${jobId}] Erro:`, { error: error.message, stack: error.stack });
    await updateJobStatus(jobId, 'failed', 0, error.message);
    throw error;

  } finally {
    // Cleanup
    await cleanupFiles(tempFiles);
  }
}

