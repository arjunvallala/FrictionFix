import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { Department } from '../../types';
import { DEMO_USERS } from '../../data/mockUsers';
import { LogOut, ChevronDown, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, currentDepartment, currentRole, systemStatus, switchDepartment, logout } = useApp();
  const [showDeptMenu, setShowDeptMenu] = useState(false);

  const departments: Department[] = ['Product', 'Marketing', 'Customer Service', 'Operational Teams'];

  return (
    <header className="h-16 w-full bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] px-6 flex items-center justify-between z-30 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-xl tracking-tight text-[var(--color-text-main)]">
            FRICTIONFIX
          </span>
          <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-subtle)] uppercase hidden sm:inline">
            v1.0 Foundation
          </span>
        </div>

        <div className="h-4 w-px bg-[var(--color-border)] hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold tracking-wider text-[var(--color-accent)] uppercase">
            {currentDepartment.toUpperCase()} INTELLIGENCE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          {systemStatus.hindsightConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Hindsight Connected</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[var(--color-text-muted)]">Demo Memory</span>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDeptMenu(!showDeptMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-main)] transition-colors cursor-pointer text-xs"
          >
            <div className="w-5 h-5 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center font-bold text-[10px]">
              {currentUser?.name?.[0] || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-semibold leading-none text-[var(--color-text-main)]">{currentUser?.name}</p>
              <p className="text-[10px] text-[var(--color-text-subtle)] leading-none mt-0.5">{currentRole}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" />
          </button>

          {showDeptMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-lg py-2 z-50">
              <div className="px-3 py-1.5 border-b border-[var(--color-border-subtle)]">
                <p className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)]">Switch Department Context</p>
              </div>

              {departments.map((dept) => {
                const demoUser = DEMO_USERS.find(u => u.department === dept);
                const isCurrent = currentDepartment === dept;

                return (
                  <button
                    key={dept}
                    onClick={() => {
                      switchDepartment(dept);
                      setShowDeptMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[var(--color-bg-elevated)] transition-colors cursor-pointer ${
                      isCurrent ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold' : 'text-[var(--color-text-main)]'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{dept}</p>
                      <p className="text-[10px] text-[var(--color-text-subtle)]">{demoUser?.name} · {demoUser?.role}</p>
                    </div>
                    {isCurrent && <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)]" />}
                  </button>
                );
              })}

              <div className="pt-1 mt-1 border-t border-[var(--color-border-subtle)] px-1">
                <button
                  onClick={() => {
                    setShowDeptMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit Session</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
};
