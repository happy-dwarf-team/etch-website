// The media manifest's schema (docs/spec.md, section 5.2). src/data/media.json is written by
// `pnpm media publish` in etch and carries only facts about files; the loops' text descriptions,
// the posters' alts and the chapters' labels stay in the site's code. No Astro-only imports here,
// so scripts/check-media.mjs can load this file with plain Node.
import { z } from 'astro/zod';

// Hub spec 7.2: one bucket behind this origin, keys etch/v<version>/<clip>.<hash8>.<ext>.
export const MEDIA_ORIGIN = 'https://media.happydwarf.dev';

// The clip ids (section 5.2), the same in bucket keys, file names and the manifest: the demo
// loop and the twelve clips every set has had since the 2026-11-18 media refresh, which a
// manifest must carry...
const SET_CLIP_IDS = [
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
	'profile',
	'names',
] as const;
// ...and the redesign's new clips, which come with later media refreshes: until a set has one,
// the home page leaves its feature out (section 3.2).
const NEW_CLIP_IDS = ['mesh', 'entity', 'trees', 'texture', 'hovers', 'run', 'encoding'] as const;
export const CLIP_IDS = [...SET_CLIP_IDS, ...NEW_CLIP_IDS] as const;
export type ClipId = (typeof CLIP_IDS)[number];

const source = z.strictObject({
	src: z.url({ protocol: /^https$/ }),
	type: z.string(),
	bytes: z.int().positive(),
});

const version = z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);

const loop = z.strictObject({
	// A loop kept from an earlier set: the Etch version it was captured for, and the key prefix
	// of its files (section 5.2). Without it, the loop is of the set's version.
	etch: version.optional(),
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

// The demo loop's chapters (sections 4.2 and 5.2): an id and its start in seconds, the first at
// 0, increasing, every start before the loop's end. Their labels are in src/lib/content.ts,
// whose chapter check fails the build on an id it has no label for.
const chapter = z.strictObject({
	id: z.string().regex(/^[a-z][a-z0-9-]*$/),
	start: z.number().nonnegative(),
});

const hero = loop
	.extend({ chapters: z.array(chapter).min(1).optional() })
	.superRefine(({ chapters, duration }, ctx) => {
		if (!chapters) return;
		const issue = (path: (string | number)[], message: string) =>
			ctx.addIssue({ code: 'custom', path: ['chapters', ...path], message });
		if (chapters[0].start !== 0) issue([0, 'start'], 'the first chapter starts at 0');
		chapters.forEach(({ id, start }, i) => {
			if (i > 0 && start <= chapters[i - 1].start) issue([i, 'start'], 'chapter starts must increase');
			if (start >= duration) issue([i, 'start'], `starts at or after the loop's end (${duration} s)`);
			if (chapters.findIndex((c) => c.id === id) !== i) issue([i, 'id'], `chapter ${id} appears twice`);
		});
	});

export const mediaManifestSchema = z
	.strictObject({
		schemaVersion: z.literal(2),
		etch: version,
		loops: z.strictObject({
			hero,
			preview: loop,
			views: loop,
			data: loop,
			zoom: loop,
			outline: loop,
			problems: loop,
			reload: loop,
			pick: loop,
			snapshot: loop,
			profile: loop,
			names: loop,
			mesh: loop.optional(),
			entity: loop.optional(),
			trees: loop.optional(),
			texture: loop.optional(),
			hovers: loop.optional(),
			run: loop.optional(),
			encoding: loop.optional(),
		}),
	})
	.superRefine((manifest, ctx) => {
		// Clip ids are the same in bucket keys, file names and the manifest (section 5.2).
		for (const [clip, loop] of Object.entries(manifest.loops)) {
			if (!loop) continue;
			const { etch, poster, sources } = loop;
			if (poster !== `${clip}.png`) {
				ctx.addIssue({
					code: 'custom',
					path: ['loops', clip, 'poster'],
					message: `expected ${clip}.png`,
				});
			}
			const prefix = `${MEDIA_ORIGIN}/etch/v${etch ?? manifest.etch}/${clip}.`;
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
export type ManifestLoop = z.infer<typeof loop>;
export type Chapter = z.infer<typeof chapter>;

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
	return Object.values(manifest.loops).flatMap((loop) => (loop ? [loop.poster] : []));
}

// A source's media type without parameters: `video/webm; codecs="vp9"` → `video/webm`.
export function mediaType(type: string): string {
	return type.split(';')[0].trim().toLowerCase();
}
