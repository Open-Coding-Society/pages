/**
 * OCS Analytics Dashboard Module
 * Displays analytics and engagement metrics for the Open Coding Society
 */

export async function initOCSAnalyticsDashboard(pythonURI, javaURI, fetchOptions) {
    
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
            
            return person;
        } catch (e) {
            console.error("Error getting Spring user:", e);
            return null;
        }
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
            
            // Render analytics summary
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
        const html = `
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
                            <span class="text-blue-400">⏱️</span>
                        </div>
                        <div class="text-3xl font-bold text-white">${summary.totalTimeFormatted || '0h'}</div>
                        <p class="text-xs text-neutral-500 mt-2">${summary.totalTimeSpentSeconds || 0} seconds total</p>
                    </div>

                    <!-- Lessons Viewed -->
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-neutral-300 font-medium">Lessons Viewed</h3>
                            <span class="text-green-400">📚</span>
                        </div>
                        <div class="text-3xl font-bold text-white">${summary.totalLessonsViewed || 0}</div>
                        <p class="text-xs text-neutral-500 mt-2">unique lessons</p>
                    </div>

                    <!-- Modules Viewed -->
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-neutral-300 font-medium">Modules Viewed</h3>
                            <span class="text-purple-400">🎯</span>
                        </div>
                        <div class="text-3xl font-bold text-white">${summary.totalModulesViewed || 0}</div>
                        <p class="text-xs text-neutral-500 mt-2">unique modules</p>
                    </div>

                    <!-- Code Executions -->
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-neutral-300 font-medium">Code Executions</h3>
                            <span class="text-cyan-400">⚙️</span>
                        </div>
                        <div class="text-3xl font-bold text-white">${summary.totalCodeExecutions || 0}</div>
                        <p class="text-xs text-neutral-500 mt-2">code runs</p>
                    </div>

                    <!-- Interaction Percentage -->
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-neutral-300 font-medium">Interaction Rate</h3>
                            <span class="text-indigo-400">👆</span>
                        </div>
                        <div class="text-3xl font-bold text-white">${(summary.interactionPercentage || 0).toFixed(1)}%</div>
                        <p class="text-xs text-neutral-500 mt-2">active engagement</p>
                    </div>

                    <!-- Average Scroll Depth -->
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-neutral-300 font-medium">Scroll Depth</h3>
                            <span class="text-pink-400">📜</span>
                        </div>
                        <div class="text-3xl font-bold text-white">${(summary.averageScrollDepth || 0).toFixed(0)}%</div>
                        <p class="text-xs text-neutral-500 mt-2">average per lesson</p>
                    </div>

                </div>

                <!-- Detailed Lesson Analytics Dropdown -->
                <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 mt-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-white">📊 Detailed Lesson Analytics</h3>
                        <button id="toggleDetailedAnalytics" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                            ▼ Show Details
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
                    <h3 class="text-lg font-semibold text-blue-300 mb-2">📊 Understanding Your Analytics</h3>
                    <ul class="text-sm text-neutral-300 space-y-2">
                        <li>• <strong>Time Spent:</strong> Total hours/minutes spent on the platform</li>
                        <li>• <strong>Lessons Viewed:</strong> Number of unique lessons you've accessed</li>
                        <li>• <strong>Code Executions:</strong> Number of times you ran code in the code runner</li>
                        <li>• <strong>Interaction Rate:</strong> Percentage of time spent actively clicking, typing, scrolling vs idle</li>
                        <li>• <strong>Scroll Depth:</strong> Average percentage of page content you scroll through</li>
                        <li>• <strong>Detailed Analytics:</strong> Per-lesson breakdown with scroll depth, clicks, idle time, and more</li>
                    </ul>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Add event listener for detailed analytics toggle
        const toggleBtn = document.getElementById('toggleDetailedAnalytics');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const detailedContainer = document.getElementById('detailedAnalyticsContainer');
                if (detailedContainer.classList.contains('hidden')) {
                    detailedContainer.classList.remove('hidden');
                    toggleBtn.textContent = '▲ Hide Details';
                    loadDetailedAnalytics();
                } else {
                    detailedContainer.classList.add('hidden');
                    toggleBtn.textContent = '▼ Show Details';
                }
            });
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
                            <span class="ml-4 text-neutral-500">▼</span>
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
            'cs-portfolio-quest': '💻 CS Portfolio Quest',
            'digital-famine': '🎬 Digital Famine',
            'west-coast': '🌴 West Coast Adventure',
            'plagiarism': '📋 Plagiarism Detective'
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
                    ← Back to Summary
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
                            ${questData.questCompleted ? '✓ Completed' : 'In Progress'}
                        </div>
                    </div>
                </div>

                <!-- Copy-Paste Analysis -->
                <div class="bg-orange-900/20 border border-orange-700/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-orange-300 mb-2">📋 Copy-Paste Activity</h3>
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

    // Expose to global scope
    window.OCSAnalytics = {
        loadAnalyticsSummary: loadAnalyticsSummary,
        loadQuestDetails: loadQuestDetails
    };

    // Auto-load on init
    return { loadAnalyticsSummary };
}
