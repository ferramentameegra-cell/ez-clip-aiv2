# 🚀 Deploy Completo no Railway - EZ Clips AI

## ✅ Método 1: Via Dashboard (Recomendado - Mais Fácil)

### Passo 1: Acessar Railway

1. **Acesse:** https://railway.app
2. **Faça login** (pode usar conta GitHub)

### Passo 2: Criar Novo Projeto

1. Clique em **"+ New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Se for a primeira vez, **autorize Railway** a acessar GitHub
4. **Selecione o repositório:** `ferramentameegra-cell/ez-clip-aiv2`
5. Clique em **"Deploy Now"**

O Railway vai detectar automaticamente:
- ✅ Node.js (detecta `package.json`)
- ✅ Build command: `npm install && npm run build`
- ✅ Start command: `npm start`

### Passo 3: Configurar Variáveis de Ambiente

**Railway → Seu Projeto → Service → Variables → "New Variable"**

Adicione uma por uma:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=
FRONTEND_URL=https://seu-projeto.railway.app
```

**⚠️ IMPORTANTE:** `FRONTEND_URL` será atualizado depois quando gerar o domínio.

### Passo 4: Criar MySQL

1. Railway → **"+ New"** → **"Database"** → **"Add MySQL"**
2. Aguarde MySQL ser criado (1-2 minutos)
3. MySQL → **Variables** → Copie o valor de `DATABASE_URL`
4. Volte para o serviço principal → **Variables** → **New Variable**
5. Adicione: `DATABASE_URL` = (cole o valor copiado)

### Passo 5: Criar Redis (Opcional mas Recomendado)

1. Railway → **"+ New"** → **"Database"** → **"Add Redis"**
2. Aguarde Redis ser criado
3. Redis → **Variables** → Copie o valor de `REDIS_URL`
4. Volte para o serviço principal → **Variables** → **New Variable**
5. Adicione: `REDIS_URL` = (cole o valor copiado)

### Passo 6: Gerar Domínio

1. Railway → **Settings** → **"Domains"**
2. Clique em **"Generate Domain"**
3. Anote a URL gerada (ex: `https://ez-clip-aiv2-production.up.railway.app`)
4. Volte para **Variables** → Atualize `FRONTEND_URL` com a URL gerada

### Passo 7: Aplicar Migrations

**Opção A: Via Railway Dashboard**

1. Railway → MySQL → **"Data"** ou **"Query"**
2. Execute o SQL necessário (veja `drizzle/schema.ts`)

**Opção B: Via Railway CLI** (se tiver instalado)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Conectar ao MySQL e aplicar migrations
railway connect mysql
npm run db:push
```

### Passo 8: Verificar Deploy

1. Aguarde o build completar (3-5 minutos)
2. Acompanhe em **Deployments** → **View Logs**
3. Teste a URL:
   - Health: `https://seu-projeto.railway.app/health`
   - Frontend: `https://seu-projeto.railway.app`

---

## ✅ Método 2: Via Railway CLI (Avançado)

### Pré-requisitos

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login
```

### Deploy

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai

# Criar/linkar projeto
railway init
# Ou
railway link

# Configurar variáveis
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=

# Criar MySQL e Redis no Dashboard primeiro
# Depois obter URLs:
# railway variables --service mysql  # Copiar DATABASE_URL
# railway variables --service redis  # Copiar REDIS_URL

# Configurar URLs
railway variables set DATABASE_URL=mysql://...
railway variables set REDIS_URL=redis://...

# Deploy
railway up

# Aplicar migrations
railway connect mysql
npm run db:push
```

---

## ✅ Checklist Completo

Antes de considerar o deploy completo:

- [ ] Repositório conectado ao Railway
- [ ] Build completou com sucesso
- [ ] Variáveis básicas configuradas (NODE_ENV, PORT, JWT_SECRET)
- [ ] MySQL criado e DATABASE_URL configurado
- [ ] Redis criado e REDIS_URL configurado (opcional)
- [ ] Migrations aplicadas
- [ ] Domínio gerado e FRONTEND_URL atualizado
- [ ] Site acessível na URL do Railway
- [ ] Health check respondendo (`/health`)
- [ ] Frontend carregando corretamente

---

## 🐛 Troubleshooting

### Erro: "Build failed"
**Solução:**
- Verifique logs: Railway → Deployments → View Logs
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
- Configure `PORT=3001` nas variáveis

---

## 📚 Arquivos de Configuração

- `railway.toml` - Config as Code (já configurado)
- `.env.local` - Token GitHub (não commitado)
- `package.json` - Scripts de build e start

---

## 🚀 Próximos Passos Após Deploy

1. ✅ Configurar domínio customizado (opcional)
2. ✅ Configurar webhooks (Stripe, etc.)
3. ✅ Configurar monitoramento
4. ✅ Configurar backups do banco
5. ✅ Adicionar variáveis de APIs (OpenAI, AWS S3, etc.)

---

**Status:** ✅ **Pronto para deploy!**

**Recomendado:** Use o Método 1 (Dashboard) - mais fácil e visual! 🚀
