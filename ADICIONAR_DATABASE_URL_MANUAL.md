# 📋 Adicionar DATABASE_URL Manualmente - Passo a Passo

## 🎯 O QUE FAZER AGORA (No Dashboard):

### Passo 1: Ir para o Serviço MySQL

1. No dashboard do Railway, clique no serviço **MySQL** (não o ez-clip-ai)
2. Clique na aba **"Variables"**

### Passo 2: Copiar o Valor de MYSQL_URL

1. **Encontre a variável `MYSQL_URL`**
2. **Clique nela** (ou no ícone de copiar ao lado)
3. **Copie o valor completo** (parece: `mysql://user:password@host:port/database`)
   - Se estiver oculto (*******), **clique para revelar**
   - Ou me diga as variáveis individuais: MYSQLHOST, MYSQLPORT, MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD

### Passo 3: Adicionar no Serviço ez-clip-ai

1. **Volte para o dashboard** (clique no nome do projeto)
2. **Clique no serviço `ez-clip-ai`**
3. **Vá em "Variables"**
4. **Clique em "Add"** ou **"+ New Variable"**
5. **Preencha:**
   - **Variable Name:** `DATABASE_URL`
   - **Variable Value:** Cole o valor que você copiou de `MYSQL_URL`
6. **Clique em "Add"** ou **"Save"**

---

## ✅ OU: Usar Variável de Referência

No serviço `ez-clip-ai` → Variables → Add:

- **Variable Name:** `DATABASE_URL`
- **Variable Value:** `${{MySQL.MYSQL_URL}}`

Isso cria uma referência automática ao MySQL!

---

## 🎯 DEPOIS QUE ADICIONAR:

**Me avise e eu verifico se funcionou e aplico as migrations!**

---

**Avise quando terminar de adicionar a DATABASE_URL! 🚀**

