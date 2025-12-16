# 🔧 Correção: Timeout de 30 Segundos no Login

## 📋 Problema

O login estava dando timeout após 30 segundos, indicando que a requisição demorava mais que o esperado para responder.

---

## ✅ Correções Implementadas

### 1. **Timeout na Obtenção de Conexão do Pool** (`server/db.ts`)

#### Problema:
- Ao obter conexão do pool, se o banco estivesse lento ou o pool esgotado, poderia travar indefinidamente

#### Solução:
```typescript
// Timeout de 10 segundos ao obter conexão
const connectionPromise = pool.getConnection();
const timeoutPromise = new Promise<never>((_, reject) => {
  setTimeout(() => {
    reject(new Error('Timeout ao obter conexão do pool (10s)'));
  }, 10000);
});

const connection = await Promise.race([connectionPromise, timeoutPromise]);
```

#### Benefícios:
- ✅ **Falha rápida** - Não trava indefinidamente
- ✅ **Logs claros** - Identifica se o problema é no pool
- ✅ **Feedback ao usuário** - Erro claro em vez de timeout genérico

---

### 2. **Timeout na Query SQL** (`server/auth.ts`)

#### Problema:
- Query SQL poderia demorar indefinidamente se o banco estivesse lento ou sem índice

#### Solução:
```typescript
// Timeout de 10 segundos na query
const queryPromise = connection.execute('SELECT ... WHERE email = ?', [email]);
const timeoutPromise = new Promise<never>((_, reject) => {
  setTimeout(() => {
    reject(new Error('Timeout na query SQL (10s)'));
  }, 10000);
});

const [rows] = await Promise.race([queryPromise, timeoutPromise]);
```

#### Benefícios:
- ✅ **Query não trava** - Timeout garante resposta em 10s
- ✅ **Logs detalhados** - Identifica se query está lenta
- ✅ **Aviso de performance** - Alerta se query demorar > 2s

---

### 3. **Timeout do Frontend Aumentado** (`client/src/lib/trpc-client.tsx`)

#### Mudança:
- **Antes:** 30 segundos
- **Depois:** 60 segundos

#### Motivo:
- Dar mais tempo para o backend processar
- Permitir que timeouts do backend (10s cada) sejam executados
- Evitar timeout prematuro do frontend

#### Código:
```typescript
const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos
```

---

### 4. **Logs Detalhados Adicionados**

#### Logs Implementados:
- `[DB] 🔄 Tentando obter conexão do pool...`
- `[DB] ✅ Conexão obtida do pool: XXXms`
- `[Auth] 🔍 Executando query SQL...`
- `[Auth] ✅ Query executada: XXXms`
- `[DB] ⚠️ Conexão do pool demorou XXXms` (se > 2s)
- `[Auth] ⚠️ Query demorou XXXms` (se > 2s)

#### Benefícios:
- ✅ **Rastreabilidade** - Identifica exatamente onde está travando
- ✅ **Performance** - Logs de duração em cada etapa
- ✅ **Debugging** - Facilita identificar problemas

---

### 5. **Verificação de Saúde do Pool** (`server/db.ts`)

#### Nova Função:
```typescript
export async function checkPoolHealth(): Promise<{
  healthy: boolean;
  message: string;
  duration: number;
}>
```

#### Benefícios:
- ✅ **Monitoramento** - Verifica se pool está funcionando
- ✅ **Diagnóstico** - Identifica problemas de conexão
- ✅ **Health Check** - Endpoint `/health` agora verifica banco

---

### 6. **Health Check Melhorado** (`server/index.ts`)

