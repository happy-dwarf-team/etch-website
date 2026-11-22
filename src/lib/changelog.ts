// The changelog page (docs/spec.md, section 3.5), built from etch's CHANGELOG.md as
// release-please writes it: newest release first, the newest open and marked Latest, the older
// ones folded in <details>; a paragraph before a release's first group shown as "In short";
// the groups under plain names (Features → New, Bug Fixes → Fixed, Build → Updated; Reverts and
// any other group left out); inside a group, the entries by area from their Conventional
// Commits scope, without the scope; commit hashes dropped, issue links kept. Plain Node, no
// Astro imports: the docs loader renders the Markdown this returns.

/** A release's id on the changelog page, `v2-13-0`: the TOC, "Since" and the What's new pill link to it. */
export function releaseId(version: string): string {
	return `v${version.replace(/[^0-9A-Za-z]+/g, '-')}`;
}

interface Release {
	version: string;
	/** YYYY-MM-DD, when the heading has one. */
	date?: string;
	/** Paragraphs before the first group, as Markdown. */
	intro: string[];
	groups: { name: string; entries: string[] }[];
}

// "## [2.13.0](https://…/compare/v2.12.0...v2.13.0) (2026-11-20)" or "## 0.1.0 (2026-10-21)".
const RELEASE_HEADING = /^## (?:\[([^\]]+)\]\([^)]*\)|(\S+))(?:\s+\((\d{4}-\d{2}-\d{2})\))?\s*$/;

function parse(markdown: string): Release[] {
	const releases: Release[] = [];
	let release: Release | undefined;
	let group: Release['groups'][number] | undefined;
	// What the next indented line continues: the last entry, or the last intro paragraph.
	let open: 'entry' | 'intro' | undefined;
	for (const line of markdown.split(/\r?\n/)) {
		const heading = RELEASE_HEADING.exec(line);
		if (heading) {
			release = { version: heading[1] ?? heading[2], date: heading[3], intro: [], groups: [] };
			releases.push(release);
			group = undefined;
			open = undefined;
		} else if (!release) {
			continue;
		} else if (line.startsWith('### ')) {
			group = { name: line.slice(4).trim(), entries: [] };
			release.groups.push(group);
			open = undefined;
		} else if (group && /^[*-] /.test(line)) {
			group.entries.push(line.slice(2).trim());
			open = 'entry';
		} else if (line.trim() === '') {
			open = undefined;
		} else if (group && open === 'entry') {
			group.entries[group.entries.length - 1] += ` ${line.trim()}`;
		} else if (!group) {
			if (open === 'intro') release.intro[release.intro.length - 1] += ` ${line.trim()}`;
			else release.intro.push(line.trim());
			open = 'intro';
		}
	}
	return releases;
}

const GROUPS: Record<string, string> = { Features: 'New', 'Bug Fixes': 'Fixed', Build: 'Updated' };

// Areas in the order the page shows them; a scope not listed, and no scope, is the Editor.
const AREAS: { name: string; scopes: string[] }[] = [
	{ name: 'Textures and meshes', scopes: ['mesh', 'asset', 'entity'] },
	{ name: 'The live game', scopes: ['live-game', 'plugin'] },
	{ name: 'Checks', scopes: ['core'] },
	{ name: 'Script profile', scopes: ['profile'] },
	{ name: 'Bundled plugins', scopes: ['pins'] },
	{ name: 'Editor', scopes: [] },
];

function areaOf(scope: string | undefined): string {
	return AREAS.find(({ scopes }) => scope && scopes.includes(scope))?.name ?? 'Editor';
}

// "**core:** check … ([#470](…/issues/470)) ([848b14d](…/commit/848b14d…))" → its scope and
// "Check … ([#470](…/issues/470))".
function entry(markdown: string): { scope?: string; text: string } {
	const scoped = /^\*\*([^*:]+):\*\*\s*/.exec(markdown);
	const text = (scoped ? markdown.slice(scoped[0].length) : markdown)
		.replace(/\s*\(\[[0-9a-f]{7,40}\]\([^)]*\/commit\/[0-9a-f]+\)\)/g, '')
		.replace(/^[a-z]/, (c) => c.toUpperCase());
	return { scope: scoped?.[1].trim(), text };
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	timeZone: 'UTC',
});

export interface ChangelogPage {
	markdown: string;
	/** The page's table of contents: one entry a release. */
	headings: { depth: number; slug: string; text: string }[];
}

/** The changelog page's body as Markdown with <details> blocks, and its table of contents. */
export function changelogPage(changelog: string): ChangelogPage {
	const releases = parse(changelog);
	if (!releases.length) throw new Error('CHANGELOG.md has no release headings ("## [x.y.z](…) (date)")');
	const blocks = releases.map((release, i) => {
		const id = releaseId(release.version);
		const date = release.date
			? `<time datetime="${release.date}">${dateFormat.format(new Date(`${release.date}T00:00:00Z`))}</time>`
			: '';
		const latest = i === 0 ? '<span class="latest">Latest</span>' : '';
		const lines = [
			`<details class="release"${i === 0 ? ' open' : ''}>`,
			`<summary><h2 id="${id}">${release.version}</h2>${date}${latest}</summary>`,
			'',
		];
		if (release.intro.length) lines.push('### In short', '', ...release.intro.flatMap((p) => [p, '']));
		let shown = 0;
		for (const [from, name] of Object.entries(GROUPS)) {
			const entries = release.groups.filter((g) => g.name === from).flatMap((g) => g.entries.map(entry));
			if (!entries.length) continue;
			shown += entries.length;
			lines.push(`### ${name}`, '');
			for (const area of AREAS) {
				const inArea = entries.filter(({ scope }) => areaOf(scope) === area.name);
				if (!inArea.length) continue;
				lines.push(`#### ${area.name}`, '', ...inArea.map(({ text }) => `- ${text}`), '');
			}
		}
		if (!shown && !release.intro.length) {
			lines.push('No new features, fixes or updated plugins in this release.', '');
		}
		lines.push('</details>', '');
		return lines.join('\n');
	});
	return {
		markdown: blocks.join('\n'),
		headings: releases.map(({ version }) => ({ depth: 2, slug: releaseId(version), text: version })),
	};
}
