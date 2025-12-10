# 🚀 Como Rodar o Projeto AGORA (Versão Atualizada)

## ✅ Problemas Corrigidos

1. ✅ **Rate limiting corrigido** - Usa `ipKeyGenerator` corretamente
2. ✅ **Variável de ambiente adicionada** - `VITE_TRPC_URL=http://localhost:3001/trpc`

## 🚀 Passos para Rodar

### 1. Verificar se o backend está rodando

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai

# Rodar backend
npm run dev:server
```

**Você deve ver:**
```
🚀 Backend rodando em http://localhost:3001
📡 tRPC endpoint: http://localhost:3001/trpc
❤️  Health check: http://localhost:3001/health
```

**Nota:** Os erros de Redis são apenas avisos e não impedem o funcionamento.

### 2. Em OUTRO terminal, rodar o frontend

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai

# Rodar frontend
npm run dev
```

**Você deve ver:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### 3. Acessar o site

Abra no navegador:
```
http://localhost:3000
```

---

## 🔧 OU Rodar Tudo Junto (Mais Fácil)

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
npm run dev:all
```

Isso inicia:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001

---

## ✅ Verificar se Está Funcionando

### Backend
```bash
curl http://localhost:3001/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

### Frontend
Abra: http://localhost:3000

Você deve ver a landing page.

---

## ⚠️ Se Ainda Não Funcionar

### 1. Verificar se as portas estão livres
```bash
lsof -ti:3000 && echo "Porta 3000 em uso" || echo "Porta 3000 livre"
lsof -ti:3001 && echo "Porta 3001 em uso" || echo "Porta 3001 livre"
```

### 2. Matar processos nas portas (se necessário)
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### 3. Verificar variável de ambiente
```bash
cat .env | grep VITE_TRPC_URL
```

Deve mostrar:
```
VITE_TRPC_URL=http://localhost:3001/trpc
```

### 4. Verificar MySQL (se der erro de banco)
```bash
brew services list | grep mysql
# Se não estiver: brew services start mysql
```

---

## 📝 Resumo

1. ✅ **Backend está funcionando** (veja as mensagens de sucesso)
2. ✅ **Variável VITE_TRPC_URL configurada**
3. ⚠️ **Redis não está rodando** (opcional, não impede funcionamento)
4. ✅ **Projeto está na versão mais recente** (5 commits à frente do origin)

**Execute:** `npm run dev:all` e acesse http://localhost:3000

