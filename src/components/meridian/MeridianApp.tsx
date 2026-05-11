import { useEffect, useState } from "react";
import { MobileFrame } from "./MobileFrame";
import { Onboarding, type OnboardingData } from "./Onboarding";
import { BottomNav, type Tab } from "./BottomNav";
import { BriefScreen, PositionScreen } from "./screens-core";
import { AlertsScreen, NetworkScreen, StoryDetail } from "./screens-alerts-network";
import { ResourcesScreen, RoadmapScreen, ActionDetail, IndustryBriefDetail, DrillDetail, LexiconDetail } from "./screens-resources-roadmap";
import { ChatOverlay } from "./ChatOverlay";
import { RepositionOverlay } from "./RepositionOverlay";
import { ResumeUpload } from "./ResumeUpload";
import { MeridianDataProvider } from "./MeridianDataContext";

type Overlay =
  | { kind: "none" }
  | { kind: "story"; id: number }
  | { kind: "action"; id: number }
  | { kind: "drill"; idx: number }
  | { kind: "industryBrief" }
  | { kind: "lexicon" }
  | { kind: "roadmap" }
  | { kind: "chat" }
  | { kind: "position" }
  | { kind: "resume" }
  | { kind: "reposition" };

export function MeridianApp() {
  const [user, setUser] = useState<OnboardingData | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem("meridian.user");
      return raw ? (JSON.parse(raw) as OnboardingData) : null;
    } catch { return null; }
  });
  const [tab, setTab] = useState<Tab>("brief");
  const [overlay, setOverlay] = useState<Overlay>({ kind: "none" });
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Persist session — keeps users logged in across reloads.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (user) window.localStorage.setItem("meridian.user", JSON.stringify(user));
      else window.localStorage.removeItem("meridian.user");
    } catch { /* ignore quota errors */ }
  }, [user]);

  function openPositionOrResume() {
    if (!user?.hasResume) setOverlay({ kind: "resume" });
    else setOverlay({ kind: "position" });
  }

  return (
    <MobileFrame dark={dark}>
      {!user ? (
        <Onboarding onDone={(d) => setUser(d)} />
      ) : (
        <MeridianDataProvider user={user}>
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="flex-1 flex flex-col overflow-hidden pb-20">
            {overlay.kind === "story" && <StoryDetail id={overlay.id} onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "action" && <ActionDetail id={overlay.id} onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "drill" && <DrillDetail idx={overlay.idx} onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "industryBrief" && <IndustryBriefDetail onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "lexicon" && <LexiconDetail onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "roadmap" && <RoadmapScreen onOpenAction={(id) => setOverlay({ kind: "action", id })} onBack={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "position" && (
              <PositionScreen
                user={user}
                onReposition={() => setOverlay({ kind: "reposition" })}
                onUpdateResume={() => setOverlay({ kind: "resume" })}
                onBack={() => setOverlay({ kind: "none" })}
              />
            )}
            {overlay.kind === "none" && (
              <>
                {tab === "brief" && (
                  <BriefScreen
                    user={user}
                    dark={dark}
                    setDark={setDark}
                    onOpenStory={(id) => setOverlay({ kind: "story", id })}
                    onOpenRoadmap={() => setOverlay({ kind: "roadmap" })}
                    onOpenChat={() => setOverlay({ kind: "chat" })}
                    onOpenPosition={openPositionOrResume}
                  />
                )}
                {tab === "alerts" && <AlertsScreen onOpenStory={(id) => setOverlay({ kind: "story", id })} />}
                {tab === "network" && <NetworkScreen user={user} />}
                {tab === "resources" && <ResourcesScreen onOpenIndustryBrief={() => setOverlay({ kind: "industryBrief" })} onOpenLexicon={() => setOverlay({ kind: "lexicon" })} onOpenDrill={(idx) => setOverlay({ kind: "drill", idx })} />}
              </>
            )}
            {overlay.kind === "chat" && <ChatOverlay user={user} onClose={() => setOverlay({ kind: "none" })} />}
            {overlay.kind === "reposition" && <RepositionOverlay user={user} onClose={() => setOverlay({ kind: "none" })} onSave={(u) => { setUser(u); setOverlay({ kind: "none" }); }} />}
            {overlay.kind === "resume" && (
              <ResumeUpload
                initial={{ resumeName: user.resumeName }}
                onCancel={() => setOverlay({ kind: "none" })}
                onSave={({ resumeName, resumeText }) => {
                  setUser({ ...user, resumeName, resumeText, hasResume: true });
                  setOverlay({ kind: "position" });
                }}
              />
            )}
            </div>
            <BottomNav
              tab={tab}
              onChange={(t) => { setOverlay({ kind: "none" }); setTab(t); }}
            />
          </div>
        </MeridianDataProvider>
      )}
    </MobileFrame>
  );
}
