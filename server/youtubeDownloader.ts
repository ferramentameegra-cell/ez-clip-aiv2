import ytdl from '@distube/ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { logger } from './lib/logger';

const pipelineAsync = promisify(pipeline);

export interface DownloadResult {
  videoPath: string;
  audioPath: string;
  title: string;
  duration: number;
}

/**
 * Valida vídeo antes do download
 * @param startTime - Tempo de início do trecho selecionado (opcional)
 * @param endTime - Tempo de fim do trecho selecionado (opcional)
 */
export function validateVideo(info: any, startTime?: number, endTime?: number): { valid: boolean; error?: string } {
  const duration = parseInt(info.videoDetails.lengthSeconds);
  const maxDuration = 4 * 60 * 60; // 4 horas máximo
  const minDuration = 30; // 30 segundos mínimo

  // Se startTime e endTime foram fornecidos, validar o trecho selecionado
  if (startTime !== undefined && endTime !== undefined) {
    if (startTime < 0) {
      return { valid: false, error: 'Tempo de início deve ser maior ou igual a 0' };
    }
    if (endTime <= startTime) {
      return { valid: false, error: 'Tempo de fim deve ser maior que o tempo de início' };
    }
    if (endTime > duration) {
      return { valid: false, error: `Tempo de fim (${endTime}s) excede a duração do vídeo (${duration}s)` };
    }
    const selectedDuration = endTime - startTime;
    if (selectedDuration < minDuration) {
      return { valid: false, error: `Trecho selecionado muito curto (${selectedDuration}s). Mínimo: ${minDuration}s` };
    }
    if (selectedDuration > maxDuration) {
      return { valid: false, error: `Trecho selecionado muito longo (${Math.round(selectedDuration / 60)}min). Máximo: ${Math.round(maxDuration / 60)}min` };
    }
  } else {
    // Validar vídeo completo
    if (duration < minDuration) {
      return { valid: false, error: `Vídeo muito curto (${duration}s). Mínimo: ${minDuration}s` };
    }

    if (duration > maxDuration) {
      return { valid: false, error: `Vídeo muito longo (${Math.round(duration / 60)}min). Máximo: ${Math.round(maxDuration / 60)}min` };
    }
  }

  // Verificar se vídeo está disponível
  if (info.videoDetails.isLiveContent) {
    return { valid: false, error: 'Vídeos ao vivo não são suportados' };
  }

  if (info.videoDetails.isPrivate) {
    return { valid: false, error: 'Vídeo privado não pode ser processado' };
  }

  return { valid: true };
}

/**
 * Baixa vídeo do YouTube e extrai áudio
 * @param startTime - Tempo de início em segundos (opcional, para cortar apenas um trecho)
 * @param endTime - Tempo de fim em segundos (opcional, para cortar apenas um trecho)
 */
export async function downloadYouTubeVideo(
  youtubeUrl: string,
  outputDir: string = '/tmp/viral-clips',
  startTime?: number,
  endTime?: number
): Promise<DownloadResult> {
  // Criar diretório
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Obter informações do vídeo com headers otimizados
  const info = await ytdl.getInfo(youtubeUrl, {
    requestOptions: {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      }
    }
  });
  
  // Validar vídeo (passar startTime/endTime se fornecidos)
  const validation = validateVideo(info, startTime, endTime);
  if (!validation.valid) {
    throw new Error(validation.error || 'Vídeo inválido');
  }

  const title = info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const duration = parseInt(info.videoDetails.lengthSeconds);
  
  const timestamp = Date.now();
  const videoFilename = `${title}_${timestamp}.mp4`;
  const audioFilename = `${title}_${timestamp}.mp3`;
  const videoPath = path.join(outputDir, videoFilename);
  const audioPath = path.join(outputDir, audioFilename);

  // Se startTime e endTime foram fornecidos, ajustar duração
  const actualDuration = (startTime !== undefined && endTime !== undefined) 
    ? (endTime - startTime) 
    : duration;
  
  const logMessage = (startTime !== undefined && endTime !== undefined)
    ? `Baixando trecho: ${info.videoDetails.title} (${startTime}s - ${endTime}s, ${actualDuration}s)`
    : `Baixando: ${info.videoDetails.title} (${duration}s)`;
  
  logger.info(`[Download] ${logMessage}`);

  // Escolher formato (1080p ou menor, com áudio)
  const format = ytdl.chooseFormat(info.formats, {
    quality: 'highestvideo',
    filter: (f: any) => f.container === 'mp4' && f.hasVideo && f.hasAudio && (f.height || 0) <= 1080
  });

  if (!format) {
    throw new Error('Formato compatível não encontrado');
  }

  // Download completo primeiro (necessário para cortar depois)
  const tempVideoPath = path.join(outputDir, `temp_${videoFilename}`);
  const videoStream = ytdl(youtubeUrl, { 
    format,
    highWaterMark: 1 << 25, // 32MB buffer para evitar muitas requisições
    requestOptions: {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      }
    }
  });
  const writeStream = fs.createWriteStream(tempVideoPath);
  await pipelineAsync(videoStream, writeStream);

  logger.info(`[Download] Vídeo completo baixado: ${tempVideoPath}`);

  // Se startTime e endTime foram fornecidos, cortar o vídeo
  if (startTime !== undefined && endTime !== undefined) {
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .setStartTime(startTime)
        .setDuration(actualDuration)
        .outputOptions(['-c:v libx264', '-preset fast', '-crf 23', '-c:a aac', '-b:a 128k'])
        .output(videoPath)
        .on('end', () => {
          logger.info(`[Download] Vídeo cortado: ${videoPath}`);
          // Deletar arquivo temporário
          if (fs.existsSync(tempVideoPath)) {
            fs.unlinkSync(tempVideoPath);
          }
          resolve();
        })
        .on('error', (err) => {
          logger.error(`[Download] Erro ao cortar vídeo:`, err);
          reject(err);
        })
        .run();
    });
  } else {
    // Se não há corte, apenas renomear
    fs.renameSync(tempVideoPath, videoPath);
    logger.info(`[Download] Vídeo salvo: ${videoPath}`);
  }

  // Extrair áudio
  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate('192k')
      .audioFrequency(44100)
      .audioChannels(2)
      .on('end', () => {
        logger.info(`[Download] Áudio extraído: ${audioPath}`);
        resolve();
      })
      .on('error', reject)
      .save(audioPath);
  });

  return { videoPath, audioPath, title: info.videoDetails.title, duration: actualDuration };
}

/**
 * Valida URL do YouTube
 */
export function isValidYouTubeUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
}

/**
 * Limpa arquivos temporários
 */
export async function cleanupFiles(filePaths: string[]): Promise<void> {
  for (const filePath of filePaths) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`[Cleanup] Deletado: ${filePath}`);
      }
    } catch (error: any) {
      logger.error(`[Cleanup] Erro ao deletar ${filePath}:`, error);
    }
  }
}

