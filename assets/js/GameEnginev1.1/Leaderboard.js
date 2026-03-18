/**
 * Leaderboard - Dual-Mode Leaderboard Widget for GameEngine v1.1
 * ================================================================
 * 
 * PURPOSE:
 * Provides a collapsible leaderboard widget with two modes:
 * - Dynamic Mode: Real-time leaderboard from backend (SCORE_COUNTER events)
 * - Elementary Mode: User-managed leaderboard with add/delete capabilities (ELEMENTARY_LEADERBOARD events)
 * 
 * ARCHITECTURE:
 * - Standalone widget that mounts to document.body with fixed positioning
 * - Offline-first design: Works without backend using localStorage fallback
 * - Type selection UI allows switching between Dynamic and Elementary modes
 * - Auto-refresh for Dynamic mode (30-second intervals)
 * 
 * RESPONSIBILITIES:
 * - Mount collapsible leaderboard widget to page
 * - Display top scores in table format with ranking
 * - Fetch and sync leaderboard data from backend or localStorage
 * - Handle user interactions (collapse/expand, mode selection, add/delete scores)
 * - Provide public API for submitting scores programmatically
 * 
 * PUBLIC METHODS:
 * ├─ constructor(gameControl, options)     - Initialize leaderboard with configuration
 * ├─ toggle()                              - Collapse/expand leaderboard display
 * ├─ submitScore(username, score, gameName) - Submit score to SCORE_COUNTER endpoint
 * ├─ destroy()                             - Clean up intervals and remove DOM elements
 * ├─ toggleVisibility()                    - Show/hide entire leaderboard widget
 * └─ isVisible()                           - Check if leaderboard widget is visible
 * 
 * INTERNAL METHODS:
 * ├─ init()                                - Initialize and mount on DOM ready
 * ├─ mount()                               - Create and append leaderboard DOM structure
 * ├─ goBack()                              - Return to type selection screen
 * ├─ showTypeSelection()                   - Display Dynamic vs Elementary choice
 * ├─ setupDynamicMode()                    - Initialize dynamic leaderboard with auto-refresh
 * ├─ setupElementaryMode()                 - Initialize elementary leaderboard with form
 * ├─ showElementaryForm()                  - Display add score form for elementary mode
 * ├─ addElementaryScore()                  - Add new score to elementary leaderboard (uses API chaining)
 * ├─ deleteElementaryScore(id)             - Delete score from elementary leaderboard (uses API chaining)
 * ├─ fetchElementaryLeaderboard()          - Fetch elementary scores from backend or localStorage (uses API chaining)
 * ├─ displayElementaryLeaderboard()        - Render elementary scores table with delete buttons
 * ├─ fetchLeaderboard()                    - Fetch dynamic scores from backend or localStorage (uses API chaining)
 * ├─ displayLeaderboard(data)              - Render dynamic scores table (read-only)
 * └─ escape(str)                           - HTML entity escaping for XSS protection
 * 
 * CONSTRUCTOR OPTIONS:
 * - gameControl: Reference to game control instance (optional)
 * - gameName: Name of the game for filtering scores (default: 'Global')
 * - parentId: Parent element ID for mounting (default: document.body)
 * - initiallyHidden: Whether to hide widget on load (default: true)
 * 
 * BACKEND INTEGRATION:
 * - Endpoint: /api/events/ELEMENTARY_LEADERBOARD (GET/POST/DELETE elementary scores)
 * - Endpoint: /api/events/SCORE_COUNTER (GET/POST dynamic scores)
 * - Uses shared javaURI and fetchOptions from /assets/js/api/config.js
 * - JWT authentication via cookies (handled by fetchOptions)
 * - Graceful fallback to localStorage when backend unavailable
 * 
 * API CHAINING PATTERN:
 * All backend methods use .then()/.catch() chaining for:
 * - Elegant sequential operations (fetch → transform → display)
 * - Centralized error handling with single .catch() block
 * - Clean promise composition without nested try-catch blocks
 * - Authentication error detection (401/403) with user-friendly messages
 * 
 * DATA FLOW (Dynamic Mode):
 * User clicks "Dynamic Leaderboard" → setupDynamicMode()
 *                                   ↓
 * fetchLeaderboard() → fetch(SCORE_COUNTER) → .then(transform) → displayLeaderboard()
 *                   ↓
 * Auto-refresh every 30 seconds
 * 
 * DATA FLOW (Elementary Mode):
 * User clicks "Elementary Leaderboard" → setupElementaryMode()
 *                                      ↓
 * fetchElementaryLeaderboard() → fetch(ELEMENTARY_LEADERBOARD) → .then(transform) → displayElementaryLeaderboard()
 *                              ↓
 * User adds score → addElementaryScore() → fetch(POST) → .then(refresh) → .catch(error)
 *                              ↓
 * User deletes score → deleteElementaryScore(id) → fetch(DELETE) → .then(refresh) → .catch(error)
 * 
 * OFFLINE MODE:
 * - When javaURI is unavailable or fetch fails, uses localStorage as fallback
 * - Storage keys: `elementary_leaderboard_{gameName}` and `score_counter_{gameName}`
 * - Provides full functionality without backend connection
 * 
 * DEPENDENCIES:
 * - /assets/js/api/config.js (provides javaURI and fetchOptions)
 * - Backend API (Java Spring server) - optional, uses localStorage fallback
 * - Browser localStorage for offline mode
 * 
 * USAGE:
 * // Create leaderboard widget
 * const leaderboard = new Leaderboard(gameControl, {
 *     gameName: 'MarioGame',
 *     initiallyHidden: false
 * });
 * 
 * // Submit score programmatically
 * leaderboard.submitScore('PlayerName', 1000, 'MarioGame')
 *     .then(entry => console.log('Score saved:', entry))
 *     .catch(err => console.error('Save failed:', err));
 * 
 * // Toggle visibility
 * leaderboard.toggleVisibility();
 * 
 * // Clean up when done
 * leaderboard.destroy();
 */

