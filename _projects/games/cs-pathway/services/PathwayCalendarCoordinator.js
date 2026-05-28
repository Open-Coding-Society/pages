/**
 * Orchestrates CS Pathway → Spring calendar sync (SRP: workflow only).
 */

import LocalProfile from '../model/localProfile.js';
import { publishPathwayEvents } from './PathwayCalendarApi.js';
import {
  buildPathwayTimelineEvents,
  getPathwayStartDateFromProfile,
} from './PathwayTimelineBuilder.js';

function resolveCourseId(profileData = {}) {
  const plan = profileData.coursePlanMeta || {};
  if (plan.course) return plan.course;
  if (plan.title) return plan.title;
  if (Array.isArray(plan.recommendedClasses) && plan.recommendedClasses.length > 0) {
    const first = plan.recommendedClasses[0];
    return typeof first === 'string' ? first : first?.name || first?.id || '';
  }
  return '';
}

function buildCalendarMeta(profileData, syncResult, eventCount) {
  const existing = profileData.pathwayCalendarMeta || {};
  const startedAt = existing.startedAt || new Date().toISOString();
  return {
    ...existing,
    startedAt,
    lastSyncedAt: new Date().toISOString(),
    courseId: resolveCourseId(profileData) || existing.courseId || '',
    eventCount,
    lastSyncOk: syncResult.ok,
    lastSyncCreated: syncResult.created,
    lastSyncUpdated: syncResult.updated,
    lastSyncFailed: syncResult.failed,
  };
}

async function persistCalendarMeta(profileData, syncResult, eventCount) {
  const meta = buildCalendarMeta(profileData, syncResult, eventCount);
  const updatedProfile = {
    ...profileData,
    pathwayCalendarMeta: meta,
  };
  LocalProfile.update({ pathwayCalendarMeta: meta });
  return updatedProfile;
}

/**
 * Ensure the signed-in student has a personal CS Pathway timeline on Spring calendar.
 *
 * @param {object} options
 * @param {object} [options.profileData] - Current flat profile
 * @param {boolean} [options.isAuthenticated]
 * @param {boolean} [options.force=false] - Re-publish even if already synced
 * @param {boolean} [options.includeDrills=true]
 * @param {function} [options.onStatus] - Callback for UI messages
 * @returns {Promise<{ ok: boolean, skipped: boolean, profileData: object|null, result: object|null }>}
 */
export async function ensurePathwayCalendarTimeline({
  profileData = {},
  isAuthenticated = false,
  force = false,
  includeDrills = true,
  onStatus = null,
} = {}) {
  if (!isAuthenticated) {
    onStatus?.('Log in to publish your CS Pathway timeline to the student calendar.');
    return { ok: false, skipped: true, profileData, result: null };
  }

  const existingMeta = profileData.pathwayCalendarMeta || {};
  const courseId = resolveCourseId(profileData);
  const courseChanged = courseId && existingMeta.courseId && existingMeta.courseId !== courseId;

  if (!force && !courseChanged && existingMeta.lastSyncedAt && existingMeta.lastSyncOk) {
    return { ok: true, skipped: true, profileData, result: null };
  }

  let startedAt = getPathwayStartDateFromProfile(profileData);
  if (!startedAt) {
    startedAt = new Date().toISOString();
    profileData = {
      ...profileData,
      pathwayCalendarMeta: {
        ...existingMeta,
        startedAt,
      },
    };
    LocalProfile.update({
      pathwayCalendarMeta: profileData.pathwayCalendarMeta,
    });
  }

  onStatus?.('Publishing your CS Pathway learning timeline…');

  const events = buildPathwayTimelineEvents({
    startDate: startedAt,
    courseId,
    includeDrills,
  });

  const result = await publishPathwayEvents(events);
  const updatedProfile = await persistCalendarMeta(profileData, result, events.length);

  if (result.ok) {
    const total = result.created + result.updated;
    onStatus?.(`Calendar updated with ${total} personal CS Pathway task${total === 1 ? '' : 's'}.`);
  } else {
    onStatus?.(result.errors?.[0] || 'Could not sync CS Pathway tasks to your calendar.');
  }

  return {
    ok: result.ok,
    skipped: false,
    profileData: updatedProfile,
    result,
  };
}

/**
 * Called after course enlistment to refresh course-specific milestones.
 */
export async function syncPathwayCalendarAfterCoursePlan({
  profileData,
  isAuthenticated,
  onStatus,
} = {}) {
  return ensurePathwayCalendarTimeline({
    profileData,
    isAuthenticated,
    force: true,
    includeDrills: false,
    onStatus,
  });
}
