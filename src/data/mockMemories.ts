import type { Memory } from '../types';

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-101',
    department: 'Product',
    entity: 'C_forced_login_long_checkout',
    observation: '1,155 customer sessions abandoned due to mandatory registration gating prior to checkout.',
    evidence: 'session_labels.csv trace analysis: 1,155 checkout_abandoned events at step: payment/checkout.',
    date: 'September 2026',
    status: 'Active',
    confidence: 0.94,
    category: 'Registration Friction',
    historicalAction: 'Product FAQ updated during previous release cycle.',
    outcome: 'Support questions temporarily decreased by 34%.'
  },
  {
    id: 'mem-102',
    department: 'Product',
    entity: 'F_unclear_product_info',
    observation: '827 product browsing sessions abandoned due to missing technical compatibility specifications.',
    evidence: '827 search & view_2 drop-offs in session_labels.csv dataset.',
    date: 'September 2026',
    status: 'Active',
    confidence: 0.91,
    category: 'Product Specs Friction',
    historicalAction: 'Escalated to Product Engineering team for doc clarification.'
  },
  {
    id: 'mem-103',
    department: 'Marketing',
    entity: 'B_hidden_costs',
    observation: '821 acquisition checkout sessions abandoned when unexpected shipping & service fees appeared at final step.',
    evidence: '821 checkout_abandoned traces with secondary friction: misleading_banner & confusing_terms.',
    date: 'September 2026',
    status: 'Active',
    confidence: 0.95,
    category: 'Pricing Transparency',
    historicalAction: 'Updated landing page header copy to reflect fee structure.',
    outcome: 'Conversion rate recovered by 12%.'
  },
  {
    id: 'mem-104',
    department: 'Marketing',
    entity: 'G_coupon_failure',
    observation: '692 sessions failed promo code validation during campaign checkout.',
    evidence: '692 checkout_abandoned logs with coupon eligibility errors.',
    date: 'September 2026',
    status: 'Active',
    confidence: 0.88,
    category: 'Campaign Friction',
    historicalAction: 'Reverted headline copy to baseline original.',
    outcome: 'Conversion baseline restored within 48 hours.'
  },
  {
    id: 'mem-105',
    department: 'Customer Service',
    entity: 'I_return_refund_friction',
    observation: '4,118 customer sessions suffered post-purchase return & refund process friction.',
    evidence: '4,118 high-severity escalation sessions recorded in session_labels.csv.',
    date: 'September 2026',
    status: 'Active',
    confidence: 0.98,
    category: 'Post-Purchase Support',
    historicalAction: 'Automated return portal specification drafted.',
    outcome: 'Pending deployment.'
  },
  {
    id: 'mem-106',
    department: 'Customer Service',
    entity: 'H_unresolved_support_bot_failure',
    observation: '1,022 customer support chat sessions entered infinite loops without human agent handoff.',
    evidence: '1,022 chat step drop-offs in session_labels.csv.',
    date: 'September 2026',
    status: 'Active',
    confidence: 0.92,
    category: 'Support Bot Friction',
    historicalAction: 'Implemented human escalation fallback macro.'
  },
  {
    id: 'mem-107',
    department: 'Operational Teams',
    entity: 'A_payment_otp_failure',
    observation: '937 payment gateway transactions failed due to 3D-Secure bank OTP timeouts.',
    evidence: '937 payment step timeouts logged in session_labels.csv dataset.',
    date: 'September 2026',
    status: 'Active',
    confidence: 0.96,
    category: 'Payment Infrastructure',
    historicalAction: 'Configured secondary payment gateway auto-routing.',
    outcome: 'Reduced gateway failure impact by 45%.'
  }
];
