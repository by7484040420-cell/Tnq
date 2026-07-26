"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import ServiceGrid from "@/components/ServiceGrid";
import LiveTicker from "@/components/LiveTicker";
import JobListColumn from "@/components/JobListColumn";
import AIAssistantBanner from "@/components/AIAssistantBanner";
import SecurityStrip from "@/components/SecurityStrip";
import BottomNav from "@/components/BottomNav";
import AdBanner from "@/components/AdBanner";
import FeatureTiles from "@/components/FeatureTiles";
import ChakraWatermark from "@/components/ChakraWatermark";
import { documentServices } from "@/data/documents";
import { useAuth } from "@/components/AuthProvider";
import {
  IconTrain, IconDoc, IconShield, IconCap, IconMegaphone, IconTrophy, IconDots,
  IconPanCard, IconFingerprint, IconLicense, IconPassport,
  IconVote, IconHouse, IconRupee, IconPeople,
} from "@/components/Icons";

// Fallback so the card isn't empty for the first paint / if the fetch
// below fails — replaced by live (admin-managed) jobs as soon as they load.
const FALLBACK_LATEST_JOBS = [
  { title: "Railway Group D 2026", tag: "NEW", meta: "Last Date: 23 Aug 2026", Icon: IconTrain },
  { title: "SSC CGL 2026", tag: "NEW", meta: "Last Date: 04 Sep 2026", Icon: IconDoc },
  { title: "Bihar Police Constable", tag: "NEW", meta: "Last Date: 18 Aug 2026", Icon: IconShield },
  { title: "UP Police Constable", tag: "NEW", meta: "Last Date: 10 Sep 2026", Icon: IconShield },
];

const ADMIT_CARDS = [
  { title: "Railway RRB Group D", tag: "NEW", meta: "Admit Card 2026", Icon: IconTrain },
  { title: "SSC CGL Tier 1", tag: "NEW", meta: "Admit Card 2026", Icon: IconDoc },
  { title: "Bihar Police Constable", tag: "NEW", meta: "Admit Card 2026", Icon: IconShield },
  { title: "UP Police Constable", tag: "NEW", meta: "Admit Card 2026", Icon: IconShield },
];

const RESULTS = [
  { title: "SSC GD Result 2026", tag: "NEW", meta: "Declared: 12 Jul 2026", Icon: IconDoc },
  { title: "Bihar Board 12th Result", tag: "NEW", meta: "Declared: 05 Jul 2026", Icon: IconCap },
  { title: "UP Board 10th Result", tag: "NEW", meta: "Declared: 03 Jul 2026", Icon: IconCap },
  { title: "Railway NTPC Result", tag: "NEW", meta: "Declared: 01 Jul 2026", Icon: IconTrain },
];

const UPDATES = [
  { title: "Railway Group D Form Start", meta: "2 min ago", Icon: IconMegaphone },
  { title: "SSC CGL Admit Card Released", meta: "15 min ago", Icon: IconMegaphone },
  { title: "Bihar Police Exam Date Out", meta: "30 min ago", Icon: IconMegaphone },
  { title: "UP Police New Vacancy Soon", meta: "1 hour ago", Icon: IconMegaphone },
];

// Ordered subset + icons for the "लोकप्रिय सेवाएँ" row, matching the BIPIN AI
// reference (PAN, Aadhaar, DL, Passport, Voter ID, Niwas Praman, Income
// Cert, Caste Cert, then a "More" tile to the full /documents list instead
// of dumping all 17 services here).
const POPULAR_DOC_IDS = [
  "pan", "aadhaar", "driving-licence", "passport",
  "voter-id", "residence-certificate", "income-certificate", "caste-certificate",
];
const DOC_ICONS = {
  pan: IconPanCard, aadhaar: IconFingerprint, "driving-licence": IconLicense, passport: IconPassport,
  "voter-id": IconVote, "residence-certificate": IconHouse, "income-certificate": IconRupee,
  "caste-certificate": IconPeople,
};
const DOC_COLORS = {
  pan: "text-brandblue bg-brandblue/10", aadhaar: "text-saffron bg-saffron/10",
  "driving-licence": "text-brandred bg-brandred/10", passport: "text-navy bg-navy/10",
  "voter-id": "text-brandgreen bg-brandgreen/10", "residence-certificate": "text-brandblue bg-brandblue/10",
  "income-certificate": "text-brandgreen bg-brandgreen/10", "caste-certificate": "text-brandpurple bg-brandpurple/10",
};

