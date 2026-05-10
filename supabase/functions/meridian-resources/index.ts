// AI-organized resources: real templates, full drill packs, articles, industry brief
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

    const today = new Date().toISOString().slice(0, 10);

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `You curate hyper-targeted, CURRENT career resources. Today is ${today}. Be specific, no generic advice. All hiring signals & market data should reflect the LAST 3 WEEKS. Output ONLY tool calls.` },
          { role: "user", content: `Curate resources for someone targeting "${target}"${niche ? ` (niche: ${niche})` : ""} (${industry}, ${stage})${employers ? `, watching ${employers}` : ""}.

Generate:
1) 3 RESUME TEMPLATES — each with: name, one-line desc, optional tag ("Top match"), and a real searchable templateUrl (use a Google search URL like "https://www.google.com/search?q=..." with terms that surface the exact template — e.g. "site:novoresume.com regulatory associate resume template" or "site:standardresume.co biglaw resume").
2) 4 INTERVIEW DRILL PACKS — each with: title, theme (navy|olo|emerald|blue), category (Behavioral|Technical|Case|Fit), and a "questions" array of 8–12 ACTUAL realistic interview questions FOR THIS SPECIFIC INDUSTRY/NICHE. Real questions, no placeholders.
3) 4 ARTICLES — each: title, readTime, source ("AI-curated · 4 sources"), summary paragraph, whyItMatters (2 sentences), and an articleUrl (a Google News search URL like "https://news.google.com/search?q=..." for a current topic).
4) An INDUSTRY BRIEF — a focal market intelligence card with:
   - title (short, editorial, e.g. "What's Moving in D.C. Regulatory Law")
   - subtitle (one line, week-of phrasing)
   - whosHiring: array of 3-5 objects { firm, role, signal } (real firms hiring NOW for this niche)
   - whatFor: array of 3 short bullets describing what skills/profiles they're hiring for
   - whatItMeans: one paragraph for the user's positioning
   - timing: short string (e.g. "Apply window: next 3-5 weeks")
   - investment: short string (e.g. "Time investment: 6-10 hrs to position credibly")
   - logoKeyword: single word for visual (e.g. "courthouse", "skyline", "lab")` }
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
                  title: { type: "string" },
                  theme: { type: "string" },
                  category: { type: "string" },
                  questions: { type: "array", items: { type: "string" } },
                }, required: ["title", "theme", "category", "questions"] } },
                articles: { type: "array", items: { type: "object", properties: { title: { type: "string" }, readTime: { type: "string" }, source: { type: "string" }, summary: { type: "string" }, whyItMatters: { type: "string" }, articleUrl: { type: "string" } }, required: ["title", "readTime", "source", "summary", "whyItMatters", "articleUrl"] } },
                industryBrief: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                    whosHiring: { type: "array", items: { type: "object", properties: { firm: { type: "string" }, role: { type: "string" }, signal: { type: "string" } }, required: ["firm", "role", "signal"] } },
                    whatFor: { type: "array", items: { type: "string" } },
                    whatItMeans: { type: "string" },
                    timing: { type: "string" },
                    investment: { type: "string" },
                    logoKeyword: { type: "string" },
                  },
                  required: ["title", "subtitle", "whosHiring", "whatFor", "whatItMeans", "timing", "investment", "logoKeyword"],
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
      payload.industryBrief.image = `https://loremflickr.com/900/520/${encodeURIComponent(payload.industryBrief.logoKeyword)}?lock=${Date.now() % 1000}`;
    }
    // backfill count for legacy UI
    payload.drills = (payload.drills || []).map((d: any) => ({ ...d, count: (d.questions || []).length }));
    return new Response(JSON.stringify(payload), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
