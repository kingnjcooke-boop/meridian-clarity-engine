import { I } from "./icons";
import { ACTIONS, SecRow } from "./screens-core";
import { useMeridianData, scalePts } from "./MeridianDataContext";
import type { ScoreData } from "./MeridianDataContext";

const themeMap: Record<string, string> = {
  navy: "from-[var(--navy)] to-[var(--navy)]/80",
  olo: "from-[var(--olo)]/90 to-[var(--olo)]/70",
  emerald: "from-emerald-700 to-emerald-600",
  blue: "from-[#185FA5] to-[#2978c8]",
};

const TEMPLATE_HOSTS = /^(https?:\/\/)?(www\.)?(canva\.com|novoresume\.com|resume\.io|zety\.com|resumegenius\.com|standardresume\.co|enhancv\.com|kickresume\.com|overleaf\.com|hloom\.com|resumeworded\.com|harvard\.edu|teal\.com|tealhq\.com)/i;
const KNOWN_TEMPLATES = [
  "https://www.canva.com/resumes/templates/",
  "https://novoresume.com/resume-templates",
  "https://resume.io/resume-templates",
  "https://zety.com/resume-templates",
  "https://www.overleaf.com/gallery/tags/cv",
];
function ensureTemplateUrl(url: string | undefined, name: string): string {
  const u = String(url || "").trim();
  if (u && TEMPLATE_HOSTS.test(u) && /^https?:\/\//.test(u)) return u;
  // deterministic fallback by name hash so each card maps to a stable known-good URL
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return KNOWN_TEMPLATES[h % KNOWN_TEMPLATES.length];
}

export function ResourcesScreen({ onOpenIndustryBrief, onOpenDrill, onOpenLexicon }: { onOpenIndustryBrief: () => void; onOpenDrill: (idx: number) => void; onOpenLexicon: () => void }) {
  const { resources, resourcesLoading, resourcesError, refreshResources } = useMeridianData();
  const brief = resources?.industryBrief;
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-6">
      {/* Masthead — editorial */}
      <div className="px-5 pt-5 pb-3 flex items-end justify-between border-b border-black/[0.06] dark:border-white/10">
        <div>
          <div className="text-[9.5px] tracking-[0.3em] uppercase text-ink3 font-light">Vol. 01 · {today}</div>
          <div className="font-serif text-[40px] text-ink leading-[0.95] font-light tracking-tight mt-1">Resources</div>
        </div>
        <button onClick={refreshResources} className="text-[9.5px] text-ink3 tracking-[0.22em] uppercase hover:text-[var(--olo)] transition pb-1.5">Refresh</button>
      </div>

      {resourcesError && (
        <div className="mx-5 mt-3 text-[11px] text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{resourcesError}</div>
      )}

      {/* INDUSTRY BRIEF — full-bleed editorial cover */}
      <div className="px-5 pt-5 pb-2">
        {resourcesLoading && !brief && <div className="h-[320px] bg-surface rounded-3xl animate-pulse" />}
        {brief && (
          <button onClick={onOpenIndustryBrief} className="w-full text-left rounded-[28px] overflow-hidden relative shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] active:scale-[0.99] transition-transform" style={{ height: 360 }}>
            {brief.image && <img src={brief.image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />}
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,15,30,0.15) 0%, rgba(10,15,30,0.5) 55%, rgba(10,15,30,0.96) 100%)" }} />

            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/20" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(14px)" }}>
                <I.Sparkles width={10} height={10} className="text-[var(--olo)]" />
                <span className="text-[9px] tracking-[0.22em] uppercase text-white/95 font-light">Brief</span>
              </div>
              <span className="text-[9px] tracking-[0.22em] uppercase text-white/70">This week</span>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-6">
              <div className="font-serif text-[32px] text-white leading-[1.02] font-light tracking-tight">{brief.title}</div>
              <div className="text-[11.5px] text-white/65 font-light mt-2 line-clamp-1">{brief.subtitle}</div>
              <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                <div className="flex items-center gap-3 text-white/75 text-[10px] tracking-[0.14em] uppercase">
                  <span>{(brief.steps?.length ?? 0)} steps</span>
                  <span className="w-px h-2.5 bg-white/25" />
                  <span>{brief.timing}</span>
                </div>
                <span className="text-[var(--olo)] inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase">Read <I.ArrowRight width={11} height={11} /></span>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* RESUME TEMPLATES — editorial list with serial numbers */}
      <SectionHeader index="01" label="Resume Templates" />
      <div className="px-5">
        {resourcesLoading && !resources && [0,1,2].map(i => <div key={i} className="h-[64px] bg-surface rounded-none animate-pulse mb-px" />)}
        <div className="divide-y divide-black/[0.07] dark:divide-white/[0.08] border-y border-black/[0.07] dark:border-white/[0.08]">
          {resources?.resumes.map((r, i) => (
            <a
              key={r.name}
              href={ensureTemplateUrl(r.templateUrl, r.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 items-center py-4 group hover:bg-black/[0.015] dark:hover:bg-white/[0.02] transition px-1"
            >
              <span className="text-[10px] tracking-[0.22em] uppercase text-ink3/60 font-light tabular-nums w-6">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-[17px] text-ink font-light leading-tight truncate">{r.name}</div>
                <div className="text-[11px] text-ink3 mt-0.5 font-light line-clamp-1">{r.desc}</div>
              </div>
              {r.tag && <span className="text-[9px] text-[var(--olo)] tracking-[0.18em] uppercase font-light hidden sm:inline">{r.tag}</span>}
              <I.ExternalLink width={13} height={13} className="text-ink3 group-hover:text-[var(--olo)] transition flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* INTERVIEW PREP — monochrome quilted grid */}
      <SectionHeader index="02" label="Interview Prep" />
      <div className="px-5 grid grid-cols-2 gap-2.5">
        {resources?.drills.map((b, idx) => (
          <button
            key={b.title}
            onClick={() => onOpenDrill(idx)}
            className="group relative aspect-square rounded-2xl overflow-hidden text-left p-4 flex flex-col justify-between transition active:scale-[0.98]"
            style={{
              background: idx % 2 === 0
                ? "linear-gradient(155deg, var(--navy), color-mix(in oklab, var(--navy) 80%, black))"
                : "linear-gradient(155deg, oklch(0.22 0.02 250), oklch(0.16 0.02 250))",
            }}
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[var(--olo)]/15 blur-2xl opacity-0 group-hover:opacity-100 transition" />
            <div className="relative">
              <div className="text-[9px] tracking-[0.22em] uppercase text-white/55 font-light">{b.category}</div>
              <div className="text-[9px] tracking-[0.18em] uppercase text-white/35 mt-0.5">{b.questions.length} questions</div>
            </div>
            <div className="relative font-serif text-[20px] text-white leading-[1.05] font-light tracking-tight">{b.title}</div>
          </button>
        ))}
      </div>

      {/* LEXICON — refined bento */}
      {resources?.lexicon && resources.lexicon.length > 0 && (
        <>
          <SectionHeader index="03" label="Insider Lexicon" link="Open" onLink={onOpenLexicon} />
          <div className="px-5">
            <button onClick={onOpenLexicon} className="w-full text-left active:scale-[0.99] transition">
              <div className="grid grid-cols-2 gap-2">
                {resources.lexicon.slice(0, 4).map((l, i) => (
                  <div key={i} className="rounded-2xl bg-surface border border-black/[0.05] dark:border-white/[0.06] px-3.5 py-3 min-h-[78px] flex flex-col justify-between">
                    <div className="font-serif italic text-[14px] text-ink leading-snug line-clamp-2 font-light">{l.term}</div>
                    <div className="text-[9px] tracking-[0.2em] uppercase text-[var(--olo)] mt-2 font-light">Unpack</div>
                  </div>
                ))}
              </div>
            </button>
          </div>
        </>
      )}

      {/* ARTICLES — editorial list */}
      <SectionHeader index="04" label="Reading List" />
      <div className="px-5 divide-y divide-black/[0.07] dark:divide-white/[0.08] border-y border-black/[0.07] dark:border-white/[0.08]">
        {resources?.articles.map((a) => (
          <details key={a.title} className="group py-4">
            <summary className="cursor-pointer list-none flex items-baseline gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-serif italic text-[16px] text-ink leading-snug font-light">{a.title}</div>
                <div className="flex items-center gap-2 text-[10px] text-ink3 font-light mt-1 tracking-wide">
                  <span>{a.source}</span>
                  <span className="w-px h-2.5 bg-black/15 dark:bg-white/15" />
                  <span>{a.readTime}</span>
                </div>
              </div>
              <I.ChevronDown width={12} height={12} className="text-ink3 group-open:rotate-180 transition flex-shrink-0" />
            </summary>
            <div className="mt-3 pl-0 space-y-2.5">
              <p className="text-[12.5px] text-ink2 leading-relaxed font-light">{a.summary}</p>
              <div className="border-l border-[var(--olo)] pl-3">
                <div className="text-[9px] tracking-[0.2em] uppercase text-[var(--olo)] font-medium mb-1">Why it matters</div>
                <p className="text-[12.5px] text-ink leading-relaxed font-light">{a.whyItMatters}</p>
              </div>
              {a.articleUrl && (
                <a href={a.articleUrl} target="_blank" rel="noopener noreferrer" className="text-[10.5px] text-[var(--olo)] inline-flex items-center gap-1 tracking-[0.14em] uppercase">Sources <I.ExternalLink width={10} height={10} /></a>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ index, label, link, onLink }: { index: string; label: string; link?: string; onLink?: () => void }) {
  return (
    <div className="flex items-end justify-between px-5 pt-8 pb-3">
      <div className="flex items-baseline gap-3">
        <span className="text-[9.5px] tracking-[0.28em] uppercase text-ink3/70 font-light tabular-nums">{index}</span>
        <span className="font-serif text-[18px] text-ink font-light leading-none">{label}</span>
      </div>
      {link && <button onClick={onLink} className="text-[9.5px] tracking-[0.22em] uppercase text-[var(--olo)] hover:underline">{link}</button>}
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
            <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 mb-1.5">Now</div>
            <p className="text-[13px] text-ink2 leading-relaxed font-light line-clamp-3">{b.whereYouAre}</p>
          </div>
        )}

        {b.whereYouAreGoing && (
          <div className="bg-[var(--navy)] rounded-2xl px-4 py-4 text-white">
            <div className="text-[10px] tracking-[0.18em] uppercase text-white/50 mb-1.5">Next</div>
            <p className="text-[13px] text-white/90 leading-relaxed font-light line-clamp-3">{b.whereYouAreGoing}</p>
          </div>
        )}

        {b.steps && b.steps.length > 0 && (
          <div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 mb-2.5 flex items-center gap-1.5"><I.Map width={11} height={11} /> Path</div>
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
                    <p className="text-[12px] text-ink2 leading-relaxed font-light mb-1.5 line-clamp-3">{s.what}</p>
                    <p className="text-[11px] text-ink3 leading-relaxed font-light italic mb-2 line-clamp-2">Why · {s.why}</p>
                    <div className="bg-[var(--olo)]/10 rounded-md px-2.5 py-1.5 text-[11px] text-ink leading-snug font-light line-clamp-2">
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
              <span className="text-[10px] tracking-[0.16em] uppercase text-[var(--olo)] font-medium">Market</span>
            </div>
            <p className="text-[13px] text-ink leading-relaxed font-light line-clamp-3">{b.marketContext}</p>
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

type RoadmapAction = typeof ACTIONS[number];

function roadmapActions(scoreData?: ScoreData | null): RoadmapAction[] {
  if (!scoreData?.roadmap?.length) return ACTIONS;
  return scoreData.roadmap.map((a, i) => ({
    id: i,
    title: a.title,
    signal: a.signal,
    gap: a.gap,
    pts: scalePts(Math.max(4, Math.min(15, Math.round(Number(a.pts) || 8))), scoreData?.score),
    impact: i === 0 ? "High" : i < 3 ? "Medium" : "Focused",
    time: a.time,
    color: i % 3 === 1 ? "#C68B4E" : i % 3 === 2 ? "#185FA5" : "#3B6D11",
    chip: "bg-[var(--olo)]/10 text-[var(--olo)]",
    why: a.why,
    steps: a.steps?.length ? a.steps : [a.title, "Turn it into a resume-visible signal", "Use it in targeted outreach"],
    tip: a.tip,
  }));
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
