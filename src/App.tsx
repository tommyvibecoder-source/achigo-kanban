import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { BacklogView } from './components/backlog/BacklogView';
import { PrdView } from './components/confluence/PrdView';
import { PriorityMatrixView } from './components/matrix/PriorityMatrixView';
import { IdeaModal } from './components/ideas/IdeaModal';
import { NewIdeaModal } from './components/ideas/NewIdeaModal';
import { ProjectModal } from './components/projects/ProjectModal';
import { TeamModal } from './components/team/TeamModal';
import { ProfileModal } from './components/team/ProfileModal';
import { AiPromptModal } from './components/ai-exporter/AiPromptModal';
import { LoginScreen } from './components/auth/LoginScreen';

export const AppContent: React.FC = () => {
  const { activeView, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 animate-in fade-in duration-150">
      {/* Top Jira/Confluence Navigation Bar */}
      <Header />

      {/* Main Workspace Area (Sidebar + Active View) */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex overflow-hidden">
          {activeView === 'kanban' && <KanbanBoard />}
          {activeView === 'backlog' && <BacklogView />}
          {activeView === 'prd_list' && <PrdView />}
          {activeView === 'matrix' && <PriorityMatrixView />}
        </main>
      </div>

      {/* Global Modals & Dialogs */}
      <IdeaModal />
      <NewIdeaModal />
      <ProjectModal />
      <TeamModal />
      <ProfileModal />
      <AiPromptModal />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
