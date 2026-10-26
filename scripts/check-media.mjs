// Checks the media manifest (docs/spec.md, section 5.3): validates src/data/media.json
// against its schema, requires every poster and still in src/assets/media/, and sends HEAD
// to every source, which must answer 200 with the source's media type and a Content-Length
// equal to `bytes`. Without a manifest (before the first media refresh, section 4.3) there is
// nothing to check. Needs network access and Node 22.18+, which runs the .ts schema as is:
// npm run check:media
import { existsSync, readFileSync } from 'node:fs';
import { imageFiles, mediaType, parseMediaManifest } from '../src/lib/media-manifest.ts';

const manifestFile = new URL('../src/data/media.json', import.meta.url);
const assets = new URL('../src/assets/media/', import.meta.url);

if (!existsSync(manifestFile)) {
	console.log('No src/data/media.json yet: no media to check.');
	process.exit(0);
}

let manifest;
try {
	manifest = parseMediaManifest(JSON.parse(readFileSync(manifestFile, 'utf8')));
} catch (error) {
	console.error(error.message);
	process.exit(1);
}

const problems = [];
for (const file of imageFiles(manifest)) {
	if (!existsSync(new URL(file, assets))) problems.push(`src/assets/media/${file} is missing`);
}

// One retry on a network error or a 5xx, so a passing hiccup does not fail the scheduled build.
async function head(src) {
	for (let attempt = 1; ; attempt++) {
		try {
			const response = await fetch(src, {
				method: 'HEAD',
				redirect: 'manual',
				signal: AbortSignal.timeout(15_000),
			});
			if (response.status < 500 || attempt === 2) return response;
		} catch (error) {
			if (attempt === 2) throw error;
		}
	}
}

async function checkSource({ src, type, bytes }) {
	let response;
	try {
		response = await head(src);
	} catch (error) {
		return [`${src}: ${error.cause?.code ?? error.message}`];
	}
	if (response.status !== 200) return [`${src}: status ${response.status}, expected 200`];
	const found = [];
	const contentType = mediaType(response.headers.get('content-type') ?? '');
	if (contentType !== mediaType(type)) {
		found.push(`${src}: Content-Type ${contentType || '(none)'}, expected ${mediaType(type)}`);
	}
	const length = response.headers.get('content-length');
	if (length !== String(bytes)) {
		found.push(`${src}: Content-Length ${length ?? '(none)'}, expected ${bytes}`);
	}
	return found;
}

const sources = Object.values(manifest.loops).flatMap((loop) => loop.sources);
problems.push(...(await Promise.all(sources.map(checkSource))).flat());

if (problems.length) {
	console.error(`Media manifest problems (${problems.length}):\n${problems.join('\n')}`);
	process.exit(1);
}
console.log(`Media manifest OK: Etch ${manifest.etch}, ${sources.length} sources checked.`);
