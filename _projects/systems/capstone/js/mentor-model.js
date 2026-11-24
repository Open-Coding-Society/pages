// Pure rules for a mentor's project cards, read from the project's data file.
// The server is the source of truth; this only describes what it returned.

export function cardState(choices, project) {
  return choices?.[project]?.status || 'default';
}

export function describeState(config, state) {
  const description = config.states[state];
  if (!description) throw new Error(`Unknown Capstone card state: ${state}`);
  return {
    pill: description.pill || null,
    tone: description.tone || null,
    actions: (description.actions || []).map((id) => ({
      id,
      label: config.actions[id],
      primary: id === 'apply' || id === 'apply-again',
    })),
  };
}

export function matchesChoiceFilter(config, state, filterId) {
  if (filterId === 'all') return true;
  const filter = config.filters.find((candidate) => candidate.id === filterId);
  return Boolean(filter && state) && filter.states.includes(state);
}

export function countStates(projects, choices) {
  const counts = { interested: 0, pending: 0, approved: 0, skipped: 0 };
  projects.forEach((project) => {
    const state = cardState(choices, project);
    if (state in counts) counts[state] += 1;
  });
  return counts;
}

// Reset only clears Interested and Skipped, so only those are counted.
export function resettableCount(choices) {
  return Object.values(choices || {})
    .filter(({ status }) => status === 'interested' || status === 'skipped').length;
}

// Runs saves one at a time, so a slow response can never replace a newer one on screen.
export function createActionQueue() {
  let last = Promise.resolve();
  return (task) => {
    const result = last.then(task);
    last = result.catch(() => {});
    return result;
  };
}

export function resetMessage(config, count) {
  if (count === 0) return config.text.reset_none;
  return count === 1 ? config.text.reset_one : config.text.reset_many.replace('{count}', String(count));
}
