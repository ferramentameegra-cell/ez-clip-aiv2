/**
 * Serviço de Autenticação - Nova Estrutura Modular
 * Separação de responsabilidades: validação, autenticação e resposta
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPoolConnection } from '../db';
import { logger } from '../lib/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  credits: number;
  language: string;
  avatarUrl: string | null;
}

export interface LoginResult {
  success: boolean;
  user?: UserData;
  token?: string;
  error?: string;
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida credenciais de entrada
 */
export function validateCredentials(credentials: LoginCredentials): { valid: boolean; error?: string } {
  if (!credentials.email || typeof credentials.email !== 'string' || !credentials.email.trim()) {
    return { valid: false, error: 'Email é obrigatório' };
  }

  if (!credentials.password || typeof credentials.password !== 'string') {
    return { valid: false, error: 'Senha é obrigatória' };
  }

  const emailLower = credentials.email.trim().toLowerCase();
  if (!validateEmail(emailLower)) {
    return { valid: false, error: 'Email inválido' };
  }

  return { valid: true };
}

/**
 * Busca usuário no banco de dados
 */
export async function findUserByEmail(email: string, requestId: string): Promise<any | null> {
  let connection: any = null;
  
  try {
    const connectionPromise = getPoolConnection();
    const connectionTimeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao obter conexão (1s)')), 1000);
    });
    
    connection = await Promise.race([connectionPromise, connectionTimeout]);
    
    const queryPromise = connection.execute(
      `SELECT id, email, name, password_hash, login_method, role, credits, language, avatar_url
       FROM users 
       WHERE email = ? 
       LIMIT 1`,
      [email.toLowerCase()]
    );
    
    const queryTimeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout na query (1.5s)')), 1500);
    });
    
    const [rows] = await Promise.race([queryPromise, queryTimeout]);
    const user = (rows as any[])[0];
    
    return user || null;
  } catch (error: any) {
    logger.error(`[AuthService] [${requestId}] Erro ao buscar usuário:`, error.message);
    throw error;
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        // Ignorar erro ao liberar
      }
    }
  }
}

/**
 * Verifica senha do usuário
 */
export async function verifyPassword(password: string, hash: string, requestId: string): Promise<boolean> {
  try {
    const passwordPromise = bcrypt.compare(password, hash);
    const passwordTimeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout na verificação de senha (500ms)')), 500);
    });
    
    return await Promise.race([passwordPromise, passwordTimeout]);
  } catch (error: any) {
    logger.error(`[AuthService] [${requestId}] Erro ao verificar senha:`, error.message);
    throw error;
  }
}

/**
 * Gera token JWT
 */
export function generateToken(userId: number, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Processa login completo
 */
export async function processLogin(
  credentials: LoginCredentials,
  requestId: string
): Promise<LoginResult> {
  const startTime = Date.now();
  
  try {
    // 1. Validar entrada
    const validation = validateCredentials(credentials);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const emailLower = credentials.email.trim().toLowerCase();
    logger.info(`[AuthService] [${requestId}] Buscando usuário: ${emailLower}`);

    // 2. Buscar usuário
    const user = await findUserByEmail(emailLower, requestId);
    
    if (!user) {
      logger.warn(`[AuthService] [${requestId}] Usuário não encontrado`);
      return { success: false, error: 'Email ou senha incorretos' };
    }

    // 3. Verificar método de login
    if (user.login_method !== 'email') {
      logger.warn(`[AuthService] [${requestId}] Conta criada com outro método`);
      return { success: false, error: 'Esta conta foi criada com outro método de login' };
    }

    // 4. Verificar senha
    logger.info(`[AuthService] [${requestId}] Verificando senha...`);
    const passwordValid = await verifyPassword(credentials.password, user.password_hash, requestId);
    
    if (!passwordValid) {
      logger.warn(`[AuthService] [${requestId}] Senha inválida`);
      return { success: false, error: 'Email ou senha incorretos' };
    }

    // 5. Gerar token
    logger.info(`[AuthService] [${requestId}] Gerando token...`);
    const token = generateToken(user.id, user.email);

    // 6. Preparar dados do usuário
    const userData: UserData = {
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits || 0,
      language: user.language || 'pt-BR',
      avatarUrl: user.avatar_url || null,
    };

    const duration = Date.now() - startTime;
    logger.info(`[AuthService] [${requestId}] Login bem-sucedido: ${duration}ms`);

    return {
      success: true,
      user: userData,
      token,
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error(`[AuthService] [${requestId}] Erro no processamento:`, {
      error: error.message,
      duration: `${duration}ms`,
    });

    if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
      return { success: false, error: 'Timeout: O servidor não respondeu a tempo' };
    }

    return { success: false, error: 'Erro interno do servidor' };
  }
}

