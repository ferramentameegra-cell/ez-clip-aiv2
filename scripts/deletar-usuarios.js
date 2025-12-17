/**
 * Script para deletar usuários específicos do banco de dados
 * Emails: josyasborba@hotmail.com e daniel.braun@hotmail.com
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não está configurada');
  process.exit(1);
}

const emailsParaDeletar = [
  'josyasborba@hotmail.com',
  'daniel.braun@hotmail.com',
];

async function deletarUsuarios() {
  let connection = null;

  try {
    console.log('🔌 Conectando ao banco de dados...');
    
    // Parse da URL
    const url = new URL(DATABASE_URL.replace(/^mysql:\/\//, 'http://'));
    const host = url.hostname;
    const port = parseInt(url.port || '3306');
    const user = url.username;
    const password = url.password;
    const database = url.pathname.replace(/^\//, '');

    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
    });

    console.log('✅ Conectado ao banco de dados');
    console.log('');

    // Verificar usuários antes de deletar
    console.log('🔍 Verificando usuários antes de deletar...');
    const [usersAntes] = await connection.execute(
      'SELECT id, email, name, role, credits, created_at FROM users WHERE email IN (?, ?)',
      emailsParaDeletar
    );

    if (usersAntes.length === 0) {
      console.log('⚠️  Nenhum usuário encontrado com esses emails');
      return;
    }

    console.log(`📋 Encontrados ${usersAntes.length} usuário(s):`);
    usersAntes.forEach((user: any) => {
      console.log(`   - ID: ${user.id}, Email: ${user.email}, Nome: ${user.name || 'N/A'}, Role: ${user.role}, Créditos: ${user.credits}`);
    });
    console.log('');

    // Deletar usuários
    console.log('🗑️  Deletando usuários...');
    for (const email of emailsParaDeletar) {
      const [result] = await connection.execute(
        'DELETE FROM users WHERE email = ?',
        [email]
      );
      const affectedRows = (result as any).affectedRows;
      if (affectedRows > 0) {
        console.log(`   ✅ Usuário ${email} deletado (${affectedRows} linha(s) afetada(s))`);
      } else {
        console.log(`   ⚠️  Usuário ${email} não encontrado`);
      }
    }
    console.log('');

    // Verificar se foram deletados
    console.log('🔍 Verificando se foram deletados...');
    const [usersDepois] = await connection.execute(
      'SELECT id, email, name FROM users WHERE email IN (?, ?)',
      emailsParaDeletar
    );

    if (usersDepois.length === 0) {
      console.log('✅ Todos os usuários foram deletados com sucesso!');
    } else {
      console.log('⚠️  Ainda existem usuários:');
      usersDepois.forEach((user: any) => {
        console.log(`   - ${user.email}`);
      });
    }

  } catch (error: any) {
    console.error('❌ Erro ao deletar usuários:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('');
      console.log('🔌 Conexão fechada');
    }
  }
}

deletarUsuarios();

