import { neon } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_n2RSlc4IOKwu@ep-super-scene-b2frl220-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function migrate() {
  const sql = neon(connectionString);
  console.log('Running column migration on Neon...');

  await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS is_quick_task BOOLEAN DEFAULT FALSE;`;
  await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS requires_consensus BOOLEAN DEFAULT TRUE;`;
  await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS assignee_id VARCHAR(64);`;

  console.log('✅ Neon migration complete!');
}

migrate().catch(console.error);
