// Decorative compass dashboard widget — three stat callouts at N/E/S compass positions.
// Click anywhere on the card to open Position. West is intentionally negative space.

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
  score = "81",
  scoreSub = "Top 14%",
  trend = "+6",
  trendSub = "↑ Improving",
  gaps = "2",
  gapsSub = "High Priority",
  onClick,
  locked,
}: Props) {
  const teal = "#1D9E75";
  const teal100 = "#9FE1CB";
  const teal200 = "#5DCAA5";
  const amber = "#FAC775";
  const amber200 = "#EF9F27";
  const gray = "#5F5E5A";

  return (
    <button
      onClick={onClick}
      className="block w-full max-w-[380px] mx-auto text-left rounded-3xl relative overflow-hidden active:scale-[0.995] transition"
      style={{ background: "#04342C", aspectRatio: "1 / 1" }}
    >
      {/* Compass rose SVG */}
      <svg viewBox="0 0 380 380" className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Concentric rings */}
        <circle cx="190" cy="190" r="124" fill="none" stroke={teal} strokeOpacity="0.15" strokeWidth="1" />
        <circle cx="190" cy="190" r="105" fill="none" stroke={teal} strokeOpacity="0.15" strokeWidth="1" />
        {/* Dashed crosshair */}
        <line x1="190" y1="40" x2="190" y2="340" stroke={teal} strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 5" />
        <line x1="40" y1="190" x2="340" y2="190" stroke={teal} strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 5" />
        {/* 8 cardinal tick marks on outer ring */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const r1 = 124, r2 = 132;
          const x1 = 190 + Math.cos(a) * r1;
          const y1 = 190 + Math.sin(a) * r1;
          const x2 = 190 + Math.cos(a) * r2;
          const y2 = 190 + Math.sin(a) * r2;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={teal} strokeOpacity="0.4" strokeWidth="1.4" />;
        })}
        {/* Compass needle: north (teal), south (gray) */}
        <polygon points="190,80 196,190 184,190" fill={teal} />
        <polygon points="190,300 196,190 184,190" fill={gray} />
        {/* Pivot */}
        <circle cx="190" cy="190" r="6" fill="#04342C" stroke={teal} strokeWidth="2" />
        {/* Dashed connector lines from pivot to each stat */}
        <line x1="190" y1="190" x2="190" y2="78" stroke={teal} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 4" />
        <line x1="190" y1="190" x2="302" y2="190" stroke={teal} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 4" />
        <line x1="190" y1="190" x2="190" y2="302" stroke={amber} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 4" />
      </svg>

      {/* North — Score */}
      <Pill
        style={{ top: "8%", left: "50%", transform: "translateX(-50%)", background: "rgba(29, 158, 117, 0.15)", border: "1px solid rgba(29,158,117,0.3)" }}
        n={score} nColor="#FFFFFF" label="Score" labelColor={teal100} sub={scoreSub} subColor={teal200}
      />

      {/* East — 7-Day */}
      <Pill
        style={{ top: "50%", right: "4%", transform: "translateY(-50%)", background: "rgba(29, 158, 117, 0.15)", border: "1px solid rgba(29,158,117,0.3)" }}
        n={trend} nColor="#FFFFFF" label="7-Day" labelColor={teal100} sub={trendSub} subColor={teal200}
      />

      {/* South — Active Gaps */}
      <Pill
        style={{ bottom: "12%", left: "50%", transform: "translateX(-50%)", background: "rgba(239, 159, 39, 0.12)", border: "1px solid rgba(239,159,39,0.25)" }}
        n={gaps} nColor={amber} label="Active Gaps" labelColor={amber} sub={gapsSub} subColor={amber200}
      />

      {/* Wordmark */}
      <div
        className="absolute bottom-2 inset-x-0 text-center"
        style={{ color: teal200, opacity: 0.5, letterSpacing: "0.25em", fontSize: 10, fontWeight: 500 }}
      >
        MERIDIAN
      </div>

      {locked && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(4,52,44,0.85)", backdropFilter: "blur(2px)" }}>
          <div className="text-center px-6">
            <div style={{ color: teal200, fontSize: 10, letterSpacing: "0.22em" }} className="uppercase mb-2">Locked</div>
            <div className="font-serif text-white text-[22px] leading-tight font-light">Upload your resume<br/>to unlock your score.</div>
            <div className="text-[11px] mt-2" style={{ color: teal100 }}>Tap to add resume →</div>
          </div>
        </div>
      )}
    </button>
  );
}

function Pill({ style, n, nColor, label, labelColor, sub, subColor }: any) {
  return (
    <div
      className="absolute rounded-2xl px-3.5 py-2 text-center"
      style={{ ...style, minWidth: 96, backdropFilter: "blur(4px)" }}
    >
      <div style={{ color: nColor, fontSize: 32, fontWeight: 600, lineHeight: 1, fontFamily: "var(--font-sans)" }} className="tabular-nums">{n}</div>
      <div style={{ color: labelColor, fontSize: 12, fontWeight: 400, marginTop: 4 }}>{label}</div>
      <div style={{ color: subColor, fontSize: 11, fontWeight: 400, marginTop: 1 }}>{sub}</div>
    </div>
  );
}
