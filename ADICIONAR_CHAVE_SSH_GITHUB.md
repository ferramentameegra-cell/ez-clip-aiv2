# 🔑 Adicionar Chave SSH no GitHub - Passo a Passo

## ⚠️ Problema

A chave SSH não está adicionada no GitHub ainda. Precisamos adicionar.

---

## 🚀 Passo a Passo Completo

### Passo 1: Abrir Página de SSH Keys no GitHub

**Acesse este link:**
👉 https://github.com/settings/ssh/new

---

### Passo 2: Copiar Sua Chave SSH

**Execute no terminal:**

```bash
cat ~/.ssh/id_ed25519.pub
```

**Você vai ver:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFhCvU5S6ZXFv0zzBHJVXxiEBH5k5TolJOoVrBGEt6Ek cipe-dashboard@example.com
```

**COPIE TODO O TEXTO** (da linha inteira).

---

### Passo 3: Adicionar no GitHub

Na página que você abriu (https://github.com/settings/ssh/new):

1. **Title:**
   - Digite: `Meu Mac - ez-clip-ai`

2. **Key:**
   - Cole a chave que você copiou (toda a linha)

3. **Clique:** "Add SSH key" (botão verde)

---

### Passo 4: Verificar

Depois de adicionar, você deve ver:
- ✅ Mensagem de sucesso
- ✅ Sua chave aparecendo na lista

---

### Passo 5: Fazer Push

**Execute no terminal:**

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
git push origin main
```

**Agora deve funcionar sem pedir senha!** ✅

---

## 🎯 Comandos Rápidos

```bash
# 1. Ver chave SSH
cat ~/.ssh/id_ed25519.pub

# 2. Fazer push (depois de adicionar no GitHub)
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
git push origin main
```

---

## ✅ Sua Chave SSH (Já Copiada para Você)

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFhCvU5S6ZXFv0zzBHJVXxiEBH5k5TolJOoVrBGEt6Ek cipe-dashboard@example.com
```

**Cole essa chave no GitHub!**

---

## 📋 Resumo

1. ✅ Remote já está configurado para SSH
2. ⏳ Você precisa adicionar a chave SSH no GitHub
3. ⏳ Depois fazer push

**Adicione a chave e depois execute `git push origin main`!** 🚀

