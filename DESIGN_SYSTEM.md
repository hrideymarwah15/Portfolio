# Portfolio Design System

A comprehensive guide to the **Sketch Aesthetic** UI/UX. Use this to recreate the design language on any platform.

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Textures & Backgrounds](#textures--backgrounds)
5. [Core Visual Patterns](#core-visual-patterns)
6. [Component Library](#component-library)
7. [Animation System](#animation-system)
8. [Navigation](#navigation)
9. [Sections](#sections)
10. [Admin Dashboard (Sketch OS)](#admin-dashboard-sketch-os)
11. [Blog System](#blog-system)
12. [Accessibility](#accessibility)
13. [Dependencies](#dependencies)

---

## Philosophy

> **"Hand-drawn precision meets digital minimalism."**

The design mimics architectural blueprints, notebook sketches, and technical drawings. Everything feels intentional yet imperfect—like it was drafted by hand.

**Core Principles:**
- Black & white as primary palette with yellow accent highlights
- Imperfect borders that feel hand-drawn
- Hard drop shadows (no blur, no softness)
- Monospace typography for all headings and labels
- Paper-like textures (noise overlay, grid lines)
- Tape and pin decorations for "pinned to board" effect
- Wavy/squiggly underlines instead of straight lines

---

## Color System

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#ffffff` | Page background |
| `foreground` | `#000000` | Text, borders, shadows |
| `accent` | `#1a1a1a` | Dark accents |
| `highlight` | `#ffeb3b` | Yellow marker (50% opacity) |
| `admin-bg` | `#f4f4f4` | Dashboard background |

### Sticky Note Colors (StickyStats)

| Token | Hex | Usage |
|-------|-----|-------|
| `yellow` | `#fff9c4` | Default sticky |
| `pink` | `#ffcdd2` | Emphasis |
| `blue` | `#bbdefb` | Info |
| `green` | `#c8e6c9` | Success |

### Status Colors

| State | Background | Border | Text |
|-------|------------|--------|------|
| Available | `bg-green-50` | `border-green-200` | `text-green-700` |
| Unavailable | `bg-red-50` | `border-red-200` | `text-red-700` |
| Active Tag | — | `border-black` | `text-green-600` |
| Research Tag | — | `border-black` | `text-gray-600` |
| Build Tag | — | `border-black` | `text-blue-600` |

### CSS Variables

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
  --font-sans: var(--font-inter);
  --font-mono: var(--font-fira-code);
  --color-accent: #1a1a1a;
}
```

---

## Typography

### Font Stack

| Element | Font | Weight | Style |
|---------|------|--------|-------|
| Headlines | Fira Code | Black (900) | Mono, tight tracking, uppercase |
| Section Titles | Fira Code | Bold (700) | Mono, uppercase |
| Body Text | Inter | Regular (400) | Sans, relaxed leading |
| Labels/Badges | Fira Code | Bold (700) | Mono, uppercase, wide tracking |
| Code/Technical | Fira Code | Regular (400) | Mono |

### Heading Sizes

| Level | Class |
|-------|-------|
| Hero | `text-5xl md:text-7xl tracking-tighter` |
| Section | `text-4xl md:text-5xl tracking-tighter` |
| Card Title | `text-xl md:text-2xl` |
| Labels | `text-xs uppercase tracking-widest` |

### Text Decorations

```tsx
// Wavy underline
className="underline decoration-wavy decoration-1 underline-offset-4"

// Yellow marker highlight
className="marker-yellow"

// Comment-style label
<span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
    // Current Interests [LIVE]
</span>
```

---

## Textures & Backgrounds

### 1. Global Noise Overlay
Applied to `body::before` for paper-like texture.

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
```

### 2. Blueprint Grid

```css
background-image: 
  linear-gradient(#000 1px, transparent 1px), 
  linear-gradient(90deg, #000 1px, transparent 1px);
background-size: 30px 30px;
opacity: 0.05;
```

### 3. Dot Pattern (Fallback/Empty States)

```css
background-image: radial-gradient(#000 1px, transparent 1px);
background-size: 20px 20px;
```

### 4. Diagonal Cross Lines (Avatar Placeholder)

```tsx
<svg className="absolute inset-0 w-full h-full opacity-10">
    <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" strokeDasharray="4 4" />
</svg>
```

---

## Core Visual Patterns

### Sketch Border (Hand-Drawn Effect)

```css
border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
```

Variants:
```css
/* Navbar/Logo */
border-radius: 2px 8px 3px 8px / 8px 3px 8px 2px;

/* Cards */
border-radius: 20px 15px 20px 15px;

/* Tech Card */
border-radius: 2px 20px 3px 20px / 20px 3px 20px 3px;

/* Stats Box */
border-radius: 3px 15px 5px 15px / 15px 5px 15px 5px;
```

### Hard Drop Shadows

```css
/* Small */
shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]

/* Medium */
shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]

/* Large */
shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]

/* Extra Large */
shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]

/* Hover: deeper + offset */
hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
hover:translate-x-[2px] hover:translate-y-[2px]
```

### Yellow Marker Highlight

```css
@utility marker-yellow {
  background-image: linear-gradient(120deg, #ffeb3b88 0%, #ffeb3b88 100%);
  background-repeat: no-repeat;
  background-size: 100% 50%;
  background-position: 0 85%;
  transform: skewX(-2deg);
  mix-blend-mode: multiply;
}
```

### Tape Decoration

```tsx
{/* Simple tape strip */}
<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-200/80 rotate-[-2deg] border border-gray-300" />

{/* Multiple overlapping tapes */}
<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-200/80 rotate-[-2deg] border border-gray-300 z-10" />
<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-200/50 rotate-[1deg] border border-gray-300 z-10" />
```

### Pin Decoration

```tsx
<div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-200 border border-gray-400 shadow-sm flex items-center justify-center z-20">
    <div className="w-2 h-2 rounded-full bg-black/20"></div>
</div>
```

### Hand-Drawn SVG Underlines

```tsx
{/* Wavy underline below heading */}
<svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 120 12" preserveAspectRatio="none">
    <path
        d="M2 8 Q 30 2 60 8 T 118 6"
        stroke="black"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
    />
</svg>
```

### Dashed Borders

```css
border-t border-dashed border-gray-300
border-2 border-dashed border-gray-300
```

---

## Component Library

### Primary Button

```tsx
<button className="
  px-8 py-3 
  bg-black text-white 
  font-mono font-bold text-lg 
  border-2 border-black 
  hover:bg-white hover:text-black 
  transition-all 
  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
  hover:translate-x-[2px] hover:translate-y-[2px] 
  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
">
  EXPLORE MY WORK
</button>
```

### Icon Button (Circle)

```tsx
<div className="
  w-8 h-8 rounded-full 
  border-2 border-black 
  flex items-center justify-center 
  bg-white text-black 
  group-hover:bg-black group-hover:text-white 
  transition-colors
">
  <ArrowUpRight size={16} />
</div>
```

### Tag/Chip

```tsx
<span className="
  px-4 py-2 border-2 border-black 
  text-sm font-mono font-bold 
  bg-white 
  hover:bg-black hover:text-white 
  transition-colors cursor-default 
  shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
  hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
  hover:translate-x-[2px] hover:translate-y-[2px]
">
  Multi-Agent AI Systems
</span>
```

### "NEW!" Badge

```tsx
<div className="
  absolute top-4 right-4 z-10 
  px-3 py-1 
  bg-yellow-300 border-2 border-black 
  font-mono text-xs font-bold 
  -rotate-6 
  shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
">
  NEW!
</div>
```

### Status/Tag Badge

```tsx
<div className="
  px-3 py-1 font-mono font-bold text-xs 
  border-2 border-black bg-white 
  rotate-12 shadow-sm
  text-green-600
">
  [ACTIVE]
</div>
```

### Availability Badge

```tsx
<div className="
  inline-flex items-center gap-2 
  px-4 py-2 border rounded-full 
  font-mono text-sm 
  bg-green-50 border-green-200 text-green-700
">
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
  </span>
  Available for new projects
</div>
```

### Card (Blog Style)

```tsx
<div
  className="
    relative flex flex-col h-full 
    bg-white border-2 border-black 
    overflow-hidden 
    shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
    group-hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] 
    transition-all duration-300
  "
  style={{ borderRadius: "20px 15px 20px 15px" }}
>
  {/* Cover Image Area */}
  <div className="relative h-56 overflow-hidden border-b-2 border-black bg-gray-100">
    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
  </div>
  {/* Content Area */}
  <div className="p-6 flex-1 flex flex-col">
    {/* Meta, Title, Excerpt, Footer */}
  </div>
</div>
```

### Sticky Note (StickyStats)

```tsx
<div
  className="
    relative p-6 w-full md:w-48 aspect-square 
    flex flex-col items-center justify-center text-center 
    shadow-[4px_4px_0px_rgba(0,0,0,1)] 
    hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] 
    hover:translate-x-[2px] hover:translate-y-[2px] 
    transition-all border-2 border-black 
    bg-[#fff9c4]
  "
  style={{
    fontFamily: 'monospace',
    borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
    transform: 'rotate(-2deg)'
  }}
>
  {/* Top Tape */}
  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/60 rotate-1 backdrop-blur-sm border-l border-r border-white/40 shadow-sm" />
  
  <h3 className="text-4xl font-black mb-2 tracking-tighter text-black">5</h3>
  <span className="text-xs font-bold text-black uppercase tracking-widest">POSTS</span>
</div>
```

### Progress Bar (Sketch Style)

```tsx
<div className="relative pt-2">
  <div className="flex justify-between font-mono text-xs text-gray-400 mb-1">
    <span>PROGRESS</span>
    <span>75%</span>
  </div>
  <div className="h-2 w-full border border-black p-[2px] rounded-full">
    <motion.div
      className="h-full bg-black rounded-full"
      initial={{ width: 0 }}
      whileInView={{ width: "75%" }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.5 }}
    />
  </div>
</div>
```

### Character Sheet Stats

```tsx
<div
  className="p-6 border-2 border-black bg-gray-50"
  style={{ borderRadius: "3px 15px 5px 15px / 15px 5px 15px 5px" }}
>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {stats.map((stat) => (
      <div className="text-center p-3 border border-dashed border-gray-400 bg-white group hover:border-solid hover:border-black transition-all">
        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
          {stat.label}
        </div>
        <div className="text-lg font-mono font-black text-black">
          {stat.value}
        </div>
      </div>
    ))}
  </div>
</div>
```

### Page Corner Flip (Tech Cards)

```tsx
{/* Page flip corner decoration */}
<div
  onClick={nextPage}
  className="absolute bottom-0 right-0 w-8 h-8 cursor-pointer overflow-hidden"
>
  <div className="absolute bottom-0 right-0 w-8 h-8 bg-black/5 rotate-45 translate-x-1/2 translate-y-1/2 border-l border-t border-black/20 group-hover:bg-black/10 transition-colors"></div>
</div>
```

---

## Animation System

All animations use **Framer Motion**.

### Entrance: Fade + Slide Up

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
```

### Entrance: Slide from Side

```tsx
<motion.div
  initial={{ opacity: 0, x: -50, rotate: -2 }}
  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, delay: 0.1 }}
>
```

### Stagger Children

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

### Hover Lift + Tilt (Cards)

```tsx
<motion.article
  whileHover={{ y: -8, rotate: 1, scale: 1.02 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
```

### Scroll-Triggered (whileInView)

```tsx
<motion.section
  initial={{ x: -100, opacity: 0 }}
  whileInView={{ x: 0, opacity: 1 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
```

### Animated SVG Path (Underlines)

```tsx
<motion.path
  d="M2 8 Q 30 2 60 8 T 118 6"
  stroke="black"
  strokeWidth="3"
  fill="none"
  initial={{ pathLength: 0 }}
  whileInView={{ pathLength: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 0.3 }}
/>
```

### Scroll-Based Line Height (Timeline)

```tsx
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start 80%", "end 20%"]
});

const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

<motion.div
  className="absolute top-0 left-0 w-full bg-black origin-top"
  style={{ height: lineHeight }}
/>
```

### Spring Bounce (Scale In)

```tsx
<motion.div
  initial={{ scale: 0 }}
  whileInView={{ scale: 1 }}
  viewport={{ once: true }}
  transition={{ type: "spring", bounce: 0.5 }}
>
```

### Growing Underline (Hover)

```tsx
<h3 className="relative inline-block">
  {text}
  <span className="absolute bottom-0 left-0 w-0 h-1 bg-white group-hover:w-full transition-all duration-500 ease-out"></span>
</h3>
```

### Hide/Show Navbar on Scroll

```tsx
const [hidden, setHidden] = useState(false);
const { scrollY } = useScroll();

useMotionValueEvent(scrollY, "change", (latest) => {
  const previous = scrollY.getPrevious() ?? 0;
  if (latest > previous && latest > 150) {
    setHidden(true);
  } else {
    setHidden(false);
  }
});

<motion.nav
  variants={{
    visible: { y: 0, opacity: 1 },
    hidden: { y: -100, opacity: 0 }
  }}
  animate={hidden ? "hidden" : "visible"}
  transition={{ duration: 0.3 }}
>
```

### Toast Notification

```tsx
<motion.div
  initial={{ y: -100, x: "-50%", rotate: -2 }}
  animate={{ y: 0, rotate: 0 }}
  exit={{ y: -100, opacity: 0 }}
  className="
    fixed top-4 left-1/2 -translate-x-1/2 z-50 
    bg-yellow-300 border-2 border-black 
    px-6 py-2 font-mono font-bold 
    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
  "
>
  SAVED!
</motion.div>
```

---

## Navigation

### Floating Navbar

- Centered, floating pill with sketch border
- Hide on scroll down, show on scroll up
- Active section detection via IntersectionObserver-like logic
- SVG wavy underlines for active/hover states

```tsx
<motion.nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
  <div
    className="pointer-events-auto bg-white/95 backdrop-blur-sm border-2 border-black px-6 py-3 flex items-center gap-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
  >
    {/* Logo + Links */}
  </div>
</motion.nav>
```

### Nav Link with Sketch Underline

```tsx
<a className="relative group py-1 cursor-pointer">
  <span className={`relative z-10 transition-colors ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
    ABOUT
  </span>
  
  {/* Yellow highlight layer */}
  <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 60 8" preserveAspectRatio="none">
    <path d="M2 5 Q 15 2 30 5 T 58 4" stroke="#ffeb3b" strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
  
  {/* Black outline layer */}
  <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 60 8" preserveAspectRatio="none">
    <path d="M2 5 Q 15 2 30 5 T 58 4" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round" />
  </svg>
</a>
```

### Back Link (Tape Style)

```tsx
<Link
  href="/blog"
  className="inline-flex items-center gap-2 px-4 py-1.5 font-mono text-xs font-bold bg-yellow-100 border-b-2 border-yellow-300 text-yellow-900 hover:bg-yellow-200 hover:scale-105 hover:-rotate-2 transition-all shadow-sm"
  style={{ transform: "rotate(-1deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
>
  ← BACK TO BLOG
</Link>
```

---

## Sections

### Hero Section

- Full-height centered content
- 3D Brain background (lazy loaded)
- Grid background overlay
- RoughNotation for animated underlind/highlight
- Primary CTA button

### About Section

- Two-column layout (avatar + content)
- Character sheet stats grid
- Interest tags with hard shadows
- Custom text parsing for `**bold**` → marker-yellow and `__underline__` → wavy

### Focus Areas Section

- Central animated timeline (scroll-based)
- Alternating left/right cards
- Pinned cards with status stamps
- Progress bar for each item
- Timeline nodes with wobbly SVG circles

### Tech Stack Section

- Grid of paginated cards
- Page corner flip effect for navigation
- Subsection groupings with skill tags

### Principles Section (Dark)

- Black background, white text
- Staggered large text entries
- Growing underline on hover

### Contact Section

- Availability badge
- Card with tape decorations
- Email copy button
- Social link cards with icon + arrow

---

## Admin Dashboard (Sketch OS)

### Background

```tsx
<main className="min-h-screen bg-[#f4f4f4] font-mono">
  {/* Noise Overlay at 0.03 opacity */}
  {/* Grid Pattern at 0.05 opacity */}
</main>
```

### Section Card

```tsx
<section
  className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  style={{ borderRadius: '8px 20px 8px 20px' }}
>
  <h2 className="font-mono font-bold text-lg mb-4 border-b-2 border-dashed pb-2">
    SECTION TITLE
  </h2>
  {/* Content */}
</section>
```

### Toggle Switch

```tsx
<label className="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" className="sr-only peer" checked={available} />
  <div className="
    w-14 h-8 border-2 border-black rounded-full 
    bg-gray-200 peer-checked:bg-green-400 
    transition-colors
  ">
    <div className="
      absolute left-1 top-1 w-6 h-6 
      bg-white border-2 border-black rounded-full 
      shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
      peer-checked:translate-x-6 
      transition-transform
    " />
  </div>
</label>
```

### Input Fields

```tsx
<input className="
  w-full px-4 py-3 
  border-2 border-black 
  font-mono text-sm 
  shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
  focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
  focus:outline-none 
  transition-all
" />

<textarea className="
  w-full px-4 py-3 
  border-2 border-dashed border-gray-300 
  font-mono text-sm 
  focus:border-black focus:border-solid 
  focus:outline-none 
  resize-none
" rows={4} />
```

### Save Button

```tsx
<button className="
  flex items-center gap-2 
  px-4 py-2 
  bg-black text-white 
  font-mono font-bold text-sm 
  border-2 border-black 
  shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
  hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
  hover:translate-x-[2px] hover:translate-y-[2px] 
  transition-all 
  disabled:opacity-50
">
  <Save size={14} />
  {saving ? 'SAVING...' : 'SAVE'}
</button>
```

---

## Blog System

### Blog List

- Search input with dashed border
- Grid of BlogCard components
- Empty state with dot pattern

### Blog Card

See [Component Library > Card](#card-blog-style)

### Blog Post Content

Uses Tailwind Typography (`prose`) with extensive customization:

```tsx
<div className="prose prose-lg max-w-none font-sans
  prose-headings:font-mono prose-headings:font-black prose-headings:tracking-tighter
  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b-4 prose-h2:border-black prose-h2:inline-block prose-h2:pb-2
  prose-a:text-black prose-a:font-bold prose-a:underline prose-a:decoration-4 prose-a:decoration-yellow-300 prose-a:underline-offset-4 hover:prose-a:bg-yellow-300
  prose-code:font-mono prose-code:text-sm prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:border-2 prose-code:border-black prose-code:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
  prose-pre:bg-black prose-pre:text-white prose-pre:border-4 prose-pre:border-black prose-pre:shadow-[8px_8px_0px_0px_rgba(100,100,100,1)]
  prose-blockquote:border-l-0 prose-blockquote:border-t-2 prose-blockquote:border-b-2 prose-blockquote:border-black prose-blockquote:bg-gray-50 prose-blockquote:py-8 prose-blockquote:px-8 prose-blockquote:font-mono prose-blockquote:text-center
  prose-img:border-4 prose-img:border-black prose-img:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
  prose-hr:border-black prose-hr:border-dashed prose-hr:border-4
">
```

### Cover Image Effect

```tsx
<div className="relative group" style={{ transform: "rotate(0.5deg)" }}>
  {/* Shadow layer */}
  <div className="absolute inset-0 border-2 border-black translate-x-2 translate-y-2 bg-black" />
  
  {/* Image layer */}
  <div className="relative border-4 border-black overflow-hidden bg-white">
    <img
      src={post.cover_image}
      className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
    />
  </div>
</div>
```

---

## Accessibility

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

### Focus States

```css
focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
```

### ARIA Labels

All interactive elements have proper `aria-label`, `aria-current`, and `aria-expanded` attributes.

### Semantic HTML

Proper use of `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`.

### Keyboard Navigation

Focus trap in mobile menu, skip links where appropriate.

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | 4.x | Utility CSS |
| `framer-motion` | 11.x | Animations |
| `react-rough-notation` | 1.x | Hand-drawn annotations |
| `lucide-react` | — | Icons |
| `@react-three/fiber` | 8.x | 3D Brain (optional) |
| `@react-three/drei` | 9.x | 3D helpers (optional) |
| `react-markdown` | — | Blog content rendering |
| `remark-gfm` | — | GitHub Flavored Markdown |
| `@tailwindcss/typography` | — | Prose styling |

---

## Quick Reference

| Pattern | Snippet |
|---------|---------|
| Hard shadow | `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` |
| Sketch border | `style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}` |
| Yellow marker | `marker-yellow` utility |
| Grid bg | `backgroundImage: 'linear-gradient(#000 1px, transparent 1px), ...'` |
| Mono headline | `font-mono font-bold tracking-tighter` |
| Dashed divider | `border-t border-dashed border-gray-300` |
| Tape decoration | `<div className="... bg-gray-200/80 rotate-[-2deg] ..." />` |
| Wavy underline | `decoration-wavy decoration-1 underline-offset-4` |
| SVG underline | See [Hand-Drawn SVG Underlines](#hand-drawn-svg-underlines) |
| Grayscale hover | `grayscale group-hover:grayscale-0 transition-all` |
