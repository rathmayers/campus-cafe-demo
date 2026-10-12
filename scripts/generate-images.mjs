// Generates all demo images at build time (so the repository stays small).
//   src/assets/*.jpg          sources for the AFTER version (Astro optimises them)
//   public/before/img/*.png   huge, unoptimised PNGs for the BEFORE version
// Images are illustrations drawn from code: no copyright issues.
import sharp from 'sharp';
import { mkdir, readFile, access } from 'node:fs/promises';

const W = 3600, H = 2400;
const root = new URL('../', import.meta.url);
const out = (p) => new URL(p, root).pathname;

// deterministic random numbers
let seed = 7;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const ri = (a, b) => Math.floor(a + rnd() * (b - a));

const grad = (c1, c2) => `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>`;
const svg = (body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${body}</svg>`);

function cup(cx, cy, s, col, saucer) {
  return `<ellipse cx="${cx}" cy="${cy + s}" rx="${s * 1.6}" ry="${s * 0.25}" fill="${saucer}"/>
  <rect x="${cx - s}" y="${cy - s * 0.6}" width="${2 * s}" height="${s * 1.5}" rx="${s * 0.5}" fill="${col}"/>
  <ellipse cx="${cx + s * 1.1}" cy="${cy + s * 0.15}" rx="${s * 0.35}" ry="${s * 0.35}" fill="none" stroke="${col}" stroke-width="${s * 0.16}"/>
  <ellipse cx="${cx}" cy="${cy - s * 0.575}" rx="${s * 0.9}" ry="${s * 0.225}" fill="#5c3a21"/>
  <ellipse cx="${cx}" cy="${cy - s * 0.575}" rx="${s * 0.35}" ry="${s * 0.125}" fill="#dec4a0"/>`;
}

function blobs(n, rmin, rmax, colors, ymax = H) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle cx="${ri(0, W)}" cy="${ri(0, ymax)}" r="${ri(rmin, rmax)}" fill="${colors[ri(0, colors.length)]}"/>`;
  return s;
}

async function layered(back, blur, front) {
  const bg = await sharp(svg(back)).blur(blur).png().toBuffer();
  return sharp(bg).composite(front ? [{ input: svg(front) }] : []).raw().toBuffer({ resolveWithObject: true });
}

function grain({ data, info }, amount) {
  for (let i = 0; i < data.length; i += info.channels * 3) {
    const n = ri(-amount, amount);
    for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, data[i + c] + n));
  }
  return sharp(data, { raw: info });
}

const motifs = {
  hero: async () => grain(await layered(
    grad('#3a261c', '#8c6040') + blobs(14, 60, 220, ['#ffd696'], H / 2), 60,
    `<rect y="${H * 0.68}" width="${W}" height="${H * 0.32}" fill="#603e28"/>` + cup(W * 0.35, H * 0.6, 260, '#f5f0e8', '#e6e0d6') + cup(W * 0.64, H * 0.64, 200, '#c45c3e', '#e6e0d6')), 26),
  latte: async () => grain(await layered(grad('#ece0cd', '#c6ac8c'), 0.3, cup(W * 0.5, H * 0.5, 520, '#faf8f4', '#eee8de')), 18),
  pastry: async () => {
    let s = '';
    for (let k = 0; k < 7; k++) { const a = Math.PI * (0.15 + k * 0.12); s += `<ellipse cx="${W * 0.5 + Math.cos(a) * 700}" cy="${H * 0.55 - Math.sin(a) * 280}" rx="330" ry="210" fill="rgb(${200 - k * 6},${128 - k * 4},48)"/>`; }
    return grain(await layered(grad('#f6eee2', '#d6c4aa') + s, 6), 18);
  },
  event: async () => grain(await layered(
    grad('#202c46', '#463460') + blobs(40, 20, 90, ['#ffc878', '#ff8ca0', '#8cc8ff']), 25,
    `<rect x="${W * 0.3}" y="${H * 0.55}" width="${W * 0.4}" height="${H * 0.07}" fill="#14141e"/><ellipse cx="${W * 0.5}" cy="${H * 0.395}" rx="${W * 0.03}" ry="${H * 0.045}" fill="#14141e"/><rect x="${W * 0.485}" y="${H * 0.43}" width="${W * 0.03}" height="${H * 0.13}" fill="#14141e"/>`), 22),
};

async function exists(p) { try { await access(p); return true; } catch { return false; } }

await mkdir(out('src/assets'), { recursive: true });
await mkdir(out('public/before/img'), { recursive: true });

if (await exists(out('public/before/img/special.png')) && !process.argv.includes('--force')) {
  console.log('[images] already generated (use --force to regenerate)');
  process.exit(0);
}

const text = JSON.parse(await readFile(out('scripts/text-paths.json'), 'utf8'));
const paths = (list) => list.map((p) => `<path d="${p.d}" fill="${p.fill}"/>`).join('');

for (const [name, make] of Object.entries(motifs)) {
  const img = await make();
  const buf = await img.png().toBuffer();
  await sharp(buf).jpeg({ quality: 88 }).toFile(out(`src/assets/${name}.jpg`));
  await sharp(buf).png({ compressionLevel: 9, palette: false }).toFile(out(`public/before/img/${name}.png`));
  if (name === 'latte') {
    // Text baked into an image (BEFORE only)
    await sharp(buf).resize(1800, 1200)
      .composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200">${paths(text.special)}</svg>`) }])
      .png().toFile(out('public/before/img/special.png'));
  }
  console.log(`[images] ${name}`);
}
// Contact details as an image (BEFORE only)
await sharp({ create: { width: 1000, height: 260, channels: 3, background: '#faf7f2' } })
  .composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="260">${paths(text.contact)}</svg>`) }])
  .png().toFile(out('public/before/img/contact.png'));
console.log('[images] done');
