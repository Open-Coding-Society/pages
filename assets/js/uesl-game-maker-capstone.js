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
})();
