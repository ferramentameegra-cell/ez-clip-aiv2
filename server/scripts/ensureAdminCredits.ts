/**
 * Script para garantir que admins tenham 10000 créditos
 * Executar após deploy ou manualmente via admin panel
 */

import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq, inArray } from 'drizzle-orm';

const ADMIN_EMAILS = [
  'daniel.braun@hotmail.com',
  'josyasborba@hotmail.com',
].map(e => e.toLowerCase());

export async function ensureAdminCredits() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const normalizedEmails = ADMIN_EMAILS;
  
  // Buscar usuários admin
  const adminUsers = await db
    .select()
    .from(users)
    .where(inArray(users.email, normalizedEmails));

  // Atualizar créditos para 10000
  for (const user of adminUsers) {
    if (user.credits < 10000) {
      await db
        .update(users)
        .set({ credits: 10000 })
        .where(eq(users.id, user.id));
      
      console.log(`✅ ${user.email}: Créditos atualizados para 10000`);
    } else {
      console.log(`ℹ️  ${user.email}: Já tem ${user.credits} créditos`);
    }
  }

  return adminUsers.length;
}

