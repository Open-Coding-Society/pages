/**
 * Tool logos shown as badges above each Toolchain Trail station on the map,
 * so students can tell at a glance which tool a station sets up.
 *
 * Logos are Devicon v2.16.0 "original" SVGs (MIT, see images/logos/DEVICON-LICENSE),
 * saved in the repo so the game does not depend on a CDN.
 */

export const TOOL_LOGOS = Object.freeze({
  python: { file: 'python.svg', label: 'Python' },
  ruby: { file: 'ruby.svg', label: 'Ruby' },
  homebrew: { file: 'homebrew.svg', label: 'Homebrew' },
  vscode: { file: 'vscode.svg', label: 'VS Code' },
  git: { file: 'git.svg', label: 'Git' },
  github: { file: 'github.svg', label: 'GitHub' },
});

/**
 * Logos per station: `all` shows for every OS, an OS key adds logos only
 * when that OS is selected (Homebrew is a macOS tool).
 * Only well-known logos are shown, so stations without one (Terminal Town
 * Gate, Build Bridge, Integration Summit) get no badge.
 */
export const STATION_LOGOS = Object.freeze({
  'compiler-canyon-forge': { all: ['python', 'ruby'], macos: ['homebrew'] },
  'editor-isle-tower': { all: ['vscode'] },
  'git-village-hall': { all: ['git'] },
  'github-gateway-arch': { all: ['github'] },
});

/**
 * Returns the logos to show for a station and selected OS, as
 * [{ id, file, label }] in display order.
 */
export function stationLogosFor(stationId, os) {
  const entry = STATION_LOGOS[stationId];
  if (!entry) return [];
  const ids = [...entry.all, ...((os && entry[os]) || [])];
  return ids.map((id) => ({ id, ...TOOL_LOGOS[id] }));
}
