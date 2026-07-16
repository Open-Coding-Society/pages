// ============================================
// CalendarUI.js
// RESPONSIBILITY: All DOM rendering and user-interaction handling
// This module does ONE thing: manage what the user sees and clicks.
// It does NOT: parse calendar data, build event payloads, or call APIs.
// ============================================

// ─── Modal State ────────────────────────────────────────────────

let currentSyncModalData = null;
let currentRemoveModalData = null;

// ─── Status & Toast Notifications ───────────────────────────────

/**
 * Show a status message in a sprint status element.
 * @param {HTMLElement|null} el
 * @param {string} message
 * @param {string} type - 'success' | 'warning' | 'error' | 'info'
 */
function showDateStatus(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = 'sprint-date-status ' + type;

  if (type === 'success' || type === 'error' || type === 'warning') {
    setTimeout(() => {
      el.textContent = '';
      el.className = 'sprint-date-status';
    }, 5000);
  }
}

/**
 * Show a floating toast notification.
 * @param {string} message
 * @param {string} type - 'success' | 'warning' | 'error'
 */
function showToastNotification(message, type) {
  const existingToast = document.querySelector('.calendar-toast-notification');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `calendar-toast-notification ${type}`;
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
    <button class="toast-close">&times;</button>
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

// ─── Build Week Selection HTML ─────────────────────────────────

/**
 * Build the HTML for the week selection list inside sync/remove modals.
 * @param {string} sprintKey
 * @param {string} course
 * @param {number} startWeek
 * @param {number} endWeek
 * @param {string} modalType - 'sync' or 'remove'
 * @returns {string} HTML string
 */
function buildWeekSelectionHTML(sprintKey, course, startWeek, endWeek, modalType) {
  const sprintCard = document.querySelector(`.sprint-card[data-sprint="${sprintKey}"]`);
  const weekCards = sprintCard?.querySelectorAll('.week-card') || [];
  const courseName = course.toUpperCase();

  // Load saved item priorities from localStorage
  const ITEM_PRIORITY_KEY = `item_priorities_${window.location.pathname}`;
  let savedPriorities = {};
  try {
    const stored = localStorage.getItem(ITEM_PRIORITY_KEY);
    savedPriorities = stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.warn('Could not load saved priorities:', e);
  }

  const getSavedPriority = (url) => savedPriorities[url] || 'P2';

  const buildPriorityOptions = (url) => {
    const saved = getSavedPriority(url);
    return ['P0', 'P1', 'P2', 'P3'].map(p =>
      `<option value="${p}"${p === saved ? ' selected' : ''}>${p}</option>`
    ).join('');
  };

  let html = '';

  for (const weekCard of weekCards) {
    const weekNum = parseInt(weekCard.dataset.week);
    const items = parseWeekItems(weekCard);
    if (items.length === 0) continue;

    const formativeItems = items.filter(i => i.type === 'formative');
    const summativeItems = items.filter(i => i.type === 'summative');
    const readingDate = getReadingDate(weekNum);
    const assessmentDate = getAssessmentDate(weekNum);

    const calendarWeek = SCHOOL_CALENDAR.weeks[weekNum];
    const isSkip = calendarWeek?.skipWeek;
    const hasHoliday = calendarWeek?.holidays && !isSkip;
    const isPastDate = readingDate && new Date(readingDate) < new Date();

    html += `
      <div class="sync-week-group" data-week="${weekNum}">
        <div class="sync-week-header">
          <label class="sync-week-checkbox">
            <input type="checkbox" class="week-select-all" data-week="${weekNum}" checked>
            <span class="week-label">
              <strong>Week ${weekNum}</strong>
              <span class="week-date-range">${readingDate ? formatDateShort(readingDate) : ''} - ${assessmentDate ? formatDateShort(assessmentDate) : ''}</span>
            </span>
          </label>
          <button type="button" class="week-expand-btn" data-week="${weekNum}">
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        
        ${isSkip ? `<div class="sync-item-warning skip"><i class="fas fa-umbrella-beach"></i> Break week - ${calendarWeek.holidays?.join(', ') || 'No school'}</div>` : ''}
        ${hasHoliday ? `<div class="sync-item-warning holiday"><i class="fas fa-exclamation-triangle"></i> Holiday: ${calendarWeek.holidays?.join(', ')} - Materials on Tuesday</div>` : ''}
        ${isPastDate ? `<div class="sync-item-warning past"><i class="fas fa-clock"></i> This week's dates have already passed</div>` : ''}
        
        <div class="sync-week-items" data-week="${weekNum}">
          ${formativeItems.length > 0 ? `
            <div class="sync-item-category">
              <div class="sync-category-header">
                <label class="sync-category-checkbox">
                  <input type="checkbox" class="category-select-all" data-week="${weekNum}" data-type="formative" checked>
                  <i class="fas fa-book"></i> Formative (${readingDate ? formatDateShort(readingDate) : 'Monday'})
                </label>
              </div>
              <div class="sync-item-list">
                ${formativeItems.map(item => `
                  <label class="sync-item-checkbox">
                    <input type="checkbox" class="item-checkbox" data-week="${weekNum}" data-type="formative" data-id="${item.id}" data-title="${item.title}" data-url="${item.url || ''}" data-default-date="${readingDate || ''}" checked>
                    <span class="item-title">${item.title}</span>
                    <select class="item-priority-select" data-id="${item.id}" data-url="${item.url || ''}">
                      ${buildPriorityOptions(item.url)}
                    </select>
                    <input type="date" class="item-date-input" data-id="${item.id}" value="${readingDate || ''}" title="Custom date (leave as-is to use default)">
                    ${item.url ? `<a href="${SITE_BASEURL}${item.url}" target="_blank" class="item-link-icon" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i></a>` : ''}
                  </label>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${summativeItems.length > 0 ? `
            <div class="sync-item-category">
              <div class="sync-category-header">
                <label class="sync-category-checkbox">
                  <input type="checkbox" class="category-select-all" data-week="${weekNum}" data-type="summative" checked>
                  <i class="fas fa-clipboard-check"></i> Summative (${assessmentDate ? formatDateShort(assessmentDate) : 'Friday'})
                </label>
              </div>
              <div class="sync-item-list">
                ${summativeItems.map(item => `
                  <label class="sync-item-checkbox">
                    <input type="checkbox" class="item-checkbox" data-week="${weekNum}" data-type="summative" data-id="${item.id}" data-title="${item.title}" data-url="${item.url || ''}" data-default-date="${assessmentDate || ''}" checked>
                    <span class="item-title">${item.title}</span>
                    <select class="item-priority-select" data-id="${item.id}" data-url="${item.url || ''}">
                      ${buildPriorityOptions(item.url)}
                    </select>
                    <input type="date" class="item-date-input" data-id="${item.id}" value="${assessmentDate || ''}" title="Custom date (leave as-is to use default)">
                    ${item.url ? `<a href="${SITE_BASEURL}${item.url}" target="_blank" class="item-link-icon" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i></a>` : ''}
                  </label>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  return html || '<p class="no-items-message">No items found for this sprint.</p>';
}

// ─── Modal Open / Close ─────────────────────────────────────────

/**
 * Open the selective sync modal for a sprint.
 */
function openSelectiveSyncModal(sprintKey, course, startWeek, endWeek) {
  currentSyncModalData = { sprintKey, course, startWeek, endWeek };

  const sprintCard = document.querySelector(`.sprint-card[data-sprint="${sprintKey}"]`);
  const sprintTitle = sprintCard?.querySelector('.sprint-title')?.textContent || sprintKey;
  const courseName = course.toUpperCase();

  document.getElementById('sync-modal-sprint-name').textContent = `${sprintTitle} - ${courseName}`;
  const dateRange = getSprintDateRange(startWeek, endWeek);
  document.getElementById('sync-modal-date-range').textContent =
    dateRange.start && dateRange.end
      ? `${formatDateDisplay(dateRange.start)} - ${formatDateDisplay(dateRange.end)}`
      : `Weeks ${startWeek}-${endWeek}`;

  document.getElementById('sync-week-list').innerHTML = buildWeekSelectionHTML(sprintKey, course, startWeek, endWeek, 'sync');
  checkForExistingEvents(course, startWeek, endWeek);
  initializeSyncModalCheckboxes('sync');
  updateSelectedCount('sync');

  document.querySelectorAll('.sprint-date-dropdown').forEach(d => d.classList.add('hidden'));
  document.getElementById('selective-sync-modal').style.display = 'flex';
}

/**
 * Open the selective remove modal for a sprint.
 */
function openSelectiveRemoveModal(sprintKey, course, startWeek, endWeek) {
  currentRemoveModalData = { sprintKey, course, startWeek, endWeek };

  const sprintCard = document.querySelector(`.sprint-card[data-sprint="${sprintKey}"]`);
  const sprintTitle = sprintCard?.querySelector('.sprint-title')?.textContent || sprintKey;
  const courseName = course.toUpperCase();

  document.getElementById('remove-modal-sprint-name').textContent = `${sprintTitle} - ${courseName}`;
  const dateRange = getSprintDateRange(startWeek, endWeek);
  document.getElementById('remove-modal-date-range').textContent =
    dateRange.start && dateRange.end
      ? `${formatDateDisplay(dateRange.start)} - ${formatDateDisplay(dateRange.end)}`
      : `Weeks ${startWeek}-${endWeek}`;

  document.getElementById('remove-week-list').innerHTML = buildWeekSelectionHTML(sprintKey, course, startWeek, endWeek, 'remove');
  initializeSyncModalCheckboxes('remove');
  updateSelectedCount('remove');

  document.querySelectorAll('.sprint-date-dropdown').forEach(d => d.classList.add('hidden'));
  document.getElementById('selective-remove-modal').style.display = 'flex';
}

function closeSelectiveSyncModal() {
  document.getElementById('selective-sync-modal').style.display = 'none';
  currentSyncModalData = null;
}

function closeSelectiveRemoveModal() {
  document.getElementById('selective-remove-modal').style.display = 'none';
  currentRemoveModalData = null;
}

// ─── Checkbox State Management ──────────────────────────────────

/**
 * Initialize all checkbox event handlers within a sync/remove modal.
 * @param {string} modalType - 'sync' or 'remove'
 */
function initializeSyncModalCheckboxes(modalType) {
  const listId = modalType === 'sync' ? 'sync-week-list' : 'remove-week-list';
  const listEl = document.getElementById(listId);

  // Week expand/collapse
  listEl.querySelectorAll('.week-expand-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const weekNum = btn.dataset.week;
      const itemsContainer = listEl.querySelector(`.sync-week-items[data-week="${weekNum}"]`);
      const icon = btn.querySelector('i');

      if (itemsContainer.classList.contains('collapsed')) {
        itemsContainer.classList.remove('collapsed');
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-down');
      } else {
        itemsContainer.classList.add('collapsed');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-right');
      }
    });
  });

  // Week select all checkbox
  listEl.querySelectorAll('.week-select-all').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const weekNum = checkbox.dataset.week;
      const isChecked = checkbox.checked;

      listEl.querySelectorAll(`.item-checkbox[data-week="${weekNum}"]`).forEach(cb => {
        cb.checked = isChecked;
      });
      listEl.querySelectorAll(`.category-select-all[data-week="${weekNum}"]`).forEach(cb => {
        cb.checked = isChecked;
      });
      updateSelectedCount(modalType);
    });
  });

  // Category select all checkbox
  listEl.querySelectorAll('.category-select-all').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const weekNum = checkbox.dataset.week;
      const type = checkbox.dataset.type;
      const isChecked = checkbox.checked;

      listEl.querySelectorAll(`.item-checkbox[data-week="${weekNum}"][data-type="${type}"]`).forEach(cb => {
        cb.checked = isChecked;
      });
      updateWeekCheckboxState(listEl, weekNum);
      updateSelectedCount(modalType);
    });
  });

  // Individual item checkbox
  listEl.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const weekNum = checkbox.dataset.week;
      const type = checkbox.dataset.type;
      updateCategoryCheckboxState(listEl, weekNum, type);
      updateWeekCheckboxState(listEl, weekNum);
      updateSelectedCount(modalType);
    });
  });

  // Prevent date inputs from triggering label clicks
  listEl.querySelectorAll('.item-date-input').forEach(input => {
    input.addEventListener('click', (e) => e.stopPropagation());
  });

  // Prevent priority selects from triggering label clicks
  listEl.querySelectorAll('.item-priority-select').forEach(select => {
    select.addEventListener('click', (e) => e.stopPropagation());
  });
}

