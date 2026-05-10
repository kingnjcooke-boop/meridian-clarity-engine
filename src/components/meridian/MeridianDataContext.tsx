import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { OnboardingData } from "./Onboarding";
import { STORIES as SEED_STORIES } from "./screens-core";

export type Story = {
  id: number; headline: string; tag: string; source: string; age: string; publishedAt?: string;
  summary: string; impact: string; badge: { dot: string; text: string }; confirmedBy: string[]; img: string;
};

export type BriefStep = { number: number; title: string; timeframe: string; what: string; why: string; signal: string };
export type IndustryBrief = {
  title: string; subtitle: string;
  whereYouAre: string; whereYouAreGoing: string;
  steps: BriefStep[]; marketContext: string; timing: string; investment: string;
  logoKeyword: string; image?: string;
  whosHiring?: { firm: string; role: string; signal: string }[];
  whatFor?: string[]; whatItMeans?: string;
};

export type Drill = { title: string; theme: string; category: string; questions: string[]; count: number };
export type Resume = { name: string; desc: string; tag: string; templateUrl: string };
export type Article = { title: string; readTime: string; source: string; summary: string; whyItMatters: string; articleUrl: string };
export type LexiconEntry = { term: string; definition: string; whyItMatters: string };

export type Resources = {
  resumes: Resume[];
  drills: Drill[];
  articles: Article[];
  lexicon?: LexiconEntry[];
  industryBrief?: IndustryBrief;
};

export type ScoreData = {
  score: number; percentile: string;
  trend: number; trendLabel: string;
  gapsCount: number; gapsPriority: string;
  summary: string;
  gaps: { title: string; severity: string; why: string; nextAction: string }[];
  strengths: string[];
};

type Ctx = {
  stories: Story[]; storiesLoading: boolean; storiesError: string | null; refreshStories: () => void;
  resources: Resources | null; resourcesLoading: boolean; resourcesError: string | null; refreshResources: () => void;
  scoreData: ScoreData | null; scoreLoading: boolean; scoreError: string | null; refreshScore: () => void;
};

const MeridianDataCtx = createContext<Ctx | null>(null);

export function MeridianDataProvider({ user, children }: { user: OnboardingData; children: ReactNode }) {
  const [stories, setStories] = useState<Story[]>(SEED_STORIES as any);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [storiesError, setStoriesError] = useState<string | null>(null);

  const [resources, setResources] = useState<Resources | null>(null);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState<string | null>(null);

  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);

  async function fetchStories() {
    setStoriesLoading(true); setStoriesError(null);
    try {
      const { data, error } = await supabase.functions.invoke("meridian-news", { body: { profile: user, count: 6 } });
      if (error) throw error; if (data?.error) throw new Error(data.error);
      const mapped: Story[] = (data.stories || []).map((s: any, i: number) => ({
        id: i, headline: s.headline, tag: s.tag, source: s.source, age: s.age, publishedAt: s.publishedAt,
        summary: s.summary, impact: s.impact, badge: { dot: s.badgeDot, text: s.badgeText },
        confirmedBy: s.sources || [], img: s.img,
      }));
      if (mapped.length) setStories(mapped);
    } catch (e: any) { setStoriesError(e.message || "Failed to load stories"); }
    finally { setStoriesLoading(false); }
  }

  async function fetchResources() {
    setResourcesLoading(true); setResourcesError(null);
    try {
      const { data, error } = await supabase.functions.invoke("meridian-resources", { body: { profile: user } });
      if (error) throw error; if (data?.error) throw new Error(data.error);
      setResources(data);
    } catch (e: any) { setResourcesError(e.message || "Failed to load resources"); }
    finally { setResourcesLoading(false); }
  }

  async function fetchScore() {
    if (!user.hasResume || !user.resumeText) { setScoreData(null); return; }
    setScoreLoading(true); setScoreError(null);
    try {
      const { data, error } = await supabase.functions.invoke("meridian-score", { body: { profile: user } });
      if (error) throw error; if (data?.error) throw new Error(data.error);
      setScoreData(data);
    } catch (e: any) { setScoreError(e.message || "Failed to score"); }
    finally { setScoreLoading(false); }
  }

  useEffect(() => { fetchStories(); fetchResources(); /* eslint-disable-next-line */ }, [user.industry, user.target, user.current, user.niche, JSON.stringify(user.employers)]);
  useEffect(() => { fetchScore(); /* eslint-disable-next-line */ }, [user.hasResume, user.resumeText, user.target, user.niche]);

  return (
    <MeridianDataCtx.Provider value={{
      stories, storiesLoading, storiesError, refreshStories: fetchStories,
      resources, resourcesLoading, resourcesError, refreshResources: fetchResources,
      scoreData, scoreLoading, scoreError, refreshScore: fetchScore,
    }}>
      {children}
    </MeridianDataCtx.Provider>
  );
}

export function useMeridianData() {
  const c = useContext(MeridianDataCtx);
  if (!c) throw new Error("useMeridianData must be used inside MeridianDataProvider");
  return c;
}
