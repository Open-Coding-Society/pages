HOST ?= localhost
PORT ?= 4500
LOG_FILE = /tmp/jekyll$(PORT).log
PYTHON := venv/bin/python3

SHELL = /bin/bash -c
.SHELLFLAGS = -e

NOTEBOOK_FILES := $(shell find _notebooks -name '*.ipynb')
DESTINATION_DIRECTORY = _posts
MARKDOWN_FILES := $(patsubst _notebooks/%.ipynb,$(DESTINATION_DIRECTORY)/%_IPYNB_2_.md,$(NOTEBOOK_FILES))
default: serve-current
	@touch /tmp/.notebook_watch_marker
	@make watch-notebooks &
	@make watch-files &
	@echo "Server running in background on http://localhost:$(PORT)"
	@echo "  View logs: tail -f $(LOG_FILE)"
	@echo "  Stop: make stop"

# File watcher - monitors log for file changes and triggers conversion
watch-files:
	@echo "Watching for file changes (auto-convert on save)..."
	@(tail -f $(LOG_FILE) | while read line; do \
		if echo "$$line" | grep -q "Regenerating:"; then \
			echo "$$line"; \
			echo $$(date +%s) > /tmp/.jekyll_regenerating; \
		elif echo "$$line" | grep -q "\.\.\.done in"; then \
			rm -f /tmp/.jekyll_regenerating; \
			echo "  ✓ $$line"; \
		elif echo "$$line" | grep -q "_notebooks/.*\.ipynb"; then \
			echo "$$line"; \
			notebook=$$(echo "$$line" | grep -o '_notebooks/[^[:space:]]*\.ipynb'); \
			make convert-single NOTEBOOK_FILE="$$notebook" & \
		elif echo "$$line" | grep -q "_docx/.*\.docx"; then \
			echo "$$line"; \
			docx=$$(echo "$$line" | grep -o '_docx/[^[:space:]]*\.docx'); \
			make convert-docx-single DOCX_FILE="$$docx" & \
		fi; \
	done) 2>/dev/null & \
	sleep 2; \
	while true; do \
		if [ -f /tmp/.jekyll_regenerating ]; then \
			START=$$(cat /tmp/.jekyll_regenerating); \
			NOW=$$(date +%s); \
			ELAPSED=$$((NOW - START)); \
			if [ $$((ELAPSED % 10)) -eq 0 ] && [ $$ELAPSED -gt 0 ]; then \
				echo "  Still regenerating... ($$ELAPSED seconds elapsed)"; \
			fi; \
		fi; \
		sleep 1; \
	done

use-minima:
	@echo "Switching to Minima theme..."
	@cp _themes/minima/_config.yml _config.yml
	@cp _themes/minima/Gemfile Gemfile
	@cp _themes/minima/opencs.html _layouts/opencs.html
	@cp _themes/minima/page.html _layouts/page.html
	@cp _themes/minima/post.html _layouts/post.html
	@$(PYTHON) scripts/update_color_map.py minima || echo "⚠ Color map update failed, continuing..."
	@echo "✓ Minima theme activated"

use-cayman:
	@echo "Switching to Cayman theme..."
	@cp _themes/cayman/_config.yml _config.yml
	@cp _themes/cayman/Gemfile Gemfile
	@cp _themes/cayman/opencs.html _layouts/opencs.html
	@cp _themes/cayman/page.html _layouts/page.html
	@cp _themes/cayman/post.html _layouts/post.html
	@$(PYTHON) scripts/update_color_map.py cayman || echo "⚠ Color map update failed, continuing..."
	@echo "✓ Cayman theme activated"

use-hydejack:
	@echo "Switching to Hydejack theme..."
	@cp _themes/hydejack/_config.yml _config.yml
	@cp _themes/hydejack/Gemfile Gemfile
	@cp _themes/hydejack/opencs.html _layouts/opencs.html
	@cp _themes/hydejack/page.html _layouts/page.html
	@cp _themes/hydejack/post.html _layouts/post.html
	@$(PYTHON) scripts/update_color_map.py hydejack || echo "⚠ Color map update failed, continuing..."
	@echo "✓ Hydejack theme activated"

