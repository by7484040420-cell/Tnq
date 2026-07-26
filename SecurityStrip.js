import { IconShieldLock, IconLock, IconCheck, IconKey } from "@/components/Icons";

const POINTS = [
  { Icon: IconShieldLock, label: "100% Secure Platform" },
  { Icon: IconLock, label: "Data Encrypted" },
  { Icon: IconCheck, label: "Safe & Trusted" },
  { Icon: IconKey, label: "Private & Secure" },
];

export default function SecurityStrip() {
  return (
    <div className="bg-navy-dark text-white rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
      <div className="flex flex-wrap gap-5">
        {POINTS.map((p) => (
          <span key={p.label} className="flex items-center gap-1.5">
            <p.Icon className="w-4 h-4" /> {p.label}
          </span>
        ))}
      </div>
      <span className="flex items-center gap-1.5 text-saffron font-medium">
        <IconShieldLock className="w-4 h-4" /> Aapka Data, Aapka Vishwas
      </span>
    </div>
  );
}
