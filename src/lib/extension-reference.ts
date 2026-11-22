// The generated part of the Commands and Settings pages (docs/spec.md, section 3.4.1): every
// command's title and every setting's name, description and default, from `contributes` of
// etch's packages/extension/package.json at the same source as the pages, so they always match
// the extension. The docs loader puts each list after its page's hand-written introduction.
// Plain Node, no Astro imports.

interface Command {
	command: string;
	title: string;
	category?: string;
}

interface Setting {
	description?: string;
	markdownDescription?: string;
	default?: unknown;
	enum?: unknown[];
	scope?: string;
}

interface Configuration {
	properties?: Record<string, Setting>;
}

export interface ExtensionManifest {
	contributes?: {
		commands?: Command[];
		menus?: { commandPalette?: { command: string; when?: string }[] };
		configuration?: Configuration | Configuration[];
	};
}

// Plain text in a table cell: Markdown's own characters escaped.
const text = (s: string) => s.replace(/[\\`*_[\]<>|]/g, (c) => `\\${c}`);
// Markdown from package.json in a table cell: on one line, its pipes escaped.
const cell = (s: string) => s.replace(/\s*\n\s*/g, ' ').replace(/\|/g, '\\|');
const code = (s: string) => `\`${s.replace(/`/g, "'")}\``;

/** Every command, by its title as the Command Palette writes it, and whether the palette lists it. */
export function commandsMarkdown(manifest: ExtensionManifest): string {
	const commands = manifest.contributes?.commands ?? [];
	if (!commands.length) throw new Error('packages/extension/package.json has no contributes.commands');
	// A command whose palette entry is `when: false` runs only from its button or menu.
	const hidden = new Set(
		(manifest.contributes?.menus?.commandPalette ?? [])
			.filter(({ when }) => when?.trim() === 'false')
			.map(({ command }) => command),
	);
	const rows = commands
		.map(({ command, title, category }) => ({
			title: category ? `${category}: ${title}` : title,
			inPalette: hidden.has(command) ? 'No' : 'Yes',
		}))
		.sort((a, b) => a.title.localeCompare(b.title, 'en'));
	return [
		'## Every command',
		'',
		'| Command | In the Command Palette |',
		'| --- | --- |',
		...rows.map(({ title, inPalette }) => `| **${text(title)}** | ${inPalette} |`),
	].join('\n');
}

function defaultValue(value: unknown): string {
	if (value === undefined) return 'None';
	if (value === '') return 'Empty';
	if (Array.isArray(value) && value.length === 0) return 'Empty list';
	return code(typeof value === 'string' ? value : JSON.stringify(value));
}

function list(values: string[]): string {
	return values.length > 1 ? `${values.slice(0, -1).join(', ')} or ${values[values.length - 1]}` : values.join('');
}

/** Every setting, in package.json's order: its name, what it does and its default. */
export function settingsMarkdown(manifest: ExtensionManifest): string {
	const configuration = manifest.contributes?.configuration;
	const sections = Array.isArray(configuration) ? configuration : configuration ? [configuration] : [];
	const settings = sections.flatMap(({ properties }) => Object.entries(properties ?? {}));
	if (!settings.length) throw new Error('packages/extension/package.json has no contributes.configuration');
	const rows = settings.map(([name, setting]) => {
		const parts = [setting.markdownDescription ?? text(setting.description ?? '')];
		if (setting.enum?.length) parts.push(`One of ${list(setting.enum.map((v) => code(String(v))))}.`);
		// VS Code keeps these scopes out of a folder's Workspace settings.
		if (setting.scope === 'machine' || setting.scope === 'application') parts.push('Only in **User** settings.');
		return `| ${code(name)} | ${cell(parts.filter(Boolean).join(' '))} | ${defaultValue(setting.default)} |`;
	});
	return ['## Every setting', '', '| Setting | What it does | Default |', '| --- | --- | --- |', ...rows].join('\n');
}
