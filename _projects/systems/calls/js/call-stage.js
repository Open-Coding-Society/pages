// The call itself: shared screens across the top, then one cell per person: two big cells a row
// while the call is small, the grammar's card grid once it grows, and one column on a phone. Each person keeps the same cell and <video> while the call
// goes on; render() only attaches a track that changed and moves cells whose order changed, so
// nothing that is playing gets rebuilt.
import { CallDom } from './call-dom.js';
import { CallModel } from './call-model.js';

/** new CallStage({root, strings}); render(snapshot) after every change; destroy() when the call ends. */
export class CallStage {
  constructor({ root, strings }) {
    this.strings = strings;
    this.t = strings.text;
    this.screens = CallDom.el('div', 'ocs__stack', { attrs: { 'data-call': 'screens' } });
    this.grid = CallDom.el('div', 'ocs__grid ocs__grid--col2', { attrs: { 'data-call': 'cells' } });
    root.append(this.screens, this.grid);
    this.cells = new Map(); // identity -> cell parts
    this.shared = new Map(); // identity -> screen parts
  }

  render(snapshot) {
    this.renderScreens(snapshot.screens);
    const people = CallModel.order(snapshot.people);
    // Big cells, two a row, while a call is small; the card grid's smaller cells once it grows.
    const small = people.length <= this.strings.large_cells_up_to;
    this.grid.classList.toggle('ocs__grid--col2', small);
    this.grid.classList.toggle('ocs__grid--card', !small);
    const present = new Set(people.map((person) => person.identity));
    [...this.cells.keys()].filter((identity) => !present.has(identity)).forEach((identity) => this.dropCell(identity));
    // While you're paused nothing reaches you, so others show as initials instead of frozen video.
    const shown = snapshot.paused ? people.map((person) => (person.isSelf ? person : { ...person, camera: null })) : people;
    shown.forEach((person) => this.updateCell(this.cells.get(person.identity) ?? this.makeCell(person), person));
    const order = people.map((person) => this.cells.get(person.identity).cell);
    if (order.some((cell, index) => this.grid.childNodes[index] !== cell)) order.forEach((cell) => this.grid.appendChild(cell));
  }

  destroy() {
    [...this.cells.keys()].forEach((identity) => this.dropCell(identity));
    [...this.shared.keys()].forEach((identity) => this.dropScreen(identity));
    this.screens.remove();
    this.grid.remove();
  }

  makeCell(person) {
    const cell = CallDom.el('div', 'ocs__grid-cell ocs__stack', { attrs: { 'data-identity': person.identity } });
    const media = CallDom.el('div');
    const name = CallDom.el('strong');
    const pills = CallDom.el('p', 'ocs__links');
    cell.append(media, name, pills);
    const parts = { cell, media, name, pills, video: CallDom.video(person.name), track: null, avatar: null, avatarName: null };
    this.cells.set(person.identity, parts);
    return parts;
  }

  updateCell(parts, person) {
    if (parts.track !== person.camera) {
      parts.track?.detach(parts.video);
      person.camera?.attach(parts.video);
      parts.track = person.camera;
    }
    if (parts.avatarName !== person.name) {
      parts.avatar = CallDom.avatar(person.name);
      parts.avatarName = person.name;
      parts.video.setAttribute('aria-label', person.name);
    }
    const shown = person.camera ? parts.video : parts.avatar;
    if (parts.media.firstChild !== shown) parts.media.replaceChildren(shown);
    parts.name.textContent = person.isSelf ? `${person.name} (${this.t.you})` : person.name;
    // An empty row would still take a gap, and ocs__links sets display, which beats [hidden].
    const pills = this.pillsFor(person);
    parts.pills.replaceChildren(...pills);
    if (pills.length && !parts.pills.parentNode) parts.cell.appendChild(parts.pills);
    if (!pills.length) parts.pills.remove();
  }

  pillsFor(person) {
    const pills = CallModel.roleLabels(person.metadata, this.strings).map((label) => CallDom.pill(label));
    if (person.paused) pills.push(CallDom.pill(this.t.paused, 'warn'));
    else if (person.speaking) pills.push(CallDom.pill(this.t.speaking, 'good'));
    else if (!person.micOn) pills.push(CallDom.pill(this.t.muted, 'neutral'));
    return pills;
  }

  dropCell(identity) {
    const parts = this.cells.get(identity);
    parts.track?.detach(parts.video);
    parts.cell.remove();
    this.cells.delete(identity);
  }

  renderScreens(screens) {
    const present = new Set(screens.map((screen) => screen.identity));
    [...this.shared.keys()].filter((identity) => !present.has(identity)).forEach((identity) => this.dropScreen(identity));
    screens.forEach((screen) => {
      let parts = this.shared.get(screen.identity);
      if (!parts) {
        const label = CallModel.format(this.t.screen_of, { name: screen.name });
        // A div, not a <figure>: the browser's figure margins would indent it.
        const figure = CallDom.el('div', 'ocs__stack');
        const video = CallDom.video(label);
        figure.append(video, CallDom.el('p', 'ocs__text', { text: label }));
        this.screens.appendChild(figure);
        parts = { figure, video, track: null };
        this.shared.set(screen.identity, parts);
      }
      if (parts.track !== screen.track) {
        parts.track?.detach(parts.video);
        screen.track.attach(parts.video);
        parts.track = screen.track;
      }
    });
  }

  dropScreen(identity) {
    const parts = this.shared.get(identity);
    parts.track?.detach(parts.video);
    parts.figure.remove();
    this.shared.delete(identity);
  }
}
