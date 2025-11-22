# 📋 Como Copiar DATABASE_URL do MySQL

## 🎯 Passo a Passo:

### 1. Abra a aba "Variables" do MySQL

No mesmo lugar onde você está (configurações do MySQL):

1. **Na parte superior da tela**, você vê várias abas:
   - Deployments
   - Database
   - Backups
   - **Variables** ← **CLIQUE AQUI**
   - Metrics
   - Settings

2. **Clique na aba "Variables"**

---

### 2. Encontrar DATABASE_URL

Na aba Variables, você verá uma lista de variáveis. Procure por:

- **`MYSQLDATABASE`** - Nome do banco
- **`MYSQLUSER`** - Usuário
- **`MYSQLPASSWORD`** - Senha
- **`MYSQLHOST`** - Host
- **`MYSQLPORT`** - Porta
- **`DATABASE_URL`** ← **Esta é a que precisamos!**

**Ou pode aparecer como:**
- **`MYSQL_URL`**
- **`MYSQL_DATABASE_URL`**
- Ou uma URL completa tipo: `mysql://user:pass@host:port/database`

---

### 3. Copiar a URL

1. **Encontre a variável `DATABASE_URL`** (ou similar)
2. **Clique nela** ou **clique no ícone de copiar** ao lado
3. **Copie o valor completo**

---

### 4. Adicionar no Serviço ez-clip-ai

1. **Volte para o dashboard principal** (clique no nome do projeto no topo)
2. **Clique no serviço `ez-clip-ai`** (não o MySQL)
3. **Clique na aba "Variables"** do serviço `ez-clip-ai`
4. **Clique em "+ New Variable"** ou **"+ Add Variable"**
5. **Nome:** `DATABASE_URL`
6. **Valor:** Cole a URL que você copiou do MySQL
7. **Clique em "Add"** ou **"Save"**

---

## 🔄 Repetir para Redis (Se você adicionou)

1. **Clique no serviço Redis**
2. **Vá em "Variables"**
3. **Procure por `REDIS_URL`** (ou `REDIS_URL`, `REDIS_ADDR`)
4. **Copie o valor**
5. **Volte para o serviço `ez-clip-ai`**
6. **Adicione a variável `REDIS_URL`** com o valor copiado

---

## ✅ Depois que adicionar

**Me avise e eu aplico as migrations automaticamente!**

---

## 🆘 Se não encontrar DATABASE_URL nas Variables

Pode estar em outra seção:

1. **Tente a aba "Database"** do MySQL
2. Ou **aba "Settings"** → procure por "Connection" ou "URL"
3. Ou me diga quais variáveis aparecem na aba "Variables" do MySQL

---

**Avise quando tiver copiado a DATABASE_URL ou me diga quais variáveis aparecem! 🚀**

