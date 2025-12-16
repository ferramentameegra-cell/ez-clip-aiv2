import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './_core/router';
import { Context } from './_core/trpc';
import { globalLimiter, authLimiter } from './middleware/rateLimit';
import { logger } from './lib/logger';
import { Readable } from 'stream';
import { getConnectionPool } from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// INICIALIZAÇÃO DO POOL DE CONEXÕES (LAZY)
// ============================================
// Pool será criado apenas quando necessário (na primeira requisição)
// Isso garante que o servidor inicie imediatamente sem esperar banco
logger.info('[Server] 🔌 Pool de conexões será criado na primeira requisição (lazy initialization)');

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || true, // Aceitar qualquer origem em desenvolvimento
  credentials: true,
}));

// ============================================
// ROTAS DE AUTENTICAÇÃO REST (ANTES DE TUDO)
// ============================================
// IMPORTANTE: Registrar ANTES de outros middlewares
// para garantir que a rota /auth/login seja acessível
app.use(express.json({ limit: '10mb' })); // JSON parser global
app.use('/auth', globalLimiter);

// Importar e usar rotas de auth
import authRoutes from './routes/auth';
app.use('/auth', authRoutes);

logger.info('[Server] ✅ Rotas de autenticação REST configuradas: POST /auth/login');

// Rate limiting global (depois de auth)
app.use('/api/', globalLimiter);
app.use('/trpc/', globalLimiter);

// Rate limiting para autenticação tRPC (legado)
app.use('/trpc/auth.login', authLimiter);
app.use('/trpc/auth.signup', authLimiter);

// Context do tRPC com autenticação
const createContext = async (req: express.Request): Promise<Context> => {
  // Obter token do header Authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const { verifyToken, getUserById } = await import('./auth');
      const decoded = verifyToken(token);
      
      if (decoded) {
        const user = await getUserById(decoded.userId);
        if (user) {
          return {
            user: {
              id: user.id,
              email: user.email || undefined,
            },
          };
        }
      }
    } catch (error) {
      // Token inválido, continuar sem usuário
      logger.error('[Auth] Erro ao verificar token:', error);
    }
  }

  // Se não houver token válido, retornar contexto vazio
  return {};
};

// Middleware para ler body como texto para tRPC (mais compatível)
app.use('/trpc', express.text({ type: 'application/json', limit: '50mb' }));

