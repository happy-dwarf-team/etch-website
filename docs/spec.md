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

- **What:** the website of Etch, the VS Code extension for Europa Universalis IV mods (interface
  windows, textures, meshes and animations, the live game, scripts), at
  **`https://etch.happydwarf.dev/`**: a home page that shows each feature in a short loop, and
  the user documentation with the changelog under `/docs/` (section 3).
- **Language:** English only.
- **User documentation is on the site** (section 3.4) since the 2026-11 redesign. Its source is
  in `etch`, under `docs/user/`, and the extension README becomes a short overview that links to
  it. (Until then the README was the user documentation, linked from Install,
  [#13](https://github.com/happy-dwarf-team/.github/issues/13).)
- **Not on the site:** a blog, newsletter, a separate gallery, a roadmap, analytics, cookies, a
  consent banner. (The roadmap to v1 and v2 was on the page until the redesign; its milestones
  are done and stay in `etch`'s specifications.)
- **Content rules:** say nothing beyond what the extension, its docs pages and its v1 and v2
  specifications say; every measurement carries its source and conditions, on the docs page it
  links to (e.g. "warm reload median 6–7 ms, p95 8–14 ms, maintainer's machine, etch#39"); limits
  are stated plainly, on the docs pages; texts are written in plain language for modders who are
  not programmers (section 3.4.3).

### 1.1 Game art on the site

From [#7](https://github.com/happy-dwarf-team/.github/issues/7) and
[#21](https://github.com/happy-dwarf-team/.github/issues/21). Our interpretation of the Paradox
User Agreement (sections 5–6, last update 2026-01-21), not legal advice.

- Screenshots and silent loops show **Etch rendering EU4 interface art from a local copy of the
  game**, with Etch and the mod's layout as the subject. **Every frame shows Etch at work**: the
  editor, Etch's preview or its menus, or the outlines and labels Etch's pick mode draws in the
  game, never bare game art. No game audio. (Until the 2026-11-18 media refresh: every frame
  showed the editor and Etch's preview together.)
- Since the 2.0.0 media refresh the clips edit the province view as a mod overrides it: the
  editor shows the text of the base game's `interface/provinceview.gui`, copied from the local
  game into each take's throwaway workspace and never stored (section 8.2). We read this like
  the interface art: Etch and the mod's layout stay the subject.
- The loops cut panels from the recorded windows (section 8.4): the control on the left (the
  code, a menu of the preview, the Widget Outline, Problems) and its effect on the right (Etch's
  preview or the game's window). A close-up of the preview alone (`zoom`) shows Etch's drawing of
  the window with its outlines and tooltips, and a close-up of the editor (`hovers`) Etch's hover
  over the code, so Etch stays the subject.
- **Models, animations and textures** (since Etch 2.13.0, section 3.2.2) appear only inside
  Etch's Mesh Preview and Texture Preview, **always with the preview's bar of facts and controls
  in frame**, or in Etch's hover beside the code: never a model or texture alone, full frame. They
  are the base game's files (or the demo mod's own), opened read-only from the local copy, never
  copied into a take's workspace, this repository or the bucket; no model or texture that comes
  with a DLC. The editor shows a base-game `.gfx` or `.asset` file only where a loop needs it
  (`hovers`, `entity`), opened read-only from the local game like `provinceview.gui`. We read
  this like the interface art: Etch's preview is the subject.
- **The live game's loops** (section 3.2.3) show EU4 itself running beside VS Code, as Etch's
  live game runs it: the game's window beside the code it reloads or the preview it feeds, or
  alone while Etch's pick mode outlines and labels its widgets, never the game without Etch's
  part in it. They show the game
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

As the hub (hub spec section 2): Astro, static output, GitHub Pages through a workflow, Node.js 22+, Fontsource fonts, `url()` helper and `SITE_URL`/`SITE_BASE` with
`trailingSlash: 'always'`, the `deploy` workflow (push to `main`, `pull_request`,
`workflow_dispatch`, `repository_dispatch`, `schedule` every six hours) and the `pr-title` workflow,
Pages source "GitHub Actions", the `main` ruleset (`build`, `conventional-title`) added after both
workflows exist, `AGENTS.md`/`CLAUDE.md` and `SECURITY.md`.

Differences from the hub:

- **Starlight, for `/docs/` only** (section 3.4.1), themed with the forge family's tokens as
  anvil-website themes it; the home page and 404 are plain Astro pages. The hub has no Starlight.
  (Until the 2026-11 redesign this site had none either.)
- **Client-side JavaScript is limited to** the loop controller (with its loop viewer, the
  section players and the demo loop's chapters), the copy button, and on `/docs/` Starlight's own
  scripts (search, the sidebar on phones, the table of contents)
  ([#13](https://github.com/happy-dwarf-team/.github/issues/13); the stills' lightbox went with
  them in the 2.0.0 media refresh). No analytics, no UI framework, no third-party scripts.
- **The `build` job also checks the media manifest** (section 5.3) beside `check:links` and
  `check:a11y`.
- The preview deployment is `https://happy-dwarf-team.github.io/etch-website/`.
- The build fetches the latest `happy-dwarf-team/etch` release from the GitHub API (section
  3.1 and 6.3). If it cannot be fetched, the build continues without a version number, with a
  warning.
- **The build checks out `etch` at that release's tag** for the docs pages, the commands and
  settings, and the changelog (section 3.4.1). Unlike the version, these have no fallback: without
  them the build fails.
- **Rebuild after an Etch release:** once `etch`'s `release.yml` has attached the VSIX, its
  `website.yml` sends a `project-release` `repository_dispatch` here (and to the hub, hub spec
  4.5), so the badge, the docs and the changelog show the new version within minutes. It uses the organization secret
  `WEBSITE_DISPATCH_TOKEN` (fine-grained, **Contents: write** on `etch-website`). The schedule
  every six hours is the safety net for a missed dispatch.

## 3. Pages

Since the 2026-11 redesign (decided with @s-tyda on 2026-11-21, from a prototype of the home page
and the docs) the site has four kinds of page, all with the same header and footer (sections
3.1 and 7):

- **`/`**, the home page: what Etch does, shown in loops (sections 3.1–3.3);
- **`/docs/…`**, the user documentation: how to use every feature and setting, written for
  modders who are not programmers (section 3.4);
- **`/docs/changelog/`**, the notes of every release (section 3.5);
- **`404`** (section 3.6).

Layout and components are in [DESIGN.md](../DESIGN.md). Until the redesign the site was one page
([#13](https://github.com/happy-dwarf-team/.github/issues/13)): a split hero, a feature tour of
eleven numbered rows, the lists "Also in the preview" and "Also in the live game", the note
"Staying on 1.x", the box "What 2.x does not do" and a roadmap from M0 to 2.0.0, with the user
documentation in the extension README. Section 3.4.2 says where each of them went.

### 3.1 Sections of `/`, in order

1. **Header**, on every page: the Etch mark in verdigris and the "ETCH" wordmark; the status
   badge "Stable · 2.13.0"; the links _Features · Docs · Changelog_; a GitHub link to `etch`.
   - The **version** in the badge is the latest `etch` release, fetched at build time (the same
     fetch as `softwareVersion` in section 6.3); without it the badge shows only the status.
   - The **status** ("Preview" while the extension was marked `preview`, "Stable" since 1.0.0)
     is hand-edited in `src/data/status.yaml`, changed by a PR when a release changes it. (Until
     the redesign the file also held the roadmap's states, and the build failed on a released
     milestone still marked `next`.)
2. **Hero**, its text centred above the demo loop:
   - The **What's new pill** first: "New in 2.13" and one line naming what that release brought,
     linking to the feature section that shows it (drafts: "Meshes, entities and textures in the
     editor →", to section 3.2.2), or to its changelog entry when no section does. Its version,
     line and target are hand-edited in `src/data/status.yaml`; the page shows the pill only while
     its version is the latest release's major and minor, so it never announces an old release.
   - Text (drafts): eyebrow "Europa Universalis IV modding · VS Code"; h1 "See your mod as the
     game draws it, while you write it."; lead "Etch draws your interface windows as you type.
     It opens the textures and meshes VS Code can't, and plays their animations. It checks your
     scripts the way the game reads them. And it runs the game beside the editor, reloading each file you
     save."; primary button **"Install from VS Code Marketplace"**, secondary **"Install from
     Open VSX"**, then the text link **"Read the docs →"**; requirements line _Windows x64 · VS
     Code 1.100+ · EU4 1.37.5 · Free and open source · Sends no data_.
   - The **demo loop** (section 4.1) under the text, as wide as the content allows, with its
     **chapters** under it (section 4.2).
   - On a 375 px phone the install button is in the first screen and the loop starts right
     under it. (Until the redesign the loop itself had to start in the first screen; the centred
     hero gives the words that screen and the loop its width.)
3. **Install band**, one line: `code --install-extension happy-dwarf-team.etch` with a **Copy**
   button, then (draft) "Run it in a terminal, or use the Install button above. Then open your
   mod's folder in VS Code and a `.gui`, `.mesh` or `.dds` file; for a `.gui`, click the preview
   button at the editor's top right. You need EU4 installed, and Anvil, the plugin loader, only
   for the script profile." and the link **"Getting started →"** to the first docs page.
4. **Areas**: four links to the four feature sections, each with the files it works on, its name
   and one line (drafts):

   | Files                             | Name                | Line                                         |
   | --------------------------------- | ------------------- | -------------------------------------------- |
   | `.gui · .gfx · .yml`              | Interface windows   | Edit a window, see it redraw at once.        |
   | `.mesh · .anim · .asset · .dds`   | Textures and meshes | Open the models and textures VS Code can't.  |
   | the running game                  | The live game       | Play your mod beside the editor.             |
   | `common · events · history`       | Scripts             | Catch the mistakes `error.log` doesn't show. |

   The area the What's new pill points at is marked "new" while the pill shows.
5. **Feature sections**, four, each with its section player (section 3.2).
6. **Proof band**: three facts (section 3.3).
7. **Closing call** (drafts): "Open your mod in VS Code with Etch.", "Free and open
   source. Report a bug or ask a question in Etch's issue tracker on GitHub, or in
   **#help-and-bugs** on the Happy Dwarf Discord.", and the buttons **Install from VS Code
   Marketplace**, **Read the docs** and **Discord →**.
8. **Footer** (section 7).

There is no separate gallery, no roadmap and no list of features without a loop.

### 3.2 Feature sections

Each section has an eyebrow, an h2, one sentence and a **section player**: its features in a
numbered list (from 01 in each section) beside one stage that plays the selected feature's loop
(DESIGN.md, "Section player"). A feature is a title, its loop's length and a short text: one or
two concrete sentences that say what to do and what you see, in the plain language of section
3.4.3. The loop's text description (section 4.1) is not shown on the home page: it is tied to the
video for screen readers and shown in the loop viewer and on the feature's docs page.

A feature whose clip is not in the media manifest is left out of its section, and a section with
no clip in the manifest is left out of the page and of the areas, so the redesigned page can
ship before every new clip exists and never shows an empty stage.

Texts follow the extension README and the docs (section 3.4) and say nothing beyond them. Each
loop opens and closes on the same shot, which is its poster (the demo loop's poster is another
shot, section 4.1); the poster's alt says what that shot shows. What each clip shows, shot by shot, is in section 8.5.

#### 3.2.1 Interface windows

Eyebrow "Interface windows"; h2 "Edit a window. Watch it redraw."; sentence "The preview draws the
window your text cursor is in, with the game's own textures, fonts and localisation. It shows
what you type before you save. The game doesn't need to run." The list on the left from 980 px.

| #   | Feature              | Text (draft)                                                                                                                                                                        | Loop       | Text description (draft)                                                                                                                                                                                                                                                                                                                              |
| --- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | Preview as you type  | Change a number in a `.gui` and the window redraws before you save. The preview also follows your edits to the mod's `.gfx` and localisation files.                                                    | `preview`  | The code beside the preview's trade section. The trade node button's x position, 251, is retyped as 3, 30 and 300, unsaved, and the button with its outline jumps to each position at once. An undo returns it to 251.                                                                                                                                         |
| 02  | Views of a window    | See the province view and other windows Etch knows as the game shows them in one situation: your own province or a foreign one, one side panel open. Switch in **View ▾**, or keep your own with **Save as view…**.      | `views`    | **View ▾** beside Etch's preview of the province view. The menu lists the window's views; **Foreign province** is chosen and the window is drawn as a foreign province's, with a red banner, the owner's shield and Diplomacy. Then **Own province** is chosen again.                                                                                    |
| 03  | Sample data          | Names, development and the other texts the game fills in show sample data. Choose it in **Data ▾**: from a save, from the running game (a live snapshot), or made-up text of the length you choose.                             | `data`     | **Data ▾** beside the province view's header, with sample data from a save of Russia in 1719. The menu lists where the sample data comes from, a higher source winning over a lower one; **Province…** picks Bali from the save, and the header redraws with its names, area, region, culture, religion and development. Then Kaluga is picked again.                                                       |
| 04  | Widget Outline       | The **Widget Outline** in the Explorer lists the window's widgets. Point at one in the preview for its path, kind and size; click it to jump to its line. In the outline, hide a widget or pick which tab or panel shows.   | `outline`  | The Widget Outline beside Etch's preview of the province view. **Hide by Hand**, the eye on the province window's row, hides that part of the window, and **View ▾** counts one change by hand. **Choose by Hand**, a circle, picks which side panel shows, and the institutions panel appears. A click on the province's name in the preview selects its row in the outline and its line in `provinceview.gui`. **Type Sample Text…**, the pencil on that row, puts a long name in the header. |
| 05  | Problems as you type | Misspell a sprite's name and the Problems panel names it at once, while the rest of the window keeps drawing. Missing fonts and textures and duplicate names show up the same way.                  | `problems` | `provinceview.gui` above the Problems panel, the preview's buildings panel beside them. Two letters of a sprite name are swapped; Problems reports the missing sprite at once, and the panel's background is gone while the rest of the window still draws. An undo fixes it.                                                                         |

(The `zoom` loop leaves the home page for the docs page "Zoom and resolution". Until the
redesign the outline loop showed hovers and a jump to source; it is shot again for hiding by
hand, section 8.5.)

#### 3.2.2 Textures and meshes

New with Etch 2.13.0. Eyebrow "Textures, meshes and animations"; h2 "Open the art VS Code
can't."; sentence "Models, entities and textures open in Etch's own
previews. Models play their animations and are lit as the game lights them." The list on the right
from 980 px.

| #   | Feature          | Text (draft)                                                                                                                                                                                                       | Loop      | Text description (draft)                                                                                                                                                                                                                                                            |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | Mesh preview     | Open a `.mesh` and turn it in your hand, with its normal and specular maps under the game's light. Give it a country's colours or flag, and play the `.anim` files beside it.                                     | `mesh`    | A ship's `.mesh` open in the Etch Mesh Preview, its shapes, vertices, triangles and bones in the bar above it. A drag turns the ship; **Wire** shows its triangles and goes off again. A country's tag typed in **Flag** puts that country's flag on the ship. Its idle animation is picked and **Play** rocks it. **Reset view** frames it again. |
| 02  | Entities         | Click **Preview entity** above an `entity` in an `.asset` file and Etch builds the unit as the game does: attachments on their bones, playing its `idle`, `walk` and other states.                                | `entity`  | A unit's `entity` in an `.asset` file, **Preview entity** above it. The preview builds the unit from its model, its halberd on the right hand's bone, playing `idle`. The bar's first line names the model and its attachment. The state list in the bar goes from **State: idle** to **State: walk**, and the halberd moves with the hand. |
| 03  | Map trees        | Etch draws a map tree as the game does, with your map's tint and season colours. Set **Date** and **Snow**, or type a province ID in **Place** to see the tree as it looks there.                                                      | `trees`   | A map tree's mesh in the Etch Mesh Preview. **North** set to 1, which stands for the far north of the map, gives the trees their season colour, and **Date** moved from spring to autumn turns them from green to brown. **Snow** goes from 0 to 1. Province 1, Stockholm, typed in **Place** stands the trees there and sets **Ground** and **North** from the map. |
| 04  | Textures         | `.dds` and `.tga` files open in a viewer with their format and mip levels. Look at the alpha alone or read the colour under the mouse; a new export shows up at once.                                              | `texture` | A `.dds` texture in the Etch Texture Preview, its size, format and mip levels in the bar. **A** shows the alpha alone in grey, then **RGBA** again; **Mip** steps down the chain; the pointer rests on the image and the line at the bottom gives that pixel's colour.                       |
| 05  | Hovers and links | Hover a sprite's name in a `.gui` to see it, and press **F12** to reach its `.gfx`. Hover a mesh path for a picture of the model. In `.gfx` and `.asset` files, **Ctrl+click** a texture, mesh or animation path to open it.                        | `hovers`  | A sprite's name hovered in `provinceview.gui` shows the sprite, its frames and the `.gfx` file that defines it; **F12** opens that file at the sprite. A mesh path hovered in a `.gfx` file shows a picture of the model with its counts; a **Ctrl+click** on a texture path opens the texture. |

#### 3.2.3 The live game

Eyebrow "The live game"; h2 "Play your mod beside the editor."; sentence "Click **Live game** in
the preview, and Etch starts EU4 with your playset (your mod and the mods it depends on), from
its own copy of the game with its own settings and saves. You play it; Etch reloads what you save
into the game's own windows." The list on the left from 980 px.

| #   | Feature        | Text (draft)                                                                                                                                                                       | Loop       | Text description (draft)                                                                                                                                                                                                                                                                                                          |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | Reload on save | Click **Live game** in the preview to start it. Save a file and the game reloads that window in place, with its real data. Some, such as `.gfx` files, need a restart: click **Restart now**.                        | `reload`   | The trade node button's line in `provinceview.gui` beside the trade section of the live game's province view. One keystroke changes its x position from 251 to 151, and a save reloads the window in the game: the button moves left. An undo and a save move it back.                                                                     |
| 02  | Pick mode      | Press **Ctrl+Shift+E** in the game and point at a widget: Etch outlines it with its name, kind, size and file. Click it, and VS Code opens its definition.                                          | `pick`     | **Ctrl+Shift+E** turns on pick mode in the game. The pointer hovers the owner's shield, the trade post button and the trade node button in the province view, and pick mode outlines each with its name, kind, size and file. A click on the trade node button opens its definition in VS Code, and the game does not take the click. |
| 03  | Live snapshot  | A pick also takes from the game the window's texts and which of its parts are shown, and the preview uses them in place of sample data.                                                               | `snapshot` | The military and trade rows of Etch's preview beside the same rows of the live game. Most of the preview's values are generated (12.3); a pick in the game takes a live snapshot, and the preview redraws with the game's own manpower, supply limit, sailors, trade value and goods produced.                              |
| 04  | Run selection  | Select an effect and right-click to run it in your country or the province you have open, or check whether a trigger is true. The game's errors show in the Problems panel; your saves stay untouched.  | `run`      | An effect selected in the event file of Etch's demo mod, the live game's province view beside it. **Etch: Run Selection in the Province on Screen** raises the province's development in the game. **Etch: Check Selection as Trigger in the Live Game** checks a trigger in the province and shows the game's answer in a notification: the trigger is true. A misspelt effect is run, and the game's error appears in the Problems panel, on the selection. Undoing the misspelling clears the error. |

Under the player, one line (draft): "The live game never writes to your game folder, your EU4
profile (the folder, usually in Documents, where EU4 keeps settings, saves and mods) or your
mods, and never changes `eu4.exe`. Reloading and running selected script do not work in ironman
or multiplayer games." and the link **"Built on Anvil, the plugin loader for EU4 →"** to
`https://anvil.happydwarf.dev/`,
Anvil being the plugin loader the live game runs on.

#### 3.2.4 Scripts

Eyebrow "Scripts"; h2 "Catch what the game won't tell you."; sentence "Etch warns about
mistakes the game lets through without a line in `error.log`, and shows how long your own scripts
take." The list
on the right from 980 px. The `names` and `encoding` loops show VS Code alone: no preview and no
game art.

| #   | Feature                | Text (draft)                                                                                                                                                                                  | Loop       | Text description (draft)                                                                                                                                                                                                                                                                                         |
| --- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | Province IDs and names | A province ID the map doesn't have, or an idea group the playset doesn't define, gets no line in `error.log` and can crash the game. Etch warns as you type; **Etch: Check Province IDs and Names in the Playset** checks every script file.                             | `names`    | In an event of Etch's demo mod, a 5 typed before province 151 makes it 5151, and Problems warns at once that the map has no such province. An s turns the idea group `economic_ideas` into `economics_ideas`, and a second warning says the playset has no such idea group. Two undos take them away one at a time. |
| 02  | Encoding               | Typed an `é` into a leader's name, in a file the game reads as Windows-1252? Etch warns before the game shows `Ã©`. Press **Ctrl+.**, choose **Save with Encoding…** and pick the encoding the game expects.                  | `encoding` | A ruler's name in the event file of Etch's demo mod above Problems. An é typed into it brings Etch's warning at once: the game would show Ã©. **Ctrl+.** offers the quick fix **Save with Encoding…**; Windows 1252 is picked in VS Code's list, and the warning is gone.                                                                          |
| 03  | Script profile         | With Anvil 1.22 or newer, its script profiler times your events, decisions and other scripts in your own game. **Etch: Show Latest Script Profile** lists the slowest, and shows each block's time and calls on a line above it, without changing your files.                    | `profile`  | The page that **Etch: Show Latest Script Profile** opens, with a profile Anvil's profiler measured in the base game, the slowest rows first. A click on a decision's name opens its file at the measured block, with the profile's time and calls on a line above it; **Ctrl+W** returns to the page.                     |

### 3.3 Proof band

Three facts in large type, each a link to the docs page that gives its source and conditions.
The home page shows no source line under them (decided with @s-tyda on 2026-11-21); the source
is one click away, on the page the fact links to (section 3.4.2, "Accuracy" and "What Etch reads
and writes"). Drafts:

| Fact         | Line                                                                                         | Source, on the linked page                                                                            |
| ------------ | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 7 resolutions | from 1280×720 to 3440×1440, compared with the game on vanilla, Anbennar and Proper 2K UI Enhanced. | Etch's precision corpus (the README; `docs/spec/v2.md`, section 10) and `docs/coverage.md`           |
| 10–13 ms     | to redraw the province view after an edit; half of the redraws were faster.                                           | the newest `provinceview` rows of `etch`'s `docs/budgets.md`, vanilla and Anbennar, with their date and machine |
| 0 game files | in the extension. Etch draws with your own copy of the game and sends nothing anywhere.     | the extension README and the docs page "What Etch reads and writes"                                  |

A change of the newest `provinceview` rows in `budgets.md` changes the second fact in the same
task.

### 3.4 Docs

#### 3.4.1 Source and build

- The pages are Markdown files in `etch`, under `docs/user/`: one file a page, a folder a group of
  the sidebar, each with front matter (`title`, `description`, `since` for a feature newer than
  2.0.0, `clip` for a page with a loop). A feature's PR in `etch` writes or changes its page in
  the same PR, so the docs never lag behind the code. The extension README becomes a short
  overview for the stores that links to the docs (work in `etch`, section 10).
- The site builds the docs from the **latest `etch` release tag**, like the badge, so they
  describe the version a player has. The build checks out `happy-dwarf-team/etch` at that tag,
  sparse (`docs/user/`, `packages/extension/package.json`, `CHANGELOG.md`), into a git-ignored
  folder; `ETCH_SOURCE` names a local checkout instead, for development. Without the source the
  build fails: unlike the badge, the docs have no fallback.
- Built with **Starlight** under `/docs/` (dark only, the forge family's tokens and the verdigris
  accent, as anvil-website themes it), with this site's own header and footer through
  Starlight's component overrides, so the docs and the home page read as one site. The home
  page and 404 stay Astro pages without Starlight. (Until the redesign: no Starlight, one page.)
- **Search** is Starlight's Pagefind index, built with the site: no third-party service.
- Every page: its group as a breadcrumb, the h1, one sentence that says what the page is for,
  "Since <version>" from `since`, the page's loop when it has a `clip` (the home page's loop,
  with its text description shown under it), its sections, "On this page", previous and next, and
  **Edit this page** to its file in `etch`.
- **Commands** and **Settings** are generated from `contributes.commands` and
  `contributes.configuration` of `packages/extension/package.json` at the tag (each command's
  title; each setting's name, description and default), under a hand-written introduction, so
  they always match the extension.

#### 3.4.2 Pages

Drafts, in the sidebar's order. The right column says what each group takes over.

| Group               | Pages                                                                                                                 | Takes over                                                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Getting started     | Install and requirements · Your first preview · Where Etch finds the game                                             | the README's "Requirements" and the first steps of its "Preview"                                                                  |
| Interface windows   | Preview · Views and window profiles · Sample data · Widget Outline · Zoom and resolution · Problems                    | the README's "Preview", "Views" and "Sample data"; the home page's "Also in the preview" (Pin, resolutions); the `zoom` loop     |
| Textures and meshes | Texture preview · Mesh preview · Entities · Map trees · Hovers and links                                              | the README's "Textures", "Meshes" and "Entities"                                                                                 |
| The live game       | Start and stop · Reload on save · Pick mode · Snapshot and compare · Run selection · The private install               | the README's "The live game", "Pick mode" and "Run selection"; the home page's "Also in the live game"                          |
| Scripts             | Province IDs and names · Encoding · Script profile                                                                    | the README's sections of the same names                                                                                          |
| Reference           | Commands · Settings · Glossary                                                                                        | `package.json` (section 3.4.1); Glossary: Etch's own words (view, window profile, playset, sample data, live snapshot, private install, pick mode) in plain words |
| About               | Limits · What Etch reads and writes · Accuracy · Etch 1.x · Changelog                                                 | the home page's "What 2.x does not do" box, its "Staying on 1.x" note and the proof band's sources; the changelog (section 3.5) |

The roadmap does not move: its milestones are done, and `etch`'s v1 and v2 specifications keep
them; "Accuracy" links them as the history of what was measured.

#### 3.4.3 Plain language

The docs, the home page's texts and the release notes are written for a modder who knows EU4's
files but not programming (decided with @s-tyda on 2026-11-21):

- Say what to do and what you will see. Headings name a task or a thing ("Open a mesh",
  "Controls"), not a mechanism.
- Short sentences, one idea each; "you"; the active voice.
- Every word Etch coined (view, window profile, playset, sample data, live snapshot, private
  install, pick mode) is explained in plain words where a page first uses it, or links to the
  Glossary page.
- Developer words are replaced, or explained when no plain word fits: "the unsaved file", not
  "the buffer"; "draws", not "renders"; "the preview", not "the webview"; "setting", not
  "configuration key".
- What you click is named exactly as Etch's interface writes it, in bold; keys as keys
  (**Ctrl+Shift+E**).
- Where it helps, one example from the base game's files.
- Limits are stated plainly, at the end of the page, under "What it doesn't do".
- Etch's internal parts (Tongs, Bellows, the plugin protocol) appear only where a user meets
  them.

**Plain-language review:** every change of a docs page, of the home page's texts or of release
notes gets a review against this list before it merges. A reviewer (a subagent briefed with this
list and `etch`'s `docs/user/STYLE.md`, or a person) reads the changed text as that modder and
lists every sentence they could not follow or act on; the author rewrites them, and the PR's
Evidence lists the findings and what changed. A sentence the reviewer could not follow is
rewritten, not explained in a review comment.

### 3.5 Changelog

`/docs/changelog/`, a docs page in the About group, linked from the header and the footer
instead of GitHub's `CHANGELOG.md` (decided with @s-tyda on 2026-11-21):

- Built from `CHANGELOG.md` of the same `etch` checkout (release-please's file), newest first.
  Each release is a block with its version and date; the newest is marked **Latest** and open,
  the older ones are folded (`<details>`).
- A release whose notes open with a paragraph before the first group (written for players and
  modders, as the team's release-notes rule asks) shows it first, as **In short**.
- Entries are grouped as release-please writes them, under plain names: Features → **New**, Bug
  Fixes → **Fixed**, Build → **Updated** (the bundled Anvil, Bellows and Tongs); Reverts and any
  other group are left out. Inside a group, entries are grouped by area from their Conventional
  Commits scope, and the scope itself is dropped:

  | Scope                       | Area                |
  | --------------------------- | ------------------- |
  | `mesh`, `asset`, `entity`   | Textures and meshes |
  | `live-game`, `plugin`       | The live game       |
  | `core`                      | Checks              |
  | `profile`                   | Script profile      |
  | `pins`                      | Bundled plugins     |
  | `extension`, no scope, other | Editor             |

- Commit hashes are dropped; issue numbers stay, as links. No client JavaScript (no filter).
- The plain-language review (section 3.4.3) applies to the notes when the release PR is
  written, in `etch`, not when the page is built.

### 3.6 `404`

The same header and footer as `/`, an h1, and links back to `/` and to `/docs/`. Title in section
6.1.

## 4. Media on the page

From [#8](https://github.com/happy-dwarf-team/.github/issues/8),
[#13](https://github.com/happy-dwarf-team/.github/issues/13) and
[#19](https://github.com/happy-dwarf-team/.github/issues/19). Component states and sizes are in
[DESIGN.md](../DESIGN.md).

### 4.1 Loops

The hero's demo loop, the section players' loops (section 3.2) and the docs pages' loops follow
the same rules:

- Markup: `<video muted playsinline preload="none">` with the **poster**, `width` and `height`,
  and two `<source>`s from the media manifest: **VP9 WebM first, H.264 MP4 second**. No
  `autoplay` attribute and no audio track. A docs page's loop and the hero's repeat (`loop`); a
  section player's do not, since the player moves on when one ends.
- The hero poster is preloaded with `fetchpriority="high"` (it is the LCP image) and is
  same-origin, from the site's own assets. The other posters are below the first screen and not
  preloaded.
- The loop controller plays a loop only when **`prefers-reduced-motion: no-preference`** and the
  loop is **at least 50 % in view**; it pauses off screen and in a hidden tab, and handles
  `NotAllowedError` by staying on the poster. A loop loads nothing before it plays.
- **Section player:** one stage a section. While the section is at least half in view, its loops
  play one after another, each once, and the list follows them; once the visitor picks a
  feature, the player stays on it and repeats it. Picking a feature swaps the stage's sources.
- A **visible 44 px Pause/Play button** at the top right of the stage (WCAG 2.2.2), labelled for
  screen readers with what it plays ("the pick mode loop"). In a section player it also stops the
  player from moving on. (Until the redesign it sat at the bottom right; the loops' own captions
  sit at the bottom.)
- **Reduced motion or Save-Data** (`navigator.connection.saveData`): the poster and a Play
  button; nothing plays until pressed, and a section player does not move on by itself. Otherwise
  phones follow the desktop rules.
- **Slow or failed load:** the poster and the description stay; the 16:9 box is reserved, so
  there is no layout shift.
- **Text description**, tied to the video with `aria-describedby` (WCAG 1.2.1, video-only
  content); no captions track. It opens with the bold lead "**<title>, <n> s, silent.**", the
  length rounded from the manifest's `duration`. On the home page it is visually hidden (the
  feature's short text beside the stage says what to look at) and shown in the loop viewer; on a
  docs page it is shown under the loop. (Until the redesign it was a visible `figcaption` under
  every loop.) The feature loops' descriptions are in section 3.2; the demo loop's, a draft:

  > **Demo loop, 33 s, silent.** VS Code with the demo mod's folder open. `provinceview.gui`
  > opens, and Etch's preview appears beside it. The trade node button's x position is retyped,
  > and the button moves at every keystroke. A ship's mesh opens in Etch's Mesh Preview, which
  > turns it, shows its triangles, gives it a country's flag and plays its idle animation.
  > Beside the running game, saving the file reloads the province view in the game, and the
  > button moves. In pick mode, where you point at the game's interface to find it in your
  > files, the trade node button is outlined with its name, kind, size and file; a click on it
  > opens its lines in `provinceview.gui`.

  (Until the redesign the demo loop was a 12 s trailer of three feature loops.)

- **Poster** of the demo loop: the last shot of its first chapter, half a second before the
  second, the preview open beside the code. It is the page's promise in one picture, and a visitor
  with reduced motion or Save-Data sees it alone; the loop's first frame, VS Code before a file is
  open, says little by itself. Starting playback cuts from the poster to that first frame, as the
  loop cuts between its chapters. Its `alt`: "provinceview.gui in VS Code beside Etch's preview of
  the province view, with the caption 'Open Preview: the window as the game draws it'." Every other
  poster is its loop's first frame, so starting it does not jump.

### 4.2 The demo loop's chapters

- The demo loop is one video in **chapters**; under it, a row of chapter buttons, each with its
  number, its label and a bar that fills while that chapter plays. A click on one seeks the loop
  to that chapter's start and plays it (unless reduced motion or Save-Data is set, which leave
  the loop at that frame with its Play button).
- The chapters' ids and start times come from the media manifest (section 5.2); their labels
  are editorial and stay in the site's code. Drafts:

  | Chapter  | Label                     |
  | -------- | ------------------------- |
  | `open`   | Open your mod             |
  | `type`   | Type, see the window      |
  | `mesh`   | Turn a mesh               |
  | `reload` | Save, reload in the game  |
  | `pick`   | Pick a widget             |

- A manifest without chapters for the hero (a set from before the redesign) shows the demo loop
  without the row.
- Below 720 px only the playing chapter's label shows; the others keep their number and bar.

### 4.3 The loop viewer

- **Every loop can be enlarged:** a visible **Enlarge** chip at the stage's top right, beside
  Pause/Play (not hover-only, labelled for screen readers with what it shows), or a click on the
  video, opens one native `<dialog>` with the same loop as large as the screen allows, the
  video's own controls (pause, seek, full screen) and its text description.
- In the viewer the loop follows the page's rules: it plays at once unless reduced motion or
  Save-Data is set, which leave its poster and controls. The small loop pauses while the viewer
  is open and goes on as before after it.
- **Esc**, **Close** or a click outside the dialog closes it and returns the focus to what opened
  it.
- Until the 2.0.0 media refresh every feature had a 2560 × 1440 still with a lightbox ("Enlarge",
  Previous/Next, "Actual size"); the loops and their viewer replaced them.

### 4.4 Before the first media refresh

Until the first media manifest exists (between the home page build and the first media
publication), the site still builds: **the manifest is optional**, and without it every loop
renders its **unavailable** state: the reserved 16:9 box with the text description, no video and
no image. No placeholder media are committed. (Decided with @s-tyda
while writing this spec; the map left it open.) The site launches only with real media
(section 9). Since the redesign a missing clip leaves its feature out of the home page (section
3.2); a docs page whose clip is missing shows the unavailable state.

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
      ],
      "chapters": [
        { "id": "open", "start": 0.0 },
        { "id": "type", "start": 7.2 },
        { "id": "mesh", "start": 14.0 },
        { "id": "reload", "start": 22.5 },
        { "id": "pick", "start": 28.4 }
      ]
    },
    "preview": { "…": "the same fields without chapters, for each clip" }
  }
}
```

(Values are examples.)

- `etch`: the Etch version the set was captured for (also the `v<version>` in the keys).
- A loop's own `etch` (optional): a loop kept from an earlier set, with the version it was
  captured for and its keys' prefix. `pnpm media publish --keep <clip>` writes it when a new take
  shows an Etch bug: the loop that still shows the feature working stays until a later set has a
  good take (2026-11-18: `snapshot` stays 2.0.0's, see section 8.5).
- The manifest carries **only facts about files**. The loops' text descriptions, the posters'
  alts, the features' order and texts and the chapters' labels are editorial content and stay in
  the site's code (sections 3.2 and 4).
- **`chapters`** (optional, `hero` only, since the redesign): the demo loop's chapters, each an
  `id` and its `start` in seconds from the loop's start, the first at 0, increasing, every start
  before `duration`. The edit writes them from its timeline (section 8.3). The build fails on a
  chapter id the site has no label for (section 4.2).
- **Clip ids** (`hero`, `preview`, `views`, `data`, `zoom`, `outline`, `problems`, `reload`,
  `pick`, `snapshot`, `profile`, `names`, and since the redesign `mesh`, `entity`, `trees`,
  `texture`, `hovers`, `run`, `encoding`) are defined by the media script and are the same in
  bucket keys, file names and the manifest. A set has every clip of the media script's list
  (section 8.8); the site leaves out a feature whose clip the manifest lacks (section 3.2), so the
  new clips can come with later media refreshes. (Ten clips until the 2026-11-18 media refresh
  added `profile` and `names`; twelve until the redesign.)
- Schema version 1, before the 2.0.0 media refresh, had the hero loop and six stills (with
  `pin`, `resolution` and `playset` until 2.0.0); the site reads only version 2.
- Every `poster` must exist in `src/assets/media/`.

### 5.3 CI check

The `build` job sends `HEAD` to every `src` in the manifest and requires **`200`**, a
`Content-Type` equal to the source's `type` media type, and a `Content-Length` equal to `bytes`.
This catches a typo, a missing object, and a takedown without a matching manifest change. The
scheduled build runs it too. Without a manifest (section 4.4) there is nothing to check.

## 6. Head, social preview and icons

From [#18](https://github.com/happy-dwarf-team/.github/issues/18); the shared rules (one
`Head.astro`, canonical with a trailing slash, `@astrojs/sitemap` without 404, `robots.txt` as
`anvil-website`'s, no `noindex` on 404, `theme-color` `#16171a`, no Search Console) are as in hub
spec section 5.

### 6.1 Titles and description

- Pattern `<page title> | Etch`; the _site name_ is `Etch`.
- `/` (draft): `See your Europa Universalis IV mod in VS Code | Etch` (52 characters). (Until the
  redesign: `Preview Europa Universalis IV interface mods in VS Code | Etch`; Etch now does more
  than interface windows.)
- Docs pages: their front matter's `title`, e.g. `Mesh preview | Etch`; the changelog
  `Changelog | Etch`. Their meta description is the page's `description`.
- `404`: `Page not found | Etch`.
- Meta description of `/` (also `og:description` and used by 404): "A free VS Code extension
  for EU4 mods: see your interface windows as you type, look at 3D models and textures, and try
  your mod in the running game." (150 characters; the title spells out the game's name.)

### 6.2 Social preview image and favicons

- `public/og.png` (1200 × 630), static and committed, rendered by `scripts/og-image.mjs` with
  `sharp`: `#16171a` background, the Etch mark in verdigris `#4fc9a8` on a tile shaped like the
  favicon tile but in `--forge-surface` `#1f2024` (a `#16171a` tile would not show on the
  background), "ETCH" in mono, two lines "EU4 modding / in VS Code" in `--forge-text-muted`
  (until the redesign "Interface mod preview / for VS Code"), `etch.happydwarf.dev` in verdigris,
  an 8 px verdigris bar along the bottom. `og:image:alt`: "Etch logo with the text: EU4 modding in VS Code". **No
  game art** (not even a screenshot: a preview image travels without the disclaimer), no
  version, no status. Docs pages share it.
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
[#14](https://github.com/happy-dwarf-team/.github/issues/14). On every page, the docs and 404
included:

- the **family marker**: the full team logo with "A Happy Dwarf project", linking to
  `https://happydwarf.dev/` (on every page since the redesign, the docs too; decided with
  @s-tyda on 2026-11-21);
- links to Docs, Changelog (the docs page, section 3.5; until the redesign `CHANGELOG.md` on
  GitHub), "Source code" (the `etch` repository), "Report a bug" (its issues), Discord and
  "Licence (MIT)". Discord
  is the team's public server through `https://discord.happydwarf.dev/` (the hub's redirect to the
  invite, hub spec section 7.1), where `#help-and-bugs` takes questions next to the issues; it is a
  plain link and the page loads nothing from Discord;
- the **disclaimer** as its own paragraph in muted text, with all three lines (the site shows EU4
  art):

  > Etch is an unofficial community project, not affiliated with or endorsed by Paradox
  > Interactive. Europa Universalis and Paradox Interactive are trademarks or registered
  > trademarks of Paradox Interactive AB. Game interface art in screenshots and recordings is
  > © Paradox Interactive AB, rendered from a local copy of the game; Etch does not include or
  > distribute game files.

No legal page. Credit for a third-party mod shown in a medium would go in that loop's text
description, but the media show only the demo mod and the base game (section 8.2).

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
  scene; `interface/etch_demo.gfx`; `localisation/etch_demo_l_english.yml`; since the 2026-11-18
  media refresh `events/etch_demo_events.txt`, one event (`is_triggered_only`, never fired) that
  the `names` clip edits, with its texts' keys taken from the dialog's. Text in an EU4 tone
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
- **Since the redesign** the demo mod also has, in `events/etch_demo_events.txt`, a second
  event (also `is_triggered_only`, never fired) with a ruler's name for `encoding` (ASCII in the
  file; the clip types the é), and the effect and trigger `run` selects: a province effect that
  raises the province's development and a trigger in the province's scope. And one `.gfx` file
  of our own with a `pdxmesh` that names a base-game ship's mesh and textures by path, for
  `hovers` and the demo loop's mesh chapter, in the folder where the game reads pdxmeshes.
- The clips `mesh`, `entity`, `trees` and `texture` open base-game files read-only from the
  local game (section 1.1). The files are chosen when the clips are written, within these rules:
  a ship with a skeleton, its own idle animation and a flag (`PdxMeshTextureAtlas`) for `mesh`; a
  land unit whose entity has attachments and `idle` and `walk` states for `entity`; a map tree of
  a `mapobject_<n>` pdxmesh for `trees`; a `.dds` with an alpha and a mip chain for `texture`. No
  DLC's art, so anyone with the base game can reproduce them.

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
  encoded (section 8.6). The demo loop is cut from its own `open` take (VS Code starting with the
  demo mod) and parts of the rendered `preview`, `mesh`, `reload` and `pick` loops; the edit writes
  each chapter's start into the draft manifest (section 5.2). (Until the redesign the hero was a
  trailer of `preview`, `reload` and `pick`, without chapters.)
- **The art takes** (`mesh`, `entity`, `trees`, `texture`) open their file in VS Code and drive
  the Mesh or Texture Preview with Playwright's mouse and keyboard, as the window preview's takes
  do; they start no game.
- **The live take** records the four live clips (section 8.5) in one run, `run` last, since it
  changes the game: VS Code's window and
  the live game's, each with its own `gfxcapture` master on one clock. The real pointer is moved
  and clicked by the script (pick mode needs a real click) and recorded over the game; pick mode
  is turned on with **Ctrl+Shift+E** pressed in the game (`SendInput`). It is the only take that
  starts EU4: through Etch's own **Start the Live Game**, with a capture helper extension that
  gives the run's private install a copy of the player's settings windowed at the preview's
  1440 × 900 (until the 2026-11-18 refresh 2560 × 1440) and a copy of the chosen save, and turns on Tongs' pipe in that install for the script's reads. The
  game runs the base game and the demo mod, with the DLC the player owns, as the live game would
  for them. It needs `--save <file>`.
- **The `profile` take** needs `--profile <file>`, a CSV that Anvil's script profiler wrote in a
  base game, so its names link into the take's playset. The take copies it into the run's
  throwaway private profile (`logs/`), where **Etch: Show Latest Script Profile** finds it as the
  newest; the run's work folder (`--work`) is a short folder outside the user's own, since the page
  shows the file's path.
- Known gotchas: keep VS Code and its user data in a **short folder** (MAX_PATH); select text
  through Find, not Ctrl+G (wrong column on tab-indented `.gui`). A visible, unlocked desktop
  session is assumed, with the display awake (a sleeping display slows the game to a few frames a
  second).

### 8.4 Framing and the edit

From [#19](https://github.com/happy-dwarf-team/.github/issues/19).

- VS Code at **2560 × 1440 CSS px**, device scale 1, as on an ordinary monitor, so its master is
  **2560 × 1440**. Editor font **18**, so code in a close-up still reads at the site's size (VS Code's default is 14), `window.zoomLevel` 0. (Until the loops
  it was 1280 × 720 at device scale 2 with font 18: the stills were the close-ups; now the
  edit's are.)
- `etch.previewResolution` **1440x900**, the large layout the game draws at that height (until
  the 2026-11-18 refresh 1280x720); the preview panel keeps about 1440 CSS px in every take (the
  editor gives way), so one game pixel is one master pixel. The preview only scales down.
- **Dark Modern**, activity bar and status bar shown, minimap and breadcrumbs off; the sidebar and
  the bottom panel only in takes that need them; tabs only for demo mod files.
- **Never in a take** unless the clip shows it: Welcome, toasts, other extensions, the Find
  widget, the command palette, the system pointer over VS Code, preview notices. A preview notice
  the clip does not expect (e.g. `game_ui_scale` from the player's `settings.txt`) **fails the
  run**.
- The preview panel must stay visible: the host defers renders while it is hidden.
- **The edit** is 1920 × 1080 at 30 fps, for a page that shows a loop about 650 px wide. It
  cuts panels from the masters, mostly a split: the control on the left (the code, a menu of the
  preview, the Widget Outline, Problems) and its effect on the right (the preview or the game),
  each at a scale that reads at the site's size (code at 1.5× or more, the preview's menus at
  2.2×, a part of the window at 2×), from the rects in the take's log. A loop opens and closes on
  the same shot of the same state, so it loops without a jump; a take whose end differs from its
  start dissolves into its first frame over about half a second. The camera moves only between steps (cubic,
  about 0.8 s a move) or cuts. (Until the 2026-11-18 refresh a camera moved over the whole
  window, with an inset of the editor in its close-ups.)
- A menu's panel is folded to its button's row while the menu is closed and unfolds with it.
  While a menu of the preview is open over the window, the window's panel holds its frame from
  before the menu opened and shows the window's new state from the frame the menu closes, so the
  menu shows whole in its own panel, never cut off at the window panel's edge. Panels of text
  lines longer than they are (code, Problems) fade out at their right edge rather than cut a word.
- **Every frame shows Etch at work** (section 1.1): the code, Etch's preview or its menus, or pick
  mode in the game.
- **The art takes:** the Mesh or Texture Preview fills the editor area, about 1440 CSS px wide
  like the window preview's panel. The edit cuts the preview's bar with the controls a step uses
  (at 1.5× or more) above or beside the model or texture, and **the bar is in every frame**
  (section 1.1). A drag that turns a model is drawn with the drawn pointer, like a click.
- **The demo loop's `open` chapter** is the only shot of the whole VS Code window: the Explorer
  with the demo mod's folder, the activity bar and the editor, at the edit's full width, before the
  camera moves in to the first close-up. It shows what a modder sees when they open their mod.
- **Captions** name the keys pressed (`Ctrl` `S`) or what happens, in one line in a band under
  the panels, which no panel enters, in the site's IBM Plex Sans with keys in JetBrains Mono; a
  measured time says it was measured in this take. **Highlights** ring a changed rect in the
  site's verdigris once it has changed. VS Code's takes are recorded without a pointer, so the
  edit **draws one** where Playwright's mouse moved (a plain arrow the size of Windows' own, with
  a ring on a click); where the pointer crosses other widgets between two it hovers (`outline`),
  the drawn pointer glides while Playwright's mouse moves at the end only, so the preview
  outlines no widget on the way. The game's pointer is its own, recorded.
- **The live take:** VS Code as above on the primary monitor, the game windowed at the
  preview's **1440 × 900** (until the 2026-11-18 refresh 2560 × 1440, a corpus resolution) on the
  monitor right of it (the lab: 3440 × 1440 and 2560 × 1440, both at 100 %), its client area at
  that monitor's top left corner, as for a player whose preview follows the game's settings
  (until Etch 2.13.0 the preview drew a live snapshot's positions as the game's screen had them,
  so the game had to run at the preview's resolution). The real pointer waits over
  the map, away from the screen's edges (the game scrolls its map when the pointer is near or past
  them) and outside every part of the window the loops show. In `pick` it goes to the first
  widget before **Ctrl+Shift+E** and then jumps from widget to widget, so pick mode outlines
  nothing on the way.

### 8.5 Clips

| Clip       | Loop  | What it shows                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero`     | ~35 s | Five chapters (section 4.2), each dipping through the background into the next and the last into the first. **`open`** (~7 s): the whole VS Code window, the demo mod's folder in the Explorer; a click on `interface/provinceview.gui` opens it, Etch's preview opens beside it with the province view, and the camera moves in to the trade node button's line. **`type`** (~7 s): `preview`'s typing. **`mesh`** (~8 s): `mesh`'s turn and flag. **`reload`** (~6 s): `reload`'s save and moving button. **`pick`** (~7 s): `pick`'s last hover, click and definition. (Until the redesign ~12 s, three parts, no `open` and no `mesh`.) |
| `preview`  | ~7 s  | The trade node button's line (`x = 251`, the 251 selected) at 1.5× left, the preview's trade section right; `3`, `0`, `0` typed one by one, each drawn at once with the button's outline (x 3, 30, 300), unsaved; **Ctrl+Z** back to 251.                                                                                                                                                                                                                              |
| `views`    | ~12 s | **View ▾** left, the window's upper half (the header down to the religion row) right, both at 2.2×; Foreign province chosen (the red banner, the owner's shield, Diplomacy), then Own province again. The menu's panel is folded to its button's row while the menu is closed; while it is open over the window, the window's panel holds its frame from before.                                                                                                                                                                                           |
| `data`     | ~13 s | **Data ▾** left, every layer down to the generated text's lengths, as large as the stage's height allows; the province view's header at 2.2× right, with sample data from the Russia 1719 save; **Province…** with Bali typed (the quick pick cut to its input and the typed name's row), Escape closes the menu and the header shows Bali's names, area and region (Lesser Sunda Islands, Indonesia), culture, religion (Hindu) and development; then Kaluga again. While the menu is open, the window's panel holds its frame from before. |
| `zoom`     | ~7 s  | The pointer resting just above the province view's tabs, over no widget, the zoom level beside; **Ctrl+wheel** to 200 % and 300 % around the pointer, then a click on the level fits the screen again; 1.3 s later the end dissolves into the start over 0.5 s.                                                                                                                                                                                                                                                                                                                         |
| `outline`  | ~14 s | The Widget Outline at 1.5× left, the province view at 2× right (own province). The eye on the buildings panel's row: the panel disappears, the eye shows it hidden, and the view's label counts one change by hand (ringed). A radio of one of the window's alternatives: the window switches to it. **Type Sample Text…** on the province name's row, a long name typed: the header shows it. A click on a widget in the preview: its row in the outline and its line in `provinceview.gui`, both ringed. The end dissolves into the start. (Until the redesign: hovers in the preview with their tooltips and a click to the definition, no hiding by hand; `hovers` now shows the editor's hovers.) |
| `problems` | ~8 s  | The sprite's line above Problems (filtered to the file, cut to its last warning) left, the buildings panel right; the `ui` of `GFX_provinceview_building_bg` swapped: one missing-sprite warning, ringed, and the panel's background gone; **Ctrl+Z**.                                                                                                                                                                                                                 |
| `reload`   | ~7 s  | Live: the trade node button's line at 1.5× left, the game's trade section at 2× right; x 251 → 151 with one keystroke, **Ctrl+S**, the game reloads the window and the button moves (ringed, with the time from the save to Tongs seeing it moved); **Ctrl+Z**, **Ctrl+S**, back.                                                                                                                                                                                      |
| `pick`     | ~8 s  | Live: **Ctrl+Shift+E** in the game; the loop opens on its trade section at 2×, the real pointer on the owner's shield, then on the trade post button and the trade node button's right end, each outlined and labelled by pick mode (the game shows no tooltips in pick mode since Etch 2.13.0); a click on the button, ringed: the game's row of the button on top, its definition in VS Code under it, the keyword ringed, and the game shows the province view still. The take opens Kaluga, the sample data's province. |
| `snapshot` | ~6 s  | Live: the preview's military and trade rows left, the game's same rows right, the game windowed at the preview's 1440 × 900; the same pick's live snapshot redraws the preview with the game's manpower, supply limit, sailors, trade value and goods produced (both columns ringed). Two rows, so the values read at the site's width.                                                                                                              |
| `profile`  | ~10 s | Opens on the profile page, the slowest rows; a click on a decision's name cuts to its block in the base game's file, the profile's line above it ringed; **Ctrl+W** cuts back to the page.                                                                                               |
| `names`    | ~12 s | The demo mod's event above Problems (filtered to its file, cut to its last warning): a `5` before `owns = 151`, the warning ringed; an `s` into `economic_ideas`, the second warning ringed; two **Ctrl+Z** take them away one at a time. |
| `mesh`     | ~12 s | A ship's `.mesh` in the Etch Mesh Preview, the bar's facts (shapes, vertices, triangles, bones) at 1.5× above the ship. A drag turns the ship about half around; **Wire** shows its triangle edges and goes off again; a tag typed in **Flag** puts that country's flag on the ship; the ship's idle animation picked and **Play**: the ship rocks; **Reset view** frames it as at the start. |
| `entity`   | ~12 s | A base-game unit's `.asset` file at 1.5× left, **Preview entity** above an `entity` ringed; a click, and the preview right builds the unit with its attachments on their bones, playing `idle`; the state list set to `walk`: the unit walks and the attachments move with their bones; the pointer rests on the bar's first line, whose hover lists the attachments and their bones. The end dissolves into the start. |
| `trees`    | ~12 s | A map tree's mesh in the Etch Mesh Preview, the bar's tree controls at 1.5× above it. **North** at 1, **Date** moved from spring through autumn: the season colour follows; **Snow** from 0 to 1; a province ID in the far north typed in **Place**: Ground and North follow the map there, ringed. The end dissolves into the start. |
| `texture`  | ~10 s | A base-game `.dds` with an alpha in the Etch Texture Preview, its size, format and mip levels in the bar at 1.5×. **A**: the alpha alone in grey; **RGBA** again; **Mip** two levels down and back to 0; the pointer rests on the image, and the bottom line's texel and RGBA values are ringed. |
| `hovers`   | ~12 s | `provinceview.gui` at 1.5×: a hover on `GFX_provinceview_building_bg` shows its sprite, kind and frames and the `.gfx` that defines it; **F12** opens the base game's `.gfx` at the sprite's name, ringed. The demo mod's models `.gfx`: a hover on the mesh path draws the ship with its counts; a Ctrl+click on its texture path opens the Texture Preview; **Ctrl+W** twice returns to `provinceview.gui`. |
| `run`      | ~12 s | Live: the demo mod's event file at 1.5× left, the game's province view (its development) at 2× right. The effect's lines selected, **Etch: Run Selection in the Province on Screen** from the editor's context menu: the development rises in the game, ringed; the trigger selected, **Etch: Check Selection as Trigger in the Live Game**: the answer beside it, ringed; one letter added to the effect's name and run again: the game's error in Problems on the selection, ringed. The end dissolves into the start. |
| `encoding` | ~8 s  | The demo mod's second event above Problems (filtered to its file): an `é` typed into the ruler's name, Etch's warning (the game would show `Ã©`) ringed; **Ctrl+.** and **Save with Encoding…**, Windows 1252 picked in VS Code's list: the warning is gone. The end dissolves into the start. |

`zoom` stays in the set for the docs page "Zoom and resolution" (section 3.4.2) and is not on the
home page. The lengths of the clips the 2026-11-18 set has were reviewed frame by frame at the
site's size: a loop holds each step long enough to be read at about 650 px wide. Those of the
new and re-shot clips (`hero`'s chapters, `outline`, and `mesh` to `encoding`) are targets,
reviewed the same way when they are captured; a section player shows a loop at about the same
width. The set is Etch 2.13.0's,
captured from the release tag. `snapshot` is taken with the game windowed at the preview's
1440 × 900: until Etch 2.13.0 the preview drew a live snapshot's positions as the game's screen
had them, so a game at another resolution drew the window off the preview's canvas (until this
refresh the set kept 2.0.0's `snapshot` because of it); 2.13.0 re-anchors them to the preview's
screen. The game is paused, so its values stay the same through the
take, and the loop's game panel is a still frame from just before pick mode.

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
- Sizes measured at the 2.0.0 media refresh (CRF 34): feature loops 1.5–3.6 MB WebM, the hero
  (15 s) 4.3 MB; CRF 40 would take the hero to 3.0 MB at a visible cost to the code's text.
  Each loop loads only when it plays (section 4.1).
- The redesign's demo loop of about 35 s would be about 10 MB WebM at that rate. Its review
  decides whether it keeps CRF 34 or takes a higher CRF of its own; it loads only once it is
  half in view and motion is allowed, after the poster.
- **Posters** are the cuts' first frames (the demo loop's: section 4.1), 1920 × 1080 PNG.

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
- **The art takes** need the same wait: the Mesh Preview and the Texture Preview set the same two
  attributes on their canvas after each paint, in the `etch` change that adds those takes, unless
  they already have such a marker (not checked).

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
- **Every clip:** a set holds every clip of the media script's list with its poster; `publish`
  refuses a capture that lacks any of them, except a loop kept from an earlier set with `--keep`.
  A clip joins the list in the `etch` PR that adds its take (twelve clips until the redesign,
  nineteen once its clips exist).
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
Only after the first media are published (section 4.4), in this order:

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

### 10.1 The 2026-11 redesign

Done in this order, each through the team's PR process. R1–R3 can ship before the new clips
exist: a feature without its clip is left out (section 3.2).

| Item                                                                        | Sections             | Blocked by         |
| --------------------------------------------------------------------------- | -------------------- | ------------------ |
| R1 `etch`: the user docs in `docs/user/` with `STYLE.md`; the README as an overview | 3.4             | this specification |
| R2 The home page: hero with chapters, areas, four feature sections, proof band, footer links | 3.1–3.3, 4, 7 | —                  |
| R3 The docs and the changelog with Starlight                                | 2, 3.4, 3.5, 6.1, 7  | R1, R2             |
| R4 Titles, meta description and the social preview image                    | 6                    | R2                 |
| R5 `etch`: the demo mod's new files, the art takes, the new and re-shot clips, the chapters | 5.2, 8.2–8.8 | this specification |
| R6 A media refresh with the new clips                                       | 5, 8.8, 8.9          | R5, R2             |

- R2 removes the roadmap and its milestones from `src/data/status.yaml`, which keeps the status
  and the What's new pill. The team's list of facts with copies in several repositories and its
  consistency check, kept outside this repository, name the roadmap and the feature tour; they
  change in the same task as R2.
- Every PR of R1–R3 that adds or changes text for users has the plain-language review of section
  3.4.3 in its Evidence.

## 11. Not verified

- The poster as LCP, and the page's weight with the loops (each loads only when it plays).
  (Encode sizes were measured on the first media refresh, Etch 0.2.0: the hero loop is 9.4 s,
  311 KB WebM and 273 KB MP4.)
- Headless or locked-screen capture, Windows display scaling other than 100 %.
- All copy is a draft; verdigris contrast is computed, not measured in a browser.
- Our reading of the Paradox User Agreement has not been confirmed by Paradox or a lawyer.
- The redesign: the layout and the section player were tried in a local prototype with the
  2026-11-18 set's loops, at 1440, 980, 375 and 360 px; nothing of it is built yet. Starlight's
  theming with this site's own header and footer was tried in a local build of R3 at 1920, 375
  and 360 px, with the docs from a local `etch` checkout. A sparse checkout of `etch` at the
  release tag was tried locally, not in the `deploy` workflow, and the size of the 35 s demo loop
  is not tried. The new clips'
  storyboards (section 8.5) are not tried in Etch: whether the game's province view shows a
  development change from **Run Selection** while paused, and whether the Mesh and Texture
  Previews already set a paint marker.
