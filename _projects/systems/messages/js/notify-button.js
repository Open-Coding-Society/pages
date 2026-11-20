// The "Notify my phone" button in the Messages header. It turns Web Push on or off for
// this browser through assets/js/api/push-notifications.js (handed in by the page as
// `push`), and says what happened in the page notice. Hidden when this browser can't do
// push or the server has no VAPID keys; on an iPhone that hasn't been added to the Home
// Screen it stays visible so tapping it can explain what to do.

const LABELS = {
  off: 'Notify my phone',
  on: 'Phone notifications: on',
  blocked: 'Notifications blocked',
  install: 'Notify my phone',
};

export function initNotifyButton({ push, button, notice }) {
  if (!push || !button) return;
  let busy = false;

  async function render() {
    const state = await push.pushState();
    const hidden = state === 'unsupported' || state === 'unavailable';
    button.classList.toggle('hidden', hidden);
    if (hidden) return;
    button.textContent = LABELS[state] || LABELS.off;
    button.title = push.STATES[state] || '';
    button.setAttribute('aria-pressed', state === 'on' ? 'true' : 'false');
    button.disabled = state === 'blocked';
  }

  button.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    button.disabled = true;
    try {
      const state = await push.pushState();
      if (state === 'on') {
        const result = await push.disablePush();
        notice.textContent = result.message;
      } else if (state === 'off') {
        const result = await push.enablePush();
        notice.textContent = result.message;
        if (result.ok) {
          // Prove it end to end: the phone should buzz within a few seconds.
          push.sendTestPush().catch(error => console.warn('Messages: test push failed', error));
        }
      } else {
        notice.textContent = push.STATES[state] || '';
      }
    } finally {
      busy = false;
      await render();
    }
  });

  render();
}
