import React from 'react';
import { useApp } from '../../context/AppContext';
import type { AppTab, Department } from '../../types';
import { LayoutDashboard, AlertCircle, CheckSquare, Database, Layers } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentDepartment, switchDepartment } = useApp();

  const navItems: { id: AppTab; label: string; icon: React.ReactNode; isFunctional?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, isFunctional: true },
    { id: 'issues', label: 'Issues Registry', icon: <AlertCircle className="w-4 h-4" />, isFunctional: true },
    { id: 'tasks', label: 'Remediation Tasks', icon: <CheckSquare className="w-4 h-4" />, isFunctional: true },
    { id: 'memory', label: 'Hindsight Memory', icon: <Database className="w-4 h-4" />, isFunctional: true },
  ];

  const departments: Department[] = ['Product', 'Marketing', 'Customer Service', 'Operational Teams'];

  return (
    <aside className="w-56 shrink-0 bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] flex flex-col justify-between py-4 px-3 select-none transition-colors duration-200">
      <div>
        <div className="px-3 pb-3 mb-2 border-b border-[var(--color-border-subtle)]">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-subtle)] font-medium">
            Navigation
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold border border-[var(--color-accent-border)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-main)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>

                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Active
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-[var(--color-border-subtle)]">
        <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-subtle)] mb-2 font-medium flex items-center gap-1.5">
          <Layers className="w-3 h-3" />
          <span>Department Classes</span>
        </p>

        <div className="space-y-1">
          {departments.map((dept) => {
            const isSelected = currentDepartment === dept;
            return (
              <button
                key={dept}
                onClick={() => switchDepartment(dept)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[var(--color-bg-elevated)] font-semibold text-[var(--color-text-main)]'
                    : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]'
                }`}
              >
                <span className="truncate">{dept}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
