import { hexToHsl, hslToHex } from "./colorMath.js";
import { PIGMENT_MAP, WATERCOLOR_PIGMENTS } from "../constants/pigments.js";

export function getColorName(hex) {
  // Exact match against known pigments first
  const exact = WATERCOLOR_PIGMENTS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
  if (exact) return { pigment: exact.name, friendly: exact.friendly };

  const { h, s, l } = hexToHsl(hex);

  // Handle near-neutrals
  if (s < 10 && l < 15) return { pigment: "Ivory Black", friendly: "Charcoal" };
  if (s < 10 && l < 30) return { pigment: "Payne's Grey", friendly: "Storm Cloud" };
  if (s < 10 && l < 55) return { pigment: "Neutral Tint", friendly: "Graphite" };
  if (s < 10 && l < 75) return { pigment: "Davy's Grey", friendly: "Pebble" };
  if (s < 10) return { pigment: "Chinese White", friendly: "Eggshell" };
  if (s < 20 && l > 80) return { pigment: "Buff Titanium", friendly: "Cream" };

  let bestMatch = null;
  let bestScore = Infinity;

  for (const entry of PIGMENT_MAP) {
    const [hMin, hMax] = entry.h;
    const [sMin, sMax] = entry.s;
    const [lMin, lMax] = entry.l;

    const hInRange = h >= hMin && h < hMax;
    if (!hInRange) continue;

    const sMid = (sMin + sMax) / 2;
    const lMid = (lMin + lMax) / 2;
    const sDist = Math.abs(s - sMid) / (sMax - sMin);
    const lDist = Math.abs(l - lMid) / (lMax - lMin);
    const score = sDist + lDist;

    const sInRange = s >= sMin && s <= sMax;
    const lInRange = l >= lMin && l <= lMax;
    const bonus = (sInRange ? 0 : 2) + (lInRange ? 0 : 2);

    if (score + bonus < bestScore) {
      bestScore = score + bonus;
      bestMatch = entry;
    }
  }

  if (bestMatch) return { pigment: bestMatch.pigment, friendly: bestMatch.friendly };

  if (h < 30) return { pigment: "Red Oxide", friendly: "Rusty Red" };
  if (h < 60) return { pigment: "Raw Sienna", friendly: "Amber" };
  if (h < 90) return { pigment: "Green Gold", friendly: "Spring" };
  if (h < 150) return { pigment: "Terre Verte", friendly: "Sage" };
  if (h < 210) return { pigment: "Cerulean", friendly: "Ocean" };
  if (h < 270) return { pigment: "French Ultramarine", friendly: "Twilight" };
  if (h < 330) return { pigment: "Magenta", friendly: "Berry" };
  return { pigment: "Carmine", friendly: "Ruby" };
}

export function getTemperature(hex) {
  const { h } = hexToHsl(hex);
  if (h >= 0 && h < 70) return "warm";
  if (h >= 70 && h < 160) return "neutral-warm";
  if (h >= 160 && h < 260) return "cool";
  if (h >= 260 && h < 310) return "neutral-cool";
  return "warm";
}

export function getTemperatureLabel(temp) {
  const labels = {
    "warm": "☀️ Warm",
    "neutral-warm": "🌤 Warm-leaning",
    "cool": "❄️ Cool",
    "neutral-cool": "🌙 Cool-leaning"
  };
  return labels[temp] || temp;
}

export function generatePalettes(hex) {
  const { h, s, l } = hexToHsl(hex);
  return [
    {
      name: "Calm & Cohesive",
      theory: "Analogous",
      colors: [
        hslToHex((h - 30 + 360) % 360, s, l),
        hex,
        hslToHex((h + 30) % 360, s, l),
      ],
      explain: {
        title: "Why these feel peaceful together",
        body: "These colors sit next to each other on the color wheel — like neighbors. They share pigment \"DNA\" so they never clash. In watercolor, they blend beautifully on wet paper without turning muddy. Great for: skies, water, foliage, gentle mood pieces.",
        tip: "Try painting wet-on-wet with these. Let them bleed into each other — the transitions will be naturally smooth."
      }
    },
    {
      name: "Bold Contrast",
      theory: "Complementary",
      colors: [
        hex,
        hslToHex((h + 180) % 360, s, l),
      ],
      explain: {
        title: "Why these pop against each other",
        body: "These colors are opposites on the color wheel. Each makes the other look more vivid and alive. Your eye loves this contrast because the two colors contain none of the same pigment. Use one as your main color and the other as a small accent — don't use them 50/50.",
        tip: "In watercolor, be careful mixing these directly — opposites create grey or brown when blended. Keep them in separate areas of your painting."
      }
    },
    {
      name: "Rich & Balanced",
      theory: "Split Complementary",
      colors: [
        hex,
        hslToHex((h + 150) % 360, s, l),
        hslToHex((h + 210) % 360, s, l),
      ],
      explain: {
        title: "Why this feels dynamic but stable",
        body: "Instead of using the exact opposite color, we use the two colors next to the opposite. You still get energy and contrast, but it's less intense — more forgiving. This is often the easiest palette for beginners to make look great.",
        tip: "Use your main color for 60% of the painting, one accent for 30%, and the last for 10%. This ratio almost always works."
      }
    },
    {
      name: "Vibrant Trio",
      theory: "Triadic",
      colors: [
        hex,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
      ],
      explain: {
        title: "Why this feels energetic",
        body: "Three colors equally spaced around the wheel — like a triangle. This creates maximum variety while still being harmonious. It can feel playful or dramatic depending on how dark or light you go.",
        tip: "This palette is bold. In watercolor, try using diluted (more water) versions of two colors and a concentrated version of one. Too many saturated colors at once can feel chaotic."
      }
    },
  ];
}
