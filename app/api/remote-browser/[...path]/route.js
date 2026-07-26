import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

// SECURITY FIX: the remote-browser-server (Playwright automation server)
// used to be called DIRECTLY from the browser, using a URL exposed via
// NEXT_PUBLIC_REMOTE_BROWSER_URL. That server had no authentication of its
// own, and sessionId was predictable (`${userId}-${Date.now().toString(36)}`)
// — so anyone who found the URL (visible in the client JS bundle) could hit
// /sessions to list active sessions, then hijack any of them: watch a
// stranger's live government-form screen, type into it, or drive the
// browser to any URL as a free open proxy.
//
// This route closes that gap two ways:
//   1. It requires a logged-in session (getSessionUser) before forwarding
//      anything — the remote server itself is never reachable from a
//      browser anymore, only from this trusted server-to-server hop.
//   2. It only allows a user to act on session IDs that belong to THEM
//      (sessionId must start with `${sessionUser.id}-`) — so even a logged
//      in user can't touch someone else's in-progress form-fill session.
// A shared secret (REMOTE_BROWSER_SECRET, server-only env var) is also
// sent on every forwarded request, and the remote server now rejects
// anything without it — see remote-browser-server/server.js.

const REMOTE_BROWSER_URL = process.env.REMOTE_BROWSER_URL || "";
const REMOTE_BROWSER_SECRET = process.env.REMOTE_BROWSER_SECRET || "";

function ownsSession(sessionUser, sessionId) {
  if (!sessionId) return false;
  return sessionId.startsWith(`${sessionUser.id}-`);
}

async function forward(req, path) {
  if (!REMOTE_BROWSER_URL) {
    return NextResponse.json({ error: "Remote browser server configure nahi hai." }, { status: 503 });
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }

  // Cheap abuse guard — this proxies to a resource-heavy Playwright server,
  // so keep the same per-user ceiling regardless of which sub-route is hit.
  const rl = await checkRateLimit(`remote-browser:${sessionUser.id}`, 120, 600);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Bahut zyada requests. Thodi der baad try karo." }, { status: 429 });
  }

  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");
  let body = null;
  if (req.method === "POST") {
    body = await req.json().catch(() => ({}));
  }
  const bodySessionId = body?.sessionId;
  const effectiveSessionId = sessionId || bodySessionId;

  // /sessions (list all) has no sessionId at all — never allow that through
  // this proxy, a normal user has no legitimate reason to see other
  // people's session IDs.
  if (path.join("/") === "sessions") {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }

  if (!ownsSession(sessionUser, effectiveSessionId)) {
    return NextResponse.json({ error: "Yeh session tumhara nahi hai." }, { status: 403 });
  }

  const target = new URL(`${REMOTE_BROWSER_URL}/${path.join("/")}`);
  url.searchParams.forEach((v, k) => target.searchParams.set(k, v));

  const upstream = await fetch(target.toString(), {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "x-remote-browser-secret": REMOTE_BROWSER_SECRET,
    },
    body: req.method === "POST" ? JSON.stringify(body || {}) : undefined,
  }).catch(() => null);

  if (!upstream) {
    return NextResponse.json({ error: "Remote server se connect nahi ho paya." }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") || "";
  if (contentType.includes("image/")) {
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, { status: upstream.status, headers: { "Content-Type": contentType } });
  }

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}

export async function GET(req, { params }) {
  return forward(req, params.path);
}

export async function POST(req, { params }) {
  return forward(req, params.path);
}
