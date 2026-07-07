# BeachesA1A — Style Guide

> Coastal fine art digital prints · Neptune Beach, FL
> *"Coasting through life"*

BeachesA1A® is a small-batch coastal fine art print shop celebrating the eclectic vibe of the Atlantic Coast beach communities of Atlantic, Neptune, Jacksonville and Ponte Vedra, along the A1A Scenic & Historic Coastal Byway in Florida. Digital print downloads, sold on Etsy, $7–$12, six sizes per product.

The voice is quiet, sensory, place-specific — like someone who actually lives at the beach, not someone performing "beach vibes." The visual identity is warm sand + ocean teal, anchored by a hand-lettered logo whose underline doubles as a wave and an "A1A" letterform.

This document is the implementation reference: logo usage, color, type, voice, spacing/motion tokens, and photography direction. Treat it as the source of truth when building or styling anything under the BeachesA1A brand.

---

## 1. Logo & clearspace

Four approved logo files ship in `assets/`:

| File | Use |
|---|---|
| `logo-color.png` | Primary mark (BEACHES arc + A1A wave), full gradient color. Digital default. |
| `logo-bw.png` | Single-color black. Embossing, merch, single-color print, watermarks. |
| `logo-tagline-color.png` | Mark + "Coasting through life" in Dancing Script. Use where there's room to breathe — hero headers, packaging, the shop banner. |
| `logo-tagline-bw.png` | Same, single-color. |

**Rules:**
- Never recolor the mark. Use only the four files above — no re-rendering the wordmark in other colors or weights.
- The gradient version only ever sits on white or Warm Sand (`#F7F3EE`) backgrounds, never on a photo without a white/sand plate behind it.
- The B&W version is for single-color contexts (embossing, foil, black-and-white print materials) — not a "dark mode" swap for the color mark.
- No vector (SVG) source exists for the mark (Illustrator CS6, rasterized JPG/PDF only). Treat the PNGs as final-resolution; don't scale a small export up.

