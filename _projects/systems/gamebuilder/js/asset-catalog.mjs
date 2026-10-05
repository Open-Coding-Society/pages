/**
 * @module asset-catalog
 * @description
 * Validates GameBuilder background and sprite manifests and turns their
 * display names into stable selection keys. Manifest sources are restricted
 * to safe relative paths and are resolved under the published asset folders.
 *
 * @data
 * Background entries contain `name` and `src`. Sprite entries also contain
 * positive integer `rows` and `cols`, a positive `scaleFactor`, and a
 * supported `movementPreset`. The returned catalog has `backgrounds` and
 * `sprites` Maps; each entry includes its key, display name, published source
 * path, and (for sprites) animation metadata.
 *
 * @usage
 * Call `createAssetCatalog(backgroundManifest, spriteManifest)` after loading
 * both manifest arrays. Pass the returned catalog to builder validation and
 * code generation. Invalid, duplicate, or empty manifests throw a descriptive
 * `TypeError`.
 */
const ASSET_TYPES = {
  backgrounds: { directory: 'bg', needsAnimation: false },
  sprites: { directory: 'sprites', needsAnimation: true }
};

function toKey(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function validateSource(src) {
  return typeof src === 'string'
    && src.trim() !== ''
    && !src.startsWith('/')
    && !src.includes('\\')
    && !src.split('/').includes('..');
}

function normalizeEntries(manifest, type, publicBasePath) {
  const config = ASSET_TYPES[type];
  if (!config || !Array.isArray(manifest)) {
    throw new TypeError(`The ${type} manifest must be an array`);
  }

  const entries = new Map();
  for (const item of manifest) {
    if (!item || typeof item.name !== 'string' || !item.name.trim() || !validateSource(item.src)) {
      throw new TypeError(`The ${type} manifest contains an invalid name or source path`);
    }

    const key = toKey(item.name);
    if (!key || entries.has(key)) {
      throw new TypeError(`The ${type} manifest contains a duplicate or invalid asset name: ${item.name}`);
    }

    const entry = {
      key,
      name: item.name,
      src: `${publicBasePath}/${config.directory}/${item.src.split('/').map(encodeURIComponent).join('/')}`
    };
    if (config.needsAnimation) {
      if (!Number.isInteger(item.rows) || item.rows < 1 || !Number.isInteger(item.cols) || item.cols < 1) {
        throw new TypeError(`Sprite ${item.name} must define positive integer rows and cols`);
      }
      if (!Number.isFinite(item.scaleFactor) || item.scaleFactor <= 0) {
        throw new TypeError(`Sprite ${item.name} must define a positive scaleFactor`);
      }
      if (!['four-row-8way', 'single-row'].includes(item.movementPreset)) {
        throw new TypeError(`Sprite ${item.name} has an unsupported movementPreset`);
      }
      Object.assign(entry, {
        rows: item.rows,
        cols: item.cols,
        scaleFactor: item.scaleFactor,
        movementPreset: item.movementPreset
      });
    }
    entries.set(key, entry);
  }

  if (entries.size === 0) {
    throw new TypeError(`The ${type} manifest is empty`);
  }
  return entries;
}

export function createAssetCatalog(backgroundManifest, spriteManifest, publicBasePath = '/images/projects/gamebuilder') {
  const normalizedBase = `/${publicBasePath.split('/').filter(Boolean).join('/')}`;
  return {
    backgrounds: normalizeEntries(backgroundManifest, 'backgrounds', normalizedBase),
    sprites: normalizeEntries(spriteManifest, 'sprites', normalizedBase)
  };
}
