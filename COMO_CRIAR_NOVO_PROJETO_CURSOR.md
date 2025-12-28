# 🚀 Como Criar um Novo Projeto no Cursor

## ✅ Guia Completo - Criar Novo Projeto

---

## 🎯 Opção 1: Criar Projeto do Zero

### Passo 1: Abrir Cursor

1. Abra o **Cursor**
2. Vá em **File** → **New Window** (ou `Cmd + Shift + N` no Mac)

### Passo 2: Criar Nova Pasta

1. Vá em **File** → **Open Folder...** (ou `Cmd + O` no Mac)
2. Navegue até onde quer criar o projeto (ex: Desktop)
3. Clique em **"New Folder"** no diálogo
4. Digite o nome do projeto (ex: `meu-novo-projeto`)
5. Clique em **"Create"** e depois **"Open"**

### Passo 3: Inicializar Projeto

Agora você tem uma pasta vazia aberta no Cursor. Pode:

1. **Criar arquivos manualmente:**
   - `File` → `New File` (ou `Cmd + N`)
   - Crie `package.json`, `README.md`, etc.

2. **Ou usar terminal integrado:**
   - Abra terminal: `View` → `Terminal` (ou `` Ctrl + ` ``)
   - Execute comandos para criar o projeto:
     ```bash
     npm init -y
     # ou
     git init
     ```

---

## 🎯 Opção 2: Clonar Repositório GitHub

### Passo 1: Abrir Terminal

1. No Cursor, abra terminal: `View` → `Terminal` (ou `` Ctrl + ` ``)

### Passo 2: Clonar Repositório

```bash
cd ~/Desktop  # ou onde quiser criar
git clone https://github.com/usuario/repositorio.git
cd repositorio
```

### Passo 3: Abrir no Cursor

1. **File** → **Open Folder...**
2. Navegue até a pasta clonada
3. Clique em **"Open"**

---

## 🎯 Opção 3: Criar a Partir de Template

### Passo 1: Usar Comando no Terminal

```bash
# Exemplo: Criar projeto React
npx create-react-app meu-projeto

# Exemplo: Criar projeto Next.js
npx create-next-app@latest meu-projeto

# Exemplo: Criar projeto Vite
npm create vite@latest meu-projeto
```

### Passo 2: Abrir no Cursor

1. Após criar, **File** → **Open Folder...**
2. Navegue até a pasta criada
3. Clique em **"Open"**

---

## 🎯 Opção 4: Usar Comandos do Cursor (AI)

### Passo 1: Abrir Terminal

1. Abra terminal no Cursor: `` Ctrl + ` ``

### Passo 2: Usar Cursor AI

1. Pressione `Cmd + L` (Mac) ou `Ctrl + L` (Windows/Linux) para abrir Cursor AI
2. Digite: "Criar um novo projeto [tipo] com [stack]"
   - Exemplo: "Criar um novo projeto React com TypeScript"
   - Exemplo: "Criar um novo projeto Node.js com Express"

3. O Cursor AI vai ajudar a criar os arquivos necessários

---

## 📋 Estrutura Básica de um Novo Projeto

Após criar a pasta, você pode criar esta estrutura básica:

```
meu-projeto/
├── package.json
├── README.md
├── .gitignore
├── src/
│   └── index.js
└── .env (não commitado)
```

### Criar arquivos rapidamente:

1. **package.json:**
   ```bash
   npm init -y
   ```

2. **.gitignore:**
   ```bash
   echo "node_modules/" > .gitignore
   echo ".env" >> .gitignore
   ```

3. **README.md:**
   - Criar manualmente via `File → New File`

---

## 🚀 Exemplo Completo: Criar Projeto Node.js

### 1. Criar Pasta

```bash
cd ~/Desktop
mkdir meu-projeto-node
cd meu-projeto-node
```

### 2. Inicializar NPM

```bash
npm init -y
```

### 3. Abrir no Cursor

1. **File** → **Open Folder...**
2. Selecione `meu-projeto-node`
3. Clique em **"Open"**

### 4. Criar Arquivos

```bash
# Criar estrutura básica
mkdir src
touch src/index.js
touch .gitignore
touch README.md
```

### 5. Inicializar Git (opcional)

```bash
git init
git add .
git commit -m "Initial commit"
```

---

## ✅ Checklist para Novo Projeto

- [ ] Pasta criada
- [ ] Aberta no Cursor
- [ ] `package.json` criado (se Node.js)
- [ ] `.gitignore` criado
- [ ] `README.md` criado
- [ ] Git inicializado (opcional)
- [ ] Estrutura de pastas criada
- [ ] Primeiro arquivo criado

---

## 💡 Dicas

1. **Use atalhos:**
   - `Cmd + N` - Novo arquivo
   - `Cmd + O` - Abrir pasta
   - `` Ctrl + ` `` - Abrir terminal
   - `Cmd + L` - Abrir Cursor AI

2. **Templates úteis:**
   - React: `npx create-react-app`
   - Next.js: `npx create-next-app@latest`
   - Vite: `npm create vite@latest`
   - Node.js: `npm init -y`

3. **Use Cursor AI:**
   - Digite `Cmd + L` e peça ajuda para criar o projeto
   - Exemplo: "Criar estrutura de projeto React com TypeScript"

---

## 🔗 Próximos Passos

Depois de criar o projeto:

1. ✅ Configurar dependências
2. ✅ Criar estrutura de pastas
3. ✅ Inicializar Git
4. ✅ Criar primeiro commit
5. ✅ Configurar variáveis de ambiente

---

**Status:** ✅ **Guia completo para criar novo projeto no Cursor!**