**Clearspace (recommended convention — no clearspace rule was specified in the original brand materials, flagged here as our call):** keep clearspace on all four sides equal to the cap-height of the "A" in the A1A letterform (roughly 15% of the logo's total width). Nothing else — text, edges, other marks — should sit inside that margin.

**Minimum size:** 120px wide on screen, 1 inch wide in print. Below that the wave underline and letterforms lose legibility.

**Don't:**
- Don't add drop shadows, outlines, or effects to the mark.
- Don't place the tagline lockup in a tight UI spot (nav bar, favicon, small button) — use the mark-only version there and let the tagline appear once per page, if at all.
- Don't stretch or skew.

---

## 2. Color palette + gradient

| Role | Name | Hex | Used for |
|---|---|---|---|
| Primary | Ocean Deep | `#2B8FAB` | BEACHES arc, headings, primary CTAs |
| Primary | Coastal Blue | `#3AAECC` | A1A letterform, links, hover accents |
| Accent | Sky Water | `#6DD4EC` | Wave base, gradient end stop, soft fills |
| Background | Warm Sand | `#F7F3EE` | Primary page background |
| Background | Driftwood | `#EDE6DC` | Cards, dividers, sunken surfaces |
| Text | Deep Charcoal | `#1E1E1E` | Body text, logo B&W |
| Text | Sea Mist | `#6B8A96` | Captions, secondary text |
| Surface | White | `#FFFFFF` | Cards, logo field |

Semantic aliases (see `colors_and_type.css` for the full token set): `--fg-1` (charcoal), `--fg-2` (mist), `--fg-brand` / `--bg-brand` (Ocean Deep), `--border-1` (Driftwood).

**Signature gradient**

```css
background: linear-gradient(160deg, #2B8FAB 0%, #6DD4EC 100%);
```

Reserved for the logo mark, hero treatments, full-bleed section headers, and primary CTAs. Never on body text or paragraphs. As a text fill, only on the tagline and very large display headlines (`.grad-text` — `background-clip: text`).

A soft 10%-opacity version of the same gradient (`--grad-logo-soft`) is available for subtle background washes behind cards or sections.

**Rule of thumb:** Warm Sand is the default canvas; white is for cards floating on it; Driftwood is for anything "sunken" (dividers, secondary surfaces). Charcoal and Mist are the only two text colors — no gray scale beyond them.

---

## 3. Typography scale & pairing

Three families, all Google Fonts:

- **Playfair Display** (400/500/600/700, italic 400/700) — display & headings. The "art-print catalog" voice.
- **Dancing Script** (600/700) — tagline only, plus very sparing seasonal callouts. A garnish, not a workhorse.
- **DM Sans** (300/400/500/600/700) — all body copy, UI, labels, captions.

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&family=Dancing+Script:wght@600;700&display=swap');
```

**Type scale:**

| Token | Size | Line-height | Family / weight | Use |
|---|---|---|---|---|
| `--fs-display-xl` | 56px | 1.05 | Playfair 700 | Hero headline |
| `--fs-display` | 40px | 1.1 | Playfair 700 | Page title (`h1`) |
| `--fs-h1` | 32px | 1.15 | Playfair 700 | Section title (`h2`) |
| `--fs-h2` | 24px | 1.2 | Playfair 600 | Subsection (`h3`) |
| `--fs-h3` | 18px | 1.3 | DM Sans 600 | Card / list heading (`h4`) |
| `--fs-body` | 15px | 1.65 | DM Sans 400 | Body copy |
| `--fs-body-sm` | 13px | 1.6 | DM Sans 400 | Secondary body, dense UI |
| `--fs-caption` | 12px | 1.5 | DM Sans 400 | Captions, metadata |
| `--fs-eyebrow` | 10px | 1.4 | DM Sans 500, UPPERCASE, `letter-spacing: 0.22em` | Small label above a section title |

**Pairing rule:** Playfair Display carries every heading; DM Sans carries everything else. Never pair Playfair with a different serif, and never set body copy in Playfair — it's a display-only face. Dancing Script appears at most once per screen, and only for the tagline or a deliberate seasonal flourish — never for headings or UI labels.

Letter-spacing tokens: `--ls-eyebrow: 0.22em` (eyebrows only), `--ls-tight: -0.01em` (large display type), `--ls-loose: 0.04em` (rare, wide-tracking treatments like packaging).

---

## 4. Voice & tone

BeachesA1A speaks like a local, not a marketer: *"someone who actually lives at the beach — not someone performing beach vibes."* Copy is buyer-focused (what the print does for your wall) before product-focused (what the print is).

- **Person:** implied *you*. "Bring the coast home," "wake up to the golden glow." No "I"/"we" in product copy.
- **Tone:** warm, unhurried, sensory, quietly confident. Never breathless, never salesy.
- **Casing:** Title Case for listing titles, product names, section headers. Sentence case for body copy and UI labels. ALL CAPS reserved for the `.eyebrow` label only.
- **Punctuation:** no exclamation marks in titles. Em-dashes welcome for rhythm. Ampersands fine in display contexts ("Art & Collectibles"), not in body copy.
- **Emoji:** none, ever — including social copy. Small colored dots (`.dot-ok` / `.dot-no`) and en-dashes handle visual breaks instead.
- **Numerals:** spell out one through nine in body copy; numerals for 10+ and always for prices/sizes/dimensions ("six sizes," but "$7–$12").

**Brand line ladder** — three lines, three jobs, never competing:

| Role | Line | Job | Where it lives |
|---|---|---|---|
| Tagline | Coasting through life | The feeling | Locked to the logo, Dancing Script, gradient. Never inline in body copy. |
| Secondary | Old Florida, no hurry. | The character | Banner subheads, social bios, packaging. DM Sans 500, sentence case, keep the comma. Ocean Deep or charcoal only — never Dancing Script, never a new color. |
| Positioning | the coast that faces the sunrise | The why-here | Running copy only, lowercase, paired with place names — provenance, not a slogan. |

**Listing title pattern:** `[Primary Keyword] | [Location] | [Product Type]` — e.g. *Sunrise Jetty Print | Neptune Beach Florida Wall Art | Coastal Photography Digital Download*. Keyword, then geographic anchor, then format. The pipe is intentional.

**Words to use:** evocative, place-specific, sensory (light, color, sound, texture) — "first light," "golden hour," "jetty," "tide," "horizon," "bring the coast home," "ready to download," "instant download."

**Words to avoid:**
- "Perfect gift" — banned.
- "Beautiful / stunning / amazing" — vague, no information.
- "Curated / artisanal" — interior-decorator jargon.
- Passive voice in product descriptions.
- Leading with features before benefits.

**Example body copy** (source): *"Wake up to the golden glow of Neptune Beach. This print captures the quiet hour before the world wakes, when the tide pulls back and the light turns everything warm. Available in six sizes, ready to download and print today."* Place name first, sensory verbs, no vague adjectives, practical close.

---

## 5. Spacing, radii, shadows, motion

**Spacing scale** (4px base): `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96px` (`--space-1` … `--space-9`). Section padding runs generous — roughly 45×48px (2.8rem × 3rem) — for a calm, unhurried rhythm.

**Containers:** `--container: 1200px` for marketing pages, `--container-narrow: 960px` for editorial/reference content.

**Radii:**
| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Chips, small inputs |
| `--radius-md` | 8px | Buttons |
| `--radius-lg` | 10px | Cards (default) |
| `--radius-xl` | 16px | Feature cards, modals |
| `--radius-pill` | 999px | Pills, tags |

Photo frames themselves are square (no radius) — only the card *around* a photo is rounded.

**Shadows** (warm and soft, never colored except the brand glow):
| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(30,30,30,.06)` | Subtle separation |
| `--shadow-md` | `0 2px 12px rgba(30,30,30,.08)` | Default card shadow |
| `--shadow-lg` | `0 10px 30px rgba(30,30,30,.12)` | Hover lift, modals |
| `--shadow-brand` | `0 10px 30px rgba(43,143,171,.25)` | Under primary CTAs only |

No inner shadows, no stacked shadows.

**Borders:** hairline `1px solid #EDE6DC` (Driftwood) everywhere — default border, divider color. Never charcoal, never gradient.

**Hover / press:**
- Buttons: background darkens ~8% on hover (Ocean Deep → ~`#256F87`), brand shadow intensifies; scale 0.98 on press over 100ms.
- Cards: lift on hover — `translateY(-2px)`, shadow steps `--shadow-md` → `--shadow-lg`.
- Links: bottom border transitions in from transparent to current color over 150ms (no underline flicker).
- Photo tiles: inner `<img>` scales to 1.03 on hover over 420ms, container clips. No opacity-based hovers, no skeuomorphic press effects.

**Motion:** calm and slow. Primary easing `--ease-coast: cubic-bezier(.22, .61, .36, 1)` — slow start, drifts to rest, like a wave. Durations: `150ms` (fast, UI feedback) / `240ms` (base) / `420ms` (slow, page-load fades). No bounces, no spring overshoot, no aggressive snaps.

**Transparency:** used sparingly — white cards over photographic heroes may use `backdrop-filter: blur(8px)` at 85% white fill. No glassmorphism for its own sake.

---

## 6. Photography direction

Photographic, never illustrative. Two image tracks:

1. **Real photography** — natural light, golden hour, 4×5 crop, teal/sand/coral/warm-gold palette. No people, no faces. Horizon lines, open water, coastal flora.
2. **AI-generated (Adobe Firefly)** — fine art, painterly, minimalist, boho coastal. Must be tagged "AI Art" in Etsy listings per policy.

No repeating patterns, no hand-drawn illustrations, no textures, no grain overlays — warmth comes from photography, not decoration.

**Framing:** full-bleed photographic heroes are encouraged on web. On cards, photos sit inside a 10px-radius container with a hairline border or `--shadow-md` — the photo itself stays square-cornered; only the surrounding card rounds.

No product photography currently exists in this project — placeholders should read as neutral Driftwood tiles until real photography is supplied. Photography is doing the majority of the brand's visual work, so treat sourcing/shooting to this spec as a priority, not an afterthought.

---

## Quick reference — design tokens

```css
/* Color */
--beaches-deep:  #2B8FAB;
--beaches-mid:   #3AAECC;
--beaches-light: #6DD4EC;
--black:         #1E1E1E;
--sand:          #F7F3EE;
--sand-dark:     #EDE6DC;
--mist:          #6B8A96;
--white:         #FFFFFF;
--grad-logo:     linear-gradient(160deg, #2B8FAB 0%, #6DD4EC 100%);

/* Type */
--font-display: 'Playfair Display', 'Times New Roman', serif;
--font-script:  'Dancing Script', 'Snell Roundhand', cursive;
--font-body:    'DM Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;

/* Spacing */
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px

/* Radii */
--radius-sm: 4px;  --radius-md: 8px;  --radius-lg: 10px;  --radius-xl: 16px;  --radius-pill: 999px;

/* Shadows */
--shadow-md: 0 2px 12px rgba(30,30,30,.08);
--shadow-lg: 0 10px 30px rgba(30,30,30,.12);
--shadow-brand: 0 10px 30px rgba(43,143,171,.25);

/* Motion */
--ease-coast: cubic-bezier(.22, .61, .36, 1);
150ms / 240ms / 420ms
```

## Assets referenced

- `assets/logo-color.png`, `assets/logo-bw.png`, `assets/logo-tagline-color.png`, `assets/logo-tagline-bw.png` — approved logo files.
- `_ds/beachesa1a-design-system-8bae391d-73e1-4a5d-9c3f-91d4a1dd8f39/colors_and_type.css` — full token source (this doc summarizes it; that file is canonical for exact values).
