# BeachesA1A Pin Studio — Pinterest Image Asset Generator

A zero-dependency, browser-based app that turns one idea into **2–4 ready-to-post
Pinterest image assets**, styled to the BeachesA1A brand (see `STYLE_GUIDE.md` as
the source of truth). Everything renders locally with the HTML5 canvas —
no build step, no server, no uploads.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Features

- **2–4 assets per batch**, from one of two template sets:
  - **Text graphics** (no photo needed):
    1. **Bold Blocks** — solid background, big stacked headline, accent bar, CTA pill
    2. **Gradient Glow** — gradient background with floating shapes, centered layout
    3. **Minimal Frame** — light background, double border frame, serif typography
    4. **Photo Overlay** — full-bleed photo with a dark scrim for legible text
  - **Photo layouts** (built around your uploaded image; a neutral Driftwood
    tile fills in if empty, per the style guide's photography direction):
    1. **Photo Top Panel** — photo on top, text panel below with a brand chip
    2. **Photo Overlay** — full-bleed photo with a dark scrim
    3. **Photo Circle** — circular photo inset with an accent ring, centered text
    4. **Photo Split** — text panel above, photo below, CTA pill on the photo
- **Pinterest-correct dimensions**: Standard Pin 1000×1500 (2:3), Square 1000×1000,
  Idea/Story Pin 1080×1920 (9:16)
- **4 brand palettes** (Ocean Deep, Warm Sand, White Card, Coastal Blue) built
  exclusively from the style guide tokens — Ocean Deep #2B8FAB, Coastal Blue
  #3AAECC, Sky Water #6DD4EC, Warm Sand #F7F3EE, Driftwood #EDE6DC, Deep
  Charcoal #1E1E1E, Sea Mist #6B8A96
- **Brand typography**: Playfair Display for every pin title, DM Sans for body
  copy and labels (eyebrows uppercase at 0.22em tracking), loaded from Google
  Fonts with system fallbacks
- Editable **title, subtitle, brand/website, and call-to-action**
- Text auto-sizes and wraps to fit each layout
- **Per-asset download** or **Download all** as PNG files with descriptive names
  (e.g. `pinterest-10-easy-meal-prep-ideas-bold-1000x1500.png`)

## Project layout

```
index.html        App shell and controls
css/style.css     UI styling
js/templates.js   Palettes + the four canvas template renderers
js/app.js         Form wiring, generation, and PNG downloads
```
