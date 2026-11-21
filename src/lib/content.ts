// The home page's editorial content (docs/spec.md, sections 3.1–3.3 and 4): links, the hero, the
// install band, the four feature sections with their loops' text descriptions and posters' alts,
// the demo loop's chapter labels, the proof band and the closing call. The media manifest carries
// only facts about files; everything said about them is here. Strings named `…Html` hold inline
// markup (`code`, `strong`, links) and are rendered with set:html.
import { getEntry } from 'astro:content';
import type { Media, Loop } from './media';
import type { ClipId } from './media-manifest';
import { ETCH_REPO, getLatestVersion } from './release';

export const REPO_URL = `https://github.com/${ETCH_REPO}`;
export const ISSUES_URL = `${REPO_URL}/issues`;
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;
export const MARKETPLACE_URL =
	'https://marketplace.visualstudio.com/items?itemName=happy-dwarf-team.etch';
export const OPEN_VSX_URL = 'https://open-vsx.org/extension/happy-dwarf-team/etch';
export const DISCORD_URL = 'https://discord.happydwarf.dev/';
const ANVIL_URL = 'https://anvil.happydwarf.dev/';
export const INSTALL_COMMAND = 'code --install-extension happy-dwarf-team.etch';

// The docs and the changelog are not on the site yet (spec sections 3.4 and 3.5): until the docs
// item (R3, section 10.1) builds them under /docs/, these return their files in etch on GitHub,
// and R3 switches them to url('/docs/<page>/') and url('/docs/changelog/').
/** A docs page by its path under etch's docs/user/ without `.md`; the docs' index without one. */
export function docsUrl(page = 'README'): string {
	return `${REPO_URL}/blob/main/docs/user/${page}.md`;
}
export const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;

// The hero (section 3.1). The h1's middle part is set off in the accent.
export const HERO = {
	eyebrow: 'Europa Universalis IV modding · VS Code',
	title: 'See your mod as the game draws it, while you write it.',
	lead: "Etch draws your interface windows as you type. It opens the textures and meshes VS Code can't, and plays their animations. It checks your scripts the way the game reads them. And it runs the game beside the editor, reloading each file you save.",
	requirements: ['Windows x64', 'VS Code 1.100+', 'EU4 1.37.5', 'Free and open source', 'Sends no data'],
};

// The install band (section 3.1): the command, then the first step and the first docs page.
export const INSTALL = {
	textHtml:
		"Run it in a terminal, or use the Install button above. Then open your mod's folder in VS Code and a <code>.gui</code>, <code>.mesh</code> or <code>.dds</code> file; for a <code>.gui</code>, click the preview button at the editor's top right. You need EU4 installed, and Anvil, the plugin loader, only for the script profile.",
	link: { href: docsUrl('getting-started/install'), label: 'Getting started' },
};

/** What a loop is called in its text description's lead and in its buttons' labels. */
export interface LoopText {
	title: string;
	/** The loop's text description (WCAG 1.2.1), after its lead. */
	descriptionHtml: string;
	posterAlt: string;
}

// The hero's demo loop (section 4.1). These describe the loop published now, Etch 2.13.0's set:
// a 12 s trailer of three feature loops, without chapters. The media refresh that publishes the
// chaptered demo loop (R6, section 10.1) replaces the description and the alt with section 4.1's.
export const DEMO_LOOP: LoopText = {
	title: 'Demo loop',
	descriptionHtml:
		"Three moments from the loops below. In VS Code, the trade node button's x position in an unsaved <code>provinceview.gui</code> is retyped digit by digit, and Etch's preview moves the button at every keystroke. Beside the live game, a save reloads the province view in the game and the button moves. In the game, pick mode outlines the trade node button with its name, kind, size and file, and a click on it opens its definition in VS Code.",
	posterAlt:
		"provinceview.gui with the trade node button's position selected, beside the trade section of Etch's preview of the province view.",
};

// The demo loop's chapter labels (section 4.2); the ids and start times come from the manifest.
const CHAPTER_LABELS: Record<string, string> = {
	open: 'Open your mod',
	type: 'Type, see the window',
	mesh: 'Turn a mesh',
	reload: 'Save, reload in the game',
	pick: 'Pick a widget',
};

