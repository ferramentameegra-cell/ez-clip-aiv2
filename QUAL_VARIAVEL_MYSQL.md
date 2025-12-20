# 🔍 Qual Variável MySQL Usar para DATABASE_URL?

## ✅ Resposta: Use `MYSQL_URL`

O código da aplicação usa `DATABASE_URL`, então você precisa:

1. **Copiar o valor de `MYSQL_URL`** do serviço MySQL
2. **Adicionar como `DATABASE_URL`** no serviço principal

---

## 📋 Passo a Passo

### 1️⃣ No Serviço MySQL (Railway)

1. Clique no serviço MySQL no Railway
2. Vá em **Variables**
3. Encontre a variável **`MYSQL_URL`**
4. **Copie o valor completo**
   - Formato: `mysql://root:senha@host:port/database`
   - Exemplo: `mysql://root:abc123@containers-us-west-123.railway.app:5432/railway`

---

### 2️⃣ No Serviço Principal (Sua Aplicação)

1. Clique no serviço principal (ez-clip-aiv2)
2. Vá em **Variables**
3. Clique em **"New Variable"**
4. Configure:
   - **Key:** `DATABASE_URL`
   - **Value:** (cole o valor de `MYSQL_URL` que você copiou)
5. Clique em **"Add"**

---

## 🔍 Explicação das Variáveis MySQL

Quando você cria um MySQL no Railway, ele fornece várias variáveis:

| Variável | O Que É | Usar Para |
|----------|---------|-----------|
| **`MYSQL_URL`** | ✅ **URL completa de conexão** | **Copiar para DATABASE_URL** |
| `MYSQL_PUBLIC_URL` | URL pública (para conexões externas) | Não usar (apenas se precisar conectar de fora) |
| `MYSQL_HOST` | Apenas o host | Não usar |
| `MYSQL_PORT` | Apenas a porta | Não usar |
| `MYSQL_USER` | Apenas o usuário | Não usar |
| `MYSQL_PASSWORD` | Apenas a senha | Não usar |
| `MYSQL_DATABASE` | Apenas o nome do banco | Não usar |
| `MYSQL_ROOT_PASSWORD` | Senha do root | Não usar |

**✅ Use apenas `MYSQL_URL` - ela já tem tudo junto!**

---

## ✅ Formato Esperado

O `DATABASE_URL` deve estar no formato:

```
mysql://usuario:senha@host:porta/database
```

Exemplo:
```
mysql://root:abc123def456@containers-us-west-123.railway.app:5432/railway
```

A variável `MYSQL_URL` já vem nesse formato correto! ✅

---

## 🚀 Resumo Rápido

1. MySQL → Variables → **Copiar `MYSQL_URL`**
2. Serviço Principal → Variables → **Adicionar `DATABASE_URL`** = (valor copiado)
3. ✅ Pronto!

---

**Resposta:** Use `MYSQL_URL` e copie o valor para `DATABASE_URL` no serviço principal! 🎯
