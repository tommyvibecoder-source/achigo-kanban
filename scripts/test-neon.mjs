import { neon } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_n2RSlc4IOKwu@ep-super-scene-b2frl220-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function main() {
  console.log('Connecting to Neon PostgreSQL...');
  const sql = neon(connectionString);

  console.log('Creating tables in Neon...');
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      key_prefix VARCHAR(10) NOT NULL,
      description TEXT,
      color VARCHAR(30) DEFAULT '#0052CC',
      icon VARCHAR(50) DEFAULT 'FolderKanban',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS team_members (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      username VARCHAR(100) UNIQUE,
      email VARCHAR(255),
      role VARCHAR(255) NOT NULL,
      role_type VARCHAR(50) NOT NULL DEFAULT 'member',
      avatar VARCHAR(10) DEFAULT '👨‍💻',
      color VARCHAR(30) DEFAULT '#0052CC',
      passcode VARCHAR(255) NOT NULL,
      must_reset_passcode BOOLEAN DEFAULT TRUE
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ideas (
      id VARCHAR(64) PRIMARY KEY,
      issue_key VARCHAR(50) NOT NULL,
      project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      issue_type VARCHAR(50) NOT NULL DEFAULT 'feature',
      stage VARCHAR(50) NOT NULL DEFAULT 'backlog',
      priority VARCHAR(50) NOT NULL DEFAULT 'high',
      summary TEXT,
      target_audience TEXT,
      pain_point TEXT,
      proposed_solution TEXT,
      value_proposition TEXT,
      success_criteria JSONB DEFAULT '[]',
      founder_score JSONB DEFAULT '{"userImpact": 4, "marketUrgency": 4, "implementationSimplicity": 4, "strategicFit": 4}',
      author_id VARCHAR(64),
      tags JSONB DEFAULT '[]',
      votes JSONB DEFAULT '{}',
      comments JSONB DEFAULT '[]',
      manual_tests JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`;
  console.log('✅ Tables present in Neon DB:', tables.map(t => t.table_name));
}

main().catch(err => {
  console.error('Connection failed:', err);
  process.exit(1);
});
