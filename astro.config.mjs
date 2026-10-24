// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL / SITE_BASE are set by the deploy workflow. Without a custom domain the
// site lives at https://happy-dwarf-team.github.io/etch-website/.
const site = process.env.SITE_URL ?? 'https://etch.happydwarf.dev';
const base = process.env.SITE_BASE ?? '/';

export default defineConfig({
	site,
	base,
	output: 'static',
	trailingSlash: 'always',
});
