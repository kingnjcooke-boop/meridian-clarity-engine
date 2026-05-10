import { I, MeridianMark } from "./icons";

export type Tab = "brief" | "position" | "alerts" | "network" | "resources";

const items: { id: Tab; label: string; icon: any }[] = [
  { id: "brief", label: "Brief", icon: I.Home },
  { id: "position", label: "Position", icon: I.Target },
  { id: "alerts", label: "Alerts", icon: I.Radio },
  { id: "network", label: "Network", icon: I.Users },
  { id: "resources", label: "Resources", icon: I.Book },
];

export function BottomNav({ tab, onChange, onCenter }: { tab: Tab; onChange: (t: Tab) => void; onCenter: () => void }) {
  return (
    <div className="flex bg-surface border-t border-black/[0.06] px-2 pt-2.5 pb-7 flex-shrink-0">
      {items.slice(0, 2).map(it => <NavItem key={it.id} active={tab === it.id} item={it} onClick={() => onChange(it.id)} />)}
      <div className="flex-1 flex flex-col items-center justify-start cursor-pointer" onClick={onCenter}>
        <div className="w-12 h-12 rounded-[15px] bg-[var(--navy)] text-white flex items-center justify-center -translate-y-3 shadow-[0_6px_22px_rgba(11,21,33,0.4)]">
          <MeridianMark size={18} accent />
        </div>
      </div>
      {items.slice(2).map(it => <NavItem key={it.id} active={tab === it.id} item={it} onClick={() => onChange(it.id)} />)}
    </div>
  );
}

function NavItem({ active, item, onClick }: any) {
  const Icon = item.icon;
  return (
    <button onClick={onClick} className="flex-1 flex flex-col items-center gap-1 pt-0.5">
      <div className={`w-9 h-7 rounded-md flex items-center justify-center transition ${active ? "text-ink" : "text-ink3"}`}>
        <Icon width={18} height={18} strokeWidth={active ? 1.6 : 1.4} />
      </div>
      <span className={`text-[9px] tracking-[0.08em] uppercase font-light transition ${active ? "text-ink" : "text-ink3"}`}>{item.label}</span>
    </button>
  );
}
