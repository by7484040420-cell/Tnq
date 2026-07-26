"use client";

import Link from "next/link";
import { useWebsiteModal } from "@/components/WebsiteModalProvider";
import {
  IconTrain, IconBriefcase, IconIdCard, IconTrophy, IconDoc,
  IconLand, IconBank, IconCap, IconRupee, IconDots,
} from "@/components/Icons";

// Solid-color blocks (icon + title + subtitle + pill CTA) — matches the
// "BIPIN AI" home page reference design. Each entry needs a `ring` shade
// (border) a touch lighter than the fill, and a `btn` shade for the CTA
// pill so it reads clearly on top of the solid background.
const COLOR_CLASSES = {
  brandblue: { bg: "bg-brandblue", ring: "ring-blue-300/40", btn: "bg-blue-800/60" },
  brandpurple: { bg: "bg-brandpurple", ring: "ring-purple-300/40", btn: "bg-purple-800/60" },
  brandred: { bg: "bg-brandred", ring: "ring-red-300/40", btn: "bg-red-800/60" },
  brandgreen: { bg: "bg-brandgreen", ring: "ring-green-300/40", btn: "bg-green-800/60" },
  saffron: { bg: "bg-saffron", ring: "ring-orange-200/50", btn: "bg-orange-800/60" },
  brandpink: { bg: "bg-brandpink", ring: "ring-pink-300/40", btn: "bg-pink-800/60" },
  brandteal: { bg: "bg-brandteal", ring: "ring-teal-300/40", btn: "bg-teal-800/60" },
};

// type: "internal" -> Next.js route inside this app
// type: "external" -> opens in-app via WebsiteModalProvider (real, verified official site)
const SERVICES = [
  { title: "IRCTC & Ticket", subtitle: "Train, Bus, Flight, PNR", Icon: IconTrain, cta: "Book Now", color: "brandblue", type: "external", url: "https://www.irctc.co.in" },
  { title: "Jobs & Exams", subtitle: "Govt & Private Jobs", Icon: IconBriefcase, cta: "View Jobs", color: "brandpurple", type: "internal", href: "/jobs" },
  { title: "Admit Card", subtitle: "All Admit Cards", Icon: IconIdCard, cta: "View All", color: "brandred", type: "internal", href: "/admit-card" },
  { title: "Results", subtitle: "All Results & Merit", Icon: IconTrophy, cta: "View Results", color: "brandgreen", type: "internal", href: "/results" },
  { title: "Documents & Identity", subtitle: "PAN, DL, Passport", Icon: IconDoc, cta: "Explore", color: "brandblue", type: "internal", href: "/documents" },
  { title: "Land & Property", subtitle: "Khasra, Rasid, Bhumi", Icon: IconLand, cta: "View", color: "saffron", type: "external", url: "https://bhulekh.gov.in" },
  { title: "Government Loan", subtitle: "Loan & Credit Services", Icon: IconBank, cta: "Apply Now", color: "brandgreen", type: "external", url: "https://www.jansamarth.in" },
  { title: "Scholarship", subtitle: "Scholarship & Fee", Icon: IconCap, cta: "Apply Now", color: "brandpink", type: "external", url: "https://scholarships.gov.in" },
  { title: "Rasid & Payment", subtitle: "Online Rasid, Bill", Icon: IconRupee, cta: "Pay Now", color: "brandpurple", type: "external", url: "https://www.india.gov.in/topics/public-utilities" },
  { title: "More Services", subtitle: "All Online Services", Icon: IconDots, cta: "Explore", color: "brandteal", type: "internal", href: "/documents" },
];

export default function ServiceGrid() {
  const { openSite } = useWebsiteModal();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {SERVICES.map((s) => {
        const c = COLOR_CLASSES[s.color];
        const CardInner = (
          <>
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <s.Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-sm leading-tight text-white">{s.title}</div>
              <div className="text-[11px] text-white/75 mt-0.5">{s.subtitle}</div>
            </div>
            <div className={`text-xs font-semibold text-white flex items-center justify-center gap-1 mt-auto rounded-full px-3 py-1.5 ${c.btn}`}>
              {s.cta} →
            </div>
          </>
        );

        const className = `${c.bg} ring-2 ${c.ring} rounded-2xl p-4 shadow-card flex flex-col gap-2`;

        if (s.type === "internal") {
          return (
            <Link key={s.title} href={s.href} className={className}>
              {CardInner}
            </Link>
          );
        }
        return (
          <button
            key={s.title}
            onClick={() => openSite(s.url, s.title)}
            className={`${className} text-left`}
          >
            {CardInner}
          </button>
        );
      })}
    </div>
  );
}

