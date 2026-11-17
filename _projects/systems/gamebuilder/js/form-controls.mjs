/**
 * @module form-controls
 * @description Shared asset dropdown helpers for the builder panels.
 * @data Entries are asset catalog Map values with `key` and `name`.
 * @usage `populateSelect` fills a select from a catalog Map; `selectAsset`
 * selects a key and keeps a visible placeholder when the asset is missing.
 */
export function populateSelect(select, entries) {
  select.replaceChildren();
  for (const entry of entries.values()) {
    const option = document.createElement('option');
    option.value = entry.key;
    option.textContent = entry.name;
    select.append(option);
  }
}

export function selectAsset(select, key) {
  if (![...select.options].some((option) => option.value === key)) {
    const missing = document.createElement('option');
    missing.value = key;
    missing.textContent = `Unavailable asset: ${key}`;
    select.append(missing);
  }
  select.value = key;
}
