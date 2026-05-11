import { I } from "./icons";

export type Tab = "brief" | "alerts" | "network" | "resources";

const items: { id: Tab; icon: any; label: string }[] = [
  { id: "brief", icon: I.Home, label: "Brief" },
  { id: "alerts", icon: I.Radio, label: "Alerts" },
  { id: "network", icon: I.Users, label: "Network" },
  { id: "resources", icon: I.Book, label: "Tools" },
];

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void; onCenter?: () => void }) {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div
        className="pointer-events-auto flex items-center gap-1 rounded-full px-2 py-2"
        style={{
          background: "rgba(10,14,22,0.62)",
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
          boxShadow:
            "0 18px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {items.map((it) => {
          const Icon = it.icon;
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className="relative w-12 h-10 rounded-full flex items-center justify-center transition"
              style={{
                color: active ? "white" : "rgba(255,255,255,0.55)",
                background: active ? "color-mix(in oklab, var(--olo) 22%, transparent)" : "transparent",
                boxShadow: active ? "inset 0 0 0 1px rgba(255,255,255,0.08)" : undefined,
              }}
              aria-label={it.label}
            >
              <Icon width={19} height={19} strokeWidth={active ? 1.9 : 1.5} />
              {active && (
                <span
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: "var(--olo)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
