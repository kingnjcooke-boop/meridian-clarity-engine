// Texturized neumorphic knob — score in the center, gradient arc, tactile feel.
// Tap to open positioning.

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
  const size = 224;
  const numeric = Number(score);
  const pct = Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) / 100 : 0;
  const R = 92;
  const C = 2 * Math.PI * R;
  // Arc spans 270° (top-left → top-right going around bottom)
  const arcLen = C * 0.75;
  const arcOffset = C * 0.125; // rotate gap to top
  const dash = `${arcLen * pct} ${C}`;

  return (
    <button
      onClick={onClick}
      className="block mx-auto relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--olo)]/50 rounded-full"
      style={{ width: size, height: size }}
      aria-label="Open positioning"
    >
      {/* Outer dial — texturized */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 28%, oklch(0.32 0.04 250) 0%, oklch(0.18 0.03 250) 55%, oklch(0.11 0.025 250) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -14px 30px rgba(0,0,0,0.55), 0 22px 44px rgba(0,0,0,0.35), 0 2px 0 rgba(255,255,255,0.04)",
        }}
      />
      {/* Subtle brushed texture */}
      <svg className="absolute inset-0 w-full h-full rounded-full opacity-[0.18] mix-blend-overlay pointer-events-none" viewBox="0 0 200 200" aria-hidden>
        <defs>
          <radialGradient id="grain" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#grain)" />
      </svg>

      {/* Inner well */}
      <div
        className="absolute rounded-full"
        style={{
          inset: 16,
          background:
            "radial-gradient(circle at 35% 30%, oklch(0.22 0.03 250) 0%, oklch(0.12 0.025 250) 70%)",
          boxShadow:
            "inset 0 2px 6px rgba(0,0,0,0.7), inset 0 -1px 0 rgba(255,255,255,0.06)",
        }}
      />

      {/* Progress arc */}
      <svg className="absolute inset-0 w-full h-full -rotate-[135deg]" viewBox="0 0 200 200" aria-hidden>
        <defs>
          <linearGradient id="arcG" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--olo)" />
            <stop offset="100%" stopColor="oklch(0.78 0.13 60)" />
          </linearGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r={R / 2}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="3"
        />
        <circle
          cx="100"
          cy="100"
          r={R / 2}
          fill="none"
          stroke="url(#arcG)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(C * 0.75 * pct) / 2} ${C}`}
          style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--olo) 65%, transparent))" }}
        />
        {/* indicator dot */}
        {!locked && (
          <circle
            cx={100 + (R / 2) * Math.cos((Math.PI * 2 * 0.75 * pct))}
            cy={100 + (R / 2) * Math.sin((Math.PI * 2 * 0.75 * pct))}
            r="3.2"
            fill="white"
            style={{ filter: "drop-shadow(0 0 4px var(--olo))" }}
          />
        )}
      </svg>

      {/* Center reading */}
      <div className="absolute inset-0 flex-col flex items-center justify-center">
        {locked ? (
          <>
            <div className="text-[9px] tracking-[0.24em] uppercase text-white/40">Locked</div>
            <div className="text-[12px] text-white/85 font-light mt-1">Add resume</div>
          </>
        ) : (
          <>
            <div
              className="tabular-nums leading-none text-white"
              style={{ fontSize: 54, fontWeight: 300, fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}
            >
              {score}
            </div>
            <div className="text-[9px] tracking-[0.22em] uppercase text-white/45 mt-2">{scoreSub}</div>
            <div className="mt-3 flex items-center gap-3 text-[10px] text-white/70 tabular-nums">
              <span><span className="text-[var(--olo)] font-medium">{trend}</span> <span className="text-white/40 uppercase tracking-[0.14em] text-[8.5px]">{trendSub}</span></span>
              <span className="w-px h-2.5 bg-white/15" />
              <span><span className="font-medium">{gaps}</span> <span className="text-white/40 uppercase tracking-[0.14em] text-[8.5px]">{gapsSub}</span></span>
            </div>
          </>
        )}
      </div>

      {/* Tap hint */}
      <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/30 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-white/70">
        Tap
      </div>
    </button>
  );
}
