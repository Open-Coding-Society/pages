const createAssetUrl = (relativePath) => new URL(relativePath, import.meta.url).href;

export const getKirbyImageDirectoryUrl = () => createAssetUrl('../images/').replace(/\/$/, '');
export const getKirbyImageUrl = (fileName) => createAssetUrl(`../images/${fileName}`);
export const getKirbyAudioDirectoryUrl = () => createAssetUrl('../Audios/').replace(/\/$/, '');
export const getKirbyAudioUrl = (fileName) => createAssetUrl(`../Audios/${fileName}`);
