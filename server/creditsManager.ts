import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

// Lista de emails de administradores que nunca pagam créditos
const ADMIN_EMAILS = [
  'daniel.braun@hotmail.com',
  'josyasborba@hotmail.com',
].map(email => email.toLowerCase()); // Normalizar para lowercase

/**
 * Verifica se o usuário é um administrador que não paga créditos
 */
export async function isAdminUser(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const [user] = await db
    .select({ 
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return false;

  // Verificar se é admin pelo role
  if (user.role === 'admin') {
    return true;
  }

  // Verificar se o email está na lista de admins
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return true;
  }

  return false;
}

/**
 * Decrementa créditos do usuário após processar job
 * Não debita créditos para administradores
 */
export async function decrementUserCredits(userId: number, quantity: number = 1): Promise<void> {
  // Verificar se é admin - se for, não debita créditos
  const isAdmin = await isAdminUser(userId);
  if (isAdmin) {
    console.log(`[Credits] Usuário ${userId} é administrador - créditos não serão debitados`);
    return;
  }

  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(users)
    .set({ credits: sql`credits - ${quantity}` })
    .where(eq(users.id, userId));

  console.log(`[Credits] Usuário ${userId} perdeu ${quantity} crédito(s)`);
}

/**
 * Verifica se usuário tem créditos suficientes
 * Administradores sempre têm créditos suficientes
 */
export async function hasEnoughCredits(userId: number, amount: number = 1): Promise<boolean> {
  // Verificar se é admin - se for, sempre tem créditos
  const isAdmin = await isAdminUser(userId);
  if (isAdmin) {
    console.log(`[Credits] Usuário ${userId} é administrador - créditos ilimitados`);
    return true;
  }

  const db = await getDb();
  if (!db) return false;

  const user = await db
    .select({ credits: users.credits })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return (user[0]?.credits || 0) >= amount;
}

