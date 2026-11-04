# Fast localhost for testing. Run ./omake, stop with ./omake stop.
# Reuses targets from the main Makefile via sub-make.

HOST ?= localhost
PORT ?= 4500
NOTEBOOK_LIST := omake_notebooks.txt
# Second config only omake loads (adds scripts/omake/plugins); see that file.
JEKYLL_CONFIG := _config.yml,scripts/omake/jekyll_config.yml
PYTHON := venv/bin/python3
# One batched, parallel conversion call instead of a make + Python start per notebook.
CONVERT_JOBS ?= 4

SHELL = /bin/bash -c
.SHELLFLAGS = -e

MAIN_MAKE := $(MAKE) --no-print-directory -f Makefile
TEST_MAKE := $(MAKE) --no-print-directory -f scripts/omake/Makefile

PROJECT_FILE := _projects/.makeprojects
ALL_PROJECTS := $(shell grep -v '^\#' $(PROJECT_FILE) 2>/dev/null | grep -v '^$$' | cut -d: -f1)

.DEFAULT_GOAL := omake
.PHONY: omake stop test-build-project-assets test-convert-required-notebooks test-notebook-list test-convert-listed-notebooks test-jekyll-serve

omake: stop
	@$(MAIN_MAKE) clean
	@$(TEST_MAKE) test-build-project-assets
	@echo "Converting :dev project notebooks only..."
	@$(MAIN_MAKE) convert-registered-notebooks
	@$(TEST_MAKE) test-convert-required-notebooks
	@$(TEST_MAKE) test-convert-listed-notebooks
	@$(TEST_MAKE) test-jekyll-serve
	@echo ""
	@echo "Test server running on http://localhost:$(PORT)"
	@echo "  Add notebooks:  $(NOTEBOOK_LIST), then rerun ./omake"
	@echo "  Jekyll logs:    tail -f /tmp/jekyll$(PORT).log"
	@echo "  Stop:           ./omake stop"

# Only `index` (assets + index.md): the template's `notebooks` target now converts everything.
test-build-project-assets:
	@$(MAIN_MAKE) generate-makefiles >/dev/null
	@$(MAIN_MAKE) build-project-includes
	@for proj in $(ALL_PROJECTS); do \
		[ -d "_projects/$$proj" ] || continue; \
		echo "Copying assets: $$proj"; \
		$(MAKE) --no-print-directory -C "_projects/$$proj" index >/dev/null 2>&1 || echo "  ⚠️  Failed: $$proj"; \
	done
	@echo "Generating dynamic SASS imports..."
	@$(PYTHON) scripts/generate_sass_imports.py

# Reference pages crash Jekyll if their `lesson_category` has no posts.
test-convert-required-notebooks:
	@echo "Converting notebooks required for the site to build..."
	@$(PYTHON) scripts/omake/required_notebooks.py | \
		xargs -r -d '\n' $(PYTHON) scripts/convert_notebooks.py --jobs $(CONVERT_JOBS)

# Personal list is gitignored, so each machine creates its own on first run.
test-notebook-list:
	@if [ ! -f $(NOTEBOOK_LIST) ]; then \
		echo "📋 Creating $(NOTEBOOK_LIST) - add your notebook paths there"; \
		echo "# Notebooks ./omake converts, one path per line (_notebooks/... or _projects/...)." > $(NOTEBOOK_LIST); \
	fi

test-convert-listed-notebooks: test-notebook-list
	@grep -v '^\s*#' $(NOTEBOOK_LIST) | grep -v '^\s*$$' | while read -r notebook; do \
		if [ -f "$$notebook" ]; then \
			echo "$$notebook"; \
		else \
			echo "⚠️  Not found (check $(NOTEBOOK_LIST)): $$notebook" >&2; \
		fi; \
	done | xargs -r -d '\n' $(PYTHON) scripts/convert_notebooks.py --jobs $(CONVERT_JOBS) || \
		echo "⚠️  Some notebooks in $(NOTEBOOK_LIST) failed to convert (see above)"

# Same as the main `jekyll-serve` plus the omake config; reuses its log file,
# so the main `wait-for-server` and `stop` work unchanged.
test-jekyll-serve:
	@$(MAIN_MAKE) bundle-install
	@touch /tmp/.notebook_watch_marker
	@rm -f /tmp/.jekyll_rebuild_trigger
	@bundle exec jekyll serve -H $(HOST) -P $(PORT) --no-watch --config $(JEKYLL_CONFIG) > /tmp/jekyll$(PORT).log 2>&1 &
	@$(MAIN_MAKE) wait-for-server PORT=$(PORT)

stop:
	@$(MAIN_MAKE) stop PORT=$(PORT)

