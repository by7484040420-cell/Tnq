"use client";

import { useState, useRef, useEffect } from "react";
import {
  IconFingerprint, IconPanCard, IconPassport, IconLicense, IconVote,
  IconHouse, IconRupee, IconPeople, IconTrain, IconLand, IconBank,
  IconCap, IconReceipt, IconAyushman, IconDoc, IconShield, IconMedal,
  IconGavel, IconPost, IconBook, IconHealth, IconTrophy,
} from "@/components/Icons";

// Faint Ashoka Chakra ring behind everything — NOTE: we deliberately don't
// reproduce the actual National Emblem (four-lion Ashoka Capital) here; see
// ChakraWatermark.js for why. This is just the chakra (wheel) from the flag.
function ChakraRing() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="animate-spin-slow absolute w-[110vw] h-[110vw] max-w-[640px] max-h-[640px] opacity-25"
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="170" fill="none" stroke="#0B1440" strokeWidth="3" />
      <circle cx="200" cy="200" r="14" fill="#0B1440" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="200" y1="200"
          x2={200 + 170 * Math.cos((i * 15 * Math.PI) / 180)}
          y2={200 + 170 * Math.sin((i * 15 * Math.PI) / 180)}
          stroke="#0B1440" strokeWidth="1.4"
        />
      ))}
    </svg>
  );
}

// The two rings of icon badges that orbit behind the login card — every
// major document/portal and job category the app covers. Two rings (spinning
// opposite directions, different speeds) so it reads as one busy, alive
// background instead of 26 icons crammed into a single unreadable circle.
const OUTER_RING = [
  { Icon: IconFingerprint, label: "Aadhaar", tone: "saffron" },
  { Icon: IconPanCard, label: "PAN", tone: "green" },
  { Icon: IconPassport, label: "Passport", tone: "navy" },
  { Icon: IconLicense, label: "DL", tone: "saffron" },
  { Icon: IconVote, label: "Voter ID", tone: "green" },
  { Icon: IconHouse, label: "Niwas", tone: "navy" },
  { Icon: IconRupee, label: "Income Cert", tone: "saffron" },
  { Icon: IconPeople, label: "Caste Cert", tone: "green" },
  { Icon: IconTrain, label: "IRCTC", tone: "navy" },
  { Icon: IconLand, label: "Bhulekh", tone: "saffron" },
  { Icon: IconBank, label: "Loan", tone: "green" },
  { Icon: IconCap, label: "Scholarship", tone: "navy" },
  { Icon: IconReceipt, label: "Rasid", tone: "saffron" },
  { Icon: IconAyushman, label: "Ayushman", tone: "green" },
];

const INNER_RING = [
  { Icon: IconTrain, label: "Railway", tone: "navy" },
  { Icon: IconDoc, label: "SSC", tone: "saffron" },
  { Icon: IconShield, label: "Police", tone: "green" },
  { Icon: IconMedal, label: "Army", tone: "navy" },
  { Icon: IconGavel, label: "Judiciary", tone: "saffron" },
  { Icon: IconBank, label: "Bank/IBPS", tone: "green" },
  { Icon: IconPost, label: "Postal", tone: "navy" },
  { Icon: IconBook, label: "Teacher", tone: "saffron" },
  { Icon: IconGavel, label: "UPSC", tone: "green" },
  { Icon: IconHealth, label: "Health Dept", tone: "navy" },
  { Icon: IconTrophy, label: "Results", tone: "saffron" },
  { Icon: IconCap, label: "Admit Card", tone: "green" },
];

const TONE_BORDER = {
  saffron: "border-[#FF9933]",
  green: "border-[#138808]",
  navy: "border-navy",
};

