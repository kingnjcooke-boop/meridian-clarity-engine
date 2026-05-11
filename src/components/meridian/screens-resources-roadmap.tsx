import { I } from "./icons";
import { ACTIONS, SecRow } from "./screens-core";
import { useMeridianData } from "./MeridianDataContext";

const themeMap: Record<string, string> = {
  navy: "from-[var(--navy)] to-[var(--navy)]/80",
  olo: "from-[var(--olo)]/90 to-[var(--olo)]/70",
  emerald: "from-emerald-700 to-emerald-600",
  blue: "from-[#185FA5] to-[#2978c8]",
};

export function ResourcesScreen({ onOpenIndustryBrief, onOpenDrill, onOpenLexicon }: { onOpenIndustryBrief: () => void; onOpenDrill: (idx: number) => void; onOpenLexicon: () => void }) {
  const { resources, resourcesLoading, resourcesError, refreshResources } = useMeridianData();
  const brief = resources?.industryBrief;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-6">
      <div className="px-5 pt-3 pb-2 flex items-start justify-between">
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-light">Curated for your target</div>
          <div className="font-serif text-[26px] text-ink leading-tight font-light tracking-tight">Resources</div>
          <div className="text-[11px] text-ink3 mt-1 font-light">Sourced and re-ranked by AI · refreshed daily</div>
        </div>
        <button onClick={refreshResources} className="text-[10px] text-ink3 tracking-wider uppercase hover:text-[var(--olo)] mt-2">↻</button>
      </div>

      {resourcesError && (
        <div className="mx-5 mb-2 text-[11px] text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{resourcesError}</div>
      )}

      {/* INDUSTRY BRIEF — focal card */}
      <div className="px-5 pt-1 pb-3">
        {resourcesLoading && !brief && <div className="h-[260px] bg-surface rounded-3xl animate-pulse" />}
        {brief && (
          <button onClick={onOpenIndustryBrief} className="w-full text-left rounded-3xl overflow-hidden relative shadow-[0_18px_50px_rgba(0,0,0,0.18)] active:scale-[0.99] transition" style={{ height: 280 }}>
            {brief.image && <img src={brief.image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />}
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,15,30,0.25) 0%, rgba(10,15,30,0.55) 50%, rgba(10,15,30,0.95) 100%)" }} />
            <div className="absolute top-4 left-4 frost rounded-full px-2.5 py-1 flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.15)" }}>
              <I.Sparkles width={11} height={11} className="text-[var(--olo)]" />
              <span className="text-[9px] tracking-[0.18em] uppercase text-white/95">Industry Brief</span>
            </div>
            <div className="absolute top-4 right-4 frost rounded-full px-2 py-0.5" style={{ background: "rgba(255,255,255,0.1)" }}>
              <span className="text-[9px] tracking-wider text-white/80">This week</span>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-5">
              <div className="font-serif text-[26px] text-white leading-[1.1] font-light tracking-tight mb-1.5">{brief.title}</div>
              <div className="text-[11px] text-white/70 font-light mb-3">{brief.subtitle}</div>
              <div className="flex items-center gap-3 text-white/85 text-[11px]">
                <span className="flex items-center gap-1.5"><I.Map width={11} height={11} /> {(brief.steps?.length ?? 0)} step walkthrough</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="flex items-center gap-1.5"><I.Clock width={11} height={11} /> {brief.timing}</span>
                <span className="ml-auto flex items-center gap-1 text-[var(--olo)]">Open <I.ArrowRight width={11} height={11} /></span>
              </div>
            </div>
          </button>
        )}
      </div>

      <SecRow label="Resume Templates" link="All templates" />
      <div className="px-5 space-y-2">
        {resourcesLoading && !resources && [0,1,2].map(i => <div key={i} className="h-[78px] bg-surface rounded-2xl animate-pulse" />)}
        {resources?.resumes.map((r) => (
          <a key={r.name} href={r.templateUrl} target="_blank" rel="noopener noreferrer" className="block bg-surface rounded-2xl p-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)] flex gap-3 items-start hover:shadow-md transition">
            <div className="w-11 h-14 rounded-md bg-gradient-to-br from-[var(--olo)]/20 to-[var(--navy)]/10 flex items-center justify-center text-[var(--olo)]">
              <I.FileText width={18} height={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-[13px] text-ink font-normal truncate">{r.name}</div>
                {r.tag && <span className="text-[9px] text-[var(--olo)] tracking-wider">{r.tag}</span>}
              </div>
              <div className="text-[11px] text-ink3 mt-0.5 font-light">{r.desc}</div>
              <span className="text-[11px] text-[var(--olo)] mt-1.5 inline-flex items-center gap-1">View template <I.ExternalLink width={10} height={10} /></span>
            </div>
          </a>
        ))}
      </div>

      <SecRow label="Interview Prep" />
      <div className="px-5 grid grid-cols-2 gap-2">
        {resources?.drills.map((b, idx) => (
          <button key={b.title} onClick={() => onOpenDrill(idx)} className={`bg-gradient-to-br ${themeMap[b.theme] || themeMap.navy} rounded-2xl p-4 text-left text-white aspect-square flex flex-col justify-between hover:scale-[1.02] transition`}>
            <div>
              <div className="text-[10px] tracking-[0.16em] uppercase opacity-70">{b.category}</div>
              <div className="text-[10px] tracking-[0.14em] uppercase opacity-50 mt-0.5">{b.questions.length} questions</div>
            </div>
            <div className="font-serif text-[19px] leading-tight">{b.title}</div>
          </button>
        ))}
      </div>

      {resources?.lexicon && resources.lexicon.length > 0 && (
        <>
          <SecRow label="Insider Lexicon" link="Open" onLink={onOpenLexicon} />
          <div className="px-5">
            <button onClick={onOpenLexicon} className="w-full bg-surface rounded-2xl shadow-[0_1px_5px_rgba(0,0,0,0.05)] overflow-hidden text-left active:scale-[0.99] transition">
              <div className="px-4 py-3 border-b border-black/[0.05] dark:border-white/10 flex items-center gap-2">
                <I.Sparkles width={11} height={11} className="text-[var(--olo)]" />
                <div className="text-[10px] tracking-[0.18em] uppercase text-ink3">What insiders know · {resources.lexicon.length} terms</div>
                <I.ArrowRight width={12} height={12} className="ml-auto text-[var(--olo)]" />
              </div>
              <div className="px-4 py-3 grid grid-cols-2 gap-2">
                {resources.lexicon.slice(0, 4).map((l, i) => (
                  <div key={i} className="rounded-xl bg-black/[0.025] dark:bg-white/[0.04] px-3 py-2 min-h-[58px]">
                    <div className="font-serif italic text-[13px] text-ink leading-snug line-clamp-2">{l.term}</div>
                    <div className="text-[10px] text-ink3 mt-1">Tap to unpack</div>
                  </div>
                ))}
              </div>
            </button>
          </div>
        </>
      )}

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
            <div className="mt-3 pt-3 border-t border-black/[0.05] dark:border-white/10 space-y-2.5">
              <p className="text-[12px] text-ink2 leading-relaxed font-light">{a.summary}</p>
              <div className="bg-[var(--olo)]/10 border-l-2 border-[var(--olo)] rounded-r-lg px-3 py-2">
                <div className="text-[9px] tracking-[0.16em] uppercase text-[var(--olo)] font-medium mb-1">Why it matters</div>
                <p className="text-[12px] text-ink leading-relaxed font-light">{a.whyItMatters}</p>
              </div>
              {a.articleUrl && (
                <a href={a.articleUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[var(--olo)] inline-flex items-center gap-1">Read sources <I.ExternalLink width={10} height={10} /></a>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export function LexiconDetail({ onBack }: { onBack: () => void }) {
  const { resources } = useMeridianData();
  const terms = resources?.lexicon || [];
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-6">
      <div className="flex items-center gap-3 px-5 pt-3 pb-2">
        <button onClick={onBack} className="w-9 h-9 rounded-md bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-ink2"><I.ChevronLeft width={16} height={16} /></button>
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-light">Resources</div>
          <div className="font-serif text-[22px] text-ink leading-tight font-light">Insider Lexicon</div>
        </div>
      </div>
      <div className="mx-5 mt-2 mb-3 rounded-2xl bg-[var(--olo)]/10 border border-[var(--olo)]/20 px-4 py-3">
        <div className="text-[10px] tracking-[0.18em] uppercase text-[var(--olo)] mb-1">Field nuance</div>
        <p className="text-[12.5px] text-ink2 leading-relaxed font-light">The shorthand, hidden rules, and interview cues that insiders expect you to understand.</p>
      </div>
      <div className="px-5 space-y-2.5">
        {terms.map((l, i) => (
          <div key={i} className="bg-surface rounded-2xl px-4 py-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)] border border-black/[0.04] dark:border-white/[0.06]">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[var(--olo)]/12 text-[var(--olo)] flex items-center justify-center text-[11px] flex-shrink-0">{i + 1}</div>
              <div className="min-w-0 flex-1">
                <div className="font-serif italic text-[17px] text-ink leading-snug">{l.term}</div>
                <p className="text-[12.5px] text-ink2 leading-relaxed font-light mt-1">{l.definition}</p>
                <div className="mt-2.5 border-l-2 border-[var(--olo)]/45 pl-3 text-[12px] text-ink3 leading-relaxed font-light">
                  <span className="text-[var(--olo)] text-[9px] uppercase tracking-[0.14em] mr-1.5">Why it matters</span>{l.whyItMatters}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IndustryBriefDetail({ onBack }: { onBack: () => void }) {
  const { resources } = useMeridianData();
  const b = resources?.industryBrief;
  if (!b) return (
    <div className="flex-1 flex items-center justify-center text-ink3 text-sm fade-in">
      <button onClick={onBack} className="underline">Brief unavailable — go back</button>
    </div>
  );
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in">
      <div className="relative h-[260px]">
        {b.image && <img src={b.image} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,15,30,0.2) 0%, rgba(10,15,30,0.7) 100%)" }} />
        <button onClick={onBack} className="absolute top-3 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white flex items-center justify-center"><I.ChevronLeft width={18} height={18} /></button>
        <div className="absolute bottom-4 left-5 right-5">
          <span className="inline-block text-[9px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white">Industry Brief</span>
          <div className="font-serif text-[26px] text-white leading-tight mt-2 font-light">{b.title}</div>
          <div className="text-[11px] text-white/70 mt-0.5 font-light">{b.subtitle}</div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        <div className="grid grid-cols-2 gap-2">
          <InfoTile icon={<I.Clock width={13} height={13} />} label="Timing" value={b.timing} />
          <InfoTile icon={<I.DollarSign width={13} height={13} />} label="Investment" value={b.investment} />
        </div>

        {b.whereYouAre && (
          <div className="bg-surface rounded-2xl px-4 py-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
            <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 mb-1.5">Where you are</div>
            <p className="text-[13px] text-ink2 leading-relaxed font-light">{b.whereYouAre}</p>
          </div>
        )}

        {b.whereYouAreGoing && (
          <div className="bg-[var(--navy)] rounded-2xl px-4 py-4 text-white">
            <div className="text-[10px] tracking-[0.18em] uppercase text-white/50 mb-1.5">Where you're going</div>
            <p className="text-[13px] text-white/90 leading-relaxed font-light">{b.whereYouAreGoing}</p>
          </div>
        )}

        {b.steps && b.steps.length > 0 && (
          <div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 mb-2.5 flex items-center gap-1.5"><I.Map width={11} height={11} /> The walkthrough</div>
            <div className="space-y-2.5 relative">
              <div className="absolute left-[14px] top-2 bottom-2 w-px bg-[var(--olo)]/25" />
              {b.steps.map((s) => (
                <div key={s.number} className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-[var(--olo)] text-white flex items-center justify-center text-[11px] font-medium">{s.number}</div>
                  <div className="bg-surface rounded-2xl px-4 py-3 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <div className="text-[13px] text-ink font-normal leading-snug">{s.title}</div>
                      <div className="text-[10px] tracking-wider text-[var(--olo)] flex-shrink-0">{s.timeframe}</div>
                    </div>
                    <p className="text-[12px] text-ink2 leading-relaxed font-light mb-1.5">{s.what}</p>
                    <p className="text-[11px] text-ink3 leading-relaxed font-light italic mb-2">Why · {s.why}</p>
                    <div className="bg-[var(--olo)]/10 rounded-md px-2.5 py-1.5 text-[11px] text-ink leading-snug font-light">
                      <span className="text-[var(--olo)] tracking-wide text-[9px] uppercase mr-1.5">Signal</span>{s.signal}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {b.marketContext && (
          <div className="bg-[var(--olo)]/10 border-l-2 border-[var(--olo)] rounded-r-xl px-4 py-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <I.Target width={12} height={12} className="text-[var(--olo)]" />
              <span className="text-[10px] tracking-[0.16em] uppercase text-[var(--olo)] font-medium">Market context · right now</span>
            </div>
            <p className="text-[13px] text-ink leading-relaxed font-light">{b.marketContext}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-surface rounded-2xl p-3 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
      <div className="text-[9px] uppercase tracking-[0.16em] text-ink3 flex items-center gap-1.5">{icon} {label}</div>
      <div className="text-[12px] text-ink mt-1 font-light leading-snug">{value}</div>
    </div>
  );
}

export function DrillDetail({ idx, onBack }: { idx: number; onBack: () => void }) {
  const { resources } = useMeridianData();
  const drill = resources?.drills[idx];
  if (!drill) return (
    <div className="flex-1 flex items-center justify-center text-ink3 text-sm fade-in">
      <button onClick={onBack} className="underline">Drill unavailable — go back</button>
    </div>
  );
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-6">
      <div className="flex items-center gap-3 px-5 pt-3 pb-2">
        <button onClick={onBack} className="w-9 h-9 rounded-md bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-ink2"><I.ChevronLeft width={16} height={16} /></button>
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-light">{drill.category} · {drill.questions.length} questions</div>
          <div className="font-serif text-[22px] text-ink leading-tight font-light">{drill.title}</div>
        </div>
      </div>

      <div className="px-5 space-y-2.5 mt-2">
        {drill.questions.map((q, i) => (
          <details key={i} className="bg-surface rounded-2xl p-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
            <summary className="cursor-pointer list-none flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-[var(--navy)] text-white flex-shrink-0 flex items-center justify-center text-[11px] font-light">{i + 1}</div>
              <div className="text-[13px] text-ink leading-snug font-light flex-1">{q}</div>
            </summary>
            <div className="mt-3 pt-3 border-t border-black/[0.05] dark:border-white/10 text-[11px] text-ink3 font-light">
              Practice out loud. Aim for a 60–90 second structured answer. Note where you stumble — that's the gap.
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// ─── ROADMAP ───
export function RoadmapScreen({ onOpenAction, onBack }: { onOpenAction: (id: number) => void; onBack: () => void }) {
  const { scoreData, scoreLoading } = useMeridianData();
  const actions = roadmapActions(scoreData);
  const projected = actions.slice(0, 3).reduce((sum, a) => sum + Number(a.pts || 0), 0);
  const completed = (scoreData?.strengths?.length ? scoreData.strengths : ["Uploaded resume for baseline calibration"]).slice(0, 3).map((title, i) => ({ title, pts: 4 + i * 2, when: i === 0 ? "baseline" : "profile signal" }));

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-6">
      <div className="flex items-center gap-3 px-5 pt-3 pb-2">
        <button onClick={onBack} className="w-9 h-9 rounded-md bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-ink2"><I.ChevronLeft width={16} height={16} /></button>
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-light">Your Plan</div>
          <div className="font-serif text-[22px] text-ink leading-tight font-light">Roadmap</div>
        </div>
      </div>

      <div className="mx-5 bg-gradient-to-br from-[var(--navy)] to-[var(--navy)]/90 rounded-3xl px-5 py-5 text-white relative overflow-hidden mb-3">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-[var(--olo)]/10 blur-2xl" />
        <div className="text-[10px] tracking-[0.2em] uppercase text-white/40">This Week</div>
        <div className="flex items-baseline gap-2 mt-1">
          <div className="font-serif text-[42px] font-light leading-none">+{projected || (scoreLoading ? "…" : 0)}</div>
          <div className="text-[12px] text-white/50 font-light">projected score gain</div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/10 rounded">
            <div className="h-full bg-[var(--olo)] rounded" style={{ width: `${Math.min(82, Math.max(18, projected * 2))}%` }} />
          </div>
          <div className="text-[11px] text-white/70 tabular-nums">{actions.length} live</div>
        </div>
      </div>

      <SecRow label="Up Next" />
      <div className="px-5 space-y-2">
        {actions.map((a, i) => (
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
          <div key={i} className="bg-surface/60 rounded-2xl px-4 py-3 flex gap-3 items-center border border-black/[0.04] dark:border-white/[0.06]">
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
  const { scoreData } = useMeridianData();
  const a = roadmapActions(scoreData)[id] || ACTIONS[id] || ACTIONS[0];
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-6">
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <button onClick={onBack} className="w-9 h-9 rounded-md bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-ink2"><I.ChevronLeft width={16} height={16} /></button>
        <span className="font-serif text-[17px] text-ink">Action Details</span>
        <button className="w-9 h-9 border border-black/[0.06] dark:border-white/10 rounded-md flex items-center justify-center text-ink2"><I.Bell width={15} height={15} /></button>
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
        <div className="h-[3px] bg-black/[0.06] dark:bg-white/10 rounded mt-3 overflow-hidden">
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
        <div className="bg-black/[0.03] dark:bg-white/[0.04] rounded-md px-3 py-2.5 text-[11px] text-ink3 font-light leading-relaxed mt-1">
          <span className="text-[var(--olo)] font-medium tracking-wide">TIP · </span>{a.tip}
        </div>
      </div>

      <div className="px-5 space-y-2">
        <button onClick={onBack} className="w-full bg-[var(--navy)] text-white py-3.5 rounded-2xl text-[12px] tracking-[0.1em] uppercase font-light">Mark as Complete</button>
        <button onClick={onBack} className="w-full border border-black/10 dark:border-white/10 py-3 rounded-2xl text-[11px] tracking-[0.07em] uppercase text-ink3 font-light">Snooze for Later</button>
      </div>
    </div>
  );
}

function Tag({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-md px-3 py-2.5">
      <div className="text-[9px] tracking-[0.12em] uppercase text-ink3">{label}</div>
      <div className="text-[12px] text-ink mt-0.5">{val}</div>
    </div>
  );
}
