/*
 * Pin templates: each template is a pure drawing function that renders a
 * complete Pinterest asset onto a canvas 2D context.
 *
 * Every template receives (ctx, spec) where spec is:
 *   { w, h, title, subtitle, brand, cta, palette, photo }
 * palette: { bg, bg2, text, accent, accentText }
 * photo:   HTMLImageElement or null
 */

const PALETTES = [
  // Beaches A1A brand — logo blues from the A1A style guide (PMS 2391 / PMS 305),
  // cream and deep-slate pulled from the BeachesA1A design system PDF
  { name: "Beaches A1A — Ocean", bg: "#28A1C6", bg2: "#52D1EF", text: "#ffffff", accent: "#FAF3E7", accentText: "#1B7FA3" },
  { name: "Beaches A1A — Sand",  bg: "#FDFAF4", bg2: "#D9F0F8", text: "#1D4E5E", accent: "#28A1C6", accentText: "#ffffff" },
  { name: "Berry Pop",     bg: "#7a1131", bg2: "#b91d47", text: "#ffffff", accent: "#ffc857", accentText: "#3a0f1e" },
  { name: "Fresh Sage",    bg: "#e9efe6", bg2: "#cfe0c3", text: "#2f3e2e", accent: "#4a7c59", accentText: "#ffffff" },
  { name: "Midnight Gold", bg: "#101828", bg2: "#1d2a44", text: "#f5f1e8", accent: "#d4a548", accentText: "#101828" },
  { name: "Peach Cream",   bg: "#fff1e6", bg2: "#ffd9c0", text: "#5b3a29", accent: "#e07a5f", accentText: "#ffffff" },
  { name: "Ocean Air",     bg: "#eaf4f4", bg2: "#bfe0e2", text: "#1d3557", accent: "#457b9d", accentText: "#ffffff" },
  { name: "Bold Coral",    bg: "#ff5a5f", bg2: "#ff7e6b", text: "#ffffff", accent: "#2b2d42", accentText: "#ffffff" },
];

/* ---------- text helpers ---------- */

function wrapLines(ctx, text, maxWidth) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/* Find the largest font size (<= max) whose wrapped text fits the box. */
function fitText(ctx, text, maxWidth, maxHeight, { max, min, weight, family, lineHeight }) {
  for (let size = max; size >= min; size -= 2) {
    ctx.font = `${weight} ${size}px ${family}`;
    const lines = wrapLines(ctx, text, maxWidth);
    if (lines.length * size * lineHeight <= maxHeight) {
      return { size, lines };
    }
  }
  ctx.font = `${weight} ${min}px ${family}`;
  return { size: min, lines: wrapLines(ctx, text, maxWidth) };
}

function drawLines(ctx, lines, x, startY, size, lineHeight) {
  lines.forEach((line, i) => {
    ctx.fillText(line, x, startY + i * size * lineHeight);
  });
  return startY + lines.length * size * lineHeight;
}

