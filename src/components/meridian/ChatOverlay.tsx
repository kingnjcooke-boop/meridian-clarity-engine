import { useEffect, useRef, useState } from "react";
import { I, MeridianMark } from "./icons";
import type { OnboardingData } from "./Onboarding";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What's my single biggest positioning gap?",
  "Roast my resume — be specific.",
  "What should I do this week to move my score?",
  "Draft a cold outreach to a partner at my target firm.",
];

const WELCOMES = [
  "What are we fixing today?",
  "Hi. I'm your unreasonably honest career strategist.",
  "Let's go. Where does it hurt?",
  "Good. You're here. Let's move.",
  "Ask me something a recruiter wouldn't tell you.",
];

export function ChatOverlay({ user, onClose }: { user: OnboardingData | null; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const welcome = WELCOMES[new Date().getDate() % WELCOMES.length];

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

  const empty = messages.length === 0;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col fade-in"
      style={{
        background:
          "radial-gradient(ellipse at center, oklch(0.16 0.04 250) 0%, oklch(0.09 0.025 248) 55%, oklch(0.04 0.015 248) 100%)",
      }}
    >
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.7  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full text-white/70 hover:text-white flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.06)" }}
        aria-label="Close"
      >
        <I.X width={16} height={16} />
      </button>

      {/* Centered content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        {empty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="text-[var(--olo)] mb-5 opacity-90">
              <MeridianMark size={42} accent />
            </div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-white/35 mb-3">Meridian AI</div>
            <h1 className="font-serif text-[30px] leading-[1.1] text-white font-semibold tracking-tight max-w-[300px]">
              {welcome}
            </h1>
            <p className="text-[12px] text-white/45 mt-3 max-w-[280px] font-light leading-relaxed">
              Career positioning advice keyed to your profile. Ask anything.
            </p>

            <div className="mt-7 w-full max-w-[320px] space-y-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full text-left px-4 py-2.5 rounded-full text-[12.5px] text-white/75 font-light transition hover:text-white"
                  style={{
                    background: "rgba(255,255,255,0.035)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
                  }}
                >
                  <span className="text-[var(--olo)] mr-2">→</span>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-5 pt-16 pb-3">
            {messages.map((m, i) => (
              <div key={i} className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed font-light whitespace-pre-wrap ${
                    m.role === "user" ? "text-white rounded-br-md" : "text-white/90 rounded-bl-md"
                  }`}
                  style={
                    m.role === "user"
                      ? { background: "linear-gradient(135deg, oklch(0.7 0.13 60), oklch(0.55 0.13 50))" }
                      : { background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }
                  }
                >
                  {m.content || <span className="inline-flex gap-1"><Dot /><Dot d=".15s" /><Dot d=".3s" /></span>}
                </div>
              </div>
            ))}
            {error && (
              <div className="mb-3 text-[12px] text-red-300/90 px-4 py-2 rounded-xl" style={{ background: "rgba(239,68,68,0.1)" }}>
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="relative px-4 pb-5 pt-2">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-end gap-2 rounded-2xl px-3 py-2 mx-auto max-w-[420px]"
          style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask Meridian…"
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-[13px] text-white placeholder:text-white/35 font-light py-2 max-h-32"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition"
            style={{ background: "linear-gradient(135deg, oklch(0.7 0.13 60), oklch(0.55 0.13 50))" }}
            aria-label="Send"
          >
            <I.ArrowRight width={15} height={15} strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
}

function Dot({ d = "0s" }: { d?: string }) {
  return <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" style={{ animation: `slowPulse 1s ease-in-out ${d} infinite` }} />;
}
