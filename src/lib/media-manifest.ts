// The media manifest's schema (docs/spec.md, section 5.2). src/data/media.json is written by
// `pnpm media publish` in etch and carries only facts about files; the loops' text descriptions
// and alts stay in the site's code. No Astro-only imports here, so scripts/check-media.mjs can
// load this file with plain Node.
import { z } from 'astro/zod';

// Hub spec 7.2: one bucket behind this origin, keys etch/v<version>/<clip>.<hash8>.<ext>.
export const MEDIA_ORIGIN = 'https://media.happydwarf.dev';

// The clip ids (section 5.2): the hero's trailer, the offline preview's six features and the
// live game's three, the same in bucket keys, file names and the manifest.
export const CLIP_IDS = [
	'hero',
	'preview',
	'views',
	'data',
	'zoom',
	'outline',
	'problems',
	'reload',
	'pick',
	'snapshot',
] as const;
export type ClipId = (typeof CLIP_IDS)[number];

const source = z.strictObject({
	src: z.url({ protocol: /^https$/ }),
	type: z.string(),
	bytes: z.int().positive(),
});

const loop = z.strictObject({
	width: z.int().positive(),
	height: z.int().positive(),
	duration: z.number().positive(),
	// The loop's first frame, in src/assets/media/; checked against its clip below.
	poster: z.string(),
	// VP9 WebM first, H.264 MP4 second (section 4.1).
	sources: z.tuple([
		source.extend({ type: z.string().startsWith('video/webm') }),
		source.extend({ type: z.string().startsWith('video/mp4') }),
	]),
});

export const mediaManifestSchema = z
	.strictObject({
		schemaVersion: z.literal(2),
		etch: z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/),
		loops: z.strictObject({
			hero: loop,
			preview: loop,
			views: loop,
			data: loop,
			zoom: loop,
			outline: loop,
			problems: loop,
			reload: loop,
			pick: loop,
			snapshot: loop,
		}),
	})
	.superRefine((manifest, ctx) => {
		// Clip ids are the same in bucket keys, file names and the manifest (section 5.2).
		for (const [clip, { poster, sources }] of Object.entries(manifest.loops)) {
			if (poster !== `${clip}.png`) {
				ctx.addIssue({
					code: 'custom',
					path: ['loops', clip, 'poster'],
					message: `expected ${clip}.png`,
				});
			}
			const prefix = `${MEDIA_ORIGIN}/etch/v${manifest.etch}/${clip}.`;
			sources.forEach(({ src }, i) => {
				const ext = i === 0 ? 'webm' : 'mp4';
				const rest = src.startsWith(prefix) ? src.slice(prefix.length) : '';
				if (!new RegExp(`^[0-9a-f]{8}\\.${ext}$`).test(rest)) {
					ctx.addIssue({
						code: 'custom',
						path: ['loops', clip, 'sources', i, 'src'],
						message: `expected ${prefix}<hash8>.${ext}`,
					});
				}
			});
		}
	});

export type MediaManifest = z.infer<typeof mediaManifestSchema>;

// Validates the parsed JSON of src/data/media.json; throws with every issue listed.
export function parseMediaManifest(json: unknown): MediaManifest {
	const result = mediaManifestSchema.safeParse(json);
	if (!result.success) {
		throw new Error(`Invalid src/data/media.json:\n${z.prettifyError(result.error)}`);
	}
	return result.data;
}

// Every poster the manifest names, relative to src/assets/media/.
export function imageFiles(manifest: MediaManifest): string[] {
	return Object.values(manifest.loops).map((loop) => loop.poster);
}

// A source's media type without parameters: `video/webm; codecs="vp9"` → `video/webm`.
export function mediaType(type: string): string {
	return type.split(';')[0].trim().toLowerCase();
}
