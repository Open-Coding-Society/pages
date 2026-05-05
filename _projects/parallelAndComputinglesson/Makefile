# CS Pathway Game Project Makefile
# Generic targets: build, assets, clean, watch, docs, docs-clean
# Called from main Makefile via: make -C _projects/cs-pathway-game <target>

###########################################
# CS Pathway Game Project Configuration
###########################################

# Project paths (relative to workspace root)
DATE_OF_CREATION = 2026-04-24
PROJECT_SRC = $(CURDIR)
PROJECT_NAME = $(notdir $(PROJECT_SRC))
NOTEBOOK_FILENAME = $(DATE_OF_CREATION)-$(PROJECT_NAME).ipynb
# When producing a distributed notebook, include the project name for clarity
DISTRIBUTED_NOTEBOOK_FILENAME = $(DATE_OF_CREATION)-$(PROJECT_NAME)-distributed.ipynb
UNDECIDABLE_NOTEBOOK_FILENAME = $(DATE_OF_CREATION)-$(PROJECT_NAME)-undecidable.ipynb

# Workspace root (main Makefile directory - two levels up from here)
# Use an absolute path so targets resolve correctly whether called from top-level or via -C
WORKSPACE_ROOT := $(abspath $(CURDIR)/../..)

# Distribution destinations (relative to workspace root, in .gitignore)
JS_DEST = $(WORKSPACE_ROOT)/assets/js/projects/$(PROJECT_NAME)
IMAGES_DEST = $(WORKSPACE_ROOT)/images/projects/$(PROJECT_NAME)
NOTEBOOK_DEST = $(WORKSPACE_ROOT)/_notebooks/projects/$(PROJECT_NAME)
DOCS_DEST = $(WORKSPACE_ROOT)/_posts/projects/$(PROJECT_NAME)
LAYOUT_DEST = $(WORKSPACE_ROOT)/_layouts

###########################################
# Build Targets
###########################################

# Main build target - copy notebooks and call assets
build:
	@mkdir -p $(NOTEBOOK_DEST)
	@if [ -f notebook.src.ipynb ]; then cp notebook.src.ipynb $(NOTEBOOK_DEST)/$(NOTEBOOK_FILENAME); else echo "⚠️  notebook.src.ipynb not found (optional)"; fi
	@if [ -f distributed_computing.ipynb ]; then cp distributed_computing.ipynb $(NOTEBOOK_DEST)/$(DISTRIBUTED_NOTEBOOK_FILENAME) && echo "✓ Copied distributed notebook"; fi
	@if [ -f undecidable.ipynb ]; then cp undecidable.ipynb $(NOTEBOOK_DEST)/$(UNDECIDABLE_NOTEBOOK_FILENAME) && echo "✓ Copied undecidable notebook"; fi
	@$(MAKE) assets
	@echo "✅ $(PROJECT_NAME) built successfully"
	@echo "   Source: _projects/$(PROJECT_NAME)/"
	@echo "   Notebooks: _notebooks/projects/$(PROJECT_NAME)/"
	@echo "   JavaScript: assets/js/projects/$(PROJECT_NAME)/"
	@echo "   Images: images/projects/$(PROJECT_NAME)/"
	@echo "   Layouts: _layouts/parallelAndComputinglesson.html"

