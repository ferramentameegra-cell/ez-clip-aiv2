import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import type { VerticalType } from '../../shared/verticais';
import { getRetentionVideosByVertical, createRetentionVideo, deleteRetentionVideoById, getGenericEmojis } from '../db';
import { storagePut } from '../storage';
import { randomBytes } from 'crypto';

// Schema para filtro de vertical
const verticalSchema = z.enum([
  'politica',
  'futebol',
  'series-filmes',
  'comedia',
  'religiao',
  'profissoes',
  'novelas',
  'programas-tv',
  'saude',
  'educacao',
  'bem-estar',
  'qualidade-vida',
  'saude-mental',
  'meditacao',
  'yoga',
  'nutricao',
  'lifestyle',
  'desenvolvimento-pessoal',
  'negocios',
  'fitness',
  'tecnologia',
  'marketing',
  'financas',
  'direito',
  'engenharia-civil',
  'arquitetura',
  'moda',
  'beleza',
  'esportes',
  'musica',
  'arte',
  'viagem',
  'games'
]).optional();

// Schema para deletar vídeo
const deleteVideoSchema = z.object({
  videoId: z.string()
});

// Tipo para vídeo de retenção
export interface RetentionVideo {
  id: string;
  name: string | null;
  vertical: VerticalType | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  duration: number | null;
  createdAt: Date | null;
}

// Importar getDb
import { getDb } from '../db';

export const userContentRouter = router({
  listRetentionVideos: publicProcedure
    .input(z.object({
      vertical: verticalSchema
    }).optional())
    .query(async ({ input }): Promise<RetentionVideo[]> => {
      try {
        const db = await getDb();
        if (!db) return [];

        const videos = await getRetentionVideosByVertical(input?.vertical);

        return videos.map(video => ({
          id: String(video.id),
          name: video.name,
          vertical: video.vertical as VerticalType | null,
          thumbnailUrl: null, // TODO: Adicionar thumbnailUrl ao schema se necessário
          videoUrl: video.videoUrl || null,
          duration: video.duration,
          createdAt: video.createdAt,
        }));
      } catch (error: any) {
        // Erro ao listar vídeos - silenciosamente retornar array vazio
        return [];
      }
    }),

  uploadRetentionVideo: protectedProcedure
    .input(z.object({
      file: z.any(), // File object
      vertical: z.enum(['politica', 'futebol', 'series-filmes', 'comedia', 'religiao', 'profissoes', 'novelas', 'programas-tv', 'saude', 'educacao', 'bem-estar', 'qualidade-vida', 'saude-mental', 'meditacao', 'yoga', 'nutricao', 'lifestyle', 'desenvolvimento-pessoal', 'negocios', 'fitness', 'tecnologia', 'marketing', 'financas', 'direito', 'engenharia-civil', 'arquitetura', 'moda', 'beleza', 'esportes', 'musica', 'arte', 'viagem', 'games']),
      name: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        const userId = ctx.user.id;

        // Converter File para Buffer
        const fileBuffer = Buffer.from(await input.file.arrayBuffer());
        const fileExtension = input.name.split('.').pop() || 'mp4';
        const videoKey = `user-retention-videos/${userId}/${randomBytes(16).toString('hex')}.${fileExtension}`;

        // Upload para S3
        const { url: videoUrl } = await storagePut(
          videoKey,
          fileBuffer,
          input.file.type || 'video/mp4'
        );

        // Salvar no banco de dados
        const newVideo = await createRetentionVideo({
          userId,
          vertical: input.vertical,
          name: input.name,
          videoKey,
          videoUrl,
          duration: 0, // TODO: Obter duração real do vídeo usando FFmpeg
        });

        return { 
          success: true, 
          video: {
            id: String(newVideo.id),
            name: newVideo.name,
            vertical: newVideo.vertical as VerticalType | null,
            thumbnailUrl: null, // TODO: Adicionar thumbnailUrl ao schema se necessário
            duration: newVideo.duration,
            createdAt: newVideo.createdAt,
          }
        };
      } catch (error: any) {
        // Erro ao fazer upload - propagar erro para o cliente
        throw new Error(`Erro ao fazer upload: ${error.message}`);
      }
    }),

          deleteRetentionVideo: protectedProcedure
    .input(deleteVideoSchema)
    .mutation(async ({ input }) => {
      try {
        await deleteRetentionVideoById(input.videoId);
        return { success: true };
      } catch (error: any) {
        // Erro ao deletar vídeo - propagar erro para o cliente
        throw new Error(`Erro ao deletar vídeo: ${error.message}`);
      }
    }),

  listGenericEmojis: publicProcedure
    .query(async () => {
      try {
        const emojis = await getGenericEmojis();
        return emojis.map(emoji => ({
          id: String(emoji.id),
          name: emoji.name,
          emoji: emoji.emoji,
          videoUrl: emoji.videoUrl,
          videoKey: emoji.videoKey,
        }));
      } catch (error: any) {
        // Erro ao listar emojis - silenciosamente retornar array vazio
        return [];
      }
    })
});

