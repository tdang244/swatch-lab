# 🎨 Swatch Lab

An interactive color theory tool for watercolor painters. Pick any color, explore harmonious palettes, preview scenes, simulate pigment mixing, and learn the principles behind color relationships.

**Live demo:** https://tdang244.github.io/swatch-lab/

---

## Features

- **Color Wheel** — Explore complementary, analogous, triadic, split-complementary, square, and warm/cool theories
- **Palettes** — Auto-generated harmonious palettes with color theory explanations and watercolor tips
- **Scene Preview** — See your palette on landscape, floral, seascape, and abstract watercolor compositions
- **Mixing Lab** — Simulate subtractive pigment mixing (2 or 3 colors) with muddy-mix detection
- **Transparency** — Understand watercolor layering and how water ratio affects color

## Tech Stack

- **React 18** + **Vite**
- CSS-in-JS (inline styles, no CSS framework)
- All color math from scratch (RGB ↔ HSL ↔ hex, subtractive mixing model)

## Local Development

```bash
npm install
npm run dev
```

Then open http://localhost:5173/swatch-lab/

## Build

```bash
npm run build
```
