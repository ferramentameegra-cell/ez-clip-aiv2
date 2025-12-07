# 🚀 INICIAR O SITE AGORA

## ✅ SOLUÇÃO RÁPIDA:

Execute no terminal:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
./iniciar-site.sh
```

OU execute manualmente:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai

# 1. Matar processos
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

# 2. Limpar cache
rm -rf node_modules/.vite client/dist

# 3. Iniciar servidor
npm run dev:all
```

---

## 📍 DEPOIS ACESSE:

```
http://localhost:3000
```

---

**Execute e me diga se funcionou!** 🎯

