# 🚀 Como Rodar o Projeto Localmente

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

1. **Node.js 22+** - [Download aqui](https://nodejs.org/)
2. **MySQL** - Banco de dados
3. **Redis** (opcional, mas recomendado) - Para fila de jobs
4. **FFmpeg** - Para processamento de vídeo

---

## 🔧 Passo 1: Instalar Dependências

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
npm install
```

---

## 🗄️ Passo 2: Configurar MySQL

### Opção A: Usando Homebrew (Recomendado para macOS)

```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar MySQL
brew install mysql

# Iniciar MySQL
brew services start mysql

# Criar banco de dados
mysql -u root -e "CREATE DATABASE viral_clips_ai;"
```

### Opção B: Download Manual

1. Acesse: https://dev.mysql.com/downloads/mysql/
2. Baixe o instalador para macOS
3. Execute e configure uma senha para root
4. Crie o banco:
```bash
mysql -u root -p
# Digite sua senha
CREATE DATABASE viral_clips_ai;
EXIT;
```

---

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
touch .env
```

Edite o arquivo `.env` e adicione:

```env
# ============================================
# OBRIGATÓRIAS (mínimo para rodar)
# ============================================

# Banco de Dados MySQL
DATABASE_URL=mysql://root:@localhost:3306/viral_clips_ai
# Se tiver senha: mysql://root:SUA_SENHA@localhost:3306/viral_clips_ai

# JWT Secret (gere um valor aleatório)
JWT_SECRET=seu_secret_aleatorio_aqui_123456789

# Porta do servidor
PORT=3001

# URL do frontend (desenvolvimento)
FRONTEND_URL=http://localhost:3000

# ============================================
# STORAGE (Cloudflare R2 ou AWS S3)
# ============================================
# Se não tiver, o projeto pode rodar mas não vai salvar vídeos
AWS_ACCESS_KEY_ID=sua_key
AWS_SECRET_ACCESS_KEY=sua_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=viral-clips

# ============================================
# TRANSCRIÇÃO (Whisper API)
# ============================================
# Opção 1: Manus Forge API
BUILT_IN_FORGE_API_KEY=sua_key
BUILT_IN_FORGE_API_URL=https://api.manus.im

# Opção 2: OpenAI (alternativa)
OPENAI_API_KEY=sk-...

# ============================================
# REDIS (Opcional - para fila de jobs)
# ============================================
# Se não configurar, a fila vai usar memória (não recomendado para produção)
REDIS_URL=redis://localhost:6379

# ============================================
# OPCIONAIS (APIs de Redes Sociais)
# ============================================
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**💡 Dica:** Para começar, você só precisa de:
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`

O resto pode ficar vazio ou com valores de teste.

---

## 🗃️ Passo 4: Criar Tabelas no Banco de Dados

```bash
npm run db:push
```

Isso vai criar todas as tabelas necessárias automaticamente.

**Verificar se funcionou:**
```bash
npm run db:studio
```

Isso abre o Drizzle Studio no navegador onde você pode ver as tabelas.

---

## 🔴 Passo 5: Instalar Redis (Opcional mas Recomendado)

### Usando Homebrew:
```bash
brew install redis
brew services start redis
```

### Verificar se está rodando:
```bash
redis-cli ping
# Deve retornar: PONG
```

**Nota:** Se não instalar Redis, a fila de jobs vai usar memória (não recomendado, mas funciona para testes).

---

## 🎬 Passo 6: Instalar FFmpeg (Obrigatório para processar vídeos)

### Usando Homebrew:
```bash
brew install ffmpeg
```

### Verificar instalação:
```bash
ffmpeg -version
```

---

## 🚀 Passo 7: Rodar o Projeto

### Opção 1: Rodar tudo junto (Frontend + Backend)

```bash
npm run dev:all
```

Isso inicia:
- Frontend na porta **3000** (http://localhost:3000)
- Backend na porta **3001** (http://localhost:3001)

### Opção 2: Rodar separadamente

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

---

## ✅ Passo 8: Acessar o Site

Abra no navegador:
```
http://localhost:3000
```

---

## 👤 Passo 9: Criar Primeira Conta

1. Acesse: http://localhost:3000
2. Clique em **"Criar conta"**
3. Preencha:
   - Nome
   - Email
   - Senha (mínimo 6 caracteres)
4. Clique em **"Cadastrar"**

✅ **Você receberá créditos iniciais!**

---

## 🐛 Problemas Comuns

### Erro: "ECONNREFUSED" (MySQL)

**Solução:**
```bash
# Verificar se MySQL está rodando
brew services list

# Se não estiver, iniciar:
brew services start mysql

# Verificar conexão:
mysql -u root -e "SHOW DATABASES;"
```

### Erro: "Porta 3000 já está em uso"

**Solução:**
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou mudar a porta no vite.config.ts
```

### Erro: "Database not found"

**Solução:**
```bash
# Criar banco novamente
mysql -u root -e "CREATE DATABASE viral_clips_ai;"

# Aplicar migrations
npm run db:push
```

### Erro: "FFmpeg not found"

**Solução:**
```bash
brew install ffmpeg
```

### Erro: "Redis connection failed"

**Solução:**
```bash
# Iniciar Redis
brew services start redis

# Verificar
redis-cli ping
```

**Nota:** Se não quiser usar Redis agora, pode deixar `REDIS_URL` vazio no `.env`. A fila vai usar memória (não recomendado para produção, mas funciona para testes).

---

## 📝 Resumo Rápido (Copy & Paste)

```bash
# 1. Instalar dependências
npm install

# 2. Instalar MySQL (se não tiver)
brew install mysql
brew services start mysql
mysql -u root -e "CREATE DATABASE viral_clips_ai;"

# 3. Criar arquivo .env (copie o conteúdo acima)

# 4. Criar tabelas
npm run db:push

# 5. Instalar FFmpeg (se não tiver)
brew install ffmpeg

# 6. Instalar Redis (opcional)
brew install redis
brew services start redis

# 7. Rodar projeto
npm run dev:all

# 8. Acessar
# http://localhost:3000
```

---

## 🎯 Próximos Passos

Após rodar localmente:

1. ✅ Testar criação de conta
2. ✅ Testar login
3. ✅ Testar criação de job (precisa de APIs configuradas)
4. ✅ Explorar painel admin (se for admin)

**Documentação completa:** Veja `DOCUMENTACAO_COMPLETA_PROJETO.md`

---

**Dúvidas?** Consulte os outros arquivos de documentação no projeto! 🚀

