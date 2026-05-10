import { useEffect, useRef, useState } from "react";
import { I, MeridianMark } from "./icons";
import type { OnboardingData } from "./Onboarding";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What's the single biggest gap in my positioning right now?",
  "Draft a cold-outreach line to a partner at Gibson Dunn.",
  "What signals would move my Positioning Score the most this week?",
  "How do I frame my background for a regulatory role?",
];

export function ChatOverlay({ user, onClose }: { user: OnboardingData | null; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meridian-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next, profile: user }),
      });
      if (!resp.ok || !resp.body) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error || `Failed (${resp.status})`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              acc += c;
              setMessages((prev) => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: acc } : m));
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col fade-in" style={{
      background: "radial-gradient(ellipse at top, oklch(0.22 0.05 255) 0%, oklch(0.13 0.04 250) 45%, oklch(0.06 0.02 250) 100%)",
    }}>
      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.7  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }} />
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: "oklch(0.45 0.18 270)" }} />
      <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "oklch(0.4 0.15 240)" }} />

      {/* Header */}
      <div className="relative flex items-center gap-3 px-5 pt-4 pb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
          <MeridianMark size={18} accent />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-light">Meridian AI</div>
          <div className="font-serif text-[20px] text-white/95 leading-tight font-light">Career Intelligence</div>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full text-white/70 hover:text-white flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }} aria-label="Close">
          <I.X width={16} height={16} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative px-5 pb-3">
        {messages.length === 0 && (
          <div className="pt-2 pb-4">
            <div className="font-serif italic text-[22px] text-white/85 leading-snug font-light max-w-[300px]">
              "Where am I weakest, and what's the one move that closes it?"
            </div>
            <div className="text-[11px] text-white/45 mt-2 font-light">Ask anything about your positioning, target firms, gap analysis, or next move.</div>

            <div className="mt-5 space-y-2">
              {STARTERS.map((s) => (
                <button key={s} onClick={() => send(s)} className="w-full text-left px-4 py-3 rounded-2xl text-[12.5px] text-white/80 leading-snug font-light transition hover:text-white" style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
                }}>
                  <span className="text-[var(--olo)] mr-2">→</span>{s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed font-light whitespace-pre-wrap ${m.role === "user" ? "text-white rounded-br-md" : "text-white/90 rounded-bl-md"}`} style={m.role === "user" ? {
              background: "linear-gradient(135deg, oklch(0.7 0.13 60), oklch(0.55 0.13 50))",
            } : {
              background: "rgba(255,255,255,0.05)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
            }}>
              {m.content || <span className="inline-flex gap-1"><Dot /><Dot d=".15s" /><Dot d=".3s" /></span>}
            </div>
          </div>
        ))}
        {error && (
          <div className="mb-3 text-[12px] text-red-300/90 px-4 py-2 rounded-xl" style={{ background: "rgba(239,68,68,0.1)" }}>{error}</div>
        )}
      </div>

      {/* Composer */}
      <div className="relative px-4 pb-5 pt-2">
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-end gap-2 rounded-2xl px-3 py-2" style={{
          background: "rgba(255,255,255,0.06)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask about your positioning…"
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-[13px] text-white placeholder:text-white/35 font-light py-2 max-h-32"
          />
          <button type="submit" disabled={!input.trim() || loading} className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition" style={{
            background: "linear-gradient(135deg, oklch(0.7 0.13 60), oklch(0.55 0.13 50))",
          }} aria-label="Send">
            <I.ArrowRight width={15} height={15} strokeWidth={2} />
          </button>
        </form>
        <div className="text-[9px] tracking-[0.18em] uppercase text-white/30 text-center mt-2 font-light">AI · keyed to your profile</div>
      </div>
    </div>
  );
}

function Dot({ d = "0s" }: { d?: string }) {
  return <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" style={{ animation: `slowPulse 1s ease-in-out ${d} infinite` }} />;
}
