// Floating compass widget — small, no colored container, just a delicate SVG
// compass with three tiny stat callouts. Tap to open Position.

type Props = {
  score?: string;
  scoreSub?: string;
  trend?: string;
  trendSub?: string;
  gaps?: string;
  gapsSub?: string;
  onClick?: () => void;
  locked?: boolean;
};

export function MeridianCompass({
  score = "—",
  scoreSub = "Score",
  trend = "—",
  trendSub = "7-Day",
  gaps = "—",
  gapsSub = "Gaps",
  onClick,
  locked,
}: Props) {
  const stroke = "currentColor";
  const size = 180;

  return (
    <button
      onClick={onClick}
      className="block mx-auto text-left relative group text-ink2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--olo)]/50 rounded-full"
      style={{ width: size, height: size }}
      aria-label="Open positioning"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        <g stroke={stroke} fill="none" strokeWidth="0.7" opacity="0.55">
          <circle cx="100" cy="100" r="68" />
          <circle cx="100" cy="100" r="56" opacity="0.5" />
        </g>
        <g stroke={stroke} strokeWidth="0.6" opacity="0.35" strokeDasharray="2 4">
          <line x1="100" y1="22" x2="100" y2="178" />
          <line x1="22" y1="100" x2="178" y2="100" />
        </g>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const r1 = 68, r2 = 74;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * r1}
              y1={100 + Math.sin(a) * r1}
              x2={100 + Math.cos(a) * r2}
              y2={100 + Math.sin(a) * r2}
              stroke={stroke}
              strokeWidth="1"
              opacity="0.6"
            />
          );
        })}
        {/* Needle */}
        <polygon points="100,40 104,100 96,100" fill="var(--olo)" />
        <polygon points="100,160 104,100 96,100" fill="currentColor" opacity="0.25" />
        <circle cx="100" cy="100" r="3.5" fill="var(--background)" stroke="var(--olo)" strokeWidth="1.2" />
      </svg>

      <div className="absolute inset-[46px] rounded-full border border-[var(--olo)]/20 bg-[var(--olo)]/5 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition" />

      {/* North — Score */}
      <Stat style={{ top: -4, left: "50%", transform: "translateX(-50%)" }} n={score} sub={scoreSub} accent />
      {/* East — Trend */}
      <Stat style={{ top: "50%", right: -10, transform: "translateY(-50%)" }} n={trend} sub={trendSub} />
      {/* South — Gaps */}
      <Stat style={{ bottom: -4, left: "50%", transform: "translateX(-50%)" }} n={gaps} sub={gapsSub} warn />

      {locked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[9px] tracking-[0.22em] uppercase text-ink3">Locked</div>
            <div className="text-[11px] text-ink2 mt-0.5 font-light">Tap to add resume</div>
          </div>
        </div>
      )}
      <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--olo)]/20 bg-background/80 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-[var(--olo)] shadow-sm opacity-90">
        Tap to open
      </div>
    </button>
  );
}

function Stat({ style, n, sub, accent, warn }: any) {
  const color = warn ? "var(--ember, #EF9F27)" : accent ? "var(--olo)" : "currentColor";
  return (
    <div className="absolute text-center" style={{ ...style, minWidth: 56 }}>
      <div className="tabular-nums leading-none" style={{ color, fontSize: 18, fontWeight: 600, fontFamily: "var(--font-sans)" }}>{n}</div>
      <div className="text-[9px] tracking-[0.16em] uppercase mt-0.5 text-ink3">{sub}</div>
    </div>
  );
}
