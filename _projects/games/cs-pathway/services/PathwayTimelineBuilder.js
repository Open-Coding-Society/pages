/**
 * Builds Spring calendar payloads from pathway catalogs and a start date.
 */

import {
  PATHWAY_MILESTONE_TASKS,
  PATHWAY_COURSE_TASKS,
} from '../data/pathwayTaskCatalog.js';
import {
  CS_PATHWAY_MISSION_DESK_KNOWLEDGE_BASE,
  CS_PATHWAY_SPRINT_TASKS,
  CS_PATHWAY_SPRINT_TIMELINE_TASKS,
} from '../data/calendarSeedCatalog.js';

const PATHWAY_TITLE_PREFIX = 'CS Pathway';

function addDays(baseDate, dayOffset) {
  const next = new Date(baseDate);
  next.setUTCDate(next.getUTCDate() + dayOffset);
  return next;
}

function formatIsoDate(dateValue) {
  return new Date(dateValue).toISOString().slice(0, 10);
}

function normalizeStartDate(startDate) {
  const parsed = new Date(startDate);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

function buildEvent({ title, description, date, priority, level }) {
  const safePriority = priority || 'P2';
  return {
    title: `[${safePriority}] ${PATHWAY_TITLE_PREFIX} | ${level} | ${title}`,
    description,
    date,
    type: 'event',
    period: PATHWAY_TITLE_PREFIX,
    classPeriod: '',
    groupName: PATHWAY_TITLE_PREFIX,
    priority: safePriority,
  };
}

function collectMilestoneTasks(courseId) {
  const tasks = [...PATHWAY_MILESTONE_TASKS];
  const courseKey = String(courseId || '').trim().toUpperCase();
  if (courseKey && PATHWAY_COURSE_TASKS[courseKey]) {
    tasks.push(...PATHWAY_COURSE_TASKS[courseKey]);
  }
  return tasks;
}

function buildMilestoneEvents({ startDate, courseId }) {
  const baseDate = normalizeStartDate(startDate);
  return collectMilestoneTasks(courseId).map((task) => {
    const eventDate = formatIsoDate(addDays(baseDate, task.dayOffset));
    return buildEvent({
      title: task.title,
      description: `${task.description}\nLevel: ${task.level}\nTask id: ${task.id}`,
      date: eventDate,
      priority: task.priority,
      level: task.level,
    });
  });
}

function buildMissionDeskEvents({ startDate, dayOffsetStart = 12 }) {
  const baseDate = normalizeStartDate(startDate);
  const events = [];
  let dayOffset = dayOffsetStart;

  Object.entries(CS_PATHWAY_MISSION_DESK_KNOWLEDGE_BASE).forEach(([deskName, deskData]) => {
    deskData.questions.forEach((item, index) => {
      events.push(buildEvent({
        title: `Mission drill: ${item.question}`,
        description: `Challenge ${index + 1} from ${deskName}.\nAnswer: ${item.answer}`,
        date: formatIsoDate(addDays(baseDate, dayOffset)),
        priority: 'P2',
        level: `Mission Tools · ${deskName}`,
      }));
      dayOffset += 1;
    });
  });

  return events;
}

function buildSprintModuleEvents({ startDate, dayOffsetStart = 5 }) {
  const baseDate = normalizeStartDate(startDate);
  const events = [];
  let dayOffset = dayOffsetStart;

  CS_PATHWAY_SPRINT_TASKS.forEach((task, index) => {
    events.push(buildEvent({
      title: `Sprint card: ${task.text}`,
      description: `Sprint Success decomposition card ${index + 1}.\nType: ${task.label}`,
      date: formatIsoDate(addDays(baseDate, dayOffset)),
      priority: 'P2',
      level: 'Wayfinding World · Sprint Success',
    }));
    dayOffset += 1;
  });

  CS_PATHWAY_SPRINT_TIMELINE_TASKS.forEach((task, index) => {
    events.push(buildEvent({
      title: `Sprint timeline: ${task}`,
      description: `Sprint Success timeline step ${index + 1}.`,
      date: formatIsoDate(addDays(baseDate, dayOffset)),
      priority: 'P2',
      level: 'Wayfinding World · Sprint Success',
    }));
    dayOffset += 1;
  });

  return events;
}

/**
 * @param {{ startDate: string|Date, courseId?: string, includeDrills?: boolean }} options
 * @returns {Array<object>} Calendar events ready for Spring /api/calendar/add_events
 */
export function buildPathwayTimelineEvents({
  startDate,
  courseId = '',
  includeDrills = true,
} = {}) {
  const milestones = buildMilestoneEvents({ startDate, courseId });
  if (!includeDrills) {
    return milestones;
  }

  return [
    ...milestones,
    ...buildSprintModuleEvents({ startDate }),
    ...buildMissionDeskEvents({ startDate }),
  ];
}

export function getPathwayStartDateFromProfile(profileData = {}) {
  const meta = profileData.pathwayCalendarMeta || {};
  if (meta.startedAt) {
    return meta.startedAt;
  }
  if (profileData.coursePlanMeta?.completedAt) {
    return profileData.coursePlanMeta.completedAt;
  }
  return null;
}
