import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { AppTab } from '../../types';
import {
  GLOBAL_SUMMARY,
  getDepartmentAnalytics,
  type DepartmentRemediationTask
} from '../../data/sessionAnalytics';
import {
  BarChart3,
  AlertTriangle,
  Users,
  Layers,
  ShieldAlert,
  Clock,
  Activity,
  CheckCircle2,
  Filter,
  FileText
} from 'lucide-react';

interface Props {
  tab: AppTab;
}

export const ReservedWorkspace: React.FC<Props> = ({ tab }) => {
  const { currentDepartment } = useApp();
  const deptData = getDepartmentAnalytics(currentDepartment);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('ALL');

  const [tasksState, setTasksState] = useState<DepartmentRemediationTask[]>(deptData.tasks);

  const toggleTaskStatus = (taskId: string) => {
    setTasksState(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'Completed' ? 'In Progress' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const filteredIssues = deptData.issues.filter(issue => {
    if (severityFilter === 'ALL') return true;
    return issue.severity === severityFilter;
  });

  const filteredTasks = tasksState.filter(task => {
    if (taskStatusFilter === 'ALL') return true;
    return task.status === taskStatusFilter;
  });

  return (
    <div className="w-full h-full flex flex-col p-8 bg-[var(--color-bg-base)] overflow-y-auto transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] font-semibold">
              {currentDepartment} Intelligence Workspace
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-subtle)]">
              Dataset: session_labels.csv (34,523 Sessions)
            </span>
          </div>
          <h2 className="text-3xl font-heading font-medium tracking-tight text-[var(--color-text-main)]">
            {tab === 'issues' && `${currentDepartment} Friction & Issue Registry`}
            {tab === 'tasks' && `${currentDepartment} Remediation Tasks`}
            {tab === 'overview' && `${currentDepartment} Journey Analytics & Friction Representation`}
          </h2>
          <p className="text-sm font-body text-[var(--color-text-muted)] mt-1">
            Real user session analytics classified from <code className="font-mono text-xs">session_labels.csv</code>.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs font-mono">
          <Activity className="w-4 h-4 text-[var(--color-accent)]" />
          <div>
            <p className="text-[10px] text-[var(--color-text-subtle)] uppercase">Total Dataset Friction</p>
            <p className="font-bold text-[var(--color-text-main)]">
              10,231 / 34,523 <span className="text-amber-600 dark:text-amber-400">({GLOBAL_SUMMARY.overallFrictionRatePct}% Rate)</span>
            </p>
          </div>
        </div>
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-subtle)] font-mono">
                <span>FRICTION SESSIONS</span>
                <Users className="w-4 h-4 text-[var(--color-accent)]" />
              </div>
              <p className="text-3xl font-heading font-bold text-[var(--color-text-main)]">
                {deptData.totalFrictionSessions.toLocaleString()}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] font-body">
                Classified under {currentDepartment}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-subtle)] font-mono">
                <span>FRICTION SHARE</span>
                <BarChart3 className="w-4 h-4 text-[var(--color-accent)]" />
              </div>
              <p className="text-3xl font-heading font-bold text-[var(--color-text-main)]">
                {((deptData.totalFrictionSessions / GLOBAL_SUMMARY.totalFrictionAbandonedSessions) * 100).toFixed(1)}%
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] font-body">
                Of total 10,231 friction drop-offs
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-subtle)] font-mono">
                <span>PRIMARY FRICTION</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-sm font-heading font-bold text-[var(--color-text-main)] truncate" title={deptData.issues[0]?.title || 'None'}>
                {deptData.issues[0]?.frictionCode || 'None'}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] font-body truncate">
                {deptData.issues[0]?.title || 'No active friction'}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-subtle)] font-mono">
                <span>SEVERITY INDEX</span>
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-3xl font-heading font-bold text-rose-600 dark:text-rose-400">
                {deptData.issues[0]?.severity || 'Medium'}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] font-body">
                Requires immediate remediation
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold text-[var(--color-text-main)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--color-accent)]" />
              <span>Classified Friction Points for {currentDepartment}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deptData.issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-3 shadow-sm hover:border-[var(--color-text-subtle)] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
                        {issue.frictionCode}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                        issue.severity === 'Critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                        issue.severity === 'High' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}>
                        {issue.severity} Severity
                      </span>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-[var(--color-text-main)]">
                        {issue.affectedSessions.toLocaleString()}
                      </span>
                      <span className="text-xs text-[var(--color-text-subtle)] ml-1">
                        ({issue.percentage}%)
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-heading font-semibold text-[var(--color-text-main)]">
                    {issue.title}
                  </h4>

                  <div className="p-3 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)] space-y-1">
                    <p><strong className="text-[var(--color-text-main)]">Probable Cause:</strong> {issue.probableCause}</p>
                    <p className="pt-1 text-[var(--color-accent)]"><strong className="text-[var(--color-text-main)]">Recommended Action:</strong> {issue.suggestedAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-heading font-semibold text-[var(--color-text-main)] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--color-accent)]" />
              <span>Sample Session Traces from session_labels.csv</span>
            </h3>

            <div className="border border-[var(--color-border)] rounded-xl bg-[var(--color-bg-surface)] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-body">
                  <thead className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] font-mono text-[10px] uppercase text-[var(--color-text-subtle)]">
                    <tr>
                      <th className="px-4 py-3">Session ID</th>
                      <th className="px-4 py-3">Primary Friction</th>
                      <th className="px-4 py-3">Secondary Friction</th>
                      <th className="px-4 py-3">Funnel Step</th>
                      <th className="px-4 py-3">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-subtle)] text-[var(--color-text-main)]">
                    {deptData.sampleTraces.map((trace) => (
                      <tr key={trace.sessionId} className="hover:bg-[var(--color-bg-elevated)] transition-colors">
                        <td className="px-4 py-2.5 font-mono text-[11px] font-semibold text-[var(--color-accent)]">
                          {trace.sessionId}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[11px]">
                          {trace.primaryFriction}
                        </td>
                        <td className="px-4 py-2.5 text-[var(--color-text-muted)]">
                          {trace.secondaryFriction}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[10px] uppercase">
                          <span className="px-2 py-0.5 rounded bg-[var(--color-bg-base)] border border-[var(--color-border)]">
                            {trace.stepLocation}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[10px] uppercase text-rose-600 dark:text-rose-400 font-semibold">
                          {trace.outcome}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'issues' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--color-text-subtle)]" />
              <span className="text-xs font-mono uppercase text-[var(--color-text-subtle)]">Filter Severity:</span>
              <div className="flex items-center gap-1">
                {['ALL', 'Critical', 'High', 'Medium'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      severityFilter === sev
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs font-mono text-[var(--color-text-subtle)]">
              Showing {filteredIssues.length} issues for {currentDepartment}
            </p>
          </div>

          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
                      {issue.id} · {issue.frictionCode}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                      issue.severity === 'Critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                      issue.severity === 'High' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-[var(--color-text-main)]">
                    Impact: {issue.affectedSessions.toLocaleString()} sessions ({issue.percentage}% of {currentDepartment})
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-semibold text-[var(--color-text-main)] mb-2">
                    {issue.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body">
                    <div className="p-3 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] space-y-1">
                      <strong className="text-[var(--color-text-main)]">Probable Cause:</strong>
                      <p className="text-[var(--color-text-muted)]">{issue.probableCause}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-[var(--color-accent-subtle)] border border-[var(--color-accent-border)] space-y-1">
                      <strong className="text-[var(--color-accent)]">Suggested Remediation:</strong>
                      <p className="text-[var(--color-text-main)]">{issue.suggestedAction}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--color-text-subtle)]" />
              <span className="text-xs font-mono uppercase text-[var(--color-text-subtle)]">Filter Status:</span>
              <div className="flex items-center gap-1">
                {['ALL', 'In Progress', 'Pending', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setTaskStatusFilter(st)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      taskStatusFilter === st
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs font-mono text-[var(--color-text-subtle)]">
              Showing {filteredTasks.length} tasks for {currentDepartment}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
                      {task.id}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                      task.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                      task.priority === 'High' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                    }`}>
                      {task.priority} Priority
                    </span>
                    <span className="text-[11px] font-mono text-[var(--color-text-subtle)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Timeline: {task.targetTimeline}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-semibold text-[var(--color-text-main)]">
                    {task.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-body text-[var(--color-text-muted)]">
                    <span><strong>Assigned Lead:</strong> {task.assignedRole}</span>
                    <span><strong>Target Friction:</strong> {task.frictionTitle}</span>
                    <span><strong>Impact:</strong> {task.impactSessions.toLocaleString()} sessions</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`self-start md:self-auto px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                    task.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-[var(--color-text-main)] text-[var(--color-bg-base)] hover:opacity-90'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{task.status === 'Completed' ? 'Completed' : 'Mark Completed'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
