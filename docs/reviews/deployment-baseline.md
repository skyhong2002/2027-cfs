# CFS 2027 deployment baseline

Audited 2026-09-20 (Asia/Taipei), before the information-flow rewrite. Source revision: `900823c007178fa1625b14cd1ff06604e24e32ad`.

## Deployment state

- Preview: <https://skyhong2002.github.io/2027-cfs/>. Verified HTTP 200 using both curl and Chromium.
- GitHub Pages is already configured for GitHub Actions (`build_type: workflow`), HTTPS enabled, no custom domain. No settings change is needed to deploy a commit pushed to `origin/main`.
- [Preview deployment 35453493629](https://github.com/skyhong2002/2027-cfs/actions/runs/35453493629) completed successfully, including Astro check, build, artifact upload, and Pages deployment.
- [CI 35453493672](https://github.com/skyhong2002/2027-cfs/actions/runs/35453493672) passed Astro check, build, and formatting.
- Failed-run queries for both the fork and upstream returned no failed runs; there are no failed logs to diagnose. A cancelled upstream run is not evidence of a broken deployment.
- The upstream `Build CFS site` job is intentionally skipped in the fork. It runs only in `sitcon-tw/2027-cfs`, refreshes spreadsheet data, and publishes a `build` branch for the main SITCON site to consume.
- Fork previews build committed data with `CFS_PREVIEW=1`, Pages-derived `SITE_URL`, and `BASE_PATH=/2027-cfs`. They do not refresh the spreadsheet.
- Production builds without `CFS_PREVIEW=1` render the WIP redirect through `src/middleware.ts`. Existing local production output confirms the static redirect to `https://sitcon.org/wip/cfs`; this should remain a deliberate production-release decision.

## Browser baseline

Chromium desktop 1440 × 1000 and mobile 390 × 844, all outgoing POST requests blocked. No real contact form was submitted.

| Check                                     | Result                                                                     |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| Chinese home `/2027-cfs/`                 | HTTP 200, Chinese document                                                 |
| English home `/2027-cfs/en/`              | HTTP 200, English document                                                 |
| Quotation `/2027-cfs/quotation/`          | HTTP 200, Chinese-only document                                            |
| Chinese item `/2027-cfs/item/6/`          | HTTP 200, popup opens                                                      |
| English item `/2027-cfs/en/item/6/`       | HTTP 200, English popup opens                                              |
| Popup opened from English home            | Incorrectly changes URL to Chinese `/item/6/`; refresh switches to Chinese |
| Desktop/mobile horizontal overflow        | None at tested viewport sizes                                              |
| Runtime page errors / HTTP 4xx+ responses | None observed during the route sweep                                       |
| Select any sponsorship tier               | Blocked: all four tier buttons disabled by the old `2026/02/21` deadline   |
| Title/year                                | Home, English home, and quotation still identify SITCON 2026               |

The initial smoke script checks `#item-popup-6` visibility, but that ID belongs to an empty anchor. Its false result is not an application defect: the popup's `.popup-bg.show` is the correct state check, and both direct item routes pass it.

## Issues to track in the rewrite

1. **P0: Expired 2026 deadlines disable all tier selections.** Replace inherited date behavior with explicit 2027 draft availability; do not invent a new deadline. Acceptance: select any tier, add an eligible item, inspect the estimate, and continue to contact.
2. **P1: English item navigation loses language.** Preserve the active language in open/close/back URLs. Acceptance: opening an item from English, refreshing it, and closing it all remain English.
3. **P1: Contact form reports unverified success.** `mode: no-cors` cannot verify the Google Form accepted the response. Replace the claim with an observable contact handoff (the planned email draft plus copy fallback addresses this), or use a verified backend.
4. **P1: 2027 URLs contain 2026 event claims.** Clearly identify 2027 and label historical data; confirm date, venue, and sponsorship details before they become promises.
5. **P1: English visitors receive a Chinese-only quotation.** Keep the active language in estimate and contact outputs.
6. **P2: Current CI does not exercise the actual preview journey.** The ordinary build check produces WIP redirects, and the preview workflow checks only compilation. Add a preview-mode browser smoke for both languages, a tier, an extra item, estimate, contact handoff, and direct item routes. This is a workflow enhancement, not a Pages settings change.
7. **P2: Old local-storage records persist across years.** The generic `interestItems` key may import expired selections into the new page. Use a versioned key or validate stored selections against current data.

## Reusable local browser tools

The shared environment already provides Playwright 1.63.0:

```js
const { chromium } = require("/tmp/weave-browser/node_modules/playwright");
const browser = await chromium.launch({ headless: true });
```

Auto-detected executable: `/home/deck/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.

`pnpm` is absent from the current shell PATH; the pinned version works via `npx --yes pnpm@10.15.1`.

Temporary route smoke script: `/tmp/cfs-browser-audit/baseline.cjs`. Run against a local preview with:

```bash
AUDIT_BASE=http://localhost:4324/2027-cfs node /tmp/cfs-browser-audit/baseline.cjs
```

It writes `/tmp/cfs-browser-audit/baseline.json`, `baseline-desktop.png`, and `baseline-mobile.png`. The companion `flow.cjs` demonstrated disabled tier controls. These scripts are baseline tools and need selectors adapted to the redesigned UI. No product files, remote configuration, commits, or deployments were changed during this audit.
