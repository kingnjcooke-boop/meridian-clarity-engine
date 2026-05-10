// AI-organized resources: resume templates, interview drills, articles
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
    const stage = profile?.stage || "early career";

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You curate hyper-targeted career resources. Be specific, no generic advice." },
          { role: "user", content: `Curate resources for someone targeting "${target}" (${industry}, ${stage}). Generate: 3 resume templates (each: name, one-line desc, optional tag like "Top match"), 4 interview drill packs (each: title, drill count 6-30, category color theme), 4 articles (each: editorial title, read time, source description like "AI-curated · 4 sources", a one-paragraph AI summary, and a 2-sentence "why it matters for your positioning").` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "publish_resources",
            parameters: {
              type: "object",
              properties: {
                resumes: { type: "array", items: { type: "object", properties: { name: { type: "string" }, desc: { type: "string" }, tag: { type: "string" } }, required: ["name", "desc", "tag"] } },
                drills: { type: "array", items: { type: "object", properties: { title: { type: "string" }, count: { type: "number" }, theme: { type: "string", description: "navy|olo|emerald|blue" } }, required: ["title", "count", "theme"] } },
                articles: { type: "array", items: { type: "object", properties: { title: { type: "string" }, readTime: { type: "string" }, source: { type: "string" }, summary: { type: "string" }, whyItMatters: { type: "string" } }, required: ["title", "readTime", "source", "summary", "whyItMatters"] } },
              },
              required: ["resumes", "drills", "articles"],
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
    return new Response(JSON.stringify(payload), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
