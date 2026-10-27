import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const state = z.enum(['done', 'current', 'next']);

// src/data/status.yaml: one entry, `extension` (docs/spec.md, sections 3.1 and 3.5).
const status = defineCollection({
	loader: file('src/data/status.yaml'),
	schema: z.strictObject({
		status: z.string().min(1),
		milestones: z
			.strictObject({
				M0: state,
				M1: state,
				M2: state,
				M3: state,
				M4: state,
				'1.0': state,
				'2.0': state,
			})
			.refine((m) => Object.values(m).filter((s) => s === 'current').length <= 1, {
				message: 'at most one milestone is current',
			}),
	}),
});

export const collections = { status };
