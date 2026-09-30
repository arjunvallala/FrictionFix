import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Department } from '../../types';
import { Search, Plus, Calendar, ShieldCheck, CheckCircle2, History } from 'lucide-react';

export const MemoryExplorer: React.FC = () => {
  const { memories, currentDepartment, addMemory, systemStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newEntity, setNewEntity] = useState('');
  const [newDept, setNewDept] = useState<Department>(currentDepartment);
  const [newObservation, setNewObservation] = useState('');
  const [newEvidence, setNewEvidence] = useState('');

  const filteredMemories = memories.filter((mem) => {
    const matchesDept = departmentFilter === 'ALL' || mem.department === departmentFilter;
    const matchesSearch =
      mem.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mem.observation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mem.evidence.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mem.department.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDept && matchesSearch;
  });

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntity.trim() || !newObservation.trim()) return;

    await addMemory({
      department: newDept,
      entity: newEntity.trim(),
      observation: newObservation.trim(),
      evidence: newEvidence.trim() || 'Recorded from user observation.',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      status: 'Active',
      confidence: 0.9,
    });

    setNewEntity('');
    setNewObservation('');
    setNewEvidence('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full h-full flex flex-col p-8 bg-[var(--color-bg-base)] overflow-y-auto transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-subtle)]">
              Hindsight Memory Layer
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
              {systemStatus.hindsightConnected ? 'Live Hindsight API' : 'Demo Memory Store'}
            </span>
          </div>
          <h2 className="text-3xl font-heading font-medium tracking-tight text-[var(--color-text-main)]">
            Organizational Memory Explorer
          </h2>
          <p className="text-sm font-body text-[var(--color-text-muted)] mt-1">
            Persistent knowledge base retained across Product, Marketing, and Customer Service journeys.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-lg bg-[var(--color-text-main)] text-[var(--color-bg-base)] text-xs font-medium hover:opacity-90 transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Retain New Memory</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search memories by entity (e.g. P500), observation, or keyword..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-text-main)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'Product', 'Marketing', 'Customer Service'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                departmentFilter === dept
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:border-[var(--color-text-subtle)] transition-all shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
                  {mem.department}
                </span>
                <span className="text-xs font-mono font-bold text-[var(--color-text-main)] px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
                  Entity: {mem.entity}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--color-text-subtle)] font-mono">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{mem.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{(mem.confidence * 100).toFixed(0)}% Confidence</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                  mem.status === 'Active' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                  mem.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                }`}>
                  {mem.status}
                </span>
              </div>
            </div>

            <h4 className="text-base font-heading font-medium text-[var(--color-text-main)] mb-2">
              {mem.observation}
            </h4>

            <div className="p-3 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)] font-body mb-3">
              <span className="font-semibold text-[var(--color-text-main)]">Supporting Evidence: </span>
              {mem.evidence}
            </div>

            {(mem.historicalAction || mem.outcome) && (
              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-subtle)] pt-2 border-t border-[var(--color-border-subtle)]">
                {mem.historicalAction && (
                  <div className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                    <span><strong>Previous Action:</strong> {mem.historicalAction}</span>
                  </div>
                )}
                {mem.outcome && (
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span><strong>Outcome:</strong> {mem.outcome}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredMemories.length === 0 && (
          <div className="p-12 text-center border border-dashed border-[var(--color-border)] rounded-xl text-[var(--color-text-muted)] text-sm">
            No memories match your query. Try searching for "P500", "campaign", or change department filter.
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-heading font-semibold text-[var(--color-text-main)]">
              Retain Organizational Memory
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Store important observations and evidence into Hindsight memory layer.
            </p>

            <form onSubmit={handleCreateMemory} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--color-text-muted)] mb-1">
                  Department
                </label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value as Department)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-text-main)]"
                >
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Customer Service">Customer Service</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[var(--color-text-muted)] mb-1">
                  Entity / Feature Tag
                </label>
                <input
                  type="text"
                  value={newEntity}
                  onChange={(e) => setNewEntity(e.target.value)}
                  placeholder="e.g. P500, Q3-Campaign, Auth-Flow"
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-text-main)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[var(--color-text-muted)] mb-1">
                  Observation
                </label>
                <textarea
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  placeholder="What customer friction or organizational pattern occurred?"
                  required
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-text-main)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[var(--color-text-muted)] mb-1">
                  Evidence / Metrics
                </label>
                <input
                  type="text"
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  placeholder="e.g. 137 support tickets, 18% conversion drop"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-text-main)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs rounded-lg bg-[var(--color-text-main)] text-[var(--color-bg-base)] font-medium hover:opacity-90 cursor-pointer"
                >
                  Retain Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