function updateCategoryCheckboxState(listEl, weekNum, type) {
  const categoryCheckbox = listEl.querySelector(`.category-select-all[data-week="${weekNum}"][data-type="${type}"]`);
  if (!categoryCheckbox) return;

  const items = listEl.querySelectorAll(`.item-checkbox[data-week="${weekNum}"][data-type="${type}"]`);
  const checkedItems = listEl.querySelectorAll(`.item-checkbox[data-week="${weekNum}"][data-type="${type}"]:checked`);

  categoryCheckbox.checked = checkedItems.length === items.length;
  categoryCheckbox.indeterminate = checkedItems.length > 0 && checkedItems.length < items.length;
}

function updateWeekCheckboxState(listEl, weekNum) {
  const weekCheckbox = listEl.querySelector(`.week-select-all[data-week="${weekNum}"]`);
  if (!weekCheckbox) return;

  const items = listEl.querySelectorAll(`.item-checkbox[data-week="${weekNum}"]`);
  const checkedItems = listEl.querySelectorAll(`.item-checkbox[data-week="${weekNum}"]:checked`);

  weekCheckbox.checked = checkedItems.length === items.length;
  weekCheckbox.indeterminate = checkedItems.length > 0 && checkedItems.length < items.length;
}

function updateSelectedCount(modalType) {
  const listId = modalType === 'sync' ? 'sync-week-list' : 'remove-week-list';
  const countId = modalType === 'sync' ? 'sync-selected-count' : 'remove-selected-count';

  const listEl = document.getElementById(listId);
  const checkedItems = listEl.querySelectorAll('.item-checkbox:checked');
  document.getElementById(countId).textContent = checkedItems.length;
}

