# Pin Studio — Pinterest Image Asset Generator

A zero-dependency, browser-based app that turns one idea into **2–4 ready-to-post
Pinterest image assets**. Everything renders locally with the HTML5 canvas —
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
  - **Photo layouts** (built around your uploaded image; a pattern fills in if empty):
    1. **Photo Top Panel** — photo on top, text panel below with a brand chip
    2. **Photo Overlay** — full-bleed photo with a dark scrim
    3. **Photo Circle** — circular photo inset with an accent ring, centered text
    4. **Photo Split** — text panel above, photo below, CTA pill on the photo
- **Pinterest-correct dimensions**: Standard Pin 1000×1500 (2:3), Square 1000×1000,
  Idea/Story Pin 1080×1920 (9:16)
- **6 color palettes** applied consistently across every template
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
