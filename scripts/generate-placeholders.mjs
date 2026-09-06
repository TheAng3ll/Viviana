/**
 * Genera las imágenes de muestra del sitio: paisajes abstractos en SVG,
 * dentro de la paleta del proyecto. Son marcadores de posición: cuando
 * Viviana suba las fotos reales, se reemplaza la ruta en content/posts.ts
 * y este script deja de usarse.
 *
 *   node scripts/generate-placeholders.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "img");

/** PRNG con semilla, para que cada corrida produzca las mismas imágenes. */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Catmull-Rom → curvas de Bézier, para que las crestas salgan suaves. */
function smoothPath(points) {
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Silueta de cerro/duna: suma de senos con distintas frecuencias. */
function ridge({ seed, w, h, baseY, amp, roughness }) {
  const rnd = mulberry32(seed);
  const octaves = [
    { f: 1, a: 1 },
    { f: 2.3, a: 0.48 },
    { f: 4.7, a: 0.22 },
    { f: 9.1, a: 0.09 },
  ];
  const phases = octaves.map(() => rnd() * Math.PI * 2);
  const tilt = (rnd() - 0.5) * amp * 1.4;
  const points = [];
  const N = 72;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    let y = 0;
    octaves.forEach((o, k) => {
      y += o.a * Math.sin(t * o.f * Math.PI * 2 * roughness + phases[k]);
    });
    points.push([t * w, baseY + y * amp + tilt * t]);
  }
  return `${smoothPath(points)} L ${w} ${h} L 0 ${h} Z`;
}

function skyStops(colors) {
  return colors
    .map((c, i) => {
      const offset = ((i / (colors.length - 1)) * 100).toFixed(1);
      return `<stop offset="${offset}%" stop-color="${c}"/>`;
    })
    .join("");
}

function scene(spec) {
  const { w, h, sky, light, layers, water, stars = 0, id } = spec;
  const horizon = water ? h * water.at : h;
  const rnd = mulberry32(spec.seed + 999);

  const ridges = layers
    .map((layer, i) =>
      `<path d="${ridge({
        seed: spec.seed + i * 37,
        w,
        h: horizon,
        baseY: horizon * layer.at,
        amp: horizon * layer.amp,
        roughness: layer.roughness ?? 1,
      })}" fill="${layer.color}" opacity="${layer.opacity ?? 1}"/>`
    )
    .join("");

  const starField = Array.from({ length: stars }, () => {
    const x = (rnd() * w).toFixed(0);
    const y = (rnd() * horizon * 0.6).toFixed(0);
    const r = (rnd() * 1.9 + 0.6).toFixed(2);
    const o = (rnd() * 0.5 + 0.2).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${o}"/>`;
  }).join("");

  const sun = light
    ? `<circle cx="${light.x * w}" cy="${light.y * horizon}" r="${light.glow * w}" fill="url(#glow-${id})"/>
       <circle cx="${light.x * w}" cy="${light.y * horizon}" r="${light.r * w}" fill="${light.color}" opacity="${light.opacity ?? 0.9}"/>`
    : "";

  const waterLayer = water
    ? `<rect x="0" y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#water-${id})"/>
       ${Array.from({ length: 7 }, (_, i) => {
         const y = horizon + (h - horizon) * ((i + 1) / 8);
         const width = w * (0.12 + rnd() * 0.34);
         const x = (light ? light.x * w : w * 0.5) - width / 2 + (rnd() - 0.5) * w * 0.14;
         return `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${width.toFixed(0)}" height="${(2 + rnd() * 3).toFixed(1)}" rx="2" fill="${water.shimmer}" opacity="${(0.22 - i * 0.025).toFixed(2)}"/>`;
       }).join("")}`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Paisaje ilustrado">
  <defs>
    <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">${skyStops(sky)}</linearGradient>
    ${light ? `<radialGradient id="glow-${id}"><stop offset="0%" stop-color="${light.color}" stop-opacity="${light.glowOpacity ?? 0.55}"/><stop offset="55%" stop-color="${light.color}" stop-opacity="0.14"/><stop offset="100%" stop-color="${light.color}" stop-opacity="0"/></radialGradient>` : ""}
    ${water ? `<linearGradient id="water-${id}" x1="0" y1="0" x2="0" y2="1">${skyStops(water.colors)}</linearGradient>` : ""}
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky-${id})"/>
  ${starField}
  ${sun}
  ${waterLayer}
  ${ridges}
</svg>
`;
}

