# 🚀 Railway - Gentle Fulfillment - Configuração Automatizada

## ✅ Tudo Configurado e Pronto!

Este projeto está **100% configurado** para deploy automático no Railway usando **Config as Code** e scripts automatizados.

---

## 📁 Arquivos de Configuração Criados

### 1. `railway.toml` - Config as Code
Configuração completa do Railway em código:
- ✅ Build command: `npm install && npm run build`
- ✅ Start command: `npm start`
- ✅ Healthcheck configurado
- ✅ Porta padrão: 3001
- ✅ Restart policy configurada

### 2. Scripts Automatizados

**`deploy-railway-automatico.sh`** - Deploy totalmente automático
- Verifica e instala Railway CLI
- Faz login automaticamente
- Linka projeto
- Configura todas variáveis
- Aplica migrations
- Faz deploy

**`configurar-railway-completo.sh`** - Configuração interativa completa
- Cria/linka projeto
- Configura MySQL e Redis
- Configura domínio
- Configura variáveis opcionais
- Aplica migrations

---

## 🚀 Como Usar

### Opção 1: Deploy Totalmente Automático (Recomendado)

```bash
./deploy-railway-automatico.sh
```

Este script faz **TUDO** automaticamente:
- ✅ Login no Railway
- ✅ Linka projeto
- ✅ Configura variáveis
- ✅ Aplica migrations
- ✅ Faz deploy

### Opção 2: Configuração Interativa Completa

```bash
./configurar-railway-completo.sh
```

Este script te guia passo a passo:
- ✅ Cria/linka projeto
- ✅ Configura MySQL e Redis
- ✅ Configura domínio
- ✅ Configura variáveis opcionais
- ✅ Aplica migrations
- ✅ Faz deploy

### Opção 3: Manual com Railway CLI

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Criar ou linkar projeto
railway init  # ou railway link

# 4. Configurar variáveis
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET=seu_secret_aqui

# 5. Criar MySQL e Redis no Dashboard
# Depois obter URLs:
railway variables --service mysql  # Copiar DATABASE_URL
railway variables --service redis  # Copiar REDIS_URL

# 6. Configurar URLs
railway variables set DATABASE_URL=mysql://...
railway variables set REDIS_URL=redis://...

# 7. Aplicar migrations
railway connect mysql
npm run db:push

# 8. Deploy
railway up
```

---

## 📋 Variáveis de Ambiente Necessárias

### Obrigatórias (Configuradas Automaticamente)

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=
DATABASE_URL=mysql://... (do MySQL do Railway)
REDIS_URL=redis://... (do Redis do Railway)
FRONTEND_URL=https://seu-projeto.railway.app
```

### Opcionais (Configurar Conforme Necessário)

```env
# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
USE_AI_SEGMENTATION=true
AI_PROVIDER=openai

# Storage (S3 / Cloudflare R2)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=...
AWS_S3_ENDPOINT=https://...

# Manus Forge (Whisper)
BUILT_IN_FORGE_API_KEY=...
BUILT_IN_FORGE_API_URL=https://api.manus.im

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OAuth (Opcional)
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
INSTAGRAM_CLIENT_ID=...
INSTAGRAM_CLIENT_SECRET=...
```

---

## 🗄️ Configuração de Banco de Dados

### 1. Criar MySQL no Railway

1. Railway Dashboard → **"+ New"** → **"Database"** → **"Add MySQL"**
2. Aguarde MySQL ser criado
3. MySQL → **Variables** → Copiar `DATABASE_URL`
4. Serviço principal → **Variables** → Adicionar `DATABASE_URL`

### 2. Criar Redis no Railway

1. Railway Dashboard → **"+ New"** → **"Database"** → **"Add Redis"**
2. Aguarde Redis ser criado
3. Redis → **Variables** → Copiar `REDIS_URL`
4. Serviço principal → **Variables** → Adicionar `REDIS_URL`

### 3. Aplicar Migrations

**Opção A: Via Script Automático**
```bash
./deploy-railway-automatico.sh
```

