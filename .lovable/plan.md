Four scoped fixes — all frontend + one edge function tweak.

## 1. Knob — centered score, frosted shrunk button, counter-clockwise arc

File: `src/components/meridian/MeridianCompass.tsx`

- Shrink knob from 224px → 180px.
- Replace solid neumorphic dial with a frosted-glass surface: translucent `rgba(10,14,22,0.42)` + `backdrop-filter: blur(22px) saturate(160%)`, hairline white inner border, soft outer shadow. Drop the heavy radial-gradient body.
- Move the progress ring to the **outer rim** (radius ~ size/2 − 4) on an `SVG` sized to the full button. Stroke ~6px.
- Reverse arc direction to **counter-clockwise** by negating sweep: keep the gap at top, but compute dash on a path that runs CCW (set `transform="scale(-1,1)"` on the progress circle, or rotate +135° instead of −135° and negate the angle math). The white indicator dot sits on the rim and travels CCW as the score fills.
- Glow remains on the rim only (drop-shadow on the stroke). Inside of the knob stays calm — no extra rings.
- Re-center the readout: replace the current `absolute inset-0 flex-col flex items-center justify-center` block with a perfectly centered stack using `inset:0; display:flex; align-items:center; justify-content:center; flex-direction:column; text-align:center;` and remove the `mt-2 / mt-3` offsets that visually push the number off-center. Score number sits on the geometric center; sub-label and trend/gaps row balance above/below symmetrically so the optical center matches the geometric center.
- Tap pill shrinks and softens (smaller, lower opacity).

## 2. Images — switch from LoremFlickr to Wikipedia REST thumbnails

Root cause: LoremFlickr is being blocked / returns nothing in the preview, so cards fall back to broken images. og:image scrape works only when the AI returns a real `articleUrl`, which is rare.

File: `supabase/functions/meridian-news/index.ts`

- Add a `wikiThumb(keyword)` helper that calls `https://en.wikipedia.org/api/rest_v1/page/summary/{title}` and returns `thumbnail.source` (or `originalimage.source`) — these are real photographs of people, places, brands, agencies (e.g. "Federal Trade Commission", "Gibson Dunn", "Latham & Watkins"). Free, no auth, fast, CORS-clean, served from `upload.wikimedia.org`.
- Resolution order per story: (a) og:image of `articleUrl` if present and reachable, (b) Wikipedia thumb for the most specific keyword in `thumbnailKeywords`, (c) Wikipedia thumb for the next keyword, (d) final fallback: a branded SVG data-URI with the source name (so we never return a broken image).
- Tighten the AI prompt: `thumbnailKeywords` MUST be real Wikipedia-resolvable entities (agency names, firm names, named people, named locations) — no abstractions.

Resources brief image already uses a branded SVG (works). Leave it but reuse the same `wikiThumb` for `industryBrief.logoKeyword` so the brief gets a real photo when possible, falling back to the SVG.

File: `supabase/functions/meridian-resources/index.ts` — wire `wikiThumb(logoKeyword)` ahead of `briefImage(...)`.

## 3. Industry Brief — succinct copy

File: `supabase/functions/meridian-resources/index.ts`

Add hard copy constraints to the system prompt for the brief:
- `title`: max 7 words.
- `subtitle`: max 12 words, single phrase.
- `whereYouAre` / `whereYouAreGoing`: max 2 sentences each.
- `timing` / `investment`: max 5 words.
- step `title`: max 5 words; step `what`: max 2 sentences; step `why`: max 1 sentence; step `signal`: max 8 words.
- `marketContext`: max 2 sentences.
- Lead every field with the most valuable word. No filler, no passive voice, no "It's important to…".

File: `src/components/meridian/screens-resources-roadmap.tsx`

- Trim the focal card meta row: drop the verbose "X step walkthrough" → "X steps", keep timing chip, drop the "Open →" inline (it's already a button). Smaller meta font (10px).
- In `IndustryBriefDetail`, swap section headers to one-word labels ("Now", "Next", "Path", "Market"). Clamp step descriptions with `line-clamp-3` on `what`, `line-clamp-2` on `why`.

## 4. Verification

- Deploy the two edge functions.
- Hit `/meridian-news` and `/meridian-resources` with `curl_edge_functions`, confirm `img` fields resolve to `upload.wikimedia.org` URLs.
- Preview the Brief card + knob; confirm score is geometrically centered and the rim fills CCW.

No DB changes, no auth changes, no new dependencies.