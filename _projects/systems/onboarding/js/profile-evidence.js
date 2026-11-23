const STATIONS = [
    ['terminal-town-gate', 'Terminal Town Gate'],
    ['compiler-canyon-forge', 'Compiler Canyon Forge'],
    ['editor-isle-tower', 'Editor Isle Tower'],
    ['git-village-hall', 'Git Village Hall'],
    ['github-gateway-arch', 'GitHub Gateway Arch'],
    ['build-bridge', 'Build Bridge'],
    ['integration-summit', 'Integration Summit'],
];

export function pathwayEvidence(profile) {
    const game = profile?.game_profile;
    if (!game || typeof game !== 'object') return [];
    const identity = game['identity-forge']?.progress || {};
    const world = game['wayfinding-world']?.progress || {};
    const stations = game['toolchain-trail']?.progress?.stations || {};
    return [
        ['Identity terminal', identity.identityUnlocked ? 'Passed' : 'Not yet passed'],
        ['Avatar Forge', identity.avatarSelected ? 'Passed' : 'Not yet passed'],
        ['World theme', world.worldThemeSelected ? 'Passed' : 'Not yet passed'],
        ...STATIONS.map(([id, name]) => [name, stations[id] === 'complete' ? 'Passed' : 'Not yet passed']),
    ];
}

export async function initPathwayEvidence({ profile, list, status }) {
    try {
        const evidence = pathwayEvidence(await profile.gameProfile());
        list.replaceChildren(...evidence.map(([name, result]) => {
            const item = document.createElement('li');
            item.textContent = `${name}: ${result}`;
            return item;
        }));
        status.textContent = evidence.length
            ? 'Passed stations come from your saved game progress. Unpassed stations may not have been attempted.'
            : 'No saved Pathway progress yet.';
    } catch (error) {
        console.error('Could not load Pathway evidence:', error);
        status.textContent = `Couldn't load Pathway evidence: ${error.message}.`;
    }
}
