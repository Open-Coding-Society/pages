---
layout: aesthetihawk
title: Bathroom Pass
permalink: /student/bathroom_pass/v2
active_tab: bathroom_pass
---

<head>
    <script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js"></script>
</head>

<div class="ocs__bathroompass-v2-page">
    <!-- Header Section -->
    <div class="ocs__bathroompass-v2-header">
        <h1 class="ocs__bathroompass-v2-title">
            BATHROOM PASS
        </h1>
    </div>

    <div class="ocs__bathroompass-v2-grid">
        <!-- Main Scanner Section -->
        <div class="ocs__bathroompass-v2-scanner-col">
            <div class="relative ocs__bathroompass-v2-scanner-wrap">
                <!-- Scanner Container -->
                <div class="relative ocs__bathroompass-v2-scanner-frame">
                    <video id="scanVideo" autoplay playsinline></video>
                    <canvas id="scanCanvas" class="hidden"></canvas>

                    <!-- Scanning Overlay -->
                    <div id="scannerOverlay" class="ocs__bathroompass-v2-scanner-overlay">
                        <!-- Corner Accents -->
                        <div class="ocs__bathroompass-v2-scanner-corner top-left"></div>
                        <div class="ocs__bathroompass-v2-scanner-corner top-right"></div>
                        <div class="ocs__bathroompass-v2-scanner-corner bottom-left"></div>
                        <div class="ocs__bathroompass-v2-scanner-corner bottom-right"></div>

                        <!-- Scanning Line -->
                        <div id="scanLine" class="hidden ocs__bathroompass-v2-scan-line"></div>
                    </div>

                    <!-- Idle Overlay -->
                    <div id="idleOverlay" class="ocs__bathroompass-v2-overlay">
                        <div class="ocs__bathroompass-v2-overlay-icon">
                            <svg class="ocs__btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                        </div>
                        <h2 class="ocs__bathroompass-v2-overlay-title">Ready to Scan</h2>
                        <p class="ocs__text ocs__bathroompass-v2-overlay-desc">Position yourself clearly in front of the camera for identification.</p>
                        <button id="initScannerBtn" class="ocs__btn accent fill medium ocs__bathroompass-v2-overlay-btn">
                            <span>Initialize Scanner</span>
                            <svg class="ocs__btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </button>
                    </div>

                    <!-- Cooldown Overlay -->
                    <div id="cooldownOverlay" class="hidden ocs__bathroompass-v2-overlay">
                        <div class="ocs__bathroompass-v2-overlay-icon ocs__bathroompass-v2-overlay-icon--warn">
                            <svg class="ocs__btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 class="ocs__bathroompass-v2-overlay-title">Scanner Cooldown</h2>
                        <p class="ocs__text ocs__bathroompass-v2-overlay-desc">Ready in <span id="cooldownTimer" class="ocs__bathroompass-v2-cooldown-timer">5</span> seconds...</p>
                    </div>

                    <!-- Identification Overlay -->
                    <div id="idOverlay" class="hidden ocs__bathroompass-v2-id-card">
                        <div class="ocs__bathroompass-v2-id-card-row">
                            <div class="ocs__bathroompass-v2-id-avatar">
                                <span id="idInitials">??</span>
                            </div>
                            <div>
                                <span class="ocs__bathroompass-v2-id-eyebrow">Identified User</span>
                                <h3 id="idName" class="ocs__bathroompass-v2-id-name">Loading...</h3>
                            </div>
                        </div>
                        <div class="ocs__links">
                            <button id="confirmIdBtn" class="ocs__btn accent fill medium ocs__bathroompass-v2-flex-btn">Confirm</button>
                            <button id="notMeBtn" class="ocs__btn medium ocs__bathroompass-v2-flex-btn">Not Me</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar Queue Section -->
        <div class="ocs__bathroompass-v2-queue-col">
            <div class="ocs__card ocs__bathroompass-v2-queue-card">
                <div class="ocs__card-header">
                    <h2 class="ocs__bathroompass-v2-queue-title">
                        <span class="ocs__bathroompass-v2-queue-icon">
                            <svg class="ocs__btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                        </span>
                        QUEUE MONITOR
                    </h2>
                    <span id="queueTotal" class="ocs__bathroompass-v2-badge">0 Active</span>
                </div>

                <div id="queueList" class="ocs__bathroompass-v2-column">
                    <!-- Queue items will be injected here -->
                    <div class="ocs__bathroompass-v2-empty-state">
                        <div class="ocs__bathroompass-v2-empty-icon">
                            <svg class="ocs__btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
                        </div>
                        <p class="ocs__text">Queue is currently empty</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- BOTTOM ROW: Controls and Manual Override -->
        <div class="ocs__bathroompass-v2-bottom-row">
            <!-- Matching Threshold -->
            <div class="ocs__card">
                <div class="ocs__card-header">
                    <h3 class="ocs__bathroompass-v2-card-title">Matching Threshold</h3>
                    <span id="thresholdValue" class="ocs__bathroompass-v2-threshold-value">0.40</span>
                </div>
                <input type="range" id="thresholdLimit" min="0.1" max="0.9" step="0.01" value="0.40"
                       class="ocs__bathroompass-v2-full-width"
                       oninput="document.getElementById('thresholdValue').textContent = this.value">
                <p class="ocs__text ocs__bathroompass-v2-fineprint">Lower = Stricter, Higher = More Lenient</p>
            </div>

            <!-- Class Bell Auto-Clear -->
            <div class="ocs__card">
                <h3 class="ocs__bathroompass-v2-card-title ocs__bathroompass-v2-card-title-row">
                    <span>🔔</span>
                    Class Bell Auto-Clear
                    <span id="bellStatus" class="ocs__bathroompass-v2-bell-status">Off</span>
                </h3>
                <p class="ocs__text ocs__bathroompass-v2-fineprint">Listens for an 800 Hz school bell for ~400ms and clears the entire queue automatically.</p>
                <button id="bellToggleBtn" class="ocs__btn accent fill medium">
                    Enable Bell Detection
                </button>
            </div>

            <!-- Manual Override -->
            <div class="ocs__card">
                <h3 class="ocs__bathroompass-v2-card-title ocs__bathroompass-v2-card-title-row">
                    <svg class="ocs__btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    Manual Override
                </h3>
                <div class="relative">
                    <div class="ocs__bathroompass-v2-override-row">
                        <input type="text" id="emergencyName" placeholder="Enter student name manually..."
                               class="ocs__input ocs__bathroompass-v2-override-input"
                               autocomplete="off">
                        <div class="ocs__links">
                            <button id="emergencyCheckInBtn" class="ocs__btn accent fill medium">
                                Check In
                            </button>
                            <button id="emergencyCheckOutBtn" class="ocs__btn medium">
                                Check Out
                            </button>
                        </div>
                    </div>
                    <!-- Suggestions Dropdown -->
                    <div id="emergencySuggestions" class="hidden ocs__bathroompass-v2-suggestions">
                        <!-- Results will be injected here -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    import { showToast } from "{{site.baseurl}}/assets/js/aesthetihawk/shared/toastHandler.js";

    let currentUserEmail = null;
    let scanStream = null;
    let identifiedPerson = null;
    let isProcessing = false;
    let faceMatcher = null;
    let isFaceApiLoaded = false;
    let cooldownRemaining = 0;
    let cooldownInterval = null;
    let searchTimeout = null;

    async function searchPeople() {
        const input = document.getElementById('emergencyName');
        const query = input.value.trim();
        const suggestionsBox = document.getElementById('emergencySuggestions');

        if (query.length < 2) {
            suggestionsBox.classList.add('hidden');
            return;
        }

        try {
            const resp = await fetch(`${javaURI}/api/people/search?query=${encodeURIComponent(query)}`, fetchOptions);
            if (resp.ok) {
                const results = await resp.json();
                if (results.length > 0) {
                    suggestionsBox.innerHTML = results.map(person => `
                        <div class="px-6 py-3 hover:bg-indigo-500/10 cursor-pointer border-b border-neutral-800 last:border-0 group select-none"
                             onclick="selectPerson('${person.name}', '${person.uid}')">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-white font-medium group-hover:text-indigo-400 transition-colors">${person.name}</p>
                                    <p class="text-xs text-neutral-500">@${person.uid}</p>
                                </div>
                                <svg class="w-4 h-4 text-neutral-600 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                            </div>
                        </div>
                    `).join('');
                    suggestionsBox.classList.remove('hidden');
                } else {
                    suggestionsBox.classList.add('hidden');
                }
            }
        } catch (err) {
            console.error("Search failed:", err);
        }
    }

    function selectPerson(name, uid) {
        const input = document.getElementById('emergencyName');
        // Preferring name as it's more human readable, but the backend search also checks UID
        input.value = name; 
        document.getElementById('emergencySuggestions').classList.add('hidden');
    }

    function handleEmergencyInput() {
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(searchPeople, 300);
    }

    async function loadFaceData() {
        showToast({ message: "Loading Face AI models...", duration: 3000 });
        
        try {
            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);
            
            showToast({ message: "Fetching student face data...", duration: 2000 });
            const resp = await fetch(`${javaURI}/api/face/faces`, fetchOptions);
            
            if (resp.status === 403 || resp.status === 401) {
                showToast({ message: "Access denied: Only teachers/admins can use the scanner. Please log in with the correct role.", style: { background: "#ef4444" }, duration: 7000 });
                return;
            }
            
            if (!resp.ok) {
                showToast({ message: `Failed to fetch face data (HTTP ${resp.status}). Is the backend running?`, style: { background: "#ef4444" }, duration: 5000 });
                return;
            }
            
            const faces = await resp.json();
            
            if (!Array.isArray(faces)) {
                showToast({ message: "Unexpected response from server. Check backend logs.", style: { background: "#ef4444" }, duration: 5000 });
                console.error("Expected array from /api/face/faces, got:", faces);
                return;
            }
            
            console.log(`Fetched ${faces.length} faces from backend:`, faces);
            
            const labeledDescriptors = [];
            for (const face of faces) {
                if (!face.faceData) continue;
                try {
                    const img = new Image();
                    img.src = `data:image/jpeg;base64,${face.faceData}`;
                    await new Promise((resolve) => { img.onload = resolve; });
                    
                    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                    if (detection) {
                        const label = String(face.name || face.uid || "Unknown");
                        console.log(`Processing face for: ${label}`);
                        labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, [detection.descriptor]));
                    } else {
                        console.warn(`No face detected in stored image for: ${face.name || face.uid}`);
                    }
                } catch(e) {
                    console.error("Failed to process face for", face.name, e);
                }
            }
            
            if (labeledDescriptors.length === 0) {
                if (faces.length === 0) {
                    showToast({ message: "No faces have been registered yet. Students must register their face first.", style: { background: "#f59e0b" }, duration: 7000 });
                } else {
                    showToast({ message: "Faces were fetched but none could be processed. Check image quality of stored data.", style: { background: "#ef4444" }, duration: 5000 });
                }
            } else {
                 faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
                 isFaceApiLoaded = true;
                 showToast({ message: `Scanner Ready! (${labeledDescriptors.length} faces loaded)`, duration: 3000 });
            }
        } catch (err) {
             console.error("Failed to initialize FaceAPI", err);
             showToast({ message: "Face scanner initialization failed.", duration: 5000, style: { background: "#ef4444" } });
        }
    }

    // Fetch current user email on load
    async function initializeCurrentUser() {
        try {
            const resp = await fetch(`${javaURI}/api/person/get`, fetchOptions);
            if (resp.ok) {
                const user = await resp.json();
                currentUserEmail = user.email;
                console.log("Current user email:", currentUserEmail);
            } else {
                console.error("Failed to fetch user - status:", resp.status);
                showToast({ 
                    message: "Failed to load user info. Make sure you're logged in.", 
                    duration: 5000,
                    style: { background: "#ef4444" }
                });
            }
        } catch (err) {
            console.error("Failed to fetch current user:", err);
            showToast({ 
                message: "Connection error. Check your network.", 
                duration: 5000,
                style: { background: "#ef4444" }
            });
        }
    }

    async function startScanning() {
        const video = document.getElementById('scanVideo');
        const idle = document.getElementById('idleOverlay');
        const scanLine = document.getElementById('scanLine');
        
        try {
            scanStream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = scanStream;
            idle.classList.add('opacity-0', 'pointer-events-none');
            scanLine.classList.remove('hidden');
            startIdentificationLoop();
        } catch (err) {
            console.error(err);
            showToast({ message: "Camera access denied", duration: 3000 });
        }
    }

    async function startIdentificationLoop() {
        if (!scanStream || !isFaceApiLoaded || identifiedPerson) {
             if (!isFaceApiLoaded && scanStream && !identifiedPerson) {
                 setTimeout(startIdentificationLoop, 1000);
             }
             return;
        }
        if (isProcessing) return;
        
        isProcessing = true;
        const video = document.getElementById('scanVideo');
        const threshold = parseFloat(document.getElementById('thresholdLimit').value);
        
        try {
            if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
                const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
                
                if (detection) {
                    const match = faceMatcher.findBestMatch(detection.descriptor);
                    if (match.label !== 'unknown' && match.distance <= threshold) {
                        showIdentification(match.label);
                        isProcessing = false;
                        return; // Wait for user action
                    }
                }
            }
        } catch (err) {
            console.error("Identification loop error:", err);
        }
        
        isProcessing = false;
        setTimeout(startIdentificationLoop, 500);
    }

    function showIdentification(name) {
        identifiedPerson = name;
        document.getElementById('idName').textContent = name;
        document.getElementById('idInitials').textContent = name.substring(0, 2).toUpperCase();
        document.getElementById('idOverlay').classList.remove('hidden');
        document.getElementById('scanLine').classList.add('hidden');
    }

    function resetId() {
        identifiedPerson = null;
        document.getElementById('idOverlay').classList.add('hidden');
        startCooldown();
    }

    function startCooldown() {
        if (cooldownInterval) clearInterval(cooldownInterval);
        cooldownRemaining = 5;
        const overlay = document.getElementById('cooldownOverlay');
        const timerText = document.getElementById('cooldownTimer');
        const scanLine = document.getElementById('scanLine');
        
        if (!overlay || !timerText) return;
        
        overlay.classList.remove('hidden');
        scanLine.classList.add('hidden');
        timerText.textContent = cooldownRemaining;
        
        const interval = setInterval(() => {
            cooldownRemaining--;
            if (cooldownRemaining <= 0) {
                clearInterval(interval);
                cooldownInterval = null;
                overlay.classList.add('hidden');
                scanLine.classList.remove('hidden');
                startIdentificationLoop();
            } else {
                timerText.textContent = cooldownRemaining;
            }
        }, 1000);
    }

    async function confirmIdentity() {
        if (!identifiedPerson) return;
        
        console.log("Confirming identity for:", identifiedPerson);
        const queueUrl = `${javaURI}/api/bathroom/add`;
        
        try {
            const resp = await fetch(queueUrl, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({
                    teacherEmail: currentUserEmail,
                    studentName: identifiedPerson
                })
            });
            
            if (resp.ok) {
                showToast({ message: "Successfully added to queue!", duration: 3000 });
                resetId();
                refreshQueue();
            } else {
                const data = await resp.json();
                console.error("Queue add failed:", data);
                showToast({ 
                    message: `Error: ${data.message || 'Could not add to queue'}`, 
                    duration: 5000,
                    style: { background: "#ef4444" }
                });
            }
        } catch (err) {
            console.error("Confirm error:", err);
            showToast({ 
                message: "Network error. Is the Spring backend running?", 
                duration: 5000,
                style: { background: "#ef4444" }
            });
        }
    }

    async function refreshQueue() {
        if (!currentUserEmail) return;
        try {
            const resp = await fetch(`${javaURI}/api/bathroom/queue/${currentUserEmail}`, fetchOptions);
            const data = await resp.json();
            updateQueueUI(data);
        } catch (err) {
            console.error(err);
        }
    }

    function updateQueueUI(data) {
        const list = document.getElementById('queueList');
        const total = document.getElementById('queueTotal');

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

    async function emergencyCheckIn() {
        const nameInput = document.getElementById('emergencyName');
        const name = nameInput.value.trim();
        
        if (!name) {
            showToast({ message: "Please enter a name", duration: 3000 });
            return;
        }

        const queueUrl = `${javaURI}/api/bathroom/add`;
        try {
            const resp = await fetch(queueUrl, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({
                    teacherEmail: currentUserEmail,
                    studentName: name
                })
            });
            
            if (resp.ok) {
                showToast({ message: `Checked in: ${name}`, duration: 3000 });
                nameInput.value = '';
                refreshQueue();
            } else {
                const data = await resp.json();
                showToast({ message: `Error: ${data.message || 'Check-in failed'}`, duration: 5000, style: { background: "#ef4444" }});
            }
        } catch (err) {
            showToast({ message: "Server connection failed", duration: 5000, style: { background: "#ef4444" }});
        }
    }

    async function emergencyCheckOut() {
        const nameInput = document.getElementById('emergencyName');
        const name = nameInput.value.trim();
        
        if (!name) {
            showToast({ message: "Please enter a name", duration: 3000 });
            return;
        }

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
                showToast({ message: `Checked out: ${name}`, duration: 3000 });
                nameInput.value = '';
                refreshQueue();
            } else {
                const data = await resp.json();
                showToast({ message: `Error: ${data.message || 'Check-out failed'}`, duration: 5000, style: { background: "#ef4444" }});
            }
        } catch (err) {
            showToast({ message: "Server connection failed", duration: 5000, style: { background: "#ef4444" }});
        }
    }

    // Clear the entire queue (called by bell detection on class-bell)
    async function clearEntireQueue() {
        if (!currentUserEmail) return;
        try {
            const resp = await fetch(`${javaURI}/api/bathroom/queue/${currentUserEmail}`, fetchOptions);
            if (!resp.ok) return;
            const data = await resp.json();
            if (!data.peopleQueue) return;
            const students = data.peopleQueue.split(',').map(s => s.trim()).filter(Boolean);
            for (const name of students) {
                await fetch(`${javaURI}/api/bathroom/remove`, {
                    ...fetchOptions,
                    method: 'DELETE',
                    body: JSON.stringify({ teacherEmail: currentUserEmail, studentName: name })
                });
            }
            refreshQueue();
        } catch (err) {
            console.error('Error clearing queue on bell:', err);
        }
    }

    // Bell detection: listen for an 800 Hz tone (±30 Hz) sustained for 400 ms,
    // then automatically clear the entire queue.
    const bellToggleBtn = document.getElementById('bellToggleBtn');
    const bellStatusEl = document.getElementById('bellStatus');
    let bellAudioCtx = null;
    let bellStream = null;
    let bellAnalyser = null;
    let bellRafId = null;
    let bellStartedAt = null;
    let bellCooldownUntil = 0;

    function setBellStatus(text) {
        if (bellStatusEl) bellStatusEl.textContent = text;
    }

    async function startBellDetection() {
        try {
            bellStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
            console.error('Mic permission denied or unavailable:', err);
            setBellStatus('Mic unavailable');
            showToast({ message: 'Microphone access denied', duration: 4000, style: { background: '#ef4444' } });
            return false;
        }

        bellAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = bellAudioCtx.createMediaStreamSource(bellStream);
        bellAnalyser = bellAudioCtx.createAnalyser();
        bellAnalyser.fftSize = 4096;
        bellAnalyser.smoothingTimeConstant = 0.3;
        source.connect(bellAnalyser);

        const freqData = new Uint8Array(bellAnalyser.frequencyBinCount);
        const binHz = bellAudioCtx.sampleRate / bellAnalyser.fftSize;
        const loBin = Math.max(0, Math.floor(770 / binHz));
        const hiBin = Math.min(freqData.length - 1, Math.ceil(830 / binHz));

        bellStartedAt = null;
        setBellStatus('Listening…');

        const tick = async () => {
            if (!bellAnalyser) return;
            bellAnalyser.getByteFrequencyData(freqData);

            let bellPeak = 0;
            for (let i = loBin; i <= hiBin; i++) {
                if (freqData[i] > bellPeak) bellPeak = freqData[i];
            }

            let sum = 0;
            let count = 0;
            for (let i = 0; i < freqData.length; i++) {
                if (i < loBin || i > hiBin) {
                    sum += freqData[i];
                    count++;
                }
            }
            const otherAvg = count > 0 ? sum / count : 0;

            const present = bellPeak > 180 && bellPeak > otherAvg * 2;
            const now = performance.now();

            if (present) {
                if (bellStartedAt === null) bellStartedAt = now;
                if (now - bellStartedAt >= 400 && now > bellCooldownUntil) {
                    bellCooldownUntil = now + 5000;
                    bellStartedAt = null;
                    setBellStatus('Bell detected! Clearing…');
                    try {
                        await clearEntireQueue();
                    } catch (err) {
                        console.error('Error clearing queue on bell:', err);
                    }
                    if (bellAnalyser) setBellStatus('Listening…');
                }
            } else {
                bellStartedAt = null;
            }

            bellRafId = requestAnimationFrame(tick);
        };

        bellRafId = requestAnimationFrame(tick);
        return true;
    }

    function stopBellDetection() {
        if (bellRafId) cancelAnimationFrame(bellRafId);
        bellRafId = null;
        bellAnalyser = null;
        if (bellStream) {
            bellStream.getTracks().forEach(t => t.stop());
            bellStream = null;
        }
        if (bellAudioCtx) {
            bellAudioCtx.close().catch(() => {});
            bellAudioCtx = null;
        }
        bellStartedAt = null;
        setBellStatus('Off');
    }

    bellToggleBtn?.addEventListener('click', async () => {
        if (bellAnalyser) {
            stopBellDetection();
            bellToggleBtn.textContent = 'Enable Bell Detection';
        } else {
            bellToggleBtn.textContent = 'Starting…';
            const ok = await startBellDetection();
            bellToggleBtn.textContent = ok ? 'Disable Bell Detection' : 'Enable Bell Detection';
        }
    });

    // Export to window
    window.startScanning = startScanning;
    window.confirmIdentity = confirmIdentity;
    window.resetId = resetId;
    window.returnFromBathroom = returnFromBathroom;
    window.emergencyCheckIn = emergencyCheckIn;
    window.emergencyCheckOut = emergencyCheckOut;
    window.selectPerson = selectPerson;

    // Attach event listeners to buttons
    document.getElementById('initScannerBtn')?.addEventListener('click', startScanning);
    document.getElementById('confirmIdBtn')?.addEventListener('click', confirmIdentity);
    document.getElementById('notMeBtn')?.addEventListener('click', resetId);
    document.getElementById('emergencyCheckInBtn')?.addEventListener('click', emergencyCheckIn);
    document.getElementById('emergencyCheckOutBtn')?.addEventListener('click', emergencyCheckOut);
    document.getElementById('emergencyName')?.addEventListener('input', handleEmergencyInput);
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
            document.getElementById('emergencySuggestions')?.classList.add('hidden');
        }
    });

    // Auto-reload at midnight to fetch new facial registrations
    function scheduleMidnightReload() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        const msUntilMidnight = tomorrow.getTime() - now.getTime();
        
        setTimeout(() => {
            window.location.reload(true);
        }, msUntilMidnight);
    }

    // Polling for queue updates
    initializeCurrentUser();
    setInterval(refreshQueue, 5000);
    scheduleMidnightReload();

    document.addEventListener('DOMContentLoaded', () => {
        refreshQueue();
        loadFaceData();
    });
</script>
