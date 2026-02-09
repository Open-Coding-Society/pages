---
layout: post
title: Edtech Documentation
author: Eshika Pallapotu
permalink: /tools-help/debugging
breadcrumb: True
---
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Run & Debug in CSA - Interactive Lesson</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --accent: #60a5fa;
            --text-primary: #e0e7ff;
            --text-muted: #94a3b8;
            --bg-1: #0f172a;
            --bg-2: #1e293b;
            --bg-3: #334155;
            --green: #34d399;
            --green-bg: rgba(52, 211, 153, 0.1);
            --panel: #1e293b;
        }

        .postman-sim {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 1rem;
            box-sizing: border-box;
        }

        .postman-section {
            display: flex;
            flex-direction: column;
            width: 100%;
            box-sizing: border-box;
        }

        .request-bar {
            display: flex;
            gap: 0.75rem;
            width: 100%;
            box-sizing: border-box;
            flex-wrap: wrap;
            align-items: center;
        }

        .method-btn {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            border: none;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            flex: 0 0 auto;
        }

        .method-btn.active {
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
        }

        .method-btn:hover {
            opacity: 0.8;
        }

        .url-input {
            padding: 0.5rem;
            border-radius: 4px;
            border: 1px solid var(--text-muted);
            background-color: var(--bg-2);
            color: var(--text-primary);
            font-size: 0.85rem;
            font-family: 'JetBrains Mono', monospace;
            flex: 1;
            min-width: 200px;
        }

        .send-btn {
            padding: 0.5rem 1.5rem;
            border-radius: 4px;
            border: none;
            background-color: var(--accent);
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            flex: 0 0 auto;
        }

        .send-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }

        .code-block {
            width: 100%;
            box-sizing: border-box;
            overflow-x: auto;
        }

        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .status-200 {
            background-color: rgba(52, 211, 153, 0.2);
            color: var(--green);
            border: 1px solid var(--green);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Run & Debug</h1>
        <p class="subtitle">Mastering Development Tools for AP Computer Science A</p>
    </div>

    <div class="container">
        <!-- Introduction -->
        <div class="section">
            <h2>Introduction to Debugging</h2>
            <p>Debugging is the systematic process of finding and fixing errors in code. In AP Computer Science A, you'll encounter three main types of errors: syntax errors (code that won't compile), runtime errors (code that crashes during execution), and logic errors (code that runs but produces incorrect results). Modern development environments provide powerful tools to help identify and resolve these issues efficiently.</p>
        </div>

        <!-- VS Code Section -->
        <div class="section">
            <h2>Run & Debug in VS Code</h2>
            <p>Visual Studio Code offers an integrated debugging environment that allows you to pause execution, inspect variables, and step through your code line by line.</p>
            
            <h3>Key Features:</h3>
            <div class="list-item">
                <strong>Breakpoints:</strong> Click the left margin to set a breakpoint. Execution pauses when reaching this line, allowing you to examine program state.
            </div>
            <div class="list-item">
                <strong>Watch Expressions:</strong> Monitor specific variables or expressions as your program executes to track how values change.
            </div>
            <div class="list-item">
                <strong>Call Stack:</strong> View the sequence of method calls that led to the current point of execution, essential for tracing program flow.
            </div>
            <div class="list-item">
                <strong>Step Controls:</strong> Step Over (F10) executes the current line, Step Into (F11) enters method calls, Step Out (Shift+F11) completes the current method.
            </div>

            <div class="code-block" data-lang="java">
