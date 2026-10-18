import React from "react";
import type { FinCase, Sector, Recommendation } from "../types.ts";
import {
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface CaseCardProps {
  kase: FinCase;
  isSelected: boolean;
  onSelect: () => void;
}

export function CaseCard({ kase, isSelected, onSelect }: CaseCardProps) {
  const getSectorStyle = (sector: Sector) => {
    switch (sector) {
      case "Banking":
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
      case "Financial services":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "Insurance":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
      case "Cross-cutting":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    }
  };

  const getRecommendationBadge = (rec: Recommendation) => {
    switch (rec) {
      case "Approve":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approve
          </span>
        );
      case "Query":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertCircle className="h-3.5 w-3.5" />
            Query
          </span>
        );
      case "Escalate":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="h-3.5 w-3.5" />
            Escalate
          </span>
        );
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
        isSelected
          ? "bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
          : "bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Top row: Sector, Reference, Recommendation */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getSectorStyle(
              kase.sector,
            )}`}
          >
            {kase.sector}
          </span>
          <span className="text-xs text-slate-400 font-mono font-medium">{kase.reference}</span>
        </div>
        <div>{getRecommendationBadge(kase.recommendation)}</div>
      </div>

      {/* Main Party & Workflow */}
      <h3 className="font-semibold text-base text-white group-hover:text-blue-300 transition-colors mb-1">
        {kase.party}
      </h3>
      <p className="text-xs text-blue-400/90 font-medium mb-2.5">{kase.workflow}</p>

      {/* Summary */}
      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">{kase.summary}</p>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            {kase.documents.length} doc{kase.documents.length > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
            {kase.rules.length} rule{kase.rules.length > 1 ? "s" : ""}
          </span>
        </div>

        {kase.benchmarkRate && (
          <div className="flex items-center gap-1 text-slate-400">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span className="truncate max-w-[150px]">{kase.benchmarkRate}</span>
          </div>
        )}

        <div className="flex items-center gap-0.5 text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
          <span>Inspect</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}
