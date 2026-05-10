import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { I, MeridianMark } from "./icons";
import type { OnboardingData } from "./Onboarding";
import { useMeridianData } from "./MeridianDataContext";
import { MeridianCompass } from "./MeridianCompass";

type StoryId = number;

export const STORIES = [
  { id: 0, tag: "Privacy & Data", headline: "D.C. Privacy Enforcement Roles Surge — Firms Racing to Staff Up", img: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=900&q=80&auto=format&fit=crop", source: "Politico Pro", age: "3h", badge: { dot: "var(--olo)", text: "+27% hiring" }, confirmedBy: ["Politico Pro", "Bloomberg Law", "The American Lawyer"], summary: "A coordinated push across boutique and AmLaw 50 firms to expand D.C. privacy enforcement teams.", impact: "Strengthens the privacy & investigations vector you are positioning into.", color: "from-[#0c447c]/10 to-[#0c447c]/5" },
  { id: 1, tag: "Regulatory", headline: "FTC Moves Forward on AI Data Rulemaking — Comment Period Opens", img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80&auto=format&fit=crop", source: "The American Lawyer", age: "6h", badge: { dot: "var(--olo)", text: "Watch closely" }, confirmedBy: ["FTC.gov", "The American Lawyer", "Reuters"], summary: "FTC has formally opened a comment period on AI data-collection rules.", impact: "Direct relevance to your target practice." },
  { id: 2, tag: "Lateral Hiring", headline: "Gibson Dunn & Latham Accelerate D.C. Investigations Buildout", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&auto=format&fit=crop", source: "Law360", age: "8h", badge: { dot: "#5DCAA5", text: "Opportunity" }, confirmedBy: ["Law360", "American Lawyer"], summary: "GD and Latham are running parallel hiring waves into their D.C. investigations groups.", impact: "Direct match for your target market." },
];

export const ACTIONS = [
  { id: 0, title: "Add a data privacy project to your experience", signal: "Privacy project", gap: "Technical Signals", pts: 12, impact: "High", time: "25 min", color: "#3B6D11", chip: "bg-[#EAF3DE] text-[#085041]", why: "Candidates with hands-on privacy projects are 2.3× more likely to be screened forward.", steps: ["Identify a privacy or data-related problem", "Build a brief 1–2 page case study", "Add to your resume", "Highlight in applications"], tip: "Projects with metrics drive the strongest signal." },
  { id: 1, title: "Draft a short take on FTC rulemaking", signal: "Thought leadership", gap: "Market Visibility", pts: 8, impact: "Medium", time: "20 min", color: "#C68B4E", chip: "bg-[#FFF3E8] text-[#8A5020]", why: "Associates who demonstrate regulatory commentary are 1.8× more likely to be interviewed.", steps: ["Choose a recent FTC action", "Draft 300–500 words", "Tag relevant practitioners", "Cross-post"], tip: "Publish within 48 hours of the news cycle." },
  { id: 2, title: "Request a referral intro at Gibson Dunn", signal: "Warm connection", gap: "Access & Network", pts: 10, impact: "High", time: "15 min", color: "#3B6D11", chip: "bg-[#EAF3DE] text-[#085041]", why: "Referral applications have a 3.1× higher callback rate than cold applications.", steps: ["Identify a 1st/2nd-degree connection at GD D.C.", "Send warm specific outreach", "Reference a specific matter", "Follow up in 5 days"], tip: "Name a specific attorney's work." },
];

function greetingFor(name: string) {
  const h = new Date().getHours();
  const time = h < 5 ? "burning the midnight oil" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 21 ? "Good evening" : "Up late";
  const teasers = [
    `${time}, ${name}.`,
    `${time}, ${name} — ready to move?`,
    `Hey ${name}.`,
    `${time}, ${name}. Markets don't wait.`,
  ];
  return teasers[(new Date().getDate()) % teasers.length];
}

export function BriefScreen({ user, dark, setDark, onOpenStory, onOpenRoadmap, onOpenChat, onOpenPosition }: { user: OnboardingData; dark: boolean; setDark: Dispatch<SetStateAction<boolean>>; onOpenStory: (id: StoryId) => void; onOpenRoadmap: () => void; onOpenChat: () => void; onOpenPosition: () => void; }) {
  const firstName = user.name || "Alex";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const [scrollIdx, setScrollIdx] = useState(0);
  const { stories, scoreData, scoreLoading } = useMeridianData();
  const carouselStories = stories.length ? stories : (STORIES as any);

  const hasScore = user.hasResume && scoreData;
  const scoreStr = hasScore ? String(scoreData!.score) : (scoreLoading ? "…" : "—");
  const scoreSub = hasScore ? scoreData!.percentile : (scoreLoading ? "Scoring" : user.hasResume ? "Calibrating" : "Locked");
  const trendStr = hasScore ? (scoreData!.trend >= 0 ? `+${scoreData!.trend}` : `${scoreData!.trend}`) : "—";
  const trendSub = hasScore ? scoreData!.trendLabel : "7-Day";
  const gapsStr = hasScore ? String(scoreData!.gapsCount) : "—";
  const gapsSub = hasScore ? scoreData!.gapsPriority : "Gaps";

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-2">
      {/* Header */}
      <div className="flex justify-between items-start px-5 pt-3 pb-2">
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-light">Daily Intelligence</div>
          <div className="font-serif text-[26px] text-ink leading-tight font-light tracking-tight">Morning Brief</div>
          <div className="text-[11px] text-ink3 mt-1 font-light">{today} · {user.target || "—"}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenChat} className="w-9 h-9 rounded-md bg-[var(--navy)] text-white flex items-center justify-center hover:opacity-90 transition" aria-label="Open Meridian AI">
            <MeridianMark size={14} accent />
          </button>
          <button onClick={() => setDark(d => !d)} className="w-9 h-9 border border-black/[0.06] dark:border-white/10 rounded-md flex items-center justify-center text-ink2 hover:bg-black/[0.03] dark:hover:bg-white/5 transition" aria-label="Toggle dark mode">
            {dark ? <I.Sun width={15} height={15} /> : <I.Moon width={15} height={15} />}
          </button>
          <button className="w-9 h-9 border border-black/[0.06] dark:border-white/10 rounded-md flex items-center justify-center text-ink2 relative">
            <I.Bell width={15} height={15} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#D85A30] rounded-full ring-2 ring-background" />
          </button>
        </div>
      </div>

      {/* Free greeting */}
      <div className="px-5 pt-4 pb-1">
        <h1 className="text-[34px] leading-[1.05] font-semibold tracking-tight text-ink" style={{ fontFamily: "var(--font-sans)" }}>
          {greetingFor(firstName)}
        </h1>
        <p className="text-[12.5px] text-ink2 mt-1 font-light">Here's where you stand today.</p>
      </div>

      {/* Floating compass — no container, just the widget */}
      <div className="pt-2 pb-1">
        <MeridianCompass
          onClick={onOpenPosition}
          locked={!user.hasResume}
          score={scoreStr}
          scoreSub={scoreSub}
          trend={trendStr}
          trendSub={trendSub}
          gaps={gapsStr}
          gapsSub={gapsSub}
        />
        {hasScore && scoreData!.summary && (
          <p className="px-7 text-center text-[11.5px] text-ink2 mt-1 font-light leading-relaxed max-w-[320px] mx-auto">{scoreData!.summary}</p>
        )}
      </div>

      {/* Stories */}
      <SecRow label="Market Intelligence" link="All stories" />
      <div
        className="px-5 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        onScroll={(e) => { const el = e.currentTarget; setScrollIdx(Math.min(carouselStories.length - 1, Math.round(el.scrollLeft / (el.scrollWidth / carouselStories.length)))); }}
      >
        {carouselStories.map((s: any) => (
          <button key={s.id} onClick={() => onOpenStory(s.id)} className="flex-shrink-0 w-[300px] h-[320px] rounded-2xl overflow-hidden relative snap-start text-left">
            <img src={s.img} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.04) 0%, rgba(0,0,0,.1) 25%, rgba(0,0,0,.6) 62%, rgba(0,0,0,.96) 100%)" }} />
            <div className="absolute top-3.5 right-3.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-2.5 py-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.badge.dot }} />
              <span className="text-[10px] text-white/85 tracking-wider">{s.badge.text}</span>
            </div>
            <div className="absolute top-3.5 left-3.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
              <I.CheckCircle width={9} height={9} className="text-emerald-300" />
              <span className="text-[9px] text-white/70 tracking-wider">{s.confirmedBy.length} sources</span>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-4 pb-5">
              <span className="inline-block text-[9px] tracking-[0.13em] uppercase px-2.5 py-1 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}>{s.tag}</span>
              <div className="font-serif italic text-[18px] text-white leading-snug mb-2">{s.headline}</div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white/60 tracking-wider">{s.source}</span>
                <span className="w-0.5 h-0.5 bg-white/30 rounded-full" />
                <span className="text-[10px] text-white/40">{s.age}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 pt-2.5">
        {carouselStories.map((_: any, i: number) => (
          <div key={i} className={`h-1 rounded transition-all ${i === scrollIdx ? "w-3.5 bg-[var(--olo)]" : "w-1 bg-black/15 dark:bg-white/15"}`} />
        ))}
      </div>

      <div className="px-5 pt-5 pb-2">
        <button onClick={onOpenRoadmap} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.1em] uppercase font-light hover:opacity-90 transition">
          View Full Roadmap
        </button>
      </div>
    </div>
  );
}

function TreasureMap({ actions, onOpenAction }: { actions: typeof ACTIONS; onOpenAction: (id: number) => void }) {
  // build path nodes
  const w = 220 * actions.length + 40;
  return (
    <div className="px-5">
      <div className="overflow-x-auto no-scrollbar -mx-5 px-5">
        <div className="relative" style={{ width: w, minWidth: "100%" }}>
          {/* Dashed treasure path */}
          <svg className="absolute inset-0 pointer-events-none" width={w} height="190" viewBox={`0 0 ${w} 190`}>
            <defs>
              <linearGradient id="trail" x1="0" x2="1">
                <stop offset="0" stopColor="var(--olo)" stopOpacity="0.85" />
                <stop offset="1" stopColor="var(--olo)" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <path
              d={actions.map((_, i) => {
                const x = 50 + i * 220;
                const y = i % 2 === 0 ? 95 : 70;
                return i === 0 ? `M ${x} ${y}` : `Q ${x - 110} ${y === 95 ? 30 : 140} ${x} ${y}`;
              }).join(" ")}
              fill="none"
              stroke="url(#trail)"
              strokeWidth="2"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
            {/* X marks the spot at end */}
            <g transform={`translate(${50 + actions.length * 220 - 30}, ${actions.length % 2 === 1 ? 60 : 85})`}>
              <circle r="14" fill="var(--olo)" opacity="0.15" />
              <text textAnchor="middle" dy="6" fontSize="20" fill="var(--olo)" fontFamily="serif" fontStyle="italic">★</text>
            </g>
          </svg>

          <div className="relative flex items-start" style={{ height: 190 }}>
            {actions.map((a, i) => {
              const top = i % 2 === 0 ? 60 : 35;
              return (
                <button
                  key={a.id}
                  onClick={() => onOpenAction(a.id)}
                  className="absolute flex flex-col items-center group"
                  style={{ left: 50 + i * 220 - 80, top: 0, width: 160 }}
                >
                  <div className="text-[9px] tracking-[0.18em] uppercase text-ink3 mb-1">Stop {i + 1}</div>
                  <div className="relative" style={{ marginTop: top - 24 }}>
                    <div className="absolute -inset-2 rounded-full bg-[var(--olo)]/15 blur-md group-active:bg-[var(--olo)]/30 transition" />
                    <div className="relative w-12 h-12 rounded-full flex items-center justify-center text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]" style={{ background: a.color }}>
                      {i === 0 && <I.FileText width={18} height={18} />}
                      {i === 1 && <I.Sparkles width={18} height={18} />}
                      {i === 2 && <I.Users width={18} height={18} />}
                    </div>
                    <div className="absolute -top-2 -right-3 bg-[var(--olo)] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full shadow">+{a.pts}</div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-[12px] text-ink leading-snug font-normal line-clamp-2 px-1">{a.title}</div>
                    <div className="text-[10px] text-ink3 mt-0.5 font-light">{a.time}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-ink3/80 tracking-wider text-center mt-1.5 font-light">↔ swipe the trail · tap a node to open</div>
    </div>
  );
}

export function SecRow({ label, link, onLink }: { label: string; link?: string; onLink?: () => void }) {
  return (
    <div className="flex justify-between items-center px-5 pt-4 pb-2">
      <span className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-normal">{label}</span>
      {link && <button onClick={onLink} className="text-[11px] text-[var(--olo)] tracking-wider hover:underline">{link}</button>}
    </div>
  );
}

// ─── POSITION SCREEN ───
export function PositionScreen({ user, onReposition, onUpdateResume, onBack }: { user: OnboardingData; onReposition: () => void; onUpdateResume: () => void; onBack: () => void }) {
  const { scoreData } = useMeridianData();
  const target = scoreData?.score ?? 0;
  const [score, setScore] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => { v = Math.min(v + 2, target); setScore(v); if (v >= target) clearInterval(t); }, 18);
    return () => clearInterval(t);
  }, [target]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-4">
      <div className="flex items-center gap-2 px-5 pt-3 pb-1">
        <button onClick={onBack} className="w-9 h-9 rounded-md bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-ink2"><I.ChevronLeft width={16} height={16} /></button>
        <div className="flex-1 text-center text-[10px] tracking-[0.22em] uppercase text-ink3">Position</div>
        <button onClick={onUpdateResume} className="text-[10px] tracking-[0.14em] uppercase text-[var(--olo)] hover:underline">Resume</button>
      </div>
      <div className="flex justify-between items-start px-5 pt-2 pb-2">
        <div className="relative">
          <div className="text-[10px] tracking-[0.16em] uppercase text-ink3 font-light">Positioning for</div>
          <button onClick={() => setMenuOpen(o => !o)} className="font-serif text-[22px] text-ink mt-0.5 flex items-center gap-1.5 font-light text-left">
            {user.target || "—"}
            <I.ChevronDown width={14} height={14} className={`text-ink3 transition ${menuOpen ? "rotate-180" : ""}`} />
          </button>
          <div className="text-[10px] text-ink3 mt-0.5 font-light tracking-wide">Updated 7:41 AM · 4,281 comparables</div>
          {menuOpen && (
            <div className="absolute top-full left-0 mt-2 z-20 bg-surface rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-black/[0.05] dark:border-white/10 w-[280px] p-2">
              <div className="px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-ink3">Current target</div>
              <div className="px-3 pb-2 text-[13px] text-ink font-light">{user.target}</div>
              {user.niche && <div className="px-3 pb-2 text-[11px] text-ink3 font-light border-b border-black/[0.05] dark:border-white/10">Niche · {user.niche}</div>}
              <button onClick={() => { setMenuOpen(false); onReposition(); }} className="w-full text-left px-3 py-3 mt-1 rounded-xl bg-[var(--olo)]/10 hover:bg-[var(--olo)]/15 transition flex items-center gap-2.5">
                <I.Sparkles width={14} height={14} className="text-[var(--olo)]" />
                <div>
                  <div className="text-[13px] text-ink font-normal">Change careers</div>
                  <div className="text-[10px] text-ink3 font-light">Recalibrate score, gaps, alerts</div>
                </div>
              </button>
              <button onClick={() => setMenuOpen(false)} className="w-full text-left px-3 py-2.5 mt-1 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/5 text-[12px] text-ink2 font-light">Refine target & niche</button>
            </div>
          )}
        </div>
        <button className="w-9 h-9 border border-black/[0.06] dark:border-white/10 rounded-md flex items-center justify-center text-ink2"><I.Search width={15} height={15} /></button>
      </div>

      <SecRow label="Your Market Position" link="See all" />

      <div className="mx-5 bg-[var(--navy)] rounded-3xl px-6 py-6 relative overflow-hidden">
        <svg viewBox="0 0 64 80" width="200" height="320" className="absolute right-[-30px] top-1/2 -translate-y-1/2 pointer-events-none">
          <line x1="32" y1="4" x2="32" y2="76" stroke="white" strokeWidth=".7" opacity=".06"/>
          <circle cx="32" cy="40" r="24" stroke="white" strokeWidth=".7" fill="none" opacity=".06"/>
        </svg>
        <div className="text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2.5">Positioning Score</div>
        <div className="font-serif text-[88px] font-light text-white leading-[0.9] tracking-tight tabular-nums">{score}</div>
        <div className="flex items-center gap-3.5 mt-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 bg-[var(--olo-dim)] border border-[var(--olo)]/30 rounded-full px-2.5 py-1">
            <I.TrendUp width={10} height={10} className="text-[var(--olo)]" />
            <span className="text-[11px] text-[var(--olo)] tracking-wide">{scoreData?.percentile || "—"}</span>
          </div>
          <svg width="84" height="28" viewBox="0 0 84 28">
            <polyline points="0,24 14,18 28,21 42,11 56,7 70,3 84,1" fill="none" stroke="rgba(198,139,78,.45)" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="84" cy="1" r="2.5" fill="var(--olo)" opacity=".7" />
          </svg>
        </div>
        <div className="text-[11px] text-white/40 mt-1.5 font-light leading-relaxed">Among {user.current || "early-career"} targeting {user.target || "your market"}</div>
        {scoreData?.summary && (
          <div className="text-[12px] text-white/70 mt-3 font-light leading-relaxed">{scoreData.summary}</div>
        )}
        {user.employers.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3.5 flex-wrap">
            <span className="text-[10px] text-white/30 tracking-wider">Watching</span>
            {user.employers.slice(0, 5).map((f) => (
              <span key={f} className="text-[10px] text-white/55 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">{f}</span>
            ))}
            {user.employers.length > 5 && <span className="text-[10px] text-white/40">+{user.employers.length - 5}</span>}
          </div>
        )}
      </div>

      {scoreData?.strengths?.length ? (
        <>
          <SecRow label="What's working" />
          <div className="px-5 space-y-1.5">
            {scoreData.strengths.map((s, i) => (
              <div key={i} className="flex gap-2 text-[12.5px] text-ink2 font-light"><I.Check width={13} height={13} className="text-emerald-600 mt-0.5 flex-shrink-0" />{s}</div>
            ))}
          </div>
        </>
      ) : null}

      <SecRow label="Gaps Snapshot" link="See all" />
      <div className="space-y-2 px-5">
        {scoreData?.gaps?.length
          ? scoreData.gaps.map((g, i) => (
              <GapCard key={i} icon={<I.Target width={13} height={13} />} title={g.title} pts={g.severity} sub={g.why + " · " + g.nextAction} w={g.severity === "Critical" ? 80 : g.severity === "High" ? 60 : 40} />
            ))
          : <div className="text-[12px] text-ink3 font-light px-1">{user.hasResume ? "Calibrating gaps…" : "Upload your resume to see gaps."}</div>}
      </div>
    </div>
  );
}

function GapCard({ icon, title, pts, sub, w }: any) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(w), 300); return () => clearTimeout(t); }, [w]);
  return (
    <div className="bg-surface rounded-2xl px-4 py-3.5 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-ink3">{icon}</span>
        <span className="text-[13px] text-ink">{title}</span>
        <span className="ml-auto text-[11px] text-[var(--olo)] tracking-wide">Gap closes {pts} pts</span>
      </div>
      <div className="text-[11px] text-ink3 mb-2.5 font-light">{sub}</div>
      <div className="h-[3px] bg-black/[0.06] dark:bg-white/10 rounded overflow-hidden">
        <div className="h-full bg-[var(--olo)] transition-all duration-[1400ms] ease-out" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
