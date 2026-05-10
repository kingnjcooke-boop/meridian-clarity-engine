// AI-organized resources: real templates, full drill packs, articles, and a personalized
// Industry Brief structured as a step-by-step journey from where the user is to where they want to be.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const target = profile?.target || "regulatory law in D.C.";
    const industry = profile?.industry || "law";
    const stage = profile?.current || "early career";
    const niche = profile?.niche || "";
    const employers = (profile?.employers || []).join(", ");
    const name = profile?.name || "the candidate";
    const today = new Date().toISOString().slice(0, 10);

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `You curate hyper-targeted, CURRENT career resources and produce a deeply personalized Industry Brief. Today is ${today}. Be specific, concrete, and editorial — no generic advice. Output ONLY tool calls.` },
          { role: "user", content: `Curate resources for ${name} who is a ${stage} in ${industry}${niche ? ` (niche: ${niche})` : ""} targeting "${target}"${employers ? `, watching ${employers}` : ""}.

Generate:
1) 3 RESUME TEMPLATES — name, one-line desc, optional tag ("Top match"), real searchable templateUrl (Google search URL).
2) 4 INTERVIEW DRILL PACKS — title, theme (navy|olo|emerald|blue), category (Behavioral|Technical|Case|Fit), and questions array of 8–12 real industry-specific interview questions.
3) 4 ARTICLES — title, readTime, source ("AI-curated · N sources"), summary, whyItMatters (2 sentences), articleUrl (Google News search URL).
4) INDUSTRY BRIEF — a PERSONALIZED, AESTHETIC, EDITORIAL walkthrough explaining where ${name} currently stands and the concrete, logical, succinct steps to reach "${target}". Structure it as a journey, not a news article. Include:
   - title: short editorial headline naming the destination (e.g. "Your Path to ${target}")
   - subtitle: one line about the user's current vantage point
   - whereYouAre: 2-3 sentence paragraph honestly describing the user's likely current positioning (stage: ${stage}${niche ? `, niche: ${niche}` : ""}) — strengths and what's missing
   - whereYouAreGoing: 2-3 sentence paragraph painting the target end-state vividly (the role, the firm tier, the day-to-day)
   - steps: array of 4-6 SEQUENTIAL milestones to bridge the gap. Each step has:
       - number (1, 2, 3…)
       - title (short, verb-led, e.g. "Build a Verifiable Technical Signal")
       - timeframe (e.g. "Weeks 1–3", "Month 2")
       - what (1-2 sentence concrete action)
       - why (1 sentence on why this step unlocks the next one)
       - signal (the resume/profile line this produces, e.g. "Published privacy compliance memo cited by 2+ firms")
   - marketContext: a single paragraph on what the market is doing RIGHT NOW for this target (hiring climate, recent shifts within last 3 weeks)
   - timing: short string e.g. "Apply window: 6–10 weeks"
   - investment: short string e.g. "Realistic: 8–12 hrs/week for 90 days"
   - logoKeyword: 2-3 visual nouns that depict the industry/destination (e.g. "supreme court,marble columns,washington")` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "publish_resources",
            parameters: {
              type: "object",
              properties: {
                resumes: { type: "array", items: { type: "object", properties: { name: { type: "string" }, desc: { type: "string" }, tag: { type: "string" }, templateUrl: { type: "string" } }, required: ["name", "desc", "tag", "templateUrl"] } },
                drills: { type: "array", items: { type: "object", properties: {
                  title: { type: "string" }, theme: { type: "string" }, category: { type: "string" }, questions: { type: "array", items: { type: "string" } },
                }, required: ["title", "theme", "category", "questions"] } },
                articles: { type: "array", items: { type: "object", properties: { title: { type: "string" }, readTime: { type: "string" }, source: { type: "string" }, summary: { type: "string" }, whyItMatters: { type: "string" }, articleUrl: { type: "string" } }, required: ["title", "readTime", "source", "summary", "whyItMatters", "articleUrl"] } },
                industryBrief: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                    whereYouAre: { type: "string" },
                    whereYouAreGoing: { type: "string" },
                    steps: { type: "array", items: { type: "object", properties: {
                      number: { type: "number" },
                      title: { type: "string" },
                      timeframe: { type: "string" },
                      what: { type: "string" },
                      why: { type: "string" },
                      signal: { type: "string" },
                    }, required: ["number","title","timeframe","what","why","signal"] } },
                    marketContext: { type: "string" },
                    timing: { type: "string" },
                    investment: { type: "string" },
                    logoKeyword: { type: "string" },
                  },
                  required: ["title", "subtitle", "whereYouAre", "whereYouAreGoing", "steps", "marketContext", "timing", "investment", "logoKeyword"],
                },
              },
              required: ["resumes", "drills", "articles", "industryBrief"],
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "publish_resources" } },
      }),
    });

    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "Credits depleted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await r.text();
      return new Response(JSON.stringify({ error: t }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await r.json();
    const payload = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
    if (payload.industryBrief?.logoKeyword) {
      const q = String(payload.industryBrief.logoKeyword).toLowerCase().replace(/[^a-z0-9 ,]/g, "").split(/[, ]+/).filter(Boolean).join(",");
      payload.industryBrief.image = `https://source.unsplash.com/featured/1200x720/?${encodeURIComponent(q || "skyline")}&sig=${Date.now() % 1000}`;
    }
    payload.drills = (payload.drills || []).map((d: any) => ({ ...d, count: (d.questions || []).length }));
    return new Response(JSON.stringify(payload), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
