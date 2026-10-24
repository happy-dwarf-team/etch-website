// The home page's editorial content: links, the six features with their stills' captions and
// alts, the demo loop's description and the roadmap lines (docs/spec.md, sections 3 and 4).
// The media manifest carries only facts about files; everything said about them is here.
// Strings marked `html` hold inline markup (`code`, links) and are rendered with set:html.
import { getEntry } from 'astro:content';
import type { MediaManifest } from './media-manifest';
import { ETCH_REPO } from './release';

export const REPO_URL = `https://github.com/${ETCH_REPO}`;
export const MARKETPLACE_URL =
	'https://marketplace.visualstudio.com/items?itemName=happy-dwarf-team.etch';
export const OPEN_VSX_URL = 'https://open-vsx.org/extension/happy-dwarf-team/etch';
export const README_URL = `${REPO_URL}/blob/main/packages/extension/README.md`;
export const V1_SPEC_URL = `${REPO_URL}/blob/main/docs/spec/v1.md`;
export const INSTALL_COMMAND = 'code --install-extension happy-dwarf-team.etch';

export const REQUIREMENTS = ['Windows x64', 'VS Code 1.100+', 'EU4 1.37.5 (Steam)', 'No telemetry'];

export const LOOP = {
	lead: 'Demo loop, 10 s, silent.',
	descriptionHtml:
		"In VS Code, <code>etch_demo.gui</code> is open beside Etch's preview of a game dialog. One keystroke widens the dialog's background and the frame redraws at once; the cursor moves to a button, the outline follows it, and a second keystroke moves the button into the new space. Two undos return the window to where it started.",
	posterAlt:
		"VS Code with etch_demo.gui on the left and Etch's preview of a game dialog on the right.",
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
			'Edit the <code>.gui</code> and the window redraws from the unsaved buffer; the widget at the cursor stays outlined.',
		alt: "VS Code with an unsaved etch_demo.gui on the left and Etch's preview on the right: a widened game dialog with one button outlined.",
	},
	{
		scene: 'pin',
		title: 'The window under the cursor',
		textHtml:
			'The preview shows the top-level window that holds the cursor. <strong>Pin</strong> keeps it on one window while you edit other files.',
		captionHtml:
			'Pinned to the dialog while a <code>.gfx</code> file is edited: the preview keeps the window and shows the new button sprite.',
		alt: "VS Code with etch_demo.gfx open and Pin pressed in Etch's preview toolbar; the dialog's button shows a different sprite.",
	},
	{
		scene: 'outline',
		title: 'Widget outline and jump to source',
		textHtml:
			"The Widget Outline lists the window's widgets. Click a widget in the preview to reveal its source; hover to see its path and rect.",
		captionHtml:
			"The Widget Outline lists the window's widgets; clicking one in the preview selects its source, hovering shows its path and rect.",
		alt: "VS Code with the Widget Outline in the sidebar, a widget selected in the editor, and a dashed hover box with a tooltip in Etch's preview.",
	},
	{
		scene: 'problems',
		title: 'Diagnostics in Problems',
		textHtml:
			"Missing sprites, fonts and textures, duplicate names and more appear in VS Code's Problems panel as you edit.",
		captionHtml:
			'A misspelled sprite name is reported in Problems while the rest of the window still draws.',
		alt: 'VS Code with a squiggle under a sprite name, one Etch warning in the Problems panel, and the dialog drawn without that widget.',
	},
	{
		scene: 'resolution',
		title: 'Any resolution',
		textHtml:
			"The game's <code>settings.txt</code>, the monitor's, a corpus resolution from 1280×720 to 3440×1440 or any width × height. <code>if_resolution</code> blocks follow it.",
		captionHtml:
			"Pick the preview resolution: the game's settings, the monitor's, a corpus resolution or any width × height; <code>if_resolution</code> blocks follow it.",
		alt: "VS Code with Etch's resolution picker open over an if_resolution block, listing default, native and the corpus resolutions.",
	},
	{
		scene: 'playset',
		title: "Your playset, the game's own art",
		textHtml:
			'Etch finds the game through Steam and draws with its textures, fonts and localisation. It ships none of them and sends nothing anywhere.',
		captionHtml:
			"The demo mod holds only text files; Etch draws its localised title, colours and icons with the game's own fonts and textures.",
		alt: "VS Code's Explorer showing a mod of .gui, .gfx, .yml and descriptor files, an unsaved localisation edit, and the retitled dialog in the preview.",
	},
];

// What the released version does not do yet (section 3.3), following the extension README.
export const LIMITS = [
	"A layout preview: content the game's code fills in (lists, flags, values) is not shown.",
	"Preview only: you edit in VS Code's own text editor, not in the preview.",
	'Windows (x64), VS Code 1.100+, EU4 1.37.5 from Steam.',
];

export type MilestoneId = 'M0' | 'M1' | 'M2' | 'M3' | 'M4' | '1.0';
export type MilestoneState = 'done' | 'current' | 'next';

// One line each from etch's v1 specification, section 11 (section 3.5).
const MILESTONES: { id: MilestoneId; name: string; version?: string; line: string }[] = [
	{ id: 'M0', name: 'Foundation', line: 'Public repository, CI, release-please, packaged VSIX.' },
	{
		id: 'M1',
		name: 'Offline preview',
		version: '0.1.0',
		line: 'Released on the Marketplace and Open VSX, marked preview. Everything on this page.',
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
		line: 'Diff view between the two backends; Anbennar and Dwarven Knowledge.',
	},
	{
		id: '1.0',
		name: 'Release',
		version: '1.0.0',
		line: 'When the release criteria hold; the preview flag goes.',
	},
];

// The extension's status and the roadmap with each milestone's state, from src/data/status.yaml.
export async function getStatus() {
	const entry = await getEntry('status', 'extension');
	if (!entry) throw new Error('src/data/status.yaml has no `extension` entry');
	const { status, milestones } = entry.data;
	return {
		status,
		roadmap: MILESTONES.map((m) => ({ ...m, state: milestones[m.id] as MilestoneState })),
	};
}