<code><span class="keyword">public class</span> <span class="method">Calculator</span> {
    <span class="keyword">public static int</span> <span class="method">divide</span>(<span class="keyword">int</span> a, <span class="keyword">int</span> b) {
        <span class="comment">// Set breakpoint here to inspect values</span>
        <span class="keyword">return</span> a / b;  <span class="comment">// What if b is 0?</span>
    }
    
    <span class="keyword">public static void</span> <span class="method">main</span>(String[] args) {
        <span class="keyword">int</span> result = divide(<span class="number">10</span>, <span class="number">2</span>);
        System.out.println(<span class="string">"Result: "</span> + result);
    }
}</code>
            </div>
        </div>

        <!-- Postman Section -->
        <div class="section">
            <h2>Debugging with Postman</h2>
            <p>Postman is an API testing tool that allows you to send HTTP requests and examine responses without needing a frontend interface. This is crucial for debugging backend services in full-stack applications. You can test against public APIs (like v2.jokeapi.dev) or your local development server (like localhost:8585).</p>

            <h3>When to Use Postman:</h3>
            <div class="list-item">
                <strong>API Testing:</strong> Verify that your backend endpoints return correct data before integrating with the frontend.
            </div>
            <div class="list-item">
                <strong>Request Debugging:</strong> Test different HTTP methods (GET, POST, PUT, DELETE) with various headers and request bodies.
            </div>
            <div class="list-item">
                <strong>Response Validation:</strong> Inspect status codes, headers, and response bodies to ensure your API behaves correctly.
            </div>
            <div class="list-item">
                <strong>Public vs Local Testing:</strong> Test public APIs to verify integration patterns, then switch to localhost:8585 to debug your own implementation.
            </div>

            <div class="postman-sim">
                <div class="postman-section">
                    <h4 style="margin: 0 0 1rem 0; color: var(--text-primary); font-size: 0.95rem;">Input (Request)</h4>
                    <div class="request-bar">
                        <button class="method-btn active" onclick="switchMethod(this, 'GET')" style="background-color: #3b82f6;">GET</button>
                        <button class="method-btn" onclick="switchMethod(this, 'POST')" style="background-color: #10b981;">POST</button>
                        <button class="method-btn" onclick="switchMethod(this, 'PUT')" style="background-color: #f59e0b;">PUT</button>
                        <button class="method-btn" onclick="switchMethod(this, 'DELETE')" style="background-color: #ef4444;">DELETE</button>
                        <input type="text" class="url-input" id="url-display" value="https://v2.jokeapi.dev/joke/Any?safe-mode=true" readonly>
                        <button class="send-btn">Send</button>
                    </div>
                </div>
                <div class="postman-section">
                    <h4 style="margin: 1rem 0 0.5rem 0; color: var(--text-primary); font-size: 0.95rem;">Output (Response)</h4>
                    <span class="status-badge status-200" id="status-display">200 OK</span>
                    <div class="code-block" data-lang="json" style="margin-top: 0.5rem;" id="response-display">
