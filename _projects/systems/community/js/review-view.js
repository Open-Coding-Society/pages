// Review: the moderators' and staff's side. Open reports come first, each with the message and
// every version of it, and the actions a moderator can take (moderation.js). Staff then see the
// updates waiting for a second approval, with the phone notification each would send. The
// moderation log lists every action with who took it, and staff can export the records.
import { CommunityRoles } from './community-roles.js';
import { Dom } from './dom.js';
import { Records } from './records.js';

// Each action button: its words, the action, and a mute's length.
const ACTIONS = Object.freeze([
  { key: 'review.hide', action: 'hide', hours: 0, className: 'ocs__btn small' },
  { key: 'review.mute_24', action: 'mute', hours: 24, className: 'ocs__btn small' },
  { key: 'review.mute_168', action: 'mute', hours: 168, className: 'ocs__btn small' },
  { key: 'review.remove', action: 'remove', hours: 0, className: 'ocs__btn small alert-red' },
  { key: 'review.dismiss', action: 'dismiss', hours: 0, className: 'ocs__btn small' },
]);

/**
 * The Review tab.
 */
export class ReviewView {
  /**
   * @param {{root: HTMLElement, app: CommunityApp}} options
   */
  constructor({ root, app }) {
    this.root = root;
    this.app = app;
    this.backend = app.backend;
    this.kit = app.kit;
    this.me = app.me;
    this.stops = [];
  }

  say(key, values = {}) {
    return this.app.texts.say(key, { org: this.app.org, ...values });
  }

  // A titled part of the tab. Only the items in it are cards, so cards don't sit in cards.
  section(titleKey, body) {
    return Dom.el('section', 'ocs__stack', Dom.el('h3', 'ocs__section-title', this.say(titleKey)), body);
  }

  mount() {
    const staff = CommunityRoles.isStaff(this.me);
    this.reports = Dom.el('div', 'ocs__stack');
    this.approvals = Dom.el('div', 'ocs__stack');
    this.log = Dom.el('div', 'ocs__stack');
    this.root.replaceChildren(Dom.el('div', 'ocs__stack',
      this.section('review.reports', this.reports),
      staff ? this.section('review.approvals', this.approvals) : null,
      this.section('review.log', this.log),
      staff ? this.section('review.export', this.exporter()) : null));
    this.stops.push(
      this.backend.on('reports', () => this.renderReports()),
      this.backend.on('pending', () => this.renderApprovals()),
      this.backend.on('moderation', () => this.renderLog()),
    );
    this.renderReports();
    if (staff) this.renderApprovals();
    this.renderLog();
  }

  /** A message body drawn by the chat's own sanitizer, without its reply marker. */
  body(html) {
    const box = Dom.el('div', 'ocs__callout');
    const { html: words } = this.kit.richText.extractReplyMarker(html);
    this.kit.richText.renderRichMessage(box, this.kit.extractEventMarkers(words).html);
    return box;
  }

  /* ---------- reports ---------- */

  async renderReports() {
    let reports = [];
    try {
      reports = await this.backend.reports();
    } catch (error) {
      console.warn('Community: could not load reports', error);
    }
    this.reports.replaceChildren(...(reports.length ? reports.map(report => this.reportCard(report)) : [Dom.el('small', '', this.say('review.no_reports'))]));
  }

  reportCard(report) {
    const note = Dom.attrs(Dom.el('input', 'ocs__input'), { id: `communityReviewNote${report.id}`, type: 'text', maxlength: '500' });
    const status = Dom.attrs(Dom.el('p', 'ocs__text'), { role: 'status' });
    const buttons = ACTIONS.map(entry => Dom.button(this.say(entry.key), {
      className: entry.className,
      onClick: () => this.act(report, entry, note, buttons, status),
    }));
    const versions = report.versions.length > 1
      ? Dom.el('details', '', Dom.el('summary', '', this.say('review.versions')),
        Dom.el('ol', 'ocs__stack', ...report.versions.map(version => Dom.el('li', '', Dom.el('small', '', Dom.when(version.at)), ' ',
          this.backend.plain(version.html)))))
      : null;
    return Dom.el('div', 'ocs__card ocs__stack',
      Dom.el('small', '', this.say('review.reported', {
        reporter: report.reporter, author: report.message.author, channel: report.channelTitle, when: Dom.when(report.at),
      })),
      Dom.el('div', 'ocs__links', Dom.pill(this.say('review.reason', { reason: this.say(`report.reasons.${report.reason}`) }), 'warn')),
      report.note ? Dom.el('small', '', this.say('review.reporter_note', { note: report.note })) : null,
      this.body(report.message.message),
      versions,
      Dom.field(this.say('review.note'), note),
      Dom.el('div', 'ocs__links', ...buttons),
      status);
  }

