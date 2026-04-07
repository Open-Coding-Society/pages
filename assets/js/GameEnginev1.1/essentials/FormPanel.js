class FormPanel {
  constructor(config = {}) {
    this.config = {
      id: 'ocs-form-panel',
      title: '',
      description: '',
      submitLabel: 'Submit',
      cancelLabel: 'Cancel',
      showCancel: false,
      closeOnBackdrop: false,
      className: 'ocs-form-panel',
      overlayClassName: 'ocs-form-panel-overlay',
      fields: [],
      mountTo: null,
      zIndex: '10000',
      width: '90%',
      maxWidth: '520px',
      padding: '24px 28px',
      borderRadius: '10px',
      gap: '12px',
      fontFamily: '"Courier New", monospace',
      theme: {},
      ...config,
    };

    this.activeOverlay = null;
    this.activeResolve = null;
  }

  getMountTarget() {
    if (typeof this.config.mountTo === 'function') {
      return this.config.mountTo() || document.body;
    }
    return this.config.mountTo || document.body;
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

  collectValues(inputs) {
    const values = {};

    for (const field of this.config.fields) {
      if (field.type === 'section') {
        continue;
      }

      const input = inputs[field.name];
      if (!input) {
        continue;
      }

      values[field.name] = typeof input.value === 'string'
        ? input.value.trim()
        : input.value;
    }

    return values;
  }

  show(initialValues = {}) {
    if (this.activeResolve) {
      this.close(null);
    }

    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.id = `${this.config.id}-overlay`;
      overlay.className = this.config.overlayClassName;

      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        zIndex: this.config.zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: this.config.theme.overlayBackground || 'var(--ocs-form-overlay-background)',
      });

      const panel = document.createElement('section');
      panel.id = this.config.id;
      panel.className = this.config.className;

      Object.assign(panel.style, {
        width: this.config.width,
        maxWidth: this.config.maxWidth,
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: this.config.padding,
        borderRadius: this.config.borderRadius,
        fontFamily: this.config.fontFamily,
        background: this.config.theme.background || 'var(--ocs-form-background)',
        border: `2px solid ${this.config.theme.borderColor || 'var(--ocs-form-border)'}`,
        color: this.config.theme.textColor || 'var(--ocs-form-text)',
        boxShadow: this.config.theme.boxShadow || 'none',
      });

      const title = document.createElement('div');
      Object.assign(title.style, {
        color: this.config.theme.accentColor || 'var(--ocs-form-accent)',
        fontSize: '16px',
        fontWeight: 'bold',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: '12px',
        textAlign: 'center',
      });
      title.textContent = this.config.title;
      panel.appendChild(title);

      if (this.config.description) {
        const description = document.createElement('div');
        Object.assign(description.style, {
          color: this.config.theme.secondaryTextColor || 'var(--ocs-form-secondary-text)',
          fontSize: '12px',
          lineHeight: '1.6',
          marginBottom: '16px',
          whiteSpace: 'pre-wrap',
        });
        description.textContent = this.config.description;
        panel.appendChild(description);
      }

      const form = document.createElement('form');
      Object.assign(form.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: this.config.gap,
      });

      const inputs = {};

      for (const field of this.config.fields) {
        if (field.type === 'section') {
          const section = document.createElement('div');
          section.textContent = field.title;
          Object.assign(section.style, {
            marginTop: field.marginTop || '8px',
            color: this.config.theme.accentColor || 'var(--ocs-form-accent)',
            fontSize: '11px',
            letterSpacing: '1px',
          });
          form.appendChild(section);
          continue;
        }

        const label = document.createElement('label');
        label.textContent = field.label;
        Object.assign(label.style, {
          color: this.config.theme.accentColor || 'var(--ocs-form-accent)',
          fontSize: '12px',
        });

        const input = document.createElement(field.multiline ? 'textarea' : 'input');
        if (!field.multiline) {
          input.type = field.type || 'text';
        } else {
          input.rows = field.rows || 3;
        }

        input.name = field.name;
        input.required = Boolean(field.required);
        input.placeholder = field.placeholder || '';
        input.autocomplete = field.autocomplete || 'off';
        input.value = initialValues[field.name] || field.value || '';

        Object.assign(input.style, {
          background: this.config.theme.inputBackground || 'var(--ocs-form-input-background)',
          border: `1px solid ${this.config.theme.borderColor || 'var(--ocs-form-border)'}`,
          borderRadius: '4px',
          padding: '8px',
          color: this.config.theme.textColor || 'var(--ocs-form-text)',
          fontFamily: this.config.fontFamily,
        });

        ['keydown', 'keyup', 'keypress'].forEach((eventType) => {
          input.addEventListener(eventType, (event) => event.stopPropagation());
        });

        form.appendChild(label);
        form.appendChild(input);
        inputs[field.name] = input;
      }

      const buttons = document.createElement('div');
      Object.assign(buttons.style, {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        marginTop: '8px',
      });

      if (this.config.showCancel) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.textContent = this.config.cancelLabel;
        Object.assign(cancelBtn.style, {
          background: this.config.theme.secondaryButtonBackground || 'var(--ocs-form-secondary-button-background)',
          color: this.config.theme.secondaryButtonTextColor || 'var(--ocs-form-secondary-button-text)',
          border: `1px solid ${this.config.theme.borderColor || 'var(--ocs-form-border)'}`,
          borderRadius: '4px',
          padding: '10px 14px',
          fontFamily: this.config.fontFamily,
          cursor: 'pointer',
        });
        cancelBtn.addEventListener('click', () => this.close(null));
        buttons.appendChild(cancelBtn);
      }

      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = this.config.submitLabel;
      Object.assign(submitBtn.style, {
        background: this.config.theme.buttonBackground || 'var(--ocs-form-button-background)',
        color: this.config.theme.buttonTextColor || 'var(--ocs-form-button-text)',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 14px',
        fontFamily: this.config.fontFamily,
        fontWeight: 'bold',
        cursor: 'pointer',
      });
      buttons.appendChild(submitBtn);

      form.appendChild(buttons);
      panel.appendChild(form);
      overlay.appendChild(panel);

      if (this.config.closeOnBackdrop) {
        overlay.addEventListener('pointerdown', (event) => {
          if (event.target === overlay) {
            this.close(null);
          }
        });
      }

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const values = this.collectValues(inputs);
        this.close(values);
      });

      this.activeOverlay = overlay;
      this.activeResolve = resolve;
      this.getMountTarget().appendChild(overlay);

      const firstInput = Object.values(inputs)[0];
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 0);
      }
    });
  }
}

export default FormPanel;
