# Make Debug

A lightweight helper to run `make`, read `/tmp/jekyll4500.log`, and send the log to OpenAI for a recommendation.

## Setup

Install dependencies in your active environment or local venv:

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
- send the log to the AI analyzer
- print a short recommendation to the terminal

If you want to run a different command instead of `make`, use:

```bash
python make-debug/run.py --cmd "make build"
```
