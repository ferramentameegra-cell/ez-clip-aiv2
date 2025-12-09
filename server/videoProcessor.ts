/**
 * Video Processor - Processamento de vídeos com FFmpeg
 * 
 * Layout correto para TikTok/Instagram Reels (1080x1920px):
 * - Top Safe Zone: 0-200px (10.42%)
 * - Vídeo Principal: 200-900px (700px / 36.46%)
 * - Headline: 900-940px (40px / 2.08%)
 * - Vídeo Retenção: 940-1620px (680px / 35.42%)
 * - Legendas: 1620-1720px (100px / 5.21%) ← VISÍVEL (acima dos botões)
 * - Bottom Safe Zone: 1720-1920px (200px / 10.42%) ← Botões
 */

import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { generateSRT, TranscriptionSegment } from './transcription';
import { storagePut } from './storage';
import { randomBytes } from 'crypto';

export interface ProcessClipOptions {
  videoPath: string;
  retentionVideoPath?: string;
  clipStart: number;
  clipEnd: number;
  partNumber: number;
  totalParts: number;
  headline?: string;
  withSubtitles: boolean;
  transcriptionSegments?: TranscriptionSegment[];
  vertical: string;
}

export interface ProcessedClip {
  videoKey: string;
  videoUrl: string;
  startTime: number;
  endTime: number;
  partNumber: number;
  localPath?: string; // Caminho local temporário (para thumbnail)
}

/**
 * Processa um único clipe com layout vertical correto
 */
export async function processClip(options: ProcessClipOptions): Promise<ProcessedClip> {
  const {
    videoPath,
    retentionVideoPath,
    clipStart,
    clipEnd,
    partNumber,
    totalParts,
    headline,
    withSubtitles,
    transcriptionSegments,
    vertical
  } = options;

  const tempDir = '/tmp/viral-clips';
  const duration = clipEnd - clipStart;

  console.log(`[Process] Clipe ${partNumber}/${totalParts} (${clipStart}s - ${clipEnd}s)`);

  // 1. Cortar vídeo principal
  const mainClipPath = path.join(tempDir, `main_${randomBytes(4).toString('hex')}.mp4`);
  
  // Garantir que o diretório existe
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .setStartTime(clipStart)
      .setDuration(duration)
      .outputOptions(['-c:v libx264', '-preset ultrafast', '-crf 28', '-tune fastdecode', '-c:a aac', '-b:a 96k', '-threads 0'])
      .output(mainClipPath)
      .on('end', () => resolve())
      .on('error', (err) => {
        console.error(`[FFmpeg] Erro ao cortar vídeo:`, err);
        reject(err);
      })
      .run();
  });
  
  // Cleanup do arquivo temporário principal após uso
  const cleanupMainClip = () => {
    if (fs.existsSync(mainClipPath)) {
      try {
        fs.unlinkSync(mainClipPath);
      } catch (error: any) {
        console.warn(`[Process] Erro ao limpar mainClipPath:`, error.message);
      }
    }
  };

  // 2. Criar composição vertical com safe zones
  let finalVideoPath = mainClipPath;
  let composedPath: string | null = null;

  if (retentionVideoPath) {
    composedPath = await createVerticalComposition(
      mainClipPath,
      retentionVideoPath,
      duration,
      headline,
      partNumber,
      totalParts
    );
    finalVideoPath = composedPath;
    // Limpar mainClipPath após composição
    cleanupMainClip();
  }

  // 3. Adicionar legendas
  let subtitledPath: string | null = null;
  if (withSubtitles && transcriptionSegments) {
    subtitledPath = await addSubtitles(
      finalVideoPath,
      transcriptionSegments,
      clipStart,
      clipEnd
    );
    finalVideoPath = subtitledPath;
    // Limpar arquivo anterior se foi criado novo
    if (composedPath && fs.existsSync(composedPath)) {
      try {
        fs.unlinkSync(composedPath);
      } catch (error: any) {
        console.warn(`[Process] Erro ao limpar composedPath:`, error.message);
      }
    }
  }

  // 4. Upload para S3
  const videoBuffer = fs.readFileSync(finalVideoPath);
  const videoKey = `clips/${vertical}/${Date.now()}_part${partNumber}.mp4`;
  const { url: videoUrl } = await storagePut(videoKey, videoBuffer, 'video/mp4');

  console.log(`[Process] Clipe ${partNumber} concluído: ${videoUrl}`);

  return {
    videoKey,
    videoUrl,
    startTime: clipStart,
    endTime: clipEnd,
    partNumber,
    localPath: finalVideoPath // Retornar caminho local para thumbnail
  };
}

/**
 * Cria composição vertical: vídeo principal (topo) + headline (centro) + vídeo retenção (base)
 */
