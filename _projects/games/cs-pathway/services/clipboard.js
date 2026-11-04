/**
 * One copy-to-clipboard behaviour for every Copy button in CS Pathway.
 * Shows "Copied!" on success. Browsers can block the clipboard (no HTTPS,
 * no permission); the command stays on screen, so the button says to copy it by hand.
 */
export async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    if (button) button.textContent = 'Copied!';
    return true;
  } catch (error) {
    console.warn('[CS Pathway] clipboard unavailable:', error);
    if (button) button.textContent = 'Select & copy';
    return false;
  }
}