#### Antes:
```typescript
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

#### Depois:
```typescript
app.get('/health', async (_req, res) => {
  const dbHealth = await checkPoolHealth();
  res.json({ 
    status: dbHealth.healthy ? 'ok' : 'degraded',
    database: {
      healthy: dbHealth.healthy,
      message: dbHealth.message,
      responseTime: `${dbHealth.duration}ms`,
    },
  });
});
```

#### Benefícios:
- ✅ **Verificação real** - Testa conexão com banco
- ✅ **Status claro** - Indica se banco está acessível
- ✅ **Tempo de resposta** - Mostra latência do banco

---

## 🎯 Como Funciona Agora

### Fluxo de Login com Timeouts:

1. **Frontend envia requisição** (timeout: 60s)
   ↓
2. **Backend recebe requisição**
   ↓
3. **Obter conexão do pool** (timeout: 10s)
   - Se demorar > 10s → Erro claro
   - Log: `[DB] ✅ Conexão obtida do pool: XXXms`
   ↓
4. **Executar query SQL** (timeout: 10s)
   - Se demorar > 10s → Erro claro
   - Log: `[Auth] ✅ Query executada: XXXms`
   ↓
5. **Verificar senha** (bcrypt - rápido)
   ↓
6. **Gerar token JWT** (rápido)
   ↓
7. **Retornar resposta** (< 1s normalmente)

### Tempo Total Esperado:
- **Normal:** < 1 segundo
- **Com problemas:** < 20 segundos (10s pool + 10s query)
- **Timeout máximo:** 60 segundos (frontend)

---

## 🔍 Como Verificar se Funcionou

### 1. **Verificar Logs do Railway**

Após o deploy, verifique os logs:

```
[DB] 🔄 Tentando obter conexão do pool...
[DB] ✅ Conexão obtida do pool: 50ms
[Auth] 🔍 Executando query SQL...
[Auth] ✅ Query executada: 120ms
[Auth] ✅ Login concluído: 170ms
```

### 2. **Testar Health Check**

Acesse: `https://seu-site.railway.app/health`

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "database": {
    "healthy": true,
    "message": "Pool de conexões está saudável",
    "responseTime": "150ms"
  }
}
```

### 3. **Testar Login**

- Login deve responder em < 1 segundo (normal)
- Se houver problemas, erro claro em < 20 segundos
- Não deve mais dar timeout de 30s

---

## ⚠️ Possíveis Causas do Timeout

### 1. **Banco de Dados Lento**
- **Sintoma:** Logs mostram query demorando > 2s
- **Solução:** Verificar índice na coluna `email` da tabela `users`
- **Verificar:** `SHOW INDEX FROM users;`

### 2. **Pool Esgotado**
- **Sintoma:** Logs mostram "Conexão do pool demorou > 2s"
- **Solução:** Aumentar `connectionLimit` no pool
- **Verificar:** Número de conexões ativas no banco

### 3. **DATABASE_URL Incorreta**
- **Sintoma:** Erro "ECONNREFUSED" ou "ETIMEDOUT"
- **Solução:** Verificar `DATABASE_URL` no Railway
- **Verificar:** Usar `MYSQL_PUBLIC_URL` (não `mysql.railway.internal`)

### 4. **Banco Não Acessível**
- **Sintoma:** Health check retorna `healthy: false`
- **Solução:** Verificar se MySQL está rodando no Railway
- **Verificar:** Railway Dashboard → MySQL Service

---

## 📊 Melhorias de Performance

### Antes:
- ⏱️ Timeout: 30s (muito curto)
- ⏱️ Sem timeout no pool (pode travar)
- ⏱️ Sem timeout na query (pode travar)
- ⏱️ Sem logs detalhados

### Depois:
- ⏱️ Timeout: 60s (adequado)
- ⏱️ Timeout no pool: 10s (falha rápida)
- ⏱️ Timeout na query: 10s (falha rápida)
- ⏱️ Logs detalhados em cada etapa

---

## 🚀 Deploy

### Status:
- ✅ Correções aplicadas
- ✅ Commit realizado
- ✅ Push para GitHub
- ⏳ Deploy automático no Railway (em andamento)

### Próximos Passos:
1. Aguardar deploy no Railway (5-10 minutos)
2. Verificar logs após deploy
3. Testar login novamente
4. Verificar health check

---

## 📚 Referências

- **MySQL2 Pool**: https://github.com/sidorares/node-mysql2#using-connection-pools
- **Promise.race()**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
- **AbortController**: https://developer.mozilla.org/en-US/docs/Web/API/AbortController

---

**Correções aplicadas!** 🎉

O timeout de 30 segundos deve estar resolvido. Os timeouts agora são mais adequados e os logs ajudam a identificar problemas rapidamente.