// Rota tRPC - versão simplificada e robusta
app.use('/trpc', async (req, res) => {
  const requestStartTime = Date.now();
  
  try {
    // Construir URL completa
    const protocol = req.protocol || (req.secure ? 'https' : 'http');
    const host = req.get('host') || `localhost:${PORT}`;
    const pathname = req.url || '/';
    const url = `${protocol}://${host}${pathname}`;
    
    // Criar headers
    const headers = new Headers();
    Object.keys(req.headers).forEach((key) => {
      const value = req.headers[key];
      if (value && key.toLowerCase() !== 'content-length') {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else if (typeof value === 'string') {
          headers.set(key, value);
        }
      }
    });

    // Body já vem como string do express.text()
    const body = req.method !== 'GET' && req.method !== 'HEAD' && req.body ? req.body : undefined;

    // Criar Fetch Request
    const fetchRequest = new Request(url, {
      method: req.method,
      headers,
      body,
    });

    logger.info(`[tRPC] 📥 ${req.method} ${pathname}`);
    
    // Processar com tRPC
    const response = await fetchRequestHandler({
      endpoint: '/trpc',
      req: fetchRequest,
      router: appRouter,
      createContext: () => createContext(req),
      onError: ({ error, path, type }) => {
        const duration = Date.now() - requestStartTime;
        const httpStatus = (error as any).httpStatus || 500;
        
        logger.error(`[tRPC] ❌ Erro em ${path} (${type}) após ${duration}ms:`, {
          message: error.message,
          code: error.code,
          httpStatus,
        });
        
        if (error.message?.includes('timeout') || 
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ETIMEDOUT')) {
          logger.error('[tRPC] ⚠️ Erro de conexão com banco de dados');
        }
      },
    });
    
    const duration = Date.now() - requestStartTime;
    logger.info(`[tRPC] 📤 ${response.status} (${duration}ms)`);
    
    // Copiar status e headers
    res.status(response.status);
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey !== 'content-encoding' && lowerKey !== 'transfer-encoding' && lowerKey !== 'content-length') {
        res.setHeader(key, value);
      }
    });
    
    // Fazer streaming do body de forma segura
    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as any);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error: any) {
    const duration = Date.now() - requestStartTime;
    logger.error(`[tRPC] ❌ Erro fatal após ${duration}ms:`, error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rotas de auth já foram registradas acima

// Middlewares para outras rotas (após tRPC)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check com verificação de banco
app.get('/health', async (_req, res) => {
  try {
    const { checkPoolHealth } = await import('./db');
    const dbHealth = await checkPoolHealth();
    
    res.json({ 
      status: dbHealth.healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      database: {
        healthy: dbHealth.healthy,
        message: dbHealth.message,
        responseTime: `${dbHealth.duration}ms`,
      },
    });
  } catch (error: any) {
    res.status(503).json({ 
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// Endpoint para obter informações do vídeo do YouTube (público, não requer autenticação)
app.get('/api/youtube/info', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL do YouTube é obrigatória' });
    }

    const ytdl = (await import('@distube/ytdl-core')).default;
    const info = await ytdl.getInfo(url);
    
    const duration = parseInt(info.videoDetails.lengthSeconds || '0');
    
    res.json({
      title: info.videoDetails.title,
      duration: duration,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url,
      author: info.videoDetails.author.name,
      viewCount: info.videoDetails.viewCount,
    });
  } catch (error: any) {
    logger.error('[YouTube Info] Erro:', error);
    res.status(400).json({ error: error.message || 'Erro ao buscar informações do vídeo' });
  }
});

// Webhook do Stripe (deve vir ANTES do express.json())
// IMPORTANTE: Express.raw() deve estar ANTES de qualquer outro middleware que processe JSON
import { stripeWebhookHandler } from './webhooks/stripe';
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json', limit: '1mb' }), stripeWebhookHandler);

// Servir arquivos estáticos do frontend (DEPOIS de todas as rotas de API)
const distPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(distPath));

// Catch-all: servir index.html para rotas do frontend (SPA)
// IMPORTANTE: Deve vir POR ÚLTIMO, depois de todas as rotas de API
// Express 5 não aceita '*', usar middleware sem caminho para catch-all
app.use((_req, res) => {
  // Se a requisição não foi tratada por nenhuma rota anterior (API)
  // e não é um arquivo estático, servir index.html (SPA routing)
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.warn(`[Static] Arquivo não encontrado: ${indexPath}`);
      res.status(404).json({ error: 'Frontend not built yet. Run npm run build first.' });
    }
  });
});

// Iniciar servidor IMEDIATAMENTE (sem esperar nada)
app.listen(PORT, () => {
  logger.info(`🚀 Backend rodando em http://localhost:${PORT}`);
  logger.info(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
  logger.info(`❤️  Health check: http://localhost:${PORT}/health`);
  logger.info(`🔐 Webhook Stripe: http://localhost:${PORT}/api/webhooks/stripe`);
  
  // Inicializar serviços APÓS o servidor estar rodando (não bloqueia startup)
  setTimeout(() => {
    try {
      import('./lib/jobQueue').then(() => {
        logger.info('[Queue] Fila de processamento de vídeo inicializada');
      }).catch((err) => {
        logger.warn('[Queue] Erro ao inicializar fila (não crítico):', err.message);
      });
      
      import('./scheduler').then(({ startScheduler }) => {
        startScheduler();
      }).catch((err) => {
        logger.warn('[Scheduler] Erro ao inicializar scheduler (não crítico):', err.message);
      });
    } catch (error: any) {
      logger.warn('[Server] Erro ao inicializar serviços (não crítico):', error.message);
    }
  }, 1000); // Inicializar após 1 segundo
});
