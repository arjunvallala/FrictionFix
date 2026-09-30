import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentMessage } from './AgentMessage';
import { SuggestedQuestions } from './SuggestedQuestions';
import { Send, Bot, ChevronRight, ChevronLeft, Cpu } from 'lucide-react';

export const AgentPanel: React.FC = () => {
  const { currentDepartment, messages, sendAgentQuery, isLoadingAgent, systemStatus } = useApp();
  const [inputQuery, setInputQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentMessages = messages[currentDepartment] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, isLoadingAgent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoadingAgent) return;

    sendAgentQuery(inputQuery.trim());
    setInputQuery('');
  };

  const handleSelectSuggestedQuestion = (q: string) => {
    sendAgentQuery(q);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-[var(--color-bg-surface)] border-l border-[var(--color-border)] flex flex-col items-center py-4 select-none shrink-0">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-main)] cursor-pointer mb-4"
          title="Expand Intelligence Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="rotate-90 origin-left translate-x-6 text-xs font-mono font-bold tracking-wider text-[var(--color-accent)] uppercase whitespace-nowrap">
          Ask Intelligence (~20%)
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-[22%] min-w-[300px] max-w-[420px] h-full bg-[var(--color-bg-surface)] border-l border-[var(--color-border)] flex flex-col justify-between shrink-0 select-none z-20 transition-all duration-200">
      <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-base text-[var(--color-text-main)]">
              Ask Intelligence
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold border border-[var(--color-accent-border)] uppercase">
              {currentDepartment}
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-subtle)] font-body flex items-center gap-1 mt-0.5">
            <Cpu className="w-3 h-3 text-[var(--color-accent)]" />
            <span>Model: <strong>{systemStatus.configuredProvider}</strong></span>
          </p>
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className="lg:hidden p-1 rounded border border-[var(--color-border)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 font-body">
        {currentMessages.length === 0 ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-center mx-auto text-[var(--color-text-muted)]">
              <Bot className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[var(--color-text-main)]">
                {currentDepartment} Organizational Assistant
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed max-w-[240px] mx-auto mt-1">
                Ask about previous incidents, product compatibility, campaign history, or customer complaints.
              </p>
            </div>

            <SuggestedQuestions
              department={currentDepartment}
              onSelectQuestion={handleSelectSuggestedQuestion}
            />
          </div>
        ) : (
          <>
            {currentMessages.map((msg) => (
              <AgentMessage key={msg.id} message={msg} />
            ))}
          </>
        )}
      </div>

      <div className="p-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <textarea
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask about a problem, previous incident, customer friction, or what happened before..."
              rows={2}
              className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-text-main)] placeholder-[var(--color-text-subtle)] focus:outline-none focus:border-[var(--color-accent)] transition-all resize-none"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoadingAgent}
              className="absolute right-2 bottom-2.5 p-1.5 rounded-lg bg-[var(--color-text-main)] text-[var(--color-bg-base)] disabled:opacity-40 transition-opacity cursor-pointer"
              title="Send Query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-[var(--color-text-subtle)] px-1">
            <span>LLM: {systemStatus.configuredProvider}</span>
            <span>{systemStatus.hindsightConnected ? 'Hindsight Live' : 'Demo Memory'}</span>
          </div>
        </form>
      </div>
    </aside>
  );
};
