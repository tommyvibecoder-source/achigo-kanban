import { neon } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_n2RSlc4IOKwu@ep-super-scene-b2frl220-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function check() {
  const sql = neon(connectionString);
  const projects = await sql`SELECT * FROM projects`;
  const members = await sql`SELECT * FROM team_members`;
  const ideas = await sql`SELECT id, title, stage FROM ideas`;

  console.log('--- NEON DATABASE CONTENTS ---');
  console.log('PROJECTS:', projects);
  console.log('MEMBERS:', members);
  console.log('IDEAS COUNT:', ideas.length, ideas);
}

check().catch(console.error);