export interface DemoChapter {
	id: string;
	label: string;
	start: number;
}

// The demo loop's chapters with their labels, or undefined for a loop without chapters (a set
// from before the redesign). A chapter id without a label here fails the build (section 5.2).
export function demoChapters(loop: Loop | undefined): DemoChapter[] | undefined {
	if (!loop?.chapters) return undefined;
	return loop.chapters.map(({ id, start }) => {
		const label = CHAPTER_LABELS[id];
		if (!label) {
			throw new Error(
				`src/data/media.json: the demo loop's chapter "${id}" has no label in src/lib/content.ts (CHAPTER_LABELS)`,
			);
		}
		return { id, label, start };
	});
}

// "Pick mode, 8 s, silent.": the lead of a text description, the length from the manifest.
export function loopLead(text: LoopText, loop: Loop | undefined): string {
	return loop
		? `${text.title}, ${String(Math.round(loop.duration))} s, silent.`
		: `${text.title}, silent.`;
}

// What the Pause/Play and Enlarge buttons name for screen readers: "the pick mode loop", "the
// demo loop".
export function loopName(text: LoopText): string {
	const title = `${text.title.charAt(0).toLowerCase()}${text.title.slice(1)}`;
	return `the ${title.endsWith(' loop') ? title : `${title} loop`}`;
}

interface Feature extends LoopText {
	clip: ClipId;
	/** The short text beside the stage (section 3.2): what to do and what you see. */
	textHtml: string;
}

const SECTION_IDS = ['interface-windows', 'textures-and-meshes', 'live-game', 'scripts'] as const;
type SectionId = (typeof SECTION_IDS)[number];

interface FeatureSection {
	id: SectionId;
	/** The section's tile among the areas (section 3.1). */
	area: { files: string; name: string; lineHtml: string };
	eyebrow: string;
	title: string;
	sentenceHtml: string;
	/** Where the feature list sits beside the stage from 980 px (DESIGN.md, "Layout"). */
	listSide: 'left' | 'right';
	features: Feature[];
	/** A line under the player, with its link. */
	note?: { textHtml: string; link: { href: string; label: string } };
}

