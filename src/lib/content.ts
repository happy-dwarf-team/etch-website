// The home page's editorial content: links, the features with their loops' text descriptions and
// posters' alts, the demo loop's and the roadmap lines (docs/spec.md, sections 3 and 4).
// The media manifest carries only facts about files; everything said about them is here.
// Strings marked `html` hold inline markup (`code`, links) and are rendered with set:html.
import { getEntry } from 'astro:content';
import type { ClipId } from './media-manifest';
import { ETCH_REPO, getLatestVersion } from './release';

export const REPO_URL = `https://github.com/${ETCH_REPO}`;
export const MARKETPLACE_URL =
	'https://marketplace.visualstudio.com/items?itemName=happy-dwarf-team.etch';
export const OPEN_VSX_URL = 'https://open-vsx.org/extension/happy-dwarf-team/etch';
export const README_URL = `${REPO_URL}/blob/main/packages/extension/README.md`;
export const V1_SPEC_URL = `${REPO_URL}/blob/main/docs/spec/v1.md`;
export const V2_SPEC_URL = `${REPO_URL}/blob/main/docs/spec/v2.md`;
export const AFTER_V2_URL = `${REPO_URL}/blob/main/docs/spec/after-v2.md`;
export const BUDGETS_URL = `${REPO_URL}/blob/main/docs/budgets.md`;
export const ETCH_1X_URL = `${README_URL}#etch-1x`;
export const ADR_0005_URL = `${REPO_URL}/blob/main/docs/adr/0005-live-game-replaces-game-host.md`;
export const INSTALL_COMMAND = 'code --install-extension happy-dwarf-team.etch';

export const REQUIREMENTS = ['Windows x64', 'VS Code 1.100+', 'EU4 1.37.5 (Steam)', 'No telemetry'];

// The hero's demo loop (section 4.1): a trailer of three feature loops.
export const LOOP = {
	title: 'Demo loop',
	descriptionHtml:
		"Three moments from the loops below. In VS Code, the trade node button's x in an unsaved <code>provinceview.gui</code> is retyped digit by digit, and Etch's preview moves the button at every keystroke. Beside the live game, a save reloads the province view in the game and the button moves. In the game, pick mode outlines each widget under the pointer with its name, kind, size and file, and a click opens its definition in VS Code.",
	posterAlt:
		"provinceview.gui with the trade node button's position selected, beside the trade section of Etch's preview of the province view.",
};

export interface Feature {
	clip: ClipId;
	title: string;
	textHtml: string;
	/** The loop's text description (WCAG 1.2.1), after its lead. */
	descriptionHtml: string;
	posterAlt: string;
}

// Every poster is its loop's first frame, the shot it also ends on (section 4.1).
// In the order of the feature tour (section 3.2).
export const FEATURES: Feature[] = [
	{
		clip: 'preview',
		title: 'Preview as you type',
		textHtml: `The preview follows the unsaved buffer on every change, including the mod's <code>.gfx</code> and localisation files. A warm reload of the province view takes a median of 10–13 ms, p95 12–16 ms <span class="source">(vanilla and Anbennar, on the maintainer's machine, 28 October 2026, <a href="${BUDGETS_URL}">budgets</a>)</span>.`,
		descriptionHtml:
			"The code beside the preview's trade section. The trade node button's x, 251, is retyped as 3, 30 and 300, unsaved, and the button with its outline jumps to each position at once. An undo returns it to 251.",
		posterAlt:
			"provinceview.gui with the trade node button's position selected, beside the trade section of Etch's preview of the province view.",
	},
	{
		clip: 'views',
		title: 'Views of the window',
		textHtml:
			'A window with a window profile is drawn in one view, as the game would show it: for example the province view as an own or a foreign province, with one side panel open. <strong>View ▾</strong> lists the views and every selector, with where its value comes from. <strong>Save as view…</strong> writes your own into the mod.',
		descriptionHtml:
			"<strong>View ▾</strong> beside Etch's preview of the province view. The menu lists the window's views; Foreign province is chosen and the window is drawn as a foreign province's, with a red banner, the owner's shield and Diplomacy. The menu then goes back to Own province.",
		posterAlt:
			"The preview's View button, set to Own province, beside the upper half of Etch's preview of the province view.",
	},
	{
		clip: 'data',
		title: 'Sample data',
		textHtml:
			"Texts the game's code fills (a province's name, its development, culture, religion) show sample data. <strong>Data ▾</strong> shows the layers, and the upper one wins: a live snapshot, a save, the game's and the mod's files, then generated text of a chosen length.",
		descriptionHtml:
			"<strong>Data ▾</strong> beside the province view's header, with sample data from a save of Russia in 1719. The menu shows its layers, upper ones winning; <strong>Province…</strong> picks Bali from the save, and the header redraws with its names, area, region, culture, religion and development. Then Kaluga again.",
		posterAlt:
			"The preview's Data button, Kaluga from a 1719 save, beside the header of Etch's preview of the province view.",
	},
	{
		clip: 'zoom',
		title: 'Zoom without a new layout',
		textHtml:
			'Zoom changes how big the preview is shown, never the resolution the window is laid out at. <strong>Ctrl+mouse wheel</strong> zooms around the cursor. Above 100 % only whole steps are offered, so pixels stay sharp.',
		descriptionHtml:
			"The pointer rests just above the province view's tabs. Ctrl+mouse wheel zooms the preview in two whole steps, 200 % and 300 %, around the pointer, game pixels sharp; a click on the zoom level fits it again.",
		posterAlt:
			"The preview's zoom level, Fit · 100 %, beside the top of Etch's preview of the province view.",
	},
	{
		clip: 'outline',
		title: 'Widget outline and jump to source',
		textHtml:
			"The Widget Outline lists the window's widgets, with radios for a window's alternatives and an eye on every other widget. Click a widget in the preview to reveal its source. Hover to see its path and rect.",
		descriptionHtml:
			"The pointer hovers a text, a button and an icon in Etch's preview, each outlined with a tooltip giving its path, kind and rect. A click on the icon selects its definition in <code>provinceview.gui</code> and its row in the Widget Outline, both ringed; Alt+← returns the cursor where it was.",
		posterAlt: "Etch's preview of the province view close up, its demographics.",
	},
	{
		clip: 'problems',
		title: 'Diagnostics in Problems',
		textHtml:
			"Missing sprites, fonts and textures, duplicate names and more appear in VS Code's Problems panel as you edit.",
		descriptionHtml:
			"<code>provinceview.gui</code> above the Problems panel, the preview's buildings panel beside them. Two letters of a sprite name are swapped; Problems reports the missing sprite at once, and the panel's background is gone while the rest of the window still draws. An undo fixes it.",
		posterAlt:
			"A sprite's line of provinceview.gui above an empty Problems panel, beside the buildings panel of Etch's preview.",
	},
];

