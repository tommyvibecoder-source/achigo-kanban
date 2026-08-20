-- ====================================================================
-- AchiGO (Achieve • Grow • Outscale) - Neon PostgreSQL Database Schema
-- Run this script in the Neon SQL Console: https://console.neon.tech
-- ====================================================================

-- 1. Projects Workspaces Table
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key_prefix VARCHAR(10) NOT NULL,
  description TEXT,
  color VARCHAR(30) DEFAULT '#0052CC',
  icon VARCHAR(50) DEFAULT 'FolderKanban',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Team Members & Roles Table
CREATE TABLE IF NOT EXISTS team_members (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(255),
  role VARCHAR(255) NOT NULL,
  role_type VARCHAR(50) NOT NULL DEFAULT 'member', -- 'founder' | 'lead' | 'member' | 'viewer'
  avatar VARCHAR(10) DEFAULT '👨‍💻',
  color VARCHAR(30) DEFAULT '#0052CC',
  passcode VARCHAR(255) NOT NULL,
  must_reset_passcode BOOLEAN DEFAULT TRUE
);

-- 3. Kanban Ideas & Production Backlog Table
CREATE TABLE IF NOT EXISTS ideas (
  id VARCHAR(64) PRIMARY KEY,
  issue_key VARCHAR(50) NOT NULL,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  issue_type VARCHAR(50) NOT NULL DEFAULT 'feature', -- 'feature' | 'bug' | 'improvement' | 'research' | 'task' | 'design' | 'security'
  stage VARCHAR(50) NOT NULL DEFAULT 'backlog', -- 'backlog' | 'refinement' | 'approved' | 'prompt_creation' | 'in_production' | 'manual_testing' | 'shipped'
  priority VARCHAR(50) NOT NULL DEFAULT 'high', -- 'low' | 'medium' | 'high' | 'critical'
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
