---
name: "Hridey Portfolio"
description: "A personal miniature workshop with a quiet reading layer."
colors:
  ground: "#f5f3ed"
  ink: "#30302e"
  muted: "#66665f"
  line: "#dcdad2"
  lilac: "#d7c8ed"
  lilac-ink: "#655279"
  surface: "#ece9e2"
  green: "#708b66"
  focus: "#775697"
  dark-ground: "#1b1d22"
  dark-ink: "#eeedf0"
  dark-muted: "#abaeb7"
  dark-line: "#3b3d46"
  dark-surface: "#262930"
  dark-lilac: "#a69ab8"
  dark-lilac-ink: "#c2b5d2"
  dark-focus: "#cfbce6"
  board-edge: "#c8c3b8"
  board-screw: "#b6b0a4"
  dark-board: "#272a31"
  dark-board-edge: "#16181e"
  dark-board-screw: "#676972"
  object-sage: "#d5dfc0"
  object-blue: "#c5d9e4"
  dark-object-sage: "#505c49"
  dark-object-blue: "#465866"
  key-lilac: "#d4c4e8"
  key-lilac-base: "#a18bb8"
  key-butter: "#e9dba6"
  key-butter-base: "#bcaa77"
  key-blue: "#c5d9e4"
  key-blue-base: "#92aab9"
  key-paper: "#f0ece4"
  key-paper-base: "#c2bcb1"
  key-clay: "#e8c9b3"
  key-clay-base: "#c09b80"
  key-sage: "#d5dfc0"
  key-sage-base: "#a3b28c"
  dark-key-lilac: "#51495f"
  dark-key-blue: "#3d4c5a"
  dark-key-sage: "#465044"
  dark-key-paper: "#484950"
  dark-key-clay: "#5b4c45"
  dark-key-butter: "#58533f"
  dark-key-base: "#17191e"
  key-ink: "#50445c"
  dark-key-ink: "#dedbe5"
typography:
  display:
    fontFamily: "Satoshi, sans-serif"
    fontSize: "clamp(42px, 4.5vw, 65px)"
    fontWeight: 500
    lineHeight: 1.07
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Satoshi, sans-serif"
    fontSize: "clamp(39px, 4vw, 57px)"
    fontWeight: 500
    lineHeight: 1.14
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Satoshi, sans-serif"
    fontSize: "27px"
    fontWeight: 500
  body:
    fontFamily: "Satoshi, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  label:
    fontFamily: "Satoshi, sans-serif"
    fontSize: "14px"
  detail-body:
    fontFamily: "Satoshi, sans-serif"
    fontSize: "15px"
    lineHeight: 1.7
  emphasis:
    fontFamily: "Georgia, Times New Roman, serif"
    fontWeight: 400
    letterSpacing: "-0.04em"
  navigation:
    fontFamily: "Satoshi, sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
rounded:
  case: "24px"
  key: "16px"
  panel: "14px"
  calendar: "16px"
  tab: "8px"
  button: "100px"
  circle: "50%"
spacing:
  small: "8px"
  normal: "16px"
  object-padding: "35px"
  section-heading: "38px"
  section-mobile: "62px"
  section-desktop: "86px"
  project-gap: "28px"
  project-mobile-gap: "35px"
components:
  button-primary:
    backgroundColor: "{colors.lilac}"
    textColor: "#322c39"
    rounded: "{rounded.button}"
    padding: "16px 28px"
  technology-tab:
    textColor: "{colors.muted}"
    rounded: "{rounded.tab}"
    padding: "12px 19px"
    height: "46px"
  technology-tab-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  keycap:
    backgroundColor: "{colors.key-lilac}"
    textColor: "{colors.key-ink}"
    rounded: "{rounded.key}"
  keyboard-case:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.case}"
    padding: "35px"
  project-visual:
    rounded: "{rounded.panel}"
    height: "350px"
  calendar:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.calendar}"
    padding: "28px"
  navigation-top:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    height: "88px"
  wordmark:
    textColor: "{colors.ink}"
    fontFamily: "Satoshi, sans-serif"
    fontSize: "27px"
    fontWeight: 500
  experiment-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
  theme-chain:
    width: "52px"
    height: "44px"
  chain-pull:
    width: "52px"
    height: "52px"
  story-statement:
    textColor: "{colors.lilac-ink}"
    fontFamily: "Satoshi, sans-serif"
    fontSize: "clamp(34px, 4.3vw, 62px)"
    lineHeight: 1.15
---

# Design System: Hridey Portfolio

