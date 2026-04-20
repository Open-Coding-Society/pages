(function () {
  'use strict';

  // ─── Modal open / close ──────────────────────────────────────────────────────

  function openModal() {
    const m = document.getElementById('ncModal');
    if (!m) return;
    m.removeAttribute('hidden');
    requestAnimationFrame(() => m.classList.add('nc-modal--open'));
    document.body.style.overflow = 'hidden';
    m.querySelector('.nc-modal__panel').focus();
  }

  function closeModal() {
    const m = document.getElementById('ncModal');
    if (!m) return;
    m.classList.remove('nc-modal--open');
    document.body.style.overflow = '';
    setTimeout(() => m.setAttribute('hidden', ''), 300);
  }

  // ─── Tag-chip inputs ─────────────────────────────────────────────────────────

  function initTagInput(containerId, hiddenId) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    const hidden = document.getElementById(hiddenId);
    const inp = wrap.querySelector('.nc-tag-input__field');
    const chips = wrap.querySelector('.nc-tag-input__chips');
    const tags = [];

    function render() {
      chips.innerHTML = tags.map((t, i) =>
        `<span class="nc-chip">${esc(t)}<button type="button" data-i="${i}" aria-label="Remove ${esc(t)}">×</button></span>`
      ).join('');
      hidden.value = tags.join('\n');
    }
    function add(val) {
      val = val.trim();
      if (val && !tags.includes(val)) { tags.push(val); render(); }
      inp.value = '';
    }
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(inp.value); }
      if (e.key === 'Backspace' && !inp.value && tags.length) { tags.pop(); render(); }
    });
    inp.addEventListener('blur', () => add(inp.value));
    chips.addEventListener('click', e => {
      const btn = e.target.closest('button[data-i]');
      if (btn) { tags.splice(+btn.dataset.i, 1); render(); }
    });
    return tags; // live reference
  }

  // ─── Image: resize via canvas → data URL ─────────────────────────────────────

  function resizeImage(file, maxPx, quality) {
    return new Promise(resolve => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }

  function initImageUpload() {
    const inp = document.getElementById('ncImage');
    const preview = document.getElementById('ncImagePreview');
    if (!inp || !preview) return;
    inp.addEventListener('change', () => {
      const file = inp.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        preview.style.backgroundImage = `url(${e.target.result})`;
        preview.classList.add('nc-image-preview--loaded');
      };
      reader.readAsDataURL(file);
    });
  }

  // ─── sessionStorage helpers ───────────────────────────────────────────────────

  const SS_KEY = 'ncLocalProjects';

  function saveProject(p) {
    try {
      const all = JSON.parse(sessionStorage.getItem(SS_KEY) || '[]');
      all.push(p);
      sessionStorage.setItem(SS_KEY, JSON.stringify(all));
    } catch (e) {
      // sessionStorage full (large image) — still render in DOM, just can't view detail
      console.warn('sessionStorage full; detail view may not work:', e);
    }
  }

  // ─── Submit — pure client-side ────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.nc-submit');
    const statusEl = document.getElementById('ncStatus');

    const title = form.querySelector('[name="title"]').value.trim();
    if (!title) {
      statusEl.textContent = 'Project name is required.';
      statusEl.className = 'nc-status nc-status--err';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating…';
    statusEl.textContent = '';

    // Compress image (if provided)
    let imageDataUrl = null;
    const imgFile = document.getElementById('ncImage')?.files[0];
    if (imgFile) {
      imageDataUrl = await resizeImage(imgFile, 600, 0.78);
    }

    const lines = v => (v || '').split('\n').map(s => s.trim()).filter(Boolean);

    const project = {
      id: 'local_' + Date.now(),
      title,
      subtitle:    form.querySelector('[name="subtitle"]').value.trim(),
      description: form.querySelector('[name="description"]').value.trim(),
      about:       form.querySelector('[name="about"]').value.trim(),
      courseCode:  form.querySelector('[name="courseCode"]').value,
      status:      form.querySelector('[name="status"]').value,
      tech:        lines(form.querySelector('[name="tech"]').value),
      teamMembers: lines(form.querySelector('[name="teamMembers"]').value),
      keyPoints:   lines(form.querySelector('[name="keyPoints"]').value),
      impact:      lines(form.querySelector('[name="impact"]').value),
      pageUrl:     form.querySelector('[name="pageUrl"]').value.trim(),
      frontendUrl: form.querySelector('[name="frontendUrl"]').value.trim(),
      backendUrl:  form.querySelector('[name="backendUrl"]').value.trim(),
      imageUrl:    imageDataUrl,
      createdAt:   new Date().toISOString(),
      _local:      true
    };

    saveProject(project);
    injectCard(project);

    statusEl.textContent = '✓ Added to the grid!';
    statusEl.className = 'nc-status nc-status--ok';

    // Reset form
    form.reset();
    document.querySelectorAll('.nc-tag-input__chips').forEach(c => c.innerHTML = '');
    document.querySelectorAll('#ncTechHidden, #ncTeamHidden').forEach(n => n.value = '');
    const prev = document.getElementById('ncImagePreview');
    if (prev) { prev.style.backgroundImage = ''; prev.classList.remove('nc-image-preview--loaded'); }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Project';
    setTimeout(closeModal, 1200);
  }

  // ─── Card rendering ───────────────────────────────────────────────────────────

  function buildCardEl(p) {
    const href = `/capstone/view/?id=${encodeURIComponent(p.id)}`;
    const imgHtml = p.imageUrl
      ? `<img src="${p.imageUrl}" alt="${esc(p.title)}" class="w-28 h-28 object-cover rounded" />`
      : `<div class="w-28 h-28 flex items-center justify-center bg-blue-900 text-white text-2xl font-bold rounded">${esc((p.title||'?').slice(0,3).toUpperCase())}</div>`;
    const team = Array.isArray(p.teamMembers) ? p.teamMembers.join(', ') : String(p.teamMembers || '');
    const course = (p.courseCode || 'CSA').toUpperCase();

    const div = document.createElement('div');
    div.className = `flex items-start space-x-4 p-4 border rounded-lg capstone-item ${course}`;
    div.dataset.dynamic = 'true';
    div.innerHTML = `
      <a href="${esc(href)}">${imgHtml}</a>
      <div>
        <h3 class="text-lg font-semibold"><a href="${esc(href)}">${esc(p.title)}</a></h3>
        <p class="text-sm text-gray-700">${esc(p.description || p.about || '')}</p>
        <p class="text-xs text-gray-500 mt-2">Team: ${esc(team)}</p>
      </div>`;
    return div;
  }

  function injectCard(project) {
    const grid = document.getElementById('capstone-grid');
    if (!grid) return;
    const card = buildCardEl(project);
    grid.prepend(card); // new projects appear first
    augmentCard(card);
    // Scroll card into view
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function augmentCard(card) {
    card.classList.add('relative');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'capstone-links-button absolute top-3 right-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white/90 text-xl text-slate-900 shadow-sm transition hover:bg-white';
    btn.setAttribute('aria-label', 'Open project links');
    btn.innerHTML = '📁';
    const popup = document.createElement('div');
    popup.className = 'capstone-popup hidden absolute right-3 top-14 z-30 w-64 rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-2xl';
    popup.style.backdropFilter = 'blur(14px)';
    popup.style.backgroundColor = 'rgba(15,23,42,0.96)';
    popup.innerHTML = '<div class="capstone-popup-links space-y-2"><p class="text-xs text-slate-400 px-1">No repo links added yet.</p></div>';
    btn.addEventListener('click', ev => {
      ev.stopPropagation();
      const hidden = popup.classList.contains('hidden');
      document.querySelectorAll('.capstone-popup').forEach(p => p.classList.add('hidden'));
      if (hidden) popup.classList.remove('hidden');
    });
    card.appendChild(btn);
    card.appendChild(popup);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    // FAB — no auth check, open immediately
    document.getElementById('ncFab')?.addEventListener('click', openModal);

    // Close
    document.getElementById('ncModalClose')?.addEventListener('click', closeModal);
    document.getElementById('ncCancel')?.addEventListener('click', closeModal);
    document.getElementById('ncModal')?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Tag inputs
    initTagInput('ncTechWrap', 'ncTechHidden');
    initTagInput('ncTeamWrap', 'ncTeamHidden');

    // Image preview
    initImageUpload();

    // Form
    document.getElementById('ncForm')?.addEventListener('submit', handleSubmit);
  });
})();
