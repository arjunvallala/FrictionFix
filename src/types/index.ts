export type Department = 'Product' | 'Marketing' | 'Customer Service' | 'Operational Teams';

export interface User {
  id: string;
  name: string;
  role: string;
  department: Department;
  avatar?: string;
}

export interface Memory {
  id: string;
  department: Department;
  entity: string;
  observation: string;
  evidence: string;
  date: string;
  status: 'Active' | 'Resolved' | 'Under Investigation' | 'Historical';
  confidence: number;
  category?: string;
  historicalAction?: string;
  outcome?: string;
  sourceDepartment?: Department;
}

export interface StructuredAnswer {
  observed: string[];
  inferred: string[];
  recommended: string[];
  historicalContext?: string;
  summary?: string;
}

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  content?: string;
  structuredAnswer?: StructuredAnswer;
  sources?: Memory[];
  isThinking?: boolean;
  thinkingSteps?: string[];
  error?: boolean;
  errorMessage?: string;
}

export type AppTab = 'overview' | 'issues' | 'tasks' | 'memory';

export interface SystemStatus {
  hindsightConnected: boolean;
  isDemoMode: boolean;
  aiProvider: 'gemini' | 'openai' | 'groq' | 'demo';
  configuredProvider: string;
}
