/**
 * OCS Analytics Tracker
 * Tracks user engagement on the Open Coding Society learning platform
 * 
 * Metrics:
 * - Time spent on page/lesson
 * - Lessons and modules viewed
 * - Copy-paste attempts
 * - Video watch time
 * - Code executions
 * - Assessment performance
 * - Scroll depth
 * - User interactions (clicks, hovers, keyboard)
 */

(function() {
    // Configuration
    const CONFIG = {
        batchInterval: 30000, // Flush analytics every 30 seconds
        pageUnloadTimeout: 5000, // Wait 5s before sending on page unload
        enableDebug: false
    };

    // Analytics session state
    let analyticsState = {
        sessionStartTime: new Date(),
        lastSubmitTime: new Date(), // Track last submission time for duration calculation
        sessionEndTime: null,
        questName: null,
        moduleName: null,
        lessonNumber: null,
        pageTitle: null,
        pageUrl: window.location.href,
        maxScrollDepth: 0, // Track maximum scroll depth reached
        
        // Counters
        lessonsViewed: new Set(),
        modulesViewed: new Set(),
        videosWatched: 0,
        videosCompleted: 0,
        codeExecutions: 0,
        copyPasteAttempts: 0,
        questionsAnswered: 0,
        questionsCorrect: 0,
        exercisesAttempted: 0,
        exercisesCompleted: 0,
        assessmentsAttempted: 0,
        assessmentScores: [],
        
        // Engagement
        scrollDepthPercentage: 0,
        hoverEventsCount: 0,
        keyboardInputEvents: 0,
        mouseClicksCount: 0,
        
        // Performance
        pageLoadTimeMs: 0,
        timeoutErrors: 0,
        validationErrors: 0,
        
        // Module completion
        moduleCompleted: false,
        progressPercentage: 0,
        
        // Metadata
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };

    /**
     * Extract quest/module info from URL and page elements
     */
    function extractContentInfo() {
        const path = window.location.pathname;
        const title = document.title;
        
        // Try to get from URL pattern
        const parts = path.split('/').filter(Boolean);
        
        // Check for various quest patterns
        if (path.includes('cs-portfolio-quest')) {
            analyticsState.questName = 'cs-portfolio-quest';
            const questIdx = parts.indexOf('cs-portfolio-quest');
            if (questIdx + 1 < parts.length) {
                analyticsState.moduleName = parts[questIdx + 1];
            }
            if (questIdx + 2 < parts.length) {
                analyticsState.lessonNumber = parts[questIdx + 2];
            }
        } else if (path.includes('digital-famine')) {
            analyticsState.questName = 'digital-famine';
            const dfIdx = parts.indexOf('digital-famine');
            if (dfIdx + 1 < parts.length) {
                analyticsState.moduleName = parts[dfIdx + 1];
            }
        } else if (path.includes('west-coast')) {
            analyticsState.questName = 'west-coast';
            if (parts.includes('travel')) {
                analyticsState.moduleName = 'travel';
            }
        }
        
        // Try to get from page elements
        const lessonContainer = document.getElementById('lesson-container');
        if (lessonContainer) {
            analyticsState.lessonNumber = lessonContainer.dataset.lesson || analyticsState.lessonNumber;
        }
        
        const pageModule = document.querySelector('[data-module]');
        if (pageModule) {
            analyticsState.moduleName = pageModule.dataset.module || analyticsState.moduleName;
        }
        
        analyticsState.pageTitle = title;
    }

    /**
     * Track copy-paste attempts
     */
    function trackCopyPaste() {
        document.addEventListener('copy', function(e) {
            const selected = window.getSelection().toString();
            if (selected && selected.length > 0) {
                analyticsState.copyPasteAttempts++;
                debug('Copy-paste attempt tracked:', analyticsState.copyPasteAttempts);
            }
        });
    }

    /**
     * Track keyboard and mouse interactions
     */
    function trackInteractions() {
        document.addEventListener('keydown', function(e) {
            analyticsState.keyboardInputEvents++;
            
            // Track code execution shortcuts (Ctrl+Enter, Cmd+Enter)
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                analyticsState.codeExecutions++;
                debug('Code execution detected');
            }
        });

        document.addEventListener('click', function(e) {
            analyticsState.mouseClicksCount++;
            
            // Track code execution button clicks - catches all variations
            if (e.target.closest('[data-action="run"]') ||
                e.target.closest('.run-btn') ||
                e.target.closest('.code-runner-btn') ||
                e.target.closest('.execute-btn') ||
                e.target.closest('[onclick*="run"]') ||
                e.target.closest('[onclick*="execute"]') ||
                e.target.textContent.includes('Run') ||
                e.target.textContent.includes('Execute') ||
                e.target.closest('.code-runner')?.querySelector('[data-action="run"]') === e.target ||
                e.target.id?.includes('run') ||
                e.target.id?.includes('execute') ||
                e.target.className?.includes('run') ||
                e.target.className?.includes('execute')) {
                analyticsState.codeExecutions++;
                debug('Code execution button clicked');
            }
            
            // Track video clicks
            if (e.target.tagName === 'VIDEO' || 
                e.target.closest('video') ||
                e.target.closest('.video-player')) {
                analyticsState.videosWatched++;
                debug('Video click detected');
            }
            
            // Track exercise attempts
            if (e.target.closest('.exercise') || 
                e.target.closest('[data-exercise]') ||
                e.target.closest('.exercise-btn')) {
                analyticsState.exercisesAttempted++;
                debug('Exercise attempt tracked');
            }
            
            // Track assessment attempts
            if (e.target.closest('.assessment') || 
                e.target.closest('[data-assessment]') ||
                e.target.closest('.quiz')) {
                analyticsState.assessmentsAttempted++;
                debug('Assessment attempt tracked');
            }
        });

        document.addEventListener('mouseover', function(e) {
            analyticsState.hoverEventsCount++;
        });
    }

    /**
     * Track scroll depth
     */
    function trackScrollDepth() {
        window.addEventListener('scroll', function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            
            // Calculate how far down the user has scrolled (0-100%)
            const scrollPercent = Math.min(100, Math.round((scrollTop + windowHeight) / documentHeight * 100));
            
            // Track the maximum scroll depth reached
            if (scrollPercent > analyticsState.maxScrollDepth) {
                analyticsState.maxScrollDepth = scrollPercent;
                analyticsState.scrollDepthPercentage = scrollPercent;
            }
        }, { passive: true });
    }

    /**
     * Track lesson viewing
     */
    function trackLessonViewing() {
        const lessonContent = document.getElementById('lesson-container') || 
                             document.querySelector('.lesson-content');
        
        if (lessonContent) {
            analyticsState.lessonsViewed.add(analyticsState.lessonNumber || 'unknown');
        }
    }

    /**
     * Track module viewing
     */
    function trackModuleViewing() {
        if (analyticsState.moduleName) {
            analyticsState.modulesViewed.add(analyticsState.moduleName);
        }
    }

    /**
     * Track quiz/assessment answers
     */
    function trackAssessments() {
        // Listen for submit events in forms (quizzes)
        document.addEventListener('submit', function(e) {
            if (e.target.closest('.quiz') || 
                e.target.closest('[data-assessment]') ||
                e.target.closest('.assessment-form')) {
                
                analyticsState.questionsAnswered++;
                
                // Try to detect correct answers
                const correct = e.target.querySelector('[data-correct="true"]');
                if (correct && correct.checked) {
                    analyticsState.questionsCorrect++;
                }
                
                debug('Assessment response tracked');
            }
        });
    }

    /**
     * Track lesson completion
     */
    function trackLessonCompletion() {
        const completeBtn = document.getElementById('lessonCompleteButton') ||
                          document.getElementById('next-lesson-btn') ||
                          document.querySelector('[onclick*="markLessonComplete"]');
        
        if (completeBtn) {
            completeBtn.addEventListener('click', function() {
                analyticsState.moduleCompleted = true;
                analyticsState.progressPercentage = 100;
                debug('Lesson marked as complete');
            });
        }
    }

    /**
     * Track video completion
     */
    function trackVideoCompletion() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.addEventListener('ended', function() {
                analyticsState.videosCompleted++;
                debug('Video completed');
            });
        });
    }

    /**
     * Fetch user ID from API and prepare data for submission
     */
    async function getUserData() {
        try {
            const pythonURI = window.pythonURI || '/api';
            const javaURI = window.javaURI || '/api';
            
            // Try to get user from Python backend first
            let userId = null;
            try {
                const res = await fetch(pythonURI + '/api/id', {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    userId = data.id || null;
                }
            } catch (e) {
                debug('Could not fetch user ID from Python', e);
            }
            
            return userId;
        } catch (error) {
            debug('Error getting user data', error);
            return null;
        }
    }

    /**
     * Prepare analytics payload for submission
     */
    function preparePayload() {
        const now = new Date();
        // Calculate duration only since last submission, not from session start
        const durationSeconds = Math.round((now - analyticsState.lastSubmitTime) / 1000);
        
        // Calculate interaction percentage
        // Rough estimate: sum of all user interactions as percentage of session duration
        const totalInteractions = 
            (analyticsState.mouseClicksCount || 0) +
            (analyticsState.keyboardInputEvents || 0) +
            (analyticsState.hoverEventsCount || 0) +
            (analyticsState.codeExecutions || 0) * 5 + // Weight code execution higher
            (analyticsState.videosWatched || 0) * 10; // Weight video watching higher
        
        const interactionPercentage = durationSeconds > 0 
            ? Math.min(100, (totalInteractions / durationSeconds) * 10) // Normalized to reasonable %
            : 0;
        
        return {
            sessionStartTime: analyticsState.lastSubmitTime.toISOString(),
            sessionEndTime: now.toISOString(),
            sessionDurationSeconds: durationSeconds,
            
            // Content
            questName: analyticsState.questName,
            moduleName: analyticsState.moduleName,
            lessonNumber: analyticsState.lessonNumber,
            pageTitle: analyticsState.pageTitle,
            pageUrl: analyticsState.pageUrl,
            
            // User actions
            lessonsViewed: analyticsState.lessonsViewed.size,
            modulesViewed: analyticsState.modulesViewed.size,
            videosWatched: analyticsState.videosWatched,
            videosCompleted: analyticsState.videosCompleted,
            codeExecutions: analyticsState.codeExecutions,
            copyPasteAttempts: analyticsState.copyPasteAttempts,
            questionsAnswered: analyticsState.questionsAnswered,
            questionsCorrect: analyticsState.questionsCorrect,
            exercisesAttempted: analyticsState.exercisesAttempted,
            exercisesCompleted: analyticsState.exercisesCompleted,
            assessmentsAttempted: analyticsState.assessmentsAttempted,
            assessmentAverageScore: analyticsState.assessmentScores.length > 0 
                ? analyticsState.assessmentScores.reduce((a, b) => a + b, 0) / analyticsState.assessmentScores.length
                : 0,
            
            // Engagement
            scrollDepthPercentage: analyticsState.scrollDepthPercentage,
            interactionPercentage: interactionPercentage,
            hoverEventsCount: analyticsState.hoverEventsCount,
            keyboardInputEvents: analyticsState.keyboardInputEvents,
            mouseClicksCount: analyticsState.mouseClicksCount,
            
            // Performance & Status
            pageLoadTimeMs: performance.timing ? 
                (performance.timing.loadEventEnd - performance.timing.navigationStart) : 0,
            timeoutErrors: analyticsState.timeoutErrors,
            validationErrors: analyticsState.validationErrors,
            moduleCompleted: analyticsState.moduleCompleted,
            progressPercentage: analyticsState.progressPercentage,
            
            // Metadata
            userAgent: analyticsState.userAgent,
            referrer: analyticsState.referrer
        };
    }

    /**
     * Submit analytics to backend
     */
    async function submitAnalytics() {
        try {
            const javaURI = window.javaURI || '/api';
            const payload = preparePayload();
            
            // Only submit if there's meaningful data
            if (!analyticsState.questName && 
                analyticsState.codeExecutions === 0 && 
                analyticsState.keyboardInputEvents === 0 &&
                analyticsState.mouseClicksCount === 0) {
                debug('Skipping analytics submission - no meaningful activity');
                return;
            }
            
            const response = await fetch(javaURI + '/api/ocs-analytics/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                debug('Analytics submitted successfully');
                // Reset tracking counters and timers after successful submission
                analyticsState.lastSubmitTime = new Date();
                analyticsState.videosWatched = 0;
                analyticsState.videosCompleted = 0;
                analyticsState.codeExecutions = 0;
                analyticsState.copyPasteAttempts = 0;
                analyticsState.questionsAnswered = 0;
                analyticsState.questionsCorrect = 0;
                analyticsState.exercisesAttempted = 0;
                analyticsState.exercisesCompleted = 0;
                analyticsState.assessmentsAttempted = 0;
                analyticsState.assessmentScores = [];
                analyticsState.hoverEventsCount = 0;
                analyticsState.keyboardInputEvents = 0;
                analyticsState.mouseClicksCount = 0;
                analyticsState.timeoutErrors = 0;
                analyticsState.validationErrors = 0;
                analyticsState.maxScrollDepth = 0; // Reset scroll depth tracking
                // Note: Keep lessonsViewed and modulesViewed as they track across session
            } else {
                console.warn('Failed to submit analytics:', response.status);
            }
        } catch (error) {
            console.warn('Error submitting analytics:', error);
            // Silently fail - don't interrupt user experience
        }
    }

    /**
     * Initialize analytics tracking
     */
    function init() {
        debug('Initializing OCS Analytics Tracker');
        
        // Extract content info from URL and page
        extractContentInfo();
        
        // Set up tracking
        trackCopyPaste();
        trackInteractions();
        trackScrollDepth();
        trackLessonViewing();
        trackModuleViewing();
        trackAssessments();
        trackLessonCompletion();
        trackVideoCompletion();
        
        // Periodic submission
        setInterval(submitAnalytics, CONFIG.batchInterval);
        
        // Submit on page unload
        window.addEventListener('beforeunload', function() {
            // Use a short delay to allow submission before page closes
            submitAnalytics();
        });
    }

    /**
     * Debug logging
     */
    function debug(message, data = null) {
        if (CONFIG.enableDebug) {
            if (data) {
                console.log('[OCS Analytics]', message, data);
            } else {
                console.log('[OCS Analytics]', message);
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for testing
    window.OCSAnalytics = {
        getState: () => analyticsState,
        submitAnalytics: submitAnalytics,
        debug: (flag) => { CONFIG.enableDebug = flag; }
    };
})();