<code>{
  <span class="string">"error"</span>: <span class="keyword">false</span>,
  <span class="string">"category"</span>: <span class="string">"Programming"</span>,
  <span class="string">"type"</span>: <span class="string">"twopart"</span>,
  <span class="string">"setup"</span>: <span class="string">"How did you make your friend rage?"</span>,
  <span class="string">"delivery"</span>: <span class="string">"I implemented a greek question mark in his JavaScript code."</span>,
  <span class="string">"flags"</span>: {
    <span class="string">"nsfw"</span>: <span class="keyword">false</span>,
    <span class="string">"religious"</span>: <span class="keyword">false</span>,
    <span class="string">"political"</span>: <span class="keyword">false</span>,
    <span class="string">"racist"</span>: <span class="keyword">false</span>,
    <span class="string">"sexist"</span>: <span class="keyword">false</span>,
    <span class="string">"explicit"</span>: <span class="keyword">false</span>
  },
  <span class="string">"id"</span>: <span class="number">146</span>,
  <span class="string">"safe"</span>: <span class="keyword">true</span>,
  <span class="string">"lang"</span>: <span class="string">"en"</span>
}</code>
                    </div>
                </div>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background-color: rgba(255, 255, 255, 0.05); border-radius: 6px; border-left: 3px solid var(--accent);">
                <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;"><strong>What's happening:</strong> Try clicking different HTTP methods above to see how the request URL and response change. GET retrieves a joke, POST would create new content, PUT updates existing data, and DELETE removes it. This demonstrates how the same API endpoint handles different operations based on the HTTP method used.</p>
            </div>

            <script>
                const apiEndpoints = {
                    GET: {
                        url: 'https://v2.jokeapi.dev/joke/Any?safe-mode=true',
                        response: `{
  <span class="string">"error"</span>: <span class="keyword">false</span>,
  <span class="string">"category"</span>: <span class="string">"Programming"</span>,
  <span class="string">"type"</span>: <span class="string">"twopart"</span>,
  <span class="string">"setup"</span>: <span class="string">"How did you make your friend rage?"</span>,
  <span class="string">"delivery"</span>: <span class="string">"I implemented a greek question mark in his JavaScript code."</span>,
  <span class="string">"flags"</span>: {
    <span class="string">"nsfw"</span>: <span class="keyword">false</span>,
    <span class="string">"religious"</span>: <span class="keyword">false</span>,
    <span class="string">"political"</span>: <span class="keyword">false</span>,
    <span class="string">"racist"</span>: <span class="keyword">false</span>,
    <span class="string">"sexist"</span>: <span class="keyword">false</span>,
    <span class="string">"explicit"</span>: <span class="keyword">false</span>
  },
  <span class="string">"id"</span>: <span class="number">146</span>,
  <span class="string">"safe"</span>: <span class="keyword">true</span>,
  <span class="string">"lang"</span>: <span class="string">"en"</span>
}`
                    },
                    POST: {
                        url: 'https://v2.jokeapi.dev/joke/submit',
                        response: `{
  <span class="string">"status"</span>: <span class="number">201</span>,
  <span class="string">"message"</span>: <span class="string">"Joke submitted successfully"</span>,
  <span class="string">"data"</span>: {
    <span class="string">"id"</span>: <span class="number">999</span>,
    <span class="string">"category"</span>: <span class="string">"Programming"</span>,
    <span class="string">"type"</span>: <span class="string">"single"</span>,
    <span class="string">"joke"</span>: <span class="string">"Why do Java developers wear glasses? Because they can't C#"</span>,
    <span class="string">"approved"</span>: <span class="keyword">false</span>
  }
}`
                    },
                    PUT: {
                        url: 'https://v2.jokeapi.dev/joke/146',
                        response: `{
  <span class="string">"status"</span>: <span class="number">200</span>,
  <span class="string">"message"</span>: <span class="string">"Joke updated successfully"</span>,
  <span class="string">"data"</span>: {
    <span class="string">"id"</span>: <span class="number">146</span>,
    <span class="string">"category"</span>: <span class="string">"Programming"</span>,
    <span class="string">"setup"</span>: <span class="string">"How did you make your friend rage?"</span>,
    <span class="string">"delivery"</span>: <span class="string">"I implemented a greek question mark in his JavaScript code."</span>,
    <span class="string">"updatedAt"</span>: <span class="string">"2026-02-09T15:30:00Z"</span>
  }
}`
                    },
                    DELETE: {
                        url: 'https://v2.jokeapi.dev/joke/146',
                        response: `{
  <span class="string">"status"</span>: <span class="number">204</span>,
  <span class="string">"message"</span>: <span class="string">"Joke deleted successfully"</span>,
  <span class="string">"id"</span>: <span class="number">146</span>
}`
                    }
                };

                function switchMethod(btn, method) {
                    document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    document.getElementById('url-display').value = apiEndpoints[method].url;
                    document.getElementById('response-display').innerHTML = apiEndpoints[method].response;
                }
            </script>
        </div>

        <!-- Console Section -->
        <div class="section">
            <h2>Console Debugging</h2>
            <p>The console is your first line of defense for debugging. In Java, System.out.println() statements help trace program execution and display variable values.</p>

            <h3>Console Debugging Strategies:</h3>
            <div class="list-item">
                <strong>Print Statements:</strong> Output variable values at key points to understand program flow and state.
            </div>
            <div class="list-item">
                <strong>Stack Traces:</strong> Read error messages from bottom to top to identify where exceptions originated.
            </div>
            <div class="list-item">
                <strong>Logging Levels:</strong> Use different output methods for errors, warnings, and informational messages.
            </div>

            <div class="code-block" data-lang="java">
