import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

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

export const collections = { status };
