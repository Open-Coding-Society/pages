---
layout: post
title: Database Snapshots
permalink: /snapshot
---

<style>
  .snapshot-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
  }
  .snapshot-btn {
    display: block;
    width: 100%;
    padding: 0.75rem 1.5rem;
    margin: 0.75rem 0;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .snapshot-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn-aurora {
    background: #f59e0b;
    color: #1a1a2e;
  }
  .btn-sqlite {
    background: #3b82f6;
    color: white;
  }
  .snapshot-status {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 6px;
    display: none;
    font-family: monospace;
    font-size: 0.9rem;
  }
  .status-success {
    background: #064e3b;
    color: #6ee7b7;
  }
  .status-error {
    background: #7f1d1d;
    color: #fca5a5;
  }
  .status-loading {
    background: #1e3a5f;
    color: #93c5fd;
  }
  .access-denied {
    text-align: center;
    color: #ef4444;
    padding: 2rem;
    font-size: 1.1rem;
  }
</style>

<div class="snapshot-container" id="snapshot-ui" style="display: none;">
  <p>Create on-demand database snapshots. Aurora snapshots back up the Flask production database (RDS). SQLite snapshots back up the Spring production database.</p>

  <button class="snapshot-btn btn-aurora" id="btn-aurora" onclick="triggerSnapshot('aurora')">
    Create Flask Snapshot (Aurora)
  </button>

  <button class="snapshot-btn btn-sqlite" id="btn-sqlite" onclick="triggerSnapshot('sqlite')">
    Create Spring Snapshot (SQLite)
  </button>

  <div class="snapshot-status" id="snapshot-status"></div>
</div>

<div class="access-denied" id="access-denied" style="display: none;">
  This page is only available to admin users.
</div>

<div id="loading" style="text-align: center; padding: 2rem; color: #aaa;">
  Checking permissions...
</div>

<script type="module">
  import { pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  // Check admin role on load
  async function checkAdmin() {
    try {
      const res = await fetch(`${pythonURI}/api/id`, fetchOptions);
      if (!res.ok) {
        showDenied();
        return;
      }
      const user = await res.json();
      if (user.role === 'Admin') {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('snapshot-ui').style.display = 'block';
      } else {
        showDenied();
      }
    } catch (e) {
      showDenied();
    }
  }

  function showDenied() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('access-denied').style.display = 'block';
  }

  // Trigger a snapshot via the Flask proxy
  window.triggerSnapshot = async function(type) {
    const btnAurora = document.getElementById('btn-aurora');
    const btnSqlite = document.getElementById('btn-sqlite');
    const statusEl = document.getElementById('snapshot-status');

    // Disable buttons
    btnAurora.disabled = true;
    btnSqlite.disabled = true;

    // Show loading
    statusEl.style.display = 'block';
    statusEl.className = 'snapshot-status status-loading';
    statusEl.textContent = `Creating ${type} snapshot...`;

    try {
      const res = await fetch(`${pythonURI}/api/snapshot/${type}`, {
        ...fetchOptions,
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        statusEl.className = 'snapshot-status status-success';
        statusEl.textContent = data.message;
      } else {
        statusEl.className = 'snapshot-status status-error';
        statusEl.textContent = data.message || 'Snapshot failed';
      }
    } catch (e) {
      statusEl.className = 'snapshot-status status-error';
      statusEl.textContent = 'Error: ' + e.message;
    }

    // Re-enable buttons
    btnAurora.disabled = false;
    btnSqlite.disabled = false;
  };

  checkAdmin();
</script>
