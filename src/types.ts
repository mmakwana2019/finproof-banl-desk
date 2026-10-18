export type Sector = "Banking" | "Financial services" | "Insurance" | "Cross-cutting";

export type Recommendation = "Approve" | "Query" | "Escalate";

export interface Rule {
  id: string;
  name: string;
  text: string;
  category?: string;
  regulatorySource?: string;
}

export interface Check {
  ruleId: string;
  title: string;
  quote: string;
  pass: boolean;
  plain: string;
  severity?: "low" | "medium" | "high";
}

export interface CaseDocument {
  id: string;
  title: string;
  kind: "Identity" | "Proof of Address" | "Purchase Order" | "Invoice" | "Goods Receipt" | "Policy Schedule" | "Hospital Discharge" | "Bill of Lading" | "Financial Statement" | "Packet" | "Upload";
  body: string;
  date?: string;
  referenceNumber?: string;
}

export interface FinCase {
  id: string;
  sector: Sector;
  workflow: string;
  party: string;
  reference: string;
  summary: string;
  recommendation: Recommendation;
  documents: CaseDocument[];
  rules: Rule[];
  checks: Check[];
  similarCaseCount?: number;
  benchmarkRate?: string;
}

export interface AuditStep {
  step: number;
  name: string;
  detail: string;
  status: "complete" | "in_progress" | "pending";
  durationMs: number;
}

export interface PipelineResult {
  id: string;
  recommendation: Recommendation;
  checks: Check[];
  staffNote: string;
  customerNote: string;
  gemini: boolean;
  steps: AuditStep[];
  overallRiskScore: number; // 0 - 100
  evaluatedAt: string;
}

export interface AuditDecisionEvent {
  id: string;
  at: string;
  reference: string;
  party: string;
  workflow: string;
  sector: Sector;
  recommendation: Recommendation;
  handlerName: string;
  handlerEmail: string;
  staffNote: string;
  customerNote: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: string;
  authMethod: "google_oauth" | "google_one_tap" | "google_workspace";
  token: string;
  authenticatedAt: string;
}
