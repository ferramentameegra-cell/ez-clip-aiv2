# 🚀 COMO TESTAR O SITE LOCALMENTE

## 📍 URLs Locais:

### **Frontend (Vite):**
```
http://localhost:3000
```

### **Backend (Express/tRPC):**
```
http://localhost:3001
```

---

## 🎯 OPÇÃO 1: Rodar tudo junto (Recomendado)

Execute em **um único terminal**:

```bash
npm run dev:all
```

Isso vai iniciar:
- ✅ Frontend na porta **3000**
- ✅ Backend na porta **3001**

---

## 🎯 OPÇÃO 2: Rodar separadamente

### Terminal 1 - Frontend:
```bash
npm run dev
```
→ Acesse: `http://localhost:3000`

### Terminal 2 - Backend:
```bash
npm run dev:server
```
→ Backend: `http://localhost:3001`

---

## 🌐 ACESSAR O SITE:

Abra no navegador:
```
http://localhost:3000
```

---

## 📝 O QUE VOCÊ VAI VER:

1. **Landing Page** (`/`) - Página pública de marketing
2. **Login/Signup** - Botões no header
3. Após login → **Dashboard** (`/dashboard`)

---

## ⚠️ IMPORTANTE:

- Certifique-se que o MySQL está rodando
- Configure as variáveis de ambiente se necessário
- O Vite abre automaticamente no navegador (`open: true`)

---

**Pronto para testar!** 🎉

