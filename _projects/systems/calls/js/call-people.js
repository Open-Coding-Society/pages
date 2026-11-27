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
    this.manage = new Map(); // identity -> its Manage <details>
    this.shown = null; // what the list shows, to skip redraws that would change nothing
  }

  // The list redraws only when what it shows changes (talking and muting don't show here), and
  // a Manage someone had open stays open, so a teacher can reach Pause in a lively call.
  render(snapshot) {
    const people = CallModel.order(snapshot.people);
    const shown = JSON.stringify(people.map((p) => [p.identity, p.name, p.isSelf, p.paused, p.metadata]));
    if (shown === this.shown) return;
    this.shown = shown;
    const open = new Set([...this.manage].filter(([, details]) => details.open).map(([identity]) => identity));
    const focus = this.focused();
    this.release();
    this.manage = new Map();
    this.list.replaceChildren(...people.map((person) => this.row(person)));
    open.forEach((identity) => { if (this.manage.has(identity)) this.manage.get(identity).open = true; });
    if (focus) this.refocus(focus);
  }

  // Which control in the list has keyboard focus, as a person and a control, to give it back after a redraw.
  focused() {
    const active = document.activeElement;
    if (!active || !this.list.contains(active)) return null;
    const row = active.closest('[data-person]');
    if (!row) return null;
    return { identity: row.dataset.person, action: active.dataset.action ?? null, summary: active.tagName === 'SUMMARY' };
  }

  refocus({ identity, action, summary }) {
    const row = [...this.list.children].find((item) => item.dataset.person === identity);
    const target = action ? row?.querySelector(`[data-action="${action}"]`) : (summary ? row?.querySelector('summary') : null);
    target?.focus();
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
    this.manage.set(person.identity, details);
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
