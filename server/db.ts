import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema';

let dbInstance: ReturnType<typeof drizzle> | null = null;
let connectionPool: mysql.Pool | null = null;

/**
 * Obtém pool de conexões MySQL (reutilizável e eficiente)
 */
function getConnectionPool(): mysql.Pool {
  if (connectionPool) return connectionPool;

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL não está configurada');
  }

  console.log('[DB] 🔌 Criando pool de conexões MySQL...');
  
  // Parse da URL para extrair configurações
  const url = new URL(databaseUrl.replace(/^mysql:\/\//, 'http://'));
  const host = url.hostname;
  const port = parseInt(url.port || '3306');
  const user = url.username;
  const password = url.password;
  const database = url.pathname.replace(/^\//, '');

  connectionPool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10, // Máximo de conexões no pool
    queueLimit: 0, // Sem limite de fila
    connectTimeout: 10000, // 10 segundos para conectar
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  // Event handlers para monitoramento
  connectionPool.on('connection', () => {
    console.log('[DB] ✅ Nova conexão estabelecida no pool');
  });

  // Tratar erros do pool
  (connectionPool as any).on('error', (err: Error) => {
    console.error('[DB] ❌ Erro no pool de conexões:', err);
  });

  console.log('[DB] ✅ Pool de conexões criado');
  return connectionPool;
}

/**
 * Obtém instância do banco de dados (Drizzle)
 */
export async function getDb() {
  if (dbInstance) return dbInstance;

  try {
    const startTime = Date.now();
    console.log('[DB] 🔌 Inicializando Drizzle com pool...');
    
    const pool = getConnectionPool();
    
    const duration = Date.now() - startTime;
    console.log('[DB] ✅ Drizzle inicializado:', `${duration}ms`);

    dbInstance = drizzle(pool, { schema, mode: 'default' });
    return dbInstance;
  } catch (error: any) {
    console.error('[DB] ❌ Erro ao inicializar Drizzle:', {
      error: error.message,
      code: error.code,
    });
    throw error;
  }
}

/**
 * Obtém uma conexão do pool para queries SQL diretas
 */
export async function getPoolConnection(): Promise<mysql.PoolConnection> {
  const pool = getConnectionPool();
  
  try {
    const startTime = Date.now();
    const connection = await pool.getConnection();
    const duration = Date.now() - startTime;
    
    if (duration > 1000) {
      console.warn(`[DB] ⚠️ Conexão do pool demorou ${duration}ms (pode indicar pool esgotado)`);
    }
    
    return connection;
  } catch (error: any) {
    console.error('[DB] ❌ Erro ao obter conexão do pool:', {
      error: error.message,
      code: error.code,
    });
    throw error;
  }
}

// Re-export schema para facilitar imports
export { schema };

// Helper functions para queries comuns
import { jobs, clips, retentionVideos } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';

export async function getJobById(jobId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, jobId))
    .limit(1);

  return result[0] || null;
}

export async function updateJobStatus(
  jobId: number,
  status: 'pending' | 'downloading' | 'transcribing' | 'cutting' | 'rendering' | 'completed' | 'failed',
  progress?: number,
  errorMessage?: string
) {
  const db = await getDb();
  if (!db) return;

  const updateData: any = {
    status,
    updatedAt: new Date(),
  };

  if (progress !== undefined) {
    updateData.progress = progress;
  }

  if (errorMessage !== undefined) {
    updateData.errorMessage = errorMessage || null;
  }

  await db
    .update(jobs)
    .set(updateData)
    .where(eq(jobs.id, jobId));
}

export async function createClip(data: {
  jobId: number;
  videoKey: string;
  videoUrl: string;
  startTime: number;
  endTime: number;
  partNumber: number;
  transcriptionText?: string;
  thumbnailKey?: string;
  thumbnailUrl?: string;
}) {
  const db = await getDb();
  if (!db) return;

  await db.insert(clips).values({
    jobId: data.jobId,
    clipNumber: data.partNumber,
    videoKey: data.videoKey,
    videoUrl: data.videoUrl,
    startTime: data.startTime,
    endTime: data.endTime,
    duration: data.endTime - data.startTime,
    transcriptionText: data.transcriptionText || null,
    thumbnailKey: data.thumbnailKey || null,
    thumbnailUrl: data.thumbnailUrl || null,
  });
}

export async function getRetentionVideosByVertical(vertical?: string) {
  const db = await getDb();
  if (!db) return [];

  if (vertical) {
    // Retornar vídeos da plataforma (userId IS NULL) ou vídeos do usuário
    return await db
      .select()
      .from(retentionVideos)
      .where(
        and(
          eq(retentionVideos.vertical, vertical),
          eq(retentionVideos.isActive, true)
        )
      );
  }

  // Retornar todos os vídeos ativos se não especificar vertical
  return await db
    .select()
    .from(retentionVideos)
    .where(eq(retentionVideos.isActive, true));
}

export async function createRetentionVideo(data: {
  userId: number;
  vertical: string;
  name: string;
  videoKey: string;
  videoUrl: string;
  duration: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db.insert(retentionVideos).values({
    userId: data.userId,
    vertical: data.vertical as any,
    name: data.name,
    videoKey: data.videoKey,
    videoUrl: data.videoUrl,
    duration: data.duration,
    isActive: true,
  });

  const videoId = Number(result[0].insertId);
  
  const [video] = await db
    .select()
    .from(retentionVideos)
    .where(eq(retentionVideos.id, videoId))
    .limit(1);

  return video;
}

export async function deleteRetentionVideoById(videoId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(retentionVideos)
    .set({ isActive: false })
    .where(eq(retentionVideos.id, Number(videoId)));
}

export async function getGenericEmojis() {
  const db = await getDb();
  if (!db) return [];

  const { genericEmojis } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');
  
  return await db
    .select()
    .from(genericEmojis)
    .where(eq(genericEmojis.isActive, true));
}

export async function getClipsByJobId(jobId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(clips)
    .where(eq(clips.jobId, jobId));
}

