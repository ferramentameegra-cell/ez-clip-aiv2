# 🔧 SOLUÇÃO - NÃO CONSEGUE ACESSAR O SITE

## 🔍 DIAGNÓSTICO:

Vejo que há algo rodando na porta 3000. Vamos resolver!

---

## ✅ SOLUÇÃO PASSO A PASSO:

### PASSO 1: Parar tudo que está rodando

Execute no terminal:

```bash
# Matar processos na porta 3000
lsof -ti:3000 | xargs kill -9

# Matar processos na porta 3001
lsof -ti:3001 | xargs kill -9
```

Ou simplesmente feche todos os terminais abertos.

---

### PASSO 2: Limpar e reinstalar (se necessário)

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
rm -rf node_modules/.vite
npm run dev:all
```

---

### PASSO 3: Verificar se há erros

Quando executar `npm run dev:all`, você deve ver:

```
✓ Built in XXXms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

Se aparecer erros, **me envie o erro completo!**

---

### PASSO 4: Acessar o site

Abra no navegador:
```
http://localhost:3000
```

---

## 🐛 PROBLEMAS COMUNS:

### Erro: "Cannot find module"
**Solução:** Reinstalar dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port already in use"
**Solução:** Mudar porta ou matar processo
```bash
# Matar processo
lsof -ti:3000 | xargs kill -9
```

### Página em branco
**Solução:** Verificar console do navegador (F12)

---

## 📝 ME ENVIE:

1. O que aparece quando você executa `npm run dev:all`?
2. Qual erro aparece no navegador? (F12 → Console)
3. O servidor inicia ou dá erro?

---

**Vou ajudar a resolver!** 🚀

