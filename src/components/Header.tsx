import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import {
  ShieldCheck,
  LogOut,
  History,
  PlusCircle,
  ChevronDown,
  Sparkles,
  Workflow,
} from "lucide-react";

interface HeaderProps {
  onOpenAuditLog: () => void;
  onOpenNewCase: () => void;
  onOpenArchitecture: () => void;
  activeCaseCount: number;
}

export function Header({
  onOpenAuditLog,
  onOpenNewCase,
  onOpenArchitecture,
  activeCaseCount,
}: HeaderProps) {
  const { user, signOut, switchRole } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const roles = [
    "Senior Risk Officer & BFSI Case Handler",
    "Lead Regulatory Compliance Auditor",
    "Chief Underwriting & Claims Assessor",
    "Head of Trade Finance & Operations",
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Desk Identity */}
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/30">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-mono">FinProof</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                BFSI DESK
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Rule Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Banking, Financial Services & Insurance Compliance | {activeCaseCount} Active Cases
            </p>
          </div>
        </div>

        {/* Right side actions & Authenticated Google Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Action: New Case */}
          <button
            onClick={onOpenNewCase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Case Packet</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* Quick Action: Audit Log */}
          <button
            onClick={onOpenAuditLog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <History className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Audit Trail</span>
          </button>

          {/* Quick Action: Architecture Diagram */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 text-xs font-medium transition-colors cursor-pointer"
            title="Inspect proposed solution architecture diagram"
          >
            <Workflow className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">Architecture Diagram</span>
            <span className="sm:hidden">Architecture</span>
          </button>

          {/* Google User Profile Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer text-left"
              >
                {/* Avatar with Google G indicator */}
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs border border-white/20">
                    {user.name.charAt(0)}
                  </div>
                  {/* Google small dot */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-white flex items-center justify-center shadow-xs">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="hidden md:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white leading-tight">{user.name}</span>
                    <span className="px-1 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-mono">
                      Google OAuth
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-[140px]">{user.email}</p>
                </div>

                <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User info banner */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                      <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-inner">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-white truncate">{user.name}</div>
                        <div className="text-xs text-slate-400 font-mono truncate">{user.email}</div>
                        <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium mt-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Authenticated via Google SSO
                        </div>
                      </div>
                    </div>

                    {/* Role switcher */}
                    <div className="py-3 border-b border-slate-800">
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Active Assignment Role
                      </label>
                      <select
                        value={user.role}
                        onChange={(e) => switchRole(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Security token info */}
                    <div className="py-2.5 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Google Session:</span>
                      <span className="text-slate-400 font-mono">Active (OAuth 2.0)</span>
                    </div>

                    {/* Sign out */}
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        signOut();
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium text-xs flex items-center justify-center gap-2 border border-rose-500/20 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out of Google
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