<code><span class="keyword">public class</span> <span class="method">ArrayProcessor</span> {
    <span class="keyword">public static void</span> <span class="method">processArray</span>(<span class="keyword">int</span>[] arr) {
        System.out.println(<span class="string">"Array length: "</span> + arr.length);
        
        <span class="keyword">for</span> (<span class="keyword">int</span> i = <span class="number">0</span>; i &lt; arr.length; i++) {
            System.out.println(<span class="string">"Processing index "</span> + i + <span class="string">": "</span> + arr[i]);
            arr[i] = arr[i] * <span class="number">2</span>;
        }
        
        System.out.println(<span class="string">"Processing complete"</span>);
    }
}</code>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background-color: rgba(255, 255, 255, 0.05); border-radius: 6px; border-left: 3px solid var(--accent);">
                <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;"><strong>What this code does:</strong> The ArrayProcessor class contains a static method that takes an array of integers and doubles each element. It uses System.out.println() statements to print: (1) the total array length, (2) each index being processed along with its current value, and (3) a completion message. <strong>Debugging example:</strong> If you pass in array [1, 2, 3], the console output would be: "Array length: 3", then "Processing index 0: 1", "Processing index 1: 2", "Processing index 2: 3", followed by "Processing complete". After execution, the array becomes [2, 4, 6]. When debugging this code, you'd set a breakpoint on the arr[i] = arr[i] * 2 line and use watch expressions to monitor how each value changes in real-time.</p>
            </div>
        </div>

        <!-- Frontend vs Backend Section -->
        <div class="section">
            <h2>Frontend vs Backend Debugging</h2>
            
            <div class="tab-container">
                <button class="tab-btn active" onclick="switchTab('frontend')">Frontend</button>
                <button class="tab-btn" onclick="switchTab('backend')">Backend</button>
            </div>

            <div id="frontend-tab" class="tab-content active">
                <h3>Frontend Debugging Techniques</h3>
                <div class="list-item">
                    <strong>Browser DevTools:</strong> Use Chrome/Firefox DevTools to inspect HTML, CSS, and JavaScript. The Console tab shows JavaScript errors and log messages.
                </div>
                <div class="list-item">
                    <strong>React DevTools:</strong> Examine component hierarchies, props, and state in React applications.
                </div>
                <div class="list-item">
                    <strong>Network Tab:</strong> Monitor API requests, response times, and payload data to identify communication issues.
                </div>
                <div class="list-item">
                    <strong>Element Inspector:</strong> Examine and modify HTML/CSS in real-time to test layout and styling changes.
                </div>
            </div>

            <div id="backend-tab" class="tab-content">
                <h3>Backend Debugging Techniques</h3>
                <div class="list-item">
                    <strong>IDE Debugger:</strong> Use VS Code, IntelliJ, or Eclipse debuggers to step through Java code and inspect objects.
                </div>
                <div class="list-item">
                    <strong>Log Analysis:</strong> Review application logs to identify errors, performance bottlenecks, and unexpected behavior.
                </div>
                <div class="list-item">
                    <strong>Database Inspection:</strong> Query databases directly to verify data integrity and SQL query results.
                </div>
                <div class="list-item">
                    <strong>API Testing Tools:</strong> Use Postman or curl to test endpoints independently of the frontend.
                </div>
            </div>
        </div>

        <!-- Interactive Game -->
        <div class="game-container">
            <div class="game-header">
                <h2 class="game-title">Debug Detective Challenge</h2>
                <p class="game-subtitle">A user reported that the jokes API is throwing a NullPointerException. Use your debugging tools to identify and fix the issue!</p>
            </div>

            <div class="game-content">
                <div class="game-panel">
                    <div class="panel-header">JokesApiController.java</div>
                    <div class="code-block" data-lang="java">
