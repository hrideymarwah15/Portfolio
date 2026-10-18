# Hridey Marwah — Portfolio

A personal portfolio with a live Three.js workspace, tactile technology keys, concise project captions, a monthly public GitHub contribution calendar, a timeline, and light/dark themes.

## Run

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

Deploy with a Node serverless host such as Vercel to run `api/github-activity.js` alongside the Vite build. Set `GITHUB_TOKEN` as a server environment secret. A static-only host still renders the saved calendar, but cannot refresh it live.

## Content and components

- `src/main.jsx`: projects, experiments, about, contact, scroll timelines and theme persistence.
- `src/Studio.jsx`: real geometry, lights, materials, personal laptop texture, raycast destinations and bounded desk motion. The hero is always live 3D; generated concept photographs are not displayed.
- `src/Workspace.jsx`: lazy loading and sizing of the live workspace.
- `src/StackBoard.jsx`: 36 technologies in Everyday, Backend & data, and AI / ML. Keycaps are accessible HTML buttons on a CSS 3D case with actual side planes, underside and fittings. The whole case follows the pointer with bounded tilt; touch and reduced-motion keep a stable board.
- `src/OpenSource.jsx`: public calendar and verified JAX pull requests.
- `src/Timeline.jsx`: education, hackathon and open-source timeline.
- `src/Objects.jsx`: timeline sculpture and an interactive email envelope.
- `src/Details.jsx`: retained factual reference data; its old detail/earlier-work disclosures are not rendered.
- `src/Navigation.jsx`: right-side scroll-aware section markers, with active/hover/focus labels and native anchor navigation.
- `src/Brand.jsx`: generated HM identity with separate light/dark assets and matching favicon.
- `src/ThemeSwitch.jsx`: an articulated SVG chain and weighted grip, driven by `src/anatomy/chain-model.mjs`. A concealed take-up spring feeds links without stretching them. Native pull, click and keyboard switch controls remain available.
- `src/anatomy/`: lazy-loaded solid SVG experiment figures, pure motion models and scoped materials.
- `scripts/generate-anatomy.mjs`: records and audits the figures, using the MIT-licensed build-time helpers in `scripts/anatomy/`.
- `src/Story.jsx`: scroll-driven introduction with no navigation links, a static assistive-technology summary, and a reduced-motion reading layout.
- `src/useSmoothScroll.js`: Lenis/GSAP clock integration, section navigation, hash history and cleanup.
- `src/style.css`: self-hosted Satoshi, theme tokens and responsive layouts.
- `public/resume.pdf`: supplied résumé. No personal portrait was supplied.

The laptop screen reads **Hridey Marwah**. Unexplained floating shapes are removed; the frame and headphones have supports. The header/footer logos use distinct generated lilac and porcelain/lilac treatments, recorded with prompts in `public/brand/README.md`. Desk objects link to work, experiments, stack, contributions, about, timeline, and contact. Dragging rotates the scene; the lamp can be switched on. Standard navigation supplies alternatives to canvas gestures. No visible reset, pause or instruction controls clutter the landing page.

Project artwork is an illustrative portfolio composition, not a product screenshot. Technical claims and links refer to the actual repositories. No proficiency percentages, testimonials or unmeasured outcomes are invented.

## Refresh public GitHub data

```sh
npm run refresh:github
```

Fetches Hridey's public calendar and merged JAX pull requests, validates the response, and updates `src/data/github-activity.json` atomically. The site uses a dated snapshot. Only its latest 30 dates are rendered; the visible total is recalculated from that window. The fallback was refreshed from the authenticated API on October 18, 2026: 30 dates, 47 contributions and four merged JAX pull requests. Run the command and rebuild to refresh it. Network/API errors preserve the existing file.

## Motion and access

Lenis 1.3.27, using lerp 0.075 and wheel multiplier 0.78, supplies smooth wheel scrolling through a single GSAP ticker, synchronized with ScrollTrigger. Internal anchors and 3D objects share section navigation, with header clearance, hash history and latest-navigation-wins behavior. Native keyboard/touch scrolling is retained; reduced-motion preferences remove smoothing. GSAP handles enter/hold/exit scroll sequences in both directions and independent pointer tilt on the keyboard case. Anime.js handles deliberate stack selection and interface responses. Reduced-motion preferences disable these effects and keep content fully visible. Canvas rendering pauses offscreen or in hidden tabs, caps pixel density, and disposes resources on unmount. The scene keyboard uses instanced geometry.

Stack groups support left/right arrows; the contribution graph has one tab stop and arrow-key selection. Experiment cards select on mouse hover or keyboard focus, with button selection for touch. Their neutral illustration surfaces match, and each expanded panel has an explicit project destination. There are no extra source/detail rows or Earlier projects partition. Timeline comes before About. GitHub and LinkedIn also appear next to the main contact action. Links and résumé are usable without a canvas gesture.

