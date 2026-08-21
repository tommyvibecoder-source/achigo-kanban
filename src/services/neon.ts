import { neon } from '@neondatabase/serverless';
import { Project, IdeaCard, TeamMember } from '../types';

const databaseUrl = (import.meta as any).env?.VITE_NEON_DATABASE_URL || '';

export const isNeonConfigured = (): boolean => {
  return Boolean(databaseUrl && databaseUrl.startsWith('postgres'));
};

const getSql = () => {
  if (!isNeonConfigured()) return null;
  return neon(databaseUrl);
};

export const neonService = {
  /**
   * Initializes PostgreSQL schema in Neon if tables do not exist
   */
  async initSchema(): Promise<boolean> {
    const sql = getSql();
    if (!sql) return false;

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS projects (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          key_prefix VARCHAR(10) NOT NULL,
          description TEXT,
          color VARCHAR(30),
          icon VARCHAR(50),
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
          role_type VARCHAR(50) NOT NULL,
          avatar VARCHAR(10),
          color VARCHAR(30),
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
          issue_type VARCHAR(50) NOT NULL,
          stage VARCHAR(50) NOT NULL,
          priority VARCHAR(50) NOT NULL,
          summary TEXT,
          target_audience TEXT,
          pain_point TEXT,
          proposed_solution TEXT,
          value_proposition TEXT,
          success_criteria JSONB DEFAULT '[]',
          founder_score JSONB DEFAULT '{}',
          author_id VARCHAR(64),
          assignee_id VARCHAR(64),
          is_quick_task BOOLEAN DEFAULT FALSE,
          requires_consensus BOOLEAN DEFAULT TRUE,
          tags JSONB DEFAULT '[]',
          votes JSONB DEFAULT '{}',
          comments JSONB DEFAULT '[]',
          manual_tests JSONB DEFAULT '[]',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      return true;
    } catch (err) {
      console.error('Failed to initialize Neon schema:', err);
      return false;
    }
  },

  /**
   * Fetches all projects, ideas, and team members from Neon
   */
  async fetchAll(): Promise<{
    projects: Project[];
    ideas: IdeaCard[];
    teamMembers: TeamMember[];
  } | null> {
    const sql = getSql();
    if (!sql) return null;

    try {
      const dbProjects = (await sql`SELECT * FROM projects ORDER BY created_at ASC`) as any[];
      const dbMembers = (await sql`SELECT * FROM team_members ORDER BY id ASC`) as any[];
      const dbIdeas = (await sql`SELECT * FROM ideas ORDER BY created_at DESC`) as any[];

      const projects: Project[] = dbProjects.map((p) => ({
        id: p.id,
        name: p.name,
        keyPrefix: p.key_prefix,
        description: p.description,
        color: p.color,
        icon: p.icon,
        createdAt: p.created_at,
      }));

      const teamMembers: TeamMember[] = dbMembers.map((m) => ({
        id: m.id,
        name: m.name,
        username: m.username,
        email: m.email,
        role: m.role,
        roleType: m.role_type,
        avatar: m.avatar,
        color: m.color,
        passcode: m.passcode,
        mustResetPasscode: m.must_reset_passcode,
      }));

      const ideas: IdeaCard[] = dbIdeas.map((i) => ({
        id: i.id,
        issueKey: i.issue_key,
        projectId: i.project_id,
        title: i.title,
        issueType: i.issue_type,
        stage: i.stage,
        priority: i.priority,
        summary: i.summary,
        targetAudience: i.target_audience,
        painPoint: i.pain_point,
        proposedSolution: i.proposed_solution,
        valueProposition: i.value_proposition,
        successCriteria: typeof i.success_criteria === 'string' ? JSON.parse(i.success_criteria) : i.success_criteria || [],
        founderScore: typeof i.founder_score === 'string' ? JSON.parse(i.founder_score) : i.founder_score || { userImpact: 4, marketUrgency: 4, implementationSimplicity: 4, strategicFit: 4 },
        authorId: i.author_id,
        assigneeId: i.assignee_id,
        isQuickTask: Boolean(i.is_quick_task),
        requiresConsensus: i.requires_consensus !== false,
        tags: typeof i.tags === 'string' ? JSON.parse(i.tags) : i.tags || [],
        votes: typeof i.votes === 'string' ? JSON.parse(i.votes) : i.votes || {},
        comments: typeof i.comments === 'string' ? JSON.parse(i.comments) : i.comments || [],
        manualTests: typeof i.manual_tests === 'string' ? JSON.parse(i.manual_tests) : i.manual_tests || [],
        createdAt: i.created_at,
        updatedAt: i.updated_at,
      }));

      return { projects, ideas, teamMembers };
    } catch (err) {
      console.error('Error reading from Neon:', err);
      return null;
    }
  },

  /**
   * Upserts an idea card in Neon
   */
  async upsertIdea(idea: IdeaCard): Promise<boolean> {
    const sql = getSql();
    if (!sql) return false;

    try {
      await sql`
        INSERT INTO ideas (
          id, issue_key, project_id, title, issue_type, stage, priority,
          summary, target_audience, pain_point, proposed_solution, value_proposition,
          success_criteria, founder_score, author_id, assignee_id, is_quick_task, requires_consensus,
          tags, votes, comments, manual_tests, created_at, updated_at
        ) VALUES (
          ${idea.id}, ${idea.issueKey}, ${idea.projectId}, ${idea.title}, ${idea.issueType}, ${idea.stage}, ${idea.priority},
          ${idea.summary}, ${idea.targetAudience}, ${idea.painPoint}, ${idea.proposedSolution}, ${idea.valueProposition},
          ${JSON.stringify(idea.successCriteria)}, ${JSON.stringify(idea.founderScore)}, ${idea.authorId}, ${idea.assigneeId || null},
          ${Boolean(idea.isQuickTask)}, ${idea.requiresConsensus !== false},
          ${JSON.stringify(idea.tags)}, ${JSON.stringify(idea.votes)}, ${JSON.stringify(idea.comments)}, ${JSON.stringify(idea.manualTests || [])},
          ${idea.createdAt}, ${idea.updatedAt}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          stage = EXCLUDED.stage,
          priority = EXCLUDED.priority,
          summary = EXCLUDED.summary,
          pain_point = EXCLUDED.pain_point,
          proposed_solution = EXCLUDED.proposed_solution,
          value_proposition = EXCLUDED.value_proposition,
          success_criteria = EXCLUDED.success_criteria,
          founder_score = EXCLUDED.founder_score,
          assignee_id = EXCLUDED.assignee_id,
          is_quick_task = EXCLUDED.is_quick_task,
          requires_consensus = EXCLUDED.requires_consensus,
          tags = EXCLUDED.tags,
          votes = EXCLUDED.votes,
          comments = EXCLUDED.comments,
          manual_tests = EXCLUDED.manual_tests,
          updated_at = EXCLUDED.updated_at;
      `;
      return true;
    } catch (err) {
      console.error('Failed to sync idea to Neon:', err);
      return false;
    }
  },

  /**
   * Deletes an idea from Neon
   */
  async deleteIdea(id: string): Promise<boolean> {
    const sql = getSql();
    if (!sql) return false;
    try {
      await sql`DELETE FROM ideas WHERE id = ${id}`;
      return true;
    } catch (err) {
      console.error('Failed to delete idea in Neon:', err);
      return false;
    }
  },

  /**
   * Upserts a project space in Neon
   */
  async upsertProject(project: Project): Promise<boolean> {
    const sql = getSql();
    if (!sql) return false;
    try {
      await sql`
        INSERT INTO projects (id, name, key_prefix, description, color, icon, created_at)
        VALUES (${project.id}, ${project.name}, ${project.keyPrefix}, ${project.description}, ${project.color}, ${project.icon}, ${project.createdAt})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          key_prefix = EXCLUDED.key_prefix,
          description = EXCLUDED.description,
          color = EXCLUDED.color,
          icon = EXCLUDED.icon;
      `;
      return true;
    } catch (err) {
      console.error('Failed to sync project to Neon:', err);
      return false;
    }
  },

  /**
   * Deletes a project from Neon
   */
  async deleteProject(id: string): Promise<boolean> {
    const sql = getSql();
    if (!sql) return false;
    try {
      await sql`DELETE FROM projects WHERE id = ${id}`;
      return true;
    } catch (err) {
      console.error('Failed to delete project in Neon:', err);
      return false;
    }
  },

  /**
   * Upserts a team member in Neon
   */
  async upsertTeamMember(member: TeamMember): Promise<boolean> {
    const sql = getSql();
    if (!sql) return false;
    try {
      await sql`
        INSERT INTO team_members (id, name, username, email, role, role_type, avatar, color, passcode, must_reset_passcode)
        VALUES (${member.id}, ${member.name}, ${member.username}, ${member.email || ''}, ${member.role}, ${member.roleType}, ${member.avatar}, ${member.color}, ${member.passcode}, ${member.mustResetPasscode ?? false})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          username = EXCLUDED.username,
          email = EXCLUDED.email,
          role = EXCLUDED.role,
          role_type = EXCLUDED.role_type,
          avatar = EXCLUDED.avatar,
          color = EXCLUDED.color,
          passcode = EXCLUDED.passcode,
          must_reset_passcode = EXCLUDED.must_reset_passcode;
      `;
      return true;
    } catch (err) {
      console.error('Failed to sync team member to Neon:', err);
      return false;
    }
  },

  /**
   * Deletes a team member from Neon
   */
  async deleteTeamMember(id: string): Promise<boolean> {
    const sql = getSql();
    if (!sql) return false;
    try {
      await sql`DELETE FROM team_members WHERE id = ${id}`;
      return true;
    } catch (err) {
      console.error('Failed to delete team member in Neon:', err);
      return false;
    }
  },
};
