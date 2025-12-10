# ⚡ Quick Start: Continuar Projeto em Novo Computador

## 🎯 Resumo Rápido (5 minutos)

### **1. Instalar Dependências**
```bash
# macOS
brew install node@22 git
npm i -g @railway/cli

# OU se já tem Node.js
npm i -g @railway/cli
```

### **2. Clonar do GitHub**
```bash
cd ~/Downloads
git clone https://github.com/ferramentameegra-cell/ez-clip-ai.git
cd ez-clip-ai
```

### **3. Instalar Dependências do Projeto**
```bash
npm install
```

### **4. Conectar Railway**
```bash
railway login
railway link  # Conecta ao projeto existente
```

### **5. Criar `.env` Local (Opcional - Só para testes locais)**
```bash
# Railway já tem todas as variáveis configuradas
# .env local só é necessário se quiser rodar localmente

touch .env
# Adicionar variáveis mínimas (ver GUIA_MUDAR_COMPUTADOR.md)
```

### **6. Pronto!**
```bash
# Testar build
npm run build

# Se quiser rodar localmente (opcional)
npm run dev
```

---

## 📋 Checklist Mínimo

- [ ] Node.js 22+ instalado
- [ ] Git instalado
- [ ] Railway CLI instalado
- [ ] Repositório clonado do GitHub
- [ ] `npm install` executado
- [ ] `railway login` feito
- [ ] `railway link` conectado ao projeto
- [ ] `npm run build` funciona

---

## ⚠️ IMPORTANTE

1. **NÃO precisa copiar pasta do drive** - Use GitHub (mais seguro)
2. **NÃO precisa copiar `node_modules`** - Execute `npm install`
3. **NÃO precisa copiar `.env`** - Railway já tem todas as variáveis
4. **Sempre faça `git push` antes de mudar de computador**

---

## 🚀 Workflow Diário

```bash
# Ao começar (sincronizar)
git pull origin main

# Trabalhar normalmente...

# Ao terminar (salvar)
git add -A
git commit -m "Sua mensagem"
git push origin main
```

---

**Pronto! Você pode continuar desenvolvendo normalmente! 🎉**

