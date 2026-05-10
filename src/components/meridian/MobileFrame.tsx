import type { ReactNode } from "react";

export function MobileFrame({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 transition-colors" style={{ background: dark ? "oklch(0.08 0.02 250)" : "oklch(0.18 0.03 250)" }}>
      <div className="w-[390px] max-w-full rounded-[52px] p-[4px] shadow-[0_60px_120px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.07)]" style={{ background: dark ? "#0a0a0a" : "#1a1a1a" }}>
        <div className="rounded-[49px] overflow-hidden h-[820px] flex flex-col bg-background">
          <StatusBar />
          <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex justify-between items-center px-7 pt-3.5 pb-1 flex-shrink-0 relative z-10">
      <span className="text-[13px] font-medium text-ink tracking-[0.01em]">9:41</span>
      <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[108px] h-7 rounded-2xl" style={{ background: "var(--ink)" }} />
      <div className="flex gap-1.5 items-center">
        <svg width="15" height="11" viewBox="0 0 15 11"><rect x="0" y="4" width="3" height="7" rx="1" fill="currentColor" className="text-ink"/><rect x="4" y="2.5" width="3" height="8.5" rx="1" fill="currentColor" className="text-ink"/><rect x="8" y="1" width="3" height="10" rx="1" fill="currentColor" className="text-ink"/><rect x="12" y="0" width="3" height="11" rx="1" fillOpacity="0.22" fill="currentColor" className="text-ink"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><rect x="0" y="0" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" className="text-ink"/><rect x="1.5" y="1.5" width="9" height="8" rx="1" fill="currentColor" className="text-ink"/></svg>
      </div>
    </div>
  );
}