## Source boundary

The original `/Users/hridey/Desktop/Hridey/portfolio` was left unchanged. Only personal/project facts and résumé were reused. Its design, agent and planning files were excluded. Synced files in the ChatGPT project's `sources/` were not modified.

See `INSPIRATIONS.md` and `VALIDATION.md` for reference and verification scope.

The chain pull is bounded to 36px, changes theme at 14px, and settles with a finite spring simulation on release. A static Dark theme label and aria-checked state accompany native click/Enter/Space support. The articulated lilac/plum chain hangs 180px on desktop and 132px on phones in a separate header slot before the résumé. It scrolls away with the header; only the right-side section markers remain fixed. Their active caption sits below the stack without extending into content. The introduction follows the supplied scroll-list reference: a fixed reading frame, continuously travelling vertical phrases and visible neighbours. The work section starts sooner beneath its final line to remove the empty handoff. Reduced motion shows the full list and removes overlap. The desk starts facing the front. No biography claims were added from the supplied CSS reference.

## Anatomy simulations

The figures now have different silhouettes and movement: a circular job dispatcher, a delivery vehicle on a forked road network, and a hinged validation case. AeroHarness stops at its middle station until **Approve run** is pressed. Mouse movement steers a carrier; arrow keys, Home and End offer equivalent exploration. The illustration button replays the sequence. Their status words describe the illustration, not live project activity.

Static geometry is built once; the small moving assemblies are reprojected continuously. The figures load near the viewport, and only the active visible mechanism animates. The chain stops after settling. Both systems pause offscreen or in a hidden tab and honour reduced motion. The hero remains the existing Three.js workspace.

```sh
npm run generate:anatomy
node --test scripts/test-anatomy.mjs scripts/test-chain.mjs scripts/test-github.mjs
```

See `ANATOMY.md` for the source revision, controls and verification limits.

## Automatic GitHub updates

The visible calendar requests `/api/github-activity` on entry, every 60 seconds while visible, and when the tab becomes visible again. The server uses a fixed GraphQL query for Hridey's calendar and public JAX merge count, validates the result, shares concurrent requests, and caches responses for one minute. Failed requests preserve the last usable data and show its saved date.

Local development and `npm run preview` reuse the existing GitHub CLI sign-in. On deployment, configure `GITHUB_TOKEN` in the host's server environment; never use a `VITE_` token variable or put a token in the client. `.env.example` contains no credential. No token was written to source or the downloadable ZIP. GitHub's own processing and the one-minute polling/cache interval mean updates are automatic rather than instantaneous push events.

The story contains six professional statements. Its 475svh / 454.2svh span provides 25% more scrolling per transition than the former four-point sequence. Reading surfaces and About now have equal side gutters. The chain bends through wider sideways pulls and returns with finite spring motion.

The requested code map is in `graphify-out/graph.html` and `GRAPH_REPORT.md`. Its partial JSX coverage and source-snapshot limits are recorded; it is an aid to navigation, not a replacement for source or runtime checks.


## Current project selection — 18 October 2026
This supersedes the earlier showcase and accordion notes. Completed work now contains RoleReady AI, Aushadhi OCR and Supply Chain Simulator. Active work contains AeroHarness and Brain Architecture. `src/projects.mjs` is the single content source for both groups.

RoleReady's URL was found in the local onboarding-engine-backend Git remote and verified against its public repository: https://github.com/hrideymarwah15/roleready-ai. Aushadhi uses https://github.com/hrideymarwah15/Aushadhi_OCR. The supplied shared supply-chain destination is https://github.com/sharmaaaditi/sc-disruption. Brain Architecture has no invented source link.

All five Anatomy illustrations autoplay independently when visible, with no hover/accordion activation. Each has click/Space pause and resume plus arrow-key exploration. Hidden tabs and offscreen figures suspend rendering, and reduced-motion users receive a still illustration. The Aero card demonstrates the full cycle automatically; this visualisation is not an execution or approval control for the real project.

Active-project cards now use 165px illustrations and compact captions. The full Brain Architecture research question is retained in an accessible native details row.


## Working copy and deployment
The current working copy lives at `/Users/hridey/Desktop/Portfolio`, with origin `https://github.com/hrideymarwah15/Portfolio.git`. The existing Vercel project is `portfolio` under `hrideymarwah2907-8975s-projects`; its production branch is `main`. `vercel.json` selects the Vite build and `dist` output, overriding the previous Next.js preset. The project already has an encrypted server-side `GITHUB_TOKEN` for the activity API. No credentials are stored in Git.
