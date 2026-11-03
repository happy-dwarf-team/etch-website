# etch.happydwarf.dev specification

What the Etch website is, what it shows, how its media are made and published, and how it
launches. Design rules are in [DESIGN.md](../DESIGN.md) and terms in
[GLOSSARY.md](../GLOSSARY.md). Change a rule here first, then in code.

Every rule comes from the wayfinder map
[happy-dwarf-team/.github#4](https://github.com/happy-dwarf-team/.github/issues/4) and the
resolutions of its tickets, linked where a rule is stated. Prototypes and research notes on the
`prototype/*` and `research/*` branches of `.github` are references only: where they differ from
this file, this file wins. Copy marked _draft_ is final wording to be edited at build time
within the rule it belongs to.

Shared parts live in the [hub specification](https://github.com/happy-dwarf-team/happydwarf-website/blob/main/docs/spec.md)
(_hub spec_ below): the repository setup this site copies (section 2), the DNS table (7.1), the
media bucket (7.2), its setup and verification (7.3–7.5) and the upload token (7.4). The family
design system is defined in the hub's
[DESIGN.md](https://github.com/happy-dwarf-team/happydwarf-website/blob/main/DESIGN.md#family).

Section 8 specifies work in the [`etch`](https://github.com/happy-dwarf-team/etch) repository
(the media pipeline), so the media contract has one source, on the side that consumes it
([#26](https://github.com/happy-dwarf-team/.github/issues/26)). `etch`'s own `docs/spec/v1.md`
stays about the extension.

## 1. Purpose and scope

- **What:** the website of Etch, the VS Code extension that previews Europa Universalis IV
  interface mods, at **`https://etch.happydwarf.dev/`**: a landing page with a demo loop, the
  preview's features and the live game's, each with a short loop, install, and the status and
  roadmap to v1 and v2.
- **Language:** English only.
- **User documentation stays in the extension README** (linked from Install). Revisit only if
  user docs move to the site ([#13](https://github.com/happy-dwarf-team/.github/issues/13)).
- **Not on the site:** a blog, newsletter, full user docs, a separate gallery, analytics,
  cookies, a consent banner.
- **Content rules:** say nothing beyond what the extension README and the v1 and v2
  specifications say (since 2.0.0 the v2 specification describes the release; before it, only
  the roadmap's unreleased milestone followed it);
  measurements carry their source (e.g. "warm reload median 6–7 ms, p95 8–14 ms, maintainer's
  machine, etch#39"); limits stated plainly; the roadmap is marked indicative.

### 1.1 Game art on the site

From [#7](https://github.com/happy-dwarf-team/.github/issues/7) and
[#21](https://github.com/happy-dwarf-team/.github/issues/21). Our interpretation of the Paradox
User Agreement (sections 5–6, last update 2026-01-21), not legal advice.

- Screenshots and silent loops show **Etch rendering EU4 interface art from a local copy of the
  game**, with Etch and the mod's layout as the subject. **Every frame shows the editor and
  Etch's preview together**, never bare game art. No game audio.
- Since the 2.0.0 media refresh the clips edit the province view as a mod overrides it: the
  editor shows the text of the base game's `interface/provinceview.gui`, copied from the local
  game into each take's throwaway workspace and never stored (section 8.2). We read this like
  the interface art: Etch and the mod's layout stay the subject.
- The loops move a camera over the recorded windows (section 8.4): close-ups follow what the
  feature does, and **whenever a close-up leaves the editor out, an inset of the editor stays in
  frame**, so every frame still shows the editor and Etch's preview together.
- **The live game's loops** (section 3.2.1) show EU4 itself running beside VS Code, as Etch's
  live game runs it: every frame shows the editor and the game's window together (side by side,
  or one filling the frame and the other in an inset), never the game alone. They show the game
  in play with the province view open (the window being edited, its map beside it), paused and
  silent, never the launcher, the main menu or a loading screen, so no logo or key art is in
  frame. The save is the player's own copy, played in the take's throwaway profile (section 8.3).
- Everything is free and non-commercial: no paywall, ads or sales.
- **No EU4 or Paradox logos or key art** anywhere, Open Graph image and favicon included.
  "Europa Universalis IV" appears as plain descriptive text.
- **No game files** (extracted art, `.dds`, `.gfx` copies, fonts) in this repository or in the
  media bucket.
- **Our reading:** the site launches on our reading of section 6 (own-site hosting of free Etch
  media is covered) and waits for nothing; we do not ask Paradox now.
- **Triggers:** we write to Paradox before acting if (1) we want the EU4 or Paradox logo or key
  art, (2) any monetization tied to the media appears, (3) Paradox contacts us about Etch or the
  sites, or (4) sections 5–6 change in a way that weakens our reading.
- **On an objection** (a takedown request, a removal of our UGC, a rule change aimed at this
  use): remove the named media from the bucket and the site within **7 days**, without dispute
  (a _takedown_, hub spec 7.2); the site keeps running with media without EU4 art (the demo mod
  then gets its own textures); only then decide whether to ask for permission.

## 2. Stack and repository

As the hub (hub spec section 2): Astro, static output, **no Starlight**, GitHub Pages through a
workflow, Node.js 22+, Fontsource fonts, `url()` helper and `SITE_URL`/`SITE_BASE` with
`trailingSlash: 'always'`, the `deploy` workflow (push to `main`, `pull_request`,
`workflow_dispatch`, `repository_dispatch`, `schedule` every six hours) and the `pr-title` workflow,
Pages source "GitHub Actions", the `main` ruleset (`build`, `conventional-title`) added after both
workflows exist, `AGENTS.md`/`CLAUDE.md` and `SECURITY.md`.

Differences from the hub:

- **Client-side JavaScript is limited to two things:** the loop controller, with its loop
  viewer, and the copy button ([#13](https://github.com/happy-dwarf-team/.github/issues/13); the
  stills' lightbox went with them in the 2.0.0 media refresh). No analytics, no framework.
- **The `build` job also checks the media manifest** (section 5.3) beside `check:links` and
  `check:a11y`.
- The preview deployment is `https://happy-dwarf-team.github.io/etch-website/`.
- The build fetches the latest `happy-dwarf-team/etch` release from the GitHub API (section
  3.1 and 6.3). If it cannot be fetched, the build continues without a version number, with a
  warning.
- **Rebuild after an Etch release:** once `etch`'s `release.yml` has attached the VSIX, its
  `website.yml` sends a `project-release` `repository_dispatch` here (and to the hub, hub spec
  4.5), so the badge shows the new version within minutes. It uses the organization secret
  `WEBSITE_DISPATCH_TOKEN` (fine-grained, **Contents: write** on `etch-website`). The schedule
  every six hours is the safety net for a missed dispatch.

## 3. Pages

**`/` and `404`**, no Starlight: the content is one page
([#13](https://github.com/happy-dwarf-team/.github/issues/13)). Layout and components are in
[DESIGN.md](../DESIGN.md); prototype for reference:
[`prototypes/etch-site/index.html`](https://github.com/happy-dwarf-team/.github/blob/prototype/etch-site/prototypes/etch-site/index.html)
(open with `?variant=D`).

### 3.1 Sections of `/`, in order

1. **Header:** the Etch mark in verdigris and the "ETCH" wordmark; a status badge
   "Preview · 0.1.0"; anchors _Features · Install · Roadmap_; a GitHub link to `etch`.
   - The **version** in the badge is the latest `etch` release, fetched at build time (the same
     fetch as `softwareVersion` in section 6.3); without it the badge shows only the status.
   - The **status** ("Preview" while the extension was marked `preview`, "Stable" since
     1.0.0) is hand-edited in the site's data file `src/data/status.yaml` together with the
     roadmap states (section 3.5),
     changed by a PR when a release changes them. (Decided with @s-tyda while writing this spec;
     the map left the source open.) The build fails when a milestone whose version is at or
     below the latest release's (major and minor) is still `next`, so a release that the file
     has not caught up with stops the build instead of shipping a stale roadmap; without the
     fetched version there is no check.
2. **Hero, split:** text beside the demo loop (section 4.1).
   - Text (drafts): eyebrow "EU4 interface mods · VS Code"; h1 "Edit the `.gui`. Watch the
     window."; one sentence on what Etch does, the preview and, since 2.0.0, the live game;
     primary button **"Install from VS Code
     Marketplace"**, secondary **"Open VSX"**; requirements line _Windows x64 · VS Code 1.100+ ·
     EU4 1.37.5 (Steam) · No telemetry_.
   - On a 375 px phone the loop still starts in the first screen.
3. **Install band**, one line: `code --install-extension happy-dwarf-team.etch` with a **Copy**
   button, "open a `.gui` and run **Etch: Open Preview**", and a link to the extension README.
4. **Features as a tour:** a short introduction to 2.0's two parts, six numbered rows, each a
   short text beside its feature's loop (section 3.2), then the **live game** with three more
   rows (section 3.2.1), the **Etch 1.x note** (section 3.2.2), then a box **"What 2.0.0 does
   not do"** (section 3.3).
5. **Roadmap:** a vertical timeline (section 3.5).
6. **Footer** (section 7).

There is no separate gallery.

### 3.2 The six features

Since 2.0.0 the tour opens with Etch's two parts, following the extension README and ADR 0005
(draft): "Etch has two parts. The **offline preview** needs no running game: it draws the window
under the cursor from the unsaved buffer, in one **view** of the window from its profile (the
province view as an own or a foreign province, with one side panel and one sub-panel), with
**sample data** where the game's code fills in texts: a live snapshot, a save, the game's and
the mod's files, or generated text. The **live game** is the game itself, beside the editor."
The rows follow.

In this order, one loop each (until the 2.0.0 media refresh a still each,
[#13](https://github.com/happy-dwarf-team/.github/issues/13),
[#19](https://github.com/happy-dwarf-team/.github/issues/19)). Texts are drafts from the
prototype, edited at build time without going beyond the extension README; each loop's text
description says what its clip shows (section 8.5) and follows the lead "**<title>, <n> s,
silent.**" (section 4.1). Every offline loop opens and closes on the wide shot of VS Code, which
is its poster, with the poster alt "VS Code with provinceview.gui on the left and Etch's preview
of the province view on the right." unless the row gives its own.

| #   | Feature                           | Text (draft)                                                                                                                                                                                                                                                                                                                        | Loop       | Text description (draft)                                                                                                                                                                                                                                              |
| --- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Preview as you type               | The preview follows the unsaved editor buffer on every change, including the mod's `.gfx` and localisation files. Warm reload: median 6–7 ms, p95 8–14 ms (measured on the maintainer's machine, etch#39).                                                                                                                          | `preview`  | The view moves in on the preview, with the edited line in an inset. The buildings panel's x, 480, is retyped as 7, 72 and 720, unsaved, and the panel jumps to each position at once. An undo returns it.                                                             |
| 2   | Views of the window               | A window with a window profile is drawn in one view, as the game would show it: the province view as an own or a foreign province, with its province or state tab, one side panel and one sub-panel. **View ▾** lists the views and every selector with where its value comes from; **Save as view…** writes your own into the mod. | `views`    | The view moves in on the preview. In **View ▾** two other views of the province view are chosen in turn and the window is drawn in each, then the own province's view again.                                                                                          |
| 3   | Sample data                       | Texts the game's code fills (a province's name, its development, culture, religion) show sample data. **Data ▾** shows the layers, the upper winning: a live snapshot, a save, the game's and the mod's files, and generated text of a chosen length.                                                                               | `data`     | In **Data ▾** generated text is set to long, and the view moves in on the province view's header, where long names and numbers fill their boxes; then the text is set back to typical.                                                                                |
| 4   | Zoom without a new layout         | Zoom changes only how big the preview is shown, never the resolution the window is laid out at. **Ctrl+mouse wheel** zooms around the cursor; above 100 % only whole steps are offered, so pixels stay sharp.                                                                                                                       | `zoom`     | With the pointer on the province view's header, Ctrl+mouse wheel zooms the preview in two whole steps around it, game pixels sharp; a click on the zoom level fits it again.                                                                                          |
| 5   | Widget outline and jump to source | The Widget Outline lists the window's widgets, a window's alternatives as radios and an eye on every other widget. Click a widget in the preview to reveal its source; hover to see its path and rect.                                                                                                                              | `outline`  | The Widget Outline is open in the sidebar. The pointer hovers three widgets in the preview, each outlined with a tooltip giving its path and rect; a click on a building selects its definition in `provinceview.gui` and in the outline. Go Back returns the cursor. |
| 6   | Diagnostics in Problems           | Missing sprites, fonts and textures, duplicate names and more appear in VS Code's Problems panel as you edit.                                                                                                                                                                                                                       | `problems` | Two letters of a sprite name in `provinceview.gui` are swapped. Problems reports the missing sprite at once, and in the preview the buildings panel's background is gone while the rest of the window still draws. An undo fixes it.                                  |

Then a short list **"Also in the preview"**, without loops (drafts, following the extension
README): **Pin** keeps the preview on one window while you edit other files; any resolution (the
game's `settings.txt`, the monitor's, a corpus resolution from 1280×720 to 3840×2160, 3840×2160 not
yet measured against the game, or any width × height; `if_resolution` blocks follow it); Etch
finds the game through Steam and draws with its textures, fonts and localisation, ships none of
them and sends nothing anywhere.

Until the 2.0.0 media refresh the rows were 0.x's: preview, pin, outline, problems, resolution
and playset, on the demo mod's dialog.

### 3.2.1 The live game

Since 2.0.0 the live game follows the tour, replacing the game host note (M3), following the
extension README (drafts): the heading "The live game", then three more rows of the tour,
numbered 07–09, each a short text beside its loop. Their poster alt is "VS Code with
provinceview.gui beside the live game, its province view open."

| #   | Feature        | Text (draft)                                                                                                                                                                                                                                                                     | Loop       | Text description (draft)                                                                                                                                                                                                                                                                 |
| --- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7   | Reload on save | **Etch: Start the Live Game**, or the preview's **Live game** button, starts a private copy of the game with your mod's playset. You play it; each file you save is reloaded into the game's own window, with its real data. A file nothing rebuilds asks for a planned restart. | `reload`   | VS Code beside the live game, its province view open. One keystroke changes the buildings panel's x from 480 to 580 and a save reloads the window in the game: the panel moves right. An undo and a save move it back.                                                                   |
| 8   | Pick mode      | **Ctrl+Shift+E** turns on pick mode: the widget under the pointer is outlined with its name, kind, size and file, and a click opens its definition at its line in VS Code, without the game taking the click.                                                                    | `pick`     | Ctrl+Shift+E in the game turns on pick mode, with VS Code in an inset. The pointer moves over the province view and each widget is outlined with its name, kind, size and file. A click on the buildings panel brings VS Code forward at the definition of the widget under the pointer. |
| 9   | Live snapshot  | A pick also takes a live snapshot of the window: the texts, visibility and states the game shows, which the preview uses as its upper data layer.                                                                                                                                | `snapshot` | Etch's preview of the province view shows sample data, with the live game in an inset. A pick in the game takes a live snapshot, and the preview redraws with the texts the game shows.                                                                                                  |

Then: "Etch creates the private install on first use, after one confirmation. It never writes to
your game folder, profile or mods, and never changes `eu4.exe`." It ends with a visible link
**"Built on Anvil"** to `https://anvil.happydwarf.dev/`, Anvil being the plugin loader the live
game runs on.

### 3.2.2 Etch 1.x note

A short note after the live game, following the extension README's "Etch 1.x" section
(etch#209) and ADR 0005 (draft): heading "Staying on 1.x", then "2.0.0 replaced 1.x's game host
and its diff view with the live game. To keep them, install 1.0.x: in the Extensions view,
**Install Specific Version…** on Etch, then 1.0.x, and turn off automatic updates for it. 1.0.x
gets no fixes after 2.0.0." It links that README section and ADR 0005.

### 3.3 "What 2.0.0 does not do"

The version in the title is the latest `etch` release, from the same build-time fetch as the
badge; without it the title reads "What Etch does not do". (Until 2.0.0 the title said "does not
do yet".) Drafts, following the extension README:

- Values the engine works out (income, modifiers) come from a live snapshot or are generated:
  Etch never computes one. Ironman and other binary saves are not readable.
- Reloading does not work in ironman or multiplayer games, and a file nothing rebuilds
  (`countryview.gui`, `.gfx` files, fonts) asks for a planned restart.
- You edit in VS Code's own text editor, not in the preview or the game.
- Windows (x64), VS Code 1.100+, EU4 1.37.5 from Steam; the live game needs build 1.37.5
  exactly.

### 3.4 Install

- Primary: the VS Code Marketplace page of `happy-dwarf-team.etch`. Secondary: its Open VSX
  page. Requirements and the extension README as in sections 3.1 and 3.3.
- Etch's Marketplace and Open VSX listings themselves are out of scope.

### 3.5 Roadmap

A vertical timeline **M0 → M1 → M2 → M3 → M4 → 1.0.0 → 2.0.0**, one line each from `etch`'s
[v1 specification](https://github.com/happy-dwarf-team/etch/blob/main/docs/spec/v1.md) section
11, with a link to the v1 specification (until 1.0.0 also the note "version numbers are
indicative"; since 1.0.0 a link to its `after-v1.md`, what v1 left, and since 2.0.0 to
`after-v2.md`, which took that over). Each milestone's state (done, current, next) comes from
`src/data/status.yaml`. The current milestone also names the latest release when it is a later
one ("2.0.0, now 2.2.0"), from the version the badge fetches, so a reader does not take the
milestone's version for the newest; without the fetched version it shows the milestone's alone.

The **2.0** line comes from `etch`'s
[v2 specification](https://github.com/happy-dwarf-team/etch/blob/main/docs/spec/v2.md) (its
summary and section 13), added as `next` once that specification was done
([etch#156](https://github.com/happy-dwarf-team/etch/issues/156)). It is one milestone, not
M5–M10: v2 makes no store release before 2.0.0. The text above the timeline links to the v2
specification and says 2.0.0 is not released, without claiming any of it is built. M3 and M4
stay as history; the game host note and the feature tour change with the 2.0.0 release, not
before (etch#156). Since 2.0.0 (released 2026-11-01) 2.0 is `current`, 1.0 is `done`, and the
text says 2.0.0 is the whole of the v2 specification, frozen with it.

| Milestone               | Version | Line (draft)                                                                                                                                                                                                                    |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M0 Foundation           | —       | Public repository, CI, release-please, packaged VSIX.                                                                                                                                                                           |
| M1 Offline preview      | 0.1.0   | Released on the Marketplace and Open VSX, marked preview. Everything in the feature tour.                                                                                                                                       |
| M2 Precision corpus     | 0.2.0   | Measured against the game, widget by widget, at six resolutions: vanilla and Proper 2K UI Enhanced.                                                                                                                             |
| M3 Game host            | 0.3.0   | A private copy of the running game draws the window itself.                                                                                                                                                                     |
| M4 Compare and scale    | 0.4.0   | Diff view between the two backends; the Anbennar playset in both.                                                                                                                                                               |
| 1.0 Release             | 1.0.0   | The release criteria hold and the preview flag is gone.                                                                                                                                                                         |
| 2.0 Live game and views | 2.0.0   | A live game reloads each saved file into the game's own window, with pick mode; the preview shows a view of the window from its profile, with sample data from saves and live snapshots. The game host and the diff view leave. |

### 3.6 `404`

The same header and footer as `/`, an h1 and a link back to `/`. Title in section 6.1.

## 4. Media on the page

From [#8](https://github.com/happy-dwarf-team/.github/issues/8),
[#13](https://github.com/happy-dwarf-team/.github/issues/13) and
[#19](https://github.com/happy-dwarf-team/.github/issues/19). Component states and sizes are in
[DESIGN.md](../DESIGN.md).

### 4.1 Loops

The hero's demo loop and every feature's loop (sections 3.2 and 3.2.1) follow the same rules:

- Markup: `<video muted loop playsinline preload="none">` with the **poster**, `width` and
  `height`, and two `<source>`s from the media manifest: **VP9 WebM first, H.264 MP4 second**. No
  `autoplay` attribute and no audio track.
- The hero poster is preloaded with `fetchpriority="high"` (it is the LCP image) and is
  same-origin, from the site's own assets. The feature loops' posters are below the first
  screen and not preloaded.
- A small script plays a loop only when **`prefers-reduced-motion: no-preference`** and the loop
  is **at least 50 % in view**; it pauses off screen and in a hidden tab, and handles
  `NotAllowedError` by staying on the poster. A loop loads nothing before it plays.
- A **visible 44 px Pause/Play button** at the bottom right (WCAG 2.2.2), labelled for screen
  readers with what it plays ("the pick mode loop").
- **Reduced motion or Save-Data** (`navigator.connection.saveData`): the poster and a Play
  button; nothing plays until pressed. Otherwise phones follow the desktop rules.
- **Slow or failed load:** the poster and the description stay; the 16:9 box is reserved, so
  there is no layout shift.
- **Text description** in the `figcaption`, tied to the video with `aria-describedby`
  (WCAG 1.2.1, video-only content); no captions track. It opens with the bold lead
  "**<title>, <n> s, silent.**", the length rounded from the manifest's `duration`. The feature
  loops' descriptions are in sections 3.2 and 3.2.1; the demo loop's, a draft:

  > **Demo loop, 15 s, silent.** Three moments from the loops below. In VS Code, the buildings
  > panel's x in an unsaved `provinceview.gui` is retyped digit by digit, and Etch's preview
  > redraws the panel at every keystroke. Beside the live game, a save reloads the province view
  > in the game and the panel moves. In the game, pick mode outlines each widget under the pointer
  > with its name, kind, size and file, and a click opens its definition in VS Code.

  (Until the 2.0.0 media refresh the loop widened the demo mod's dialog; at the refresh it first
  moved the buildings panel and chose the army builder's view.)

- **Poster `alt`** of the demo loop: "VS Code with provinceview.gui on the left and Etch's
  preview of the province view on the right." Every poster is its loop's first frame, so starting
  playback does not jump.

### 4.2 The loop viewer

- **Every loop can be enlarged:** a visible **Enlarge** chip at its bottom left (not hover-only,
  labelled for screen readers with what it shows), or a click on the video, opens one native
  `<dialog>` with the same loop as large as the screen allows, the video's own controls (pause,
  seek, full screen) and its text description.
- In the viewer the loop follows the page's rules: it plays at once unless reduced motion or
  Save-Data is set, which leave its poster and controls. The small loop pauses while the viewer
  is open and goes on as before after it.
- **Esc**, **Close** or a click outside the dialog closes it and returns the focus to what opened
  it.
- Until the 2.0.0 media refresh every feature had a 2560 × 1440 still with a lightbox ("Enlarge",
  Previous/Next, "Actual size"); the loops and their viewer replaced them.

### 4.3 Before the first media refresh

Until the first media manifest exists (between the home page build and the first media
publication), the site still builds: **the manifest is optional**, and without it every loop
renders its **unavailable** state: the reserved 16:9 box with the text description, no video and
no image. No placeholder media are committed. (Decided with @s-tyda
while writing this spec; the map left it open.) The site launches only with real media
(section 9).

## 5. Media manifest

From [#17](https://github.com/happy-dwarf-team/.github/issues/17) and
[#24](https://github.com/happy-dwarf-team/.github/issues/24).

### 5.1 Files

- **`src/data/media.json`**: generated by `pnpm media publish` in `etch` (section 8.8), never
  edited by hand. It is the only place the site learns bucket keys from.
- **`src/assets/media/<clip>.png`**: the loops' posters, committed without a hash in the name
  (Astro hashes its output).
- One manifest describes the whole set of one media refresh.

### 5.2 Schema

Validated by a zod schema in the site's code; the build fails on error.

```json
{
  "schemaVersion": 2,
  "etch": "2.0.0",
  "loops": {
    "hero": {
      "width": 1920,
      "height": 1080,
      "duration": 20.0,
      "poster": "hero.png",
      "sources": [
        {
          "src": "https://media.happydwarf.dev/etch/v2.0.0/hero.3f9a2c1d.webm",
          "type": "video/webm; codecs=\"vp9\"",
          "bytes": 1331234
        },
        {
          "src": "https://media.happydwarf.dev/etch/v2.0.0/hero.9b1e77a0.mp4",
          "type": "video/mp4; codecs=\"avc1.640028\"",
          "bytes": 1412345
        }
      ]
    },
    "preview": { "…": "the same fields, for each clip" }
  }
}
```

(Values are examples.)

- `etch`: the Etch version the set was captured for (also the `v<version>` in the keys).
- The manifest carries **only facts about files**. The loops' text descriptions, the posters'
  alts and the order of the features are editorial content and stay in the site's code
  (sections 3.2, 3.2.1 and 4.1).
- **Clip ids** (`hero`, `preview`, `views`, `data`, `zoom`, `outline`, `problems`, `reload`,
  `pick`, `snapshot`) are defined by the media script and are the same in bucket keys, file names
  and the manifest. Every set has all ten loops.
- Schema version 1, before the 2.0.0 media refresh, had the hero loop and six stills (with
  `pin`, `resolution` and `playset` until 2.0.0); the site reads only version 2.
- Every `poster` must exist in `src/assets/media/`.

### 5.3 CI check

The `build` job sends `HEAD` to every `src` in the manifest and requires **`200`**, a
`Content-Type` equal to the source's `type` media type, and a `Content-Length` equal to `bytes`.
This catches a typo, a missing object, and a takedown without a matching manifest change. The
scheduled build runs it too. Without a manifest (section 4.3) there is nothing to check.

## 6. Head, social preview and icons

From [#18](https://github.com/happy-dwarf-team/.github/issues/18); the shared rules (one
`Head.astro`, canonical with a trailing slash, `@astrojs/sitemap` without 404, `robots.txt` as
`anvil-website`'s, no `noindex` on 404, `theme-color` `#16171a`, no Search Console) are as in hub
spec section 5.

### 6.1 Titles and description

- Pattern `<page title> | Etch`; the _site name_ is `Etch`.
- `/`: `Preview Europa Universalis IV interface mods in VS Code | Etch` (62 characters; Google may
  cut the tail).
- `404`: `Page not found | Etch`.
- Meta description (draft, also `og:description` and used by 404): "A free VS Code extension that
  previews Europa Universalis IV interface mods: edit a .gui or .gfx file and see the window as
  the game draws it."

### 6.2 Social preview image and favicons

- `public/og.png` (1200 × 630), static and committed, rendered by `scripts/og-image.mjs` with
  `sharp`: `#16171a` background, the Etch mark in verdigris `#4fc9a8` on a tile shaped like the
  favicon tile but in `--forge-surface` `#1f2024` (a `#16171a` tile would not show on the
  background), "ETCH" in mono, two lines "Interface mod preview / for VS Code" in `--forge-text-muted`,
  `etch.happydwarf.dev` in verdigris, an 8 px verdigris bar along the bottom.
  `og:image:alt`: "Etch, interface mod preview for VS Code". **No game art** (not even a
  screenshot: a preview image travels without the disclaimer), no version, no status.
- `favicon.svg`, `favicon.ico` (32 × 32) and `apple-touch-icon.png` (180 × 180, opaque) in
  `public/`, rendered by one script (`scripts/icons.mjs`) from `etch`'s
  `packages/extension/media/icon.svg` recoloured to verdigris, on the favicon tile. The script
  reads the glyph from `src/assets/etch-mark.svg` (DESIGN.md, "Mark"), which `og-image.mjs`
  uses too. No web manifest.

### 6.3 Structured data

JSON-LD `SoftwareApplication`, like `anvil-website`'s: `name` Etch, `applicationCategory`
DeveloperApplication, `operatingSystem` Windows, MIT `license`, `isAccessibleForFree` true,
`softwareVersion` from the latest `etch` release fetched at build (left out if the fetch fails),
`author` Happy Dwarf Team with `url` `https://happydwarf.dev/`.

## 7. Footer and disclaimer

From [#13](https://github.com/happy-dwarf-team/.github/issues/13) and
[#14](https://github.com/happy-dwarf-team/.github/issues/14). On every page, 404 included:

- the **family marker**: the full team logo with "A Happy Dwarf project", linking to
  `https://happydwarf.dev/`;
- links to Etch's Source (the `etch` repository), Changelog, Issues, and "MIT";
- the **disclaimer** as its own paragraph in muted text, with all three lines (the site shows EU4
  art):

  > Etch is an unofficial community project, not affiliated with or endorsed by Paradox
  > Interactive. Europa Universalis and Paradox Interactive are trademarks or registered
  > trademarks of Paradox Interactive AB. Game interface art in screenshots and recordings is
  > © Paradox Interactive AB, rendered from a local copy of the game; Etch does not include or
  > distribute game files.

No legal page. Credit for a third-party mod shown in a medium would go in that medium's
`figcaption`, but the media show only the demo mod (section 8.2).

## 8. Media pipeline (work in `etch`)

The tool that makes and publishes the site's media lives in `etch`, is built there through the
team's PR process, and is specified here. `etch/docs/media.md` (procedure and checklist) is
written by the `etch` PR that builds the pipeline.

### 8.1 Package and commands

From [#24](https://github.com/happy-dwarf-team/.github/issues/24).

- A **private workspace package `packages/media` (`@etch/media`)** holding the capture script,
  the clip definitions (section 8.5), the edit's composition (section 8.4) and the **demo mod**
  (`packages/media/demo-mod/`). It never ships in the VSIX.
- Run from the root as `pnpm media <step>`, in two steps with a human review between them:
  - **`pnpm media capture`** records, edits and encodes locally into the git-ignored
    `packages/media/out/v<version>/`: masters, take logs, edits, WebM/MP4, PNG posters, a draft
    manifest. It publishes nothing. `--reedit` edits again from the takes without recording.
  - **`pnpm media publish --site <path to an etch-website checkout>`** uploads the loops to the
    media bucket and writes the posters and the manifest into that checkout (section 8.8).
- Every frame is looked at before anything becomes public; `publish` can be repeated without
  recapturing.
- **Local only:** media are produced on the maintainer's Windows machine with EU4 1.37.5
  installed. CI produces no media and uploads nothing
  ([#16](https://github.com/happy-dwarf-team/.github/issues/16)).

### 8.2 Demo mod

From [#16](https://github.com/happy-dwarf-team/.github/issues/16) and
[#19](https://github.com/happy-dwarf-team/.github/issues/19).

- A purpose-made mod, **"Etch demo mod"**, MIT, versioned with Etch, not published on the Steam
  Workshop and not playable. Its `.gui`, `.gfx` and localisation are our own text, written from
  scratch; it refers by name to **base-game EU4 1.37.5** sprites and fonts, so the preview looks
  like EU4 while no game file enters a repository.
- **No DLC-only art, no dependency on other mods**: the playset is the demo mod alone, so anyone
  with the base game can reproduce the media.
- Files: a `.mod` descriptor; `interface/etch_demo.gui` with two top-level windows: a **dialog**
  in the style of an EU4 event (background, header in a game font, short body text, an icon in a
  frame, two option buttons, a close button) and a **small panel** for the window-under-cursor
  scene; `interface/etch_demo.gfx`; `localisation/etch_demo_l_english.yml`. Text in an EU4 tone
  with a smithing, Happy Dwarf flavour.
- **No event picture** (`GFX_evt_*`), **no textures of our own** at the start (no `gfx/` folder),
  English only. #16 allows a few own textures later (and #21's fallback would need them).
- Exact sprite and font names, the dialog's text and the numbers in the `.gui` are chosen when
  the mod is written, within these rules.
- **The province view (since 2.0.0).** The maintainer asked for the media to show editing a
  popular view; the province view is the window modders change most and the one v2 was judged
  by. Each capture copies the base game's `interface/provinceview.gui` from the local game into
  its throwaway copy of the demo mod, as Etch's **Override in my mod** would, and the clips edit
  that copy. It is never committed, uploaded or kept after the run. The playset stays the base
  game and the demo mod (no DLC, no other mod), the preview at 1280×720, a corpus resolution,
  with generated sample data and no save, so anyone with the base game can reproduce the media.
  The dialog and panel stay in the demo mod; no 2.0 clip uses them.

### 8.3 Capture

From [#6](https://github.com/happy-dwarf-team/.github/issues/6),
[#15](https://github.com/happy-dwarf-team/.github/issues/15) and prototype
[`prototype/etch-capture`](https://github.com/happy-dwarf-team/.github/tree/prototype/etch-capture/prototypes/etch-capture)
(reference only).

- A pinned VS Code downloaded with `@vscode/test-electron`, launched through Playwright's
  `_electron.launch()` with `--extensionDevelopmentPath`, a fresh `--user-data-dir` with seeded
  settings, and an **empty `--extensions-dir`** (not `--disable-extensions`, which shows a toast).
- **Device scale 1** (`--force-device-scale-factor=1`).
- **Takes:** each clip's steps run once in a fresh VS Code while FFmpeg's `gfxcapture` (FFmpeg
  8.1 or newer) records the window into a lossless master, timed against the take's clock (the
  wall clock of each master's first frame). Every step logs an event on that clock with the rects
  the edit needs (the cursor's line, the preview's widget outline, a menu, a Problems row, a
  widget in the game). `gfxcapture` needs the window not to be minimised and emits frames only on
  change; the proxies pad the end.
- **The edit** (section 8.4) is built from the take's log in Node and rendered by a Remotion
  composition (`packages/media/motion/`, Remotion's free licence for individuals and companies of
  up to three people) from H.264 proxies of the masters into a ProRes 4444 cut, which is then
  encoded (section 8.6). The hero's trailer is cut from the rendered `preview`, `reload` and
  `pick` loops.
- **The live take** records the three live clips (section 8.5) in one run: VS Code's window and
  the live game's, each with its own `gfxcapture` master on one clock. The real pointer is moved
  and clicked by the script (pick mode needs a real click) and recorded over the game; pick mode
  is turned on with **Ctrl+Shift+E** pressed in the game (`SendInput`). It is the only take that
  starts EU4: through Etch's own **Start the Live Game**, with a capture helper extension that
  gives the run's private install a copy of the player's settings windowed at 2560 × 1440 and a
  copy of the chosen save, and turns on Tongs' pipe in that install for the script's reads. The
  game runs the base game and the demo mod, with the DLC the player owns, as the live game would
  for them. It needs `--save <file>`.
- Known gotchas: keep VS Code and its user data in a **short folder** (MAX_PATH); select text
  through Find, not Ctrl+G (wrong column on tab-indented `.gui`). A visible, unlocked desktop
  session is assumed, with the display awake (a sleeping display slows the game to a few frames a
  second).

### 8.4 Framing and the edit

From [#19](https://github.com/happy-dwarf-team/.github/issues/19).

- VS Code at **2560 × 1440 CSS px**, device scale 1, as on an ordinary monitor, so its master is
  **2560 × 1440**. Editor font **14**, VS Code's default, `window.zoomLevel` 0. (Until the loops
  it was 1280 × 720 at device scale 2 with font 18: the stills were the close-ups; now the
  edit's are.)
- `etch.previewResolution` **1280x720**; the preview panel keeps about 1280 CSS px in every take
  (the editor gives way), so one game pixel is one master pixel. The preview only scales down.
- **Dark Modern**, activity bar and status bar shown, minimap and breadcrumbs off; the sidebar and
  the bottom panel only in takes that need them; tabs only for demo mod files.
- **Never in a take** unless the clip shows it: Welcome, toasts, other extensions, the Find
  widget, the command palette, the system pointer over VS Code, preview notices. A preview notice
  the clip does not expect (e.g. `game_ui_scale` from the player's `settings.txt`) **fails the
  run**.
- The preview panel must stay visible: the host defers renders while it is hidden.
- **The edit** is 1920 × 1080 at 30 fps. Every loop opens on the wide shot of the whole window
  (or, in the live loops, of VS Code and the game side by side) and closes on the same shot of
  the same state, so it loops without a jump; a take whose end differs from its start (the
  editor moved by a pick) dissolves into its first frame over half a second. Between them a
  camera eases (cubic, about 0.8 s a move) to close-ups of what the step changes, from the rects
  in the take's log, never deeper than 1.5 master pixels per output pixel.
- **Every frame shows the editor and Etch's preview together** (section 1.1): a close-up that
  leaves the editor out shows an inset of the editor's current lines. In the live loops every
  frame shows the editor and the game's window.
- **Captions** name the keys pressed (`Ctrl` `S`) or what happens, in one line at the bottom, in
  the site's IBM Plex Sans and JetBrains Mono on a dark pill; a measured time says it was
  measured in this take. **Highlights** ring a changed rect in the site's verdigris. VS Code's
  takes are recorded without a pointer, so the edit **draws one** where Playwright's mouse moved
  (a plain arrow, with a ring on a click); the game's pointer is its own, recorded.
- **The live take:** VS Code as above on the primary monitor, the game windowed at
  **2560 × 1440**, a corpus resolution, on the monitor right of it (the lab: 3440 × 1440 and
  2560 × 1440, both at 100 %), its client area at that monitor's top left corner. The real
  pointer waits over the game's interface, since anywhere outside its client area the game
  scrolls its map.

### 8.5 Clips

| Clip       | Loop  | What it shows                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero`     | ~15 s | Parts of three loops, cut one after another: `preview`'s typing from its wide start, `reload`'s save and moving panel, `pick`'s last hover, click and definition to its wide end.                                                                                                                                                                                                                                                                                      |
| `preview`  | ~8 s  | The first digit to the last of the buildings window's x (480) selected; the camera moves in on the preview with the line in an inset; `7`, `2`, `0` are typed one by one, each drawn at once (x 7, 72, 720), unsaved; back to the wide shot, **Ctrl+Z**.                                                                                                                                                                                                               |
| `views`    | ~10 s | The pointer opens **View ▾**; the camera on the preview; two other views (the foreign province's, the army builder's, as the menu lists them) are chosen in turn, then the current one again; the menu closes.                                                                                                                                                                                                                                                         |
| `data`     | ~12 s | **Data ▾**, generated text **long**; the menu closes and the camera moves in on the province view's header; back, **Data ▾**, **typical**.                                                                                                                                                                                                                                                                                                                             |
| `zoom`     | ~12 s | The pointer on the province view's header; **Ctrl+wheel** two whole steps in, a hold, then a click on the zoom level fits the screen again (the starting level).                                                                                                                                                                                                                                                                                                       |
| `outline`  | ~12 s | The Widget Outline in the sidebar; the pointer hovers three widgets of the preview (the dashed hover box and the tooltip with path and rect), then clicks the first building: its definition is selected in the editor and in the outline; **Go Back** returns the cursor.                                                                                                                                                                                             |
| `problems` | ~10 s | Problems filtered to the typo (the base game's file has problems of its own); the `ui` of `GFX_provinceview_building_bg` swapped, one Etch "missing sprite" warning, ringed; the camera on the preview without the panel's background; **Ctrl+Z**.                                                                                                                                                                                                                     |
| `reload`   | ~9 s  | Live: the buildings window's x 480 → 580 with one keystroke, **Ctrl+S**, the game reloads and the panel moves (ringed, with the time from the save to Tongs seeing the panel moved); **Ctrl+Z**, **Ctrl+S**, back.                                                                                                                                                                                                                                                     |
| `pick`     | ~15 s | Live: **Ctrl+Shift+E** in the game; the game fills the frame, VS Code in an inset; the pointer hovers widgets of the province view, each outlined and labelled by pick mode, then clicks the buildings panel; VS Code fills the frame at the definition of the widget under the pointer (ringed). The take opens an own province without a great project: its picture is DLC art, which the preview's playset does not have, so the snapshot would draw a placeholder. |
| `snapshot` | ~8 s  | Live: the camera on Etch's preview with sample data, the game in an inset; the same pick's live snapshot redraws the preview with the game's texts.                                                                                                                                                                                                                                                                                                                    |

The live take runs one reload unrecorded first, because the first reload of a freshly opened
province view blanks its name (Etch's `docs/live-game.md`). Until the 2.0.0 media refresh the
media were the `hero` loop and six stills, the scenes `preview`, `views`, `data`, `zoom`,
`outline` and `problems` (until 2.0.0 also `pin`, `resolution` and `playset`).

### 8.6 Encoding

From [#8](https://github.com/happy-dwarf-team/.github/issues/8) and
[#15](https://github.com/happy-dwarf-team/.github/issues/15).

- Loops are published **1920 × 1080**, as the edit renders them, no audio track, `yuv420p`.
- **VP9 WebM**: two-pass, `-tune-content screen`, starting at **CRF 34**.
- **H.264 MP4**: `-preset veryslow`, starting at **CRF 23**, `-movflags +faststart`.
- No AV1 at launch.
- Sizes measured at the 2.0.0 media refresh (CRF 34): feature loops 1.5â€“3.6 MB WebM, the hero
  (15 s) 4.3 MB; CRF 40 would take the hero to 3.0 MB at a visible cost to the code's text.
  Each loop loads only when it plays (section 4.1).
- **Posters** are the cuts' first frames, 1920 × 1080 PNG.

### 8.7 Paint marker

From [#23](https://github.com/happy-dwarf-team/.github/issues/23). An Etch change in
`packages/extension/webview/main.ts` with its test, **in the same change as the capture script**.

- After handling each `draw`, the webview sets on `canvas#screen`:
  - `data-paint-id`: that `draw`'s `id`, the same number as `PreviewPaint.id` in `onDidPaint`;
  - `data-paint-result`: `ok` | `problems` (painted, with texture problems) | `blank`
    (`painted: false`, nothing to draw) | `failed` (no WebGL2 context, or the paint threw).
- No file or window name, no change to the host↔webview protocol. It **always ships** in
  release builds, with no setting or flag (two `setAttribute` calls per paint; nothing leaves
  the machine). Commented as unstable, for Etch's own tools.
- **How the script waits:** read `data-paint-id` before a step (edit, pin, resolution), perform
  it, then `frame.waitForFunction` until the id has grown and no new paint has arrived for a
  **quiet window** (300 ms by default, settable per clip). A timeout fails the run, with no
  fallback to a fixed delay. A `failed` or `problems` result fails the run unless the clip
  declares it. Intermediate paints may appear in a recording but never release the next step.

### 8.8 Publishing

From [#17](https://github.com/happy-dwarf-team/.github/issues/17) and
[#24](https://github.com/happy-dwarf-team/.github/issues/24).

- **Keys** `etch/v<version>/<clip>.<hash8>.<webm|mp4>` in the media bucket (hub spec 7.2).
- **Upload with `@aws-sdk/client-s3`** from the Node script: `PutObjectCommand` with
  `IfNoneMatch: "*"`, `ContentType` and `CacheControl: public, max-age=31536000, immutable`.
  A `412` means the key exists: the script runs `HeadObject` and treats a matching size and type
  as already uploaded; a mismatch fails the run. Not Wrangler (no conditional put), not AWS CLI
  or rclone.
- **Credentials** from the user environment variables `HAPPYDWARF_MEDIA_ACCESS_KEY_ID` and
  `HAPPYDWARF_MEDIA_SECRET_ACCESS_KEY` (the token of hub spec 7.4). Missing variables stop
  `publish` before its first write; the script never prints their values. The account ID, bucket
  name and endpoint sit in the package's configuration.
- **Every clip:** a set holds all ten loops with their posters; `publish` refuses a capture that
  lacks any of them.
- **Order:** upload every loop and check each with `HeadObject`; only then write
  `src/data/media.json` and the posters into `src/assets/media/` of the given `etch-website`
  checkout. So the
  manifest never names a key that is not in the bucket.
- The script **does not commit or open a PR**. The maintainer branches and opens the site PR
  through the team's PR process (`team-pr`, squash merge).

### 8.9 Media refresh

- A **media refresh** is run by the Etch maintainer (today @s-tyda) on a Windows machine with
  EU4 1.37.5 and that machine's own upload token (hub spec 7.4). It is due after an Etch release
  that changes what any clip shows, not after every release; the site keeps the last refreshed
  set, whose Etch version the manifest records.
- The checklist is `etch/docs/media.md`. **Its first item:** compare the Paradox User
  Agreement's "Last update" date with **2026-01-21**; if it changed, re-read sections 5–6 and
  check trigger 4 (section 1.1) before uploading.
- **The live take** also needs the desktop to itself for about two minutes (the script moves the
  real pointer), EU4 not running beforehand, the second monitor, and a base-game save that is not
  ironman.
- **release-please triggers nothing.** `etch/docs/release.md` gains one line: after a release
  that changes the clips, do a media refresh (`docs/media.md`).
- The pipeline has **no milestone** in `etch` (its milestones are product versions); only the
  paint marker reaches users, with the next Etch release.

### 8.10 Terms for `etch`'s `GLOSSARY.md`

Added by the `etch` PR that builds the pipeline:

- **Demo mod**: the mod Etch's media show being edited; our own files, drawn with the game's
  art. _Avoid_: sample mod, test mod, fixture.
- **Media refresh**: capturing Etch's media for one Etch release and publishing them: loops to
  the media bucket; posters and the media manifest to the Etch site. _Avoid_: media update,
  re-record.
- **Clip**: one named loop (`hero`, `preview`, …) that the script makes; its id appears in the
  bucket key, the file name and the media manifest. _Avoid_: scene, shot.
- **Take**: one recorded run of a clip's steps, its masters and its log; the live take serves
  three clips. _Avoid_: recording, capture.
- **Edit**: what the composition renders from a take: the camera, insets, captions, highlights
  and the drawn pointer. _Avoid_: montage, cut.

## 9. Launching `etch.happydwarf.dev`

Launch means the final domain serves the site with a checked HTTPS certificate (hub spec 2.4).
Only after the first media are published (section 4.3), in this order:

1. The site has deployed to its github.io preview from `main` with a real media manifest.
2. **Set the custom domain `etch.happydwarf.dev`** in the repository's Pages settings **before
   adding DNS**, and set the repository variable `CUSTOM_DOMAIN`.
3. Add the **`etch` CNAME to `happy-dwarf-team.github.io`, DNS only** (hub spec 7.1).
4. Wait for the certificate, then **Enforce HTTPS**.
5. Check: `Resolve-DnsName etch.happydwarf.dev` shows the CNAME to GitHub;
   `gh api repos/happy-dwarf-team/etch-website/pages` shows the custom domain verified, HTTPS
   enforced and the certificate approved; the page loads over HTTPS and the media manifest
   check passes against the launched site.

The hub launches after this (its Etch row links here).

## 10. Build order

The build issues that implement this specification, under the tracking issue in
`happy-dwarf-team/.github`:

| Issue                                             | Sections                  | Blocked by         |
| ------------------------------------------------- | ------------------------- | ------------------ |
| E1 Scaffold the site                              | 2                         | —                  |
| E2 Copy the forge family tokens, verdigris accent | [DESIGN.md](../DESIGN.md) | E1, hub H2         |
| E3 Add head tags, icons and the social preview    | 6                         | E2                 |
| E4 Add the media manifest                         | 5                         | E1                 |
| E5 Build the home and 404 pages                   | 3, 4, 7                   | E2, E4             |
| E6 Publish the first Etch media                   | 4, 5, 8.8                 | X2, E4, hub H6     |
| E7 Launch `etch.happydwarf.dev`                   | 9                         | E3, E5, E6         |
| X1 `etch`: capture Etch media                     | 8.1–8.7, 8.10             | this specification |
| X2 `etch`: publish Etch media to R2               | 8.8, 8.9                  | X1, E4             |

E6 also answers the hub's open check 1 (CORS on a cache hit filled without `Origin`, hub spec
7.5).

## 11. Not verified

- The poster as LCP, and the page's weight with ten loops (each loads only when it plays).
  (Encode sizes were measured on the first media refresh, Etch 0.2.0: the hero loop is 9.4 s,
  311 KB WebM and 273 KB MP4.)
- Headless or locked-screen capture, Windows display scaling other than 100 %.
- All copy is a draft; verdigris contrast is computed, not measured in a browser.
- Our reading of the Paradox User Agreement has not been confirmed by Paradox or a lawyer.
