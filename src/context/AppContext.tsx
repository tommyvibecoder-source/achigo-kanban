import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, IdeaCard, TeamMember, KanbanStage, ActiveView, Priority, VoteStatus, ManualTestCase } from '../types';
import { storage } from '../services/storage';

interface ConsensusCheckResult {
  allowed: boolean;
  reason?: string;
  approvedCount: number;
  totalMembers: number;
  missingApprovals: TeamMember[];
  objections: { member: TeamMember; comment?: string }[];
}

interface LoginResult {
  success: boolean;
  mustReset?: boolean;
  member?: TeamMember;
  message?: string;
}

interface AppContextType {
  projects: Project[];
  activeProject: Project | undefined;
  setActiveProjectId: (id: string) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => { success: boolean; message?: string };

  ideas: IdeaCard[];
  filteredIdeas: IdeaCard[];
  activeIdea: IdeaCard | null;
  setActiveIdea: (idea: IdeaCard | null) => void;
  createIdea: (idea: Omit<IdeaCard, 'id' | 'issueKey' | 'createdAt' | 'updatedAt' | 'votes' | 'comments'>) => void;
  updateIdea: (idea: IdeaCard) => void;
  deleteIdea: (id: string) => { success: boolean; message?: string };
  moveIdeaStage: (ideaId: string, targetStage: KanbanStage) => { success: boolean; message?: string };
  voteOnIdea: (ideaId: string, status: VoteStatus, comment?: string) => void;
  addComment: (ideaId: string, text: string) => void;
  toggleManualTest: (ideaId: string, testId: string) => void;
  addManualTest: (ideaId: string, scenario: string, expectedResult: string) => void;

  teamMembers: TeamMember[];
  activeUser: TeamMember;
  setActiveUserId: (id: string) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;

