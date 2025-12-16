# 🚀 Verificar e Forçar Deploy no Railway

## ✅ Status Atual

O código já foi commitado e enviado para o GitHub:
- ✅ Último commit: `a3c1830` - "Fix: Adicionar timeouts e logs detalhados para resolver timeout de 30s no login"
- ✅ Push realizado para: `ferramentameegra-cell/ez-clip-ai`

---

## 🔍 Como Verificar se o Deploy Está Acontecendo

### 1. **Acessar Railway Dashboard**

1. Acesse: **https://railway.app**
2. Faça login na sua conta
3. Selecione o projeto **"ez-clip-ai"** (ou o nome do seu projeto)

### 2. **Verificar Deployments**

1. No dashboard, clique em **"Deployments"** (ou "Deploys")
2. Veja o último deploy:
   - ✅ **Status: "Active"** ou **"Building"** = Deploy em andamento
   - ✅ **Status: "Success"** = Deploy concluído
   - ❌ **Status: "Failed"** = Erro no deploy

### 3. **Verificar Logs em Tempo Real**

1. Clique no último deploy
2. Vá em **"Logs"** ou **"View Logs"**
3. Veja os logs em tempo real:
   - `Building...`
   - `Installing dependencies...`
   - `Building application...`
   - `Deploying...`

---

## 🚀 Como Forçar um Novo Deploy

### Opção 1: Fazer um Commit Vazio (Recomendado)

Se o deploy automático não estiver funcionando, você pode forçar um novo deploy fazendo um commit vazio:

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai
git commit --allow-empty -m "Trigger: Forçar novo deploy no Railway"
git push origin main
```

Isso vai acionar o deploy automático no Railway.

---

### Opção 2: Usar Railway CLI

Se você tiver Railway CLI instalado:

```bash
# Instalar Railway CLI (se não tiver)
npm i -g @railway/cli

# Fazer login
railway login

# Conectar ao projeto
railway link

# Fazer deploy manual
railway up
```

---

### Opção 3: Redeploy pelo Dashboard

1. Acesse Railway Dashboard
2. Vá em **"Deployments"**
3. Clique no último deploy
4. Clique em **"Redeploy"** ou **"Deploy Again"**

---

## 📊 Verificar Status do Deploy

### Logs Esperados (Sucesso):

```
[INFO] Building application...
[INFO] Installing dependencies...
[INFO] Building frontend...
[INFO] Building backend...
[INFO] Deploying...
[INFO] ✅ Deploy successful
```

### Logs de Erro Comuns:

#### Erro: "Build failed"
```
[ERROR] npm install failed
[ERROR] Module not found
```
**Solução:** Verificar `package.json` e dependências

#### Erro: "Port already in use"
```
[ERROR] Port 3001 already in use
```
**Solução:** Verificar variável `PORT` no Railway

#### Erro: "Database connection failed"
```
[ERROR] ECONNREFUSED
```
**Solução:** Verificar `DATABASE_URL` no Railway

---

## 🔧 Verificar Variáveis de Ambiente

No Railway Dashboard:

1. Vá em **"Variables"**
2. Verifique se todas as variáveis estão configuradas:

### Variáveis Obrigatórias:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=mysql://... (fornecido pelo MySQL do Railway)
JWT_SECRET=seu_secret_aleatorio
```

### Variáveis Opcionais (mas recomendadas):

```env
REDIS_URL=redis://... (se usar Redis)
AWS_ACCESS_KEY_ID=... (Cloudflare R2)
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_S3_ENDPOINT=...
OPENAI_API_KEY=...
VITE_TRPC_URL=https://seu-projeto.up.railway.app
```

---

## ✅ Verificar se o Deploy Funcionou

### 1. **Verificar Health Check**

Acesse: `https://seu-projeto.up.railway.app/health`

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "database": {
    "healthy": true,
    "responseTime": "150ms"
  }
}
```

### 2. **Verificar Logs do Servidor**

No Railway Dashboard:
1. Vá em **"Deployments"** → Último deploy
2. Vá em **"Logs"**
3. Procure por:
   - `[DB] ✅ Pool de conexões criado`
   - `[tRPC] 📥 Request recebido`
   - `Server running on port 3001`

### 3. **Testar Login**

1. Acesse: `https://seu-projeto.up.railway.app`
2. Tente fazer login
3. Verifique se não dá timeout

---

## 🐛 Problemas Comuns

### Deploy não está acontecendo automaticamente

**Causa:** Railway não está conectado ao GitHub ou webhook não está configurado

**Solução:**
1. Railway Dashboard → Settings
2. Verificar se GitHub está conectado
3. Verificar se webhook está ativo
4. Se não estiver, reconectar GitHub

---

### Deploy falha na build

**Causa:** Erro no código ou dependências

**Solução:**
1. Verificar logs do deploy
2. Corrigir erros mostrados
3. Fazer commit e push novamente

---

### Deploy funciona mas site não carrega

**Causa:** Variáveis de ambiente faltando ou incorretas

**Solução:**
1. Verificar todas as variáveis no Railway
2. Verificar se `DATABASE_URL` está correto
3. Verificar se `PORT` está configurado

---

## 📝 Checklist de Deploy

- [ ] Código commitado e enviado para GitHub
- [ ] Railway conectado ao repositório GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] MySQL criado no Railway
- [ ] Deploy em andamento ou concluído
- [ ] Health check funcionando
- [ ] Logs sem erros
- [ ] Site acessível

---

## 🎯 Próximos Passos

1. **Aguardar deploy** (5-10 minutos)
2. **Verificar logs** no Railway Dashboard
3. **Testar health check** (`/health`)
4. **Testar login** no site
5. **Verificar se timeout foi resolvido**

---

**Deploy deve estar acontecendo automaticamente!** 🚀

Se não estiver, use uma das opções acima para forçar um novo deploy.

