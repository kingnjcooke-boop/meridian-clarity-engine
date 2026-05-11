# Meridian: From Demo to Category

Five-phase plan to turn the current mock into a defensible product. Each phase is shippable on its own; do them in order so later phases build on earlier infrastructure.

---

## Phase 1 — Real Auth + Persistence Foundation

**Why first:** every other feature (history, cohort, weekly PDF) requires a real user identity and a database. `localStorage` is not a session.

**Backend (Lovable Cloud / Supabase):**
- Enable email/password + Google OAuth via managed social auth.
- New tables (all RLS-protected, `user_id = auth.uid()`):
  - `profiles` — name, target, industry, niche, current stage, employers, resume_name, resume_text, onboarded_at
  - `scores` — score, percentile, tier, trend, gaps_count, summary, gaps (jsonb), strengths (jsonb), roadmap (jsonb), created_at *(append-only history)*
  - `actions` — roadmap action snapshot, status (`todo`/`in_progress`/`done`), artifact_url, artifact_text, completed_at, pts_awarded
  - `events` — generic activity log (login, score_run, action_completed, story_dismissed) for streaks and the weekly digest
  - `stories_dismissed` — per-user dismissals so the brief never re-shows the same item
- Trigger: auto-create `profiles` row on signup.

**Frontend:**
- New `/login`, `/signup`, `/reset-password` routes.
- `_authenticated` layout route guards the app; unauthenticated → `/login`.
- Replace `localStorage` hydration in `MeridianApp.tsx` with Supabase session + a `useProfile()` hook that loads from `profiles`.
- Onboarding writes to `profiles` on completion; resume upload writes `resume_name`/`resume_text` to `profiles`.

---

## Phase 2 — Deterministic Score + History

**Why:** score swings between page loads are the credibility killer. Anchor it.

- `meridian-score` edge function changes:
  - Add `temperature: 0`, fixed seed, and a stable hash of `(resume_text + target + industry + niche)` as an idempotency key.
  - Before calling the model, check `scores` for an existing row with the same `input_hash` in the last 7 days → return cached row.
  - On new run, **persist** the result to `scores` instead of returning ephemerally.
- Position screen reads from `scores` (latest row) and shows a real **7-day trend sparkline** from history.
- "Reposition" / resume re-upload creates a new `scores` row, so trend reflects actual user action — not LLM dice.

---

## Phase 3 — Verified Action Loops

**Why:** this is what turns a dashboard into a coach. Score moves *because* of artifacts.

- Each roadmap card gets a "Mark complete" flow that requires an artifact:
  - Text paste (draft memo, outreach message), OR
  - URL (published piece, LinkedIn post, calendly booking), OR
  - File upload (PDF draft) → new `artifacts` storage bucket, user-scoped RLS.
- New edge function `meridian-verify-action`: takes the artifact + action context, asks Gemini Flash to grade it 0–100 against the action's stated `signal`. Returns `verified: bool`, `feedback: string`, `pts_awarded: number`.
- On verify success: insert into `actions` (status=`done`), insert `events` row, and trigger a fresh `scores` row reflecting the new signal. Roadmap card flips to a completed state with the grader's feedback.
- This kills the "score is astrology" problem — every movement has a receipt.

---

## Phase 4 — Cohort Wall + Real Sources

**Why:** social comparison is the single most addictive mechanic in career products. And the false "≥3 sources agree" claim has to die before it gets the project a C&D.

**Cohort:**
- New `cohort_peers` table seeded per `(industry, target)` pair with 6 anonymized synthetic profiles (real signal mix, fake names) until we have real users in each vertical.
- "Network" tab gets a **Cohort** section: 6 cards showing peer initials, tier, top 2 signals, top gap. Live count of peers ahead/behind.
- As real users accumulate per vertical, gradually replace synthetic peers with anonymized real ones (opt-in flag on `profiles`).

**Sources:**
- Strip the "AI-Verified Intelligence / ≥3 sources agree" claim from `screens-alerts-network.tsx` and the news edge function prompt.
- `meridian-news` returns real `source_url`s from the model's web-grounded output; UI renders them as clickable citations. If we can't ground it, we don't claim it.
- Replace generic Unsplash hero images with a curated allowlist of high-quality, role-appropriate images (or omit imagery entirely on intel cards — editorial restraint > AI slop).

---

## Phase 5 — The Weekly Artifact (B2C virality + B2B wedge)

**Why:** the Friday PDF is the forwardable object. Mentors, advisors, parents, career deans see it. That's the loop.

- New edge function `meridian-weekly-digest` runs every Friday 7am user-local via pg_cron + a `/api/public/cron/weekly-digest` server route.
- For each active user it generates a 2-page PDF (server-side via `@react-pdf/renderer`):
  - Page 1: "Your week" — score delta, tier, completed actions w/ grades, cohort position
  - Page 2: "Next week" — 3 prioritized moves, 2 firms hiring against the profile
- Stored in `weekly_briefs` table + `briefs` storage bucket. Emailed via Resend (transactional email scaffold).
- In-app "Briefs" archive on the Resources screen.
- This PDF is also the artifact we hand to schools/CMCs for B2B distribution.

---

## Technical Notes

- All edge functions stay `verify_jwt = false` only where required; protected ones (`meridian-verify-action`, `meridian-weekly-digest`) move behind JWT.
- Roles table (`user_roles` + `has_role` security-definer fn) added in Phase 1 even if unused — anticipates Phase 5 admin/coach views without a future migration.
- `tierFromScore` / `scalePts` helpers move from client into a `meridian-utils` shared module so edge functions, the weekly digest, and the UI all agree on tier math.
- `MeridianDataContext` gets refactored to read from React Query backed by Supabase, not from edge function calls cached in component state.

---

## Suggested Sequencing

| Phase | Effort | Unblocks |
|---|---|---|
| 1 — Auth + tables | 1 session | Everything |
| 2 — Deterministic score + history | 1 session | Trust, trend, Phase 5 |
| 3 — Verified actions | 2 sessions | The product's actual coaching loop |
| 4 — Cohort + kill false claims | 1 session | Stickiness, legal safety |
| 5 — Weekly PDF + email | 2 sessions | Virality, B2B pitch |

I'll start with **Phase 1** on approval — real auth and the database schema — because nothing else is honest until users have real identities and their data actually persists.