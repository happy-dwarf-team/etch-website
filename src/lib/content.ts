// The home page's editorial content: links, the six features with their stills' captions and
// alts, the demo loop's description and the roadmap lines (docs/spec.md, sections 3 and 4).
// The media manifest carries only facts about files; everything said about them is here.
// Strings marked `html` hold inline markup (`code`, links) and are rendered with set:html.
import { getEntry } from 'astro:content';
import type { MediaManifest } from './media-manifest';
import { ETCH_REPO, getLatestVersion } from './release';

export const REPO_URL = `https://github.com/${ETCH_REPO}`;
export const MARKETPLACE_URL =
	'https://marketplace.visualstudio.com/items?itemName=happy-dwarf-team.etch';
export const OPEN_VSX_URL = 'https://open-vsx.org/extension/happy-dwarf-team/etch';
export const README_URL = `${REPO_URL}/blob/main/packages/extension/README.md`;
export const V1_SPEC_URL = `${REPO_URL}/blob/main/docs/spec/v1.md`;
export const V2_SPEC_URL = `${REPO_URL}/blob/main/docs/spec/v2.md`;
export const AFTER_V2_URL = `${REPO_URL}/blob/main/docs/spec/after-v2.md`;
export const ETCH_1X_URL = `${README_URL}#etch-1x`;
export const ADR_0005_URL = `${REPO_URL}/blob/main/docs/adr/0005-live-game-replaces-game-host.md`;
export const INSTALL_COMMAND = 'code --install-extension happy-dwarf-team.etch';

export const REQUIREMENTS = ['Windows x64', 'VS Code 1.100+', 'EU4 1.37.5 (Steam)', 'No telemetry'];

export const LOOP = {
	lead: 'Demo loop, 8 s, silent.',
	descriptionHtml:
		"In VS Code, <code>provinceview.gui</code> is open beside Etch's preview of the province view, the buildings panel outlined. One keystroke changes the panel's x from 480 to 580 and the panel moves right at once. In <strong>View ▾</strong> the army builder's view is chosen and drawn beside the moved panel, then the own province's view again; one undo returns the window to where it started.",
	posterAlt:
		"VS Code with provinceview.gui on the left and Etch's preview of the province view on the right, its buildings panel outlined.",
};

export interface Feature {
	scene: keyof MediaManifest['stills'];
	title: string;
	textHtml: string;
	captionHtml: string;
	alt: string;
}

