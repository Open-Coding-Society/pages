# AI Make Debugger

A small prototype that captures `make build` output, sends it to a FastAPI backend, and returns an AI-powered failure diagnosis.

## Setup

```bash
cd ai-make-debugger
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run backend

```bash
export OPENAI_API_KEY="your_api_key_here"
uvicorn backend.main:app --reload
```

## Run the build wrapper

You can either analyze an existing log file or run a command and capture its output.

```bash
# Analyze an existing log file:
python debug_make.py --log /tmp/build.log

# Run a build command and then analyze its log:
python debug_make.py --cmd "make build"
```

If the command fails, the output is captured to `logs/build.log` and sent to the AI debugger service.
