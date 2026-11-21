// The docs collection's loader (docs/spec.md, sections 3.4 and 3.5): every page of etch's
// docs/user/ in the order of its README.md index, and the changelog page from its CHANGELOG.md,
// rendered with the site's Markdown pipeline. Relative links between pages become the site's
// routes, keeping their #anchors; the Commands and Settings pages get their generated lists after
// their introductions; every page gets "Edit this page" to its file on etch's main. The source
// is the one src/integrations/etch-docs.ts prepared; a problem in it fails the build.
import type { Loader } from 'astro/loaders';
import { readFileSync } from 'node:fs';
import { join, posix } from 'node:path';
import { pathToFileURL } from 'node:url';
import { changelogPage } from './changelog';
import { EtchSourceError, openEtchSource, readDocsIndex, type DocsPage } from './etch-source';
import { commandsMarkdown, settingsMarkdown, type ExtensionManifest } from './extension-reference';
import { ETCH_REPO } from './release';

/** The changelog page's id in the collection, so its route is /docs/changelog/. */
export const CHANGELOG_ID = 'docs/changelog';
const CHANGELOG_ON_GITHUB = `https://github.com/${ETCH_REPO}/blob/main/CHANGELOG.md`;

// The reference pages whose list of every command or setting the site generates: the sentence
// their introduction ends with, and the list that follows it.
const GENERATED: Record<string, { sentence: string; markdown: (m: ExtensionManifest) => string }> = {
	'reference/commands': { sentence: 'The list of every Etch command follows.', markdown: commandsMarkdown },
	'reference/settings': { sentence: 'The list of every Etch setting follows.', markdown: settingsMarkdown },
};

function insertAfter(markdown: string, page: DocsPage, sentence: string, addition: string): string {
	const lines = markdown.split(/\r?\n/);
	const at = lines.findIndex((line) => line.trim() === sentence);
	if (at < 0) {
		throw new EtchSourceError(
			`docs/user/${page.id}.md has no line "${sentence}", after which the site puts its generated list (docs/spec.md, section 3.4.1).`,
		);
	}
	lines.splice(at + 1, 0, '', addition, '');
	return lines.join('\n');
}

// Relative links to other pages (`../live-game/pick-mode.md#pick-a-widget`) become the site's
// routes; a link to etch's CHANGELOG.md becomes the changelog page. Any other relative link
// points at a file the site does not have, which STYLE.md says to link on GitHub instead.
function rewriteLinks(html: string, page: DocsPage, pages: Set<string>, base: string, problems: string[]): string {
	return html.replace(/(\shref=")([^"]*)"/g, (match, attr: string, href: string) => {
		const value = href.replaceAll('&amp;', '&');
		if (value === CHANGELOG_ON_GITHUB || value.startsWith(`${CHANGELOG_ON_GITHUB}#`)) {
			return `${attr}${base}docs/changelog/"`;
		}
		if (/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(value)) return match;
		const hash = value.indexOf('#');
		const path = hash < 0 ? value : value.slice(0, hash);
		const fragment = hash < 0 ? '' : value.slice(hash);
		const target = posix.normalize(posix.join(posix.dirname(page.id), path)).replace(/\.md$/, '');
		if (target === '../CHANGELOG') return `${attr}${base}docs/changelog/"`;
		if (!path.endsWith('.md') || !pages.has(target)) {
			problems.push(`${page.id}.md links to ${value}, which is not a docs page; link other files on GitHub`);
			return match;
		}
		return `${attr}${base}docs/${target}/${fragment}"`;
	});
}

export function etchDocsLoader(): Loader {
	return {
		name: 'etch-docs',
		async load({ config, store, parseData, renderMarkdown, generateDigest, logger }) {
			const source = openEtchSource(config.root);
			const groups = readDocsIndex(source.docsDir);
			const manifest = JSON.parse(
				readFileSync(join(source.dir, 'packages', 'extension', 'package.json'), 'utf8'),
			) as ExtensionManifest;
			const base = config.base.replace(/\/?$/, '/');
			const all = groups.flatMap(({ pages }) => pages);
			const ids = new Set(all.map(({ id }) => id));
			const problems: string[] = [];

			store.clear();
			for (const page of all) {
				let markdown = readFileSync(page.file, 'utf8');
				const generated = GENERATED[page.id];
				if (generated) markdown = insertAfter(markdown, page, generated.sentence, generated.markdown(manifest));
				const rendered = await renderMarkdown(markdown, { fileURL: pathToFileURL(page.file) });
				rendered.html = rewriteLinks(rendered.html, page, ids, base, problems);
				const id = `docs/${page.id}`;
				const frontmatter = rendered.metadata?.frontmatter ?? {};
				let data: Record<string, unknown>;
				try {
					data = await parseData({ id, data: { ...frontmatter, editUrl: page.editUrl } });
				} catch (error) {
					throw new EtchSourceError(`docs/user/${page.id}.md: ${(error as Error).message}`);
				}
				store.set({ id, data, body: markdown, rendered, digest: generateDigest(markdown) });
			}

			// The changelog page (section 3.5): generated, so "Edit this page" would edit
			// release-please's file; it has none. Its table of contents lists the releases.
			const changelog = changelogPage(readFileSync(join(source.dir, 'CHANGELOG.md'), 'utf8'));
			const rendered = await renderMarkdown(changelog.markdown);
			rendered.metadata = { ...rendered.metadata, headings: changelog.headings };
			const data = await parseData({
				id: CHANGELOG_ID,
				data: {
					title: 'Changelog',
					description: 'What changed in each Etch release, newest first.',
					editUrl: false,
					tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
				},
			});
			store.set({
				id: CHANGELOG_ID,
				data,
				body: changelog.markdown,
				rendered,
				digest: generateDigest(changelog.markdown),
			});

			if (problems.length) {
				throw new EtchSourceError(`links in docs/user/ the site cannot follow:\n  ${problems.join('\n  ')}`);
			}
			logger.info(`${all.length} docs pages and the changelog from ${source.label}`);
		},
	};
}
