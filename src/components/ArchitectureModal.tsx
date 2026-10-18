import React, { useState } from "react";
import {
  X,
  Layers,
  ShieldCheck,
  Cpu,
  Database,
  Cloud,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Workflow,
  Server,
  FileCheck,
  Send,
} from "lucide-react";

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  const [selectedLayer, setSelectedLayer] = useState<number>(0);

  if (!isOpen) return null;

  const architectureLayers = [
    {
      id: "ingestion",
      title: "1. Identity & Document Ingestion",
      color: "blue",
      badge: "Google OAuth 2.0 & Document AI",
      summary: "Zero-password officer authentication and multi-format BFSI packet parsing.",
      components: [
        {
          name: "Google Identity Services (GIS) & OAuth 2.0",
          desc: "Hardware-backed SSO with PKCE, JWT credential validation, role-based access control (RBAC), and session encryption.",
          gcp: "Google Identity / Cloud IAM",
        },
        {
          name: "Document Ingestion Pipeline",
          desc: "Ingests PDF, TIFF, and text packets across Banking KYC, AP Invoices, Health Discharge summaries, and Letters of Credit.",
          gcp: "Cloud Storage Bucket",
        },
        {
          name: "Document AI OCR & Entity Extractor",
          desc: "Optical character recognition, tabular parsing, and form field extraction with layout-aware token coordinates.",
          gcp: "Google Cloud Document AI (Specialized Processors)",
        },
      ],
    },
    {
      id: "rules",
      title: "2. Regulatory Rule Pack & Citation Verifier",
      color: "emerald",
      badge: "Deterministic Zero-Slop Grounding",
      summary: "Strict verbatim matching between submitted packet text and statutory compliance rules.",
      components: [
        {
          name: "Verbatim Citation Verifier",
          desc: "Guarantees that every finding references exact text from source files. Hallucinated quotes are mathematically rejected.",
          gcp: "Deterministic Node/TS Execution Engine",
        },
        {
          name: "Statutory Rule Packs",
          desc: "Pre-indexed regulations: RBI Master Direction (KYC), SOX 404 (AP Matching), IRDAI Health (Waiting periods), and ICC UCP 600 (LCs).",
          gcp: "Vertex AI Search & Knowledge Store",
        },
        {
          name: "Risk Scoring & Decision Engine",
          desc: "Computes weighted risk scores (0-100) and outputs authoritative recommendations: Approve, Query, or Escalate.",
          gcp: "Cloud Run Microservice",
        },
      ],
    },
    {
      id: "gemini",
      title: "3. Generative AI Synthesis & Q&A",
      color: "purple",
      badge: "Gemini 2.5 Flash on Vertex AI",
      summary: "Drafts audit notes and customer resolutions strictly grounded in verified citations.",
      components: [
        {
          name: "Staff Risk Memo Synthesis",
          desc: "Generates internal compliance file memoranda detailing decision rationale, breached sections, and recommended officer actions.",
          gcp: "Gemini 2.5 Flash (via @google/genai)",
        },
        {
          name: "Customer Resolution Letter",
          desc: "Drafts transparent, jargon-free communications informing the applicant of approvals or specific requested clarifications.",
          gcp: "Vertex AI Studio Prompt Templates",
        },
        {
          name: "Interactive Desk Q&A (Ask Desk AI)",
          desc: "Real-time semantic retrieval over packet evidence answering complex officer inquiries with citations.",
          gcp: "Gemini Context Window & Vertex Grounding",
        },
      ],
    },
    {
      id: "audit",
      title: "4. Governance, Audit & Orchestration",
      color: "amber",
      badge: "Event-Driven Immutable Audit Trail",
      summary: "Chronological decision logging, asynchronous event dispatch, and portfolio analytics.",
      components: [
        {
          name: "Asynchronous Review Publisher",
          desc: "Publishes review events to enterprise message queues to trigger automated disbursements or hold flags.",
          gcp: "Google Cloud Pub/Sub",
        },
        {
          name: "Immutable Decision Audit Trail",
          desc: "Cryptographically stores every officer decision, timestamp, Google User ID, and note revision for regulatory inspection.",
          gcp: "Cloud SQL (PostgreSQL) / Cloud Spanner",
        },
        {
          name: "Similar-Case Analytics & Benchmarking",
          desc: "Aggregates historical resolution rates and SLA benchmarks across peer institutional packets.",
          gcp: "Google BigQuery Analytics Engine",
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 border border-blue-400/30">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  FinProof Proposed Solution Architecture
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                  Google Cloud & Gemini
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-End Enterprise Architecture: Identity, Citation Engine, Gemini AI & Audit Ledger
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6">
          {/* Visual Architecture Flowchart Diagram */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-400" />
                System Data Flow & Architectural Topology
              </span>
              <span className="text-[11px] font-mono text-slate-500">Live Production Topology</span>
            </div>

            {/* SVG Interactive Architecture Block Diagram */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[780px] grid grid-cols-4 gap-3 text-xs font-sans">
                {/* Stage 1 */}
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300 text-xs">STAGE 1</span>
                    <Lock className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <div className="font-semibold text-white text-sm">Identity & Ingest</div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>Google OAuth 2.0 / GIS</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Zero-password token auth</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>Document Packets</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">KYC, AP, Claims, LC docs</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>Document AI</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Optical layout OCR & entities</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-blue-400/90 font-mono text-center pt-1 border-t border-blue-900/40">
                    Google Cloud Run
                  </div>
                </div>

                {/* Arrow 1 */}
                {/* Stage 2 */}
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 text-xs">STAGE 2</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="font-semibold text-white text-sm">Citation & Rules</div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>Verbatim Verifier</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Exact document quotation check</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>Rule Packs (RBI / SOX)</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Statutory compliance logic</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>Decision Recommendation</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Approve, Query, Escalate</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-400/90 font-mono text-center pt-1 border-t border-emerald-900/40">
                    Vertex AI Search
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300 text-xs">STAGE 3</span>
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <div className="font-semibold text-white text-sm">Gemini AI Synthesis</div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>Staff Risk Memo</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Grounded compliance file note</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>Customer Resolution</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">External query / approval letter</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>Ask Desk AI</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Interactive evidence Q&A</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-purple-400/90 font-mono text-center pt-1 border-t border-purple-900/40">
                    Gemini 2.5 on Vertex AI
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-xs">STAGE 4</span>
                    <Database className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <div className="font-semibold text-white text-sm">Audit & Analytics</div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>Pub/Sub Event Broker</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Async review event dispatch</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>Immutable Decision Log</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Signed by Google user identity</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-200">
                      <strong>BigQuery Benchmarks</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Historical resolution SLA stats</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-400/90 font-mono text-center pt-1 border-t border-amber-900/40">
                    Cloud SQL & BigQuery
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Deep-Dive Layer Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Detailed Component Specifications
              </span>
              <span className="text-xs text-slate-400">Click a layer to inspect technical details:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {architectureLayers.map((layer, index) => (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(index)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedLayer === index
                      ? "bg-slate-800 border-blue-500 shadow-sm"
                      : "bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="text-[11px] font-bold text-white mb-0.5 truncate">{layer.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{layer.badge}</div>
                </button>
              ))}
            </div>

            {/* Selected Layer Component Detail Cards */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-white">{architectureLayers[selectedLayer].title}</h3>
                  <p className="text-xs text-slate-400">{architectureLayers[selectedLayer].summary}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                  {architectureLayers[selectedLayer].badge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {architectureLayers[selectedLayer].components.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-200 mb-1">{comp.name}</div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{comp.desc}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium">Google Cloud mapping:</span>
                      <span className="text-blue-400 font-mono font-medium truncate max-w-[140px]">
                        {comp.gcp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security & Regulatory Compliance Standard Mapping */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 via-slate-950 to-indigo-950/30 border border-blue-900/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-300">
                <strong>Zero-Slop Guarantee:</strong> All decision citations come strictly from the rule pack and evidence; no citation can be hallucinated.
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono whitespace-nowrap">
              <span>SOC-2 Type II</span>
              <span>•</span>
              <span>ISO 27001</span>
              <span>•</span>
              <span>PMLA / RBI / IRDAI</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>FinProof Desk Architecture • Google Cloud AI Builder Cup 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
}
