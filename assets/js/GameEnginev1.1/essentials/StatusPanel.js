class StatusPanel {
  constructor(config = {}) {
    this.config = {
      id: 'ocs-status-panel',
      title: '',
      fields: [],
      actions: [], // Array of { label, onClick, danger, title }
      className: 'ocs-status-panel',
      mountTo: null,
      width: '260px',
      padding: '12px 14px',
      borderRadius: '10px',
      zIndex: '10000',
      fontFamily: '"Courier New", monospace',
      position: { top: '16px', left: '16px' },
      theme: {},
      ...config,
    };

    this.element = null;
    this.fieldElements = new Map();
    this.actionElements = [];
    this.collapsed = false;
  }

  getMountTarget() {
    if (typeof this.config.mountTo === 'function') {
      return this.config.mountTo() || document.body;
    }
    return this.config.mountTo || document.body;
  }

  ensureMounted() {
    if (!this.element || !this.element.isConnected) {
      this.render();
    }
    return this.element;
  }

  render() {
    if (this.element?.isConnected) {
      this.element.remove();
    }

    const panel = document.createElement('section');
    panel.id = this.config.id;
    panel.className = this.config.className;

    Object.assign(panel.style, {
      position: 'fixed',
      top: this.config.position?.top || '16px',
      left: this.config.position?.left || '16px',
      zIndex: this.config.zIndex,
      width: this.collapsed ? 'auto' : this.config.width,
      padding: this.collapsed ? '6px 10px' : this.config.padding,
      borderRadius: this.config.borderRadius,
      fontFamily: this.config.fontFamily,
      background: this.config.theme.background || 'var(--ocs-status-panel-background)',
      border: `1px solid ${this.config.theme.borderColor || 'var(--ocs-status-panel-border)'}`,
      color: this.config.theme.textColor || 'var(--ocs-status-panel-text)',
      boxShadow: this.config.theme.boxShadow || 'none',
    });

    const title = document.createElement('div');
    Object.assign(title.style, {
      color: this.config.theme.accentColor || 'var(--ocs-status-panel-accent)',
      fontSize: '12px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    });
    title.textContent = this.config.title;
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '−';
    Object.assign(toggleBtn.style, {
      background: 'transparent',
      border: 'none',
      color: this.config.theme.accentColor || 'var(--ocs-status-panel-accent)',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      lineHeight: '1',
      padding: '0 2px',
      fontFamily: this.config.fontFamily,
      position: 'relative',
    });
    toggleBtn.title = 'Minimize panel';
    toggleBtn.addEventListener('click', () => this.setCollapsed(!this.collapsed));
    title.appendChild(toggleBtn);
    this._toggleBtn = toggleBtn;
    panel.appendChild(title);
    const body = document.createElement('div');
    body.style.display = this.collapsed ? 'none' : 'block';
    this._bodyEl = body;
    panel.appendChild(body);

    this.fieldElements.clear();

    for (const field of this.config.fields) {
      if (field.type === 'section') {
        const section = document.createElement('div');
        Object.assign(section.style, {
          marginTop: field.marginTop || '8px',
          color: this.config.theme.accentColor || 'var(--ocs-status-panel-accent)',
          fontSize: '11px',
          letterSpacing: '1px',
        });
        section.textContent = field.title;
        body.appendChild(section);
        continue;
      }

      const row = document.createElement('div');
      row.dataset.field = field.key;
      row.textContent = `${field.label}: ${field.emptyValue || '—'}`;
      body.appendChild(row);
      this.fieldElements.set(field.key, row);
    }

    // Render action buttons if provided
    if (this.config.actions && this.config.actions.length > 0) {
      const actionsContainer = document.createElement('div');
      Object.assign(actionsContainer.style, {
        marginTop: '12px',
        paddingTop: '10px',
        borderTop: `1px solid ${this.config.theme.borderColor || 'var(--ocs-status-panel-border)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      });

      this.actionElements = [];
      for (const action of this.config.actions) {
        const btn = document.createElement('button');
        btn.textContent = action.label;
        if (action.title) {
          btn.title = action.title;
        }

        const bgColor = action.danger 
          ? '#d32f2f'
          : (this.config.theme.secondaryButtonBackground || 'var(--ocs-status-panel-button-bg)');
        const textColor = action.danger
          ? '#fff'
          : (this.config.theme.secondaryButtonTextColor || 'var(--ocs-status-panel-button-text)');
        const borderColor = action.danger
          ? '#d32f2f'
          : (this.config.theme.borderColor || 'var(--ocs-status-panel-border)');

        Object.assign(btn.style, {
          padding: '6px 10px',
          borderRadius: '4px',
          fontFamily: this.config.fontFamily,
          fontSize: '11px',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          background: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        });

        btn.addEventListener('mouseenter', () => {
          if (action.danger) {
            btn.style.background = '#b71c1c';
          } else {
            btn.style.opacity = '0.8';
          }
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = bgColor;
          btn.style.opacity = '1';
        });

        if (action.onClick) {
          btn.addEventListener('click', action.onClick);
        }

        actionsContainer.appendChild(btn);
        this.actionElements.push(btn);
      }

      body.appendChild(actionsContainer);
    }

    this.getMountTarget().appendChild(panel);
    this.element = panel;
    return panel;
  }

  update(values = {}) {
    this.ensureMounted();

    for (const field of this.config.fields) {
      if (field.type === 'section') {
        continue;
      }

      const row = this.fieldElements.get(field.key);
      if (!row) {
        continue;
      }

      const value = values[field.key];
      row.textContent = `${field.label}: ${value || field.emptyValue || '—'}`;
    }
  }

  setCollapsed(collapsed) {
    this.collapsed = collapsed;
    if (this._bodyEl) {
      this._bodyEl.style.display = collapsed ? 'none' : 'block';
    }
    if (this.element) {
      this.element.style.padding = collapsed ? '6px 10px' : this.config.padding;
      this.element.style.width = collapsed ? 'auto' : this.config.width;
      this.element.style.minWidth = collapsed ? '0' : '';
    }

    if (this._toggleBtn) {
      this._toggleBtn.textContent = collapsed ? '+' : '−';
      this._toggleBtn.title = collapsed ? 'Expand panel' : 'Minimize panel';
    }
  }

  destroy() {
    if (this.element?.isConnected) {
      this.element.remove();
    }
    this.element = null;
    this.fieldElements.clear();
  }
}

export default StatusPanel;
