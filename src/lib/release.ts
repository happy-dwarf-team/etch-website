// Reads the latest release of Etch from the GitHub API at build time, for `softwareVersion`
// in the JSON-LD, the header's status badge (docs/spec.md, sections 3.1 and 6.3) and the tag the
// docs are checked out at (section 3.4.1). For the version a failure never fails the build: the
// site goes without a version number, the log carries a warning and the next build corrects it.
// The docs have no such fallback (src/lib/etch-source.ts).

export const ETCH_REPO = 'happy-dwarf-team/etch';

let version: Promise<string | undefined> | undefined;

// The version of the latest release ("0.2.0"), or undefined when there is no release or the
// release data could not be fetched.
export function getLatestVersion(): Promise<string | undefined> {
	version ??= fetchLatestRelease(ETCH_REPO).then((release) => {
		if ('tag' in release) return release.tag.replace(/^v/, '');
		console.warn(`[release] ${ETCH_REPO}: ${release.error}; building without a version number.`);
		return undefined;
	});
	return version;
}

function githubHeaders(): Record<string, string> {
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
	};
	const token = process.env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}

/** The tag of the latest release that is neither a draft nor a prerelease ("v2.13.0"), or why there is none. */
export async function fetchLatestRelease(repo = ETCH_REPO): Promise<{ tag: string } | { error: string }> {
	try {
		const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
			headers: githubHeaders(),
			signal: AbortSignal.timeout(30_000),
		});
		if (!res.ok) return { error: `GitHub API returned ${res.status}` };
		const { tag_name } = (await res.json()) as { tag_name: string };
		return { tag: tag_name };
	} catch (error) {
		return { error: String(error) };
	}
}
