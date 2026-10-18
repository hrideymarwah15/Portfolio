# Anatomy simulations — current version

The user's correction replaces the repeated linear benches with three different objects:

| Project | Object | Motion | Solids |
| --- | --- | --- | ---: |
| AI Agency OS | Circular dispatcher with three agent canisters | Job token rotates around a table | 47 |
| Supply Chain Simulator | Warehouses, forked roads, barrier and delivery vehicle | Vehicle follows a curved bypass | 52 |
| AeroHarness | Hinged glass validation case around a processor | Lid closes, waits for approval, then reopens | 44 |

These are explanatory illustrations, not live project telemetry. The existing project captions and repository destinations remain.

## Geometry and motion

`src/anatomy/scenes.mjs` defines the actual world geometry. The generator builds static paths once and settles drawing order at 17 poses for each figure. The small moving assemblies are reprojected continuously in the browser; the circular and hinged movement is not simulated with flat SVG rotation. Drawing keys interpolate between the sampled solved orders. Contact/support and order audits pass at open/start, midpoint and end: nine checked poses in total. This is sampled validation, not a proof of every continuous pose. Current results: `.impeccable/review/anatomy/replacement-audit.txt`.

Controls: mouse steering, replay, arrows, Home, End and Escape. AeroHarness holds at its closed middle position until **Approve run** is activated. Approval preserves keyboard focus. Only an active, visible figure animates; automatic motion stops for reduced motion and in hidden tabs.

The native theme chain remains front-facing. It has constant-pitch links, a concealed take-up spring, a weighted grip, wider sideways drag and a lagging bend. The grip follows the last link's angle. Reduced motion resolves changes directly.

## Provenance

[Anatomy](https://aiuxplayground.com/skills/anatomy), [official MIT source](https://github.com/wheresryan22/anatomy), revision `e9488296a44211c42701ff71705b7901470ec78f`. Full notice: `scripts/anatomy/LICENSE`; deployment notice: `public/ANATOMY-LICENSE.txt`. The kit supplies projection, solid construction and build-time geometry audits. No new WebGL context, shader or optional orbit engine is used.

## Checks

```sh
npm run generate:anatomy
node --test scripts/test-anatomy.mjs scripts/test-chain.mjs scripts/test-github.mjs
npm run build
```

Fifteen focused tests cover bounded/circular movement, distinct scene primitives, the blocked route, approval waiting, finite geometry, chain settling/bending/link spacing and the server calendar's validation/cache/credential boundary. Browser verification uses the available CUA tooling, rather than the upstream headless scripts. Alternate browser engines, physical touch hardware and a full screen-reader audit are outside this pass.


## Five-card showcase update — 18 October 2026
This supersedes the earlier three-experiment and replay/approval controls. The current figures are: RoleReady learning path (52 solids), Aushadhi inspection arch and blister (49), branching delivery network (52), Aero validation case (44), and cognitive modules with shared memory (52). All are built with the same licensed Anatomy geometry kit and theme materials.

The generator records 17 solved drawing orders per figure. Physical support, intersection and drawing-order audits run at positions 0, 0.5 and 1: 15 sampled checks, recorded in `.impeccable/review/anatomy/five-project-audit.txt`. These are sampled checks, not a proof of all continuous positions.

Every visible illustration autoplays independently. Click/Space pauses or resumes a figure; arrow keys pause and explore its pose; mouse exploration resumes automatically after a short idle. Aero's automatic demonstration advances through the review step rather than waiting for approval. The model still supports an explicit approval stop for callers that request it. No real agent execution is controlled by these illustrations.
