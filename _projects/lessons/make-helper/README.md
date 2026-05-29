# make-helper

A small local tool for capturing `make` failures, saving log files, and showing a friendly summary.

## Usage

From the repository root:

```bash
python _projects/make-helper/run_make.py
```

To forward make arguments, add them after the script:

```bash
python _projects/make-helper/run_make.py clean
```

## What it does

- Runs `make` from the workspace root
- Captures both `stdout` and `stderr`
- Writes logs into `logs/make_YYYYMMDD_HHMMSS.txt`
- Prints a simple build summary and a friendly problem/fix hint when the build fails

## Notes

If you want the raw log later, open the generated file in `logs/`.