// The four feature sections (section 3.2), each feature's short text from its "Text (draft)"
// column. Every poster is its loop's first frame, the shot it also ends on (section 4.1).
//
// Text descriptions and posters' alts describe the loops as published now, Etch 2.13.0's set,
// written frame by frame. `outline` is still the loop from before the redesign (hovers and a
// click to the definition, no hiding by hand): the media refresh that publishes its re-shot loop
// (R6, section 10.1) replaces its description with section 3.2.1's and its alt. The clips not in
// that set yet (`mesh`, `entity`, `trees`, `texture`, `hovers`, `run`, `encoding`) carry the
// spec's draft descriptions and draft alts of their storyboards' first shots (section 8.5); they
// render only once a set has the clip, and that refresh checks them against its loops.
const SECTIONS: FeatureSection[] = [
	{
		id: 'interface-windows',
		area: {
			files: '.gui · .gfx · .yml',
			name: 'Interface windows',
			lineHtml: 'Edit a window, see it redraw at once.',
		},
		eyebrow: 'Interface windows',
		title: 'Edit a window. Watch it redraw.',
		sentenceHtml:
			"The preview draws the window your text cursor is in, with the game's own textures, fonts and localisation. It shows what you type before you save. The game doesn't need to run.",
		listSide: 'left',
		features: [
			{
				clip: 'preview',
				title: 'Preview as you type',
				textHtml:
					"Change a number in a <code>.gui</code> and the window redraws before you save. The preview also follows your edits to the mod's <code>.gfx</code> and localisation files.",
				descriptionHtml:
					"The code beside the preview's trade section. The trade node button's x position, 251, is retyped as 3, 30 and 300, unsaved, and the button with its outline jumps to each position at once. An undo returns it to 251.",
				posterAlt:
					"provinceview.gui with the trade node button's position selected, beside the trade section of Etch's preview of the province view.",
			},
			{
				clip: 'views',
				title: 'Views of a window',
				textHtml:
					'See the province view and other windows Etch knows as the game shows them in one situation: your own province or a foreign one, one side panel open. Switch in <strong>View ▾</strong>, or keep your own with <strong>Save as view…</strong>.',
				descriptionHtml:
					"<strong>View ▾</strong> beside Etch's preview of the province view. The menu lists the window's views; <strong>Foreign province</strong> is chosen and the window is drawn as a foreign province's, with a red banner, the owner's shield and Diplomacy. Then <strong>Own province</strong> is chosen again.",
				posterAlt:
					"The preview's View button, set to Own province, beside the upper half of Etch's preview of the province view.",
			},
			{
				clip: 'data',
				title: 'Sample data',
				textHtml:
					'Names, development and the other texts the game fills in show sample data. Choose it in <strong>Data ▾</strong>: from a save, from the running game (a live snapshot), or made-up text of the length you choose.',
				descriptionHtml:
					"<strong>Data ▾</strong> beside the province view's header, with sample data from a save of Russia in 1719. The menu lists where the sample data comes from, a higher source winning over a lower one; <strong>Province…</strong> picks Bali from the save, and the header redraws with its names, area, region, culture, religion and development. Then Kaluga is picked again.",
				posterAlt:
					"The preview's Data button, Kaluga from a 1719 save, beside the header of Etch's preview of the province view.",
			},
			{
				clip: 'outline',
				title: 'Widget Outline',
				textHtml:
					"The <strong>Widget Outline</strong> in the Explorer lists the window's widgets. Point at one in the preview for its path, kind and size; click it to jump to its line. In the outline, hide a widget or pick which tab or panel shows.",
				// The loop of Etch 2.13.0's set, from before the redesign (see above).
				descriptionHtml:
					"The pointer hovers a text, a button and an icon in Etch's preview, each outlined with a tooltip giving its path, kind, position and size. A click on the icon selects its definition in <code>provinceview.gui</code> and its row in the Widget Outline, both highlighted; <strong>Alt+Left Arrow</strong> returns the cursor where it was.",
				posterAlt: "Etch's preview of the province view close up, its demographics.",
			},
			{
				clip: 'problems',
				title: 'Problems as you type',
				textHtml:
					"Misspell a sprite's name and the Problems panel names it at once, while the rest of the window keeps drawing. Missing fonts and textures and duplicate names show up the same way.",
				descriptionHtml:
					"<code>provinceview.gui</code> above the Problems panel, the preview's buildings panel beside them. Two letters of a sprite name are swapped; Problems reports the missing sprite at once, and the panel's background is gone while the rest of the window still draws. An undo fixes it.",
				posterAlt:
					"A sprite's line of provinceview.gui above an empty Problems panel, beside the buildings panel of Etch's preview.",
			},
		],
	},
	{
		id: 'textures-and-meshes',
		area: {
			files: '.mesh · .anim · .asset · .dds',
			name: 'Textures and meshes',
			lineHtml: "Open the models and textures VS Code can't.",
		},
		eyebrow: 'Textures, meshes and animations',
		title: "Open the art VS Code can't.",
		sentenceHtml:
			"Models, entities and textures open in Etch's own previews. Models play their animations and are lit as the game lights them.",
		listSide: 'right',
		features: [
			{
				clip: 'mesh',
				title: 'Mesh preview',
				textHtml:
					"Open a <code>.mesh</code> and turn it in your hand, with its normal and specular maps under the game's light. Give it a country's colours or flag, and play the <code>.anim</code> files beside it.",
				descriptionHtml:
					"A ship's <code>.mesh</code> open in the Etch Mesh Preview, its shapes, vertices, triangles and bones in the bar above it. A drag turns the ship; <strong>Wire</strong> shows its triangles and goes off again. A country's tag typed in <strong>Flag</strong> puts that country's flag on the ship. Its idle animation is picked and <strong>Play</strong> rocks it. <strong>Reset view</strong> frames it again.",
				posterAlt: "A ship in Etch's Mesh Preview, the bar above it with its shapes, vertices, triangles and bones.",
			},
			{
				clip: 'entity',
				title: 'Entities',
				textHtml:
					'Click <strong>Preview entity</strong> above an <code>entity</code> in an <code>.asset</code> file and Etch builds the unit as the game does: attachments on their bones, playing its <code>idle</code>, <code>walk</code> and other states.',
				descriptionHtml:
					"A unit's <code>entity</code> in an <code>.asset</code> file, <strong>Preview entity</strong> above it. The preview builds the unit from its model with its attachments on their bones. The state list goes from <code>idle</code> to <code>walk</code> and the attachments move with their bones. The bar's first line, hovered, lists the attachments and their bones.",
				posterAlt: "A unit's entity in an .asset file, with Preview entity above it.",
			},
			{
				clip: 'trees',
				title: 'Map trees',
				textHtml:
					"Etch draws a map tree as the game does, with your map's tint and season colours. Set <strong>Date</strong> and <strong>Snow</strong>, or type a province ID in <strong>Place</strong> to see the tree as it looks there.",
				descriptionHtml:
					"A map tree's mesh in the Etch Mesh Preview. <strong>Date</strong> is moved through the year and the tree's season colour follows it; <strong>Snow</strong> goes from 0 to 1. A province ID typed in <strong>Place</strong> stands the tree there, and <strong>Ground</strong> and <strong>North</strong> follow the map.",
				posterAlt: "A map tree in Etch's Mesh Preview, the bar's tree controls above it.",
			},
			{
				clip: 'texture',
				title: 'Textures',
				textHtml:
					'<code>.dds</code> and <code>.tga</code> files open in a viewer with their format and mip levels. Look at the alpha alone or read the colour under the mouse; a new export shows up at once.',
				descriptionHtml:
					"A <code>.dds</code> texture in the Etch Texture Preview, its size, format and mip levels in the bar. <strong>A</strong> shows the alpha alone in grey, then <strong>RGBA</strong> again; <strong>Mip</strong> steps down the chain; the pointer rests on the image and the line at the bottom gives that pixel's colour.",
				posterAlt: "A .dds texture in Etch's Texture Preview, its size, format and mip levels in the bar above it.",
			},
			{
				clip: 'hovers',
				title: 'Hovers and links',
				textHtml:
					"Hover a sprite's name in a <code>.gui</code> to see it, and press <strong>F12</strong> to reach its <code>.gfx</code>. Hover a mesh path for a picture of the model. In <code>.gfx</code> and <code>.asset</code> files, <strong>Ctrl+click</strong> a texture, mesh or animation path to open it.",
				descriptionHtml:
					"A sprite's name hovered in <code>provinceview.gui</code> shows the sprite, its frames and the <code>.gfx</code> file that defines it; <strong>F12</strong> opens that file at the sprite. A mesh path hovered in a <code>.gfx</code> file shows a picture of the model with its counts; a <strong>Ctrl+click</strong> on a texture path opens the texture.",
				posterAlt: 'provinceview.gui in the editor, close up.',
			},
		],
	},
	{
		id: 'live-game',
		area: {
			files: 'the running game',
			name: 'The live game',
			lineHtml: 'Play your mod beside the editor.',
		},
		eyebrow: 'The live game',
		title: 'Play your mod beside the editor.',
		sentenceHtml:
			"Click <strong>Live game</strong> in the preview, and Etch starts EU4 with your playset (your mod and the mods it depends on), from its own copy of the game with its own settings and saves. You play it; Etch reloads what you save into the game's own windows.",
		listSide: 'left',
		features: [
			{
				clip: 'reload',
				title: 'Reload on save',
				textHtml:
					'Click <strong>Live game</strong> in the preview to start it. Save a file and the game reloads that window in place, with its real data. Some, such as <code>.gfx</code> files, need a restart: click <strong>Restart now</strong>.',
				descriptionHtml:
					"The trade node button's line in <code>provinceview.gui</code> beside the trade section of the live game's province view. One keystroke changes its x position from 251 to 151, and a save reloads the window in the game: the button moves left. An undo and a save move it back.",
				posterAlt:
					"provinceview.gui with the trade node button's position, beside the trade section of the live game's province view.",
			},
			{
				clip: 'pick',
				title: 'Pick mode',
				textHtml:
					'Press <strong>Ctrl+Shift+E</strong> in the game and point at a widget: Etch outlines it with its name, kind, size and file. Click it, and VS Code opens its definition.',
				descriptionHtml:
					"<strong>Ctrl+Shift+E</strong> turns on pick mode in the game. The pointer hovers the owner's shield, the trade post button and the trade node button in the province view, and pick mode outlines each with its name, kind, size and file. A click on the trade node button opens its definition in VS Code, and the game does not take the click.",
				posterAlt:
					"The lower half of the live game's province view, pick mode outlining the owner's shield in its trade section with its name, kind, size and file.",
			},
			{
				clip: 'snapshot',
				title: 'Live snapshot',
				textHtml:
					"A pick also takes from the game the window's texts and which of its parts are shown, and the preview uses them in place of sample data.",
				descriptionHtml:
					"The military and trade rows of Etch's preview beside the same rows of the live game. Most of the preview's values are generated (12.3); a pick in the game takes a live snapshot, and the preview redraws with the game's own manpower, supply limit, sailors, trade value and goods produced.",
				posterAlt:
					"The military and trade rows of Etch's preview, beside the same rows of the live game's province view.",
			},
			{
				clip: 'run',
				title: 'Run selection',
				textHtml:
					"Select an effect and right-click to run it in your country or the province you have open, or check whether a trigger is true. The game's errors show in the Problems panel; your saves stay untouched.",
				descriptionHtml:
					"An effect selected in the event file of Etch's demo mod, the live game's province view beside it. <strong>Etch: Run Selection in the Province on Screen</strong> raises the province's development in the game. <strong>Etch: Check Selection as Trigger in the Live Game</strong> gives its answer beside the selected trigger. A misspelt effect is run, and the game's error appears in the Problems panel, on the selection.",
				posterAlt:
					"The demo mod's event file beside the live game's province view with the province's development.",
			},
		],
		note: {
			textHtml:
				'The live game never writes to your game folder, your EU4 profile (the folder, usually in Documents, where EU4 keeps settings, saves and mods) or your mods, and never changes <code>eu4.exe</code>. Reloading and running selected script do not work in ironman or multiplayer games.',
			link: { href: ANVIL_URL, label: 'Built on Anvil, the plugin loader for EU4' },
		},
	},
	{
		id: 'scripts',
		area: {
			files: 'common · events · history',
			name: 'Scripts',
			lineHtml: "Catch the mistakes <code>error.log</code> doesn't show.",
		},
		eyebrow: 'Scripts',
		title: "Catch what the game won't tell you.",
		sentenceHtml:
			'Etch warns about mistakes the game lets through without a line in <code>error.log</code>, and shows how long your own scripts take.',
		listSide: 'right',
		features: [
			{
				clip: 'names',
				title: 'Province IDs and names',
				textHtml:
					"A province ID the map doesn't have, or an idea group the playset doesn't define, gets no line in <code>error.log</code> and can crash the game. Etch warns as you type; <strong>Etch: Check Province IDs and Names in the Playset</strong> checks every script file.",
				descriptionHtml:
					"In an event of Etch's demo mod, a 5 typed before province 151 makes it 5151, and Problems warns at once that the map has no such province. An s turns the idea group <code>economic_ideas</code> into <code>economics_ideas</code>, and a second warning says the playset has no such idea group. Two undos take them away one at a time.",
				posterAlt: 'An event of the demo mod above an empty Problems panel.',
			},
			{
				clip: 'encoding',
				title: 'Encoding',
				textHtml:
					"Typed an <code>é</code> into a leader's name, in a file the game reads as Windows-1252? Etch warns before the game shows <code>Ã©</code>. Press <strong>Ctrl+.</strong>, choose <strong>Save with Encoding…</strong> and pick the encoding the game expects.",
				descriptionHtml:
					"A ruler's name in the event file of Etch's demo mod above Problems. An é typed into it brings Etch's warning at once: the game would show Ã©. <strong>Ctrl+.</strong> offers the quick fix <strong>Save with Encoding…</strong>; Windows 1252 is picked in VS Code's list, and the warning is gone.",
				posterAlt: "A ruler's name in the demo mod's event file above an empty Problems panel.",
			},
			{
				clip: 'profile',
				title: 'Script profile',
				textHtml:
					"With Anvil 1.22 or newer, its script profiler times your events, decisions and other scripts in your own game. <strong>Etch: Show Latest Script Profile</strong> lists the slowest, and shows each block's time and calls on a line above it, without changing your files.",
				descriptionHtml:
					"The page that <strong>Etch: Show Latest Script Profile</strong> opens, with a profile Anvil's profiler measured in the base game, the slowest rows first. A click on a decision's name opens its file at the measured block, with the profile's time and calls on a line above it; <strong>Ctrl+W</strong> returns to the page.",
				posterAlt:
					"The table of Etch's script profile page: owners, names, roles, calls and times.",
			},
		],
	},
];

