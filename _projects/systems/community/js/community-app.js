// The Community page: who is viewing, the look, the tabs, and the views behind them. Each tab's
// view is made the first time it opens and kept, so a chat keeps its place; switching who is
// viewing destroys every view and builds them again for that person, so nothing is ever sent
// as the person before. The Add to calendar dialog is Messages' own (schedule-dialog.js) on
// the demo backend; Reply in your group, Report a message and New message are Community's.
// Each dialog is made once for the page, since Messages' createDialog keeps a listener on the
// document for as long as the page is open.
import { Brand } from './brand.js';
import { CalendarView } from './calendar-view.js';
import { CommunityRoles } from './community-roles.js';
import { Dom } from './dom.js';
import { GroupsView } from './groups-view.js';
import { InboxView, NewMessageDialog } from './inbox-view.js';
import { ReplyDialog } from './reply-dialog.js';
import { ReportDialog } from './report-dialog.js';
import { ReviewView } from './review-view.js';
import { UpdatesView } from './updates-view.js';

const VIEWS = Object.freeze({ updates: UpdatesView, groups: GroupsView, inbox: InboxView, calendar: CalendarView, review: ReviewView });
const ICONS = Object.freeze({ updates: 'fa-bullhorn', groups: 'fa-users', inbox: 'fa-inbox', calendar: 'fa-calendar', review: 'fa-flag' });

/**
 * One Community page, started with start() and taken down with destroy().
 */
export class CommunityApp {
  /**
   * @param {{root: HTMLElement, setup: object, texts: Texts, backend: DemoBackend, kit: object,
   *   sitePreferences?: object}} options kit holds the other systems' modules the page imported
   */
  constructor({ root, setup, texts, backend, kit, sitePreferences = null }) {
    if (!root?.ownerDocument) throw new TypeError('CommunityApp: root must be an element');
    this.root = root;
    this.doc = root.ownerDocument;
    this.setup = setup;
    this.texts = texts;
    this.backend = backend;
    this.kit = kit;
    this.sitePreferences = sitePreferences;
    this.views = new Map();
    this.tabs = [];
    this.currentTab = '';
    this.stops = [];
  }

  byId(id) {
    return this.doc.getElementById(id);
  }

  /** The organization's short name, for words with {org}. */
  get org() {
    return this.setup.org?.short || '';
  }

  start() {
    // Removes the page-level listeners below when the app is destroyed.
    this.listeners = new AbortController();
    const { richText } = this.kit;
    this.schedule = this.kit.initScheduleDialog({
      api: this.backend,
      stripMarkers: text => richText.stripChatMarkers(text),
      onScheduled: words => this.notice(words),
      elements: {
        dialog: this.byId('communityScheduleDialog'), form: this.byId('communityScheduleForm'),
        title: this.byId('communityScheduleName'), date: this.byId('communityScheduleDate'),
        time: this.byId('communityScheduleTime'), status: this.byId('communityScheduleStatus'),
        save: this.byId('communityScheduleSave'),
      },
    });
    this.reply = new ReplyDialog({ app: this });
    this.reportDialog = new ReportDialog({ app: this });
    this.newMessage = new NewMessageDialog({ app: this });
    // The demo controls start open where there's room; on a phone they wait behind their summary.
    const controls = this.root.querySelector('[data-community-controls]');
    if (controls && this.doc.defaultView?.matchMedia?.('(min-width: 769px)').matches) controls.open = true;
    this.fillViewers();
    this.fillLooks();
    this.applyLook('brand');
    this.stops.push(
      this.backend.on('viewer', () => this.rebuild()),
      this.backend.on('reports', () => this.refreshReviewCount()),
      this.backend.on('pending', () => this.refreshReviewCount()),
    );
    this.byId('communityTabs').addEventListener('keydown', event => this.onTabKey(event), { signal: this.listeners.signal });
    this.rebuild();
  }

  /* ---------- demo controls ---------- */

  personLabel(person) {
    return this.texts.say('app.person_option', { name: person.name, role: this.texts.say(`roles.${CommunityRoles.roleOf(person)}`) });
  }

  fillViewers() {
    const select = this.byId('communityViewer');
    const people = new Map(this.backend.people().map(person => [person.id, person]));
    select.replaceChildren(...(this.setup.personas || []).map((id) => {
      const option = Dom.el('option', '', this.personLabel(people.get(id)));
      option.value = String(id);
      return option;
    }));
    select.value = String(this.backend.viewer().id);
    select.addEventListener('change', () => this.backend.viewAs(Number(select.value)), { signal: this.listeners.signal });
  }

  fillLooks() {
    const select = this.byId('communityLook');
    const brand = Dom.el('option', '', this.texts.say('app.look_brand', { org: this.org }));
    brand.value = 'brand';
    const presets = Object.keys(this.sitePreferences?.PRESETS || {}).map((name) => {
      const option = Dom.el('option', '', this.texts.say('app.look_preset', { name }));
      option.value = name;
      return option;
    });
    select.replaceChildren(brand, ...presets);
    select.addEventListener('change', () => this.applyLook(select.value), { signal: this.listeners.signal });
  }

