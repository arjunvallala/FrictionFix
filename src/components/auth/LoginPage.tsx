import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockUsers';
import type { Department, User } from '../../types';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ArrowRight, ShieldCheck, Database, Compass } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [selectedDept, setSelectedDept] = useState<Department>('Product');
  const [customName, setCustomName] = useState<string>('');
  const [customRole, setCustomRole] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);

  const handleSelectDemoUser = (demoUser: User) => {
    login(demoUser);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const user: User = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      role: customRole.trim() || `${selectedDept} Lead`,
      department: selectedDept,
    };
    login(user);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[var(--color-bg-base)] text-[var(--color-text-main)] px-6 py-8 transition-colors duration-200">
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-3">
          <span className="text-xl font-heading tracking-tight font-semibold border-b-2 border-[var(--color-text-main)] pb-0.5">
            FRICTIONFIX
          </span>
          <span className="text-xs font-mono tracking-wider px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)] uppercase">
            Enterprise Memory Platform
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--color-text-subtle)] hidden sm:inline">
            TCS AIML Hackathon Prototype
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto my-auto py-12 flex flex-col items-center">
        <div className="text-center max-w-2xl mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-subtle)] mb-3 font-mono">
            Organizational Memory Architecture
          </p>
          <h1 className="text-4xl sm:text-5xl font-heading font-medium tracking-tight text-[var(--color-text-main)] mb-4 leading-tight">
            One customer journey.<br />
            Multiple departments.<br />
            <span className="italic font-serif opacity-90">One shared memory.</span>
          </h1>
          <p className="text-base text-[var(--color-text-muted)] font-body leading-relaxed max-w-lg mx-auto">
            FRICTIONFIX integrates cross-department organizational intelligence powered by Hindsight memory recall.
          </p>
        </div>

        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-sm uppercase tracking-wider text-[var(--color-text-subtle)] font-mono font-medium">
              Select Department Context
            </h2>
            <button
              type="button"
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] underline transition-colors cursor-pointer"
            >
              {showCustomForm ? 'Use Preset Identities' : 'Custom User Details'}
            </button>
          </div>

          {!showCustomForm ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEMO_USERS.map((demoUser) => (
                <button
                  key={demoUser.id}
                  onClick={() => handleSelectDemoUser(demoUser)}
                  className="group relative flex flex-col justify-between text-left p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-text-muted)] transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono tracking-wide px-2 py-0.5 rounded bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold">
                        {demoUser.department.toUpperCase()}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-main)] group-hover:translate-x-1 transition-all" />
                    </div>

                    <h3 className="text-xl font-heading font-semibold text-[var(--color-text-main)] mb-1">
                      {demoUser.department}
                    </h3>
                    <p className="text-xs text-[var(--color-text-subtle)] mb-4">
                      {demoUser.department === 'Product' && 'Product friction, feature compatibility, & release intelligence.'}
                      {demoUser.department === 'Marketing' && 'Acquisition campaigns, landing copy, & conversion friction.'}
                      {demoUser.department === 'Customer Service' && 'Ticket escalations, resolution trends, & complaint logs.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[var(--color-border)] flex items-center justify-center text-xs font-semibold text-[var(--color-text-main)]">
                      {demoUser.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-main)] leading-tight">
                        {demoUser.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {demoUser.role}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={handleCustomSubmit}
              className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-4 max-w-lg mx-auto"
            >
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  Department
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Product', 'Marketing', 'Customer Service'] as Department[]).map((dept) => (
                    <button
                      type="button"
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        selectedDept === dept
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)]'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Sarah Lin"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-text-main)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Senior Analyst"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-text-main)] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[var(--color-text-main)] text-[var(--color-bg-base)] font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Enter Workspace as {selectedDept} Lead</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--color-text-subtle)] pt-4">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <span>Hindsight Memory Layer</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <span>Cross-Department Grounded AI</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <span>Pluggable Shell Architecture</span>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-6xl mx-auto pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-text-subtle)] gap-2">
        <p>© 2026 FRICTIONFIX. Built for TCS AIML Hackathon.</p>
        <p className="font-mono">Phase 1: Shell + Hindsight AI Agent Foundation</p>
      </footer>
    </div>
  );
};
