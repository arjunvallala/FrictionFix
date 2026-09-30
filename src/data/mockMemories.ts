import type { Memory } from '../types';

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-101',
    department: 'Product',
    entity: 'P500',
    observation: 'Customers repeatedly experienced compatibility confusion with legacy API integrations during system rollout.',
    evidence: '137 related support conversations and 42 dev portal inquiry tickets.',
    date: 'September 2026',
    status: 'Active',
    confidence: 0.86,
    category: 'Compatibility Friction',
    historicalAction: 'Product FAQ updated during previous release cycle.',
    outcome: 'Support questions temporarily decreased by 34%.'
  },
  {
    id: 'mem-102',
    department: 'Customer Service',
    entity: 'P500',
    observation: 'Compatibility questions and average ticket resolution times increased significantly following v4.2 update.',
    evidence: '137 customer support tickets tagged #compatibility and #legacy-api.',
    date: 'September 2026',
    status: 'Active',
    confidence: 0.92,
    category: 'Support Escalation',
    historicalAction: 'Escalated to Product Engineering team for doc clarification.'
  },
  {
    id: 'mem-103',
    department: 'Product',
    entity: 'P500',
    observation: 'Similar compatibility friction occurred during previous minor version release.',
    evidence: 'Engineering post-mortem audit document #PM-2026-05.',
    date: 'May 2026',
    status: 'Historical',
    confidence: 0.95,
    category: 'Historical Incident',
    historicalAction: 'Product FAQ updated.',
    outcome: 'Support questions temporarily decreased.'
  },
  {
    id: 'mem-104',
    department: 'Marketing',
    entity: 'Q3-Growth-Campaign',
    observation: 'Campaign conversion rate dropped by 18% following headline variant B copy test.',
    evidence: '12,400 user session analytics recordings & click-map heatmaps.',
    date: 'September 2026',
    status: 'Active',
    confidence: 0.89,
    category: 'Conversion Friction',
    historicalAction: 'Reverted headline copy to baseline original.',
    outcome: 'Conversion baseline restored within 48 hours.'
  },
  {
    id: 'mem-105',
    department: 'Marketing',
    entity: 'P500',
    observation: 'Campaign messaging highlighted enterprise sync capabilities, creating mismatched expectation for legacy system customers.',
    evidence: '450 customer acquisition feedback survey responses.',
    date: 'September 2026',
    status: 'Under Investigation',
    confidence: 0.81,
    category: 'Messaging Mismatch'
  },
  {
    id: 'mem-106',
    department: 'Customer Service',
    entity: 'Auth-Flow',
    observation: 'Single Sign-On (SSO) session timeout caused elevated complaint rates during peak login hours.',
    evidence: '89 tier-2 customer support escalation tickets.',
    date: 'August 2026',
    status: 'Resolved',
    confidence: 0.94,
    category: 'Authentication Friction',
    historicalAction: 'Increased token expiration window to 12 hours.',
    outcome: 'Logout complaints reduced to zero.'
  }
];
