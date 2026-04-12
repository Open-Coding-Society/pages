---
layout: post
title: CS Pathway Game - Build Integration
description: Guide for integrating CS Pathway Game into Makefile and CI/CD workflows
categories: [Gamify]
permalink: /cs-pathway-game/build-integration
---

## Adding CS Pathway Game to Build System

This guide shows how to integrate the cs-pathway-game project into your existing Makefile and CI/CD workflow.

## Step 1: Add Makefile Rules

**Option A: Include the fragment** (Recommended - keeps main Makefile clean)

```makefile
# At the end of your main Makefile
include _projects/cs-pathway-game/Makefile.fragment
```

**Option B: Copy rules directly**
Copy the contents of `Makefile.fragment` into your main `Makefile` (after the existing rules).

## Step 2: Update `make dev` to Include Auto-Watch

Add the project watcher to your development workflow:

```makefile
# In your existing Makefile, find the 'dev' target and update:

# Development mode: clean start, no conversion, converts files on save
# Runs in background - use 'make stop' to stop, 'tail -f /tmp/jekyll4500.log' to view logs
dev: stop clean jekyll-serve
	@make watch-notebooks &
	@make watch-cs-pathway-game &    # ADD THIS LINE
```

This makes `make dev` automatically watch project files for changes.

## Step 3: Update GitHub Actions Workflow

Add project build step to `.github/workflows/jekyll-gh-pages.yml`:

```yaml
# In the 'build' job, after 'Install Python dependencies' step:

      - name: Build CS Pathway Game project
        run: |
          make cs-pathway-game-build  # Copies project files to Jekyll

      - name: Execute notebook conversion script
        run: |
          source venv/bin/activate
          python scripts/convert_notebooks.py
      # ... rest of workflow
```

This ensures the project is built before notebook conversion during CI/CD deployment.

## Step 4: Optional - Add to Clean Target

Update your `clean` target to also clean distributed project files:

```makefile
clean: stop
	@echo "Cleaning converted IPYNB files..."
	@find _posts -type f -name '*_IPYNB_2_.md' -exec rm {} +
	# ... existing clean commands ...
	@make cs-pathway-game-clean    # ADD THIS LINE
	@echo "Removing _site directory..."
	@rm -rf _site
```

## Step 5: Verify Installation

Test the integration:

```bash
# 1. Build project
make cs-pathway-game-build
# Should see: ✅ CS Pathway Game built successfully

# 2. Start dev server with auto-watch
make dev
# Should see: 👀 Watching CS Pathway Game project (auto-copy on save)...

# 3. Edit a file in _projects/cs-pathway-game/
# Save changes → should see auto-copy message → Jekyll regenerates

# 4. Clean up
make stop
make clean
# Should clean distributed files but preserve source in _projects/
```

## Complete Example: Updated Makefile Sections

### Development Target

```makefile
dev: stop clean jekyll-serve
	@touch /tmp/.notebook_watch_marker
	@make watch-notebooks &
	@make watch-files &
	@make watch-cs-pathway-game &    # ← NEW: Auto-copy project files
	@echo "Server running in background on http://localhost:$(PORT)"
	@echo "  View logs: tail -f $(LOG_FILE)"
	@echo "  Stop: make stop"
```

### Clean Target

```makefile
clean: stop
	@echo "Cleaning converted IPYNB files..."
	@find _posts -type f -name '*_IPYNB_2_.md' -exec rm {} +
	@echo "Cleaning Github Issue files..."
	@find _posts -type f -name '*_GithubIssue_.md' -exec rm {} +
	@echo "Cleaning converted DOCX files..."
	@find _posts -type f -name '*_DOCX_.md' -exec rm {} + 2>/dev/null || true
	@echo "Cleaning course-specific files..."
	@make clean-courses
	@make cs-pathway-game-clean    # ← NEW: Clean distributed project files
	@echo "Removing empty directories in _posts..."
	@while [ $$(find _posts -type d -empty | wc -l) -gt 0 ]; do \
		find _posts -type d -empty -exec rmdir {} +; \
	done
	@echo "Removing _site directory..."
	@rm -rf _site
```

### Stop Target (No changes needed)

```makefile
stop:
	@echo "Stopping server..."
	@lsof -ti :$(PORT) | xargs kill >/dev/null 2>&1 || true
	@echo "Stopping logging process..."
	@ps aux | awk -v log_file=$(LOG_FILE) '$$0 ~ "tail -f " log_file { print $$2 }' | xargs kill >/dev/null 2>&1 || true
	@echo "Stopping notebook watcher..."
	@ps aux | grep "watch-notebooks" | grep -v grep | awk '{print $$2}' | xargs kill >/dev/null 2>&1 || true
	@ps aux | grep "find _notebooks" | grep -v grep | awk '{print $$2}' | xargs kill >/dev/null 2>&1 || true
	@echo "Stopping project watchers..."    # ← NEW: Stop message
	@ps aux | grep "watch-cs-pathway-game" | grep -v grep | awk '{print $$2}' | xargs kill >/dev/null 2>&1 || true
	@rm -f $(LOG_FILE) /tmp/.notebook_watch_marker /tmp/.jekyll_regenerating
```

## GitHub Actions Complete Build Job

```yaml
build:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Set up Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: '3.1'
        bundler-cache: true
    
    - name: Install Jekyll and dependencies
      run: |
        gem install bundler
        bundle install
    
    - name: Install Python dependencies
      run: |
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    
    # NEW: Build project before conversion
    - name: Build CS Pathway Game project
      run: |
        make cs-pathway-game-build
    
    - name: Execute notebook conversion script
      run: |
        source venv/bin/activate
        python scripts/convert_notebooks.py
    
    - name: Execute DOCX conversion script
      run: |
        source venv/bin/activate
        if [ -d "_docx" ] && [ "$(ls -A _docx 2>/dev/null)" ]; then
          echo "Converting DOCX files..."
          python scripts/convert_docx.py
        else
          echo "No DOCX files found, skipping conversion"
        fi
    
    - name: Split multi-course files
      run: |
        source venv/bin/activate
        python scripts/split_multi_course_files.py
    
    - name: Build with Jekyll
      run: |
        bundle exec jekyll build
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
```

## Troubleshooting

### fswatch Not Found
If you see: `⚠️ fswatch not installed`

```bash
# macOS:
brew install fswatch

# Linux:
sudo apt-get install fswatch  # Debian/Ubuntu
sudo yum install fswatch       # RedHat/CentOS
```

### Auto-copy Not Working
1. Check that `watch-cs-pathway-game` is running:

   ```bash
   ps aux | grep watch-cs-pathway-game
   ```

2. Manually trigger copy to test:

   ```bash
   make cs-pathway-game
   ```

3. Check file permissions:

   ```bash
   ls -la _projects/cs-pathway-game/
   ```

### Jekyll Not Regenerating After Copy
1. Check Jekyll is watching:

   ```bash
   tail -f /tmp/jekyll4500.log
   ```

2. Look for file change events in log when you save

3. Restart dev server:

   ```bash
   make stop
   make dev
   ```

## Summary

After integration, your workflow becomes:
1. **One-time setup**: `make dev` (includes auto-watch)
2. **Daily work**: Edit files in `_projects/cs-pathway-game/`
3. **Automatic**: Files copy → notebooks convert → Jekyll regenerates → browser refreshes

No manual build steps needed during development!
