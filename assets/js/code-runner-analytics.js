/**
 * CODE_RUNNER Analytics Integration
 * 
 * Auto-detects FRQ pages and CODE_RUNNER code blocks
 * Tracks:
 * - Code copy/paste events
 * - Code execution attempts
 * - Compilation errors
 * - Test results
 */

(function() {
    const CodeRunnerAnalytics = {
        /**
         * Auto-initialize on any FRQ page with codemirror
         * Detects by: frq_number in page, codemirror editors, CODE_RUNNER comments
         */
        autoInit: function() {
            console.log('🎯 CODE_RUNNER Analytics: Auto-detecting FRQ pages...');
            
            // Check if this is an FRQ page (look for frq_number in page structure or classes)
            const isFRQPage = this.isFRQPage();
            
            if (!isFRQPage) {
                console.log('Not an FRQ page, skipping CODE_RUNNER analytics');
                return;
            }
            
            // Find all code blocks that have CODE_RUNNER comment
            this.hookAllCodeRunnerBlocks();
        },
        
        /**
         * Detect if current page is an FRQ lesson
         */
        isFRQPage: function() {
            // Check for Jekyll post with frq_number in frontmatter (look in page structure)
            // Methods:
            // 1. Check if page has codemirror textarea (indicator of code lesson)
            const hasCodeMirror = document.querySelector('.CodeMirror') || 
                                 document.querySelector('textarea[data-codemirror]') ||
                                 document.querySelector('.codemirror');
            
            // 2. Check page title or URL for 'frq'
            const isFRQTitle = document.title.toLowerCase().includes('frq') ||
                              window.location.pathname.includes('frq');
            
            // 3. Check for code blocks with CODE_RUNNER comment
            const hasCodeRunner = Array.from(document.querySelectorAll('pre, code')).some(el => 
                el.textContent.includes('// CODE_RUNNER:')
            );
            
            return hasCodeMirror || isFRQTitle || hasCodeRunner;
        },
        
        /**
         * Find and hook all CODE_RUNNER code blocks on the page
         */
        hookAllCodeRunnerBlocks: function() {
            // Look for code blocks containing "// CODE_RUNNER:" comment
            const codeBlocks = document.querySelectorAll('pre, code, [data-codemirror], .CodeMirror');
            let hooked = 0;
            
            codeBlocks.forEach((block, index) => {
                const text = block.textContent || block.innerText || '';
                
                // Check if this block has CODE_RUNNER comment
                if (text.includes('// CODE_RUNNER:')) {
                    console.log(`📌 Found CODE_RUNNER block #${index + 1}`);
                    this.hookCodeBlock(block, index);
                    hooked++;
                }
            });
            
            console.log(`✅ CODE_RUNNER Analytics: Hooked ${hooked} code block(s)`);
            
            // Also hook any CodeMirror instances found
            if (window.CodeMirror && window.CodeMirror.getAllCodeMirrors) {
                const editors = window.CodeMirror.getAllCodeMirrors();
                editors.forEach((cm, idx) => {
                    this.hookCodeMirrorEditor(cm, idx);
                });
            }
        },
        
        /**
         * Hook a single code block for copy/paste/execute tracking
         */
        hookCodeBlock: function(block, index) {
            // Wrap the block with tracking
            const blockId = `code-block-${index}`;
            block.id = blockId;
            block.dataset.codeRunner = 'true';
            
            // Track copy
            block.addEventListener('copy', (e) => {
                const selectedText = window.getSelection().toString();
                if (selectedText.length > 0) {
                    this.recordCodeCopy(selectedText, blockId);
                }
            });
        },
        
        /**
         * Hook CodeMirror editor instance
         */
        hookCodeMirrorEditor: function(cm, index) {
            console.log(`📝 Hooked CodeMirror editor #${index}`);
            
            const editorId = `codemirror-${index}`;
            
            // Track copy from editor
            cm.on('copy', (instance, event) => {
                const selectedText = instance.getSelection();
                if (selectedText) {
                    this.recordCodeCopy(selectedText, editorId);
                }
            });
            
            // Track execution (look for run button clicks)
            const parentContainer = cm.getWrapperElement().closest('.CodeMirror-container, [data-code-runner], pre, code') || 
                                   cm.getWrapperElement().parentElement;
            
            if (parentContainer) {
                const runButton = parentContainer.querySelector('[data-action="run"], .btn-run, button:contains("Run"), button:contains("Execute")');
                if (runButton) {
                    runButton.addEventListener('click', () => {
                        const code = cm.getValue();
                        this.recordCodeExecution(code, editorId);
                    });
                }
            }
        },
        
        /**
         * Record code copy event
         */
        recordCodeCopy: function(code, blockId) {
            if (!window.ENHANCED_ANALYTICS) {
                console.warn('Enhanced analytics not loaded');
                return;
            }
            
            console.log(`📋 CODE_RUNNER Copy: ${code.length} chars from ${blockId}`);
            
            ENHANCED_ANALYTICS.recordEvent('CODE_COPY', {
                source: 'code_runner',
                blockId: blockId,
                codeLength: code.length,
                snippet: code.substring(0, 100) + (code.length > 100 ? '...' : '')
            });
        },
        
        /**
         * Record code execution
         */
        recordCodeExecution: function(code, blockId) {
            if (!window.ENHANCED_ANALYTICS) {
                console.warn('Enhanced analytics not loaded');
                return;
            }
            
            console.log(`⚙️ CODE_RUNNER Execute from ${blockId}`);
            
            ENHANCED_ANALYTICS.recordEvent('CODE_EXECUTE', {
                source: 'code_runner',
                blockId: blockId,
                codeLength: code.length
            });
        }
                
                // Track copy events within editor
                editor.addEventListener('copy', (e) => {
                    const selected = window.getSelection().toString();
                    if (selected.length > 0) {
                        this.trackCopy(selected, {
                            language: this.currentLanguage,
                            codeLength: selected.length
                        });
                    }
                });
                
                // Track paste events within editor
                editor.addEventListener('paste', (e) => {
                    const pastedText = e.clipboardData.getData('text/plain');
                    this.trackPaste(pastedText, {
                        language: this.currentLanguage,
                        codeLength: pastedText.length
                    });
                });
            }
        },
        
        /**
         * Hook into CODE_RUNNER execution button
         */
        hookIntoExecutor: function() {
            const runButton = this.container.querySelector('[data-action="run"], .run-btn, button:contains("Run")');
            if (runButton) {
                runButton.addEventListener('click', () => {
                    this.startExecution();
                });
            }
        },
        
        /**
         * Hook into CODE_RUNNER results display
         */
        hookIntoResults: function() {
            // This would need to be called after execution completes
            // with results passed in
        },
        
        /**
         * Track code copy in CODE_RUNNER
         */
        trackCopy: function(code, metadata = {}) {
            if (window.OCSEnhancedAnalytics) {
                window.OCSEnhancedAnalytics.recordEvent('code_copy', {
                    source: 'code_runner_editor',
                    codeLength: code.length,
                    ...metadata,
                    codePreview: code.substring(0, 100) // First 100 chars
                });
            }
            console.log('📋 Code copied in editor:', code.length, 'characters');
        },
        
        /**
         * Track code paste in CODE_RUNNER
         */
        trackPaste: function(code, metadata = {}) {
            if (window.OCSEnhancedAnalytics) {
                window.OCSEnhancedAnalytics.recordEvent('code_paste', {
                    source: 'code_runner_editor',
                    codeLength: code.length,
                    ...metadata
                });
            }
            console.log('📌 Code pasted in editor:', code.length, 'characters');
        },
        
        /**
         * Track execution start
         */
        startExecution: function() {
            this.startTime = Date.now();
            this.executionCount++;
            
            if (window.OCSEnhancedAnalytics) {
                window.OCSEnhancedAnalytics.recordEvent('code_execute_start', {
                    source: 'code_runner',
                    language: this.currentLanguage,
                    codeLength: this.currentCode.length,
                    executionNumber: this.executionCount
                });
            }
            console.log('▶️ Code execution started');
        },
        
        /**
         * Track successful execution with results
         */
        trackSuccess: function(testsPassed, totalTests, output = '') {
            const executionTime = this.startTime ? Date.now() - this.startTime : 0;
            this.successCount++;
            
            if (window.OCSEnhancedAnalytics) {
                window.OCSEnhancedAnalytics.recordEvent('code_execute_success', {
                    source: 'code_runner',
                    language: this.currentLanguage,
                    executionTimeMs: executionTime,
                    testsPassed: testsPassed,
                    totalTests: totalTests,
                    score: (testsPassed / totalTests) * 100,
                    outputLength: output.length
                });
            }
            console.log('✅ Execution successful:', testsPassed, '/', totalTests, 'tests passed');
        },
        
        /**
         * Track execution error
         */
        trackError: function(error, errorType = 'unknown') {
            const executionTime = this.startTime ? Date.now() - this.startTime : 0;
            this.errorCount++;
            
            if (window.OCSEnhancedAnalytics) {
                window.OCSEnhancedAnalytics.recordEvent('code_execute_error', {
                    source: 'code_runner',
                    language: this.currentLanguage,
                    executionTimeMs: executionTime,
                    errorType: errorType,
                    errorMessage: error.toString().substring(0, 200),
                    codeLength: this.currentCode.length
                });
            }
            console.log('❌ Execution error:', errorType);
        },
        
        /**
         * Track FRQ submission
         */
        trackFRQSubmit: function(frqMetadata = {}) {
            if (window.OCSEnhancedAnalytics) {
                window.OCSEnhancedAnalytics.recordEvent('frq_submit', {
                    source: 'code_runner',
                    language: this.currentLanguage,
                    totalExecutions: this.executionCount,
                    successfulExecutions: this.successCount,
                    errorCount: this.errorCount,
                    codeLength: this.currentCode.length,
                    ...frqMetadata
                });
            }
            console.log('🎯 FRQ submitted');
        },
        
    };
    
    // Export globally
    window.CodeRunnerAnalytics = CodeRunnerAnalytics;
    
    // Auto-initialize when page loads
    // Detects FRQ pages automatically - no manual setup needed
    document.addEventListener('DOMContentLoaded', function() {
        // Wait for enhanced analytics to be ready
        if (window.ENHANCED_ANALYTICS) {
            CodeRunnerAnalytics.autoInit();
        } else {
            // Retry if not ready yet
            setTimeout(() => {
                if (window.ENHANCED_ANALYTICS) {
                    CodeRunnerAnalytics.autoInit();
                }
            }, 1000);
        }
    });
})();
