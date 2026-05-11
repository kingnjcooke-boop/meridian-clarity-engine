import { useEffect, useMemo, useRef, useState } from "react";
import type { CohortStats } from "@/lib/cohort";
import { percentileFromCurve } from "@/lib/cohort";

/**
 * Editorial cohort distribution curve. SVG density line over a histogram,
 * with the user's dot animated to its percentile. p25/p50/p75 grid lines,
 * tier band shading. One signature transition (~1.2s eased).
 */
export function CohortCurve({
  stats,
  score,
  height = 180,
  showAxis = true,
  compact = false,
}: {
  stats: CohortStats;
  score: number | null;
  height?: number;
  showAxis?: boolean;
  compact?: boolean;
}) {
  const W = 600, H = height;
  const padX = 16, padTop = 16, padBottom = showAxis ? 22 : 8;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;

  // Build smooth density: take histogram bin counts, normalize, and sample
  // a Catmull-Rom-ish curve across them.
  const peaks = useMemo(() => {
    const max = Math.max(1, ...stats.histogram.map((b) => b.n));
    return stats.histogram.map((b, i) => ({
      x: padX + (i + 0.5) * (innerW / stats.histogram.length),
      y: padTop + innerH - (b.n / max) * innerH * 0.92,
      lo: b.lo, hi: b.hi, n: b.n,
    }));
  }, [stats, innerW, innerH, padX, padTop]);

  const pathD = useMemo(() => {
    if (peaks.length < 2) return "";
    const pts = [
      { x: padX, y: padTop + innerH }, // baseline start
      ...peaks,
      { x: padX + innerW, y: padTop + innerH }, // baseline end
    ];
    const cmds: string[] = [`M ${pts[0].x} ${pts[0].y}`];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      cmds.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
    }
    return cmds.join(" ");
  }, [peaks, padX, padTop, innerW, innerH]);

  const fillD = pathD ? `${pathD} L ${padX + innerW} ${padTop + innerH} L ${padX} ${padTop + innerH} Z` : "";

  // Score → x position. Histogram spans bins[0].lo .. bins[last].hi
  const lo = stats.histogram[0]?.lo ?? 50;
  const hi = stats.histogram[stats.histogram.length - 1]?.hi ?? 100;
  function xOf(s: number) {
    const clamped = Math.max(lo, Math.min(hi, s));
    return padX + ((clamped - lo) / (hi - lo)) * innerW;
  }
  function yOnCurve(x: number) {
    // Approximate by interpolating between nearest peaks.
    if (peaks.length === 0) return padTop + innerH;
    if (x <= peaks[0].x) return peaks[0].y;
    if (x >= peaks[peaks.length - 1].x) return peaks[peaks.length - 1].y;
    for (let i = 0; i < peaks.length - 1; i++) {
      if (x >= peaks[i].x && x <= peaks[i + 1].x) {
        const t = (x - peaks[i].x) / (peaks[i + 1].x - peaks[i].x);
        return peaks[i].y * (1 - t) + peaks[i + 1].y * t;
      }
    }
    return padTop + innerH;
  }

  // Animate the user's dot toward target position with a signature easing.
  const [animScore, setAnimScore] = useState<number | null>(null);
  const prev = useRef<number | null>(null);
  useEffect(() => {
    if (score == null) { setAnimScore(null); prev.current = null; return; }
    const from = prev.current ?? Math.max(lo, score - 10);
    const to = score;
    const start = performance.now();
    const dur = 1200;
    const ease = (t: number) => 1 - Math.pow(1 - t, 4); // cubic-bezier(0.22,1,0.36,1) approx
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const v = from + (to - from) * ease(t);
      setAnimScore(v);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, lo]);

  const dotX = animScore != null ? xOf(animScore) : null;
  const dotY = dotX != null ? yOnCurve(dotX) : null;

  const pct = score != null ? percentileFromCurve(score, stats) : null;
  const tierBands: { from: number; to: number; label: string; opacity: number }[] = [
    { from: 50, to: 78, label: "Emerging", opacity: 0.0 },
    { from: 78, to: 86, label: "Developing", opacity: 0.04 },
    { from: 86, to: 91, label: "Competitive", opacity: 0.07 },
    { from: 91, to: 96, label: "Sharp", opacity: 0.10 },
    { from: 96, to: 100, label: "Elite", opacity: 0.14 },
  ];

  const gridLines: { x: number; label: string; emphasis?: boolean }[] = [
    { x: xOf(stats.p25), label: "p25" },
    { x: xOf(stats.median), label: "median", emphasis: true },
    { x: xOf(stats.p75), label: "p75" },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" aria-label="Cohort distribution">
      <defs>
        <linearGradient id="cohortFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--olo)" stopOpacity="0.20" />
          <stop offset="100%" stopColor="var(--olo)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="dotGlow">
          <stop offset="0%" stopColor="var(--olo)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--olo)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Tier band shading */}
      {tierBands.map((b) => (
        <rect
          key={b.label}
          x={xOf(b.from)} y={padTop}
          width={Math.max(0, xOf(b.to) - xOf(b.from))} height={innerH}
          fill="var(--ink)" opacity={b.opacity}
        />
      ))}

      {/* Baseline */}
      <line x1={padX} y1={padTop + innerH} x2={padX + innerW} y2={padTop + innerH} stroke="currentColor" strokeOpacity="0.10" strokeWidth="1" />

      {/* Density fill + line */}
      {fillD && <path d={fillD} fill="url(#cohortFill)" />}
      {pathD && <path d={pathD} fill="none" stroke="var(--olo)" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}

      {/* p25 / median / p75 grid lines */}
      {gridLines.map((g) => (
        <g key={g.label}>
          <line
            x1={g.x} y1={padTop} x2={g.x} y2={padTop + innerH}
            stroke="currentColor"
            strokeOpacity={g.emphasis ? 0.28 : 0.14}
            strokeDasharray={g.emphasis ? "0" : "2 4"}
            strokeWidth={g.emphasis ? 1 : 0.8}
          />
          {!compact && (
            <text
              x={g.x} y={padTop - 4}
              textAnchor="middle"
              fontSize="8.5"
              fill="currentColor"
              opacity={g.emphasis ? 0.55 : 0.35}
              style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
            >
              {g.label}
            </text>
          )}
        </g>
      ))}

      {/* User's dot */}
      {dotX != null && dotY != null && (
        <g>
          <circle cx={dotX} cy={dotY} r="14" fill="url(#dotGlow)" />
          <line x1={dotX} y1={dotY} x2={dotX} y2={padTop + innerH} stroke="var(--olo)" strokeOpacity="0.45" strokeWidth="1" />
          <circle cx={dotX} cy={dotY} r="4.5" fill="var(--olo)" stroke="white" strokeWidth="1.5" />
          {pct != null && !compact && (
            <text
              x={dotX} y={dotY - 12}
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              opacity="0.85"
              fontStyle="italic"
              fontFamily="var(--font-serif)"
            >
              you · top {100 - pct}%
            </text>
          )}
        </g>
      )}

      {/* Axis labels */}
      {showAxis && (
        <g fontSize="9" fill="currentColor" opacity="0.45" style={{ letterSpacing: "0.16em" }}>
          <text x={padX} y={H - 6}>{lo}</text>
          <text x={padX + innerW / 2} y={H - 6} textAnchor="middle">SCORE</text>
          <text x={padX + innerW} y={H - 6} textAnchor="end">{hi}</text>
        </g>
      )}
    </svg>
  );
}