**Opção B: Via CLI**
```bash
railway connect mysql
npm run db:push
```

**Opção C: Via Dashboard**
- Railway → MySQL → **"Data"** → Execute SQL necessário

---

## 🌐 Configuração de Domínio

1. Railway Dashboard → Settings → **Domains**
2. Clique em **"Generate Domain"**
3. Anote a URL gerada (ex: `https://seu-projeto.railway.app`)
4. Configure `FRONTEND_URL`:
   ```bash
   railway variables set FRONTEND_URL=https://seu-projeto.railway.app
   ```

---

## ✅ Checklist de Deploy

Antes de considerar o deploy completo:

- [ ] Railway CLI instalado (`npm i -g @railway/cli`)
- [ ] Logado no Railway (`railway login`)
- [ ] Projeto criado/linkado no Railway
- [ ] `railway.toml` presente no projeto ✅
- [ ] Variáveis básicas configuradas (NODE_ENV, PORT, JWT_SECRET)
- [ ] MySQL criado e `DATABASE_URL` configurado
- [ ] Redis criado e `REDIS_URL` configurado
- [ ] Migrations aplicadas
- [ ] Domínio gerado e `FRONTEND_URL` configurado
- [ ] Variáveis opcionais configuradas (se necessário)
- [ ] Build completou com sucesso
- [ ] Site acessível na URL do Railway
- [ ] Health check respondendo (`/health`)

---

## 🔧 Comandos Úteis

### Ver Status
```bash
railway status
```

### Ver Logs
```bash
railway logs
railway logs --follow  # Seguir logs em tempo real
```

### Ver Variáveis
```bash
railway variables
railway variables get NOME_VARIAVEL
```

### Conectar ao MySQL
```bash
railway connect mysql
```

### Fazer Redeploy
```bash
railway up
```

### Ver Domínio
```bash
railway domain
```

---

## 🐛 Troubleshooting

### Erro: "Build failed"
**Solução:**
- Verifique logs: `railway logs`
- Certifique-se que `package.json` tem scripts `build` e `start`
- Verifique Node version (deve ser 20)

### Erro: "Database connection failed"
**Solução:**
- Verifique se `DATABASE_URL` está correto
- Certifique-se que MySQL está rodando
- Verifique se migrations foram aplicadas

### Erro: "Port already in use"
**Solução:**
- Railway usa variável `PORT` automaticamente
- Não precisa definir porta manualmente
- Verifique se `PORT=3001` está nas variáveis

### Erro: "Module not found"
**Solução:**
- Verifique se `package.json` tem todas dependências
- Execute `npm install` localmente para testar
- Verifique se `node_modules` não está no `.gitignore`

---

## 📚 Documentação Relacionada

- `CRIAR_NOVO_PROJETO_GITHUB_RAILWAY.md` - Criar novo projeto
- `ENV_VARIABLES.md` - Lista completa de variáveis
- `DEPLOY_RAILWAY_COMPLETO.md` - Deploy detalhado
- `COMANDOS_CRIAR_NOVO_PROJETO.md` - Comandos rápidos

---

## 💡 Dicas Importantes

1. ✅ **Config as Code** - `railway.toml` garante configuração consistente
2. ✅ **Auto-deploy** - A cada push para `main`, Railway faz deploy automaticamente
3. ✅ **Healthcheck** - Configurado em `/health` para monitoramento
4. ✅ **Lazy initialization** - Banco de dados conecta apenas quando necessário
5. ✅ **Scripts automatizados** - Tudo pode ser feito com um comando

---

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Configurar domínio customizado (opcional)
2. ✅ Configurar webhooks (Stripe, etc.)
3. ✅ Configurar monitoramento e alertas
4. ✅ Configurar backups do banco de dados
5. ✅ Otimizar performance e custos

---

**Status:** ✅ **100% Pronto para Deploy Automático**

**Última atualização:** $(date)

**Documentação Railway:** https://docs.railway.app 🚀
