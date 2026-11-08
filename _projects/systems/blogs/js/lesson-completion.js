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
        completedLessons: new Set(),
        lessonStartTimes: new Map(),
        
        /**
         * Initialize lesson completion tracking
         */
        init: function() {
            console.log('📚 Initializing Lesson Completion Tracking');
            
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
            // Find lesson containers
            const lessons = document.querySelectorAll('[data-lesson], .lesson-content, .frq-container, .page-content');
            
            lessons.forEach(lesson => {
                // Skip if button already exists
                if (lesson.querySelector('.mark-complete-btn')) return;
                
                const lessonId = this.extractLessonId(lesson);
                if (!lessonId) return;
                
                // Create button
                const button = document.createElement('button');
                button.className = 'mark-complete-btn';
                button.dataset.lessonId = lessonId;
                button.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Mark Lesson Complete
                `;
                
                // Style the button
                Object.assign(button.style, {
                    display: 'inline-block',
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                });
                
                // Add hover effect. A completed (disabled) button can still get
                // mouseenter and mouseleave, so leave its gray color alone.
                button.addEventListener('mouseenter', () => {
                    if (button.disabled) return;
                    button.style.backgroundColor = '#059669';
                    button.style.transform = 'scale(1.05)';
                });
                button.addEventListener('mouseleave', () => {
                    if (!button.disabled) button.style.backgroundColor = '#10b981';
                    button.style.transform = 'scale(1)';
                });
                
                // Check if already completed
                if (this.completedLessons.has(lessonId)) {
                    button.classList.add('completed');
                    button.style.backgroundColor = '#6b7280';
                    button.style.cursor = 'not-allowed';
                    button.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Lesson Completed
                    `;
                    button.disabled = true;
                } else {
                    // Add click handler
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.completeLesson(lessonId);
                    });
                }
                
                // Append button at end of lesson
                lesson.appendChild(button);
            });
        },
        
        /**
         * Mark lesson as complete. Completion is kept in this browser only:
         * neither Flask nor Spring has an /api/lessons/complete route.
         */
        completeLesson: function(lessonId) {
            console.log('📚 Completing lesson:', lessonId);
            
            const startTime = this.lessonStartTimes.get(lessonId) || new Date();
            const timeToComplete = Math.round((Date.now() - startTime.getTime()) / 1000); // seconds
            
            this.saveCompletedLesson(lessonId);
            
            // Update UI
            this.markButtonAsCompleted(lessonId);
            
            // Show success message
            this.showSuccessMessage(lessonId, timeToComplete);
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
         * Update the lesson's buttons after completion. Each button carries its lesson's id,
         * so match the buttons themselves: on FRQ pages the first element with that id is
         * the button, which has no .mark-complete-btn inside it.
         */
        markButtonAsCompleted: function(lessonId) {
            document.querySelectorAll('.mark-complete-btn').forEach(button => {
                if (button.dataset.lessonId !== lessonId) return;
                button.classList.add('completed');
                button.style.backgroundColor = '#6b7280';
                button.style.cursor = 'not-allowed';
                button.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Lesson Completed
                `;
                button.disabled = true;
            });
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
         * Extract lesson ID from URL
         */
        extractLessonIdFromURL: function() {
            const path = window.location.pathname;
            const parts = path.split('/').filter(Boolean);
            
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
