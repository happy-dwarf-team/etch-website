// Adds the docs under /docs/ (docs/spec.md, section 3.4): prepares etch's files (the latest
// release's tag, or ETCH_SOURCE; src/lib/etch-source.ts), reads the sidebar's groups and pages from
// docs/user/README.md, and adds Starlight, built by astro.config.mjs from them. `astro preview`
// only serves dist/, so it needs neither. A problem with the source fails the build here, before
// anything is built.
import type { AstroIntegration } from 'astro';
import { CHANGELOG_ID } from '../lib/etch-docs-loader';
import { prepareEtchSource, readDocsIndex } from '../lib/etch-source';

export interface EtchDocs {
	/** etch's docs/user/, absolute: Starlight's Markdown transforms run on files there. */
	docsDir: string;
	/** Starlight's sidebar: the README's groups and pages, the changelog last in About. */
	sidebar: { label: string; items: string[] }[];
}

export function etchDocs(starlight: (docs: EtchDocs) => AstroIntegration): AstroIntegration {
	return {
		name: 'etch-docs',
		hooks: {
			'astro:config:setup': async ({ command, config, updateConfig, logger }) => {
				if (command === 'preview') return;
				const source = await prepareEtchSource(config.root);
				const groups = readDocsIndex(source.docsDir);
				logger.info(`Building the docs from ${source.label}.`);
				const sidebar = groups.map(({ label, pages }) => ({
					label,
					items: pages.map(({ id }) => `docs/${id}`),
				}));
				// The changelog is a page of About (section 3.5), at /docs/changelog/.
				const about = sidebar.find(({ label }) => label === 'About') ?? sidebar[sidebar.length - 1];
				about.items.push(CHANGELOG_ID);
				const base = config.base.replace(/\/$/, '');
				updateConfig({
					// /docs/ itself has no page: it leads to the first one. Astro adds the base to the
					// source path but not to the destination.
					redirects: { '/docs/': `${base}/docs/${groups[0].pages[0].id}/` },
					integrations: [starlight({ docsDir: source.docsDir, sidebar })],
				});
			},
		},
	};
}
