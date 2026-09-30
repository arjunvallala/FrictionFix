import sessionData from './sessionAnalyticsData.json';
import type { Department } from '../types';

export interface DepartmentFrictionIssue {
  id: string;
  frictionCode: string;
  title: string;
  affectedSessions: number;
  percentage: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  probableCause: string;
  suggestedAction: string;
  stepLocation: string;
  status: 'Active' | 'Under Investigation' | 'Remediating';
}

export interface DepartmentRemediationTask {
  id: string;
  title: string;
  department: Department;
  assignedRole: string;
  priority: 'Urgent' | 'High' | 'Medium';
  targetTimeline: string;
  impactSessions: number;
  frictionTitle: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface SampleSessionTrace {
  sessionId: string;
  outcome: string;
  primaryFriction: string;
  secondaryFriction: string;
  stepLocation: string;
  department: Department;
}

export interface DepartmentAnalyticsData {
  department: Department;
  totalFrictionSessions: number;
  stepDistribution: Record<string, number>;
  secondaryFrictionCounts: Record<string, number>;
  issues: DepartmentFrictionIssue[];
  tasks: DepartmentRemediationTask[];
  sampleTraces: SampleSessionTrace[];
}

export interface GlobalSessionSummary {
  totalSessionsAnalyzed: number;
  convertedSessions: number;
  abandonedNoFrictionSessions: number;
  totalFrictionAbandonedSessions: number;
  overallFrictionRatePct: number;
  departmentFrictionCounts: Record<Department, number>;
}

export const GLOBAL_SUMMARY: GlobalSessionSummary = sessionData.summary as any;
export const DEPARTMENT_ANALYTICS: Record<string, DepartmentAnalyticsData> = sessionData.departments as any;

export function getDepartmentAnalytics(department: Department): DepartmentAnalyticsData {
  return DEPARTMENT_ANALYTICS[department] || DEPARTMENT_ANALYTICS['Product'];
}
