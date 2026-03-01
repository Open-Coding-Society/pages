---
title: Calendar
permalink: /student/calendar
tailwind: true
layout: aesthetihawk
active_tab: calendar
---
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.css">

<!-- FullCalendar Container -->
<div id="calendar-auth-banner" style="display:none; background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%); color: #fff; padding: 12px 20px; border-radius: 12px; margin-bottom: 12px; font-size: 0.95rem; align-items: center; gap: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
    <i class="fas fa-exclamation-triangle" style="font-size: 1.2rem;"></i>
    <span>Your session has expired. <a href="{{site.baseurl}}/login" style="color: #fbbf24; text-decoration: underline; font-weight: 600;">Log in again</a> to view and manage your calendar events.</span>
</div>
<div id="calendar" class="box-border z-0"></div>
<!-- Modal -->
<div id="eventModal" class="fixed z-[99999] inset-0 flex items-center justify-center bg-opacity-70 backdrop-blur-sm py-4 overflow-y-auto hidden">
    <div class="relative mx-auto my-4 p-8 rounded-2xl shadow-2xl max-w-xl max-h-[90vh] overflow-y-auto w-full font-sans modal-content">
        <span class="text-gray-400 absolute right-8 top-6 text-3xl font-bold cursor-pointer transition-colors duration-300 hover:text-red-600" id="closeModal">&times;</span>
        <div class="modal-body">
            <h2 id="eventTitle" class="text-4xl font-bold mb-6"></h2>
            <label for="editEventType" class="block mt-2 mb-1 text-lg font-semibold">Type:</label>
            <select id="editEventType" disabled class="w-full p-3 rounded-xl border border-gray-700 text-base box-border mb-4">
                <option value="event">Event</option>
                <option value="appointment">Appointment</option>
            </select>
            <label for="editDate" class="block mt-2 mb-1 text-lg font-semibold">Date:</label>
            <p id="editDateDisplay" contentEditable='false' class="w-full p-3 rounded-xl border border-gray-700 text-base box-border mb-4"></p>
            <input type="date" id="editDate" style="display: none;" class="w-full p-3 rounded-xl border border-gray-700 text-base box-border mb-4">
            <label for="editTitle" class="block mt-2 mb-1 text-lg font-semibold">Title:</label>
            <p id="editTitle" contentEditable='false' class="w-full p-3 rounded-xl border border-gray-700 text-base box-border mb-4"></p>
            <label for="editDescription" class="block mt-2 mb-1 text-lg font-semibold">Description:</label>
            <p id="editDescription" contentEditable='false' class="w-full p-3 rounded-xl border border-gray-700 text-base box-border mb-4 whitespace-pre-wrap"></p>
            <label for="editPriority" class="block mt-2 mb-1 text-lg font-semibold">Priority:</label>
            <select id="editPriority" disabled class="w-full p-3 rounded-xl border border-gray-700 text-base box-border mb-4">
                <option value="P0" class="bg-red-200 text-red-900">P0 - Critical</option>
                <option value="P1" class="bg-orange-200 text-orange-900">P1 - High</option>
                <option value="P2" class="bg-yellow-200 text-yellow-900" selected>P2 - Medium</option>
                <option value="P3" class="bg-green-200 text-green-900">P3 - Low</option>
            </select>
            <label for="editGroupName" class="block mt-2 mb-1 text-lg font-semibold">Group:</label>
            <select id="editGroupName" disabled class="w-full p-3 rounded-xl border border-gray-700 text-base box-border mb-4">
                <option value="">-- Select Group --</option>
                <!-- Options populated dynamically from user's groups -->
            </select>
        </div>
        <div class="modal-actions">
            <button id="saveButton" class="w-full p-3 bg-red-700 rounded-xl text-base font-bold cursor-pointer transition duration-200 hover:bg-red-900 mt-2 hidden">Save Changes</button>
            <button id="makeBreakButton" class="w-full p-3 bg-yellow-600 rounded-xl text-base font-bold cursor-pointer transition duration-200 hover:bg-yellow-800 mt-2 hidden">Make Break</button>
            <button id="deleteButton" class="w-full p-3 bg-red-700 rounded-xl text-base font-bold cursor-pointer transition duration-200 hover:bg-red-900 mt-2">Delete Event</button>
            <button id="editButton" class="w-full p-3 bg-red-700 rounded-xl text-base font-bold cursor-pointer transition duration-200 hover:bg-red-900 mt-2">Edit Event</button>
        </div>
    </div>
</div>

