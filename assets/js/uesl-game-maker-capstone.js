(function () {
  'use strict';

  const page = document.querySelector('[data-agm-page]');
  if (!page) return;

  const tabs = Array.from(page.querySelectorAll('[role="tab"]'));
  const panel = page.querySelector('#agm-step-panel');
  const title = panel?.querySelector('[data-agm-step-title]');
  const copy = panel?.querySelector('[data-agm-step-copy]');
  const proof = panel?.querySelector('[data-agm-step-proof]');
  const number = panel?.querySelector('[data-agm-step-number]');
  const choiceOne = panel?.querySelector('[data-agm-choice-one]');
  const choiceTwo = panel?.querySelector('[data-agm-choice-two]');

  function restartPanelMotion() {
    if (!panel) return;
    panel.classList.remove('is-changing');
    window.requestAnimationFrame(function () {
      panel.classList.add('is-changing');
    });
  }

  function selectStep(nextTab, moveFocus) {
    if (!nextTab || !panel) return;

    tabs.forEach(function (tab) {
      const isSelected = tab === nextTab;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    panel.setAttribute('aria-labelledby', nextTab.id);
    title.textContent = nextTab.dataset.stepTitle;
    copy.textContent = nextTab.dataset.stepCopy;
    proof.textContent = nextTab.dataset.stepProof;
    number.textContent = nextTab.querySelector('span').textContent;
    choiceOne.textContent = nextTab.dataset.stepChoiceOne;
    choiceTwo.textContent = nextTab.dataset.stepChoiceTwo;

    restartPanelMotion();
    if (moveFocus) nextTab.focus();
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      selectStep(tab, false);
    });

    tab.addEventListener('keydown', function (event) {
      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      selectStep(tabs[nextIndex], true);
    });
  });

  function initializeRevealMotion() {
    const sections = Array.from(page.querySelectorAll('.agm-reveal'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      sections.forEach(function (section) { section.classList.add('is-visible'); });
      return;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top < viewportHeight * 0.92) {
        section.classList.add('is-visible');
      }
    });
    page.classList.add('agm-motion-ready');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    sections.forEach(function (section) {
      if (!section.classList.contains('is-visible')) observer.observe(section);
    });
  }

  initializeRevealMotion();
})();