function drawPill(ctx, text, cx, cy, fontSize, fill, textFill) {
  ctx.font = `700 ${fontSize}px ${SANS}`;
  const padX = fontSize * 1.2;
  const w = ctx.measureText(text).width + padX * 2;
  const h = fontSize * 2.1;
  ctx.fillStyle = fill;
  roundRect(ctx, cx - w / 2, cy - h / 2, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = textFill;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cx, cy + fontSize * 0.06);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* Draw an image covering the given rect (like CSS background-size: cover). */
function drawCover(ctx, img, x, y, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  ctx.restore();
}

/* Fill a rect with the photo, or a diagonal-stripe pattern when there is none. */
function drawPhotoOrPattern(ctx, spec, x, y, w, h) {
  if (spec.photo) {
    drawCover(ctx, spec.photo, x, y, w, h);
    return;
  }
  const p = spec.palette;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = p.bg2;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = p.bg;
  ctx.lineWidth = w * 0.02;
  ctx.globalAlpha = 0.5;
  for (let sx = x - h; sx < x + w + h; sx += w * 0.12) {
    ctx.beginPath();
    ctx.moveTo(sx, y);
    ctx.lineTo(sx + h * 0.5, y + h);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

// Body copy follows the A1A style guide: Gotham first, Helvetica as fallback
const SANS = 'Gotham, "Helvetica Neue", Helvetica, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

/* ---------- templates ---------- */

function templateBoldBlocks(ctx, spec) {
  const { w, h, palette: p } = spec;
  const pad = w * 0.09;

  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);

  // accent corner shapes
  ctx.fillStyle = p.accent;
  ctx.fillRect(0, 0, w, h * 0.012);
  ctx.beginPath();
  ctx.arc(w, 0, w * 0.28, 0, Math.PI * 2);
  ctx.globalAlpha = 0.25;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // brand chip at top
  if (spec.brand) {
    ctx.font = `700 ${w * 0.032}px ${SANS}`;
    ctx.fillStyle = p.accent;
    ctx.fillText(spec.brand.toUpperCase(), pad, pad + w * 0.032);
  }

  // budget the vertical space so title/subtitle never collide with the CTA,
  // whatever the aspect ratio
  const titleTop = h * 0.2;
  const pillFont = w * 0.036;
  const pillH = pillFont * 2.1;
  const contentBottom = spec.cta ? h - pad - pillH - h * 0.035 : h - pad;

  // title
  const fit = fitText(ctx, spec.title, w - pad * 2, (contentBottom - titleTop) * 0.6, {
    max: w * 0.115, min: w * 0.05, weight: 800, family: SANS, lineHeight: 1.12,
  });
  ctx.fillStyle = p.text;
  ctx.font = `800 ${fit.size}px ${SANS}`;
  const afterTitle = drawLines(ctx, fit.lines, pad, titleTop + fit.size, fit.size, 1.12);

  // accent underline bar
  ctx.fillStyle = p.accent;
  ctx.fillRect(pad, afterTitle + h * 0.012, w * 0.22, h * 0.012);

  // subtitle
  if (spec.subtitle) {
    const subTop = afterTitle + h * 0.06;
    const sub = fitText(ctx, spec.subtitle, w - pad * 2, Math.max(contentBottom - subTop, h * 0.05), {
      max: w * 0.042, min: w * 0.028, weight: 400, family: SANS, lineHeight: 1.4,
    });
    ctx.fillStyle = p.text;
    ctx.globalAlpha = 0.85;
    ctx.font = `400 ${sub.size}px ${SANS}`;
    drawLines(ctx, sub.lines, pad, subTop + sub.size, sub.size, 1.4);
    ctx.globalAlpha = 1;
  }

  // CTA pill at bottom
  if (spec.cta) {
    drawPill(ctx, spec.cta, w / 2, h - pad - pillH / 2, pillFont, p.accent, p.accentText);
  }
}

function templateGradientGlow(ctx, spec) {
  const { w, h, palette: p } = spec;
  const pad = w * 0.1;

  const grad = ctx.createLinearGradient(0, 0, w * 0.6, h);
  grad.addColorStop(0, p.bg2);
  grad.addColorStop(1, p.bg);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // floating translucent circles
  const circles = [
    [w * 0.12, h * 0.12, w * 0.1],
    [w * 0.9, h * 0.3, w * 0.16],
    [w * 0.18, h * 0.85, w * 0.13],
    [w * 0.85, h * 0.9, w * 0.08],
  ];
  ctx.fillStyle = p.accent;
  for (const [cx, cy, r] of circles) {
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // small accent label
  if (spec.brand) {
    drawPill(ctx, spec.brand, w / 2, h * 0.12, w * 0.026, p.accent, p.accentText);
  }

  // centered title
  const fit = fitText(ctx, spec.title, w - pad * 2, h * 0.38, {
    max: w * 0.105, min: w * 0.05, weight: 800, family: SANS, lineHeight: 1.15,
  });
  const blockH = fit.lines.length * fit.size * 1.15;
  const titleY = h * 0.5 - blockH / 2 + fit.size * 0.8;
  ctx.fillStyle = p.text;
  ctx.font = `800 ${fit.size}px ${SANS}`;
  ctx.textAlign = "center";
  const afterTitle = drawLines(ctx, fit.lines, w / 2, titleY, fit.size, 1.15);

  if (spec.subtitle) {
    const sub = fitText(ctx, spec.subtitle, w - pad * 2.4, h * 0.12, {
      max: w * 0.038, min: w * 0.026, weight: 400, family: SANS, lineHeight: 1.4,
    });
    ctx.fillStyle = p.text;
    ctx.globalAlpha = 0.85;
    ctx.font = `400 ${sub.size}px ${SANS}`;
    ctx.textAlign = "center";
    drawLines(ctx, sub.lines, w / 2, afterTitle + h * 0.04, sub.size, 1.4);
    ctx.globalAlpha = 1;
  }

  if (spec.cta) {
    ctx.font = `700 ${w * 0.03}px ${SANS}`;
    ctx.fillStyle = p.accent;
    ctx.textAlign = "center";
    ctx.fillText(spec.cta.toUpperCase() + "  →", w / 2, h * 0.92);
  }
}

function templateMinimalFrame(ctx, spec) {
  const { w, h, palette: p } = spec;
  const pad = w * 0.12;

  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);

  // thin double frame
  ctx.strokeStyle = p.text;
  ctx.lineWidth = Math.max(2, w * 0.003);
  ctx.strokeRect(w * 0.05, w * 0.05, w * 0.9, h - w * 0.1);
  ctx.strokeStyle = p.accent;
  ctx.strokeRect(w * 0.065, w * 0.065, w * 0.87, h - w * 0.13);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // small brand at top
  if (spec.brand) {
    ctx.font = `600 ${w * 0.026}px ${SANS}`;
    ctx.fillStyle = p.text;
    ctx.globalAlpha = 0.7;
    ctx.fillText(spec.brand.toUpperCase().split("").join(" "), w / 2, h * 0.14);
    ctx.globalAlpha = 1;
  }

  // serif title, centered
  const fit = fitText(ctx, spec.title, w - pad * 2, h * 0.4, {
    max: w * 0.095, min: w * 0.045, weight: 700, family: SERIF, lineHeight: 1.22,
  });
  const blockH = fit.lines.length * fit.size * 1.22;
  const titleY = h * 0.47 - blockH / 2 + fit.size * 0.8;
  ctx.fillStyle = p.text;
  ctx.font = `700 ${fit.size}px ${SERIF}`;
  const afterTitle = drawLines(ctx, fit.lines, w / 2, titleY, fit.size, 1.22);

  // diamond divider
  const dy = afterTitle + h * 0.02;
  ctx.fillStyle = p.accent;
  ctx.save();
  ctx.translate(w / 2, dy);
  ctx.rotate(Math.PI / 4);
  const d = w * 0.014;
  ctx.fillRect(-d / 2, -d / 2, d, d);
  ctx.restore();

  if (spec.subtitle) {
    const sub = fitText(ctx, spec.subtitle, w - pad * 2, h * 0.12, {
      max: w * 0.034, min: w * 0.024, weight: 400, family: SERIF, lineHeight: 1.5,
    });
    ctx.fillStyle = p.text;
    ctx.globalAlpha = 0.8;
    ctx.font = `italic 400 ${sub.size}px ${SERIF}`;
    drawLines(ctx, sub.lines, w / 2, dy + h * 0.05, sub.size, 1.5);
    ctx.globalAlpha = 1;
  }

  if (spec.cta) {
    ctx.font = `600 ${w * 0.026}px ${SANS}`;
    ctx.fillStyle = p.accent;
    ctx.fillText("— " + spec.cta.toUpperCase() + " —", w / 2, h * 0.88);
  }
}

function templatePhotoOverlay(ctx, spec) {
  const { w, h, palette: p } = spec;
  const pad = w * 0.09;

  drawPhotoOrPattern(ctx, spec, 0, 0, w, h);

  // dark scrim from bottom for legibility
  const scrim = ctx.createLinearGradient(0, h * 0.25, 0, h);
  scrim.addColorStop(0, "rgba(10, 10, 14, 0)");
  scrim.addColorStop(0.55, "rgba(10, 10, 14, 0.62)");
  scrim.addColorStop(1, "rgba(10, 10, 14, 0.85)");
  ctx.fillStyle = scrim;
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // brand chip top-left
  if (spec.brand) {
    ctx.font = `700 ${w * 0.028}px ${SANS}`;
    const bw = ctx.measureText(spec.brand).width + w * 0.05;
    ctx.fillStyle = "rgba(10, 10, 14, 0.55)";
    roundRect(ctx, pad, pad, bw, w * 0.075, w * 0.0375);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(spec.brand, pad + w * 0.025, pad + w * 0.05);
  }

  // title anchored to the bottom
  const fit = fitText(ctx, spec.title, w - pad * 2, h * 0.3, {
    max: w * 0.1, min: w * 0.05, weight: 800, family: SANS, lineHeight: 1.12,
  });
  const blockH = fit.lines.length * fit.size * 1.12;

  let bottomY = h - pad;
  if (spec.cta) bottomY -= w * 0.11;

  let subLines = null, subSize = 0;
  if (spec.subtitle) {
    const sub = fitText(ctx, spec.subtitle, w - pad * 2, h * 0.1, {
      max: w * 0.036, min: w * 0.026, weight: 400, family: SANS, lineHeight: 1.4,
    });
    subLines = sub.lines;
    subSize = sub.size;
    bottomY -= sub.lines.length * sub.size * 1.4 + h * 0.015;
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 ${fit.size}px ${SANS}`;
  const titleStart = bottomY - blockH + fit.size;
  const afterTitle = drawLines(ctx, fit.lines, pad, titleStart, fit.size, 1.12);

  if (subLines) {
    ctx.globalAlpha = 0.9;
    ctx.font = `400 ${subSize}px ${SANS}`;
    drawLines(ctx, subLines, pad, afterTitle + h * 0.01, subSize, 1.4);
    ctx.globalAlpha = 1;
  }

  if (spec.cta) {
    drawPill(ctx, spec.cta, pad + w * 0.12, h - pad - w * 0.03, w * 0.03, p.accent, p.accentText);
    ctx.textAlign = "left";
  }
}

function templatePhotoTop(ctx, spec) {
  const { w, h, palette: p } = spec;
  const pad = w * 0.09;
  const photoH = h * 0.6;

  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);
  drawPhotoOrPattern(ctx, spec, 0, 0, w, photoH);

  // accent divider between photo and text panel
  ctx.fillStyle = p.accent;
  ctx.fillRect(0, photoH - h * 0.006, w, h * 0.012);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // brand chip overlapping the photo
  if (spec.brand) {
    ctx.font = `700 ${w * 0.028}px ${SANS}`;
    const bw = ctx.measureText(spec.brand).width + w * 0.05;
    ctx.fillStyle = p.accent;
    roundRect(ctx, pad, photoH - w * 0.0375, bw, w * 0.075, w * 0.0375);
    ctx.fill();
    ctx.fillStyle = p.accentText;
    ctx.fillText(spec.brand, pad + w * 0.025, photoH + w * 0.0125);
  }

  const titleTop = photoH + h * 0.06;
  const pillFont = w * 0.034;
  const pillH = pillFont * 2.1;
  const contentBottom = spec.cta ? h - pad * 0.7 - pillH - h * 0.025 : h - pad * 0.7;

  const fit = fitText(ctx, spec.title, w - pad * 2, (contentBottom - titleTop) * 0.65, {
    max: w * 0.082, min: w * 0.042, weight: 800, family: SANS, lineHeight: 1.14,
  });
  ctx.fillStyle = p.text;
  ctx.font = `800 ${fit.size}px ${SANS}`;
  const afterTitle = drawLines(ctx, fit.lines, pad, titleTop + fit.size, fit.size, 1.14);

  if (spec.subtitle) {
    const subTop = afterTitle + h * 0.02;
    const sub = fitText(ctx, spec.subtitle, w - pad * 2, Math.max(contentBottom - subTop, h * 0.04), {
      max: w * 0.036, min: w * 0.026, weight: 400, family: SANS, lineHeight: 1.4,
    });
    ctx.fillStyle = p.text;
    ctx.globalAlpha = 0.85;
    ctx.font = `400 ${sub.size}px ${SANS}`;
    drawLines(ctx, sub.lines, pad, subTop + sub.size, sub.size, 1.4);
    ctx.globalAlpha = 1;
  }

  if (spec.cta) {
    drawPill(ctx, spec.cta, w / 2, h - pad * 0.7 - pillH / 2, pillFont, p.accent, p.accentText);
  }
}

function templatePhotoCircle(ctx, spec) {
  const { w, h, palette: p } = spec;
  const pad = w * 0.1;

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, p.bg);
  grad.addColorStop(1, p.bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // circular photo with accent ring, sized so it always fits the aspect ratio
  const r = Math.min(w * 0.34, h * 0.22);
  const cx = w / 2;
  const cy = h * 0.06 + w * 0.012 + r;
  ctx.beginPath();
  ctx.arc(cx, cy, r + w * 0.012, 0, Math.PI * 2);
  ctx.fillStyle = p.accent;
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  drawPhotoOrPattern(ctx, spec, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  if (spec.brand) {
    ctx.font = `600 ${w * 0.026}px ${SANS}`;
    ctx.fillStyle = p.text;
    ctx.globalAlpha = 0.7;
    ctx.fillText(spec.brand.toUpperCase(), w / 2, cy + r + h * 0.05);
    ctx.globalAlpha = 1;
  }

  const titleTop = cy + r + h * 0.075;
  const pillFont = w * 0.034;
  const pillH = pillFont * 2.1;
  const contentBottom = spec.cta ? h - pad - pillH - h * 0.03 : h - pad;

  const fit = fitText(ctx, spec.title, w - pad * 2, (contentBottom - titleTop) * 0.65, {
    max: w * 0.088, min: w * 0.044, weight: 800, family: SANS, lineHeight: 1.15,
  });
  ctx.fillStyle = p.text;
  ctx.font = `800 ${fit.size}px ${SANS}`;
  const afterTitle = drawLines(ctx, fit.lines, w / 2, titleTop + fit.size, fit.size, 1.15);

  if (spec.subtitle) {
    const subTop = afterTitle + h * 0.02;
    const sub = fitText(ctx, spec.subtitle, w - pad * 2.2, Math.max(contentBottom - subTop, h * 0.04), {
      max: w * 0.035, min: w * 0.025, weight: 400, family: SANS, lineHeight: 1.4,
    });
    ctx.fillStyle = p.text;
    ctx.globalAlpha = 0.85;
    ctx.font = `400 ${sub.size}px ${SANS}`;
    drawLines(ctx, sub.lines, w / 2, subTop + sub.size, sub.size, 1.4);
    ctx.globalAlpha = 1;
  }

  if (spec.cta) {
    drawPill(ctx, spec.cta, w / 2, h - pad - pillH / 2, pillFont, p.accent, p.accentText);
  }
}

function templatePhotoSplit(ctx, spec) {
  const { w, h, palette: p } = spec;
  const pad = w * 0.09;
  const textH = h * 0.38;

  // text panel on top, photo below
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, textH);
  drawPhotoOrPattern(ctx, spec, 0, textH, w, h - textH);

  // accent tab bridging the two halves
  ctx.fillStyle = p.accent;
  roundRect(ctx, w / 2 - w * 0.12, textH - h * 0.008, w * 0.24, h * 0.016, h * 0.008);
  ctx.fill();

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  if (spec.brand) {
    ctx.font = `700 ${w * 0.028}px ${SANS}`;
    ctx.fillStyle = p.accent;
    ctx.fillText(spec.brand.toUpperCase(), pad, pad * 0.8 + w * 0.028);
  }

  const titleTop = pad * 0.8 + w * 0.06;
  const contentBottom = textH - h * 0.035;

  const fit = fitText(ctx, spec.title, w - pad * 2, (contentBottom - titleTop) * 0.68, {
    max: w * 0.085, min: w * 0.042, weight: 800, family: SANS, lineHeight: 1.14,
  });
  ctx.fillStyle = p.text;
  ctx.font = `800 ${fit.size}px ${SANS}`;
  const afterTitle = drawLines(ctx, fit.lines, pad, titleTop + fit.size, fit.size, 1.14);

  if (spec.subtitle) {
    const subTop = afterTitle + h * 0.015;
    const sub = fitText(ctx, spec.subtitle, w - pad * 2, Math.max(contentBottom - subTop, h * 0.035), {
      max: w * 0.034, min: w * 0.025, weight: 400, family: SANS, lineHeight: 1.35,
    });
    ctx.fillStyle = p.text;
    ctx.globalAlpha = 0.85;
    ctx.font = `400 ${sub.size}px ${SANS}`;
    drawLines(ctx, sub.lines, pad, subTop + sub.size, sub.size, 1.35);
    ctx.globalAlpha = 1;
  }

  // CTA pill anchored inside the photo area
  if (spec.cta) {
    drawPill(ctx, spec.cta, w / 2, h - pad * 0.8 - w * 0.034, w * 0.034, p.accent, p.accentText);
  }
}

const TEMPLATES = [
  { id: "bold",     name: "Bold Blocks",   draw: templateBoldBlocks },
  { id: "gradient", name: "Gradient Glow", draw: templateGradientGlow },
  { id: "minimal",  name: "Minimal Frame", draw: templateMinimalFrame },
  { id: "photo",    name: "Photo Overlay", draw: templatePhotoOverlay },
];

const PHOTO_TEMPLATES = [
  { id: "photo-top",     name: "Photo Top Panel",  draw: templatePhotoTop },
  { id: "photo-overlay", name: "Photo Overlay",    draw: templatePhotoOverlay },
  { id: "photo-circle",  name: "Photo Circle",     draw: templatePhotoCircle },
  { id: "photo-split",   name: "Photo Split",      draw: templatePhotoSplit },
];
