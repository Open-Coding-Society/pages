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

                    <!-- Copy-Paste Attempts -->
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-neutral-300 font-medium">Copy-Paste Attempts</h3>
                            <span class="text-orange-400">📋</span>
                        </div>
                        <div class="text-3xl font-bold text-white">${summary.totalCopyPasteAttempts || 0}</div>
                        <p class="text-xs text-neutral-500 mt-2">times copied content</p>
                    </div>

                    <!-- Average Accuracy -->
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-neutral-300 font-medium">Average Accuracy</h3>
                            <span class="text-yellow-400">✅</span>
                        </div>
                        <div class="text-3xl font-bold text-white">${(summary.averageAccuracyPercentage || 0).toFixed(1)}%</div>
                        <p class="text-xs text-neutral-500 mt-2">on assessments</p>
                    </div>

                    <!-- Quests Engaged -->
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-neutral-300 font-medium">Quests Engaged</h3>
                            <span class="text-red-400">🚀</span>
                        </div>
                        <div class="text-3xl font-bold text-white">${(summary.engagedQuests && summary.engagedQuests.length) || 0}</div>
                        <p class="text-xs text-neutral-500 mt-2">active quests</p>
                    </div>

                </div>

                <!-- Engaged Quests List -->
                ${summary.engagedQuests && summary.engagedQuests.length > 0 ? `
                    <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 mt-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Quests in Progress</h3>
                        <div class="space-y-3">
                            ${summary.engagedQuests.map((quest, idx) => `
                                <div class="flex items-center justify-between p-3 bg-neutral-900 rounded border border-neutral-700 hover:border-blue-600 transition cursor-pointer" onclick="window.OCSAnalytics.loadQuestDetails('${quest}')">
                                    <span class="text-neutral-300">${formatQuestName(quest)}</span>
                                    <span class="text-xs bg-blue-600 text-white px-2 py-1 rounded">View Details →</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Help Section -->
                <div class="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6 mt-6">
                    <h3 class="text-lg font-semibold text-blue-300 mb-2">📊 Understanding Your Analytics</h3>
                    <ul class="text-sm text-neutral-300 space-y-2">
                        <li>• <strong>Time Spent:</strong> Total hours/minutes spent on the platform</li>
                        <li>• <strong>Lessons Viewed:</strong> Number of unique lessons you've accessed</li>
                        <li>• <strong>Modules Viewed:</strong> Number of unique modules you've explored</li>
                        <li>• <strong>Copy-Paste Attempts:</strong> Number of times content was copied (for learning assessment)</li>
                        <li>• <strong>Average Accuracy:</strong> Your average score on quizzes and assessments</li>
                        <li>• <strong>Quests Engaged:</strong> Number of learning quests you've started</li>
                    </ul>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
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
