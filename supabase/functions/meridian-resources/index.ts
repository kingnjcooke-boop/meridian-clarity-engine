// AI-organized resources: templates, drills, articles, lexicon, and a personalized Industry Brief.
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
    const resumeText = String(profile?.resumeText || "").slice(0, 5000);
    const today = new Date().toISOString().slice(0, 10);

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `You curate hyper-targeted, CURRENT career resources and produce a deeply personalized Industry Brief. Today is ${today}. Be specific, concrete, editorial — no generic advice. Output ONLY tool calls.

URL POLICY: NEVER return google.com URLs (they refuse to be embedded/visited from in-app browsers). Use DIRECT URLs to real sites like canva.com/resumes/templates, novoresume.com/resume-templates, resume.io/resume-templates, zety.com, themuse.com, hbr.org, wsj.com, bloomberg.com, reuters.com, ft.com, law360.com, bain.com/insights, mckinsey.com/featured-insights. If you're not sure of a specific URL, use a Bing search URL ("https://www.bing.com/search?q=...") — NEVER google.com.` },
          { role: "user", content: `Curate resources for ${name} who is a ${stage} in ${industry}${niche ? ` (niche: ${niche})` : ""} targeting "${target}"${employers ? `, watching ${employers}` : ""}.
${resumeText ? `\nResume evidence to use when organizing the brief and resources:\n"""\n${resumeText}\n"""` : "\nNo resume text is available yet, so make the brief clear that upload/refinement will sharpen the route."}

Generate:
1) 3 RESUME TEMPLATES — name, one-line desc, optional tag, real templateUrl (DIRECT site URL — NEVER google.com).
2) 4 INTERVIEW DRILL PACKS — title, theme (navy|olo|emerald|blue), category, 8-12 questions.
3) 4 ARTICLES — title, readTime, source ("AI-curated · N sources"), summary, whyItMatters (2 sentences), articleUrl (direct site or bing.com/search — NEVER google.com).
4) 8-12 LEXICON ENTRIES — insider terms, jargon, unspoken norms specific to "${target}" that an outsider wouldn't know. Each: { term, definition (1 concise sentence), whyItMatters (1 sentence on how this knowledge changes their behavior/answers) }. Comp structures, unwritten career paths, deal-flow vocabulary, regulatory shorthand, internal politics — things that genuinely separate insiders from outsiders.
5) INDUSTRY BRIEF — editorial journey:
   - title (short headline), subtitle (one line on their vantage point)
   - whereYouAre: 2-3 sentence honest current positioning
   - whereYouAreGoing: 2-3 sentence target end-state painted vividly
   - steps: 4-6 sequential { number, title (verb-led), timeframe, what (1-2 sentences), why (1 sentence), signal (resume line produced) }
   - marketContext: current hiring climate (last 3 weeks)
   - timing, investment, logoKeyword (2-3 visual nouns)` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "publish_resources",
            parameters: {
              type: "object",
              properties: {
                resumes: { type: "array", items: { type: "object", properties: { name: { type: "string" }, desc: { type: "string" }, tag: { type: "string" }, templateUrl: { type: "string" } }, required: ["name","desc","tag","templateUrl"] } },
                drills: { type: "array", items: { type: "object", properties: { title: { type: "string" }, theme: { type: "string" }, category: { type: "string" }, questions: { type: "array", items: { type: "string" } } }, required: ["title","theme","category","questions"] } },
                articles: { type: "array", items: { type: "object", properties: { title: { type: "string" }, readTime: { type: "string" }, source: { type: "string" }, summary: { type: "string" }, whyItMatters: { type: "string" }, articleUrl: { type: "string" } }, required: ["title","readTime","source","summary","whyItMatters","articleUrl"] } },
                lexicon: { type: "array", items: { type: "object", properties: { term: { type: "string" }, definition: { type: "string" }, whyItMatters: { type: "string" } }, required: ["term","definition","whyItMatters"] } },
                industryBrief: {
                  type: "object",
                  properties: {
                    title: { type: "string" }, subtitle: { type: "string" },
                    whereYouAre: { type: "string" }, whereYouAreGoing: { type: "string" },
                    steps: { type: "array", items: { type: "object", properties: { number: { type: "number" }, title: { type: "string" }, timeframe: { type: "string" }, what: { type: "string" }, why: { type: "string" }, signal: { type: "string" } }, required: ["number","title","timeframe","what","why","signal"] } },
                    marketContext: { type: "string" }, timing: { type: "string" }, investment: { type: "string" }, logoKeyword: { type: "string" },
                  },
                  required: ["title","subtitle","whereYouAre","whereYouAreGoing","steps","marketContext","timing","investment","logoKeyword"],
                },
              },
              required: ["resumes","drills","articles","lexicon","industryBrief"],
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

    // Strip any accidental google.com URLs as a safety net
    const sanitize = (u: string, fallback: string) =>
      typeof u === "string" && !/google\.com/i.test(u) ? u : fallback;
    payload.resumes = (payload.resumes || []).map((r: any) => ({ ...r, templateUrl: sanitize(r.templateUrl, `https://www.bing.com/search?q=${encodeURIComponent(r.name + " resume template")}`) }));
    payload.articles = (payload.articles || []).map((a: any) => ({ ...a, articleUrl: sanitize(a.articleUrl, `https://www.bing.com/search?q=${encodeURIComponent(a.title)}`) }));

    if (payload.industryBrief?.logoKeyword) {
      const tags = String(payload.industryBrief.logoKeyword).toLowerCase().replace(/[^a-z0-9 ,]/g, "").split(/[, ]+/).filter(Boolean).slice(0, 3).join(",");
      payload.industryBrief.image = `https://loremflickr.com/1200/720/${encodeURIComponent(tags || "skyline")}?lock=${Date.now() % 9999}`;
    }
    payload.drills = (payload.drills || []).map((d: any) => ({ ...d, count: (d.questions || []).length }));
    return new Response(JSON.stringify(payload), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
