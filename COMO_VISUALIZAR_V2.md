# 🎨 Como Visualizar o Site Reformulado (V2 - Retention Engine)

## 🚀 Passo a Passo Rápido

### 1. Abrir o Terminal

No diretório do projeto:
```bash
cd /Users/josyasborba/Desktop/viral-clips-ai
```

### 2. Iniciar o Servidor (Tudo Junto)

Execute este comando:
```bash
npm run dev:all
```

Isso vai iniciar:
- ✅ **Frontend** na porta **3000**
- ✅ **Backend** na porta **3001**

### 3. Acessar no Navegador

Abra seu navegador e acesse:
```
http://localhost:3000
```

---

## 🎯 O Que Você Vai Ver

### **Dashboard Reformulado**

1. **Página Inicial do Dashboard** (`/dashboard`)
   - Clique em **"Criar Nova Série"** para iniciar o wizard

2. **Wizard Multi-Step** (6 etapas):
   - **Etapa 1: Vídeo** - Cole URL do YouTube
   - **Etapa 2: Trim** - Defina trecho e veja estimativa de partes
   - **Etapa 3: Nicho** - Escolha o nicho com cards visuais
   - **Etapa 4: Retenção** - Biblioteca de vídeos hipnóticos
   - **Etapa 5: Estilo** - Fontes e legendas
   - **Etapa 6: Preview** - Pré-visualização final 9:16

3. **Features Visuais**:
   - ✅ Barra de progresso no topo
   - ✅ Cards de nichos com emojis
   - ✅ Preview em loop dos vídeos de retenção
   - ✅ Player vertical 9:16 na pré-visualização
   - ✅ Numeração PARTE X/Y sempre visível

---

## 🔍 Testar o Fluxo Completo

### 1. Acesse o Dashboard
```
http://localhost:3000/dashboard
```

### 2. Clique em "Criar Nova Série"

### 3. Preencha o Wizard:
- **Vídeo**: Cole uma URL do YouTube (ex: `https://www.youtube.com/watch?v=...`)
- **Trim**: Defina o trecho (opcional)
- **Nicho**: Escolha um nicho (ex: Podcast, Educação, etc.)
- **Retenção**: Escolha um vídeo de retenção ou randomize
- **Estilo**: Configure fontes e legendas
- **Preview**: Veja a pré-visualização final

### 4. Clique em "Criar Série"

---

## ⚠️ Se Não Funcionar

### Porta 3000 em uso?
```bash
lsof -ti:3000 | xargs kill -9
npm run dev:all
```

### Porta 3001 em uso?
```bash
lsof -ti:3001 | xargs kill -9
npm run dev:all
```

### Erro de dependências?
```bash
npm install
npm run dev:all
```

### Backend não conecta?
- Verifique se o MySQL está rodando
- Verifique o arquivo `.env` com as variáveis de ambiente

---

## 📱 URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **tRPC**: http://localhost:3001/trpc

---

## 🎨 O Que Mudou (V2)

### ✅ Novo Fluxo UX
- Wizard multi-step em vez de formulário único
- Tela obrigatória de seleção de nicho
- Biblioteca de vídeos de retenção melhorada

### ✅ Retention Engine
- Preview em loop dos vídeos
- Opção de randomizar por corte
- Tags visuais (Alta retenção, Hipnótico)

### ✅ Pré-visualização
- Player vertical 9:16
- Mostra layout completo em tempo real
- Numeração PARTE X/Y sempre visível

### ✅ Estilo Visual
- Seletor de fontes
- Estilos de legenda
- Preview animado

---

**Pronto! Agora é só rodar `npm run dev:all` e acessar `http://localhost:3000`** 🚀