type ShownFeature = Feature & { loop: Loop };
export type ShownSection = Omit<FeatureSection, 'features'> & { features: ShownFeature[] };

// The sections the page shows with the media it has: a feature whose clip the manifest lacks is
// left out of its section, and a section with no clip is left out of the page and of the areas
// (section 3.2), so the page never shows an empty stage.
export function shownSections(loops: Media['loops'] | undefined): ShownSection[] {
	return SECTIONS.flatMap((section) => {
		const features = section.features.flatMap((feature) => {
			const loop = loops?.[feature.clip];
			return loop ? [{ ...feature, loop }] : [];
		});
		return features.length > 0 ? [{ ...section, features }] : [];
	});
}

// The proof band (section 3.3): each fact links to the docs page with its source and conditions.
export const PROOF = [
	{
		fact: '7 resolutions',
		line: 'from 1280×720 to 3440×1440, compared with the game on vanilla, Anbennar and Proper 2K UI Enhanced.',
		href: docsUrl('about/accuracy'),
	},
	{
		fact: '10–13 ms',
		line: 'to redraw the province view after an edit; half of the redraws were faster.',
		href: docsUrl('about/accuracy'),
	},
	{
		fact: '0 game files',
		line: 'in the extension. Etch draws with your own copy of the game and sends nothing anywhere.',
		href: docsUrl('about/reads-and-writes'),
	},
];

