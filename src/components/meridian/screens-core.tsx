import { useEffect, useState } from "react";
import { I, MeridianMark } from "./icons";
import type { OnboardingData } from "./Onboarding";
import { useMeridianData } from "./MeridianDataContext";

type StoryId = number;

export const STORIES = [
  {
    id: 0,
    tag: "Privacy & Data",
    headline: "D.C. Privacy Enforcement Roles Surge 27% — Firms Racing to Staff Up",
    img: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=900&q=80&auto=format&fit=crop",
    source: "Politico Pro",
    age: "3h",
    badge: { dot: "var(--olo)", text: "+27% hiring" },
    confirmedBy: ["Politico Pro", "Bloomberg Law", "The American Lawyer"],
    summary: "A coordinated push across boutique and AmLaw 50 firms to expand D.C. privacy enforcement teams, driven by FTC and state-AG activity. Three independent reports describe net-new headcount of 80+ across the region in Q1.",
    impact: "Strengthens the privacy & investigations vector you are positioning into. Your Technical Signals gap closes faster if you ship a privacy project this week.",
    color: "from-[#0c447c]/10 to-[#0c447c]/5",
  },
  {
    id: 1,
    tag: "Regulatory",
    headline: "FTC Moves Forward on Sweeping AI Data Rulemaking — Comment Period Opens",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80&auto=format&fit=crop",
    source: "The American Lawyer",
    age: "6h",
    badge: { dot: "var(--olo)", text: "Watch closely" },
    confirmedBy: ["FTC.gov", "The American Lawyer", "Reuters", "Law360"],
    summary: "FTC has formally opened a comment period on AI data-collection rules. Major firms are mobilizing comment teams. Junior associates with prior privacy experience are being pulled in.",
    impact: "Direct relevance to your target practice. A short public take in the next 48 hours raises Market Visibility +8.",
  },
  {
    id: 2,
    tag: "Lateral Hiring",
    headline: "Gibson Dunn & Latham Accelerate D.C. Investigations Buildout for 2025",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&auto=format&fit=crop",
    source: "Law360",
    age: "8h",
    badge: { dot: "#5DCAA5", text: "Opportunity" },
    confirmedBy: ["Law360", "American Lawyer", "Above the Law"],
    summary: "GD and Latham are running parallel hiring waves into their D.C. investigations groups. Three lateral partners hired in the past month. Associate pipeline expanding.",
    impact: "Direct match for your target market. Warm referral now is high-leverage.",
  },
];

export const ACTIONS = [
  { id: 0, title: "Add a data privacy project to your experience", signal: "Privacy project", gap: "Technical Signals", pts: 12, impact: "High", time: "25 min", color: "#3B6D11", chip: "bg-[#EAF3DE] text-[#085041]", why: "Candidates with hands-on privacy projects are 2.3× more likely to be screened forward in D.C. regulatory roles.", steps: ["Identify a privacy or data-related problem you have analyzed", "Build a brief 1–2 page case study", "Add to your resume as a project with measurable impact", "Highlight in applications and interviews"], tip: "Projects with metrics and outcomes drive the strongest signal." },
  { id: 1, title: "Draft a short take on FTC rulemaking", signal: "Thought leadership", gap: "Market Visibility", pts: 8, impact: "Medium", time: "20 min", color: "#C68B4E", chip: "bg-[#FFF3E8] text-[#8A5020]", why: "Associates who demonstrate regulatory commentary are 1.8× more likely to be interviewed at enforcement-focused practices.", steps: ["Choose a recent FTC rulemaking or enforcement action", "Draft a 300–500 word analysis", "Tag relevant practitioners and firms", "Cross-post to your law school network"], tip: "Timeliness matters — publish within 48 hours of the news cycle." },
  { id: 2, title: "Request a referral intro at Gibson Dunn", signal: "Warm connection", gap: "Access & Network", pts: 10, impact: "High", time: "15 min", color: "#3B6D11", chip: "bg-[#EAF3DE] text-[#085041]", why: "Referral applications at Gibson Dunn D.C. have a 3.1× higher callback rate than cold applications.", steps: ["Identify a 1st or 2nd-degree connection at GD D.C.", "Send a warm, specific outreach", "Reference a specific practice area or matter", "Follow up within 5 days if no response"], tip: "Name a specific attorney's work. Generic outreach is filtered out." },
];

