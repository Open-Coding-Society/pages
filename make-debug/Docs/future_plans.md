# Make-Debug Future Plans

## What is Make-Debug?

**make-debug** runs Jekyll builds, captures logs, sends them to Gemini AI for analysis, and returns actionable fixes to the terminal.

---

## What Needs to Be Done

### Phase 1: Better Error Detection
- [ ] Support multiple log files (`/tmp/jekyll4500.log`, `/tmp/bundle.log`, `/tmp/sass_compile.log`)
- [ ] Add local caching to avoid repeated API calls
- [ ] Output JSON format for structured data: `--format json`
- [ ] Classify errors by severity (CRITICAL, WARNING, INFO)

### Phase 2: Connect to Open Coding Society Gamification (SLDC Master)
- [ ] Create Flask endpoint: `/api/sldc/diagnostic-event` to log build diagnostics
- [ ] Add `--user-id` and `--session-id` flags to `analyze.py`
- [ ] Award points for successful builds:
  - 5-10 points: Success on first try
  - 15-25 points: Success after fixing errors
  - 30-50 points: Complex multi-error fixes
- [ ] Display points earned in terminal output
- [ ] Show build diagnostics on student dashboard at opencoding society site
- [ ] Auto-generate debugging challenges from failed builds

### Phase 3: Connect Localhost to Deployed Site
- [ ] Create Flask endpoint: `/api/deploy/validate` to compare local vs deployed build
- [ ] Add `--validate-deploy` flag to verify local build matches production
- [ ] Add `--deploy` flag to automatically push changes to GitHub Pages after validation
- [ ] Add `--rollback` flag to revert to previous deployment
- [ ] Implement canary deployments: test with 10% traffic before full rollout

### Phase 4: Documentation & Handoff
- [ ] Write `/Docs/ARCHITECTURE.md` - system overview and data flow
- [ ] Write `/Docs/DEVELOPER_GUIDE.md` - how to add error patterns and extend the tool
- [ ] Write `/Docs/DEPLOYMENT.md` - deployment instructions
- [ ] Create `help.py` with interactive tutorials
- [ ] Add `--verbose` and `--dry-run` flags
- [ ] Create test suite (`tests/test_analyzer.py`, `tests/test_log_checker.py`)
- [ ] Add GitHub Actions workflow for automated testing & linting
- [ ] Create plugin system for custom analyzers

### Phase 5: Analytics (Future)
- [ ] Track build success/failure rates over time
- [ ] Show error frequency analytics on dashboard
- [ ] Create leaderboard for best build reliability
- [ ] Build ML model to predict build failures before running make

---

## Quick Start for Next Developer

1. Run: `python make-debug/analyze.py` to test locally
2. Review: `run.py`, `analyzer.py`, `log_checker.py`
3. Ensure Flask backend is running on port 8587 with `GEMINI_API_KEY` set
4. Start with Phase 1 tasks
5. Update this file when you complete phases or discover new requirements
