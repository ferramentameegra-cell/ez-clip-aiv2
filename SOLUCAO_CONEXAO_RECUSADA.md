# 🔧 SOLUÇÃO: ERR_CONNECTION_REFUSED

## ❌ Problema:
```
Não é possível acessar esse site
A conexão com localhost foi recusada.
ERR_CONNECTION_REFUSED
```

**Isso significa que o servidor não está rodando!**

---

## ✅ SOLUÇÃO COMPLETA:

### **PASSO 1: Parar tudo que está rodando**

```bash
# Matar processos nas portas 3000 e 3001
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
```

---

### **PASSO 2: Limpar cache do Vite**

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
rm -rf node_modules/.vite
rm -rf client/dist
```

---

### **PASSO 3: Verificar se os imports estão corretos**

Os imports já estão corretos no `App.tsx`:
- ✅ `import { AdminDashboard } from '@/pages/admin/Dashboard';`
- ✅ `import { AdminUsers } from '@/pages/admin/Users';`
- ✅ `import { AdminJobs } from '@/pages/admin/Jobs';`

---

### **PASSO 4: Iniciar o servidor**

Execute em **UM único terminal**:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
npm run dev:all
```

**Aguarde ver:**
```
VITE v7.x.x  ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

### **PASSO 5: Acessar o site**

Abra no navegador:
```
http://localhost:3000
```

---

## 🐛 SE AINDA NÃO FUNCIONAR:

### Erro: "Port already in use"

```bash
# Ver o que está usando a porta
lsof -i :3000

# Matar o processo
kill -9 [PID]
```

### Erro: "Cannot find module"

```bash
npm install
```

### Erro: Página em branco

1. Abra o Console do navegador (F12)
2. Veja se há erros em vermelho
3. Me envie os erros!

---

## 🚀 COMANDO RÁPIDO (TUDO EM UM):

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai && \
lsof -ti:3000 | xargs kill -9 2>/dev/null; \
lsof -ti:3001 | xargs kill -9 2>/dev/null; \
rm -rf node_modules/.vite client/dist && \
npm run dev:all
```

---

**Execute os passos acima e me diga se funcionou!** 🎯