const scenes = [
  {
    name: "amanecer",
    seed: 11,
    w: 1600, h: 1000,
    sky: ["#2c3a53", "#6b6a86", "#c98f7f", "#f0c9a4", "#f7e3c8"],
    light: { x: 0.68, y: 0.74, r: 0.045, glow: 0.3, color: "#ffd9a3", glowOpacity: 0.7 },
    layers: [
      { at: 0.78, amp: 0.05, color: "#8d8098", opacity: 0.55, roughness: 0.8 },
      { at: 0.87, amp: 0.045, color: "#5f5a72", opacity: 0.8 },
      { at: 0.96, amp: 0.035, color: "#3c3b4f", roughness: 1.4 },
    ],
  },
  {
    name: "mar",
    seed: 23,
    w: 1600, h: 1000,
    sky: ["#a8c4cf", "#cfdde0", "#eae3d6"],
    light: { x: 0.3, y: 0.42, r: 0.03, glow: 0.24, color: "#fff4de", glowOpacity: 0.55 },
    water: { at: 0.6, colors: ["#93b3bd", "#7fa3ae", "#6f95a2"], shimmer: "#f3ead9" },
    layers: [{ at: 0.98, amp: 0.02, color: "#ddd2bd", roughness: 0.6 }],
  },
  {
    name: "bosque",
    seed: 37,
    w: 1600, h: 1000,
    sky: ["#dfe5dc", "#e9ece2", "#f2f0e6"],
    layers: [
      { at: 0.55, amp: 0.09, color: "#9daa9a", opacity: 0.4, roughness: 1.2 },
      { at: 0.7, amp: 0.08, color: "#7d8d7c", opacity: 0.55, roughness: 1.5 },
      { at: 0.84, amp: 0.07, color: "#5c6d5e", opacity: 0.75, roughness: 1.8 },
      { at: 0.97, amp: 0.05, color: "#3f5044", roughness: 2.2 },
    ],
  },
  {
    name: "desierto",
    seed: 41,
    w: 1600, h: 1000,
    sky: ["#c9a9a0", "#e6c6a8", "#f4dcbd"],
    light: { x: 0.78, y: 0.3, r: 0.035, glow: 0.26, color: "#fff0cf", glowOpacity: 0.6 },
    layers: [
      { at: 0.62, amp: 0.05, color: "#d9b48d", opacity: 0.7, roughness: 0.7 },
      { at: 0.78, amp: 0.06, color: "#c79a72", opacity: 0.85, roughness: 0.6 },
      { at: 0.95, amp: 0.05, color: "#a97a58", roughness: 0.8 },
    ],
  },
  {
    name: "noche",
    seed: 53,
    w: 1600, h: 1000,
    sky: ["#141d33", "#22304c", "#37485f", "#5b6b78"],
    light: { x: 0.24, y: 0.22, r: 0.028, glow: 0.2, color: "#e8eefb", opacity: 0.95, glowOpacity: 0.4 },
    stars: 90,
    layers: [
      { at: 0.8, amp: 0.06, color: "#28374f", roughness: 1.1 },
      { at: 0.93, amp: 0.05, color: "#182236", roughness: 1.5 },
    ],
  },
  {
    name: "niebla",
    seed: 67,
    w: 1600, h: 1000,
    sky: ["#d5dcd8", "#e3e7e0", "#eeefe7"],
    layers: [
      { at: 0.5, amp: 0.07, color: "#aab5ae", opacity: 0.28, roughness: 1 },
      { at: 0.66, amp: 0.06, color: "#93a099", opacity: 0.35, roughness: 1.3 },
      { at: 0.82, amp: 0.055, color: "#78877f", opacity: 0.45, roughness: 1.6 },
      { at: 0.98, amp: 0.04, color: "#5d6b64", opacity: 0.6, roughness: 2 },
    ],
  },
  {
    name: "atardecer",
    seed: 71,
    w: 1600, h: 1000,
    sky: ["#4c4666", "#96697b", "#d38f74", "#f2c396"],
    light: { x: 0.5, y: 0.55, r: 0.05, glow: 0.34, color: "#ffd2a0", glowOpacity: 0.75 },
    water: { at: 0.66, colors: ["#8a6a78", "#6d5566", "#4f4054"], shimmer: "#f7c99b" },
    layers: [{ at: 0.99, amp: 0.015, color: "#3a3145", roughness: 0.7 }],
  },
  {
    name: "montana",
    seed: 89,
    w: 1600, h: 1000,
    sky: ["#b6c6d4", "#d3dde3", "#e8eae4"],
    layers: [
      { at: 0.48, amp: 0.13, color: "#9fb0c0", opacity: 0.45, roughness: 1.4 },
      { at: 0.66, amp: 0.12, color: "#7e91a4", opacity: 0.65, roughness: 1.7 },
      { at: 0.85, amp: 0.1, color: "#5b6c7e", opacity: 0.85, roughness: 2 },
      { at: 0.99, amp: 0.06, color: "#3e4b59", roughness: 2.4 },
    ],
  },
  {
    name: "lago",
    seed: 97,
    w: 1200, h: 1500,
    sky: ["#c2d3d2", "#dde5df", "#eceee5"],
    light: { x: 0.62, y: 0.28, r: 0.04, glow: 0.3, color: "#fdf6e4", glowOpacity: 0.5 },
    water: { at: 0.62, colors: ["#93aeac", "#7d9a99", "#6a8686"], shimmer: "#f0f2e6" },
    layers: [{ at: 0.98, amp: 0.03, color: "#5d7370", opacity: 0.7, roughness: 1.2 }],
  },
  {
    name: "campo",
    seed: 103,
    w: 1200, h: 1500,
    sky: ["#9db6c4", "#ccd6cf", "#eadfc2"],
    light: { x: 0.35, y: 0.24, r: 0.038, glow: 0.28, color: "#fff2cd", glowOpacity: 0.6 },
    layers: [
      { at: 0.62, amp: 0.04, color: "#c7c191", opacity: 0.7, roughness: 0.9 },
      { at: 0.78, amp: 0.045, color: "#b0ab77", opacity: 0.85, roughness: 1.1 },
      { at: 0.95, amp: 0.04, color: "#8e8a5c", roughness: 1.4 },
    ],
  },
  {
    name: "costa",
    seed: 113,
    w: 1200, h: 1500,
    sky: ["#3f4a63", "#7a7186", "#c3937f"],
    light: { x: 0.2, y: 0.62, r: 0.03, glow: 0.22, color: "#ffd8ac", glowOpacity: 0.6 },
    water: { at: 0.72, colors: ["#6a6a80", "#54566b", "#3f4257"], shimmer: "#f0bf95" },
    layers: [
      { at: 0.66, amp: 0.09, color: "#4b4a60", opacity: 0.85, roughness: 1.9 },
      { at: 0.99, amp: 0.02, color: "#2f3143", roughness: 1 },
    ],
  },
  {
    name: "camino",
    seed: 127,
    w: 1600, h: 1000,
    sky: ["#c8b9a4", "#dfd2ba", "#efe6d3"],
    light: { x: 0.52, y: 0.36, r: 0.03, glow: 0.3, color: "#fff6e2", glowOpacity: 0.65 },
    layers: [
      { at: 0.7, amp: 0.045, color: "#b3a58e", opacity: 0.6, roughness: 0.8 },
      { at: 0.85, amp: 0.05, color: "#93876f", opacity: 0.8, roughness: 1.1 },
      { at: 0.99, amp: 0.035, color: "#6f6555", roughness: 1.5 },
    ],
  },
  {
    // Marcador de posición para el retrato: luz suave, sin paisaje.
    name: "retrato",
    seed: 149,
    w: 1000, h: 1250,
    sky: ["#b9ab97", "#cdbfa8", "#ded2ba"],
    light: { x: 0.5, y: 0.42, r: 0.16, glow: 0.46, color: "#f6e9d2", opacity: 0.5, glowOpacity: 0.6 },
    layers: [{ at: 1.02, amp: 0.09, color: "#8f8471", opacity: 0.55, roughness: 0.7 }],
  },
];

await mkdir(OUT, { recursive: true });
for (const spec of scenes) {
  const svg = scene({ ...spec, id: spec.name });
  await writeFile(join(OUT, `${spec.name}.svg`), svg, "utf8");
  console.log(`  public/img/${spec.name}.svg`);
}
console.log(`\n${scenes.length} imágenes de muestra generadas.`);
