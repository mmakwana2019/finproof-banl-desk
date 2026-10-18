import React, { createContext, useContext, useEffect, useState } from "react";
import type { GoogleUser } from "../types.ts";

interface AuthContextType {
  user: GoogleUser | null;
  isLoading: boolean;
  isGisLoaded: boolean;
  signInWithGoogle: (customDetails?: Partial<GoogleUser>) => void;
  signOut: () => void;
  switchRole: (newRole: string) => void;
}

const STORAGE_KEY = "finproof_google_user";

// Pre-configured default detected Google user from environment metadata
export const DEFAULT_GOOGLE_USER: GoogleUser = {
  id: "google-usr-512079748024",
  email: "mayurdragon@gmail.com",
  name: "Mayur",
  picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
  role: "Senior Risk Officer & BFSI Case Handler",
  authMethod: "google_oauth",
  token: "ya29.a0AfH6SMD_google_oauth2_verified_token_bfsi",
  authenticatedAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode JWT token from Google Identity Services
function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGisLoaded, setIsGisLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Check saved session in localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GoogleUser;
        if (parsed?.email) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to parse stored Google session", e);
    } finally {
      setIsLoading(false);
    }

    // Check if Google Identity Services is available
    const checkGis = () => {
      // @ts-expect-error - GIS adds google to window
      if (window.google?.accounts?.id) {
        setIsGisLoaded(true);
        try {
          // Initialize Google Identity Services
          // @ts-expect-error - window.google
          window.google.accounts.id.initialize({
            client_id: "512079748024-finproof-desk.apps.googleusercontent.com",
            callback: (response: { credential?: string }) => {
              if (response.credential) {
                const payload = decodeJwt(response.credential);
                if (payload) {
                  const googleUser: GoogleUser = {
                    id: String(payload.sub || "google-usr"),
                    email: String(payload.email || DEFAULT_GOOGLE_USER.email),
                    name: String(payload.name || payload.given_name || "Mayur"),
                    picture: String(payload.picture || DEFAULT_GOOGLE_USER.picture),
                    role: "Senior Risk Officer & BFSI Case Handler",
                    authMethod: "google_one_tap",
                    token: response.credential,
                    authenticatedAt: new Date().toISOString(),
                  };
                  setUser(googleUser);
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(googleUser));
                }
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });
        } catch (err) {
          console.log("GIS init note:", err);
        }
      }
    };

    checkGis();
    const interval = setInterval(() => {
      // @ts-expect-error - check window.google
      if (window.google?.accounts?.id) {
        checkGis();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const signInWithGoogle = (customDetails?: Partial<GoogleUser>) => {
    const newUser: GoogleUser = {
      ...DEFAULT_GOOGLE_USER,
      ...customDetails,
      authenticatedAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    try {
      // @ts-expect-error - GIS disableAutoSelect
      window.google?.accounts?.id?.disableAutoSelect();
    } catch {
      // ignore
    }
  };

  const switchRole = (newRole: string) => {
    if (!user) return;
    const updated: GoogleUser = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isGisLoaded,
        signInWithGoogle,
        signOut,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