use-so-simple:
	@cp _themes/so-simple/_config.yml _config.yml
	@cp _themes/so-simple/Gemfile Gemfile
	@cp _themes/so-simple/opencs.html _layouts/opencs.html
	@cp _themes/so-simple/page.html _layouts/page.html
	@cp _themes/so-simple/post.html _layouts/post.html
	@cp _themes/so-simple/navigation.yml _data/navigation.yml

use-yat:
	@cp _themes/yat/_config.yml _config.yml
	@cp _themes/yat/Gemfile Gemfile
	@cp _themes/yat/opencs.html _layouts/opencs.html
	@cp _themes/yat/page.html _layouts/page.html
	@cp _themes/yat/post.html _layouts/post.html

serve-hydejack: use-hydejack clean
	@make serve-current

build-tactile: use-tactile build-current

# Serve with selected theme
serve-minima: use-minima clean
	@make serve-current

serve-text: use-text clean
	@make serve-current

serve-cayman: use-cayman clean
	@make serve-current

serve-so-simple: use-so-simple clean
	@make serve-current

serve-yat: use-yat clean
	@make serve-current

# General serve target (uses whatever is in _config.yml/Gemfile)
serve-current: stop convert split-courses jekyll-serve

# Build with selected theme
build-minima: use-minima build-current
build-text: use-text build-current
build-cayman: use-cayman build-current
build-so-simple: use-so-simple build-current
build-yat: use-yat build-current

build-current: clean convert split-courses
	@bundle install
	@bundle exec jekyll clean
	@bundle exec jekyll build

# General serve/build for whatever is current
serve: serve-current
build: build-current

# Multi-course file splitting
split-courses:
	@echo " ------ Splitting multi-course files... -------"
	@python3 scripts/split_multi_course_files.py

clean-courses:
	@echo "🧹 Cleaning course-specific files..."
	@python3 scripts/split_multi_course_files.py clean

# Notebook and DOCX conversion
convert: $(MARKDOWN_FILES) convert-docx
$(DESTINATION_DIRECTORY)/%_IPYNB_2_.md: _notebooks/%.ipynb
	@mkdir -p $(@D)
	@$(PYTHON) -c "from scripts.convert_notebooks import convert_notebooks; convert_notebooks()"

# Single notebook conversion (faster for development)
convert-single:
	@if [ -z "$(NOTEBOOK_FILE)" ]; then \
		echo "Error: NOTEBOOK_FILE variable not set"; \
		exit 1; \
	fi
	@echo "Converting: $(NOTEBOOK_FILE)"
	@$(PYTHON) scripts/convert_notebooks.py "$(NOTEBOOK_FILE)"

# DOCX conversion
convert-docx:
	@if [ -d "_docx" ] && [ "$(shell ls -A _docx 2>/dev/null)" ]; then \
		$(PYTHON) scripts/convert_docx.py; \
	else \
		echo "No DOCX files found in _docx directory"; \
	fi

# DOCX conversion for specific config change
convert-docx-config:
	@if [ -d "_docx" ] && [ "$(shell ls -A _docx 2>/dev/null)" ]; then \
		if [ -n "$(CONFIG_FILE)" ]; then \
			echo "🔧 Config file changed: $(CONFIG_FILE)"; \
			$(PYTHON) scripts/convert_docx.py --config-changed "$(CONFIG_FILE)"; \
		else \
			$(PYTHON) scripts/convert_docx.py; \
		fi; \
	else \
		echo "No DOCX files found in _docx directory"; \
	fi

