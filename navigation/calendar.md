---
title: Calendar
permalink: /student/calendar
tailwind: true
layout: aesthetihawk
active_tab: calendar
---
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.css">

<div class="calendar-dashboard-tabs" role="tablist" aria-label="Calendar Dashboard Tabs">
    <button type="button" class="dashboard-tab-btn active" data-dashboard-tab="calendar" role="tab" aria-selected="true">Calendar</button>
    <button type="button" class="dashboard-tab-btn" data-dashboard-tab="issues" role="tab" aria-selected="false">Issues</button>
    <button type="button" class="dashboard-tab-btn" data-dashboard-tab="threads" role="tab" aria-selected="false">Threads</button>
</div>

<section id="dashboard-panel-calendar" class="dashboard-panel" role="tabpanel" aria-label="Calendar Panel">
    <!-- FullCalendar Container -->
    <div id="calendar-auth-banner" class="calendar-auth-banner">
        <i class="fas fa-exclamation-triangle calendar-auth-banner-icon"></i>
        <span>Your session has expired. <a href="{{site.baseurl}}/login" class="calendar-auth-banner-link">Log in again</a> to view and manage your calendar events.</span>
    </div>
    <div class="calendar-controls-row">
        <input id="calendar-filter-query" type="search" placeholder="Search events, issues, or breaks" />
        <select id="calendar-filter-source">
            <option value="all">All sources</option>
            <option value="events">Events</option>
            <option value="issues">Issues</option>
            <option value="breaks">Breaks</option>
        </select>
        <select id="calendar-filter-type">
            <option value="">All types</option>
            <option value="event">Event</option>
            <option value="appointment">Appointment</option>
            <option value="issue">Issue</option>
            <option value="break">Break</option>
        </select>
        <select id="calendar-filter-group" class="filter-field">
            <option value="">All groups</option>
        </select>
        <label class="filter-field filter-field--date" for="calendar-filter-start">
            <span class="filter-label">Start date</span>
            <input id="calendar-filter-start" type="date" title="Filter from date" />
        </label>
        <label class="filter-field filter-field--date" for="calendar-filter-end">
            <span class="filter-label">End date</span>
            <input id="calendar-filter-end" type="date" title="Filter to date" />
        </label>
    </div>
    <div id="calendar" class="calendar-stage"></div>
</section>

<section id="dashboard-panel-issues" class="dashboard-panel hidden" role="tabpanel" aria-label="Issues Panel">
    <div id="calendar-issues-panel" class="calendar-issues-panel">
        <div class="calendar-issues-header">
            <div>
                <h2 class="calendar-issues-title">Issues</h2>
                <p class="calendar-issues-subtitle">GitHub-inspired issue tracking synced with calendar dates and event context.</p>
            </div>
            <button id="issues-new-btn" class="calendar-issue-action-btn primary" type="button">New Issue</button>
        </div>

        <div class="issues-controls-row">
            <input id="issues-filter-query" type="search" placeholder="Search title, description, tags" />
            <select id="issues-filter-status">
                <option value="">All statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
            </select>
            <select id="issues-filter-priority">
                <option value="">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <input id="issues-filter-author" type="search" placeholder="Filter by author" />
            <input id="issues-filter-tags" type="search" placeholder="Filter by tags" />
            <select id="issues-filter-group" class="filter-field">
                <option value="">All groups</option>
            </select>
            <label class="filter-field filter-field--date" for="issues-filter-date">
                <span class="filter-label">Due date</span>
                <input id="issues-filter-date" type="date" title="Filter by due date" />
            </label>
            <label class="filter-field filter-field--date" for="issues-filter-start">
                <span class="filter-label">Created after</span>
                <input id="issues-filter-start" type="date" title="Created on or after" />
            </label>
            <label class="filter-field filter-field--date" for="issues-filter-end">
                <span class="filter-label">Created before</span>
                <input id="issues-filter-end" type="date" title="Created on or before" />
            </label>
        </div>

        <div class="issues-subtabs" role="tablist" aria-label="Issue Views">
            <button type="button" class="issues-subtab-btn active" data-issues-subtab="create" role="tab" aria-selected="true">Create / Edit</button>
            <button type="button" class="issues-subtab-btn" data-issues-subtab="list" role="tab" aria-selected="false">List</button>
            <button type="button" class="issues-subtab-btn" data-issues-subtab="kanban" role="tab" aria-selected="false">Kanban</button>
        </div>

        <div id="issues-subpanel-create" class="issues-subpanel">
            <form id="issue-form" class="issue-form">
                <input type="hidden" id="issue-id" />

                <div>
                    <label for="issue-title">Title</label>
                    <input id="issue-title" type="text" maxlength="200" required placeholder="Describe the issue" />
                </div>

                <div>
                    <label for="issue-description">Description</label>
                    <textarea id="issue-description" rows="4" placeholder="Add details"></textarea>
                </div>

                <div>
                    <label>Live Markdown Preview</label>
                    <div id="issue-description-preview" class="issue-markdown-preview">
                        <p class="issue-markdown-empty">Preview will appear here as you type.</p>
                    </div>
                </div>

                <div class="issue-form-grid">
                    <div>
                        <label for="issue-status">Status</label>
                        <select id="issue-status">
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="blocked">Blocked</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div>
                        <label for="issue-priority">Priority</label>
                        <select id="issue-priority">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                <div class="issue-form-grid">
                    <div>
                        <label for="issue-due-date">Due Date</label>
                        <input id="issue-due-date" type="date" required />
                    </div>
                    <div>
                        <label for="issue-event-id">Linked Event ID (optional)</label>
                        <input id="issue-event-id" type="text" placeholder="Calendar event id" />
                    </div>
                </div>

                <div>
                    <label for="issue-tags">Tags (comma-separated)</label>
                    <input id="issue-tags" type="text" placeholder="frontend, sprint-9" />
                </div>

                <div>
                    <label for="issue-assigned-groups">Assign to Groups (select multiple)</label>
                    <select id="issue-assigned-groups" class="filter-field issue-assigned-select" multiple size="4" title="Hold Ctrl/Cmd to select multiple groups">
                        <option value="">-- Select groups --</option>
                    </select>
                    <small>Groups will be automatically assigned to these class periods</small>
                </div>

                <div class="issue-form-actions">
                    <button id="issue-clear-btn" type="button" class="calendar-issue-action-btn secondary">Clear</button>
                    <button id="issue-save-btn" type="submit" class="calendar-issue-action-btn primary">Create Issue</button>
                </div>
            </form>
        </div>

        <div id="issues-subpanel-list" class="issues-subpanel hidden">
            <div id="issues-list" class="issues-list"></div>
        </div>

        <div id="issues-subpanel-kanban" class="issues-subpanel hidden">
            <div id="issues-kanban" class="kanban-board"></div>
        </div>
    </div>
</section>

<section id="dashboard-panel-threads" class="dashboard-panel hidden" role="tabpanel" aria-label="Message Threads Panel">
    <div id="calendar-threads-panel" class="calendar-issues-panel">
        <div class="calendar-issues-header">
            <div>
                <h2 class="calendar-issues-title">Issue Threads</h2>
                <p class="calendar-issues-subtitle">Replies, suggestions, and follow-ups attached directly to issues.</p>
            </div>
        </div>

        <div class="issues-controls-row">
            <input id="threads-filter-query" type="search" placeholder="Search issue title or reply text" />
            <input id="threads-filter-channel" type="search" placeholder="Filter by issue" />
            <input id="threads-filter-author" type="search" placeholder="Filter by author" />
            <label class="filter-field filter-field--date" for="threads-filter-start">
                <span class="filter-label">From time</span>
                <input id="threads-filter-start" type="datetime-local" title="From timestamp" />
            </label>
            <label class="filter-field filter-field--date" for="threads-filter-end">
                <span class="filter-label">To time</span>
                <input id="threads-filter-end" type="datetime-local" title="To timestamp" />
            </label>
            <label class="calendar-issue-filter-toggle">
                <input id="threads-filter-only-threads" type="checkbox" />
                <span>With replies only</span>
            </label>
            <input id="threads-filter-limit" type="number" min="1" max="500" value="100" />
        </div>

        <div id="threads-list" class="issues-list"></div>
    </div>
</section>
<!-- Modal -->
<div id="eventModal" class="calendar-event-modal">
    <div class="calendar-event-modal-content modal-content">
        <span class="calendar-event-modal-close" id="closeModal">&times;</span>
        <div class="calendar-event-modal-body">
            <h2 id="eventTitle" class="calendar-event-modal-title"></h2>
            <label for="editEventType" class="calendar-event-modal-label">Type:</label>
            <select id="editEventType" disabled class="calendar-event-modal-field">
                <option value="event">Event</option>
                <option value="appointment">Appointment</option>
            </select>
            <label for="editDate" class="calendar-event-modal-label">Date:</label>
            <p id="editDateDisplay" contentEditable='false' class="calendar-event-modal-field calendar-event-modal-display"></p>
            <input type="date" id="editDate" class="calendar-event-modal-field issue-form-date-hidden">
            <label for="editTitle" class="calendar-event-modal-label">Title:</label>
            <p id="editTitle" contentEditable='false' class="calendar-event-modal-field calendar-event-modal-display"></p>
            <label for="editDescription" class="calendar-event-modal-label">Description:</label>
            <p id="editDescription" contentEditable='false' class="calendar-event-modal-field calendar-event-modal-display calendar-event-modal-description"></p>
            <label for="editPriority" class="calendar-event-modal-label">Priority:</label>
            <select id="editPriority" disabled class="calendar-event-modal-field">
                <option value="P0">P0 - Critical</option>
                <option value="P1">P1 - High</option>
                <option value="P2" selected>P2 - Medium</option>
                <option value="P3">P3 - Low</option>
            </select>
            <label for="editGroupName" class="calendar-event-modal-label">Group:</label>
            <select id="editGroupName" disabled class="calendar-event-modal-field">
                <option value="">-- Select Group --</option>
                <!-- Options populated dynamically from user's groups -->
            </select>
        </div>
        <div class="calendar-event-modal-actions modal-actions">
            <button id="saveButton" class="calendar-event-modal-button primary hidden">Save Changes</button>
            <button id="makeBreakButton" class="calendar-event-modal-button warning hidden">Make Break</button>
            <button id="deleteButton" class="calendar-event-modal-button danger">Delete Event</button>
            <button id="editButton" class="calendar-event-modal-button primary">Edit Event</button>
        </div>
    </div>
</div>

<div id="issueModal" class="issue-modal" aria-hidden="true" role="dialog" aria-label="Issue Details">
    <div class="issue-modal-content">
        <div class="issue-modal-header">
            <h3 id="issue-modal-title" class="issue-modal-title">Issue</h3>
            <button id="issue-modal-close" class="issue-modal-close" type="button" aria-label="Close Issue Modal">&times;</button>
        </div>
        <div id="issue-modal-meta" class="issue-modal-meta"></div>
        <div id="issue-modal-description" class="issue-markdown-preview issue-modal-description"></div>
        <div id="issue-modal-tags" class="issue-tags"></div>
        <div class="issue-thread-panel">
            <div class="issue-thread-panel-header">
                <h4 class="issue-thread-panel-title">Replies</h4>
                <span id="issue-modal-comment-count" class="issue-thread-count"></span>
            </div>
            <div id="issue-comments-list" class="issue-comments-list"></div>
            <label for="issue-comment-text" class="issue-comment-label">Add a reply</label>
            <textarea id="issue-comment-text" class="issue-comment-textarea" rows="4" placeholder="Leave a suggestion or comment"></textarea>
            <div class="issue-thread-composer-actions">
                <button id="issue-comment-submit" type="button" class="calendar-issue-action-btn primary">Post Reply</button>
            </div>
        </div>
        <div class="issue-modal-actions">
            <button id="issue-modal-copy-link" type="button" class="calendar-issue-action-btn secondary">Copy Link</button>
            <button id="issue-modal-star" type="button" class="calendar-issue-action-btn secondary">Star</button>
            <button id="issue-modal-edit" type="button" class="calendar-issue-action-btn secondary">Edit</button>
            <button id="issue-modal-delete" type="button" class="calendar-issue-action-btn danger">Delete</button>
        </div>
    </div>
</div>

<!-- Reply Modal (for nested replies) -->
<div id="replyModal" class="reply-modal" aria-hidden="true" role="dialog" aria-label="Reply to Comment">
    <div class="reply-modal-content">
        <div class="reply-modal-header">
            <h4 id="reply-modal-title">Reply</h4>
            <button id="reply-modal-close" class="reply-modal-close" type="button" aria-label="Close Reply Modal">&times;</button>
        </div>
        <div id="reply-parent-preview" class="reply-parent-preview"></div>
        <textarea id="reply-modal-text" placeholder="Write your reply"></textarea>
        <div class="reply-modal-actions">
            <button id="reply-modal-submit" class="calendar-issue-action-btn primary" type="button">Post Reply</button>
            <button id="reply-modal-cancel" class="calendar-issue-action-btn secondary" type="button">Cancel</button>
        </div>
    </div>
</div>