export function BriefScreen({ user, onOpenAction, onOpenStory, onOpenRoadmap }: { user: OnboardingData; onOpenAction: (id: number) => void; onOpenStory: (id: StoryId) => void; onOpenRoadmap: () => void; }) {
  const firstName = user.name || "Alex";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const [scrollIdx, setScrollIdx] = useState(0);
  const { stories } = useMeridianData();
  const carouselStories = stories.length ? stories : (STORIES as any);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in">
      {/* Header */}
      <div className="flex justify-between items-start px-5 pt-3 pb-2">
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-light">Daily Intelligence</div>
          <div className="font-serif text-[26px] text-ink leading-tight font-light tracking-tight">Morning Brief</div>
          <div className="text-[11px] text-ink3 mt-1 font-light">{today} · {user.target || "D.C. Regulatory"}</div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--olo)]">Meridian</span>
          <button className="w-9 h-9 border border-black/[0.06] rounded-md flex items-center justify-center text-ink2 hover:bg-black/[0.03] relative">
            <I.Bell width={15} height={15} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#D85A30] rounded-full ring-2 ring-background" />
          </button>
        </div>
      </div>

      {/* Greeting + stats */}
      <div className="mx-5 mt-2 bg-surface rounded-2xl px-4 py-3.5 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2.5 mb-3">
          <I.Sun width={18} height={18} className="text-[var(--olo)]" />
          <div>
            <div className="text-[14px] text-ink font-normal">Good morning, {firstName}.</div>
            <div className="text-[11px] text-ink3 font-light">Here's your positioning snapshot.</div>
          </div>
        </div>
        <div className="flex border-t border-black/[0.06] pt-3">
          <Stat n="81" label="Score" sub="Top 14%" subColor="text-ink3" nColor="text-[#185FA5]" />
          <Divider />
          <Stat n="+6" label="7-Day" sub="Improving" subColor="text-[#0F6E56]" nColor="text-[#0F6E56]" />
          <Divider />
          <Stat n="2" label="Active Gaps" sub="High Priority" subColor="text-[var(--olo)]" nColor="text-[var(--olo)]" />
        </div>
      </div>

      {/* Stories */}
      <SecRow label="Market Intelligence" link="All stories" />
      <div
        className="px-5 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        onScroll={(e) => {
          const el = e.currentTarget;
          setScrollIdx(Math.min(STORIES.length - 1, Math.round(el.scrollLeft / (el.scrollWidth / STORIES.length))));
        }}
      >
        {STORIES.map(s => (
          <button key={s.id} onClick={() => onOpenStory(s.id)} className="flex-shrink-0 w-[300px] h-[320px] rounded-2xl overflow-hidden relative snap-start text-left">
            <img src={s.img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
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
        {STORIES.map((_, i) => (
          <div key={i} className={`h-1 rounded transition-all ${i === scrollIdx ? "w-3.5 bg-[var(--olo)]" : "w-1 bg-black/15"}`} />
        ))}
      </div>

      {/* Top actions */}
      <SecRow label="Top 3 Actions Today" link="See full plan" onLink={onOpenRoadmap} />
      <div className="space-y-2 px-5">
        {ACTIONS.map((a) => (
          <button key={a.id} onClick={() => onOpenAction(a.id)} className="w-full bg-surface rounded-2xl px-3.5 py-3 flex gap-3 items-start text-left shadow-[0_1px_5px_rgba(0,0,0,0.05)] border-l-2 active:scale-[0.99] transition" style={{ borderLeftColor: a.color }}>
            <div className="w-9 h-9 rounded-md bg-black/[0.04] flex items-center justify-center flex-shrink-0 text-ink3">
              {a.id === 0 && <I.FileText width={16} height={16} />}
              {a.id === 1 && <I.Sparkles width={16} height={16} />}
              {a.id === 2 && <I.Users width={16} height={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-ink leading-snug font-normal">{a.title}</div>
              <div className="text-[11px] text-ink3 mt-0.5 font-light">Signal: {a.signal} · Gap: {a.gap}</div>
              <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full mt-1.5 font-normal ${a.chip}`}>{a.time} · {a.impact} Impact</span>
            </div>
            <div className="font-serif text-[18px]" style={{ color: a.color }}>+{a.pts}</div>
          </button>
        ))}
      </div>

      <div className="px-5 py-4">
        <button onClick={onOpenRoadmap} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.1em] uppercase font-light hover:opacity-90 transition">
          View Full Roadmap
        </button>
      </div>
    </div>
  );
}

function Stat({ n, label, sub, nColor, subColor }: any) {
  return (
    <div className="flex-1 text-center">
      <div className={`font-serif text-[28px] font-normal ${nColor}`}>{n}</div>
      <div className="text-[10px] text-ink3 font-light tracking-wider mt-0.5">{label}</div>
      <div className={`text-[10px] mt-0.5 tracking-wider ${subColor}`}>{sub}</div>
    </div>
  );
}
const Divider = () => <div className="w-px bg-black/[0.06]" />;

function SecRow({ label, link, onLink }: { label: string; link?: string; onLink?: () => void }) {
  return (
    <div className="flex justify-between items-center px-5 pt-4 pb-2">
      <span className="text-[10px] tracking-[0.18em] uppercase text-ink3 font-normal">{label}</span>
      {link && <button onClick={onLink} className="text-[11px] text-[var(--olo)] tracking-wider hover:underline">{link}</button>}
    </div>
  );
}

export { SecRow };

// ─── POSITION SCREEN ───
export function PositionScreen({ user }: { user: OnboardingData }) {
  const [score, setScore] = useState(0);
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => { v = Math.min(v + 2, 81); setScore(v); if (v >= 81) clearInterval(t); }, 18);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar fade-in pb-4">
      <div className="flex justify-between items-start px-5 pt-3 pb-2">
        <div>
          <div className="text-[10px] tracking-[0.16em] uppercase text-ink3 font-light">Positioning for</div>
          <div className="font-serif text-[22px] text-ink mt-0.5 flex items-center gap-1 font-light">
            {user.target || "D.C. Regulatory & Litigation"} <I.ChevronDown width={12} height={12} className="text-ink3" />
          </div>
          <div className="text-[10px] text-ink3 mt-0.5 font-light tracking-wide">Updated 7:41 AM · 4,281 comparables</div>
        </div>
        <button className="w-9 h-9 border border-black/[0.06] rounded-md flex items-center justify-center text-ink2"><I.Search width={15} height={15} /></button>
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
            <span className="text-[11px] text-[var(--olo)] tracking-wide">Top 14%</span>
          </div>
          <svg width="84" height="28" viewBox="0 0 84 28">
            <polyline points="0,24 14,18 28,21 42,11 56,7 70,3 84,1" fill="none" stroke="rgba(198,139,78,.45)" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="84" cy="1" r="2.5" fill="var(--olo)" opacity=".7" />
          </svg>
        </div>
        <div className="text-[11px] text-white/40 mt-1.5 font-light leading-relaxed">Among 1Ls targeting D.C. regulatory pathways</div>
        <div className="flex items-center gap-1.5 mt-2">
          <I.ArrowUp width={10} height={10} className="text-[var(--olo)]/75" />
          <span className="text-[11px] text-[var(--olo)]/80 tracking-wide">Market Momentum · Strengthening</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3.5">
          <span className="text-[10px] text-white/30 tracking-wider">Top placements</span>
          {["W", "S", "GD", "L&M", "+6"].map((f, i) => (
            <div key={i} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-[9px] text-white/45 bg-white/5">{f}</div>
          ))}
        </div>
        <div className="flex mt-4 pt-3.5 border-t border-white/[0.07]">
          <div className="flex-1">
            <div className="text-[9px] uppercase tracking-[0.16em] text-white/30">Hiring Climate</div>
            <div className="text-[12px] text-white/60 mt-0.5 font-light">Privacy & investigations ↑</div>
          </div>
          <div className="flex-1 pl-4 ml-4 border-l border-white/[0.07]">
            <div className="text-[9px] uppercase tracking-[0.16em] text-white/30">Opportunity Window</div>
            <div className="text-[12px] text-white/60 mt-0.5 font-light">Now – Early Summer</div>
          </div>
        </div>
      </div>

      <SecRow label="Gaps Snapshot" link="See all" />
      <div className="space-y-2 px-5">
        <GapCard icon={<I.FileText width={13} height={13} />} title="Experience Depth" pts="+18" sub="Need 1 more high-impact regulatory matter" w={72} />
        <GapCard icon={<I.Radio width={13} height={13} />} title="Technical Signals" pts="+12" sub="Add data privacy project to strengthen" w={50} />
        <GapCard icon={<I.Users width={13} height={13} />} title="Access & Network" pts="+10" sub="Warm intro at GD D.C. would unlock referral" w={38} />
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
      <div className="h-[3px] bg-black/[0.06] rounded overflow-hidden">
        <div className="h-full bg-[var(--olo)] transition-all duration-[1400ms] ease-out" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
