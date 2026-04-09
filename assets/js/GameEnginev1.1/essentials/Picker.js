/**
 * Unified modal picker for selecting items (avatars, themes, etc.) from a grid.
 * Originally consolidated AvatarPicker and WorldThemePicker into a single reusable component.
 * 
 * @author OpenCS Team
 * @version 1.0
 */

class Picker {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.id - Unique identifier for the picker
   * @param {string} config.title - Title displayed at top of picker
   * @param {string} config.description - Optional description text
   * @param {string} config.confirmLabel - Label for confirm button (default: 'Done')
   * @param {string} config.cancelLabel - Label for cancel button (default: 'Cancel')
   * @param {boolean} config.showCancel - Whether to show cancel button (default: true)
   * @param {string} config.basePath - Base path for resolving relative item sources
   * @param {number} config.zIndex - Z-index for the overlay (default: 10000)
   * @param {string} config.fontFamily - Font family for picker UI
   * @param {Object} config.theme - Theme colors and styles
   * @param {Function} config.normalizer - Function to normalize items (item => normalizedItem)
   * @param {Object} config.gridStyle - Grid-specific styling configuration
   * @param {string} config.gridStyle.columns - CSS grid-template-columns value (default: 'repeat(auto-fill, minmax(110px, 1fr))')
   * @param {Object} config.imageStyle - Image-specific styling configuration
   * @param {string} config.imageStyle.maxWidth - CSS maxWidth for images (default: '80px')
   * @param {string} config.imageStyle.maxHeight - CSS maxHeight for images (default: '80px')
   * @param {string} config.imageStyle.width - CSS width for images
   * @param {string} config.imageStyle.height - CSS height for images
   * @param {string} config.imageStyle.objectFit - CSS object-fit for images
   * @param {string} config.imageStyle.imageRendering - CSS image-rendering (default: 'pixelated')
   * @param {string} config.imageStyle.display - CSS display for images
   * @param {string} config.imageStyle.borderRadius - CSS border-radius for images
   * @param {string} config.imageStyle.marginBottom - CSS margin-bottom for images (default: '4px')
   */
  constructor(config = {}) {
    this.config = {
      id: config.id || 'picker',
      title: config.title || 'Select an Option',
      description: config.description || '',
      confirmLabel: config.confirmLabel || 'Done',
      cancelLabel: config.cancelLabel || 'Cancel',
      showCancel: config.showCancel !== undefined ? config.showCancel : true,
      basePath: config.basePath || '',
      zIndex: config.zIndex || 10000,
      fontFamily: config.fontFamily || 'Orbitron, monospace',
      theme: config.theme || {},
      normalizer: config.normalizer || ((item) => ({ rows: 1, cols: 1, ...item })),
      gridStyle: {
        columns: 'repeat(auto-fill, minmax(110px, 1fr))',
        ...(config.gridStyle || {})
      },
      imageStyle: {
        maxWidth: '80px',
        maxHeight: '80px',
        imageRendering: 'pixelated',
        marginBottom: '4px',
        ...(config.imageStyle || {})
      }
    };

    this.activeOverlay = null;
    this.activeResolve = null;
  }

