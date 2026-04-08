class StatusPanel {
  constructor(config = {}) {
    this.config = {
      id: 'ocs-status-panel',
      title: '',
      fields: [],
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
      width: this.config.width,
      padding: this.config.padding,
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
    });
    title.textContent = this.config.title;
    panel.appendChild(title);

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
        panel.appendChild(section);
        continue;
      }

      const row = document.createElement('div');
      row.dataset.field = field.key;
      row.textContent = `${field.label}: ${field.emptyValue || '—'}`;
      panel.appendChild(row);
      this.fieldElements.set(field.key, row);
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

  destroy() {
    if (this.element?.isConnected) {
      this.element.remove();
    }
    this.element = null;
    this.fieldElements.clear();
  }
}

export default StatusPanel;
