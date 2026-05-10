import { useState } from "react";
import { MeridianMark } from "./icons";
import { I } from "./icons";

export type OnboardingData = {
  mode: "signup" | "signin";
  name: string;
  email: string;
  industry: string;
  current: string;
  target: string;
};

const INDUSTRIES = [
  "Law — Regulatory & Litigation",
  "Investment Banking",
  "Management Consulting",
  "Tech / Product",
  "Public Policy",
  "Private Equity",
];

const STAGES = [
  "Undergraduate",
  "Law / Grad Student",
  "Early Analyst (0–2y)",
  "Associate (2–5y)",
  "Career Switcher",
];

const TARGETS = [
  "D.C. Regulatory & Litigation",
  "NY Big Law — M&A",
  "Tier-1 Strategy Consulting",
  "FAANG Product Management",
  "Buy-Side Investing",
  "Federal Policy Roles",
];

export function Onboarding({ onDone }: { onDone: (d: OnboardingData) => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    mode: "signup",
    name: "",
    email: "",
    industry: "",
    current: "",
    target: "",
  });
  const [animKey, setAnimKey] = useState(0);

  const next = () => { setStep(s => s + 1); setAnimKey(k => k + 1); };
  const back = () => { setStep(s => Math.max(0, s - 1)); setAnimKey(k => k + 1); };

  const totalSteps = 6;

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* progress */}
      {step > 0 && (
        <div className="flex items-center gap-2 px-6 pt-4">
          <button onClick={back} className="text-ink3 hover:text-ink transition">
            <I.ChevronLeft width={20} height={20} />
          </button>
          <div className="flex-1 h-[2px] bg-black/[0.06] rounded">
            <div
              className="h-full bg-[var(--olo)] rounded transition-all duration-500"
              style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
            />
          </div>
          <span className="text-[10px] tracking-[0.18em] text-ink3 uppercase">{step}/{totalSteps - 1}</span>
        </div>
      )}

      <div key={animKey} className="fade-in flex-1 flex flex-col px-7 pt-10 pb-8">
        {step === 0 && <Welcome onSignUp={() => { setData(d => ({...d, mode: "signup"})); next(); }} onSignIn={() => { setData(d => ({...d, mode: "signin"})); next(); }} />}
        {step === 1 && <NameStep data={data} setData={setData} onNext={next} />}
        {step === 2 && <EmailStep data={data} setData={setData} onNext={next} />}
        {step === 3 && <PickStep label="Which industry are you positioning for?" sub="We benchmark you against placed candidates in this market." options={INDUSTRIES} value={data.industry} onSelect={(v) => { setData(d => ({...d, industry: v})); setTimeout(next, 200); }} />}
        {step === 4 && <PickStep label="Where are you today?" sub="Your starting point shapes which signals matter most." options={STAGES} value={data.current} onSelect={(v) => { setData(d => ({...d, current: v})); setTimeout(next, 200); }} />}
        {step === 5 && <PickStep label="Where do you hope to go?" sub="Your target market defines the comparable cohort." options={TARGETS} value={data.target} onSelect={(v) => { setData(d => ({...d, target: v})); setTimeout(() => onDone({ ...data, target: v }), 250); }} />}
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
        <button onClick={onSignUp} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase font-light hover:opacity-90 transition">
          Begin Positioning
        </button>
        <button onClick={onSignIn} className="w-full text-[12px] text-ink2 tracking-[0.1em] uppercase font-light hover:text-ink transition">
          I already have an account
        </button>
      </div>
    </div>
  );
}

function NameStep({ data, setData, onNext }: any) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink3 mb-3">Step 01</div>
      <h2 className="font-serif text-[30px] leading-tight text-ink font-light mb-2">What should we call you?</h2>
      <p className="text-[12px] text-ink3 mb-8 font-light">Just a first name is fine.</p>
      <input
        autoFocus
        value={data.name}
        onChange={e => setData((d: OnboardingData) => ({...d, name: e.target.value}))}
        placeholder="Alex"
        className="font-serif text-[28px] bg-transparent border-b border-black/10 pb-3 outline-none focus:border-[var(--olo)] transition placeholder:text-ink3/50 text-ink"
      />
      <div className="flex-1" />
      <button disabled={!data.name.trim()} onClick={onNext} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase disabled:opacity-30 transition">
        Continue
      </button>
    </div>
  );
}

function EmailStep({ data, setData, onNext }: any) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink3 mb-3">Step 02</div>
      <h2 className="font-serif text-[30px] leading-tight text-ink font-light mb-2">Your email</h2>
      <p className="text-[12px] text-ink3 mb-8 font-light">We send your Morning Brief here.</p>
      <input
        autoFocus
        type="email"
        value={data.email}
        onChange={e => setData((d: OnboardingData) => ({...d, email: e.target.value}))}
        placeholder="alex@example.com"
        className="font-serif text-[24px] bg-transparent border-b border-black/10 pb-3 outline-none focus:border-[var(--olo)] transition placeholder:text-ink3/50 text-ink"
      />
      <div className="flex-1" />
      <button disabled={!/.+@.+\..+/.test(data.email)} onClick={onNext} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase disabled:opacity-30 transition">
        Continue
      </button>
    </div>
  );
}

function PickStep({ label, sub, options, value, onSelect }: { label: string; sub: string; options: string[]; value: string; onSelect: (v: string) => void; }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink3 mb-3">Calibrating</div>
      <h2 className="font-serif text-[28px] leading-[1.1] text-ink font-light mb-2">{label}</h2>
      <p className="text-[12px] text-ink3 mb-7 font-light">{sub}</p>
      <div className="space-y-2 flex-1">
        {options.map(o => (
          <button
            key={o}
            onClick={() => onSelect(o)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border transition text-[13px] font-light flex items-center justify-between ${value === o ? "border-[var(--olo)] bg-[var(--olo)]/5 text-ink" : "border-black/[0.07] bg-white text-ink2 hover:border-black/20"}`}
          >
            <span>{o}</span>
            {value === o && <I.Check width={14} height={14} className="text-[var(--olo)]" />}
          </button>
        ))}
      </div>
    </div>
  );
}