async function createVerticalComposition(
  mainVideoPath: string,
  retentionVideoPath: string,
  duration: number,
  headline?: string,
  partNumber?: number,
  totalParts?: number
): Promise<string> {
  const tempDir = '/tmp/viral-clips';
  const outputPath = path.join(tempDir, `composed_${randomBytes(4).toString('hex')}.mp4`);

  // Dimensões do layout
  const WIDTH = 1080;
  const HEIGHT = 1920;
  const TOP_SAFE = 200;
  const MAIN_HEIGHT = 700;
  const HEADLINE_HEIGHT = 40;
  const RETENTION_HEIGHT = 680;

  // Posições
  const MAIN_Y = TOP_SAFE; // 200
  const HEADLINE_Y = MAIN_Y + MAIN_HEIGHT; // 900
  const RETENTION_Y = HEADLINE_Y + HEADLINE_HEIGHT; // 940

  // Filtros FFmpeg
  const filters = [
    // Vídeo principal (topo)
    `[0:v]scale=${WIDTH}:${MAIN_HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${MAIN_HEIGHT}:(ow-iw)/2:(oh-ih)/2,setsar=1[main]`,
    
    // Vídeo de retenção (base)
    `[1:v]scale=${WIDTH}:${RETENTION_HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${RETENTION_HEIGHT}:(ow-iw)/2:(oh-ih)/2,setsar=1,loop=loop=-1:size=1:start=0[retention]`,
    
    // Canvas preto
    `color=black:s=${WIDTH}x${HEIGHT}:d=${duration}[bg]`,
    
    // Compor vídeo principal
    `[bg][main]overlay=0:${MAIN_Y}[tmp1]`,
    
    // Compor vídeo de retenção
    `[tmp1][retention]overlay=0:${RETENTION_Y}[tmp2]`
  ];

  // Adicionar headline se existir
  if (headline) {
    const headlineText = headline.replace(/'/g, "\\\\'");
    filters.push(
      `[tmp2]drawtext=text='${headlineText}':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=32:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=${HEADLINE_Y + 10}[tmp3]`
    );
  }

  // Adicionar numeração "PARTE X/Y"
  if (partNumber && totalParts) {
    const lastFilter = headline ? 'tmp3' : 'tmp2';
    filters.push(
      `[${lastFilter}]drawtext=text='PARTE ${partNumber}/${totalParts}':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=24:fontcolor=white:borderw=2:bordercolor=black:x=20:y=20[out]`
    );
  } else {
    filters.push(headline ? '[tmp3]copy[out]' : '[tmp2]copy[out]');
  }

  const filterComplex = filters.join(';');

  // Garantir que o diretório existe
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(mainVideoPath)
      .input(retentionVideoPath)
      .complexFilter(filterComplex, 'out')
      .outputOptions([
        '-map', '[out]',
        '-map', '0:a',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '28',
        '-tune', 'fastdecode',
        '-threads', '0',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-shortest'
      ])
      .output(outputPath)
      .on('start', (cmd) => console.log(`[FFmpeg] Compor: ${cmd}`))
      .on('end', () => {
        console.log(`[FFmpeg] Composição concluída: ${outputPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`[FFmpeg] Erro na composição:`, err);
        reject(err);
      })
      .run();
  });

  return outputPath;
}

/**
 * Adiciona legendas estilizadas (safe zone: 1620-1720px - VISÍVEL acima dos botões)
 */
async function addSubtitles(
  videoPath: string,
  segments: TranscriptionSegment[],
  clipStart: number,
  clipEnd: number
): Promise<string> {
  const tempDir = '/tmp/viral-clips';
  const srtPath = path.join(tempDir, `subs_${randomBytes(4).toString('hex')}.srt`);
  const outputPath = path.join(tempDir, `subtitled_${randomBytes(4).toString('hex')}.mp4`);

  // Gerar SRT
  const srtContent = generateSRT(segments, clipStart, clipEnd);
  fs.writeFileSync(srtPath, srtContent, 'utf-8');

  // Garantir que o diretório existe
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Aplicar legendas com estilo TikTok (posição: y=1620 - acima dos botões)
  // MarginV=300 = 1920 - 1620 = 300px do topo (legendas centralizadas na área 1620-1720)
  // Escapar o caminho do SRT para o FFmpeg
  const escapedSrtPath = srtPath.replace(/:/g, '\\:').replace(/'/g, "\\'");
  const subtitlesFilter = `subtitles='${escapedSrtPath}':force_style='FontName=DejaVu Sans,FontSize=28,Bold=1,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=3,Shadow=2,Alignment=2,MarginV=300'`;

  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions(['-vf', subtitlesFilter, '-c:a', 'copy'])
      .output(outputPath)
      .on('end', () => {
        console.log(`[FFmpeg] Legendas adicionadas: ${outputPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`[FFmpeg] Erro ao adicionar legendas:`, err);
        reject(err);
      })
      .run();
  });

  // Cleanup
  if (fs.existsSync(srtPath)) {
    fs.unlinkSync(srtPath);
  }

  return outputPath;
}
