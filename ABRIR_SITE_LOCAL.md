# 🚀 Como Abrir o Site Localmente - Guia Rápido

## ⚡ Passo a Passo Simples

### 1️⃣ Instalar Dependências (se ainda não instalou)

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai
npm install
```

### 2️⃣ Criar Arquivo .env (se não existir)

Crie um arquivo `.env` na raiz do projeto com o mínimo necessário:

```env
# Banco de Dados (ajuste conforme seu MySQL)
DATABASE_URL=mysql://root:@localhost:3306/viral_clips_ai

# JWT Secret (qualquer string aleatória)
JWT_SECRET=seu_secret_aleatorio_123456789

# Porta do servidor
PORT=3001

# URL do frontend
FRONTEND_URL=http://localhost:3000
VITE_TRPC_URL=http://localhost:3001/trpc
```

### 3️⃣ Iniciar o Site

Execute este comando na raiz do projeto:

```bash
npm run dev:all
```

Isso vai iniciar:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### 4️⃣ Acessar o Site

Abra no navegador:
```
http://localhost:3000
```

---

## ✅ Pronto!

O site estará rodando localmente. Você verá a página de edição (Dashboard) diretamente, sem precisar fazer login.

---

## 🐛 Problemas Comuns

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Port already in use"
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Matar processo na porta 3001
lsof -ti:3001 | xargs kill -9
```

### Erro: "Database connection failed"
- Verifique se o MySQL está rodando
- Verifique a `DATABASE_URL` no `.env`
- Se necessário, crie o banco: `mysql -u root -e "CREATE DATABASE viral_clips_ai;"`

---

## 📝 Nota

O site agora funciona **sem login obrigatório**. Você pode usar diretamente a página de edição!

