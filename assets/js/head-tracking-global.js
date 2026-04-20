(function () {
  const STORAGE_KEY = 'headTrackingPreferences';
  const DEFAULT_STATE = { enabled: false, sensitivity: 0.45 };

  let state = { ...DEFAULT_STATE };
  let stream = null;
  let video = null;
  let cursorEl = null;
  let rafId = null;
  let faceLandmarker = null;
  let visionModule = null;
  let lastPoint = null;
  let initialized = false;

  const ui = {
    toggleEl: null,
    sensitivityEl: null,
    sensitivityLabelEl: null,
    statusEl: null,
    onToggle: null,
    onSensitivity: null
  };

  function clampSensitivity(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return DEFAULT_STATE.sensitivity;
    return Math.min(0.9, Math.max(0.1, n));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      state.enabled = !!parsed.enabled;
      state.sensitivity = clampSensitivity(parsed.sensitivity);
    } catch (e) {
      console.error('head tracking load state error', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('head tracking save state error', e);
    }
  }

  function setStatus(message, isError) {
    if (!ui.statusEl) return;
    ui.statusEl.textContent = message;
    ui.statusEl.style.color = isError ? '#f87171' : '';
  }

  function syncUi() {
    if (ui.toggleEl) ui.toggleEl.checked = !!state.enabled;
    if (ui.sensitivityEl) ui.sensitivityEl.value = String(state.sensitivity);
    if (ui.sensitivityLabelEl) ui.sensitivityLabelEl.textContent = state.sensitivity.toFixed(2);
  }

  function ensureCursor() {
    if (cursorEl) return;
    const el = document.createElement('div');
    el.id = 'head-tracking-cursor';
    el.style.position = 'fixed';
    el.style.width = '18px';
    el.style.height = '18px';
    el.style.border = '2px solid #22d3ee';
    el.style.borderRadius = '9999px';
    el.style.background = 'rgba(34, 211, 238, 0.15)';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '99999';
    el.style.transform = 'translate(-9999px, -9999px)';
    el.style.boxShadow = '0 0 12px rgba(34, 211, 238, 0.5)';
    document.body.appendChild(el);
    cursorEl = el;
  }

  function showCursor(x, y) {
    if (!cursorEl) return;
    cursorEl.style.transform = 'translate(' + Math.round(x - 9) + 'px, ' + Math.round(y - 9) + 'px)';
  }

  function hideCursor() {
    if (!cursorEl) return;
    cursorEl.style.transform = 'translate(-9999px, -9999px)';
  }

  async function ensureLandmarker() {
    if (!visionModule) {
      visionModule = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm');
    }

    if (!faceLandmarker) {
      const fileset = await visionModule.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );
      faceLandmarker = await visionModule.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
        },
        runningMode: 'VIDEO',
        numFaces: 1
      });
    }
  }

  function stopTracking() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }

    if (video) {
      video.pause();
      video.srcObject = null;
    }

    lastPoint = null;
    hideCursor();
  }

  function runLoop() {
    if (!state.enabled || !faceLandmarker || !video) return;

    const tick = function () {
      if (!state.enabled || !faceLandmarker || !video) return;

      if (video.readyState >= 2) {
        const result = faceLandmarker.detectForVideo(video, performance.now());
        const landmarks = result && result.faceLandmarks && result.faceLandmarks[0];
        const nose = landmarks && landmarks[1];

        if (nose) {
          const targetX = (1 - nose.x) * window.innerWidth;
          const targetY = nose.y * window.innerHeight;
          const alpha = clampSensitivity(state.sensitivity);

          if (!lastPoint) {
            lastPoint = { x: targetX, y: targetY };
          } else {
            lastPoint.x += (targetX - lastPoint.x) * alpha;
            lastPoint.y += (targetY - lastPoint.y) * alpha;
          }

          const x = Math.max(0, Math.min(window.innerWidth - 1, lastPoint.x));
          const y = Math.max(0, Math.min(window.innerHeight - 1, lastPoint.y));

          showCursor(x, y);

          const moveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
          });

          window.dispatchEvent(moveEvent);
          const target = document.elementFromPoint(x, y);
          if (target) target.dispatchEvent(moveEvent);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
  }

  async function startTracking() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('Camera API is not available in this browser.', true);
      state.enabled = false;
      saveState();
      syncUi();
      return;
    }

    setStatus('Requesting camera access...', false);

    try {
      ensureCursor();
      await ensureLandmarker();

      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (!video) {
        video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.style.position = 'fixed';
        video.style.width = '1px';
        video.style.height = '1px';
        video.style.opacity = '0';
        video.style.pointerEvents = 'none';
        video.style.left = '-9999px';
        document.body.appendChild(video);
      }

      video.srcObject = stream;
      await video.play();

      lastPoint = null;
      runLoop();
      setStatus('Head tracking active. Move your head to steer the cursor.', false);
    } catch (e) {
      console.error('head tracking start error', e);
      stopTracking();
      state.enabled = false;
      saveState();
      syncUi();
      setStatus('Could not start head tracking. Check camera permission.', true);
    }
  }

  async function setEnabled(enabled) {
    const nextEnabled = !!enabled;
    if (state.enabled === nextEnabled && ((nextEnabled && stream) || !nextEnabled)) {
      syncUi();
      return;
    }

    state.enabled = nextEnabled;
    saveState();
    syncUi();

    if (!state.enabled) {
      stopTracking();
      setStatus('Head tracking disabled.', false);
      return;
    }

    await startTracking();
  }

  function bindDashboardControls(config) {
    const cfg = config || {};

    if (ui.toggleEl && ui.onToggle) ui.toggleEl.removeEventListener('change', ui.onToggle);
    if (ui.sensitivityEl && ui.onSensitivity) ui.sensitivityEl.removeEventListener('input', ui.onSensitivity);

    ui.toggleEl = document.getElementById(cfg.toggleId || 'pref-head-tracking-enabled');
    ui.sensitivityEl = document.getElementById(cfg.sensitivityId || 'pref-head-tracking-sensitivity');
    ui.sensitivityLabelEl = document.getElementById(cfg.sensitivityLabelId || 'head-tracking-sensitivity-label');
    ui.statusEl = document.getElementById(cfg.statusId || 'head-tracking-status');

    if (!ui.toggleEl) return;

    syncUi();
    setStatus(state.enabled ? 'Head tracking active.' : 'Head tracking is off.', false);

    ui.onToggle = function (e) {
      setEnabled(!!e.target.checked);
    };
    ui.toggleEl.addEventListener('change', ui.onToggle);

    if (ui.sensitivityEl) {
      ui.onSensitivity = function (e) {
        state.sensitivity = clampSensitivity(e.target.value);
        saveState();
        syncUi();
      };
      ui.sensitivityEl.addEventListener('input', ui.onSensitivity);
    }
  }

  function getState() {
    return { ...state };
  }

  async function clearAndDisable() {
    stopTracking();
    state = { ...DEFAULT_STATE };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('head tracking clear state error', e);
    }
    syncUi();
    setStatus('Head tracking disabled.', false);
  }

  function initGlobal() {
    if (initialized) return;
    initialized = true;

    loadState();
    ensureCursor();

    if (state.enabled) {
      setEnabled(true);
    }

    window.addEventListener('beforeunload', function () {
      stopTracking();
    });
  }

  window.HeadTrackingGlobal = {
    STORAGE_KEY,
    getState,
    setEnabled,
    bindDashboardControls,
    clearAndDisable,
    initGlobal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobal, { once: true });
  } else {
    initGlobal();
  }
})();
