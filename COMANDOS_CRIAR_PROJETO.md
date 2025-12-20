# ⚡ Comandos Rápidos - Criar Projeto GitHub + Railway

## 🚀 Passo a Passo Rápido

### 1️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome: `seu-projeto`
3. **NÃO** marque nenhuma opção de inicialização
4. Clique em **"Create repository"**
5. **Anote a URL:** `https://github.com/SEU-USUARIO/seu-projeto.git`

---

### 2️⃣ Conectar Projeto Local

```bash
# Ir para pasta do projeto
cd /Users/josyasborba/Desktop/viral-clips-ai

# Se não for repositório Git ainda:
git init
git branch -M main

# Adicionar remote (SUBSTITUA pela sua URL)
git remote add origin https://github.com/SEU-USUARIO/seu-projeto.git

# OU usar SSH (recomendado):
git remote add origin git@github.com:SEU-USUARIO/seu-projeto.git

# Verificar
git remote -v

# Primeiro commit e push
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

### 3️⃣ Criar Projeto no Railway

1. Acesse: https://railway.app
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Autorize e selecione seu repositório
5. Clique em **"Deploy Now"**

---

### 4️⃣ Configurar Variáveis no Railway

No Railway → Seu Projeto → Variables → Adicionar:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=seu_secret_aleatorio_muito_longo_aqui_123456789
FRONTEND_URL=https://seu-projeto.railway.app
```

**Para DATABASE_URL e REDIS_URL:**
1. Railway → **"+ New"** → **"Database"** → **"Add MySQL"**
2. Railway → **"+ New"** → **"Database"** → **"Add Redis"**
3. Copie os valores de `DATABASE_URL` e `REDIS_URL` de cada serviço
4. Adicione nas variáveis do serviço principal

---

### 5️⃣ Aplicar Migrations

**Opção 1: Via Railway Dashboard**
- MySQL → **"Data"** → Execute SQL necessário

**Opção 2: Via CLI**
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Conectar MySQL e executar
railway connect mysql
# Depois execute: npm run db:push
```

---

### 6️⃣ Verificar Deploy

1. Railway → Settings → **"Generate Domain"**
2. Acesse: `https://seu-projeto.railway.app`
3. Teste: `https://seu-projeto.railway.app/health`

---

## ✅ Checklist Rápido

```bash
# 1. GitHub criado? ✅
# 2. Código no GitHub? (git push) ✅
# 3. Railway conectado ao GitHub? ✅
# 4. Variáveis configuradas? ✅
# 5. MySQL criado? ✅
# 6. Migrations aplicadas? ✅
# 7. Site funcionando? ✅
```

---

## 🔧 Comandos Úteis

### Ver logs do Railway
```bash
railway logs
```

### Conectar ao banco
```bash
railway connect mysql
```

### Ver variáveis
```bash
railway variables
```

### Fazer redeploy
```bash
railway up
```

---

## 📝 Notas Importantes

- ⚠️ **Primeiro deploy** pode levar 3-5 minutos
- ⚠️ **Migrations** devem ser aplicadas ANTES do primeiro deploy
- ⚠️ **JWT_SECRET** deve ser único e seguro (mínimo 32 caracteres)
- ⚠️ **Auto-deploy** está ativado por padrão (deploy automático a cada push)

---

**Documentação completa:** Veja `COMO_CRIAR_PROJETO_GITHUB_RAILWAY.md` 🚀

