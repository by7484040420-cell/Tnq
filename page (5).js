"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/components/AuthProvider";

// New page — the bottom nav previously had no matching /wallet route (only
// the /api/wallet API existed), so the tab would 404. This shows balance +
// recent ledger using that same API.
export default function WalletPage() {
  const { user, requireAuth } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      requireAuth(() => {});
      return;
    }
    fetch("/api/wallet")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ balancePaise: 0, ledger: [] }))
      .finally(() => setLoading(false));
  }, [user]);

  const balance = ((data?.balancePaise || 0) / 100).toFixed(2);

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 flex flex-col gap-4">
        <div className="bg-navy rounded-2xl p-6 text-white text-center">
          <div className="text-slate-300 text-sm">Wallet Balance</div>
          <div className="font-display font-bold text-3xl mt-1">₹{balance}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-4 py-3 font-semibold text-sm border-b border-slate-100">
            Recent Activity
          </div>
          {loading ? (
            <div className="px-4 py-6 text-sm text-slate-400 text-center">Load ho raha hai…</div>
          ) : !data?.ledger?.length ? (
            <div className="px-4 py-6 text-sm text-slate-400 text-center">
              Abhi tak koi activity nahi hai.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.ledger.map((entry, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{entry.description || entry.purpose || "Transaction"}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleString("en-IN") : ""}
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${entry.amountPaise < 0 ? "text-brandred" : "text-brandgreen"}`}>
                    {entry.amountPaise < 0 ? "-" : "+"}₹{Math.abs((entry.amountPaise || 0) / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