  async act(report, entry, note, buttons, status) {
    buttons.forEach((button) => { button.disabled = true; });
    try {
      await this.backend.resolveReport(report.id, { action: entry.action, hours: entry.hours, note: note.value });
    } catch (error) {
      console.warn('Community: could not act on the report', error);
      status.textContent = this.app.texts.refusal(error, 'review.failed', { org: this.app.org });
      buttons.forEach((button) => { button.disabled = false; });
    }
  }

  /* ---------- approvals ---------- */

  async renderApprovals() {
    if (!CommunityRoles.isStaff(this.me)) return;
    let pending = [];
    try {
      pending = await this.backend.pendingUpdates();
    } catch (error) {
      console.warn('Community: could not load updates waiting for approval', error);
    }
    this.approvals.replaceChildren(...(pending.length ? pending.map(update => this.approvalCard(update)) : [Dom.el('small', '', this.say('review.no_approvals'))]));
  }

  approvalCard(update) {
    const own = update.authorId === this.me.id;
    const status = Dom.attrs(Dom.el('p', 'ocs__text'), { role: 'status' });
    const approve = Dom.button(this.say('review.approve'), { className: 'ocs__btn small accent fill', icon: 'fa-check' });
    approve.disabled = own;
    approve.addEventListener('click', async () => {
      approve.disabled = true;
      try {
        const { pushText } = await this.backend.approveUpdate(update.id);
        this.app.notice(this.say('review.push', { text: pushText }));
      } catch (error) {
        console.warn('Community: could not approve the update', error);
        status.textContent = this.app.texts.refusal(error, 'review.failed', { org: this.app.org });
        approve.disabled = false;
      }
    });
    return Dom.el('div', 'ocs__card ocs__stack',
      Dom.el('small', '', this.say('review.wrote', { author: update.author, channel: update.channelTitle, when: Dom.when(update.at) })),
      this.body(update.html),
      Dom.el('small', '', this.say('review.push', { text: update.pushText })),
      Dom.el('div', 'ocs__links', approve),
      own ? Dom.el('small', '', this.say('review.own')) : null,
      status);
  }

  /* ---------- the log ---------- */

  async renderLog() {
    let entries = [];
    try {
      entries = await this.backend.moderationLog();
    } catch (error) {
      console.warn('Community: could not load the moderation log', error);
    }
    if (!entries.length) {
      this.log.replaceChildren(Dom.el('small', '', this.say('review.no_log')));
      return;
    }
    const head = Dom.el('tr', '', ...['review.log_when', 'review.log_who', 'review.log_what'].map(key => Dom.attrs(Dom.el('th', '', this.say(key)), { scope: 'col' })));
    const rows = entries.map(entry => Dom.el('tr', '',
      Dom.el('td', '', Dom.when(entry.at)),
      Dom.el('td', '', entry.actor),
      Dom.el('td', '', entry.note ? `${entry.text}. ${entry.note}` : entry.text)));
    this.log.replaceChildren(Dom.el('div', 'ocs__table-wrap', Dom.el('table', 'ocs__table', Dom.el('thead', '', head), Dom.el('tbody', '', ...rows))));
  }

  /* ---------- records export ---------- */

  exporter() {
    const person = Dom.attrs(Dom.el('select', 'ocs__input'), { id: 'communityExportPerson' });
    const everyone = Dom.el('option', '', this.say('review.export_everyone'));
    everyone.value = '';
    person.append(everyone, ...this.backend.people().map((entry) => {
      const option = Dom.el('option', '', entry.name);
      option.value = String(entry.id);
      return option;
    }));
    const from = Dom.attrs(Dom.el('input', 'ocs__input'), { id: 'communityExportFrom', type: 'date' });
    const to = Dom.attrs(Dom.el('input', 'ocs__input'), { id: 'communityExportTo', type: 'date' });
    const status = Dom.attrs(Dom.el('p', 'ocs__text'), { role: 'status' });
    const download = Dom.button(this.say('review.export_download'), {
      className: 'ocs__btn small',
      icon: 'fa-file-csv',
      onClick: async () => {
        try {
          const { csv, count } = await this.backend.exportCsv({ personId: person.value, from: from.value, to: to.value });
          this.app.kit.saveBlob(new Blob([csv], { type: 'text/csv' }), Records.fileName(this.app.org));
          status.textContent = this.say('review.exported', { count });
        } catch (error) {
          console.warn('Community: could not export the records', error);
          status.textContent = this.app.texts.refusal(error, 'review.failed', { org: this.app.org });
        }
      },
    });
    return Dom.el('div', 'ocs__stack',
      Dom.el('small', '', this.say('review.export_hint')),
      Dom.field(this.say('review.export_person'), person),
      Dom.el('div', 'ocs__split', Dom.field(this.say('review.export_from'), from), Dom.field(this.say('review.export_to'), to)),
      Dom.el('div', 'ocs__links', download),
      status);
  }

  destroy() {
    this.stops.forEach(stop => stop());
    this.stops = [];
  }
}
