// AI-organized resources: templates, drills, articles, lexicon, and a personalized Industry Brief.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const esc = (v: unknown) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const briefImage = (b: any, target: string) => {
  const title = esc(b?.title || "Industry Brief").slice(0, 42);
  const focus = esc(target).slice(0, 64);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720"><rect width="1200" height="720" fill="#04342C"/><circle cx="930" cy="190" r="250" fill="none" stroke="#C99B55" stroke-opacity=".28" stroke-width="2"/><circle cx="930" cy="190" r="155" fill="none" stroke="#C99B55" stroke-opacity=".18" stroke-width="1.5"/><path d="M115 520 C250 360 390 560 535 420 S795 315 1035 405" fill="none" stroke="#C99B55" stroke-opacity=".55" stroke-width="3"/><path d="M160 165 L202 142 L220 188 L178 210 Z" fill="#C99B55" fill-opacity=".18"/><text x="110" y="120" fill="#C99B55" font-family="Arial, sans-serif" font-size="28" letter-spacing="10">MERIDIAN</text><text x="110" y="214" fill="#fff" font-family="Georgia, serif" font-size="78">${title}</text><text x="110" y="590" fill="#fff" fill-opacity=".68" font-family="Arial, sans-serif" font-size="34">${focus}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

async function wikiThumb(keyword: string): Promise<string | null> {
  try {
    const title = encodeURIComponent(String(keyword).trim().replace(/\s+/g, "_"));
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, {
      headers: { "User-Agent": "MeridianBot/1.0", Accept: "application/json" },
    });
    if (!r.ok) return null;
    const j = await r.json();
    const url = j?.originalimage?.source || j?.thumbnail?.source;
    return typeof url === "string" && /^https?:\/\//.test(url) ? url : null;
  } catch { return null; }
}

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

COPY RULES (HARD LIMITS — enforce on every field):
- Lead with the most valuable word. Cut filler, passive voice, throat-clearing ("It's important to…", "In today's…").
- Brief.title: ≤7 words. Brief.subtitle: ≤12 words, single phrase.
- Brief.whereYouAre / whereYouAreGoing: ≤2 sentences each. No qualifiers.
- Brief.timing / investment: ≤5 words. Concrete (e.g. "6–9 months", "$0–$400").
- Brief.marketContext: ≤2 sentences. Lead with the verb.
- Step.title: ≤5 words, verb-led. Step.what: ≤2 sentences. Step.why: 1 sentence. Step.signal: ≤8 words.
- Lexicon.definition / whyItMatters: 1 sentence each.
- Article.summary / whyItMatters: ≤2 sentences each.
- Resume.desc: ≤14 words.

URL POLICY: NEVER return google.com URLs. Use DIRECT URLs to real sites like canva.com/resumes/templates, novoresume.com, resume.io, zety.com, hbr.org, wsj.com, bloomberg.com, reuters.com, ft.com, law360.com. If unsure, use bing.com/search — NEVER google.com.` },
          { role: "user", content: `Curate resources for ${name} who is a ${stage} in ${industry}${niche ? ` (niche: ${niche})` : ""} targeting "${target}"${employers ? `, watching ${employers}` : ""}.
${resumeText ? `\nResume evidence to use:\n"""\n${resumeText}\n"""` : "\nNo resume yet — make the brief honest that upload sharpens the route."}

Generate:
1) 3 RESUME TEMPLATES.
2) 4 INTERVIEW DRILL PACKS (theme: navy|olo|emerald|blue, 8-12 questions).
3) 4 ARTICLES.
4) 8-12 LEXICON ENTRIES specific to "${target}" — comp structures, unwritten paths, deal-flow vocab, regulatory shorthand.
5) INDUSTRY BRIEF — succinct editorial journey. logoKeyword must be ONE Wikipedia-resolvable named entity (e.g. "Federal Trade Commission", "Lina Khan", "U.S. Capitol"), NOT abstract nouns.` }
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
      payload.industryBrief.image = briefImage(payload.industryBrief, target);
    }
    payload.drills = (payload.drills || []).map((d: any) => ({ ...d, count: (d.questions || []).length }));
    return new Response(JSON.stringify(payload), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
