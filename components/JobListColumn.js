// Bordered, tinted card style (icon badge + title + "New" tag + solid CTA
// button) — matches the "Latest Jobs / Admit Cards / Results / Important
// Updates" boxes in the BIPIN AI home page reference.
const ACCENT = {
  brandred: { border: "border-brandred/30", head: "bg-brandred/10 text-brandred", tag: "bg-brandred", btn: "bg-brandred", badge: "bg-brandred/10 text-brandred" },
  brandgreen: { border: "border-brandgreen/30", head: "bg-brandgreen/10 text-brandgreen", tag: "bg-brandgreen", btn: "bg-brandgreen", badge: "bg-brandgreen/10 text-brandgreen" },
  brandpurple: { border: "border-brandpurple/30", head: "bg-brandpurple/10 text-brandpurple", tag: "bg-brandpurple", btn: "bg-brandpurple", badge: "bg-brandpurple/10 text-brandpurple" },
  saffron: { border: "border-saffron/30", head: "bg-saffron/10 text-saffron", tag: "bg-saffron", btn: "bg-saffron", badge: "bg-saffron/10 text-saffron" },
};

export default function JobListColumn({ title, Icon, accent, items, viewAllLabel, viewAllHref }) {
  const a = ACCENT[accent] || ACCENT.brandred;
  return (
    <div className={`bg-white rounded-2xl shadow-card flex flex-col overflow-hidden border-2 ${a.border}`}>
      <div className={`px-4 py-3 font-bold flex items-center justify-between gap-2 ${a.head}`}>
        <span className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          {title}
        </span>
        <a href={viewAllHref} className="text-xs font-medium opacity-80">View All →</a>
      </div>
      <div className="flex-1 divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.title} className="px-4 py-3 flex items-start gap-3">
            {item.Icon && (
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${a.badge}`}>
                <item.Icon className="w-4 h-4" />
              </span>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold truncate">{item.title}</span>
                {item.tag && (
                  <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded shrink-0 ${a.tag}`}>
                    {item.tag}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{item.meta}</div>
            </div>
          </div>
        ))}
      </div>
      <a
        href={viewAllHref}
        className={`text-center text-sm font-semibold text-white py-3 ${a.btn}`}
      >
        {viewAllLabel} →
      </a>
    </div>
  );
}
