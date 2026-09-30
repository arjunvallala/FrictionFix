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
          'Why are users abandoning at forced login during checkout?',
          'What product specification friction exists in session_labels.csv?',
          'What is the impact of C_forced_login_long_checkout on conversion?',
        ];
      case 'Marketing':
        return [
          'Why are users experiencing price shock at checkout?',
          'What coupon validation errors were found in session analytics?',
          'How does B_hidden_costs friction affect campaign conversions?',
        ];
      case 'Customer Service':
        return [
          'What is the ticket volume for return and refund friction (I_return_refund_friction)?',
          'Why are support chat bots entering infinite loops (H_unresolved_support_bot_failure)?',
          'What remediation macro is recommended for support bot escalation failures?',
        ];
      case 'Operational Teams':
        return [
          'What infrastructure issues are causing payment OTP failures (A_payment_otp_failure)?',
          'What is the failure count for payment gateway handshakes?',
          'What is the recommended fix for bank 3D-Secure timeout latency?',
        ];
      default:
        return [
          'What friction points were identified in session_labels.csv?',
          'Have we seen payment OTP or checkout friction before?',
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
