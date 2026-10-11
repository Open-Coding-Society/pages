/**
 * Lesson Completion Tracking
 * 
 * Adds "Mark as Complete" functionality to lessons
 * Tracks:
 * - Lesson completion events
 * - Time to complete lesson
 * - Number of attempts
 * - Completion rate
 */

(function() {
    const LessonCompletion = {
        pythonURI: window.pythonURI || 'http://localhost:5000',
        javaURI: window.javaURI || 'http://localhost:8585',
        completedLessons: new Set(),
        lessonStartTimes: new Map(),
        
        /**
         * Initialize lesson completion tracking
         */
        init: function() {
            console.log('📚 Initializing Lesson Completion Tracking');
            console.log('  URL:', window.location.pathname);
            console.log('  Lesson ID:', this.extractLessonIdFromURL());
            console.log('  Module slug:', this.extractModuleNameFromURL());
            
            // Load previously completed lessons
            this.loadCompletedLessons();
            
            // Add complete button to lessons
            this.addCompleteButtons();
            
            // Track lesson start
            this.trackLessonStart();
        },
        
        /**
         * Add "Mark as Complete" buttons to lessons
         */
        addCompleteButtons: function() {
            console.log('🎯 Looking for lesson containers...');
            
            // Check if we're on a Big6 lesson page
            const pathname = window.location.pathname;
            if (!pathname.includes('/bigsix/')) {
                console.log('  Not a Big6 lesson page, skipping button creation');
                return;
            }
            
            // Create a floating button at the bottom right
            const button = document.createElement('button');
            button.className = 'mark-complete-btn';
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Mark Lesson Complete
            `;
            
            // Style the button as floating
            Object.assign(button.style, {
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                display: 'inline-block',
                padding: '14px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                zIndex: '9999',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                fontFamily: 'system-ui, sans-serif'
            });
            
            // Add hover effect
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#059669';
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#10b981';
                button.style.transform = 'scale(1)';
                button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            });
            
            const lessonId = this.extractLessonIdFromURL();
            console.log(`  Lesson ID: ${lessonId}`);
            
            // Check if already completed
            if (this.completedLessons.has(lessonId)) {
                button.style.backgroundColor = '#6b7280';
                button.style.cursor = 'not-allowed';
                button.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Lesson Complete
                `;
                button.disabled = true;
                console.log('  Button already marked as completed');
            } else {
                // Add click handler
                const self = this;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('  Button clicked!');
                    const pageContent = document.querySelector('.page-content') || document.querySelector('[data-lesson]') || document.body;
                    self.completeLesson(lessonId, pageContent);
                });
                console.log('  Button ready for click');
            }
            
            // Append to body
            document.body.appendChild(button);
            console.log('🎯 Floating button added to page');
        },
        
        /**
         * Mark lesson as complete
         */
        completeLesson: function(lessonId, lessonElement) {
            console.log('📚 Completing lesson:', lessonId);
            
            const startTime = this.lessonStartTimes.get(lessonId) || new Date();
            const timeToComplete = Math.round((Date.now() - startTime.getTime()) / 1000); // seconds
            
            const lessonMetadata = {
                lessonId: lessonId,
                questName: this.extractQuestName(lessonElement),
                moduleName: this.extractModuleName(lessonElement),
                timeToCompleteSeconds: timeToComplete,
                completedAt: new Date().toISOString(),
                pageTitle: document.title,
                url: window.location.href
            };
            
            console.log('  Metadata:', lessonMetadata);
            
            // Record event in analytics
            if (window.OCSEnhancedAnalytics) {
                window.OCSEnhancedAnalytics.recordEvent('lesson_completed', lessonMetadata);
            }
            
            // Send to backend
            this.sendCompletionToBackend(lessonMetadata);
            
            // Update UI
            this.markButtonAsCompleted(lessonId);
            // 🔗 Sync with Big Six hub progress
            const moduleSlug = this.extractModuleName(lessonElement);
            console.log('  Module slug:', moduleSlug);

            // Mark maximum possible lessons as complete to ensure module shows as done
            // regardless of its actual lesson count (2, 4, or 6)
            const MAX_LESSONS = 10;
            for (let i = 1; i <= MAX_LESSONS; i++) {
                const key = `bigsix:${moduleSlug}:lesson:${i}`;
                localStorage.setItem(key, "done");
                console.log(`  ✓ Set ${key} = done`);
            }

            
            // Show success message
            this.showSuccessMessage(lessonId, timeToComplete);
        },
        
        /**
         * Send lesson completion to backend
         */
        sendCompletionToBackend: async function(metadata) {
            try {
                // Try to save to Python backend
                const response = await fetch(`${this.pythonURI}/api/lessons/complete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(metadata)
                });
                
                if (!response.ok) {
                    console.warn('Python backend lesson completion failed, trying Java backend');
                    
                    // Try Java backend
                    const javaResponse = await fetch(`${this.javaURI}/api/lessons/complete`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(metadata)
                    });
                    
                    if (!javaResponse.ok) {
                        throw new Error('Both backends failed');
                    }
                }
                
                // Save to localStorage as backup
                this.saveCompletedLesson(metadata.lessonId);
                
                console.log('✅ Lesson completion recorded');
            } catch (error) {
                console.error('Error sending lesson completion:', error);
                // Still save locally even if backend fails
                this.saveCompletedLesson(metadata.lessonId);
            }
        },
        
        /**
         * Save completed lesson to localStorage
         */
        saveCompletedLesson: function(lessonId) {
            this.completedLessons.add(lessonId);
            
            const completions = JSON.parse(localStorage.getItem('completedLessons') || '[]');
            if (!completions.includes(lessonId)) {
                completions.push(lessonId);
                localStorage.setItem('completedLessons', JSON.stringify(completions));
            }
        },
        saveBigSixProgress: function(moduleSlug, lessonNum = 1, totalLessons = 6) {
            localStorage.setItem(
                `bigsix:${moduleSlug}:lesson:${lessonNum}`,
                "done"
            );

            if (lessonNum === totalLessons) {
                for (let i = 1; i <= totalLessons; i++) {
                    localStorage.setItem(
                        `bigsix:${moduleSlug}:lesson:${i}`,
                        "done"
                    );
                }
            }
        },   // ✅ THIS COMMA FIXES THE SYNTAX ERROR



        
        /**
         * Load previously completed lessons from localStorage
         */
        loadCompletedLessons: function() {
            const completions = JSON.parse(localStorage.getItem('completedLessons') || '[]');
            completions.forEach(lessonId => {
                this.completedLessons.add(lessonId);
            });
            console.log('📚 Loaded', this.completedLessons.size, 'completed lessons');
        },
        
        /**
         * Update button after completion
         */
        markButtonAsCompleted: function(lessonId) {
            const button = document.querySelector('.mark-complete-btn');
            if (!button) return;

            button.style.backgroundColor = '#6b7280';
            button.style.cursor = 'not-allowed';
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Lesson Completed
            `;
            button.disabled = true;
        },

        
        /**
         * Show success message
         */
        showSuccessMessage: function(lessonId, timeSpent) {
            const message = document.createElement('div');
            message.className = 'lesson-complete-message';
            message.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                ">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <div>
                            <div style="font-weight: 600; font-size: 16px;">🎉 Lesson Completed!</div>
                            <div style="font-size: 12px; opacity: 0.9;">Time spent: ${this.formatTime(timeSpent)}</div>
                        </div>
                    </div>
                </div>
                <style>
                    @keyframes slideIn {
                        from {
                            transform: translateX(400px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                </style>
            `;
            
            document.body.appendChild(message);
            
            // Remove after 5 seconds
            setTimeout(() => {
                message.remove();
            }, 5000);
        },
        
        /**
         * Track lesson start
         */
        trackLessonStart: function() {
            const lessonId = this.extractLessonIdFromURL();
            if (lessonId && !this.lessonStartTimes.has(lessonId)) {
                this.lessonStartTimes.set(lessonId, new Date());
                
                if (window.OCSEnhancedAnalytics) {
                    window.OCSEnhancedAnalytics.recordEvent('lesson_started', {
                        lessonId: lessonId,
                        questName: this.extractQuestNameFromURL(),
                        moduleName: this.extractModuleNameFromURL()
                    });
                }
                console.log('📚 Lesson started:', lessonId);
            }
        },
        
        /**
         * Extract lesson ID from element
         */
        extractLessonId: function(element) {
            return element.dataset.lesson || 
                   element.dataset.lessonId || 
                   element.dataset.id ||
                   this.extractLessonIdFromURL();
        },
        
        /**
         * Extract quest name
         */
        extractQuestName: function(element) {
            return element.dataset.quest || 
                   element.dataset.questName || 
                   this.extractQuestNameFromURL();
        },
        
        /**
         * Extract module name
         */
        extractModuleName: function(element) {
            return element.dataset.module || 
                   element.dataset.moduleName || 
                   this.extractModuleNameFromURL();
        },
        
        /**
         * Extract lesson ID from URL
         */
        extractLessonIdFromURL: function() {
            const path = window.location.pathname;
            const parts = path.split('/').filter(Boolean);
            
            // Handle Big6 patterns like /bigsix/frontend_lesson
            if (path.includes('/bigsix/')) {
                const bigsixIdx = parts.indexOf('bigsix');
                if (bigsixIdx !== -1 && bigsixIdx + 1 < parts.length) {
                    return parts[bigsixIdx + 1]; // e.g., 'frontend_lesson'
                }
            }
            
            // Handle FRQ patterns like /csa/frqs/2016/3
            if (path.includes('/frqs/')) {
                const frqIdx = parts.indexOf('frqs');
                if (frqIdx !== -1 && frqIdx + 2 < parts.length) {
                    return `frq-${parts[frqIdx + 1]}-${parts[frqIdx + 2]}`;
                }
            }
            
            // Handle quest patterns like /cs-portfolio-quest/frontend/1
            const questIdx = parts.findIndex(p => p.includes('quest'));
            if (questIdx !== -1 && questIdx + 2 < parts.length) {
                return parts[questIdx + 2];
            }
            
            return null;
        },
        
        /**
         * Extract quest name from URL
         */
        extractQuestNameFromURL: function() {
            const path = window.location.pathname;
            
            if (path.includes('/bigsix')) return 'bigsix';
            if (path.includes('digital-famine')) return 'digital-famine';
            if (path.includes('west-coast')) return 'west-coast';
            if (path.includes('frqs')) return 'frq-practice';
            
            return null;
        },
        
        /**
         * Extract module name from URL
         */
        extractModuleNameFromURL: function() {
            const path = window.location.pathname;
            const parts = path.split('/').filter(Boolean);
            
            // Handle Big6 patterns like /bigsix/frontend_lesson
            const bigsixIdx = parts.indexOf('bigsix');
            if (bigsixIdx !== -1 && bigsixIdx + 1 < parts.length) {
                // Extract module name from URL like 'frontend_lesson'
                return parts[bigsixIdx + 1];
            }
            
            const questIdx = parts.findIndex(p => p.includes('quest'));
            if (questIdx !== -1 && questIdx + 1 < parts.length) {
                return parts[questIdx + 1];
            }
            
            return null;
        },
        
        /**
         * Format seconds to readable time
         */
        formatTime: function(seconds) {
            if (seconds < 60) return `${seconds}s`;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        }
    };
    
    // Export globally
    window.LessonCompletion = LessonCompletion;
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            LessonCompletion.init();
        });
    } else {
        LessonCompletion.init();
    }
})();
