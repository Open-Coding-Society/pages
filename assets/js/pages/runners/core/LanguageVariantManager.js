const LANGUAGE_MODES = {
  python: "python",
  java: "text/x-java",
  javascript: "javascript",
  pseudocode: "pseudocode",
};

export class LanguageVariantManager {
  constructor({ editor, languageSelect, variants, storageKey, initialLanguage }) {
    this.editor = editor;
    this.languageSelect = languageSelect;
    this.variants = variants;
    this.storageKey = storageKey;
    this.initialLanguage = initialLanguage;
    this.currentLanguage = null;
    this.drafts = {};
  }

  activateInitial() {
    const language = this.variants[this.initialLanguage]
      ? this.initialLanguage
      : Object.keys(this.variants)[0];

    if (!language) return;
    this.currentLanguage = language;
    this.languageSelect.value = language;
    const source = this.readSaved(language) ?? this.variants[language];
    this.drafts[language] = source;
    this.updateEditor(source, language);
  }

  switchTo(language) {
    if (!this.variants[language]) return false;

    if (this.currentLanguage) {
      this.drafts[this.currentLanguage] = this.editor.getValue();
    }

    this.currentLanguage = language;
    this.languageSelect.value = language;
    const source = Object.prototype.hasOwnProperty.call(this.drafts, language)
      ? this.drafts[language]
      : this.readSaved(language) ?? this.variants[language];

    this.drafts[language] = source;
    this.updateEditor(source, language);
    return true;
  }

  saveCurrent() {
    if (!this.currentLanguage) return;
    const source = this.editor.getValue();
    this.drafts[this.currentLanguage] = source;

    try {
      localStorage.setItem(this.storageKeyFor(this.currentLanguage), source);
    } catch (error) {
      console.warn("Unable to save this language draft:", error);
    }
  }

  clearAll() {
    this.drafts = {};
    Object.keys(this.variants).forEach((language) => {
      try {
        localStorage.removeItem(this.storageKeyFor(language));
      } catch (error) {
        console.warn("Unable to clear this language draft:", error);
      }
    });
  }

  resetCurrent() {
    if (!this.currentLanguage) return;
    const source = this.variants[this.currentLanguage];
    this.drafts[this.currentLanguage] = source;
    this.updateEditor(source, this.currentLanguage);
  }

  storageKeyFor(language) {
    return `${this.storageKey}_${language}`;
  }

  readSaved(language) {
    try {
      return localStorage.getItem(this.storageKeyFor(language));
    } catch (error) {
      console.warn("Unable to load this language draft:", error);
      return null;
    }
  }

  updateEditor(source, language) {
    this.editor.setValue(source);
    this.editor.setOption("mode", LANGUAGE_MODES[language] || language);
    this.editor.refresh();
  }
}
