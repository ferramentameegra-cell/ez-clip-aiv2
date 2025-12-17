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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// CRÍTICO: Garantir que PORT é sempre um número
const PORT: number = Number.parseInt(process.env.PORT || '3001', 10);
if (isNaN(PORT) || PORT <= 0) {
  throw new Error(`PORT inválido: ${process.env.PORT}`);
}

// ============================================
// INICIALIZAÇÃO DO POOL DE CONEXÕES (LAZY)
// ============================================
// Pool será criado apenas quando necessário (na primeira requisição)
// Isso garante que o servidor inicie imediatamente sem esperar banco
logger.info('[Server] 🔌 Pool de conexões será criado na primeira requisição (lazy initialization)');

// Middlewares - CORS configurado para aceitar localhost e Railway
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://ez-clip-ai-production.up.railway.app',
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
    // CRÍTICO: Timeout global de 35 segundos para evitar requisições pendentes
    const handlerPromise = fetchRequestHandler({
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
        console.error(`[tRPC] ❌ Erro em ${path}:`, error.message);
        
        if (error.message?.includes('timeout') || 
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ETIMEDOUT')) {
          logger.error('[tRPC] ⚠️ Erro de conexão com banco de dados');
        }
      },
    });
    
    // Timeout global para toda a requisição tRPC
    const timeoutPromise = new Promise<Response>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Timeout: Requisição tRPC excedeu 35 segundos'));
      }, 35000);
    });
    
    const response = await Promise.race([handlerPromise, timeoutPromise]);
    
    const duration = Date.now() - requestStartTime;
    logger.info(`[tRPC] 📤 ${response.status} (${duration}ms)`);
    console.log(`[tRPC] ✅ Resposta recebida: ${response.status} (${duration}ms)`);
    
    // CRÍTICO: Verificar se resposta já foi enviada
    if (res.headersSent) {
      console.warn('[tRPC] ⚠️ Resposta já foi enviada anteriormente');
      return;
    }
    
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
      nodeStream.on('error', (err) => {
        console.error('[tRPC] ❌ Erro no stream:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Erro ao processar resposta' });
        }
      });
      nodeStream.pipe(res);
    } else {
      res.end();
    }
    
    console.log(`[tRPC] ✅ Resposta HTTP enviada com sucesso`);
  } catch (error: any) {
    const duration = Date.now() - requestStartTime;
    logger.error(`[tRPC] ❌ Erro fatal após ${duration}ms:`, error);
    console.error(`[tRPC] ❌ Erro fatal:`, {
      error: error.message,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
    
    // CRÍTICO: Sempre retornar resposta HTTP, mesmo em erro
    if (!res.headersSent) {
      const httpStatus = (error as any).httpStatus || 500;
      res.status(httpStatus).json({ 
        error: {
          message: error.message || 'Erro interno do servidor',
          code: error.code || 'INTERNAL_SERVER_ERROR',
        }
      });
      console.log(`[tRPC] ✅ Resposta de erro HTTP enviada: ${httpStatus}`);
    } else {
      console.warn('[tRPC] ⚠️ Resposta já foi enviada, não é possível enviar erro');
    }
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
// CRÍTICO: Bind em 0.0.0.0 para aceitar conexões externas (Railway)
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Backend rodando em 0.0.0.0:${PORT}`);
  logger.info(`📡 tRPC endpoint: http://0.0.0.0:${PORT}/trpc`);
  logger.info(`❤️  Health check: http://0.0.0.0:${PORT}/health`);
  logger.info(`🔐 Webhook Stripe: http://0.0.0.0:${PORT}/api/webhooks/stripe`);
  logger.info(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📦 DATABASE_URL configurada: ${process.env.DATABASE_URL ? 'Sim' : 'NÃO'}`);
  logger.info(`🔑 JWT_SECRET configurado: ${process.env.JWT_SECRET ? 'Sim' : 'NÃO'}`);
  
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