// In the order of the feature tour (section 3.2).
export const FEATURES: Feature[] = [
	{
		scene: 'preview',
		title: 'Preview as you type',
		textHtml: `The preview follows the unsaved editor buffer on every change, including the mod's <code>.gfx</code> and localisation files. Warm reload: median 6–7 ms, p95 8–14 ms <span class="source">(measured on the maintainer's machine, <a href="${REPO_URL}/issues/39">etch#39</a>)</span>.`,
		captionHtml:
			'Move the buildings panel in an unsaved <code>provinceview.gui</code> and the province view redraws; the widget at the cursor stays outlined.',
		alt: "VS Code with an unsaved provinceview.gui on the left, the buildings window's x changed to 580, and Etch's preview of the province view with the buildings panel moved right and outlined.",
	},
	{
		scene: 'views',
		title: 'Views of the window',
		textHtml:
			'A window with a window profile is drawn in one view, as the game would show it: the province view as an own or a foreign province, with its province or state tab, one side panel and one sub-panel. <strong>View ▾</strong> lists the views and every selector with where its value comes from; <strong>Save as view…</strong> writes your own into the mod.',
		captionHtml:
			"<strong>View ▾</strong> on the province view: the army builder's view is chosen, and every selector shows where its value comes from.",
		alt: "Etch's preview toolbar with the View menu open over the province view, listing six views with Build army chosen and the selectors below.",
	},
	{
		scene: 'data',
		title: 'Sample data',
		textHtml:
			"Texts the game's code fills (a province's name, its development, culture, religion) show sample data. <strong>Data ▾</strong> shows the layers, the upper winning: a live snapshot, a save, the game's and the mod's files, and generated text of a chosen length.",
		captionHtml:
			'<strong>Data ▾</strong> with generated text set to long: the province view shows how long names and numbers fit.',
		alt: "Etch's preview with the Data menu open, its layers listed and generated text set to long; the province view behind it shows long names overflowing their boxes.",
	},
	{
		scene: 'zoom',
		title: 'Zoom without a new layout',
		textHtml:
			'Zoom changes only how big the preview is shown, never the resolution the window is laid out at. <strong>Ctrl+mouse wheel</strong> zooms around the cursor; above 100 % only whole steps are offered, so pixels stay sharp.',
		captionHtml:
			"The province view's header at 200 %, zoomed around the cursor with Ctrl+wheel; game pixels stay sharp.",
		alt: "Etch's preview zoomed to 200 % on the province view's header, its zoom level reading 200 %, beside provinceview.gui.",
	},
	{
		scene: 'outline',
		title: 'Widget outline and jump to source',
		textHtml:
			"The Widget Outline lists the window's widgets, a window's alternatives as radios and an eye on every other widget. Click a widget in the preview to reveal its source; hover to see its path and rect.",
		captionHtml:
			'A click on the buildings panel in the preview selects its definition in <code>provinceview.gui</code> and in the Widget Outline; the hover shows its path and rect.',
		alt: "VS Code with the Widget Outline in the sidebar and buildings_window selected in it and in provinceview.gui, and in Etch's preview a dashed box around the buildings panel with a tooltip giving its path and rect.",
	},
	{
		scene: 'problems',
		title: 'Diagnostics in Problems',
		textHtml:
			"Missing sprites, fonts and textures, duplicate names and more appear in VS Code's Problems panel as you edit.",
		captionHtml:
			'A misspelled sprite name in <code>provinceview.gui</code> is reported in Problems while the rest of the window still draws.',
		alt: "VS Code with a misspelled sprite name in provinceview.gui, the Problems panel filtered to Etch's missing-sprite warning, and the province view drawn with the buildings panel's background missing.",
	},
];

// The preview's features without a still, after the tour (section 3.2).
export const ALSO_HTML = [
	'<strong>Pin</strong> keeps the preview on one window while you edit other files.',
	"Any resolution: the game's <code>settings.txt</code>, the monitor's, a corpus resolution from 1280×720 to 3840×2160 (3840×2160 not yet measured against the game) or any width × height. <code>if_resolution</code> blocks follow it.",
	'Etch finds the game through Steam and draws with its textures, fonts and localisation. It ships none of them and sends nothing anywhere.',
];

// Etch's two parts, before the feature tour (section 3.2), following the extension README.
export const PARTS_HTML =
	"Etch has two parts. The <strong>offline preview</strong> needs no running game: it draws the window under the cursor from the unsaved buffer, in one <strong>view</strong> of the window from its profile (the province view as an own or a foreign province, with one side panel and one sub-panel), with <strong>sample data</strong> where the game's code fills in texts: a live snapshot, a save, the game's and the mod's files, or generated text. The <strong>live game</strong> is the game itself, beside the editor.";

// What the released version does not do (section 3.3), following the extension README.
export const LIMITS_HTML = [
	'Values the engine works out (income, modifiers) come from a live snapshot or are generated: Etch never computes one. Ironman and other binary saves are not readable.',
	'Reloading does not work in ironman or multiplayer games, and a file nothing rebuilds (<code>countryview.gui</code>, <code>.gfx</code> files, fonts) asks for a planned restart.',
	"You edit in VS Code's own text editor, not in the preview or the game.",
	'Windows (x64), VS Code 1.100+, EU4 1.37.5 from Steam; the live game needs build 1.37.5 exactly.',
];

export type MilestoneId = 'M0' | 'M1' | 'M2' | 'M3' | 'M4' | '1.0' | '2.0';
export type MilestoneState = 'done' | 'current' | 'next';