# Clean only DOCX-converted files (safe)
clean-docx:
	@echo "Cleaning DOCX-converted files..."
	@find _posts -type f -name '*_DOCX_.md' -exec rm {} + 2>/dev/null || true
	@echo "Cleaning extracted DOCX images..."
	@rm -rf images/docx/*.png images/docx/*.jpg images/docx/*.jpeg images/docx/*.gif 2>/dev/null || true
	@echo "Cleaning DOCX index page..."
	@rm -f docx-index.md 2>/dev/null || true
	@echo "DOCX cleanup complete"

# Color mapping
update-colors:
	@echo "Updating local color map..."
	@$(PYTHON) scripts/update_color_map.py
	@echo "Color map updated successfully"
	@echo "Generated files:"
	@echo "   - _sass/root-color-map.scss"
	@echo "   - local-color-usage-report.md"
	@echo "   - colors.json"

# Update colors and preview
update-colors-preview: update-colors
	@echo "Starting server to preview color changes..."
	@make serve-current

clean: stop
	@echo "Cleaning converted IPYNB files..."
	@find _posts -type f -name '*_IPYNB_2_.md' -exec rm {} +
	@echo "Cleaning Github Issue files..."
	@find _posts -type f -name '*_GithubIssue_.md' -exec rm {} +
	@echo "Cleaning converted DOCX files..."
	@find _posts -type f -name '*_DOCX_.md' -exec rm {} + 2>/dev/null || true
	@echo "Cleaning course-specific files..."
	@make clean-courses
	@echo "Cleaning extracted DOCX images..."
	@rm -rf images/docx/*.png images/docx/*.jpg images/docx/*.jpeg images/docx/*.gif 2>/dev/null || true
	@echo "Cleaning DOCX index page..."
	@rm -f docx-index.md 2>/dev/null || true
	@echo "Removing empty directories in _posts..."
	@while [ $$(find _posts -type d -empty | wc -l) -gt 0 ]; do \
		find _posts -type d -empty -exec rmdir {} +; \
	done
	@echo "Removing _site directory..."
	@rm -rf _site

stop:
	@echo "Stopping server..."
	@@lsof -ti :$(PORT) | xargs kill >/dev/null 2>&1 || true
	@echo "Stopping logging process..."
	@@ps aux | awk -v log_file=$(LOG_FILE) '$$0 ~ "tail -f " log_file { print $$2 }' | xargs kill >/dev/null 2>&1 || true
	@echo "Stopping notebook watcher..."
	@@ps aux | grep "watch-notebooks" | grep -v grep | awk '{print $$2}' | xargs kill >/dev/null 2>&1 || true
	@@ps aux | grep "find _notebooks" | grep -v grep | awk '{print $$2}' | xargs kill >/dev/null 2>&1 || true
	@rm -f $(LOG_FILE) /tmp/.notebook_watch_marker /tmp/.jekyll_regenerating

reload:
	@make stop
	@make

refresh:
	@make stop
	@make clean
	@make

# Development mode: clean start, no conversion, converts files on save
# Runs in background - use 'make stop' to stop, 'tail -f /tmp/jekyll4500.log' to view logs
dev: stop clean jekyll-serve
	@make watch-notebooks &
	@make watch-files &
	@echo "Dev server running in background on http://localhost:$(PORT)"
	@echo "  View logs: tail -f $(LOG_FILE)"
	@echo "  Stop: make stop"

# Watch notebooks directory for changes (since Jekyll excludes _notebooks)
# Converts immediately (async), Jekyll serve handles regeneration batching
watch-notebooks:
	@echo "Watching _notebooks for changes..."
	@while true; do \
		find _notebooks -name '*.ipynb' -newer /tmp/.notebook_watch_marker 2>/dev/null | while read notebook; do \
			echo "Notebook changed: $$notebook"; \
			make convert-single NOTEBOOK_FILE="$$notebook" & \
		done; \
		touch /tmp/.notebook_watch_marker; \
		sleep 2; \
	done

# Bundle install (only runs if Gemfile changed)
bundle-install:
	@if [ ! -f .bundle/install_marker ] || [ Gemfile -nt .bundle/install_marker ]; then \
		echo "Installing bundle..."; \
		bundle install; \
		mkdir -p .bundle && touch .bundle/install_marker; \
	fi

# Start Jekyll server (incremental for development, production is GitHub Actions)
jekyll-serve: bundle-install
	@touch /tmp/.notebook_watch_marker
	@bundle exec jekyll serve -H $(HOST) -P $(PORT) --incremental > $(LOG_FILE) 2>&1 & \
		echo "Server PID: $$!"
	@make wait-for-server

# Common server wait logic
wait-for-server:
	@until [ -f $(LOG_FILE) ]; do sleep 1; done
	@for ((COUNTER = 0; ; COUNTER++)); do \
		if grep -q "Server address:" $(LOG_FILE); then \
			echo "Server started in $$COUNTER seconds"; \
			grep "Server address:" $(LOG_FILE); \
			break; \
		fi; \
		if [ $$COUNTER -eq 300 ]; then \
			echo "Server timed out after $$COUNTER seconds."; \
			echo "Review errors from $(LOG_FILE)."; \
			cat $(LOG_FILE); \
			exit 1; \
		fi; \
		if [ $$COUNTER -gt 5 ] && grep -E -qi "\bfatal\b|\bexception\b" $(LOG_FILE); then \
			echo "Fatal error detected during startup!"; \
			cat $(LOG_FILE); \
			exit 1; \
		fi; \
		if [ $$((COUNTER % 10)) -eq 0 ] && [ $$COUNTER -gt 0 ]; then \
			echo "Still starting... ($$COUNTER seconds elapsed)"; \
		fi; \
		sleep 1; \
	done

# Single DOCX file conversion (for dev mode)
convert-docx-single:
	@if [ -z "$(DOCX_FILE)" ]; then \
		echo "Error: DOCX_FILE variable not set"; \
		exit 1; \
	fi
	@echo "Converting: $(DOCX_FILE)"
	@$(PYTHON) scripts/convert_docx.py --single "$(DOCX_FILE)" 2>/dev/null || $(PYTHON) scripts/convert_docx.py

docx-only: convert-docx
	@echo "DOCX conversion complete - ready for preview"

preview-docx: clean-docx convert-docx
	@echo "Converting DOCX and starting preview server..."
	@make serve-current

help:
	@echo "Available Makefile commands:"
	@echo ""
	@echo "Theme Serve Commands:"
	@echo "  make serve-minima   - Switch to Minima and serve"
	@echo "  make serve-text     - Switch to TeXt and serve"
	@echo "  make serve-cayman   - Switch to Cayman and serve"
	@echo "  make serve-so-simple   - Switch to So Simple and serve"
	@echo "  make serve-yat      - Switch to Yat and serve"
	@echo "  make serve-hydejack - Switch to HydeJack and serve"
	@echo ""
	@echo "Theme Build Commands:"
	@echo "  make build-minima   - Switch to Minima and build"
	@echo "  make build-text     - Switch to TeXt and build"
	@echo "  make build-cayman   - Switch to Cayman and build"
	@echo "  make build-so-simple   - Switch to So Simple and build"
	@echo "  make build-yat      - Switch to Yat and build"
	@echo ""
	@echo "Color Mapping Commands:"
	@echo "  make update-colors         - Update local color map"
	@echo "  make update-colors-preview - Update colors and start server"
	@echo ""
	@echo "Server Commands:"
	@echo "  make              - Full conversion, serve, and watch for file changes (auto-convert on save)"
	@echo "  make dev          - Fast dev mode: clean start, no conversion, file watching, only convert files on save (quick)"
	@echo "  make serve        - Convert and serve (no auto-convert watching)"
	@echo "  make build        - Convert and build _site/ for deployment (no server)"
	@echo "  make stop         - Stop server and logging"
	@echo "  make reload       - Stop and restart server"
	@echo "  make refresh      - Stop, clean, and restart server"
	@echo ""
	@echo "Conversion Commands:"
	@echo "  make convert        - Convert notebooks and DOCX files"
	@echo "  make convert-docx   - Convert DOCX files only"
	@echo "  make split-courses  - Split multi-course files automatically"
	@echo "  make docx-only      - Convert DOCX and prepare for preview"
	@echo "  make preview-docx   - Clean, convert DOCX, and serve"
	@echo ""
	@echo "Cleanup Commands:"
	@echo "  make clean          - Remove all generated files"
	@echo "  make clean-docx     - Remove DOCX-generated files only"
	@echo "  make clean-courses  - Remove course-specific split files only"
	@echo ""
	@echo "Diagnostic Commands:"
	@echo "  make convert-check  - Check notebooks for conversion warnings"
	@echo "  make convert-fix    - Fix identified notebook conversion issues"

# Notebook diagnostic and fix targets
convert-check:
	@echo "Running conversion diagnostics..."
	@echo "Checking for notebook conversion warnings or errors..."
	@$(PYTHON) scripts/check_conversion_warnings.py

convert-fix:
	@echo "Running conversion fixes..."
	@echo "️Fixing notebooks with known warnings or errors..."
	@$(PYTHON) scripts/check_conversion_warnings.py --fix