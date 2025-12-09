#!/usr/bin/env node

/**
 * Script para adicionar 1000 créditos para os emails de admin
 * Execute: node scripts/adicionar-creditos-admins.js
 */

const mysql = require('mysql2/promise');

const ADMIN_EMAILS = [
  'josyasborba@hotmail.com',
  'daniel.braun@hotmail.com',
];

const CREDITS_TO_ADD = 1000;

async function addCredits() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  try {
    console.log('🔧 Adicionando créditos para admins...\n');

    for (const email of ADMIN_EMAILS) {
      const [result] = await connection.execute(
        'UPDATE users SET credits = credits + ?, updated_at = NOW() WHERE email = ?',
        [CREDITS_TO_ADD, email.toLowerCase()]
      );

      if (result.affectedRows === 0) {
        console.log(`⚠️  Email não encontrado: ${email}`);
      } else {
        // Buscar créditos atuais
        const [rows] = await connection.execute(
          'SELECT name, email, credits FROM users WHERE email = ?',
          [email.toLowerCase()]
        );

        const user = rows[0];
        console.log(`✅ ${user.name || email}: ${user.credits} créditos`);
      }
    }

    console.log('\n✅ Créditos adicionados com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

addCredits();

