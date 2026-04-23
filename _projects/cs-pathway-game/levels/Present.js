// Shared presentation manager for HUD-style game UI.
// Owns stateful panel/toast/alerts/score elements and keeps their
// placement/styles consistent across levels.
class Present {
  constructor(level, options = {}) {
    this.level = level;
    this.options = {
      toastDuration: Number(options.toastDuration || 2200),
      ignoreToasts: new Set(options.ignoreToasts || []),
      isActiveLevel: typeof options.isActiveLevel === 'function' ? options.isActiveLevel : () => true,
    };

    this.nodes = {
      panel: null,
      toast: null,
      alerts: null,
      score: null,
    };

    this.toastTimer = null;
    // Keep one stable listener so we can safely add/remove it.
    this._boundViewportSync = () => this._syncNodeStylesForViewport();

    this._ensureBaseStylesheet();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this._boundViewportSync);
    }
  }

  panel(msg = '') {
    return this._renderPersistent('panel', msg);
  }

  toast(msg = '') {
    // Toasts are transient and ignored when level is inactive.
    if (!msg || this.options.ignoreToasts.has(msg) || !this._isActiveLevel()) {
      return null;
    }

    if (this.nodes.toast?.parentNode) {
      this.nodes.toast.parentNode.removeChild(this.nodes.toast);
    }

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    const node = this._createNode('toast');
    node.innerHTML = msg;

    this.toastTimer = setTimeout(() => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }

      if (this.nodes.toast === node) {
        this.nodes.toast = null;
      }

      this.toastTimer = null;
    }, this.options.toastDuration);

    return node;
  }

  alerts(msg = '') {
    return this._renderPersistent('alerts', msg);
  }

  score(msg = '') {
    return this._renderPersistent('score', msg);
  }

  clearPanel() {
    this._removeNode('panel');
  }

  clearToast() {
    this._removeNode('toast');
  }

  clearAlerts() {
    this._removeNode('alerts');
  }

  clearScore() {
    this._removeNode('score');
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this._boundViewportSync);
    }

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }

    this._removeNode('toast');
    this._removeNode('alerts');
    this._removeNode('panel');
    this._removeNode('score');
  }

  _renderPersistent(kind, msg) {
    // Persistent surfaces (panel/alerts/score) update in place until cleared.
    if (!this._isActiveLevel()) {
      return null;
    }

    const hasMessage = msg !== null && msg !== undefined && String(msg).trim() !== '';
    if (!hasMessage) {
      this._removeNode(kind);
      return null;
    }

    const node = this.nodes[kind] || this._createNode(kind);
    node.innerHTML = msg;
    this._styleContent(kind, node);
    return node;
  }

  _createNode(kind) {
    const host = this._getHost();
    if (!host) {
      return null;
    }

    const node = document.createElement('div');
    // Keep class naming predictable for debugging and optional theming hooks.
    node.className = `present present-${kind}`;
    node.setAttribute('aria-live', 'polite');
    this._applyNodeStyle(kind, node);
    host.appendChild(node);
    this.nodes[kind] = node;
    return node;
  }

  _removeNode(kind) {
    const node = this.nodes[kind];
    if (node?.parentNode) {
      node.parentNode.removeChild(node);
    }

    this.nodes[kind] = null;
  }

  _isActiveLevel() {
    try {
      // The level decides whether UI should currently be visible.
      return Boolean(this.options.isActiveLevel());
    } catch (_error) {
      return true;
    }
  }

  _getHost() {
    if (typeof document === 'undefined') {
      return null;
    }

    return document.body || null;
  }

  _ensureBaseStylesheet() {
    if (typeof document === 'undefined') {
      return;
    }

    if (document.getElementById('cs-path-present-base-style')) {
      return;
    }

    // Minimal shared rule so links inside messages inherit the panel theme.
    const style = document.createElement('style');
    style.id = 'cs-path-present-base-style';
    style.textContent = `
      .present a,
      .present a:visited,
      .present a:hover,
      .present a:active {
        color: inherit;
        text-decoration: underline;
      }
    `;
    document.head?.appendChild(style);
  }

  _syncNodeStylesForViewport() {
    // Recompute styles for existing nodes when viewport crosses compact layout thresholds.
    Object.entries(this.nodes).forEach(([kind, node]) => {
      if (!node) return;
      this._applyNodeStyle(kind, node);
      this._styleContent(kind, node);
    });
  }

  _applyNodeStyle(kind, node) {
    // Layout switches at <= 900px to keep overlays readable on smaller screens.
    const compact = typeof window !== 'undefined' && window.innerWidth <= 900;

    const base = {
      position: 'fixed',
      right: compact ? '12px' : '20px',
      zIndex: '1200',
      pointerEvents: 'none',
      width: compact ? 'min(420px, calc(100vw - 24px))' : 'min(360px, 32vw)',
      maxWidth: 'calc(100vw - 24px)',
      borderRadius: '10px',
      border: '2px solid var(--ocs-game-accent, #4ecca3)',
      background: 'var(--ocs-game-panel-bg, rgba(13, 13, 26, 0.95))',
      color: 'var(--ocs-game-text, #e8f2ef)',
      fontFamily: 'Courier New, monospace',
      fontSize: '13px',
      lineHeight: '1.35',
      letterSpacing: '0.35px',
      boxShadow: '0 0 20px rgba(78, 204, 163, 0.22)',
      padding: '10px 14px',
      top: '20px',
      bottom: 'auto',
    };

    const overridesByKind = {
      toast: {
        top: compact ? '12px' : '20px',
        zIndex: '1200',
      },
      alerts: {
        top: compact ? '72px' : '84px',
        zIndex: '1201',
      },
      panel: {
        top: compact ? '132px' : '148px',
        zIndex: '1202',
      },
      score: {
        top: 'auto',
        bottom: compact ? '12px' : '20px',
        right: compact ? '12px' : '20px',
        zIndex: '1203',
        minWidth: '220px',
        border: '2px solid var(--ocs-game-score-accent, #f59e0b)',
        boxShadow: '0 0 20px rgba(245, 158, 11, 0.24)',
      },
    };

    const styles = { ...base, ...(overridesByKind[kind] || {}) };
    Object.assign(node.style, styles);
  }

  _styleContent(kind, node) {
    if (!node) {
      return;
    }

    // Only score has structured inner markup with sub-elements to style.
    if (kind !== 'score') {
      return;
    }

    const title = node.querySelector('.present-score-title');
    if (title) {
      Object.assign(title.style, {
        fontSize: '11px',
        marginBottom: '6px',
        textTransform: 'uppercase',
        opacity: '0.8',
      });
    }

    const main = node.querySelector('.present-score-main');
    if (main) {
      Object.assign(main.style, {
        fontSize: '24px',
        fontWeight: '700',
        lineHeight: '1',
        marginBottom: '6px',
      });
    }

    const sub = node.querySelector('.present-score-sub');
    if (sub) {
      Object.assign(sub.style, {
        fontSize: '13px',
        marginBottom: '10px',
        opacity: '0.9',
      });
    }

    const track = node.querySelector('.present-progress-track');
    if (track) {
      Object.assign(track.style, {
        height: '8px',
        borderRadius: '999px',
        background: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
      });
    }

    const bar = node.querySelector('.present-progress-bar');
    if (bar) {
      Object.assign(bar.style, {
        height: '100%',
        borderRadius: 'inherit',
        background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #fde68a)',
      });
    }
  }
}

export default Present;