export default function HomePage() {
  const { requireAuth } = useAuth();
  const router = useRouter();
  const [latestJobs, setLatestJobs] = useState(FALLBACK_LATEST_JOBS);

  useEffect(() => {
    let cancelled = false;
    // FIX: pehle yeh "Latest Jobs" card hamesha hardcoded 4 titles dikhata
    // tha, chahe admin panel se jitne bhi naye jobs add/delete ho jaayein.
    // Ab /api/jobs (lib/db-backed, admin-managed) se live top-4 job aate hain.
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.jobs?.length) return;
        setLatestJobs(
          data.jobs.slice(0, 4).map((j) => ({
            title: j.title,
            tag: "NEW",
            meta: `Last Date: ${j.lastDate}`,
            Icon: IconDoc,
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const popularDocs = POPULAR_DOC_IDS
    .map((id) => documentServices.find((d) => d.id === id))
    .filter(Boolean);

  return (
    <>
      <Header />
      <main className="relative max-w-6xl mx-auto px-4 py-5 flex flex-col gap-5 pb-24 overflow-hidden">
        <ChakraWatermark />

        <ServiceGrid />
        <LiveTicker />

        <a
          href="/states"
          className="bg-white rounded-2xl shadow-card p-4 flex items-center justify-between"
        >
          <span className="flex items-center gap-2 font-semibold text-sm">
            🏛️ Verified State Recruitment Portals
          </span>
          <span className="text-brandblue text-sm font-medium">Dekho →</span>
        </a>

        <AdBanner placement="home-banner" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <JobListColumn title="Latest Jobs" Icon={IconMegaphone} accent="brandred" items={latestJobs} viewAllLabel="View All Jobs" viewAllHref="/jobs" />
          <JobListColumn title="Admit Cards" Icon={IconCap} accent="brandpurple" items={ADMIT_CARDS} viewAllLabel="View All Admit Cards" viewAllHref="/admit-card" />
          <JobListColumn title="Results" Icon={IconTrophy} accent="brandgreen" items={RESULTS} viewAllLabel="View All Results" viewAllHref="/results" />
          <JobListColumn title="Important Updates" Icon={IconMegaphone} accent="saffron" items={UPDATES} viewAllLabel="View All Updates" viewAllHref="/" />
        </div>

        <AIAssistantBanner />

        <div>
          <h2 className="font-display font-bold text-lg mb-3">लोकप्रिय सेवाएँ</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {popularDocs.map((d) => {
              const DIcon = DOC_ICONS[d.id] || IconDoc;
              return (
                <button
                  key={d.id}
                  onClick={() => requireAuth(() => router.push(`/documents/${d.id}`))}
                  className="bg-white rounded-xl shadow-card p-3 flex flex-col items-center gap-2 text-center"
                >
                  <span className={`w-11 h-11 rounded-full flex items-center justify-center ${DOC_COLORS[d.id] || "text-slate-500 bg-slate-100"}`}>
                    <DIcon className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-medium">{d.title}</span>
                </button>
              );
            })}
            <Link
              href="/documents"
              className="bg-white rounded-xl shadow-card p-3 flex flex-col items-center gap-2 text-center"
            >
              <span className="w-11 h-11 rounded-full flex items-center justify-center text-slate-500 bg-slate-100">
                <IconDots className="w-5 h-5" />
              </span>
              <span className="text-xs font-medium">More</span>
            </Link>
          </div>
        </div>

        <FeatureTiles />

        <SecurityStrip />
      </main>
      <BottomNav />
    </>
  );
}
