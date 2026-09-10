# Make Debug

A lightweight helper to run `make`, read `/tmp/jekyll4500.log`, and send the log to Gemini AI for analysis using the Flask backend.

## Setup

1. **Flask Backend**: Ensure the Flask application is running on port 8587 with `GEMINI_API_KEY` configured in `flask-educators/.env` or in the environment.

2. **Frontend Dependencies**: Install Python dependencies in your active environment or local venv:

```bash
pip install -r make-debug/requirements.txt
```

## HOW TO RUN PROGRAM

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

```bash
python make-debug/log_checker.py