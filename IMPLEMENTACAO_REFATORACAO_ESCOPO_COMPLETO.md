# 🚀 REFATORAÇÃO COMPLETA - ESCOPO E IMPLEMENTAÇÃO

## ⚠️ IMPORTANTE: REFATORAÇÃO MASSIVA

Esta refatoração muda **COMPLETAMENTE** o fluxo do site.

---

## 📋 O QUE JÁ FOI FEITO:

### ✅ Arquivos Base Criados:
1. ✅ `client/src/tokens/colors.ts` - Design tokens (Indigo, Roxo, Pink)
2. ✅ `client/src/locales/pt-BR.json` - Todas as traduções completas
3. ✅ Backup: `client/src/pages/Home.old.tsx`

---

## 🔄 O QUE SERÁ IMPLEMENTADO:

### 1. Sistema Base:
- [ ] `client/src/i18n.ts` - Configuração react-i18next
- [ ] `client/src/contexts/ThemeContext.tsx` - Dark mode
- [ ] Atualizar `client/src/main.tsx` - Providers

### 2. Páginas Novas/Refatoradas:
- [ ] `client/src/pages/Home.tsx` - **NOVA Landing Page** (marketing)
- [ ] `client/src/pages/Login.tsx` - **REFATORADO** (sem proposta de valor)
- [ ] `client/src/pages/Signup.tsx` - **NOVO** (página completa)
- [ ] `client/src/pages/Dashboard.tsx` - **NOVO** (com formulário de jobs da Home antiga)

### 3. Atualizações:
- [ ] `client/src/App.tsx` - Rotas atualizadas
- [ ] `package.json` - Dependências (i18next, react-i18next, framer-motion)

---

## ⚡ MUDANÇA CRÍTICA:

**ANTES:**
- `/` = Formulário de criação de jobs (área interna)

**DEPOIS:**
- `/` = Landing Page (marketing/vendas)
- `/dashboard` = Formulário de criação de jobs

---

## 📦 DEPENDÊNCIAS NECESSÁRIAS:

```bash
pnpm add i18next react-i18next framer-motion
pnpm add -D @types/react-i18next
```

---

**Vou implementar tudo agora de forma sistemática. Esta refatoração é MASSIVA mas necessária para o novo fluxo UX/UI.**

