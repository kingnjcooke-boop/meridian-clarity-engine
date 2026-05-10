import { I } from "./icons";
import { ACTIONS, SecRow } from "./screens-core";
import { useMeridianData } from "./MeridianDataContext";

const themeMap: Record<string, string> = {
  navy: "from-[var(--navy)] to-[var(--navy)]/80",
  olo: "from-[var(--olo)]/90 to-[var(--olo)]/70",
  emerald: "from-emerald-700 to-emerald-600",
  blue: "from-[#185FA5] to-[#2978c8]",
};

export function ResourcesScreen() {
  const { resources, resourcesLoading, resourcesError, refreshResources } = useMeridianData();

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-6">
      <div className="px-5 pt-3 pb-2 flex items-start justify-between">
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-light">Curated for your target</div>
          <div className="font-serif text-[26px] text-ink leading-tight font-light tracking-tight">Resources</div>
          <div className="text-[11px] text-ink3 mt-1 font-light">Resume templates, interview prep, and articles — sourced and re-ranked by AI.</div>
        </div>
        <button onClick={refreshResources} className="text-[10px] text-ink3 tracking-wider uppercase hover:text-[var(--olo)] mt-2">↻</button>
      </div>

      {resourcesError && (
        <div className="mx-5 mb-2 text-[11px] text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{resourcesError}</div>
      )}

      <SecRow label="Resume Templates" link="All templates" />
      <div className="px-5 space-y-2">
        {resourcesLoading && !resources && [0,1,2].map(i => <div key={i} className="h-[78px] bg-surface rounded-2xl animate-pulse" />)}
        {resources?.resumes.map((r) => (
          <div key={r.name} className="bg-surface rounded-2xl p-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)] flex gap-3 items-start">
            <div className="w-11 h-14 rounded-md bg-gradient-to-br from-[var(--olo)]/20 to-[var(--navy)]/10 flex items-center justify-center text-[var(--olo)]">
              <I.FileText width={18} height={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-[13px] text-ink font-normal truncate">{r.name}</div>
                {r.tag && <span className="text-[9px] text-[var(--olo)] tracking-wider">{r.tag}</span>}
              </div>
              <div className="text-[11px] text-ink3 mt-0.5 font-light">{r.desc}</div>
              <button className="text-[11px] text-[var(--olo)] mt-1.5 flex items-center gap-1">Open template <I.ArrowRight width={10} height={10} /></button>
            </div>
          </div>
        ))}
      </div>

      <SecRow label="Interview Prep" />
      <div className="px-5 grid grid-cols-2 gap-2">
        {resources?.drills.map((b) => (
          <button key={b.title} className={`bg-gradient-to-br ${themeMap[b.theme] || themeMap.navy} rounded-2xl p-4 text-left text-white aspect-square flex flex-col justify-between hover:scale-[1.02] transition`}>
            <div className="text-[11px] tracking-[0.16em] uppercase opacity-70">{b.count} drills</div>
            <div className="font-serif text-[20px] leading-tight">{b.title}</div>
          </button>
        ))}
      </div>

      <SecRow label="AI-Sourced Articles" link="More" />
      <div className="px-5 space-y-2">
        {resources?.articles.map((a) => (
          <details key={a.title} className="bg-surface rounded-2xl p-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)] group">
            <summary className="cursor-pointer list-none">
              <div className="font-serif italic text-[15px] text-ink leading-snug mb-1.5">{a.title}</div>
              <div className="flex items-center gap-2 text-[11px] text-ink3 font-light">
                <span className="flex items-center gap-1"><I.Sparkles width={11} height={11} className="text-[var(--olo)]" /> {a.source}</span>
                <span className="ml-auto">{a.readTime}</span>
              </div>
            </summary>
            <div className="mt-3 pt-3 border-t border-black/[0.05] space-y-2.5">
              <p className="text-[12px] text-ink2 leading-relaxed font-light">{a.summary}</p>
              <div className="bg-[var(--olo)]/10 border-l-2 border-[var(--olo)] rounded-r-lg px-3 py-2">
                <div className="text-[9px] tracking-[0.16em] uppercase text-[var(--olo)] font-medium mb-1">Why it matters</div>
                <p className="text-[12px] text-ink leading-relaxed font-light">{a.whyItMatters}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// ─── ROADMAP ───
export function RoadmapScreen({ onOpenAction, onBack }: { onOpenAction: (id: number) => void; onBack: () => void }) {
  const completed = [
    { title: "Updated headline to lead with regulatory focus", pts: 6, when: "2 days ago" },
    { title: "Reached out to 3 alumni at GD D.C.", pts: 8, when: "4 days ago" },
    { title: "Drafted note on FCC merger review", pts: 5, when: "1 week ago" },
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-6">
      <div className="flex items-center gap-3 px-5 pt-3 pb-2">
        <button onClick={onBack} className="w-9 h-9 rounded-md bg-black/[0.04] flex items-center justify-center text-ink2"><I.ChevronLeft width={16} height={16} /></button>
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-light">Your Plan</div>
          <div className="font-serif text-[22px] text-ink leading-tight font-light">Roadmap</div>
        </div>
      </div>

      <div className="mx-5 bg-gradient-to-br from-[var(--navy)] to-[var(--navy)]/90 rounded-3xl px-5 py-5 text-white relative overflow-hidden mb-3">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-[var(--olo)]/10 blur-2xl" />
        <div className="text-[10px] tracking-[0.2em] uppercase text-white/40">This Week</div>
        <div className="flex items-baseline gap-2 mt-1">
          <div className="font-serif text-[42px] font-light leading-none">+18</div>
          <div className="text-[12px] text-white/50 font-light">projected score gain</div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/10 rounded">
            <div className="h-full bg-[var(--olo)] rounded" style={{ width: "37%" }} />
          </div>
          <div className="text-[11px] text-white/70 tabular-nums">3 / 8</div>
        </div>
      </div>

      <SecRow label="Up Next" />
      <div className="px-5 space-y-2">
        {ACTIONS.map((a, i) => (
          <button key={a.id} onClick={() => onOpenAction(a.id)} className="w-full bg-surface rounded-2xl px-4 py-3.5 shadow-[0_1px_5px_rgba(0,0,0,0.05)] border-l-2 text-left flex gap-3 items-start active:scale-[0.99] transition" style={{ borderLeftColor: a.color }}>
            <div className="w-7 h-7 rounded-full bg-[var(--navy)] text-white flex items-center justify-center text-[12px] font-light flex-shrink-0 mt-0.5">{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-ink font-normal leading-snug">{a.title}</div>
              <div className="text-[11px] text-ink3 mt-0.5 font-light">{a.time} · closes {a.gap}</div>
            </div>
            <div className="font-serif text-[16px]" style={{ color: a.color }}>+{a.pts}</div>
          </button>
        ))}
      </div>

      <SecRow label="Completed" />
      <div className="px-5 space-y-2">
        {completed.map((c, i) => (
          <div key={i} className="bg-surface/60 rounded-2xl px-4 py-3 flex gap-3 items-center border border-black/[0.04]">
            <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <I.Check width={14} height={14} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-ink2 line-through decoration-ink3/40 leading-snug">{c.title}</div>
              <div className="text-[10px] text-ink3 mt-0.5 font-light">{c.when}</div>
            </div>
            <div className="font-serif text-[14px] text-emerald-700">+{c.pts}</div>
          </div>
        ))}
      </div>

      <div className="mx-5 mt-5 bg-[var(--olo)]/10 rounded-2xl p-4 flex items-center gap-3">
        <div className="text-[var(--olo)]"><I.Sparkles width={20} height={20} /></div>
        <div className="flex-1">
          <div className="text-[12px] text-ink font-normal">You're on a 4-day streak.</div>
          <div className="text-[11px] text-ink3 font-light">Keep going — momentum compounds.</div>
        </div>
      </div>
    </div>
  );
}

export function ActionDetail({ id, onBack }: { id: number; onBack: () => void }) {
  const a = ACTIONS[id];
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-6">
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <button onClick={onBack} className="w-9 h-9 rounded-md bg-black/[0.04] flex items-center justify-center text-ink2"><I.ChevronLeft width={16} height={16} /></button>
        <span className="font-serif text-[17px] text-ink">Action Details</span>
        <button className="w-9 h-9 border border-black/[0.06] rounded-md flex items-center justify-center text-ink2"><I.Bell width={15} height={15} /></button>
      </div>
      <div className="px-7 py-3 text-center">
        <div className="text-[14px] text-ink leading-relaxed">{a.title}</div>
      </div>

      <div className="mx-5 bg-surface rounded-2xl px-4 py-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)] mb-2">
        <div className="flex items-center gap-2 mb-2">
          <I.Sun width={12} height={12} className="text-[var(--olo)]" />
          <span className="text-[10px] tracking-[0.14em] uppercase text-ink3">Why this matters</span>
        </div>
        <div className="text-[13px] text-ink2 leading-relaxed font-light">{a.why}</div>
      </div>

      <div className="px-5 flex gap-2 mb-2">
        <Tag label="Signal" val={a.signal} />
        <Tag label="Gap" val={a.gap} />
      </div>

      <div className="mx-5 bg-surface rounded-2xl px-4 py-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)] mb-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.13em] uppercase text-ink3">Estimated Score Impact</span>
          <span className="font-serif text-[22px] text-[var(--olo)]">+{a.pts} points</span>
        </div>
        <div className="h-[3px] bg-black/[0.06] rounded mt-3 overflow-hidden">
          <div className="h-full bg-[var(--olo)]" style={{ width: `${(a.pts / 24) * 100}%` }} />
        </div>
      </div>

      <div className="mx-5 bg-surface rounded-2xl px-4 py-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)] mb-3">
        <div className="flex items-center gap-2 mb-3">
          <I.CheckCircle width={12} height={12} className="text-ink3" />
          <span className="text-[10px] tracking-[0.14em] uppercase text-ink3">How to complete</span>
        </div>
        {a.steps.map((s, i) => (
          <div key={i} className="flex gap-3 mb-3 items-start">
            <div className="w-5 h-5 rounded-full bg-ink text-white text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
            <div className="text-[13px] text-ink2 leading-relaxed font-light">{s}</div>
          </div>
        ))}
        <div className="bg-black/[0.03] rounded-md px-3 py-2.5 text-[11px] text-ink3 font-light leading-relaxed mt-1">
          <span className="text-[var(--olo)] font-medium tracking-wide">TIP · </span>{a.tip}
        </div>
      </div>

      <div className="px-5 space-y-2">
        <button onClick={onBack} className="w-full bg-[var(--navy)] text-white py-3.5 rounded-2xl text-[12px] tracking-[0.1em] uppercase font-light">Mark as Complete</button>
        <button onClick={onBack} className="w-full border border-black/10 py-3 rounded-2xl text-[11px] tracking-[0.07em] uppercase text-ink3 font-light">Snooze for Later</button>
      </div>
    </div>
  );
}

function Tag({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex-1 bg-black/[0.03] rounded-md px-3 py-2.5">
      <div className="text-[9px] tracking-[0.12em] uppercase text-ink3">{label}</div>
      <div className="text-[12px] text-ink mt-0.5">{val}</div>
    </div>
  );
}
