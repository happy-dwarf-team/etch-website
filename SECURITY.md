# Security policy

This repository builds the static website at
[etch.happydwarf.dev](https://etch.happydwarf.dev). The site offers no downloads
and runs only three small scripts for visitors (the demo loop controller, the
lightbox and the copy button), but its install command and links point people
at an extension that runs in their editor. Please report security problems
privately, not in public issues.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting:
[Report a vulnerability](https://github.com/happy-dwarf-team/etch-website/security/advisories/new).
Include the page, what you found and what an attacker gains.

This is a volunteer project; reports are handled on a best-effort basis. We
will confirm the report, agree on a fix and a disclosure date with you, and
credit you in the advisory unless you prefer otherwise.

## In scope

- Install commands or Marketplace and Open VSX links that lead to an extension
  other than `happy-dwarf-team.etch`.
- Content injected into the site, for example through the build, a dependency,
  the release data read from the GitHub API or the media manifest.
- The build and deploy workflows: secrets exposed to pull requests, or a
  pull request able to change the deployed site.

## Out of scope

- Etch itself: report to the
  [Etch repository](https://github.com/happy-dwarf-team/etch/security/advisories/new).
- Missing HTTP security headers: GitHub Pages does not let the site set them.
