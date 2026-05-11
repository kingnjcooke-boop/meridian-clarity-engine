// AI-computed Positioning Score from the user's resume vs. their target
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

    const resumeText = (profile?.resumeText || "").slice(0, 8000);
    if (!resumeText.trim()) {
      return new Response(JSON.stringify({ error: "No resume provided" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const target = profile?.target || "their stated target";
    const industry = profile?.industry || "unspecified industry";
    const stage = profile?.current || "early career";
    const niche = profile?.niche || "";
    const employers = (profile?.employers || []).join(", ");

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `You are a career positioning analyst. Compare a resume against what placed candidates in a target market actually carry, then issue an honest score and gap analysis.

SCORING SCALE (internal — never explain to the user, never reference these numbers in any output text):
- The resume's authenticity is the threshold. If it is a real, coherent, identifiable resume with meaningful content (education, work history, or projects), the lowest possible score is 82. Calibrate the rest of the scale above that floor: 82-86 = entry-level signal present but raw, 87-91 = on-track candidate, 92-95 = competitive, 96-100 = elite/placed-tier.
- Only score below 82 when the upload is clearly NOT a usable resume: empty, gibberish, off-topic document, or so sparse it conveys nothing. In those cases score 30-70 based on how unusable it is.
- Never mention this scale, the floor, or "minimum score" anywhere in any field. Speak only about strengths, gaps, and next moves.

Output ONLY tool calls.` },
          { role: "user", content: `Candidate is a ${stage} in ${industry}${niche ? ` (niche: ${niche})` : ""} targeting "${target}"${employers ? `, watching ${employers}` : ""}.

RESUME:
"""
${resumeText}
"""

Score this candidate 0-100 against the actual bar that placed candidates in this target carry. Use research on what those roles typically require (credentials, signals, prior firms, technical depth, publications, networks). Be honest — don't inflate.

Return:
- score: integer 0-100
- percentile: short string e.g. "Top 14%" or "Bottom 30%"
- trend: signed integer like 6 or -3 (estimated 7-day delta if they execute typical actions — usually small positive single digits)
- trendLabel: e.g. "Improving", "Stalling", "Climbing"
- gapsCount: number of critical gaps blocking placement (typically 1-4)
- gapsPriority: short e.g. "High Priority"
- summary: 2 sentences — what they have, what's missing
- gaps: array of 3-5 specific gap objects { title, severity ("Critical"|"High"|"Medium"), why (1 sentence), nextAction (verb-led, 1 sentence) }
- strengths: 2-3 short bullets of what genuinely helps them
- roadmap: 4-6 reactive next actions generated from THIS resume and target, each { title, gap, pts (4-15), time, signal, why, steps (3-5 concrete steps), tip }` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "publish_score",
            parameters: {
              type: "object",
              properties: {
                score: { type: "number" },
                percentile: { type: "string" },
                trend: { type: "number" },
                trendLabel: { type: "string" },
                gapsCount: { type: "number" },
                gapsPriority: { type: "string" },
                summary: { type: "string" },
                gaps: { type: "array", items: { type: "object", properties: { title: { type: "string" }, severity: { type: "string" }, why: { type: "string" }, nextAction: { type: "string" } }, required: ["title","severity","why","nextAction"] } },
                strengths: { type: "array", items: { type: "string" } },
                roadmap: { type: "array", items: { type: "object", properties: { title: { type: "string" }, gap: { type: "string" }, pts: { type: "number" }, time: { type: "string" }, signal: { type: "string" }, why: { type: "string" }, steps: { type: "array", items: { type: "string" } }, tip: { type: "string" } }, required: ["title","gap","pts","time","signal","why","steps","tip"] } },
              },
              required: ["score","percentile","trend","trendLabel","gapsCount","gapsPriority","summary","gaps","strengths","roadmap"],
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "publish_score" } },
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
