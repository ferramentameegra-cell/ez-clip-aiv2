# ⚡ Comandos Rápidos - Criar Novo Projeto

## 🚀 Opção 1: Usar Script Automático (Recomendado)

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai
./criar-novo-projeto.sh
```

O script vai te guiar passo a passo! 🎯

---

## 🚀 Opção 2: Comandos Manuais

### 1️⃣ Criar Repositório no GitHub

1. Acesse: **https://github.com/new**
2. Nome: `seu-novo-projeto`
3. **NÃO** marque nenhuma opção
4. Clique em **"Create repository"**
5. **Anote a URL** do repositório

---

### 2️⃣ Conectar ao Novo Repositório

**Opção A: Adicionar novo remote (manter histórico)**

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai

# Adicionar novo remote (SUBSTITUA pela sua URL)
git remote add novo-origin https://github.com/SEU-USUARIO/seu-novo-projeto.git

# OU usar SSH (recomendado):
git remote add novo-origin git@github.com:SEU-USUARIO/seu-novo-projeto.git

# Verificar
git remote -v

# Fazer commit e push
git add .
git commit -m "Initial commit - novo projeto"
git push -u novo-origin main
```

**Opção B: Substituir remote atual (projeto novo)**

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai

# Remover remote atual
git remote remove origin

# Adicionar novo remote (SUBSTITUA pela sua URL)
git remote add origin https://github.com/SEU-USUARIO/seu-novo-projeto.git

# OU usar SSH:
git remote add origin git@github.com:SEU-USUARIO/seu-novo-projeto.git

# Verificar
git remote -v

# Fazer commit e push
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

### 3️⃣ Criar Projeto no Railway

1. Acesse: **https://railway.app**
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Autorize e selecione seu repositório
5. Clique em **"Deploy Now"**

---

### 4️⃣ Configurar Variáveis no Railway

No Railway → Seu Projeto → Variables → Adicionar:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=seu_secret_aleatorio_muito_longo_aqui_12345678901234567890
FRONTEND_URL=https://seu-projeto.railway.app
```

**Para DATABASE_URL:**
1. Railway → **"+ New"** → **"Database"** → **"Add MySQL"**
2. MySQL → **Variables** → Copiar `DATABASE_URL`
3. Serviço principal → **Variables** → Adicionar `DATABASE_URL`

**Para REDIS_URL (opcional):**
1. Railway → **"+ New"** → **"Database"** → **"Add Redis"**
2. Redis → **Variables** → Copiar `REDIS_URL`
3. Serviço principal → **Variables** → Adicionar `REDIS_URL`

---

### 5️⃣ Aplicar Migrations

**Opção A: Via Railway CLI**

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Conectar MySQL e executar migrations
railway connect mysql
# Em outro terminal:
npm run db:push
```

**Opção B: Via Railway Dashboard**
- MySQL → **"Data"** → Execute SQL necessário

---

### 6️⃣ Verificar Deploy

1. Railway → Settings → **"Generate Domain"**
2. Acesse: `https://seu-projeto.railway.app`
3. Teste: `https://seu-projeto.railway.app/health`

---

## ✅ Checklist Rápido

```bash
# 1. ✅ Repositório criado no GitHub?
# 2. ✅ Código enviado? (git push)
# 3. ✅ Projeto criado no Railway?
# 4. ✅ Variáveis configuradas?
# 5. ✅ MySQL criado?
# 6. ✅ Migrations aplicadas?
# 7. ✅ Site funcionando?
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
- ⚠️ **Migrations** devem ser aplicadas ANTES do primeiro deploy completo
- ⚠️ **JWT_SECRET** deve ser único e seguro (mínimo 32 caracteres)
- ⚠️ **Auto-deploy** está ativado por padrão (deploy automático a cada push)
- ⚠️ **Use SSH** para GitHub (mais seguro e prático)

---

## 🐛 Problemas Comuns

### Erro: "Authentication failed" (HTTPS)
**Solução:** Use Personal Access Token em vez de senha
- Criar: https://github.com/settings/tokens
- Permissões: `repo`

### Erro: "Permission denied" (SSH)
**Solução:** Configure chave SSH
- Guia: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Erro: "Repository not found"
**Solução:** Verifique se o repositório existe e você tem acesso

---

**Documentação completa:** Veja `CRIAR_NOVO_PROJETO_GITHUB_RAILWAY.md` 🚀