<!-- FullCalendar JS -->
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js"></script>
<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // ─── Auth helpers ───────────────────────────────────────────────
    let javaAuthenticated = true;

    function showAuthBanner() {
        const banner = document.getElementById('calendar-auth-banner');
        if (banner) banner.style.display = 'flex';
    }
    function hideAuthBanner() {
        const banner = document.getElementById('calendar-auth-banner');
        if (banner) banner.style.display = 'none';
    }
    function handleAuthError(response) {
        if (response.status === 401 || response.status === 403) {
            console.warn('Not authenticated (HTTP ' + response.status + ')');
            javaAuthenticated = false;
            showAuthBanner();
            return true;
        }
        if (response.redirected && response.url && response.url.includes('/login')) {
            console.warn('Session expired — redirected to login');
            javaAuthenticated = false;
            showAuthBanner();
            return true;
        }
        if (response.type === 'opaqueredirect') {
            console.warn('Session expired — opaqueredirect');
            javaAuthenticated = false;
            showAuthBanner();
            return true;
        }
        return false;
    }
    function handleFetchError(error) {
        if (error instanceof TypeError && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Load failed'))) {
            console.warn('Network/CORS error — likely unauthenticated');
            javaAuthenticated = false;
            showAuthBanner();
            return true;
        }
        return false;
    }

    // ─── State ──────────────────────────────────────────────────────
    let allEvents = [];          // Every event from the backend + holidays
    let userGroups = [];         // Groups the current user belongs to
    let currentPersonId = null;
    // Filter mode: 'my-groups' (default) or 'all'
    let filterMode = 'my-groups';
    let activeToolbarGroupId = '';
    let calendarIssueThreads = [];
    let calendarIssueComments = [];

    // Issue state
    let calendarIssues = [];
    let issueCountsByDate = {};
    let selectedIssueId = null;
    let activeDashboardTab = 'calendar';
    let activeIssuesSubtab = 'create';
    let onIssuesRefreshedHook = null;

    const ISSUE_STATUS_OPTIONS = ['open', 'in-progress', 'blocked', 'done'];
    const ISSUE_STATUS_LABELS = {
        open: 'Open',
        'in-progress': 'In Progress',
        blocked: 'Blocked',
        done: 'Done'
    };
    const ISSUE_PRIORITY_ORDER = {
        high: 0,
        medium: 1,
        low: 2
    };
    const ISSUE_STATUS_FLOW = {
        open: ['open', 'in-progress', 'blocked', 'done'],
        'in-progress': ['open', 'in-progress', 'blocked', 'done'],
        blocked: ['open', 'in-progress', 'blocked', 'done'],
        done: ['done', 'open']
    };

    // School holidays from _data/school_calendar.yml via Liquid
    const schoolHolidays = [
        {% for entry in site.data.school_calendar.weeks %}
        {% assign week = entry[1] %}
        {% if week.holidays %}
            {% if week.skip_week %}
                {
                    title: "{{ week.holidays | join: ' / ' }}",
                    start: "{{ week.monday }}",
                    end: "{{ week.friday | date: '%Y-%m-%d' }}",
                    notes: "{{ week.notes | default: '' }}"
                },
            {% else %}
                {
                    title: "{{ week.holidays | join: ' / ' }}",
                    start: "{{ week.monday }}",
                    notes: "{{ week.notes | default: '' }}"
                },
            {% endif %}
        {% endif %}
        {% endfor %}
    ];

    // ─── Derived data from groups ───────────────────────────────────
    // Returns Set of group names the user belongs to
    function getUserGroupNames() {
        return new Set(userGroups.map(g => g.name));
    }
    // Returns Set of course names derived from user's groups (e.g. "CSA", "CSP")
    function getUserCourses() {
        const courses = new Set();
        userGroups.forEach(g => {
            if (g.course) courses.add(g.course.toUpperCase());
            // Some groups may store the course in the period or name; backend should use `course` field
        });
        return courses;
    }

    // ─── Fetch user's groups ────────────────────────────────────────
    async function fetchUserGroups() {
        try {
            const personResponse = await fetch(`${javaURI}/api/person/get`, fetchOptions);
            if (handleAuthError(personResponse)) return [];
            if (!personResponse.ok) {
                console.warn('Could not fetch user info');
                return [];
            }
            const personData = await personResponse.json();
            currentPersonId = personData.id;
            if (!currentPersonId) { console.warn('No person ID'); return []; }

            const groupsResponse = await fetch(`${javaURI}/api/groups/person/${currentPersonId}`, fetchOptions);
            if (handleAuthError(groupsResponse)) return [];
            if (!groupsResponse.ok) {
                console.warn('Person groups endpoint not available, using fallback');
                const fallbackResponse = await fetch(`${javaURI}/api/groups`, fetchOptions);
                if (!fallbackResponse.ok) return [];
                const allGroups = await fallbackResponse.json();
                return (Array.isArray(allGroups) ? allGroups : []).filter(group =>
                    Array.isArray(group.members) && group.members.some(m => m.id === currentPersonId)
                );
            }
            return await groupsResponse.json();
        } catch (error) {
            if (!handleFetchError(error)) console.error('Error fetching groups:', error);
            return [];
        }
    }

    // ─── Populate the Group dropdown in the add/edit modal ──────────
    // Shows ONLY the groups the user belongs to, with course + period info.
    function populateGroupDropdown() {
        const sel = document.getElementById('editGroupName');
        if (!sel) return;
        sel.innerHTML = '<option value="">-- Select Group --</option>';
        userGroups.forEach(group => {
            const opt = document.createElement('option');
            opt.value = group.name;
            // Display: "Group 2 — CSA Period 3" or "Hunger Games — CSP"
            let label = group.name;
            const parts = [];
            if (group.course) parts.push(group.course.toUpperCase());
            if (group.period != null) parts.push(`Period ${group.period}`);
            if (parts.length) label += ` — ${parts.join(' ')}`;
            opt.textContent = label;
            sel.appendChild(opt);
        });
    }

    function escapeIssueText(s) {
        return s ? String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;") : '';
    }

    function getCurrentIssueAuthor() {
        return (window.user && (window.user.uid || window.user.name)) || '';
    }

    function renderIssueMarkdown(text) {
        const source = String(text || '').replace(/\r\n/g, '\n');
        if (!source.trim()) {
            return '<p class="issue-markdown-empty">No description provided.</p>';
        }
        if (window.marked) {
            marked.setOptions({ gfm: true, breaks: true, headerIds: true, mangle: false });
            const rendered = marked.parse(source);
            if (window.DOMPurify) {
                return DOMPurify.sanitize(rendered, {
                    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|ftp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i
                });
            }
            return rendered;
        }
        return `<p>${escapeIssueText(source).replace(/\n/g, '<br>')}</p>`;
    }

    function updateIssueDescriptionPreview() {
        const preview = document.getElementById('issue-description-preview');
        const description = document.getElementById('issue-description');
        if (!preview || !description) return;
        preview.innerHTML = renderIssueMarkdown(description.value);
    }

    function getLocalIsoDate(date = new Date()) {
        const localDate = new Date(date);
        const timezoneOffset = localDate.getTimezoneOffset() * 60000;
        return new Date(localDate.getTime() - timezoneOffset).toISOString().slice(0, 10);
    }

    function normalizeTags(tags) {
        if (Array.isArray(tags)) {
            return tags.map(tag => String(tag).trim()).filter(Boolean);
        }
        if (!tags) {
            return [];
        }
        return String(tags).split(',').map(tag => tag.trim()).filter(Boolean);
    }

    function formatIssueDate(dateString) {
        if (!dateString) return 'No due date';
        const date = new Date(`${dateString}T00:00:00`);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function buildIssueCountMap(issues) {
        return (issues || []).reduce((counts, issue) => {
            if (!issue || !issue.dueDate) return counts;
            counts[issue.dueDate] = (counts[issue.dueDate] || 0) + 1;
            return counts;
        }, {});
    }

    function parseCalendarFilterDate(value) {
        if (!value) return null;
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    function getCalendarEventFilterValues() {
        return {
            query: (document.getElementById('calendar-filter-query')?.value || '').trim().toLowerCase(),
            source: document.getElementById('calendar-filter-source')?.value || 'all',
            type: document.getElementById('calendar-filter-type')?.value || '',
            group: (document.getElementById('calendar-filter-group')?.value || '').trim().toLowerCase(),
            start: document.getElementById('calendar-filter-start')?.value || '',
            end: document.getElementById('calendar-filter-end')?.value || ''
        };
    }

    function normalizeIssueComment(comment) {
        const assignment = String(comment?.assignment || '').trim();
        const isStar = assignment.endsWith('::star');
        const issueAssignment = isStar ? assignment.replace(/::star$/, '') : assignment;
        const issueMatch = issueAssignment.match(/^issue-(\d+)$/);
        return {
            id: comment?.id,
            issueId: issueMatch ? issueMatch[1] : '',
            assignment,
            author: String(comment?.author || '').trim(),
            text: String(comment?.text || '').trim(),
            timestamp: String(comment?.timestamp || '').trim(),
            isStar,
            raw: comment || {}
        };
    }

    function parseThreadTimestamp(value) {
        if (!value) return new Date(0);
        const normalized = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T');
        const parsed = new Date(normalized);
        return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
    }

    function buildIssueThreads(issues, comments) {
        const issueMap = new Map((issues || []).map(issue => [String(issue.id), issue]));
        const threads = new Map();

        (issues || []).forEach(issue => {
            if (!issue || issue.id == null) return;
            threads.set(String(issue.id), {
                issueId: String(issue.id),
                issue,
                comments: [],
                latestComment: null
            });
        });

        (comments || []).map(normalizeIssueComment).forEach(comment => {
            if (!comment.issueId || comment.isStar) return;
            if (!threads.has(comment.issueId)) {
                threads.set(comment.issueId, {
                    issueId: comment.issueId,
                    issue: issueMap.get(comment.issueId) || null,
                    comments: [],
                    latestComment: null
                });
            }
            threads.get(comment.issueId).comments.push(comment);
        });

        return Array.from(threads.values())
            .filter(thread => thread.issue != null)  // Skip orphaned comments with no matching issue
            .map(thread => {
            thread.comments.sort((a, b) => parseThreadTimestamp(b.timestamp).getTime() - parseThreadTimestamp(a.timestamp).getTime());
            thread.latestComment = thread.comments[0] || null;
            return thread;
        }).sort((a, b) => {
            const aTime = parseThreadTimestamp(a.latestComment?.timestamp || a.issue?.updatedAt || a.issue?.createdAt).getTime();
            const bTime = parseThreadTimestamp(b.latestComment?.timestamp || b.issue?.updatedAt || b.issue?.createdAt).getTime();
            return bTime - aTime;
        });
    }

    function getFilteredThreads() {
        const el = {
            query: document.getElementById('threads-filter-query'),
            channel: document.getElementById('threads-filter-channel'),
            author: document.getElementById('threads-filter-author'),
            start: document.getElementById('threads-filter-start'),
            end: document.getElementById('threads-filter-end'),
            onlyThreads: document.getElementById('threads-filter-only-threads')
        };
        const query = (el.query?.value || '').trim().toLowerCase();
        const issueQuery = (el.channel?.value || '').trim().toLowerCase();
        const author = (el.author?.value || '').trim().toLowerCase();
        const start = parseCalendarFilterDate(el.start?.value || '');
        const end = parseCalendarFilterDate(el.end?.value || '');
        const onlyThreads = Boolean(el.onlyThreads?.checked);

        return (calendarIssueThreads || [])
            .filter(thread => {
                if (!thread) return false;
                if (onlyThreads && (thread.comments || []).length === 0) return false;
                const issue = thread.issue || {};
                const haystack = [issue.title, issue.description, issue.tags, issue.ownerUid, ...(thread.comments || []).map(msg => msg.text), ...(thread.comments || []).map(msg => msg.author)].join(' ').toLowerCase();
                if (query && !haystack.includes(query)) return false;
                if (issueQuery && !(String(issue.title || '').toLowerCase().includes(issueQuery) || String(thread.issueId || '').includes(issueQuery))) return false;
                if (author && !(String(issue.ownerUid || '').toLowerCase().includes(author) || (thread.comments || []).some(msg => String(msg.author || '').toLowerCase().includes(author)))) return false;
                const stamp = parseThreadTimestamp(thread.latestComment?.timestamp || issue.updatedAt || issue.createdAt || '');
                if (start && stamp.getTime() && stamp < start) return false;
                if (end && stamp.getTime() && stamp > end) return false;
                return true;
            })
            .slice(0, Math.max(1, Math.min(500, parseInt(document.getElementById('threads-filter-limit')?.value || '100', 10) || 100)));
    }

    function renderThreadsList(threads) {
        const el = {
            list: document.getElementById('threads-list')
        };
        if (!el.list) return;

        if (!threads.length) {
            el.list.innerHTML = '<div class="issues-empty">No issue threads match current filters.</div>';
            return;
        }

        el.list.innerHTML = threads.map(thread => {
            const issue = thread.issue || {};
            const latestComment = thread.latestComment || null;
            const replyCount = (thread.comments || []).length;
            
            // Prefer assignedGroupLabels from server, fallback to parsing assignedGroups
            let assignedGroupsLabel = '';
            if (Array.isArray(issue.assignedGroupLabels) && issue.assignedGroupLabels.length > 0) {
                assignedGroupsLabel = `<span class="issue-assigned-groups">📍 Assigned to: ${issue.assignedGroupLabels.map(label => escapeIssueText(label)).join(', ')}</span>`;
            } else if (issue.assignedGroups) {
                try {
                    const groups = JSON.parse(issue.assignedGroups);
                    if (groups && groups.length > 0) {
                        assignedGroupsLabel = `<span class="issue-assigned-groups">📍 Assigned to: ${groups.map(group => escapeIssueText(group)).join(', ')}</span>`;
                    }
                } catch (e) { /* Skip if not valid JSON */ }
            }
            
            return `
                <article class="issue-card issue-thread-card" data-issue-id="${escapeIssueText(thread.issueId)}">
                    <div class="issue-card-top">
                        <button type="button" class="issue-link-btn issue-card-title" data-action="view" data-issue-id="${escapeIssueText(thread.issueId)}">${escapeIssueText(issue.title || 'Untitled issue')}</button>
                        <div class="issue-card-badge-row">
                            <span class="issue-pill medium">★ ${escapeIssueText(issue.starCount ?? 0)}</span>
                            <span class="issue-pill medium">💬 ${escapeIssueText(replyCount)}</span>
                        </div>
                    </div>
                    ${assignedGroupsLabel}
                    <div class="issue-card-note">${escapeIssueText(issue.status || 'open')} · Due ${escapeIssueText(formatIssueDate(issue.dueDate))} · ${escapeIssueText(issue.author || 'Unknown author')}</div>
                    <div class="issue-meta">${escapeIssueText(latestComment?.timestamp || issue.updatedAt || issue.createdAt || '')}${replyCount ? ` · ${replyCount} replies` : ''}</div>
                    ${latestComment ? `<div class="issue-thread-latest">${escapeIssueText(latestComment.author || 'Unknown')} · ${escapeIssueText((latestComment.text || '').slice(0, 140))}</div>` : '<div class="issue-thread-latest">No replies yet. Start the discussion.</div>'}
                    <div class="issue-tags">
                        ${(thread.comments || []).slice(0, 3).map(message => `<span class="issue-tag">${escapeIssueText((message.text || '').slice(0, 60) || 'reply')}</span>`).join('')}
                    </div>
                </article>
            `;
        }).join('');
    }

    function renderThreadsPanel() {
        renderThreadsList(getFilteredThreads());
    }

    function renderCalendarFilters() {
        if (activeDashboardTab !== 'calendar') return;
        window.displayCalendar?.(window.filterEvents?.() || []);
    }

    function applyCalendarFilterUI() {
        renderCalendarFilters();
        window.renderIssueViews?.();
        renderThreadsPanel();
    }

    function switchDashboardTab(tabName) {
        activeDashboardTab = tabName;
        document.querySelectorAll('.dashboard-tab-btn').forEach(btn => {
            const isActive = btn.dataset.dashboardTab === tabName;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        document.getElementById('dashboard-panel-calendar')?.classList.toggle('hidden', tabName !== 'calendar');
        document.getElementById('dashboard-panel-issues')?.classList.toggle('hidden', tabName !== 'issues');
        document.getElementById('dashboard-panel-threads')?.classList.toggle('hidden', tabName !== 'threads');

        if (tabName === 'calendar' && calendar) {
            setTimeout(() => { 
                const calendarEl = document.getElementById('calendar');
                if (calendarEl && calendarEl.offsetWidth > 0) {
                    calendar.render();
                }
            }, 100);
        } else if (tabName === 'threads') {
            renderThreadsPanel();
        }
    }

    function switchIssuesSubtab(subtab) {
        document.querySelectorAll('.issues-subtab-btn').forEach(btn => {
            const isActive = btn.dataset.issuesSubtab === subtab;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        document.getElementById('issues-subpanel-create')?.classList.toggle('hidden', subtab !== 'create');
        document.getElementById('issues-subpanel-list')?.classList.toggle('hidden', subtab !== 'list');
        document.getElementById('issues-subpanel-kanban')?.classList.toggle('hidden', subtab !== 'kanban');
        // When switching to Kanban, clear the status filter so all columns show items
        if (subtab === 'kanban') {
            const statusFilterEl = document.getElementById('issues-filter-status');
            if (statusFilterEl) statusFilterEl.value = '';
            // Re-render views to reflect cleared filter immediately
            renderIssueViews();
        }
    }

    function showIssueToast(message, type = 'success') {
        const existing = document.getElementById('issues-toast');
        if (existing) {
            existing.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'issues-toast';
        toast.className = `calendar-issue-action-btn ${type === 'error' ? 'danger' : type === 'warning' ? 'secondary' : 'primary'}`;
        toast.style.position = 'fixed';
        toast.style.right = '16px';
        toast.style.bottom = '16px';
        toast.style.zIndex = '100001';
        toast.style.maxWidth = '400px';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2800);
    }

    function buildIssueShareUrl(issueId) {
        const shareUrl = new URL(window.location.href);
        shareUrl.searchParams.set('issue', String(issueId));
        return shareUrl.toString();
    }

    function setIssueModalUrl(issueId, replaceState = false) {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set('issue', String(issueId));
        if (replaceState) {
            window.history.replaceState({}, '', nextUrl.toString());
        } else {
            window.history.pushState({}, '', nextUrl.toString());
        }
    }

    function clearIssueModalUrl(replaceState = true) {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.delete('issue');
        if (replaceState) {
            window.history.replaceState({}, '', nextUrl.toString());
        } else {
            window.history.pushState({}, '', nextUrl.toString());
        }
    }

    // ─── Main ───────────────────────────────────────────────────────
    document.addEventListener("DOMContentLoaded", async function () {
        userGroups = await fetchUserGroups();
        populateGroupDropdown();
        document.getElementById('issue-description')?.addEventListener('input', updateIssueDescriptionPreview);

        let currentEvent = null;
        let isAddingNewEvent = false;
        let calendar;

        // ── helpers ─────────────────────────────────────────────────
        function isBreakDay(dateString) {
            return allEvents.some(e => {
                const isBreak = (e.extendedProps && e.extendedProps.isBreak) || e.isBreak;
                return isBreak && formatDate(e.start) === dateString;
            });
        }
        function getBreakName(dateString) {
            const b = allEvents.find(e => {
                const isBreak = (e.extendedProps && e.extendedProps.isBreak) || e.isBreak;
                return isBreak && formatDate(e.start) === dateString;
            });
            if (!b) return null;
            return (b.extendedProps && b.extendedProps.breakName) || b.breakName || b.title || null;
        }

        // ── fetch events + breaks ───────────────────────────────────
        function request() {
            return fetch(`${javaURI}/api/calendar/events`, fetchOptions)
                .then(r => { if (handleAuthError(r)) return null; if (r.status !== 200) return null; return r.json(); })
                .catch(e => { handleFetchError(e); return null; });
        }
        function getBreaks() {
            return fetch(`${javaURI}/api/calendar/breaks`, fetchOptions)
                .then(r => { if (handleAuthError(r)) return []; if (!r.ok) return []; return r.json(); })
                .catch(e => { handleFetchError(e); return []; });
        }

        function normalizeIssueStatus(status) {
            // Convert backend status formats to frontend format
            // Backend may return: in_progress, inProgress, etc.
            // Frontend expects: in-progress
            if (!status) return 'open';
            return String(status)
                .replace(/_/g, '-')           // in_progress -> in-progress
                .replace(/([a-z])([A-Z])/g, '$1-$2')  // inProgress -> in-Progress (then lowercase)
                .toLowerCase();
        }

        function requestIssues() {
            return fetch(`${javaURI}/api/calendar/issues`, fetchOptions)
                .then(r => {
                    if (handleAuthError(r)) return [];
                    if (!r.ok) return [];
                    return r.json().then(issues => {
                        // Normalize status values from backend to frontend format
                        return Array.isArray(issues) ? issues.map(issue => ({
                            ...issue,
                            status: normalizeIssueStatus(issue.status)
                        })) : [];
                    });
                })
                .catch(e => {
                    handleFetchError(e);
                    return [];
                });
        }

        function requestComments() {
            return fetch(`${javaURI}/api/Comment/all`, fetchOptions)
                .then(r => {
                    if (handleAuthError(r)) return [];
                    if (!r.ok) return [];
                    return r.json();
                })
                .catch(e => {
                    handleFetchError(e);
                    return [];
                });
        }

        function getCalendarFilterElements() {
            return {
                query: document.getElementById('calendar-filter-query'),
                source: document.getElementById('calendar-filter-source'),
                type: document.getElementById('calendar-filter-type'),
                group: document.getElementById('calendar-filter-group'),
                start: document.getElementById('calendar-filter-start'),
                end: document.getElementById('calendar-filter-end')
            };
        }

        function getIssueElements() {
            return {
                form: document.getElementById('issue-form'),
                id: document.getElementById('issue-id'),
                title: document.getElementById('issue-title'),
                description: document.getElementById('issue-description'),
                status: document.getElementById('issue-status'),
                priority: document.getElementById('issue-priority'),
                dueDate: document.getElementById('issue-due-date'),
                eventId: document.getElementById('issue-event-id'),
                tags: document.getElementById('issue-tags'),
                saveBtn: document.getElementById('issue-save-btn'),
                clearBtn: document.getElementById('issue-clear-btn'),
                newBtn: document.getElementById('issues-new-btn'),
                list: document.getElementById('issues-list'),
                kanban: document.getElementById('issues-kanban'),
                filterQuery: document.getElementById('issues-filter-query'),
                filterStatus: document.getElementById('issues-filter-status'),
                filterPriority: document.getElementById('issues-filter-priority'),
                filterDate: document.getElementById('issues-filter-date'),
                filterAuthor: document.getElementById('issues-filter-author'),
                filterTags: document.getElementById('issues-filter-tags'),
                filterGroup: document.getElementById('issues-filter-group'),
                filterStart: document.getElementById('issues-filter-start'),
                filterEnd: document.getElementById('issues-filter-end')
            };
        }

        function resetIssueForm(preserveDate = '') {
            const el = getIssueElements();
            selectedIssueId = null;
            el.form?.reset();
            if (el.id) el.id.value = '';
            if (el.status) el.status.value = 'open';
            if (el.priority) el.priority.value = 'medium';
            if (el.dueDate) el.dueDate.value = preserveDate || el.filterDate?.value || getLocalIsoDate();
            if (el.saveBtn) el.saveBtn.textContent = 'Create Issue';
            const groupSelect = document.getElementById('issue-assigned-groups');
            if (groupSelect) groupSelect.selectedIndex = 0;  // Reset group selection
            updateIssueDescriptionPreview();
            renderIssueViews();
        }

        function setIssueForm(issue) {
            const el = getIssueElements();
            selectedIssueId = issue.id;
            if (el.id) el.id.value = issue.id || '';
            if (el.title) el.title.value = issue.title || '';
            if (el.description) el.description.value = issue.description || '';
            if (el.status) el.status.value = issue.status || 'open';
            if (el.priority) el.priority.value = issue.priority || 'medium';
            if (el.dueDate) el.dueDate.value = issue.dueDate || '';
            if (el.eventId) el.eventId.value = issue.eventId || '';
            if (el.tags) el.tags.value = normalizeTags(issue.tags).join(', ');
            
            // Set assigned groups if available
            const groupSelect = document.getElementById('issue-assigned-groups');
            if (groupSelect && issue.assignedGroups) {
                try {
                    const assignedGroups = JSON.parse(issue.assignedGroups);
                    if (Array.isArray(assignedGroups)) {
                        Array.from(groupSelect.options).forEach(opt => {
                            opt.selected = assignedGroups.includes(opt.value);
                        });
                    }
                } catch (e) { /* Skip if not valid JSON */ }
            } else if (groupSelect) {
                groupSelect.selectedIndex = 0;
            }
            
            if (el.saveBtn) el.saveBtn.textContent = 'Update Issue';
            updateIssueDescriptionPreview();
            switchIssuesSubtab('create');
            el.title?.focus();
            switchDashboardTab('issues');
            renderIssueViews();
        }

        function getFilteredIssues(options = {}) {
            const ignoreStatus = options.ignoreStatus === true;
            const el = getIssueElements();
            const query = (el.filterQuery?.value || '').trim().toLowerCase();
            const statusFilter = ignoreStatus ? '' : (el.filterStatus?.value || '');
            const priorityFilter = el.filterPriority?.value || '';
            const dateFilter = el.filterDate?.value || '';
            const authorFilter = (el.filterAuthor?.value || '').trim().toLowerCase();
            const tagsFilter = normalizeTags(el.filterTags?.value || '');
            const groupFilter = (el.filterGroup?.value || '').trim().toLowerCase();
            const startFilter = el.filterStart?.value || '';
            const endFilter = el.filterEnd?.value || '';

            return (calendarIssues || [])
                .filter(issue => !statusFilter || (issue.status || 'open') === statusFilter)
                .filter(issue => !priorityFilter || (issue.priority || 'medium') === priorityFilter)
                .filter(issue => !dateFilter || issue.dueDate === dateFilter)
                .filter(issue => !startFilter || !issue.createdAt || issue.createdAt.slice(0, 10) >= startFilter)
                .filter(issue => !endFilter || !issue.createdAt || issue.createdAt.slice(0, 10) <= endFilter)
                .filter(issue => !authorFilter || String(issue.author || '').toLowerCase().includes(authorFilter))
                .filter(issue => !groupFilter || String(issue.groupName || '').toLowerCase().includes(groupFilter))
                .filter(issue => !tagsFilter.length || tagsFilter.every(tag => normalizeTags(issue.tags).some(item => item.toLowerCase().includes(tag.toLowerCase()))))
                .filter(issue => {
                    if (!query) return true;
                    const haystack = [issue.title, issue.description, issue.eventId, issue.author, issue.groupName, normalizeTags(issue.tags).join(' ')].join(' ').toLowerCase();
                    return haystack.includes(query);
                })
                .sort((a, b) => {
                    const aDate = a.dueDate || '';
                    const bDate = b.dueDate || '';
                    if (aDate !== bDate) return aDate.localeCompare(bDate);
                    const pDelta = (ISSUE_PRIORITY_ORDER[a.priority || 'medium'] ?? 1) - (ISSUE_PRIORITY_ORDER[b.priority || 'medium'] ?? 1);
                    if (pDelta !== 0) return pDelta;
                    return (b.updatedAt || '').localeCompare(a.updatedAt || '');
                });
        }

        function renderIssueList(issues) {
            const el = getIssueElements();
            if (!el.list) return;
            if (!issues.length) {
                el.list.innerHTML = '<div class="issues-empty">No issues match current filters.</div>';
                return;
            }

            el.list.innerHTML = issues.map(issue => {
                const status = issue.status || 'open';
                const priority = issue.priority || 'medium';
                const tags = normalizeTags(issue.tags);
                const canMove = ISSUE_STATUS_FLOW[status] || ISSUE_STATUS_OPTIONS;
                // Inject assigned groups label if present
                const assignedLabel = (() => {
                    try {
                        if (Array.isArray(issue.assignedGroupLabels) && issue.assignedGroupLabels.length) {
                            return `<div class="issue-assigned-groups">📍 ${issue.assignedGroupLabels.join(', ')}</div>`;
                        }
                        if (issue.assignedGroups) {
                            const ag = typeof issue.assignedGroups === 'string' ? JSON.parse(issue.assignedGroups) : issue.assignedGroups;
                            if (Array.isArray(ag) && ag.length) {
                                const labels = ag.map(id => (window.allGroupsById && window.allGroupsById[String(id)]) || String(id));
                                return `<div class="issue-assigned-groups">📍 ${labels.join(', ')}</div>`;
                            }
                        }
                    } catch (e) { }
                    return '';
                })();

                return `
                    <article class="issue-card" data-issue-id="${escapeIssueText(issue.id)}">
                        <div class="issue-card-top">
                            <button type="button" class="issue-link-btn issue-card-title" data-action="view" data-issue-id="${escapeIssueText(issue.id)}">${escapeIssueText(issue.title || 'Untitled issue')}</button>
                            <div class="issue-card-badge-row">
                                <span class="issue-pill ${escapeIssueText(status)}">${escapeIssueText(ISSUE_STATUS_LABELS[status] || status)}</span>
                                <span class="issue-pill ${escapeIssueText(priority)}">${escapeIssueText(priority.toUpperCase())}</span>
                                <span class="issue-pill medium">★ ${escapeIssueText(issue.starCount ?? 0)}</span>
                                <span class="issue-pill medium">💬 ${escapeIssueText(issue.commentCount ?? 0)}</span>
                            </div>
                        </div>
                        <div class="issue-card-note">Description is hidden here. Press View to open the full issue modal.</div>
                        ${assignedLabel}
                        <div class="issue-author">Author: ${escapeIssueText(issue.author || 'Unknown')}</div>
                        <div class="issue-meta">Due ${escapeIssueText(formatIssueDate(issue.dueDate))}${issue.eventId ? ` · Event ${escapeIssueText(issue.eventId)}` : ''}</div>
                        ${tags.length ? `<div class="issue-tags">${tags.map(tag => `<span class="issue-tag">${escapeIssueText(tag)}</span>`).join('')}</div>` : ''}
                        <div class="issue-card-footer">
                            <select data-action="status" data-issue-id="${escapeIssueText(issue.id)}">
                                ${ISSUE_STATUS_OPTIONS.map(option => `<option value="${option}" ${option === status ? 'selected' : ''} ${canMove.includes(option) ? '' : 'disabled'}>${ISSUE_STATUS_LABELS[option]}</option>`).join('')}
                            </select>
                            <div class="issue-card-action-row">
                                <button type="button" class="calendar-issue-action-btn secondary" data-action="view" data-issue-id="${escapeIssueText(issue.id)}">View</button>
                                <button type="button" class="calendar-issue-action-btn secondary" data-action="edit" data-issue-id="${escapeIssueText(issue.id)}">Edit</button>
                                <button type="button" class="calendar-issue-action-btn danger" data-action="delete" data-issue-id="${escapeIssueText(issue.id)}" ${issue.author && getCurrentIssueAuthor() && issue.author !== getCurrentIssueAuthor() ? 'disabled title="Only the author can delete this issue"' : ''}>Delete</button>
                            </div>
                        </div>
                    </article>
                `;
            }).join('');
        }

        function renderKanban(issues) {
            const el = getIssueElements();
            if (!el.kanban) return;

            const groups = {
                open: issues.filter(issue => (issue.status || 'open') === 'open'),
                'in-progress': issues.filter(issue => (issue.status || 'open') === 'in-progress'),
                blocked: issues.filter(issue => (issue.status || 'open') === 'blocked'),
                done: issues.filter(issue => (issue.status || 'open') === 'done')
            };

            el.kanban.innerHTML = ISSUE_STATUS_OPTIONS.map(status => {
                const statusIssues = groups[status] || [];

                return `
                    <section class="kanban-column">
                        <h3 class="kanban-column-title">${ISSUE_STATUS_LABELS[status]} (${statusIssues.length})</h3>
                        ${statusIssues.length ? statusIssues.map(issue => {
                            const assignedLabelInner = (() => {
                                try {
                                    if (Array.isArray(issue.assignedGroupLabels) && issue.assignedGroupLabels.length) {
                                        return `<div class="issue-assigned-groups">📍 ${issue.assignedGroupLabels.join(', ')}</div>`;
                                    }
                                    if (issue.assignedGroups) {
                                        const ag = typeof issue.assignedGroups === 'string' ? JSON.parse(issue.assignedGroups) : issue.assignedGroups;
                                        if (Array.isArray(ag) && ag.length) {
                                            const labels = ag.map(id => (window.allGroupsById && window.allGroupsById[String(id)]) || String(id));
                                            return `<div class="issue-assigned-groups">📍 ${labels.join(', ')}</div>`;
                                        }
                                    }
                                } catch (e) { }
                                return '';
                            })();

                            return `
                            <article class="kanban-item" data-issue-id="${escapeIssueText(issue.id)}">
                                <button type="button" class="issue-link-btn issue-card-title" data-action="view" data-issue-id="${escapeIssueText(issue.id)}">${escapeIssueText(issue.title || 'Untitled issue')}</button>
                                <div class="issue-author">Author: ${escapeIssueText(issue.author || 'Unknown')}</div>
                                <div class="issue-meta">Due ${escapeIssueText(formatIssueDate(issue.dueDate))}</div>
                                ${assignedLabelInner}
                                <div class="issue-card-badge-row">
                                    <span class="issue-pill ${escapeIssueText(issue.priority || 'medium')}">${escapeIssueText((issue.priority || 'medium').toUpperCase())}</span>
                                    <span class="issue-pill medium">★ ${escapeIssueText(issue.starCount ?? 0)}</span>
                                    <span class="issue-pill medium">💬 ${escapeIssueText(issue.commentCount ?? 0)}</span>
                                </div>
                                <select data-action="status" data-issue-id="${escapeIssueText(issue.id)}">
                                    ${ISSUE_STATUS_OPTIONS.map(option => `<option value="${option}" ${option === (issue.status || 'open') ? 'selected' : ''}>${ISSUE_STATUS_LABELS[option]}</option>`).join('')}
                                </select>
                            </article>
                        `; }).join('') : '<div class="issues-empty">No issues.</div>'}
                    </section>
                `;
            }).join('');
        }

        function renderIssueViews() {
            const filteredIssues = getFilteredIssues();
            renderIssueList(filteredIssues);
            renderKanban(getFilteredIssues({ ignoreStatus: true }));
            updateIssueDescriptionPreview();
        }

        async function upsertIssue(isEdit, payload) {
            const path = isEdit ? `/api/calendar/issues/${selectedIssueId}` : '/api/calendar/issues';
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(`${javaURI}${path}`, {
                ...fetchOptions,
                method,
                headers: {
                    ...(fetchOptions.headers || {}),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (handleAuthError(response)) throw new Error('AUTH');
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to save issue');
            }
        }

        async function deleteIssue(issueId) {
            const response = await fetch(`${javaURI}/api/calendar/issues/${issueId}`, {
                ...fetchOptions,
                method: 'DELETE'
            });

            if (handleAuthError(response)) throw new Error('AUTH');
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to delete issue');
            }
        }

        async function changeIssueStatus(issueId, status) {
            const response = await fetch(`${javaURI}/api/calendar/issues/${issueId}/status`, {
                ...fetchOptions,
                method: 'PATCH',
                headers: {
                    ...(fetchOptions.headers || {}),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (handleAuthError(response)) throw new Error('AUTH');
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to change issue status');
            }
        }

        // ── handleRequest: build allEvents, then render ─────────────
        function handleRequest() {
            return Promise.all([request(), getBreaks(), requestIssues(), requestComments()])
                .then(([calendarEvents, breaks, issues, comments]) => {
                    if (calendarEvents !== null) { javaAuthenticated = true; hideAuthBanner(); }
                    allEvents = [];
                    calendarIssues = Array.isArray(issues) ? issues : [];
                    calendarIssueComments = Array.isArray(comments) ? comments : [];
                    calendarIssueThreads = buildIssueThreads(calendarIssues, calendarIssueComments);
                    issueCountsByDate = buildIssueCountMap(calendarIssues);

                    calendarIssues.forEach(issue => {
                        if (!issue || !issue.dueDate) return;
                        allEvents.push({
                            id: `issue-${issue.id}`,
                            title: issue.title ? `Issue: ${issue.title}` : 'Issue',
                            description: issue.description || '',
                            start: issue.dueDate,
                            allDay: true,
                            priority: issue.priority || 'medium',
                            classNames: ['fc-event-issue', `priority-${String(issue.priority || 'medium').toLowerCase()}`],
                            extendedProps: {
                                type: 'issue',
                                isIssue: true,
                                author: issue.author || '',
                                description: issue.description || '',
                                status: issue.status || 'open',
                                priority: issue.priority || 'medium',
                                dueDate: issue.dueDate || '',
                                assignedGroups: issue.assignedGroups || null
                            }
                        });
                    });

                    // --- Calendar events ---
                    if (calendarEvents !== null) {
                        calendarEvents.forEach(event => {
                            try {
                                let priority = event.priority || 'P2';
                                let displayTitle = event.title || '';
                                const pm = displayTitle.match(/^\[(P[0-3])\]\s*/);
                                if (pm) { priority = pm[1]; displayTitle = displayTitle.replace(/^\[(P[0-3])\]\s*/, ''); }
                                allEvents.push({
                                    id: event.id,
                                    priority: priority,
                                    title: displayTitle.replace(/\(P[13]\)/gi, ""),
                                    description: event.description,
                                    start: formatDate(event.date),
                                    isBreak: false,
                                    // Group-based fields
                                    groupName: event.groupName || '',
                                    period: event.period || null,   // course name (CSA/CSP/CSSE) from sprint sync
                                    classNames: [`priority-${priority.toLowerCase()}`],
                                    extendedProps: {
                                        type: event.type || 'event',
                                        groupName: event.groupName || '',
                                        individual: event.individual || '',
                                        description: event.description,
                                        period: event.period || null,
                                        priority: priority
                                    }
                                });
                            } catch (err) { console.error("Error loading event:", event, err); }
                        });
                    }

                    // --- Breaks ---
                    if (breaks && breaks.length) {
                        breaks.forEach(b => {
                            try {
                                allEvents.push({
                                    id: b.id,
                                    title: `Break: ${b.name || 'Break'}`,
                                    description: b.description || b.name || 'Break',
                                    start: formatDate(b.date),
                                    isBreak: true,
                                    breakName: b.name || 'Break',
                                    extendedProps: { isBreak: true, breakName: b.name || 'Break', description: b.description || '' },
                                    classNames: ['fc-event-break']
                                });
                            } catch (err) { console.error("Error loading break:", b, err); }
                        });
                    }

                    // --- School holidays ---
                    schoolHolidays.forEach(holiday => {
                        if (!holiday.start) return;
                        if (holiday.end) {
                            const startDate = new Date(holiday.start + 'T00:00:00');
                            const endDate = new Date(holiday.end + 'T00:00:00');
                            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                                if (d.getDay() === 0 || d.getDay() === 6) continue;
                                const ds = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
                                if (allEvents.some(e => (e.isBreak || (e.extendedProps && e.extendedProps.isBreak)) && formatDate(e.start) === ds)) continue;
                                allEvents.push({
                                    id: `school-holiday-${ds}`, title: holiday.title, description: holiday.notes || holiday.title, start: ds,
                                    isBreak: true, breakName: holiday.title, editable: false,
                                    extendedProps: { isBreak: true, breakName: holiday.title, description: holiday.notes || holiday.title, isSchoolHoliday: true },
                                    classNames: ['fc-event-break', 'fc-school-holiday']
                                });
                            }
                        } else {
                            const ds = holiday.start;
                            if (allEvents.some(e => (e.isBreak || (e.extendedProps && e.extendedProps.isBreak)) && formatDate(e.start) === ds)) return;
                            allEvents.push({
                                id: `school-holiday-${ds}`, title: holiday.title, description: holiday.notes || holiday.title, start: ds,
                                isBreak: true, breakName: holiday.title, editable: false,
                                extendedProps: { isBreak: true, breakName: holiday.title, description: holiday.notes || holiday.title, isSchoolHoliday: true },
                                classNames: ['fc-event-break', 'fc-school-holiday']
                            });
                        }
                    });

                    displayCalendar(filterEvents());
                    renderIssueViews();
                    renderThreadsPanel();
                    if (typeof onIssuesRefreshedHook === 'function') {
                        onIssuesRefreshedHook();
                    }
                })
                .catch(error => {
                    handleFetchError(error);
                    console.error("handleRequest error:", error);
                    displayCalendar(filterEvents());
                    renderIssueViews();
                    renderThreadsPanel();
                    if (typeof onIssuesRefreshedHook === 'function') {
                        onIssuesRefreshedHook();
                    }
                });
        }

        // ── Filter logic ────────────────────────────────────────────
        // "My Groups" (default): show events whose groupName matches one of the
        // user's groups, OR whose period/course matches one of the user's courses.
        // This way sprint-synced events (which have period=CSA but groupName='')
        // still appear if the user is in ANY CSA group.
        // "All": show everything.
        // Breaks & holidays always shown regardless.
        function filterEvents() {
            const filterValues = getCalendarEventFilterValues();
            let filtered = allEvents;

            if (filterMode === 'group' && activeToolbarGroupId) {
                const selectedGroupId = String(activeToolbarGroupId);
                const selectedGroup = userGroups.find(group => String(group.id) === selectedGroupId);
                filtered = filtered.filter(event => {
                    if (event.isBreak || (event.extendedProps && event.extendedProps.isBreak)) return true;
                    try {
                        const ext = event.extendedProps || {};
                        const agRaw = ext.assignedGroups || event.assignedGroups || null;
                        if (agRaw) {
                            const ag = typeof agRaw === 'string' ? JSON.parse(agRaw) : agRaw;
                            if (Array.isArray(ag) && ag.map(String).includes(selectedGroupId)) return true;
                        }
                    } catch (e) { }
                    const evtGroup = String(event.groupName || (event.extendedProps && event.extendedProps.groupName) || '').toLowerCase();
                    const evtPeriod = String(event.period || (event.extendedProps && event.extendedProps.period) || '').toLowerCase();
                    const groupName = String(selectedGroup?.name || '').toLowerCase();
                    const groupCourse = String(selectedGroup?.course || '').toLowerCase();
                    return evtGroup.includes(groupName) || evtPeriod.includes(groupCourse) || evtGroup.includes(selectedGroupId.toLowerCase());
                });
            } else if (filterMode === 'my-groups' && userGroups.length > 0) {
                const myGroupNames = getUserGroupNames();
                const myCourses = getUserCourses();
                const myGroupIds = new Set(userGroups.map(g => String(g.id)));
                filtered = filtered.filter(event => {
                    // Always show breaks/holidays
                    if (event.isBreak || (event.extendedProps && event.extendedProps.isBreak)) return true;
                    // Match by group name
                    const evtGroup = event.groupName || (event.extendedProps && event.extendedProps.groupName) || '';
                    if (evtGroup && myGroupNames.has(evtGroup)) return true;
                    // Match by assignedGroups (array of ids)
                    try {
                        const agRaw = (event.extendedProps && event.extendedProps.assignedGroups) || event.assignedGroups || null;
                        if (agRaw) {
                            const ag = typeof agRaw === 'string' ? JSON.parse(agRaw) : agRaw;
                            if (Array.isArray(ag) && ag.map(String).some(a => myGroupIds.has(a))) return true;
                        }
                    } catch (e) { /* ignore */ }
                    // Match by course (for sprint-synced events that have period=CSA/CSP/CSSE)
                    const evtCourse = event.period || (event.extendedProps && event.extendedProps.period) || '';
                    if (evtCourse && myCourses.has(evtCourse.toUpperCase())) return true;
                    // If event has no group AND no course, show it (personal event)
                    if (!evtGroup && !evtCourse) return true;
                    return false;
                });
            }

            filtered = filtered.filter(event => {
                const ext = event.extendedProps || {};
                const eventType = String(ext.type || (event.isBreak || ext.isBreak ? 'break' : ext.isIssue ? 'issue' : 'event')).toLowerCase();
                const eventSource = ext.isIssue ? 'issues' : eventType === 'break' ? 'breaks' : 'events';
                const haystack = [
                    event.title,
                    event.description,
                    ext.description,
                    ext.author,
                    ext.groupName,
                    ext.period,
                    ext.individual
                ].join(' ').toLowerCase();
                const eventDate = formatDate(event.start);

                if (event.isBreak || ext.isBreak) return true;

                if (filterValues.source !== 'all' && filterValues.source !== eventSource) return false;
                if (filterValues.type && filterValues.type !== eventType) return false;
                if (filterValues.group) {
                    const fv = String(filterValues.group);
                    // Check assignedGroups JSON array (by id) OR fallback to matching groupName/period text
                    let assignedOk = false;
                    try {
                        const agRaw = ext.assignedGroups || event.assignedGroups || null;
                        if (agRaw) {
                            const ag = typeof agRaw === 'string' ? JSON.parse(agRaw) : agRaw;
                            if (Array.isArray(ag)) assignedOk = ag.map(String).includes(fv);
                        }
                    } catch (e) { assignedOk = false; }
                    const groupText = String(ext.groupName || event.groupName || ext.period || event.period || '').toLowerCase();
                    if (!(assignedOk || groupText.includes(fv.toLowerCase()))) return false;
                }
                if (filterValues.start && eventDate && eventDate < filterValues.start) return false;
                if (filterValues.end && eventDate && eventDate > filterValues.end) return false;
                if (filterValues.query && !haystack.includes(filterValues.query)) return false;
                return true;
            });

            // else filterMode === 'all' → show everything

            // Sort: breaks first, then by priority
            return filtered.sort((a, b) => {
                const aBreak = a.isBreak || (a.extendedProps && a.extendedProps.isBreak);
                const bBreak = b.isBreak || (b.extendedProps && b.extendedProps.isBreak);
                if (aBreak && !bBreak) return -1;
                if (!aBreak && bBreak) return 1;
                if (aBreak && bBreak) return 0;
                const po = { 'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3 };
                return (po[a.priority] ?? 2) - (po[b.priority] ?? 2);
            });
        }

        // ── Render calendar ─────────────────────────────────────────
        function displayCalendar(events) {
            const calendarEl = document.getElementById('calendar');
            const previousView = calendar?.view?.type || 'dayGridMonth';
            const previousDate = calendar?.getDate ? calendar.getDate() : null;
            if (calendar) calendar.destroy();
            const toolbarGroupButtons = Array.isArray(userGroups) ? userGroups.map(group => {
                const buttonName = `groupButton${String(group.id).replace(/[^a-zA-Z0-9_-]/g, '')}`;
                return {
                    buttonName,
                    text: filterMode === 'group' && String(activeToolbarGroupId) === String(group.id)
                        ? `● ${group.name}`
                        : group.name,
                    click: function () {
                        filterMode = 'group';
                        activeToolbarGroupId = String(group.id);
                        displayCalendar(filterEvents());
                    }
                };
            }) : [];
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: ['prev,next today myGroupsButton,allButton'].concat(toolbarGroupButtons.map(btn => btn.buttonName)).join(','),
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay'
                },
                customButtons: {
                    myGroupsButton: {
                        text: filterMode === 'my-groups' ? '● My Groups' : 'My Groups',
                        click: function () {
                            filterMode = 'my-groups';
                            displayCalendar(filterEvents());
                        }
                    },
                    allButton: {
                        text: filterMode === 'all' ? '● All' : 'All',
                        click: function () {
                            filterMode = 'all';
                            activeToolbarGroupId = '';
                            displayCalendar(filterEvents());
                        }
                    },
                    ...toolbarGroupButtons.reduce((buttons, button) => {
                        buttons[button.buttonName] = {
                            text: button.text,
                            click: button.click
                        };
                        return buttons;
                    }, {})
                },
                views: {
                    dayGridMonth: { buttonText: 'Month' },
                    dayGridWeek: { buttonText: 'Week' },
                    dayGridDay: { buttonText: 'Day' }
                },
                dayCellDidMount: function(arg) {
                    try {
                        const dateStr = formatDate(arg.date);
                        if (isBreakDay(dateStr)) arg.el.classList.add('break-day');
                        else arg.el.classList.remove('break-day');

                        const existingBadge = arg.el.querySelector('.calendar-issue-count-badge');
                        if (existingBadge) existingBadge.remove();
                        const issueCount = issueCountsByDate[dateStr] || 0;
                        if (issueCount > 0) {
                            const badge = document.createElement('span');
                            badge.className = 'calendar-issue-count-badge';
                            badge.textContent = issueCount > 99 ? '99+' : String(issueCount);
                            badge.title = `${issueCount} issue${issueCount === 1 ? '' : 's'} due`;
                            arg.el.appendChild(badge);
                        }
                    } catch (e) { /* ignore */ }
                },
                events: events,
                eventContent: function(arg) {
                    const event = arg.event;
                    const ext = event.extendedProps || {};
                    const isAppointment = ext.type === 'appointment';
                    const isIssue = ext.isIssue === true;
                    const isBreak = ext.isBreak === true;
                    if (isAppointment && !isBreak) {
                        const individual = ext.individual || '';
                        const title = event.title || '';
                        const groupName = ext.groupName || '';
                        let html = '<div class="fc-event-appointment">';
                        if (individual) html += '<div class="fc-event-individual">' + individual + '</div>';
                        html += '<div class="fc-event-title-custom">' + title + '</div>';
                        if (groupName) html += '<div class="fc-event-group">' + groupName + '</div>';
                        html += '</div>';
                        return { html };
                    }
                    if (isIssue && !isBreak) {
                        let html = '<div class="fc-event-issue">';
                        const titleText = (event.title || 'Issue').replace(/^Issue:\s*/, '');
                        html += '<div class="fc-event-title-custom" title="' + titleText + '" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + titleText + '</div>';
                        if (ext.author) html += '<div class="fc-event-individual">' + ext.author + '</div>';
                        // Show assigned groups if available (use lookup map if present)
                                try {
                                    if (Array.isArray(ext.assignedGroupLabels) && ext.assignedGroupLabels.length) {
                                        html += '<div class="fc-event-group">' + ext.assignedGroupLabels.join(', ') + '</div>';
                                    } else {
                                        const agRaw = ext.assignedGroups || event.assignedGroups || null;
                                        if (agRaw) {
                                            const ag = typeof agRaw === 'string' ? JSON.parse(agRaw) : agRaw;
                                            if (Array.isArray(ag) && ag.length) {
                                                const labels = ag.map(id => (window.allGroupsById && window.allGroupsById[String(id)]) || String(id));
                                                html += '<div class="fc-event-group">' + labels.join(', ') + '</div>';
                                            }
                                        }
                                    }
                                } catch (e) { /* ignore parse errors */ }
                        html += '</div>';
                        return { html };
                    }
                },
                eventClick: function (info) {
                    currentEvent = info.event;
                    isAddingNewEvent = false;
                    const isBreak = (currentEvent.extendedProps && currentEvent.extendedProps.isBreak === true) || currentEvent.isBreak === true;
                    const isIssue = currentEvent.extendedProps && currentEvent.extendedProps.isIssue === true;
                    if (isIssue) {
                        const issueId = String(currentEvent.id || '').replace(/^issue-/, '');
                        const issue = calendarIssues.find(item => String(item.id) === issueId);
                        if (issue) {
                            switchDashboardTab('issues');
                            openIssueModal(issue, true, false);
                            return;
                        }
                    }
                    document.getElementById("saveButton").style.display = "none";
                    document.getElementById("makeBreakButton").style.display = "none";
                    document.getElementById('eventTitle').textContent = isBreak
                        ? ((currentEvent.extendedProps && currentEvent.extendedProps.breakName) || currentEvent.breakName || currentEvent.title)
                        : currentEvent.title;
                    document.getElementById('editDescription').innerHTML = slackToHtml(currentEvent.extendedProps.description || "");
                    document.getElementById('editDateDisplay').textContent = formatDisplayDate(currentEvent.start);
                    document.getElementById('editDate').value = formatDate(currentEvent.start);
                    document.getElementById("editPriority").value = currentEvent.extendedProps.priority || "P2";
                    document.getElementById("editPriority").disabled = true;
                    document.getElementById("editEventType").value = currentEvent.extendedProps.type || "event";
                    document.getElementById("editEventType").disabled = true;
                    document.getElementById("editGroupName").value = currentEvent.extendedProps.groupName || "";
                    document.getElementById("editGroupName").disabled = true;
                    document.getElementById("eventModal")?.classList.add('open');
                    document.getElementById("eventModal").dataset.isIssue = isIssue ? "true" : "false";
                    const isSchoolHoliday = currentEvent.extendedProps && currentEvent.extendedProps.isSchoolHoliday === true;
                    if (isBreak) {
                        document.getElementById("makeBreakButton").style.display = "none";
                        document.getElementById("eventModal").dataset.isBreak = "true";
                        if (isSchoolHoliday) {
                            document.getElementById("deleteButton").style.display = "none";
                            document.getElementById("editButton").style.display = "none";
                        } else {
                            document.getElementById("deleteButton").style.display = "inline-block";
                            document.getElementById("editButton").style.display = "inline-block";
                        }
                    } else if (isIssue) {
                        document.getElementById("deleteButton").style.display = "inline-block";
                        document.getElementById("editButton").style.display = "none";
                        document.getElementById("eventModal").dataset.isBreak = "false";
                    } else {
                        document.getElementById("deleteButton").style.display = "inline-block";
                        document.getElementById("editButton").style.display = "inline-block";
                        document.getElementById("eventModal").dataset.isBreak = "false";
                    }
                },
                dateClick: function (info) {
                    const selectedDate = formatDate(info.date);
                    const issueFilterDate = document.getElementById('issues-filter-date');
                    if (issueFilterDate) {
                        issueFilterDate.value = selectedDate;
                    }
                    const issueDueDate = document.getElementById('issue-due-date');
                    if (issueDueDate && !selectedIssueId) {
                        issueDueDate.value = selectedDate;
                    }
                    renderIssueViews();

                    if (!javaAuthenticated || ((!window.user || !window.user.uid) && !currentPersonId)) {
                        alert('You must be logged in to create events. Please log in and try again.');
                        return;
                    }
                    if (isBreakDay(selectedDate)) {
                        alert(`There is already a break on ${formatDisplayDate(info.date)}`);
                        return;
                    }
                    isAddingNewEvent = true;
                    document.getElementById("eventTitle").textContent = "Add New Event";
                    document.getElementById("editTitle").innerHTML = "";
                    document.getElementById("editDescription").innerHTML = "";
                    document.getElementById("editDescription").contentEditable = true;
                    document.getElementById("editTitle").contentEditable = true;
                    document.getElementById("editPriority").disabled = false;
                    document.getElementById("editPriority").value = "P2";
                    document.getElementById("editEventType").disabled = false;
                    document.getElementById("editEventType").value = "event";
                    document.getElementById("editGroupName").disabled = false;
                    document.getElementById("editGroupName").value = "";
                    document.getElementById('editDateDisplay').textContent = formatDisplayDate(info.date);
                    document.getElementById('editDate').value = selectedDate;
                    document.getElementById("eventModal")?.classList.add('open');
                    document.getElementById("deleteButton").style.display = "none";
                    document.getElementById("editButton").style.display = "none";
                    document.getElementById("saveButton").style.display = "inline-block";
                    document.getElementById("makeBreakButton").style.display = "inline-block";
                    document.getElementById("saveButton").onclick = function () {
                        const updatedTitle = document.getElementById("editTitle").innerHTML.trim();
                        const updatedDescription = document.getElementById("editDescription").innerHTML;
                        const updatedDate = document.getElementById("editDate").value;
                        const updatedPriority = document.getElementById("editPriority").value;
                        const selectedType = document.getElementById("editEventType").value;
                        const selectedGroup = document.getElementById("editGroupName").value;

                        if (!updatedTitle || !updatedDescription || !updatedDate) {
                            alert("Title, Description, and Date cannot be empty!");
                            return;
                        }
                        // Group selection is optional; allow events without group

                        const currentUserName = (window.user && window.user.name) ? window.user.name : '';
                        // Derive period (course) from the selected group so backend validation passes
                        let derivedPeriod = '';
                        const matchedGroup = userGroups.find(g => g.name === selectedGroup);
                        if (matchedGroup && matchedGroup.course) derivedPeriod = matchedGroup.course.toUpperCase();
                        // Embed priority prefix in title for persistence
                        let titleToSave = updatedTitle;
                        if (updatedPriority && !/^\[P[0-3]\]/.test(titleToSave)) {
                            titleToSave = `[${updatedPriority}] ${titleToSave}`;
                        }
                        const newEventPayload = {
                            title: titleToSave,
                            description: updatedDescription,
                            date: updatedDate,
                            priority: updatedPriority,
                            groupName: selectedGroup,
                            period: derivedPeriod,
                            type: selectedType,
                            individual: selectedType === 'appointment' ? currentUserName : ''
                        };
                        document.getElementById("eventModal")?.classList.remove('open');
                        fetch(`${javaURI}/api/calendar/add_event`, {
                            ...fetchOptions,
                            method: "POST",
                            body: JSON.stringify(newEventPayload),
                        })
                        .then(response => {
                            if (handleAuthError(response)) { alert("You must be logged in to add events."); return; }
                            if (!response.ok) throw new Error(`Failed to add event: ${response.status}`);
                            return response.json();
                        })
                        .then(data => { if (data) handleRequest(); })
                        .catch(error => {
                            if (!handleFetchError(error)) {
                                console.error("Error adding event:", error);
                                alert("Failed to save event.\n\n" + error.message);
                            }
                        });
                    };
                }
            });
            calendar.render();
            if (previousView && typeof calendar.changeView === 'function') {
                calendar.changeView(previousView);
            }
            if (previousDate && typeof calendar.gotoDate === 'function') {
                calendar.gotoDate(previousDate);
            }
        }

        // ── Utilities ───────────────────────────────────────────────
        function formatDate(dateInput) {
            if (!dateInput && dateInput !== 0) return '';
            if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) return dateInput;
            const d = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }

        // ── Modal close / escape / outside-click ────────────────────
        function closeModal() {
            document.getElementById('editDateDisplay').style.display = 'block';
            document.getElementById('editDate').style.display = 'none';
            document.getElementById("saveButton").style.display = "none";
            document.getElementById("eventModal")?.classList.remove('open');
            document.getElementById("editTitle").contentEditable = false;
            document.getElementById("editDescription").contentEditable = false;
            document.getElementById("editPriority").disabled = true;
            document.getElementById("editEventType").disabled = true;
            document.getElementById("editGroupName").disabled = true;
        }
        document.getElementById("closeModal").onclick = closeModal;
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                closeModal();
                document.getElementById('issueModal')?.classList.remove('open');
                document.getElementById('issueModal')?.setAttribute('aria-hidden', 'true');
                clearIssueModalUrl(true);
            }
        });
        window.onclick = function (e) {
            if (e.target === document.getElementById("eventModal")) closeModal();
        };

        // ── Save (edit existing) ────────────────────────────────────
        document.getElementById("saveButton").onclick = function () {
            const isBreak = document.getElementById("eventModal").dataset.isBreak === "true";
            const updatedTitle = document.getElementById("editTitle").innerHTML.trim();
            const updatedDescription = document.getElementById("editDescription").innerHTML;
            // Reset UI
            document.getElementById("saveButton").style.display = "none";
            document.getElementById('editDateDisplay').style.display = 'block';
            document.getElementById('editDate').style.display = 'none';
            document.getElementById("editDescription").contentEditable = false;
            document.getElementById("editTitle").contentEditable = false;
            document.getElementById("editPriority").disabled = true;
            document.getElementById("editEventType").disabled = true;
            document.getElementById("editGroupName").disabled = true;
            if (!updatedTitle || !updatedDescription) { alert("Title and Description cannot be empty!"); return; }

            if (isBreak) {
                const id = currentEvent.id;
                fetch(`${javaURI}/api/calendar/breaks/${id}`, {
                    ...fetchOptions, method: "PUT",
                    body: JSON.stringify({ name: updatedTitle, description: updatedDescription }),
                })
                .then(r => { if (handleAuthError(r)) return; if (!r.ok) throw new Error(`Failed: ${r.status}`); return r.json(); })
                .then(d => { if (!d) return; document.getElementById("eventModal")?.classList.remove('open'); handleRequest(); })
                .catch(e => { if (!handleFetchError(e)) { console.error(e); alert("Failed to update break.\n\n" + e.message); } });
            } else {
                const updatedPriority = document.getElementById("editPriority").value;
                const updatedDate = document.getElementById("editDate").value;
                document.getElementById('editDateDisplay').textContent = formatDisplayDate(new Date(updatedDate));
                if (!updatedDate) { alert("Date cannot be empty!"); return; }
                if (isAddingNewEvent) {
                    const addGroupVal = document.getElementById("editGroupName").value;
                    let addPeriod = '';
                    if (addGroupVal) {
                        const mg = userGroups.find(g => g.name === addGroupVal);
                        if (mg && mg.course) addPeriod = mg.course.toUpperCase();
                    }
                    // Embed priority prefix in title for persistence
                    let addTitle = updatedTitle;
                    if (updatedPriority && !/^\[P[0-3]\]/.test(addTitle)) {
                        addTitle = `[${updatedPriority}] ${addTitle}`;
                    }
                    const payload = { title: addTitle, description: updatedDescription, date: updatedDate, priority: updatedPriority, groupName: addGroupVal, period: addPeriod };
                    fetch(`${javaURI}/api/calendar/add_event`, {
                        ...fetchOptions, method: "POST", body: JSON.stringify(payload),
                    })
                    .then(r => { if (handleAuthError(r)) return; if (!r.ok) throw new Error(`Failed: ${r.status}`); return r.json(); })
                    .then(d => { if (!d) return; document.getElementById("eventModal")?.classList.remove('open'); handleRequest(); })
                    .catch(e => { if (!handleFetchError(e)) { console.error(e); alert("Failed to add event.\n\n" + e.message); } });
                } else {
                    // Derive period (course) from the selected group so backend validation passes
                    const editGroupVal = document.getElementById("editGroupName").value;
                    let derivedPeriod = currentEvent.extendedProps?.period || '';
                    if (editGroupVal) {
                        const matchedGroup = userGroups.find(g => g.name === editGroupVal);
                        if (matchedGroup && matchedGroup.course) derivedPeriod = matchedGroup.course.toUpperCase();
                    }
                    // Re-embed priority prefix in title so it persists even if backend
                    // doesn't store priority as a separate field (sprint-synced events
                    // carry priority in the title like "[P1] 📚 Title - CSA").
                    let titleToSave = updatedTitle;
                    if (updatedPriority && !/^\[P[0-3]\]/.test(titleToSave)) {
                        titleToSave = `[${updatedPriority}] ${titleToSave}`;
                    }
                    const payload = {
                        newTitle: titleToSave, description: updatedDescription, date: updatedDate,
                        priority: updatedPriority, type: document.getElementById("editEventType").value,
                        groupName: editGroupVal,
                        period: derivedPeriod,
                        individual: currentEvent.extendedProps?.individual || ''
                    };
                    const id = currentEvent.id;
                    fetch(`${javaURI}/api/calendar/edit/${id}`, {
                        ...fetchOptions, method: "PUT", body: JSON.stringify(payload),
                    })
                    .then(r => { if (handleAuthError(r)) return; if (!r.ok) throw new Error(`Failed: ${r.status}`); return r.text(); })
                    .then(d => { if (d === undefined) return; document.getElementById("eventModal")?.classList.remove('open'); handleRequest(); })
                    .catch(e => { if (!handleFetchError(e)) { console.error(e); alert("Failed to update event.\n\n" + e.message); } });
                }
            }
        };

        // ── Edit button ─────────────────────────────────────────────
        document.getElementById("editButton").onclick = function () {
            const isBreak = document.getElementById("eventModal").dataset.isBreak === "true";
            document.getElementById('editDateDisplay').style.display = 'none';
            document.getElementById('editDate').style.display = isBreak ? 'none' : 'block';
            document.getElementById("deleteButton").style.display = 'none';
            document.getElementById("saveButton").style.display = 'inline-block';
            document.getElementById("editDescription").contentEditable = true;
            document.getElementById("editTitle").contentEditable = true;
            isAddingNewEvent = false;
            if (!isBreak) {
                document.getElementById("editPriority").disabled = false;
                document.getElementById("editEventType").disabled = false;
                document.getElementById("editGroupName").disabled = false;
            }
            document.getElementById("editDescription").innerHTML = currentEvent.extendedProps.description || "";
        };

        // ── Delete button ───────────────────────────────────────────
        document.getElementById("deleteButton").onclick = function () {
            if (!currentEvent) return;
            const isBreak = document.getElementById("eventModal").dataset.isBreak === "true";
            const isIssue = currentEvent.extendedProps && currentEvent.extendedProps.isIssue === true;
            let id = currentEvent.id;
            if (isIssue) id = id.replace(/^issue-/, '');
            if (!confirm(`Are you sure you want to delete "${currentEvent.title}"?`)) return;
            const endpoint = isBreak ? `${javaURI}/api/calendar/breaks/${id}` : isIssue ? `${javaURI}/api/calendar/issues/${id}` : `${javaURI}/api/calendar/delete/${id}`;
            fetch(endpoint, { ...fetchOptions, method: "DELETE" })
            .then(r => { if (handleAuthError(r)) return; if (!r.ok) throw new Error(`Failed: ${r.status}`); return r.text(); })
            .then(d => { if (d === undefined) return; currentEvent.remove(); document.getElementById("eventModal")?.classList.remove('open'); handleRequest(); })
            .catch(e => { if (!handleFetchError(e)) { console.error(e); alert("Failed to delete.\n\n" + e.message); } });
        };

        // ── Make Break button ───────────────────────────────────────
        document.getElementById("makeBreakButton").onclick = function () {
            const breakDate = document.getElementById("editDate").value;
            const breakTitle = document.getElementById("editTitle").innerHTML.trim();
            const breakDescription = document.getElementById("editDescription").innerHTML;
            if (!breakDate) { alert("Please select a date for the break!"); return; }
            if (!breakTitle) { alert("Please enter a name for the break!"); return; }
            if (isBreakDay(breakDate)) { alert(`There is already a break on that date.`); return; }
            const [y, m, d] = breakDate.split('-').map(Number);
            const localDate = new Date(y, m - 1, d);
            if (!confirm(`Make ${formatDisplayDate(localDate)} a break day named "${breakTitle}"? Events on this day will be moved.`)) return;
            fetch(`${javaURI}/api/calendar/breaks/create`, {
                ...fetchOptions, method: "POST",
                body: JSON.stringify({ date: breakDate, name: breakTitle, description: breakDescription, moveToNextNonBreakDay: true }),
            })
            .then(r => { if (handleAuthError(r)) return; if (!r.ok) return r.text().then(t => { throw new Error(`Failed: ${r.status} - ${t}`); }); return r.json(); })
            .then(result => {
                if (!result) return;
                alert("Break day created. Events moved to next non-break day.");
                document.getElementById("eventModal")?.classList.remove('open');
                handleRequest();
            })
            .catch(e => { if (!handleFetchError(e)) { console.error(e); alert("Failed to create break.\n\n" + e.message); } });
        };

        function initializeDashboardControls() {
            document.querySelectorAll('.dashboard-tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    switchDashboardTab(btn.dataset.dashboardTab);
                });
            });

            document.querySelectorAll('.issues-subtab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    switchIssuesSubtab(btn.dataset.issuesSubtab);
                });
            });

            [
                ...Object.values(getCalendarFilterElements()),
                document.getElementById('threads-filter-query'),
                document.getElementById('threads-filter-channel'),
                document.getElementById('threads-filter-author'),
                document.getElementById('threads-filter-start'),
                document.getElementById('threads-filter-end'),
                document.getElementById('threads-filter-only-threads'),
                document.getElementById('threads-filter-limit')
            ].forEach(control => {
                control?.addEventListener('input', applyCalendarFilterUI);
                control?.addEventListener('change', applyCalendarFilterUI);
            });

            document.getElementById('threads-filter-limit')?.addEventListener('change', async () => {
                await handleRequest();
            });

            switchDashboardTab('calendar');
            switchIssuesSubtab('create');
        }

        function initializeIssueWorkspace() {
            const el = getIssueElements();
            const issueModal = document.getElementById('issueModal');
            const issueModalTitle = document.getElementById('issue-modal-title');
            const issueModalMeta = document.getElementById('issue-modal-meta');
            const issueModalDescription = document.getElementById('issue-modal-description');
            const issueModalTags = document.getElementById('issue-modal-tags');
            const issueModalCommentCount = document.getElementById('issue-modal-comment-count');
            const issueCommentsList = document.getElementById('issue-comments-list');
            const issueCommentText = document.getElementById('issue-comment-text');
            const issueCommentSubmit = document.getElementById('issue-comment-submit');
            const issueModalStarBtn = document.getElementById('issue-modal-star');
            const issueModalCloseBtn = document.getElementById('issue-modal-close');
            const issueModalCopyLinkBtn = document.getElementById('issue-modal-copy-link');
            const issueModalEditBtn = document.getElementById('issue-modal-edit');
            const issueModalDeleteBtn = document.getElementById('issue-modal-delete');
            let activeModalIssueId = null;

            function issueAssignmentKey(issueId) {
                return `issue-${issueId}`;
            }

            function issueStarAssignmentKey(issueId) {
                return `${issueAssignmentKey(issueId)}::star`;
            }

            function getIssueComments(issueId) {
                const seen = new Set();
                return (calendarIssueComments || [])
                    .map(normalizeIssueComment)
                    .filter(comment => {
                        if (String(comment.issueId || '') !== String(issueId) || comment.isStar) return false;
                        const commentId = String(comment.id);
                        if (seen.has(commentId)) return false;
                        seen.add(commentId);
                        return true;
                    })
                    .sort((a, b) => parseThreadTimestamp(b.timestamp).getTime() - parseThreadTimestamp(a.timestamp).getTime());
            }

            function renderIssueComments(issueId) {
                if (!issueCommentsList) return;

                const comments = getIssueComments(issueId);
                if (issueModalCommentCount) {
                    issueModalCommentCount.textContent = `${comments.length} repl${comments.length === 1 ? 'y' : 'ies'}`;
                }

                if (!comments.length) {
                    issueCommentsList.innerHTML = '<div class="issues-empty">No replies yet. Add the first one below.</div>';
                    return;
                }

                // Cancel any pending reply fetches from previous modal views
                if (window._activeReplyFetches) {
                    window._activeReplyFetches.forEach(controller => controller.abort());
                    window._activeReplyFetches.clear();
                }

                issueCommentsList.innerHTML = comments.map(comment => `
                    <article class="issue-comment-card" data-comment-id="${escapeIssueText(comment.id)}">
                        <div class="issue-comment-card-top">
                            <strong>${escapeIssueText(comment.author || 'Unknown')}</strong>
                            <span class="issue-meta">${escapeIssueText(comment.timestamp || '')}</span>
                            <button type="button" class="issue-comment-reply-btn" data-action="reply" data-comment-id="${escapeIssueText(comment.id)}" title="Reply to this comment">↳ Reply</button>
                        </div>
                        <div class="issue-comment-body">${escapeIssueText(comment.text || '')}</div>
                        <div class="issue-comment-replies" id="replies-${escapeIssueText(comment.id)}" style="margin-left: 20px; margin-top: 10px;"></div>
                    </article>
                `).join('');

                // Load and display replies for each comment
                comments.forEach(comment => {
                    loadRepliesForComment(comment.id);
                });

                // Attach reply button handlers
                document.querySelectorAll('.issue-comment-reply-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const commentId = btn.getAttribute('data-comment-id');
                        const parentComment = comments.find(c => String(c.id) === commentId);
                        if (parentComment) {
                            showReplyComposer(commentId, parentComment.author, parentComment.text);
                        }
                    });
                });
            }

            function loadRepliesForComment(commentId) {
                // Initialize the set if it doesn't exist
                if (!window._activeReplyFetches) {
                    window._activeReplyFetches = new Map();
                }

                // Abort any existing fetch for this comment
                const existingController = window._activeReplyFetches.get(commentId);
                if (existingController) {
                    existingController.abort();
                }

                // Create new abort controller for this fetch
                const controller = new AbortController();
                window._activeReplyFetches.set(commentId, controller);

                fetch(`${javaURI}/api/Comment/replies/${commentId}`, { ...fetchOptions, signal: controller.signal })
                    .then(r => { if (handleAuthError(r)) return; if (!r.ok) throw new Error('Failed to load replies'); return r.json(); })
                    .then(replies => {
                        if (!replies || replies.length === 0) return;
                        const repliesContainer = document.getElementById(`replies-${commentId}`);
                        if (!repliesContainer) return;
                        
                        repliesContainer.innerHTML = replies.map(reply => `
                            <article class="issue-comment-reply" style="border-left: 3px solid #ccc; padding-left: 12px;">
                                <div class="issue-comment-card-top">
                                    <strong>${escapeIssueText(reply.author || 'Unknown')}</strong>
                                    <span class="issue-meta">${escapeIssueText(reply.timestamp || '')}</span>
                                </div>
                                <div class="issue-comment-body">${escapeIssueText(reply.text || '')}</div>
                            </article>
                        `).join('');
                        
                        // Clean up the controller from the map
                        window._activeReplyFetches.delete(commentId);
                    })
                    .catch(e => { 
                        if (e.name !== 'AbortError') {
                            console.warn('Failed to load replies:', e);
                        }
                        window._activeReplyFetches.delete(commentId);
                    });
            }

            // Reply modal handling
            let _activeReplyParentId = null;
            function showReplyComposer(parentCommentId, parentAuthor, parentText) {
                const replyModal = document.getElementById('replyModal');
                const preview = document.getElementById('reply-parent-preview');
                const textarea = document.getElementById('reply-modal-text');
                if (!replyModal || !preview || !textarea) return;
                _activeReplyParentId = parentCommentId;
                preview.innerHTML = `<strong>${escapeIssueText(parentAuthor || 'Unknown')}</strong><div style="margin-top:6px;">${escapeIssueText((parentText || '').slice(0,300))}</div>`;
                textarea.value = '';
                replyModal.setAttribute('aria-hidden', 'false');
                textarea.focus();
            }

            // Reply modal submit/close wiring
            document.getElementById('reply-modal-close')?.addEventListener('click', () => {
                const m = document.getElementById('replyModal'); if (!m) return; m.setAttribute('aria-hidden', 'true'); _activeReplyParentId = null;
            });
            document.getElementById('reply-modal-cancel')?.addEventListener('click', () => {
                const m = document.getElementById('replyModal'); if (!m) return; m.setAttribute('aria-hidden', 'true'); _activeReplyParentId = null;
            });
            document.getElementById('reply-modal-submit')?.addEventListener('click', async () => {
                const parentId = _activeReplyParentId;
                const textarea = document.getElementById('reply-modal-text');
                if (!parentId || !textarea) return;
                const text = (textarea.value || '').trim();
                if (!text) return;
                try {
                    const resp = await fetch(`${javaURI}/api/Comment/reply/${parentId}`, { ...fetchOptions, method: 'POST', headers: { ...(fetchOptions.headers||{}), 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
                    if (handleAuthError(resp)) return;
                    if (!resp.ok) throw new Error('Failed to post reply');
                    // reload replies for parent
                    loadRepliesForComment(parentId);
                    // close modal
                    const m = document.getElementById('replyModal'); if (m) { m.setAttribute('aria-hidden','true'); }
                    _activeReplyParentId = null;
                } catch (e) {
                    if (!handleFetchError(e)) console.error('Failed to post reply:', e);
                }
            });

            // Close reply modal when clicking outside the content
            document.getElementById('replyModal')?.addEventListener('click', (event) => {
                const replyModal = document.getElementById('replyModal');
                const replyContent = document.querySelector('.reply-modal-content');
                if (event.target === replyModal && replyContent && event.target !== replyContent) {
                    replyModal.setAttribute('aria-hidden', 'true');
                    _activeReplyParentId = null;
                }
            });

            function updateIssueStarButton(issue) {
                if (!issueModalStarBtn || !issue) return;
                const starCount = Number(issue.starCount || 0);
                if (issue.starLocked) {
                    issueModalStarBtn.textContent = `Starred (${starCount})`;
                    issueModalStarBtn.disabled = true;
                    issueModalStarBtn.title = 'Auto-starred because this issue is assigned to one of your groups.';
                    return;
                }
                issueModalStarBtn.textContent = `${issue.starred ? 'Unstar' : 'Star'} (${starCount})`;
                issueModalStarBtn.disabled = false;
                issueModalStarBtn.title = '';
            }

            function getIssueFromUrl() {
                const params = new URLSearchParams(window.location.search);
                return params.get('issue');
            }

            function closeIssueModal(syncUrl = true) {
                activeModalIssueId = null;
                issueModal?.classList.remove('open');
                issueModal?.setAttribute('aria-hidden', 'true');
                if (syncUrl) {
                    clearIssueModalUrl(true);
                }
            }

            function openIssueModal(issue, syncUrl = true, replaceState = false) {
                if (!issue || !issueModal) return;

                activeModalIssueId = String(issue.id);
                issueModalTitle.textContent = issue.title || 'Untitled issue';
                const status = issue.status || 'open';
                const priority = issue.priority || 'medium';
                issueModalMeta.innerHTML = [
                    `<span class="issue-pill ${escapeIssueText(status)}">${escapeIssueText(ISSUE_STATUS_LABELS[status] || status)}</span>`,
                    `<span class="issue-pill ${escapeIssueText(priority)}">${escapeIssueText(priority.toUpperCase())}</span>`,
                    `<span class="issue-meta">Due ${escapeIssueText(formatIssueDate(issue.dueDate))}</span>`,
                    `<span class="issue-author">Author: ${escapeIssueText(issue.author || 'Unknown')}</span>`
                ].join('');
                issueModalDescription.innerHTML = renderIssueMarkdown(issue.description || '');
                const tags = normalizeTags(issue.tags);
                issueModalTags.innerHTML = tags.map(tag => `<span class="issue-tag">${escapeIssueText(tag)}</span>`).join('');
                renderIssueComments(issue.id);
                updateIssueStarButton(issue);
                const canDelete = !(issue.author && getCurrentIssueAuthor() && issue.author !== getCurrentIssueAuthor());
                if (issueModalDeleteBtn) {
                    issueModalDeleteBtn.disabled = !canDelete;
                    issueModalDeleteBtn.title = canDelete ? '' : 'Only the author can delete this issue';
                }
                issueModal.classList.add('open');
                issueModal.setAttribute('aria-hidden', 'false');

                if (syncUrl) {
                    setIssueModalUrl(issue.id, replaceState);
                }
            }

            function openIssueFromUrlIfPresent(replaceState = true) {
                const issueId = getIssueFromUrl();
                if (!issueId) {
                    closeIssueModal(false);
                    return;
                }
                const issue = calendarIssues.find(item => String(item.id) === String(issueId));
                if (!issue) {
                    closeIssueModal(false);
                    return;
                }
                switchDashboardTab('issues');
                openIssueModal(issue, true, replaceState);
            }

            el.newBtn?.addEventListener('click', () => {
                resetIssueForm(el.filterDate?.value || getLocalIsoDate());
                switchIssuesSubtab('create');
                el.title?.focus();
            });

            el.clearBtn?.addEventListener('click', () => {
                resetIssueForm(el.filterDate?.value || getLocalIsoDate());
            });

            [el.filterQuery, el.filterStatus, el.filterPriority, el.filterDate, el.filterAuthor, el.filterTags, el.filterGroup, el.filterStart, el.filterEnd].forEach(control => {
                control?.addEventListener('input', renderIssueViews);
                control?.addEventListener('change', renderIssueViews);
            });

            el.form?.addEventListener('submit', async (event) => {
                event.preventDefault();
                
                // Get selected groups
                const groupSelect = document.getElementById('issue-assigned-groups');
                const selectedOptions = Array.from(groupSelect?.selectedOptions || []);
                const assignedGroups = selectedOptions.filter(opt => opt.value).map(opt => opt.value);
                
                const payload = {
                    title: (el.title?.value || '').trim(),
                    description: (el.description?.value || '').trim(),
                    status: el.status?.value || 'open',
                    priority: el.priority?.value || 'medium',
                    dueDate: el.dueDate?.value || '',
                    eventId: (el.eventId?.value || '').trim() || null,
                    tags: normalizeTags(el.tags?.value || ''),
                    assignedGroups: assignedGroups.length > 0 ? JSON.stringify(assignedGroups) : null
                };

                if (!payload.title) {
                    showIssueToast('Issue title is required.', 'error');
                    el.title?.focus();
                    return;
                }
                if (!payload.dueDate) {
                    showIssueToast('Issue due date is required.', 'error');
                    el.dueDate?.focus();
                    return;
                }

                try {
                    await upsertIssue(Boolean(selectedIssueId), payload);
                    showIssueToast(selectedIssueId ? 'Issue updated.' : 'Issue created.', 'success');
                    resetIssueForm(payload.dueDate);
                    await handleRequest();
                    openIssueFromUrlIfPresent(true);
                } catch (error) {
                    console.error('Issue save error:', error);
                    if (error.message === 'AUTH') {
                        showIssueToast('Please log in again.', 'error');
                    } else {
                        showIssueToast('Could not save issue.', 'error');
                    }
                }
            });

            function resolveIssueFromEventTarget(target) {
                const issueId = target?.dataset?.issueId || target?.closest('[data-issue-id]')?.dataset?.issueId;
                if (!issueId) return null;
                return calendarIssues.find(issue => String(issue.id) === String(issueId)) || null;
            }

            function wireContainerActions(container) {
                container?.addEventListener('click', async (event) => {
                    const action = event.target?.dataset?.action;
                    if (!action) return;

                    const issue = resolveIssueFromEventTarget(event.target);
                    if (!issue) return;

                    if (action === 'edit') {
                        setIssueForm(issue);
                        closeIssueModal(false);
                        clearIssueModalUrl(true);
                        return;
                    }

                    if (action === 'view') {
                        openIssueModal(issue, true, false);
                        return;
                    }

                    if (action === 'delete') {
                        const confirmed = confirm(`Delete issue \"${issue.title}\"? This cannot be undone.`);
                        if (!confirmed) return;

                        try {
                            await deleteIssue(issue.id);
                            showIssueToast('Issue deleted.', 'warning');
                            if (String(selectedIssueId) === String(issue.id)) {
                                resetIssueForm(el.filterDate?.value || getLocalIsoDate());
                            }
                            if (String(activeModalIssueId) === String(issue.id)) {
                                closeIssueModal(false);
                                clearIssueModalUrl(true);
                            }
                            await handleRequest();
                        } catch (error) {
                            console.error('Issue delete error:', error);
                            showIssueToast('Could not delete issue.', 'error');
                        }
                    }
                });

                container?.addEventListener('change', async (event) => {
                    const statusSelect = event.target.closest('select[data-action="status"]');
                    if (!statusSelect) return;

                    const issue = resolveIssueFromEventTarget(statusSelect);
                    if (!issue) return;
                    if (statusSelect.value === (issue.status || 'open')) return;

                    const previousStatus = issue.status || 'open';
                    try {
                        await changeIssueStatus(issue.id, statusSelect.value);
                        showIssueToast(`Issue moved to ${ISSUE_STATUS_LABELS[statusSelect.value]}.`, 'success');
                        await handleRequest();
                    } catch (error) {
                        console.error('Issue status error:', error);
                        statusSelect.value = previousStatus;
                        showIssueToast('Could not change issue status.', 'error');
                    }
                });
            }

            wireContainerActions(el.list);
            wireContainerActions(el.kanban);
            wireContainerActions(document.getElementById('threads-list'));

            issueModalCloseBtn?.addEventListener('click', () => closeIssueModal(true));
            issueModal?.addEventListener('click', (event) => {
                if (event.target === issueModal) {
                    closeIssueModal(true);
                }
            });
            issueModalCopyLinkBtn?.addEventListener('click', async () => {
                if (!activeModalIssueId) return;
                const shareUrl = buildIssueShareUrl(activeModalIssueId);
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    showIssueToast('Issue link copied.', 'success');
                } catch (error) {
                    console.error('Clipboard copy failed:', error);
                    showIssueToast('Could not copy issue link.', 'error');
                }
            });
            issueModalEditBtn?.addEventListener('click', () => {
                if (!activeModalIssueId) return;
                const issue = calendarIssues.find(item => String(item.id) === String(activeModalIssueId));
                if (!issue) return;
                setIssueForm(issue);
                closeIssueModal(false);
                clearIssueModalUrl(true);
            });
            issueModalDeleteBtn?.addEventListener('click', async () => {
                if (!activeModalIssueId) return;
                const issue = calendarIssues.find(item => String(item.id) === String(activeModalIssueId));
                if (!issue) return;
                const confirmed = confirm(`Delete issue \"${issue.title}\"? This cannot be undone.`);
                if (!confirmed) return;
                try {
                    await deleteIssue(issue.id);
                    showIssueToast('Issue deleted.', 'warning');
                    if (String(selectedIssueId) === String(issue.id)) {
                        resetIssueForm(el.filterDate?.value || getLocalIsoDate());
                    }
                    closeIssueModal(false);
                    clearIssueModalUrl(true);
                    await handleRequest();
                } catch (error) {
                    console.error('Issue delete error:', error);
                    showIssueToast('Could not delete issue.', 'error');
                }
            });

            issueCommentSubmit?.addEventListener('click', async () => {
                if (!activeModalIssueId) return;
                const text = issueCommentText?.value?.trim() || '';
                if (!text) {
                    showIssueToast('Comment text is required.', 'error');
                    issueCommentText?.focus();
                    return;
                }

                try {
                    const response = await fetch(`${javaURI}/api/Comment/issue/${activeModalIssueId}`, {
                        ...fetchOptions,
                        method: 'POST',
                        headers: {
                            ...(fetchOptions.headers || {}),
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ text })
                    });

                    if (handleAuthError(response)) throw new Error('AUTH');
                    if (!response.ok) {
                        const message = await response.text();
                        throw new Error(message || 'Failed to save comment');
                    }

                    issueCommentText.value = '';
                    showIssueToast('Reply posted.', 'success');
                    await handleRequest();
                    const refreshedIssue = calendarIssues.find(item => String(item.id) === String(activeModalIssueId));
                    if (refreshedIssue) {
                        openIssueModal(refreshedIssue, false, true);
                    }
                } catch (error) {
                    console.error('Issue comment error:', error);
                    showIssueToast(error.message === 'AUTH' ? 'Please log in again.' : 'Could not save comment.', 'error');
                }
            });

            issueModalStarBtn?.addEventListener('click', async () => {
                if (!activeModalIssueId) return;

                try {
                    const response = await fetch(`${javaURI}/api/Comment/issue/${activeModalIssueId}/star`, {
                        ...fetchOptions,
                        method: 'POST'
                    });

                    if (handleAuthError(response)) throw new Error('AUTH');
                    if (!response.ok) {
                        const message = await response.text();
                        throw new Error(message || 'Failed to toggle star');
                    }

                    showIssueToast('Star updated.', 'success');
                    await handleRequest();
                    const refreshedIssue = calendarIssues.find(item => String(item.id) === String(activeModalIssueId));
                    if (refreshedIssue) {
                        openIssueModal(refreshedIssue, false, true);
                    }
                } catch (error) {
                    console.error('Issue star error:', error);
                    showIssueToast(error.message === 'AUTH' ? 'Please log in again.' : (error.message?.includes('auto-starred') ? 'This issue is locked to your group.' : 'Could not update star.'), 'error');
                }
            });

            window.addEventListener('popstate', () => {
                const issueId = getIssueFromUrl();
                if (!issueId) {
                    closeIssueModal(false);
                    return;
                }
                const issue = calendarIssues.find(item => String(item.id) === String(issueId));
                if (issue) {
                    switchDashboardTab('issues');
                    openIssueModal(issue, false, true);
                }
            });

            resetIssueForm(getLocalIsoDate());

            onIssuesRefreshedHook = () => {
                if (getIssueFromUrl()) {
                    openIssueFromUrlIfPresent(true);
                }
            };

            const issueIdFromUrl = getIssueFromUrl();
            if (issueIdFromUrl) {
                openIssueFromUrlIfPresent(true);
            }
        }

        initializeDashboardControls();
        initializeIssueWorkspace();

        window.displayCalendar = displayCalendar;
        window.filterEvents = filterEvents;
        window.renderIssueViews = renderIssueViews;
        window.renderThreadsPanel = renderThreadsPanel;

        // ── Populate groups select and handle auto-starring ─────────
        async function populateGroupsSelect() {
            const issueGroupSelect = document.getElementById('issue-assigned-groups');
            const calendarFilter = document.getElementById('calendar-filter-group');
            const issuesFilter = document.getElementById('issues-filter-group');
            try {
                const r = await fetch(`${javaURI}/api/groups`, { ...fetchOptions });
                if (handleAuthError(r)) return;
                if (!r.ok) throw new Error('Failed to load groups');
                const groups = await r.json();
                if (!Array.isArray(groups) || groups.length === 0) return;

                // Populate issue-assigned-groups select (clear existing options except placeholder)
                if (issueGroupSelect) {
                    while (issueGroupSelect.options.length > 1) issueGroupSelect.remove(1);
                }

                // Populate calendar and issues filter selects (clear existing options except 'All groups')
                if (calendarFilter) {
                    while (calendarFilter.options.length > 1) calendarFilter.remove(1);
                }
                if (issuesFilter) {
                    while (issuesFilter.options.length > 1) issuesFilter.remove(1);
                }

                // Build a lookup for group labels by id for display elsewhere
                window.allGroupsById = {};
                groups.forEach(group => {
                    const value = String(group.id || group.name || '');
                    const label = `Period ${group.period || ''} - ${group.name || ''}`;
                    window.allGroupsById[value] = label;

                    if (issueGroupSelect) {
                        const opt = document.createElement('option');
                        opt.value = value;
                        opt.textContent = label;
                        issueGroupSelect.appendChild(opt);
                    }
                    if (calendarFilter) {
                        const opt = document.createElement('option');
                        opt.value = value;
                        opt.textContent = label;
                        calendarFilter.appendChild(opt);
                    }
                    if (issuesFilter) {
                        const opt = document.createElement('option');
                        opt.value = value;
                        opt.textContent = label;
                        issuesFilter.appendChild(opt);
                    }
                    // Also populate the event modal's group select so events can be assigned
                    const editGroupSelect = document.getElementById('editGroupName');
                    if (editGroupSelect) {
                        const opt2 = document.createElement('option');
                        opt2.value = value;
                        opt2.textContent = label;
                        editGroupSelect.appendChild(opt2);
                    }
                });
            } catch (e) {
                console.warn('Failed to populate groups:', e);
            }
        }

        async function autoStarIssuesForUserGroups() {
            if (!calendarIssues || calendarIssues.length === 0) return;
            // Fetch groups current user belongs to
            const userGroups = await fetchUserGroups();
            console.debug('autoStar: fetched userGroups', userGroups);
            if (!Array.isArray(userGroups) || userGroups.length === 0) {
                console.debug('autoStar: no user groups, aborting');
                return;
            }
            const userGroupIds = new Set(userGroups.map(g => String(g.id)));

            // For each issue, if assignedGroups contains any of user's group ids and user hasn't starred it, star it
            for (const issue of calendarIssues) {
                if (!issue || !issue.assignedGroups) continue;
                let assigned = [];
                try { assigned = JSON.parse(issue.assignedGroups); } catch (e) { assigned = []; }
                if (!Array.isArray(assigned) || assigned.length === 0) continue;

                const matches = assigned.map(String).some(a => userGroupIds.has(a));
                if (!matches) continue;

                // If already starred by user, skip
                console.debug('autoStar: issue', issue.id, 'assigned', assigned, 'matchesUserGroups=', matches, 'starred=', issue.starred);
                if (issue.starred) continue;

                // Attempt to star silently
                try {
                    const resp = await fetch(`${javaURI}/api/Comment/issue/${issue.id}/star/ensure`, {
                        ...fetchOptions,
                        method: 'POST'
                    });
                    if (handleAuthError(resp)) break; // stop if auth problem
                    if (!resp.ok) {
                        // ignore failures for auto-star
                        console.warn('Auto-star failed for issue', issue.id, resp.status);
                        continue;
                    }
                    // refresh issues after successful star
                    await handleRequest();
                } catch (e) {
                    console.warn('Auto-star error for issue', issue.id, e);
                }
            }
        }

        // ── GO! ─────────────────────────────────────────────────────
        // Ensure groups are loaded before rendering issues/calendar so labels and filters work
        await populateGroupsSelect();
        console.debug('populateGroupsSelect complete, groups loaded:', window.allGroupsById);
        await handleRequest();
        await autoStarIssuesForUserGroups();
        renderThreadsPanel();
    });

    // ── Text formatting helpers ─────────────────────────────────────
    function slackToHtml(text) {
        if (!text) return '';
        let processed = text;
        const codeBlocks = [];
        processed = processed.replace(/```([\s\S]*?)```/g, (m, c) => { codeBlocks.push(c); return `%%CB${codeBlocks.length-1}%%`; });
        const inlineCodes = [];
        processed = processed.replace(/`([^`]+)`/g, (m, c) => { inlineCodes.push(c); return `%%IC${inlineCodes.length-1}%%`; });
        const links = [];
        processed = processed.replace(/<((https?|ftp|mailto):[^|>]+)(?:\|([^>]+))?>/g, (m, url, p, t) => { links.push({url, linkText: t || url}); return `%%LK${links.length-1}%%`; });
        processed = processed.replace(/(\*)([^*]+)\1/g, '<strong>$2</strong>').replace(/(_)([^_]+)\1/g, '<em>$2</em>').replace(/(~)([^~]+)\1/g, '<del>$2</del>');
        processed = processed.replace(/%%CB(\d+)%%/g, (m, i) => `<pre><code>${escapeHtml(codeBlocks[i])}</code></pre>`);
        processed = processed.replace(/%%IC(\d+)%%/g, (m, i) => `<code>${escapeHtml(inlineCodes[i])}</code>`);
        processed = processed.replace(/%%LK(\d+)%%/g, (m, i) => { const l = links[i]; return `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.linkText)}</a>`; });
        return processed.replace(/\n/g, '<br>');
    }
    function escapeHtml(s) { return s ? s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;") : ''; }
    function formatDisplayDate(d) { return new Date(d).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' }); }
</script>