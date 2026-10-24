# etch.happydwarf.dev specification

What the Etch website is, what it shows, how its media are made and published, and how it
launches. Design rules are in [DESIGN.md](../DESIGN.md) and terms in
[GLOSSARY.md](../GLOSSARY.md). Change a rule here first, then in code.

Every rule comes from the wayfinder map
[happy-dwarf-team/.github#4](https://github.com/happy-dwarf-team/.github/issues/4) and the
resolutions of its tickets, linked where a rule is stated. Prototypes and research notes on the
`prototype/*` and `research/*` branches of `.github` are references only: where they differ from
this file, this file wins. Copy marked *draft* is final wording to be edited at build time
within the rule it belongs to.

Shared parts live in the [hub specification](https://github.com/happy-dwarf-team/happydwarf-website/blob/main/docs/spec.md)
(*hub spec* below): the repository setup this site copies (section 2), the DNS table (7.1), the
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
  M1 features each with a screenshot, install, and the status and roadmap to v1.
- **Language:** English only.
- **User documentation stays in the extension README** (linked from Install). Revisit only if
  user docs move to the site ([#13](https://github.com/happy-dwarf-team/.github/issues/13)).
- **Not on the site:** a blog, newsletter, full user docs, a separate gallery, analytics,
  cookies, a consent banner.
- **Content rules:** say nothing beyond what the extension README and the v1 specification say;
  measurements carry their source (e.g. "warm reload median 6–7 ms, p95 8–14 ms, maintainer's
  machine, etch#39"); limits stated plainly; the roadmap is marked indicative.

### 1.1 Game art on the site

From [#7](https://github.com/happy-dwarf-team/.github/issues/7) and
[#21](https://github.com/happy-dwarf-team/.github/issues/21). Our interpretation of the Paradox
User Agreement (sections 5–6, last update 2026-01-21), not legal advice.

- Screenshots and silent loops show **Etch rendering EU4 interface art from a local copy of the
  game**, with Etch and the mod's layout as the subject. **Every frame shows the editor and
  Etch's preview together**, never bare game art. No game audio.
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
  (a *takedown*, hub spec 7.2); the site keeps running with media without EU4 art (the demo mod
  then gets its own textures); only then decide whether to ask for permission.

## 2. Stack and repository

As the hub (hub spec section 2): Astro, static output, **no Starlight**, GitHub Pages through a
workflow, Node.js 22+, Fontsource fonts, `url()` helper and `SITE_URL`/`SITE_BASE` with
`trailingSlash: 'always'`, the `deploy` workflow (push to `main`, `pull_request`,
`workflow_dispatch`, daily `schedule`, no `repository_dispatch`) and the `pr-title` workflow,
Pages source "GitHub Actions", the `main` ruleset (`build`, `conventional-title`) added after both
workflows exist, `AGENTS.md`/`CLAUDE.md` and `SECURITY.md`.

Differences from the hub:

- **Client-side JavaScript is limited to three things:** the demo loop controller, the lightbox
  and the copy button ([#13](https://github.com/happy-dwarf-team/.github/issues/13)). No
  analytics, no framework.
- **The `build` job also checks the media manifest** (section 5.3) beside `check:links` and
  `check:a11y`.
- The preview deployment is `https://happy-dwarf-team.github.io/etch-website/`.
- The build fetches the latest `happy-dwarf-team/etch` release from the GitHub API (section
  3.1 and 6.3). If it cannot be fetched, the build continues without a version number, with a
  warning.

## 3. Pages

**`/` and `404`**, no Starlight: the content is one page
([#13](https://github.com/happy-dwarf-team/.github/issues/13)). Layout and components are in
[DESIGN.md](../DESIGN.md); prototype for reference:
[`prototypes/etch-site/index.html`](https://github.com/happy-dwarf-team/.github/blob/prototype/etch-site/prototypes/etch-site/index.html)
(open with `?variant=D`).

### 3.1 Sections of `/`, in order

1. **Header:** the Etch mark in verdigris and the "ETCH" wordmark; a status badge
   "Preview · 0.1.0"; anchors *Features · Install · Roadmap*; a GitHub link to `etch`.
   - The **version** in the badge is the latest `etch` release, fetched at build time (the same
     fetch as `softwareVersion` in section 6.3); without it the badge shows only the status.
   - The **status** ("Preview" while the extension is marked `preview`) is hand-edited in the
     site's data file `src/data/status.yaml` together with the roadmap states (section 3.5),
     changed by a PR when a release changes them. (Decided with @s-tyda while writing this spec;
     the map left the source open.)
2. **Hero, split:** text beside the demo loop (section 4.1).
   - Text (drafts): eyebrow "EU4 interface mods · VS Code"; h1 "Edit the `.gui`. Watch the
     window."; one sentence on what Etch does; primary button **"Install from VS Code
     Marketplace"**, secondary **"Open VSX"**; requirements line *Windows x64 · VS Code 1.100+ ·
     EU4 1.37.5 (Steam) · No telemetry*.
   - On a 375 px phone the loop still starts in the first screen.
3. **Install band**, one line: `code --install-extension happy-dwarf-team.etch` with a **Copy**
   button, "open a `.gui` and run **Etch: Open Preview**", and a link to the extension README.
4. **Features (M1) as a tour:** six numbered rows, each a short text beside its own screenshot
   (section 3.2), then a box **"What 0.2.0 does not do yet"** (section 3.3).
5. **Roadmap:** a vertical timeline (section 3.5).
6. **Footer** (section 7).

There is no separate screenshot gallery.

### 3.2 The six features

In this order, one still each ([#13](https://github.com/happy-dwarf-team/.github/issues/13),
[#19](https://github.com/happy-dwarf-team/.github/issues/19)). Texts are drafts from the
prototype; captions and alts are #19's, edited at build time without going beyond the extension
README.

| # | Feature | Text (draft) | Still | Caption | Alt |
|---|---|---|---|---|---|
| 1 | Preview as you type | The preview follows the unsaved editor buffer on every change, including the mod's `.gfx` and localisation files. Warm reload: median 6–7 ms, p95 8–14 ms (measured on the maintainer's machine, etch#39). | `preview` | Edit the `.gui` and the window redraws from the unsaved buffer; the widget at the cursor stays outlined. | VS Code with an unsaved etch_demo.gui on the left and Etch's preview on the right: a widened game dialog with one button outlined. |
| 2 | The window under the cursor | The preview shows the top-level window that holds the cursor. **Pin** keeps it on one window while you edit other files. | `pin` | Pinned to the dialog while a `.gfx` file is edited: the preview keeps the window and shows the new button sprite. | VS Code with etch_demo.gfx open and Pin pressed in Etch's preview toolbar; the dialog's button shows a different sprite. |
| 3 | Widget outline and jump to source | The Widget Outline lists the window's widgets. Click a widget in the preview to reveal its source; hover to see its path and rect. | `outline` | The Widget Outline lists the window's widgets; clicking one in the preview selects its source, hovering shows its path and rect. | VS Code with the Widget Outline in the sidebar, a widget selected in the editor, and a dashed hover box with a tooltip in Etch's preview. |
| 4 | Diagnostics in Problems | Missing sprites, fonts and textures, duplicate names and more appear in VS Code's Problems panel as you edit. | `problems` | A misspelled sprite name is reported in Problems while the rest of the window still draws. | VS Code with a squiggle under a sprite name, one Etch error in the Problems panel, and the dialog drawn without that widget. |
| 5 | Any resolution | The game's `settings.txt`, the monitor's, a corpus resolution from 1280×720 to 3440×1440 or any width × height. `if_resolution` blocks follow it. | `resolution` | Pick the preview resolution: the game's settings, the monitor's, a corpus resolution or any width × height; `if_resolution` blocks follow it. | VS Code with Etch's resolution picker open over an `if_resolution` block, listing default, native and the corpus resolutions. |
| 6 | Your playset, the game's own art | Etch finds the game through Steam and draws with its textures, fonts and localisation. It ships none of them and sends nothing anywhere. | `playset` | The demo mod holds only text files; Etch draws its localised title, colours and icons with the game's own fonts and textures. | VS Code's Explorer showing a mod of .gui, .gfx, .yml and descriptor files, an unsaved localisation edit, and the retitled dialog in the preview. |

Each still's Enlarge button is labelled "Enlarge screenshot: " plus the feature's title.

### 3.3 "What 0.2.0 does not do yet"

The version in the title is the latest `etch` release, from the same build-time fetch as the
badge; without it the title reads "What Etch does not do yet". Drafts, following the extension
README:

- A layout preview: content the game's code fills in (lists, flags, values) is not shown.
- Preview only: you edit in VS Code's own text editor, not in the preview.
- Windows (x64), VS Code 1.100+, EU4 1.37.5 from Steam.

### 3.4 Install

- Primary: the VS Code Marketplace page of `happy-dwarf-team.etch`. Secondary: its Open VSX
  page. Requirements and the extension README as in sections 3.1 and 3.3.
- Etch's Marketplace and Open VSX listings themselves are out of scope.

### 3.5 Roadmap

A vertical timeline **M0 → M1 → M2 → M3 → M4 → 1.0.0**, one line each from `etch`'s
[v1 specification](https://github.com/happy-dwarf-team/etch/blob/main/docs/spec/v1.md) section
11, with the note "version numbers are indicative" and a link to the v1 specification. Each
milestone's state (done, current, next) comes from `src/data/status.yaml`.

| Milestone | Version | Line (draft) |
| --- | --- | --- |
| M0 Foundation | — | Public repository, CI, release-please, packaged VSIX. |
| M1 Offline preview | 0.1.0 | Released on the Marketplace and Open VSX, marked preview. Everything on this page. |
| M2 Precision corpus | 0.2.0 | Measured against the game, widget by widget, at six resolutions: vanilla and Proper 2K UI Enhanced. |
| M3 Game host | 0.3.0 | A private copy of the running game draws the window itself. |
| M4 Compare and scale | 0.4.0 | Diff view between the two backends; Anbennar and Dwarven Knowledge. |
| 1.0 Release | 1.0.0 | When the release criteria hold; the preview flag goes. |

### 3.6 `404`

The same header and footer as `/`, an h1 and a link back to `/`. Title in section 6.1.

## 4. Media on the page

From [#8](https://github.com/happy-dwarf-team/.github/issues/8),
[#13](https://github.com/happy-dwarf-team/.github/issues/13) and
[#19](https://github.com/happy-dwarf-team/.github/issues/19). Component states and sizes are in
[DESIGN.md](../DESIGN.md).

### 4.1 Demo loop

- Markup: `<video muted loop playsinline preload="none">` with the **poster**, `width` and
  `height`, and two `<source>`s from the media manifest: **VP9 WebM first, H.264 MP4 second**. No
  `autoplay` attribute and no audio track.
- The hero poster is preloaded with `fetchpriority="high"` (it is the LCP image) and is
  same-origin, from the site's own assets.
- A small script plays the loop only when **`prefers-reduced-motion: no-preference`** and the
  loop is **at least 50 % in view**; it pauses off screen and in a hidden tab, and handles
  `NotAllowedError` by staying on the poster.
- A **visible 44 px Pause/Play button** at the bottom right (WCAG 2.2.2).
- **Reduced motion or Save-Data** (`navigator.connection.saveData`): the poster and a Play
  button; nothing plays until pressed. Otherwise phones follow the desktop rules.
- **Slow or failed load:** the poster and the description stay; the 16:9 box is reserved, so
  there is no layout shift.
- **Text description** in the `figcaption`, tied to the video with `aria-describedby`
  (WCAG 1.2.1, video-only content); no captions track. Draft, from #19:

  > **Demo loop, 10 s, silent.** In VS Code, `etch_demo.gui` is open beside Etch's preview of a
  > game dialog. One keystroke widens the dialog's background and the frame redraws at once; the
  > cursor moves to a button, the outline follows it, and a second keystroke moves the button
  > into the new space. Two undos return the window to where it started.

- **Poster `alt`:** "VS Code with etch_demo.gui on the left and Etch's preview of a game dialog
  on the right." The poster is the loop's first frame, so starting playback does not jump.

### 4.2 Stills and lightbox

- One 16:9 still per feature, from `src/assets/media/<scene>.png` (2560 × 1440), through
  `astro:assets` with AVIF/WebP and `srcset`.
- **Every still is zoomable:** a visible "Enlarge" chip (not hover-only) opens a `<dialog>` with
  a fit-to-screen view, Previous/Next buttons and arrow keys, "n of 6", the caption, and an
  **"Actual size"** toggle that shows native pixels with scrolling (game pixels 1:1; the real
  zoom on phones). Esc or Close returns focus to the still.

### 4.3 Before the first media refresh

Until the first media manifest exists (between the home page build and the first media
publication), the site still builds: **the manifest is optional**, and without it the loop and
every still render their **unavailable** state: the reserved 16:9 box with the text description
or caption, no video and no image. No placeholder media are committed. (Decided with @s-tyda
while writing this spec; the map left it open.) The site launches only with real media
(section 9).

## 5. Media manifest

From [#17](https://github.com/happy-dwarf-team/.github/issues/17) and
[#24](https://github.com/happy-dwarf-team/.github/issues/24).

### 5.1 Files

- **`src/data/media.json`**: generated by `pnpm media publish` in `etch` (section 8.8), never
  edited by hand. It is the only place the site learns bucket keys from.
- **`src/assets/media/<scene>.png`**: posters and stills, committed without a hash in the name
  (Astro hashes its output).
- One manifest describes the whole set of one media refresh.

### 5.2 Schema

Validated by a zod schema in the site's code; the build fails on error.

```json
{
  "schemaVersion": 1,
  "etch": "0.4.0",
  "loops": {
    "hero": {
      "width": 1920, "height": 1080, "duration": 10.0,
      "poster": "hero.png",
      "sources": [
        { "src": "https://media.happydwarf.dev/etch/v0.4.0/hero.3f9a2c1d.webm", "type": "video/webm; codecs=\"vp9\"", "bytes": 331234 },
        { "src": "https://media.happydwarf.dev/etch/v0.4.0/hero.9b1e77a0.mp4", "type": "video/mp4; codecs=\"avc1.640028\"", "bytes": 412345 }
      ]
    }
  },
  "stills": { "preview": "preview.png", "pin": "pin.png", "outline": "outline.png", "problems": "problems.png", "resolution": "resolution.png", "playset": "playset.png" }
}
```

(Values are examples.)

- `etch`: the Etch version the set was captured for (also the `v<version>` in the keys).
- The manifest carries **only facts about files**. Captions, alts, the loop's text description
  and the order of the features are editorial content and stay in the site's code (section 3.2,
  4.1).
- **Scene ids** (`hero`, `preview`, `pin`, `outline`, `problems`, `resolution`, `playset`) are
  defined by the media script and are the same in bucket keys, file names and the manifest.
- Every `poster` and still file must exist in `src/assets/media/`.

### 5.3 CI check

The `build` job sends `HEAD` to every `src` in the manifest and requires **`200`**, a
`Content-Type` equal to the source's `type` media type, and a `Content-Length` equal to `bytes`.
This catches a typo, a missing object, and a takedown without a matching manifest change. The
daily build runs it too. Without a manifest (section 4.3) there is nothing to check.

## 6. Head, social preview and icons

From [#18](https://github.com/happy-dwarf-team/.github/issues/18); the shared rules (one
`Head.astro`, canonical with a trailing slash, `@astrojs/sitemap` without 404, `robots.txt` as
`anvil-website`'s, no `noindex` on 404, `theme-color` `#16171a`, no Search Console) are as in hub
spec section 5.

### 6.1 Titles and description

- Pattern `<page title> | Etch`; the *site name* is `Etch`.
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

- the **family marker**: the team mark with "A Happy Dwarf project", linking to
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
  the scene definitions (section 8.5) and the **demo mod** (`packages/media/demo-mod/`). It never
  ships in the VSIX.
- Run from the root as `pnpm media <step>`, in two steps with a human review between them:
  - **`pnpm media capture`** captures and encodes locally into the git-ignored
    `packages/media/out/v<version>/`: masters, WebM/MP4, PNG stills and posters, a draft
    manifest. It publishes nothing.
  - **`pnpm media publish --site <path to an etch-website checkout>`** uploads the loops to the
    media bucket and writes posters, stills and the manifest into that checkout (section 8.8).
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

### 8.3 Capture

From [#6](https://github.com/happy-dwarf-team/.github/issues/6),
[#15](https://github.com/happy-dwarf-team/.github/issues/15) and prototype
[`prototype/etch-capture`](https://github.com/happy-dwarf-team/.github/tree/prototype/etch-capture/prototypes/etch-capture)
(reference only).

- A pinned VS Code downloaded with `@vscode/test-electron`, launched through Playwright's
  `_electron.launch()` with `--extensionDevelopmentPath`, a fresh `--user-data-dir` with seeded
  settings, and an **empty `--extensions-dir`** (not `--disable-extensions`, which shows a toast).
- **Device scale 2** (`--force-device-scale-factor=2`).
- **Stills:** `page.screenshot()` (PNG).
- **Loops:** the script offers both Playwright's `recordVideo` and an FFmpeg `gfxcapture`
  lossless master (FFmpeg 8.1 or newer), chosen by a flag. `gfxcapture` needs the window not to
  be minimised and emits frames only on change (pad the end if needed).
- Known gotchas: keep VS Code and its user data in a **short folder** (MAX_PATH); select text
  through Find, not Ctrl+G (wrong column on tab-indented `.gui`); `recordVideo` also records any
  extra Electron window. A visible, unlocked desktop session is assumed.

### 8.4 Framing (every medium)

From [#19](https://github.com/happy-dwarf-team/.github/issues/19).

- VS Code at **1280 × 720 CSS px**, device scale 2, so the master is **2560 × 1440**. Editor font
  **18**, `window.zoomLevel` 0.
- `etch.previewResolution` **1280x720**; the preview panel keeps about 640 CSS px in every frame
  (the editor gives way), so one game pixel is one master pixel. The preview only scales down.
- **No crops:** the same frame for every scene.
- **Dark Modern**, activity bar and status bar shown, minimap and breadcrumbs off; the sidebar and
  the bottom panel only in scenes that need them; tabs only for demo mod files.
- **Never in frame** unless the scene shows it: Welcome, toasts, other extensions, the Find
  widget, the command palette, the mouse pointer, preview notices. A preview notice the scene
  does not expect (e.g. `game_ui_scale` from the player's `settings.txt`) **fails the run**.
- Every frame shows the editor and Etch's preview together; silent.
- The preview panel must stay visible: the host defers renders while it is hidden.

### 8.5 Scenes

| Scene id | Kind | What it shows |
| --- | --- | --- |
| `hero` | loop, ~10 s | `etch_demo.gui` beside the preview of the dialog, the widget at the cursor outlined. (1) Start state ~1.5 s. (2) The cursor is in the dialog background's `size`; **one keystroke** replaces one digit of the width (e.g. 380 → 580); the frame widens; hold ~2 s. (3) The cursor moves with the arrow keys into the option button's block and the outline follows; **one keystroke** changes its `position` x (e.g. 40 → 240); hold ~2 s. (4) **Ctrl+Z twice**, ~1 s apart: back to step 1, the unsaved dot disappears, so the loop closes without a cut. Poster: the first frame. |
| `preview` | still | A frame of the hero run after step 3: unsaved `.gui`, widened dialog, button outlined. |
| `pin` | still | `etch_demo.gfx` active with an unsaved change of the button sprite's `texturefile` to another base-game button; **Pin** pressed in the preview toolbar, which names the dialog; the preview shows the dialog with the new button art. |
| `outline` | still | Sidebar with the Widget Outline, one widget selected; that widget's kind keyword selected in the editor, as after a click in the preview; the dashed hover box and tooltip with path and rect in the preview. |
| `problems` | still | Bottom panel on Problems with one Etch "missing sprite" error from a misspelled sprite name; the squiggle in the editor; the preview draws the window without that widget (the scene declares `problems`). |
| `resolution` | still | The quick pick of **Etch: Choose the Preview Resolution** open (default, native, the corpus resolutions, custom) with 1280×720 highlighted; the dialog's `if_resolution` block visible. |
| `playset` | still | Explorer with the demo mod's tree (descriptor, `.gui`, `.gfx`, `.yml`); the `.yml` active with an unsaved change of the dialog's title; the preview shows the new title in the game's font, and a `§` colour and a `£` icon in the body. |

Each edit is one keystroke over one digit, so no intermediate value collapses the window.

### 8.6 Encoding

From [#8](https://github.com/happy-dwarf-team/.github/issues/8) and
[#15](https://github.com/happy-dwarf-team/.github/issues/15).

- Loops are published **1920 px wide** (downscaled from the 2× master), 16:9, no audio track,
  `yuv420p`.
- **VP9 WebM**: two-pass, `-tune-content screen`, starting at **CRF 34**.
- **H.264 MP4**: `-preset veryslow`, starting at **CRF 23**, `-movflags +faststart`.
- No AV1 at launch.
- Size targets: hero about 1.5 MB WebM. Re-check CRF and sizes on the real scenes.
- **Stills stay 2560 × 1440 PNG**, so "Actual size" shows game pixels 1:1. Posters are PNG
  frames at the same size.

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
  **quiet window** (300 ms by default, settable per scene). A timeout fails the run, with no
  fallback to a fixed delay. A `failed` or `problems` result fails the run unless the scene
  declares it. Intermediate paints may appear in a recording but never release the next step.

### 8.8 Publishing

From [#17](https://github.com/happy-dwarf-team/.github/issues/17) and
[#24](https://github.com/happy-dwarf-team/.github/issues/24).

- **Keys** `etch/v<version>/<scene>.<hash8>.<webm|mp4>` in the media bucket (hub spec 7.2).
- **Upload with `@aws-sdk/client-s3`** from the Node script: `PutObjectCommand` with
  `IfNoneMatch: "*"`, `ContentType` and `CacheControl: public, max-age=31536000, immutable`.
  A `412` means the key exists: the script runs `HeadObject` and treats a matching size and type
  as already uploaded; a mismatch fails the run. Not Wrangler (no conditional put), not AWS CLI
  or rclone.
- **Credentials** from the user environment variables `HAPPYDWARF_MEDIA_ACCESS_KEY_ID` and
  `HAPPYDWARF_MEDIA_SECRET_ACCESS_KEY` (the token of hub spec 7.4). Missing variables stop
  `publish` before its first write; the script never prints their values. The account ID, bucket
  name and endpoint sit in the package's configuration.
- **Order:** upload every loop and check each with `HeadObject`; only then write
  `src/data/media.json` and `src/assets/media/` into the given `etch-website` checkout. So the
  manifest never names a key that is not in the bucket.
- The script **does not commit or open a PR**. The maintainer branches and opens the site PR
  through the team's PR process (`team-pr`, squash merge).

### 8.9 Media refresh

- A **media refresh** is run by the Etch maintainer (today @s-tyda) on their Windows machine with
  EU4 1.37.5, the only place with the game and the upload token. It is due after an Etch release
  that changes what any scene shows, not after every release; the site keeps the last refreshed
  set, whose Etch version the manifest records.
- The checklist is `etch/docs/media.md`. **Its first item:** compare the Paradox User
  Agreement's "Last update" date with **2026-01-21**; if it changed, re-read sections 5–6 and
  check trigger 4 (section 1.1) before uploading.
- **release-please triggers nothing.** `etch/docs/release.md` gains one line: after a release
  that changes the scenes, do a media refresh (`docs/media.md`).
- The pipeline has **no milestone** in `etch` (its milestones are product versions); only the
  paint marker reaches users, with the next Etch release.

### 8.10 Terms for `etch`'s `GLOSSARY.md`

Added by the `etch` PR that builds the pipeline:

- **Demo mod**: the mod Etch's media show being edited; our own files, drawn with the game's
  art. _Avoid_: sample mod, test mod, fixture.
- **Media refresh**: capturing Etch's media for one Etch release and publishing them: loops to
  the media bucket; posters, stills and the media manifest to the Etch site. _Avoid_: media
  update, re-record.
- **Scene**: one named shot (`hero`, `preview`, …) that the script captures; its id appears in
  the bucket key, the file name and the media manifest. _Avoid_: shot, clip.

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

| Issue | Sections | Blocked by |
| --- | --- | --- |
| E1 Scaffold the site | 2 | — |
| E2 Copy the forge family tokens, verdigris accent | [DESIGN.md](../DESIGN.md) | E1, hub H2 |
| E3 Add head tags, icons and the social preview | 6 | E2 |
| E4 Add the media manifest | 5 | E1 |
| E5 Build the home and 404 pages | 3, 4, 7 | E2, E4 |
| E6 Publish the first Etch media | 4, 5, 8.8 | X2, E4, hub H6 |
| E7 Launch `etch.happydwarf.dev` | 9 | E3, E5, E6 |
| X1 `etch`: capture Etch media | 8.1–8.7, 8.10 | this specification |
| X2 `etch`: publish Etch media to R2 | 8.8, 8.9 | X1, E4 |

E6 also answers the hub's open check 1 (CORS on a cache hit filled without `Origin`, hub spec
7.5).

## 11. Not verified

- Real encode sizes of these scenes (#15 measured a calmer 15 s clip), the poster as LCP, and
  sharpness of stills at actual size.
- That the Widget Outline and editor stay readable at 1280 CSS px with the sidebar open (the
  editor drops to about 35 characters), and that the arrow-key cursor move and the hover tooltip
  look as described in a recording.
- Headless or locked-screen capture, Windows display scaling other than 100 %.
- `IfNoneMatch` through `@aws-sdk/client-s3` against R2 and the `HEAD` check's headers through
  `media.happydwarf.dev` are untested until the bucket exists.
- All copy is a draft; verdigris contrast is computed, not measured in a browser.
- Our reading of the Paradox User Agreement has not been confirmed by Paradox or a lawyer.
