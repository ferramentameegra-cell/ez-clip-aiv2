# 🔐 Guia Rápido - Criar Tokens para Automação

## ✅ Passo a Passo Rápido

---

## 1️⃣ Criar Token GitHub (5 minutos)

### Passo 1: Acessar
```
https://github.com/settings/tokens
```

### Passo 2: Gerar Token
1. Clique em **"Generate new token"** → **"Generate new token (classic)"**
2. **Note:** `ez-clip-ai-automation`
3. **Expiration:** Escolha (90 dias, 1 ano, ou sem expiração)
4. **Scopes:** Marque ✅ **repo** (todas as sub-opções)
5. Clique em **"Generate token"**
6. **⚠️ COPIE O TOKEN AGORA!** (você só vê uma vez)
   - Exemplo: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 2️⃣ Configurar Git com Token

### Opção A: Token no URL (Rápido)

```bash
git remote set-url origin https://ghp_SEU_TOKEN_AQUI@github.com/ferramentameegra-cell/ez-clips-aiv2.git
```

### Opção B: SSH (Mais Seguro - Recomendado)

Se você já tem SSH configurado:

```bash
git remote set-url origin git@github.com:ferramentameegra-cell/ez-clips-aiv2.git
```

---

## 3️⃣ Testar Push

```bash
# Verificar remote
git remote -v

# Fazer push
git push origin main
```

Se usar token no URL, não precisa digitar senha.

Se usar SSH, deve funcionar automaticamente.

---

## 4️⃣ Usar Script Automatizado

Depois de configurar o token, use o script:

```bash
./automatizar-tudo.sh
```

O script vai:
- ✅ Fazer commit de mudanças
- ✅ Fazer push para GitHub
- ✅ Fazer deploy no Railway (se CLI estiver instalado)

---

## 🔒 Guardar Token com Segurança

Crie `.env.local` (já está no .gitignore):

```bash
# .env.local (NÃO COMMITAR!)
GITHUB_TOKEN=ghp_SEU_TOKEN_AQUI
```

O script `automatizar-tudo.sh` vai usar este token automaticamente.

---

## ✅ Checklist Rápido

- [ ] Token GitHub criado (https://github.com/settings/tokens)
- [ ] Token copiado e guardado
- [ ] Git configurado (token ou SSH)
- [ ] Push testado
- [ ] Script automatizado funcionando

---

## 🚀 Executar Agora

1. **Criar token:** https://github.com/settings/tokens
2. **Configurar Git:**
   ```bash
   git remote set-url origin https://ghp_SEU_TOKEN@github.com/ferramentameegra-cell/ez-clip-aiv2.git
   ```
3. **Testar:**
   ```bash
   git push origin main
   ```
4. **Automatizar:**
   ```bash
   ./automatizar-tudo.sh
   ```

---

## 📚 Documentação Completa

Veja `CRIAR_TOKENS_AUTOMATIZACAO.md` para guia detalhado.

---

**Próximo passo:** Criar o token GitHub agora! 🚀
