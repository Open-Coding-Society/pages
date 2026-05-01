# Make Debug

A lightweight helper to run `make`, read `/tmp/jekyll4500.log`, and send the log to Gemini AI for analysis using Spring Boot backend.

## Setup

1. **Spring Backend**: Ensure the Spring Boot application is running on port 8585 with Gemini API key configured in `.env`

2. **Frontend Dependencies**: Install Python dependencies in your active environment or local venv:

```bash
pip install -r make-debug/requirements.txt
```

## HOW TO RUN PROGRAM

```bash
python make-debug/run.py
```

This will:
- run `make`
- wait for `/tmp/jekyll4500.log`
- send the log to the Spring Boot Gemini AI analyzer
- print a short recommendation to the terminal

If you want to run a different command instead of `make`, use:

```bash
python make-debug/run.py --cmd "make build"
```

## Backend Configuration

The Spring Boot backend (`PersonService.java`) handles the Gemini AI integration:

- API Key: Configured in `spring/.env` as `GEMINI_API_KEY`
- Endpoint: `POST /api/gemini/analyze-log`
- Port: 8585 (configured in `application.properties`)

## Architecture

- **Frontend**: Python script that runs make commands and captures logs
- **Backend**: Spring Boot REST API with Gemini AI integration
- **AI Analysis**: Jekyll build log analysis with actionable recommendations


## Log Pattern Checker (Fast Diagnostics)

You can quickly check for common Jekyll/make errors without using AI:

```bash
python make-debug/log_checker.py