// ─── Preview Modal ──────────────────────────────────────────────

/**
 * Show the calendar preview modal with proposed changes.
 */
async function showCalendarPreview() {
  if (!currentSyncModalData) return;

  const { sprintKey, course } = currentSyncModalData;
  const selectedItems = getSelectedItemsFromModal();
  const priority = document.querySelector('input[name="sync-modal-priority"]:checked')?.value || 'P2';
  const courseName = course.toUpperCase();

  if (Object.keys(selectedItems).length === 0) {
    alert('No items selected to preview.');
    return;
  }

  document.getElementById('selective-sync-modal').style.display = 'none';
  document.getElementById('calendar-preview-modal').style.display = 'flex';

  await populateCalendarPreview(selectedItems, priority, courseName);
}

/**
 * Populate the preview modal with current and proposed events.
 */
async function populateCalendarPreview(selectedItems, priority, courseName) {
  const currentList = document.getElementById('current-events-list');
  const proposedList = document.getElementById('proposed-changes-list');

  let currentEvents = [];
  let fetchError = false;

  // Try to fetch current calendar events (optional - preview works without it)
  try {
    const { javaURI, fetchOptions } = await loadApiConfig();

    if (javaURI) {
      const response = await fetch(`${javaURI}/api/calendar/events`, fetchOptions);
      const errType = classifyError(response);
      if (errType === ERROR_TYPES.AUTH_EXPIRED) {
        console.warn('Session expired during calendar preview fetch');
        fetchError = true;
      } else if (response.ok) {
        const allEvents = await response.json();
        currentEvents = allEvents.filter(e => e.period === courseName);
      } else {
        fetchError = true;
      }
    } else {
      fetchError = true;
    }
  } catch (e) {
    console.warn('Could not fetch existing calendar events:', e);
    fetchError = true;
  }

  // Build proposed events (this part doesn't need the API)
  const proposedEvents = buildEventsFromSelection(selectedItems, priority, courseName);

  // Categorize
  const toAdd = [];
  const toUpdate = [];

  proposedEvents.forEach(proposed => {
    const existing = currentEvents.find(e =>
      e.title.includes(`Week ${proposed.weekNum}`) &&
      e.title.includes(proposed.type === 'formative' ? 'Formative' : 'Summative') &&
      e.title.includes(courseName)
    );

    if (existing) {
      toUpdate.push({ ...proposed, status: 'update', existingId: existing.id });
    } else {
      toAdd.push({ ...proposed, status: 'add' });
    }
  });

  // Display current events
  if (fetchError) {
    currentList.innerHTML = '<p class="no-events"><i class="fas fa-exclamation-triangle"></i> Could not load current calendar (not logged in or API unavailable)</p>';
  } else if (currentEvents.length === 0) {
    currentList.innerHTML = '<p class="no-events">No events currently on calendar for this course</p>';
  } else {
    currentList.innerHTML = currentEvents
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(e => `
        <div class="preview-event-item current">
          <div class="event-title">${e.title}</div>
          <div class="event-date">${formatDateDisplay(e.date)}</div>
        </div>
      `).join('');
  }

  // Display proposed changes
  if (toAdd.length === 0 && toUpdate.length === 0) {
    proposedList.innerHTML = '<p class="no-events">No changes to make</p>';
  } else {
    const addHTML = toAdd.map(e => `
      <div class="preview-event-item add">
        <div class="event-status"><i class="fas fa-plus-circle"></i> ADD</div>
        <div class="event-title">${e.title}</div>
        <div class="event-date">${formatDateDisplay(e.date)}</div>
        <div class="event-description-preview">${e.description.substring(0, 100)}...</div>
      </div>
    `).join('');

    const updateHTML = toUpdate.map(e => `
      <div class="preview-event-item update">
        <div class="event-status"><i class="fas fa-sync-alt"></i> UPDATE</div>
        <div class="event-title">${e.title}</div>
        <div class="event-date">${formatDateDisplay(e.date)}</div>
        <div class="event-description-preview">${e.description.substring(0, 100)}...</div>
      </div>
    `).join('');

    proposedList.innerHTML = addHTML + updateHTML;
  }

  // Update counts
  document.getElementById('add-count').textContent = toAdd.length;
  document.getElementById('update-count').textContent = toUpdate.length;
}

