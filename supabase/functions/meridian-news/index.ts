// AI-generated industry intelligence stories — strictly current (<3 weeks old)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const esc = (v: unknown) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const brandImage = (s: any, i: number) => {
  const palettes = [["#04342C", "#C99B55"], ["#0D1B2A", "#5DCAA5"], ["#111827", "#EF9F27"], ["#172554", "#93C5FD"], ["#1F2937", "#D1D5DB"], ["#052E2B", "#F6D58B"]];
  const [bg, accent] = palettes[i % palettes.length];
  const source = esc(s.source || "Meridian").slice(0, 30);
  const tag = esc(s.tag || "INTEL").slice(0, 22);
  const focus = esc((Array.isArray(s.thumbnailKeywords) ? s.thumbnailKeywords.join(" · ") : s.visualFocus) || s.headline || "market signal").slice(0, 70);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520"><rect width="800" height="520" fill="${bg}"/><circle cx="642" cy="118" r="190" fill="none" stroke="${accent}" stroke-opacity=".28" stroke-width="1.4"/><circle cx="642" cy="118" r="120" fill="none" stroke="${accent}" stroke-opacity=".18" stroke-width="1"/><path d="M70 365 C190 285 276 430 410 336 S626 245 735 300" fill="none" stroke="${accent}" stroke-opacity=".5" stroke-width="2"/><text x="58" y="82" fill="${accent}" font-family="Arial, sans-serif" font-size="24" letter-spacing="7">${tag}</text><text x="58" y="140" fill="#fff" font-family="Georgia, serif" font-size="54" font-style="italic">${source}</text><text x="58" y="440" fill="#fff" fill-opacity=".72" font-family="Arial, sans-serif" font-size="26">${focus}</text><rect x="58" y="174" width="96" height="3" fill="${accent}" opacity=".75"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

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
          { role: "system", content: `You are an industry intelligence analyst. Today's date is ${todayStr}. EVERY story you generate must be plausibly published between ${cutoff} and ${todayStr} — i.e. within the last 3 weeks. Never reference older events. Output ONLY tool calls.` },
          { role: "user", content: `Generate ${count} CURRENT (last 3 weeks only — between ${cutoff} and ${todayStr}) industry-news stories that someone targeting "${target}"${niche ? ` (niche: ${niche})` : ""} (${industry}, ${stage})${employers ? `, watching ${employers}` : ""} should track this week. Each story must be plausible, specific to real firms/agencies/regulations, and tied to events that could realistically have happened in the past 21 days. For each provide: headline; tag (REGULATION/HIRING/M&A/POLICY/LITIGATION/MARKET/FUNDING/TECH); 3-4 sentence AI summary referencing recent developments; 2-sentence "impact on positioning"; urgency badge text + dot color (#ef4444 high, #f59e0b medium, #10b981 watch); thumbnailKeywords = 2-3 SPECIFIC visual nouns/brands directly depicting the story; imageUrl ONLY if you know a direct publisher/company/agency image URL that belongs to that story/source. Do NOT invent stock-photo URLs. If no direct story/brand image is known, leave imageUrl empty so the app renders a branded intelligence card instead. age in human format like "2h", "1d", "5d", "2w" — must reflect a date in the last 21 days.` }
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
                      age: { type: "string", description: "Must be within 21 days. E.g. '4h', '2d', '1w', '2w'." },
                      publishedAt: { type: "string", description: `ISO date between ${cutoff} and ${todayStr}` },
                      summary: { type: "string" },
                      impact: { type: "string" },
                      badgeText: { type: "string" },
                      badgeDot: { type: "string" },
                      thumbnailKeywords: { type: "array", items: { type: "string" }, description: "2-3 concrete visual subjects directly depicting the story" },
                      imageUrl: { type: "string", description: "Direct article/publisher/company image URL when known; otherwise empty string" },
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
    const stories = fresh.map((s: any, i: number) => {
      const knownImage = typeof s.imageUrl === "string" && /^https:\/\//i.test(s.imageUrl) ? s.imageUrl : "";
      return { ...s, id: i, img: knownImage || brandImage(s, i) };
    });

    return new Response(JSON.stringify({ stories }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
