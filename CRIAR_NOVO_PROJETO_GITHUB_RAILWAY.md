# 🚀 Criar Novo Projeto no GitHub e Railway

## 📋 Pré-requisitos

- ✅ Conta no GitHub (https://github.com)
- ✅ Conta no Railway (https://railway.app)
- ✅ Git instalado no computador
- ✅ Node.js instalado

---

## 🎯 Passo 1: Criar Novo Repositório no GitHub

### 1.1 Acessar GitHub
1. Abra seu navegador e acesse: **https://github.com/new**
2. Faça login na sua conta GitHub

### 1.2 Configurar Novo Repositório

**Preencha os campos:**

- **Repository name:** `seu-novo-projeto` (ex: `viral-clips-ai-v2`, `meu-projeto-clips`)
- **Description:** (opcional) Descrição do projeto
- **Visibility:**
  - ✅ **Public** - Qualquer um pode ver
  - ✅ **Private** - Apenas você e colaboradores podem ver (recomendado)

**⚠️ IMPORTANTE - NÃO marque nenhuma opção:**
- ❌ NÃO marque "Add a README file"
- ❌ NÃO marque "Add .gitignore"
- ❌ NÃO marque "Choose a license"

### 1.3 Criar Repositório
1. Clique em **"Create repository"**
2. **ANOTE a URL do repositório** que aparece na tela
   - Exemplo: `https://github.com/SEU-USUARIO/seu-novo-projeto.git`
   - Ou SSH: `git@github.com:SEU-USUARIO/seu-novo-projeto.git`

---

## 🔗 Passo 2: Conectar Projeto Local ao Novo Repositório

### 2.1 Verificar Status Atual do Git

Execute no terminal:

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai
git status
```

### 2.2 Opções para Criar Novo Projeto

**Opção A: Usar o projeto atual (recomendado se quiser manter histórico)**

```bash
# 1. Adicionar novo remote (SUBSTITUA pela URL do seu novo repositório)
git remote add novo-origin https://github.com/SEU-USUARIO/seu-novo-projeto.git

# OU usar SSH (recomendado):
git remote add novo-origin git@github.com:SEU-USUARIO/seu-novo-projeto.git

# 2. Verificar remotes
git remote -v

# 3. Fazer commit de arquivos não rastreados (se houver)
git add .
git commit -m "Initial commit - novo projeto"

# 4. Enviar para o novo repositório
git push -u novo-origin main
```

**Opção B: Criar projeto completamente novo (sem histórico)**

```bash
# 1. Remover remote atual (se quiser)
git remote remove origin

# 2. Adicionar novo remote
git remote add origin https://github.com/SEU-USUARIO/seu-novo-projeto.git

# OU usar SSH:
git remote add origin git@github.com:SEU-USUARIO/seu-novo-projeto.git

# 3. Fazer commit inicial
git add .
git commit -m "Initial commit"

# 4. Enviar para GitHub
git push -u origin main
```

### 2.3 Autenticação GitHub

**Se usar HTTPS:**
- GitHub não aceita mais senhas
- Use um **Personal Access Token**
- Como criar: https://github.com/settings/tokens
- Permissões: `repo` (acesso completo aos repositórios)

**Se usar SSH:**
- Configure chave SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Mais seguro e não precisa digitar token toda vez

---

## 🚂 Passo 3: Criar Projeto no Railway

### 3.1 Acessar Railway
1. Abra: **https://railway.app**
2. Faça login (pode usar conta GitHub)
3. Clique em **"New Project"**

### 3.2 Conectar ao Repositório GitHub
1. Selecione **"Deploy from GitHub repo"**
2. Se for a primeira vez, autorize Railway a acessar seus repositórios GitHub
3. Selecione o **novo repositório** criado
4. Clique em **"Deploy Now"**

### 3.3 Configurar Serviço

O Railway vai detectar automaticamente:
- ✅ **Node.js** (detecta `package.json`)
- ✅ **Build command:** `npm install && npm run build`
- ✅ **Start command:** `npm start`

**Verificar configurações:**
1. Clique no serviço criado
2. Vá em **Settings** → **Deploy**
3. Verifique:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** `20` (ou a versão que você usa)

---

## 🔧 Passo 4: Configurar Variáveis de Ambiente no Railway

### 4.1 Acessar Variáveis
1. No Railway, clique no seu projeto
2. Clique no serviço (ex: "web")
3. Vá em **Variables** (ou **Settings** → **Variables**)

### 4.2 Adicionar Variáveis Básicas

Clique em **"New Variable"** e adicione:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=seu_secret_aleatorio_muito_longo_e_seguro_aqui_12345678901234567890
FRONTEND_URL=https://seu-projeto.railway.app
```

**💡 Dica JWT_SECRET:**
- Gere um valor aleatório seguro (mínimo 32 caracteres)
- Pode usar: `openssl rand -base64 32` no terminal

### 4.3 Criar e Configurar MySQL

1. No Railway, clique em **"+ New"** → **"Database"** → **"Add MySQL"**
2. Aguarde o MySQL ser criado (pode levar 1-2 minutos)
3. Clique no MySQL criado → **Variables**
4. Copie o valor de `DATABASE_URL` (ex: `mysql://root:senha@host:port/database`)
5. Volte para o serviço principal → **Variables**
6. Adicione nova variável:
   ```
   DATABASE_URL=mysql://... (cole o valor copiado)
   ```

### 4.4 Criar e Configurar Redis (Opcional mas Recomendado)

1. No Railway, clique em **"+ New"** → **"Database"** → **"Add Redis"**
2. Aguarde o Redis ser criado
3. Clique no Redis criado → **Variables**
4. Copie o valor de `REDIS_URL`
5. Volte para o serviço principal → **Variables**
6. Adicione:
   ```
   REDIS_URL=redis://... (cole o valor copiado)
   ```

### 4.5 Adicionar Outras Variáveis Necessárias

Adicione conforme necessário (veja `ENV_VARIABLES.md` para lista completa):

```env
# S3 / Cloudflare R2
AWS_ACCESS_KEY_ID=sua_key
AWS_SECRET_ACCESS_KEY=sua_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=nome-do-bucket
AWS_S3_ENDPOINT=https://sua-conta.r2.cloudflarestorage.com

# OpenAI / Anthropic
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Outras APIs
BUILT_IN_FORGE_API_KEY=sua_key
BUILT_IN_FORGE_API_URL=https://api.manus.im
```

---

## 🗄️ Passo 5: Configurar Banco de Dados

### 5.1 Aplicar Migrations

**Opção A: Via Railway Dashboard (Recomendado para iniciantes)**

1. No Railway, clique no MySQL
2. Vá em **"Data"** ou **"Query"**
3. Execute o SQL necessário (veja `drizzle/schema.ts` ou migrations existentes)

**Opção B: Via Railway CLI (Mais rápido)**

```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Fazer login
railway login

# 3. Conectar ao projeto
railway link
# Selecione o projeto criado

# 4. Conectar ao MySQL e executar migrations
railway connect mysql
# Isso abre uma conexão MySQL no terminal

# Em outro terminal, execute:
cd /Users/josyasborba/Desktop/viral-clips-ai
npm run db:push
```

**Opção C: Via Script Local (Se tiver DATABASE_URL configurada)**

```bash
# Configurar DATABASE_URL no .env local (temporariamente)
# Depois execute:
npm run db:push
```

### 5.2 Verificar Tabelas Criadas

1. No Railway, clique no MySQL
2. Vá em **"Data"**
3. Verifique se as tabelas foram criadas corretamente

---

## ✅ Passo 6: Verificar Deploy

### 6.1 Gerar Domínio

1. No Railway, clique no serviço
2. Vá em **Settings** → **Domains**
3. Clique em **"Generate Domain"** (se não tiver)
4. Anote a URL gerada (ex: `https://seu-projeto.railway.app`)

### 6.2 Testar Endpoints

Aguarde o deploy completar (pode levar 3-5 minutos na primeira vez) e teste:

- **Health Check:** `https://seu-projeto.railway.app/health`
- **API:** `https://seu-projeto.railway.app/api`
- **Frontend:** `https://seu-projeto.railway.app`

### 6.3 Verificar Logs

1. No Railway, clique no serviço
2. Vá em **Deployments** → **View Logs**
3. Verifique se não há erros

**Se houver erros:**
- Verifique variáveis de ambiente
- Verifique se migrations foram aplicadas
- Verifique logs para identificar o problema

---

## 🔄 Passo 7: Configurar Deploy Automático

### 7.1 Habilitar Auto-Deploy

1. No Railway, vá em **Settings** → **Deploy**
2. Certifique-se que **"Auto Deploy"** está ativado ✅
3. Selecione branch: **`main`** (ou `master`)

**Agora, a cada `git push` para a branch `main`, o Railway fará deploy automaticamente!**

---

## 📝 Checklist Final

Antes de considerar o projeto completo:

- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub (`git push`)
- [ ] Projeto criado no Railway
- [ ] Serviço conectado ao repositório GitHub
- [ ] Variáveis de ambiente básicas configuradas
- [ ] MySQL criado e `DATABASE_URL` configurado
- [ ] Redis criado e `REDIS_URL` configurado (opcional)
- [ ] Migrations aplicadas no banco
- [ ] Build completou com sucesso
- [ ] Domínio gerado e site acessível
- [ ] Endpoints respondendo corretamente
- [ ] Auto-deploy configurado

---

## 🐛 Troubleshooting

### Erro: "Build failed"
**Solução:**
- Verifique logs no Railway
- Certifique-se que `package.json` tem scripts `build` e `start`
- Verifique se Node version está correta (deve ser 20)

### Erro: "Port already in use"
**Solução:**
- Railway usa variável `PORT` automaticamente
- Não precisa definir porta manualmente
- Verifique se `PORT=3001` está nas variáveis

### Erro: "Database connection failed"
**Solução:**
- Verifique se `DATABASE_URL` está correto
- Certifique-se que MySQL está rodando no Railway
- Verifique se migrations foram aplicadas

### Erro: "Module not found"
**Solução:**
- Verifique se `package.json` tem todas dependências
- Execute `npm install` localmente para testar
- Verifique se `node_modules` não está no `.gitignore` (não deve estar)

### Erro: "Deploy timeout"
**Solução:**
- Build pode estar demorando muito
- Verifique se não está instalando dependências desnecessárias
- Considere otimizar build ou usar cache

---

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Configurar domínio customizado (opcional)
2. ✅ Configurar webhooks (Stripe, etc.)
3. ✅ Configurar monitoramento e alertas
4. ✅ Configurar backups do banco de dados
5. ✅ Otimizar performance e custos

---

## 📚 Documentação Relacionada

- `ENV_VARIABLES.md` - Lista completa de variáveis
- `DEPLOY_RAILWAY_COMPLETO.md` - Deploy detalhado
- `COMO_RODAR_LOCALMENTE.md` - Setup local
- `COMANDOS_PUSH_SSH.md` - Push via SSH

---

## 💡 Dicas Importantes

1. **Primeiro deploy** pode levar 3-5 minutos
2. **Migrations** devem ser aplicadas ANTES do primeiro deploy completo
3. **JWT_SECRET** deve ser único e seguro (mínimo 32 caracteres)
4. **Auto-deploy** está ativado por padrão (deploy automático a cada push)
5. **Variáveis sensíveis** nunca devem ser commitadas no Git
6. **Use SSH** para GitHub (mais seguro e prático)

---

**Dúvidas?** Consulte a documentação do Railway: https://docs.railway.app 🚀
