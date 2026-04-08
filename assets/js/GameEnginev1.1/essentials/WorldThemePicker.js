class WorldThemePicker {
  constructor(config = {}) {
    this.config = {
      id: 'ocs-world-theme-picker',
      title: 'World Theme Picker',
      description: 'Select a background theme.',
      confirmLabel: 'Done',
      cancelLabel: 'Cancel',
      showCancel: true,
      basePath: '',
      zIndex: '10001',
      fontFamily: '"Courier New", monospace',
      theme: {},
      ...config,
    };

    this.activeOverlay = null;
    this.activeResolve = null;
  }

  resolveSrc(src = '') {
    if (!src) return '';
    if (/^(https?:)?\//.test(src)) {
      return src;
    }

    const basePath = this.config.basePath
      ? this.config.basePath.replace(/\/?$/, '/')
      : '';

    return `${basePath}${String(src).replace(/^\//, '')}`;
  }

  normalizeTheme(theme = {}) {
    const name = theme.name || theme.label || String(theme.src || 'theme').replace(/\.[^.]+$/, '');

    return {
      id: theme.id || String(theme.src || name),
      name,
      label: theme.label || name,
      src: this.resolveSrc(theme.src || ''),
      rawSrc: theme.src || '',
      previewText: theme.previewText || theme.description || '',
    };
  }

  close(result = null) {
    if (this.activeOverlay?.isConnected) {
      this.activeOverlay.remove();
    }

    const resolve = this.activeResolve;
    this.activeOverlay = null;
    this.activeResolve = null;

    if (resolve) {
      resolve(result);
    }
  }

  show({ themes = [], initialSelection = null, onPreview = null } = {}) {
    if (this.activeResolve) {
      this.close(null);
    }

    const normalizedThemes = themes.map((theme) => this.normalizeTheme(theme));
    let selectedTheme = normalizedThemes.find((theme) => {
      if (!initialSelection) return false;
      return theme.id === initialSelection || theme.rawSrc === initialSelection || theme.src === initialSelection;
    }) || normalizedThemes[0] || null;

    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.id = `${this.config.id}-overlay`;
      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        zIndex: this.config.zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: this.config.theme.overlayBackground || 'var(--ocs-game-overlay, rgba(13,13,26,0.72))',
      });

      const panel = document.createElement('section');
      panel.id = this.config.id;
      Object.assign(panel.style, {
        width: '94%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: this.config.theme.background || 'var(--ocs-game-panel-bg, rgba(13,13,26,0.92))',
        border: `2px solid ${this.config.theme.borderColor || 'var(--ocs-game-accent, #4ecca3)'}`,
        borderRadius: '12px',
        padding: '24px 28px',
        fontFamily: this.config.fontFamily,
        color: this.config.theme.textColor || 'var(--ocs-game-text, #e0e0e0)',
        boxShadow: this.config.theme.boxShadow || '0 0 20px rgba(78,204,163,0.18)',
      });

      const title = document.createElement('div');
      Object.assign(title.style, {
        color: this.config.theme.accentColor || 'var(--ocs-game-accent, #4ecca3)',
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: '14px',
        textAlign: 'center',
      });
      title.textContent = this.config.title;
      panel.appendChild(title);

      if (this.config.description) {
        const description = document.createElement('div');
        Object.assign(description.style, {
          color: this.config.theme.secondaryTextColor || 'var(--ocs-game-muted, #c7f2d4)',
          fontSize: '13px',
          marginBottom: '18px',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
        });
        description.textContent = this.config.description;
        panel.appendChild(description);
      }

      const themeGrid = document.createElement('div');
      Object.assign(themeGrid.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '18px',
      });

      const optionButtons = [];

      const updateSelectionStyles = () => {
        optionButtons.forEach(({ button, theme }) => {
          const isSelected = selectedTheme?.id === theme.id;
          Object.assign(button.style, {
            background: isSelected
              ? (this.config.theme.selectedBackground || 'var(--ocs-game-panel-selected-bg, #2a2a4a)')
              : (this.config.theme.inputBackground || 'var(--ocs-game-surface-alt, #1a1a2e)'),
            borderColor: isSelected
              ? (this.config.theme.selectedBorderColor || 'var(--ocs-game-selected-border, #7effff)')
              : (this.config.theme.borderColor || 'var(--ocs-game-accent, #4ecca3)'),
            opacity: isSelected ? '1' : '0.85',
            boxShadow: isSelected
              ? (this.config.theme.selectedShadow || '0 0 20px rgba(126,255,255,0.35)')
              : 'none',
          });
          button.setAttribute('aria-pressed', String(isSelected));
        });
      };

      normalizedThemes.forEach((theme) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `Select ${theme.label}`);
        Object.assign(button.style, {
          background: this.config.theme.inputBackground || 'var(--ocs-game-surface-alt, #1a1a2e)',
          border: `2px solid ${this.config.theme.borderColor || 'var(--ocs-game-accent, #4ecca3)'}`,
          borderRadius: '8px',
          padding: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          color: this.config.theme.textColor || 'var(--ocs-game-text, #e0e0e0)',
        });

        const img = document.createElement('img');
        img.src = theme.src;
        img.alt = theme.label;
        Object.assign(img.style, {
          width: '120px',
          height: '70px',
          objectFit: 'cover',
          borderRadius: '4px',
          marginBottom: '6px',
          pointerEvents: 'none',
          display: 'block',
        });

        const name = document.createElement('div');
        name.textContent = theme.label;
        Object.assign(name.style, {
          fontSize: '11px',
          color: this.config.theme.accentColor || 'var(--ocs-game-accent, #4ecca3)',
          wordBreak: 'break-word',
        });

        const meta = document.createElement('div');
        meta.textContent = theme.previewText;
        Object.assign(meta.style, {
          fontSize: '9px',
          marginTop: '4px',
          color: this.config.theme.secondaryTextColor || 'var(--ocs-game-muted, #c7f2d4)',
        });

        button.appendChild(img);
        button.appendChild(name);
        button.appendChild(meta);

        button.addEventListener('click', () => {
          selectedTheme = theme;
          updateSelectionStyles();
          if (typeof onPreview === 'function') {
            onPreview(theme);
          }
        });

        optionButtons.push({ button, theme });
        themeGrid.appendChild(button);
      });

      panel.appendChild(themeGrid);

      const buttonRow = document.createElement('div');
      Object.assign(buttonRow.style, {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
      });

      if (this.config.showCancel) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.textContent = this.config.cancelLabel;
        Object.assign(cancelBtn.style, {
          background: this.config.theme.secondaryButtonBackground || 'var(--ocs-game-surface-alt, #1a1a2e)',
          color: this.config.theme.secondaryButtonTextColor || 'var(--ocs-game-text, #e0e0e0)',
          border: `1px solid ${this.config.theme.borderColor || 'var(--ocs-game-accent, #4ecca3)'}`,
          borderRadius: '4px',
          padding: '12px 16px',
          fontFamily: this.config.fontFamily,
          cursor: 'pointer',
        });
        cancelBtn.addEventListener('click', () => this.close(null));
        buttonRow.appendChild(cancelBtn);
      }

      const doneBtn = document.createElement('button');
      doneBtn.type = 'button';
      doneBtn.textContent = this.config.confirmLabel;
      Object.assign(doneBtn.style, {
        background: this.config.theme.buttonBackground || 'var(--ocs-game-accent, #4ecca3)',
        color: this.config.theme.buttonTextColor || 'var(--ocs-game-surface-contrast, #0d0d1a)',
        border: 'none',
        borderRadius: '4px',
        padding: '12px 16px',
        fontFamily: this.config.fontFamily,
        fontWeight: 'bold',
        cursor: 'pointer',
      });
      doneBtn.addEventListener('click', () => this.close(selectedTheme));
      buttonRow.appendChild(doneBtn);

      panel.appendChild(buttonRow);
      overlay.appendChild(panel);

      this.activeOverlay = overlay;
      this.activeResolve = resolve;
      document.body.appendChild(overlay);

      updateSelectionStyles();
      if (selectedTheme && typeof onPreview === 'function') {
        onPreview(selectedTheme);
      }
    });
  }
}

export default WorldThemePicker;