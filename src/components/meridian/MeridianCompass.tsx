// Frosted knob — outer rim arc fills counter-clockwise, score sits dead-center.

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

  // Geometry in a 200x200 SVG viewBox
  const cx = 100, cy = 100;
  const R = 92; // outer rim radius
  const C = 2 * Math.PI * R;
  // Arc spans 75% of the circle, gap centered at top.
  const SPAN = 0.75;
  const dash = `${C * SPAN * pct} ${C}`;

  // Indicator dot — travels counter-clockwise from the top-left of the gap.
  // Start at angle 225° (bottom-left of top gap going CCW), sweep -270° * pct.
  const startDeg = 225; // top, slightly past 12 o'clock on the left side
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
      {/* Frosted glass body */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 45%, rgba(10,14,22,0.55) 100%)",
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.35), 0 18px 38px rgba(0,0,0,0.32)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      />

      {/* Outer rim progress — counter-clockwise.
          We mirror the SVG horizontally (scale(-1,1)) so the stroke-dash, which naturally
          paints clockwise, visually runs CCW. Rotation places the gap at the top. */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" aria-hidden>
        <defs>
          <linearGradient id="arcG" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--olo)" />
            <stop offset="100%" stopColor="oklch(0.82 0.14 60)" />
          </linearGradient>
        </defs>
        <g transform="translate(200 0) scale(-1 1)">
          <g transform={`rotate(135 ${cx} ${cy})`}>
            {/* track */}
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="4"
              strokeDasharray={`${C * SPAN} ${C}`}
              strokeLinecap="round"
            />
            {/* progress */}
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
        {/* indicator dot (already in CCW-mirrored coords above; render in normal coords here) */}
        {!locked && pct > 0 && (
          <circle
            cx={dotX}
            cy={dotY}
            r="3.4"
            fill="white"
            style={{ filter: "drop-shadow(0 0 5px var(--olo))" }}
          />
        )}
      </svg>

      {/* Center reading — perfectly centered */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
      >
        {locked ? (
          <>
            <div className="text-[8.5px] tracking-[0.24em] uppercase text-white/45">Locked</div>
            <div className="text-[11px] text-white/85 font-light mt-1">Add resume</div>
          </>
        ) : (
          <div className="flex flex-col items-center leading-none">
            <div
              className="tabular-nums text-white"
              style={{ fontSize: 44, fontWeight: 300, fontFamily: "var(--font-sans)", letterSpacing: "-0.02em", lineHeight: 1 }}
            >
              {score}
            </div>
            <div className="text-[8.5px] tracking-[0.22em] uppercase text-white/45 mt-1.5">{scoreSub}</div>
            <div className="mt-2 flex items-center gap-2 text-[9.5px] text-white/70 tabular-nums">
              <span><span className="text-[var(--olo)] font-medium">{trend}</span> <span className="text-white/40 uppercase tracking-[0.14em] text-[8px]">{trendSub}</span></span>
              <span className="w-px h-2 bg-white/15" />
              <span><span className="font-medium">{gaps}</span> <span className="text-white/40 uppercase tracking-[0.14em] text-[8px]">{gapsSub}</span></span>
            </div>
          </div>
        )}
      </div>

      {/* Tap hint */}
      <div className="absolute left-1/2 -bottom-5 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/8 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[8.5px] uppercase tracking-[0.18em] text-white/55">
        Tap
      </div>
    </button>
  );
}
