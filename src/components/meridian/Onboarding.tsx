import { useEffect, useState } from "react";
import { MeridianMark, I } from "./icons";
import { supabase } from "@/integrations/supabase/client";

export type OnboardingData = {
  mode: "signup" | "signin";
  name: string;
  email: string;
  industry: string;
  niche: string;
  current: string;
  target: string;
  employers: string[];
  hasResume?: boolean;
  resumeName?: string;
  resumeText?: string;
};

const INDUSTRIES = [
  "Law",
  "Investment Banking",
  "Private Equity / VC",
  "Management Consulting",
  "Hedge Funds / Asset Management",
  "Tech — Product",
  "Tech — Engineering",
  "Data Science / ML",
  "Cybersecurity",
  "Public Policy / Government",
  "Medicine / Healthcare",
  "Biotech / Pharma",
  "Energy / Climate",
  "Aerospace / Defense",
  "Media / Journalism",
  "Marketing / Brand",
  "Design / Creative",
  "Architecture / Real Estate",
  "Education / Academia",
  "Nonprofit / Social Impact",
  "Operations / Supply Chain",
  "Sales / Business Dev",
];

const STAGES = [
  "Undergraduate",
  "Graduate / Professional Student",
  "Early Analyst (0–2y)",
  "Associate (2–5y)",
  "Mid-career (5–10y)",
  "Career Switcher",
];

export function Onboarding({ onDone }: { onDone: (d: OnboardingData) => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    mode: "signup", name: "", email: "", industry: "", niche: "", current: "", target: "", employers: [],
  });
  const [animKey, setAnimKey] = useState(0);
  const [niches, setNiches] = useState<{ label: string; hint: string }[]>([]);
  const [employerSugg, setEmployerSugg] = useState<string[]>([]);
  const [targetExamples, setTargetExamples] = useState<string[]>([]);
  const [loadingPers, setLoadingPers] = useState(false);

  const next = () => { setStep(s => s + 1); setAnimKey(k => k + 1); };
  const back = () => { setStep(s => Math.max(0, s - 1)); setAnimKey(k => k + 1); };

  // When industry chosen, fetch niches + employer suggestions
  useEffect(() => {
    if (!data.industry) return;
    setLoadingPers(true);
    supabase.functions.invoke("meridian-personalize", { body: { industry: data.industry, stage: data.current } })
      .then(({ data: d }: any) => {
        if (d?.niches) setNiches(d.niches);
        if (d?.employerSuggestions) setEmployerSugg(d.employerSuggestions);
        if (d?.targetExamples) setTargetExamples(d.targetExamples);
      })
      .finally(() => setLoadingPers(false));
  }, [data.industry]);

  const totalSteps = 8;

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {step > 0 && (
        <div className="flex items-center gap-2 px-6 pt-4">
          <button onClick={back} className="text-ink3 hover:text-ink transition">
            <I.ChevronLeft width={20} height={20} />
          </button>
          <div className="flex-1 h-[2px] bg-black/[0.06] dark:bg-white/10 rounded">
            <div className="h-full bg-[var(--olo)] rounded transition-all duration-500" style={{ width: `${(step / (totalSteps - 1)) * 100}%` }} />
          </div>
          <span className="text-[10px] tracking-[0.18em] text-ink3 uppercase">{step}/{totalSteps - 1}</span>
        </div>
      )}

      <div key={animKey} className="fade-in flex-1 flex flex-col px-7 pt-10 pb-8 overflow-y-auto no-scrollbar">
        {step === 0 && <Welcome onSignUp={() => { setData(d => ({...d, mode: "signup"})); next(); }} onSignIn={() => { setData(d => ({...d, mode: "signin"})); next(); }} />}
        {step === 1 && <NameStep data={data} setData={setData} onNext={next} />}
        {step === 2 && <EmailStep data={data} setData={setData} onNext={next} />}
        {step === 3 && <PickStep label="Which industry are you positioning for?" sub="We benchmark you against placed candidates here." options={INDUSTRIES} value={data.industry} onSelect={(v) => { setData(d => ({...d, industry: v})); setTimeout(next, 200); }} />}
        {step === 4 && <CurrentStep value={data.current} onChange={(v) => setData(d => ({...d, current: v}))} onNext={next} />}
        {step === 5 && <NicheStep loading={loadingPers} niches={niches} value={data.niche} onSelect={(v) => { setData(d => ({...d, niche: v})); setTimeout(next, 200); }} />}
        {step === 6 && <TargetStep examples={targetExamples} value={data.target} onChange={(v) => setData(d => ({...d, target: v}))} onNext={next} />}
        {step === 7 && <EmployersStep loading={loadingPers} suggestions={employerSugg} selected={data.employers} setSelected={(arr) => setData(d => ({...d, employers: arr}))} onDone={() => onDone(data)} />}
      </div>
    </div>
  );
}

