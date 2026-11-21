// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import { etchDocs } from './src/integrations/etch-docs.ts';

// SITE_URL / SITE_BASE are set by the deploy workflow. Without a custom domain the
// site lives at https://happy-dwarf-team.github.io/etch-website/.
const site = process.env.SITE_URL ?? 'https://etch.happydwarf.dev';
const base = process.env.SITE_BASE ?? '/';
// Head tags Starlight does not write itself (docs/spec.md, section 6): the shared social preview
// image (crawlers need an absolute URL), the theme colour and the other icons.
const basePath = base.replace(/\/?$/, '/');
const ogImage = new URL(`${basePath}og.png`, site).href;

export default defineConfig({
	site,
	base,
	output: 'static',
	trailingSlash: 'always',
	integrations: [
		// sitemap-index.xml for robots.txt and the head link; the integration leaves out 404.
		sitemap(),
		// The docs under /docs/ (docs/spec.md, section 3.4), from etch's docs/user/ at the latest
		// release, or ETCH_SOURCE: Starlight, dark only, with the site's own header and footer.
		etchDocs(({ docsDir, sidebar }) =>
			starlight({
				title: 'Etch',
				description:
					'A free VS Code extension for EU4 mods: see your interface windows as you type, look at 3D models and textures, and try your mod in the running game.',
				favicon: '/favicon.svg',
				head: [
					{ tag: 'link', attrs: { rel: 'icon', href: `${basePath}favicon.ico`, sizes: '32x32' } },
					{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${basePath}apple-touch-icon.png` } },
					{ tag: 'meta', attrs: { name: 'theme-color', content: '#16171a' } },
					{ tag: 'meta', attrs: { property: 'og:image', content: ogImage } },
					{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
					{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
					{
						tag: 'meta',
						attrs: { property: 'og:image:alt', content: 'Etch logo with the text: EU4 modding in VS Code' },
					},
					{ tag: 'meta', attrs: { name: 'twitter:image', content: ogImage } },
				],
				// The home page and 404 are the site's own Astro pages (section 3.6).
				disable404Route: true,
				credits: false,
				// forge-family.css first (it imports the fonts), then the accent and the shared
				// pieces, then the mapping onto Starlight's variables.
				customCss: ['./src/styles/forge-family.css', './src/styles/common.css', './src/styles/docs.css'],
				components: {
					Header: './src/components/docs/Header.astro',
					PageTitle: './src/components/docs/PageTitle.astro',
					Footer: './src/components/docs/Footer.astro',
					ThemeProvider: './src/components/docs/ThemeProvider.astro',
					ThemeSelect: './src/components/docs/ThemeSelect.astro',
				},
				// Starlight's asides and heading links also for the pages outside src/content/docs/.
				markdown: { processedDirs: [docsDir] },
				sidebar,
			}),
		),
	],
});
