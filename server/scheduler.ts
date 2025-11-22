import cron from 'node-cron';
import { getDb } from './db';
import { scheduledPosts } from '../drizzle/schema';
import { eq, and, lte } from 'drizzle-orm';
import { publishToYouTubeShorts, publishToTikTok, publishToInstagram } from './socialPublisher';

/**
 * Inicia scheduler para publicações agendadas
 * Roda a cada 5 minutos
 */
export function startScheduler() {
  console.log('[Scheduler] Iniciando...');

  // Rodar a cada 5 minutos
  cron.schedule('*/5 * * * *', async () => {
    console.log('[Scheduler] Verificando posts agendados...');

    try {
      const db = await getDb();
      if (!db) {
        // Banco de dados não configurado ainda - silenciar erro
        return;
      }

      // Buscar posts pendentes que já passaram do horário
      const now = new Date();
      const pendingPosts = await db
        .select()
        .from(scheduledPosts)
        .where(
          and(
            eq(scheduledPosts.status, 'pending'),
            lte(scheduledPosts.scheduledTime, now)
          )
        );

      console.log(`[Scheduler] ${pendingPosts.length} posts para publicar`);

      for (const post of pendingPosts) {
        try {
          console.log(`[Scheduler] Publicando post ${post.id} em ${post.platform}...`);

          // Publicar na plataforma
          let success = false;

          switch (post.platform) {
            case 'youtube':
              const youtubeResult = await publishToYouTubeShorts(post.clipId, post.userId);
              success = youtubeResult.success;
              break;
            case 'tiktok':
              const tiktokResult = await publishToTikTok(post.clipId, post.userId);
              success = tiktokResult.success;
              break;
            case 'instagram':
              const instagramResult = await publishToInstagram(post.clipId, post.userId);
              success = instagramResult.success;
              break;
          }

          // Atualizar status
          await db
            .update(scheduledPosts)
            .set({ status: success ? 'published' : 'failed' })
            .where(eq(scheduledPosts.id, post.id));

          console.log(`[Scheduler] Post ${post.id} ${success ? 'publicado' : 'falhou'}`);

        } catch (error: any) {
          console.error(`[Scheduler] Erro ao publicar post ${post.id}:`, error.message);

          // Marcar como falho
          await db
            .update(scheduledPosts)
            .set({ status: 'failed' })
            .where(eq(scheduledPosts.id, post.id));
        }
      }

    } catch (error: any) {
      // Silenciar erro se banco não estiver configurado
      const errorMessage = error?.message || String(error);
      if (errorMessage && !errorMessage.includes('ECONNREFUSED') && !errorMessage.includes('getaddrinfo')) {
        // Só logar erros que não sejam de conexão
        if (process.env.NODE_ENV === 'development') {
          console.error('[Scheduler] Erro:', errorMessage);
        }
      }
    }
  });

  console.log('[Scheduler] Ativo (roda a cada 5 minutos)');
}

