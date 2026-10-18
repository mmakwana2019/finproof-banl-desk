import React from "react";
import type { AuditDecisionEvent } from "../types.ts";
import { X, History, CheckCircle2, AlertCircle, AlertTriangle, User, Calendar, FileText } from "lucide-react";

interface AuditTrailModalProps {
  events: AuditDecisionEvent[];
  isOpen: boolean;
  onClose: () => void;
}

export function AuditTrailModal({ events, isOpen, onClose }: AuditTrailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Desk Audit Trail & Decision Log</h2>
              <p className="text-xs text-slate-400">
                Immutable record of compliance decisions signed via Google Authentication.
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

        {/* Content List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <History className="h-8 w-8 mx-auto mb-2 text-slate-600 opacity-50" />
              <p>No decisions dispatched yet in this session.</p>
              <p className="text-xs text-slate-600 mt-1">
                Inspect a case and click "Send Decision" to sign an official audit event.
              </p>
            </div>
          ) : (
            events.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{evt.party}</span>
                    <span className="text-xs font-mono text-slate-400">{evt.reference}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                      {evt.sector}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      evt.recommendation === "Approve"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : evt.recommendation === "Query"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {evt.recommendation === "Approve" && <CheckCircle2 className="h-3 w-3" />}
                    {evt.recommendation === "Query" && <AlertCircle className="h-3 w-3" />}
                    {evt.recommendation === "Escalate" && <AlertTriangle className="h-3 w-3" />}
                    <span>{evt.recommendation}</span>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-400" />
                    Signed by: <strong className="text-slate-200">{evt.handlerName}</strong> ({evt.handlerEmail})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    {new Date(evt.at).toLocaleString()}
                  </span>
                </div>

                {evt.staffNote && (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    <div className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <FileText className="h-3 w-3 text-slate-500" />
                      Recorded Staff Memo
                    </div>
                    {evt.staffNote}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Google Workspace Audit Verification ID: ISO-27001</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
}