## Overview

**Creative North Star: "The Little Workshop"**

A personal workshop introduces real engineering work through a grounded miniature desk, a restrained typographic story and tactile technology keys. Ivory, muted lilac and sage carry the light theme; graphite, porcelain and desaturated materials carry the dark theme. Objects supply detail while project captions stay concise.

The centered entry keeps the approved two-line heading and live 3D workspace. A coherent centered statement introduces what Hridey builds, then selected projects, tools, experiments and public contributions show the evidence. The timeline precedes About; contact closes with direct email and social links. Presentation never invents employment or seniority.

**Key Characteristics:**

- Real 3D objects with physical supports, not floating decoration or a substituted photograph.
- One monogram identity with distinct light/dark material treatments.
- Satoshi reading clarity, short Georgia emphasis and restrained copy.
- One authored story sequence, with readable surrounding content and quiet object motion.

## Colors

The semantic values in the frontmatter remain the source of truth. Neutral reading surfaces use ivory/charcoal or graphite/off-white. Lilac identifies the current story thought, focused objects and actions; sage, blue, clay and butter are concentrated in physical objects. Scrolling never washes out keyboard materials.

The generated light logo uses deep dusty lilac and a fine ivory ceramic edge. The dark logo uses porcelain ivory, a lilac central stem and a graphite edge. These are image materials, not additional UI color tokens.

**The Quiet Ground Rule.** Keep reading text on neutral surfaces and put expressive color into objects and focused actions.

## Typography

Satoshi is self-hosted at 400, 500, 700 and 900. Georgia adds short italic emphasis. The hero remains two lines at `clamp(42px,4.5vw,65px)`, with the existing phone scale. Project titles use 27px; descriptions and stack notes use 16px/14px. Ordinary content is fully readable throughout scroll, rather than fading to near-invisible gray.

The personal story uses a centered 32–44px name heading, a 34–56px verb and one focused phrase at 34–62px. Phone phrases use 27–34px. Phrases move vertically through the reading position. A four-part progress rail identifies the current thought; no phrase is a link. Header wordmark type is 27px/24px mobile, weight 500, paired with the HM image; the name reads Hridey without a full stop.

**The Small Emphasis Rule.** Keep the second type voice to a short word or thought, not paragraphs.

## Layout

The desktop shell remains centered with a reserved outer navigation gutter. On phones the reading area reserves 88px at the right for the section markers. Ordinary chapters use 86px vertical padding, reduced to 62px below 760px. Work is three equal columns with 28px gaps, becoming one column on phones. Art and captions occupy complete rows; no empty grid cells are authored.

The transparent header is in normal document flow: 88px on desktop and 80px on phones. The identity and résumé scroll away; no persistent bar covers the page. The chain has its own normal-flow header slot before the résumé and scrolls away with the identity. A separate right-side section rail contains nine native anchors. The current section has a longer line and visible name; inactive names disappear. Hover and keyboard focus reveal a destination. The rail has a dedicated gutter and no enclosing panel. Its active caption sits below the full stack; on phones the caption reads down the outer edge, keeping labels out of the content.

The story spans 280svh on desktop and 270svh on phones. Its composition sticks for the reading sequence, with the introduction beside a continuously travelling vertical list on desktop and above it on phones. Neighbouring thoughts stay visible around a stationary focus frame. There are no sequence bars or discrete sentence swaps. Scrub smoothing is 850ms. The next work section overlaps the otherwise empty lower part of the final story viewport by 32svh on desktop and 26svh on phones, retaining 24px of section padding. Reduced motion shows the complete list in normal flow and removes the overlap.

The keyboard uses six columns on desktop and three on phones, with complete 18/12/12 groups. Experiments expand horizontally on desktop and vertically on phones. The compact monthly calendar sits beside actual JAX contribution evidence, then stacks on phones. The three-entry timeline comes before About. Contact uses text and an email envelope on desktop, text/social links on phones.

## Elevation & Depth

Depth belongs to represented physical objects: Three.js desk geometry, material-aware lighting and cast shadows; CSS keyboard planes and keycap travel; the metal pull-chain handle and its real pull gesture. Ordinary reading text remains level.

The desk has no levitating torus, cubes or spheres. Headphones hang on a stand, the picture frame has a support and foot, and the robot rests on the desk. The monitor remains on its stand during entry. The keyboard retains its separate pointer and scroll layers. All wrapper/case/key opacity stays exactly 1, preventing CSS 3D flattening and material-color changes.

