export class ButtonFeedback {
  static flash(button, temporaryLabel = '✔', duration = 2000) {
    if (!button) return;

    const original = button.innerHTML;
    button.innerHTML = temporaryLabel;
    setTimeout(() => {
      button.innerHTML = original;
    }, duration);
  }
}

export default ButtonFeedback;
