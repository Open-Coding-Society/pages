# Student Management Groups Project Makefile
# Generic targets: build, assets, clean, watch, docs, docs-clean
# Called from main Makefile via: make -C _projects/student-management-groups <target>

###########################################
# Student Management Groups Configuration
###########################################

DATE_OF_CREATION = 2026-04-14
PROJECT_SRC = $(CURDIR)
PROJECT_NAME = $(notdir $(PROJECT_SRC))
NOTEBOOK_FILENAME = $(DATE_OF_CREATION)-$(PROJECT_NAME).ipynb

WORKSPACE_ROOT = ../..

JS_DEST = $(WORKSPACE_ROOT)/assets/js/projects/$(PROJECT_NAME)
IMAGES_DEST = $(WORKSPACE_ROOT)/images/projects/$(PROJECT_NAME)
NOTEBOOK_DEST = $(WORKSPACE_ROOT)/_notebooks/projects/$(PROJECT_NAME)
DOCS_DEST = $(WORKSPACE_ROOT)/_posts/projects/$(PROJECT_NAME)

###########################################
# Build Targets
###########################################

build:
	@mkdir -p $(NOTEBOOK_DEST)
	@cp notebook.src.ipynb $(NOTEBOOK_DEST)/$(NOTEBOOK_FILENAME) 2>/dev/null || true
	@$(MAKE) assets
	@$(MAKE) docs
	@echo "✅ $(PROJECT_NAME) built successfully"
	@echo "   Source: _projects/$(PROJECT_NAME)/"
	@echo "   Notebook: _notebooks/projects/$(PROJECT_NAME)/$(NOTEBOOK_FILENAME)"
	@echo "   JavaScript: assets/js/projects/$(PROJECT_NAME)/"
	@echo "   Images: images/projects/$(PROJECT_NAME)/"

assets:
	@mkdir -p $(JS_DEST)/js
	@cp js/*.js $(JS_DEST)/js/ 2>/dev/null || true
	@mkdir -p $(IMAGES_DEST)
	@cp -r images/* $(IMAGES_DEST)/ 2>/dev/null || true

clean:
	@echo "🧹 Cleaning $(PROJECT_NAME) distribution..."
	@rm -rf $(NOTEBOOK_DEST)
	@rm -rf $(JS_DEST)
	@rm -rf $(IMAGES_DEST)
	@echo "✓ Distribution cleaned (source files preserved in _projects/$(PROJECT_NAME))"

###########################################
# Watch Target (for dev mode)
###########################################

watch:
	@echo "👀 Watching $(PROJECT_NAME) project (auto-copy on save)..."
	@if command -v fswatch >/dev/null 2>&1; then \
		fswatch -l 0.3 -r $(PROJECT_SRC) 2>/dev/null | while read changed_file; do \
			if echo "$$changed_file" | grep -q "notebook.src.ipynb"; then \
				echo "  🔄 Notebook changed - copying and converting..."; \
				mkdir -p $(NOTEBOOK_DEST); \
				cp $(PROJECT_SRC)/notebook.src.ipynb $(NOTEBOOK_DEST)/$(NOTEBOOK_FILENAME) 2>/dev/null || true; \
				cd $(WORKSPACE_ROOT) && make convert-single NOTEBOOK_FILE="$(NOTEBOOK_DEST)/$(NOTEBOOK_FILENAME)" 2>&1; \
			elif echo "$$changed_file" | grep -q "/docs/"; then \
				echo "  🔄 Docs changed - publishing docs..."; \
				$(MAKE) docs; \
			elif echo "$$changed_file" | grep -q "/js/"; then \
				filename=$$(basename "$$changed_file"); \
				echo "  🔄 JS changed: $$filename"; \
				mkdir -p $(JS_DEST)/js; \
				cp "$$changed_file" $(JS_DEST)/js/ 2>/dev/null || true; \
			elif echo "$$changed_file" | grep -q "/images/"; then \
				echo "  🔄 Images changed - copying all images..."; \
				$(MAKE) assets 2>&1 | grep -v "cp:" | head -1; \
			else \
				echo "  🔄 File changed: $$changed_file (copying all assets)"; \
				$(MAKE) assets 2>&1 | grep -v "cp:"; \
			fi; \
		done; \
	else \
		echo "⚠️  fswatch not installed (brew install fswatch for auto-watch)"; \
		echo "   Falling back to manual: run 'make -C _projects/$(PROJECT_NAME) build docs' after edits"; \
		while true; do sleep 3600; done; \
	fi

###########################################
# Documentation Targets (serve mode only)
###########################################

docs:
	@echo "📚 Publishing $(PROJECT_NAME) documentation..."
	@rm -rf $(DOCS_DEST)
	@mkdir -p $(DOCS_DEST)
	@for doc in docs/*.md docs/*.html; do \
		if [ -f "$$doc" ]; then \
			filename=$$(basename "$$doc"); \
			cp "$$doc" "$(DOCS_DEST)/$(DATE_OF_CREATION)-$(PROJECT_NAME)-$$filename" 2>/dev/null || true; \
		fi; \
	done
	@echo "✓ Documentation published to _posts/projects/$(PROJECT_NAME)/"

docs-clean:
	@rm -rf $(DOCS_DEST)

.PHONY: build assets clean watch docs docs-clean