**The Physical Support Rule.** Give objects a visible surface or support. Do not use unexplained levitation to fill space.

## Shapes

The same rounded physical vocabulary remains: keyboard case 24px, keycaps 16px, project/experiment panels 14px, monthly well 16px, selected categories 8px. The section navigation is a set of quiet horizontal strokes at the outer edge, with a separate caption beneath and no panel. The monogram's overlapping arches are an original generated identity, not a generic code-bracket icon. The chain has alternating oval metal links and a grooved metal handle; the header has no lamp shade or canvas.

## Components

### Identity and navigation

`Brand.jsx` selects `public/brand/hm-light.png` or `hm-dark.png` for the header and footer; the favicon follows the same choice. Generated asset provenance and prompts are in `public/brand/README.md`.

`Navigation.jsx` renders a right-side section rail with nine native anchors. A requestAnimationFrame-throttled scroll observer chooses the section at the reading line; React updates only when that section changes. The active line expands from 13px to 29px (8px to 17px on phones), while its name appears in the caption slot below the markers. Hover and keyboard focus reveal a destination. aria-current communicates location; every anchor retains its accessible name. Index and its dropdown are removed. The header résumé remains direct.

### Pull-chain theme control

`ThemeSwitch.jsx` renders interlocking oval metal links and a cylindrical, grooved handle. No header lamp or WebGL canvas remains. The cord is 180px on desktop and 132px on phones; the grip hangs beneath it and has a 52×52px native switch target. SVG is used for exact chain geometry. Light mode uses deep lilac, dusty lilac and pale ceramic highlights; dark mode uses plum and muted mauve highlights. Silver is removed. The header allocates a 26px desktop or 18px phone gap between the chain slot and résumé, and phone hero spacing keeps the handle above the heading.

A 14px downward pull changes theme; travel is bounded to 36px. Pointer capture preserves a drag beyond the handle. Hover follows the horizontal pointer with an angle bounded to 5 degrees; drag angle is bounded to 8 degrees. Release uses a finite, damped swing and 500ms pull return. Reduced motion removes spatial feedback. Click, Enter and Space also work. The label remains Dark theme, aria-checked follows the theme, and drag does not double-toggle on the following click. All owned tweens clean up on unmount.

### Personal story

`Story.jsx` adapts the supplied CSS reference into a continuously scrolling list. A GSAP scrub moves the list by the distance between its first and last rows. The focus frame stays stationary; the nearest line gains lilac emphasis based on its actual rendered position. Neighbouring lines remain readable. No phrase links, arrows or progress bars remain. Native list semantics expose every idea. Reduced motion and failed scripting retain a complete normal-flow list.

### Live workspace and technology keyboard

`Workspace.jsx` always loads the real `Studio.jsx` scene. The laptop screen reads Hridey Marwah. The camera starts at x=0 with zero world yaw, facing the front of the desk. Objects link to sections and the desk lamp can be illuminated. Pointer rotation is bounded, rendering pauses offscreen/hidden, and resources are disposed on unmount. Canvas gestures supplement normal navigation.

The technology keyboard keeps 36 distinct tools across Everyday, Backend & data and AI / ML. Native key buttons select one meaningful note. Category tabs support roving arrow-key focus. The case follows a mouse pointer independently of scroll movement. Transparent 3D wrappers ignore pointer input; the key buttons receive it. The upper row must remain clickable. No wire or helper-text wall is shown.

### Work, experiments and contributions

Selected project artwork/title links to the real repository. A concise engineering sentence and stack line remain visible. There are no Project details rows, Earlier projects partition or ornamental chapter joints.

All three experiment figures use Anatomy solid geometry on the same neutral panel material. The graph and AeroHarness no longer have separate colored rectangular image bands. Hover or keyboard focus expands a panel; button selection supports touch. The expanded panel includes an explicit Explore project link. Exactly one description and project action is exposed. Source/detail partitions stay removed.

The activity panel shows at most the latest 30 actual snapshot dates, with a total recalculated from that window. Seven-column rows include alignment blanks, not fake zero-contribution days. One day is tabbable; arrows move by date/week within the displayed range. Exact date/count and sync date remain available. Actual merged JAX links accompany the calendar.

### Backstory, About and contact

The timeline covers education, hackathon finalist and JAX work. The removed campus-role row stays absent. About follows it, keeping the concise supplied biography and familiar objects. Contact has email, GitHub and LinkedIn together near the main action, as well as footer links. The envelope remains a real email link. A personal portrait is still pending from the user.

### Motion and access