function OrbitRing({ items, wrapClass, badgeClass, radiusClass, size }) {
  return (
    <div className={`absolute top-1/2 left-1/2 w-0 h-0 ${wrapClass}`} aria-hidden="true">
      {items.map(({ Icon, label, tone }, i) => {
        const angle = (360 / items.length) * i;
        return (
          <div
            key={label}
            className="absolute top-0 left-0"
            style={{ transform: `rotate(${angle}deg) ${radiusClass} rotate(${-angle}deg)` }}
          >
            <div
              className={`flex flex-col items-center justify-center gap-0.5 rounded-full bg-white/95 shadow-lg border-2 ${TONE_BORDER[tone]} ${badgeClass}`}
              style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
            >
              <Icon className="text-navy" style={{ width: size * 0.36, height: size * 0.36 }} />
              <span className="text-navy font-bold leading-none whitespace-nowrap" style={{ fontSize: size * 0.12 }}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChakraLogo() {
  return (
    <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="none" stroke="#FF9933" strokeWidth="2" />
      <circle cx="20" cy="20" r="2.5" fill="#000080" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="20" y1="20"
          x2={20 + 15 * Math.cos((i * 15 * Math.PI) / 180)}
          y2={20 + 15 * Math.sin((i * 15 * Math.PI) / 180)}
          stroke="#000080" strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}

// `onClose` is optional — pass it for the modal variant (shows a ✕
// button); the standalone /login page doesn't pass it, since there's
// nothing to "close" on a full page.
export default function LoginCard({ onSuccess, onClose }) {
  const [stage, setStage] = useState("mobile"); // "mobile" | "otp"
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState(null);
  const [resendIn, setResendIn] = useState(0);
  const otpInputRef = useRef(null);

  useEffect(() => {
    if (stage === "otp") otpInputRef.current?.focus();
  }, [stage]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  async function handleSendOtp(e) {
    e?.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Sahi 10-digit mobile number do.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP bhejne mein dikkat aayi.");
      setDevOtp(data.devOtp || null);
      setStage("otp");
      setResendIn(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("6-digit OTP daalo.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP galat hai.");
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full h-full min-h-[100dvh] bg-tricolor flex items-center justify-center p-4 overflow-hidden">
      <ChakraRing />

      <OrbitRing
        items={OUTER_RING}
        wrapClass="animate-orbit-outer"
        badgeClass="animate-orbit-outer-badge"
        radiusClass="translateY(clamp(-300px,-46vw,-190px))"
        size={72}
      />
      <OrbitRing
        items={INNER_RING}
        wrapClass="animate-orbit-inner"
        badgeClass="animate-orbit-inner-badge"
        radiusClass="translateY(clamp(-190px,-30vw,-120px))"
        size={60}
      />

      {/* Sparkle/firework glow accents */}
      <div className="absolute w-40 h-40 rounded-full bg-amber-500/30 blur-3xl top-1/4 left-[15%]" />
      <div className="absolute w-40 h-40 rounded-full bg-brandgreen/30 blur-3xl bottom-1/4 right-[15%]" />

      <div className="relative bg-navy/90 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Band karo"
            className="absolute top-4 right-4 text-white/60 text-lg"
          >
            ✕
          </button>
        )}

        <div className="flex items-center gap-2 mb-1">
          <ChakraLogo />
          <span className="font-display font-extrabold text-xl">
            <span className="text-amber-400">Sarkari</span> <span className="text-brandgreen">AI</span>
          </span>
        </div>
        <h2 className="font-display font-bold text-lg text-white mb-1">
          {stage === "mobile" ? "Welcome Back" : "OTP Verify Karo"}
        </h2>
        <p className="text-sm text-white/70 mb-4">
          {stage === "mobile"
            ? "Apna mobile number do — hum ek OTP bhejenge."
            : `${mobile} par bheja gaya 6-digit OTP daalo.`}
        </p>

        {error && (
          <div className="bg-brandred/20 text-red-200 text-sm rounded-lg px-3 py-2 mb-3">
            {error}
          </div>
        )}

        {devOtp && stage === "otp" && (
          <div className="bg-amber-400/20 text-amber-200 text-xs rounded-lg px-3 py-2 mb-3">
            Dev mode: OTP hai <b>{devOtp}</b> (production mein yeh nahi dikhega).
          </div>
        )}

        {stage === "mobile" && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
            <div className="flex items-center border border-white/30 rounded-lg overflow-hidden bg-white/10">
              <span className="px-3 text-sm text-white/70 h-full flex items-center py-2.5">
                +91
              </span>
              <input
                autoFocus
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
                className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent text-white placeholder-white/40"
              />
            </div>
            <button
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-brandgreen text-white rounded-full py-2.5 font-semibold text-sm disabled:opacity-50"
            >
              {loading ? "Bhej rahe hain…" : "OTP Bhejo"}
            </button>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
            <input
              ref={otpInputRef}
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit OTP"
              className="border border-white/30 bg-white/10 rounded-lg px-3 py-2.5 text-sm tracking-[0.3em] text-center outline-none text-white placeholder-white/40 focus:border-white/60"
            />
            <button
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-brandgreen text-white rounded-full py-2.5 font-semibold text-sm disabled:opacity-50"
            >
              {loading ? "Verify ho raha hai…" : "Verify Karo"}
            </button>
            <button
              type="button"
              disabled={resendIn > 0}
              onClick={handleSendOtp}
              className="text-xs text-amber-300 font-medium disabled:text-white/30"
            >
              {resendIn > 0 ? `OTP dobara bhejo (${resendIn}s)` : "OTP dobara bhejo"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStage("mobile");
                setOtp("");
                setError("");
              }}
              className="text-xs text-white/50"
            >
              ← Number badlo
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
