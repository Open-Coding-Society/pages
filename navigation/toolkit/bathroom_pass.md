---
layout: aesthetihawk
title: Bathroom Pass
permalink: /student/bathroom_pass
---

<head>
    <script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js"></script>
</head>

<div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
            <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight mb-2">
                BATHROOM PASS
            </h1>
        </div>
        
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Main Scanner Section -->
        <div class="lg:col-span-7">
            <div class="relative group">
                <!-- Scanner Container -->
                <div class="relative aspect-video bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl transition-all duration-500 group-hover:border-indigo-500/30">
                    <video id="scanVideo" class="w-full h-full object-cover" autoplay playsinline></video>
                    <canvas id="scanCanvas" class="hidden"></canvas>
                    
                    <!-- Scanning Overlay -->
                    <div id="scannerOverlay" class="absolute inset-0 pointer-events-none">
                        <!-- Corner Accents -->
                        <div class="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg"></div>
                        <div class="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg"></div>
                        <div class="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg"></div>
                        <div class="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-indigo-500 rounded-br-lg"></div>
                        
                        <!-- Scanning Line -->
                        <div id="scanLine" class="hidden absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_rgba(99,102,241,0.5)] z-10"></div>
                    </div>

                    <!-- Idle Overlay -->
                    <div id="idleOverlay" class="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 transition-opacity duration-500">
                        <div class="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
                            <svg class="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-white mb-2">Ready to Scan</h2>
                        <p class="text-neutral-400 text-center max-w-xs mb-8">Position yourself clearly in front of the camera for identification.</p>
                        <button id="initScannerBtn" class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-3">
                            <span>Initialize Scanner</span>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </button>
                    </div>

                    <!-- Identification Overlay -->
                    <div id="idOverlay" class="hidden absolute bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-xl border border-neutral-700 p-6 rounded-3xl shadow-2xl min-w-[300px]">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                <span id="idInitials" class="text-lg font-bold text-indigo-400">??</span>
                            </div>
                            <div>
                                <span class="text-[10px] uppercase tracking-widest text-neutral-500 font-black">Identified User</span>
                                <h3 id="idName" class="text-lg font-bold text-white">Loading...</h3>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button id="confirmIdBtn" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all">Confirm</button>
                            <button id="notMeBtn" class="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold text-sm transition-all">Not Me</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar Queue Section -->
        <div class="lg:col-span-5">
            <div class="bg-neutral-900/50 backdrop-blur-xl rounded-3xl border border-neutral-800 p-8 h-full shadow-2xl">
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

        <!-- BOTTOM ROW: Controls and Manual Override -->
        <div class="lg:col-span-12 space-y-8 mt-4">
            <!-- Matching Threshold -->
            <div class="bg-neutral-900/50 p-6 rounded-3xl border border-neutral-800 shadow-2xl">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-sm font-black text-white uppercase tracking-widest">Matching Threshold</h3>
                    <span id="thresholdValue" class="text-xs font-bold text-indigo-400">0.40</span>
                </div>
                <input type="range" id="thresholdLimit" min="0.1" max="0.9" step="0.01" value="0.40" 
                       class="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                       oninput="document.getElementById('thresholdValue').textContent = this.value">
                <p class="text-[10px] text-neutral-500 mt-2 italic">Lower = Stricter, Higher = More Lenient</p>
            </div>

            <!-- Manual Override -->
            <div class="bg-neutral-900/50 backdrop-blur-xl p-8 rounded-3xl border border-neutral-800 shadow-2xl">
                <h3 class="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    Manual Override
                </h3>
                <div class="flex flex-col md:flex-row gap-4">
                    <input type="text" id="emergencyName" placeholder="Enter student name manually..." 
                           class="flex-1 bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium">
                    <div class="flex gap-3">
                        <button id="emergencyCheckInBtn" class="flex-1 md:flex-none px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25 uppercase tracking-wider text-xs">
                            Check In
                        </button>
                        <button id="emergencyCheckOutBtn" class="flex-1 md:flex-none px-10 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-bold transition-all border border-neutral-700 uppercase tracking-wider text-xs">
                            Check Out
                        </button>
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
            const resp = await fetch(`${javaURI}/api/person/faces`, fetchOptions);
            const faces = await resp.json();
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
                 showToast({ message: "No registered faces retrieved. Scanner will not work.", style: { background: "#ef4444" }, duration: 5000 });
            } else {
                 faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
                 isFaceApiLoaded = true;
                 showToast({ message: "Scanner Ready!", duration: 3000 });
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
        document.getElementById('scanLine').classList.remove('hidden');
        startIdentificationLoop();
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

    // Export to window
    window.startScanning = startScanning;
    window.confirmIdentity = confirmIdentity;
    window.resetId = resetId;
    window.returnFromBathroom = returnFromBathroom;
    window.emergencyCheckIn = emergencyCheckIn;
    window.emergencyCheckOut = emergencyCheckOut;

    // Attach event listeners to buttons
    document.getElementById('initScannerBtn')?.addEventListener('click', startScanning);
    document.getElementById('confirmIdBtn')?.addEventListener('click', confirmIdentity);
    document.getElementById('notMeBtn')?.addEventListener('click', resetId);
    document.getElementById('emergencyCheckInBtn')?.addEventListener('click', emergencyCheckIn);
    document.getElementById('emergencyCheckOutBtn')?.addEventListener('click', emergencyCheckOut);

    // Polling for queue updates
    initializeCurrentUser();
    setInterval(refreshQueue, 5000);
    document.addEventListener('DOMContentLoaded', () => {
        refreshQueue();
        loadFaceData();
    });
</script>
