export const COLOR_THEORIES = [
  {
    id: "complementary",
    name: "Complementary",
    icon: "↔",
    offsets: [0, 180],
    explain: {
      title: "Complementary — Opposites attract",
      body: "Two colors directly across from each other on the wheel. They create the strongest possible contrast — each makes the other look more vivid and alive. Think of a red poppy against green leaves, or a golden sunset over a blue ocean. In painting, use one as your dominant color (about 80%) and the other as an accent.",
      tip: "Never mix complementary colors directly on paper — they'll cancel each other out and turn grey-brown. Instead, place them side by side and let your eye do the mixing.",
    },
  },
  {
    id: "analogous",
    name: "Analogous",
    icon: "≈",
    offsets: [-30, 0, 30],
    explain: {
      title: "Analogous — Neighbors on the wheel",
      body: "Three colors that sit side by side on the wheel. They share common pigment, so they always harmonize naturally. This creates gentle, cohesive palettes — think autumn leaves (red-orange-yellow) or a calm ocean (teal-blue-violet). These are the most forgiving palettes for beginners because it's nearly impossible to make them clash.",
      tip: "Pick one color as your dominant, one as supporting, and one as a small accent. Wet-on-wet blending works beautifully with analogous colors since the transitions are always smooth.",
    },
  },
  {
    id: "triadic",
    name: "Triadic",
    icon: "△",
    offsets: [0, 120, 240],
    explain: {
      title: "Triadic — Equal spacing, maximum variety",
      body: "Three colors equally spaced around the wheel, forming a triangle. This gives you the widest range of color variety while staying balanced. The primary triad (red, yellow, blue) is the most famous example. Triadic palettes feel energetic and playful — great for subjects with lots of visual interest.",
      tip: "Triadic palettes can feel chaotic if all three are at full intensity. Pick one to dominate (60%), one as secondary (30%), and one as a pop of accent (10%). Dilute two of the three with extra water.",
    },
  },
  {
    id: "split",
    name: "Split Comp.",
    icon: "⟨⟩",
    offsets: [0, 150, 210],
    explain: {
      title: "Split Complementary — Contrast with safety net",
      body: "Start with one color, then instead of going straight across the wheel, take the two neighbors of the opposite. You still get visual tension and contrast, but it's less extreme than true complementary — more like a 7/10 on the energy scale instead of a 10/10. This is often called the 'beginner's best friend' because it looks sophisticated but is hard to mess up.",
      tip: "Your anchor color is the star. Use it for 60% of the painting. Split the remaining 40% between the other two. This creates depth without the harshness of direct complements.",
    },
  },
  {
    id: "square",
    name: "Square",
    icon: "◻",
    offsets: [0, 90, 180, 270],
    explain: {
      title: "Square — Four-way balance",
      body: "Four colors equally spaced around the wheel, forming a square. This gives you two pairs of complementary colors. It's the richest palette possible — great for complex compositions with lots of subjects. But it's also the hardest to balance because there's so much variety competing for attention.",
      tip: "With four colors, hierarchy is everything. Make one dominant, one secondary, and use the other two as tiny accents. In watercolor, try using diluted washes of three colors and one at full saturation for your focal point.",
    },
  },
  {
    id: "warmcool",
    name: "Warm vs Cool",
    icon: "☀❄",
    offsets: null,
    explain: {
      title: "Warm vs Cool — The foundation of depth",
      body: "The wheel divides roughly into warm colors (reds, oranges, yellows) and cool colors (greens, blues, violets). Warm colors feel close and energetic — they advance toward the viewer. Cool colors feel distant and calm — they recede. Understanding this single concept will transform your paintings more than any other color theory rule.",
      tip: "Use warm colors for foreground and focal points, cool colors for backgrounds and shadows. Even within a single object, use slightly warmer tones on lit surfaces and cooler tones in shadows. This creates convincing depth with just two colors.",
    },
  },
];