// The preview's features without a loop, after the tour (section 3.2).
export const ALSO_HTML = [
	'<strong>Pin</strong> keeps the preview on one window while you edit other files.',
	"Any resolution: the one in the game's <code>settings.txt</code>, the monitor's, a corpus resolution from 1280×720 to 3840×2160, or any width × height. <code>if_resolution</code> blocks follow it. 3840×2160 is not yet measured against the game.",
	'Etch finds the game through Steam. For a GOG game, set its folder in <code>etch.gamePath</code>: the preview reads it, and the live game needs the Steam build. Etch ships none of the game\'s files and sends nothing anywhere.',
];

// Etch's two parts, before the feature tour (section 3.2), following the extension README.
export const PARTS_HTML =
	"Etch has two parts. The <strong>offline preview</strong> draws the window from the unsaved buffer and needs no running game. The <strong>live game</strong> is the game itself, beside the editor.";

// What the released version does not do (section 3.3), following the extension README.
export const LIMITS_HTML = [
	'Values the engine works out (income, modifiers) come from a live snapshot or are generated. Etch never computes one.',
	'Ironman and other binary saves are not readable, and reloading and Run selection do not work in ironman or multiplayer games.',
	"You edit in VS Code's own text editor, not in the preview or the game.",
	'Etch is built for Windows (x64) and EU4 1.37.5. The live game refuses any other <code>eu4.exe</code>.',
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
		line: 'First release on the Marketplace and Open VSX, marked preview.',
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
		line: "The live game reloads each saved file into the game's own window, with pick mode. The preview shows views of a window, with sample data from saves and live snapshots. The game host and the diff view are gone.",
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
	return { status, roadmap, latest };
}

