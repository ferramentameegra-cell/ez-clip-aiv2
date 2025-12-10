# ⚡ Início Rápido - Rodar Localmente

## ✅ Checklist Rápido

- [x] Arquivo `.env` já existe
- [ ] Dependências instaladas?
- [ ] MySQL rodando?
- [ ] Tabelas criadas?
- [ ] FFmpeg instalado?
- [ ] Redis instalado? (opcional)

---

## 🚀 Comandos Rápidos (Execute na Ordem)

### 1. Instalar Dependências
```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
npm install
```

### 2. Verificar/Iniciar MySQL
```bash
# Verificar se está rodando
brew services list | grep mysql

# Se não estiver, iniciar:
brew services start mysql

# Criar banco (se não existir)
mysql -u root -e "CREATE DATABASE IF NOT EXISTS viral_clips_ai;"
```

### 3. Criar Tabelas no Banco
```bash
npm run db:push
```

### 4. Verificar FFmpeg
```bash
ffmpeg -version
# Se não tiver: brew install ffmpeg
```

### 5. Verificar Redis (Opcional)
```bash
redis-cli ping
# Se não tiver: brew install redis && brew services start redis
```

### 6. Rodar o Projeto
```bash
npm run dev:all
```

Isso inicia:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001

---

## 🎯 Acessar o Site

Abra no navegador:
```
http://localhost:3000
```

---

## 📝 Notas Importantes

1. **Arquivo `.env` já existe** - Não precisa criar, mas verifique se está correto
2. **MySQL** - Precisa estar rodando antes de iniciar o backend
3. **Redis** - Opcional, mas recomendado para fila de jobs
4. **FFmpeg** - Obrigatório para processar vídeos

---

## 🐛 Se Der Erro

### MySQL não conecta
```bash
brew services restart mysql
mysql -u root -e "SHOW DATABASES;"
```

### Porta em uso
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou na porta 3001
lsof -ti:3001 | xargs kill -9
```

### Dependências faltando
```bash
npm install
```

---

## 📚 Documentação Completa

Para mais detalhes, veja: `COMO_RODAR_LOCALMENTE.md`

