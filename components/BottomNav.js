"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHomeNav, IconBriefcase, IconIdCard, IconTrophy,
  IconDoc, IconRobot, IconWallet, IconQuestion,
} from "@/components/Icons";

const TABS = [
  { label: "Home", href: "/", Icon: IconHomeNav },
  { label: "Jobs", href: "/jobs", Icon: IconBriefcase },
  { label: "Admit Card", href: "/admit-card", Icon: IconIdCard },
  { label: "Results", href: "/results", Icon: IconTrophy },
  { label: "Documents", href: "/documents", Icon: IconDoc },
  { label: "AI Assistant", href: "/ai-assistant", Icon: IconRobot },
  { label: "Wallet", href: "/wallet", Icon: IconWallet },
  { label: "Help", href: "/help", Icon: IconQuestion },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex md:hidden z-40">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[9px] leading-none ${
              isActive ? "text-navy font-semibold" : "text-slate-400"
            }`}
          >
            <tab.Icon className="w-5 h-5" />
            <span className="truncate max-w-full px-0.5">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
