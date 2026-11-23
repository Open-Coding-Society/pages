// Who is in the call, beside it: each person's name and role. A moderator (a teacher, by
// Spring's calls.policy.moderator-roles) also gets End call for everyone, and, behind each
// person's Manage, Pause or Resume and Remove. Nobody gets tools on themselves.
import { CallDom } from './call-dom.js';
import { CallModel } from './call-model.js';

/** new CallPeople({...}); render(snapshot) after every change. onAction(action, person) and onEnd() do the asking. */
export class CallPeople {
  constructor({ root, strings, canModerate, onAction, onEnd }) {
    this.strings = strings;
    this.t = strings.text;
    this.canModerate = canModerate;
    this.onAction = onAction;
    this.card = CallDom.el('div', 'ocs__card ocs__stack', { attrs: { 'data-call': 'people' } });
    const header = CallDom.el('div', 'ocs__card-header');
    this.heading = CallDom.el('h2', 'ocs__section-title', { text: this.t.people });
    header.appendChild(this.heading);
    this.end = null;
    if (canModerate) {
      this.end = CallDom.button(this.t.end_for_all, 'ocs__btn small alert-red', { hook: 'end' });
      this.onEndClick = () => onEnd();
      this.end.addEventListener('click', this.onEndClick);
      header.appendChild(this.end);
    }
    this.list = CallDom.el('ul', 'ocs__stack');
    this.card.append(header, this.list);
    root.appendChild(this.card);
    this.buttons = []; // [button, handler] to take back on the next render
  }

  render(snapshot) {
    this.release();
    const rows = CallModel.order(snapshot.people).map((person) => this.row(person));
    this.list.replaceChildren(...rows);
  }

  destroy() {
    this.release();
    if (this.end) this.end.removeEventListener('click', this.onEndClick);
    this.card.remove();
  }

  row(person) {
    const item = CallDom.el('li', 'ocs__links', { attrs: { 'data-person': person.identity } });
    item.appendChild(CallDom.el('strong', '', { text: person.isSelf ? `${person.name} (${this.t.you})` : person.name }));
    CallModel.roleLabels(person.metadata, this.strings).forEach((label) => item.appendChild(CallDom.pill(label)));
    if (person.paused) item.appendChild(CallDom.pill(this.t.paused, 'warn'));
    if (this.canModerate && !person.isSelf) item.appendChild(this.tools(person));
    return item;
  }

  // Kept behind Manage so Remove isn't in the everyday view.
  tools(person) {
    const details = CallDom.el('details');
    details.appendChild(CallDom.el('summary', 'ocs__btn small', { text: this.t.manage }));
    const row = CallDom.el('div', 'ocs__links');
    const pause = person.paused ? 'resume' : 'pause';
    [[pause, this.t[pause], 'ocs__btn small'], ['remove', this.t.remove, 'ocs__btn small alert-red']].forEach(([action, label, className]) => {
      const button = CallDom.button(label, className, { attrs: { 'data-action': action, 'data-identity': person.identity } });
      const handler = () => this.onAction(action, person);
      button.addEventListener('click', handler);
      this.buttons.push([button, handler]);
      row.appendChild(button);
    });
    details.appendChild(row);
    return details;
  }

  release() {
    this.buttons.forEach(([button, handler]) => button.removeEventListener('click', handler));
    this.buttons = [];
  }
}
