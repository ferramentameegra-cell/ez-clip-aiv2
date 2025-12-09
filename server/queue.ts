/**
 * Sistema de fila de jobs usando Bull
 * DEPRECADO: Use server/lib/jobQueue.ts ao invés deste arquivo
 * Mantido apenas para compatibilidade
 */

// Re-export da nova implementação
export { videoQueue, bullRedis, ytdlRedis } from './lib/jobQueue';
export { videoQueue as default } from './lib/jobQueue';

