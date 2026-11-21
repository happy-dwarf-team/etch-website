// Loads the media manifest for the pages (docs/spec.md, sections 4.4 and 5). The manifest is
// optional until the first media refresh: without it loadMedia() returns undefined and the demo
// loop renders its unavailable state. A clip the manifest lacks is missing from `loops`, and the
// home page leaves out its feature (section 3.2). A manifest that fails the schema or names a
// missing poster fails the build.
import type { ImageMetadata } from 'astro';
import {
	CLIP_IDS,
	parseMediaManifest,
	type Chapter,
	type ClipId,
	type ManifestLoop,
} from './media-manifest';

const manifests = import.meta.glob('/src/data/media.json', { eager: true, import: 'default' });
const images = import.meta.glob<ImageMetadata>('/src/assets/media/*.png', {
	eager: true,
	import: 'default',
});

export type Loop = Omit<ManifestLoop, 'poster'> & {
	poster: ImageMetadata;
	/** The demo loop's chapters, `hero` only (section 4.2). */
	chapters?: Chapter[];
};
export interface Media {
	// The Etch version the set was captured for.
	etch: string;
	loops: Partial<Record<ClipId, Loop>>;
}

function image(file: string): ImageMetadata {
	const metadata = images[`/src/assets/media/${file}`];
	if (!metadata) {
		throw new Error(`src/data/media.json names src/assets/media/${file}, which is missing`);
	}
	return metadata;
}

export function loadMedia(): Media | undefined {
	const json = manifests['/src/data/media.json'];
	if (json === undefined) return undefined;
	const manifest = parseMediaManifest(json);
	const loops: Media['loops'] = {};
	for (const id of CLIP_IDS) {
		const loop = manifest.loops[id];
		if (loop) loops[id] = { ...loop, poster: image(loop.poster) };
	}
	return { etch: manifest.etch, loops };
}
