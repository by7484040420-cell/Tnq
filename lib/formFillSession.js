// Tiny client-side state machine used by RemoteBrowserViewer to track where
// a user is in the "AI fills the form" flow. It holds no secrets and makes
// no network calls itself — RemoteBrowserViewer talks to the remote
// Playwright server directly and calls these methods to advance state.
export const FORM_FILL_STATES = {
  FILLING: "FILLING",
  WAITING_FOR_CAPTCHA: "WAITING_FOR_CAPTCHA",
  WAITING_FOR_PAYMENT: "WAITING_FOR_PAYMENT",
  READY_FOR_REVIEW: "READY_FOR_REVIEW",
  DONE: "DONE",
};

export class FormFillSession {
  constructor(userId) {
    // Ownership prefix (`${userId}-`) is what the server-side proxy checks
    // (see app/api/remote-browser/[...path]/route.js) — the random suffix
    // is just defense-in-depth so a session ID can't be guessed even by
    // someone who knows the userId and roughly when the session started.
    const random =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    this.sessionId = `${userId || "anon"}-${Date.now().toString(36)}-${random}`;
    this.state = FORM_FILL_STATES.FILLING;
  }

  userCompletedCaptcha() {
    this.state = FORM_FILL_STATES.FILLING;
  }

  hitPayment() {
    this.state = FORM_FILL_STATES.WAITING_FOR_PAYMENT;
  }

  userCompletedPayment() {
    this.state = FORM_FILL_STATES.READY_FOR_REVIEW;
  }

  userConfirmsAndSubmits() {
    this.state = FORM_FILL_STATES.DONE;
  }

  showCaptcha() {
    this.state = FORM_FILL_STATES.WAITING_FOR_CAPTCHA;
  }
}
