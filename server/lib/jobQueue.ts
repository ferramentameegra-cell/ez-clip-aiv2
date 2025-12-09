/**
 * Sistema de fila de jobs usando Bull com Redis otimizado
 * Corrige problema de "max retries per request limit"
 */

import Queue from 'bull';
import Redis from 'ioredis';
import { processVideoJob } from '../jobProcessor';
import { logger } from './logger';

// Conexão Redis para BullMQ (sem limite de retries)
const bullRedis = new Redis({
  host: process.env.REDIS_HOST || (process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost'),
  port: parseInt(process.env.REDIS_PORT || (process.env.REDIS_URL ? new URL(process.env.REDIS_URL).port || '6379' : '6379')),
  password: process.env.REDIS_PASSWORD || (process.env.REDIS_URL ? new URL(process.env.REDIS_URL).password : undefined),
  maxRetriesPerRequest: null, // ← SEM LIMITE (corrige bug)
  enableReadyCheck: false,
  enableOfflineQueue: true,
  keepAlive: 30000,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  lazyConnect: false,
});

// Conexão Redis alternativa (para ytdl-core se necessário)
export const ytdlRedis = new Redis({
  host: process.env.REDIS_HOST || (process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost'),
  port: parseInt(process.env.REDIS_PORT || (process.env.REDIS_URL ? new URL(process.env.REDIS_URL).port || '6379' : '6379')),
  password: process.env.REDIS_PASSWORD || (process.env.REDIS_URL ? new URL(process.env.REDIS_URL).password : undefined),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  enableOfflineQueue: true,
  keepAlive: 30000,
});

// Event handlers para debug
bullRedis.on('error', (err) => {
  logger.error('[Redis] Erro na conexão:', err);
});

bullRedis.on('connect', () => {
  logger.info('[Redis] Conectado com sucesso');
});

ytdlRedis.on('error', (err) => {
  logger.error('[Redis YTDL] Erro na conexão:', err);
});

// Criar fila de processamento de vídeo usando conexão Redis otimizada
// Bull aceita URL string, objeto de configuração, ou createClient function
// IMPORTANTE: Bull v4 aceita createClient para customizar conexão
export const videoQueue = new Queue('video-processing', {
  createClient: () => {
    // Retornar sempre a mesma instância otimizada para todos os tipos
    return bullRedis;
  },
  defaultJobOptions: {
    attempts: 5, // Tentar até 5 vezes
    backoff: {
      type: 'exponential',
      delay: 2000, // 2s, 4s, 8s, 16s, 32s
    },
    removeOnComplete: {
      age: 24 * 3600, // Manter jobs completos por 24h
      count: 1000, // Manter últimos 1000 jobs
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Manter jobs falhados por 7 dias
    },
  },
});

// Processar jobs da fila (sem nome específico para compatibilidade com Bull)
videoQueue.process(async (job) => {
  const { jobId } = job.data;
  logger.info(`[Queue] Processando job ${jobId}...`);
  
  try {
    await processVideoJob(jobId);
    logger.info(`[Queue] Job ${jobId} concluído com sucesso`);
    return { success: true, jobId };
  } catch (error: any) {
    logger.error(`[Queue] Erro ao processar job ${jobId}:`, { error: error.message, stack: error.stack });
    throw error; // Bull vai fazer retry automaticamente
  }
});

// Event listeners para monitoramento
videoQueue.on('completed', (job) => {
  logger.info(`[Queue] ✅ Job ${job.data.jobId} completado`);
});

videoQueue.on('failed', (job, err) => {
  logger.error(`[Queue] ❌ Job ${job?.data?.jobId} falhou:`, { error: err.message, stack: err.stack });
});

videoQueue.on('stalled', (job) => {
  logger.warn(`[Queue] ⚠️ Job ${job.data.jobId} travado`);
});

videoQueue.on('active', (job) => {
  logger.info(`[Queue] 🟢 Job ${job.data.jobId} iniciado`);
});

videoQueue.on('waiting', (jobId) => {
  logger.info(`[Queue] ⏳ Job ${jobId} aguardando processamento`);
});

// Limpar fila ao encerrar
process.on('SIGTERM', async () => {
  logger.info('[Queue] Encerrando fila...');
  await videoQueue.close();
  await bullRedis.quit();
  await ytdlRedis.quit();
});

export { bullRedis };

