---
layout: aesthetihawk
title: Bathroom Scanner
permalink: /bathroom-scanner
---

<div class="max-w-6xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-white">Bathroom Scanner System</h1>
        <button id="manualRefreshBtn" class="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors border border-neutral-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh Queue
        </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Scanner Section -->
        <div class="bg-neutral-800 rounded-xl shadow-lg p-6 border border-neutral-700">
            <h2 class="text-xl font-semibold mb-4 text-indigo-400">Scanner</h2>
            <div id="scannerContainer" class="relative w-full bg-black rounded-lg overflow-hidden border-2 border-neutral-700 mb-6" style="aspect-ratio: 4/3;">
                <video id="scanVideo" class="w-full h-full object-cover" autoplay playsinline></video>
                <canvas id="scanCanvas" class="hidden"></canvas>
                <div id="scanOverlay" class="absolute inset-0 border-2 border-dashed border-indigo-500/50 pointer-events-none rounded-full" style="top: 10%; bottom: 10%; left: 15%; right: 15%;"></div>
                
                <!-- Identification Overlay -->
                <div id="idOverlay" class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center hidden z-20">
                    <div class="bg-neutral-800 p-8 rounded-2xl border-2 border-indigo-500 shadow-2xl text-center max-w-sm">
                        <div id="idStatus" class="text-2xl font-bold mb-2">Identified!</div>
                        <div id="idName" class="text-xl text-gray-300 mb-6">Student Name</div>
                        <div class="flex gap-4">
                            <button id="confirmBtn" class="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all transform hover:scale-105">Confirm</button>
                            <button id="cancelBtn" class="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all transform hover:scale-105">Not Me</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <button id="toggleScanBtn" class="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg">
                    Start Scanning
                </button>
                <div id="scanStatusMsg" class="text-center text-sm text-gray-400">Camera is off.</div>
            </div>
        </div>

        <!-- Queue Section -->
        <div class="space-y-6">
            <!-- In Bathroom -->
            <div class="bg-neutral-800 rounded-xl shadow-lg p-6 border border-emerald-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold text-emerald-400">In Bathroom</h2>
                    <span id="activeCount" class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">0</span>
                </div>
                <div id="activeList" class="space-y-3">
                    <div class="text-gray-500 text-center py-4 italic">Empty</div>
                </div>
            </div>

            <!-- Waiting Queue -->
            <div class="bg-neutral-800 rounded-xl shadow-lg p-6 border border-amber-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold text-amber-400">Waiting Queue</h2>
                    <span id="waitingCount" class="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold">0</span>
                </div>
                <div id="waitingList" class="space-y-3">
                    <div class="text-gray-500 text-center py-4 italic">Empty</div>
                </div>
            </div>

            <!-- Teacher Controls -->
            <div class="bg-neutral-900/50 rounded-xl p-6 border border-neutral-700">
                <h2 class="text-lg font-semibold mb-4 text-gray-300">Queue Settings</h2>
                <div class="flex items-center gap-4">
                    <label class="text-sm text-gray-400">Bathroom Capacity:</label>
                    <input type="number" id="capacityInput" value="1" min="1" class="w-16 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-white">
                    <button id="updateCapacityBtn" class="px-4 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-sm transition-colors border border-indigo-400/30">Update</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // --- Services ---

    const CameraService = {
        stream: null,
        async start(videoElement) {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            videoElement.srcObject = this.stream;
            return this.stream;
        },
        stop(videoElement) {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                videoElement.srcObject = null;
                this.stream = null;
            }
        },
        captureBase64(videoElement, canvasElement) {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            const ctx = canvasElement.getContext('2d');
            ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
            return canvasElement.toDataURL('image/jpeg', 0.6).split(',')[1];
        }
    };

    const RecognitionService = {
        async identify(base64Image) {
            const resp = await fetch(`${pythonURI}/api/face/identify`, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({ image: base64Image })
            });
            return resp.ok ? await resp.json() : null;
        }
    };

    const QueueService = {
        async getActive() {
            const resp = await fetch(`${javaURI}/api/bathroom/active`, fetchOptions);
            return resp.ok ? await resp.json() : [];
        },
        async getWaiting() {
            const resp = await fetch(`${javaURI}/api/bathroom/queue`, fetchOptions);
            return resp.ok ? await resp.json() : [];
        },
        async enqueue(uid) {
            return await fetch(`${javaURI}/api/bathroom/enqueue/${uid}`, { ...fetchOptions, method: 'POST' });
        },
        async checkout(uid) {
            return await fetch(`${javaURI}/api/bathroom/checkout/${uid}`, { ...fetchOptions, method: 'POST' });
        },
        async remove(id) {
            return await fetch(`${javaURI}/api/bathroom/remove/${id}`, { ...fetchOptions, method: 'DELETE' });
        },
        async updateStatus(id, status) {
            return await fetch(`${javaURI}/api/bathroom/status/${id}`, {
                ...fetchOptions,
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
        },
        async setCapacity(capacity) {
            return await fetch(`${javaURI}/api/bathroom/capacity/${capacity}`, { ...fetchOptions, method: 'POST' });
        }
    };

    // --- UI Controller (Orchestrator) ---

    const UIController = {
        isScanning: false,
        scanInterval: null,
        identifiedUid: null,

        elements: {
            video: document.getElementById('scanVideo'),
            canvas: document.getElementById('scanCanvas'),
            toggleBtn: document.getElementById('toggleScanBtn'),
            statusMsg: document.getElementById('scanStatusMsg'),
            idOverlay: document.getElementById('idOverlay'),
            idName: document.getElementById('idName'),
            confirmBtn: document.getElementById('confirmBtn'),
            cancelBtn: document.getElementById('cancelBtn'),
            refreshBtn: document.getElementById('manualRefreshBtn'),
            activeList: document.getElementById('activeList'),
            waitingList: document.getElementById('waitingList'),
            activeCount: document.getElementById('activeCount'),
            waitingCount: document.getElementById('waitingCount'),
            capacityInput: document.getElementById('capacityInput'),
            updateCapacityBtn: document.getElementById('updateCapacityBtn')
        },

        init() {
            this.setupEventListeners();
            this.updateDisplay();
            setInterval(() => this.updateDisplay(), 10000);
        },

        setupEventListeners() {
            this.elements.toggleBtn.addEventListener('click', () => this.toggleScanner());
            this.elements.confirmBtn.addEventListener('click', () => this.confirmIdentification());
            this.elements.cancelBtn.addEventListener('click', () => this.hideOverlay());
            this.elements.refreshBtn.addEventListener('click', () => this.manualRefresh());
            this.elements.updateCapacityBtn.addEventListener('click', () => this.handleCapacityUpdate());
            
            // Global actions for dynamic rows
            window.checkout = (uid) => this.handleCheckout(uid);
            window.removeEntry = (id) => this.handleRemove(id);
            window.manualStatusUpdate = (id, status) => this.handleStatusUpdate(id, status);
        },

        async toggleScanner() {
            if (this.isScanning) {
                CameraService.stop(this.elements.video);
                clearInterval(this.scanInterval);
                this.isScanning = false;
                this.updateScannerUI('Start Scanning', 'bg-indigo-500', 'Scanner stopped.');
            } else {
                try {
                    await CameraService.start(this.elements.video);
                    this.isScanning = true;
                    this.updateScannerUI('Stop Scanning', 'bg-red-500', 'Scanning...');
                    this.startScanningLoop();
                } catch (e) {
                    this.elements.statusMsg.textContent = "Error: Camera access required.";
                }
            }
        },

        updateScannerUI(text, bgColor, msg) {
            this.elements.toggleBtn.textContent = text;
            this.elements.toggleBtn.className = `w-full py-4 ${bgColor} text-white rounded-xl font-bold text-lg transition-all shadow-lg`;
            this.elements.statusMsg.textContent = msg;
        },

        startScanningLoop() {
            this.scanInterval = setInterval(async () => {
                if (!this.isScanning || !this.elements.idOverlay.classList.contains('hidden')) return;
                
                const base64 = CameraService.captureBase64(this.elements.video, this.elements.canvas);
                const result = await RecognitionService.identify(base64);
                
                if (result && result.match && result.distance < 0.4) {
                    this.showOverlay(result.name);
                }
            }, 1000);
        },

        showOverlay(uid) {
            this.identifiedUid = uid;
            this.elements.idName.textContent = uid;
            this.elements.idOverlay.classList.remove('hidden');
            this.elements.statusMsg.textContent = "Person detected!";
        },

        hideOverlay() {
            this.elements.idOverlay.classList.add('hidden');
            if (this.isScanning) this.elements.statusMsg.textContent = "Scanning...";
        },

        async confirmIdentification() {
            this.elements.idOverlay.classList.add('hidden');
            this.elements.statusMsg.textContent = "Registering...";
            
            const resp = await QueueService.enqueue(this.identifiedUid);
            if (resp.ok) {
                this.elements.statusMsg.textContent = "Successfully added to queue.";
                this.updateDisplay();
            } else {
                this.elements.statusMsg.textContent = "Error: " + await resp.text();
            }
            setTimeout(() => this.hideOverlay(), 2000);
        },

        async manualRefresh() {
            this.elements.refreshBtn.classList.add('animate-spin');
            await this.updateDisplay();
            setTimeout(() => this.elements.refreshBtn.classList.remove('animate-spin'), 500);
        },

        async handleCapacityUpdate() {
            const cap = this.elements.capacityInput.value;
            const resp = await QueueService.setCapacity(cap);
            if (resp.ok) this.updateDisplay();
        },

        async handleCheckout(uid) {
            const resp = await QueueService.checkout(uid);
            if (resp.ok) this.updateDisplay();
        },

        async handleRemove(id) {
            if (!confirm("Remove student from queue?")) return;
            const resp = await QueueService.remove(id);
            if (resp.ok) this.updateDisplay();
        },

        async handleStatusUpdate(id, status) {
            const msg = status === 'IN_BATHROOM' ? "Force start session?" : "Force end session?";
            if (!confirm(msg)) return;
            const resp = await QueueService.updateStatus(id, status);
            if (resp.ok) this.updateDisplay();
        },

        async updateDisplay() {
            const [active, waiting] = await Promise.all([
                QueueService.getActive(),
                QueueService.getWaiting()
            ]);
            
            this.renderCollection(this.elements.activeList, active, 'emerald', true);
            this.renderCollection(this.elements.waitingList, waiting, 'amber', false);
            
            this.elements.activeCount.textContent = active.length;
            this.elements.waitingCount.textContent = waiting.length;
        },

        renderCollection(container, data, color, isActive) {
            if (data.length === 0) {
                container.innerHTML = '<div class="text-gray-500 text-center py-4 italic">Empty</div>';
                return;
            }

            container.innerHTML = data.map(entry => `
                <div class="flex flex-col p-4 bg-neutral-900 border-l-4 border-${color}-500 rounded-r-lg shadow-sm">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-bold text-gray-300 border border-neutral-700">
                                ${entry.person.name.charAt(0)}
                            </div>
                            <div>
                                <div class="font-bold text-gray-200">${entry.person.name}</div>
                                <div class="text-xs text-gray-500">${isActive ? 'Started: ' : 'Wait: '}${new Date(isActive ? entry.startTime : entry.entryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            </div>
                        </div>
                        <div class="flex gap-1">
                            <button onclick="removeEntry(${entry.id})" title="Emergency Delete" class="p-1 text-gray-500 hover:text-red-400 transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        ${isActive ? `
                            <button onclick="checkout('${entry.person.uid}')" class="flex-1 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded transiton-colors border border-emerald-500/30">Standard Checkout</button>
                            <button onclick="manualStatusUpdate(${entry.id}, 'COMPLETED')" class="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-gray-400 text-[10px] rounded border border-neutral-700">Force End</button>
                        ` : `
                            <button onclick="manualStatusUpdate(${entry.id}, 'IN_BATHROOM')" class="flex-1 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded transiton-colors border border-amber-500/30">Force Start</button>
                        `}
                    </div>
                </div>
            `).join('');
        }
    };

    document.addEventListener('DOMContentLoaded', () => UIController.init());
</script>

<style>
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>
