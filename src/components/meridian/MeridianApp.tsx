import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
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

type ProfileRow = {
  user_id: string;
  name: string | null;
  email: string | null;
  industry: string | null;
  niche: string | null;
  current_stage: string | null;
  target: string | null;
  employers: string[] | null;
  resume_name: string | null;
  resume_text: string | null;
  onboarded: boolean;
};

function rowToOnboarding(row: ProfileRow): OnboardingData {
  return {
    mode: "signin",
    name: row.name || "",
    email: row.email || "",
    industry: row.industry || "",
    niche: row.niche || "",
    current: row.current_stage || "",
    target: row.target || "",
    employers: row.employers || [],
    hasResume: !!row.resume_text,
    resumeName: row.resume_name || undefined,
    resumeText: row.resume_text || undefined,
  };
}

function onboardingToRow(d: OnboardingData) {
  return {
    name: d.name || null,
    email: d.email || null,
    industry: d.industry || null,
    niche: d.niche || null,
    current_stage: d.current || null,
    target: d.target || null,
    employers: d.employers || [],
    resume_name: d.resumeName || null,
    resume_text: d.resumeText || null,
  };
}

export function MeridianApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<OnboardingData | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const [tab, setTab] = useState<Tab>("brief");
  const [overlay, setOverlay] = useState<Overlay>({ kind: "none" });
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Bootstrap auth: subscribe FIRST, then get current session.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) { setUser(null); setOnboarded(false); }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load profile when session changes.
  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    setProfileLoading(true);
    supabase.from("profiles").select("*").eq("user_id", session.user.id).maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) {
          setUser(rowToOnboarding(data as ProfileRow));
          setOnboarded((data as ProfileRow).onboarded);
        } else {
          // trigger may have populated; fall back to a minimal shell from auth
          setUser({
            mode: "signup", name: session.user.user_metadata?.name || "",
            email: session.user.email || "", industry: "", niche: "",
            current: "", target: "", employers: [],
          });
          setOnboarded(false);
        }
      })
      .then(() => !cancelled && setProfileLoading(false));
    return () => { cancelled = true; };
  }, [session?.user?.id]);

  async function persistProfile(d: OnboardingData, markOnboarded = false) {
    if (!session?.user) return;
    const row = { user_id: session.user.id, ...onboardingToRow(d), ...(markOnboarded ? { onboarded: true } : {}) };
    await supabase.from("profiles").upsert(row, { onConflict: "user_id" });
  }

  function openPositionOrResume() {
    if (!user?.hasResume) setOverlay({ kind: "resume" });
    else setOverlay({ kind: "position" });
  }

  // --- Render gating ---
  if (!authReady) {
    return <MobileFrame dark={dark}><div className="flex-1 bg-background" /></MobileFrame>;
  }

  // Not authenticated → Onboarding handles welcome + auth + calibration.
  if (!session) {
    return (
      <MobileFrame dark={dark}>
        <Onboarding
          initial={null}
          requireAuth
          onDone={async (d) => { await persistProfile(d, true); setUser(d); setOnboarded(true); }}
        />
      </MobileFrame>
    );
  }

  if (profileLoading || !user) {
    return <MobileFrame dark={dark}><div className="flex-1 bg-background" /></MobileFrame>;
  }

  // Authenticated but not onboarded → resume the calibration wizard.
  if (!onboarded) {
    return (
      <MobileFrame dark={dark}>
        <Onboarding
          initial={user}
          requireAuth={false}
          skipAuthSteps
          onDone={async (d) => { await persistProfile(d, true); setUser(d); setOnboarded(true); }}
        />
      </MobileFrame>
    );
  }

  return (
    <MobileFrame dark={dark}>
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
            {overlay.kind === "reposition" && (
              <RepositionOverlay
                user={user}
                onClose={() => setOverlay({ kind: "none" })}
                onSave={async (u) => { await persistProfile(u); setUser(u); setOverlay({ kind: "none" }); }}
              />
            )}
            {overlay.kind === "resume" && (
              <ResumeUpload
                initial={{ resumeName: user.resumeName }}
                onCancel={() => setOverlay({ kind: "none" })}
                onSave={async ({ resumeName, resumeText }) => {
                  const next = { ...user, resumeName, resumeText, hasResume: true };
                  await persistProfile(next);
                  setUser(next);
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
    </MobileFrame>
  );
}
