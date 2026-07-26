"use client";

import { useEffect, useRef, useState } from "react";
import { FormFillSession, FORM_FILL_STATES } from "@/lib/formFillSession";
import { useAuth } from "@/components/AuthProvider";

// SECURITY FIX: this used to call the dedicated Playwright server (Render
// etc.) DIRECTLY from the browser via NEXT_PUBLIC_REMOTE_BROWSER_URL — that
// server had no auth of its own, and the URL being public meant anyone
// could call it and even hijack another user's live form-filling session
// (see app/api/remote-browser/[...path]/route.js for the full writeup).
// Now every call goes through that same-origin proxy instead, which
// requires login and only allows a user to touch their own sessions. The
// real Playwright server URL now lives in a server-only env var
// (REMOTE_BROWSER_URL, no NEXT_PUBLIC_ prefix) and is never sent to the
// client.
const REMOTE_BROWSER_URL = "/api/remote-browser";

// Safety cap: kitni baar AI khud-ba-khud "Next/Continue" dabaye, taaki koi
// bug/infinite-loop na ban jaaye — isse zyada steps hue to khud ruk jaata
// hai aur user ko dikhata hai ki manually aage badhao.
const MAX_AUTO_STEPS = 6;

export default function RemoteBrowserViewer({ job, filled, uploads, onClose }) {
  const { user } = useAuth();
  const [session] = useState(() => new FormFillSession(user?.id));
  const [, forceUpdate] = useState(0);
  const [screenshotSrc, setScreenshotSrc] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [autoRunning, setAutoRunning] = useState(false);
  const [autoStatus, setAutoStatus] = useState("");
  const [notConfigured, setNotConfigured] = useState(false);
  const pollRef = useRef(null);

  function rerender() {
    forceUpdate((n) => n + 1);
  }

  useEffect(() => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `${REMOTE_BROWSER_URL}/screenshot?sessionId=${session.sessionId}&t=${Date.now()}`
        );
        if (res.status === 503) {
          setNotConfigured(true);
          return;
        }
        if (res.ok) {
          const blob = await res.blob();
          setScreenshotSrc(URL.createObjectURL(blob));
        }
      } catch (e) {
        /* remote server abhi available nahi hai */
      }
    }, 800);
    return () => clearInterval(pollRef.current);
  }, [session.sessionId]);

  async function handleImageClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 480);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 800);
    await fetch(`${REMOTE_BROWSER_URL}/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.sessionId, x, y }),
    });
  }

  async function handleSendText() {
    if (!textInput) return;
    await fetch(`${REMOTE_BROWSER_URL}/type`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.sessionId, text: textInput }),
    });
    setTextInput("");
  }

  // ---- Auto-fill + auto-advance ----
  // Ye teen cheezein karta hai, sirf jab tak koi identity-check nahi aata:
  //   1. Naam/DOB/address jaisi fields khud bhar deta hai (heuristic field-
  //      matching remote server ke DOM par karta hai)
  //   2. Photo/signature jaisi files khud upload kar deta hai
  //   3. Har step ke baad DOM check karta hai — agar Captcha/OTP screen
  //      DIKHI, turant ruk jaata hai aur control user ko de deta hai.
  //      Agar nahi dikhi, khud "Next/Continue/Submit" button dabata hai —
  //      lekin max MAX_AUTO_STEPS baar, safety ke liye.
  async function runAutoFillAndAdvance() {
    if (autoRunning) return;
    setAutoRunning(true);
    setAutoStatus("Fields bhar raha hai…");

    try {
      if (filled && Object.keys(filled).length) {
        await fetch(`${REMOTE_BROWSER_URL}/autofill`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: session.sessionId, values: filled }),
        });
      }

      if (uploads && Object.keys(uploads).length) {
        setAutoStatus("Documents upload kar raha hai…");
        for (const [field, file] of Object.entries(uploads)) {
          await fetch(`${REMOTE_BROWSER_URL}/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: session.sessionId,
              field,
              fileName: file.name,
              dataUrl: file.dataUrl,
            }),
          });
        }
      }

      for (let step = 0; step < MAX_AUTO_STEPS; step++) {
        setAutoStatus(`Check kar raha hai (${step + 1}/${MAX_AUTO_STEPS})…`);
        const detectRes = await fetch(
          `${REMOTE_BROWSER_URL}/detect-captcha?sessionId=${session.sessionId}`
        );
        const detectData = await detectRes.json().catch(() => ({ found: false }));

        if (detectData.found) {
          setAutoStatus("Captcha/OTP mil gaya — ab tumhara turn hai.");
          session.showCaptcha();
          rerender();
          break;
        }

        setAutoStatus("Captcha nahi mila — khud Next dabata hoon…");
        const clickRes = await fetch(`${REMOTE_BROWSER_URL}/click-next`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: session.sessionId }),
        });
        const clickData = await clickRes.json().catch(() => ({ clicked: false }));
        if (!clickData.clicked) {
          setAutoStatus("Koi aur 'Next' button nahi mila — yahan se khud aage badho.");
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (e) {
      setAutoStatus("Remote server se connect nahi ho paya.");
    } finally {
      setAutoRunning(false);
    }
  }

  function markCaptchaDone() {
    session.userCompletedCaptcha();
    rerender();
  }

  function goToPaymentInRealBrowser() {
    session.hitPayment();
    rerender();
    if (job?.paymentUrl) window.open(job.paymentUrl, "_blank", "noopener,noreferrer");
  }

  function confirmPaymentDoneReturnToReview() {
    session.userCompletedPayment();
    rerender();
  }

  function finalSubmit() {
    session.userConfirmsAndSubmits();
    rerender();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="bg-navy text-white px-4 py-3 flex items-center justify-between">
          <div className="font-display font-bold text-sm">
            🤖 AI Form Bhar Raha Hai — {job?.title || "Form"}
          </div>
          <button onClick={onClose} className="text-white/70 text-lg">✕</button>
        </div>

        <div className="p-4">
          {notConfigured && (
            <div className="bg-amber-50 text-amber-700 text-xs rounded-lg p-3 mb-3">
              ⚠️ REMOTE_BROWSER_URL server par set nahi hai. Remote browser server
              alag se (Render jaisi jagah) deploy karke, uska URL server env
              mein (REMOTE_BROWSER_SECRET ke saath) set karo.
            </div>
          )}

          <div className="bg-slate-100 rounded-xl overflow-hidden mb-3 aspect-[480/800] flex items-center justify-center">
            {screenshotSrc ? (
              <img src={screenshotSrc} alt="Remote form" className="w-full cursor-pointer" onClick={handleImageClick} />
            ) : (
              <span className="text-xs text-slate-400">Live screen ka wait ho raha hai...</span>
            )}
          </div>

          {session.state === FORM_FILL_STATES.FILLING && (
            <div className="flex flex-col gap-3">
              <button
                onClick={runAutoFillAndAdvance}
                disabled={autoRunning}
                className="bg-brandpurple text-white rounded-full py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {autoRunning ? "AI kaam kar raha hai…" : "🤖 AI se Sab Bharwao + Aage Badho"}
              </button>
              {autoStatus && <p className="text-xs text-slate-500 text-center">{autoStatus}</p>}

              <div className="text-xs text-slate-400 text-center">— ya khud manually —</div>
              <div className="flex gap-2">
                <input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Field mein type karne ke liye likho"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
                <button onClick={handleSendText} className="bg-brandblue text-white rounded-lg px-4 text-sm font-semibold">
                  Bhejo
                </button>
              </div>
            </div>
          )}

          {session.state === FORM_FILL_STATES.WAITING_FOR_CAPTCHA && (
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-3">
                Captcha/OTP aa gaya hai — <b>yeh sirf tum bhar sakte ho</b>, upar
                screen pe type karo, phir neeche dabao.
              </p>
              <button onClick={markCaptchaDone} className="bg-brandgreen text-white rounded-full px-5 py-2 text-sm font-semibold">
                ✅ Bhar Diya, Aage Badho
              </button>
            </div>
          )}

          {session.state === FORM_FILL_STATES.WAITING_FOR_PAYMENT && (
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-3">
                Payment ka time aa gaya. Safety ke liye, yeh AI browser se nahi —
                tumhare apne, alag browser tab se seedha hoga.
              </p>
              <button onClick={goToPaymentInRealBrowser} className="bg-brandpurple text-white rounded-full px-5 py-2 text-sm font-semibold">
                💳 Naye Tab Mein Payment Karo
              </button>
              <button onClick={confirmPaymentDoneReturnToReview} className="block mx-auto mt-3 text-xs text-slate-400 underline">
                Payment ho gaya, wapas aa gaya
              </button>
            </div>
          )}

          {session.state === FORM_FILL_STATES.READY_FOR_REVIEW && (
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-3">
                Sab bhar gaya! Upar screenshot mein sab check karo, phir hi Submit dabao.
              </p>
              <button onClick={finalSubmit} className="bg-brandgreen text-white rounded-full px-6 py-2.5 text-sm font-bold">
                ✅ Maine Check Kar Liya — Submit Karo
              </button>
            </div>
          )}

          {session.state === FORM_FILL_STATES.DONE && (
            <div className="text-center text-brandgreen font-semibold text-sm">
              🎉 Submit ho gaya — tumne khud confirm karke submit kiya.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
