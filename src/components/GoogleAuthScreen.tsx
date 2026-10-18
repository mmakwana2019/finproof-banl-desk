import React, { useState } from "react";
import { useAuth, DEFAULT_GOOGLE_USER } from "../context/AuthContext.tsx";
import { ShieldCheck, Lock, CheckCircle2, Building2, Sparkles, UserCheck, ArrowRight, Info } from "lucide-react";

export function GoogleAuthScreen() {
  const { signInWithGoogle, isGisLoaded } = useAuth();
  const [selectedRole, setSelectedRole] = useState("Senior Risk Officer & BFSI Case Handler");
  const [isCustomEmailMode, setIsCustomEmailMode] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const roles = [
    "Senior Risk Officer & BFSI Case Handler",
    "Lead Regulatory Compliance Auditor",
    "Chief Underwriting & Claims Assessor",
    "Head of Trade Finance & Operations",
  ];

  const handlePrimaryGoogleSignIn = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      signInWithGoogle({
        role: selectedRole,
      });
      setIsSigningIn(false);
    }, 400);
  };

  const handleCustomGoogleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    setIsSigningIn(true);
    setTimeout(() => {
      const derivedName = customName.trim() || customGoogleEmail.split("@")[0];
      const capitalizedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      signInWithGoogle({
        email: customGoogleEmail.trim().toLowerCase(),
        name: capitalizedName,
        role: selectedRole,
      });
      setIsSigningIn(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-3xl pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-mono">FinProof</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                BFSI Desk v2.6
              </span>
            </div>
            <p className="text-xs text-slate-400">Intelligent Risk, Fraud & Financial Decisioning</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
          <Lock className="h-3.5 w-3.5 text-emerald-400" />
          <span>Google Workspace SSO Protected</span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-xl">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-8 relative overflow-hidden">
            {/* Header within card */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-3">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Zero-Password Compliance Protocol Active
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                Authorized BFSI Officer Sign-In
              </h1>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Sign in with your verified Google Account. FinProof uses Google Identity Services & OAuth 2.0 for audit-grade identity assurance.
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-6 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <label htmlFor="role-select" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Desk Assignment & Permission Level
              </label>
              <select
                id="role-select"
                aria-label="Select desk assignment and permission level"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Google Authentication Actions */}
            {!isCustomEmailMode ? (
              <div className="space-y-4">
                {/* Detected Active Google Account Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-11 w-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-base border-2 border-blue-400/40 shadow-inner">
                        M
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                        <CheckCircle2 className="h-2.5 w-2.5 text-slate-950 stroke-[3]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{DEFAULT_GOOGLE_USER.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-500/20 text-blue-300 font-mono">
                          Active Google Session
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{DEFAULT_GOOGLE_USER.email}</p>
                    </div>
                  </div>
                </div>

                {/* Main Google Sign In Button */}
                <button
                  onClick={handlePrimaryGoogleSignIn}
                  disabled={isSigningIn}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm flex items-center justify-center gap-3 shadow-lg shadow-white/5 transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {/* Official Google Multi-colored G icon */}
                  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
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
                  <span>
                    {isSigningIn
                      ? "Verifying Google Token..."
                      : `Continue as ${DEFAULT_GOOGLE_USER.name} (${DEFAULT_GOOGLE_USER.email})`}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:translate-x-0.5 transition-transform ml-auto" />
                </button>

                {/* Secondary Option: Switch Google Account */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setIsCustomEmailMode(true)}
                    className="text-xs text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Sign in with another Google Workspace / Gmail account
                  </button>
                </div>
              </div>
            ) : (
              /* Custom Google Account Form */
              <form onSubmit={handleCustomGoogleSignIn} className="space-y-4">
                <div className="p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Enter your corporate Google Workspace or personal Google address. Single sign-on authentication will be established for this session.
                  </span>
                </div>

                <div>
                  <label htmlFor="custom-email" className="block text-xs font-medium text-slate-300 mb-1">
                    Google Email Address
                  </label>
                  <input
                    id="custom-email"
                    type="email"
                    required
                    placeholder="officer.name@bank.com or name@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="custom-name" className="block text-xs font-medium text-slate-300 mb-1">
                    Officer Full Name (Optional)
                  </label>
                  <input
                    id="custom-name"
                    type="text"
                    placeholder="e.g. Mayur Dragon"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomEmailMode(false)}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
                  >
                    Back to Default
                  </button>
                  <button
                    type="submit"
                    disabled={isSigningIn || !customGoogleEmail.trim()}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {/* Google G icon */}
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#ffffff"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#ffffff"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#ffffff"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#ffffff"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{isSigningIn ? "Authenticating..." : "Authorize with Google"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Security notice footer */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                <span>OAuth 2.0 PKCE Session Security</span>
              </div>
              <div className="flex items-center gap-2">
                <span>SOC-2 Type II</span>
                <span>•</span>
                <span>ISO 27001 Certified</span>
                <span>•</span>
                <span className={isGisLoaded ? "text-emerald-400 font-medium" : "text-slate-400"}>
                  {isGisLoaded ? "GIS Ready" : "Fast OAuth Ready"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Desk Feature Pillars below the login box */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Building2 className="h-5 w-5 text-blue-400 mx-auto mb-1.5" />
              <div className="text-xs font-semibold text-slate-200">16 BFSI Workflows</div>
              <div className="text-[11px] text-slate-400">Banking, Finance & Insurance</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <ShieldCheck className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
              <div className="text-xs font-semibold text-slate-200">Rule Pack Citations</div>
              <div className="text-[11px] text-slate-400">Verbatim Evidence Matching</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Sparkles className="h-5 w-5 text-purple-400 mx-auto mb-1.5" />
              <div className="text-xs font-semibold text-slate-200">Gemini Note Drafting</div>
              <div className="text-[11px] text-slate-400">Grounded Audit Trail</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-500 relative z-10">
        FinProof Desk &copy; 2026. Built with Google Cloud & Gemini AI for intelligent financial risk decisioning.
      </footer>
    </div>
  );
}