<code><span class="line-number"> 1</span> <span class="code-line"><span class="keyword">@RestController</span></span>
<span class="line-number"> 2</span> <span class="code-line"><span class="keyword">@RequestMapping</span>(<span class="string">"/api/jokes"</span>)</span>
<span class="line-number"> 3</span> <span class="code-line"><span class="keyword">public class</span> <span class="method">JokesApiController</span> {</span>
<span class="line-number"> 4</span> <span class="code-line">    <span class="keyword">@Autowired</span></span>
<span class="line-number"> 5</span> <span class="code-line">    <span class="keyword">private</span> JokesJpaRepository repository;</span>
<span class="line-number"> 6</span> <span class="code-line">    </span>
<span class="line-number"> 7</span> <span class="code-line">    <span class="keyword">@PostMapping</span>(<span class="string">"/like/{id}"</span>)</span>
<span class="line-number"> 8</span> <span class="code-line">    <span class="keyword">public</span> ResponseEntity&lt;Jokes&gt; <span class="method">setLike</span>(<span class="keyword">@PathVariable long</span> id) {</span>
<span class="line-number"> 9</span> <span class="code-line">        Optional&lt;Jokes&gt; optional = repository.findById(id);</span>
<span class="line-number">10</span> <span class="code-line">        <span class="keyword">if</span> (optional.isPresent()) {</span>
<span class="line-number">11</span> <span class="code-line">            Jokes joke = optional.get();</span>
<span class="line-number">12</span> <span class="code-line">            joke.setHaha(joke.getHaha()+<span class="number">1</span>);</span>
<span class="line-number">13</span> <span class="code-line">            <span class="comment">// Bug: repository is null!</span></span>
<span class="line-number">14</span> <span class="code-line">            repository.save(joke);</span>
<span class="line-number">15</span> <span class="code-line">            <span class="keyword">return</span> <span class="keyword">new</span> ResponseEntity&lt;&gt;(joke, HttpStatus.OK);</span>
<span class="line-number">16</span> <span class="code-line">        }</span>
<span class="line-number">17</span> <span class="code-line">        <span class="keyword">return</span> <span class="keyword">new</span> ResponseEntity&lt;&gt;(HttpStatus.BAD_REQUEST);</span>
<span class="line-number">18</span> <span class="code-line">    }</span>
<span class="line-number">19</span> <span class="code-line">}</span></code>
                    </div>

                    <div class="error-indicator" id="error-box">
                        <strong>Error Reported:</strong> NullPointerException at JokesApiController line 34
                    </div>

                    <div class="success-indicator" id="success-box">
                        <strong>Bug Fixed!</strong> The JokesJpaRepository was never autowired. The fix: ensure Spring dependency injection is properly configured with @Autowired annotation.
                    </div>

                    <div class="hint-box" id="hint-box">
                        <div class="hint-title">Hint</div>
                        <p>Look at the @Autowired annotation. Is the JokesJpaRepository being injected correctly by Spring?</p>
                    </div>
                </div>

                <div class="game-panel">
                    <div class="panel-header">Debugging Tools</div>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">Use the debugging tools below to investigate the issue:</p>
                    
                    <div class="debug-tools">
                        <button class="tool-btn" onclick="runVSCodeDebug()">
                            Run Debugger
                        </button>
                        <button class="tool-btn" onclick="checkPostman()">
                            Test in Postman
                        </button>
                        <button class="tool-btn" onclick="checkConsole()">
                            Check Console
                        </button>
                        <button class="tool-btn" onclick="showHint()">
                            Show Hint
                        </button>
                        <button class="tool-btn" onclick="fixBug()" style="background: var(--green-bg); border-color: var(--green);">
                            Apply Fix
                        </button>
                    </div>

                    <div class="panel-header" style="margin-top: 1.5rem;">Debug Output</div>
                    <div class="output-console" id="debug-console">
                        <div class="console-line console-info">Ready to debug. Select a tool above...</div>
                    </div>
                </div>
            </div>

            <div class="progress-bar">
                <div class="progress-fill" id="progress"></div>
            </div>
        </div>

        <!-- Learning Objectives -->
        <div class="section">
            <h2>Learning Objectives</h2>
            <p>By the end of this lesson, you should be able to:</p>

            <div class="objectives-grid">
                <div class="objective-card">
                    <div class="objective-number">1</div>
                    <h3>Debug with Breakpoints</h3>
                    <p>Set and use breakpoints in VS Code to pause execution and inspect variable values at runtime.</p>
                </div>

                <div class="objective-card">
                    <div class="objective-number">2</div>
                    <h3>Test APIs Independently</h3>
                    <p>Use Postman to test backend endpoints separately from the frontend, verifying request and response data.</p>
                </div>

                <div class="objective-card">
                    <div class="objective-number">3</div>
                    <h3>Analyze Console Output</h3>
                    <p>Read stack traces and error messages to identify the root cause of runtime exceptions in Java programs.</p>
                </div>

                <div class="objective-card">
                    <div class="objective-number">4</div>
                    <h3>Distinguish Error Types</h3>
                    <p>Identify and categorize syntax errors, runtime errors, and logic errors based on their characteristics.</p>
                </div>

                <div class="objective-card">
                    <div class="objective-number">5</div>
                    <h3>Frontend vs Backend Debugging</h3>
                    <p>Apply appropriate debugging techniques based on whether the issue originates in frontend or backend code.</p>
                </div>

                <div class="objective-card">
                    <div class="objective-number">6</div>
                    <h3>Systematic Problem Solving</h3>
                    <p>Follow a logical debugging workflow: reproduce the bug, isolate the cause, implement a fix, and verify the solution.</p>
                </div>
            </div>
        </div>

        <!-- Interactive Buttons Section -->
        <div class="interactive-section">
            <h2 style="color: var(--green); margin-bottom: 1rem;">Test Your Knowledge</h2>
            <p style="color: var(--text-muted); margin-bottom: 0.5rem;">Click each topic to explore key debugging concepts:</p>
            
            <div class="button-grid">
                <button class="interactive-btn" onclick="showConcept(this, 'breakpoint')">
                    Understanding Breakpoints
                </button>
                <button class="interactive-btn" onclick="showConcept(this, 'stack')">
                    Reading Stack Traces
                </button>
                <button class="interactive-btn" onclick="showConcept(this, 'watch')">
                    Using Watch Expressions
                </button>
                <button class="interactive-btn" onclick="showConcept(this, 'api')">
                    API Testing Workflow
                </button>
                <button class="interactive-btn" onclick="showConcept(this, 'null')">
                    Handling NullPointerException
                </button>
                <button class="interactive-btn" onclick="showConcept(this, 'tools')">
                    Choosing Debug Tools
                </button>
            </div>

            <div id="concept-display" style="margin-top: 2rem; padding: 1.5rem; background: var(--panel); border-radius: 8px; display: none; border-left: 4px solid var(--accent);">
                <h3 id="concept-title" style="color: var(--accent); margin-bottom: 1rem;"></h3>
                <p id="concept-text" style="color: var(--text-muted);"></p>
            </div>
        </div>

        <!-- Footer -->
        <div class="section" style="text-align: center; border-left: none; background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-3) 100%);">
            <h2 style="color: var(--accent);">Ready to Debug Like a Pro?</h2>
            <p>Practice these techniques in your own projects. Remember: debugging is a skill that improves with experience!</p>
            <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem;">
                <strong>Pro Tip:</strong> Always start with the simplest debugging approach (console output) and move to more complex tools (debugger, Postman) only when needed.
            </p>
        </div>
    </div>

    <script>
        // Tab switching
        function switchTab(tab) {
            const tabs = document.querySelectorAll('.tab-btn');
            const contents = document.querySelectorAll('.tab-content');
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tab + '-tab').classList.add('active');
        }

        // Game logic
        let progress = 0;
        let usedTools = new Set();

        function addConsoleOutput(message, type = 'info') {
            const console = document.getElementById('debug-console');
            const line = document.createElement('div');
            line.className = `console-line console-${type}`;
            line.textContent = message;
            console.appendChild(line);
            console.scrollTop = console.scrollHeight;
        }

        function updateProgress() {
            progress += 25;
            document.getElementById('progress').style.width = progress + '%';
        }

        function runVSCodeDebug() {
            if (usedTools.has('vscode')) return;
            
            const btn = event.target;
            btn.classList.add('used');
            usedTools.add('vscode');
            
            addConsoleOutput('Starting debugger on localhost:8585...', 'info');
            setTimeout(() => {
                addConsoleOutput('Breakpoint hit at JokesApiController.java:34', 'warning');
                addConsoleOutput('Variables: repository = null, joke = null', 'error');
                addConsoleOutput('Detected: repository was not autowired properly!', 'warning');
                updateProgress();
            }, 800);
        }

        function checkPostman() {
            if (usedTools.has('postman')) return;
            
            const btn = event.target;
            btn.classList.add('used');
            usedTools.add('postman');
            
            addConsoleOutput('Sending POST request to http://localhost:8585/api/jokes/like/1...', 'info');
            setTimeout(() => {
                addConsoleOutput('500 Internal Server Error', 'error');
                addConsoleOutput('Response: {"error": "NullPointerException"}', 'error');
                addConsoleOutput('Server logs indicate error in JokesApiController.setLike()', 'warning');
                updateProgress();
            }, 1000);
        }

        function checkConsole() {
            if (usedTools.has('console')) return;
            
            const btn = event.target;
            btn.classList.add('used');
            usedTools.add('console');
            
            addConsoleOutput('Reading application logs...', 'info');
            setTimeout(() => {
                addConsoleOutput('Exception in thread "main" java.lang.NullPointerException', 'error');
                addConsoleOutput('    at JokesApiController.setLike(JokesApiController.java:34)', 'error');
                addConsoleOutput('    at ApiRequestHandler.handleRequest(ApiRequestHandler.java:45)', 'error');
                addConsoleOutput('NPE suggests null object reference in repository', 'warning');
                updateProgress();
            }, 700);
        }

        function showHint() {
            const hintBox = document.getElementById('hint-box');
            hintBox.classList.add('visible');
            addConsoleOutput('Hint displayed - check the code for uninitialized variables', 'info');
        }

        function fixBug() {
            if (progress < 50) {
                addConsoleOutput('Use debugging tools first to investigate the issue!', 'warning');
                return;
            }

            const btn = event.target;
            btn.classList.add('used');
            
            addConsoleOutput('Applying fix: Ensuring @Autowired injects repository...', 'info');
            setTimeout(() => {
                addConsoleOutput('Fix applied successfully!', 'success');
                addConsoleOutput('Re-running tests...', 'info');
                setTimeout(() => {
                    addConsoleOutput('All tests passing! Jokes API is now hilarious!', 'success');
                    document.getElementById('error-box').style.display = 'none';
                    document.getElementById('success-box').style.display = 'block';
                    updateProgress();
                    updateProgress();
                }, 800);
            }, 600);
        }

        // Interactive concepts
        const concepts = {
            breakpoint: {
                title: 'Understanding Breakpoints',
                text: 'A breakpoint pauses program execution at a specific line, allowing you to examine variable values and program state. In VS Code, click the left margin to set a breakpoint. When the debugger reaches this line, execution stops, giving you time to inspect what\'s happening. This is especially useful for tracking down logic errors where the code runs but produces unexpected results.'
            },
            stack: {
                title: 'Reading Stack Traces',
                text: 'Stack traces show the sequence of method calls leading to an error. Read from bottom to top: the bottom shows where the program started, and the top shows where the error occurred. Each line includes the file name, method name, and line number. In Java, look for your own classes first - errors in library code often stem from how you\'re using those libraries.'
            },
            watch: {
                title: 'Using Watch Expressions',
                text: 'Watch expressions let you monitor specific variables or expressions as your program runs. Add a watch for any variable or complex expression (like array[i] or user.getName()) and see it update in real-time as you step through code. This is invaluable when you need to track how a particular value changes through multiple method calls or loop iterations.'
            },
            api: {
                title: 'API Testing Workflow',
                text: 'When debugging full-stack applications, test your backend independently using Postman. Send requests with different parameters, examine status codes (200 = success, 404 = not found, 500 = server error), and verify the response data matches your expectations. This isolates whether issues are in the backend logic or frontend integration.'
            },
            null: {
                title: 'Handling NullPointerException',
                text: 'NullPointerException occurs when you try to use a null object reference. Common causes include: forgetting to initialize variables, methods returning null instead of an object, or trying to access array elements that don\'t exist. Always check if objects are null before using them, or ensure proper initialization in constructors. The debugger can help you find exactly which variable is null.'
            },
            tools: {
                title: 'Choosing Debug Tools',
                text: 'Start simple: use console output (System.out.println) for quick checks. Move to the debugger when you need to inspect multiple variables or step through complex logic. Use Postman when testing API endpoints separately from the frontend. Use browser DevTools for frontend JavaScript issues. The key is choosing the right tool for the specific problem you\'re facing.'
            }
        };

        function showConcept(btn, key) {
            btn.classList.add('clicked');
            const display = document.getElementById('concept-display');
            const title = document.getElementById('concept-title');
            const text = document.getElementById('concept-text');
            
            title.textContent = concepts[key].title;
            text.textContent = concepts[key].text;
            display.style.display = 'block';
            display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    </script>
</body>
</html>