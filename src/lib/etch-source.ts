// The etch files the docs are built from (docs/spec.md, section 3.4.1): `docs/user/`,
// `packages/extension/package.json` and `CHANGELOG.md`, at the latest release's tag, checked out
// sparse into the git-ignored `.etch-source/`; or the local etch checkout `ETCH_SOURCE` names,
// for development. Unlike the badge's version, the docs have no fallback: without these files
// the build fails, with a message that says why.
//
// Plain Node, no Astro imports: the integration (src/integrations/etch-docs.ts) prepares the
// source when the config is set up, and the docs loader (src/lib/etch-docs-loader.ts) reads it.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ETCH_REPO, fetchLatestRelease } from './release';

/** Where the build checks etch out when ETCH_SOURCE is not set; listed in .gitignore. */
export const CHECKOUT_DIR = '.etch-source';
/** The files the site reads, as sparse-checkout patterns. */
const SPARSE_PATTERNS = ['/docs/user/', '/packages/extension/package.json', '/CHANGELOG.md'];
const EDIT_BASE = `https://github.com/${ETCH_REPO}/edit/main/docs/user`;

/** A problem with the source of the docs; its message is meant for the person running the build. */
export class EtchSourceError extends Error {
	constructor(message: string) {
		super(`[etch-docs] ${message}`);
		this.name = 'EtchSourceError';
	}
}

export interface EtchSource {
	/** The checkout's root, absolute. */
	dir: string;
	/** `docs/user/` in it, absolute. */
	docsDir: string;
	/** What the files are, for the log and for messages: "etch v2.13.0" or "ETCH_SOURCE (<dir>)". */
	label: string;
}

function sourceDir(root: URL): string {
	const local = process.env.ETCH_SOURCE;
	return local ? resolve(fileURLToPath(root), local) : join(fileURLToPath(root), CHECKOUT_DIR);
}

function sourceLabel(dir: string): string {
	return process.env.ETCH_SOURCE ? `ETCH_SOURCE (${dir})` : `etch at ${checkedOutTag(dir) ?? 'an unknown tag'}`;
}

const HOW_TO_FIX =
	'The docs are built from the latest etch release (docs/spec.md, section 3.4.1) and have no fallback. ' +
	'Set ETCH_SOURCE to a local etch checkout with docs/user/ to build from it.';

// Every file the site reads must be there; docs/user/ missing gets its own message, since a
// release from before the user docs has none.
function checkFiles(dir: string, label: string): void {
	if (!existsSync(join(dir, 'docs', 'user'))) {
		throw new EtchSourceError(`${label} has no docs/user/, so there are no docs pages to build. ${HOW_TO_FIX}`);
	}
	const missing = ['docs/user/README.md', 'packages/extension/package.json', 'CHANGELOG.md'].filter(
		(file) => !existsSync(join(dir, file)),
	);
	if (missing.length) {
		throw new EtchSourceError(`${label} lacks ${missing.join(', ')}, which the docs are built from. ${HOW_TO_FIX}`);
	}
}

