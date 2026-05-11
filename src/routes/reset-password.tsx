import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // The Supabase client automatically handles the recovery hash on load.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // user is in recovery flow — form below will update password
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate({ to: "/" }), 1500);
    } catch (e: any) {
      setError(e?.message || "Could not update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-ink font-light mb-2">Set a new password</h1>
        <p className="text-sm text-ink3 mb-6 font-light">Choose something you'll remember.</p>
        {done ? (
          <div className="text-sm text-[var(--olo)]">Password updated. Redirecting…</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required type="password" minLength={8}
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full bg-transparent border-b border-black/10 pb-2.5 outline-none focus:border-[var(--olo)] text-ink"
            />
            {error && <div className="text-xs text-red-500">{error}</div>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-[var(--navy)] text-white py-3.5 rounded-2xl text-xs tracking-[0.16em] uppercase font-light disabled:opacity-40"
            >
              {loading ? "…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
