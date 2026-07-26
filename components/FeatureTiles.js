import Link from "next/link";
import { IconRobot, IconBell, IconWhatsapp, IconRequest } from "@/components/Icons";

const TILES = [
  { Icon: IconRobot, title: "AI Form Filling", subtitle: "AI se form bharo — Fast, Accurate, Easy", href: "/ai-assistant" },
  { Icon: IconBell, title: "Smart Alerts", subtitle: "Form, Job, Admit Card sabse pehle paayein", href: "/jobs" },
  { Icon: IconWhatsapp, title: "WhatsApp Alerts", subtitle: "Job, Form, Admit Card WhatsApp par paayein", href: "/documents" },
  { Icon: IconRequest, title: "My Requests", subtitle: "Aapke sabhi requests ek jagah par", href: "/documents" },
];

export default function FeatureTiles() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {TILES.map((t) => (
        <Link
          key={t.title}
          href={t.href}
          className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3"
        >
          <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <t.Icon className="w-5 h-5 text-navy" />
          </span>
          <div>
            <div className="font-semibold text-sm">{t.title}</div>
            <div className="text-xs text-slate-400">{t.subtitle}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
