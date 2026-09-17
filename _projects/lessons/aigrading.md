# AI Grading Calibration for Homework

This file contains first-pass AI grading calibration rules used by the system prompt.

## Score Bands (Max 1.0, Practical Cap 0.92)

- 0.92: Exceeds requirements independently; adds thoughtful structure or polish without being prompted.
- 0.90: Valiant attempt that meets core requirements correctly.
- 0.88: Minimalist completion that meets requirements.
- 0.80: Honest effort with noticeable requirement gaps.
- 0.70: Partial submission with key missing pieces.
- 0.55: Very weak submission with major structural errors.

## AI Scoring Policy

1. Start from rubric evidence.
2. If requirements are met, score in the 0.88 to 0.90 band.
3. Reserve 0.92 for clear unprompted quality beyond requirements.
4. If key semantic structures are missing, score 0.80 or below.
5. Do not award above 0.92 for this assignment.

## Required Grading Output Format

Return all fields:

1. score: numeric out of 1.0
2. checks_passed: list
3. checks_failed: list
4. feedback: one short paragraph with one fix-first priority
5. calibration_reason: one sentence mapping score to 0.92, 0.90, 0.88, 0.80, 0.70, or 0.55
