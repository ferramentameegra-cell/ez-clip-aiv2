import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './_core/router';
import { Context } from './_core/trpc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || true, // Aceitar qualquer origem em desenvolvimento
  credentials: true,
}));

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
      console.error('[Auth] Erro ao verificar token:', error);
    }
  }

  // Se não houver token válido, retornar contexto vazio
  return {};
};

// Middleware para ler body como raw para tRPC
app.use('/trpc', express.raw({ type: 'application/json', limit: '50mb' }));

// Rota tRPC - usando fetchRequestHandler com conversão do Express request
app.use('/trpc', async (req, res) => {
  try {
    // Converter Express request para Fetch Request
    const protocol = req.protocol || 'http';
    const host = req.get('host') || `localhost:${PORT}`;
    
    // Quando usamos app.use('/trpc', ...), o Express remove '/trpc' do req.url
    // req.url será algo como '/userContent.listGenericEmojis' ou '/?batch=1&input=...'
    // Precisamos reconstruir a URL completa incluindo /trpc
    const reqUrl = req.url || '/';
    const queryString = reqUrl.includes('?') ? reqUrl.split('?')[1] : '';
    const pathname = reqUrl.includes('?') ? reqUrl.split('?')[0] : reqUrl;
    
    // Construir URL completa: protocol://host/trpc/path?query
    const fullPath = `/trpc${pathname}`;
    const url = queryString 
      ? `${protocol}://${host}${fullPath}?${queryString}`
      : `${protocol}://${host}${fullPath}`;
    
    // Criar headers
    const headers = new Headers();
    Object.keys(req.headers).forEach((key) => {
      const value = req.headers[key];
      if (value && key.toLowerCase() !== 'content-length') {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.set(key, value);
        }
      }
    });

    // Criar body - converter Buffer para string
    let body: string | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body) {
        if (Buffer.isBuffer(req.body)) {
          body = req.body.toString('utf-8');
        } else if (typeof req.body === 'string') {
          body = req.body;
        } else {
          body = JSON.stringify(req.body);
        }
      }
    }

    const fetchRequest = new Request(url, {
      method: req.method,
      headers,
      body,
    });

    const response = await fetchRequestHandler({
      endpoint: '/trpc',
      req: fetchRequest,
      router: appRouter,
      createContext: () => createContext(req),
      onError: ({ error, path }) => {
        console.error(`[tRPC] Erro em ${path}:`, error);
      },
    });
    
    const text = await response.text();
    res.status(response.status);
    response.headers.forEach((value, key) => {
      // Evitar conflitos com headers já definidos
      if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });
    res.send(text);
  } catch (error: any) {
    console.error('[tRPC] Erro ao processar request:', error);
    console.error('[tRPC] Stack:', error.stack);
    res.status(500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

// Middlewares para outras rotas (após tRPC)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servir arquivos estáticos do frontend (APÓS todas as rotas de API)
// Importante: deve vir ANTES do catch-all para não interceptar rotas de API
const distPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(distPath));

// Catch-all: servir index.html para rotas do frontend (SPA)
// Mas NÃO interceptar rotas de API (/trpc, /api, /health)
app.get('*', (req, res, next) => {
  // Se já foi tratado por uma rota anterior (API), não fazer nada
  if (req.path.startsWith('/trpc') || req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  
  // Servir index.html para todas as outras rotas (SPA)
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // Se arquivo não existe, pode ser que ainda não foi feito build
      console.warn(`[Static] Arquivo não encontrado: ${indexPath}`);
      res.status(404).json({ error: 'Frontend not built yet. Run npm run build first.' });
    }
  });
});

// Endpoint para obter informações do vídeo do YouTube
app.get('/api/youtube/info', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL do YouTube é obrigatória' });
    }

    const ytdl = (await import('@distube/ytdl-core')).default;
    const info = await ytdl.getInfo(url);
    
    const duration = parseInt(info.videoDetails.lengthSeconds);
    
    res.json({
      title: info.videoDetails.title,
      duration: duration,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url,
      author: info.videoDetails.author.name,
      viewCount: info.videoDetails.viewCount,
    });
  } catch (error: any) {
    console.error('[YouTube Info] Erro:', error);
    res.status(400).json({ error: error.message || 'Erro ao buscar informações do vídeo' });
  }
});

// Webhook do Stripe (deve vir ANTES do express.json())
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const StripeLib = (await import('stripe')).default;
  
  const stripeInstance = new StripeLib(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-11-17.clover',
  });

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).send('Webhook signature missing');
  }

  let event: any; // Stripe.Event

  try {
    event = stripeInstance.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('[Stripe] Erro ao verificar webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Processar evento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any; // Stripe.Checkout.Session
    
    if (session.payment_status === 'paid' && session.metadata) {
      const userId = parseInt(session.metadata.userId || '0');
      const creditsToAdd = parseInt(session.metadata.credits || '0');

      if (userId && creditsToAdd) {
        try {
          const { getDb } = await import('./db');
          const { users } = await import('../drizzle/schema');
          const { eq, sql } = await import('drizzle-orm');
          
          const db = await getDb();
          if (db) {
            await db
              .update(users)
              .set({
                credits: sql`credits + ${creditsToAdd}`,
              })
              .where(eq(users.id, userId));

            console.log(`[Stripe] Créditos adicionados: ${creditsToAdd} para usuário ${userId}`);
          }
        } catch (error: any) {
          console.error('[Stripe] Erro ao adicionar créditos:', error);
        }
      }
    }
  }

  res.json({ received: true });
});

// Iniciar scheduler para publicações agendadas
import { startScheduler } from './scheduler';
import './queue'; // Importar para inicializar a fila

startScheduler();

// Inicializar fila de processamento de vídeo
console.log('[Queue] Fila de processamento de vídeo inicializada');

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});
