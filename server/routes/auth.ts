/**
 * Sistema de Login REST - Completamente Refeito
 * Endpoint: POST /auth/login
 * Timeout máximo: 3 segundos
 * Sem conexões criadas dentro da rota
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPoolConnection } from '../db';
import { logger } from '../lib/logger';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const LOGIN_TIMEOUT_MS = 3000; // 3 segundos máximo

/**
 * Valida email
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Login endpoint - Completamente novo e robusto
 */
router.post('/login', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  logger.info(`[Auth] [${requestId}] ➡️ Requisição de login recebida`);

  // Criar timeout para garantir resposta em 3 segundos
  const timeoutId = setTimeout(() => {
    logger.error(`[Auth] [${requestId}] ❌ TIMEOUT: Requisição excedeu ${LOGIN_TIMEOUT_MS}ms`);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Timeout: A requisição demorou mais de 3 segundos',
        requestId,
      });
    }
  }, LOGIN_TIMEOUT_MS);

  try {
    // 1. Validar entrada
    const { email, password } = req.body;

    if (!email || typeof email !== 'string') {
      clearTimeout(timeoutId);
      logger.warn(`[Auth] [${requestId}] ⚠️ Email não fornecido`);
      return res.status(400).json({
        success: false,
        error: 'Email é obrigatório',
        requestId,
      });
    }

    if (!password || typeof password !== 'string') {
      clearTimeout(timeoutId);
      logger.warn(`[Auth] [${requestId}] ⚠️ Senha não fornecida`);
      return res.status(400).json({
        success: false,
        error: 'Senha é obrigatória',
        requestId,
      });
    }

    const emailLower = email.trim().toLowerCase();

    if (!isValidEmail(emailLower)) {
      clearTimeout(timeoutId);
      logger.warn(`[Auth] [${requestId}] ⚠️ Email inválido: ${emailLower}`);
      return res.status(400).json({
        success: false,
        error: 'Email inválido',
        requestId,
      });
    }

    logger.info(`[Auth] [${requestId}] 🔍 Buscando usuário: ${emailLower}`);

    // 2. Buscar usuário no banco (com timeout)
    let connection: any = null;
    let user: any = null;

    try {
      const dbStartTime = Date.now();
      logger.info(`[Auth] [${requestId}] 🔄 Obtendo conexão do pool...`);
      
      // Timeout de 1 segundo para obter conexão
      const connectionPromise = getPoolConnection();
      const connectionTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout ao obter conexão do pool (1s)'));
        }, 1000);
      });

      connection = await Promise.race([connectionPromise, connectionTimeoutPromise]);
      const dbConnectTime = Date.now() - dbStartTime;
      logger.info(`[Auth] [${requestId}] ✅ Conexão obtida: ${dbConnectTime}ms`);

      // Query com timeout de 1.5 segundos
      const queryStartTime = Date.now();
      const queryPromise = connection.execute(
        `SELECT id, email, name, password_hash, login_method, role, credits, language, avatar_url
         FROM users 
         WHERE email = ? 
         LIMIT 1`,
        [emailLower]
      );

      const queryTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Query timeout (1.5s)'));
        }, 1500);
      });

      const [rows] = await Promise.race([queryPromise, queryTimeoutPromise]);
      const queryTime = Date.now() - queryStartTime;
      logger.info(`[Auth] [${requestId}] ✅ Query executada: ${queryTime}ms`);

      user = (rows as any[])[0];

      if (connection) {
        connection.release();
        connection = null;
      }
    } catch (dbError: any) {
      if (connection) {
        try {
          connection.release();
        } catch (releaseError) {
          // Ignorar erro ao liberar conexão
        }
        connection = null;
      }

      const dbDuration = Date.now() - startTime;
      logger.error(`[Auth] [${requestId}] ❌ Erro no banco de dados:`, {
        error: dbError.message,
        code: dbError.code,
        errno: dbError.errno,
        duration: `${dbDuration}ms`,
      });

      clearTimeout(timeoutId);
      
      // Se for timeout, retornar mensagem específica
      if (dbError.message?.includes('timeout') || dbError.message?.includes('Timeout')) {
        return res.status(500).json({
          success: false,
          error: 'Timeout: O banco de dados não respondeu a tempo',
          requestId,
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Erro ao conectar com o banco de dados',
        requestId,
      });
    }

    // 3. Verificar se usuário existe
    if (!user) {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      logger.warn(`[Auth] [${requestId}] ⚠️ Usuário não encontrado: ${duration}ms`);
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos',
        requestId,
      });
    }

    // 4. Verificar método de login
    if (user.login_method !== 'email') {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      logger.warn(`[Auth] [${requestId}] ⚠️ Conta criada com outro método: ${duration}ms`);
      return res.status(401).json({
        success: false,
        error: 'Esta conta foi criada com outro método de login',
        requestId,
      });
    }

    // 5. Verificar senha (com timeout)
    logger.info(`[Auth] [${requestId}] 🔐 Verificando senha...`);
    
    const passwordStartTime = Date.now();
    let passwordValid: boolean;
    
    try {
      // bcrypt.compare é rápido, mas adicionar timeout de segurança
      const passwordPromise = bcrypt.compare(password, user.password_hash);
      const passwordTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Password verification timeout (500ms)'));
        }, 500);
      });

      passwordValid = await Promise.race([passwordPromise, passwordTimeoutPromise]);
    } catch (error: any) {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      logger.error(`[Auth] [${requestId}] ❌ Erro ao verificar senha:`, {
        error: error.message,
        duration: `${duration}ms`,
      });
      return res.status(500).json({
        success: false,
        error: 'Erro ao verificar senha',
        requestId,
      });
    }

    const passwordTime = Date.now() - passwordStartTime;
    logger.info(`[Auth] [${requestId}] ✅ Verificação de senha: ${passwordTime}ms`);

    if (!passwordValid) {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      logger.warn(`[Auth] [${requestId}] ⚠️ Senha inválida: ${duration}ms`);
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos',
        requestId,
      });
    }

    // 6. Gerar token JWT
    logger.info(`[Auth] [${requestId}] 🎫 Gerando token...`);
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 7. Retornar sucesso
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    
    logger.info(`[Auth] [${requestId}] ✅ Login bem-sucedido: ${duration}ms`, {
      userId: user.id,
      email: user.email,
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          credits: user.credits || 0,
          language: user.language || 'pt-BR',
          avatarUrl: user.avatar_url || null,
        },
        token,
      },
      requestId,
    });
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

