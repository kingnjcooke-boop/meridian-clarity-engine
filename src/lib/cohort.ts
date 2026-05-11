import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type HistBin = { lo: number; hi: number; n: number };
export type CohortStats = {
  industry: string;
  niche: string | null;
  target: string;
  histogram: HistBin[];
  median: number;
  p25: number;
  p75: number;
  p90: number;
  sample_size: number;
};

// Synthetic distribution used when the user has no matching cohort yet
// (preserves the demo-first promise on the landing experience).
export const DEMO_STATS: CohortStats = {
  industry: "Law",
  niche: "Privacy & Cybersecurity",
  target: "BigLaw D.C. Associate",
  histogram: [
    { lo: 50, hi: 55, n: 0 }, { lo: 55, hi: 60, n: 1 }, { lo: 60, hi: 65, n: 1 },
    { lo: 65, hi: 70, n: 2 }, { lo: 70, hi: 75, n: 4 }, { lo: 75, hi: 80, n: 8 },
    { lo: 80, hi: 85, n: 12 }, { lo: 85, hi: 90, n: 11 }, { lo: 90, hi: 95, n: 6 }, { lo: 95, hi: 100, n: 3 },
  ],
  median: 85, p25: 80, p75: 90, p90: 94, sample_size: 48,
};

export function percentileFromCurve(score: number, stats: CohortStats): number {
  // Empirical CDF from histogram + a touch of within-bin interpolation.
  const total = stats.sample_size || stats.histogram.reduce((a, b) => a + b.n, 0) || 1;
  let below = 0;
  for (const b of stats.histogram) {
    if (score >= b.hi) { below += b.n; continue; }
    if (score < b.lo) break;
    below += b.n * ((score - b.lo) / (b.hi - b.lo));
    break;
  }
  return Math.max(1, Math.min(99, Math.round((below / total) * 100)));
}

export function useCohortStats(industry?: string | null, niche?: string | null, target?: string | null) {
  const [stats, setStats] = useState<CohortStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    (async () => {
      // Try exact (industry, niche, target); else fall back to (industry, target); else demo.
      const q = supabase.from("cohort_stats").select("*").limit(1);
      let row: any = null;
      if (industry && target) {
        const exact = await q.eq("industry", industry).eq("target", target).eq("niche", niche ?? "").maybeSingle();
        if (exact.data) row = exact.data;
        if (!row) {
          const loose = await supabase.from("cohort_stats").select("*").eq("industry", industry).eq("target", target).limit(1).maybeSingle();
          if (loose.data) row = loose.data;
        }
        if (!row) {
          const any = await supabase.from("cohort_stats").select("*").eq("industry", industry).limit(1).maybeSingle();
          if (any.data) row = any.data;
        }
      }
      if (cancel) return;
      setStats(row ? (row as CohortStats) : DEMO_STATS);
      setLoading(false);
    })();
    return () => { cancel = true; };
  }, [industry, niche, target]);

  return { stats, loading };
}
