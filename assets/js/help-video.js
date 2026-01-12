/**
 * Demo GIF Popup System
 * Provides clickable image popups for demonstration GIFs
 */

window.showDemoGif = function(gifSrc, title) {
  const popup = document.getElementById('video-demo');
  const img = document.getElementById('video-gif');
  const titleEl = document.getElementById('video-title');
  
  if (!popup || !img || !titleEl) {
    console.warn('Demo popup elements not found');
    return;
  }
  
  img.src = gifSrc;
  titleEl.textContent = title;
  popup.style.display = 'block';
}

window.closeDemoGif = function() {
  const popup = document.getElementById('video-demo');
  if (!popup) return;
  popup.style.display = 'none';
}

window.enlargeGif = function() {
  const img = document.getElementById('video-gif');
  const enlargeBtn = document.getElementById('enlarge-btn');
  const container = document.querySelector('#video-demo > div');
  
  if (!img || !enlargeBtn || !container) return;
  
  if (img.style.maxWidth === 'none') {
    // Return to constrained size
    img.style.maxWidth = '';
    container.style.maxWidth = '';
    enlargeBtn.textContent = '🔍 Enlarge';
  } else {
    // Enlarge to full size
    img.style.maxWidth = 'none';
    container.style.maxWidth = '95%';
    enlargeBtn.textContent = '↔️ Fit';
  }
}

// Close on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') window.closeDemoGif();
});

// Initialize popup HTML if not already present
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('video-demo')) {
    const popupHTML = `
      <div id="video-demo" onclick="closeDemoGif()">
        <div onclick="event.stopPropagation()">
          <button class="close-btn" onclick="closeDemoGif()">×</button>
          <h3 id="video-title" style="color: var(--pref-accent-color); margin-bottom: 16px;"></h3>
          <button id="enlarge-btn" onclick="enlargeGif()" class="desktop-only" style="margin-bottom: 12px; padding: 8px 16px; background: var(--pref-bg-color); border: 1px solid var(--pref-accent-color); color: var(--pref-accent-color); border-radius: 6px; cursor: pointer;">🔍 Enlarge</button>
          <img id="video-gif" src="" alt="Demo Animation">
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
  }
});
