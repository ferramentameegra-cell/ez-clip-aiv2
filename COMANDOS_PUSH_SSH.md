# 🚀 Push Manual SEM Token - Comandos Prontos

## ✅ Você Já Tem Chave SSH!

Sua chave SSH:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFhCvU5S6ZXFv0zzBHJVXxiEBH5k5TolJOoVrBGEt6Ek cipe-dashboard@example.com
```

---

## 📋 Passo a Passo

### Passo 1: Adicionar Chave SSH no GitHub

1. **Acesse:** https://github.com/settings/ssh/new

2. **Preencha:**
   - **Title:** `Meu Mac - ez-clip-ai`
   - **Key:** Cole esta chave:
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFhCvU5S6ZXFv0zzBHJVXxiEBH5k5TolJOoVrBGEt6Ek cipe-dashboard@example.com
   ```

3. **Clique:** "Add SSH key"

---

### Passo 2: Mudar Remote para SSH

**Execute no terminal:**

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
git remote set-url origin git@github.com:ferramentameegra-cell/ez-clip-ai.git
```

---

### Passo 3: Verificar Remote

```bash
git remote -v
```

**Deve mostrar:** `git@github.com:ferramentameegra-cell/ez-clip-ai.git`

---

### Passo 4: Fazer Push

```bash
git push origin main
```

**Não vai pedir senha nem token!** ✅

---

## 🎯 Comandos em Sequência

**Copie e cole no terminal:**

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
git remote set-url origin git@github.com:ferramentameegra-cell/ez-clip-ai.git
git remote -v
git push origin main
```

---

## ⚠️ Se Der Erro

**Se aparecer "Permission denied":**
- Verifique se a chave SSH foi adicionada no GitHub
- Acesse: https://github.com/settings/ssh
- Veja se sua chave está lá

**Se não estiver:**
- Adicione ela em: https://github.com/settings/ssh/new

---

## ✅ Depois do Push

1. ✅ GitHub recebe código
2. ✅ Railway detecta mudanças
3. ✅ Deploy automático inicia
4. ✅ Site atualiza!

---

**Primeiro adicione a chave SSH no GitHub, depois execute os comandos!** 🚀

