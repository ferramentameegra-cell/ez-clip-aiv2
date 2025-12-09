import { mysqlTable, int, varchar, text, timestamp, boolean, mysqlEnum, json } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  openId: varchar('open_id', { length: 64 }).unique(), // Opcional para OAuth
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }), // Para login com senha
  loginMethod: varchar('login_method', { length: 50 }).default('email'), // 'email', 'google', 'github', etc
  role: mysqlEnum('role', ['user', 'admin']).default('user').notNull(),
  credits: int('credits').default(0).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 256 }).unique(), // ID do cliente no Stripe
  acceptedTerms: boolean('accepted_terms').default(false),
  acceptedTermsAt: timestamp('accepted_terms_at'),
  language: mysqlEnum('language', ['pt-BR', 'es', 'en']).default('pt-BR'),
  // Onboarding
  onboardingUseCase: text('onboarding_use_case'), // Para que você usará o site?
  onboardingNiche: varchar('onboarding_niche', { length: 255 }), // Qual é o seu nicho?
  onboardingAt: timestamp('onboarding_at'), // Quando completou o onboarding
  // Perfil
  avatarUrl: text('avatar_url'), // URL da foto de perfil
  bio: text('bio'), // Biografia do usuário
  // Redes sociais
  tiktokUsername: varchar('tiktok_username', { length: 255 }),
  instagramUsername: varchar('instagram_username', { length: 255 }),
  youtubeChannelId: varchar('youtube_channel_id', { length: 255 }),
  youtubeShortsEnabled: boolean('youtube_shorts_enabled').default(false),
  // Tokens OAuth (criptografados em produção)
  youtubeAccessToken: text('youtube_access_token'),
  youtubeRefreshToken: text('youtube_refresh_token'),
  tiktokAccessToken: text('tiktok_access_token'),
  tiktokRefreshToken: text('tiktok_refresh_token'),
  instagramAccessToken: text('instagram_access_token'),
  instagramRefreshToken: text('instagram_refresh_token'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  lastSignedIn: timestamp('last_signed_in'),
});

export const jobs = mysqlTable('jobs', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  sourceUrl: text('source_url'), // YouTube URL
  startTime: int('start_time'), // Tempo de início do trecho selecionado (em segundos)
  endTime: int('end_time'), // Tempo de fim do trecho selecionado (em segundos)
  status: mysqlEnum('status', ['pending', 'downloading', 'transcribing', 'cutting', 'rendering', 'completed', 'failed']).default('pending').notNull(),
  // Sistema de pacotes sequenciais
  packageSize: int('package_size'), // 5, 10, 50, 100
  targetDurationSec: int('target_duration_sec'), // Duração alvo por clipe
  overlapSec: varchar('overlap_sec', { length: 10 }), // 0.4-2.0 (decimal como string)
  segmentationMode: varchar('segmentation_mode', { length: 20 }), // fixed, semantic, hybrid
  durationTolerance: varchar('duration_tolerance', { length: 10 }), // 0.1 (10%)
  // Configurações existentes
  clipDuration: int('clip_duration').default(60), // Mantido para compatibilidade
  withSubtitles: boolean('with_subtitles').default(true),
  withRetention: boolean('with_retention').default(false),
  vertical: varchar('vertical', { length: 50 }),
  secondaryContentType: varchar('secondary_content_type', { length: 50 }),
  secondaryContentId: int('secondary_content_id'),
  headline: varchar('headline', { length: 100 }),
  layoutType: mysqlEnum('layout_type', ['side-by-side', 'top-bottom']).default('top-bottom'),
  totalClips: int('total_clips'),
  progress: int('progress').default(0),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const clips = mysqlTable('clips', {
  id: int('id').autoincrement().primaryKey(),
  jobId: int('job_id').notNull(),
  clipNumber: int('clip_number').notNull(),
  videoKey: varchar('video_key', { length: 255 }),
  videoUrl: text('video_url'),
  thumbnailKey: varchar('thumbnail_key', { length: 255 }),
  thumbnailUrl: text('thumbnail_url'),
  startTime: int('start_time'),
  endTime: int('end_time'),
  duration: int('duration'),
  retentionScore: int('retention_score'),
  transcriptionText: text('transcription'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const scheduledPosts = mysqlTable('scheduled_posts', {
  id: int('id').autoincrement().primaryKey(),
  clipId: int('clip_id').notNull(),
  userId: int('user_id').notNull(),
  platform: mysqlEnum('platform', ['youtube', 'tiktok', 'instagram', 'facebook']).notNull(),
  scheduledTime: timestamp('scheduled_time').notNull(),
  status: mysqlEnum('status', ['pending', 'published', 'failed', 'cancelled']).default('pending').notNull(),
  platformPostId: varchar('platform_post_id', { length: 255 }),
  errorMessage: text('error_message'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const retentionVideos = mysqlTable('retention_videos', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id'),
  vertical: varchar('vertical', { length: 50 }),
  name: varchar('name', { length: 255 }),
  videoKey: varchar('video_key', { length: 255 }),
  videoUrl: text('video_url'),
  duration: int('duration'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const genericEmojis = mysqlTable('generic_emojis', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }),
  emoji: varchar('emoji', { length: 10 }),
  videoKey: varchar('video_key', { length: 255 }),
  videoUrl: text('video_url'),
  category: varchar('category', { length: 50 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tabelas para Stripe (subscriptions e creditLedgers)
export const subscriptions = mysqlTable('subscriptions', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 256 }).notNull(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 256 }).unique().notNull(),
  priceId: varchar('price_id', { length: 256 }).notNull(),
  planKey: varchar('plan_key', { length: 256 }).notNull(),
  billingInterval: varchar('billing_interval', { length: 256 }).notNull(),
  status: varchar('status', { length: 256 }).notNull(),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const creditLedgers = mysqlTable('credit_ledgers', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  delta: int('delta').notNull(), // Pode ser positivo (crédito) ou negativo (débito)
  reason: varchar('reason', { length: 256 }).notNull(), // Motivo: 'Pagamento', 'Uso de crédito', etc
  meta: json('meta'), // Metadata adicional (invoiceId, planKey, etc)
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

