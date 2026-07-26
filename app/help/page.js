import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const FAQS = [
  { q: "Mera OTP nahi aaya, kya karu?", a: "\"OTP dobara bhejo\" button 30 second baad dabao. Mobile number sahi hai ye bhi check kar lo." },
  { q: "AI se form bharwane ka fee kitna hai?", a: "Single-page forms free hain. Multi-page forms (jaise PAN, Passport) ke liye ₹49 service charge lagta hai — sirf hamari AI-fill service ke liye, sarkari fee alag hoti hai." },
  { q: "Kya mera OTP/Captcha AI khud bhar dega?", a: "Nahi — OTP aur Captcha hamesha tumhe khud apne haath se bharna hota hai, safety ke liye yeh kabhi automate nahi hota." },
  { q: "Payment fail ho gaya, paise wapas milenge?", a: "Agar paise kat gaye aur service unlock nahi hui, wallet mein turant refund/credit ho jaata hai. Wallet tab mein check karo." },
];

export const metadata = {
  title: "Help & Support — Sarkari AI",
};

export default function HelpPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 flex flex-col gap-4">
        <h1 className="font-display font-bold text-xl">Help & Support</h1>

        <div className="bg-white rounded-2xl shadow-card divide-y divide-slate-100">
          {FAQS.map((f) => (
            <details key={f.q} className="px-4 py-3 group">
              <summary className="text-sm font-semibold cursor-pointer list-none flex items-center justify-between">
                {f.q}
                <span className="text-slate-400 group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <p className="text-sm text-slate-500 mt-2">{f.a}</p>
            </details>
          ))}
        </div>

        <a
          href="/ai-assistant"
          className="bg-navy text-white rounded-2xl p-4 text-center font-semibold text-sm"
        >
          Aur koi sawaal? Bipin AI Assistant se poochho →
        </a>
      </main>
      <BottomNav />
    </>
  );
}
