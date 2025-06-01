---
title: Calendar
permalink: /student/calendar
layout: aesthetihawk
active_tab: calendar
---
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.css">
<!-- Tailwind CSS CDN -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<!-- FullCalendar Container -->
<div id="calendar" class="box-border z-0"></div>
<!-- Modal -->
<div id="eventModal" class="fixed z-[99999] inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm pt-12 hidden">
    <div class="relative bg-gray-900 mx-auto my-12 p-8 rounded-2xl shadow-2xl max-w-xl min-h-fit w-full text-white font-sans modal-content">
        <span class="text-gray-400 absolute right-8 top-6 text-3xl font-bold cursor-pointer transition-colors duration-300 hover:text-red-600" id="closeModal">&times;</span>
        <div class="modal-body">
            <h2 id="eventTitle" class="text-white text-4xl font-bold mb-6"></h2>
            <label for="editDate" class="block mt-2 mb-1 text-lg font-semibold">Date:</label>
            <p id="editDateDisplay" contentEditable='false' class="w-full p-3 rounded-xl border border-gray-700 text-base bg-gray-800 text-white box-border mb-4"></p>
            <input type="date" id="editDate" style="display: none;" class="w-full p-3 rounded-xl border border-gray-700 text-base bg-gray-800 text-white box-border mb-4">
            <label for="editTitle" class="block mt-2 mb-1 text-lg font-semibold">Title:</label>
            <p id="editTitle" contentEditable='false' class="w-full p-3 rounded-xl border border-gray-700 text-base bg-gray-800 text-white box-border mb-4"></p>
            <label for="editDescription" class="block mt-2 mb-1 text-lg font-semibold">Description:</label>
            <p id="editDescription" contentEditable='false' class="w-full p-3 rounded-xl border border-gray-700 text-base bg-gray-800 text-white box-border mb-4 whitespace-pre-wrap"></p>
        <div class="modal-actions">
            <button id="saveButton" class="w-full p-3 bg-red-700 text-white rounded-xl text-base font-bold cursor-pointer transition duration-200 hover:bg-red-900 mt-2 hidden">Save Changes</button>
            <button id="deleteButton" class="w-full p-3 bg-red-700 text-white rounded-xl text-base font-bold cursor-pointer transition duration-200 hover:bg-red-900 mt-2">Delete Event</button>
            <button id="editButton" class="w-full p-3 bg-red-700 text-white rounded-xl text-base font-bold cursor-pointer transition duration-200 hover:bg-red-900 mt-2">Edit Event</button>
        </div>
    </div>
