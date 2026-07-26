// Faint background watermark for the home page. NOTE: the reference design
// had the actual National Emblem (four-lion Ashoka Capital) watermarked
// behind the content — we deliberately don't reproduce that art, since
// using the real State Emblem runs into the State Emblem of India
// (Prohibition of Improper Use) Act. This uses just the Ashoka Chakra
// wheel (the flag symbol) instead, very faint, purely decorative.
export default function ChakraWatermark() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="pointer-events-none select-none absolute left-1/2 top-32 -translate-x-1/2 w-[140vw] max-w-[900px] opacity-[0.04] -z-10"
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="180" fill="none" stroke="#0B1440" strokeWidth="3" />
      <circle cx="200" cy="200" r="14" fill="#0B1440" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="200" y1="200"
          x2={200 + 180 * Math.cos((i * 15 * Math.PI) / 180)}
          y2={200 + 180 * Math.sin((i * 15 * Math.PI) / 180)}
          stroke="#0B1440" strokeWidth="2"
        />
      ))}
    </svg>
  );
}