// The closing call (section 3.1).
export const CLOSING = {
	title: 'Open your mod in VS Code with Etch.',
	textHtml: `Free and open source. Report a bug or ask a question in Etch's <a href="${ISSUES_URL}">issue tracker on GitHub</a>, or in <strong>#help-and-bugs</strong> on the Happy Dwarf Discord.`,
};

// The extension's status and the What's new pill's data, from src/data/status.yaml (section 3.1).
export async function getStatus() {
	const entry = await getEntry('status', 'extension');
	if (!entry) throw new Error('src/data/status.yaml has no `extension` entry');
	const { status, whatsNew } = entry.data;
	if (whatsNew && !(SECTION_IDS as readonly string[]).includes(whatsNew.target)) {
		throw new Error(
			`src/data/status.yaml: whatsNew.target "${whatsNew.target}" is not a feature section (${SECTION_IDS.join(', ')})`,
		);
	}
	return { status, whatsNew: whatsNew && { ...whatsNew, target: whatsNew.target as SectionId } };
}

interface WhatsNewPill {
	version: string;
	line: string;
	href: string;
	/** The section the pill links to, whose area tile is marked "new"; undefined when it is left out. */
	target?: SectionId;
}

// The What's new pill (section 3.1), shown only while its version is the latest release's major
// and minor, and hidden when the release could not be fetched. It links to its target section,
// or to the release's notes while that section is left out of the page.
export async function getWhatsNewPill(sections: ShownSection[]): Promise<WhatsNewPill | undefined> {
	const { whatsNew } = await getStatus();
	const latest = await getLatestVersion();
	if (!whatsNew || !latest) return undefined;
	if (latest.split('.').slice(0, 2).join('.') !== whatsNew.version) return undefined;
	const shown = sections.some((s) => s.id === whatsNew.target);
	return {
		version: whatsNew.version,
		line: whatsNew.line,
		href: shown ? `#${whatsNew.target}` : `${REPO_URL}/releases/tag/v${whatsNew.version}.0`,
		target: shown ? whatsNew.target : undefined,
	};
}
