# 🌐 Como Gerar Domínio no Railway

## ✅ Passo a Passo Simples

---

## 🎯 Passo 1: Acessar Settings

1. No Railway Dashboard, clique no seu **serviço principal** (não no MySQL/Redis)
2. Clique em **"Settings"** (no menu lateral ou superior)

---

## 🎯 Passo 2: Ir para Domains

1. No menu de Settings, encontre a seção **"Domains"**
2. Clique nela

---

## 🎯 Passo 3: Gerar Domínio

1. Você verá um botão **"Generate Domain"** ou **"Add Domain"**
2. Clique nele
3. Railway vai gerar automaticamente um domínio como:
   - `https://ez-clip-aiv2-production.up.railway.app`
   - `https://ez-clip-aiv2-production-xxxxx.up.railway.app`

---

## 🎯 Passo 4: Copiar URL Gerada

1. **Anote a URL completa** que foi gerada
2. Exemplo: `https://ez-clip-aiv2-production.up.railway.app`

---

## 🎯 Passo 5: Configurar FRONTEND_URL

1. Volte para **Variables** (no mesmo serviço)
2. Clique em **"New Variable"**
3. Configure:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://seu-dominio.railway.app` (cole a URL gerada)
4. Clique em **"Add"**

---

## ✅ Pronto!

Agora seu site está acessível no domínio gerado!

---

## 📋 Localização Visual

```
Railway Dashboard
  └── Seu Projeto
      └── Seu Service (ez-clip-aiv2)
          └── Settings (menu lateral)
              └── Domains
                  └── Generate Domain (botão)
```

---

## 🔗 Exemplo de URL Gerada

Depois de gerar, você terá algo como:

```
https://ez-clip-aiv2-production.up.railway.app
```

Use essa URL para:
- ✅ Acessar seu site
- ✅ Configurar `FRONTEND_URL`
- ✅ Compartilhar com outros

---

## ⚠️ Importante

- O domínio é **gratuito** no Railway
- O domínio é **HTTPS** automaticamente
- O domínio é **permanente** (não muda)
- Você pode adicionar **domínio customizado** depois (opcional)

---

## 🚀 Próximos Passos

Depois de gerar o domínio:

1. ✅ Configurar `FRONTEND_URL` nas variáveis
2. ✅ Testar o site: `https://seu-dominio.railway.app`
3. ✅ Testar health: `https://seu-dominio.railway.app/health`

---

**Status:** ✅ **Guia completo para gerar domínio!**
