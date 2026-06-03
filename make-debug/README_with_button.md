# Make Debug

A lightweight helper to run `make`, read `/tmp/jekyll4500.log`, and send the log to Gemini AI for analysis using the Flask backend.

## Setup

1. **Flask Backend**: Ensure the Flask application is running on port 8587 with `GEMINI_API_KEY` configured in `flask-educators/.env` or in the environment.

2. **Frontend Dependencies**: Install Python dependencies in your active environment or local venv:

```bash
pip install -r make-debug/requirements.txt
```

## HOW TO RUN PROGRAM with flask 

```bash
python make-debug/analyze.py
```

This will:
- run `make`
- wait for `/tmp/jekyll4500.log`
- send the log to the Flask Gemini AI analyzer
- print a short recommendation to the terminal

If you want to run a different command instead of `make`, use:

```bash
python make-debug/analyze.py --cmd "make deploy"
```

## Backend Configuration

The Flask backend (`flask-educators`) handles the Gemini AI integration:

- API Key: Configured in `flask-educators/.env` as `GEMINI_API_KEY`
- Endpoint: `POST /api/gemini/analyze-log`
- Port: 8587

## Architecture

- **Frontend**: Python script that runs make commands and captures logs
- **Backend**: Flask REST API with Gemini AI integration
- **AI Analysis**: Jekyll build log analysis with actionable recommendations


## Log Pattern Checker (Fast Diagnostics)

You can quickly check for common Jekyll/make errors without using AI:

<div style="position:relative; border:1px solid #e2e8f0; background:#fbfbfe; padding:16px; border-radius:8px;">
  <button id="make-debug-button" onclick="showMakeChecker()" style="position:absolute; top:8px; right:8px; background:#6a0dad; color:#ffffff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; font-weight:600;">Run checker</button>
  <div style="font-family:monospace; background:transparent; padding-top:6px;">
    <pre style="margin:0;">python make-debug/log_checker.py</pre>
  </div>
</div>

<!-- Modal -->
<div id="make-debug-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); align-items:center; justify-content:center; z-index:9999;">
  <div style="background:#fff; color:#111; padding:18px; border-radius:8px; max-width:720px; margin:24px; box-shadow:0 8px 24px rgba(16,24,40,0.32);">
    <p style="margin:0; font-size:15px; line-height:1.4;">to start, run a quick make checker by typing this command in your terminal: <code>python make-debug/log_checker.py</code></p>
    <div style="text-align:right; margin-top:12px;"><button onclick="closeMakeChecker()" style="background:#6a0dad; color:#ffffff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; font-weight:600;">Close</button></div>
  </div>
</div>

<script>
function showMakeChecker(){
  var m = document.getElementById('make-debug-modal');
  if(m){ m.style.display = 'flex'; m.style.alignItems='center'; m.style.justifyContent='center'; }
}
function closeMakeChecker(){
  var m = document.getElementById('make-debug-modal');
  if(m){ m.style.display = 'none'; }
}
</script>
