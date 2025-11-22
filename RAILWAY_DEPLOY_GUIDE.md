# 🚂 Guia Completo de Deploy no Railway - EZ CLIP AI

## 🎯 Por Que Railway?

Railway é a **melhor escolha** para este projeto porque:

✅ **Suporta processos longos** - Sem timeout de 60s como Vercel  
✅ **FFmpeg pré-instalado** - Não precisa configurar  
✅ **Scaling automático** - Ajusta recursos conforme demanda  
✅ **MySQL incluído** - Banco de dados gerenciado  
✅ **Deploy automático** - Conecta com GitHub  
✅ **Preço justo** - $20-40/mês para este projeto  

---

## 📋 Pré-requisitos

Antes de começar, você precisa:

1. ✅ Conta no [Railway](https://railway.app) (gratuita para começar)
2. ✅ Conta no GitHub com repositório do projeto
3. ✅ Conta no [Stripe](https://stripe.com) para pagamentos
4. ✅ Credenciais das APIs sociais (TikTok, YouTube, Instagram, Facebook)

---

## 🚀 Passo a Passo Completo

### 1. Preparar Repositório GitHub

```bash
# 1. Inicializar repositório (se ainda não fez)
cd viral-clips-ai
git init
git add .
git commit -m "Initial commit"

# 2. Criar repositório no GitHub
# Vá em github.com/new e crie um repositório "ez-clip-ai"

# 3. Conectar e fazer push
git remote add origin https://github.com/SEU_USUARIO/ez-clip-ai.git
git branch -M main
git push -u origin main
```

### 2. Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Autorize Railway a acessar seu GitHub
5. Selecione o repositório **"ez-clip-ai"**
6. Railway detecta automaticamente que é um projeto Node.js

### 3. Adicionar Banco de Dados MySQL

1. No dashboard do projeto, clique em **"New"**
2. Selecione **"Database" → "MySQL"**
3. Railway cria automaticamente o banco
4. Copie a variável `DATABASE_URL` (será usada depois)

**Formato da URL:**
```
mysql://user:password@host:port/database
```

### 4. Configurar Variáveis de Ambiente

No Railway, vá em **"Variables"** e adicione:

#### Variáveis Obrigatórias

```env
# Node.js
NODE_VERSION=22
NODE_ENV=production

# Banco de Dados (Railway gera automaticamente)
DATABASE_URL=mysql://user:password@host:port/database

# Autenticação Manus (fornecido pela plataforma)
JWT_SECRET=seu_jwt_secret_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=seu_app_id_aqui
OWNER_OPEN_ID=seu_open_id_aqui
OWNER_NAME=Seu Nome

# APIs Manus (fornecido pela plataforma)
BUILT_IN_FORGE_API_KEY=sua_api_key_aqui
BUILT_IN_FORGE_API_URL=https://forge.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_frontend_key_aqui
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# S3 Storage (fornecido pela plataforma ou AWS)
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=ez-clip-ai

# Stripe (obtenha em stripe.com/dashboard)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App Config
VITE_APP_TITLE=EZ CLIP AI
VITE_APP_LOGO=/logo.png
PORT=3000
```

#### Variáveis Opcionais (APIs Sociais)

```env
# YouTube Data API v3 (console.cloud.google.com)
YOUTUBE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=seu_client_secret
YOUTUBE_REDIRECT_URI=https://seu-dominio.railway.app/api/oauth/youtube

# TikTok API (developers.tiktok.com)
TIKTOK_CLIENT_KEY=seu_client_key
TIKTOK_CLIENT_SECRET=seu_client_secret
TIKTOK_REDIRECT_URI=https://seu-dominio.railway.app/api/oauth/tiktok

# Instagram Graph API (developers.facebook.com)
INSTAGRAM_APP_ID=seu_app_id
INSTAGRAM_APP_SECRET=seu_app_secret
INSTAGRAM_REDIRECT_URI=https://seu-dominio.railway.app/api/oauth/instagram

# Facebook Graph API (developers.facebook.com)
FACEBOOK_APP_ID=seu_app_id
FACEBOOK_APP_SECRET=seu_app_secret
FACEBOOK_REDIRECT_URI=https://seu-dominio.railway.app/api/oauth/facebook
```

### 5. Configurar Build e Start Commands

Railway detecta automaticamente, mas você pode customizar em **"Settings"**:

```json
{
  "build": "pnpm install && pnpm build",
  "start": "pnpm start"
}
```

### 6. Deploy Automático

1. Railway faz deploy automaticamente após conectar GitHub
2. Acompanhe logs em tempo real no dashboard
3. Primeiro deploy leva ~5-10 minutos

**Logs importantes:**
```
[13:45:06] Installing dependencies...
[13:46:30] Building application...
[13:47:15] Starting server on port 3000...
[13:47:16] ✓ Server running on http://0.0.0.0:3000
```

### 7. Configurar Domínio Customizado (Opcional)

#### Opção A: Usar Domínio Railway (Gratuito)
Railway fornece automaticamente: `seu-projeto.up.railway.app`

#### Opção B: Domínio Próprio
1. Vá em **"Settings" → "Domains"**
2. Clique em **"Custom Domain"**
3. Digite seu domínio: `viralclipsai.com`
4. Railway fornece registros DNS:
   ```
   Type: CNAME
   Name: @
   Value: seu-projeto.up.railway.app
   ```
5. Adicione no seu provedor de DNS (GoDaddy, Cloudflare, etc.)
6. Aguarde propagação (5-30min)

### 8. Configurar Webhook do Stripe

1. Acesse [stripe.com/dashboard/webhooks](https://dashboard.stripe.com/webhooks)
2. Clique em **"Add endpoint"**
3. URL: `https://seu-dominio.railway.app/api/stripe/webhook`
4. Eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie **Signing Secret** e adicione em `STRIPE_WEBHOOK_SECRET`

### 9. Configurar OAuth das APIs Sociais

#### YouTube Data API v3

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie novo projeto: "EZ CLIP AI"
3. Ative **YouTube Data API v3**
4. Vá em **"Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"**
5. Tipo: **Web application**
6. Authorized redirect URIs:
   ```
   https://seu-dominio.railway.app/api/oauth/youtube/callback
   ```
7. Copie **Client ID** e **Client Secret**

#### TikTok API

1. Acesse [developers.tiktok.com](https://developers.tiktok.com)
2. Crie novo app: "EZ CLIP AI"
3. Adicione **Video Upload** scope
4. Redirect URI:
   ```
   https://seu-dominio.railway.app/api/oauth/tiktok/callback
   ```
5. Copie **Client Key** e **Client Secret**

#### Instagram Graph API

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie novo app: "EZ CLIP AI"
3. Adicione produto **Instagram Basic Display**
4. Redirect URI:
   ```
   https://seu-dominio.railway.app/api/oauth/instagram/callback
   ```
5. Copie **App ID** e **App Secret**

#### Facebook Graph API

1. Use o mesmo app do Instagram
2. Adicione produto **Facebook Login**
3. Redirect URI:
   ```
   https://seu-dominio.railway.app/api/oauth/facebook/callback
   ```

### 10. Aplicar Migrations do Banco de Dados

```bash
# Conectar via Railway CLI (opcional)
railway login
railway link

# Ou rodar migrations via código
# Railway executa automaticamente ao detectar Drizzle
```

**Migrations são aplicadas automaticamente no primeiro deploy.**

### 11. Popular Banco com Dados Iniciais

```bash
# Criar script de seed
# server/seedData.ts

import { db } from './db';
import { retentionVideos } from '../drizzle/schema';

async function seed() {
  // Popular vídeos de retenção de exemplo
  await db.insert(retentionVideos).values([
    {
      userId: 1,
      nicho: 'Podcasts',
      s3Url: 'https://exemplo.com/video1.mp4',
      s3Key: 'retention/video1.mp4',
      duration: 60,
      isActive: true
    },
    // ... mais vídeos
  ]);
  
  console.log('✅ Seed completed');
}

seed();
```

```bash
# Rodar seed via Railway CLI
railway run node server/seedData.ts
```

---

## 📊 Monitoramento e Logs

### Ver Logs em Tempo Real

1. No dashboard Railway, clique no serviço
2. Vá em **"Logs"**
3. Filtre por:
   - **All** - Todos os logs
   - **Error** - Apenas erros
   - **Build** - Logs de build

### Métricas Importantes

Railway fornece automaticamente:
- **CPU Usage** - Uso de processador
- **Memory Usage** - Uso de RAM
- **Network** - Tráfego de rede
- **Disk** - Uso de disco

**Alertas recomendados:**
- CPU > 80% por 5min
- Memory > 90% por 5min
- Disk > 85%

---

## 💰 Custos Estimados

### Plano Hobby ($5/mês)
- **Recursos**: 512MB RAM, 1 vCPU
- **Uso**: ~100 horas/mês
- **Adequado para**: Testes iniciais
- **Limitação**: Pode ser insuficiente para processamento pesado

### Plano Pro ($20/mês)
- **Recursos**: 8GB RAM, 8 vCPUs compartilhados
- **Uso**: Ilimitado
- **Adequado para**: Produção inicial (até 100 usuários)
- **Recomendado**: ✅ SIM

### Custos Adicionais
- **Banco MySQL**: $5-10/mês (1GB storage)
- **Tráfego**: $0.10/GB (após 100GB grátis)
- **Total estimado**: $25-40/mês

### Otimização de Custos

1. **Limpar arquivos temporários** após processamento
2. **Usar S3 para storage** (não disco Railway)
3. **Implementar cache** para reduzir processamento
4. **Monitorar uso** e ajustar recursos

---

## 🔧 Troubleshooting

### Erro: "Cannot find module 'ffmpeg'"

**Solução:** FFmpeg já está instalado no Railway. Certifique-se de usar `fluent-ffmpeg`:

```bash
pnpm add fluent-ffmpeg @types/fluent-ffmpeg
```

### Erro: "Database connection failed"

**Solução:** Verifique `DATABASE_URL` nas variáveis de ambiente:

```bash
# Testar conexão
railway run node -e "require('./server/db').getDb().then(() => console.log('✅ Connected'))"
```

### Erro: "Out of memory"

**Solução:** Processar vídeos em chunks menores ou aumentar plano:

```typescript
// Limitar processamento simultâneo
const MAX_CONCURRENT_JOBS = 2;
```

### Erro: "YouTube download failed"

**Solução:** Verificar se `@distube/ytdl-core` está atualizado:

```bash
pnpm update @distube/ytdl-core
```

### Deploy Lento (>10min)

**Solução:** Usar cache de dependências:

```json
// package.json
{
  "engines": {
    "node": "22.x",
    "pnpm": "9.x"
  }
}
```

---

## 🚀 Otimizações de Performance

### 1. Habilitar Caching

```typescript
// server/_core/index.ts
import compression from 'compression';

app.use(compression());
```

### 2. Usar Worker Threads para Processamento

```typescript
// server/workers/videoWorker.ts
import { Worker } from 'worker_threads';

function processVideoInWorker(jobId: number) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./videoProcessor.js', {
      workerData: { jobId }
    });
    
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}
```

### 3. Implementar Fila de Jobs

```bash
pnpm add bull
```

```typescript
// server/queue.ts
import Queue from 'bull';

export const videoQueue = new Queue('video-processing', {
  redis: process.env.REDIS_URL
});

videoQueue.process(async (job) => {
  await processVideo(job.data.jobId);
});
```

### 4. Adicionar Redis para Cache (Opcional)

1. No Railway, clique em **"New" → "Database" → "Redis"**
2. Copie `REDIS_URL`
3. Usar para cache de transcrições, thumbnails, etc.

---

## 📈 Scaling Horizontal

Quando o projeto crescer (>500 usuários):

### 1. Separar Serviços

```
ez-clip-ai/
├── web-service/        # Frontend + API (Railway)
├── worker-service/     # Processamento de vídeo (Railway)
└── database/           # MySQL (Railway)
```

### 2. Load Balancer

Railway fornece automaticamente para múltiplas instâncias.

### 3. CDN para Assets

Usar Cloudflare ou AWS CloudFront para servir vídeos processados.

---

## 🔐 Segurança

### 1. Habilitar HTTPS

Railway fornece HTTPS automaticamente para todos os domínios.

### 2. Configurar CORS

```typescript
// server/_core/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 3. Rate Limiting

```bash
pnpm add express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests
});

app.use('/api/', limiter);
```

### 4. Sanitizar Inputs

```bash
pnpm add validator
```

```typescript
import validator from 'validator';

if (!validator.isURL(youtubeUrl)) {
  throw new Error('URL inválida');
}
```

---

## 📞 Suporte e Recursos

### Railway
- **Documentação**: https://docs.railway.app
- **Discord**: https://discord.gg/railway
- **Status**: https://status.railway.app

### Comunidade
- **GitHub Issues**: Reporte bugs
- **Discord EZ CLIP AI**: Suporte da comunidade

---

## ✅ Checklist Final

Antes de lançar em produção:

- [ ] Deploy funcionando no Railway
- [ ] Banco de dados conectado e migrations aplicadas
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio customizado configurado (opcional)
- [ ] Webhook Stripe configurado
- [ ] OAuth APIs sociais configurado
- [ ] Teste de processamento de vídeo completo
- [ ] Teste de upload de vídeo de retenção
- [ ] Teste de sistema de créditos
- [ ] Teste de publicação automática
- [ ] Monitoramento e alertas configurados
- [ ] Backup do banco de dados configurado
- [ ] Termos de Uso e Política de Privacidade publicados
- [ ] Landing page otimizada para conversão

---

## 🎉 Próximos Passos

Após deploy bem-sucedido:

1. **Testar fluxo completo** end-to-end
2. **Convidar 10 beta testers** (3 meses grátis)
3. **Coletar feedback** e iterar
4. **Criar 3 case studies** com dados reais
5. **Lançar marketing** (anúncios, parcerias)
6. **Escalar** conforme demanda

**Boa sorte com o lançamento! 🚀**
