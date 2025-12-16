/**
 * Rate Limiting Middleware usando Redis
 * Implementação customizada compatível com express-rate-limit
 */

import rateLimit from 'express-rate-limit';
import { bullRedis } from '../lib/jobQueue';
import { logger } from '../lib/logger';
import type { Request } from 'express';

// Store customizado para express-rate-limit usando ioredis
class RedisStore {
  private client: typeof bullRedis;
  private prefix: string;

  constructor(client: typeof bullRedis, prefix: string = 'rl:') {
    this.client = client;
    this.prefix = prefix;
  }

  async increment(key: string) {
    const fullKey = `${this.prefix}${key}`;
    const result = await this.client.incr(fullKey);
    return { totalHits: result };
  }

  async decrement(key: string) {
    const fullKey = `${this.prefix}${key}`;
    await this.client.decr(fullKey);
  }

  async resetKey(key: string) {
    const fullKey = `${this.prefix}${key}`;
    await this.client.del(fullKey);
  }
}

// Função helper para extrair IP do request
const getIpFromRequest = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0])
    : req.ip || req.socket.remoteAddress || 'unknown';
  return ip.trim();
};

// Rate limiter global (100 requests por 15 minutos)
export const globalLimiter = rateLimit({
  store: new RedisStore(bullRedis, 'rl:global:') as any,
  keyGenerator: (req) => getIpFromRequest(req),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests
  message: 'Muitas requisições, tente novamente mais tarde',
  standardHeaders: true, // Retorna rate limit info nos headers
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP ${req.ip}`);
    res.status(429).json({ error: 'Too many requests' });
  },
});

// Rate limiter para criação de jobs (10 jobs por hora por usuário)
export const jobCreationLimiter = rateLimit({
  store: new RedisStore(bullRedis, 'rl:jobs:') as any,
  keyGenerator: (req) => {
    const userId = (req as any).user?.id;
    return userId ? `user:${userId}` : `ip:${getIpFromRequest(req)}`;
  },
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 jobs por hora
  message: 'Limite de jobs atingido. Aguarde antes de criar novos jobs.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const userId = (req as any).user?.id;
    logger.warn(`Job creation limit exceeded for user ${userId || req.ip}`);
    res.status(429).json({ 
      error: 'Job creation limit exceeded',
      message: 'Você atingiu o limite de jobs por hora. Tente novamente mais tarde.',
    });
  },
});

// Rate limiter para uploads (5 uploads por hora)
export const uploadLimiter = rateLimit({
  store: new RedisStore(bullRedis, 'rl:upload:') as any,
  keyGenerator: (req) => {
    const userId = (req as any).user?.id;
    return userId ? `user:${userId}` : `ip:${getIpFromRequest(req)}`;
  },
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 uploads por hora
  message: 'Limite de uploads atingido',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const userId = (req as any).user?.id;
    logger.warn(`Upload limit exceeded for user ${userId || req.ip}`);
    res.status(429).json({ 
      error: 'Upload limit exceeded',
      message: 'Você atingiu o limite de uploads por hora.',
    });
  },
});

// Rate limiter para autenticação (5 tentativas por 15 minutos)
export const authLimiter = rateLimit({
  store: new RedisStore(bullRedis, 'rl:auth:') as any,
  keyGenerator: (req) => getIpFromRequest(req),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Auth limit exceeded for IP ${req.ip}`);
    res.status(429).json({ 
      error: 'Too many login attempts',
      message: 'Muitas tentativas de login. Aguarde 15 minutos antes de tentar novamente.',
    });
  },
});

