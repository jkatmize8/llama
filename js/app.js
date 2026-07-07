/* Pin Studio — UI wiring: reads the form, renders each template to a canvas,
 * and offers per-asset and bulk PNG downloads. */

const SIZES = {
  standard: { w: 1000, h: 1500, label: "1000 × 1500" },
  square:   { w: 1000, h: 1000, label: "1000 × 1000" },
  tall:     { w: 1080, h: 1920, label: "1080 × 1920" },
};

const els = {
  title: document.getElementById("title"),
  subtitle: document.getElementById("subtitle"),
  brand: document.getElementById("brand"),
  cta: document.getElementById("cta"),
  palette: document.getElementById("palette"),
  size: document.getElementById("size"),
  count: document.getElementById("count"),
  photo: document.getElementById("photo"),
  generate: document.getElementById("generate"),
  downloadAll: document.getElementById("download-all"),
  gallery: document.getElementById("gallery"),
};

let uploadedPhoto = null;
let generated = []; // [{ canvas, filename }]

PALETTES.forEach((p, i) => {
  const opt = document.createElement("option");
  opt.value = String(i);
  opt.textContent = p.name;
  els.palette.appendChild(opt);
});

els.photo.addEventListener("change", () => {
  const file = els.photo.files && els.photo.files[0];
  if (!file) {
    uploadedPhoto = null;
    return;
  }
  const img = new Image();
  img.onload = () => {
    uploadedPhoto = img;
    URL.revokeObjectURL(img.src);
  };
  img.onerror = () => {
    uploadedPhoto = null;
    alert("Could not load that image — try a different file.");
  };
  img.src = URL.createObjectURL(file);
});

function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "pin";
}

function generate() {
  const title = els.title.value.trim();
  if (!title) {
    alert("Please enter a pin title.");
    els.title.focus();
    return;
  }

  const size = SIZES[els.size.value];
  const count = Math.min(Math.max(parseInt(els.count.value, 10) || 4, 2), 4);
  const spec = {
    w: size.w,
    h: size.h,
    title,
    subtitle: els.subtitle.value.trim(),
    brand: els.brand.value.trim(),
    cta: els.cta.value.trim(),
    palette: PALETTES[parseInt(els.palette.value, 10) || 0],
    photo: uploadedPhoto,
  };

  els.gallery.innerHTML = "";
  generated = [];
  const slug = slugify(title);

  TEMPLATES.slice(0, count).forEach((template, i) => {
    const canvas = document.createElement("canvas");
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext("2d");
    template.draw(ctx, spec);

    const filename = `pinterest-${slug}-${template.id}-${size.w}x${size.h}.png`;
    generated.push({ canvas, filename });

    const card = document.createElement("div");
    card.className = "pin-card";
    card.appendChild(canvas);

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `<div><div class="name"></div><div class="dims">${size.label}</div></div>`;
    meta.querySelector(".name").textContent = `${i + 1}. ${template.name}`;

    const btn = document.createElement("button");
    btn.className = "download";
    btn.textContent = "Download";
    btn.addEventListener("click", () => downloadCanvas(canvas, filename));
    meta.appendChild(btn);

    card.appendChild(meta);
    els.gallery.appendChild(card);
  });

  els.downloadAll.disabled = false;
}

function downloadCanvas(canvas, filename) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve();
      }, 150);
    }, "image/png");
  });
}

async function downloadAll() {
  for (const { canvas, filename } of generated) {
    await downloadCanvas(canvas, filename);
    // small gap so browsers don't swallow rapid consecutive downloads
    await new Promise((r) => setTimeout(r, 250));
  }
}

els.generate.addEventListener("click", generate);
els.downloadAll.addEventListener("click", downloadAll);

// Render an initial batch with the placeholder content so the app isn't empty.
generate();
