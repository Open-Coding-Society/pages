export class StatsManager {
  constructor(container, { statusSelector = '.status-text' } = {}) {
    this.container = container;
    this.lineCountSpan = container.querySelector('.lineCount');
    this.charCountSpan = container.querySelector('.charCount');
    this.statusElement = container.querySelector(statusSelector);
  }

  updateFromCode(code = '') {
    if (this.lineCountSpan) {
      this.lineCountSpan.textContent = `Lines: ${code.split('\n').length}`;
    }

    if (this.charCountSpan) {
      this.charCountSpan.textContent = `Characters: ${code.length}`;
    }
  }

  updateStatus(status) {
    if (this.statusElement) {
      this.statusElement.textContent = status;
    }
  }
}

export default StatsManager;
