
# Meridian → Acquisition Tier

Goal: a minimalist, editorial, prestige product whose perceived value comes from one defensible asset — the cohort distribution of placed candidates — and whose loop (verify action → score moves → Friday brief) is real, not vibes.

We already have Phase 1 (auth + tables) shipped. This plan replaces the rest of `.lovable/plan.md` with sharper, design-led work.

---

## Phase A — The Cohort Distribution Asset (foundation)

The single visual that defines the product. Built first because every later screen renders against it.

**Data**
- New table `cohort_profiles` — anonymized placed-candidate signals per `(industry, niche, target)`. Seeded with ~80 synthetic-but-research-grounded rows for D.C. law (the lead vertical), each carrying: tier, score, top 3 signals, top gap, year placed.
- New table `cohort_stats` — precomputed distribution per `(industry, niche, target)`: bucketed histogram (10 bins, 50→100), median, p25, p75, p90, sample_size, updated_at. Refreshed by a SQL function `refresh_cohort_stats()`.
- `meridian-utils` shared module (TS + edge): `tierFromScore`, `scalePts`, `percentileFromCurve(score, stats)` — UI, edge functions, and the weekly digest all import the same math.

**Component**
- `<CohortCurve />` — SVG density curve drawn from `cohort_stats`, user's dot animated to their percentile, p25/p50/p75 grid lines, tier band shading (Emerging→Elite). Two states: live (real cohort) and demo (synthetic). One signature transition: a 1.2s eased redraw when score changes.

**Where it lives**
- The Brief screen's hero (replaces the static score number).
- Position screen as the main view.
- Embedded in the Friday PDF (Phase E).

---

## Phase B — Demo-First Onboarding & Trust

Value in <10 seconds; auth only after the user has seen the curve.

- Landing route renders `<CohortCurve />` pre-loaded with a synthetic D.C. law resume; dot animates in over 1.2s; one editorial pull-quote ("You are carrying 3 of the 7 signals the median 2024 Latham summer associate carried.") — then the CTA "Run yours."
- Auth (existing `AuthScreen`) only after CTA. Onboarding wizard cut from 7 steps to 3: target → resume → confirm.
- Kill the "≥3 sources agree" / "AI-Verified Intelligence" claims in `screens-alerts-network.tsx` and the `meridian-news` prompt. Only render `source_url`s the model actually grounded; otherwise no claim.
- Strip generic Unsplash imagery from intel cards; replace with a curated allowlist or no imagery (editorial restraint).

---

## Phase C — Deterministic Score + History

The score must be honest and reproducible.

- `meridian-score`: `temperature: 0`, deterministic prompt, idempotency key `sha256(resume_text + target + industry + niche)`. Cache hit on `scores.input_hash` within 7d returns stored row; else compute and insert.
- Position screen reads latest `scores` row and renders a real 7-day sparkline from history rows.
- "Reposition" / re-upload writes a new `scores` row — trend reflects user action, not LLM dice.
- Persist all model output (gaps, strengths, roadmap) so the UI no longer recomputes per page load.

---

## Phase D — Verified Action Loops

Score only moves when there's an artifact.

- Each roadmap card → "Mark complete" sheet accepting text paste, URL, or PDF upload (new `artifacts` storage bucket, user-scoped RLS).
- New edge function `meridian-verify-action` grades the artifact against the action's stated `signal` with Gemini Flash, returns `verified`, `feedback`, `pts_awarded` (scaled by user's current score so points inflate near 100).
- On success: update `actions` row (`status=done`, artifact + feedback stored), insert `events` row, insert a fresh `scores` row reflecting the new signal — the curve animates the dot's move. Completed cards flip to a grader-feedback state.

---

## Phase E — The Friday Brief (virality + B2B wedge)

The forwardable object. The reason mentors, parents, and CMCs see Meridian.

- `pg_cron` Friday 7am → `/api/public/hooks/weekly-digest` (TanStack server route, `apikey` header).
- For each active user: regenerate `cohort_stats` if stale, generate a 2-page PDF via `@react-pdf/renderer`:
  - Page 1: cohort curve with the user's dot, week's score delta, verified actions w/ grades, cohort position.
  - Page 2: 3 prioritized next moves, 2 firms hiring against the profile, one editorial pull-quote.
- Stored in `weekly_briefs` table + `briefs` storage bucket; emailed via Resend (transactional scaffold).
- In-app "Briefs" archive on the Resources screen. The same PDF is the artifact we hand to school CMCs.

---

## Phase F — Editorial Design System

The product looks acquisition-tier, not shadcn-default.

**Tokens (`src/styles.css`)**
- Type: `Fraunces` (display serif) + `Inter` (UI) + `JetBrains Mono` (data). Editorial scale: 64/40/28/18/14.
- Light mode: warm paper (`oklch(98% 0.01 85)`), ink (`oklch(18% 0.02 260)`), single accent (`oklch(55% 0.13 250)`), gold for tier markers.
- Dark mode: Bloomberg-terminal black (`oklch(12% 0 0)`), bone foreground, same accent.
- Motion: one signature easing (`cubic-bezier(0.22, 1, 0.36, 1)`), one signature duration (1.2s for score moves, 240ms for UI).

**Frame**
- Remove the mock-phone bezel. Two responsive surfaces: editorial desktop (≥1024px, two-column with curve dominant) and mobile (existing stack). Same components, fluid grid.

**Surfaces redesigned against the new tokens**
- Brief: serif headline, pull quote, cohort curve, three moves. No cards-on-cards.
- Position: full-bleed curve, percentile in mono, gap list as editorial footnotes.
- Network: cohort wall — 6 anonymized peer cards (initials, tier, top 2 signals, top gap) seeded from `cohort_profiles`. Live count "ahead / behind you this week."
- Resources: minimalist index — Briefs archive, Lexicon, Drills. No imagery.
- Roadmap: each card shows `pts` scaled to user's current score, verification state, and the cohort curve delta if completed.

---

## Sequencing

| Phase | Effort | Unblocks |
|---|---|---|
| A — Cohort curve + dataset | 2 sessions | Every later screen |
| B — Demo-first onboarding + kill false claims | 1 session | Trust, conversion |
| C — Deterministic score + history | 1 session | Honest trend, Phase E |
| D — Verified action loops | 2 sessions | The coaching loop |
| E — Friday brief PDF + email | 2 sessions | Virality, B2B pitch |
| F — Editorial design system | 1–2 sessions (woven through A/B/F finish) | Acquisition-tier feel |

I'll start with **Phase A** on approval — the cohort distribution table, stats function, and `<CohortCurve />` component — because the rest of the product is interface around that one asset.

---

## Technical notes

- New tables: `cohort_profiles`, `cohort_stats`, `weekly_briefs`. New storage buckets: `artifacts` (user-scoped RLS), `briefs` (signed URL access only).
- New edge functions: `meridian-verify-action`. New TanStack server route: `/api/public/hooks/weekly-digest` (cron-called, `apikey` header).
- `meridian-news` prompt rewritten to require `source_url` per story or omit the story.
- `MeridianDataContext` refactored to React Query against Supabase; no more component-state caching of edge calls.
- Shared `meridian-utils` module (tier math, point scaling, percentile from curve) imported by UI, edge functions, and the PDF renderer so they cannot disagree.
- `@react-pdf/renderer` runs inside the TanStack server route (Worker-compatible).

