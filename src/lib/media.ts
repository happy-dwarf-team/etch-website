// Loads the media manifest for the pages (docs/spec.md, sections 4.3 and 5). The manifest is
// optional until the first media refresh: without it loadMedia() returns undefined and the
// demo loop and the stills render their unavailable state. A manifest that fails the schema
// or names a missing poster or still fails the build.
import type { ImageMetadata } from 'astro';
import { parseMediaManifest, type MediaManifest } from './media-manifest';

const manifests = import.meta.glob('/src/data/media.json', { eager: true, import: 'default' });
const images = import.meta.glob<ImageMetadata>('/src/assets/media/*.png', {
	eager: true,
	import: 'default',
});

export type Loop = Omit<MediaManifest['loops']['hero'], 'poster'> & { poster: ImageMetadata };
export interface Media {
	// The Etch version the set was captured for.
	etch: string;
	loops: Record<keyof MediaManifest['loops'], Loop>;
	stills: Record<keyof MediaManifest['stills'], ImageMetadata>;
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
	const { hero } = manifest.loops;
	const { stills } = manifest;
	return {
		etch: manifest.etch,
		loops: { hero: { ...hero, poster: image(hero.poster) } },
		stills: {
			preview: image(stills.preview),
			pin: image(stills.pin),
			outline: image(stills.outline),
			problems: image(stills.problems),
			resolution: image(stills.resolution),
			playset: image(stills.playset),
		},
	};
}
