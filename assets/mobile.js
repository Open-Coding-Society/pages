(function(){
  // Mobile navigation
  const root = document.getElementById('mobile-root');
  const content = document.getElementById('mobile-content');
  const nav = document.querySelector('.mobile-nav');

  function goTo(target){
    document.querySelectorAll('.card').forEach(c=>c.style.display='none');
    if (target==='home') document.querySelectorAll('.card')[0].style.display='block';
    if (target==='courses') document.querySelectorAll('.card')[1].style.display='block';
    if (target==='progress') document.querySelectorAll('.card')[2].style.display='block';
    if (target==='profile') document.querySelectorAll('.card')[0].style.display='block';
  }

  document.querySelectorAll('.nav-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      goTo(btn.dataset.target);
    });
  });

  // Modal helper
  function openModal(html){
    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-modal-backdrop';
    const modal = document.createElement('div');
    modal.className = 'mobile-modal enter';

    modal.innerHTML = html;
    const close = modal.querySelector('.close');
    close?.addEventListener('click', closeModal);

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    document.body.classList.add('body-modal-open');

    // Trap focus loosely
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();

    function closeModal(){
      modal.classList.remove('enter');
      modal.classList.add('exit');
      setTimeout(()=>{ backdrop.remove(); document.body.classList.remove('body-modal-open'); }, 220);
    }

    // Escape to close
    document.addEventListener('keydown', function esc(e){ if (e.key==='Escape'){ closeModal(); document.removeEventListener('keydown', esc); } });
  }

  // Example hook: open progress modal when tapped on .sprint-card in mobile mode
  document.addEventListener('click', (e)=>{
    const sc = e.target.closest('.sprint-card');
    if (!sc) return;
    const weekTitle = sc.querySelector('.sprint-title')?.textContent || sc.dataset.sprint || 'Sprint';
    openModal(`<div class="modal-header"><h3>${weekTitle}</h3><button class="close">×</button></div><div class="modal-body"><p class="muted">Tap to view week progress</p><button class="action-btn">View Progress</button></div>`);
  });

})();