function Welcome({ onSignUp, onSignIn }: { onSignUp: () => void; onSignIn: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between text-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-[var(--olo)] mb-6"><MeridianMark size={56} /></div>
        <div className="text-[10px] tracking-[0.28em] uppercase text-ink3 mb-3">Meridian</div>
        <h1 className="font-serif text-[44px] leading-[1.05] text-ink font-light tracking-tight">
          Know where<br/><em className="not-italic text-[var(--olo)]">you stand.</em>
        </h1>
        <p className="text-[13px] text-ink2 mt-5 max-w-[280px] leading-relaxed font-light">
          A daily positioning brief, gap analysis, and action engine — built for the early professional who needs strategic clarity.
        </p>
      </div>
      <div className="w-full space-y-3">
        <button onClick={onSignUp} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase font-light hover:opacity-90 transition">Begin Positioning</button>
        <button onClick={onSignIn} className="w-full text-[12px] text-ink2 tracking-[0.1em] uppercase font-light hover:text-ink transition">I already have an account</button>
      </div>
    </div>
  );
}

function NameStep({ data, setData, onNext }: any) {
  return (
    <StepShell label="Step 01" title="What should we call you?" sub="Just a first name is fine.">
      <input autoFocus value={data.name} onChange={e => setData((d: OnboardingData) => ({...d, name: e.target.value}))} placeholder="Alex" className="font-serif text-[28px] bg-transparent border-b border-black/10 dark:border-white/15 pb-3 outline-none focus:border-[var(--olo)] transition placeholder:text-ink3/50 text-ink" />
      <div className="flex-1" />
      <button disabled={!data.name.trim()} onClick={onNext} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase disabled:opacity-30 transition">Continue</button>
    </StepShell>
  );
}

function EmailStep({ data, setData, onNext }: any) {
  return (
    <StepShell label="Step 02" title="Your email" sub="We send your Morning Brief here.">
      <input autoFocus type="email" value={data.email} onChange={e => setData((d: OnboardingData) => ({...d, email: e.target.value}))} placeholder="alex@example.com" className="font-serif text-[24px] bg-transparent border-b border-black/10 dark:border-white/15 pb-3 outline-none focus:border-[var(--olo)] transition placeholder:text-ink3/50 text-ink" />
      <div className="flex-1" />
      <button disabled={!/.+@.+\..+/.test(data.email)} onClick={onNext} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase disabled:opacity-30 transition">Continue</button>
    </StepShell>
  );
}

function StepShell({ label, title, sub, children }: any) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink3 mb-3">{label}</div>
      <h2 className="font-serif text-[30px] leading-tight text-ink font-light mb-2">{title}</h2>
      {sub && <p className="text-[12px] text-ink3 mb-6 font-light">{sub}</p>}
      {children}
    </div>
  );
}

