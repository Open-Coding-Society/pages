/**
 * OCS Analytics Dashboard Module
 * Displays analytics and engagement metrics for the Open Coding Society
 * 
 * Architecture: Single Responsibility Principle + API Chaining
 * - API Functions: Handle HTTP requests with specific error types
 * - Validation Functions: Validate data structures before processing
 * - Rendering Functions: Pure HTML generation (no side effects)
 * - Orchestrators: Coordinate workflows with async/await
 */

export async function initOCSAnalyticsDashboard(pythonURI, javaURI, fetchOptions) {
    
    // ============================================================
    // STATE MANAGEMENT
    // ============================================================
    let currentUser = null;
    let allUsersData = null;
    let adminFilters = {
        startDate: null,
        endDate: null,
        minSessions: 0,
        maxSessions: Infinity,
        minTimeSpent: 0,
        maxTimeSpent: Infinity,
        sortBy: 'time',
        sortOrder: 'desc',
        searchQuery: '',
        viewMode: 'table'
    };

    // ============================================================
    // ERROR HANDLING SYSTEM: Typed Errors with User Messages
    // ============================================================
    const ERROR_TYPES = {
        AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
        INVALID_USER_DATA: 'INVALID_USER_DATA',
        HTTP_ERROR: 'HTTP_ERROR',
        ANALYTICS_FETCH_FAILED: 'ANALYTICS_FETCH_FAILED',
        DETAILED_ANALYTICS_FAILED: 'DETAILED_ANALYTICS_FAILED',
        QUEST_DETAILS_FAILED: 'QUEST_DETAILS_FAILED',
        GLOBAL_STATS_FAILED: 'GLOBAL_STATS_FAILED',
        USERS_SUMMARY_FAILED: 'USERS_SUMMARY_FAILED',
        QUEST_STATS_FAILED: 'QUEST_STATS_FAILED',
        USER_SUMMARY_FAILED: 'USER_SUMMARY_FAILED'
    };

    const ERROR_MESSAGES = {
        [ERROR_TYPES.AUTHENTICATION_REQUIRED]: 'Please sign in to view analytics.',
        [ERROR_TYPES.INVALID_USER_DATA]: 'Unable to verify your identity.',
        [ERROR_TYPES.HTTP_ERROR]: (statusCode) => `Server error (${statusCode}). Please try again.`,
        [ERROR_TYPES.ANALYTICS_FETCH_FAILED]: 'Failed to load your analytics. Please refresh and try again.',
        [ERROR_TYPES.DETAILED_ANALYTICS_FAILED]: 'Error loading detailed analytics.',
        [ERROR_TYPES.QUEST_DETAILS_FAILED]: 'Error loading quest details.',
        [ERROR_TYPES.GLOBAL_STATS_FAILED]: 'Failed to load global statistics.',
        [ERROR_TYPES.USERS_SUMMARY_FAILED]: 'Failed to load users summary.',
        [ERROR_TYPES.QUEST_STATS_FAILED]: 'Failed to load quest statistics.',
        [ERROR_TYPES.USER_SUMMARY_FAILED]: (userId) => `Failed to load user ${userId} summary.`,
        DEFAULT: 'An unexpected error occurred.'
    };
    
    // ============================================================
    // API CALL FUNCTIONS: Single Responsibility - Only Fetch Data
    // ============================================================

    /**
     * RESPONSIBILITY: Fetch current user identity from Python backend
     * PARAMETERS: (none)
     * ALGORITHM: 1) Fetch UID from Python, 2) Parse JSON
     * RETURN: User UID
     * ERROR: Throws AUTHENTICATION_REQUIRED or HTTP_ERROR
     */
    async function fetchUserIdFromPython() {
        const response = await fetch(`${pythonURI}/api/id`, fetchOptions);
        
        if (response.status === 401) {
            throw new Error(ERROR_TYPES.AUTHENTICATION_REQUIRED);
        }
        
        if (!response.ok) {
            throw new Error(`${ERROR_TYPES.HTTP_ERROR}_${response.status}`);
        }
        
        const data = await response.json();
        return data.uid;
    }

    /**
     * RESPONSIBILITY: Fetch person object from Spring backend by UID
     * PARAMETERS: uid - user's unique identifier
     * ALGORITHM: 1) Fetch from Spring, 2) Parse JSON
     * RETURN: Person object
     * ERROR: Throws AUTHENTICATION_REQUIRED or HTTP_ERROR
     */
    async function fetchPersonFromSpring(uid) {
        const response = await fetch(`${javaURI}/api/person/uid/${uid}`, fetchOptions);
        
        if (response.status === 401) {
            throw new Error(ERROR_TYPES.AUTHENTICATION_REQUIRED);
        }
        
        if (!response.ok) {
            throw new Error(`${ERROR_TYPES.HTTP_ERROR}_${response.status}`);
        }
        
        return response.json();
    }

    /**
     * RESPONSIBILITY: Fetch user's analytics summary from Spring backend
     * PARAMETERS: (none)
     * ALGORITHM: 1) Fetch summary endpoint, 2) Parse JSON
     * RETURN: Analytics summary object
     * ERROR: Throws HTTP_ERROR or ANALYTICS_FETCH_FAILED
     */
    async function fetchAnalyticsSummary() {
        const response = await fetch(`${javaURI}/api/ocs-analytics/user/summary`, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`${ERROR_TYPES.HTTP_ERROR}_${response.status}`);
        }
        
        return response.json();
    }

    /**
     * RESPONSIBILITY: Fetch detailed per-lesson analytics
     * PARAMETERS: (none)
     * ALGORITHM: 1) Fetch detailed endpoint, 2) Parse JSON
     * RETURN: Array of session objects
     * ERROR: Throws HTTP_ERROR or DETAILED_ANALYTICS_FAILED
     */
    async function fetchDetailedAnalytics() {
        const response = await fetch(`${javaURI}/api/ocs-analytics/user/detailed`, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`${ERROR_TYPES.HTTP_ERROR}_${response.status}`);
        }
        
        return response.json();
    }

    /**
     * RESPONSIBILITY: Fetch analytics for specific quest
     * PARAMETERS: questName - name of the quest
     * ALGORITHM: 1) Fetch quest endpoint, 2) Parse JSON
     * RETURN: Quest analytics object
     * ERROR: Throws HTTP_ERROR or QUEST_DETAILS_FAILED
     */
    async function fetchQuestAnalytics(questName) {
        const response = await fetch(`${javaURI}/api/ocs-analytics/user/quest/${questName}`, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`${ERROR_TYPES.HTTP_ERROR}_${response.status}`);
        }
        
        return response.json();
    }

    /**
     * RESPONSIBILITY: Fetch global admin statistics
     * PARAMETERS: (none)
     * ALGORITHM: 1) Fetch global stats endpoint, 2) Parse JSON
     * RETURN: Global statistics object
     * ERROR: Throws HTTP_ERROR or GLOBAL_STATS_FAILED
     */
    async function fetchGlobalStats() {
        const response = await fetch(`${javaURI}/api/ocs-analytics/admin/global-stats`, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`${ERROR_TYPES.HTTP_ERROR}_${response.status}`);
        }
        
        return response.json();
    }

    /**
     * RESPONSIBILITY: Fetch all users summary for admin dashboard
     * PARAMETERS: (none)
     * ALGORITHM: 1) Fetch users summary endpoint, 2) Parse JSON
     * RETURN: Array of user summary objects
     * ERROR: Throws HTTP_ERROR or USERS_SUMMARY_FAILED
     */
    async function fetchAllUsersSummary() {
        const response = await fetch(`${javaURI}/api/ocs-analytics/admin/all-users-summary`, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`${ERROR_TYPES.HTTP_ERROR}_${response.status}`);
        }
        
        return response.json();
    }

    /**
     * RESPONSIBILITY: Fetch quest statistics for all quests
     * PARAMETERS: (none)
     * ALGORITHM: 1) Fetch quest stats endpoint, 2) Parse JSON
     * RETURN: Quest statistics object
     * ERROR: Throws HTTP_ERROR or QUEST_STATS_FAILED
     */
    async function fetchQuestStats() {
        const response = await fetch(`${javaURI}/api/ocs-analytics/admin/quest-stats`, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`${ERROR_TYPES.HTTP_ERROR}_${response.status}`);
        }
        
        return response.json();
    }

    // ============================================================
    // VALIDATION FUNCTIONS: Single Responsibility - Validate Data
    // ============================================================

    /**
     * RESPONSIBILITY: Validate user data structure
     * PARAMETERS: personData - object to validate
     * ALGORITHM: 1) Check required fields exist
     * RETURN: Validated person object
     * THROWS: INVALID_USER_DATA on validation failure
     */
    function validateUserIdentity(personData) {
        if (!personData || !personData.id || !personData.uid) {
            throw new Error(ERROR_TYPES.INVALID_USER_DATA);
        }
        return personData;
    }

    /**
     * RESPONSIBILITY: Validate analytics summary structure
     * PARAMETERS: summary - object to validate
     * ALGORITHM: 1) Check basic structure is present
     * RETURN: Validated summary object
     * THROWS: INVALID_USER_DATA on validation failure
     */
    function validateAnalyticsSummary(summary) {
        if (!summary || typeof summary !== 'object') {
            throw new Error(ERROR_TYPES.INVALID_USER_DATA);
        }
        return summary;
    }

    // ============================================================
    // ERROR HANDLING: Single Responsibility - Map Errors to Messages
    // ============================================================

    /**
     * RESPONSIBILITY: Convert error to user-friendly message
     * PARAMETERS: error - Error object
     * ALGORITHM: 1) Check error type, 2) Return appropriate message
     * RETURN: User-friendly error message string
     * ABSTRACTION: Hides error type logic from UI rendering
     */
    function getErrorMessage(error) {
        if (error.message.startsWith(ERROR_TYPES.HTTP_ERROR)) {
            const statusCode = error.message.split('_')[1];
            return ERROR_MESSAGES[ERROR_TYPES.HTTP_ERROR](statusCode);
        }
        
        if (ERROR_MESSAGES[error.message]) {
            return ERROR_MESSAGES[error.message];
        }
        
        return ERROR_MESSAGES.DEFAULT;
    }

    /**
     * RESPONSIBILITY: Determine error styling based on severity
     * PARAMETERS: errorType - type of error
     * ALGORITHM: 1) Check error severity, 2) Return CSS class
     * RETURN: CSS color class string
     */
    function getErrorColorClass(errorType) {
        if (errorType === ERROR_TYPES.AUTHENTICATION_REQUIRED) {
            return 'text-gray-400';
        }
        return 'text-red-400';
    }

    // ============================================================
    // UTILITY & CALCULATION FUNCTIONS
    // ============================================================
    
    /**
     * Check if current user is admin
     */
    function isAdmin() {
        if (!currentUser || !currentUser.roles) return false;
        return currentUser.roles.some(role => role.name === 'ROLE_ADMIN');
    }
    
    /**
     * Calculate engagement score (0-100)
     */
    function calculateEngagementScore(user) {
        const weights = {
            time: 0.25,
            sessions: 0.2,
            lessons: 0.2,
            interaction: 0.2,
            accuracy: 0.15
        };
        
        const timeScore = Math.min((user.totalTimeSpentSeconds || 0) / 3600 * 10, 100);
        const sessionScore = Math.min((user.totalSessions || 0) * 5, 100);
        const lessonScore = Math.min((user.totalLessonsViewed || 0) * 3, 100);
        const interactionScore = user.interactionPercentage || 0;
        const accuracyScore = user.averageAccuracyPercentage || 0;
        
        return Math.round(
            timeScore * weights.time +
            sessionScore * weights.sessions +
            lessonScore * weights.lessons +
            interactionScore * weights.interaction +
            accuracyScore * weights.accuracy
        );
    }
    
    /**
     * Format duration in readable format
     */
    function formatDuration(seconds) {
        if (!seconds) return '0s';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
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
     * Get trend indicator comparing value to average
     */
    function getTrendIndicator(value, avgValue) {
        if (!value || !avgValue) return 'stable';
        const percentDiff = ((value - avgValue) / avgValue) * 100;
        if (percentDiff > 10) return 'up';
        if (percentDiff < -10) return 'down';
        return 'stable';
    }

    /**
     * Get color based on accuracy percentage
     */
    function getAccuracyColor(accuracy) {
        if (accuracy >= 80) return '#10b981';
        if (accuracy >= 60) return '#3b82f6';
        if (accuracy >= 40) return '#f59e0b';
        return '#ef4444';
    }

    /**
     * Calculate idle time based on session duration and interactions
     */
    function calculateIdleTime(session) {
        const totalSeconds = session.sessionDurationSeconds || 0;
        const interactionCount = (session.mouseClicksCount || 0) + 
                               (session.keyboardInputEvents || 0) + 
                               (session.hoverEventsCount || 0);
        const estimatedActiveSeconds = Math.min(interactionCount, totalSeconds);
        const idleSeconds = Math.max(0, totalSeconds - estimatedActiveSeconds);
        return formatDuration(idleSeconds);
    }

    /**
     * Export users data to CSV
     */
    function exportToCSV(users, filename = 'analytics-export.csv') {
        if (!users || users.length === 0) {
            alert('No data to export');
            return;
        }
        
        const headers = ['Name', 'Email', 'UID', 'Sessions', 'Time Spent', 'Lessons', 'Code Runs', 'Engagement Score', 'Accuracy', 'Interaction'];
        const rows = users.map(u => [
            u.name || 'N/A',
            u.email || 'N/A',
            u.uid || 'N/A',
            u.totalSessions || 0,
            u.totalTimeFormatted || '0m',
            u.totalLessonsViewed || 0,
            u.totalCodeExecutions || 0,
            calculateEngagementScore(u),
            (u.averageAccuracyPercentage || 0).toFixed(1) + '%',
            (u.interactionPercentage || 0).toFixed(1) + '%'
        ]);
        
        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // ============================================================
    // RENDERING FUNCTIONS: Pure Functions - Generate HTML Only
    // ============================================================

    /**
     * RESPONSIBILITY: Build loading spinner HTML
     * PARAMETERS: message - display message
     * RETURN: HTML string with spinner
     * ABSTRACTION: Pure function, no DOM side effects
     */
    function buildLoadingHTML(message) {
        return `
            <div class="flex items-center justify-center min-h-[400px]">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p class="text-neutral-300">${message}</p>
                </div>
            </div>
        `;
    }

    /**
     * RESPONSIBILITY: Build error display HTML
     * PARAMETERS: message - error message, colorClass - CSS color class
     * RETURN: HTML string with error message
     * ABSTRACTION: Pure function, hides error styling logic
     */
    function buildErrorHTML(message, colorClass = 'text-red-400') {
        return `
            <div class="text-center py-8 space-y-4">
                <p class="${colorClass}">${message}</p>
                <p class="text-xs text-neutral-500">Check the browser console (F12) for more details.</p>
                <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                    Retry
                </button>
            </div>
        `;
    }

    /**
     * RESPONSIBILITY: Render key metrics cards HTML
     * PARAMETERS: summary - analytics summary data
     * RETURN: HTML string with metrics grid
     * ABSTRACTION: Pure HTML generation based on data
     */
    function buildMetricsHTML(summary) {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                    <h3 class="text-neutral-300 font-medium">Total Time Spent</h3>
                    <div class="text-3xl font-bold text-white mt-2">${summary.totalTimeFormatted || '0h'}</div>
                    <p class="text-xs text-neutral-500 mt-2">${summary.totalTimeSpentSeconds || 0} seconds total</p>
                </div>
                <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                    <h3 class="text-neutral-300 font-medium">Lessons Viewed</h3>
                    <div class="text-3xl font-bold text-white mt-2">${summary.totalLessonsViewed || 0}</div>
                    <p class="text-xs text-neutral-500 mt-2">unique lessons</p>
                </div>
                <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                    <h3 class="text-neutral-300 font-medium">Lessons Completed</h3>
                    <div class="text-3xl font-bold text-white mt-2">${summary.totalLessonsCompleted || 0}</div>
                    <p class="text-xs text-neutral-500 mt-2">marked as complete</p>
                </div>
                <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                    <h3 class="text-neutral-300 font-medium">Code Executions</h3>
                    <div class="text-3xl font-bold text-white mt-2">${summary.totalCodeExecutions || 0}</div>
                    <p class="text-xs text-neutral-500 mt-2">code runs</p>
                </div>
                <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                    <h3 class="text-neutral-300 font-medium">Interaction Rate</h3>
                    <div class="text-3xl font-bold text-white mt-2">${(summary.interactionPercentage || 0).toFixed(1)}%</div>
                    <p class="text-xs text-neutral-500 mt-2">active engagement</p>
                </div>
                <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                    <h3 class="text-neutral-300 font-medium">Scroll Depth</h3>
                    <div class="text-3xl font-bold text-white mt-2">${(summary.averageScrollDepth || 0).toFixed(0)}%</div>
                    <p class="text-xs text-neutral-500 mt-2">average per lesson</p>
                </div>
            </div>
        `;
    }

    /**
     * Render detailed analytics container
     */
    function buildDetailedAnalyticsContainerHTML() {
        return `
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
        `;
    }

    /**
     * Render help section
     */
    function buildHelpSectionHTML() {
        return `
            <div class="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6 mt-6">
                <h3 class="text-lg font-semibold text-blue-300 mb-2">Understanding Your Analytics</h3>
                <ul class="text-sm text-neutral-300 space-y-2">
                    <li>• <strong>Time Spent:</strong> Total hours/minutes spent on the platform</li>
                    <li>• <strong>Lessons Viewed:</strong> Number of unique lessons you've accessed</li>
                    <li>• <strong>Lessons Completed:</strong> Number of lessons marked as complete</li>
                    <li>• <strong>Code Executions:</strong> Number of times you ran code</li>
                    <li>• <strong>Interaction Rate:</strong> Percentage of time spent actively interacting</li>
                    <li>• <strong>Scroll Depth:</strong> Average percentage of page content scrolled</li>
                </ul>
            </div>
        `;
    }

    /**
     * RESPONSIBILITY: Render detailed per-lesson analytics list
     * PARAMETERS: sessions - array of session objects
     * RETURN: HTML string with session details
     */
    function buildDetailedSessionsHTML(sessions) {
        if (!sessions || sessions.length === 0) {
            return `<p class="text-neutral-400 text-center py-8">No detailed analytics available yet.</p>`;
        }

        return `
            <div class="space-y-3">
                ${sessions.map((session) => `
                    <div class="bg-neutral-900 rounded border border-neutral-700 overflow-hidden">
                        <button class="w-full text-left p-4 hover:bg-neutral-800 transition flex items-center justify-between" onclick="this.parentElement.querySelector('.session-details').classList.toggle('hidden')">
                            <div class="flex-1">
                                <div class="font-semibold text-white">${session.pageTitle || session.lessonNumber || 'Unnamed'}</div>
                                <div class="text-sm text-neutral-400">${session.questName ? formatQuestName(session.questName) : 'General'}</div>
                            </div>
                            <div class="text-sm text-neutral-400">${formatDuration(session.sessionDurationSeconds)}</div>
                        </button>
                        <div class="session-details hidden bg-neutral-950 px-4 py-3 border-t border-neutral-700 space-y-2 text-sm">
                            <div class="grid grid-cols-2 gap-3">
                                <div><span class="text-neutral-500">Time Spent:</span> <span class="text-white font-semibold">${formatDuration(session.sessionDurationSeconds)}</span></div>
                                <div><span class="text-neutral-500">Scroll:</span> <span class="text-white font-semibold">${(session.scrollDepthPercentage || 0).toFixed(0)}%</span></div>
                                <div><span class="text-neutral-500">Clicks:</span> <span class="text-white font-semibold">${session.mouseClicksCount || 0}</span></div>
                                <div><span class="text-neutral-500">Keystrokes:</span> <span class="text-white font-semibold">${session.keyboardInputEvents || 0}</span></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Lookup and display UI element
     */
    function displayErrorToUser(containerElement, message, colorClass = 'text-red-400') {
        if (!containerElement) return;
        containerElement.innerHTML = buildErrorHTML(message, colorClass);
    }

    // ============================================================
    // ORCHESTRATOR FUNCTIONS: Coordinate API Calls + Rendering
    // ============================================================

    /**
     * ORCHESTRATOR: Load current user identity and cache it
     * ALGORITHM:
     * 1) Fetch UID from Python
     * 2) Fetch person from Spring using UID
     * 3) Validate person data
     * 4) Cache in currentUser
     * 5) Return person object OR throw on error
     */
    async function loadCurrentUser() {
        try {
            const uid = await fetchUserIdFromPython();
            const person = await fetchPersonFromSpring(uid);
            validateUserIdentity(person);
            currentUser = person;
            return person;
        } catch (error) {
            console.error('Error loading current user:', error);
            throw error;
        }
    }

    /**
     * ORCHESTRATOR: Load and display user analytics summary
     * ALGORITHM:
     * 1) Show loading state
     * 2) Load current user (authentication)
     * 3) Fetch analytics summary
     * 4) Validate summary
     * 5) Render to container
     * 6) Setup event listeners
     */
    async function loadAnalyticsSummary() {
        const container = document.getElementById('tab-content-ocs-analytics');
        if (!container) return;
        
        container.innerHTML = buildLoadingHTML('Loading your OCS analytics...');
        
        try {
            // Step 1: Authenticate user (throws if not logged in)
            await loadCurrentUser();
            
            // Step 2: Fetch analytics data
            const summary = await fetchAnalyticsSummary();
            validateAnalyticsSummary(summary);
            
            // Step 3: Render to UI
            renderAnalyticsSummary(container, summary);
            
        } catch (error) {
            console.error('Error loading analytics:', error);
            const userMessage = getErrorMessage(error);
            const colorClass = getErrorColorClass(error.message);
            displayErrorToUser(container, userMessage, colorClass);
        }
    }

    /**
     * ORCHESTRATOR: Load and display detailed analytics
     */
    async function loadDetailedAnalytics() {
        const container = document.getElementById('detailedAnalyticsContainer');
        if (!container) return;
        
        try {
            container.innerHTML = buildLoadingHTML('Loading detailed analytics...');
            const sessions = await fetchDetailedAnalytics();
            container.innerHTML = buildDetailedSessionsHTML(sessions);
        } catch (error) {
            console.error('Error loading detailed analytics:', error);
            const userMessage = getErrorMessage(error);
            container.innerHTML = `<p class="text-red-400">${userMessage}</p>`;
        }
    }

    /**
     * ORCHESTRATOR: Load and display quest details
     */
    async function loadQuestDetails(questName) {
        const container = document.getElementById('tab-content-ocs-analytics');
        if (!container) return;
        
        container.innerHTML = buildLoadingHTML(`Loading ${formatQuestName(questName)} details...`);
        
        try {
            const questData = await fetchQuestAnalytics(questName);
            renderQuestDetails(container, questData);
        } catch (error) {
            console.error('Error loading quest details:', error);
            const userMessage = getErrorMessage(error);
            displayErrorToUser(container, userMessage);
        }
    }

    /**
     * ORCHESTRATOR: Load admin dashboard
     */
    async function loadAdminAnalytics(container) {
        container.innerHTML = buildLoadingHTML('Loading admin dashboard...');
        
        try {
            const stats = await fetchGlobalStats();
            renderAdminOverview(container, stats);
        } catch (error) {
            console.error('Error loading admin analytics:', error);
            const userMessage = getErrorMessage(error);
            displayErrorToUser(container, userMessage);
        }
    }

    // ============================================================
    // RENDER FUNCTIONS: Update DOM with Pre-Built HTML
    // ============================================================
    
    /**
     * RESPONSIBILITY: Render analytics summary to DOM and setup listeners
     * PARAMETERS: container - DOM element, summary - analytics data
     * ALGORITHM: 
     * 1) Build admin tabs HTML if user is admin
     * 2) Build metrics grid
     * 3) Build detailed analytics section
     * 4) Render to container
     * 5) Setup event listeners for tabs
     */
    function renderAnalyticsSummary(container, summary) {
        const adminTabHTML = isAdmin() ? `
            <div class="flex gap-2 mb-6 border-b border-neutral-700">
                <button id="tab-user-analytics" class="analytics-tab px-4 py-3 border-b-2 border-blue-500 text-white font-semibold active">My Analytics</button>
                <button id="tab-admin-analytics" class="analytics-tab px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white font-semibold">🔧 Admin Dashboard</button>
            </div>
        ` : '';

        const html = `
            ${adminTabHTML}
            <div id="user-analytics-view">
                <div class="space-y-6">
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-2">Open Coding Society Analytics</h2>
                        <p class="text-neutral-400">Your engagement metrics across all quests and modules</p>
                    </div>
                    ${buildMetricsHTML(summary)}
                    ${buildDetailedAnalyticsContainerHTML()}
                    ${buildHelpSectionHTML()}
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
        
        // Setup detailed analytics toggle
        document.getElementById('toggleDetailedAnalytics')?.addEventListener('click', (e) => {
            const detailedContainer = document.getElementById('detailedAnalyticsContainer');
            const isHidden = detailedContainer.classList.contains('hidden');
            
            if (isHidden) {
                detailedContainer.classList.remove('hidden');
                e.target.textContent = 'Hide Details';
                loadDetailedAnalytics();
            } else {
                detailedContainer.classList.add('hidden');
                e.target.textContent = 'Show Details';
            }
        });
    }

    /**
     * Switch to user analytics view
     */
    function switchToUserAnalytics() {
        const userView = document.getElementById('user-analytics-view');
        const adminView = document.getElementById('admin-analytics-view');
        const userTab = document.getElementById('tab-user-analytics');
        const adminTab = document.getElementById('tab-admin-analytics');
        
        userView?.classList.remove('hidden');
        adminView?.classList.add('hidden');
        userTab?.classList.add('border-blue-500', 'text-white');
        userTab?.classList.remove('border-transparent', 'text-neutral-400');
        adminTab?.classList.remove('border-blue-500', 'text-white');
        adminTab?.classList.add('border-transparent', 'text-neutral-400');
    }

    /**
     * Switch to admin analytics view
     */
    async function switchToAdminAnalytics() {
        const adminView = document.getElementById('admin-analytics-view');
        const userView = document.getElementById('user-analytics-view');
        const userTab = document.getElementById('tab-user-analytics');
        const adminTab = document.getElementById('tab-admin-analytics');
        
        userView?.classList.add('hidden');
        adminView?.classList.remove('hidden');
        userTab?.classList.remove('border-blue-500', 'text-white');
        userTab?.classList.add('border-transparent', 'text-neutral-400');
        adminTab?.classList.add('border-blue-500', 'text-white');
        adminTab?.classList.remove('border-transparent', 'text-neutral-400');
        
        if (adminView && !adminView.innerHTML) {
            await loadAdminAnalytics(adminView);
        }
    }

    /**
     * Render quest-specific analytics to DOM
     */
    function renderQuestDetails(container, questData) {
        const html = `
            <div class="space-y-6">
                <button onclick="window.OCSAnalytics.loadAnalyticsSummary()" class="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    ← Back to Summary
                </button>
                <div>
                    <h2 class="text-2xl font-bold text-white">${formatQuestName(questData.questName)}</h2>
                    <p class="text-neutral-400">${questData.sessionCount || 0} session(s) recorded</p>
                </div>
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
                                        <th class="text-left py-2">Module</th>
                                    </tr>
                                </thead>
                                <tbody class="text-neutral-300">
                                    ${questData.sessions.slice(0, 10).map(session => `
                                        <tr class="border-b border-neutral-700/50 hover:bg-neutral-700/30">
                                            <td class="py-2">${new Date(session.sessionStartTime).toLocaleDateString()}</td>
                                            <td class="py-2">${formatSeconds(session.sessionDurationSeconds)}</td>
                                            <td class="py-2">${session.lessonsViewed || 0}</td>
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

    // ============================================================
    // ADMIN ANALYTICS FUNCTIONS
    // ============================================================

    /**
     * Render admin overview with global statistics
     */
    async function renderAdminOverview(container, stats) {
        const html = `
            <div class="space-y-6">
                <div class="flex gap-2 mb-6 flex-wrap">
                    <button id="admin-overview-btn" class="admin-nav-btn px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition active font-medium">
                        Dashboard Overview
                    </button>
                    <button id="admin-users-btn" class="admin-nav-btn px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition font-medium">
                        User Analytics
                    </button>
                    <button id="admin-quests-btn" class="admin-nav-btn px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition font-medium">
                        Quest Performance
                    </button>
                </div>
                <div id="admin-content">${buildAdminOverviewContent(stats)}</div>
            </div>
        `;

        container.innerHTML = html;

        document.getElementById('admin-overview-btn')?.addEventListener('click', () => showAdminTab('overview'));
        document.getElementById('admin-users-btn')?.addEventListener('click', () => showAdminTab('users'));
        document.getElementById('admin-quests-btn')?.addEventListener('click', () => showAdminTab('quests'));
    }

    /**
     * Build admin overview content HTML
     */
    function buildAdminOverviewContent(stats) {
        return `
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
    }

    /**
     * Show admin tab content with async loading
     */
    async function showAdminTab(tab) {
        const contentDiv = document.getElementById('admin-content');
        const buttons = document.querySelectorAll('.admin-nav-btn');
        
        buttons.forEach(btn => {
            btn.classList.remove('bg-blue-600');
            btn.classList.add('bg-neutral-700');
        });

        try {
            if (tab === 'overview') {
                document.getElementById('admin-overview-btn')?.classList.add('bg-blue-600');
                document.getElementById('admin-overview-btn')?.classList.remove('bg-neutral-700');
                const stats = await fetchGlobalStats();
                contentDiv.innerHTML = buildAdminOverviewContent(stats);
            } else if (tab === 'users') {
                document.getElementById('admin-users-btn')?.classList.add('bg-blue-600');
                document.getElementById('admin-users-btn')?.classList.remove('bg-neutral-700');
                contentDiv.innerHTML = buildLoadingHTML('Loading users...');
                const users = await fetchAllUsersSummary();
                renderAdminUsersTable(contentDiv, users);
            } else if (tab === 'quests') {
                document.getElementById('admin-quests-btn')?.classList.add('bg-blue-600');
                document.getElementById('admin-quests-btn')?.classList.remove('bg-neutral-700');
                contentDiv.innerHTML = buildLoadingHTML('Loading quests...');
                const quests = await fetchQuestStats();
                renderAdminQuestsTable(contentDiv, quests);
            }
        } catch (error) {
            console.error('Error loading admin tab:', error);
            const userMessage = getErrorMessage(error);
            contentDiv.innerHTML = buildErrorHTML(userMessage);
        }
    }

    /**
     * Apply filters to users data
     */
    function applyUserFilters(users) {
        if (!users) return [];
        
        let filtered = [...users];
        
        if (adminFilters.searchQuery) {
            const query = adminFilters.searchQuery.toLowerCase();
            filtered = filtered.filter(u => {
                const name = (u.name || '').toLowerCase();
                const email = (u.email || '').toLowerCase();
                return name.includes(query) || email.includes(query);
            });
        }
        
        filtered = filtered.filter(u => {
            const sessions = u.totalSessions || 0;
            return sessions >= adminFilters.minSessions && sessions <= adminFilters.maxSessions;
        });
        
        filtered.sort((a, b) => {
            let aVal, bVal;
            switch(adminFilters.sortBy) {
                case 'time': aVal = a.totalTimeSpentSeconds || 0; bVal = b.totalTimeSpentSeconds || 0; break;
                case 'engagement': aVal = calculateEngagementScore(a); bVal = calculateEngagementScore(b); break;
                case 'sessions': aVal = a.totalSessions || 0; bVal = b.totalSessions || 0; break;
                case 'lessons': aVal = a.totalLessonsViewed || 0; bVal = b.totalLessonsViewed || 0; break;
                case 'accuracy': aVal = a.averageAccuracyPercentage || 0; bVal = b.averageAccuracyPercentage || 0; break;
                default: aVal = a.totalTimeSpentSeconds || 0; bVal = b.totalTimeSpentSeconds || 0;
            }
            return adminFilters.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        });
        
        return filtered;
    }

    /**
     * Render admin users table with filters
     */
    function renderAdminUsersTable(container, users) {
        if (!users || users.length === 0) {
            container.innerHTML = '<p class="text-neutral-400">No users found</p>';
            return;
        }

        allUsersData = users;
        const filteredUsers = applyUserFilters(users);
        const avgEngagement = users.reduce((sum, u) => sum + calculateEngagementScore(u), 0) / users.length;

        const html = `
            <div class="space-y-6">
                ${renderFilterPanel()}
                <div class="bg-neutral-900 rounded-lg p-4 mb-4 flex items-center justify-between">
                    <p class="text-neutral-400 text-sm">Showing <span class="text-white font-semibold">${filteredUsers.length}</span> of <span class="text-white font-semibold">${users.length}</span> users</p>
                    <span class="text-sm text-neutral-400"><span class="text-blue-400 font-semibold">${((filteredUsers.length / users.length) * 100).toFixed(1)}%</span> match filters</span>
                </div>
                ${filteredUsers.length === 0 ? `<p class="text-neutral-400">No users match filters</p>` : (adminFilters.viewMode === 'table' ? renderUsersTableView(filteredUsers, avgEngagement) : renderUsersCardView(filteredUsers, avgEngagement))}
            </div>
        `;
        container.innerHTML = html;
        setupFilterListeners(() => renderAdminUsersTable(container, users));
    }

    /**
     * Build filter panel HTML
     */
    function renderFilterPanel() {
        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
        
        return `
            <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-white">Advanced Filters</h3>
                    <div class="flex gap-2">
                        <button id="view-toggle-table" class="view-toggle-btn px-3 py-1 bg-blue-600 text-white rounded text-sm transition active">Table View</button>
                        <button id="view-toggle-cards" class="view-toggle-btn px-3 py-1 bg-neutral-700 text-white rounded text-sm transition">Card View</button>
                        <button id="export-csv-btn" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition">Export CSV</button>
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-sm text-neutral-300 mb-2">Search Users</label>
                    <input type="text" id="filter-search" class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded text-sm placeholder-neutral-400" placeholder="Search by name or email..." />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label class="block text-sm text-neutral-300 mb-2">Min Sessions</label>
                        <input type="number" id="filter-min-sessions" class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded text-sm" value="0" min="0" />
                    </div>
                    <div>
                        <label class="block text-sm text-neutral-300 mb-2">Sort By</label>
                        <select id="filter-sort-by" class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded text-sm">
                            <option value="time">Time Spent</option>
                            <option value="engagement">Engagement Score</option>
                            <option value="sessions">Sessions</option>
                            <option value="lessons">Lessons</option>
                            <option value="accuracy">Accuracy</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm text-neutral-300 mb-2">Order</label>
                        <select id="filter-sort-order" class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded text-sm">
                            <option value="desc">Highest First</option>
                            <option value="asc">Lowest First</option>
                        </select>
                    </div>
                </div>
                <div class="mt-4 flex gap-2">
                    <button id="apply-filters-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">Apply Filters</button>
                    <button id="reset-filters-btn" class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition">Reset</button>
                </div>
            </div>
        `;
    }

    /**
     * Setup filter event listeners
     */
    function setupFilterListeners(onApply) {
        const applyBtn = document.getElementById('apply-filters-btn');
        const resetBtn = document.getElementById('reset-filters-btn');
        const searchInput = document.getElementById('filter-search');
        const exportBtn = document.getElementById('export-csv-btn');
        const tableToggle = document.getElementById('view-toggle-table');
        const cardsToggle = document.getElementById('view-toggle-cards');
        
        applyBtn?.addEventListener('click', () => {
            adminFilters.minSessions = parseInt(document.getElementById('filter-min-sessions').value) || 0;
            adminFilters.sortBy = document.getElementById('filter-sort-by').value;
            adminFilters.sortOrder = document.getElementById('filter-sort-order').value;
            onApply();
        });
        
        searchInput?.addEventListener('input', (e) => {
            adminFilters.searchQuery = e.target.value;
            onApply();
        });
        
        if (exportBtn && allUsersData) {
            exportBtn.addEventListener('click', () => {
                const filtered = applyUserFilters(allUsersData);
                exportToCSV(filtered, `users-analytics-${new Date().toISOString().split('T')[0]}.csv`);
            });
        }
        
        tableToggle?.addEventListener('click', () => {
            adminFilters.viewMode = 'table';
            tableToggle.classList.add('bg-blue-600');
            tableToggle.classList.remove('bg-neutral-700');
            cardsToggle?.classList.add('bg-neutral-700');
            cardsToggle?.classList.remove('bg-blue-600');
            onApply();
        });
        
        cardsToggle?.addEventListener('click', () => {
            adminFilters.viewMode = 'cards';
            cardsToggle.classList.add('bg-blue-600');
            cardsToggle.classList.remove('bg-neutral-700');
            tableToggle?.classList.add('bg-neutral-700');
            tableToggle?.classList.remove('bg-blue-600');
            onApply();
        });
        
        resetBtn?.addEventListener('click', () => {
            adminFilters = {
                startDate: null, endDate: null, minSessions: 0, maxSessions: Infinity,
                minTimeSpent: 0, maxTimeSpent: Infinity, sortBy: 'time', sortOrder: 'desc',
                searchQuery: '', viewMode: 'table'
            };
            document.getElementById('filter-min-sessions').value = '0';
            document.getElementById('filter-sort-by').value = 'time';
            document.getElementById('filter-sort-order').value = 'desc';
            document.getElementById('filter-search').value = '';
            onApply();
        });
    }

    /**
     * Render users as table
     */
    function renderUsersTableView(users, avgEngagement) {
        return `
            <div class="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-neutral-700 bg-neutral-900/50">
                                <th class="px-6 py-4 text-left text-neutral-300 font-semibold">User</th>
                                <th class="px-6 py-4 text-center text-neutral-300 font-semibold">Engagement</th>
                                <th class="px-6 py-4 text-center text-neutral-300 font-semibold">Sessions</th>
                                <th class="px-6 py-4 text-center text-neutral-300 font-semibold">Time Spent</th>
                                <th class="px-6 py-4 text-center text-neutral-300 font-semibold">Accuracy</th>
                                <th class="px-6 py-4 text-center text-neutral-300 font-semibold">Lessons</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => {
                                const engScore = calculateEngagementScore(user);
                                const trend = getTrendIndicator(engScore, avgEngagement);
                                const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
                                const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-neutral-400';
                                return `
                                    <tr class="border-b border-neutral-700 hover:bg-neutral-700/30 transition">
                                        <td class="px-6 py-4">
                                            <p class="text-white font-medium">${user.name || 'N/A'}</p>
                                            <p class="text-xs text-neutral-400">${user.email || 'N/A'}</p>
                                        </td>
                                        <td class="px-6 py-4 text-center">
                                            <div class="flex items-center justify-center gap-2">
                                                <span class="px-2 py-1 rounded text-xs font-bold bg-blue-900/40 text-blue-300">${engScore}/100</span>
                                                <span class="${trendColor} font-bold">${trendSymbol}</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-center text-white font-semibold">${user.totalSessions || 0}</td>
                                        <td class="px-6 py-4 text-center text-white">${user.totalTimeFormatted || '0m'}</td>
                                        <td class="px-6 py-4 text-center">
                                            <span class="px-2 py-1 rounded text-xs font-semibold" style="background: ${getAccuracyColor(user.averageAccuracyPercentage || 0)}20; color: ${getAccuracyColor(user.averageAccuracyPercentage || 0)}">
                                                ${(user.averageAccuracyPercentage || 0).toFixed(1)}%
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-center text-white">${user.totalLessonsViewed || 0}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * Render users as cards
     */
    function renderUsersCardView(users, avgEngagement) {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${users.map(user => {
                    const engScore = calculateEngagementScore(user);
                    const trend = getTrendIndicator(engScore, avgEngagement);
                    const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
                    const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-neutral-400';
                    
                    return `
                        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-5 hover:border-neutral-600 transition">
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <h4 class="text-white font-semibold">${user.name || 'N/A'}</h4>
                                    <p class="text-xs text-neutral-400">${user.email || 'N/A'}</p>
                                </div>
                                <div class="text-right">
                                    <div class="flex items-center gap-1 ${trendColor}">
                                        <span class="font-bold text-lg">${engScore}</span>
                                        <span class="font-bold">${trendSymbol}</span>
                                    </div>
                                    <p class="text-xs text-neutral-400">Score</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-700">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-blue-300">${user.totalSessions || 0}</p>
                                    <p class="text-xs text-neutral-400">Sessions</p>
                                </div>
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-green-300">${user.totalTimeFormatted || '0m'}</p>
                                    <p class="text-xs text-neutral-400">Time</p>
                                </div>
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-orange-300">${user.totalLessonsViewed || 0}</p>
                                    <p class="text-xs text-neutral-400">Lessons</p>
                                </div>
                                <div class="text-center">
                                    <p class="text-2xl font-bold" style="color: ${getAccuracyColor(user.averageAccuracyPercentage || 0)}">${(user.averageAccuracyPercentage || 0).toFixed(0)}%</p>
                                    <p class="text-xs text-neutral-400">Accuracy</p>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
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
        questList.sort((a, b) => (b[1].totalSessions || 0) - (a[1].totalSessions || 0));

        const totalSessions = questList.reduce((sum, [_, data]) => sum + (data.totalSessions || 0), 0);
        const totalCompletions = questList.reduce((sum, [_, data]) => sum + (data.totalCompletions || 0), 0);
        const avgCompletion = totalSessions > 0 ? (totalCompletions / totalSessions) * 100 : 0;
        
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
                        <h4 class="text-neutral-300 text-xs font-semibold mb-2">Total Completions</h4>
                        <div class="text-2xl font-bold text-purple-300">${totalCompletions}</div>
                    </div>
                    <div class="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-700/50 rounded-lg p-4">
                        <h4 class="text-neutral-300 text-xs font-semibold mb-2">Avg Completion</h4>
                        <div class="text-2xl font-bold text-orange-300">${avgCompletion.toFixed(1)}%</div>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${questList.map(([name, data]) => {
                        const completionRate = (data.totalSessions || 0) > 0 ? ((data.totalCompletions || 0) / (data.totalSessions || 0)) * 100 : 0;
                        const avgTimePerSession = (data.totalSessions || 0) > 0 ? (data.totalTimeSpentSeconds || 0) / (data.totalSessions || 0) : 0;
                        const difficulty = completionRate >= 80 ? 'Easy' : completionRate >= 50 ? 'Medium' : 'Challenging';
                        const diffColor = completionRate >= 80 ? 'text-green-400' : completionRate >= 50 ? 'text-yellow-400' : 'text-red-400';
                        
                        return `
                            <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition">
                                <div class="flex items-start justify-between mb-4">
                                    <h3 class="text-lg font-semibold text-white">${name}</h3>
                                    <div class="text-right">
                                        <div class="text-2xl font-bold text-green-400">${completionRate.toFixed(1)}%</div>
                                        <p class="text-xs text-neutral-400">Complete</p>
                                    </div>
                                </div>
                                <div class="mb-4 pb-4 border-b border-neutral-700">
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${diffColor} bg-neutral-700/50">
                                        ${difficulty}
                                    </span>
                                </div>
                                <div class="space-y-3 text-sm">
                                    <div class="flex items-center justify-between">
                                        <span class="text-neutral-400">Sessions</span>
                                        <span class="text-white font-semibold">${data.totalSessions || 0}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-neutral-400">Users</span>
                                        <span class="text-white font-semibold">${data.uniqueUsers || 0}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-neutral-400">Avg Time</span>
                                        <span class="text-white font-semibold">${Math.floor(avgTimePerSession / 60)}m</span>
                                    </div>
                                </div>
                                <div class="pt-4 border-t border-neutral-700 mt-4">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-neutral-400 text-sm">Completion</span>
                                        <span class="text-green-400 text-sm font-semibold">${data.totalCompletions || 0} / ${data.totalSessions || 0}</span>
                                    </div>
                                    <div class="w-full bg-neutral-700/50 rounded-full h-2 overflow-hidden">
                                        <div class="bg-gradient-to-r from-green-500 to-emerald-400 h-full" style="width: ${Math.min(completionRate, 100)}%"></div>
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

    // ============================================================
    // PUBLIC API: Export orchestrator functions to window scope
    // ============================================================
    
    window.OCSAnalytics = {
        loadAnalyticsSummary,
        loadQuestDetails
    };

    return { loadAnalyticsSummary };
}
