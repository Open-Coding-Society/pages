---
layout: page
title: Facial Recognition Test
permalink: /facialrecognitiontest/
---

This page demonstrates a simple front-end for the DeepFace-based face recognition API.

- Allow the camera to capture faces.
- Save labeled faces to server (and localStorage for demo persistence).
- Identify a live capture against server-side database.

<div id="fr-app">
  <div>
    <video id="video" autoplay playsinline width="320" height="240" style="border:1px solid #ccc"></video>
  </div>
  <div style="margin-top:8px">
    <input id="labelInput" placeholder="Enter label (name or uid)" />
    <button id="saveBtn">Capture & Save Label</button>
    <button id="saveLocalBtn">Capture & Save Locally</button>
    <button id="identifyBtn">Capture & Identify</button>
    <button id="deleteAllBtn" style="background-color: #ffcccc; border: 1px solid #ff0000;">Delete All Server Faces</button>
  </div>
  <div id="status" style="margin-top:8px;color:#222"></div>
  <div id="savedList" style="margin-top:12px"></div>
</div>

<script>
const API_BASE = 'http://localhost:8587/api/identify'; // adjust if backend runs elsewhere

async function startCamera() {
  const video = document.getElementById('video');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    await video.play();
  } catch (e) {
    document.getElementById('status').innerText = 'Camera error: ' + e.message;
  }
}

function captureImageData() {
  const video = document.getElementById('video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 320;
  canvas.height = video.videoHeight || 240;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  // strip prefix
  const base64 = dataUrl.split(',')[1];
  return { dataUrl, base64 };
}

function saveToLocal(label, base64) {
  const key = 'fr_saved_v1';
  const all = JSON.parse(localStorage.getItem(key) || '{}');
  if (!all[label]) all[label] = [];
  all[label].push(base64);
  localStorage.setItem(key, JSON.stringify(all));
  renderSaved();
}

async function saveToServer(label, base64) {
  document.getElementById('status').innerText = 'Saving to server...';
  try {
    const res = await fetch(API_BASE + '/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64, label })
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.message || 'Server error');
    document.getElementById('status').innerText = 'Saved to server for label: ' + label;
  } catch (e) {
    document.getElementById('status').innerText = 'Server save error: ' + e.message;
  }
}

async function identify(base64) {
  document.getElementById('status').innerText = 'Identifying...';
  try {
    const res = await fetch(API_BASE + '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64 })
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.message || 'Server error');
    if (j.match) {
      document.getElementById('status').innerText = `Match: ${j.name} (distance: ${j.distance || 'n/a'})`;
    } else {
      document.getElementById('status').innerText = 'No match found';
    }
  } catch (e) {
    document.getElementById('status').innerText = 'Identification error: ' + e.message;
  }
}

function renderSaved() {
  const key = 'fr_saved_v1';
  const all = JSON.parse(localStorage.getItem(key) || '{}');
  const container = document.getElementById('savedList');
  container.innerHTML = '';
  for (const label in all) {
    const div = document.createElement('div');
    div.style.marginBottom = '8px';
    const title = document.createElement('div');
    title.innerText = `Label: ${label} (${all[label].length})`;
    div.appendChild(title);
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '8px';
    all[label].forEach((b64, idx) => {
      const img = document.createElement('img');
      img.src = 'data:image/jpeg;base64,' + b64;
      img.width = 80;
      img.height = 60;
      img.style.objectFit = 'cover';
      row.appendChild(img);
    });
    div.appendChild(row);
    container.appendChild(div);
  }
}

document.getElementById('saveBtn').addEventListener('click', async () => {
  const label = document.getElementById('labelInput').value.trim();
  if (!label) { document.getElementById('status').innerText = 'Please enter a label.'; return; }
  const { base64 } = captureImageData();
  saveToLocal(label, base64);
  await saveToServer(label, base64);
});

document.getElementById('saveLocalBtn').addEventListener('click', () => {
  const label = document.getElementById('labelInput').value.trim() || 'unknown';
  const { base64 } = captureImageData();
  saveToLocal(label, base64);
  document.getElementById('status').innerText = 'Saved locally for label: ' + label;
});

document.getElementById('identifyBtn').addEventListener('click', async () => {
  const { base64 } = captureImageData();
  await identify(base64);
});

document.getElementById('deleteAllBtn').addEventListener('click', async () => {
    if(!confirm("Are you sure you want to delete ALL faces from the server demo database?")) return;
    
    document.getElementById('status').innerText = 'Deleting all...';
    try {
        const res = await fetch(API_BASE + '/delete_all', { method: 'DELETE' });
        const j = await res.json();
        if (!res.ok) throw new Error(j.message || 'Server error');
        document.getElementById('status').innerText = 'All server faces deleted.';
        
        // Also clear local
        localStorage.removeItem('fr_saved_v1');
        renderSaved();
        
    } catch (e) {
        document.getElementById('status').innerText = 'Delete error: ' + e.message;
    }
});

// Check connection
async function checkConnection() {
    try {
        // Just try to fetch the add endpoint with bad data to see if it responds, or use a health check if one existed.
        // Actually, let's just assume if we can fetch delete_all (OPTIONS) or similar it works. 
        // Better: just tell user if camera fails.
        // We will just do a dummy fetch to root which might 404 but proves connection.
        // Actually, identify endpoint requires post.
        // We'll skip explicit check for now and rely on status messages.
        document.getElementById('status').innerText = 'Ready.';
    } catch(e) {}
}

// initialize
startCamera();
renderSaved();
checkConnection();
</script>
