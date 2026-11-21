import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { etchDocsLoader } from './lib/etch-docs-loader';
import { CLIP_IDS } from './lib/media-manifest';

// src/data/status.yaml: one entry, `extension` (docs/spec.md, section 3.1): the status for the
// header's badge and the hero's What's new pill. The pill's target is checked against the home
// page's feature sections in src/lib/content.ts.
const status = defineCollection({
	loader: file('src/data/status.yaml'),
	schema: z.strictObject({
		status: z.string().min(1),
		whatsNew: z
			.strictObject({
				version: z.string().regex(/^\d+\.\d+$/, 'a major and minor version, such as 2.13'),
				line: z.string().min(1),
				target: z.string().min(1),
			})
			.optional(),
	}),
});

// The docs under /docs/ and the changelog page (sections 3.4 and 3.5), from etch's docs/user/
// and CHANGELOG.md (src/lib/etch-docs-loader.ts). A page's front matter (etch's
// docs/user/STYLE.md) adds `since`, the release that added its feature, and `clip`, the loop the
// page shows; a clip id the site does not know fails the build.
const docs = defineCollection({
	loader: etchDocsLoader(),
	schema: docsSchema({
		extend: z.object({
			since: z.string().regex(/^\d+\.\d+\.\d+$/, 'a release version, such as 2.13.0').optional(),
			clip: z.enum(CLIP_IDS).optional(),
		}),
	}),
});

// Starlight's own words where the specification names them otherwise ("Edit this page").
const i18n = defineCollection({ loader: i18nLoader(), schema: i18nSchema() });

export const collections = { status, docs, i18n };
