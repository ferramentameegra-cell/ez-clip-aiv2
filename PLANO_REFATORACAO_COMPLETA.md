# 🚀 PLANO DE REFATORAÇÃO COMPLETA - FLUXO UX/UI

## Status: Em Andamento

## Estrutura Atual vs Nova

### Estrutura Atual:
- `/` → Home.tsx (formulário de criação de jobs)
- `/login` → Login.tsx
- `/dashboard` → Não existe
- Sistema i18n customizado (shared/i18n.ts)

### Nova Estrutura:
- `/` → Landing Page (Home.tsx - marketing)
- `/login` → Login.tsx (refatorado)
- `/signup` → Signup.tsx (novo)
- `/dashboard` → Dashboard.tsx (novo - com formulário de jobs)

---

## Arquivos a Criar/Modificar

### ✅ Base (Design System)
1. `client/src/tokens/colors.ts` - Design tokens
2. Atualizar `client/src/index.css` - Cores customizadas

### ✅ I18n System
3. `client/src/locales/pt-BR.json` - Traduções completas
4. `client/src/i18n.ts` - Configuração i18next
5. Atualizar `client/src/main.tsx` - Provider i18n

### ✅ Theme System
6. `client/src/contexts/ThemeContext.tsx` - Dark mode

### ✅ Páginas
7. `client/src/pages/Home.tsx` - NOVA Landing Page
8. `client/src/pages/Login.tsx` - REFATORADO
9. `client/src/pages/Signup.tsx` - NOVO
10. `client/src/pages/Dashboard.tsx` - NOVO (com formulário)
11. Atualizar `client/src/App.tsx` - Rotas

### ✅ Dependências
- i18next
- react-i18next
- framer-motion

---

## Ordem de Implementação

1. ✅ Design tokens (colors.ts)
2. ✅ Traduções (pt-BR.json)
3. ✅ Sistema i18n (i18n.ts)
4. ✅ Theme Context
5. ✅ Landing Page
6. ✅ Login refatorado
7. ✅ Signup
8. ✅ Dashboard
9. ✅ App.tsx atualizado

---

**Iniciando implementação...**

