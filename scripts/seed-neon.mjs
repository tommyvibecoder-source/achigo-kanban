import { neon } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_n2RSlc4IOKwu@ep-super-scene-b2frl220-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const initialProjects = [
  {
    id: 'proj-1',
    name: 'AchiGO Core Platform',
    key_prefix: 'ACH',
    description: 'Enterprise Tech Production Kanban & Spec Orchestration Engine',
    color: '#0052CC',
    icon: 'FolderKanban',
  },
  {
    id: 'proj-2',
    name: 'OmniFlow Automation',
    key_prefix: 'OMN',
    description: 'Autonomous workflow orchestration and multi-agent task dispatching',
    color: '#00875A',
    icon: 'FolderKanban',
  },
];

const initialTeamMembers = [
  {
    id: 'user-1',
    name: 'Zogo',
    username: 'zogo',
    email: 'zogo@achigo.tech',
    role: 'Co-Founder & CEO',
    role_type: 'founder',
    avatar: '👨‍💼',
    color: '#0052CC',
    passcode: 'zogo2026',
    must_reset_passcode: false,
  },
  {
    id: 'user-2',
    name: 'Achiri',
    username: 'achiri',
    email: 'achiri@achigo.tech',
    role: 'Co-Founder & Product Architect',
    role_type: 'founder',
    avatar: '🚀',
    color: '#6554C0',
    passcode: 'achiri2026',
    must_reset_passcode: false,
  },
  {
    id: 'user-3',
    name: 'David',
    username: 'david',
    email: 'david@achigo.tech',
    role: 'Lead Full-Stack Engineer',
    role_type: 'lead',
    avatar: '👨‍💻',
    color: '#00875A',
    passcode: 'david123',
    must_reset_passcode: true,
  },
  {
    id: 'user-4',
    name: 'Elena',
    username: 'elena',
    email: 'elena@achigo.tech',
    role: 'Principal UX & QA Engineer',
    role_type: 'member',
    avatar: '🎨',
    color: '#FF5630',
    passcode: 'elena123',
    must_reset_passcode: true,
  },
];

async function seed() {
  const sql = neon(connectionString);

  console.log('Seeding projects...');
  for (const p of initialProjects) {
    await sql`
      INSERT INTO projects (id, name, key_prefix, description, color, icon)
      VALUES (${p.id}, ${p.name}, ${p.key_prefix}, ${p.description}, ${p.color}, ${p.icon})
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  console.log('Seeding team members...');
  for (const m of initialTeamMembers) {
    await sql`
      INSERT INTO team_members (id, name, username, email, role, role_type, avatar, color, passcode, must_reset_passcode)
      VALUES (${m.id}, ${m.name}, ${m.username}, ${m.email}, ${m.role}, ${m.role_type}, ${m.avatar}, ${m.color}, ${m.passcode}, ${m.must_reset_passcode})
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  console.log('✅ Seed completed successfully in Neon DB!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
