import { hexToRgb, rgbToHex, hexToHsl, hslToHex } from "./colorMath.js";

export function watercolorMix(hex1, hex2, ratio = 0.5) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  // Subtractive-ish mixing: multiply then blend
  const mr = Math.sqrt((1 - ratio) * (c1.r / 255) ** 2 + ratio * (c2.r / 255) ** 2) * 255;
  const mg = Math.sqrt((1 - ratio) * (c1.g / 255) ** 2 + ratio * (c2.g / 255) ** 2) * 255;
  const mb = Math.sqrt((1 - ratio) * (c1.b / 255) ** 2 + ratio * (c2.b / 255) ** 2) * 255;
  // Slight desaturation to mimic pigment dulling
  const hsl = hexToHsl(rgbToHex(mr, mg, mb));
  const desat = Math.max(0, hsl.s - 6);
  return hslToHex(hsl.h, desat, hsl.l);
}

export function isMuddy(hex1, hex2) {
  const mixed = watercolorMix(hex1, hex2);
  const hsl = hexToHsl(mixed);
  const h1 = hexToHsl(hex1);
  const h2 = hexToHsl(hex2);
  const hueDiff = Math.abs(h1.h - h2.h);
  const normalizedDiff = hueDiff > 180 ? 360 - hueDiff : hueDiff;
  if (hsl.s < 22 && normalizedDiff > 60 && normalizedDiff < 170) return true;
  if (hsl.l < 30 && hsl.s < 30 && normalizedDiff > 80) return true;
  return false;
}
