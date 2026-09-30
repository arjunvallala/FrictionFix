import React from 'react';
import { useApp } from '../../context/AppContext';
import type { AppTab } from '../../types';
import { Box, Code } from 'lucide-react';

interface Props {
  tab: AppTab;
}

export const ReservedWorkspace: React.FC<Props> = ({ tab }) => {
  const { currentDepartment } = useApp();

  const getTitle = () => {
    switch (tab) {
      case 'issues':
        return `${currentDepartment} Friction & Issue Registry`;
      case 'tasks':
        return `${currentDepartment} Remediation Tasks`;
      case 'overview':
      default:
        return `${currentDepartment} Intelligence Workspace`;
    }
  };

  const getSubtitle = () => {
    switch (tab) {
      case 'issues':
        return 'Department friction points and customer pain signals will be analyzed here in Phase 2.';
      case 'tasks':
        return 'Automated cross-department task assignments and resolution workflows will appear here in Phase 2.';
      case 'overview':
      default:
        return 'Analytics, friction points, issues, and tasks will appear here in future modules.';
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-8 bg-[var(--color-bg-base)] transition-colors duration-200">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-subtle)]">
            {currentDepartment} Context
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
            Tab: {tab.toUpperCase()}
          </span>
        </div>
        <h2 className="text-3xl font-heading font-medium tracking-tight text-[var(--color-text-main)]">
          {getTitle()}
        </h2>
        <p className="text-sm font-body text-[var(--color-text-muted)] mt-1 max-w-2xl">
          {getSubtitle()}
        </p>
      </div>

      <div className="flex-1 w-full border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-surface)] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-md space-y-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-center mx-auto text-[var(--color-text-muted)]">
            <Box className="w-6 h-6 stroke-[1.5]" />
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold inline-block mb-2">
              Reserved Analytics Space
            </span>
            <h3 className="text-xl font-heading font-semibold text-[var(--color-text-main)]">
              {currentDepartment} Module Slot
            </h3>
            <p className="text-xs font-body text-[var(--color-text-muted)] leading-relaxed mt-2">
              This space is intentionally reserved for future {currentDepartment.toLowerCase()} analytics, friction maps, and KPI components. The persistent AI Agent on the right retains full awareness of this department context.
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--color-border-subtle)] text-left">
            <div className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Code className="w-3 h-3 text-[var(--color-text-muted)]" />
              <span>Pluggable Module Architecture</span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] font-mono text-[11px] text-[var(--color-text-muted)] space-y-1">
              <div className="text-[var(--color-text-subtle)]">&lt;DepartmentWorkspace department="{currentDepartment}"&gt;</div>
              <div className="pl-4 text-[var(--color-accent)] font-semibold">
                {currentDepartment === 'Product' && '/* <ProductAnalytics />, <ProductFriction /> */'}
                {currentDepartment === 'Marketing' && '/* <CampaignAnalytics />, <ConversionFriction /> */'}
                {currentDepartment === 'Customer Service' && '/* <TicketAnalytics />, <ServiceFriction /> */'}
              </div>
              <div className="pl-4 italic text-[var(--color-text-subtle)]">// Empty slot ready for Phase 2 insertion</div>
              <div className="text-[var(--color-text-subtle)]">&lt;/DepartmentWorkspace&gt;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