// The live game after the feature tour (section 3.2.1), following the extension README: its
// three features continue the tour's numbering, each with its loop.
export const LIVE_GAME = {
	title: 'The live game',
	features: [
		{
			clip: 'reload',
			title: 'Reload on save',
			textHtml:
				"<strong>Etch: Start the Live Game</strong>, or the preview's <strong>Live game</strong> button, starts a private copy of the game with your mod's playset. You play it, and each file you save is reloaded into the game's own window, with its real data. A file nothing rebuilds (<code>countryview.gui</code>, <code>.gfx</code> files, fonts) asks for a planned restart.",
			descriptionHtml:
				"The trade node button's line in <code>provinceview.gui</code> beside the trade section of the live game's province view. One keystroke changes its x from 251 to 151, and a save reloads the window in the game: the button moves left. An undo and a save move it back.",
			posterAlt:
				"provinceview.gui with the trade node button's position, beside the trade section of the live game's province view.",
		},
		{
			clip: 'pick',
			title: 'Pick mode',
			textHtml:
				'<strong>Ctrl+Shift+E</strong> turns on pick mode: the widget under the pointer is outlined with its name, kind, size and file, and a click opens its definition at its line in VS Code, without the game taking the click.',
			descriptionHtml:
				'Ctrl+Shift+E turns on pick mode in the game. The pointer hovers the owner\'s shield, the trade post button and the trade node button in the province view, and pick mode outlines each with its name, kind, size and file; the game\'s own tooltip still shows under the label. A click on the trade node button opens its definition in VS Code, and the game does not take the click.',
			posterAlt:
				"The live game's trade section close up, pick mode outlining the owner's shield with its name, kind, size and file, the game's tooltip under it.",
		},
		{
			clip: 'snapshot',
			title: 'Live snapshot',
			textHtml:
				'A pick also takes a live snapshot of the window: the texts, visibility and states the game shows, which the preview uses as its upper data layer.',
			descriptionHtml:
				"The military and trade rows of Etch's preview beside the same rows of the live game. The preview's values come from the save or are generated; a pick in the game takes a live snapshot, and the preview redraws with the game's own manpower, supply limit, sailors, trade value and goods produced.",
			posterAlt:
				"The military and trade rows of Etch's preview, beside the same rows of the live game's province view.",
		},
	] satisfies Feature[],
	// Without loops, after the three rows (section 3.2.1), following the README's "Run selection".
	alsoHtml: [
		'<strong>Run selection</strong>: select an effect in a script file and <strong>Etch: Run Selection in the Live Game</strong> runs it in your country, or in the province on screen. <strong>Etch: Check Selection as Trigger in the Live Game</strong> says whether a trigger is true. The game\'s errors from the run go to the Problems panel. Run changes only the private copy, never your own saves, and does not work in ironman or multiplayer games.',
	],
	noteHtml:
		'Etch creates the private install on first use, after one confirmation. The live game never writes to your game folder, profile or mods, and never changes <code>eu4.exe</code>. The live game counts as your EU4 session on Steam, so your own game does not start beside it. Settings changed in it do not persist.',
};

// The scripts after the live game (section 3.2.3), following the extension README's "Script
// profile" and "Province IDs and names": two more rows of the tour, each with its loop.
export const SCRIPTS = {
	title: 'Your scripts',
	introHtml:
		'Etch also reads the script files of your mod: how long they take in the game, and names in them that crash it.',
	features: [
		{
			clip: 'profile',
			title: 'Script profile',
			textHtml:
				"Anvil's script profiler (Anvil 1.22 or newer) times your events', decisions' and other scripts' triggers and effects in your own game. <strong>Etch: Show Latest Script Profile</strong> opens its newest file, the longest rows first, and each name links to where it is written. While a profile is shown, a line above each measured event, option or decision gives its time and calls.",
			descriptionHtml:
				"The page of <strong>Etch: Show Latest Script Profile</strong>, with a profile Anvil's profiler measured in the base game, the slowest rows first. A click on a decision's name opens its file at the measured block, with the profile's time and calls on a line above it; Ctrl+W returns to the page.",
			posterAlt:
				"The table of Etch's script profile page: owners, names, roles, calls and times.",
		},
		{
			clip: 'names',
			title: 'Province IDs and names',
			textHtml:
				"A province id the map does not have, such as <code>owns = 5075</code>, gets no line in the game's <code>error.log</code>, and the game may crash when it reads that province. Etch warns about such ids in the script files you open, and about names the playset does not define where the game crashes on them, such as an idea group in <code>add_idea_group</code>. <strong>Etch: Check Province IDs and Names in the Playset</strong> checks every mod of the playset.",
			descriptionHtml:
				'In an event of the demo mod, a 5 typed before province 151 makes it 5151, and Problems warns at once that the map has no such province. An s turns the idea group <code>economic_ideas</code> into <code>economics_ideas</code>, and a second warning says the playset has no such idea group. Two undos take them away one at a time.',
			posterAlt: 'An event of the demo mod above an empty Problems panel.',
		},
	] satisfies Feature[],
};

// The note on staying on 1.x (section 3.2.2), following the extension README (etch#209).
export const ETCH_1X = {
	title: 'Staying on 1.x',
	textHtml: `2.0.0 replaced 1.x's game host and its diff view with the live game (<a href="${ADR_0005_URL}">ADR 0005</a>). To keep them, use <strong>Install Specific Version…</strong> on Etch in the Extensions view, pick 1.0.x and turn off automatic updates for it. 1.0.x gets no fixes after 2.0.0 (<a href="${ETCH_1X_URL}">extension README</a>).`,
};
export const ANVIL_URL = 'https://anvil.happydwarf.dev/';
