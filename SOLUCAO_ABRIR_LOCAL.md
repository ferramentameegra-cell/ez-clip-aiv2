# 🔧 Solução Completa - Abrir Site Localmente

## ⚠️ Problema Identificado

O Node.js pode não estar no PATH do terminal. Siga estes passos:

---

## ✅ Passo a Passo Completo

### 1️⃣ Abrir Terminal NOVO

**IMPORTANTE:** Feche qualquer terminal antigo e abra um NOVO Terminal:
- Pressione `Cmd + Espaço`
- Digite "Terminal"
- Pressione Enter

### 2️⃣ Verificar Node.js

No Terminal, execute:

```bash
node --version
```

**Se aparecer um número (ex: v22.0.0):** ✅ Node.js está instalado
**Se aparecer "command not found":** ❌ Precisa instalar Node.js

#### Se não tiver Node.js:

1. Acesse: https://nodejs.org/
2. Baixe a versão LTS
3. Instale normalmente
4. Feche e abra um NOVO Terminal
5. Execute `node --version` novamente

### 3️⃣ Navegar até o Projeto

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai
```

### 4️⃣ Instalar Dependências (se necessário)

```bash
npm install
```

Aguarde terminar (pode demorar alguns minutos).

### 5️⃣ Iniciar os Servidores

Execute:

```bash
npm run dev:all
```

**Você verá mensagens como:**
```
VITE ready in 1234 ms
🚀 Backend rodando em http://localhost:3001
```

### 6️⃣ Abrir no Safari

**IMPORTANTE:** Use esta URL exata:

```
http://localhost:3000
```

**NÃO use:** `localhost:3001` (essa é a API, não o site)

---

## 🐛 Se Ainda Não Funcionar

### Verificar se os Servidores Estão Rodando

Em um NOVO Terminal, execute:

```bash
lsof -ti:3000
lsof -ti:3001
```

**Se retornar números:** ✅ Servidores estão rodando
**Se não retornar nada:** ❌ Servidores não estão rodando

### Ver Erros no Terminal

Olhe o terminal onde você executou `npm run dev:all`. Procure por:
- Mensagens em vermelho
- Erros de conexão
- Erros de módulo não encontrado

### Tentar Porta Diferente

Se a porta 3000 estiver ocupada, o Vite pode usar outra porta. Veja a mensagem no terminal, pode ser:
- `http://localhost:3001`
- `http://localhost:5173`
- Outra porta

---

## 📝 Checklist Rápido

- [ ] Terminal NOVO aberto
- [ ] Node.js instalado (`node --version` funciona)
- [ ] Navegou até o projeto (`cd /Users/josyasborba/Desktop/viral-clips-ai`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidores iniciados (`npm run dev:all`)
- [ ] Viu mensagem "VITE ready"
- [ ] Abriu `http://localhost:3000` no Safari

---

## 🆘 Ainda com Problemas?

Me diga:
1. O que aparece quando você executa `node --version`?
2. O que aparece quando você executa `npm run dev:all`?
3. Qual erro aparece no Safari?

