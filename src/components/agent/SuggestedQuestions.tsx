import React from 'react';
import type { Department } from '../../types';
import { Sparkles } from 'lucide-react';

interface Props {
  department: Department;
  onSelectQuestion: (q: string) => void;
}

export const SuggestedQuestions: React.FC<Props> = ({ department, onSelectQuestion }) => {
  const getQuestions = (): string[] => {
    switch (department) {
      case 'Product':
        return [
          'Why are customers having problems with P500?',
          'Have customers reported a similar issue before?',
          'What product problems have we seen recently?',
        ];
      case 'Marketing':
        return [
          'Have we seen this campaign problem before?',
          'What happened during the previous conversion decline?',
          'How does P500 compatibility friction impact marketing?',
        ];
      case 'Customer Service':
        return [
          'Have we seen this complaint before?',
          'What was the previous resolution for P500 complaints?',
          'What support friction trends are active?',
        ];
      default:
        return [
          'What does the organization remember about P500?',
          'Have we seen this problem before?',
        ];
    }
  };

  const questions = getQuestions();

  return (
    <div className="space-y-1.5 my-3">
      <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--color-text-subtle)] uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-[var(--color-accent)]" />
        <span>Suggested {department} Questions</span>
      </div>
      <div className="space-y-1">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(q)}
            className="w-full text-left p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent-border)] text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-all cursor-pointer font-body leading-tight"
          >
            "{q}"
          </button>
        ))}
      </div>
    </div>
  );
};
