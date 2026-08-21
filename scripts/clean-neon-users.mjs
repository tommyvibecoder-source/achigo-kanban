import { neon } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_n2RSlc4IOKwu@ep-super-scene-b2frl220-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function clean() {
  const sql = neon(connectionString);

  console.log('Removing David & Elena from Neon database...');
  await sql`DELETE FROM team_members WHERE id IN ('user-3', 'user-4') OR username IN ('david', 'elena');`;

  const remaining = await sql`SELECT id, name, username, role, role_type, passcode FROM team_members`;
  console.log('✅ Remaining Team Members in Neon:', remaining);
}

clean().catch(console.error);
