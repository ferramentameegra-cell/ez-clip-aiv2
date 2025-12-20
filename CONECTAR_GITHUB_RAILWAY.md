# 🚀 Conectar Repositório GitHub ao Railway - Passo a Passo

## ✅ Caminho Completo e Rápido

---

## 🎯 Opção 1: Via Railway Dashboard (Mais Fácil)

### Passo 1: Acessar Railway
1. Abra seu navegador
2. Acesse: **https://railway.app**
3. Faça login (pode usar conta GitHub)

### Passo 2: Criar Novo Projeto
1. Clique no botão **"+ New Project"** (canto superior direito)
2. Selecione **"Deploy from GitHub repo"**

### Passo 3: Autorizar Railway (Primeira Vez)
1. Se for a primeira vez, GitHub vai pedir autorização
2. Clique em **"Authorize Railway"** ou **"Authorize railway-app"**
3. Selecione os repositórios que Railway pode acessar:
   - ✅ **Selecione apenas o repositório criado** (mais seguro)
   - OU selecione **"All repositories"** (se preferir)
4. Clique em **"Install & Authorize"**

### Passo 4: Selecionar Repositório
1. Na lista de repositórios, encontre o seu repositório
2. Clique no repositório (ex: `viral-clips-ai`)
3. Railway vai começar a fazer deploy automaticamente

### Passo 5: Aguardar Deploy Inicial
1. Railway vai detectar automaticamente:
   - ✅ Node.js (detecta `package.json`)
   - ✅ Build command: `npm install && npm run build`
   - ✅ Start command: `npm start`
2. Aguarde o build completar (pode levar 3-5 minutos)
3. Acompanhe em **"Deployments"** → **"View Logs"**

---

## 🎯 Opção 2: Via Railway CLI (Mais Rápido)

### Passo 1: Instalar Railway CLI
```bash
npm install -g @railway/cli
```

### Passo 2: Fazer Login
```bash
railway login
```
Isso vai abrir o navegador para autenticação.

### Passo 3: Criar Projeto
```bash
railway init
```

Escolha:
- **"Create a new project"**
- Digite o nome do projeto (ex: `viral-clips-ai`)
- Selecione **"Deploy from GitHub repo"**
- Selecione o repositório criado

### Passo 4: Deploy Automático
```bash
railway up
```

OU use o script automatizado:
```bash
./deploy-railway-automatico.sh
```

---

## 🎯 Opção 3: Script Totalmente Automatizado (Mais Fácil)

Execute o script que faz TUDO automaticamente:

```bash
./deploy-railway-automatico.sh
```

O script vai:
- ✅ Verificar Railway CLI
- ✅ Fazer login
- ✅ Criar/linkar projeto
- ✅ Configurar variáveis
- ✅ Aplicar migrations
- ✅ Fazer deploy

---

## 📋 Após Conectar - Próximos Passos

### 1. Configurar Variáveis de Ambiente

No Railway Dashboard:
1. Clique no seu projeto
2. Clique no serviço (ex: "web")
3. Vá em **"Variables"**
4. Adicione as variáveis:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=
FRONTEND_URL=https://seu-projeto.railway.app
```

### 2. Criar MySQL

1. Railway → **"+ New"** → **"Database"** → **"Add MySQL"**
2. Aguarde MySQL ser criado
3. MySQL → **Variables** → Copiar `DATABASE_URL`
4. Serviço principal → **Variables** → Adicionar `DATABASE_URL`

### 3. Criar Redis (Opcional mas Recomendado)

1. Railway → **"+ New"** → **"Database"** → **"Add Redis"**
2. Aguarde Redis ser criado
3. Redis → **Variables** → Copiar `REDIS_URL`
4. Serviço principal → **Variables** → Adicionar `REDIS_URL`

### 4. Gerar Domínio

1. Railway → Settings → **"Domains"**
2. Clique em **"Generate Domain"**
3. Anote a URL (ex: `https://seu-projeto.railway.app`)
4. Atualize `FRONTEND_URL` nas variáveis

### 5. Aplicar Migrations

**Via CLI:**
```bash
railway connect mysql
npm run db:push
```

**Via Dashboard:**
- Railway → MySQL → **"Data"** → Execute SQL necessário

---

## ✅ Checklist de Conexão

- [ ] Railway CLI instalado (se usar CLI)
- [ ] Logado no Railway
- [ ] Projeto criado no Railway
- [ ] Repositório GitHub conectado
- [ ] Deploy iniciado
- [ ] Variáveis básicas configuradas
- [ ] MySQL criado
- [ ] Redis criado (opcional)
- [ ] Migrations aplicadas
- [ ] Domínio gerado
- [ ] Site acessível

---

## 🐛 Problemas Comuns

### Erro: "Repository not found"
**Solução:**
- Verifique se autorizou Railway a acessar o repositório
- Vá em GitHub → Settings → Applications → Railway
- Verifique permissões

### Erro: "Build failed"
**Solução:**
- Verifique logs: Railway → Deployments → View Logs
- Certifique-se que `package.json` tem scripts `build` e `start`
- Verifique Node version (deve ser 20)

### Erro: "Port already in use"
**Solução:**
- Railway usa variável `PORT` automaticamente
- Configure `PORT=3001` nas variáveis

---

## 🚀 Executar Agora

**Opção mais fácil:**

```bash
./deploy-railway-automatico.sh
```

Ou siga o **Passo a Passo Via Dashboard** acima.

---

**Status:** ✅ **Pronto para conectar!**
