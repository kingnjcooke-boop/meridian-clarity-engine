import { useState } from "react";
import { I } from "./icons";
import { SecRow } from "./screens-core";
import { useMeridianData } from "./MeridianDataContext";
import type { OnboardingData } from "./Onboarding";

// ─── ALERTS ───
export function AlertsScreen({ onOpenStory }: { onOpenStory: (id: number) => void }) {
  const [filter, setFilter] = useState<"all" | "high" | "watch">("all");
  const { stories, storiesLoading, storiesError, refreshStories } = useMeridianData();

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-6">
      <div className="px-5 pt-3 pb-2">
        <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-light">Market Intelligence</div>
        <div className="font-serif text-[26px] text-ink leading-tight font-light tracking-tight">Industry Alerts</div>
        <div className="text-[11px] text-ink3 mt-1 font-light flex items-center gap-1.5">
          <span className="slow-pulse w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Curated against your target market
        </div>
      </div>

      <div className="px-5 flex gap-2 mb-2 items-center">
        {[["all","All"],["high","High Impact"],["watch","Watch"]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k as any)} className={`text-[11px] px-3 py-1.5 rounded-full border transition ${filter === k ? "border-[var(--olo)] bg-[var(--olo)]/10 text-[var(--olo)]" : "border-black/[0.07] text-ink3"}`}>{l}</button>
        ))}
        <button onClick={refreshStories} className="ml-auto text-[10px] text-ink3 tracking-wider uppercase hover:text-[var(--olo)] transition">↻ Refresh</button>
      </div>

      {storiesError && (
        <div className="mx-5 mb-2 text-[11px] text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{storiesError}</div>
      )}

      <div className="px-5 space-y-3">
        {storiesLoading && stories.length === 0 && [0,1,2].map(i => (
          <div key={i} className="bg-surface rounded-2xl overflow-hidden shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
            <div className="h-[140px] bg-black/[0.04] animate-pulse" />
            <div className="p-4 space-y-2"><div className="h-4 bg-black/[0.05] rounded animate-pulse" /><div className="h-3 w-1/2 bg-black/[0.04] rounded animate-pulse" /></div>
          </div>
        ))}
        {stories.map((s) => (
          <button key={s.id} onClick={() => onOpenStory(s.id)} className="w-full bg-surface rounded-2xl overflow-hidden text-left shadow-[0_1px_5px_rgba(0,0,0,0.05)] hover:shadow-md transition">
            <div className="relative h-[140px]">
              <img src={s.img} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
                <I.CheckCircle width={9} height={9} className="text-emerald-300" />
                <span className="text-[9px] text-white/80 tracking-wider">{s.confirmedBy.length} sources</span>
              </div>
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-2.5 py-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.badge.dot }} />
                <span className="text-[10px] text-white/85 tracking-wider">{s.badge.text}</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block text-[9px] tracking-[0.13em] uppercase px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white/90">{s.tag}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="font-serif italic text-[16px] text-ink leading-snug mb-2">{s.headline}</div>
              <div className="flex items-center gap-1.5 text-[10px] text-ink3">
                <span>{s.source}</span>
                <span className="w-0.5 h-0.5 bg-ink3 rounded-full" />
                <span>{s.age}</span>
                <span className="ml-auto text-[var(--olo)] flex items-center gap-1">Read summary <I.ArrowRight width={10} height={10} /></span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── STORY DETAIL ───
export function StoryDetail({ id, onBack }: { id: number; onBack: () => void }) {
  const { stories } = useMeridianData();
  const s = stories[id];
  if (!s) return (
    <div className="flex-1 flex items-center justify-center text-ink3 text-sm fade-in">
      <button onClick={onBack} className="underline">Story unavailable — go back</button>
    </div>
  );
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in">
      <div className="relative h-[260px]">
        <img src={s.img} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <button onClick={onBack} className="absolute top-3 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white flex items-center justify-center">
          <I.ChevronLeft width={18} height={18} />
        </button>
        <div className="absolute bottom-4 left-5 right-5">
          <span className="inline-block text-[9px] tracking-[0.13em] uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white">{s.tag}</span>
          <div className="font-serif italic text-[24px] text-white leading-tight mt-2">{s.headline}</div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div className="flex items-center justify-between text-[11px] text-ink3">
          <span>{s.source} · {s.age}</span>
          <span className="flex items-center gap-1 text-emerald-700"><I.CheckCircle width={11} height={11} /> Cross-verified</span>
        </div>

        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 mb-2">AI Summary</div>
          <p className="text-[13px] text-ink2 leading-relaxed font-light">{s.summary}</p>
        </div>

        <div className="bg-[var(--olo)]/10 border-l-2 border-[var(--olo)] rounded-r-xl px-4 py-3.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <I.Target width={12} height={12} className="text-[var(--olo)]" />
            <span className="text-[10px] tracking-[0.16em] uppercase text-[var(--olo)] font-medium">Impact on your positioning</span>
          </div>
          <p className="text-[13px] text-ink leading-relaxed font-light">{s.impact}</p>
          {s.action && (
            <div className="mt-3 pt-3 border-t border-[var(--olo)]/20 flex items-start gap-2">
              <I.ArrowRight width={12} height={12} className="text-[var(--olo)] mt-[3px] shrink-0" />
              <div>
                <div className="text-[9.5px] tracking-[0.18em] uppercase text-[var(--olo)] font-medium mb-0.5">Your move</div>
                <p className="text-[12.5px] text-ink leading-snug font-normal">{s.action}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 mb-2">Sources confirming</div>
          <div className="space-y-1.5">
            {s.confirmedBy.map((src: string) => (
              <div key={src} className="flex items-center gap-2.5 px-3 py-2.5 bg-surface rounded-xl border border-black/[0.05]">
                <I.Globe width={13} height={13} className="text-ink3" />
                <span className="text-[12px] text-ink2 flex-1 font-light">{src}</span>
                <I.ArrowRight width={11} height={11} className="text-ink3" />
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-[var(--navy)] text-white py-3.5 rounded-2xl text-[12px] tracking-[0.1em] uppercase font-light">
          Add Related Action to Roadmap
        </button>
      </div>
    </div>
  );
}

// ─── NETWORK ───
export function NetworkScreen({ user }: { user: OnboardingData }) {
  const [connected, setConnected] = useState(false);

  if (!connected) {
    return (
      <div className="flex-1 overflow-y-auto no-scrollbar fade-in flex flex-col">
        <div className="px-5 pt-3 pb-2">
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-light">Network Intelligence</div>
          <div className="font-serif text-[26px] text-ink leading-tight font-light tracking-tight">Your Network Map</div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#0A66C2]/10 flex items-center justify-center mb-5 text-[#0A66C2]">
            <I.Linkedin width={36} height={36} strokeWidth={1.6} />
          </div>
          <h3 className="font-serif text-[24px] text-ink leading-tight font-light mb-2">Connect LinkedIn</h3>
          <p className="text-[12px] text-ink2 font-light leading-relaxed mb-1 max-w-[280px]">
            We parse your <em>connections only</em> — never your activity, messages, or feed.
          </p>
          <p className="text-[11px] text-ink3 font-light leading-relaxed mb-6 max-w-[280px]">
            Used to tell you how your network stands relative to your current goals.
          </p>

          <div className="bg-surface rounded-2xl border border-black/[0.05] px-4 py-3 mb-6 w-full text-left space-y-2">
            {["Connections in your target industry", "Warm-intro paths to top firms", "Gaps where you have no coverage"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-[12px] text-ink2 font-light">
                <I.Check width={13} height={13} className="text-[var(--olo)]" />
                {t}
              </div>
            ))}
          </div>

          <button onClick={() => setConnected(true)} className="w-full bg-[#0A66C2] text-white py-3.5 rounded-2xl text-[13px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition">
            <I.Linkedin width={16} height={16} strokeWidth={1.8} />
            Connect with LinkedIn
          </button>
          <div className="flex items-center gap-1.5 mt-3 text-[10px] text-ink3 font-light">
            <I.Lock width={10} height={10} /> Read-only · revocable anytime
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-6">
      <div className="flex justify-between items-start px-5 pt-3 pb-2">
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-light">Network Standing</div>
          <div className="font-serif text-[26px] text-ink leading-tight font-light tracking-tight">Your Network</div>
          <div className="text-[11px] text-ink3 mt-1 font-light">vs. {user.target || "D.C. Regulatory"}</div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 px-2 py-1 bg-emerald-500/10 rounded-full">
          <I.CheckCircle width={11} height={11} /> Synced
        </div>
      </div>

      <div className="mx-5 bg-surface rounded-2xl px-5 py-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)] mb-2">
        <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 mb-2">Network Coverage Score</div>
        <div className="font-serif text-[52px] text-ink leading-none font-light">62<span className="text-ink3 text-[24px]"> / 100</span></div>
        <div className="text-[11px] text-ink2 mt-2 font-light leading-relaxed">Moderate alignment. Strong in policy, light in BigLaw partner exposure.</div>
      </div>

      <SecRow label="Industry Distribution" />
      <div className="mx-5 bg-surface rounded-2xl p-4 space-y-3 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
        {[
          { name: "Public Policy / Gov't", n: 142, w: 88, hot: true },
          { name: "Law — Regulatory", n: 67, w: 54, hot: true },
          { name: "Law — M&A", n: 24, w: 18 },
          { name: "Consulting", n: 31, w: 24 },
          { name: "Investment Banking", n: 8, w: 6 },
        ].map((r) => (
          <div key={r.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[12px] text-ink font-light">{r.name} {r.hot && <span className="text-[9px] text-[var(--olo)] tracking-wider ml-1">RELEVANT</span>}</span>
              <span className="text-[11px] text-ink3 tabular-nums">{r.n}</span>
            </div>
            <div className="h-1.5 bg-black/[0.05] rounded">
              <div className="h-full bg-[var(--olo)] rounded transition-all duration-700" style={{ width: `${r.w}%` }} />
            </div>
          </div>
        ))}
      </div>

      <SecRow label="Warm-Intro Paths" link="View all" />
      <div className="px-5 space-y-2">
        {[
          { firm: "Gibson Dunn — D.C.", via: "Sarah Chen → Hon. M. Reyes (2nd)", strength: "High" },
          { firm: "Latham & Watkins — D.C.", via: "Prof. Nadeem Ali → Jane K. (1st)", strength: "Medium" },
          { firm: "Wilson Sonsini", via: "No path found", strength: "None" },
        ].map((p) => (
          <div key={p.firm} className="bg-surface rounded-2xl px-4 py-3 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] text-ink font-normal">{p.firm}</span>
              <span className={`text-[10px] tracking-wider px-2 py-0.5 rounded-full ${p.strength === "High" ? "bg-emerald-50 text-emerald-700" : p.strength === "Medium" ? "bg-[var(--olo)]/15 text-[var(--olo)]" : "bg-black/[0.04] text-ink3"}`}>{p.strength}</span>
            </div>
            <div className="text-[11px] text-ink3 font-light">{p.via}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
