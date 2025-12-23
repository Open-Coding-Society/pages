/**
 * Demo GIF Popup System
 * Provides clickable image popups for demonstration GIFs
 */

window.showDemoGif = function(gifSrc, title) {
  const popup = document.getElementById('demo-popup');
  const img = document.getElementById('demo-gif');
  const titleEl = document.getElementById('demo-title');
  
  if (!popup || !img || !titleEl) {
    console.warn('Demo popup elements not found');
    return;
  }
  
  img.src = gifSrc;
  titleEl.textContent = title;
  popup.classList.add('active');
}

window.closeDemoGif = function() {
  const popup = document.getElementById('demo-popup');
  if (!popup) return;
  popup.classList.remove('active');
}

// Close on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') window.closeDemoGif();
});

// Initialize popup HTML if not already present
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('demo-popup')) {
    const popupHTML = `
      <div id="demo-popup" class="demo-popup" onclick="closeDemoGif()">
        <div class="demo-popup-content" onclick="event.stopPropagation()">
          <button class="demo-popup-close" onclick="closeDemoGif()">X</button>
          <h3 id="demo-title" style="color: var(--pref-accent-color); margin-bottom: 16px;"></h3>
          <img id="demo-gif" src="" alt="Demo Animation">
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
  }
});
