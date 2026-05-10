// AI-generated industry intelligence stories with thumbnails + impact analysis
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { profile, count = 6 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const target = profile?.target || "regulatory law in Washington D.C.";
    const industry = profile?.industry || "law";
    const stage = profile?.stage || "early career";

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an industry intelligence analyst. Output ONLY tool calls." },
          { role: "user", content: `Generate ${count} realistic industry-news stories that someone targeting "${target}" (${industry}, ${stage}) should track this week. Each story must be plausible, specific, and tied to real firms/agencies/regulations. For each: a short editorial headline, a tag (REGULATION/HIRING/M&A/POLICY/LITIGATION/MARKET), 3-4 sentence AI summary, a 2-sentence "impact on positioning" tied to the user's target, urgency badge text + dot color (use #ef4444 for high, #f59e0b for medium, #10b981 for low/watch), and a single-word visual keyword for the thumbnail (e.g. "courthouse", "capitol", "skyline", "boardroom").` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "publish_stories",
            description: "Return generated stories",
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
                      source: { type: "string", description: "fictional but plausible source like 'Reuters' or 'Law360'" },
                      age: { type: "string", description: "e.g. '2h', '1d', '3d'" },
                      summary: { type: "string" },
                      impact: { type: "string" },
                      badgeText: { type: "string" },
                      badgeDot: { type: "string" },
                      thumbnailKeyword: { type: "string" },
                      sources: { type: "array", items: { type: "string" }, description: "3 fictional but credible source publication names" },
                    },
                    required: ["headline", "tag", "source", "age", "summary", "impact", "badgeText", "badgeDot", "thumbnailKeyword", "sources"],
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
    const stories = args.stories.map((s: any, i: number) => ({
      ...s,
      id: i,
      img: `https://loremflickr.com/800/520/${encodeURIComponent(s.thumbnailKeyword)}?lock=${i + 1}`,
    }));

    return new Response(JSON.stringify({ stories }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
