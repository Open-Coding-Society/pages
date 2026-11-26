// Who reads and posts in each channel. A channel is a group chat of one of two kinds:
//   'updates' — staff to the members, read-only for LPs like a course's announcement channel;
//               series null is the all-members channel, otherwise one series' updates.
//   'series'  — one series' group, where its LPs talk with each other and with staff.
// Staff and moderators are in every series; an LP is in the series on their record. These
// are the checks Spring has to make on the server; the demo backend makes them too.
import { CommunityRoles } from './community-roles.js';

/**
 * Channel rules, used like Java's Math: ChannelRules.canPost(person, channel).
 */
export class ChannelRules {
  static UPDATES = 'updates';
  static SERIES = 'series';

  /**
   * Whether a person belongs to a series: staff and moderators always do.
   * @param {object} person
   * @param {string} seriesId
   * @returns {boolean}
   */
  static inSeries(person, seriesId) {
    if (CommunityRoles.canModerate(person)) return true;
    return (person?.series || []).includes(seriesId);
  }

  /**
   * Whether a person can read a channel and follow it live.
   * @param {object} person
   * @param {{kind: string, series: string|null}} channel
   * @returns {boolean}
   */
  static canRead(person, channel) {
    if (!CommunityRoles.isMember(person) || !channel) return false;
    return channel.series === null || ChannelRules.inSeries(person, channel.series);
  }

  /**
   * Whether a person can post in a channel, and why not when they can't. Reasons:
   * 'not-member', 'staff-only' (an updates channel), 'muted' (a series group).
   * @param {object} person
   * @param {{kind: string, series: string|null}} channel
   * @param {{muted?: boolean}} options
   * @returns {{allowed: boolean, reason: string}}
   */
  static canPost(person, channel, { muted = false } = {}) {
    if (!ChannelRules.canRead(person, channel)) return { allowed: false, reason: 'not-member' };
    if (channel.kind === ChannelRules.UPDATES && !CommunityRoles.isStaff(person)) return { allowed: false, reason: 'staff-only' };
    if (muted) return { allowed: false, reason: 'muted' };
    return { allowed: true, reason: '' };
  }

  /**
   * The channels a person can read, in the order given.
   * @param {object} person
   * @param {object[]} channels
   * @returns {object[]}
   */
  static readable(person, channels) {
    return channels.filter(channel => ChannelRules.canRead(person, channel));
  }

  /**
   * Where a reply to an update can go: the series groups the person can post in, with the
   * update's own series first. An LP in no series gets none, and the page says why.
   * @param {object} person
   * @param {{series: string|null}} updatesChannel the channel the update was posted in
   * @param {object[]} channels
   * @param {{isMuted?: function(number): boolean}} options isMuted(channelId)
   * @returns {object[]}
   */
  static replyTargets(person, updatesChannel, channels, { isMuted = () => false } = {}) {
    const groups = channels.filter(channel => channel.kind === ChannelRules.SERIES
      && ChannelRules.canPost(person, channel, { muted: isMuted(channel.id) }).allowed);
    const own = updatesChannel?.series;
    return [...groups.filter(channel => channel.series === own), ...groups.filter(channel => channel.series !== own)];
  }
}
