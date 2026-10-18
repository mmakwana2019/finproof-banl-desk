import React, { useState, useEffect } from "react";
import type { FinCase, CaseDocument, PipelineResult, Recommendation } from "../types.ts";
import { runPacket } from "../pipeline/run.ts";
import { draftWithGemini, askWithGemini } from "../pipeline/gemini.ts";
import { useAuth } from "../context/AuthContext.tsx";
import {
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Search,
  Copy,
  Check,
  Bot,
  Layers,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

interface CaseDetailProps {
  kase: FinCase;
  onBack: () => void;
  onDecisionSent: (decision: {
    kase: FinCase;
    recommendation: Recommendation;
    staffNote: string;
    customerNote: string;
  }) => void;
}

export function CaseDetail({ kase, onBack, onDecisionSent }: CaseDetailProps) {
  const { user } = useAuth();
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"findings" | "drafts" | "ask" | "pipeline">("findings");
  const [pipelineResult, setPipelineResult] = useState<PipelineResult>(() => runPacket(kase));
  const [highlightedQuote, setHighlightedQuote] = useState<string | null>(null);
  const [staffNote, setStaffNote] = useState<string>(pipelineResult.staffNote);
  const [customerNote, setCustomerNote] = useState<string>(pipelineResult.customerNote);
  const [isDraftingAi, setIsDraftingAi] = useState(false);
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // Ask Desk AI state
  const [questionInput, setQuestionInput] = useState("");
  const [aiAnswers, setAiAnswers] = useState<Array<{ q: string; a: string; gemini: boolean }>>([
    {
      q: `What is the primary compliance requirement for ${kase.workflow}?`,
      a: `Under ${kase.rules[0]?.regulatorySource || "standard BFSI regulatory frameworks"}, the key requirement is ${kase.rules[0]?.text || "adherence to documented evidence and statutory thresholds."}`,
      gemini: false,
    },
  ]);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Re-run pipeline when case changes
  useEffect(() => {
    const res = runPacket(kase);
    setPipelineResult(res);
    setStaffNote(res.staffNote);
    setCustomerNote(res.customerNote);
    setActiveDocIndex(0);
    setHighlightedQuote(null);
  }, [kase]);

  const activeDoc: CaseDocument = kase.documents[activeDocIndex] || kase.documents[0];

  const handleCopyDoc = (body: string, docId: string) => {
    navigator.clipboard.writeText(body);
    setCopiedDocId(docId);
    setTimeout(() => setCopiedDocId(null), 2000);
  };

  const handleTriggerGeminiDraft = async () => {
    setIsDraftingAi(true);
    const drafted = await draftWithGemini(pipelineResult, kase.party, kase.workflow);
    if (drafted) {
      setStaffNote(drafted.staffNote);
      setCustomerNote(drafted.customerNote);
      setPipelineResult((prev) => ({ ...prev, gemini: true }));
    }
    setIsDraftingAi(false);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || isAskingAi) return;
    const q = questionInput.trim();
    setQuestionInput("");
    setIsAskingAi(true);

    const allDocsText = kase.documents.map((d) => `[${d.title}]\n${d.body}`).join("\n\n");
    const res = await askWithGemini(q, allDocsText);
    setAiAnswers((prev) => [{ q, a: res.answer, gemini: res.gemini }, ...prev]);
    setIsAskingAi(false);
  };

  const handleSendDecision = () => {
    onDecisionSent({
      kase,
      recommendation: pipelineResult.recommendation,
      staffNote,
      customerNote,
    });
  };

  // Helper to render document text with highlighted citation
  const renderDocumentBody = (text: string, quoteToHighlight: string | null) => {
    if (!quoteToHighlight) {
      return <span>{text}</span>;
    }

    const lowerText = text.toLowerCase();
    const lowerQuote = quoteToHighlight.toLowerCase().trim();
    const index = lowerText.indexOf(lowerQuote);

    if (index === -1) {
      return <span>{text}</span>;
    }

    const before = text.slice(0, index);
    const match = text.slice(index, index + quoteToHighlight.length);
    const after = text.slice(index + quoteToHighlight.length);

    return (
      <span>
        {before}
        <mark className="bg-amber-400/30 text-amber-200 border-b-2 border-amber-400 px-1 py-0.5 rounded font-semibold shadow-sm animate-pulse">
          {match}
        </mark>
        {after}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Return to case queue"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                {kase.sector}
              </span>
              <span className="text-xs text-slate-400 font-mono">{kase.reference}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{kase.workflow}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{kase.party}</h1>
          </div>
        </div>

        {/* Status & Recommendation Capsule */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Risk Evaluation Score
            </div>
            <div className="flex items-center justify-end gap-1.5 font-mono text-sm font-bold text-slate-200">
              <span
                className={
                  pipelineResult.overallRiskScore > 50
                    ? "text-rose-400"
                    : pipelineResult.overallRiskScore > 25
                    ? "text-amber-400"
                    : "text-emerald-400"
                }
              >
                {pipelineResult.overallRiskScore}/100
              </span>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm shadow-sm ${
              pipelineResult.recommendation === "Approve"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : pipelineResult.recommendation === "Query"
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                : "bg-rose-500/15 text-rose-300 border-rose-500/30"
            }`}
          >
            {pipelineResult.recommendation === "Approve" && <CheckCircle2 className="h-4 w-4" />}
            {pipelineResult.recommendation === "Query" && <AlertCircle className="h-4 w-4" />}
            {pipelineResult.recommendation === "Escalate" && <AlertTriangle className="h-4 w-4" />}
            <span>Decision: {pipelineResult.recommendation}</span>
          </div>

          <button
            onClick={handleSendDecision}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Send className="h-4 w-4" />
            <span>Send Decision</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Packet Documents (5 cols on lg) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[750px]">
          {/* Document Header & Tabs */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                <span className="font-semibold text-sm text-white">Source Packet Documents</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {kase.documents.length} File{kase.documents.length > 1 ? "s" : ""} Ingested
              </span>
            </div>

            {/* Document Selector Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {kase.documents.map((doc, idx) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setActiveDocIndex(idx);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeDocIndex === idx
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
                  }`}
                >
                  <span>{doc.title}</span>
                  <span className="text-[10px] opacity-75">({doc.kind})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Document Sub-header */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="font-medium text-slate-200">{activeDoc.title}</span>
              {activeDoc.referenceNumber && (
                <span className="font-mono text-slate-400">Ref: {activeDoc.referenceNumber}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {highlightedQuote && (
                <button
                  onClick={() => setHighlightedQuote(null)}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  Clear Highlight
                </button>
              )}
              <button
                onClick={() => handleCopyDoc(activeDoc.body, activeDoc.id)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy document text"
              >
                {copiedDocId === activeDoc.id ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Active Document Text View with Citation Highlighting */}
          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap select-text bg-slate-950/40">
            {renderDocumentBody(activeDoc.body, highlightedQuote)}
          </div>

          {/* Citation Guidance Tip */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-blue-400" />
              Tip: Click any cited quote in findings to jump and highlight it.
            </span>
            <span className="text-slate-500 font-mono">{activeDoc.date}</span>
          </div>
        </div>

        {/* Right Column: Rule Pack, Drafts, Ask AI, Pipeline (7 cols on lg) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[750px]">
          {/* Workspace Tabs Header */}
          <div className="p-2 border-b border-slate-800 bg-slate-950/60 flex items-center gap-1">
            <button
              onClick={() => setActiveTab("findings")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "findings"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              <span>Rule Pack & Findings ({kase.checks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("drafts")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "drafts"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>AI Notes & Resolution</span>
            </button>

            <button
              onClick={() => setActiveTab("ask")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "ask"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
              <span>Ask Desk AI</span>
            </button>

            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "pipeline"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span>Audit Steps</span>
            </button>
          </div>

          {/* TAB 1: Rule Pack & Findings */}
          {activeTab === "findings" && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span>Evaluated against {kase.rules.length} statutory rule standards</span>
                <span className="font-mono">
                  {kase.checks.filter((c) => c.pass).length} Passed /{" "}
                  {kase.checks.filter((c) => !c.pass).length} Variances
                </span>
              </div>

              {kase.checks.map((check, idx) => {
                const rule = kase.rules.find((r) => r.id === check.ruleId);
                const isSelectedQuote = highlightedQuote === check.quote;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      check.pass
                        ? "bg-emerald-950/20 border-emerald-900/40"
                        : check.severity === "high"
                        ? "bg-rose-950/20 border-rose-900/40"
                        : "bg-amber-950/20 border-amber-900/40"
                    } ${isSelectedQuote ? "ring-2 ring-amber-400" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-300">
                          {check.ruleId}
                        </span>
                        <span className="text-xs font-semibold text-white">{check.title}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          check.pass
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : check.severity === "high"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {check.pass ? "Pass" : check.severity === "high" ? "Critical Exception" : "Variance"}
                      </span>
                    </div>

                    {rule?.regulatorySource && (
                      <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1 font-mono">
                        <span className="text-slate-500">Statutory Citation:</span>
                        <span>{rule.regulatorySource}</span>
                      </div>
                    )}

                    {/* Cited Evidence Quote (Click to highlight in doc viewer) */}
                    <div
                      onClick={() => {
                        setHighlightedQuote(check.quote);
                        // Also auto-switch to document containing quote
                        const matchingDocIdx = kase.documents.findIndex((d) =>
                          d.body.toLowerCase().includes(check.quote.toLowerCase()),
                        );
                        if (matchingDocIdx !== -1) {
                          setActiveDocIndex(matchingDocIdx);
                        }
                      }}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer mb-2.5 group"
                      title="Click to view and highlight in document"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-mono text-amber-300/90 font-medium">CITED EVIDENCE QUOTE:</span>
                        <span className="text-[10px] text-blue-400 group-hover:underline flex items-center gap-0.5">
                          Show in document
                          <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      </div>
                      <p className="font-mono text-xs text-slate-200 italic">
                        "{check.quote}"
                      </p>
                    </div>

                    {/* Plain English finding */}
                    <p className="text-xs text-slate-300 leading-relaxed">{check.plain}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: AI Notes & Resolution */}
          {activeTab === "drafts" && (
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-white">Grounded Case Memorandums</h3>
                  <p className="text-xs text-slate-400">
                    Drafted strictly from cited evidence. Signed by handler {user?.name}.
                  </p>
                </div>
                <button
                  onClick={handleTriggerGeminiDraft}
                  disabled={isDraftingAi}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isDraftingAi ? "Synthesizing with Gemini..." : "Redraft with Gemini"}</span>
                </button>
              </div>

              {/* Internal Staff Memo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                    Internal Staff & Audit Memo
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">Confidential Risk Record</span>
                </div>
                <textarea
                  value={staffNote}
                  onChange={(e) => setStaffNote(e.target.value)}
                  rows={7}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Customer Communication Note */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                    Customer / Counterparty Resolution Letter
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">To: {kase.party}</span>
                </div>
                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Action dispatch button */}
              <div className="pt-2">
                <button
                  onClick={handleSendDecision}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>
                    Commit Decision ({pipelineResult.recommendation}) & Dispatch Notes as {user?.name}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Ask Desk AI */}
          {activeTab === "ask" && (
            <div className="flex-1 p-5 overflow-hidden flex flex-col justify-between">
              {/* Question list */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span>
                    Ask any question about {kase.party}'s packet. Answers are grounded in the {kase.documents.length} ingested documents.
                  </span>
                </div>

                {aiAnswers.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white font-medium">
                      Q: {item.q}
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                      <div className="flex items-center gap-1.5 text-[10px] text-purple-400 font-sans font-semibold mb-1">
                        <Sparkles className="h-3 w-3" />
                        FinProof Evidence Synthesis {item.gemini ? "(Gemini 2.5)" : "(Grounded Rule Engine)"}
                      </div>
                      {item.a}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAskQuestion} className="pt-3 border-t border-slate-800 mt-2 flex gap-2">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="e.g. What is the address discrepancy? Or what is the waiting period requirement?"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isAskingAi || !questionInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isAskingAi ? "Querying..." : "Ask"}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: Audit Pipeline Steps */}
          {activeTab === "pipeline" && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="text-xs text-slate-400 pb-2 border-b border-slate-800">
                Deterministic compliance execution pipeline steps:
              </div>

              <div className="space-y-3">
                {pipelineResult.steps.map((step) => (
                  <div
                    key={step.step}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs font-mono mt-0.5">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white">{step.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-medium">
                          {step.durationMs}ms
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
                <div className="font-semibold text-slate-200">Google Cloud Architecture Mapping</div>
                <p>• Ingestion & Extract: Document AI OCR & Entity Parsing</p>
                <p>• Rule Pack Caching: Vertex AI Search & Vector Corpus</p>
                <p>• Job Triggering: Cloud Pub/Sub Topic</p>
                <p>• Desk Audit Log: Cloud SQL / Spanner</p>
                <p>• Note Synthesis: Gemini 2.5 on Vertex AI</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
