---
layout: post
title: Calendar System — Test Runner
description: Interactive test runner for the Calendar SRP modules. Runs all unit tests in-browser with mocked auth, API, and DOM.
type: coding
comments: true
permalink: /calendar/tests
author: Arnav Mittal
---

<style>
  .test-runner-container {
    font-family: 'Courier New', Courier, monospace;
    background: var(--bg-2);
    color: var(--text);
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    max-height: 600px;
    overflow-y: auto;
  }
  .test-runner-container .suite-name {
    color: var(--accent);
    font-weight: bold;
    margin-top: 12px;
    font-size: 14px;
  }
  .test-runner-container .test-pass {
    color: var(--green);
    margin-left: 16px;
    font-size: 13px;
  }
  .test-runner-container .test-fail {
    color: var(--red);
    margin-left: 16px;
    font-size: 13px;
    font-weight: bold;
  }
  .test-runner-container .test-summary {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--surface);
    font-size: 15px;
    font-weight: bold;
  }
  .test-runner-container .test-summary.all-pass { color: var(--green); }
  .test-runner-container .test-summary.has-fail { color: var(--red); }
  .test-controls {
    display: flex;
    gap: 12px;
    align-items: center;
    margin: 16px 0;
    flex-wrap: wrap;
  }
  .test-controls button {
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }
  .test-controls button:active { transform: scale(0.97); }
  #run-tests-btn {
    background: var(--accent);
    color: var(--bg-0);
  }
  #run-tests-btn:hover { background: var(--accent-700); }
  #run-tests-btn:disabled {
    background: var(--surface);
    color: var(--text-muted);
    cursor: not-allowed;
  }
  #clear-btn {
    background: var(--bg-3);
    color: var(--text);
  }
  #clear-btn:hover { background: var(--surface); }
  .test-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
  }
  .test-badge.pass { background: var(--green-bg); color: var(--green); }
  .test-badge.fail { background: var(--status-indicator-error-bg); color: var(--red); }
  .test-badge.idle { background: var(--surface); color: var(--text-muted); }
  .test-status-bar {
    display: flex;
    gap: 12px;
    align-items: center;
    margin: 8px 0;
  }
</style>

## About This Page

This page loads all five **Calendar SRP modules** and runs the comprehensive test suite directly in your browser. Tests cover:

- **CalendarData** — date lookups, holidays, skip weeks, formatting
- **EventBuilder** — item parsing, event construction, iCal generation
- **CalendarApi** — error classification, sync/remove with mocked auth (logged in, logged out, network error, server error, login redirect)
- **CalendarUI** — modal rendering, checkbox state, toast notifications, priority persistence
- **Orchestrator** — full sync/remove flows, sprint date preview, integration

> See the [Architecture Documentation]({{site.baseurl}}/calendar/architecture) for how the system is designed.

## Run Tests

<div class="test-controls">
  <button id="run-tests-btn" onclick="handleRunTests()">▶ Run All Tests</button>
  <button id="clear-btn" onclick="clearResults()">Clear</button>
  <div class="test-status-bar">
    <span class="test-badge idle" id="test-badge">Not run yet</span>
  </div>
</div>

<div class="test-runner-container" id="test-output">
  <div style="color: var(--text-muted);">Click "Run All Tests" to execute the test suite.</div>
</div>

