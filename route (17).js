import { NextResponse } from "next/server";
import { createOtp } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendWhatsAppOtp, whatsappOtpConfigured } from "@/lib/notify";

// FIX: koi rate limit nahi thi — ab per-mobile (3/10min) aur per-IP
// (10/10min) dono limit lagi hain, taaki ek number ya ek IP OTP spam na
// kar sake (SMS credits + DB dono bachte hain).
export async function POST(req) {
  const { mobile } = await req.json().catch(() => ({}));

  if (!/^[6-9]\d{9}$/.test(mobile || "")) {
    return NextResponse.json({ error: "Sahi 10-digit mobile number do." }, { status: 400 });
  }

  const ip = getClientIp(req);
  const [byMobile, byIp] = await Promise.all([
    checkRateLimit(`otp:${mobile}`, 3, 600),
    checkRateLimit(`otp-ip:${ip}`, 10, 600),
  ]);
  if (!byMobile.allowed) {
    return NextResponse.json(
      { error: "Bahut zyada attempts. 10 minute baad try karo." },
      { status: 429 }
    );
  }
  if (!byIp.allowed) {
    return NextResponse.json(
      { error: "Bahut zyada requests is network se. Thodi der baad try karo." },
      { status: 429 }
    );
  }

  const code = await createOtp(mobile);

  // SPEED FIX: pehle sirf SMS (MSG91) try hota tha — plain SMS India mein
  // DLT/telecom pipeline se jaata hai, jo promotional route ya unregistered
  // template ki wajah se 30s-2min tak le sakta hai (Hotstar jaise app is
  // wajah se WhatsApp/app-push OTP ko priority dete hain, kyunki wo telecom
  // SMS network se bilkul bypass ho jaata hai). Ab agar WhatsApp OTP
  // configured hai to WHATSAPP pehle try hota hai (near-instant); SMS sirf
  // fallback hai — WhatsApp na ho ya fail ho jaaye tab.
  let delivered = false;
  let deliveryError = null;

  if (whatsappOtpConfigured) {
    try {
      await sendWhatsAppOtp(mobile, code);
      delivered = true;
    } catch (err) {
      console.error("WhatsApp OTP send failed, falling back to SMS:", err.message);
    }
  }

  const smsConfigured = Boolean(process.env.SMS_API_KEY);
  if (!delivered && smsConfigured) {
    try {
      await sendSmsOtp(mobile, code);
      delivered = true;
    } catch (err) {
      deliveryError = err;
    }
  }

  if (!delivered && (whatsappOtpConfigured || smsConfigured)) {
    console.error("OTP delivery failed on all configured channels:", deliveryError?.message);
    return NextResponse.json(
      { error: "OTP bhejne mein dikkat aa gayi. Thodi der baad try karo." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    // devOtp sirf tab return hota hai jab koi bhi real channel (WhatsApp ya
    // SMS) configured NA ho — production mein in mein se koi ek set karte
    // hi yeh apne aap band ho jaata hai, taaki OTP sirf asli mobile pe hi
    // jaaye.
    devOtp: delivered ? undefined : code,
  });
}

async function sendSmsOtp(mobile, code) {
  // MSG91 v5 flow API shape (sabse common Indian provider). Doosra provider
  // use karna ho (Twilio, Fast2SMS, etc.) to bas yeh function badal do —
  // baaki route code same rahega.
  const res = await fetch("https://control.msg91.com/api/v5/otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authkey: process.env.SMS_API_KEY,
    },
    body: JSON.stringify({
      mobile: `91${mobile}`,
      otp: code,
      template_id: process.env.SMS_TEMPLATE_ID || undefined,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`SMS provider error (${res.status}): ${text.slice(0, 200)}`);
  }
}
