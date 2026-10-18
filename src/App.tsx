import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import { GoogleAuthScreen } from "./components/GoogleAuthScreen.tsx";
import { Header } from "./components/Header.tsx";
import { CaseCard } from "./components/CaseCard.tsx";
import { CaseDetail } from "./components/CaseDetail.tsx";
import { AuditTrailModal } from "./components/AuditTrailModal.tsx";
import { NewCaseModal } from "./components/NewCaseModal.tsx";
import { ArchitectureModal } from "./components/ArchitectureModal.tsx";
import { initialCases } from "./corpus/cases.ts";
import type { FinCase, Sector, Recommendation, AuditDecisionEvent } from "./types.ts";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Building2,
  Layers,
  Sparkles,
  TrendingUp,
  Filter,
} from "lucide-react";

function FinProofMain() {
  const { user } = useAuth();
  const [cases, setCases] = useState<FinCase[]>(initialCases);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<Sector | "All">("All");
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [auditEvents, setAuditEvents] = useState<AuditDecisionEvent[]>([
    {
      id: "evt-initial-1",
      at: new Date(Date.now() - 3600000 * 4).toISOString(),
      reference: "KYC-2026-8812",
      party: "Priya Sharma",
      workflow: "Retail Onboarding & AML-KYC Verification",
      sector: "Banking",
      recommendation: "Query",
      handlerName: user?.name || "Mayur",
      handlerEmail: user?.email || "mayurdragon@gmail.com",
      staffNote: "Building designation alias flagged ('Sunshine Apts' vs 'Sunshine Heights'). Dispatched customer address confirmation query.",
      customerNote: "Dear Priya Sharma, please confirm your residential address variant.",
    },
  ]);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || null;

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const matchesSector = selectedSector === "All" || c.sector === selectedSector;
    const matchesRecommendation =
      selectedRecommendation === "All" || c.recommendation === selectedRecommendation;
    const matchesSearch =
      searchQuery.trim() === "" ||
      c.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.workflow.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSector && matchesRecommendation && matchesSearch;
  });

  // Handle case decision sent
  const handleDecisionSent = (decision: {
    kase: FinCase;
    recommendation: Recommendation;
    staffNote: string;
    customerNote: string;
  }) => {
    const newEvent: AuditDecisionEvent = {
      id: `evt-${Date.now()}`,
      at: new Date().toISOString(),
      reference: decision.kase.reference,
      party: decision.kase.party,
      workflow: decision.kase.workflow,
      sector: decision.kase.sector,
      recommendation: decision.recommendation,
      handlerName: user?.name || "Officer",
      handlerEmail: user?.email || "officer@bank.com",
      staffNote: decision.staffNote,
      customerNote: decision.customerNote,
    };

    setAuditEvents((prev) => [newEvent, ...prev]);
    showToast(`Decision (${decision.recommendation}) dispatched and recorded in immutable audit log.`);
  };

  const handleCaseCreated = (newCase: FinCase) => {
    setCases((prev) => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    showToast(`New case packet for ${newCase.party} ingested successfully.`);
  };

  // Metrics
  const approvedCount = cases.filter((c) => c.recommendation === "Approve").length;
  const queryCount = cases.filter((c) => c.recommendation === "Query").length;
  const escalateCount = cases.filter((c) => c.recommendation === "Escalate").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header with Authenticated Google User Details */}
      <Header
        activeCaseCount={cases.length}
        onOpenAuditLog={() => setIsAuditModalOpen(true)}
        onOpenNewCase={() => setIsNewCaseModalOpen(true)}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {selectedCase ? (
          /* Detailed Case View */
          <CaseDetail
            kase={selectedCase}
            onBack={() => setSelectedCaseId(null)}
            onDecisionSent={handleDecisionSent}
          />
        ) : (
          /* Case Queue Overview */
          <div className="space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Queue
                  </div>
                  <div className="text-2xl font-bold text-white font-mono mt-1">{cases.length}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">BFSI live packets</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Layers className="h-5 w-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Approve Ready
                  </div>
                  <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">{approvedCount}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Straight-through</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-600/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                    Queries Pending
                  </div>
                  <div className="text-2xl font-bold text-amber-300 font-mono mt-1">{queryCount}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Awaiting verification</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-600/15 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                    Escalations
                  </div>
                  <div className="text-2xl font-bold text-rose-300 font-mono mt-1">{escalateCount}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Material variance</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-rose-600/15 text-rose-400 flex items-center justify-center border border-rose-500/20">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Live Demo Quick Jump Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-xs text-white">Live Benchmark Demos:</span>
                  <span className="text-xs text-slate-400 ml-1.5">
                    Click to inspect the 3 primary workflow cases with rule pack citations.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCaseId("kyc-priya-sharma")}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>1. Priya Sharma (KYC Mismatch)</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">
                    Query
                  </span>
                </button>

                <button
                  onClick={() => setSelectedCaseId("inv-204-po-118")}
                  className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>2. INV-204 vs PO-118 (Invoice 3-Way)</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300">
                    Escalate
                  </span>
                </button>

                <button
                  onClick={() => setSelectedCaseId("clm-rohan-mehta")}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>3. Rohan Mehta (Health Claim)</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    Approve
                  </span>
                </button>
              </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              {/* Sector Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {(["All", "Banking", "Financial services", "Insurance", "Cross-cutting"] as const).map(
                  (sec) => {
                    const count =
                      sec === "All" ? cases.length : cases.filter((c) => c.sector === sec).length;
                    return (
                      <button
                        key={sec}
                        onClick={() => setSelectedSector(sec)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedSector === sec
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-800/80 hover:bg-slate-800 text-slate-300"
                        }`}
                      >
                        <span>{sec === "All" ? "All Sectors" : sec}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            selectedSector === sec ? "bg-white/20 text-white" : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>

              {/* Status & Search Row */}
              <div className="flex items-center gap-3">
                {/* Status Filter */}
                <select
                  aria-label="Filter cases by status"
                  value={selectedRecommendation}
                  onChange={(e) =>
                    setSelectedRecommendation(e.target.value as Recommendation | "All")
                  }
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Approve">Approve</option>
                  <option value="Query">Query</option>
                  <option value="Escalate">Escalate</option>
                </select>

                {/* Search Bar */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search party, ref, or keyword..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Case Cards Grid */}
            {filteredCases.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500">
                <Filter className="h-8 w-8 mx-auto mb-2 text-slate-600 opacity-60" />
                <p className="text-sm font-medium">No case packets matching filter criteria.</p>
                <button
                  onClick={() => {
                    setSelectedSector("All");
                    setSelectedRecommendation("All");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs text-blue-400 hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCases.map((kase) => (
                  <CaseCard
                    key={kase.id}
                    kase={kase}
                    isSelected={selectedCaseId === kase.id}
                    onSelect={() => setSelectedCaseId(kase.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Audit Trail Modal */}
      <AuditTrailModal
        events={auditEvents}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* New Case Modal */}
      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onCaseCreated={handleCaseCreated}
      />

      {/* Proposed Solution Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-blue-600 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-5 w-5 text-blue-200 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-500">
        FinProof Desk &copy; 2026. Signed in as {user?.name} ({user?.email}) via Google OAuth 2.0. Bank-grade compliance architecture.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span>Initializing FinProof Google Identity Session...</span>
        </div>
      </div>
    );
  }

  // If user is not authenticated with Google, present Google Authentication Screen!
  if (!user) {
    return <GoogleAuthScreen />;
  }

  return <FinProofMain />;
}
