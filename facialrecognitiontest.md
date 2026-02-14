---
layout: page
title: Security Dashboard
permalink: /facialrecognitiontest/
---

<div class="dashboard-container">
  <!-- Main Feed Area -->
  <div class="main-feed">
    <div class="video-wrapper">
      <div class="live-indicator">LIVE</div>
      <video id="video" autoplay playsinline></video>
      <div class="overlay-controls">
         <div id="status" class="status-badge">System Ready</div>
      </div>
    </div>

    <!-- Control Panel -->
    <div class="control-panel">
      <div class="input-group">
        <input id="labelInput" placeholder="Enter Label (e.g. Officer Name)" />
      </div>
      <div class="action-buttons">
        <button id="identifyBtn" class="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          Scan & Identify
        </button>
        <button id="saveBtn" class="btn btn-secondary">Register New Face</button>
        <button id="saveLocalBtn" class="btn btn-outline">Save Local</button>
      </div>
      <div class="danger-zone">
        <button id="deleteAllBtn" class="btn btn-danger">Reset Database</button>
      </div>
    </div>
  </div>

</div>

<style>
/* ---------------- Base ---------------- */

:root {
  --bg-dark: #121212;
  --bg-card: #1e1e1e;
  --text-main: #e0e0e0;
  --text-muted: #a0a0a0;
  --accent: #3b82f6;
  --danger: #ef4444;
  --success: #10b981;
  --border: #333;
}

body {
  background-color: var(--bg-dark);
}

/* Force Title Centering */
h1, .page-title, .post-title, .post-header {
  text-align: center !important;
  width: 100%;
  display: block;
  margin-top: 20px;
}



/* ---------------- Layout ---------------- */

.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: 600px;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--text-main);

  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
}

/* CSS override removed */

@media (max-width: 900px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    max-width: 800px;
  }
}

/* ---------------- Main Feed ---------------- */

.main-feed {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 100%;
}

.video-wrapper {
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 800px;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
}

video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.live-indicator {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
  animation: pulse 2s infinite;
}

.status-badge {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(0,0,0,0.7);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid var(--border);
  color: #fff;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* ---------------- Control Panel ---------------- */

.control-panel {
  background: var(--bg-card);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  width: 100%;
  max-width: 800px;
}

/* Centering Overrides Removed */

/* ---------------- Inputs & Buttons ---------------- */

.control-panel {
  flex-direction: column;
  align-items: center;
}

.input-group {
  width: 100%;
  max-width: 420px;
}

input {
  width: 100%;
  background: #2a2a2a;
  border: 1px solid var(--border);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  outline: none;
}

input:focus {
  border-color: var(--accent);
}

.action-buttons,
.danger-zone {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 10px;
  flex-wrap: wrap;
}

/* ---------------- Buttons ---------------- */

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: #2563eb; }

.btn-secondary { background: #4b5563; color: white; }
.btn-secondary:hover { background: #374151; }

.btn-outline {
  background: transparent;
  border: 1px solid #4b5563;
  color: #ccc;
}
.btn-outline:hover { border-color: #fff; color: #fff; }

.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  border: 1px solid var(--danger);
}
.btn-danger:hover { background: rgba(239, 68, 68, 0.2); }

/* ---------------- Sidebar Removed ---------------- */

</style>

<script>
const API_BASE = 'http://localhost:8587/api/identify';

async function startCamera() {
  const video = document.getElementById('video');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    await video.play();
  } catch (e) {
    updateStatus('Camera error: ' + e.message, 'error');
  }
}

function updateStatus(msg, type = 'normal') {
  const el = document.getElementById('status');
  el.innerText = msg;
  if (type === 'error') el.style.color = '#ef4444';
  else if (type === 'success') el.style.color = '#10b981';
  else el.style.color = '#fff';
}

function captureImageData() {
  const video = document.getElementById('video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 320;
  canvas.height = video.videoHeight || 240;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  const base64 = dataUrl.split(',')[1];
  return { dataUrl, base64 };
}

function saveToLocal(label, base64) {
  const key = 'fr_saved_v1';
  const all = JSON.parse(localStorage.getItem(key) || '{}');
  if (!all[label]) all[label] = [];
  all[label].push({ image: base64, ts: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(all));
  renderSaved();
  updateStatus('Saved locally: ' + label, 'success');
}

async function saveToServer(label, base64) {
  updateStatus('Saving to server...');
  try {
    const res = await fetch(API_BASE + '/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64, label })
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.message || 'Server error');
    updateStatus('Registered: ' + label, 'success');
  } catch (e) {
    updateStatus('Server error: ' + e.message, 'error');
  }
}

async function identify(base64) {
  updateStatus('Scanning database...');
  try {
    const res = await fetch(API_BASE + '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64 })
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.message || 'Server error');

    if (j.match) updateStatus(`IDENTIFIED: ${j.name}`, 'success');
    else updateStatus('NO MATCH FOUND', 'error');

  } catch (e) {
    updateStatus('ID Error: ' + e.message, 'error');
  }
}

function renderSaved() {
  // Sidebar removed
}

document.getElementById('saveBtn').addEventListener('click', async () => {
  const label = document.getElementById('labelInput').value.trim();
  if (!label) { updateStatus('Enter a label first!', 'error'); return; }
  const { base64 } = captureImageData();
  await saveToServer(label, base64);
  saveToLocal(label, base64);
});

document.getElementById('saveLocalBtn').addEventListener('click', () => {
  const label = document.getElementById('labelInput').value.trim() || 'Unknown';
  const { base64 } = captureImageData();
  saveToLocal(label, base64);
});

document.getElementById('identifyBtn').addEventListener('click', async () => {
  const { base64 } = captureImageData();
  await identify(base64);
});

document.getElementById('deleteAllBtn').addEventListener('click', async () => {
  if (!confirm("⚠️ Delete ALL faces from Server & Local history?")) return;

  updateStatus('Deleting...');
  try {
    const res = await fetch(API_BASE + '/delete_all', { method: 'DELETE' });
    const j = await res.json();
    if (!res.ok) throw new Error(j.message || 'Server error');

    updateStatus('System Reset Complete', 'success');
    localStorage.removeItem('fr_saved_v1');
    renderSaved();

  } catch (e) {
    updateStatus('Delete Failed: ' + e.message, 'error');
  }
});

startCamera();
renderSaved();
</script>
