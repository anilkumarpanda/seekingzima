/** FNV-32 hash */
export function hash32(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/** Mulberry32 PRNG */
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Collect client-side entropy */
export function collectEntropy(): string {
  const parts: (string | number)[] = [
    Date.now(),
    typeof navigator !== 'undefined' ? navigator.userAgent : '',
    typeof screen !== 'undefined' ? screen.width : 0,
    typeof screen !== 'undefined' ? screen.height : 0,
    typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1,
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : '',
    typeof navigator !== 'undefined' ? navigator.language : '',
    typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 0 : 0,
    typeof navigator !== 'undefined'
      ? (navigator as any).deviceMemory || 0
      : 0,
    typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0,
    Math.random(),
    Math.random(),
  ];
  return parts.join('|');
}

/** Derive N independent seeds from one entropy string */
export function deriveSeeds(entropy: string, count: number): number[] {
  return Array.from({ length: count }, (_, i) => hash32(entropy + '|' + i));
}

/** Generate a color palette from a seed */
export function generatePalette(seed: number) {
  const rng = mulberry32(seed);
  const hue = Math.floor(rng() * 360);
  const sat = 30 + Math.floor(rng() * 40);

  return {
    bg: `hsl(${hue}, ${sat}%, 8%)`,
    colors: [
      `hsl(${hue}, ${sat + 10}%, 55%)`,
      `hsl(${(hue + 40) % 360}, ${sat + 5}%, 45%)`,
      `hsl(${(hue + 80) % 360}, ${sat}%, 60%)`,
      `hsl(${(hue + 180) % 360}, ${sat + 15}%, 50%)`,
    ],
  };
}

/** Flow field algorithm */
function flowField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rng: () => number,
  palette: ReturnType<typeof generatePalette>
) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);

  const lines = 120 + Math.floor(rng() * 80);
  const steps = 60 + Math.floor(rng() * 40);
  const scale = 0.003 + rng() * 0.004;
  const phaseX = rng() * Math.PI * 2;
  const phaseY = rng() * Math.PI * 2;

  for (let i = 0; i < lines; i++) {
    let x = rng() * w;
    let y = rng() * h;
    const color = palette.colors[Math.floor(rng() * palette.colors.length)];
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.3 + rng() * 0.4;
    ctx.lineWidth = 0.5 + rng() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let s = 0; s < steps; s++) {
      const angle =
        Math.sin(x * scale + phaseX) * Math.cos(y * scale + phaseY) *
        Math.PI * 2;
      x += Math.cos(angle) * 2;
      y += Math.sin(angle) * 2;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Radial glow overlay
  const gx = rng() * w;
  const gy = rng() * h;
  const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, w * 0.4);
  grad.addColorStop(0, palette.colors[0].replace(')', ', 0.15)').replace('hsl', 'hsla'));
  grad.addColorStop(1, 'transparent');
  ctx.globalAlpha = 1;
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

/** Mesh web algorithm */
function meshWeb(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rng: () => number,
  palette: ReturnType<typeof generatePalette>
) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);

  const pointCount = 50 + Math.floor(rng() * 60);
  const threshold = Math.min(w, h) * (0.15 + rng() * 0.1);
  const points = Array.from({ length: pointCount }, () => ({
    x: rng() * w,
    y: rng() * h,
  }));

  // Draw connections
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < threshold) {
        ctx.strokeStyle = palette.colors[i % palette.colors.length];
        ctx.globalAlpha = 0.15 + (1 - dist / threshold) * 0.4;
        ctx.lineWidth = 0.5 + (1 - dist / threshold) * 1.5;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  for (const p of points) {
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = palette.colors[Math.floor(rng() * palette.colors.length)];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2 + rng() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Organic waves algorithm */
function organicWaves(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rng: () => number,
  palette: ReturnType<typeof generatePalette>
) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);

  const layers = 5 + Math.floor(rng() * 4);
  for (let l = 0; l < layers; l++) {
    const amplitude = 20 + rng() * 60;
    const frequency = 0.002 + rng() * 0.006;
    const phase = rng() * Math.PI * 2;
    const yBase = (h / (layers + 1)) * (l + 1);
    const color = palette.colors[l % palette.colors.length];

    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.4 + rng() * 0.3;
    ctx.lineWidth = 1 + rng() * 2;
    ctx.beginPath();

    for (let x = 0; x <= w; x += 2) {
      const y =
        yBase +
        Math.sin(x * frequency + phase) * amplitude +
        Math.sin(x * frequency * 2.3 + phase * 1.5) * (amplitude * 0.3);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Fill below
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.globalAlpha = 0.05 + rng() * 0.08;
    ctx.fillStyle = color;
    ctx.fill();
  }
}

/** Particle bloom algorithm */
function particleBloom(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rng: () => number,
  palette: ReturnType<typeof generatePalette>
) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);

  const cx = w * (0.3 + rng() * 0.4);
  const cy = h * (0.3 + rng() * 0.4);
  const particles = 300 + Math.floor(rng() * 200);

  for (let i = 0; i < particles; i++) {
    const angle = rng() * Math.PI * 2;
    const dist = rng() * Math.min(w, h) * 0.5;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const radius = 1 + rng() * 4;
    const color = palette.colors[Math.floor(rng() * palette.colors.length)];

    ctx.globalAlpha = 0.2 + rng() * 0.5;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Radial gradient overlay
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.4);
  grad.addColorStop(0, palette.colors[0].replace(')', ', 0.2)').replace('hsl', 'hsla'));
  grad.addColorStop(1, 'transparent');
  ctx.globalAlpha = 1;
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

/** Voronoi scatter algorithm */
function voronoiScatter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rng: () => number,
  palette: ReturnType<typeof generatePalette>
) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);

  const pointCount = 15 + Math.floor(rng() * 20);
  const points = Array.from({ length: pointCount }, () => ({
    x: rng() * w,
    y: rng() * h,
    color: palette.colors[Math.floor(rng() * palette.colors.length)],
  }));

  // Simple pixel-based voronoi (sample every 4px for perf)
  const step = 4;
  for (let px = 0; px < w; px += step) {
    for (let py = 0; py < h; py += step) {
      let minDist = Infinity;
      let nearest = points[0];
      for (const p of points) {
        const d = (px - p.x) ** 2 + (py - p.y) ** 2;
        if (d < minDist) {
          minDist = d;
          nearest = p;
        }
      }
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = nearest.color;
      ctx.fillRect(px, py, step, step);
    }
  }

  // Draw nodes
  for (const p of points) {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

const algorithms = [flowField, meshWeb, organicWaves, particleBloom, voronoiScatter];

/** Render art on a canvas element */
export function renderArt(canvas: HTMLCanvasElement, seed: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const palette = generatePalette(seed);
  const rng = mulberry32(seed);
  const algoIndex = seed % 5;
  algorithms[algoIndex](ctx, w, h, rng, palette);
  ctx.globalAlpha = 1;
}

/** Render art from a static seed (for content cover art) */
export function renderStaticArt(canvas: HTMLCanvasElement, artSeed: number) {
  renderArt(canvas, artSeed);
}
