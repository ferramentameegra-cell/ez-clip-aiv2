# 🌐 Usar URL Pública do MySQL

## ⚠️ Problema:

A URL `mysql.railway.internal` só funciona **dentro do Railway**, não do seu computador.

## ✅ SOLUÇÃO: Usar MYSQL_PUBLIC_URL

### Passo 1: Copiar URL Pública do MySQL

1. **No dashboard Railway:**
   - Clique no serviço **MySQL**
   - Vá em **"Variables"**
   - Procure por **`MYSQL_PUBLIC_URL`**
   - **Copie o valor completo** (parece: `mysql://user:pass@ballast.proxy.rlwy.net:port/database`)

### Passo 2: Atualizar DATABASE_URL no ez-clip-ai

1. **Clique no serviço `ez-clip-ai`**
2. **Vá em "Variables"**
3. **Encontre a variável `DATABASE_URL`**
4. **Edite ela** (clique no ícone de editar ou clique na variável)
5. **Substitua o valor** pela **`MYSQL_PUBLIC_URL`** que você copiou
6. **Salve**

### Passo 3: Aplicar Migrations (Agora Vai Funcionar!)

Depois de atualizar para a URL pública, execute:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
export PATH="$HOME/.local/bin:$PATH"
railway run -- npm run db:push
```

**Agora deve funcionar! ✅**

---

## 🔄 OU: Deixar Aplicar Automaticamente no Deploy

Se não conseguir aplicar manualmente, podemos configurar para aplicar automaticamente quando fizer deploy no Railway.

**Me avise quando copiar a MYSQL_PUBLIC_URL e atualizar a DATABASE_URL! 🚀**

