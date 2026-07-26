// Shared line-icon set (SVG, currentColor) used across the home page and
// other components instead of emoji — emoji render inconsistently across
// devices/fonts, these look the same everywhere and can be recolored with
// plain CSS (text color) like any other icon font.
//
// Usage: <IconTrain className="w-5 h-5" /> — every icon accepts the same
// props as a normal <svg> (className, style, etc.) since they're just thin
// wrappers around one.

function Base({ children, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function IconTrain(props) {
  return (
    <Base {...props}>
      <rect x="5" y="3" width="14" height="13" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M5 12h14M8 16l-2 4M16 16l2 4M9 8h2M13 8h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Base>
  );
}

export function IconBriefcase(props) {
  return (
    <Base {...props}>
      <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18" stroke="currentColor" strokeWidth="2" />
    </Base>
  );
}

export function IconIdCard(props) {
  return (
    <Base {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
      <path d="M6 16c0-1.7 1.3-3 3-3s3 1.3 3 3M14 9h5M14 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Base>
  );
}

export function IconTrophy(props) {
  return (
    <Base {...props}>
      <path d="M7 4h10v4a5 5 0 01-10 0V4z" stroke="currentColor" strokeWidth="2" />
      <path d="M7 5H4a3 3 0 003 3M17 5h3a3 3 0 01-3 3M12 13v4M9 20h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Base>
  );
}

export function IconDoc(props) {
  return (
    <Base {...props}>
      <path d="M7 3h7l4 4v14H7V3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Base>
  );
}

export function IconLand(props) {
  return (
    <Base {...props}>
      <path d="M4 20V10l8-6 8 6v10H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </Base>
  );
}

export function IconBank(props) {
  return (
    <Base {...props}>
      <path d="M3 9l9-5 9 5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M5 9v9M9 9v9M15 9v9M19 9v9M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Base>
  );
}

export function IconCap(props) {
  return (
    <Base {...props}>
      <path d="M12 4L2 9l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 11.5V17c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" stroke="currentColor" strokeWidth="2" />
    </Base>
  );
}

export function IconRupee(props) {
  return (
    <Base {...props}>
      <path d="M7 4h10M7 8h10M7 4c0 4-3 6-3 6h10M7 10l7 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconDots(props) {
  return (
    <Base {...props}>
      <circle cx="7" cy="7" r="2" fill="currentColor" />
      <circle cx="17" cy="7" r="2" fill="currentColor" />
      <circle cx="7" cy="17" r="2" fill="currentColor" />
      <circle cx="17" cy="17" r="2" fill="currentColor" />
    </Base>
  );
}

export function IconFingerprint(props) {
  return (
    <Base {...props}>
      <path d="M12 3a7 7 0 017 7c0 4-2 5-2 8M8 20c-1-3 0-6 0-9a4 4 0 018 0c0 3 1 4 1 7M5 18c-1-2-1-5-1-8a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Base>
  );
}

export function IconPanCard(props) {
  return (
    <Base {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13 10h6M13 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Base>
  );
}

export function IconLicense(props) {
  return (
    <Base {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="10" r="1.6" fill="currentColor" />
      <path d="M6 15h4M13 9h5M13 13h5M13 16h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Base>
  );
}

export function IconPassport(props) {
  return (
    <Base {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Base>
  );
}

export function IconVote(props) {
  return (
    <Base {...props}>
      <path d="M4 10l8-6 8 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="5" y="10" width="14" height="9" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M9 14l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconHouse(props) {
  return (
    <Base {...props}>
      <path d="M4 11l8-7 8 7v9H4v-9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" />
    </Base>
  );
}

export function IconPeople(props) {
  return (
    <Base {...props}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M15 20c0-2.2 1.8-3.8 4-3.8s4 1.6 4 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Base>
  );
}

export function IconShield(props) {
  return (
    <Base {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconMedal(props) {
  return (
    <Base {...props}>
      <circle cx="12" cy="14" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 4l3 6 3-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 11.5l1.4 2.8 3 .4-2.2 2.1.5 3-2.7-1.4-2.7 1.4.5-3-2.2-2.1 3-.4L12 11.5z" fill="currentColor" />
    </Base>
  );
}

export function IconMegaphone(props) {
  return (
    <Base {...props}>
      <path d="M3 10v4h3l8 4V6L6 10H3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M17 9a4 4 0 010 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Base>
  );
}

export function IconRobot(props) {
  return (
    <Base {...props}>
      <rect x="5" y="8" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="13" r="1.3" fill="currentColor" />
      <circle cx="15" cy="13" r="1.3" fill="currentColor" />
      <path d="M12 8V4M9 4h6M4 12H2M22 12h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Base>
  );
}

export function IconBell(props) {
  return (
    <Base {...props}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="2" />
    </Base>
  );
}

export function IconWhatsapp(props) {
  return (
    <Base {...props}>
      <path d="M4 20l1.4-4A8 8 0 1112 20a8 8 0 01-4.6-1.4L4 20z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 10c.5 2 2 3.5 4 4l1-1.3 2 1v1.3c0 .5-.4.9-1 1-3 0-7-4-7-7 .1-.6.5-1 1-1H9.7l1 2-1 1z" fill="currentColor" />
    </Base>
  );
}

export function IconRequest(props) {
  return (
    <Base {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Base>
  );
}

export function IconShieldLock(props) {
  return (
    <Base {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </Base>
  );
}

export function IconLock(props) {
  return (
    <Base {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" />
    </Base>
  );
}

export function IconCheck(props) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconKey(props) {
  return (
    <Base {...props}>
      <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M11 12l9-9M17 6l2 2M14 9l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Base>
  );
}

export function IconHomeNav(props) {
  return (
    <Base {...props}>
      <path d="M4 11l8-7 8 7v9H4v-9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </Base>
  );
}

export function IconQuestion(props) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M9.5 9a2.5 2.5 0 015 .5c0 1.5-2.5 1.7-2.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </Base>
  );
}

export function IconWallet(props) {
  return (
    <Base {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="14" r="1.4" fill="currentColor" />
    </Base>
  );
}

// Icons used for the orbiting ring on the login page — Aadhaar, PAN,
// Passport, DL, Voter ID, Niwas, Income Cert, Caste Cert, IRCTC, Bhulekh,
// Loan, Scholarship, Rasid, Ayushman, Railway, SSC, Police, Army, UPSC,
// Bank/IBPS, Postal, Teacher, Judiciary, Health Dept, Results, Admit Card.
export function IconAyushman(props) {
  return (
    <Base {...props}>
      <path d="M20 8.5c0 5-8 11-8 11s-8-6-8-11a4.5 4.5 0 018-2.7A4.5 4.5 0 0120 8.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12h2l1-2 1.5 4L15 11h1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconReceipt(props) {
  return (
    <Base {...props}>
      <path d="M6 3h12v18l-2-1.3L14 21l-2-1.3L10 21l-2-1.3L6 21V3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </Base>
  );
}

export function IconGavel(props) {
  return (
    <Base {...props}>
      <path d="M14 5l5 5-2 2-5-5 2-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 10l5 5-6 6-5-5 6-6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M3 21h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Base>
  );
}

export function IconHealth(props) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Base>
  );
}

export function IconPost(props) {
  return (
    <Base {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </Base>
  );
}

export function IconBook(props) {
  return (
    <Base {...props}>
      <path d="M4 5c2-1 5-1 8 0v14c-3-1-6-1-8 0V5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M20 5c-2-1-5-1-8 0v14c3-1 6-1 8 0V5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </Base>
  );
}
