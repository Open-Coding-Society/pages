const PROJECT_NAME = 'kirby-minigames';
const LEVELS_SEGMENT = `/assets/js/projects/${PROJECT_NAME}/levels/`;

const trimTrailingSlash = (value) => value.replace(/\/$/, '');

const getSiteBaseUrl = () => {
    const moduleUrl = new URL(import.meta.url);
    const levelsSegmentIndex = moduleUrl.pathname.indexOf(LEVELS_SEGMENT);

    if (levelsSegmentIndex === -1) {
        return moduleUrl.origin;
    }

    return `${moduleUrl.origin}${moduleUrl.pathname.slice(0, levelsSegmentIndex)}`;
};

const createPublishedProjectAssetUrl = (publishedRoot, fileName = '') => {
    const encodedFileName = fileName
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');
    const projectAssetRoot = `${trimTrailingSlash(getSiteBaseUrl())}/${publishedRoot}/projects/${PROJECT_NAME}`;

    return encodedFileName ? `${projectAssetRoot}/${encodedFileName}` : projectAssetRoot;
};

export const getKirbyImageDirectoryUrl = () => createPublishedProjectAssetUrl('images');
export const getKirbyImageUrl = (fileName) => createPublishedProjectAssetUrl('images', fileName);

// Audio is published alongside the project's image assets so lesson pages can resolve both consistently.
export const getKirbyAudioDirectoryUrl = () => createPublishedProjectAssetUrl('images');
export const getKirbyAudioUrl = (fileName) => createPublishedProjectAssetUrl('images', fileName);