import { javaURI, fetchOptions } from '/assets/js/api/config.js';

export default class Leaderboard {
    constructor(gameControl = null, options = {}) {
        this.gameControl = gameControl;
        this.gameName = options.gameName || 'Global';
        this.parentId = options.parentId || null;
        this.isOpen = false;
        this.mounted = false;
        this.mode = null; // 'dynamic' or 'elementary'
        this.showingTypeSelection = true;
        this.elementaryEntries = []; // Store elementary entries locally
        this.initiallyHidden = options.initiallyHidden !== false; // Default to hidden

        // Flag whether a backend URI is available; allow UI to mount even when
        // backend is unreachable so leaderboard can operate in offline/local mode.
        this.hasBackend = Boolean(javaURI);

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.mount());
        } else {
            this.mount();
        }
    }

    mount() {
        if (this.mounted) return;

        // CRITICAL: Always append to body and use fixed positioning
        // This ensures the leaderboard is not affected by game container position changes
        const appendTarget = document.body;
        
        const container = document.createElement('div');
        container.id = 'leaderboard-container';
        
        // CRITICAL: Always use fixed positioning to avoid game container position affecting it
        container.style.position = 'fixed';
        container.style.top = '80px';
        container.style.right = '20px';
        container.style.zIndex = '1000';
        
        // Add the widget class for styling
        container.className = 'leaderboard-widget' + (this.initiallyHidden ? ' initially-hidden' : '');

        container.innerHTML = `
            <div class="leaderboard-header">
                <div>
                    <button id="back-btn" class="back-btn" style="display:none;">← Back</button>
                    <span id="leaderboard-title">Leaderboard</span>
                    <span id="leaderboard-preview"
                          style="font-size:16px;font-weight:700;margin-left:8px;display:none;">Collapse to choose a leaderboard</span>
                </div>
                <button id="toggle-leaderboard" class="toggle-btn">+</button>
            </div>
            <div class="leaderboard-content hidden" id="leaderboard-content">
                <div id="leaderboard-list"></div>
            </div>
        `;

        appendTarget.appendChild(container);
        this.mounted = true;

        document
            .getElementById('toggle-leaderboard')
            .addEventListener('click', () => this.toggle());

        document
            .getElementById('back-btn')
            .addEventListener('click', () => this.goBack());

        this.showTypeSelection();
    }

    toggle() {
        const content = document.getElementById('leaderboard-content');
        const btn = document.getElementById('toggle-leaderboard');
        const preview = document.getElementById('leaderboard-preview');
        const title = document.getElementById('leaderboard-title');

        this.isOpen = !this.isOpen;
        content.classList.toggle('hidden', !this.isOpen);
        btn.textContent = this.isOpen ? '−' : '+';

        if (preview && title) {
            if (this.isOpen) {
                // When open: show title, hide preview
                title.style.display = 'inline';
                preview.style.display = 'none';
            } else {
                // When collapsed: hide title, show preview
                title.style.display = 'none';
                preview.style.display = 'inline';
            }
        }
    }

    goBack() {
        // Clear any intervals
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }

        // Reset state
        this.mode = null;
        this.showingTypeSelection = true;

        // Hide back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) backBtn.style.display = 'none';

        // Reset preview to initial text
        const preview = document.getElementById('leaderboard-preview');
        if (preview) preview.textContent = 'Collapse to choose a leaderboard';

        // Show type selection
        this.showTypeSelection();
    }

    showTypeSelection() {
        const list = document.getElementById('leaderboard-list');
        if (!list) return;

        list.innerHTML = `
            <div class="type-selection">
                <h3>Choose Leaderboard Type</h3>
                <div class="type-buttons">
                    <button class="type-btn" id="dynamic-btn">Dynamic Leaderboard</button>
                    <button class="type-btn" id="elementary-btn">Elementary Leaderboard</button>
                </div>
            </div>
        `;

        document.getElementById('dynamic-btn').addEventListener('click', () => {
            this.mode = 'dynamic';
            this.showingTypeSelection = false;
            this.setupDynamicMode();
        });

        document.getElementById('elementary-btn').addEventListener('click', () => {
            this.mode = 'elementary';
            this.showingTypeSelection = false;
            this.setupElementaryMode();
        });
    }

    setupDynamicMode() {
        const list = document.getElementById('leaderboard-list');
        // If no backend is configured, show an offline message instead of fetching
        if (!this.hasBackend) {
            list.innerHTML = '<p class="error">Dynamic leaderboard unavailable (no backend).</p>';
            const backBtn = document.getElementById('back-btn');
            if (backBtn) backBtn.style.display = 'inline-block';
            return;
        }

        list.innerHTML = '<p class="loading">Loading dynamic leaderboard…</p>';
        
        // Show back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) backBtn.style.display = 'inline-block';
        
        // Start auto-updating
        this.fetchLeaderboard();
        this.refreshInterval = setInterval(() => this.fetchLeaderboard(), 30000);
    }

    setupElementaryMode() {
        // Show back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) backBtn.style.display = 'inline-block';
        
        // Fetch existing data from backend
        this.fetchElementaryLeaderboard().then(() => {
            this.showElementaryForm();
        });
    }

    showElementaryForm() {
        const list = document.getElementById('leaderboard-list');
        if (!list) return;

        // Check if we have existing entries to display
        if (this.elementaryEntries.length > 0) {
            // Show the full leaderboard with "Add Another Score" button
            this.displayElementaryLeaderboard();
        } else {
            // Show the form for first entry
            list.innerHTML = `
                <div class="elementary-form">
                    <div class="form-group">
                        <label for="player-name">Player Name</label>
                        <input type="text" id="player-name" placeholder="Enter name" />
                    </div>
                    <div class="form-group">
                        <label for="player-score">Score</label>
                        <input type="number" id="player-score" placeholder="Enter score" />
                    </div>
                    <button class="submit-btn" id="add-score-btn">Add Score</button>
                </div>
            `;

            // Bind event listeners after innerHTML is set
            const addScoreBtn = document.getElementById('add-score-btn');
            const scoreInput = document.getElementById('player-score');
            
            if (addScoreBtn) {
                addScoreBtn.addEventListener('click', () => {
                    this.addElementaryScore();
                });
            }

            // Allow Enter key to submit
            if (scoreInput) {
                scoreInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addElementaryScore();
                });
            }
        }
    }

    addElementaryScore() {
        console.log('=== ADD ELEMENTARY SCORE ===');
        const nameInput = document.getElementById('player-name');
        const scoreInput = document.getElementById('player-score');

        const name = nameInput.value.trim();
        const score = parseInt(scoreInput.value);

        if (!name || isNaN(score)) {
            alert('Please enter both name and score');
            return;
        }

        const endpoint = '/api/events/ELEMENTARY_LEADERBOARD';
        console.log('POST endpoint:', endpoint);

        // If backend is unavailable, save locally in localStorage and update UI
        if (!this.hasBackend) {
            const storageKey = `elementary_leaderboard_${this.gameName}`;
            const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const entry = {
                id: `local-${Date.now()}`,
                payload: { user: name, score: score, gameName: this.gameName },
                timestamp: new Date().toISOString()
            };
            stored.push(entry);
            localStorage.setItem(storageKey, JSON.stringify(stored));

            // Clear inputs and refresh local display
            nameInput.value = '';
            scoreInput.value = '';
            this.fetchElementaryLeaderboard();
            return;
        }

        const url = `${javaURI}${endpoint}`;
        console.log('Full URL:', url);

        // Create payload matching Java backend AlgorithmicEvent structure
        const requestBody = {
            payload: {
                user: name,
                score: score,
                gameName: this.gameName
            }
        };
        console.log('Payload:', JSON.stringify(requestBody));

        // POST to backend using API chaining pattern
        fetch(
            url,
            {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify(requestBody)
            }
        )
            .then(res => {
                if (!res.ok) {
                    return res.text().then(errorText => {
                        console.error('Server error:', errorText);
                        throw new Error(`Failed to save score: ${res.status} - ${errorText}`);
                    });
                }
                return res.json();
            })
            .then(savedEntry => {
                console.log('Score saved successfully:', savedEntry);
                // Clear inputs
                nameInput.value = '';
                scoreInput.value = '';
                // Fetch updated leaderboard from backend
                return this.fetchElementaryLeaderboard();
            })
            .catch(error => {
                console.error('Error adding score:', error);
                // Check for authentication errors (401 or 403 status)
                if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
                    alert('Please login to access this feature.');
                } else if (error.message && error.message.includes('Failed to fetch')) {
                    alert('Network error: Unable to connect to server. Please check if the backend is running.');
                } else {
                    alert(`Failed to save score: ${error.message}`);
                }
            });
    }

    deleteElementaryScore(id) {
        if (!confirm('Are you sure you want to delete this score?')) {
            return;
        }

        console.log('=== DELETE SCORE ===');
        console.log('Deleting ID:', id);

        // If backend unavailable, delete from localStorage
        if (!this.hasBackend) {
            const storageKey = `elementary_leaderboard_${this.gameName}`;
            const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const filtered = stored.filter(e => e.id !== id);
            localStorage.setItem(storageKey, JSON.stringify(filtered));
            this.fetchElementaryLeaderboard();
            return;
        }

        const url = `${javaURI}/api/events/ELEMENTARY_LEADERBOARD/${id}`;
        console.log('DELETE URL:', url);

        // DELETE from backend using API chaining pattern
        fetch(
            url,
            {
                ...fetchOptions,
                method: 'DELETE'
            }
        )
            .then(res => {
                if (!res.ok) {
                    return res.text().then(errorText => {
                        console.error('Delete failed:', res.status, errorText);
                        throw new Error(`Failed to delete: ${res.status} - ${errorText}`);
                    });
                }
                console.log('Score deleted successfully');
                // Fetch updated leaderboard from backend
                return this.fetchElementaryLeaderboard();
            })
            .catch(error => {
                console.error('Error deleting score:', error);
                alert(`Failed to delete score: ${error.message}`);
            });
    }

    fetchElementaryLeaderboard() {
        console.log('=== FETCHING ELEMENTARY LEADERBOARD ===');
        
        // If backend unavailable, load from localStorage
        if (!this.hasBackend) {
            const storageKey = `elementary_leaderboard_${this.gameName}`;
            const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
            this.elementaryEntries = stored
                .map(event => ({
                    id: event.id,
                    user: event.payload?.user || 'Anonymous',
                    score: event.payload?.score || 0,
                    gameName: event.payload?.gameName || this.gameName,
                    timestamp: event.timestamp
                }))
                .sort((a, b) => b.score - a.score);

            this.displayElementaryLeaderboard();
            return Promise.resolve();
        }

        const url = `${javaURI}/api/events/ELEMENTARY_LEADERBOARD`;
        console.log('Fetching from:', url);

        return fetch(url, fetchOptions)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .then(data => {
                console.log('Received data:', data);
                console.log('Number of entries:', data.length);
                
                // Transform backend data to frontend format
                // Backend returns AlgorithmicEvent with payload field
                this.elementaryEntries = data
                    .map(event => ({
                        id: event.id,
                        user: event.payload?.user || 'Anonymous',
                        score: event.payload?.score || 0,
                        gameName: event.payload?.gameName || this.gameName,
                        timestamp: event.timestamp
                    }))
                    .sort((a, b) => b.score - a.score); // Sort by score descending
                
                console.log('Transformed elementaryEntries:', this.elementaryEntries);
                
                // Force display update
                this.displayElementaryLeaderboard();
            })
            .catch(error => {
                console.error('Error fetching leaderboard:', error);
                // Check for authentication errors (401 or 403 status)
                if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
                    const list = document.getElementById('leaderboard-list');
                    if (list) {
                        list.innerHTML = '<p class="error">Please login to access this feature.</p>';
                    }
                    return;
                }
                // Fallback to local data if fetch fails
                const storageKey = `elementary_leaderboard_${this.gameName}`;
                const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
                this.elementaryEntries = stored
                    .map(event => ({
                        id: event.id,
                        user: event.payload?.user || 'Anonymous',
                        score: event.payload?.score || 0,
                        gameName: event.payload?.gameName || this.gameName,
                        timestamp: event.timestamp
                    }))
                    .sort((a, b) => b.score - a.score);
                this.displayElementaryLeaderboard();
            });
    }

    displayElementaryLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        const preview = document.getElementById('leaderboard-preview');

        if (!list) return;

        let html = '';

        // Only update preview if there are entries
        if (this.elementaryEntries.length > 0) {
            const top = this.elementaryEntries[0];
            if (preview) {
                preview.textContent = `High Score: ${top.user} - ${Number(top.score).toLocaleString()}`;
            }

            html = `
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Score</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            this.elementaryEntries.forEach((e, i) => {
                html += `
                    <tr>
                        <td class="rank">${i + 1}</td>
                        <td class="username">${this.escape(e.user)}</td>
                        <td class="score">${Number(e.score).toLocaleString()}</td>
                        <td><button class="delete-btn" data-id="${e.id}">Delete</button></td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
        }
        
        // Always show form to add more scores
        html += `
            <div class="elementary-form" style="border-top: 2px solid #333; margin-top: 12px;">
                <div class="form-group">
                    <label for="player-name">Player Name</label>
                    <input type="text" id="player-name" placeholder="Enter name" />
                </div>
                <div class="form-group">
                    <label for="player-score">Score</label>
                    <input type="number" id="player-score" placeholder="Enter score" />
                </div>
                <button class="submit-btn" id="add-score-btn">Add Score</button>
            </div>
        `;

        // Set innerHTML to clear old content and listeners
        list.innerHTML = html;

        // Bind event listeners after setting innerHTML
        const addScoreBtn = document.getElementById('add-score-btn');
        const scoreInput = document.getElementById('player-score');
        
        if (addScoreBtn) {
            addScoreBtn.addEventListener('click', () => {
                this.addElementaryScore();
            });
        }

        // Allow Enter key to submit
        if (scoreInput) {
            scoreInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addElementaryScore();
            });
        }

        // Bind delete button event listeners for each delete button
        const deleteButtons = list.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = e.target.getAttribute('data-id');
                this.deleteElementaryScore(id);
            });
        });
    }

    fetchLeaderboard() {
        if (this.mode !== 'dynamic') return;

        const list = document.getElementById('leaderboard-list');
        if (!list) return;
        
        // If backend unavailable, load local scores
        if (!this.hasBackend) {
            const storageKey = `score_counter_${this.gameName}`;
            const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const transformed = stored.map(e => ({
                id: e.id,
                payload: { user: e.payload.user, score: e.payload.score, gameName: e.payload.gameName },
                timestamp: e.timestamp
            }));
            this.displayLeaderboard(transformed);
            return;
        }

        fetch(`${javaURI}/api/events/SCORE_COUNTER`, fetchOptions)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .then(data => {
                this.displayLeaderboard(data);
            })
            .catch(err => {
                console.error('Error fetching dynamic leaderboard:', err);
                // Check for authentication errors (401 or 403 status)
                if (err.message && (err.message.includes('401') || err.message.includes('403'))) {
                    list.innerHTML = `<p class="error">Please login to access this feature.</p>`;
                } else {
                    list.innerHTML = `<p class="error">Failed to load leaderboard</p>`;
                }
            });
    }

    /**
     * Submit a score to the SCORE_COUNTER endpoint
     * Uses API chaining pattern for elegant error handling
     * @param {string} username - Player username
     * @param {number} score - Player score
     * @param {string} gameName - Name of the game (optional, uses this.gameName if not provided)
     * @returns {Promise<Object>} The saved score entry
     */
    submitScore(username, score, gameName = null) {
        console.log('=== SUBMIT SCORE TO SCORE_COUNTER ===');
        
        if (!username || isNaN(score)) {
            return Promise.reject(new Error('Invalid username or score'));
        }

        const endpoint = '/api/events/SCORE_COUNTER';
        console.log('POST endpoint:', endpoint);

        // If backend unavailable, store locally and update display
        if (!this.hasBackend) {
            const storageKey = `score_counter_${gameName || this.gameName}`;
            const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const entry = {
                id: `local-${Date.now()}`,
                payload: { user: username, score: score, gameName: gameName || this.gameName },
                timestamp: new Date().toISOString()
            };
            stored.push(entry);
            localStorage.setItem(storageKey, JSON.stringify(stored));

            if (this.mode === 'dynamic') this.fetchLeaderboard();
            return Promise.resolve(entry);
        }

        const url = `${javaURI}${endpoint}`;
        console.log('Full URL:', url);

        // Create payload matching Java backend AlgorithmicEvent structure
        const requestBody = {
            payload: {
                user: username,
                score: score,
                gameName: gameName || this.gameName
            }
        };
        console.log('Payload:', JSON.stringify(requestBody));

        // POST to backend using API chaining pattern
        return fetch(
            url,
            {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify(requestBody)
            }
        )
            .then(res => {
                if (!res.ok) {
                    return res.text().then(errorText => {
                        console.error('Server error:', errorText);
                        throw new Error(`Failed to save score: ${res.status} - ${errorText}`);
                    });
                }
                return res.json();
            })
            .then(savedEntry => {
                console.log('Score saved successfully to SCORE_COUNTER:', savedEntry);

                // Refresh leaderboard if we're in dynamic mode
                if (this.mode === 'dynamic') {
                    return this.fetchLeaderboard().then(() => savedEntry);
                }

                return savedEntry;
            });
    }

    displayLeaderboard(data) {
        const list = document.getElementById('leaderboard-list');
        const preview = document.getElementById('leaderboard-preview');

        // Transform backend data to frontend format
        // Backend returns: { id, user (User object or null), algoName, payload, timestamp }
        // Frontend needs: { user (string), score, gameName }
        const transformedData = data
            .map(event => ({
                id: event.id,
                user: event.payload?.user || event.payload?.username || 'Anonymous',
                username: event.payload?.user || event.payload?.username || 'Anonymous',
                score: event.payload?.score || 0,
                gameName: event.payload?.gameName || event.payload?.game || 'Unknown',
                game: event.payload?.gameName || event.payload?.game || 'Unknown',
                timestamp: event.timestamp
            }))
            .sort((a, b) => b.score - a.score); // Sort by score descending

        let html = '';

        if (!Array.isArray(transformedData) || !transformedData.length) {
            html = '<p class="loading">No scores yet</p>';
        } else {
            const top = transformedData[0];
            if (preview) {
                preview.textContent = `High Score: ${top.user || top.username} - ${Number(top.score).toLocaleString()}`;
            }

            // Dynamic leaderboard is READ-ONLY - no input form
            html = `
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Game</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            transformedData.forEach((e, i) => {
                html += `
                    <tr>
                        <td class="rank">${i + 1}</td>
                        <td class="username">${this.escape(e.user || e.username)}</td>
                        <td>${this.escape(e.gameName || e.game)}</td>
                        <td class="score">${Number(e.score).toLocaleString()}</td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
        }

        list.innerHTML = html;
    }

    escape(str = '') {
        return String(str).replace(/[&<>"']/g, m =>
            ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m])
        );
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        document.getElementById('leaderboard-container')?.remove();
    }

    /**
     * Toggle visibility of the entire leaderboard widget
     */
    toggleVisibility() {
        const container = document.getElementById('leaderboard-container');
        if (container) {
            if (container.style.display === 'none' || container.classList.contains('initially-hidden')) {
                container.style.display = 'block';
                container.classList.remove('initially-hidden');
            } else {
                container.style.display = 'none';
            }
        }
    }

    /**
     * Check if leaderboard is currently visible
     */
    isVisible() {
        const container = document.getElementById('leaderboard-container');
        return container && container.style.display !== 'none' && !container.classList.contains('initially-hidden');
    }
}