function git(args: string[]): string {
	return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function checkedOutTag(dir: string): string | undefined {
	if (!existsSync(join(dir, '.git'))) return undefined;
	try {
		return git(['-C', dir, 'describe', '--tags', '--exact-match', 'HEAD']);
	} catch {
		return undefined;
	}
}

// A shallow, blob-less clone of etch at the tag, with only the files the site reads.
function checkOut(dir: string, tag: string): void {
	rmSync(dir, { recursive: true, force: true });
	try {
		git([
			'clone',
			'--quiet',
			'--depth=1',
			'--filter=blob:none',
			'--no-checkout',
			`--branch=${tag}`,
			`https://github.com/${ETCH_REPO}.git`,
			dir,
		]);
		git(['-C', dir, 'sparse-checkout', 'set', '--no-cone', ...SPARSE_PATTERNS]);
		git(['-C', dir, 'checkout', '--quiet']);
	} catch (error) {
		const detail = (error as { stderr?: string }).stderr?.trim() || String(error);
		throw new EtchSourceError(`could not check out ${ETCH_REPO} at ${tag}: ${detail}. ${HOW_TO_FIX}`);
	}
}

/**
 * Makes the source ready: checks the files ETCH_SOURCE names, or checks out etch at its latest
 * release's tag into .etch-source/ (kept between builds while the tag stays the same). Throws an
 * EtchSourceError when that is impossible.
 */
export async function prepareEtchSource(root: URL): Promise<EtchSource> {
	const dir = sourceDir(root);
	if (process.env.ETCH_SOURCE) {
		const label = `ETCH_SOURCE (${dir})`;
		if (!existsSync(dir)) throw new EtchSourceError(`${label} does not exist.`);
		checkFiles(dir, label);
		return { dir, docsDir: join(dir, 'docs', 'user'), label };
	}
	const release = await fetchLatestRelease();
	if ('error' in release) {
		throw new EtchSourceError(`could not find the latest ${ETCH_REPO} release: ${release.error}. ${HOW_TO_FIX}`);
	}
	if (checkedOutTag(dir) !== release.tag) checkOut(dir, release.tag);
	const label = `etch ${release.tag}, the latest release,`;
	checkFiles(dir, label);
	return { dir, docsDir: join(dir, 'docs', 'user'), label: `etch ${release.tag}` };
}

/** The source as prepareEtchSource() left it, read again without the network (the docs loader). */
export function openEtchSource(root: URL): EtchSource {
	const dir = sourceDir(root);
	const label = sourceLabel(dir);
	checkFiles(dir, label);
	return { dir, docsDir: join(dir, 'docs', 'user'), label };
}

export interface DocsPage {
	/** The page's path in docs/user/ without `.md`, e.g. `live-game/pick-mode`; its route is /docs/<id>/. */
	id: string;
	/** The Markdown file, absolute. */
	file: string;
	/** Its file on etch's main, for "Edit this page". */
	editUrl: string;
}

export interface DocsGroup {
	/** The group's name in the sidebar and the breadcrumb, from docs/user/README.md. */
	label: string;
	pages: DocsPage[];
}

// Files whose names are in capitals (README.md, STYLE.md) are not pages (etch's docs/user/STYLE.md).
const isPageFile = (name: string) => {
	const stem = name.replace(/\.md$/, '');
	return stem !== name && stem !== stem.toUpperCase();
};

/**
 * The sidebar's groups and pages in order, from the index in docs/user/README.md: one list item a
 * group, `- **<Group>**: [Page](<folder>/<page>.md) · …`, a folder a group. Every page file must be
 * in the index and every page of the index must exist, or the build fails.
 */
export function readDocsIndex(docsDir: string): DocsGroup[] {
	const readme = readFileSync(join(docsDir, 'README.md'), 'utf8');
	// List items with their indented continuation lines; any other line ends an item.
	const items: string[] = [];
	let open = false;
	for (const line of readme.split(/\r?\n/)) {
		if (/^- \*\*/.test(line)) {
			items.push(line);
			open = true;
		} else if (open && /^\s+\S/.test(line)) {
			items[items.length - 1] += ` ${line.trim()}`;
		} else {
			open = false;
		}
	}
	const problems: string[] = [];
	const listed = new Set<string>();
	const groups: DocsGroup[] = [];
	for (const item of items) {
		const head = /^- \*\*(.+?)\*\*:/.exec(item);
		if (!head) continue;
		const pages: DocsPage[] = [];
		for (const [, target] of item.matchAll(/\]\(([^)#\s]+)\.md\)/g)) {
			if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(target)) {
				problems.push(`README.md: "${target}.md" in ${head[1]} is not <folder>/<page>.md`);
				continue;
			}
			const file = join(docsDir, `${target}.md`);
			if (!existsSync(file)) problems.push(`README.md lists ${target}.md, which does not exist`);
			if (listed.has(target)) problems.push(`README.md lists ${target}.md twice`);
			listed.add(target);
			pages.push({ id: target, file, editUrl: `${EDIT_BASE}/${target}.md` });
		}
		const folders = new Set(pages.map(({ id }) => id.split('/')[0]));
		if (folders.size > 1) problems.push(`README.md: the group ${head[1]} mixes the folders ${[...folders].join(', ')}`);
		if (pages.length) groups.push({ label: head[1], pages });
	}
	for (const folder of readdirSync(docsDir)) {
		const path = join(docsDir, folder);
		if (!statSync(path).isDirectory()) {
			if (isPageFile(folder)) problems.push(`${folder} is not in a group's folder`);
			continue;
		}
		for (const name of readdirSync(path).filter(isPageFile)) {
			const id = `${folder}/${name.replace(/\.md$/, '')}`;
			if (!listed.has(id)) problems.push(`${id}.md is not in README.md's index, so the sidebar has no place for it`);
		}
	}
	if (!groups.length) problems.push('README.md has no index of groups and pages');
	if (problems.length) {
		throw new EtchSourceError(`docs/user/ does not match its index:\n  ${problems.join('\n  ')}`);
	}
	return groups;
}
