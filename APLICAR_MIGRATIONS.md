# 🗄️ Como Aplicar Migrations no Railway

## ⚠️ Problema Identificado

A `DATABASE_URL` está usando o hostname interno do Railway (`mysql.railway.internal`), que só funciona **dentro do Railway**, não do seu computador.

## ✅ SOLUÇÃO: Aplicar Migrations Dentro do Railway

### Opção 1: Via Shell do Railway (Recomendado)

1. **No terminal, execute:**

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
export PATH="$HOME/.local/bin:$PATH"
railway shell
```

2. **Dentro do shell do Railway, execute:**

```bash
npm run db:push
```

3. **Aguarde alguns segundos**
4. **Se aparecer "✓ Push successful", está pronto! ✅**

---

### Opção 2: Usar MYSQL_PUBLIC_URL (Se Disponível)

1. **No dashboard Railway, no serviço MySQL:**
   - Vá em **"Variables"**
   - Procure por **`MYSQL_PUBLIC_URL`** (URL pública)
   - **Copie o valor**

2. **Adicione no serviço ez-clip-ai:**
   - Vá em **"Variables"**
   - Adicione ou edite **`DATABASE_URL`**
   - Use a **`MYSQL_PUBLIC_URL`** ao invés da interna
   - Salve

3. **Depois execute localmente:**

```bash
railway run npm run db:push
```

---

### Opção 3: Via Railway Run com Variável Temporária

Execute no terminal:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
export PATH="$HOME/.local/bin:$PATH"
railway run -- npm run db:push
```

---

## 🎯 Depois que as Migrations Funcionarem

As tabelas serão criadas automaticamente no banco MySQL do Railway!

---

## 🆘 Se Ainda Não Funcionar

**Me diga o erro que aparecer e eu ajudo a resolver!**

---

**Tente a Opção 1 primeiro (railway shell) - é a mais simples! 🚀**

