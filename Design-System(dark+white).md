Sketch Aesthetic – Complete Design System (Light + Dark)

A unified design system for the Sketch Aesthetic UI/UX.
Hand-drawn precision meets digital minimalism.
Light and Dark themes share the same structure and rules.

⸻

Philosophy

Hand-drawn precision meets digital minimalism.

Inspired by blueprints, engineering notebooks, and rough sketches.

Core rules:
• Hard edges, no blur
• No glow, no soft gradients
• Intentional imperfections
• High contrast
• Feels printed, not digital

Dark mode is inverted ink, not neon-dark.

⸻

Theme Tokens

Light Theme

CSS:
:root {
–background: #ffffff;
–foreground: #000000;
–muted: #666666;
–border: #000000;
–accent: #1a1a1a;
–highlight: #ffeb3b;
–admin-bg: #f4f4f4;
}

Dark Theme

CSS:
[data-theme=“dark”] {
–background: #0e0e0e;
–foreground: #f5f5f5;
–muted: #b5b5b5;
–border: #f5f5f5;
–accent: #1a1a1a;
–highlight: #ffeb3b;
–admin-bg: #151515;
}

⸻

Typography

Fonts:
• Headlines: Fira Code 900
• Section Titles: Fira Code 700
• Body Text: Inter 400
• Labels / Badges: Fira Code 700
• Code: Fira Code 400

Heading scale:
Hero → text-5xl md:text-7xl tracking-tighter
Section → text-4xl md:text-5xl tracking-tighter
Card Title → text-xl md:text-2xl
Label → text-xs uppercase tracking-widest

⸻

Global Textures

Noise Overlay CSS:
body::before {
content: “”;
position: fixed;
inset: 0;
pointer-events: none;
z-index: 9999;
opacity: 0.05;
background-image: SVG noise texture;
}

[data-theme=“dark”] body::before {
opacity: 0.08;
}

⸻

Grid Background

CSS:
.bg-grid {
background-image:
linear-gradient(var(–border) 1px, transparent 1px),
linear-gradient(90deg, var(–border) 1px, transparent 1px);
background-size: 30px 30px;
opacity: 0.05;
}

⸻

Sketch Borders

CSS:
.sketch-border {
border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
}

Variants:
.card-border → 20px 15px 20px 15px
.tech-border → 2px 20px 3px 20px / 20px 3px 20px 3px
.stats-border → 3px 15px 5px 15px / 15px 5px 15px 5px

⸻

Hard Shadows

Light:
.shadow-hard → 4px 4px 0 black

Dark:
[data-theme=“dark”] .shadow-hard → 4px 4px 0 rgba(255,255,255,0.15)

⸻

Yellow Marker Highlight

CSS:
.marker-yellow {
background-image: linear-gradient(120deg, #ffeb3b88 0%, #ffeb3b88 100%);
background-size: 100% 50%;
background-position: 0 85%;
transform: skewX(-2deg);
mix-blend-mode: multiply;
}

Never recolor. Never theme.

⸻

Hand-Drawn Underline

SVG path:
M2 8 Q 30 2 60 8 T 118 6
Stroke: currentColor
Stroke width: 3
Linecap: round

⸻

Primary Button

Light:
• Black background
• White text
• Border: black
• Hard shadow
• Hover: invert colors

Dark:
• White background
• Black text
• Border: white
• Hard shadow
• Hover: invert colors

⸻

Card Component

Rules:
• Background: var(–accent)
• Text: var(–foreground)
• Border: var(–border)
• Hard shadow
• card-border radius

⸻

Sticky Notes (Never Inverted)

Rules:
• Background: #fff9c4
• Text: black
• Border: black
• Hard shadow
• sketch-border radius

Sticky notes always stay light.
They represent physical paper.

⸻

Navigation Bar

Rules:
• Fixed floating layout
• Background: var(–background)
• Text: var(–foreground)
• Border: var(–border)
• Hard shadow
• sketch-border radius

⸻

Blog Prose

Rules:
• Headings: mono, heavy
• Paragraphs: muted color
• Links: bold + underline
• Code: bordered, no glow
• Use prose-invert in dark mode

⸻

Admin Dashboard (Sketch OS)

Main:
• Background: var(–admin-bg)
• Text: var(–foreground)
• Font: mono

Section cards:
• Background: var(–accent)
• Border: var(–border)
• Hard shadow

⸻

Reduced Motion

Rule:
If prefers-reduced-motion is enabled → disable all animation and transitions.

⸻

Theme Toggle

HTML attribute:
data-theme=“dark”

Instant switch.
No animation.

⸻

Non-Negotiables
• No glow
• No blur
• No soft shadows
• No neon colors
• Yellow highlight never changes
• Sticky notes stay light or are removed

⸻

Status

This design system is:
• Deterministic
• Scalable
• Dark-mode safe
• Visually distinctive
• Portfolio-grade
