// Frosted knob — outer rim arc fills counter-clockwise, score sits dead-center.
// Adaptive to light/dark surfaces via semantic ink tokens.

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
  trendSub = "7d",
  gaps = "—",
  gapsSub = "Gaps",
  onClick,
  locked,
}: Props) {
  const size = 180;
  const numeric = Number(score);
  const pct = Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) / 100 : 0;

  const cx = 100, cy = 100;
  const R = 92;
  const C = 2 * Math.PI * R;
  const SPAN = 0.75;
  const dash = `${C * SPAN * pct} ${C}`;

  const startDeg = 225;
  const angle = (startDeg - 360 * SPAN * pct) * (Math.PI / 180);
  const dotX = cx + R * Math.cos(angle);
  const dotY = cy + R * Math.sin(angle);

  return (
    <button
      onClick={onClick}
      className="block mx-auto relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--olo)]/40 rounded-full"
      style={{ width: size, height: size }}
      aria-label="Open positioning"
    >
      {/* Frosted glass body — light & dark adaptive via layered overlays */}
      <div
        className="absolute inset-0 rounded-full bg-white/55 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/10"
        style={{
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.06), 0 18px 38px rgba(15,20,30,0.10)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full pointer-events-none opacity-70 dark:opacity-100"
        style={{
          background:
            "radial-gradient(120% 120% at 30% 20%, rgba(255,255,255,0.45), transparent 55%), radial-gradient(120% 120% at 70% 90%, rgba(12,35,64,0.06), transparent 60%)",
        }}
      />

      {/* Outer rim progress — counter-clockwise */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" aria-hidden>
        <defs>
          <linearGradient id="arcG" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--olo)" />
            <stop offset="100%" stopColor="oklch(0.82 0.14 60)" />
          </linearGradient>
        </defs>
        <g transform="translate(200 0) scale(-1 1)">
          <g transform={`rotate(135 ${cx} ${cy})`}>
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              className="stroke-black/10 dark:stroke-white/10"
              strokeWidth="4"
              strokeDasharray={`${C * SPAN} ${C}`}
              strokeLinecap="round"
            />
            {!locked && pct > 0 && (
              <circle
                cx={cx}
                cy={cy}
                r={R}
                fill="none"
                stroke="url(#arcG)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={dash}
                style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--olo) 70%, transparent))" }}
              />
            )}
          </g>
        </g>
        {!locked && pct > 0 && (
          <circle
            cx={dotX}
            cy={dotY}
            r="3.4"
            className="fill-white dark:fill-white"
            style={{ filter: "drop-shadow(0 0 5px var(--olo))" }}
          />
        )}
      </svg>

      {/* Center reading */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        {locked ? (
          <>
            <div className="text-[8.5px] tracking-[0.24em] uppercase text-ink3">Locked</div>
            <div className="text-[11px] text-ink2 font-light mt-1">Add resume</div>
          </>
        ) : (
          <div className="flex flex-col items-center leading-none">
            <div
              className="tabular-nums text-ink"
              style={{ fontSize: 44, fontWeight: 300, fontFamily: "var(--font-sans)", letterSpacing: "-0.02em", lineHeight: 1 }}
            >
              {score}
            </div>
            <div className="text-[8.5px] tracking-[0.22em] uppercase text-ink3 mt-1.5">{scoreSub}</div>
            <div className="mt-2 flex items-center gap-2 text-[9.5px] text-ink2 tabular-nums">
              <span><span className="text-[var(--olo)] font-medium">{trend}</span> <span className="text-ink3 uppercase tracking-[0.14em] text-[8px]">{trendSub}</span></span>
              <span className="w-px h-2 bg-black/15 dark:bg-white/15" />
              <span><span className="font-medium">{gaps}</span> <span className="text-ink3 uppercase tracking-[0.14em] text-[8px]">{gapsSub}</span></span>
            </div>
          </div>
        )}
      </div>

      {/* Tap hint */}
      <div className="absolute left-1/2 -bottom-5 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/[0.06] dark:border-white/10 px-2 py-0.5 text-[8.5px] uppercase tracking-[0.18em] text-ink3">
        Tap
      </div>
    </button>
  );
}
