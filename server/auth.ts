import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * Hash de senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Verifica senha
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
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
 * Verifica token JWT
 */
export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Busca usuário por email
 * Usa SQL direto para evitar problemas com colunas que podem não existir ainda
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Tentar com todas as colunas (incluindo onboarding)
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] || null;
  } catch (error: any) {
    // Se der erro por colunas não existentes, usar SQL direto
    if (error.message?.includes('onboarding') || error.code === 'ER_BAD_FIELD_ERROR') {
      const connection = await import('mysql2/promise');
      const mysqlDb = await connection.default.createConnection({
        uri: process.env.DATABASE_URL,
      });

      const [rows] = await mysqlDb.execute(
        `SELECT id, open_id, name, email, password_hash, login_method, role, credits, 
         accepted_terms, accepted_terms_at, language, avatar_url, bio,
         tiktok_username, instagram_username, youtube_channel_id, youtube_shorts_enabled,
         youtube_access_token, youtube_refresh_token, tiktok_access_token, tiktok_refresh_token,
         instagram_access_token, instagram_refresh_token,
         created_at, updated_at, last_signed_in
         FROM users WHERE email = ?`,
        [email]
      );

      await mysqlDb.end();

      const row = (rows as any[])[0];
      if (!row) return null;

      // Converter snake_case para camelCase
      return {
        id: row.id,
        openId: row.open_id,
        name: row.name,
        email: row.email,
        passwordHash: row.password_hash,
        loginMethod: row.login_method,
        role: row.role,
        credits: row.credits,
        acceptedTerms: row.accepted_terms,
        acceptedTermsAt: row.accepted_terms_at,
        language: row.language,
        avatarUrl: row.avatar_url,
        bio: row.bio,
        tiktokUsername: row.tiktok_username,
        instagramUsername: row.instagram_username,
        youtubeChannelId: row.youtube_channel_id,
        youtubeShortsEnabled: row.youtube_shorts_enabled,
        youtubeAccessToken: row.youtube_access_token,
        youtubeRefreshToken: row.youtube_refresh_token,
        tiktokAccessToken: row.tiktok_access_token,
        tiktokRefreshToken: row.tiktok_refresh_token,
        instagramAccessToken: row.instagram_access_token,
        instagramRefreshToken: row.instagram_refresh_token,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        lastSignedIn: row.last_signed_in,
        onboardingUseCase: null,
        onboardingNiche: null,
        onboardingAt: null,
      };
    }

    throw error;
  }
}

/**
 * Busca usuário por ID
 * Usa SQL direto para evitar problemas com colunas que podem não existir ainda
 */
export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Tentar com todas as colunas (incluindo onboarding)
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0] || null;
  } catch (error: any) {
    // Se der erro por colunas não existentes, usar SQL direto
    if (error.message?.includes('onboarding') || error.code === 'ER_BAD_FIELD_ERROR') {
      const connection = await import('mysql2/promise');
      const mysqlDb = await connection.default.createConnection({
        uri: process.env.DATABASE_URL,
      });

      const [rows] = await mysqlDb.execute(
        `SELECT id, open_id, name, email, password_hash, login_method, role, credits, 
         accepted_terms, accepted_terms_at, language, avatar_url, bio,
         tiktok_username, instagram_username, youtube_channel_id, youtube_shorts_enabled,
         youtube_access_token, youtube_refresh_token, tiktok_access_token, tiktok_refresh_token,
         instagram_access_token, instagram_refresh_token,
         created_at, updated_at, last_signed_in
         FROM users WHERE id = ?`,
        [userId]
      );

      await mysqlDb.end();

      const row = (rows as any[])[0];
      if (!row) return null;

      // Converter snake_case para camelCase
      return {
        id: row.id,
        openId: row.open_id,
        name: row.name,
        email: row.email,
        passwordHash: row.password_hash,
        loginMethod: row.login_method,
        role: row.role,
        credits: row.credits,
        acceptedTerms: row.accepted_terms,
        acceptedTermsAt: row.accepted_terms_at,
        language: row.language,
        avatarUrl: row.avatar_url,
        bio: row.bio,
        tiktokUsername: row.tiktok_username,
        instagramUsername: row.instagram_username,
        youtubeChannelId: row.youtube_channel_id,
        youtubeShortsEnabled: row.youtube_shorts_enabled,
        youtubeAccessToken: row.youtube_access_token,
        youtubeRefreshToken: row.youtube_refresh_token,
        tiktokAccessToken: row.tiktok_access_token,
        tiktokRefreshToken: row.tiktok_refresh_token,
        instagramAccessToken: row.instagram_access_token,
        instagramRefreshToken: row.instagram_refresh_token,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        lastSignedIn: row.last_signed_in,
        onboardingUseCase: null,
        onboardingNiche: null,
        onboardingAt: null,
      };
    }

    throw error;
  }
}

/**
 * Cria novo usuário
 */
export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  language?: 'pt-BR' | 'es' | 'en';
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Verificar se email já existe
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Hash da senha
  const passwordHash = await hashPassword(data.password);

  // Criar usuário
  const result = await db.insert(users).values({
    email: data.email,
    passwordHash,
    name: data.name,
    loginMethod: 'email',
    credits: 3, // 3 créditos grátis
    language: data.language || 'pt-BR',
    acceptedTerms: false,
  });

  const userId = Number(result[0].insertId);
  const user = await getUserById(userId);

  if (!user) throw new Error('Erro ao criar usuário');

  return user;
}

/**
 * Login com email e senha
 */
export async function loginUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Email ou senha incorretos');
  }

  if (!user.passwordHash) {
    throw new Error('Conta criada com outro método de login');
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Email ou senha incorretos');
  }

  // Atualizar último login
  const db = await getDb();
  if (db) {
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));
  }

  // Gerar token
  const token = generateToken(user.id, user.email || '');

  return {
    user: {
      id: user.id,
      email: user.email || null,
      name: user.name || null,
      credits: user.credits ?? 0,
      language: user.language || 'pt-BR',
      avatarUrl: user.avatarUrl || null,
    },
    token,
  };
}

