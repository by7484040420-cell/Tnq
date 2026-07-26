import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getJobById, hasPaidForDocument } from "@/lib/db";
import { documentServices, getServiceFeePaise } from "@/data/documents";
import { prepareFormData } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";

// Powers the "✨ AI se Form Bharo" step in ApplyFlow.js — works for both
// job applications (looked up from the live jobs DB) and document/portal
// services (data/documents.js), since both share the same
// { id, title, fields, officialUrl } shape.
//
// IMPORTANT: this only cleans/normalizes values the USER already typed in
// (proper casing, DOB format, trimming). It never invents Aadhaar/PAN
// numbers or any identity data, and it never touches OTP, captcha, or
// payment — those steps always happen in the user's own hands, later in
// the flow (see formFillSession.js / RemoteBrowserViewer.js).
export async function POST(req) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }

  // FIX: har call Gemini API ko hit karta hai (paid/limited quota) — bina
  // limit ke logged-in user bhi loop mein maar kar quota khatam kar sakta
  // tha. 20 calls/10min per user kaafi hai normal use ke liye.
  const rl = await checkRateLimit(`form-fill:${sessionUser.id}`, 20, 600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Bahut zyada requests. Thodi der baad try karo." },
      { status: 429 }
    );
  }

  try {
    const { jobId, profile } = await req.json();
    if (!jobId || !profile) {
      return NextResponse.json({ error: "jobId aur profile zaroori hain." }, { status: 400 });
    }

    const item =
      (await getJobById(jobId)) || documentServices.find((d) => d.id === jobId);

    if (!item) {
      return NextResponse.json({ error: "Job/service nahi mila." }, { status: 404 });
    }

    // Job applications (sarkari naukri) stay free — this fee only applies to
    // document/portal services (data/documents.js) with a multi-page form.
    const isDocumentService = documentServices.some((d) => d.id === jobId);
    if (isDocumentService) {
      const fee = getServiceFeePaise(item);
      if (fee > 0) {
        const paid = await hasPaidForDocument(sessionUser.mobile, jobId);
        if (!paid) {
          return NextResponse.json(
            { error: `Is form ke liye pehle ₹${(fee / 100).toFixed(2)} ka service charge pay karo.`, feePaise: fee },
            { status: 402 }
          );
        }
      }
    }

    const filled = await prepareFormData(profile, item.fields || []);
    return NextResponse.json({ filled });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Form-fill fail ho gaya." }, { status: 500 });
  }
}
