// Reads the latest release of Etch from the GitHub API at build time, for `softwareVersion`
// in the JSON-LD and the header's status badge (docs/spec.md, sections 3.1 and 6.3). A failure
// never fails the build: the site goes without a version number, the log carries a warning
// and the next build corrects it.

export const ETCH_REPO = 'happy-dwarf-team/etch';

let version: Promise<string | undefined> | undefined;

// The version of the latest release ("0.2.0"), or undefined when there is no release or the
// release data could not be fetched.
export function getLatestVersion(): Promise<string | undefined> {
	version ??= fetchLatestVersion(ETCH_REPO);
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

async function fetchLatestVersion(repo: string): Promise<string | undefined> {
	try {
		// The latest release that is neither a draft nor a prerelease.
		const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
			headers: githubHeaders(),
			signal: AbortSignal.timeout(30_000),
		});
		if (!res.ok) {
			console.warn(`[release] ${repo}: GitHub API returned ${res.status}; building without a version number.`);
			return undefined;
		}
		const { tag_name } = (await res.json()) as { tag_name: string };
		return tag_name.replace(/^v/, '');
	} catch (error) {
		console.warn(`[release] ${repo}: ${String(error)}; building without a version number.`);
		return undefined;
	}
}
