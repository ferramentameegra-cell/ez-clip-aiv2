# 💻 Guia Completo: Mudar de Computador e Continuar Projeto EZ Clips AI

## 📋 O Que Você Precisa Fazer

---

## **ETAPA 1: Preparar no Computador ATUAL (Antes de Mudar)**

### 1.1. Garantir que Tudo Está Commitado no GitHub

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai

# Verificar status
git status

# Se houver mudanças não commitadas:
git add -A
git commit -m "Salvando estado antes de mudar de computador"

# Fazer push para GitHub
git push origin main
```

### 1.2. Anotar Informações Importantes

**Anote estas informações (vai precisar depois):**

1. **URL do Repositório GitHub:**
   ```
   https://github.com/ferramentameegra-cell/ez-clip-ai.git
   ```
   ✅ **Este é o repositório correto do seu projeto!**

2. **URL do Railway:**
   ```
   https://ez-clip-ai-production.up.railway.app
   ```

3. **Variáveis de Ambiente** (se você tiver um `.env` local):
   - Abra `ENV_VARIABLES.md` ou `VARIAVEIS_RAILWAY_COPIAR_COLAR.md`
   - Copie todas as variáveis importantes

### 1.3. Copiar Pasta para Drive

**Opção 1: Copiar pasta completa**
```bash
# Copiar para drive externo
cp -r /Users/danielmarczukbraun/Downloads/viral-clips-ai /Volumes/SEU_DRIVE/
```

**Opção 2: Usar GitHub (Recomendado)**
- ✅ Mais seguro
- ✅ Sincronizado
- ✅ Não precisa copiar `node_modules`

---

## **ETAPA 2: No NOVO Computador**

### 2.1. Instalar Dependências Básicas

#### **macOS:**
```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js 22+
brew install node@22

# Instalar Git
brew install git

# Instalar Railway CLI
brew install railway
```

#### **Windows:**
1. Baixar Node.js: https://nodejs.org (versão 22+)
2. Baixar Git: https://git-scm.com
3. Baixar Railway CLI: https://docs.railway.app/develop/cli

#### **Linux (Ubuntu/Debian):**
```bash
# Node.js 22+
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git
sudo apt-get install git

# Railway CLI
npm i -g @railway/cli
```

### 2.2. Configurar Git (Primeira Vez)

```bash
# Configurar nome e email
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

### 2.3. Clonar Repositório do GitHub

```bash
# Ir para pasta onde quer clonar (ex: ~/Projects ou ~/Downloads)
cd ~/Downloads  # ou onde preferir

# Clonar repositório
git clone https://github.com/ferramentameegra-cell/ez-clip-ai.git

# Entrar na pasta
cd ez-clip-ai
```

**OU se você copiou a pasta do drive:**

```bash
# Copiar pasta do drive para local
cp -r /Volumes/SEU_DRIVE/viral-clips-ai ~/Downloads/

# Entrar na pasta
cd ~/Downloads/viral-clips-ai

# Verificar se está conectado ao GitHub
git remote -v

# Se não estiver conectado:
git remote add origin https://github.com/ferramentameegra-cell/ez-clip-ai.git
```

### 2.4. Instalar Dependências do Projeto

```bash
# Instalar todas as dependências
npm install

# Isso vai instalar tudo que está no package.json
```

### 2.5. Configurar Variáveis de Ambiente

#### **Criar arquivo `.env` local:**

```bash
# Copiar exemplo (se existir)
cp .env.example .env

# OU criar novo
touch .env
```

#### **Adicionar variáveis no `.env`:**

```env
# Node.js
NODE_ENV=development
PORT=3000

# Frontend
FRONTEND_URL=http://localhost:3000

# Banco de Dados (Railway)
DATABASE_URL=mysql://root:senha@host:port/database

# Redis (Railway)
REDIS_URL=redis://default:senha@host:port

# Cloudflare R2
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=auto
AWS_S3_BUCKET=ez-clip-ai
AWS_S3_ENDPOINT=https://seu-endpoint.r2.cloudflarestorage.com

# OpenAI / Manus Forge
BUILT_IN_FORGE_API_KEY=sua_api_key
BUILT_IN_FORGE_API_URL=https://api.manus.im
OPENAI_API_KEY=sua_openai_key

# JWT
JWT_SECRET=seu_secret_aleatorio_aqui

# Stripe (se configurado)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Como obter as variáveis:**
- **DATABASE_URL e REDIS_URL:** Railway Dashboard → MySQL/Redis → Variables
- **R2:** Cloudflare Dashboard → R2 → Manage R2 API Tokens
- **Outras:** Mesmas do computador anterior

### 2.6. Conectar Railway CLI

```bash
# Fazer login no Railway
railway login

# Se precisar conectar ao projeto existente:
railway link

# Ou criar novo projeto:
railway init
```

### 2.7. Configurar Banco de Dados Local (Opcional - Para Testes)

**Se quiser testar localmente:**

```bash
# Instalar MySQL (macOS)
brew install mysql

# OU usar Docker
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=senha123 \
  -e MYSQL_DATABASE=viral_clips_ai \
  mysql:8.0