# Copy only JS and image assets (not notebook) - for watch triggers
assets:
	@mkdir -p $(JS_DEST)/levels
	@if [ -d levels ] && [ "$$(ls -A levels/*.js 2>/dev/null)" ]; then cp levels/*.js $(JS_DEST)/levels/ && echo "✓ Copied levels JS"; fi
	@mkdir -p $(JS_DEST)/model
	@if [ -d model ] && [ "$$(ls -A model/*.js 2>/dev/null)" ]; then cp model/*.js $(JS_DEST)/model/ && echo "✓ Copied model JS"; fi
	@mkdir -p $(IMAGES_DEST)
	@if [ -d images ] && [ "$$(ls -A images 2>/dev/null)" ]; then cp -r images/* $(IMAGES_DEST)/ && echo "✓ Copied images"; fi
	@mkdir -p $(LAYOUT_DEST)
	@if [ -f parallelAndComputinglesson.html ]; then cp parallelAndComputinglesson.html $(LAYOUT_DEST)/parallelAndComputinglesson.html && echo "✓ Copied parallel computing lesson layout to _layouts"; fi

# Clean distributed files (keeps source intact)
clean:
	@echo "🧹 Cleaning $(PROJECT_NAME) distribution..."
	@rm -rf $(NOTEBOOK_DEST)
	@rm -rf $(JS_DEST)
	@rm -rf $(IMAGES_DEST)
	@rm -f $(LAYOUT_DEST)/parallelAndComputinglesson.html
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
			elif echo "$$changed_file" | grep -q "distributed_computing.ipynb"; then \
				echo "  🔄 Distributed notebook changed - copying and converting..."; \
				mkdir -p $(NOTEBOOK_DEST); \
				cp $(PROJECT_SRC)/distributed_computing.ipynb $(NOTEBOOK_DEST)/$(DISTRIBUTED_NOTEBOOK_FILENAME) 2>/dev/null || true; \
				cd $(WORKSPACE_ROOT) && make convert-single NOTEBOOK_FILE="$(NOTEBOOK_DEST)/$(DISTRIBUTED_NOTEBOOK_FILENAME)" 2>&1; \
			elif echo "$$changed_file" | grep -q "undecidable.ipynb"; then \
				echo "  🔄 Undecidable notebook changed - copying and converting..."; \
				mkdir -p $(NOTEBOOK_DEST); \
				cp $(PROJECT_SRC)/undecidable.ipynb $(NOTEBOOK_DEST)/$(UNDECIDABLE_NOTEBOOK_FILENAME) 2>/dev/null || true; \
				cd $(WORKSPACE_ROOT) && make convert-single NOTEBOOK_FILE="$(NOTEBOOK_DEST)/$(UNDECIDABLE_NOTEBOOK_FILENAME)" 2>&1; \
			elif echo "$$changed_file" | grep -q "/levels/"; then \
				filename=$$(basename "$$changed_file"); \
				echo "  🔄 Level changed: $$filename"; \
				mkdir -p $(JS_DEST)/levels; \
				cp "$$changed_file" $(JS_DEST)/levels/ 2>/dev/null || true; \
			elif echo "$$changed_file" | grep -q "/model/"; then \
				filename=$$(basename "$$changed_file"); \
				echo "  🔄 Model changed: $$filename"; \
				mkdir -p $(JS_DEST)/model; \
				cp "$$changed_file" $(JS_DEST)/model/ 2>/dev/null || true; \
			elif echo "$$changed_file" | grep -q "/images/"; then \
				echo "  🔄 Images changed - copying all images..."; \
				$(MAKE) assets 2>&1 | grep -v "cp:" | head -1; \
			elif echo "$$changed_file" | grep -q "parallelAndComputinglesson.html"; then \
				echo "  🔄 Layout changed - copying to _layouts..."; \
				mkdir -p $(LAYOUT_DEST); \
				cp "$$changed_file" $(LAYOUT_DEST)/parallelAndComputinglesson.html 2>/dev/null || true; \
			else \
				echo "  🔄 File changed: $$changed_file (copying all assets)"; \
				$(MAKE) assets 2>&1 | grep -v "cp:"; \
			fi; \
		done; \
	else \
		echo "⚠️  fswatch not installed (brew install fswatch for auto-watch)"; \
		echo "   Falling back to manual: run 'make -C _projects/$(PROJECT_NAME) build' after edits"; \
		while true; do sleep 3600; done; \
	fi

###########################################
# Documentation Targets (serve mode only)
###########################################

# Publish documentation with date prefixes to _posts/
docs:
	@echo "📚 Publishing $(PROJECT_NAME) documentation..."
	@mkdir -p $(DOCS_DEST)
	@for doc in docs/*.md; do \
		if [ -f "$$doc" ]; then \
			filename=$$(basename "$$doc"); \
			cp "$$doc" "$(DOCS_DEST)/$(DATE_OF_CREATION)-$(PROJECT_NAME)-$$filename" 2>/dev/null || true; \
		fi; \
	done
	@echo "✓ Documentation published to _posts/projects/$(PROJECT_NAME)/"

# Clean documentation distribution
docs-clean:
	@rm -rf $(DOCS_DEST)

.PHONY: build assets clean watch docs docs-clean
