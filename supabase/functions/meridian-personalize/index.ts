// AI-populated niches + suggested target employers based on industry
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { industry, niche, stage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a career positioning analyst. Output ONLY tool calls." },
          { role: "user", content: `Industry: ${industry}. Stage: ${stage || "early career"}.${niche ? ` Niche: ${niche}.` : ""}

Return:
- niches: 8 specific sub-disciplines/niches within "${industry}" that an early professional could target. Each: { label, hint } where hint is a 4-7 word descriptor.
- employerSuggestions: 12 real, currently-hiring top-tier employers (firms / companies / agencies / labs) someone targeting ${niche || industry} would aspire to. Just names — short and recognizable.
- targetExamples: 6 short example "target market" phrases someone could pursue (e.g. "D.C. regulatory & litigation", "NY M&A boutique", "FAANG product").` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "publish",
            parameters: {
              type: "object",
              properties: {
                niches: { type: "array", items: { type: "object", properties: { label: { type: "string" }, hint: { type: "string" } }, required: ["label", "hint"] } },
                employerSuggestions: { type: "array", items: { type: "string" } },
                targetExamples: { type: "array", items: { type: "string" } },
              },
              required: ["niches", "employerSuggestions", "targetExamples"],
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "publish" } },
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
    return new Response(JSON.stringify(payload), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
