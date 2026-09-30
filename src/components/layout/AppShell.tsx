import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AgentPanel } from '../agent/AgentPanel';
import { ReservedWorkspace } from '../workspace/ReservedWorkspace';
import { MemoryExplorer } from '../workspace/MemoryExplorer';

export const AppShell: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--color-bg-base)] text-[var(--color-text-main)] overflow-hidden transition-colors duration-200">
      {/* Top Application Header */}
      <Header />

      {/* Main Workspace Layout Container */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Center Main Workspace (~80% width) */}
        <main className="flex-1 h-full overflow-hidden flex flex-col bg-[var(--color-bg-base)] border-r border-[var(--color-border)]">
          {activeTab === 'memory' ? (
            <MemoryExplorer />
          ) : (
            <ReservedWorkspace tab={activeTab} />
          )}
        </main>

        {/* Persistent Right-Side AI Agent Panel (~20% width) */}
        <AgentPanel />
      </div>
    </div>
  );
};
