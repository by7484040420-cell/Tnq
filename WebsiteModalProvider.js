"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

const WebsiteModalContext = createContext(null);

export function useWebsiteModal() {
  const ctx = useContext(WebsiteModalContext);
  if (!ctx) throw new Error("useWebsiteModal must be used inside WebsiteModalProvider");
  return ctx;
}

export default function WebsiteModalProvider({ children }) {
  const [site, setSite] = useState(null); // { url, name }
  const [showFallback, setShowFallback] = useState(false);
  const timerRef = useRef(null);

  const openSite = useCallback((url, name) => {
    setShowFallback(false);
    setSite({ url, name });
  }, []);

  const closeSite = useCallback(() => {
    setSite(null);
    setShowFallback(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!site) return;
    // Many government sites block embedding on their end (X-Frame-Options / CSP).
    // We can't reliably detect that from JS for cross-origin pages, so after a
    // short wait we quietly offer a fallback instead of leaving a blank screen.
    timerRef.current = setTimeout(() => setShowFallback(true), 4000);
    return () => clearTimeout(timerRef.current);
  }, [site]);

  return (
    <WebsiteModalContext.Provider value={{ openSite, closeSite }}>
      {children}

      {site && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-brandgreen flex-shrink-0" />
              <span className="font-semibold text-sm truncate">{site.name}</span>
            </div>
            <button
              onClick={closeSite}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0"
              aria-label="Band karo"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 relative">
            <iframe
              key={site.url}
              src={site.url}
              title={site.name}
              className="w-full h-full border-0"
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
              referrerPolicy="no-referrer"
            />

            {showFallback && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-navy text-white text-xs rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
                <span>Site load nahi ho rahi?</span>
                <button
                  onClick={() => {
                    window.open(site.url, "_blank", "noopener,noreferrer");
                    closeSite();
                  }}
                  className="bg-white text-navy rounded-full px-3 py-1 font-semibold"
                >
                  Browser mein kholo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </WebsiteModalContext.Provider>
  );
}