</div>
<!-- FullCalendar JS -->
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.js"></script>
<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    let allEvents = []; // Global array to store all events
    let currentFilter = null; // Track the current filter
    document.addEventListener("DOMContentLoaded", function () {
        let currentEvent = null;
        let isAddingNewEvent = false;
        let calendar;
        function request() {
            return fetch(`${javaURI}/api/calendar/events`, fetchOptions)
                .then(response => {
                    if (response.status !== 200) {
                        console.error("HTTP status code: " + response.status);
                        return null;
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error("Fetch error: ", error);
                    return null;
                });
        }
        function getAssignments() {
            return fetch(`${javaURI}/api/assignments/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error("Error fetching assignments:", error);
                    return null;
                });
        }
        function handleRequest() {
            Promise.all([request(), getAssignments()])
                .then(([calendarEvents, assignments]) => {
                    allEvents = []; // Reset allEvents
                    if (calendarEvents !== null) {
                        calendarEvents.forEach(event => {
                            try {
                                let color = "#808080";
                                if (event.class == "CSP") {
                                    color = "#3788d8";
                                } else if (event.class == "CSSE") {
                                    color = "#008000";
                                }
                                allEvents.push({
                                    id: event.id,
                                    period: event.period,
                                    //type: event.type,
                                    title: event.title.replace(/\(P[13]\)/gi, ""),
                                    description: event.description,
                                    start: event.date,
                                    color: color
                                });
                            } catch (err) {
                                console.error("Error loading calendar event:", event, err);
                            }
                        });
                    }
                    if (assignments !== null) {
                        assignments.forEach(assignment => {
                            try {
                                const [month, day, year] = assignment.dueDate.split('/');
                                const dueDate = new Date(year, month - 1, day).getTime();
                                allEvents.push({
                                    id: assignment.id,
                                    title: assignment.name,
                                    description: assignment.description,
                                    start: formatDate(dueDate),
                                    color: "#FFA500"
                                });
                            } catch (err) {
                                console.error("Error loading assignment:", assignment, err);
                            }
                        });
                    }
                    displayCalendar(filterEventsByClass(currentFilter)); // Display filtered events
                });
        }
        function displayCalendar(events) {
            const calendarEl = document.getElementById('calendar');
            if (calendar) {
                calendar.destroy(); // Destroy the existing calendar instance
            }
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today allButton,csaButton,cspButton,csseButton',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay'
                },
                customButtons: {
                    allButton: {
                        text: 'All',
                        click: function () {
                            currentFilter = null;
                            displayCalendar(filterEventsByClass(currentFilter));
                        }
                    },
                    csaButton: {
                        text: 'CSA',
                        click: function () {
                            currentFilter = "CSA";
                            displayCalendar(filterEventsByClass(currentFilter));
                        }
                    },
                    cspButton: {
                        text: 'CSP',
                        click: function () {
                            currentFilter = "CSP";
                            displayCalendar(filterEventsByClass(currentFilter));
                        }
                    },
                    csseButton: {
                        text: 'CSSE',
                        click: function () {
                            currentFilter = "CSSE";
                            displayCalendar(filterEventsByClass(currentFilter));
                        }
                    }
                },
                views: {
                    dayGridMonth: { buttonText: 'Month' },
                    dayGridWeek: { buttonText: 'Week' },
                    dayGridDay: { buttonText: 'Day' }
                },
                events: events,
                eventClick: function (info) {
                    document.getElementById("saveButton").style.display = "none";
                    currentEvent = info.event;
                    document.getElementById('eventTitle').textContent = currentEvent.title;
                    document.getElementById('editTitle').innerHTML = currentEvent.title;
                    document.getElementById('editDescription').innerHTML = slackToHtml(currentEvent.extendedProps.description || "");
                    document.getElementById('editDateDisplay').textContent = formatDisplayDate(currentEvent.start);
                    document.getElementById('editDate').value = formatDate(currentEvent.start);
                    document.getElementById("eventModal").style.display = "block";
                    document.getElementById("deleteButton").style.display = "inline-block";
                    document.getElementById("editButton").style.display = "inline-block";
                },
                dateClick: function (info) {
                    isAddingNewEvent = true;
                    document.getElementById("eventTitle").textContent = "Add New Event";
                    document.getElementById("editTitle").innerHTML = "";
                    document.getElementById("editDescription").innerHTML = "";
                    document.getElementById("editDescription").contentEditable = true;
                    document.getElementById("editTitle").contentEditable = true;
                    document.getElementById('editDateDisplay').textContent = formatDisplayDate(info.date);
                    document.getElementById('editDate').value = formatDate(info.date);
                    document.getElementById("eventModal").style.display = "block";
                    document.getElementById("deleteButton").style.display = "none";
                    document.getElementById("editButton").style.display = "none";
                    document.getElementById("saveButton").style.display = "inline-block";
                    document.getElementById("saveButton").onclick = function () {
                        const updatedTitle = document.getElementById("editTitle").innerHTML.trim();
                        const updatedDescription = document.getElementById("editDescription").innerHTML;
                        const updatedDate = document.getElementById("editDate").value;
                        if (!updatedTitle || !updatedDescription || !updatedDate) {
                            alert("Title, Description, and Date cannot be empty!");
                            return;
                        }
                        const newEventPayload = {
                            title: updatedTitle,
                            description: updatedDescription,
                            date: updatedDate,
                            period: currentFilter, // Event class (CSA, CSP, CSSE)
                        };
                        const newEvent = {
                            id: Date.now().toString(), // Generate a unique ID
                            title: updatedTitle,
                            description: updatedDescription,
                            start: updatedDate,
                            period: currentFilter, // Assign the current filter (CSA, CSP, CSSE)
                            color: "#808080"
                        };
                        allEvents.push(newEvent); // Add to allEvents
                        displayCalendar(filterEventsByClass(currentFilter)); // Refresh calendar
                        document.getElementById("eventModal").style.display = "none";
                        fetch(`${javaURI}/api/calendar/add_event`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(newEventPayload),
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Failed to add new event: ${response.status} ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then(() => {
                            // Re-fetch events from the backend to ensure the calendar is up-to-date
                            handleRequest();
                            document.getElementById("eventModal").style.display = "none";
                        })
                        .catch(error => {
                            console.error("Error adding event:", error);
                        });
                    };
                },
                eventMouseEnter: function (info) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'event-tooltip';
                    tooltip.innerHTML = `<strong>${info.event.title}</strong><br>${info.event.extendedProps.description || ''}`;
                    document.body.appendChild(tooltip);
                    tooltip.style.left = info.jsEvent.pageX + 'px';
                    tooltip.style.top = info.jsEvent.pageY + 'px';
                },
                eventMouseLeave: function () {
                    const tooltips = document.querySelectorAll('.event-tooltip');
                    tooltips.forEach(tooltip => tooltip.remove());
                }
            });
            calendar.render();
        }
        function filterEventsByClass(className) {
            if (!className) return allEvents; // If no filter is applied, return all events
            return allEvents.filter(event => event.period === className);
        }
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
        }
        document.getElementById("closeModal").onclick = function () {
            document.getElementById('editDateDisplay').style.display = 'block';
            document.getElementById('editDateDisplay').style.display = 'block';
            document.getElementById('editDate').style.display = 'none';
            document.getElementById("saveButton").style.display = "none";
            document.getElementById("eventModal").style.display = "none";
            document.getElementById("editTitle").contentEditable = false;
            document.getElementById("editDescription").contentEditable = false;
            document.getElementById("eventModal").style.display = "none";
        };
        document.getElementById("saveButton").onclick = function () {
            const updatedTitle = document.getElementById("editTitle").innerHTML.trim();
            const updatedDescription = document.getElementById("editDescription").innerHTML;
            const updatedDate = document.getElementById("editDate").value;
            document.getElementById("saveButton").style.display = "none";
            document.getElementById('editDateDisplay').style.display = 'block';
            document.getElementById('editDate').style.display = 'none';
            document.getElementById('editDateDisplay').textContent = formatDisplayDate(new Date(updatedDate));
            document.getElementById("editDescription").contentEditable = false;
            if (!updatedTitle || !updatedDescription || !updatedDate) {
                alert("Title, Description, and Date cannot be empty!");
                return;
            }
            if (isAddingNewEvent) {
                const newEventPayload = {
                    title: updatedTitle,
                    description: updatedDescription,
                    date: updatedDate,
                    period: currentFilter, // Event class (CSA, CSP, CSSE)
                };
                fetch(`${javaURI}/api/calendar/add_event`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newEventPayload),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to add new event: ${response.status} ${response.statusText}`);
                    }
                    return response.json(); // Parse the response JSON if needed
                })
                .then(newEvent => {
                    calendar.addEvent({
                        id: newEvent.id,
                        title: newEvent.title,
                        start: newEvent.date,
                        description: newEvent.description,
                        color: newEvent.color || "#808080",
                    });
                    document.getElementById("eventModal").style.display = "none";
                })
                .catch(error => {
                    console.warn("Error adding event to Slack:", error);
                    alert("This event has been added to the calendar but could not be updated in Slack.");
                    calendar.addEvent({
                        title: updatedTitle,
                        start: updatedDate,
                        description: updatedDescription,
                        color: "#808080"
                    });
                    document.getElementById("eventModal").style.display = "none";
                });
            } else {
                const payload = { newTitle: updatedTitle, description: updatedDescription, date: updatedDate };
                const id = currentEvent.id;
                fetch(`${javaURI}/api/calendar/edit/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to update event: ${response.status} ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(() => {
                    currentEvent.setProp("title", updatedTitle);
                    currentEvent.setExtendedProp("description", updatedDescription);
                    currentEvent.setStart(updatedDate);
                    document.getElementById("eventModal").style.display = "none";
                })
                .catch(error => {
                    console.warn("Error updating event in Slack:", error);
                    alert("This event has been updated in the calendar but could not be updated in Slack.");
                    currentEvent.setProp("title", updatedTitle);
                    currentEvent.setExtendedProp("description", updatedDescription);
                    currentEvent.setStart(updatedDate);
                    document.getElementById("eventModal").style.display = "none";
                });
            }
        };
        document.getElementById("editButton").onclick = function () {
            document.getElementById('editDateDisplay').style.display = 'none';
            document.getElementById('editDate').style.display = 'block';
            document.getElementById("deleteButton").style.display = 'none';
            document.getElementById("saveButton").style.display = 'inline-block';
            document.getElementById("editDescription").contentEditable = true;
            document.getElementById("editTitle").contentEditable = true;
            console.log(currentEvent.extendedProps.description || "");
            document.getElementById("editDescription").innerHTML = currentEvent.extendedProps.description || "";
        };
        document.getElementById("deleteButton").onclick = function () {
            if (!currentEvent) return;
            const id = currentEvent.id;
            const confirmation = confirm(`Are you sure you want to delete "${currentEvent.title}"?`);
            if (!confirmation) return;
            fetch(`${javaURI}/api/calendar/delete/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete event: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(() => {
                currentEvent.remove();
                document.getElementById("eventModal").style.display = "none";
            })
            .catch(error => {
                console.error("Error deleting event:", error);
                alert("This event has been removed from the calendar but could not be deleted from Slack.");
                currentEvent.remove();
                document.getElementById("eventModal").style.display = "none";
            });
        };
        handleRequest();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            document.getElementById('editDateDisplay').style.display = 'block';
            document.getElementById('editDate').style.display = 'none';
            document.getElementById("saveButton").style.display = "none";
            document.getElementById("eventModal").style.display = "none";
            document.getElementById("editTitle").contentEditable = false;
            document.getElementById("editDescription").contentEditable = false;
        }
    });
    window.onclick = function (event) {
        const modal = document.getElementById("eventModal");
        if (event.target === modal) {
            document.getElementById('editDateDisplay').style.display = 'block';
            document.getElementById('editDate').style.display = 'none';
            document.getElementById("saveButton").style.display = "none";
            document.getElementById("eventModal").style.display = "none";
            document.getElementById("editTitle").contentEditable = false;
            document.getElementById("editDescription").contentEditable = false;
            modal.style.display = "none";
        }
    };
    function slackToHtml(text) {
        if (!text) return '';
        // First pass - handle code blocks to prevent their content from being processed
        let processed = text;
        const codeBlocks = [];
        processed = processed.replace(/```([\s\S]*?)```/g, (match, content) => {
            codeBlocks.push(content);
            return `%%CODEBLOCK${codeBlocks.length-1}%%`;
        });
        // Second pass - handle inline code
        const inlineCodes = [];
        processed = processed.replace(/`([^`]+)`/g, (match, content) => {
            inlineCodes.push(content);
            return `%%INLINECODE${inlineCodes.length-1}%%`;
        })
        // Third pass - handle links
        const links = [];
        processed = processed.replace(/<((https?|ftp|mailto):[^|>]+)(?:\|([^>]+))?>/g, (match, url, protocol, text) => {
            const linkText = text || url;
            links.push({url, linkText});
            return `%%LINK${links.length-1}%%`;
        });
        // Process formatting (bold, italic, strikethrough) with nesting support
        processed = processed
            .replace(/(\*)([^*]+)\1/g, '<strong>$2</strong>')
            .replace(/(_)([^_]+)\1/g, '<em>$2</em>')
            .replace(/(~)([^~]+)\1/g, '<del>$2</del>');
        // Restore code blocks
        processed = processed.replace(/%%CODEBLOCK(\d+)%%/g, (match, index) => {
            return `<pre><code>${escapeHtml(codeBlocks[index])}</code></pre>`;
        });
        // Restore inline code
        processed = processed.replace(/%%INLINECODE(\d+)%%/g, (match, index) => {
            return `<code>${escapeHtml(inlineCodes[index])}</code>`;
        });
        // Restore links
        processed = processed.replace(/%%LINK(\d+)%%/g, (match, index) => {
            const {url, linkText} = links[index];
            return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(linkText)}</a>`;
        });
        // Convert newlines to <br> and preserve multiple newlines
        processed = processed.replace(/\n/g, '<br>');
        return processed;
    }
    // Helper function to escape HTML special characters
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    function formatDisplayDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
</script>