# Aplicar migrations
npm run db:push
```

---

## **ETAPA 3: Verificar se Tudo Está Funcionando**

### 3.1. Testar Build

```bash
# Build do frontend e backend
npm run build

# Deve compilar sem erros
```

### 3.2. Testar Localmente (Opcional)

```bash
# Iniciar desenvolvimento
npm run dev

# OU separado:
npm run dev:server  # Backend
npm run dev:client  # Frontend
```

### 3.3. Verificar Conexão com Railway

```bash
# Verificar status
railway status

# Ver variáveis
railway variables

# Ver logs
railway logs
```

---

## **ETAPA 4: Continuar Desenvolvendo**

### 4.1. Workflow Normal

```bash
# 1. Fazer mudanças no código
# 2. Testar localmente (opcional)
npm run dev

# 3. Commit e push
git add -A
git commit -m "Descrição das mudanças"
git push origin main

# 4. Railway faz deploy automático (se configurado)
# OU fazer deploy manual:
railway up
```

### 4.2. Sincronizar com GitHub

```bash
# Sempre que fizer mudanças:
git add -A
git commit -m "Sua mensagem"
git push origin main

# Quando chegar no computador:
git pull origin main
```

---

## **CHECKLIST RÁPIDO**

### ✅ Antes de Mudar de Computador:
- [ ] Commit e push tudo no GitHub
- [ ] Anotar URL do repositório GitHub
- [ ] Anotar URL do Railway
- [ ] Anotar variáveis de ambiente importantes
- [ ] Copiar pasta para drive (opcional)

### ✅ No Novo Computador:
- [ ] Instalar Node.js 22+
- [ ] Instalar Git
- [ ] Instalar Railway CLI
- [ ] Configurar Git (nome e email)
- [ ] Clonar repositório do GitHub
- [ ] Instalar dependências (`npm install`)
- [ ] Criar arquivo `.env` com variáveis
- [ ] Fazer login no Railway (`railway login`)
- [ ] Conectar ao projeto Railway (`railway link`)
- [ ] Testar build (`npm run build`)

---

## **PROBLEMAS COMUNS E SOLUÇÕES**

### ❌ "git: command not found"
**Solução:** Instalar Git (ver Etapa 2.1)

### ❌ "npm: command not found"
**Solução:** Instalar Node.js (ver Etapa 2.1)

### ❌ "railway: command not found"
**Solução:** Instalar Railway CLI (ver Etapa 2.1)

### ❌ "Error: Cannot find module"
**Solução:**
```bash
# Deletar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Error: Database connection failed"
**Solução:**
- Verificar `DATABASE_URL` no `.env`
- Verificar se Railway MySQL está ativo
- Tentar: `railway variables` para ver variáveis

### ❌ "Error: REDIS_URL not found"
**Solução:**
- Verificar `REDIS_URL` no `.env`
- Verificar se Railway Redis está ativo

### ❌ "Error: Port 3000 already in use"
**Solução:**
```bash
# Mudar porta no .env
PORT=3001

# OU matar processo na porta 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill
```

---

## **COMANDOS ÚTEIS**

### Git
```bash
git status              # Ver status
git add -A              # Adicionar tudo
git commit -m "msg"     # Commit
git push origin main    # Push para GitHub
git pull origin main    # Puxar do GitHub
git log                 # Ver histórico
```

### Railway
```bash
railway login           # Login
railway status          # Status do projeto
railway variables       # Ver variáveis
railway logs            # Ver logs
railway up              # Deploy manual
railway connect mysql   # Conectar ao MySQL
```

### NPM
```bash
npm install             # Instalar dependências
npm run build           # Build
npm run dev             # Dev mode
npm run dev:server      # Apenas backend
npm run dev:client      # Apenas frontend
npm run db:push         # Aplicar migrations
```

---

## **RECOMENDAÇÕES IMPORTANTES**

### ✅ **Use GitHub Como Fonte Principal**
- Sempre commite e faça push antes de mudar de computador
- GitHub é mais confiável que drive externo
- Sincronização automática

### ✅ **NÃO Copie `node_modules`**
- `node_modules` é muito pesado
- Sempre execute `npm install` no novo computador
- Git já ignora via `.gitignore`

### ✅ **Mantenha `.env` Seguro**
- `.env` NUNCA deve ir para GitHub
- Copie manualmente ou use Railway variables
- Use Railway para produção (mais seguro)

### ✅ **Use Railway Variables para Produção**
- Configure variáveis no Railway Dashboard
- Não use `.env` local para produção
- Railway já tem todas as variáveis configuradas

---

## **PRÓXIMOS PASSOS**

1. ✅ Seguir este guia passo a passo
2. ✅ Verificar se tudo funciona (`npm run build`)
3. ✅ Testar localmente (opcional)
4. ✅ Continuar desenvolvendo normalmente

---

## **SUPORTE**

Se tiver problemas:

1. Verifique os logs: `railway logs`
2. Verifique variáveis: `railway variables`
3. Verifique build local: `npm run build`
4. Verifique conexão: `railway status`

---

**Boa sorte no novo computador! 🚀**

