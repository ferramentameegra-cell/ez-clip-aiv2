# 🚀 Como Criar um Novo Projeto no GitHub e Railway

## 📋 Índice
1. [Criar Repositório no GitHub](#1-criar-repositório-no-github)
2. [Conectar Projeto Local ao GitHub](#2-conectar-projeto-local-ao-github)
3. [Criar Projeto no Railway](#3-criar-projeto-no-railway)
4. [Configurar Deploy Automático](#4-configurar-deploy-automático)
5. [Configurar Variáveis de Ambiente](#5-configurar-variáveis-de-ambiente)
6. [Configurar Banco de Dados](#6-configurar-banco-de-dados)

---

## 1. Criar Repositório no GitHub

### Passo 1.1: Acessar GitHub
1. Acesse: https://github.com
2. Faça login na sua conta
3. Clique no botão **"+"** no canto superior direito
4. Selecione **"New repository"**

### Passo 1.2: Configurar Repositório
Preencha os campos:

- **Repository name:** `nome-do-seu-projeto` (ex: `viral-clips-ai`)
- **Description:** (opcional) Descrição do projeto
- **Visibility:**
  - ✅ **Public** - Qualquer um pode ver
  - ✅ **Private** - Apenas você e colaboradores podem ver
- **Initialize this repository with:**
  - ❌ NÃO marque "Add a README file" (se já tem código local)
  - ❌ NÃO marque "Add .gitignore"
  - ❌ NÃO marque "Choose a license"

### Passo 1.3: Criar Repositório
1. Clique em **"Create repository"**
2. **NÃO** execute os comandos que aparecem na tela ainda
3. Anote a URL do repositório (ex: `https://github.com/seu-usuario/nome-do-projeto.git`)

---

## 2. Conectar Projeto Local ao GitHub

### Passo 2.1: Verificar se já é um repositório Git

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai
git status
```

**Se aparecer erro "not a git repository":**
```bash
# Inicializar repositório Git
git init
git branch -M main
```

**Se já for um repositório Git:**
Pule para o Passo 2.2

### Passo 2.2: Adicionar Remote do GitHub

```bash
# Adicionar o repositório GitHub como origem
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git

# OU se preferir usar SSH (recomendado):
git remote add origin git@github.com:SEU-USUARIO/NOME-DO-REPOSITORIO.git
```

**Substitua:**
- `SEU-USUARIO` pelo seu usuário do GitHub
- `NOME-DO-REPOSITORIO` pelo nome do repositório criado

### Passo 2.3: Verificar Remote

```bash
git remote -v
```

**Deve mostrar:**
```
origin  https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git (fetch)
origin  https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git (push)
```

### Passo 2.4: Fazer Primeiro Commit e Push

```bash
# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit"

# Enviar para GitHub
git push -u origin main
```

**Se usar HTTPS e pedir autenticação:**
- Use um **Personal Access Token** (não senha)
- Como criar: https://github.com/settings/tokens
- Permissões necessárias: `repo` (acesso completo aos repositórios)

**Se usar SSH e der erro:**
- Configure chave SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## 3. Criar Projeto no Railway

### Passo 3.1: Acessar Railway
1. Acesse: https://railway.app
2. Faça login (pode usar conta GitHub)
3. Clique em **"New Project"**

### Passo 3.2: Conectar ao GitHub
1. Selecione **"Deploy from GitHub repo"**
2. Autorize Railway a acessar seus repositórios GitHub
3. Selecione o repositório criado
4. Clique em **"Deploy Now"**

### Passo 3.3: Configurar Serviço
Railway vai detectar automaticamente:
- **Node.js** (se tiver `package.json`)
- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`

**Verificar configurações:**
1. Clique no serviço criado
2. Vá em **Settings** → **Deploy**
3. Verifique:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** `22` (ou a versão que você usa)

---

## 4. Configurar Deploy Automático

### Passo 4.1: Habilitar Auto-Deploy
1. No Railway, vá em **Settings** → **Deploy**
2. Certifique-se que **"Auto Deploy"** está ativado
3. Selecione branch: **`main`** (ou `master`)

### Passo 4.2: Verificar Primeiro Deploy
1. Railway vai iniciar o deploy automaticamente
2. Acompanhe em **Deployments** → **View Logs**
3. Aguarde o build completar (pode levar 3-5 minutos)

**Se der erro:**
- Verifique os logs para identificar o problema
- Veja seção [Troubleshooting](#troubleshooting) abaixo

---

## 5. Configurar Variáveis de Ambiente

### Passo 5.1: Acessar Variáveis
1. No Railway, clique no seu projeto
2. Clique no serviço (ex: "web")
3. Vá em **Variables**

### Passo 5.2: Adicionar Variáveis Obrigatórias

Clique em **"New Variable"** e adicione uma por uma:

#### Variáveis Básicas:
```
NODE_ENV=production
PORT=3000
```

#### JWT Secret:
```
JWT_SECRET=seu_secret_aleatorio_muito_longo_e_seguro_aqui_123456789
```
**💡 Dica:** Gere um valor aleatório seguro (mínimo 32 caracteres)

#### Frontend URL:
```
FRONTEND_URL=https://seu-projeto.railway.app
```
**Substitua** `seu-projeto` pelo nome do seu projeto no Railway

### Passo 5.3: Adicionar Variáveis de Banco de Dados

1. No Railway, clique em **"+ New"** → **"Database"** → **"Add MySQL"**
2. Aguarde o MySQL ser criado
3. Clique no MySQL criado → **Variables**
4. Copie o valor de `DATABASE_URL`
5. Volte para o serviço principal → **Variables**
6. Adicione:
```
DATABASE_URL=mysql://... (cole o valor copiado)
```

### Passo 5.4: Adicionar Redis (Opcional mas Recomendado)

1. No Railway, clique em **"+ New"** → **"Database"** → **"Add Redis"**
2. Aguarde o Redis ser criado
3. Clique no Redis criado → **Variables**
4. Copie o valor de `REDIS_URL`
5. Volte para o serviço principal → **Variables**
6. Adicione:
```
REDIS_URL=redis://... (cole o valor copiado)
```

### Passo 5.5: Adicionar Outras Variáveis

Adicione conforme necessário:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `AWS_S3_ENDPOINT`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- etc.

**💡 Dica:** Veja arquivo `.env.example` ou `ENV_VARIABLES.md` para lista completa

---

## 6. Configurar Banco de Dados

### Passo 6.1: Aplicar Migrations

**Opção A: Via Railway Dashboard**
1. No Railway, clique no MySQL
2. Vá em **"Data"** ou **"Query"**
3. Execute o SQL necessário (veja `DEPLOY_RAILWAY_COMPLETO.md`)

**Opção B: Via CLI**
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Fazer login
railway login

# Conectar ao projeto
railway link

# Conectar ao MySQL
railway connect mysql

# Executar migrations
npm run db:push
```

### Passo 6.2: Verificar Tabelas
1. No Railway, clique no MySQL
2. Vá em **"Data"**
3. Verifique se as tabelas foram criadas

---

## ✅ Verificar Deploy

### Passo 7.1: Acessar Site
1. No Railway, clique no serviço
2. Vá em **Settings** → **Domains**
3. Clique em **"Generate Domain"** (se não tiver)
4. Acesse a URL gerada (ex: `https://seu-projeto.railway.app`)

### Passo 7.2: Testar Endpoints
- Health: `https://seu-projeto.railway.app/health`
- API: `https://seu-projeto.railway.app/api`
- Frontend: `https://seu-projeto.railway.app`

---

## 🐛 Troubleshooting

### Erro: "Build failed"
**Solução:**
- Verifique logs no Railway
- Certifique-se que `package.json` tem scripts `build` e `start`
- Verifique se Node version está correta

### Erro: "Port already in use"
**Solução:**
- Railway usa variável `PORT` automaticamente
- Não precisa definir porta manualmente
- Remova `PORT` das variáveis ou deixe Railway gerenciar

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
- Considere usar `.dockerignore` ou otimizar build

---

## 📝 Checklist Final

Antes de considerar o deploy completo:

- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub (`git push`)
- [ ] Projeto criado no Railway
- [ ] Serviço conectado ao repositório GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] MySQL criado e `DATABASE_URL` configurado
- [ ] Redis criado e `REDIS_URL` configurado (opcional)
- [ ] Migrations aplicadas no banco
- [ ] Build completou com sucesso
- [ ] Site acessível na URL do Railway
- [ ] Endpoints respondendo corretamente

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

- `DEPLOY_RAILWAY_COMPLETO.md` - Deploy detalhado
- `COMO_RODAR_LOCALMENTE.md` - Setup local
- `ENV_VARIABLES.md` - Lista de variáveis
- `COMANDOS_PUSH_SSH.md` - Push via SSH

---

**Dúvidas?** Consulte a documentação do Railway: https://docs.railway.app 🚀

