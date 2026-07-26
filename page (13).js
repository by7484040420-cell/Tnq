"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { documentServices } from "@/data/documents";
import { useAuth } from "@/components/AuthProvider";

// Index page for all document/portal services — previously only
// /documents/[id] existed, so "More Services" and the bottom-nav
// "Documents" tab both pointed at a 404. This is the missing listing page.
export default function DocumentsPage() {
  const { requireAuth } = useAuth();
  const router = useRouter();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <h1 className="font-display font-bold text-xl mb-4">Documents & Identity Services</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {documentServices.map((d) => (
            <button
              key={d.id}
              onClick={() => requireAuth(() => router.push(`/documents/${d.id}`))}
              className="bg-white rounded-2xl shadow-card p-4 flex flex-col gap-1 text-left"
            >
              <span className="text-xl">📄</span>
              <span className="font-semibold text-sm mt-1">{d.title}</span>
              <span className="text-xs text-slate-400">{d.subtitle}</span>
            </button>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
