---
layout: aesthetihawk
title: Bathroom Queue
permalink: /bathroom_queue/
---

<head>
    <script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
</head>

<div class="max-w-[75vw] mx-auto px-4 py-12">
    <!-- Centered Header -->
    <div class="text-center mb-12">
        <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight mb-6">
            BATHROOM QUEUE
        </h1>
        
        <div class="flex justify-center items-center gap-6 bg-neutral-900/50 backdrop-blur-xl p-6 rounded-2xl border border-neutral-800 shadow-2xl inline-flex mx-auto">
            <div class="text-center px-4 border-r border-neutral-800">
                <span id="currentAway" class="block text-3xl font-bold text-indigo-400">0</span>
                <span class="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Away</span>
            </div>
            <div class="text-center px-4">
                <span id="maxCapacity" class="block text-3xl font-bold text-neutral-400">1</span>
                <span class="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Limit</span>
            </div>
            <div id="statusIndicator" class="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span class="text-xs font-bold text-green-500 uppercase tracking-wider">Available</span>
            </div>
        </div>
    </div>

    <!-- Queue List Section (Copied exactly logic/html) -->
    <div class="bg-neutral-900/50 backdrop-blur-xl rounded-3xl border border-neutral-800 p-8 shadow-2xl">
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-black text-white tracking-tight flex items-center gap-3">
                <span class="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                </span>
                QUEUE MONITOR
            </h2>
            <span id="queueTotal" class="bg-neutral-800 text-neutral-400 px-3 py-1 rounded-lg text-xs font-bold">0 Active</span>
        </div>

        <div id="queueList" class="space-y-4">
            <!-- Queue items will be injected here -->
            <div class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mb-4 border border-neutral-700/50">
                    <svg class="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
                </div>
                <p class="text-neutral-500 font-medium">Queue is currently empty</p>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    import { showToast } from "{{site.baseurl}}/assets/js/aesthetihawk/shared/toastHandler.js";

    let currentUserEmail = null;

    // Fetch current user email on load
    async function initializeCurrentUser() {
        try {
            const resp = await fetch(`${javaURI}/api/person/get`, fetchOptions);
            if (resp.ok) {
                const user = await resp.json();
                currentUserEmail = user.email;
                console.log("Current user email:", currentUserEmail);
                refreshQueue(); // Refresh after getting email
            } else {
                console.error("Failed to fetch user - status:", resp.status);
                // Try refreshing anyway in case of guest access, though the endpoint might 404
            }
        } catch (err) {
            console.error("Failed to fetch current user:", err);
        }
    }

    async function refreshQueue() {
        if (!currentUserEmail) return; // Wait for initialization
        try {
            const resp = await fetch(`${javaURI}/api/bathroom/queue/${currentUserEmail}`, fetchOptions);
            const data = await resp.json();
            updateQueueUI(data);
        } catch (err) {
            console.error(err);
        }
    }

    function updateQueueUI(data) {
        document.getElementById('currentAway').textContent = data.away;
        document.getElementById('maxCapacity').textContent = data.maxOccupancy;
        
        const list = document.getElementById('queueList');
        const total = document.getElementById('queueTotal');
        const indicator = document.getElementById('statusIndicator');
        const dot = indicator.querySelector('div');
        const statusText = indicator.querySelector('span');

        if (data.away >= data.maxOccupancy) {
            indicator.classList.remove('bg-green-500/10', 'border-green-500/20');
            indicator.classList.add('bg-red-500/10', 'border-red-500/20');
            dot.classList.remove('bg-green-500');
            dot.classList.add('bg-red-500');
            statusText.textContent = "Full";
            statusText.classList.remove('text-green-500');
            statusText.classList.add('text-red-500');
        } else {
            indicator.classList.remove('bg-red-500/10', 'border-red-500/20');
            indicator.classList.add('bg-green-500/10', 'border-green-500/20');
            dot.classList.remove('bg-red-500');
            dot.classList.add('bg-green-500');
            statusText.textContent = "Available";
            statusText.classList.remove('text-red-500');
            statusText.classList.add('text-green-500');
        }

        if (!data.peopleQueue) {
            list.innerHTML = `<p class="text-neutral-500 text-center py-8">Queue is empty</p>`;
            total.textContent = "0 Active";
            return;
        }

        const students = data.peopleQueue.split(',');
        total.textContent = `${students.length} Total`;
        
        list.innerHTML = students.map((s, i) => {
            const isActive = i < data.away;
            return `
                <div class="flex items-center justify-between p-4 rounded-2xl border ${isActive ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-neutral-800/50 border-neutral-800'} transition-all">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full ${isActive ? 'bg-indigo-500' : 'bg-neutral-800'} flex items-center justify-center text-sm font-bold text-white">
                            ${s.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h4 class="font-bold text-white text-sm">${s}</h4>
                            <span class="text-[10px] uppercase tracking-widest ${isActive ? 'text-indigo-400' : 'text-neutral-500'} font-black">
                                ${isActive ? 'Currently Away' : 'Waiting in Line'}
                            </span>
                        </div>
                    </div>
                    ${isActive ? `
                        <button onclick="returnFromBathroom('${s}')" class="p-2 hover:bg-red-500/10 rounded-lg text-neutral-500 hover:text-red-500 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    async function returnFromBathroom(name) {
        try {
            const resp = await fetch(`${javaURI}/api/bathroom/remove`, {
                ...fetchOptions,
                method: 'DELETE',
                body: JSON.stringify({
                    teacherEmail: currentUserEmail,
                    studentName: name
                })
            });
            
            if (resp.ok) {
                showToast({ message: "Welcome back!", duration: 3000 });
                refreshQueue();
            }
        } catch (err) {
            console.error(err);
        }
    }

    window.returnFromBathroom = returnFromBathroom;

    // Initialize logic
    initializeCurrentUser();
    setInterval(refreshQueue, 3000); // Poll more frequently for a dedicated monitor page
</script>
