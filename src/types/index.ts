export type KanbanStage =
  | 'backlog'
  | 'refinement'
  | 'approved'
  | 'prompt_creation'
  | 'in_production'
  | 'manual_testing'
  | 'shipped';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type IssueType =
  | 'feature'
  | 'bug'
  | 'improvement'
  | 'research'
  | 'task'
  | 'design'
  | 'security';

export type VoteStatus = 'approved' | 'needs_discussion' | 'pending';

export type RoleType = 'founder' | 'lead' | 'member' | 'viewer';

export interface Vote {
  memberId: string;
  status: VoteStatus;
  comment?: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  memberId: string;
  text: string;
  createdAt: string;
}

export interface ManualTestCase {
  id: string;
  scenario: string;
  expectedResult: string;
  passed: boolean;
  notes?: string;
  testedBy?: string;
}

export interface FounderScore {
  userImpact: number; // 1 to 5
  marketUrgency: number; // 1 to 5
  implementationSimplicity: number; // 1 to 5
  strategicFit: number; // 1 to 5
}

export interface IdeaCard {
  id: string;
  issueKey: string;
  projectId: string;
  title: string;
  issueType: IssueType; // 'feature' | 'bug' | 'improvement' | 'research' | 'task' | 'design' | 'security'
  isQuickTask?: boolean; // Ordinary / chore task without heavy scoring or consensus
  requiresConsensus?: boolean; // false for ordinary tasks
  stage: KanbanStage;
  priority: Priority;
  
  summary: string;
  targetAudience: string;
  painPoint: string;
  proposedSolution: string;
  valueProposition: string;
  successCriteria: string[];
  
  customPromptNotes?: string;
  targetAiTool?: 'antigravity' | 'claude' | 'openwork';
  manualTests?: ManualTestCase[];
  
  founderScore: FounderScore;
  
  authorId: string;
  assigneeId?: string;
  votes: Record<string, Vote>;
  comments: Comment[];
  tags: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  username: string;
  role: string;
  roleType: RoleType;
  avatar: string;
  color: string;
  passcode: string;
  mustResetPasscode?: boolean;
  email?: string;
}

export interface Project {
  id: string;
  keyPrefix: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: string;
}

export type ActiveView = 'kanban' | 'backlog' | 'prd_list' | 'matrix';

export interface ConsensusCheckResult {
  allowed: boolean;
  reason?: string;
  approvedCount: number;
  totalMembers: number;
  missingApprovals: TeamMember[];
  objections: { member: TeamMember; comment?: string }[];
}

export interface LoginResult {
  success: boolean;
  mustReset?: boolean;
  member?: TeamMember;
  message?: string;
}
