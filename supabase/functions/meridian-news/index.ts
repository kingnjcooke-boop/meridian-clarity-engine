// AI-generated industry intelligence stories — strictly current (<3 weeks old).
// Each card uses a REAL photographic image: the article's og:image when a
// real URL is known, else a contextual editorial photo keyed to the story.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function ogImage(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (compatible; MeridianBot/1.0)" },
      signal: AbortSignal.timeout(4500),
    });
    if (!r.ok) return null;
    const html = await r.text();
    const m =
      html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (!m) return null;
    let img = m[1].trim();
    if (img.startsWith("//")) img = "https:" + img;
    if (img.startsWith("/")) {
      const u = new URL(url);
      img = `${u.protocol}//${u.host}${img}`;
    }
    return /^https?:\/\//i.test(img) ? img : null;
  } catch {
    return null;
  }
}

async function wikiThumb(keyword: string): Promise<string | null> {
  try {
    const title = encodeURIComponent(keyword.trim().replace(/\s+/g, "_"));
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, {
      headers: { "User-Agent": "MeridianBot/1.0", Accept: "application/json" },
    });
    if (!r.ok) return null;
    const j = await r.json();
    const url = j?.originalimage?.source || j?.thumbnail?.source;
    return typeof url === "string" && /^https?:\/\//.test(url) ? url : null;
  } catch {
    return null;
  }
}

function brandedSvg(source: string, headline: string, seed: number): string {
  const palette = ["#0c2340", "#3b6d11", "#0c447c", "#5c2018", "#143d2f"];
  const bg = palette[Math.abs(seed) % palette.length];
  const src = (source || "Meridian").slice(0, 32).replace(/[<>&]/g, "");
  const line = (headline || "").slice(0, 56).replace(/[<>&]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520"><rect width="800" height="520" fill="${bg}"/><text x="48" y="120" fill="rgba(255,255,255,0.55)" font-family="Georgia, serif" font-size="20" letter-spacing="3">${src.toUpperCase()}</text><text x="48" y="280" fill="#fff" font-family="Georgia, serif" font-size="44" font-style="italic">${line}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { profile, count = 6 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const target = profile?.target || "regulatory law in Washington D.C.";
    const industry = profile?.industry || "law";
    const stage = profile?.current || "early career";
    const niche = profile?.niche || "";
    const employers = (profile?.employers || []).join(", ");

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const cutoff = new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `You are an industry intelligence analyst. Today is ${todayStr}. Every story you produce must reflect a REAL event published between ${cutoff} and ${todayStr}. Prefer events you can cite to a real publisher URL.

COPY RULES (strictly enforced):
- Headlines: max 9 words. No filler. Lead with the strongest word.
- Summary: max 2 sentences, no throat-clearing.
- Impact: 1 sentence, lead with the verb or noun that matters.
- Tag: 1-2 words ALL CAPS.
- badgeText: 1-3 words.

Output ONLY tool calls.` },
          { role: "user", content: `Generate ${count} CURRENT (last 3 weeks: ${cutoff} → ${todayStr}) news stories that someone targeting "${target}"${niche ? ` (${niche})` : ""} (${industry}, ${stage})${employers ? `, watching ${employers}` : ""} should track. For each: cite the real source publisher (Bloomberg Law, Reuters, Politico, FT, WSJ, Law360, Axios, etc.), and if you know a real article URL, return it in articleUrl. Provide thumbnailKeywords = 2-3 SPECIFIC NAMED ENTITIES that exist as Wikipedia articles — e.g. "Federal Trade Commission", "Gibson Dunn", "Lina Khan", "U.S. Capitol", "Latham & Watkins". NO abstractions, NO generic nouns like "growth" or "office". Order keywords most-specific-first. Urgency dot: #ef4444 high, #f59e0b medium, #10b981 watch.` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "publish_stories",
            parameters: {
              type: "object",
              properties: {
                stories: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      headline: { type: "string" },
                      tag: { type: "string" },
                      source: { type: "string" },
                      age: { type: "string" },
                      publishedAt: { type: "string" },
                      summary: { type: "string" },
                      impact: { type: "string" },
                      badgeText: { type: "string" },
                      badgeDot: { type: "string" },
                      thumbnailKeywords: { type: "array", items: { type: "string" } },
                      articleUrl: { type: "string", description: "Real publisher URL if known" },
                      sources: { type: "array", items: { type: "string" } },
                    },
                    required: ["headline", "tag", "source", "age", "publishedAt", "summary", "impact", "badgeText", "badgeDot", "thumbnailKeywords", "sources"],
                  }
                }
              },
              required: ["stories"],
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "publish_stories" } },
      }),
    });

    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "Credits depleted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await r.text();
      return new Response(JSON.stringify({ error: t }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await r.json();
    const args = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
    const cutoffMs = today.getTime() - 21 * 24 * 60 * 60 * 1000;
    const fresh = (args.stories as any[]).filter((s) => {
      const t = Date.parse(s.publishedAt || "");
      return !isNaN(t) ? t >= cutoffMs : true;
    });

    // Resolve images: og:image of articleUrl → Wikipedia thumb of each keyword → branded SVG.
    const stories = await Promise.all(
      fresh.map(async (s: any, i: number) => {
        let img: string | null = null;
        if (typeof s.articleUrl === "string" && /^https?:\/\//i.test(s.articleUrl)) {
          img = await ogImage(s.articleUrl);
        }
        if (!img) {
          for (const kw of (s.thumbnailKeywords || [])) {
            img = await wikiThumb(kw);
            if (img) break;
          }
        }
        if (!img) img = brandedSvg(s.source || "Meridian", s.headline || "", i + (Date.parse(s.publishedAt || "") || i));
        return { ...s, id: i, img };
      })
    );

    return new Response(JSON.stringify({ stories }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
