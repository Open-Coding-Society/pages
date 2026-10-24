// NextLevelLink.js
// Link to the next level's page, always available so students can move on
// whenever they like. Once the current level is 100% done it switches to a
// "Level complete" label and pulses.
// Styles: sass/next-level-link.scss (.cs-pathway-next-level).

class NextLevelLink {
  constructor({ nextLevel, basePath = '' }) {
    if (!nextLevel?.pagePath) {
      throw new Error('NextLevelLink needs the next level and its pagePath');
    }
    this.nextLevel = nextLevel;
    this.href = `${basePath}${nextLevel.pagePath}`;
    this.element = null;
  }

  show() {
    if (this.element?.isConnected) return;
    const link = document.createElement('a');
    link.className = 'cs-pathway-next-level';
    link.href = this.href;
    document.body.appendChild(link);
    this.element = link;
    this.setComplete(false);
  }

  setComplete(isComplete) {
    if (!this.element) return;
    this.element.classList.toggle('is-complete', isComplete);
    this.element.textContent = isComplete
      ? `Level complete! Continue to ${this.nextLevel.name} →`
      : `Next level: ${this.nextLevel.name} →`;
  }

  destroy() {
    this.element?.remove();
    this.element = null;
  }
}

export default NextLevelLink;