function PickStep({ label, sub, options, value, onSelect }: { label: string; sub: string; options: string[]; value: string; onSelect: (v: string) => void; }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink3 mb-3">Calibrating</div>
      <h2 className="font-serif text-[28px] leading-[1.1] text-ink font-light mb-2">{label}</h2>
      <p className="text-[12px] text-ink3 mb-5 font-light">{sub}</p>
      <div className="space-y-2 flex-1">
        {options.map(o => (
          <button key={o} onClick={() => onSelect(o)} className={`w-full text-left px-4 py-3 rounded-xl border transition text-[13px] font-light flex items-center justify-between ${value === o ? "border-[var(--olo)] bg-[var(--olo)]/5 text-ink" : "border-black/[0.07] dark:border-white/10 bg-surface text-ink2 hover:border-black/20"}`}>
            <span>{o}</span>
            {value === o && <I.Check width={14} height={14} className="text-[var(--olo)]" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function NicheStep({ loading, niches, value, onSelect }: { loading: boolean; niches: { label: string; hint: string }[]; value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink3 mb-3 flex items-center gap-2">
        <I.Sparkles width={11} height={11} className="text-[var(--olo)]" /> AI-curated for you
      </div>
      <h2 className="font-serif text-[28px] leading-[1.1] text-ink font-light mb-2">Pick your niche.</h2>
      <p className="text-[12px] text-ink3 mb-5 font-light">We narrow your benchmark cohort and shape every screen around this.</p>
      <div className="space-y-2 flex-1">
        {loading && [0,1,2,3,4].map(i => <div key={i} className="h-[58px] bg-surface rounded-xl animate-pulse" />)}
        {!loading && niches.map(n => (
          <button key={n.label} onClick={() => onSelect(n.label)} className={`w-full text-left px-4 py-3 rounded-xl border transition font-light ${value === n.label ? "border-[var(--olo)] bg-[var(--olo)]/5" : "border-black/[0.07] dark:border-white/10 bg-surface hover:border-black/20"}`}>
            <div className="text-[13px] text-ink">{n.label}</div>
            <div className="text-[11px] text-ink3 mt-0.5">{n.hint}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CurrentStep({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink3 mb-3">Calibrating</div>
      <h2 className="font-serif text-[28px] leading-[1.1] text-ink font-light mb-2">Where are you today?</h2>
      <p className="text-[12px] text-ink3 mb-5 font-light">Be specific — "2L at Georgetown Law focused on admin", "SWE-II at Stripe", "PM Associate at a Series B fintech". The detail sharpens every screen that follows.</p>
      <input
        autoFocus
        list="stage-suggestions"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. 2L at Georgetown Law, admin law focus"
        className="font-serif text-[20px] bg-transparent border-b border-black/10 dark:border-white/15 pb-3 outline-none focus:border-[var(--olo)] transition placeholder:text-ink3/50 text-ink"
      />
      <datalist id="stage-suggestions">
        {STAGES.map(s => <option key={s} value={s} />)}
      </datalist>
      <div className="flex flex-wrap gap-2 mt-4">
        {STAGES.slice(0, 6).map(s => (
          <button key={s} onClick={() => onChange(s)} className="text-[11px] px-3 py-1.5 rounded-full border border-black/[0.07] dark:border-white/10 text-ink2 bg-surface hover:border-[var(--olo)] hover:text-[var(--olo)] transition">{s}</button>
        ))}
      </div>
      <div className="flex-1" />
      <button disabled={!value.trim()} onClick={onNext} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase disabled:opacity-30 transition mt-6">Continue</button>
    </div>
  );
}

function TargetStep({ examples, value, onChange, onNext }: { examples: string[]; value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink3 mb-3">Step 06</div>
      <h2 className="font-serif text-[28px] leading-[1.1] text-ink font-light mb-2">Where do you hope to land?</h2>
      <p className="text-[12px] text-ink3 mb-5 font-light">Your target market defines the comparable cohort.</p>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="e.g. D.C. regulatory & litigation" className="font-serif text-[20px] bg-transparent border-b border-black/10 dark:border-white/15 pb-3 outline-none focus:border-[var(--olo)] transition placeholder:text-ink3/50 text-ink" />
      <div className="flex flex-wrap gap-2 mt-5">
        {examples.map(ex => (
          <button key={ex} onClick={() => onChange(ex)} className="text-[11px] px-3 py-1.5 rounded-full border border-black/[0.07] dark:border-white/10 text-ink2 bg-surface hover:border-[var(--olo)] hover:text-[var(--olo)] transition">{ex}</button>
        ))}
      </div>
      <div className="flex-1" />
      <button disabled={!value.trim()} onClick={onNext} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase disabled:opacity-30 transition mt-6">Continue</button>
    </div>
  );
}

function EmployersStep({ loading, suggestions, selected, setSelected, onDone }: { loading: boolean; suggestions: string[]; selected: string[]; setSelected: (a: string[]) => void; onDone: () => void }) {
  const [custom, setCustom] = useState("");
  const toggle = (e: string) => setSelected(selected.includes(e) ? selected.filter(x => x !== e) : [...selected, e]);
  const addCustom = () => { if (custom.trim() && !selected.includes(custom.trim())) { setSelected([...selected, custom.trim()]); setCustom(""); } };

  return (
    <div className="flex-1 flex flex-col">
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink3 mb-3">Optional · Step 07</div>
      <h2 className="font-serif text-[28px] leading-[1.1] text-ink font-light mb-2">Any target employers?</h2>
      <p className="text-[12px] text-ink3 mb-5 font-light">Tap any that resonate — or skip. Helps us tune Alerts and the Industry Brief.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {loading && [0,1,2,3,4,5,6,7].map(i => <div key={i} className="h-7 w-24 bg-surface rounded-full animate-pulse" />)}
        {!loading && suggestions.map(s => {
          const on = selected.includes(s);
          return (
            <button key={s} onClick={() => toggle(s)} className={`text-[12px] px-3 py-1.5 rounded-full border transition ${on ? "bg-[var(--olo)] text-white border-[var(--olo)]" : "border-black/[0.07] dark:border-white/10 text-ink2 bg-surface hover:border-[var(--olo)]"}`}>
              {on && <span className="mr-1">✓</span>}{s}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mb-4">
        <input value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustom())} placeholder="Add another firm…" className="flex-1 text-[13px] bg-transparent border-b border-black/10 dark:border-white/15 pb-1.5 outline-none focus:border-[var(--olo)] text-ink placeholder:text-ink3/50" />
        <button onClick={addCustom} className="text-[11px] uppercase tracking-wider text-[var(--olo)]">Add</button>
      </div>

      <div className="flex-1" />
      <button onClick={onDone} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase font-light">{selected.length ? `Continue with ${selected.length}` : "Skip — no specific targets"}</button>
    </div>
  );
}