  // Authentication & Passcode Reset (Zero-cost RBAC)
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, passcode: string) => LoginResult;
  completePasscodeReset: (memberId: string, newPasscode: string) => boolean;
  logout: () => void;
  isFounder: boolean;
  canDelete: boolean;

  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedPriority: Priority | 'all';
  setSelectedPriority: (p: Priority | 'all') => void;
  selectedTag: string | 'all';
  setSelectedTag: (t: string | 'all') => void;

  isNewIdeaModalOpen: boolean;
  setIsNewIdeaModalOpen: (open: boolean) => void;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;
  isTeamModalOpen: boolean;
  setIsTeamModalOpen: (open: boolean) => void;
  aiPromptModalIdea: IdeaCard | null;
  setAiPromptModalIdea: (idea: IdeaCard | null) => void;

  checkConsensus: (idea: IdeaCard) => ConsensusCheckResult;
  canMoveToStage: (idea: IdeaCard, targetStage: KanbanStage) => { allowed: boolean; reason?: string };
  resetAllData: () => void;
  exportData: () => void;
  importData: (jsonData: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => storage.getProjects());
  const [activeProjectId, setActiveProjectIdState] = useState<string>(() => storage.getActiveProjectId());
  const [ideas, setIdeas] = useState<IdeaCard[]>(() => storage.getIdeas());
  const [activeIdea, setActiveIdea] = useState<IdeaCard | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => storage.getTeamMembers());
  const [activeUserId, setActiveUserIdState] = useState<string>(() => storage.getActiveUserId());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('achigo_auth_v1') === 'true';
  });

  const [activeView, setActiveView] = useState<ActiveView>('kanban');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');

  const [isNewIdeaModalOpen, setIsNewIdeaModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [aiPromptModalIdea, setAiPromptModalIdea] = useState<IdeaCard | null>(null);

  // Sync to storage
  useEffect(() => {
    storage.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    storage.saveIdeas(ideas);
  }, [ideas]);

  useEffect(() => {
    storage.saveTeamMembers(teamMembers);
  }, [teamMembers]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const activeUser = teamMembers.find((m) => m.id === activeUserId) || teamMembers[0];
  const isFounder = activeUser?.roleType === 'founder';
  const canDelete = isFounder;

  const setActiveProjectId = (id: string) => {
    setActiveProjectIdState(id);
    storage.saveActiveProjectId(id);
  };

  const setActiveUserId = (id: string) => {
    setActiveUserIdState(id);
    storage.saveActiveUserId(id);
  };

  const login = (usernameOrEmail: string, passcode: string): LoginResult => {
    const cleanUser = usernameOrEmail.trim().toLowerCase();
    const cleanPass = passcode.trim();

    const matched = teamMembers.find(
      (m) =>
        (m.username?.toLowerCase() === cleanUser || m.email?.toLowerCase() === cleanUser || m.name.toLowerCase() === cleanUser) &&
        m.passcode === cleanPass
    );

    if (matched) {
      setActiveUserId(matched.id);
      if (matched.mustResetPasscode) {
        return { success: true, mustReset: true, member: matched };
      }
      setIsAuthenticated(true);
      localStorage.setItem('achigo_auth_v1', 'true');
      return { success: true, mustReset: false, member: matched };
    }
    return { success: false, message: 'Invalid username or passcode.' };
  };

  const completePasscodeReset = (memberId: string, newPasscode: string): boolean => {
    const cleanPass = newPasscode.trim();
    if (cleanPass.length < 4) return false;

    const updated = teamMembers.map((m) =>
      m.id === memberId
        ? { ...m, passcode: cleanPass, mustResetPasscode: false }
        : m
    );

    setTeamMembers(updated);
    setActiveUserId(memberId);
    setIsAuthenticated(true);
    localStorage.setItem('achigo_auth_v1', 'true');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('achigo_auth_v1');
  };

  // Consensus Evaluation
  const checkConsensus = (idea: IdeaCard): ConsensusCheckResult => {
    const totalMembers = teamMembers.length;
    let approvedCount = 0;
    const missingApprovals: TeamMember[] = [];
    const objections: { member: TeamMember; comment?: string }[] = [];

    teamMembers.forEach((member) => {
      const vote = idea.votes[member.id];
      if (vote && vote.status === 'approved') {
        approvedCount++;
      } else {
        missingApprovals.push(member);
        if (vote && vote.status === 'needs_discussion') {
          objections.push({ member, comment: vote.comment });
        }
      }
    });

    const isUnanimous = approvedCount === totalMembers && totalMembers > 0;

    let reason: string | undefined;
    if (!isUnanimous) {
      if (objections.length > 0) {
        reason = `${objections.length} teammate(s) requested discussion: ${objections.map((o) => `${o.member.name} ("${o.comment || 'Needs discussion'}")`).join(', ')}`;
      } else {
        reason = `Awaiting approval from ${missingApprovals.map((m) => m.name).join(', ')}`;
      }
    }

    return {
      allowed: isUnanimous,
      reason,
      approvedCount,
      totalMembers,
      missingApprovals,
      objections,
    };
  };

  const canMoveToStage = (idea: IdeaCard, targetStage: KanbanStage): { allowed: boolean; reason?: string } => {
    if (targetStage === 'backlog' || targetStage === 'refinement') {
      return { allowed: true };
    }

    const consensusStages: KanbanStage[] = ['approved', 'prompt_creation', 'in_production', 'manual_testing', 'shipped'];
    if (consensusStages.includes(targetStage)) {
      const consensus = checkConsensus(idea);
      if (!consensus.allowed) {
        return {
          allowed: false,
          reason: `Team consensus required! ${consensus.reason || 'All team members must vote to approve before moving to ' + targetStage.replace('_', ' ')}.`,
        };
      }
    }

    if (targetStage === 'shipped' && idea.manualTests && idea.manualTests.length > 0) {
      const failedTests = idea.manualTests.filter((t) => !t.passed);
      if (failedTests.length > 0) {
        return {
          allowed: false,
          reason: `Manual Testing Incomplete! ${failedTests.length} test scenario(s) are still unverified or failing.`,
        };
      }
    }

    return { allowed: true };
  };

  // Project CRUD
  const createProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...projects, newProject];
    setProjects(updated);
    setActiveProjectId(newProject.id);
  };

  const updateProject = (project: Project) => {
    setProjects(projects.map((p) => (p.id === project.id ? project : p)));
  };

  const deleteProject = (id: string): { success: boolean; message?: string } => {
    if (!isFounder) {
      return { success: false, message: 'Permission Denied: Only Co-Founders (Zogo & Achiri) can delete project workspaces.' };
    }
    if (projects.length <= 1) {
      return { success: false, message: 'Cannot delete the only remaining project space.' };
    }
    const remaining = projects.filter((p) => p.id !== id);
    setProjects(remaining);
    setIdeas(ideas.filter((i) => i.projectId !== id));
    if (activeProjectId === id) {
      setActiveProjectId(remaining[0].id);
    }
    return { success: true };
  };

  // Idea CRUD
  const createIdea = (
    ideaData: Omit<IdeaCard, 'id' | 'issueKey' | 'createdAt' | 'updatedAt' | 'votes' | 'comments'>
  ) => {
    const projPrefix = activeProject?.keyPrefix || 'IDEA';
    const existingForProj = ideas.filter((i) => i.projectId === activeProjectId);
    const issueKey = `${projPrefix}-${existingForProj.length + 101}`;

    const defaultVotes: Record<string, { memberId: string; status: VoteStatus; updatedAt: string }> = {};
    teamMembers.forEach((member) => {
      defaultVotes[member.id] = {
        memberId: member.id,
        status: member.id === activeUser.id ? 'approved' : 'pending',
        updatedAt: new Date().toISOString(),
      };
    });

    const defaultManualTests: ManualTestCase[] = [
      { id: 't-' + Date.now() + '-1', scenario: 'Happy path verification against user story narrative', expectedResult: 'Functions smoothly with valid input', passed: false },
      { id: 't-' + Date.now() + '-2', scenario: 'Edge cases & invalid user inputs handling', expectedResult: 'Graceful error message displayed', passed: false },
    ];

    const newIdea: IdeaCard = {
      ...ideaData,
      id: 'idea-' + Date.now(),
      issueKey,
      projectId: activeProjectId,
      votes: defaultVotes,
      comments: [],
      manualTests: defaultManualTests,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIdeas([newIdea, ...ideas]);
  };

  const updateIdea = (updatedIdea: IdeaCard) => {
    const fresh = { ...updatedIdea, updatedAt: new Date().toISOString() };
    setIdeas(ideas.map((i) => (i.id === fresh.id ? fresh : i)));
    if (activeIdea?.id === fresh.id) {
      setActiveIdea(fresh);
    }
  };

  const deleteIdea = (id: string): { success: boolean; message?: string } => {
    if (!isFounder) {
      return {
        success: false,
        message: 'Permission Denied: Only Co-Founders / Admins (Zogo & Achiri) can delete items on the Kanban.',
      };
    }
    setIdeas(ideas.filter((i) => i.id !== id));
    if (activeIdea?.id === id) {
      setActiveIdea(null);
    }
    return { success: true };
  };

  const moveIdeaStage = (ideaId: string, targetStage: KanbanStage): { success: boolean; message?: string } => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return { success: false, message: 'Idea not found' };

    const check = canMoveToStage(idea, targetStage);
    if (!check.allowed) {
      return { success: false, message: check.reason };
    }

    updateIdea({
      ...idea,
      stage: targetStage,
    });
    return { success: true };
  };

  const voteOnIdea = (ideaId: string, status: VoteStatus, comment?: string) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;

    const currentVotes = { ...idea.votes };
    currentVotes[activeUser.id] = {
      memberId: activeUser.id,
      status,
      comment: comment || currentVotes[activeUser.id]?.comment,
      updatedAt: new Date().toISOString(),
    };

    const updated = {
      ...idea,
      votes: currentVotes,
    };

    const consensus = checkConsensus(updated);
    if (consensus.allowed && (updated.stage === 'backlog' || updated.stage === 'refinement')) {
      updated.stage = 'approved';
    }

    updateIdea(updated);
  };

  const addComment = (ideaId: string, text: string) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea || !text.trim()) return;

    const newComment = {
      id: 'c-' + Date.now(),
      memberId: activeUser.id,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    updateIdea({
      ...idea,
      comments: [...idea.comments, newComment],
    });
  };

  const toggleManualTest = (ideaId: string, testId: string) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea || !idea.manualTests) return;

    const updatedTests = idea.manualTests.map((t) =>
      t.id === testId
        ? { ...t, passed: !t.passed, testedBy: !t.passed ? activeUser.name : undefined }
        : t
    );

    updateIdea({
      ...idea,
      manualTests: updatedTests,
    });
  };

  const addManualTest = (ideaId: string, scenario: string, expectedResult: string) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea || !scenario.trim()) return;

    const newTest: ManualTestCase = {
      id: 't-' + Date.now(),
      scenario: scenario.trim(),
      expectedResult: expectedResult.trim() || 'Passed as expected',
      passed: false,
    };

    updateIdea({
      ...idea,
      manualTests: [...(idea.manualTests || []), newTest],
    });
  };

  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: 'user-' + Date.now(),
      mustResetPasscode: memberData.mustResetPasscode !== undefined ? memberData.mustResetPasscode : true,
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const updateTeamMember = (member: TeamMember) => {
    setTeamMembers(teamMembers.map((m) => (m.id === member.id ? member : m)));
  };

  const deleteTeamMember = (id: string) => {
    if (teamMembers.length <= 1) return;
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const resetAllData = () => {
    storage.resetAllData();
    window.location.reload();
  };

  const exportData = () => {
    const payload = {
      projects,
      ideas,
      teamMembers,
      exportedAt: new Date().toISOString(),
      version: '1.2',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `achigo-kanban-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.projects) && Array.isArray(parsed.ideas)) {
        setProjects(parsed.projects);
        setIdeas(parsed.ideas);
        if (Array.isArray(parsed.teamMembers)) {
          setTeamMembers(parsed.teamMembers);
        }
        return true;
      }
    } catch (e) {
      console.error('Failed to import data:', e);
    }
    return false;
  };

  const filteredIdeas = ideas
    .filter((idea) => idea.projectId === activeProjectId)
    .filter((idea) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          idea.title.toLowerCase().includes(q) ||
          idea.issueKey.toLowerCase().includes(q) ||
          idea.summary.toLowerCase().includes(q) ||
          idea.painPoint.toLowerCase().includes(q) ||
          idea.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesText) return false;
      }
      if (selectedPriority !== 'all' && idea.priority !== selectedPriority) {
        return false;
      }
      if (selectedTag !== 'all' && !idea.tags.includes(selectedTag)) {
        return false;
      }
      return true;
    });

  return (
    <AppContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProjectId,
        createProject,
        updateProject,
        deleteProject,

        ideas,
        filteredIdeas,
        activeIdea,
        setActiveIdea,
        createIdea,
        updateIdea,
        deleteIdea,
        moveIdeaStage,
        voteOnIdea,
        addComment,
        toggleManualTest,
        addManualTest,

        teamMembers,
        activeUser,
        setActiveUserId,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,

        isAuthenticated,
        login,
        completePasscodeReset,
        logout,
        isFounder,
        canDelete,

        activeView,
        setActiveView,

        searchQuery,
        setSearchQuery,
        selectedPriority,
        setSelectedPriority,
        selectedTag,
        setSelectedTag,

        isNewIdeaModalOpen,
        setIsNewIdeaModalOpen,
        isProjectModalOpen,
        setIsProjectModalOpen,
        isTeamModalOpen,
        setIsTeamModalOpen,
        aiPromptModalIdea,
        setAiPromptModalIdea,

        checkConsensus,
        canMoveToStage,
        resetAllData,
        exportData,
        importData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
