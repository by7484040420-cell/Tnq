import Link from "next/link";
import { IconRobot } from "@/components/Icons";

// Compact centered floating card — matches the "Bipin AI Assistant" widget
// in the BIPIN AI home page reference (sits centered mid-page over the
// background watermark, not a full-width bar).
export default function AIAssistantBanner() {
  return (
    <div className="flex justify-center">
      <Link
        href="/ai-assistant"
        className="bg-navy rounded-2xl px-6 py-5 text-white flex flex-col items-center gap-2 shadow-2xl border border-brandpurple/40 w-full max-w-xs text-center"
      >
        <div className="font-display font-bold text-sm">Bipin AI Assistant</div>
        <div className="text-slate-300 text-xs">Aapka Personal Sarkari Sahayak</div>
        <div className="w-14 h-14 rounded-full bg-brandpurple flex items-center justify-center my-1">
          <IconRobot className="w-7 h-7 text-white" />
        </div>
        <span className="bg-white text-navy font-semibold rounded-full px-5 py-2 text-xs">
          AI se Poochho →
        </span>
      </Link>
    </div>
  );
}
