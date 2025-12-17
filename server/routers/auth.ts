import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { createUser, loginUser, getUserById } from '../auth';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { storagePut } from '../storage';
import { randomBytes } from 'crypto';

export const authRouter = router({
  // Cadastro
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
      name: z.string().min(2),
      language: z.enum(['pt-BR', 'es', 'en']).optional(),
    }))
    .mutation(async ({ input }) => {
      const startTime = Date.now();
      console.log('[Auth] 📝 Iniciando cadastro:', { email: input.email, name: input.name });
      
      // Validar DATABASE_URL antes de processar
      if (!process.env.DATABASE_URL) {
        console.error('[Auth] ❌ DATABASE_URL não configurada');
        const error = new Error('Serviço temporariamente indisponível. Tente novamente em alguns instantes.');
        (error as any).code = 'SERVICE_UNAVAILABLE';
        (error as any).httpStatus = 503;
        throw error;
      }
      
      try {
        console.log('[Auth] 📞 Chamando createUser...');
        const user = await createUser({
          email: input.email,
          password: input.password,
          name: input.name,
          language: input.language,
        });

        console.log('[Auth] ✅ Usuário criado:', { userId: user.id, email: user.email });

        // Gerar token
        const { generateToken } = await import('../auth');
        const token = generateToken(user.id, user.email || '');
        console.log('[Auth] ✅ Token gerado');

        const duration = Date.now() - startTime;
        console.log('[Auth] ✅ Cadastro concluído com sucesso:', {
          userId: user.id,
          duration: `${duration}ms`,
        });

        // Garantir que todos os valores sejam serializáveis
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
      } catch (error: any) {
        const duration = Date.now() - startTime;
        
        // Identificar tipo de erro para retornar status HTTP adequado
        let httpStatus = 500;
        let errorMessage = 'Erro ao criar conta';
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || 
            error.code === 'ENOTFOUND' || error.message?.includes('timeout') ||
            error.code === 'PROTOCOL_CONNECTION_LOST') {
          // Erro de conexão com banco
          httpStatus = 503;
          errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
          console.error('[Auth] ❌ Erro de conexão com banco de dados:', {
            error: error.message,
            code: error.code,
            duration: `${duration}ms`,
            email: input.email,
          });
        } else if (error.message?.includes('já cadastrado') || 
                   error.message?.includes('already exists') ||
                   error.message?.includes('duplicate')) {
          // Email já cadastrado
          httpStatus = 400;
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
          console.warn('[Auth] ⚠️ Email já cadastrado:', {
            email: input.email,
            duration: `${duration}ms`,
          });
        } else if (error.message?.includes('Database not available')) {
          // Banco não disponível
          httpStatus = 503;
          errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
          console.error('[Auth] ❌ Banco de dados não disponível:', {
            error: error.message,
            duration: `${duration}ms`,
            email: input.email,
          });
        } else {
          // Outros erros
          console.error('[Auth] ❌ Erro no cadastro:', {
            error: error.message,
            code: error.code,
            stack: error.stack?.substring(0, 500),
            duration: `${duration}ms`,
            email: input.email,
          });
        }
        
        // Criar erro com status HTTP
        const tRPCError = new Error(errorMessage);
        (tRPCError as any).code = error.code || 'INTERNAL_SERVER_ERROR';
        (tRPCError as any).httpStatus = httpStatus;
        throw tRPCError;
      }
    }),

  // Login
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const requestId = `login-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const startTime = Date.now();
      
      // LOG 1: Início da requisição
      console.log(`[Auth] [${requestId}] 🔐 INÍCIO - Login iniciado:`, { 
        email: input.email,
        timestamp: new Date().toISOString(),
      });
      logger.info(`[Auth] [${requestId}] ➡️ Requisição de login recebida`);
      
      // Validar variáveis de ambiente CRÍTICAS
      if (!process.env.DATABASE_URL) {
        console.error(`[Auth] [${requestId}] ❌ DATABASE_URL não configurada`);
        logger.error(`[Auth] [${requestId}] ❌ DATABASE_URL não configurada`);
        const error = new Error('Serviço temporariamente indisponível. Tente novamente em alguns instantes.');
        (error as any).code = 'SERVICE_UNAVAILABLE';
        (error as any).httpStatus = 503;
        throw error;
      }
      
      if (!process.env.JWT_SECRET) {
        console.error(`[Auth] [${requestId}] ❌ JWT_SECRET não configurado`);
        logger.error(`[Auth] [${requestId}] ❌ JWT_SECRET não configurado`);
        const error = new Error('Serviço temporariamente indisponível. Tente novamente em alguns instantes.');
        (error as any).code = 'SERVICE_UNAVAILABLE';
        (error as any).httpStatus = 503;
        throw error;
      }
      
      // LOG 2: Variáveis validadas
      console.log(`[Auth] [${requestId}] ✅ Variáveis de ambiente validadas`);
      
      try {
        // LOG 3: Antes de chamar loginUser
        console.log(`[Auth] [${requestId}] 📞 Chamando loginUser...`);
        logger.info(`[Auth] [${requestId}] 📞 Chamando loginUser...`);
        
        // Timeout global de 30 segundos para toda a operação de login
        const loginPromise = loginUser(input.email, input.password);
        const globalTimeout = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Timeout: Login excedeu 30 segundos'));
          }, 30000);
        });
        
        const result = await Promise.race([loginPromise, globalTimeout]);
        
        // LOG 4: loginUser retornou
        console.log(`[Auth] [${requestId}] ✅ loginUser retornou com sucesso:`, { 
          userId: result.user.id,
          hasToken: !!result.token,
          duration: `${Date.now() - startTime}ms`,
        });
        logger.info(`[Auth] [${requestId}] ✅ loginUser retornou com sucesso`);
        
        // Garantir que todos os valores sejam serializáveis
        const response = {
          user: {
            id: result.user.id,
            email: result.user.email || null,
            name: result.user.name || null,
            credits: result.user.credits ?? 0,
            language: result.user.language || 'pt-BR',
            avatarUrl: result.user.avatarUrl || null,
          },
          token: result.token,
        };
        
        const duration = Date.now() - startTime;
        
        // LOG 5: Antes de retornar resposta
        console.log(`[Auth] [${requestId}] ✅ RETORNANDO RESPOSTA - Login concluído:`, {
          userId: response.user.id,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        });
        logger.info(`[Auth] [${requestId}] ✅ Login concluído com sucesso: ${duration}ms`);
        
        return response;
      } catch (error: any) {
        const duration = Date.now() - startTime;
        
        // LOG 6: Erro capturado
        console.error(`[Auth] [${requestId}] ❌ ERRO CAPTURADO:`, {
          error: error.message,
          code: error.code,
          stack: error.stack?.substring(0, 300),
          duration: `${duration}ms`,
          email: input.email,
          timestamp: new Date().toISOString(),
        });
        logger.error(`[Auth] [${requestId}] ❌ Erro no login:`, {
          error: error.message,
          code: error.code,
          duration: `${duration}ms`,
        });
        
        // Identificar tipo de erro para retornar status HTTP adequado
        let httpStatus = 500;
        let errorMessage = 'Erro ao fazer login';
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || 
            error.code === 'ENOTFOUND' || error.message?.includes('timeout') ||
            error.message?.includes('Timeout') || error.code === 'PROTOCOL_CONNECTION_LOST') {
          // Erro de conexão com banco
          httpStatus = 503;
          errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
          console.error(`[Auth] [${requestId}] ❌ Erro de conexão com banco de dados`);
          logger.error(`[Auth] [${requestId}] ❌ Erro de conexão com banco de dados`);
        } else if (error.message === 'Email ou senha incorretos' || 
                   error.message === 'Conta criada com outro método de login') {
          // Erro de autenticação (não é erro do servidor)
          httpStatus = 401;
          errorMessage = error.message;
          console.warn(`[Auth] [${requestId}] ⚠️ Credenciais inválidas`);
          logger.warn(`[Auth] [${requestId}] ⚠️ Credenciais inválidas`);
        } else {
          // Outros erros
          console.error(`[Auth] [${requestId}] ❌ Erro interno no login`);
          logger.error(`[Auth] [${requestId}] ❌ Erro interno no login`);
        }
        
        // LOG 7: Antes de lançar erro
        console.log(`[Auth] [${requestId}] 🚨 LANÇANDO ERRO - Status: ${httpStatus}, Mensagem: ${errorMessage}`);
        
        // Criar erro com status HTTP
        const tRPCError = new Error(errorMessage);
        (tRPCError as any).code = error.code || 'INTERNAL_SERVER_ERROR';
        (tRPCError as any).httpStatus = httpStatus;
        throw tRPCError;
      }
    }),

  // Obter perfil do usuário
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;

      const user = await getUserById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        language: user.language,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        acceptedTerms: user.acceptedTerms || false,
        tiktokUsername: user.tiktokUsername,
        instagramUsername: user.instagramUsername,
        youtubeChannelId: user.youtubeChannelId,
        youtubeShortsEnabled: user.youtubeShortsEnabled,
        onboardingAt: user.onboardingAt || null,
        onboardingUseCase: user.onboardingUseCase || null,
        onboardingNiche: user.onboardingNiche || null,
        role: user.role || 'user',
      };
    }),

  // Atualizar perfil
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(2).optional(),
      bio: z.string().optional(),
      language: z.enum(['pt-BR', 'es', 'en']).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      await db
        .update(users)
        .set({
          ...(input.name && { name: input.name }),
          ...(input.bio !== undefined && { bio: input.bio }),
          ...(input.language && { language: input.language }),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true };
    }),

  // Aceitar termos de uso
  acceptTerms: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      await db
        .update(users)
        .set({
          acceptedTerms: true,
          acceptedTermsAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true };
    }),

  // Upload de foto de perfil
  uploadAvatar: protectedProcedure
    .input(z.object({
      file: z.any(), // File object
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      // Converter File para Buffer
      const fileBuffer = Buffer.from(await input.file.arrayBuffer());
      const fileExtension = input.file.name.split('.').pop() || 'jpg';
      const avatarKey = `avatars/${userId}/${randomBytes(16).toString('hex')}.${fileExtension}`;

      // Upload para S3
      const { url: avatarUrl } = await storagePut(
        avatarKey,
        fileBuffer,
        input.file.type || 'image/jpeg'
      );

      // Atualizar no banco
      await db
        .update(users)
        .set({
          avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { avatarUrl };
    }),

  // Atualizar redes sociais
  updateSocialMedia: protectedProcedure
    .input(z.object({
      tiktokUsername: z.string().optional(),
      instagramUsername: z.string().optional(),
      youtubeChannelId: z.string().optional(),
      youtubeShortsEnabled: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const userId = ctx.user.id;

      await db
        .update(users)
        .set({
          ...(input.tiktokUsername !== undefined && { tiktokUsername: input.tiktokUsername }),
          ...(input.instagramUsername !== undefined && { instagramUsername: input.instagramUsername }),
          ...(input.youtubeChannelId !== undefined && { youtubeChannelId: input.youtubeChannelId }),
          ...(input.youtubeShortsEnabled !== undefined && { youtubeShortsEnabled: input.youtubeShortsEnabled }),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true };
    }),
});

