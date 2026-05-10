import { useState } from "react";
import { I } from "./icons";
import type { OnboardingData } from "./Onboarding";
import { useMeridianData } from "./MeridianDataContext";

export function RepositionOverlay({ user, onClose, onSave }: { user: OnboardingData; onClose: () => void; onSave: (u: OnboardingData) => void }) {
  const [target, setTarget] = useState(user.target);
  const [niche, setNiche] = useState(user.niche);
  const [employers, setEmployers] = useState<string[]>(user.employers);
  const [reason, setReason] = useState("");
  const [step, setStep] = useState(0);
  const [custom, setCustom] = useState("");

  const REASONS = [
    "Found a clearer signal in another field",
    "Burnt out on current trajectory",
    "Better opportunity opened up",
    "Compensation / lifestyle re-prioritized",
    "Just exploring",
  ];

  const toggle = (e: string) => setEmployers(employers.includes(e) ? employers.filter(x => x !== e) : [...employers, e]);
  const addCustom = () => { if (custom.trim() && !employers.includes(custom.trim())) { setEmployers([...employers, custom.trim()]); setCustom(""); } };

  return (
    <div className="absolute inset-0 z-40 flex flex-col fade-in" style={{ background: "var(--background)" }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button onClick={onClose} className="w-9 h-9 rounded-md bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-ink2"><I.X width={16} height={16} /></button>
        <div className="text-[10px] tracking-[0.2em] uppercase text-ink3">Repositioning</div>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-7 pt-6 pb-6">
        {step === 0 && (
          <div className="fade-in">
            <h2 className="font-serif text-[34px] leading-[1.05] text-ink font-light mb-2">Changing course?</h2>
            <p className="text-[13px] text-ink2 font-light leading-relaxed mb-6">Big move. Let's recalibrate everything — your benchmark cohort, your gaps, the alerts you see.</p>
            <div className="text-[10px] tracking-[0.16em] uppercase text-ink3 mb-3">Why now?</div>
            <div className="space-y-2 mb-6">
              {REASONS.map(r => (
                <button key={r} onClick={() => setReason(r)} className={`w-full text-left px-4 py-3 rounded-xl border text-[13px] font-light transition ${reason === r ? "border-[var(--olo)] bg-[var(--olo)]/5 text-ink" : "border-black/[0.07] dark:border-white/10 bg-surface text-ink2"}`}>{r}</button>
              ))}
            </div>
            <button disabled={!reason} onClick={() => setStep(1)} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase disabled:opacity-30">Continue</button>
          </div>
        )}

        {step === 1 && (
          <div className="fade-in">
            <h2 className="font-serif text-[28px] text-ink font-light mb-2">New target market</h2>
            <p className="text-[12px] text-ink3 mb-5 font-light">What are you positioning for now?</p>
            <input autoFocus value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g. NY M&A boutique" className="w-full font-serif text-[22px] bg-transparent border-b border-black/10 dark:border-white/15 pb-3 outline-none focus:border-[var(--olo)] text-ink placeholder:text-ink3/50 mb-5" />

            <div className="text-[10px] tracking-[0.16em] uppercase text-ink3 mb-2">Refine the niche</div>
            <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. cross-border M&A" className="w-full text-[14px] bg-transparent border-b border-black/10 dark:border-white/15 pb-2 outline-none focus:border-[var(--olo)] text-ink mb-6" />

            <div className="text-[10px] tracking-[0.16em] uppercase text-ink3 mb-2">Target employers (optional)</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {employers.map(e => (
                <button key={e} onClick={() => toggle(e)} className="text-[12px] px-3 py-1.5 rounded-full bg-[var(--olo)] text-white">✓ {e}</button>
              ))}
            </div>
            <div className="flex gap-2 mb-6">
              <input value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustom())} placeholder="Add a firm…" className="flex-1 text-[13px] bg-transparent border-b border-black/10 dark:border-white/15 pb-1.5 outline-none focus:border-[var(--olo)] text-ink" />
              <button onClick={addCustom} className="text-[11px] uppercase tracking-wider text-[var(--olo)]">Add</button>
            </div>

            <div className="bg-[var(--olo)]/8 border border-[var(--olo)]/30 rounded-2xl p-4 mb-6">
              <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--olo)] mb-1.5 font-medium">Heads up</div>
              <p className="text-[12px] text-ink2 leading-relaxed font-light">Saving this will rebuild your Positioning Score, Gaps, Alerts, and Roadmap against the new cohort. Past progress stays archived.</p>
            </div>

            <button disabled={!target.trim()} onClick={() => onSave({ ...user, target, niche, employers })} className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase disabled:opacity-30">Reposition Me</button>
          </div>
        )}
      </div>
    </div>
  );
}
