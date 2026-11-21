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
- Signature effects are not shared: no sparks or ember glow here. Etch's motion is its loops.

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
accent is the one interaction accent on this site: buttons, links, focus ring, the selected
feature's number and progress bar, the playing chapter, the What's new pill and the "new" mark.
(Until the 2026-11 redesign also the roadmap's current milestone.)

### Mark

- Etch's mark is the extension's glyph (window plus etching stylus, `etch`'s
  `packages/extension/media/icon.svg`), **recoloured to verdigris**, with the "ETCH" wordmark in
  JetBrains Mono, uppercase.
- `src/assets/etch-mark.svg` is that glyph without its tile, drawn in `currentColor` (the icon
  grammar), with a comment naming the source commit; the page sets its colour to
  `--forge-accent`. Favicons put it on the family's favicon tile.
- The footer of every page, the docs included, carries the **family marker**: the full team logo
  (`src/assets/happy-dwarf.svg`, 40 px, copied from the hub with a comment naming the source
  commit) with "A Happy Dwarf project", linking to `https://happydwarf.dev/`.

## Layout

From the 2026-11 redesign (decided with @s-tyda on 2026-11-21, from a local prototype of the home
page and the docs; spec section 3). Until then: [#13](https://github.com/happy-dwarf-team/.github/issues/13)'s
split hero and a feature tour of alternating rows.

- Section order of `/`: header → hero (centred text, the demo loop, its chapters) → install
  band → areas → four feature sections (Interface windows, Textures and meshes, The live game,
  Scripts) → proof band → closing call → footer.
- Content width up to **1200 px**, side gutter 16 px on phones; **no horizontal scroll at 375
  px** (and 360 px).
- **Hero:** eyebrow, h1, lead and buttons centred, the lead at most about 46 rem wide; the demo
  loop under them at the content's full width (VS Code's footage needs it: at 650 px its code
  does not read), its chapters right under it.
- **Areas:** four tiles in one row from 980 px, two by two from 600 px, one column below.
- **Feature sections:** a heading block (eyebrow, h2, one sentence), then the section player:
  from **980 px** the feature list 5/12 beside the stage 7/12, the list on the left in Interface
  windows and The live game and on the right in Textures and meshes and Scripts; below 980 px the
  stage first, then the list. A section's stage shows its loop at about 650 CSS px wide on desktop.
- **Proof band:** three facts in one row from 720 px, stacked below; the numbers in mono.
- **Docs:** Starlight's layout under the site's own header and footer: sidebar on the left (a
  menu button below Starlight's breakpoint), the page in the middle, "On this page" on the right
  on wide screens.

## Components

### Loop

Every loop: the demo loop, a section player's stage and a docs page's loop. A 16:9 `figure`
with the video, the Pause/Play and Enlarge buttons and the text description. The box is always
reserved, so no state causes layout shift. States:

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

- The Pause/Play button is a **44 px pill at the top right**, always visible while a video can
  play, with a text label for screen readers that names the loop ("Pause the pick mode loop").
  The **Enlarge** chip is a 44 px pill left of it, with a magnifier icon and the word "Enlarge"
  from 720 px; it and a click on the video (`cursor: zoom-in`) open the loop viewer. (Until the
  redesign both sat at the bottom; the loops' own captions sit in the band at the bottom.)
- The text description opens with the bold lead, the loop's title and length from the manifest
  ("Pick mode, 12 s, silent."), and is tied to the video with `aria-describedby`. On the home
  page it is visually hidden (`sr-only`); on a docs page it is shown under the loop.
- Only the demo loop's poster is preloaded.
- Without JavaScript the buttons stay hidden and the poster stays; the same holds for the
  Copy button, which leaves the command to be selected by hand.

### Demo loop's chapters

An ordered list under the demo loop, one button per chapter (at least 44 px high): its number in
mono, its label, and a 2 px bar that fills while the chapter plays. The playing chapter has
`aria-current="true"`, its number in the accent and its label in `--forge-text`; the others are
muted. A click seeks the loop to the chapter. Five in one row from 720 px; below it the playing
chapter's label alone, the others with their number and bar.

### Section player

- The **feature list**: one button per feature (the whole row, at least 44 px high) with its
  number in mono (`01`…), its title and the loop's length in muted mono. The selected feature
  has `aria-expanded="true"`, its number and progress bar in the accent, and shows its short
  text under the title; the others show only the title. Every button names the stage with
  `aria-controls`. A disclosure list, not ARIA tabs: the stage moves on by itself and its panel is
  shared.
- The **stage**: one loop (above), swapped when the selection changes, with no layout shift.
- While the section is at least half in view the player moves on when a loop ends, and the
  progress bar of the selected feature fills with its loop. Once the visitor picks a feature,
  presses Pause or opens the viewer, it stays on that feature.

### What's new pill

A pill above the hero's eyebrow: "New in 2.13" in `--forge-on-accent` on the accent, then one line
in `--forge-text` on `--forge-accent-soft`, and an arrow; the whole pill is one link, at least
44 px high. The area it points at carries a small "new" mark in the same colours.

### Area tiles

A link per area on `--forge-surface` with a 1 px `--forge-border`: the files in muted mono, the
name in bold, one line of text. Hover and focus raise the border to the accent; no movement.

### Proof band

Three facts on `--forge-surface`, each a link to its docs page: the number large, in mono, in
`--forge-text`; one line under it in `--forge-text-muted`. No source line on the home page (the
linked page gives it).

### Loop viewer

One native `<dialog>` for every loop, filled when it opens:

- the loop as large as the screen allows (up to 1600 px wide, 16:9), with the video's own
  controls, and its text description beside a 44 px **Close** button;
- it plays at once unless reduced motion or Save-Data is set; the small loop pauses meanwhile;
- **Esc**, **Close** or a click on the backdrop closes it and returns the focus to the button or
  video that opened it.

### Copy-command box

The install command in mono with a **Copy** button. On success the label reads "Copied" for
about 1.5 s; if the clipboard API is refused, the command's text is selected instead. The
command may shrink and scroll inside its box; the box never widens the page.

### Header and footer

- Header, on every page: the mark and wordmark, the status badge, links _Features · Docs ·
  Changelog_, a GitHub link with an `sr-only` label. In the docs the same header, with
  Starlight's search beside the links. (Until the redesign: _Features · Install · Roadmap_.)
- Footer, on every page: the family marker, links (Docs, Changelog, Source, Issues, Discord, MIT;
  Discord as a text link, no logo) and the disclaimer as its own paragraph in muted text.

### Docs

- **Starlight** with the forge family's tokens and the verdigris accent mapped onto Starlight's
  variables (`--sl-color-accent*`, grays, fonts: IBM Plex Sans for text, JetBrains Mono for
  code), **dark only**: no theme switch. The site's header and footer replace Starlight's through
  its component overrides.
- Bold for what you click, `kbd` for keys, code style only for file names, paths and script
  text.
- A page's loop is the Loop component above, with its description shown. The changelog page
  (spec section 3.5) uses `<details>` for older releases: the summary row is the version, the
  date and, for the newest, a **Latest** badge in the accent.

## Motion

- Family rules only (150–220 ms, `--forge-ease`); no signature effect.
- The loops are the site's only motion, with the progress bars that follow them. None plays
  under `prefers-reduced-motion: reduce` or Save-Data unless the visitor presses Play, and each
  plays only while it is half in view. Under reduced motion or Save-Data a section player does
  not move on by itself.
- Under reduced motion every transition is off.

## Client JavaScript

On the home page and 404, limited to two small scripts, each working on top of server-rendered
HTML:

1. the **loop controller** (IntersectionObserver, visibility, reduced motion, Save-Data,
   `NotAllowedError`, the Pause/Play and Enlarge buttons, the loop viewer, the section players
   and the demo loop's chapters), for every loop on the page;
2. the **copy button**.

On `/docs/`, the loop controller for a page's loop and Starlight's own scripts (search, the
sidebar on phones, the table of contents). No analytics, no UI framework, no third-party scripts.

## Accessibility

The family checklist, plus:

- 44 px media controls (Pause/Play, Enlarge, Close), chapter and feature buttons.
- A keyboard-operable loop viewer that returns focus; feature and chapter buttons in the tab
  order, in reading order.
- A text description for every loop (WCAG 1.2.1) and a visible pause control (WCAG 2.2.2).
- Every poster has an `alt` from [docs/spec.md](docs/spec.md#32-feature-sections).
- The selected feature and the playing chapter are shown by more than colour: the expanded text,
  the filled bar, `aria-expanded` and `aria-current`.

## Content rules

- Say nothing beyond the extension, its docs pages and the v1 and v2 specifications.
- Plain language for modders who are not programmers, with the review of spec section 3.4.3
  before a text merges.
- Every measurement carries its source and conditions on the docs page it links to; limits are
  stated plainly, on the docs pages.
- No EU4 or Paradox logos or key art, and no game art in the Open Graph image or favicons.
- Every frame shows Etch at work (spec section 1.1): the editor with Etch's preview, its Mesh
  or Texture Preview with its bar, its hovers, or the live game with Etch's part in it; never bare
  game art.
