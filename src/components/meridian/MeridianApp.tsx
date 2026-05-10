import { useState } from "react";
import { MobileFrame } from "./MobileFrame";
import { Onboarding, type OnboardingData } from "./Onboarding";
import { BottomNav, type Tab } from "./BottomNav";
import { BriefScreen, PositionScreen } from "./screens-core";
import { AlertsScreen, NetworkScreen, StoryDetail } from "./screens-alerts-network";
import { ResourcesScreen, RoadmapScreen, ActionDetail } from "./screens-resources-roadmap";

type Overlay =
  | { kind: "none" }
  | { kind: "story"; id: number }
  | { kind: "action"; id: number }
  | { kind: "roadmap" };

export function MeridianApp() {
  const [user, setUser] = useState<OnboardingData | null>(null);
  const [tab, setTab] = useState<Tab>("brief");
  const [overlay, setOverlay] = useState<Overlay>({ kind: "none" });

  return (
    <MobileFrame>
      {!user ? (
        <Onboarding onDone={(d) => setUser(d)} />
      ) : (
        <>
          <div className="flex-1 flex flex-col overflow-hidden">
            {overlay.kind === "story" && <StoryDetail id={overlay.id} onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "action" && <ActionDetail id={overlay.id} onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "roadmap" && <RoadmapScreen onOpenAction={(id) => setOverlay({ kind: "action", id })} onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "none" && (
              <>
                {tab === "brief" && <BriefScreen user={user} onOpenAction={(id) => setOverlay({ kind: "action", id })} onOpenStory={(id) => setOverlay({ kind: "story", id })} onOpenRoadmap={() => setOverlay({ kind: "roadmap" })} />}
                {tab === "position" && <PositionScreen user={user} />}
                {tab === "alerts" && <AlertsScreen onOpenStory={(id) => setOverlay({ kind: "story", id })} />}
                {tab === "network" && <NetworkScreen user={user} />}
                {tab === "resources" && <ResourcesScreen />}
              </>
            )}
          </div>
          <BottomNav tab={tab} onChange={(t) => { setOverlay({ kind: "none" }); setTab(t); }} onCenter={() => { setOverlay({ kind: "none" }); setTab("brief"); }} />
        </>
      )}
    </MobileFrame>
  );
}
