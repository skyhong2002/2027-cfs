<div align=center>

# SITCON 2027 贊助徵求書

![Astro](https://img.shields.io/badge/Astro-5f3cbe?logo=astro)  
<https://sitcon.org/2027/cfs>

![](src/assets/img/og.webp)

</div>

## 開發

請先安裝 [Node.js](https://nodejs.org/) 及 [pnpm](https://pnpm.io/installation)，接著執行：

```bash
pnpm i
pnpm dev
```

## Build and publication

This repository builds the CFS site for <https://sitcon.org/2027/cfs/>. The design and static content are copied from 2026; sponsorship data comes from [the 2027 Google Sheet](https://docs.google.com/spreadsheets/d/1VCkTOO8Jb1EilClyu3acL9NXixV0-euB1kSoPPod2Bk/edit).

Pushes to `main` and manual runs of **Build CFS site** fetch the published Sheet and its images, check the project, and publish generated files to this repository's `build` branch. Fetched data is not committed back to `main`. There is no scheduled refresh and no cross-repository write access. A failed build leaves the previous successful output intact.

To publish Sheet-only changes:

1. Run **Build CFS site** on `main` and wait for success.
2. Run **Deploy website** on `main` in `sitcon-tw/2027`.

The main website downloads the finished CFS files into `dist/cfs/` and deploys both sites together. A normal main-site deployment also picks up the latest CFS build. This repository does not publish its own GitHub Pages site.

To build locally with current Sheet data (Node.js 22):

```bash
pnpm install --frozen-lockfile
pnpm fetch-data
pnpm test
pnpm build
```

The fetch command updates local JSON and images. Ordinary builds and pull-request checks can use the checked-in data without fetching the Sheet.
