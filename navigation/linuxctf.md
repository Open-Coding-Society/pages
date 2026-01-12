---
toc: True
layout: post
data: tools
title: Linux Ctf
permalink: /linuxctf
breadcrumb: True 
---

## 🖥️ Launch Split View

Use your Kasm Workspace session to test commands live.

<button onclick="openKasmPopup()">Launch Split View</button>

<div id="kasm-popup" style="display:none; padding-top:1rem;">
  <label for="kasm-id">Enter your Kasm Session ID:</label>
  <input type="text" id="kasm-id" placeholder="e.g. 26a8c4f6..." />
  <button onclick="launchKasmWindow()">Open Session</button>
</div>

<script>
// Show session input popup
function openKasmPopup() {
  document.getElementById('kasm-popup').style.display = 'block';
}

// Open Kasm session in new tab
function launchKasmWindow() {
  const sessionId = document.getElementById('kasm-id').value.trim();
  if (sessionId) {
    window.open(`https://kasm.opencodingsociety.com/#/session/${sessionId}`, '_blank');
  } else {
    alert('Please enter a valid session ID.');
  }
}
</script>
