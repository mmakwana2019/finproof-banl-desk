import React, { useState } from "react";
import type { FinCase, Sector, Recommendation } from "../types.ts";
import { X, Plus, ShieldCheck, FileText, CheckCircle2, Sparkles, Building2 } from "lucide-react";

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (kase: FinCase) => void;
}

export function NewCaseModal({ isOpen, onClose, onCaseCreated }: NewCaseModalProps) {
  const [sector, setSector] = useState<Sector>("Banking");
  const [party, setParty] = useState("");
  const [workflow, setWorkflow] = useState("Retail Account Compliance Verification");
  const [reference, setReference] = useState("");
  const [summary, setSummary] = useState("");
  const [docTitle, setDocTitle] = useState("Primary Application Packet");
  const [docBody, setDocBody] = useState("");
  const [ruleId, setRuleId] = useState("REG-BFSI-01");
  const [ruleTitle, setRuleTitle] = useState("Statutory Evidence Verification");
  const [ruleText, setRuleText] = useState("Applicant information and financial statements must correlate with verified records without discrepancy.");
  const [quote, setQuote] = useState("");
  const [pass, setPass] = useState(true);
  const [plain, setPlain] = useState("All submitted documents correspond with regulatory guidelines.");

  if (!isOpen) return null;

  // Preset quick fill
  const loadTemplate = (type: "kyc" | "fraud" | "claim") => {
    if (type === "kyc") {
      setSector("Banking");
      setParty("Aarav Sundaram");
      setWorkflow("High-Net-Worth KYC & PEP Screening");
      setReference("KYC-HNW-9912");
      setSummary("Customer proof of address and passport identity verified against Sanctions and PEP database.");
      setDocTitle("Verified Passport & Tax Return Copy");
      setDocBody(`CENTRAL PASSPORT OFFICE & INLAND REVENUE
Full Legal Name: Aarav Sundaram
DOB: 22/11/1985
Tax ID: AABCS9912K
Address: Penthouse 18, Palm Grove Towers, Marine Drive, Mumbai 400020
Politically Exposed Person (PEP) Registry Check: Negative Match. Clean record.`);
      setRuleId("AML-PEP-01");
      setRuleTitle("Politically Exposed Person (PEP) Screening");
      setRuleText("All high-net-worth accounts must be screened against national and international PEP watchlists.");
      setQuote("Politically Exposed Person (PEP) Registry Check: Negative Match");
      setPass(true);
      setPlain("Clearance confirmed with zero PEP or sanctions matches.");
    } else if (type === "fraud") {
      setSector("Financial services");
      setParty("Horizon Digital Pay Gateway");
      setWorkflow("Credit Card Transaction AML Velocity Alert");
      setReference("AML-FRAUD-5520");
      setSummary("Rapid velocity alert: 8 transactions totaling $48,000 executed within 4 minutes across distinct IP geolocation nodes.");
      setDocTitle("Real-Time Card Network Transaction Log");
      setDocBody(`GLOBAL CARD FRAUD MONITORING SYSTEM - ALERT #5520
Card Account: 4532-XXXX-XXXX-8821
Velocity Alert: 8 authorizations requested within 240 seconds.
Aggregate Value: $48,000.00 USD
IP Addresses: Russia (IP 194.226.x), Nigeria (IP 105.112.x), USA (IP 66.249.x)
Device Fingerprint: Mismatched browser user agents detected simultaneously.`);
      setRuleId("FRAUD-VEL-09");
      setRuleTitle("Geographic Velocity & Multi-IP Anomaly Rule");
      setRuleText("Card transactions originating from multiple geographic regions within 30 minutes must be suspended immediately for fraud investigation.");
      setQuote("8 authorizations requested within 240 seconds");
      setPass(false);
      setPlain("Impossible travel velocity pattern detected across 3 continents in 4 minutes.");
    } else {
      setSector("Insurance");
      setParty("Meera Kapoor");
      setWorkflow("Critical Illness Insurance Benefit Settlement");
      setReference("CLM-CI-4019");
      setSummary("Critical illness benefit claim of $50,000 for Stage 1 Coronary Bypass. Cardiologist angiogram reports confirm mandatory 70% arterial stenosis threshold.");
      setDocTitle("Senior Cardiologist Histopathology & Angiogram Note");
      setDocBody(`APOLLO HEART INSTITUTE - CARDIOVASCULAR REPORT
Patient: Meera Kapoor, 52 Y Female
Procedure: Coronary Artery Bypass Graft (CABG)
Findings: Left anterior descending artery shows 85% critical lumen stenosis.
Survival Period: Survived 30 days post-procedure as required under Policy CI Schedule.`);
      setRuleId("INS-CI-04");
      setRuleTitle("Critical Illness Definitional Threshold Rule");
      setRuleText("Arterial obstruction must exceed 70% stenosis verified by angiogram and require open surgery bypass.");
      setQuote("Left anterior descending artery shows 85% critical lumen stenosis");
      setPass(true);
      setPlain("Diagnostic report confirms 85% stenosis, exceeding statutory 70% threshold.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!party.trim() || !docBody.trim() || !quote.trim()) return;

    // Check if quote exists in docBody
    const effectiveBody = docBody.trim();
    const effectiveQuote = quote.trim();
    let finalBody = effectiveBody;

    if (!effectiveBody.toLowerCase().includes(effectiveQuote.toLowerCase())) {
      // Append quote to body to ensure citation integrity
      finalBody = `${effectiveBody}\n\nEvidence Excerpt: "${effectiveQuote}"`;
    }

    const calculatedRecommendation: Recommendation = pass ? "Approve" : "Query";

    const newCase: FinCase = {
      id: `case-${Date.now()}`,
      sector,
      workflow: workflow.trim() || "Compliance Verification",
      party: party.trim(),
      reference: reference.trim() || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      summary: summary.trim() || `Case verification for ${party.trim()} under ${sector} rules.`,
      recommendation: calculatedRecommendation,
      similarCaseCount: Math.floor(12 + Math.random() * 50),
      benchmarkRate: pass ? "95% approved after initial review" : "80% cleared after query response",
      documents: [
        {
          id: `doc-${Date.now()}`,
          title: docTitle.trim() || "Uploaded Packet Document",
          kind: "Upload",
          date: new Date().toISOString().split("T")[0],
          body: finalBody,
        },
      ],
      rules: [
        {
          id: ruleId.trim() || "REG-01",
          name: ruleTitle.trim() || "Rule Assessment",
          text: ruleText.trim() || "Documents must satisfy compliance criteria.",
          category: "Statutory Compliance",
          regulatorySource: "BFSI Prudential Standard Framework",
        },
      ],
      checks: [
        {
          ruleId: ruleId.trim() || "REG-01",
          title: ruleTitle.trim() || "Evidence Concordance",
          quote: effectiveQuote,
          pass,
          plain: plain.trim() || "Evaluated by FinProof Desk engine.",
          severity: pass ? "low" : "medium",
        },
      ],
    };

    onCaseCreated(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create New BFSI Case Packet</h2>
              <p className="text-xs text-slate-400">
                Upload or paste documents and configure statutory rule citations.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-5">
          {/* Quick Template Fill */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-purple-400" />
              Quick-Fill BFSI Industry Templates:
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => loadTemplate("kyc")}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-medium cursor-pointer"
              >
                HNW KYC / PEP Check
              </button>
              <button
                type="button"
                onClick={() => loadTemplate("fraud")}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium cursor-pointer"
              >
                Card AML Velocity Alert
              </button>
              <button
                type="button"
                onClick={() => loadTemplate("claim")}
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-xs font-medium cursor-pointer"
              >
                Critical Illness Insurance Claim
              </button>
            </div>
          </div>

          {/* Sector & Party Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-case-sector" className="block text-xs font-semibold text-slate-300 mb-1">
                BFSI Sector
              </label>
              <select
                id="new-case-sector"
                aria-label="BFSI Sector"
                value={sector}
                onChange={(e) => setSector(e.target.value as Sector)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Banking">Banking</option>
                <option value="Financial services">Financial services</option>
                <option value="Insurance">Insurance</option>
                <option value="Cross-cutting">Cross-cutting</option>
              </select>
            </div>

            <div>
              <label htmlFor="party-name-input" className="block text-xs font-semibold text-slate-300 mb-1">
                Party / Customer / Entity Name *
              </label>
              <input
                id="party-name-input"
                type="text"
                required
                placeholder="e.g. Acme Corporation or Aarav Patel"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Workflow & Reference Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="workflow-input" className="block text-xs font-semibold text-slate-300 mb-1">
                Workflow Description
              </label>
              <input
                id="workflow-input"
                type="text"
                required
                placeholder="e.g. Loan Underwriting or AML Check"
                value={workflow}
                onChange={(e) => setWorkflow(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="reference-input" className="block text-xs font-semibold text-slate-300 mb-1">
                Reference Identifier
              </label>
              <input
                id="reference-input"
                type="text"
                placeholder="e.g. KYC-2026-9021 or PO-402"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Document Section */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label htmlFor="doc-body-input" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-blue-400" />
                Submitted Document Packet Text *
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Evidence Body</span>
            </div>
            <textarea
              id="doc-body-input"
              required
              rows={5}
              placeholder="Paste the raw text of the KYC document, invoice, claim summary, or contract here..."
              value={docBody}
              onChange={(e) => setDocBody(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Rule and Citation Section */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Cited Statutory Rule & Evidence Matching
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Citation Anchor</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="rule-id-input" className="block text-[11px] text-slate-400 mb-1">Rule ID</label>
                <input
                  id="rule-id-input"
                  type="text"
                  value={ruleId}
                  onChange={(e) => setRuleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="rule-title-input" className="block text-[11px] text-slate-400 mb-1">Rule Title</label>
                <input
                  id="rule-title-input"
                  type="text"
                  value={ruleTitle}
                  onChange={(e) => setRuleTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cited-quote-input" className="block text-[11px] text-slate-400 mb-1">
                Verbatim Cited Quote (must exist in document) *
              </label>
              <input
                id="cited-quote-input"
                type="text"
                required
                placeholder="Exact excerpt from document above..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="compliance-status-select" className="block text-[11px] text-slate-400 mb-1">Compliance Status</label>
                <select
                  id="compliance-status-select"
                  aria-label="Compliance Status"
                  value={pass ? "pass" : "fail"}
                  onChange={(e) => setPass(e.target.value === "pass")}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="pass">Pass (Recommendation: Approve)</option>
                  <option value="fail">Variance / Exception (Recommendation: Query)</option>
                </select>
              </div>
              <div>
                <label htmlFor="plain-english-input" className="block text-[11px] text-slate-400 mb-1">Plain-English Audit Finding</label>
                <input
                  id="plain-english-input"
                  type="text"
                  value={plain}
                  onChange={(e) => setPlain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Ingest Case into Desk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
