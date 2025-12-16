# 🌐 Como Abrir o Site Localmente no Safari

## ⚠️ IMPORTANTE: URL Correta

**Use esta URL no Safari:**
```
http://localhost:3000
```

**NÃO use:** `localhost:3001` (essa é a porta do backend/API, não do site)

---

## 🚀 Passo a Passo

### 1️⃣ Abrir Terminal

Abra o Terminal (Aplicações > Utilitários > Terminal)

### 2️⃣ Navegar até o Projeto

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai
```

### 3️⃣ Iniciar os Servidores

Execute um destes comandos:

**Opção A - Script Automático:**
```bash
./iniciar-local.sh
```

**Opção B - Comando Manual:**
```bash
npm run dev:all
```

### 4️⃣ Aguardar Inicialização

Você verá mensagens como:
```
VITE ready in X ms
🚀 Backend rodando em http://localhost:3001
```

### 5️⃣ Abrir no Safari

1. Abra o Safari
2. Na barra de endereço, digite:
   ```
   http://localhost:3000
   ```
3. Pressione Enter

---

## ✅ Pronto!

O site deve abrir no Safari mostrando a página de edição (Dashboard).

---

## 🐛 Se Ainda Não Funcionar

### Verificar se os Servidores Estão Rodando

No Terminal, execute:
```bash
lsof -ti:3000
lsof -ti:3001
```

Se não retornar nada, os servidores não estão rodando.

### Verificar Erros

Veja as mensagens no Terminal onde você executou `npm run dev:all`. Procure por erros em vermelho.

### Tentar Outro Navegador

Tente abrir `http://localhost:3000` no Chrome ou Firefox para verificar se o problema é específico do Safari.

---

## 📝 Nota

- **localhost:3000** = Frontend (site que você vê)
- **localhost:3001** = Backend (API, não abre no navegador)

Sempre use **localhost:3000** para acessar o site!

