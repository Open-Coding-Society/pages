# Template Project Makefile
# Generic targets required by Auto-Registration: build, assets, clean, watch, docs, docs-clean
# Called from main Makefile via: make -C _projects/$(PROJECT_NAME) <target>

###########################################
# Project Configuration
###########################################

# Project paths (relative to workspace root)
DATE_OF_CREATION = 2026-04-15
PROJECT_SRC = $(CURDIR)
PROJECT_NAME = $(notdir $(PROJECT_SRC))
NOTEBOOK_FILENAME = $(DATE_OF_CREATION)-$(PROJECT_NAME).ipynb

# Workspace root (main Makefile directory - two levels up from here)
WORKSPACE_ROOT = ../..

# Distribution destinations (relative to workspace root, in .gitignore)
JS_DEST = $(WORKSPACE_ROOT)/assets/js/projects/$(PROJECT_NAME)
CSS_DEST = $(WORKSPACE_ROOT)/assets/css/projects/$(PROJECT_NAME)
SASS_DEST = $(WORKSPACE_ROOT)/_sass/projects/$(PROJECT_NAME)
IMAGES_DEST = $(WORKSPACE_ROOT)/images/projects/$(PROJECT_NAME)
NOTEBOOK_DEST = $(WORKSPACE_ROOT)/_notebooks/projects/$(PROJECT_NAME)
DOCS_DEST = $(WORKSPACE_ROOT)/_posts/projects/$(PROJECT_NAME)

###########################################
# Build Targets
###########################################

# Main build target - copy notebook and call assets
build:
	@mkdir -p $(NOTEBOOK_DEST)
	@if [ -f "notebook.src.ipynb" ]; then \
		cp notebook.src.ipynb $(NOTEBOOK_DEST)/$(NOTEBOOK_FILENAME) 2>/dev/null || true; \
	fi
	@$(MAKE) assets
	@echo "✅ $(PROJECT_NAME) built successfully"
	@echo "   Source: _projects/$(PROJECT_NAME)/"
	@echo "   JavaScript: assets/js/projects/$(PROJECT_NAME)/"
	@echo "   CSS/SASS: assets/css/projects/$(PROJECT_NAME)/ & _sass/projects/$(PROJECT_NAME)/"

# Copy JS, SASS, and image assets
assets:
	@# Legacy level/model JS parsing
	@if [ -d "levels" ]; then mkdir -p $(JS_DEST)/levels; cp levels/*.js $(JS_DEST)/levels/ 2>/dev/null || true; fi
	@if [ -d "model" ]; then mkdir -p $(JS_DEST)/model; cp model/*.js $(JS_DEST)/model/ 2>/dev/null || true; fi
	@
	@# General JS parsing
	@if [ -d "js" ]; then mkdir -p $(JS_DEST); cp -r js/* $(JS_DEST)/ 2>/dev/null || true; fi
	@
	@# Images
	@if [ -d "images" ]; then mkdir -p $(IMAGES_DEST); cp -r images/* $(IMAGES_DEST)/ 2>/dev/null || true; fi
	@
	@# Native Jekyll SASS processing
	@if [ -d "sass" ]; then \
		mkdir -p $(SASS_DEST); \
		cp -r sass/* $(SASS_DEST)/ 2>/dev/null || true; \
		if [ -f "$(SASS_DEST)/main.scss" ]; then \
			mkdir -p $(CSS_DEST); \
			echo "---" > $(CSS_DEST)/main.scss; \
			echo "---" >> $(CSS_DEST)/main.scss; \
			echo "@import \"projects/$(PROJECT_NAME)/main\";" >> $(CSS_DEST)/main.scss; \
		fi; \
	fi

# Clean distributed files (keeps source intact)
clean:
	@echo "🧹 Cleaning $(PROJECT_NAME) distribution..."
	@rm -rf $(NOTEBOOK_DEST)/$(NOTEBOOK_FILENAME)
	@rm -rf $(JS_DEST)
	@rm -rf $(CSS_DEST)
	@rm -rf $(SASS_DEST)
	@rm -rf $(IMAGES_DEST)
	@echo "✓ Distribution cleaned (source files preserved in _projects/$(PROJECT_NAME))"

###########################################
# Watch Target (for dev mode)
###########################################

# Watch project files and auto-copy on change
watch:
	@echo "👀 Watching $(PROJECT_NAME) project (auto-copy on save)..."
	@if command -v fswatch >/dev/null 2>&1; then \
		fswatch -l 0.3 -r $(PROJECT_SRC) 2>/dev/null | while read changed_file; do \
			if echo "$$changed_file" | grep -q "notebook.src.ipynb"; then \
				echo "  🔄 Notebook changed - copying and converting..."; \
				mkdir -p $(NOTEBOOK_DEST); \
				cp $(PROJECT_SRC)/notebook.src.ipynb $(NOTEBOOK_DEST)/$(NOTEBOOK_FILENAME) 2>/dev/null || true; \
				cd $(WORKSPACE_ROOT) && make convert-single NOTEBOOK_FILE="$(NOTEBOOK_DEST)/$(NOTEBOOK_FILENAME)" 2>&1; \
			else \
				echo "  🔄 File changed: $$changed_file (updating assets)"; \
				$(MAKE) assets 2>&1 | grep -v "cp:"; \
			fi; \
		done; \
	else \
		echo "⚠️  fswatch not installed (brew install fswatch for auto-watch)"; \
		echo "   Falling back to manual: run 'make -C _projects/$(PROJECT_NAME) build' after edits"; \
		while true; do sleep 3600; done; \
	fi

###########################################
# Documentation Targets
###########################################

docs:
	@if [ -d "docs" ]; then \
		echo "📚 Publishing $(PROJECT_NAME) documentation..."; \
		mkdir -p $(DOCS_DEST); \
		for doc in docs/*.md; do \
			if [ -f "$$doc" ]; then \
				filename=$$(basename "$$doc"); \
				cp "$$doc" "$(DOCS_DEST)/$(DATE_OF_CREATION)-$(PROJECT_NAME)-$$filename" 2>/dev/null || true; \
			fi; \
		done; \
		echo "✓ Documentation published to _posts/projects/$(PROJECT_NAME)/"; \
	fi

docs-clean:
	@rm -rf $(DOCS_DEST)

.PHONY: build assets clean watch docs docs-clean