Lenis supplies smooth wheel scrolling through one GSAP ticker synchronized with ScrollTrigger, with lerp 0.075 and wheel multiplier 0.78. Home navigation explicitly restores scroll position zero so the header remains visible on entry. Native keyboard and touch remain available; a scroll key takes ownership from an ongoing glide. Internal anchors preserve hashes/history and header clearance. The latest destination wins. GSAP concentrates narrative motion in the story and small represented objects, rather than fading all section text. Reduced-motion presentation is static and fully readable. All listeners, observers and animations clean up on unmount.

## Do's and Don'ts

### Do

- Do keep objects physically supported, the laptop name-only and the two theme-logo treatments coherent.
- Do keep the introduction centered and free of links.
- Do maintain keyboard opacity and upper-row hit areas.
- Do preserve native controls, focus, reduced-motion alternatives and factual project evidence.

### Don't

- Do not restore floating desk decorations, the rocker switch, header lamp shade or split introduction.
- Do not add tiny labels, fabricated outcomes, proficiency percentages or unsupported seniority claims.
- Do not make a canvas gesture the only way to navigate or change theme.
- Do not reintroduce detail partitions or represent illustrative project art as product screenshots.


## Current motion refinement — October 18

The latest browser comments supersede the static vertical-list pass. The header returns to ordinary document flow with a transparent surface, so no persistent bar covers the hero or chapters. The Index disclosure is replaced by the right-side line-and-label section rail. Only the pull chain stays fixed at the outer right edge. Its articulated metal links and larger handle hang 142px on desktop and 112px on phones, away from the content measure. Hover follows the pointer with a small angle; release settles through a bounded pendulum motion.

The centered story restores a slow sticky reading sequence. Four phrases travel vertically through one reading position, accompanied by a four-part progress rail identifying the current thought. The chapter spans 280svh (260svh on phones); reduced motion and script-free presentation show the complete list in ordinary flow. The 3D workspace starts directly in front, with zero initial yaw and a centered camera; bounded dragging remains. No factual copy or project layout changes.


## Scroll-list refinement — latest browser comments

The supplied CSS reference now replaces the vertical reel. The story uses a continuously travelling vertical list with neighbouring thoughts visible around a stationary reading frame. A sticky desktop composition places the introduction beside the list; phones stack the introduction above it. The current thought receives lilac emphasis when it reaches that frame. A 280svh desktop / 270svh phone span and 850ms scrub smoothing slow the continuous travel. The old single-phrase window and sequence bars are removed. Satoshi and existing theme tokens stay; the reference's global imports, body reset, debug UI and forced page scroll snapping are not imported. Reduced motion presents the list normally.

Navigation adopts a reserved page-edge column, with its active caption below the markers rather than extending into content. On phones the caption follows the outer edge vertically. The chain returns to normal header flow before the résumé, with a 180px desktop / 132px phone cord and lilac or warm-plum material colours. It scrolls away with the header, and its handle has a distinct layout slot from the résumé.

The final story-to-work handoff removes the empty lower viewport: the work chapter enters 32svh earlier on desktop and 26svh on phones, with 24px padding. This leaves approximately 126px from the final focus frame to the work heading in the checked desktop view. Reduced motion removes the overlap.

## Anatomy component pass

Scope: three Figure-scale mechanisms within the existing experiment cards. Preserve the approved hero, story, navigation, keyboard and factual captions. No new section or decorative copy wall.

Concepts: AI Agency OS is a task-dispatch bench whose carrier visits mounted work stations. Supply Chain Simulator is a conveyor bench whose cargo pauses at a disruption and then continues. AeroHarness is a validation fixture whose specimen passes setup, approval and verification stations. These are conceptual illustrations, not screenshots or claimed project measurements.

Parts plan, before geometry: each figure has a base plate, four feet, four screw heads, a ruler strip, two rails, four end stops, a motor housing and cap, five motor fins and a control housing/switch (at least 25 shared physical parts). The dispatch bench adds four bearing pads, a carriage, task cartridge, three handle parts and three six-part scanner stations (more than 50 solids). The conveyor adds twelve belt slats, eight rack posts, two shelves, six storage bins, cargo and its lid (more than 50 solids). The validation fixture adds bearing pads, specimen carriage, two frame posts and their pads, a top beam, three mounted instrument modules and controls (40–80 solids). Bevels, corner fasteners and inset face seams are tied to those physical parts.

