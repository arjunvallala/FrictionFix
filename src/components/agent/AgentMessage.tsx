import React, { useState } from 'react';
import type { AgentMessage as IAgentMessage } from '../../types';
import { MemorySourceDrawer } from './MemorySourceDrawer';
import { Database, Eye, Lightbulb, CheckCircle2, History, AlertTriangle } from 'lucide-react';

interface Props {
  message: IAgentMessage;
}

export const AgentMessage: React.FC<Props> = ({ message }) => {
  const [showSources, setShowSources] = useState(false);

  if (message.sender === 'user') {
    return (
      <div className="flex flex-col items-end my-3">
        <div className="max-w-[85%] p-3 rounded-2xl rounded-tr-xs bg-[var(--color-text-main)] text-[var(--color-bg-base)] text-xs font-body shadow-sm">
          {message.content}
        </div>
        <span className="text-[9px] font-mono text-[var(--color-text-subtle)] mt-1 px-1">
          {message.timestamp}
        </span>
      </div>
    );
  }

  if (message.isThinking) {
    return (
      <div className="my-3 p-4 rounded-2xl rounded-tl-xs bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-accent)] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-ping" />
          <span>Hindsight Agent Processing...</span>
        </div>

        {message.thinkingSteps && message.thinkingSteps.length > 0 && (
          <div className="space-y-1.5 pl-4 border-l-2 border-[var(--color-accent-border)] font-mono text-[11px] text-[var(--color-text-muted)]">
            {message.thinkingSteps.map((step, idx) => (
              <p key={idx} className="animate-pulse">
                {step}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (message.error) {
    return (
      <div className="my-3 p-4 rounded-2xl rounded-tl-xs bg-rose-500/10 border border-rose-500/30 text-xs space-y-2">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold">
          <AlertTriangle className="w-4 h-4" />
          <span>Service Failure</span>
        </div>
        <p className="text-[var(--color-text-muted)] font-body">
          {message.errorMessage || 'Organizational memory is temporarily unavailable.'}
        </p>
      </div>
    );
  }

  const answer = message.structuredAnswer;
  const sources = message.sources || [];

  return (
    <div className="my-3 p-4 rounded-2xl rounded-tl-xs bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-4 shadow-sm">
      {answer?.summary && (
        <div className="pb-3 border-b border-[var(--color-border-subtle)]">
          <p className="text-xs font-heading font-medium text-[var(--color-text-main)] leading-relaxed">
            {answer.summary}
          </p>
        </div>
      )}

      {answer?.observed && answer.observed.length > 0 && (
        <div className="p-3 rounded-lg bg-[var(--color-observed-bg)] border border-[var(--color-observed-border)] text-[var(--color-observed-text)] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Eye className="w-3 h-3" />
            <span>OBSERVED (Facts & Evidence)</span>
          </div>
          <ul className="list-disc list-inside text-xs font-body space-y-1 leading-snug">
            {answer.observed.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {answer?.inferred && answer.inferred.length > 0 && (
        <div className="p-3 rounded-lg bg-[var(--color-inferred-bg)] border border-[var(--color-inferred-border)] text-[var(--color-inferred-text)] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Lightbulb className="w-3 h-3" />
            <span>INFERRED (Reasoning & Deductions)</span>
          </div>
          <ul className="list-disc list-inside text-xs font-body space-y-1 leading-snug">
            {answer.inferred.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {answer?.recommended && answer.recommended.length > 0 && (
        <div className="p-3 rounded-lg bg-[var(--color-recommended-bg)] border border-[var(--color-recommended-border)] text-[var(--color-recommended-text)] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            <span>RECOMMENDED (Next Actions)</span>
          </div>
          <ul className="list-disc list-inside text-xs font-body space-y-1 leading-snug">
            {answer.recommended.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {answer?.historicalContext && (
        <div className="p-2.5 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] text-[11px] text-[var(--color-text-muted)] font-body space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-mono font-semibold uppercase text-[var(--color-text-subtle)]">
            <History className="w-3 h-3" />
            <span>HISTORICAL CONTEXT</span>
          </div>
          <p className="leading-snug">{answer.historicalContext}</p>
        </div>
      )}

      {sources.length > 0 && (
        <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[10px] font-mono">
          <button
            onClick={() => setShowSources(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--color-accent-subtle)] text-[var(--color-accent)] hover:underline font-semibold cursor-pointer border border-[var(--color-accent-border)]"
          >
            <Database className="w-3 h-3" />
            <span>Based on {sources.length} organizational memories</span>
          </button>

          <span className="text-[var(--color-text-subtle)]">{message.timestamp}</span>
        </div>
      )}

      {showSources && (
        <MemorySourceDrawer
          memories={sources}
          onClose={() => setShowSources(false)}
        />
      )}
    </div>
  );
};
