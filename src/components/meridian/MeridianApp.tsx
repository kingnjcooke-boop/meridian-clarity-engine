import { useEffect, useState } from "react";
import { MobileFrame } from "./MobileFrame";
import { Onboarding, type OnboardingData } from "./Onboarding";
import { BottomNav, type Tab } from "./BottomNav";
import { BriefScreen, PositionScreen } from "./screens-core";
import { AlertsScreen, NetworkScreen, StoryDetail } from "./screens-alerts-network";
import { ResourcesScreen, RoadmapScreen, ActionDetail, IndustryBriefDetail, DrillDetail } from "./screens-resources-roadmap";
import { ChatOverlay } from "./ChatOverlay";
import { RepositionOverlay } from "./RepositionOverlay";
import { MeridianDataProvider } from "./MeridianDataContext";

type Overlay =
  | { kind: "none" }
  | { kind: "story"; id: number }
  | { kind: "action"; id: number }
  | { kind: "drill"; idx: number }
  | { kind: "industryBrief" }
  | { kind: "roadmap" }
  | { kind: "chat" }
  | { kind: "reposition" };

export function MeridianApp() {
  const [user, setUser] = useState<OnboardingData | null>(null);
  const [tab, setTab] = useState<Tab>("brief");
  const [overlay, setOverlay] = useState<Overlay>({ kind: "none" });
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <MobileFrame dark={dark}>
      {!user ? (
        <Onboarding onDone={(d) => setUser(d)} />
      ) : (
        <MeridianDataProvider user={user}>
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {overlay.kind === "story" && <StoryDetail id={overlay.id} onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "action" && <ActionDetail id={overlay.id} onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "drill" && <DrillDetail idx={overlay.idx} onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "industryBrief" && <IndustryBriefDetail onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "roadmap" && <RoadmapScreen onOpenAction={(id) => setOverlay({ kind: "action", id })} onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "none" && (
              <>
                {tab === "brief" && <BriefScreen user={user} dark={dark} setDark={setDark} onOpenAction={(id) => setOverlay({ kind: "action", id })} onOpenStory={(id) => setOverlay({ kind: "story", id })} onOpenRoadmap={() => setOverlay({ kind: "roadmap" })} />}
                {tab === "position" && <PositionScreen user={user} onReposition={() => setOverlay({ kind: "reposition" })} />}
                {tab === "alerts" && <AlertsScreen onOpenStory={(id) => setOverlay({ kind: "story", id })} />}
                {tab === "network" && <NetworkScreen user={user} />}
                {tab === "resources" && <ResourcesScreen onOpenIndustryBrief={() => setOverlay({ kind: "industryBrief" })} onOpenDrill={(idx) => setOverlay({ kind: "drill", idx })} />}
              </>
            )}
            {overlay.kind === "chat" && <ChatOverlay user={user} onClose={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "reposition" && <RepositionOverlay user={user} onClose={() => setOverlay({ kind: "none" })} onSave={(u) => { setUser(u); setOverlay({ kind: "none" }); }} />}
          </div>
          <BottomNav
            tab={tab}
            onChange={(t) => { setOverlay({ kind: "none" }); setTab(t); }}
            onCenter={() => setOverlay(o => o.kind === "chat" ? { kind: "none" } : { kind: "chat" })}
          />
        </MeridianDataProvider>
      )}
    </MobileFrame>
  );
}
