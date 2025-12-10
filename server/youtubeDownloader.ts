import ytdl from '@distube/ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { logger } from './lib/logger';

// Cache simples de info do vídeo (evita múltiplas chamadas getInfo)
const videoInfoCache = new Map<string, { info: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

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

  // OTIMIZAÇÃO: Cache de info do vídeo (evita chamadas repetidas)
  const cacheKey = youtubeUrl;
  const cached = videoInfoCache.get(cacheKey);
  let info;
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    logger.info(`[Download] Usando cache de informações do vídeo`);
    info = cached.info;
  } else {
    logger.info(`[Download] Obtendo informações do vídeo: ${youtubeUrl}`);
    info = await ytdl.getInfo(youtubeUrl, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
        },
      }
    });
    // Armazenar no cache
    videoInfoCache.set(cacheKey, { info, timestamp: Date.now() });
    // Limpar cache antigo (manter apenas últimos 50)
    if (videoInfoCache.size > 50) {
      const oldest = Array.from(videoInfoCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      videoInfoCache.delete(oldest[0]);
    }
  }
  
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

      // OTIMIZAÇÃO CRÍTICA: QUALIDADE MÍNIMA para velocidade máxima (360p-480p)
      // Priorizar menor qualidade = download muito mais rápido
      let format = ytdl.chooseFormat(info.formats, {
        quality: 'lowestvideo', // MUDANÇA: lowest ao invés de highest
        filter: (f: any) => 
          f.container === 'mp4' && 
          f.hasVideo && 
          f.hasAudio && 
          (f.height || 0) <= 480 && // 480p máximo
          (f.height || 0) >= 240 && // Aceitar até 240p se necessário
          !f.isLive
      });

      // Fallback: 360p se não encontrar 480p
      if (!format) {
        format = ytdl.chooseFormat(info.formats, {
          quality: 'lowestvideo',
          filter: (f: any) => 
            f.container === 'mp4' && 
            f.hasVideo && 
            f.hasAudio && 
            (f.height || 0) <= 360
        });
      }

      // Último fallback: Qualquer formato baixo com vídeo+áudio
      if (!format) {
        format = ytdl.chooseFormat(info.formats, {
          quality: 'lowestvideo',
          filter: (f: any) => f.container === 'mp4' && f.hasVideo && f.hasAudio && (f.height || 0) <= 720
        });
      }

      if (!format) {
        throw new Error('Formato compatível não encontrado');
      }

  // OTIMIZAÇÃO: Download direto com buffer otimizado
  const tempVideoPath = path.join(outputDir, `temp_${videoFilename}`);
  const videoStream = ytdl(youtubeUrl, { 
    format,
    quality: 'lowest', // Forçar menor qualidade
    highWaterMark: 1024 * 1024 * 8, // 8MB buffer (reduzido para menos overhead)
    requestOptions: {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Connection': 'keep-alive',
      },
    }
  });
  const writeStream = fs.createWriteStream(tempVideoPath, {
    highWaterMark: 1024 * 1024 * 8, // 8MB write buffer
  });
  logger.info(`[Download] Formato: ${format.height}p, iniciando download...`);
  await pipelineAsync(videoStream, writeStream);

  logger.info(`[Download] Vídeo completo baixado: ${tempVideoPath}`);

  // OTIMIZAÇÃO CRÍTICA: Corte ultra-rápido (qualidade mínima aceitável)
  if (startTime !== undefined && endTime !== undefined) {
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .setStartTime(startTime)
        .setDuration(actualDuration)
        .outputOptions([
          '-c:v libx264',
          '-preset ultrafast',
          '-crf 30', // CRÍTICO: Qualidade mínima (era 28) = muito mais rápido
          '-tune fastdecode',
          '-movflags +faststart',
          '-c:a aac',
          '-b:a 64k', // CRÍTICO: Bitrate mínimo (era 96k) = muito mais rápido
          '-ac 2',
          '-ar 44100',
          '-threads 0',
          '-avoid_negative_ts make_zero',
        ])
        .output(videoPath)
        .on('start', () => {
          logger.info(`[Download] Cortando vídeo (${startTime}s-${endTime}s)...`);
        })
        .on('end', () => {
          logger.info(`[Download] Vídeo cortado: ${videoPath}`);
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
    fs.renameSync(tempVideoPath, videoPath);
    logger.info(`[Download] Vídeo salvo: ${videoPath}`);
  }

  // OTIMIZAÇÃO CRÍTICA: Extração de áudio ultra-rápida (paralelo se possível)
  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate('64k') // CRÍTICO: Bitrate mínimo aceitável (era 128k) = muito mais rápido
      .audioFrequency(44100)
      .audioChannels(2)
      .outputOptions([
        '-q:a 6', // Qualidade média (era 4) - tradeoff velocidade/qualidade
        '-preset fast', // Preset rápido para MP3
      ])
      .on('start', () => {
        logger.info(`[Download] Extraindo áudio...`);
      })
      .on('end', () => {
        logger.info(`[Download] Áudio extraído: ${audioPath}`);
        resolve();
      })
      .on('error', (err) => {
        logger.error(`[Download] Erro ao extrair áudio:`, err);
        reject(err);
      })
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

