/**
 * Enhanced OCS Analytics Tracker - Code Runner & Lesson Completion
 * 
 * Tracks:
 * - Copy/Paste in CODE_RUNNER editors
 * - Code executions in CODE_RUNNER
 * - Lesson completion events
 * - Event details with source context
 */

(function() {
    // Configuration
    const ENHANCED_CONFIG = {
        eventTrackingEnabled: true,
        trackCodeRunner: true,
        trackLessonCompletion: true,
        eventBatchInterval: 15000  // Send event batches every 15 seconds
    };
    
    // Use pythonURI and javaURI from global scope (defined in config.js)
    // They're available as window.pythonURI and window.javaURI

    // Enhanced analytics state - extends the main tracker
    let enhancedAnalyticsState = {
        events: [], // Array of detailed events
        uid: null, // User UID - will be fetched on init
        codeRunnerStats: {
            copyPastes: 0,
            codeExecutions: 0,
            errorCount: 0,
            successfulRuns: 0,
            averageExecutionTime: 0
        },
        lessonStats: {
            lessonsStarted: new Set(),
            lessonsCompleted: new Set(),
            timePerLesson: {}, // { lessonId: milliseconds }
            attemptsPerLesson: {} // { lessonId: count }
        }
    };

    /**
     * EVENT TYPES
     */
    const EVENT_TYPES = {
        // CODE_RUNNER events
        CODE_COPY: 'code_copy',
        CODE_PASTE: 'code_paste',
        CODE_EXECUTE: 'code_execute',
        CODE_ERROR: 'code_error',
        CODE_SUCCESS: 'code_success',
        
        // Lesson events
        LESSON_STARTED: 'lesson_started',
        LESSON_COMPLETED: 'lesson_completed',
        LESSON_ABANDONED: 'lesson_abandoned',
        
        // FRQ events
        FRQ_ATTEMPT: 'frq_attempt',
        FRQ_SUBMIT: 'frq_submit',
        FRQ_PASS: 'frq_pass',
        FRQ_FAIL: 'frq_fail',
        
        // Assessment events
        ASSESSMENT_START: 'assessment_start',
        ASSESSMENT_SUBMIT: 'assessment_submit'
    };

    /**
     * Track CODE_RUNNER copy events
     */
    function trackCodeRunnerCopy() {
        // Find all CODE_RUNNER containers
        const codeRunnerContainers = document.querySelectorAll('[data-code-runner], .code-runner, .code-editor');
        
        codeRunnerContainers.forEach(container => {
            container.addEventListener('copy', function(e) {
                const selected = window.getSelection().toString();
                if (selected.length > 0) {
                    recordEvent(EVENT_TYPES.CODE_COPY, {
                        source: 'code_runner',
                        codeLength: selected.length,
                        language: container.dataset.language || 'unknown',
                        containerId: container.id || container.className
                    });
                    
                    // Also track in global state
                    enhancedAnalyticsState.codeRunnerStats.copyPastes++;
                }
            });
        });
    }

    /**
     * Track CODE_RUNNER execution events
     */
    function trackCodeRunnerExecution() {
        // Hook into the code executor
        // This assumes CODE_RUNNER has a global function or event
        window.addEventListener('codeExecuted', function(e) {
            const detail = e.detail || {};
            
            recordEvent(EVENT_TYPES.CODE_EXECUTE, {
                source: 'code_runner',
                language: detail.language || 'java',
                codeLength: detail.codeLength || 0,
                executionTimeMs: detail.executionTime || 0
            });
            
            enhancedAnalyticsState.codeRunnerStats.codeExecutions++;
        });

        // Track code errors in CODE_RUNNER
        window.addEventListener('codeError', function(e) {
            const detail = e.detail || {};
            
            recordEvent(EVENT_TYPES.CODE_ERROR, {
                source: 'code_runner',
                errorType: detail.errorType || 'unknown',
                errorMessage: detail.message || '',
                line: detail.line || 0,
                column: detail.column || 0
            });
            
            enhancedAnalyticsState.codeRunnerStats.errorCount++;
        });

        // Track successful CODE_RUNNER executions (tests passed, etc.)
        window.addEventListener('codeSuccess', function(e) {
            const detail = e.detail || {};
            
            recordEvent(EVENT_TYPES.CODE_SUCCESS, {
                source: 'code_runner',
                testsPassed: detail.testsPassed || 0,
                totalTests: detail.totalTests || 0,
                score: detail.score || 0
            });
            
            enhancedAnalyticsState.codeRunnerStats.successfulRuns++;
        });
    }

    /**
     * Track lesson completion
     */
    function trackLessonCompletion() {
        // Look for "Mark as Complete" buttons
        const completeButtons = document.querySelectorAll('[data-action="complete-lesson"], .complete-lesson-btn, .mark-complete');
        
        completeButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const lessonId = btn.dataset.lessonId || extractLessonIdFromURL();
                const questName = btn.dataset.questName || extractQuestName();
                const moduleName = btn.dataset.moduleName || extractModuleName();
                
                recordEvent(EVENT_TYPES.LESSON_COMPLETED, {
                    source: 'lesson',
                    lessonId: lessonId,
                    questName: questName,
                    moduleName: moduleName,
                    timestamp: new Date().toISOString()
                });
                
                // Track in local state
                enhancedAnalyticsState.lessonStats.lessonsCompleted.add(lessonId);
                
                // Send completion to backend
                sendLessonCompletion(lessonId, questName, moduleName);
                
                console.log('📚 Lesson completed:', lessonId);
            });
        });
    }

    /**
     * Track FRQ attempts and submissions
     */
    function trackFRQAttempts() {
        // Hook into CODE_RUNNER FRQ execution
        window.addEventListener('frqAttempt', function(e) {
            const detail = e.detail || {};
            
            recordEvent(EVENT_TYPES.FRQ_ATTEMPT, {
                source: 'code_runner',
                frqNumber: detail.frqNumber || 0,
                year: detail.year || 0,
                questionNumber: detail.questionNumber || 0,
                testsPassed: detail.testsPassed || 0,
                totalTests: detail.totalTests || 0
            });
        });

        window.addEventListener('frqSubmit', function(e) {
            const detail = e.detail || {};
            
            recordEvent(EVENT_TYPES.FRQ_SUBMIT, {
                source: 'code_runner',
                frqNumber: detail.frqNumber || 0,
                score: detail.score || 0,
                codeLength: detail.codeLength || 0
            });
        });
    }

    /**
     * Record an event in the enhanced analytics state
     */
    function recordEvent(eventType, eventData) {
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            questName: eventData.questName || extractQuestName(),
            moduleName: eventData.moduleName || extractModuleName(),
            ...eventData
        };
        
        enhancedAnalyticsState.events.push(event);
        
        // Debug logging
        if (ENHANCED_CONFIG.eventTrackingEnabled) {
            console.log(`📊 Event recorded: ${eventType}`, event);
        }
        
        // If batch is getting large, send immediately
        if (enhancedAnalyticsState.events.length >= 10) {
            sendEventBatch();
        }
    }

    /**
     * Send event batch to backend
     */
    async function sendEventBatch() {
        if (enhancedAnalyticsState.events.length === 0) return;
        
        // Make sure we have a UID
        if (!enhancedAnalyticsState.uid) {
            console.warn('⚠️ No UID available, trying to fetch...');
            await fetchUserUID();
            if (!enhancedAnalyticsState.uid) {
                console.error('❌ Could not fetch user UID, events not sent');
                return;
            }
        }
        
        const batch = {
            uid: enhancedAnalyticsState.uid,
            events: enhancedAnalyticsState.events.map(e => ({
                type: e.type,
                source: e.source,
                timestamp: e.timestamp,
                quest_name: e.questName,
                module_name: e.moduleName,
                lesson_id: e.lessonId,
                details: {
                    codeLength: e.codeLength,
                    language: e.language,
                    containerId: e.containerId,
                    ...e
                }
            }))
        };
        
        try {
            const response = await fetch(`${window.javaURI}/api/ocs-analytics/events/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.jwt_java_spring || ''}`
                },
                credentials: 'include',
                body: JSON.stringify(batch)
            });
            
            if (response.ok) {
                // Clear sent events
                enhancedAnalyticsState.events = [];
                console.log('✅ Event batch sent successfully');
            } else {
                console.error('Failed to send event batch:', response.status);
            }
        } catch (error) {
            console.error('Error sending event batch:', error);
        }
    }

    /**
     * Send lesson completion to backend (Spring)
     */
    async function sendLessonCompletion(lessonId, questName, moduleName) {
        try {
            const response = await fetch(`${window.javaURI}/api/ocs-analytics/lesson-complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    lessonId: lessonId,
                    questName: questName,
                    moduleName: moduleName,
                    completedAt: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                console.error('Failed to send lesson completion:', response.status);
            }
        } catch (error) {
            console.error('Error sending lesson completion:', error);
        }
    }

    /**
     * Extract lesson ID from URL
     */
    function extractLessonIdFromURL() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        
        // Handle patterns like /cs-portfolio-quest/frontend/1
        const questIdx = parts.findIndex(p => p.includes('quest'));
        if (questIdx !== -1 && questIdx + 2 < parts.length) {
            return parts[questIdx + 2];
        }
        
        return null;
    }

    /**
     * Extract quest name from URL/page
     */
    function extractQuestName() {
        const path = window.location.pathname;
        
        if (path.includes('cs-portfolio-quest')) return 'cs-portfolio-quest';
        if (path.includes('digital-famine')) return 'digital-famine';
        if (path.includes('west-coast')) return 'west-coast';
        if (path.includes('frq')) return 'frq-practice';
        
        return null;
    }

    /**
     * Extract module name from URL/page
     */
    function extractModuleName() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        
        const questIdx = parts.findIndex(p => p.includes('quest'));
        if (questIdx !== -1 && questIdx + 1 < parts.length) {
            return parts[questIdx + 1];
        }
        
        return null;
    }

    /**
     * Fetch user UID from Python backend
     */
    async function fetchUserUID() {
        try {
            const response = await fetch(`${window.pythonURI}/api/id`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                enhancedAnalyticsState.uid = data.uid;
                console.log(`👤 User UID fetched: ${enhancedAnalyticsState.uid}`);
                return enhancedAnalyticsState.uid;
            }
        } catch (e) {
            console.warn('⚠️ Could not fetch user UID:', e);
        }
        return null;
    }

    /**
     * Initialize enhanced tracking
     */
    function initEnhancedTracking() {
        if (!ENHANCED_CONFIG.eventTrackingEnabled) return;
        
        console.log('🚀 Initializing enhanced analytics tracking...');
        
        // Fetch user UID first
        fetchUserUID();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                if (ENHANCED_CONFIG.trackCodeRunner) {
                    trackCodeRunnerCopy();
                    trackCodeRunnerExecution();
                    trackFRQAttempts();
                }
                
                if (ENHANCED_CONFIG.trackLessonCompletion) {
                    trackLessonCompletion();
                }
            });
        } else {
            if (ENHANCED_CONFIG.trackCodeRunner) {
                trackCodeRunnerCopy();
                trackCodeRunnerExecution();
                trackFRQAttempts();
            }
            
            if (ENHANCED_CONFIG.trackLessonCompletion) {
                trackLessonCompletion();
            }
        }
        
        // Send event batches periodically
        setInterval(sendEventBatch, ENHANCED_CONFIG.eventBatchInterval);
        
        // Send final batch on page unload
        window.addEventListener('beforeunload', function() {
            sendEventBatch();
        });
    }

    /**
     * Export for external use
     */
    window.OCSEnhancedAnalytics = {
        recordEvent: recordEvent,
        sendEventBatch: sendEventBatch,
        getStats: function() {
            return enhancedAnalyticsState;
        },
        setConfig: function(config) {
            Object.assign(ENHANCED_CONFIG, config);
        }
    };

    // Initialize when script loads
    initEnhancedTracking();
})();
