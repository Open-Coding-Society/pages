/**
 * @module action-feedback
 * @description Brief accessible action feedback without permanent layout text.
 * @data A live region retains the latest message; routine notices hide after
 * four seconds. Errors stay visible until replaced by the next operation.
 * @usage Pass an existing role=status element and call the returned reporter.
 */
export function createActionFeedback(element) {
  let timer;
  return (message, state = 'info') => {
    window.clearTimeout(timer);
    element.textContent = message;
    element.dataset.state = state;
    element.classList.add('is-visible');
    if (state !== 'error') {
      timer = window.setTimeout(() => element.classList.remove('is-visible'), 4000);
    }
  };
}
