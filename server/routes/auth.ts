/**
 * Rotas de Autenticação - Nova Estrutura Simplificada
 * Endpoint: POST /auth/login
 * Timeout máximo: 3 segundos
 */

import { Router, Request, Response } from 'express';
import { logger } from '../lib/logger';
import { processLogin, LoginCredentials } from '../services/authService';

const router = Router();
const LOGIN_TIMEOUT_MS = 15000; // 15 segundos (Railway pode ser mais lento)

/**
 * Endpoint de login
 */
router.post('/login', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  logger.info(`[Auth] [${requestId}] ➡️ Requisição de login recebida`);
  console.log('[Auth] Login iniciado:', req.body.email);

  // Timeout global de 3 segundos
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      logger.error(`[Auth] [${requestId}] ❌ TIMEOUT: Requisição excedeu ${LOGIN_TIMEOUT_MS}ms`);
      res.status(500).json({
        success: false,
        error: 'Timeout: A requisição demorou mais de 3 segundos',
        requestId,
      });
    }
  }, LOGIN_TIMEOUT_MS);

  try {
    // Extrair credenciais
    const credentials: LoginCredentials = {
      email: req.body.email,
      password: req.body.password,
    };

    // Processar login
    const result = await processLogin(credentials, requestId);

    // Limpar timeout
    clearTimeout(timeoutId);

    // Verificar se resposta já foi enviada
    if (res.headersSent) {
      logger.warn(`[Auth] [${requestId}] ⚠️ Resposta já foi enviada`);
      return;
    }

    // Retornar resposta baseada no resultado
    if (result.success && result.user && result.token) {
      const duration = Date.now() - startTime;
      logger.info(`[Auth] [${requestId}] ✅ Login bem-sucedido: ${duration}ms`);
      
      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
        requestId,
      });
    } else {
      // Determinar status HTTP baseado no erro
      let statusCode = 500;
      if (result.error?.includes('Email') || result.error?.includes('Senha')) {
        statusCode = 400;
      } else if (result.error?.includes('incorretos') || result.error?.includes('método')) {
        statusCode = 401;
      }

      const duration = Date.now() - startTime;
      logger.warn(`[Auth] [${requestId}] ⚠️ Login falhou: ${result.error} (${duration}ms)`);
      
      res.status(statusCode).json({
        success: false,
        error: result.error || 'Erro ao fazer login',
        requestId,
      });
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    
    logger.error(`[Auth] [${requestId}] ❌ Erro inesperado:`, {
      error: error.message,
      stack: error.stack?.substring(0, 500),
      duration: `${duration}ms`,
    });

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        requestId,
      });
    }
  }
});

export default router;
