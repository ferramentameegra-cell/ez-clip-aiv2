# ✅ Projeto Criado no Railway - Configurar Agora!

## 🎉 Status Atual

✅ **Projeto criado no Railway!**
- Projeto ID: `55a522bc-0e9d-4868-956f-f6301042057a`
- Service ID: `af0e326e-bcd4-49ff-a716-ea74f6c33fef`

Agora vamos configurar tudo para o EZ Clips AI funcionar!

---

## 📋 Passo a Passo de Configuração

### 1️⃣ Configurar Variáveis de Ambiente

**Railway → Seu Projeto → Service → Variables → "New Variable"**

Adicione uma por uma:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=
```

**⚠️ IMPORTANTE:** `FRONTEND_URL` será configurado depois quando gerarmos o domínio.

---

### 2️⃣ Criar MySQL

1. No Railway, clique em **"+ New"** (no mesmo projeto)
2. Selecione **"Database"** → **"Add MySQL"**
3. Aguarde o MySQL ser criado (1-2 minutos)
4. Clique no MySQL criado → **Variables**
5. Copie o valor de `DATABASE_URL` (ex: `mysql://root:senha@host:port/database`)
6. Volte para o serviço principal → **Variables** → **New Variable**
7. Adicione:
   - **Key:** `DATABASE_URL`
   - **Value:** (cole o valor copiado)

---

### 3️⃣ Criar Redis (Opcional mas Recomendado)

1. No Railway, clique em **"+ New"** → **"Database"** → **"Add Redis"**
2. Aguarde o Redis ser criado
3. Clique no Redis criado → **Variables**
4. Copie o valor de `REDIS_URL`
5. Volte para o serviço principal → **Variables** → **New Variable**
6. Adicione:
   - **Key:** `REDIS_URL`
   - **Value:** (cole o valor copiado)

---

### 4️⃣ Gerar Domínio

1. No Railway, clique no seu serviço principal
2. Vá em **Settings** → **Domains**
3. Clique em **"Generate Domain"**
4. Aguarde o domínio ser gerado (ex: `https://ez-clip-aiv2-production.up.railway.app`)
5. **Anote a URL gerada**
6. Volte para **Variables** → **New Variable**
7. Adicione:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://seu-dominio.railway.app` (cole a URL gerada)

---

### 5️⃣ Aplicar Migrations no Banco de Dados

**Opção A: Via Railway Dashboard (Mais Fácil)**

1. Railway → MySQL → **"Data"** ou **"Query"**
2. Execute o SQL necessário
3. Veja `drizzle/schema.ts` para entender as tabelas necessárias

**Opção B: Via Railway CLI (Se tiver instalado)**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Linkar ao projeto (se ainda não linkou)
railway link

# Conectar ao MySQL
railway connect mysql

# Em outro terminal, aplicar migrations
cd /Users/josyasborba/Desktop/viral-clips-ai
npm run db:push
```

---

### 6️⃣ Verificar Deploy

1. Aguarde o build completar (veja em **Deployments** → **View Logs**)
2. Teste os endpoints:
   - Health: `https://seu-dominio.railway.app/health`
   - Frontend: `https://seu-dominio.railway.app`
   - API: `https://seu-dominio.railway.app/api`

---

## ✅ Checklist de Configuração

Antes de considerar tudo configurado:

- [ ] Variáveis básicas configuradas (NODE_ENV, PORT, JWT_SECRET)
- [ ] MySQL criado e DATABASE_URL configurado
- [ ] Redis criado e REDIS_URL configurado (opcional)
- [ ] Domínio gerado e FRONTEND_URL configurado
- [ ] Migrations aplicadas no banco
- [ ] Build completou com sucesso
- [ ] Health check respondendo (`/health`)
- [ ] Site acessível no domínio gerado

---

## 🔧 Variáveis Opcionais (Adicionar Depois)

Depois de configurar o básico, você pode adicionar:

```env
# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Storage (S3 / Cloudflare R2)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_S3_ENDPOINT=...

# Stripe (se usar pagamentos)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Outras APIs
BUILT_IN_FORGE_API_KEY=...
```

Veja `ENV_VARIABLES.md` para lista completa.

---

## 🐛 Troubleshooting

### Build Falhou
- Verifique logs: Railway → Deployments → View Logs
- Certifique-se que `package.json` tem scripts `build` e `start`
- Verifique Node version (deve ser 20)

### Database Connection Failed
- Verifique se `DATABASE_URL` está correto
- Certifique-se que MySQL está rodando
- Verifique se migrations foram aplicadas

### Site Não Carrega
- Verifique logs do Railway
- Teste o endpoint `/health`
- Certifique-se que `FRONTEND_URL` está configurado corretamente

---

## 🚀 Próximos Passos Após Configuração

1. ✅ Testar todas as funcionalidades
2. ✅ Configurar domínio customizado (opcional)
3. ✅ Configurar webhooks (Stripe, etc.)
4. ✅ Adicionar monitoramento
5. ✅ Configurar backups do banco

---

## 📚 Documentação Relacionada

- `ENV_VARIABLES.md` - Lista completa de variáveis
- `DEPLOY_RAILWAY_COMPLETO.md` - Guia completo de deploy
- `drizzle/schema.ts` - Estrutura do banco de dados

---

**Status:** ✅ **Pronto para configurar!**

**Comece pelo Passo 1: Configurar Variáveis de Ambiente** 🚀
