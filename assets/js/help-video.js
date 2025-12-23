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
          <img id="video-gif" src="" alt="Demo Animation">
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
  }
});