  /**
   * Resolve an item's source path (absolute or relative to basePath).
   */
  resolveSrc(src) {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
      return src;
    }
    return this.config.basePath ? `${this.config.basePath}/${src}` : src;
  }

  /**
   * Close the picker and resolve the promise.
   */
  close(selectedItem) {
    if (this.activeOverlay) {
      this.activeOverlay.remove();
      this.activeOverlay = null;
    }
    if (this.activeResolve) {
      this.activeResolve(selectedItem);
      this.activeResolve = null;
    }
  }

  /**
   * Show the picker modal.
   * @param {Array} items - Array of items to display
   * @param {Object|string|null} initialSelection - Initially selected item (object, id, or src) (optional)
   * @param {Function|null} onPreview - Callback when an item is selected (optional)
   * @returns {Promise} Resolves with selected item or null if cancelled
   */
  show(items = [], initialSelection = null, onPreview = null) {
    return new Promise((resolve) => {
      // Close any existing picker
      if (this.activeOverlay) {
        this.close(null);
      }

      // Normalize all items using the configured normalizer
      const normalizedItems = items.map(item => {
        const normalized = this.config.normalizer(item);
        // Resolve src path
        if (normalized.src) {
          normalized.src = this.resolveSrc(normalized.src);
        }
        return normalized;
      });

      // Find initially selected item - support object, id string, or src string
      let selectedItem = null;
      if (initialSelection) {
        if (typeof initialSelection === 'object') {
          selectedItem = normalizedItems.find(item => 
            item.id === initialSelection.id || 
            item.rawSrc === initialSelection.rawSrc || 
            item.src === initialSelection.src
          ) || null;
        } else {
          // String: match by id, src, or rawSrc
          selectedItem = normalizedItems.find(item => 
            item.id === initialSelection || 
            item.rawSrc === initialSelection || 
            item.src === initialSelection
          ) || null;
        }
      }
      // Default to first item if no match
      if (!selectedItem && normalizedItems.length > 0) {
        selectedItem = normalizedItems[0];
      }

      // Create overlay
      const overlay = document.createElement('div');
      overlay.id = `${this.config.id}-overlay`;
      Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: this.config.theme.overlayBackground || 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: String(this.config.zIndex),
        backdropFilter: 'blur(3px)',
      });

      // Create panel
      const panel = document.createElement('div');
      panel.id = `${this.config.id}-panel`;
      Object.assign(panel.style, {
        maxWidth: '600px',
        minWidth: '320px',
        maxHeight: '75vh',
        overflowY: 'auto',
        background: this.config.theme.background || 'var(--ocs-game-panel-bg, rgba(13,13,26,0.92))',
        border: `2px solid ${this.config.theme.borderColor || 'var(--ocs-game-accent, #4ecca3)'}`,
        borderRadius: '12px',
        padding: '24px 28px',
        fontFamily: this.config.fontFamily,
        color: this.config.theme.textColor || 'var(--ocs-game-text, #e0e0e0)',
        boxShadow: this.config.theme.boxShadow || '0 0 20px rgba(78,204,163,0.18)',
      });

      // Title
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

      // Description
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

      // Item grid
      const itemGrid = document.createElement('div');
      Object.assign(itemGrid.style, {
        display: 'grid',
        gridTemplateColumns: this.config.gridStyle.columns,
        gap: '12px',
        marginBottom: '18px',
      });

      const optionButtons = [];

      // Update selection styles
      const updateSelectionStyles = () => {
        optionButtons.forEach(({ button, item }) => {
          const isSelected = selectedItem?.id === item.id;
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

      // Create item buttons
      normalizedItems.forEach((item) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `Select ${item.label}`);
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

        // Image - use sprite cell (0,0) for sprite sheets, full image otherwise
        const isSpriteSheet = item.rows > 1 || item.cols > 1;
        let imageElement;
        
        if (isSpriteSheet) {
          // For sprite sheets, use a div with background-image to show only cell (0,0)
          imageElement = document.createElement('div');
          imageElement.setAttribute('role', 'img');
          imageElement.setAttribute('aria-label', item.label);
          
          // Convert maxWidth/maxHeight to explicit width/height for background-image divs
          const width = this.config.imageStyle.width || this.config.imageStyle.maxWidth || '80px';
          const height = this.config.imageStyle.height || this.config.imageStyle.maxHeight || '80px';
          
          const baseStyle = {
            pointerEvents: 'none',
            backgroundImage: `url(${item.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${item.cols * 100}% ${item.rows * 100}%`,
            backgroundPosition: '0% 0%',
            width: width,
            height: height,
            margin: '0 auto',
            ...this.config.imageStyle
          };
          Object.assign(imageElement.style, baseStyle);
        } else {
          // For single images, use regular img tag
          imageElement = document.createElement('img');
          imageElement.src = item.src;
          imageElement.alt = item.label;
          Object.assign(imageElement.style, {
            pointerEvents: 'none',
            display: 'block',
            margin: '0 auto',
            ...this.config.imageStyle
          });
        }

        // Label
        const name = document.createElement('div');
        name.textContent = item.label;
        Object.assign(name.style, {
          fontSize: '11px',
          color: this.config.theme.accentColor || 'var(--ocs-game-accent, #4ecca3)',
          wordBreak: 'break-word',
        });

        // Preview text
        const meta = document.createElement('div');
        meta.textContent = item.previewText;
        Object.assign(meta.style, {
          fontSize: '9px',
          marginTop: '4px',
          color: this.config.theme.secondaryTextColor || 'var(--ocs-game-muted, #c7f2d4)',
        });

        button.appendChild(imageElement);
        button.appendChild(name);
        button.appendChild(meta);

        button.addEventListener('click', () => {
          selectedItem = item;
          updateSelectionStyles();
          if (typeof onPreview === 'function') {
            onPreview(item);
          }
        });

        optionButtons.push({ button, item });
        itemGrid.appendChild(button);
      });

      panel.appendChild(itemGrid);

      // Button row
      const buttonRow = document.createElement('div');
      Object.assign(buttonRow.style, {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
      });

      // Cancel button
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

      // Confirm button
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
      doneBtn.addEventListener('click', () => this.close(selectedItem));
      buttonRow.appendChild(doneBtn);

      panel.appendChild(buttonRow);
      overlay.appendChild(panel);

      this.activeOverlay = overlay;
      this.activeResolve = resolve;
      document.body.appendChild(overlay);

      updateSelectionStyles();
      if (selectedItem && typeof onPreview === 'function') {
        onPreview(selectedItem);
      }
    });
  }
}

export default Picker;
