// PathwayScoreboard.js
// Level-scores bar shown on every CS Pathway level: percent complete for all
// five levels, with the level being played highlighted. It sits top-centre
// because every level stacks its toasts and "Press E" alerts down the
// top-right corner and its status panel top-left. It also shows a link to the
// next level's page, marked complete once this level hits 100%.
// Styles: sass/pathway-scoreboard.scss (.cs-pathway-scoreboard).
import {
  PATHWAY_LEVELS,
  SCORES_UPDATED_EVENT,
  getCachedScores,
  getNextLevel,
  syncScoresFromServer,
} from '../model/pathwayScores.js';
import NextLevelLink from './NextLevelLink.js';

class PathwayScoreboard {
  // mountTo: element the bar is added to (a level's game container keeps it
  // scaled with the map on a fitted full-page stage).
  constructor({ currentLevelKey, basePath = '', mountTo = document.body }) {
    this.currentLevelKey = currentLevelKey;
    this.mountTo = mountTo;
    const nextLevel = getNextLevel(currentLevelKey);
    this.nextLevelLink = nextLevel ? new NextLevelLink({ nextLevel, basePath }) : null;
    this.element = null;
    this.percentElements = new Map();
    this.onScoresUpdated = () => this.refresh();
  }

  show() {
    this.render();
    this.nextLevelLink?.show();
    this.refresh();
    window.addEventListener(SCORES_UPDATED_EVENT, this.onScoresUpdated);
    syncScoresFromServer();
  }

  render() {
    const bar = document.createElement('nav');
    bar.id = 'cs-pathway-scoreboard';
    bar.className = 'cs-pathway-scoreboard';
    bar.setAttribute('aria-label', 'Level scores');

    const title = document.createElement('span');
    title.className = 'cs-pathway-scoreboard__title';
    title.textContent = 'Level scores';

    const list = document.createElement('ol');
    PATHWAY_LEVELS.forEach((level) => {
      const item = document.createElement('li');
      item.title = level.name;
      if (level.key === this.currentLevelKey) {
        item.classList.add('is-current');
        item.setAttribute('aria-current', 'step');
      }
      const name = document.createElement('span');
      name.textContent = level.shortName;
      const percent = document.createElement('strong');
      percent.textContent = '0%';
      item.append(name, percent);
      list.appendChild(item);
      this.percentElements.set(level.key, percent);
    });

    bar.append(title, list);
    this.mountTo.appendChild(bar);
    this.element = bar;
  }

  refresh() {
    const scores = getCachedScores();
    this.percentElements.forEach((element, levelKey) => {
      element.textContent = `${Math.round(scores[levelKey] || 0)}%`;
    });
    this.nextLevelLink?.setComplete((scores[this.currentLevelKey] || 0) >= 100);
  }

  destroy() {
    window.removeEventListener(SCORES_UPDATED_EVENT, this.onScoresUpdated);
    this.element?.remove();
    this.element = null;
    this.percentElements.clear();
    this.nextLevelLink?.destroy();
  }
}

export default PathwayScoreboard;