// One line each from etch's v1 specification, section 11, then 2.0 (section 3.5).
const MILESTONES: { id: MilestoneId; name: string; version?: string; line: string }[] = [
	{ id: 'M0', name: 'Foundation', line: 'Public repository, CI, release-please, packaged VSIX.' },
	{
		id: 'M1',
		name: 'Offline preview',
		version: '0.1.0',
		line: 'Released on the Marketplace and Open VSX, marked preview. Everything in the feature tour.',
	},
	{
		id: 'M2',
		name: 'Precision corpus',
		version: '0.2.0',
		line: 'Measured against the game, widget by widget, at six resolutions: vanilla and Proper 2K UI Enhanced.',
	},
	{
		id: 'M3',
		name: 'Game host',
		version: '0.3.0',
		line: 'A private copy of the running game draws the window itself.',
	},
	{
		id: 'M4',
		name: 'Compare and scale',
		version: '0.4.0',
		line: 'Diff view between the two backends; the Anbennar playset in both.',
	},
	{
		id: '1.0',
		name: 'Release',
		version: '1.0.0',
		line: 'The release criteria hold and the preview flag is gone.',
	},
	// From etch's v2 specification, its summary and section 13: one milestone for M5–M10, since
	// v2 makes no store release before 2.0.0 (etch#156).
	{
		id: '2.0',
		name: 'Live game and views',
		version: '2.0.0',
		line: "A live game reloads each saved file into the game's own window, with pick mode; the preview shows a view of the window from its profile, with sample data from saves and live snapshots. The game host and the diff view leave.",
	},
];

// "0.3.1" → 3: major and minor in one number, so 0.3.x and 0.3.0 compare equal.
function minorOf(version: string): number {
	const [major = 0, minor = 0] = version.split('.').map(Number);
	return major * 1000 + minor;
}

// The extension's status and the roadmap with each milestone's state, from src/data/status.yaml.
// With the latest release known, a milestone it has reached must not be `next` (section 3.1):
// the build fails, so the file is updated in the pull request that fixes it.
export async function getStatus() {
	const entry = await getEntry('status', 'extension');
	if (!entry) throw new Error('src/data/status.yaml has no `extension` entry');
	const { status, milestones } = entry.data;
	const roadmap = MILESTONES.map((m) => ({ ...m, state: milestones[m.id] as MilestoneState }));
	const latest = await getLatestVersion();
	if (latest) {
		const stale = roadmap.filter(
			(m) => m.version && m.state === 'next' && minorOf(m.version) <= minorOf(latest),
		);
		if (stale.length > 0) {
			throw new Error(
				`src/data/status.yaml: Etch ${latest} is released, but ${stale.map((m) => m.id).join(', ')} still says next; mark the latest release's milestone current and the ones before it done`,
			);
		}
	}
	return { status, roadmap };
}

// The live game after the feature tour (section 3.2.1), following the extension README.
export const LIVE_GAME = {
	title: 'The live game',
	items: [
		{
			title: 'Reload on save',
			textHtml:
				"<strong>Etch: Start the Live Game</strong>, or the preview's <strong>Live game</strong> button, starts a private copy of the game with your mod's playset. You play it; each file you save is reloaded into the game's own window, with its real data. A file nothing rebuilds asks for a planned restart.",
		},
		{
			title: 'Pick mode',
			textHtml:
				'<strong>Ctrl+Shift+E</strong> turns on pick mode: the widget under the pointer is outlined with its name, kind, size and file, and a click opens its definition at its line in VS Code, without the game taking the click.',
		},
		{
			title: 'Live snapshot',
			textHtml:
				'A pick also takes a live snapshot of the window: the texts, visibility and states the game shows, which the preview uses as its upper data layer.',
		},
	],
	noteHtml:
		'Etch creates the private install on first use, after one confirmation. It never writes to your game folder, profile or mods, and never changes <code>eu4.exe</code>.',
};

// The note on staying on 1.x (section 3.2.2), following the extension README (etch#209).
export const ETCH_1X = {
	title: 'Staying on 1.x',
	textHtml: `2.0.0 replaced 1.x's game host and its diff view with the live game (<a href="${ADR_0005_URL}">ADR 0005</a>). To keep them, install 1.0.x: in the Extensions view, <strong>Install Specific Version…</strong> on Etch, then 1.0.x, and turn off automatic updates for it. 1.0.x gets no fixes after 2.0.0 (<a href="${ETCH_1X_URL}">extension README</a>).`,
};
export const ANVIL_URL = 'https://anvil.happydwarf.dev/';
