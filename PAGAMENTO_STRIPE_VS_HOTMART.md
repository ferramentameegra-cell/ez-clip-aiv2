# 💳 SISTEMA DE PAGAMENTO - STRIPE vs HOTMART

## 📋 SITUAÇÃO ATUAL

O sistema **EZ Clips AI** utiliza **Stripe** para processamento de pagamentos, **não Hotmart**.

---

## ✅ STRIPE (Implementado)

### **Status:** ✅ **IMPLEMENTADO E FUNCIONANDO**

**Arquivos relacionados:**
- `server/routers/payment.ts` - Router de pagamentos
- `package.json` - Dependência `stripe` instalada
- Variáveis de ambiente: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

**Funcionalidades:**
- ✅ Checkout do Stripe
- ✅ Webhooks para processar pagamentos
- ✅ Atualização de créditos após pagamento
- ✅ Histórico de transações

---

## ❌ HOTMART (Não Implementado)

### **Status:** ❌ **NÃO IMPLEMENTADO**

**Motivo:** O sistema foi desenvolvido usando Stripe, que é mais adequado para SaaS e assinaturas recorrentes.

**Se Hotmart for necessário:**
- Seria necessário implementar integração com Hotmart API
- Substituir ou adicionar ao lado do Stripe
- Configurar webhooks do Hotmart
- Atualizar frontend para usar Hotmart checkout

---

## 💡 RECOMENDAÇÃO

**Stripe é a melhor opção para este tipo de aplicação porque:**
- ✅ Melhor para assinaturas recorrentes (planos mensais)
- ✅ API moderna e bem documentada
- ✅ Suporte a múltiplos métodos de pagamento
- ✅ Dashboard completo para gerenciar pagamentos
- ✅ Webhooks confiáveis

**Hotmart é mais adequado para:**
- Produtos digitais únicos
- Cursos online
- Afiliados

---

## 📝 PRÓXIMOS PASSOS

Se Hotmart for requisito obrigatório:
1. Implementar integração com Hotmart API
2. Criar router de pagamento Hotmart
3. Atualizar frontend para suportar ambos
4. Configurar variáveis de ambiente

**Caso contrário:** Manter Stripe como sistema de pagamento principal.

---

**Última atualização:** 2025-01-27