Use Anatomy projection and solid geometry at build time, preserving its MIT notice. Keep geometry out of animation frames and ship static paths. One model drives transforms and phase readouts. No new WebGL context. Pause offscreen or in hidden tabs; honour reduced motion. Use the existing neutral surfaces with four-tone ivory/graphite shading and one lilac subject. Reuse the existing project title/action rather than adding figure numbers or instruction labels.

### Simulation steering — October 18
The user's follow-up extends Anatomy to the existing theme chain and asks for distinct behaviour in all three machines. Keep the existing figures and materials; change the model to a dispatch sequence, a stop-and-recover conveyor, and a validation run with an explicit approval pause. Indicators, cartridge colour and status must agree with the visible phase. The chain retains its header slot and native switch semantics, but gains independent articulated links, constant link spacing, a spring-fed length and a damped weighted tip. No perpetual idle motion, extra canvas or lamp.


Final simulation contract: 58 solids for dispatch, 63 for the conveyor and 57 for validation. All share the same projection and materials. Active carriers and fixture lights show progress; amber marks waiting and sage completion. Validation halts at the actual middle position and exposes an explicit approval control. Tall rig framing is individually fitted so the beam stays visible. Phone selection occurs on completed click; pointer focus does not move the card before activation. The chain has independently oriented links at 7.4px pitch, a fixed header slot, theme-aware metal and a finite spring settle. Reduced motion uses direct, non-oscillating changes.

## Replacement silhouettes — user correction
The previous three mechanisms were rejected because all used the same linear bench. Replace their actual geometry, not just timing. AI Agency OS becomes a circular rotary dispatcher with three upright agent canisters and a rotating job token. Supply Chain Simulator becomes a forked road network with warehouses, a blocked route and a wheeled delivery vehicle. AeroHarness becomes a compact hinged validation case with an exposed chip, glass lid and approval latch. Preserve the existing cards, factual captions, theme palette and chain. Motion must be circular, routed and hinged respectively. No shared rail, carriage, baseplate or scanner gantry.

Latest additions: six broader statements connect product usefulness, simple experiences, purposeful AI, dependable systems, helpful tools and open work. The story span is 475svh desktop / 454.2svh phone (25% more scroll travel per transition, scaled from four to six statements). All major sections now use equal left/right gutters; About is inset and rounded. Live GitHub data is fetched through a fixed, cached server endpoint with a server-only token. The saved snapshot remains available if the endpoint fails.


Final replacement: the repeated linear bench is removed from all three cards. Dispatch uses a round plinth and rotating token; supply uses two road branches and a wheeled truck; validation uses a glass clamshell lid and processor. Static geometry is generated, and moving assemblies reproject in the same camera. Current counts are 47/52/44 solids. Equal page gutters centre the whole content area; About is inset. Six broader statements use 25% more scrolling per transition. The chain's curve now bends with lateral drag and its grip tilts with the endpoint. Live GitHub requests use a fixed server query, one-minute cache and a server-only token, with a dated snapshot fallback.


## Completed work and active research — 18 October 2026
<design_plan>
RNG seed: supplied brief length; scoped choices retain the approved hero and Satoshi typography.
Components: three equal completed-work cards; two equal active-project cards; five distinct Anatomy illustrations.
Motion: existing GSAP entrance scrubbing plus continuously looping mechanical illustrations.
AIDA: retain navigation, centered two-line hero (max-w-6xl), story, work, research and contact. Three columns fill one complete row; two research columns fill one complete row. Both become a single column on phones. No accordion hides illustrations.
Theme: existing ivory/graphite, lilac subjects and sage indicators. Visible focus, legible text and no decorative labels. Completed work uses supplied facts; no invented RoleReady or research repository.
Runtime: all visible cards animate independently, including automatic Aero demonstration. Offscreen and hidden-tab work pauses; reduced motion is respected. Each illustration has an explicit pause/resume control.
</design_plan>


### Compact active-project cards
Retain the existing equal two-column research row and single-column phone layout. Reduce art to 165px, caption padding to 18–22px, and body type to 13px. Remove inherited space-between distribution. Preserve all facts and independent autoplay; put the longer research question in native expandable details. No new layout or dependency.

Research-card spacing: technology rows now precede the action in both cards. Shared line-height-based row minimums align the collapsed height without coupling open details to the neighbouring card.

Story pacing refinement: 426svh desktop / 408svh phone makes the scrollable travel roughly 15% faster than 475svh / 454.2svh. Existing scrub smoothing remains. Shift the opening story section up 14svh desktop / 8svh phone to reduce the gap after the hero action, retaining the centred sticky reading layout.