  /**
   * Shows the organization's colors, or one of the theme engine's presets, on this page.
   * @param {string} look 'brand' or a preset's name
   */
  applyLook(look) {
    const theme = look === 'brand' ? Brand.theme(this.setup) : Brand.preset(this.sitePreferences, look);
    if (theme) Brand.apply(this.sitePreferences, theme);
  }

  /* ---------- tabs ---------- */

  rebuild() {
    this.destroyViews();
    this.me = this.backend.viewer();
    this.byId('communityViewer').value = String(this.me.id);
    this.tabs = CommunityRoles.tabsFor(this.me);
    const list = this.byId('communityTabs');
    const panels = this.byId('communityPanels');
    list.replaceChildren();
    panels.replaceChildren();
    for (const tab of this.tabs) {
      // A link, as the Dashboard's tab bar has them: preset themes give every button a border
      // and a panel color, which would turn the tabs into boxes.
      const link = Dom.el('a', 'ocs__tabs-btn', Dom.icon(ICONS[tab]), ` ${this.texts.say(`tabs.${tab}`)}`);
      Dom.attrs(link, { href: `#communityPanel-${tab}`, role: 'tab', id: `communityTab-${tab}`, 'aria-controls': `communityPanel-${tab}`, 'aria-selected': 'false', tabindex: '-1' });
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.show(tab);
      });
      list.appendChild(Dom.attrs(Dom.el('li', '', link), { role: 'presentation' }));
      // The panel's hidden attribute sits on a plain div: ocs__ classes set display.
      panels.appendChild(Dom.attrs(Dom.el('div'), { role: 'tabpanel', id: `communityPanel-${tab}`, 'aria-labelledby': `communityTab-${tab}`, hidden: true }));
    }
    this.notice('');
    this.refreshReviewCount();
    this.show(this.tabs.includes(this.currentTab) ? this.currentTab : this.tabs[0]);
  }

  /**
   * Opens a tab, making its view the first time.
   * @param {string} tab
   * @param {object} options handed to the view's focus(), such as { channelId }
   */
  show(tab, options = null) {
    if (!this.tabs.includes(tab)) return;
    if (tab !== this.currentTab) {
      // What the page last said was about the tab being left.
      this.notice('');
      // A view that lives only while its tab shows (the calendar's week view) is told it's hidden.
      this.views.get(this.currentTab)?.hidden?.();
    }
    this.currentTab = tab;
    for (const name of this.tabs) {
      const selected = name === tab;
      const button = this.byId(`communityTab-${name}`);
      // The tab grammar colors the active tab through these three tokens (elements/tabs).
      ['active', 'text-blue-500', 'border-blue-500'].forEach(token => button.classList.toggle(token, selected));
      Dom.attrs(button, { 'aria-selected': String(selected), tabindex: selected ? '0' : '-1' });
      this.byId(`communityPanel-${name}`).hidden = !selected;
    }
    let view = this.views.get(tab);
    if (!view) {
      view = new VIEWS[tab]({ root: this.byId(`communityPanel-${tab}`), app: this });
      this.views.set(tab, view);
      view.mount();
    } else {
      view.shown?.();
    }
    if (options) view.focus?.(options);
  }

  /** Left and right arrows move between tabs, as tab lists do. */
  onTabKey(event) {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = this.tabs[(this.tabs.indexOf(this.currentTab) + step + this.tabs.length) % this.tabs.length];
    this.show(next);
    this.byId(`communityTab-${next}`).focus();
    event.preventDefault();
  }

  /** The Review tab shows how much is waiting: open reports, and updates to approve for staff. */
  async refreshReviewCount() {
    const button = this.byId('communityTab-review');
    if (!button) return;
    let count = 0;
    try {
      count += (await this.backend.reports()).length;
      if (CommunityRoles.isStaff(this.me)) count += (await this.backend.pendingUpdates()).length;
    } catch (error) {
      console.warn('Community: could not count what is waiting for review', error);
    }
    const label = count ? this.texts.say('tabs.review_count', { count }) : this.texts.say('tabs.review');
    button.replaceChildren(Dom.icon(ICONS.review), ` ${label}`);
  }

  /** A line under the tabs that screen readers announce. */
  notice(words) {
    const line = this.byId('communityNotice');
    line.textContent = words;
    line.hidden = !words;
  }

  /* ---------- shared actions the views call ---------- */

  /** Messages' Add to calendar, for any message. */
  scheduleMessage(message, opener) {
    this.schedule.open(message, opener);
  }

  /** Reply to an update in one of your series groups. */
  replyInGroup(message, updatesChannel, opener) {
    this.reply.open(message, updatesChannel, opener);
  }

  /** Opens a series group's chat. */
  openGroup(channelId) {
    this.show('groups', { channelId });
  }

  destroyViews() {
    this.views.forEach(view => view.destroy());
    this.views.clear();
  }

  destroy() {
    this.listeners?.abort();
    this.destroyViews();
    this.reply?.destroy();
    this.stops.forEach(stop => stop());
    this.stops = [];
  }
}
