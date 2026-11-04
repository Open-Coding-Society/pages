export class ButtonFeedback {
  static flash(button, temporaryLabel = '✔', duration = 2000) {
    if (!button) return;

    if (button.classList.contains('ocs__btn--icon') && button.querySelector('.ocs__btn-icon')) {
      button.classList.add('is-action-complete');
      setTimeout(() => button.classList.remove('is-action-complete'), duration);
      return;
    }

    const original = button.innerHTML;
    button.innerHTML = temporaryLabel;
    setTimeout(() => {
      button.innerHTML = original;
    }, duration);
  }
}

export default ButtonFeedback;
