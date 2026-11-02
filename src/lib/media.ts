// Loads the media manifest for the pages (docs/spec.md, sections 4.3 and 5). The manifest is
// optional until the first media refresh: without it loadMedia() returns undefined and every
// loop renders its unavailable state. A manifest that fails the schema or names a missing poster
// fails the build.
import type { ImageMetadata } from 'astro';
import { CLIP_IDS, parseMediaManifest, type ClipId, type MediaManifest } from './media-manifest';

const manifests = import.meta.glob('/src/data/media.json', { eager: true, import: 'default' });
const images = import.meta.glob<ImageMetadata>('/src/assets/media/*.png', {
	eager: true,
	import: 'default',
});

export type Loop = Omit<MediaManifest['loops']['hero'], 'poster'> & { poster: ImageMetadata };
export interface Media {
	// The Etch version the set was captured for.
	etch: string;
	loops: Record<ClipId, Loop>;
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
	const loops = Object.fromEntries(
		CLIP_IDS.map((id) => {
			const loop = manifest.loops[id];
			return [id, { ...loop, poster: image(loop.poster) }];
		}),
	) as Record<ClipId, Loop>;
	return { etch: manifest.etch, loops };
}
