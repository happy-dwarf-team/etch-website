# Design

Design decisions for `etch.happydwarf.dev`. Change them here first, then in code. What the site
contains is in [docs/spec.md](docs/spec.md); terms are in [GLOSSARY.md](GLOSSARY.md).

## Family

The site belongs to the dark-forge family, whose canonical source is the "Family" section of
[`happydwarf-website/DESIGN.md`](https://github.com/happy-dwarf-team/happydwarf-website/blob/main/DESIGN.md#family)
and its `src/styles/forge-family.css`
([#11](https://github.com/happy-dwarf-team/.github/issues/11)).

- `src/styles/forge-family.css` here is a **verbatim copy** with a header naming the source
  repository and commit. Do not edit it; change the source and copy it again.
  It imports the fonts from `@fontsource-variable/ibm-plex-sans` and
  `@fontsource-variable/jetbrains-mono`, both installed here. The site accent and the site's
  own base styles live in `src/styles/site.css`.
- Everything the family defines applies unchanged: neutrals, `--forge-radius`, `--forge-ease`,
  IBM Plex Sans and JetBrains Mono through Fontsource, motion rules, icon grammar, the
  accessibility checklist, the favicon tile.
- Signature effects are not shared: no sparks or ember glow here. Etch's motion is its demo
  loop.

### Site accent: verdigris

The patina of acid-etched copper. Defined in this site's own stylesheet under the family's
names; contrast computed with the WCAG formula:

| Token                   | Value     | Contrast                                          |
| ----------------------- | --------- | ------------------------------------------------- |
| `--forge-accent`        | `#4fc9a8` | 8.8:1 on `--forge-bg`, 7.9:1 on `--forge-surface` |
| `--forge-accent-strong` | `#7fe0c5` | 11.4:1 / 10.4:1                                   |
| `--forge-accent-soft`   | `#11332b` | accent on it 6.7:1, body text on it 11.0:1        |
| `--forge-on-accent`     | `#16171a` | 8.8:1 on accent                                   |

White on verdigris is 2.0:1, so labels on accent fills are always `--forge-on-accent`. The
accent is the one interaction accent on this site: buttons, links, focus ring, the roadmap's
current milestone.

### Mark

- Etch's mark is the extension's glyph (window plus etching stylus, `etch`'s
  `packages/extension/media/icon.svg`), **recoloured to verdigris**, with the "ETCH" wordmark in
  JetBrains Mono, uppercase.
- `src/assets/etch-mark.svg` is that glyph without its tile, drawn in `currentColor` (the icon
  grammar), with a comment naming the source commit; the page sets its colour to
  `--forge-accent`. Favicons put it on the family's favicon tile.
- The footer carries the **family marker**: the full team logo (`src/assets/happy-dwarf.svg`,
  40 px, copied from the hub with a comment naming the source commit) with "A Happy Dwarf
  project", linking to `https://happydwarf.dev/`.

## Layout

From [#13](https://github.com/happy-dwarf-team/.github/issues/13). Prototype for reference only:
[`prototypes/etch-site/index.html`](https://github.com/happy-dwarf-team/.github/blob/prototype/etch-site/prototypes/etch-site/index.html)
(`?variant=D` is the pick; its "video" is an animated SVG and its media are placeholders).

- Section order of `/`: header → split hero → install band → feature tour with the live game,
  the 1.x note and the "does not do" box → roadmap → footer.
- **Hero:** text 5/12 and demo loop 7/12 from **980 px**; stacked, text first, below that. The
  loop still starts in the first screen on a 375 px phone.
- **Feature tour:** numbered rows, each a short text beside its feature's loop, **sides
  alternating from 860 px**; stacked below that. The offline preview has six; the live game's three
  continue the numbering under its heading.
- Side gutter 16 px on phones; **no horizontal scroll at 375 px**.
- Every medium shows at about 650 CSS px wide on desktop (hero 7/12, tour row 1.4/2.4).

## Components

### Demo loop

The hero's loop and every feature's. A 16:9 `figure` with the video, the Pause/Play and Enlarge buttons and the text description in its
`figcaption`. The box is always reserved, so no state causes layout shift. States:

| State          | Shows                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| poster         | the poster (first frame); the initial state                                                                |
| loading        | the poster while the first data arrives                                                                    |
| playing        | the video, with a Pause button                                                                             |
| paused         | the current frame, with a Play button                                                                      |
| off screen     | paused by the controller (below 50 % in view or a hidden tab); resumes on return                           |
| reduced motion | the poster and a Play button; nothing plays until pressed                                                  |
| Save-Data      | the poster and a Play button, as reduced motion                                                            |
| unavailable    | no video (no manifest yet, or the load failed): the reserved box with the text description; no Play button |

- The Pause/Play button is a **44 px pill at the bottom right**, always visible while a video
  can play, with a text label for screen readers.
- The `figcaption` carries the bold lead, the loop's title and length from the manifest
  ("Pick mode, 12 s, silent."), and the description; it is tied to the video with
  `aria-describedby`. Only the hero's poster is preloaded.
- The **Enlarge** chip is a 44 px pill at the bottom left, with a magnifier icon, shown with the
  Pause/Play button; it and a click on the video (`cursor: zoom-in`) open the loop viewer.
- Without JavaScript the buttons stay hidden and the poster stays; the same holds for the
  Copy button, which leaves the command to be selected by hand.

### Loop viewer

One native `<dialog>` for every loop, filled when it opens:

- the loop as large as the screen allows (up to 1600 px wide, 16:9), with the video's own
  controls, and its text description beside a 44 px **Close** button;
- it plays at once unless reduced motion or Save-Data is set; the small loop pauses meanwhile;
- **Esc**, **Close** or a click on the backdrop closes it and returns the focus to the button or
  video that opened it.

### Copy-command box

The install command in mono with a **Copy** button. On success the label reads "Copied" for
about 1.5 s; if the clipboard API is refused, the command's text is selected instead.

### Roadmap timeline

A vertical list M0 → 2.0.0, one line per milestone, the state (done, current, next) shown by a
marker and text, not colour alone; the current milestone uses the accent. A vertical timeline,
not a horizontal track (it reads better on phones).

### Header and footer

- Header: the mark and wordmark, the status badge, anchors _Features · Install · Roadmap_, a
  GitHub link with an `sr-only` label.
- Footer: the family marker, links (Source, Changelog, Issues, MIT) and the disclaimer as its
  own paragraph in muted text.

## Motion

- Family rules only (150–220 ms, `--forge-ease`); no signature effect.
- The loops are the site's only motion. None plays under `prefers-reduced-motion: reduce` or
  Save-Data unless the visitor presses Play, and each plays only while it is half in view.
- Under reduced motion every transition is off.

## Client JavaScript

Limited to two small scripts, each working on top of server-rendered HTML:

1. the **loop controller** (IntersectionObserver, visibility, reduced motion, Save-Data,
   `NotAllowedError`, the Pause/Play and Enlarge buttons, the loop viewer), for every loop on
   the page;
2. the **copy button**.

The stills' lightbox went with them in the 2.0.0 media refresh; the loop viewer took its place.

No analytics, no framework, no third-party scripts.

## Accessibility

The family checklist, plus:

- 44 px media controls (Pause/Play, Enlarge, Close).
- A keyboard-operable loop viewer that returns focus.
- A text description for every loop (WCAG 1.2.1) and a visible pause control (WCAG 2.2.2).
- Every poster has an `alt` from [docs/spec.md](docs/spec.md#32-the-six-features).

## Content rules

- Say nothing beyond the extension README and the v1 specification; the roadmap's 2.0 line
  follows the v2 specification.
- Measurements carry their source; limits are stated plainly; the roadmap says "version numbers
  are indicative".
- No EU4 or Paradox logos or key art, and no game art in the Open Graph image or favicons.
- Every frame shows the editor with Etch's preview or the live game; never bare game art.
