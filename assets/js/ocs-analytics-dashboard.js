/**
 * OCS Analytics Dashboard Module
 * Displays analytics and engagement metrics for the Open Coding Society
 */

export async function initOCSAnalyticsDashboard(pythonURI, javaURI, fetchOptions) {
    
    let currentUser = null;
    let adminFilters = {
        startDate: null,
        endDate: null,
        minSessions: 0,
        maxSessions: Infinity,
        minTimeSpent: 0,
        maxTimeSpent: Infinity,
        sortBy: 'time', // 'time', 'engagement', 'sessions', 'lessons'
        sortOrder: 'desc' // 'asc', 'desc'
    };
    
    // Get current user's Spring ID
    async function getUserIdSpring() {
        try {
            // 1. Get UID from Python
            const pyRes = await fetch(`${pythonURI}/api/id`, fetchOptions);
            if (!pyRes.ok) throw new Error("Failed to fetch Python ID");
            const pyData = await pyRes.json();
            const uid = pyData.uid;

            // 2. Get Person from Spring
            const javaRes = await fetch(`${javaURI}/api/person/uid/${uid}`, fetchOptions);
            if (!javaRes.ok) throw new Error("Failed to fetch user from Spring");
            const person = await javaRes.json();

            // 3. Verify UID match
            if (!person || person.uid !== uid) throw new Error("User not found in Spring");
            
            currentUser = person;
            return person;
        } catch (e) {
            console.error("Error getting Spring user:", e);
            return null;
        }
    }

    /**
     * Check if current user is admin
     */
    function isAdmin() {
        if (!currentUser || !currentUser.roles) return false;
        return currentUser.roles.some(role => role.name === 'ROLE_ADMIN');
    }
    
    /**
     * Load and display OCS analytics data
     */
    async function loadAnalyticsSummary() {
        const container = document.getElementById('tab-content-ocs-analytics');
        if (!container) return;
        
        try {
            // Show loading state
            container.innerHTML = `
                <div class="flex items-center justify-center min-h-[400px]">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p class="text-neutral-300">Loading your OCS analytics...</p>
                    </div>
                </div>
            `;
            
            // Get current user
            const person = await getUserIdSpring();
            if (!person) {
                throw new Error("Not logged in. Please log in to view analytics.");
            }
            
            // Fetch analytics summary
            const url = `${javaURI}/api/ocs-analytics/user/summary`;
            console.log('Fetching OCS analytics from:', url);
            console.log('Fetch options:', fetchOptions);
            
            const res = await fetch(url, fetchOptions);
            console.log('Response status:', res.status, res.statusText);
            
            if (!res.ok) {
                const errText = await res.text();
                console.error('Error response:', errText);
                throw new Error(`Failed to fetch analytics: ${res.status} ${res.statusText}`);
            }
            
            const summary = await res.json();
            console.log('Analytics summary:', summary);
            
            // Render analytics summary with tabs
            renderAnalyticsSummary(container, summary);
            
        } catch (error) {
            console.error('Error loading OCS analytics:', error);
            container.innerHTML = `
                <div class="text-center py-8 space-y-4">
                    <p class="text-red-400">Error loading analytics.</p>
                    <p class="text-sm text-neutral-400">${error.message}</p>
                    <p class="text-xs text-neutral-500">Check the browser console (F12) for more details.</p>
                    <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                        Retry
                    </button>
                </div>
            `;
        }
    }

    /**
     * Render analytics summary to DOM
     */
    function renderAnalyticsSummary(container, summary) {
        const adminTabHTML = isAdmin() ? `
            <div class="flex gap-2 mb-6 border-b border-neutral-700">
                <button id="tab-user-analytics" class="analytics-tab px-4 py-3 border-b-2 border-blue-500 text-white font-semibold active" data-tab="user">
                    My Analytics
                </button>
                <button id="tab-admin-analytics" class="analytics-tab px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white font-semibold transition" data-tab="admin">
                    🔧 Admin Dashboard
                </button>
            </div>
        ` : '';

        const html = `
            ${adminTabHTML}
            <div id="user-analytics-view">
                <div class="space-y-6">
                    <!-- Header -->
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-2">Open Coding Society Analytics</h2>
                        <p class="text-neutral-400">Your engagement metrics across all quests and modules</p>
                    </div>

                    <!-- Key Metrics Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        
                        <!-- Time Spent -->
                        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                            <div class="flex items-start justify-between mb-2">
                                <h3 class="text-neutral-300 font-medium">Total Time Spent</h3>
                            </div>
                            <div class="text-3xl font-bold text-white">${summary.totalTimeFormatted || '0h'}</div>
                            <p class="text-xs text-neutral-500 mt-2">${summary.totalTimeSpentSeconds || 0} seconds total</p>
                        </div>

                        <!-- Lessons Viewed -->
                        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                            <div class="flex items-start justify-between mb-2">
                                <h3 class="text-neutral-300 font-medium">Lessons Viewed</h3>
                            </div>
                            <div class="text-3xl font-bold text-white">${summary.totalLessonsViewed || 0}</div>
                            <p class="text-xs text-neutral-500 mt-2">unique lessons</p>
                        </div>

                        <!-- Lessons Marked Complete -->
                        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                            <div class="flex items-start justify-between mb-2">
                                <h3 class="text-neutral-300 font-medium">Lessons Completed</h3>
                            </div>
                            <div class="text-3xl font-bold text-white">${summary.totalLessonsCompleted || 0}</div>
                            <p class="text-xs text-neutral-500 mt-2">marked as complete</p>
                        </div>

                        <!-- Code Executions -->
                        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                            <div class="flex items-start justify-between mb-2">
                                <h3 class="text-neutral-300 font-medium">Code Executions</h3>
                            </div>
                            <div class="text-3xl font-bold text-white">${summary.totalCodeExecutions || 0}</div>
                            <p class="text-xs text-neutral-500 mt-2">code runs</p>
                        </div>

                        <!-- Interaction Percentage -->
                        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                            <div class="flex items-start justify-between mb-2">
                                <h3 class="text-neutral-300 font-medium">Interaction Rate</h3>
                            </div>
                            <div class="text-3xl font-bold text-white">${(summary.interactionPercentage || 0).toFixed(1)}%</div>
                            <p class="text-xs text-neutral-500 mt-2">active engagement</p>
                        </div>

                        <!-- Average Scroll Depth -->
                        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                            <div class="flex items-start justify-between mb-2">
                                <h3 class="text-neutral-300 font-medium">Scroll Depth</h3>
                            </div>
                            <div class="text-3xl font-bold text-white">${(summary.averageScrollDepth || 0).toFixed(0)}%</div>
                            <p class="text-xs text-neutral-500 mt-2">average per lesson</p>
                        </div>

                    </div>

                    <!-- Detailed Lesson Analytics Dropdown -->
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 mt-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-white">Detailed Lesson Analytics</h3>
                            <button id="toggleDetailedAnalytics" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                                Show Details
                            </button>
                        </div>
                        
                        <div id="detailedAnalyticsContainer" class="hidden mt-4 space-y-3 max-h-[600px] overflow-y-auto">
                            <div class="text-center py-8">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p class="text-neutral-300">Loading detailed analytics...</p>
                            </div>
                        </div>
                    </div>


                    <!-- Help Section -->
                    <div class="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6 mt-6">
                        <h3 class="text-lg font-semibold text-blue-300 mb-2">Understanding Your Analytics</h3>
                        <ul class="text-sm text-neutral-300 space-y-2">
                            <li>• <strong>Time Spent:</strong> Total hours/minutes spent on the platform</li>
                            <li>• <strong>Lessons Viewed:</strong> Number of unique lessons you've accessed</li>
                            <li>• <strong>Lessons Completed:</strong> Number of lessons marked as complete via the burndown button</li>
                            <li>• <strong>Code Executions:</strong> Number of times you ran code in the code runner</li>
                            <li>• <strong>Interaction Rate:</strong> Percentage of time spent actively clicking, typing, scrolling vs idle</li>
                            <li>• <strong>Scroll Depth:</strong> Average percentage of page content you scroll through</li>
                            <li>• <strong>Detailed Analytics:</strong> Per-lesson breakdown with scroll depth, clicks, idle time, and more</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="admin-analytics-view" class="hidden"></div>
        `;
        
        container.innerHTML = html;
        
        // Setup tab switching
        if (isAdmin()) {
            document.getElementById('tab-user-analytics')?.addEventListener('click', switchToUserAnalytics);
            document.getElementById('tab-admin-analytics')?.addEventListener('click', switchToAdminAnalytics);
        }
        
        // Add event listener for detailed analytics toggle
        const toggleBtn = document.getElementById('toggleDetailedAnalytics');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const detailedContainer = document.getElementById('detailedAnalyticsContainer');
                if (detailedContainer.classList.contains('hidden')) {
                    detailedContainer.classList.remove('hidden');
                    toggleBtn.textContent = 'Hide Details';
                    loadDetailedAnalytics();
                } else {
                    detailedContainer.classList.add('hidden');
                    toggleBtn.textContent = 'Show Details';
                }
            });
        }
    }

    /**
     * Switch to user analytics view
     */
    function switchToUserAnalytics() {
        const userView = document.getElementById('user-analytics-view');
        const adminView = document.getElementById('admin-analytics-view');
        const userTab = document.getElementById('tab-user-analytics');
        const adminTab = document.getElementById('tab-admin-analytics');
        
        if (userView) userView.classList.remove('hidden');
        if (adminView) adminView.classList.add('hidden');
        if (userTab) {
            userTab.classList.add('border-blue-500', 'text-white');
            userTab.classList.remove('border-transparent', 'text-neutral-400');
        }
        if (adminTab) {
            adminTab.classList.remove('border-blue-500', 'text-white');
            adminTab.classList.add('border-transparent', 'text-neutral-400');
        }
    }

    /**
     * Switch to admin analytics view
     */
    async function switchToAdminAnalytics() {
        const adminView = document.getElementById('admin-analytics-view');
        const userView = document.getElementById('user-analytics-view');
        const userTab = document.getElementById('tab-user-analytics');
        const adminTab = document.getElementById('tab-admin-analytics');
        
        if (userView) userView.classList.add('hidden');
        if (adminView) adminView.classList.remove('hidden');
        if (userTab) {
            userTab.classList.remove('border-blue-500', 'text-white');
            userTab.classList.add('border-transparent', 'text-neutral-400');
        }
        if (adminTab) {
            adminTab.classList.add('border-blue-500', 'text-white');
            adminTab.classList.remove('border-transparent', 'text-neutral-400');
        }
        
        // Load admin analytics if not already loaded
        if (adminView && !adminView.innerHTML) {
            await loadAdminAnalytics(adminView);
        }
    }

    /**
     * Load detailed per-lesson analytics
     */
    async function loadDetailedAnalytics() {
        const container = document.getElementById('detailedAnalyticsContainer');
        if (!container) return;
        
        try {
            const res = await fetch(`${javaURI}/api/ocs-analytics/user/detailed`, fetchOptions);
            if (!res.ok) throw new Error('Failed to fetch detailed analytics');
            
            const sessions = await res.json();
            renderDetailedAnalytics(container, sessions);
        } catch (error) {
            console.error('Error loading detailed analytics:', error);
            container.innerHTML = `<p class="text-red-400">Error loading detailed analytics: ${error.message}</p>`;
        }
    }

    /**
     * Render detailed per-lesson analytics
     */
    function renderDetailedAnalytics(container, sessions) {
        if (!sessions || sessions.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-neutral-400">
                    <p>No detailed analytics available yet. Start interacting with lessons to see data here!</p>
                </div>
            `;
            return;
        }

        const html = `
            <div class="space-y-3">
                ${sessions.map((session, idx) => `
                    <div class="bg-neutral-900 rounded border border-neutral-700 overflow-hidden">
                        <button class="w-full text-left p-4 hover:bg-neutral-800 transition flex items-center justify-between" onclick="this.parentElement.querySelector('.session-details').classList.toggle('hidden')">
                            <div class="flex-1">
                                <div class="font-semibold text-white">${session.pageTitle || session.lessonNumber || 'Unnamed Lesson'}</div>
                                <div class="text-sm text-neutral-400">${session.questName ? formatQuestName(session.questName) : 'General'}</div>
                            </div>
                            <div class="text-sm text-neutral-400">
                                ${formatDuration(session.sessionDurationSeconds)}
                            </div>
                            <span class="ml-4 text-neutral-500"></span>
                        </button>
                        <div class="session-details hidden bg-neutral-950 px-4 py-3 border-t border-neutral-700 space-y-2 text-sm">
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <span class="text-neutral-500">Time Spent:</span>
                                    <span class="text-white font-semibold ml-2">${formatDuration(session.sessionDurationSeconds)}</span>
                                </div>
                                <div>
                                    <span class="text-neutral-500">Scroll Depth:</span>
                                    <span class="text-white font-semibold ml-2">${(session.scrollDepthPercentage || 0).toFixed(0)}%</span>
                                </div>
                                <div>
                                    <span class="text-neutral-500">Clicks:</span>
                                    <span class="text-white font-semibold ml-2">${session.mouseClicksCount || 0}</span>
                                </div>
                                <div>
                                    <span class="text-neutral-500">Keystrokes:</span>
                                    <span class="text-white font-semibold ml-2">${session.keyboardInputEvents || 0}</span>
                                </div>
                                <div>
                                    <span class="text-neutral-500">Hovers:</span>
                                    <span class="text-white font-semibold ml-2">${session.hoverEventsCount || 0}</span>
                                </div>
                                <div>
                                    <span class="text-neutral-500">Code Runs:</span>
                                    <span class="text-white font-semibold ml-2">${session.codeExecutions || 0}</span>
                                </div>
                                <div>
                                    <span class="text-neutral-500">Copy/Paste:</span>
                                    <span class="text-white font-semibold ml-2">${session.copyPasteAttempts || 0}</span>
                                </div>
                                <div>
                                    <span class="text-neutral-500">Idle Time:</span>
                                    <span class="text-white font-semibold ml-2">${calculateIdleTime(session)}</span>
                                </div>
                            </div>
                            ${session.questionsAnswered > 0 ? `
                                <div class="mt-3 pt-3 border-t border-neutral-700">
                                    <span class="text-neutral-500">Questions Answered:</span>
                                    <span class="text-white font-semibold ml-2">${session.questionsCorrect}/${session.questionsAnswered} (${Math.round((session.questionsCorrect / session.questionsAnswered) * 100)}%)</span>
                                </div>
                            ` : ''}
                            <div class="mt-3 text-xs text-neutral-500">
                                ${new Date(session.sessionStartTime).toLocaleDateString()} at ${new Date(session.sessionStartTime).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = html;
    }

    /**
     * Calculate idle time based on session duration and interactions
     */
    function calculateIdleTime(session) {
        const totalSeconds = session.sessionDurationSeconds || 0;
        // Simple heuristic: estimate idle time as time not spent interacting
        // Assume 1 second per interaction (rough estimate)
        const interactionCount = (session.mouseClicksCount || 0) + 
                               (session.keyboardInputEvents || 0) + 
                               (session.hoverEventsCount || 0);
        const estimatedActiveSeconds = Math.min(interactionCount, totalSeconds);
        const idleSeconds = Math.max(0, totalSeconds - estimatedActiveSeconds);
        return formatDuration(idleSeconds);
    }

    /**
     * Format duration in readable format
     */
    function formatDuration(seconds) {
        if (!seconds) return '0s';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }

    }

    /**
     * Format quest name for display
     */
    function formatQuestName(questName) {
        const names = {
            'cs-portfolio-quest': 'CS Portfolio Quest',
            'digital-famine': 'Digital Famine',
            'west-coast': 'West Coast Adventure',
            'plagiarism': 'Plagiarism Detective'
        };
        return names[questName] || questName;
    }

    /**
     * Load detailed analytics for a specific quest
     */
    async function loadQuestDetails(questName) {
        const container = document.getElementById('tab-content-ocs-analytics');
        if (!container) return;
        
        try {
            container.innerHTML = `
                <div class="flex items-center justify-center min-h-[400px]">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p class="text-neutral-300">Loading ${formatQuestName(questName)} details...</p>
                    </div>
                </div>
            `;
            
            const res = await fetch(`${javaURI}/api/ocs-analytics/user/quest/${questName}`, fetchOptions);
            if (!res.ok) throw new Error('Failed to fetch quest analytics');
            
            const questData = await res.json();
            renderQuestDetails(container, questData);
            
        } catch (error) {
            console.error('Error loading quest details:', error);
            container.innerHTML += `
                <p class="text-red-400 mt-4">Error loading quest details</p>
            `;
        }
    }

    /**
     * Render quest-specific analytics
     */
    function renderQuestDetails(container, questData) {
        const html = `
            <div class="space-y-6">
                <!-- Back Button -->
                <button onclick="window.OCSAnalytics.loadAnalyticsSummary()" class="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    Back to Summary
                </button>

                <!-- Quest Header -->
                <div>
                    <h2 class="text-2xl font-bold text-white">${formatQuestName(questData.questName)}</h2>
                    <p class="text-neutral-400">${questData.sessionCount || 0} session(s) recorded</p>
                </div>

                <!-- Quest Summary Stats -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <h3 class="text-neutral-300 text-sm font-medium mb-2">Sessions</h3>
                        <div class="text-3xl font-bold text-white">${questData.sessionCount || 0}</div>
                    </div>
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <h3 class="text-neutral-300 text-sm font-medium mb-2">Total Time</h3>
                        <div class="text-3xl font-bold text-white">${questData.totalTimeFormatted || '0h'}</div>
                    </div>
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <h3 class="text-neutral-300 text-sm font-medium mb-2">Lessons Viewed</h3>
                        <div class="text-3xl font-bold text-white">${questData.totalLessonsViewed || 0}</div>
                    </div>
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <h3 class="text-neutral-300 text-sm font-medium mb-2">Status</h3>
                        <div class="text-xl font-bold ${questData.questCompleted ? 'text-green-400' : 'text-yellow-400'}">
                            ${questData.questCompleted ? 'Completed' : 'In Progress'}
                        </div>
                    </div>
                </div>

                <!-- Copy-Paste Analysis -->
                <div class="bg-orange-900/20 border border-orange-700/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-orange-300 mb-2">Copy-Paste Activity</h3>
                    <p class="text-neutral-300 text-2xl font-bold">${questData.totalCopyPasteAttempts || 0} attempts</p>
                    <p class="text-xs text-neutral-400 mt-2">
                        Copy-paste attempts are tracked to understand your coding approach. 
                        Fewer attempts may indicate deeper understanding.
                    </p>
                </div>

                <!-- Sessions List -->
                ${questData.sessions && questData.sessions.length > 0 ? `
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Session History</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="text-neutral-400 border-b border-neutral-700">
                                    <tr>
                                        <th class="text-left py-2">Date</th>
                                        <th class="text-left py-2">Duration</th>
                                        <th class="text-left py-2">Lessons</th>
                                        <th class="text-left py-2">Copy-Pastes</th>
                                        <th class="text-left py-2">Module</th>
                                    </tr>
                                </thead>
                                <tbody class="text-neutral-300">
                                    ${questData.sessions.slice(0, 10).map(session => `
                                        <tr class="border-b border-neutral-700/50 hover:bg-neutral-700/30">
                                            <td class="py-2">${new Date(session.sessionStartTime).toLocaleDateString()}</td>
                                            <td class="py-2">${formatSeconds(session.sessionDurationSeconds)}</td>
                                            <td class="py-2">${session.lessonsViewed || 0}</td>
                                            <td class="py-2">${session.copyPasteAttempts || 0}</td>
                                            <td class="py-2">${session.moduleName || 'General'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        container.innerHTML = html;
    }

    /**
     * Format seconds to readable string
     */
    function formatSeconds(seconds) {
        if (!seconds) return '0s';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
    }

    // ============================================================
    // ADMIN ANALYTICS FUNCTIONS
    // ============================================================

    /**
     * Load admin analytics dashboard
     */
    async function loadAdminAnalytics(container) {
        try {
            container.innerHTML = `
                <div class="flex items-center justify-center min-h-[400px]">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p class="text-neutral-300">Loading admin dashboard...</p>
                    </div>
                </div>
            `;

            // Fetch global stats
            const stats = await fetchGlobalStats();
            if (stats) {
                renderAdminOverview(container, stats);
            } else {
                container.innerHTML = '<p class="text-red-400">Failed to load admin statistics</p>';
            }
        } catch (error) {
            console.error('Error loading admin analytics:', error);
            container.innerHTML = `<p class="text-red-400">Error: ${error.message}</p>`;
        }
    }

    /**
     * Fetch global statistics
     */
    async function fetchGlobalStats() {
        try {
            const res = await fetch(`${javaURI}/api/ocs-analytics/admin/global-stats`, fetchOptions);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('Error fetching global stats:', e);
            return null;
        }
    }

    /**
     * Fetch all users summary
     */
    async function fetchAllUsersSummary() {
        try {
            const res = await fetch(`${javaURI}/api/ocs-analytics/admin/all-users-summary`, fetchOptions);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('Error fetching users summary:', e);
            return null;
        }
    }

    /**
     * Fetch quest stats
     */
    async function fetchQuestStats() {
        try {
            const res = await fetch(`${javaURI}/api/ocs-analytics/admin/quest-stats`, fetchOptions);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('Error fetching quest stats:', e);
            return null;
        }
    }

    /**
     * Fetch specific user summary
     */
    async function fetchUserSummary(userId) {
        try {
            const res = await fetch(`${javaURI}/api/ocs-analytics/admin/user/${userId}/summary`, fetchOptions);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error(`Error fetching user ${userId} summary:`, e);
            return null;
        }
    }

    /**
     * Render filter panel for admin analytics
     */
    function renderFilterPanel() {
        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
        
        return `
            <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-white mb-4">Advanced Filters</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <!-- Date Range Start -->
                    <div>
                        <label class="block text-sm text-neutral-300 mb-2">From Date</label>
                        <input type="date" id="filter-start-date" class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded text-sm" value="${thirtyDaysAgo}" />
                    </div>
                    
                    <!-- Date Range End -->
                    <div>
                        <label class="block text-sm text-neutral-300 mb-2">To Date</label>
                        <input type="date" id="filter-end-date" class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded text-sm" value="${today}" />
                    </div>
                    
                    <!-- Min Sessions -->
                    <div>
                        <label class="block text-sm text-neutral-300 mb-2">Min Sessions</label>
                        <input type="number" id="filter-min-sessions" class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded text-sm" value="0" min="0" />
                    </div>
                    
                    <!-- Sort By -->
                    <div>
                        <label class="block text-sm text-neutral-300 mb-2">Sort By</label>
                        <select id="filter-sort-by" class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded text-sm">
                            <option value="time">Time Spent</option>
                            <option value="engagement">Engagement</option>
                            <option value="sessions">Sessions</option>
                            <option value="lessons">Lessons</option>
                            <option value="accuracy">Accuracy</option>
                        </select>
                    </div>
                    
                    <!-- Sort Order -->
                    <div>
                        <label class="block text-sm text-neutral-300 mb-2">Order</label>
                        <select id="filter-sort-order" class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded text-sm">
                            <option value="desc">Highest First</option>
                            <option value="asc">Lowest First</option>
                        </select>
                    </div>
                </div>
                
                <div class="mt-4 flex gap-2">
                    <button id="apply-filters-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                        Apply Filters
                    </button>
                    <button id="reset-filters-btn" class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition">
                        Reset
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Apply filters to users data
     */
    function applyUserFilters(users) {
        if (!users) return [];
        
        let filtered = [...users];
        
        // Filter by sessions
        filtered = filtered.filter(u => {
            const sessions = u.totalSessions || 0;
            return sessions >= adminFilters.minSessions && sessions <= adminFilters.maxSessions;
        });
        
        // Sort
        filtered.sort((a, b) => {
            let aVal, bVal;
            
            switch(adminFilters.sortBy) {
                case 'time':
                    aVal = a.totalTimeSpentSeconds || 0;
                    bVal = b.totalTimeSpentSeconds || 0;
                    break;
                case 'engagement':
                    aVal = a.interactionPercentage || 0;
                    bVal = b.interactionPercentage || 0;
                    break;
                case 'sessions':
                    aVal = a.totalSessions || 0;
                    bVal = b.totalSessions || 0;
                    break;
                case 'lessons':
                    aVal = a.totalLessonsViewed || 0;
                    bVal = b.totalLessonsViewed || 0;
                    break;
                case 'accuracy':
                    aVal = a.averageAccuracyPercentage || 0;
                    bVal = b.averageAccuracyPercentage || 0;
                    break;
                default:
                    aVal = a.totalTimeSpentSeconds || 0;
                    bVal = b.totalTimeSpentSeconds || 0;
            }
            
            return adminFilters.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        });
        
        return filtered;
    }

    /**
     * Setup filter event listeners
     */
    function setupFilterListeners(onApply) {
        const applyBtn = document.getElementById('apply-filters-btn');
        const resetBtn = document.getElementById('reset-filters-btn');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                adminFilters.startDate = document.getElementById('filter-start-date').value;
                adminFilters.endDate = document.getElementById('filter-end-date').value;
                adminFilters.minSessions = parseInt(document.getElementById('filter-min-sessions').value) || 0;
                adminFilters.sortBy = document.getElementById('filter-sort-by').value;
                adminFilters.sortOrder = document.getElementById('filter-sort-order').value;
                onApply();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                adminFilters = {
                    startDate: null,
                    endDate: null,
                    minSessions: 0,
                    maxSessions: Infinity,
                    minTimeSpent: 0,
                    maxTimeSpent: Infinity,
                    sortBy: 'time',
                    sortOrder: 'desc'
                };
                const today = new Date().toISOString().split('T')[0];
                const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
                document.getElementById('filter-start-date').value = thirtyDaysAgo;
                document.getElementById('filter-end-date').value = today;
                document.getElementById('filter-min-sessions').value = '0';
                document.getElementById('filter-sort-by').value = 'time';
                document.getElementById('filter-sort-order').value = 'desc';
                onApply();
            });
        }
    }

    /**
     * Render admin overview
     */
    async function renderAdminOverview(container, stats) {
        const html = `
            <div class="space-y-6">
                <!-- Admin Nav -->
                <div class="flex gap-2 mb-6">
                    <button id="admin-overview-btn" class="admin-nav-btn px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition active">
                        Overview
                    </button>
                    <button id="admin-users-btn" class="admin-nav-btn px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition">
                        All Users
                    </button>
                    <button id="admin-quests-btn" class="admin-nav-btn px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition">
                        Quest Analytics
                    </button>
                </div>

                <div id="admin-content">
                    <!-- Global Header -->
                    <div class="mb-8">
                        <h2 class="text-3xl font-bold text-white mb-2">Admin Analytics Dashboard</h2>
                        <p class="text-neutral-400">Platform-wide engagement metrics</p>
                    </div>

                    <!-- Top Metrics Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/50 rounded-lg p-6">
                            <h3 class="text-neutral-300 text-sm font-semibold mb-4">Total Users</h3>
                            <div class="text-4xl font-bold text-blue-300">${stats.totalUsers || 0}</div>
                            <p class="text-xs text-neutral-500 mt-2">${stats.usersWithAnalytics || 0} with data</p>
                        </div>

                        <div class="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/50 rounded-lg p-6">
                            <h3 class="text-neutral-300 text-sm font-semibold mb-4">Global Time Spent</h3>
                            <div class="text-4xl font-bold text-purple-300">${stats.globalTotalTimeSpent || '0h'}</div>
                            <p class="text-xs text-neutral-500 mt-2">across all users</p>
                        </div>

                        <div class="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/50 rounded-lg p-6">
                            <h3 class="text-neutral-300 text-sm font-semibold mb-4">Lessons Viewed</h3>
                            <div class="text-4xl font-bold text-green-300">${stats.globalTotalLessonsViewed || 0}</div>
                            <p class="text-xs text-neutral-500 mt-2">total</p>
                        </div>

                        <div class="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-700/50 rounded-lg p-6">
                            <h3 class="text-neutral-300 text-sm font-semibold mb-4">Code Executions</h3>
                            <div class="text-4xl font-bold text-orange-300">${stats.globalTotalCodeExecutions || 0}</div>
                            <p class="text-xs text-neutral-500 mt-2">total</p>
                        </div>
                    </div>

                    <!-- Secondary Metrics -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                            <h3 class="text-neutral-300 text-sm font-semibold mb-4">Avg Interaction</h3>
                            <div class="text-3xl font-bold text-white">${(stats.globalAverageInteraction || 0).toFixed(1)}%</div>
                            <div class="mt-3 bg-neutral-700/50 rounded h-2">
                                <div class="bg-blue-500 h-full rounded" style="width: ${Math.min(stats.globalAverageInteraction || 0, 100)}%"></div>
                            </div>
                        </div>

                        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                            <h3 class="text-neutral-300 text-sm font-semibold mb-4">Avg Accuracy</h3>
                            <div class="text-3xl font-bold text-white">${(stats.globalAverageAccuracy || 0).toFixed(1)}%</div>
                            <div class="mt-3 bg-neutral-700/50 rounded h-2">
                                <div class="bg-green-500 h-full rounded" style="width: ${Math.min(stats.globalAverageAccuracy || 0, 100)}%"></div>
                            </div>
                        </div>

                        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                            <h3 class="text-neutral-300 text-sm font-semibold mb-4">Analytics Records</h3>
                            <div class="text-3xl font-bold text-white">${stats.totalAnalyticsRecords || 0}</div>
                            <p class="text-xs text-neutral-500 mt-2">data points</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const adminViewContainer = document.getElementById('admin-analytics-view');
        adminViewContainer.innerHTML = html;

        // Setup admin tab buttons
        document.getElementById('admin-overview-btn')?.addEventListener('click', async () => {
            showAdminTab('overview');
        });
        document.getElementById('admin-users-btn')?.addEventListener('click', async () => {
            showAdminTab('users');
        });
        document.getElementById('admin-quests-btn')?.addEventListener('click', async () => {
            showAdminTab('quests');
        });
    }

    /**
     * Show admin tab content
     */
    async function showAdminTab(tab) {
        const contentDiv = document.getElementById('admin-content');
        const buttons = document.querySelectorAll('.admin-nav-btn');
        
        buttons.forEach(btn => {
            btn.classList.remove('bg-blue-600');
            btn.classList.add('bg-neutral-700');
        });

        if (tab === 'overview') {
            document.getElementById('admin-overview-btn')?.classList.add('bg-blue-600');
            document.getElementById('admin-overview-btn')?.classList.remove('bg-neutral-700');
            const stats = await fetchGlobalStats();
            if (stats) renderAdminOverviewContent(contentDiv, stats);
        } else if (tab === 'users') {
            document.getElementById('admin-users-btn')?.classList.add('bg-blue-600');
            document.getElementById('admin-users-btn')?.classList.remove('bg-neutral-700');
            contentDiv.innerHTML = '<div class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div><p class="text-neutral-300">Loading users...</p></div>';
            const users = await fetchAllUsersSummary();
            if (users) renderAdminUsersTable(contentDiv, users);
        } else if (tab === 'quests') {
            document.getElementById('admin-quests-btn')?.classList.add('bg-blue-600');
            document.getElementById('admin-quests-btn')?.classList.remove('bg-neutral-700');
            contentDiv.innerHTML = '<div class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div><p class="text-neutral-300">Loading quests...</p></div>';
            const quests = await fetchQuestStats();
            if (quests) renderAdminQuestsTable(contentDiv, quests);
        }
    }

    /**
     * Render admin overview content
     */
    function renderAdminOverviewContent(container, stats) {
        const html = `
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-white mb-2">Admin Analytics Dashboard</h2>
                <p class="text-neutral-400">Platform-wide engagement metrics</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/50 rounded-lg p-6">
                    <h3 class="text-neutral-300 text-sm font-semibold mb-4">Total Users</h3>
                    <div class="text-4xl font-bold text-blue-300">${stats.totalUsers || 0}</div>
                    <p class="text-xs text-neutral-500 mt-2">${stats.usersWithAnalytics || 0} with data</p>
                </div>

                <div class="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/50 rounded-lg p-6">
                    <h3 class="text-neutral-300 text-sm font-semibold mb-4">Global Time Spent</h3>
                    <div class="text-4xl font-bold text-purple-300">${stats.globalTotalTimeSpent || '0h'}</div>
                    <p class="text-xs text-neutral-500 mt-2">across all users</p>
                </div>

                <div class="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/50 rounded-lg p-6">
                    <h3 class="text-neutral-300 text-sm font-semibold mb-4">Lessons Viewed</h3>
                    <div class="text-4xl font-bold text-green-300">${stats.globalTotalLessonsViewed || 0}</div>
                    <p class="text-xs text-neutral-500 mt-2">total</p>
                </div>

                <div class="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-700/50 rounded-lg p-6">
                    <h3 class="text-neutral-300 text-sm font-semibold mb-4">Code Executions</h3>
                    <div class="text-4xl font-bold text-orange-300">${stats.globalTotalCodeExecutions || 0}</div>
                    <p class="text-xs text-neutral-500 mt-2">total</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                    <h3 class="text-neutral-300 text-sm font-semibold mb-4">Avg Interaction</h3>
                    <div class="text-3xl font-bold text-white">${(stats.globalAverageInteraction || 0).toFixed(1)}%</div>
                    <div class="mt-3 bg-neutral-700/50 rounded h-2">
                        <div class="bg-blue-500 h-full rounded" style="width: ${Math.min(stats.globalAverageInteraction || 0, 100)}%"></div>
                    </div>
                </div>

                <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                    <h3 class="text-neutral-300 text-sm font-semibold mb-4">Avg Accuracy</h3>
                    <div class="text-3xl font-bold text-white">${(stats.globalAverageAccuracy || 0).toFixed(1)}%</div>
                    <div class="mt-3 bg-neutral-700/50 rounded h-2">
                        <div class="bg-green-500 h-full rounded" style="width: ${Math.min(stats.globalAverageAccuracy || 0, 100)}%"></div>
                    </div>
                </div>

                <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                    <h3 class="text-neutral-300 text-sm font-semibold mb-4">Analytics Records</h3>
                    <div class="text-3xl font-bold text-white">${stats.totalAnalyticsRecords || 0}</div>
                    <p class="text-xs text-neutral-500 mt-2">data points</p>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    /**
     * Render admin users table
     */
    function renderAdminUsersTable(container, users) {
        if (!users || users.length === 0) {
            container.innerHTML = '<p class="text-neutral-400">No users found</p>';
            return;
        }

        // Apply filters
        const filteredUsers = applyUserFilters(users);

        const html = `
            <div class="space-y-6">
                ${renderFilterPanel()}
                
                <div class="bg-neutral-900 rounded-lg p-4 mb-4">
                    <p class="text-neutral-400 text-sm">Showing <span class="text-white font-semibold">${filteredUsers.length}</span> of <span class="text-white font-semibold">${users.length}</span> users</p>
                </div>

                ${filteredUsers.length === 0 ? ' 
                    <p class="text-neutral-400">No users match the current filters</p>
                ' : `
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr class="border-b border-neutral-700 bg-neutral-900/50">
                                        <th class="px-6 py-4 text-left text-neutral-300 font-semibold">User</th>
                                        <th class="px-6 py-4 text-left text-neutral-300 font-semibold">Email</th>
                                        <th class="px-6 py-4 text-center text-neutral-300 font-semibold">Time Spent</th>
                                        <th class="px-6 py-4 text-center text-neutral-300 font-semibold">Lessons</th>
                                        <th class="px-6 py-4 text-center text-neutral-300 font-semibold">Code Runs</th>
                                        <th class="px-6 py-4 text-center text-neutral-300 font-semibold">Sessions</th>
                                        <th class="px-6 py-4 text-center text-neutral-300 font-semibold">Engagement</th>
                                        <th class="px-6 py-4 text-center text-neutral-300 font-semibold">Accuracy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${filteredUsers.map(user => `
                                        <tr class="border-b border-neutral-700 hover:bg-neutral-700/30 transition">
                                            <td class="px-6 py-4 text-white font-medium">${user.name || 'N/A'}</td>
                                            <td class="px-6 py-4 text-neutral-400 text-xs">${user.email || 'N/A'}</td>
                                            <td class="px-6 py-4 text-center text-white">${user.totalTimeFormatted || '0m'}</td>
                                            <td class="px-6 py-4 text-center text-white">${user.totalLessonsViewed || 0}</td>
                                            <td class="px-6 py-4 text-center text-white">${user.totalCodeExecutions || 0}</td>
                                            <td class="px-6 py-4 text-center text-white font-semibold">${user.totalSessions || 0}</td>
                                            <td class="px-6 py-4 text-center">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-16 bg-neutral-700 rounded-full h-2">
                                                        <div class="bg-blue-500 h-full rounded-full" style="width: ${Math.min(user.interactionPercentage || 0, 100)}%"></div>
                                                    </div>
                                                    <span class="text-xs text-neutral-300">${(user.interactionPercentage || 0).toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 text-center">
                                                <span class="px-2 py-1 rounded text-xs font-semibold" style="background: ${getAccuracyColor(user.averageAccuracyPercentage || 0)}20; color: ${getAccuracyColor(user.averageAccuracyPercentage || 0)}">
                                                    ${(user.averageAccuracyPercentage || 0).toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `}
            </div>
        `;
        container.innerHTML = html;
        setupFilterListeners(() => renderAdminUsersTable(container, users));
    }
    
    /**
     * Get color based on accuracy percentage
     */
    function getAccuracyColor(accuracy) {
        if (accuracy >= 80) return '#10b981'; // green
        if (accuracy >= 60) return '#3b82f6'; // blue
        if (accuracy >= 40) return '#f59e0b'; // amber
        return '#ef4444'; // red
    }

    /**
     * Render admin quests table
     */
    function renderAdminQuestsTable(container, quests) {
        if (!quests || Object.keys(quests).length === 0) {
            container.innerHTML = '<p class="text-neutral-400">No quest data available</p>';
            return;
        }

        let questList = Object.entries(quests);
        
        // Sort quests by total sessions (descending)
        questList.sort((a, b) => {
            const aSessions = a[1].totalSessions || 0;
            const bSessions = b[1].totalSessions || 0;
            return bSessions - aSessions;
        });

        const totalSessions = questList.reduce((sum, [_, data]) => sum + (data.totalSessions || 0), 0);
        const totalCompletions = questList.reduce((sum, [_, data]) => sum + (data.totalCompletions || 0), 0);
        
        const html = `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/50 rounded-lg p-4">
                        <h4 class="text-neutral-300 text-xs font-semibold mb-2">Total Quests</h4>
                        <div class="text-2xl font-bold text-blue-300">${questList.length}</div>
                    </div>
                    <div class="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/50 rounded-lg p-4">
                        <h4 class="text-neutral-300 text-xs font-semibold mb-2">Total Sessions</h4>
                        <div class="text-2xl font-bold text-green-300">${totalSessions}</div>
                    </div>
                    <div class="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/50 rounded-lg p-4">
                        <h4 class="text-neutral-300 text-xs font-semibold mb-2">Completions</h4>
                        <div class="text-2xl font-bold text-purple-300">${totalCompletions}</div>
                    </div>
                    <div class="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-700/50 rounded-lg p-4">
                        <h4 class="text-neutral-300 text-xs font-semibold mb-2">Avg Completion Rate</h4>
                        <div class="text-2xl font-bold text-orange-300">${totalSessions > 0 ? ((totalCompletions / totalSessions) * 100).toFixed(1) : 0}%</div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${questList.map(([name, data]) => {
                        const completionRate = (data.totalSessions || 0) > 0 ? ((data.totalCompletions || 0) / (data.totalSessions || 0)) * 100 : 0;
                        return `
                            <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 hover:border-neutral-600/50 transition">
                                <div class="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 class="text-lg font-semibold text-white">${name}</h3>
                                        <p class="text-xs text-neutral-400 mt-1">Quest Analytics</p>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-2xl font-bold text-green-400">${completionRate.toFixed(1)}%</div>
                                        <p class="text-xs text-neutral-400">completion</p>
                                    </div>
                                </div>
                                
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-neutral-400">Sessions:</span>
                                        <span class="text-white font-semibold">${data.totalSessions || 0}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-neutral-400">Unique Users:</span>
                                        <span class="text-white font-semibold">${data.uniqueUsers || 0}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-neutral-400">Total Time:</span>
                                        <span class="text-white font-semibold">${data.totalTimeSpent || '0h'}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-neutral-400">Lessons Viewed:</span>
                                        <span class="text-white font-semibold">${data.totalLessonsViewed || 0}</span>
                                    </div>
                                    
                                    <div class="pt-3 border-t border-neutral-700">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-neutral-400 text-sm">Completion Progress</span>
                                            <span class="text-green-400 text-sm font-semibold">${data.totalCompletions || 0} / ${data.totalSessions || 0}</span>
                                        </div>
                                        <div class="w-full bg-neutral-700/50 rounded-full h-2">
                                            <div class="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full" style="width: ${Math.min(completionRate, 100)}%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    // Expose to global scope
    window.OCSAnalytics = {
        loadAnalyticsSummary: loadAnalyticsSummary,
        loadQuestDetails: loadQuestDetails
    };

    // Auto-load on init
    return { loadAnalyticsSummary };
}