function closePreviewModal() {
  document.getElementById('calendar-preview-modal').style.display = 'none';
  document.getElementById('selective-sync-modal').style.display = 'flex';
}

// ─── Initialize All Modal Event Handlers ────────────────────────

/**
 * Bind all static event listeners for sync/remove/preview modals.
 * Called once during initializeSprintDates.
 */
function initializeSelectiveSyncModals() {
  // Close buttons
  document.getElementById('close-selective-sync-modal')?.addEventListener('click', closeSelectiveSyncModal);
  document.getElementById('cancel-selective-sync')?.addEventListener('click', closeSelectiveSyncModal);
  document.getElementById('close-selective-remove-modal')?.addEventListener('click', closeSelectiveRemoveModal);
  document.getElementById('cancel-selective-remove')?.addEventListener('click', closeSelectiveRemoveModal);

  // Confirm buttons
  document.getElementById('confirm-selective-sync')?.addEventListener('click', executeSelectiveSync);
  document.getElementById('confirm-selective-remove')?.addEventListener('click', executeSelectiveRemove);

  // Quick action buttons - Sync modal
  document.getElementById('sync-select-all')?.addEventListener('click', () => {
    document.querySelectorAll('#sync-week-list .item-checkbox').forEach(cb => cb.checked = true);
    document.querySelectorAll('#sync-week-list .category-select-all').forEach(cb => { cb.checked = true; cb.indeterminate = false; });
    document.querySelectorAll('#sync-week-list .week-select-all').forEach(cb => { cb.checked = true; cb.indeterminate = false; });
    updateSelectedCount('sync');
  });

  document.getElementById('sync-deselect-all')?.addEventListener('click', () => {
    document.querySelectorAll('#sync-week-list .item-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('#sync-week-list .category-select-all').forEach(cb => { cb.checked = false; cb.indeterminate = false; });
    document.querySelectorAll('#sync-week-list .week-select-all').forEach(cb => { cb.checked = false; cb.indeterminate = false; });
    updateSelectedCount('sync');
  });

  document.getElementById('sync-select-formative')?.addEventListener('click', () => {
    document.querySelectorAll('#sync-week-list .item-checkbox[data-type="formative"]').forEach(cb => cb.checked = true);
    document.querySelectorAll('#sync-week-list .item-checkbox[data-type="summative"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('#sync-week-list .category-select-all[data-type="formative"]').forEach(cb => { cb.checked = true; cb.indeterminate = false; });
    document.querySelectorAll('#sync-week-list .category-select-all[data-type="summative"]').forEach(cb => { cb.checked = false; cb.indeterminate = false; });
    document.querySelectorAll('#sync-week-list .week-select-all').forEach(cb => {
      const weekNum = cb.dataset.week;
      updateWeekCheckboxState(document.getElementById('sync-week-list'), weekNum);
    });
    updateSelectedCount('sync');
  });

  document.getElementById('sync-select-summative')?.addEventListener('click', () => {
    document.querySelectorAll('#sync-week-list .item-checkbox[data-type="summative"]').forEach(cb => cb.checked = true);
    document.querySelectorAll('#sync-week-list .item-checkbox[data-type="formative"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('#sync-week-list .category-select-all[data-type="summative"]').forEach(cb => { cb.checked = true; cb.indeterminate = false; });
    document.querySelectorAll('#sync-week-list .category-select-all[data-type="formative"]').forEach(cb => { cb.checked = false; cb.indeterminate = false; });
    document.querySelectorAll('#sync-week-list .week-select-all').forEach(cb => {
      const weekNum = cb.dataset.week;
      updateWeekCheckboxState(document.getElementById('sync-week-list'), weekNum);
    });
    updateSelectedCount('sync');
  });

  // Quick action buttons - Remove modal
  document.getElementById('remove-select-all')?.addEventListener('click', () => {
    document.querySelectorAll('#remove-week-list .item-checkbox').forEach(cb => cb.checked = true);
    document.querySelectorAll('#remove-week-list .category-select-all').forEach(cb => { cb.checked = true; cb.indeterminate = false; });
    document.querySelectorAll('#remove-week-list .week-select-all').forEach(cb => { cb.checked = true; cb.indeterminate = false; });
    updateSelectedCount('remove');
  });

  document.getElementById('remove-deselect-all')?.addEventListener('click', () => {
    document.querySelectorAll('#remove-week-list .item-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('#remove-week-list .category-select-all').forEach(cb => { cb.checked = false; cb.indeterminate = false; });
    document.querySelectorAll('#remove-week-list .week-select-all').forEach(cb => { cb.checked = false; cb.indeterminate = false; });
    updateSelectedCount('remove');
  });

  document.getElementById('remove-select-formative')?.addEventListener('click', () => {
    document.querySelectorAll('#remove-week-list .item-checkbox[data-type="formative"]').forEach(cb => cb.checked = true);
    document.querySelectorAll('#remove-week-list .item-checkbox[data-type="summative"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('#remove-week-list .category-select-all[data-type="formative"]').forEach(cb => { cb.checked = true; cb.indeterminate = false; });
    document.querySelectorAll('#remove-week-list .category-select-all[data-type="summative"]').forEach(cb => { cb.checked = false; cb.indeterminate = false; });
    document.querySelectorAll('#remove-week-list .week-select-all').forEach(cb => {
      const weekNum = cb.dataset.week;
      updateWeekCheckboxState(document.getElementById('remove-week-list'), weekNum);
    });
    updateSelectedCount('remove');
  });

  document.getElementById('remove-select-summative')?.addEventListener('click', () => {
    document.querySelectorAll('#remove-week-list .item-checkbox[data-type="summative"]').forEach(cb => cb.checked = true);
    document.querySelectorAll('#remove-week-list .item-checkbox[data-type="formative"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('#remove-week-list .category-select-all[data-type="summative"]').forEach(cb => { cb.checked = true; cb.indeterminate = false; });
    document.querySelectorAll('#remove-week-list .category-select-all[data-type="formative"]').forEach(cb => { cb.checked = false; cb.indeterminate = false; });
    document.querySelectorAll('#remove-week-list .week-select-all').forEach(cb => {
      const weekNum = cb.dataset.week;
      updateWeekCheckboxState(document.getElementById('remove-week-list'), weekNum);
    });
    updateSelectedCount('remove');
  });

  // Bulk priority buttons
  document.querySelectorAll('.bulk-priority-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const priority = btn.dataset.priority;
      document.querySelectorAll('#sync-week-list .item-priority-select').forEach(select => {
        select.value = priority;
        savePriorityToStorage(select);
      });
      document.querySelectorAll('.bulk-priority-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Sync modal priority changes → localStorage
  document.getElementById('sync-week-list')?.addEventListener('change', (e) => {
    if (e.target.classList.contains('item-priority-select')) {
      savePriorityToStorage(e.target);
      const url = e.target.dataset.url;
      const dashboardDropdown = document.querySelector(`.item-priority-dropdown[data-item-url="${url}"]`);
      if (dashboardDropdown) {
        dashboardDropdown.value = e.target.value;
        dashboardDropdown.classList.remove('priority-p0', 'priority-p1', 'priority-p2', 'priority-p3');
        dashboardDropdown.classList.add(`priority-${e.target.value.toLowerCase()}`);
      }
    }
  });

  // Close on outside click
  document.getElementById('selective-sync-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'selective-sync-modal') closeSelectiveSyncModal();
  });
  document.getElementById('selective-remove-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'selective-remove-modal') closeSelectiveRemoveModal();
  });

  // Preview modal handlers
  document.getElementById('close-preview-modal')?.addEventListener('click', closePreviewModal);
  document.getElementById('preview-back')?.addEventListener('click', closePreviewModal);
  document.getElementById('preview-confirm')?.addEventListener('click', () => {
    closePreviewModal();
    executeSelectiveSync();
  });
  document.getElementById('calendar-preview-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'calendar-preview-modal') closePreviewModal();
  });

  // Preview button handler
  document.getElementById('preview-sync-changes')?.addEventListener('click', showCalendarPreview);

  // Export iCal handler
  document.getElementById('export-ics-sync')?.addEventListener('click', () => {
    if (!currentSyncModalData) return;

    const { sprintKey, course } = currentSyncModalData;
    const selectedItems = getSelectedItemsFromModal();
    const priority = document.querySelector('input[name="sync-modal-priority"]:checked')?.value || 'P2';
    const courseName = course.toUpperCase();

    if (Object.keys(selectedItems).length === 0) {
      alert('No items selected to export.');
      return;
    }

    const events = buildEventsFromSelection(selectedItems, priority, courseName);
    const icsContent = generateICSFile(events);
    downloadICSFile(icsContent, `${sprintKey}-${courseName}.ics`);
    showToastNotification(`✓ Downloaded ${events.length} events as ${sprintKey}-${courseName}.ics`, 'success');
  });

  // Update .ics file handler (File System Access API)
  document.getElementById('update-ics-file')?.addEventListener('click', async () => {
    if (!currentSyncModalData) return;

    if (!('showOpenFilePicker' in window)) {
      alert('Your browser does not support the File System Access API. Please use Chrome or Edge, or use the regular Export button instead.');
      return;
    }

    const { sprintKey, course } = currentSyncModalData;
    const selectedItems = getSelectedItemsFromModal();
    const priority = document.querySelector('input[name="sync-modal-priority"]:checked')?.value || 'P2';
    const courseName = course.toUpperCase();

    if (Object.keys(selectedItems).length === 0) {
      alert('No items selected to export.');
      return;
    }

    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'iCalendar Files',
          accept: { 'text/calendar': ['.ics', '.ical'] }
        }],
        multiple: false
      });

      const fileName = fileHandle.name.toLowerCase();
      if (!fileName.endsWith('.ics') && !fileName.endsWith('.ical')) {
        alert('Unsupported file type. Please select a .ics or .ical file.');
        return;
      }

      const events = buildEventsFromSelection(selectedItems, priority, courseName);
      const icsContent = generateICSFile(events);

      const writable = await fileHandle.createWritable();
      await writable.write(icsContent);
      await writable.close();

      showToastNotification(`✓ Updated ${fileHandle.name} with ${events.length} events`, 'success');
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Error updating .ics file:', err);
      alert('Failed to update the file. Make sure you have permission to write to this location.');
    }
  });
}

// ─── Helper: Save Priority to localStorage ──────────────────────

function savePriorityToStorage(selectEl) {
  const url = selectEl.dataset.url;
  if (!url) return;

  const ITEM_PRIORITY_KEY = `item_priorities_${window.location.pathname}`;
  try {
    const stored = localStorage.getItem(ITEM_PRIORITY_KEY);
    const priorities = stored ? JSON.parse(stored) : {};
    priorities[url] = selectEl.value;
    localStorage.setItem(ITEM_PRIORITY_KEY, JSON.stringify(priorities));
  } catch (e) {
    console.warn('Could not save priority:', e);
  }
}