<!-- Embed school calendar data (same as _includes/calendar.html) -->
{% assign calendar = site.data.school_calendar %}
<script id="school-calendar-json" type="application/json">
{
  "schoolYear": {{ calendar.school_year | jsonify }},
  "firstDay": {{ calendar.first_day | jsonify }},
  "lastDay": {{ calendar.last_day | jsonify }},
  "weeks": {
    {% for week in calendar.weeks %}
    "{{ week[0] }}": {
      "monday": {{ week[1].monday | jsonify }},
      "friday": {{ week[1].friday | jsonify }},
      "tuesday": {{ week[1].tuesday | default: nil | jsonify }},
      "holidays": {{ week[1].holidays | default: nil | jsonify }},
      "holidayAdjustment": {{ week[1].holiday_adjustment | default: nil | jsonify }},
      "skipWeek": {{ week[1].skip_week | default: false | jsonify }},
      "theme": {{ week[1].theme | default: nil | jsonify }},
      "notes": {{ week[1].notes | default: nil | jsonify }}
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  }
}
</script>

<script>
  var SITE_BASEURL = '{{ site.baseurl }}';
</script>

<!-- Load SRP modules in dependency order -->
<script src="{{ site.baseurl }}/assets/js/pages/calendar/CalendarData.js"></script>
<script src="{{ site.baseurl }}/assets/js/pages/calendar/EventBuilder.js"></script>
<script src="{{ site.baseurl }}/assets/js/pages/calendar/CalendarApi.js"></script>
<script src="{{ site.baseurl }}/assets/js/pages/calendar/CalendarUI.js"></script>
<script src="{{ site.baseurl }}/assets/js/pages/calendar/calendar.js"></script>

<!-- Load test suite -->
<script src="{{ site.baseurl }}/assets/js/pages/calendar/CalendarTests.js"></script>

<script>
  /**
   * Intercept console methods to capture test output into the page.
   */
  function handleRunTests() {
    const btn = document.getElementById('run-tests-btn');
    const output = document.getElementById('test-output');
    const badge = document.getElementById('test-badge');

    btn.disabled = true;
    btn.textContent = '⏳ Running...';
    output.innerHTML = '';
    badge.className = 'test-badge idle';
    badge.textContent = 'Running...';

    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    const originalGroup = console.group;
    const originalGroupEnd = console.groupEnd;
    const originalWarn = console.warn;

    function addLine(text, className) {
      const div = document.createElement('div');
      div.className = className || '';
      div.textContent = text;
      output.appendChild(div);
    }

    console.group = function(msg) {
      // Strip %c formatting
      const clean = typeof msg === 'string' ? msg.replace(/%c/g, '').trim() : String(msg);
      if (clean.startsWith('▸')) {
        addLine(clean, 'suite-name');
      }
      originalGroup.apply(console, arguments);
    };

    console.log = function() {
      const args = Array.from(arguments);
      const text = args.filter(a => typeof a === 'string' && !a.startsWith('color:')).join(' ').replace(/%c/g, '').trim();
      
      if (text.startsWith('✓')) {
        addLine(text, 'test-pass');
      } else if (text.includes('RESULTS:')) {
        addLine(text, 'test-summary ' + (text.includes(', 0 failed') ? 'all-pass' : 'has-fail'));
      } else if (text.includes('CalendarTests')) {
        // skip load messages
      } else if (text.startsWith('══') || text.startsWith('╔') || text.startsWith('╚') || text.startsWith('║')) {
        addLine(text, 'suite-name');
      } else if (text) {
        addLine(text, '');
      }
      originalLog.apply(console, arguments);
    };

    console.error = function() {
      const args = Array.from(arguments);
      const text = args.filter(a => typeof a === 'string').join(' ').replace(/%c/g, '').trim();
      if (text.startsWith('✗') || text.includes('•')) {
        addLine(text, 'test-fail');
      } else if (text) {
        addLine(text, 'test-fail');
      }
      originalError.apply(console, arguments);
    };

    console.warn = function() {
      originalWarn.apply(console, arguments);
    };

    console.groupEnd = function() {
      originalGroupEnd.apply(console, arguments);
    };

    // Run tests
    runAllCalendarTests().then(function(results) {
      // Restore console
      console.log = originalLog;
      console.error = originalError;
      console.group = originalGroup;
      console.groupEnd = originalGroupEnd;
      console.warn = originalWarn;

      btn.disabled = false;
      btn.textContent = '▶ Run All Tests';

      if (results.failed === 0) {
        badge.className = 'test-badge pass';
        badge.textContent = results.passed + '/' + results.total + ' passed ✓';
      } else {
        badge.className = 'test-badge fail';
        badge.textContent = results.failed + ' failed ✗';
      }

      // Scroll to bottom
      output.scrollTop = output.scrollHeight;
    }).catch(function(err) {
      console.log = originalLog;
      console.error = originalError;
      console.group = originalGroup;
      console.groupEnd = originalGroupEnd;
      console.warn = originalWarn;

      addLine('Error running tests: ' + err.message, 'test-fail');
      btn.disabled = false;
      btn.textContent = '▶ Run All Tests';
      badge.className = 'test-badge fail';
      badge.textContent = 'Error';
    });
  }

  function clearResults() {
    document.getElementById('test-output').innerHTML = '<div style="color: var(--text-muted);">Click "Run All Tests" to execute the test suite.</div>';
    document.getElementById('test-badge').className = 'test-badge idle';
    document.getElementById('test-badge').textContent = 'Not run yet';
  }
</script>
