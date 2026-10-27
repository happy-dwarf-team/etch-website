# Etch website: repository rules

- Static site: Astro without Starlight, deployed to GitHub Pages. Keep it minimal: no UI
  framework, no Tailwind, no analytics, no third-party scripts. Client-side JavaScript is
  limited to the demo loop controller, the lightbox and the copy button.
- What the site contains is in [docs/spec.md](docs/spec.md), design decisions in
  [DESIGN.md](DESIGN.md) and terms in [GLOSSARY.md](GLOSSARY.md). Change a rule there first,
  then in code. Keep text contrast at 4.5:1 or more, keep focus rings visible, and respect
  `prefers-reduced-motion`.
- Internal links in components go through `url()` from `src/lib/url.ts`. The site must work
  both at the custom domain and under `/etch-website/`.
- Content is English. Say nothing beyond Etch's README and v1 specification (the roadmap's
  2.0 line follows the v2 specification), state the source
  of every measurement and mark unverified claims. Do not imply affiliation with Paradox
  Interactive. No EU4 or Paradox logos or key art, and no game files in this repository.
- Check `npm run check`, `npm run build`, `npm run check:links`, `npm run check:a11y` and
  `npm run check:media` before finishing a change; CI runs all five. `src/data/media.json` is
  written by `pnpm media publish` in `etch`, never by hand.
- The agent owns the pull request flow: it works on a branch with Conventional Commits,
  pushes it and opens the PR as a draft. Once ready (green CI, build checked, no blocking
  review findings, not put on hold by the user) it marks the PR ready and squash-merges
  it; GitHub does not allow auto-merge on a draft. Pull requests from other contributors
  get a review and a recommendation; the maintainer decides on merging them. Do not
  bypass CI or branch protection, and do not change repository settings beyond what
  auto-merge needs.

## Development

`npm run dev` starts the dev server on http://localhost:4321. Astro docs:
https://docs.astro.build.
