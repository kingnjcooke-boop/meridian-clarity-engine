import { I } from "./icons";

export type Tab = "brief" | "alerts" | "network" | "resources";

const items: { id: Tab; icon: any }[] = [
  { id: "brief", icon: I.Home },
  { id: "alerts", icon: I.Radio },
  { id: "network", icon: I.Users },
  { id: "resources", icon: I.Book },
];

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void; onCenter?: () => void }) {
  return (
    <div className="flex-shrink-0 flex justify-center pb-5 pt-2 px-6">
      <div
        className="flex items-center gap-1 rounded-full px-3 py-2"
        style={{
          background: "var(--surface)",
          boxShadow: "0 12px 32px rgba(10,15,25,0.18), 0 0 0 1px var(--hairline)",
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
                color: active ? "var(--ink)" : "var(--ink3)",
                background: active ? "color-mix(in oklab, var(--olo) 12%, transparent)" : "transparent",
              }}
              aria-label={it.id}
            >
              <Icon width={19} height={19} strokeWidth={active ? 1.8 : 1.5} />
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
