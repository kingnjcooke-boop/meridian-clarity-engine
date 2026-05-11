import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { MeridianMark, I } from "./icons";

type Mode = "signup" | "signin" | "reset";

export function AuthScreen({
  initialMode = "signup",
  onAuthed,
  onBack,
}: {
  initialMode?: Mode;
  onAuthed: () => void;
  onBack?: () => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleGoogle() {
    setError(null);
    try {
      const res = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (res.error) {
        setError(res.error.message || "Google sign-in failed");
        return;
      }
      if (res.redirected) return;
      onAuthed();
    } catch (e: any) {
      setError(e?.message || "Google sign-in failed");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { name }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        onAuthed();
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthed();
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setInfo("Check your inbox for a reset link.");
      }
    } catch (e: any) {
      setError(e?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  const title =
    mode === "signup" ? "Create your account" :
    mode === "signin" ? "Welcome back" :
    "Reset your password";
  const sub =
    mode === "signup" ? "Two minutes. Then we calibrate." :
    mode === "signin" ? "Sign in to resume." :
    "We'll email you a reset link.";

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {onBack && (
        <div className="flex items-center gap-2 px-6 pt-4">
          <button onClick={onBack} className="text-ink3 hover:text-ink transition">
            <I.ChevronLeft width={20} height={20} />
          </button>
        </div>
      )}
      <div className="fade-in flex-1 flex flex-col px-7 pt-10 pb-8 overflow-y-auto no-scrollbar">
        <div className="text-[var(--olo)] mb-5"><MeridianMark size={42} /></div>
        <h1 className="font-serif text-[30px] leading-tight text-ink font-light mb-2">{title}</h1>
        <p className="text-[12px] text-ink3 mb-6 font-light">{sub}</p>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-black/[0.09] dark:border-white/15 bg-surface text-ink py-3.5 rounded-2xl text-[13px] font-light hover:border-black/30 transition mb-3"
        >
          <GoogleIcon /> Continue with Google
        </button>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-black/[0.07] dark:bg-white/10" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-ink3">or</span>
          <div className="flex-1 h-px bg-black/[0.07] dark:bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          {mode === "signup" && (
            <input
              required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="First name"
              className="w-full bg-transparent border-b border-black/10 dark:border-white/15 pb-2.5 outline-none focus:border-[var(--olo)] transition placeholder:text-ink3/50 text-ink text-[15px]"
            />
          )}
          <input
            required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-transparent border-b border-black/10 dark:border-white/15 pb-2.5 outline-none focus:border-[var(--olo)] transition placeholder:text-ink3/50 text-ink text-[15px]"
          />
          {mode !== "reset" && (
            <input
              required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border-b border-black/10 dark:border-white/15 pb-2.5 outline-none focus:border-[var(--olo)] transition placeholder:text-ink3/50 text-ink text-[15px]"
            />
          )}

          {error && <div className="text-[12px] text-red-500 pt-1">{error}</div>}
          {info && <div className="text-[12px] text-[var(--olo)] pt-1">{info}</div>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase font-light disabled:opacity-40 transition mt-4"
          >
            {loading ? "…" :
              mode === "signup" ? "Create account" :
              mode === "signin" ? "Sign in" :
              "Send reset link"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {mode === "signup" && (
            <button onClick={() => setMode("signin")} className="text-[12px] text-ink2 font-light hover:text-ink">
              Already have an account? <span className="text-[var(--olo)]">Sign in</span>
            </button>
          )}
          {mode === "signin" && (
            <>
              <button onClick={() => setMode("signup")} className="block w-full text-[12px] text-ink2 font-light hover:text-ink">
                New here? <span className="text-[var(--olo)]">Create account</span>
              </button>
              <button onClick={() => setMode("reset")} className="block w-full text-[11px] text-ink3 font-light hover:text-ink">
                Forgot password?
              </button>
            </>
          )}
          {mode === "reset" && (
            <button onClick={() => setMode("signin")} className="text-[12px] text-ink2 font-light hover:text-ink">
              <span className="text-[var(--olo)]">Back to sign in</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.5 6.5 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