<!-- FullCalendar JS -->
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.js"></script>
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

    // ─── Main ───────────────────────────────────────────────────────
    document.addEventListener("DOMContentLoaded", async function () {
        userGroups = await fetchUserGroups();
        populateGroupDropdown();

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

        // ── handleRequest: build allEvents, then render ─────────────
        function handleRequest() {
            Promise.all([request(), getBreaks()])
                .then(([calendarEvents, breaks]) => {
                    if (calendarEvents !== null) { javaAuthenticated = true; hideAuthBanner(); }
                    allEvents = [];

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
                })
                .catch(error => {
                    handleFetchError(error);
                    console.error("handleRequest error:", error);
                    displayCalendar(filterEvents());
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
            let filtered = allEvents;

            if (filterMode === 'my-groups' && userGroups.length > 0) {
                const myGroupNames = getUserGroupNames();
                const myCourses = getUserCourses();
                filtered = filtered.filter(event => {
                    // Always show breaks/holidays
                    if (event.isBreak || (event.extendedProps && event.extendedProps.isBreak)) return true;
                    // Match by group name
                    const evtGroup = event.groupName || (event.extendedProps && event.extendedProps.groupName) || '';
                    if (evtGroup && myGroupNames.has(evtGroup)) return true;
                    // Match by course (for sprint-synced events that have period=CSA/CSP/CSSE)
                    const evtCourse = event.period || (event.extendedProps && event.extendedProps.period) || '';
                    if (evtCourse && myCourses.has(evtCourse.toUpperCase())) return true;
                    // If event has no group AND no course, show it (personal event)
                    if (!evtGroup && !evtCourse) return true;
                    return false;
                });
            }
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
            if (calendar) calendar.destroy();
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today myGroupsButton,allButton',
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
                            displayCalendar(filterEvents());
                        }
                    }
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
                    } catch (e) { /* ignore */ }
                },
                events: events,
                eventContent: function(arg) {
                    const event = arg.event;
                    const ext = event.extendedProps || {};
                    const isAppointment = ext.type === 'appointment';
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
                },
                eventClick: function (info) {
                    document.getElementById("saveButton").style.display = "none";
                    document.getElementById("makeBreakButton").style.display = "none";
                    currentEvent = info.event;
                    isAddingNewEvent = false;
                    const isBreak = (currentEvent.extendedProps && currentEvent.extendedProps.isBreak === true) || currentEvent.isBreak === true;
                    document.getElementById('eventTitle').textContent = currentEvent.title;
                    document.getElementById('editTitle').innerHTML = isBreak
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
                    document.getElementById("eventModal").style.display = "block";
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
                    } else {
                        document.getElementById("deleteButton").style.display = "inline-block";
                        document.getElementById("editButton").style.display = "inline-block";
                        document.getElementById("eventModal").dataset.isBreak = "false";
                    }
                },
                dateClick: function (info) {
                    if (!javaAuthenticated || ((!window.user || !window.user.uid) && !currentPersonId)) {
                        alert('You must be logged in to create events. Please log in and try again.');
                        return;
                    }
                    const selectedDate = formatDate(info.date);
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
                    document.getElementById("eventModal").style.display = "block";
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
                        if (!selectedGroup) {
                            alert("Please select a Group for this event.");
                            return;
                        }

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
                        document.getElementById("eventModal").style.display = "none";
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
            document.getElementById("eventModal").style.display = "none";
            document.getElementById("editTitle").contentEditable = false;
            document.getElementById("editDescription").contentEditable = false;
            document.getElementById("editPriority").disabled = true;
            document.getElementById("editEventType").disabled = true;
            document.getElementById("editGroupName").disabled = true;
        }
        document.getElementById("closeModal").onclick = closeModal;
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
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
                .then(d => { if (!d) return; document.getElementById("eventModal").style.display = "none"; handleRequest(); })
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
                    .then(d => { if (!d) return; document.getElementById("eventModal").style.display = "none"; handleRequest(); })
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
                    .then(d => { if (d === undefined) return; document.getElementById("eventModal").style.display = "none"; handleRequest(); })
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
            const id = currentEvent.id;
            if (!confirm(`Are you sure you want to delete "${currentEvent.title}"?`)) return;
            const endpoint = isBreak ? `${javaURI}/api/calendar/breaks/${id}` : `${javaURI}/api/calendar/delete/${id}`;
            fetch(endpoint, { ...fetchOptions, method: "DELETE" })
            .then(r => { if (handleAuthError(r)) return; if (!r.ok) throw new Error(`Failed: ${r.status}`); return r.text(); })
            .then(d => { if (d === undefined) return; currentEvent.remove(); document.getElementById("eventModal").style.display = "none"; handleRequest(); })
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
                document.getElementById("eventModal").style.display = "none";
                handleRequest();
            })
            .catch(e => { if (!handleFetchError(e)) { console.error(e); alert("Failed to create break.\n\n" + e.message); } });
        };

        // ── GO! ─────────────────────────────────────────────────────
        handleRequest();
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