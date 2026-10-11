# Template Project Makefile
# Generic targets required by Auto-Registration: build, assets, clean, watch, docs, docs-clean
# Called from main Makefile via: make -C _projects/$(PROJECT_NAME) <target>

###########################################
# Project Configuration
###########################################

# Project paths (relative to workspace root)
DATE_OF_CREATION = 2026-04-15
NAVIGATION_DATE = 2026-09-12
PROJECT_SRC = $(CURDIR)
PROJECT_NAME = $(notdir $(PROJECT_SRC))
NOTEBOOK_FILENAME = $(DATE_OF_CREATION)-$(PROJECT_NAME).ipynb
MARKDOWN_FILENAME = $(DATE_OF_CREATION)-$(PROJECT_NAME).md
NOTEBOOK_SOURCE = notebooks
CONVERT_JOBS ?= 4
CONVERT_FLAGS ?=
# Convention: source files are index.ipynb and index.md in project directory

# Workspace root - auto-detect depth (supports both flat and nested structures)
# If in _projects/category/project → ../../.. 
# If in _projects/project → ../..
ifeq ($(wildcard ../../Makefile),)
    WORKSPACE_ROOT = ../../..
else
    WORKSPACE_ROOT = ../..
endif
PYTHON = $(abspath $(WORKSPACE_ROOT))/venv/bin/python3

# Distribution destinations (relative to workspace root, in .gitignore)
JS_DEST = $(WORKSPACE_ROOT)/assets/js/projects/$(PROJECT_NAME)
CSS_DEST = $(WORKSPACE_ROOT)/assets/css/projects/$(PROJECT_NAME)
SASS_DEST = $(WORKSPACE_ROOT)/_sass/projects/$(PROJECT_NAME)
IMAGES_DEST = $(WORKSPACE_ROOT)/images/projects/$(PROJECT_NAME)
NOTEBOOK_DEST = $(WORKSPACE_ROOT)/_notebooks/projects/$(PROJECT_NAME)
DOCS_DEST = $(WORKSPACE_ROOT)/_posts/projects/$(PROJECT_NAME)
INCLUDES_DEST = $(WORKSPACE_ROOT)/_includes/projects/$(PROJECT_NAME)
NOTEBOOKS = $(wildcard $(NOTEBOOK_SOURCE)/*.ipynb)

###########################################
# Build Targets
###########################################

# Main build target - depends on index (which depends on assets) and notebook conversion
build: index convert
	@echo "✅ $(PROJECT_NAME) built successfully"
	@echo "   Source: _projects/$(PROJECT_NAME)/"
	@echo "   JavaScript: assets/js/projects/$(PROJECT_NAME)/"
	@echo "   CSS/SASS: assets/css/projects/$(PROJECT_NAME)/ & _sass/projects/$(PROJECT_NAME)/"
	@echo "   Page: _posts/projects/ (triggers Jekyll rebuild)"

# Copy DOCS, JS, SASS, and more assets
assets:
	@if [ -d "navigation" ]; then \
		mkdir -p $(DOCS_DEST) $(INCLUDES_DEST); \
		for file in navigation/*.md; do \
			[ -f "$$file" ] || continue; \
			filename=$$(basename "$$file"); \
			cmp -s "$$file" "$(DOCS_DEST)/$(NAVIGATION_DATE)-$$filename" || \
				cp "$$file" "$(DOCS_DEST)/$(NAVIGATION_DATE)-$$filename"; \
		done; \
		for file in navigation/*.html; do \
			[ -f "$$file" ] || continue; \
			cmp -s "$$file" "$(INCLUDES_DEST)/$$(basename "$$file")" || \
				cp "$$file" "$(INCLUDES_DEST)/$$(basename "$$file")"; \
		done; \
	fi
	@if [ -d "levels" ]; then mkdir -p $(JS_DEST)/levels; cp levels/*.js $(JS_DEST)/levels/ 2>/dev/null || true; fi
	@if [ -d "model" ]; then mkdir -p $(JS_DEST)/model; cp model/*.js $(JS_DEST)/model/ 2>/dev/null || true; fi
	@if [ -d "services" ]; then mkdir -p $(JS_DEST)/services; cp services/*.js $(JS_DEST)/services/ 2>/dev/null || true; fi
	@if [ -d "data" ]; then mkdir -p $(JS_DEST)/data; cp data/*.js $(JS_DEST)/data/ 2>/dev/null || true; fi
	@
	@# General JS parsing
	@if [ -d "js" ] && [ ! -f "distribution.json" ]; then mkdir -p $(JS_DEST); cp -r js/* $(JS_DEST)/ 2>/dev/null || true; fi
	@
	@# Images
	@if [ -d "images" ]; then mkdir -p $(IMAGES_DEST); cp -r images/* $(IMAGES_DEST)/ 2>/dev/null || true; fi
	@if [ -f "favicon.png" ]; then mkdir -p $(IMAGES_DEST); cp favicon.png $(IMAGES_DEST)/favicon.png; fi
	@
	@# Native Jekyll SASS processing
	@if [ -d "sass" ] && [ ! -f "distribution.json" ]; then \
		mkdir -p $(SASS_DEST); \
		cp -r sass/* $(SASS_DEST)/ 2>/dev/null || true; \
	fi
	@if [ -f "distribution.json" ]; then \
		ruby "$(WORKSPACE_ROOT)/scripts/publish_project.rb" publish "$(PROJECT_SRC)" "$(abspath $(WORKSPACE_ROOT))"; \
	fi
	@if [ -f "$(SASS_DEST)/main.scss" ]; then \
		mkdir -p $(CSS_DEST); \
		if ! printf '%s\n' '---' '---' '@import "projects/$(PROJECT_NAME)/main";' | cmp -s - "$(CSS_DEST)/main.scss"; then \
			printf '%s\n' '---' '---' '@import "projects/$(PROJECT_NAME)/main";' > "$(CSS_DEST)/main.scss"; \
		fi; \
	fi

# Index target - copy either index.ipynb or index.md (not both) AFTER assets are ready
# This triggers Jekyll rebuild, so it must run last
index: assets
	@if [ -f "index.ipynb" ] && [ -f "index.md" ]; then \
		echo "❌ Error: Project has both index.ipynb and index.md - only one allowed"; \
		exit 1; \
	fi
	@if [ -f "index.md" ]; then \
		mkdir -p $(WORKSPACE_ROOT)/_posts/projects; \
		if ! cmp -s index.md "$(WORKSPACE_ROOT)/_posts/projects/$(MARKDOWN_FILENAME)"; then \
			cp index.md "$(WORKSPACE_ROOT)/_posts/projects/$(MARKDOWN_FILENAME)" || exit 1; \
			touch /tmp/.jekyll_rebuild_trigger; \
		fi; \
	fi

# One invocation handles changed index, lesson, and navigation notebooks directly.
notebooks: convert

convert:
	@(cd $(WORKSPACE_ROOT) && $(PYTHON) scripts/convert_notebooks.py \
		--project "$(PROJECT_SRC)" --jobs "$(CONVERT_JOBS)" \
		--index-date "$(DATE_OF_CREATION)" --navigation-date "$(NAVIGATION_DATE)" $(CONVERT_FLAGS))

convert-single:
	@if [ -z "$(NOTEBOOK_FILE)" ]; then echo "NOTEBOOK_FILE is required"; exit 1; fi
	@(cd $(WORKSPACE_ROOT) && $(PYTHON) scripts/convert_notebooks.py "$(abspath $(NOTEBOOK_FILE))" \
		--jobs 1 --index-date "$(DATE_OF_CREATION)" --navigation-date "$(NAVIGATION_DATE)" $(CONVERT_FLAGS))

###########################################
# Clean Target
###########################################

# Clean distributed files (keeps source in _projects/$(PROJECT_NAME))
clean:
	@echo "🧹 Cleaning $(PROJECT_NAME) distribution..."
	@if [ -f "distribution.json" ] || [ -f "$(WORKSPACE_ROOT)/.project-distribution-cache/$(PROJECT_NAME).json" ]; then \
		ruby "$(WORKSPACE_ROOT)/scripts/publish_project.rb" clean "$(PROJECT_SRC)" "$(abspath $(WORKSPACE_ROOT))"; \
	fi
	@rm -f $(WORKSPACE_ROOT)/_posts/projects/$(MARKDOWN_FILENAME)
	@for notebook in $(NOTEBOOKS); do \
		filename=$$(basename "$$notebook" .ipynb); \
		rm -f "$(WORKSPACE_ROOT)/_posts/projects/$(PROJECT_NAME)/$${filename}_IPYNB_2_.md"; \
	done
	@rm -rf $(NOTEBOOK_DEST)
	@rm -rf $(JS_DEST)
	@rm -rf $(CSS_DEST)
	@rm -rf $(SASS_DEST)
	@rm -rf $(IMAGES_DEST)
	@rm -rf $(DOCS_DEST)
	@rm -rf $(INCLUDES_DEST)
	@touch /tmp/.jekyll_rebuild_trigger 2>/dev/null || true
	@echo "✓ Distribution cleaned (source files preserved in _projects/$(PROJECT_NAME))"

###########################################
# Watch Target (for dev mode)
###########################################

# Watch project files and auto-copy on change (timestamp-based, no fswatch needed)
watch:
	@echo "👀 Watching $(PROJECT_NAME) project (auto-copy on save)..."
	@mkdir -p /tmp
	@touch /tmp/.project_$(PROJECT_NAME)_marker
	@SCAN_MARKER=$$(mktemp); trap 'rm -f "$$SCAN_MARKER"' EXIT; \
	MANIFEST_FINGERPRINT=""; \
	while true; do \
		touch "$$SCAN_MARKER"; \
		changed=0; \
		if [ -f "$(PROJECT_SRC)/distribution.json" ] || [ -n "$$MANIFEST_FINGERPRINT" ]; then \
			CURRENT_FINGERPRINT=$$(ruby "$(WORKSPACE_ROOT)/scripts/publish_project.rb" fingerprint "$(PROJECT_SRC)" "$(abspath $(WORKSPACE_ROOT))") || exit 1; \
			if [ "$$CURRENT_FINGERPRINT" != "$$MANIFEST_FINGERPRINT" ]; then \
				$(MAKE) assets || exit 1; \
				touch /tmp/.jekyll_rebuild_trigger; \
				MANIFEST_FINGERPRINT="$$CURRENT_FINGERPRINT"; \
			fi; \
		fi; \
		if [ -f "$(PROJECT_SRC)/index.ipynb" ] && [ "$(PROJECT_SRC)/index.ipynb" -nt /tmp/.project_$(PROJECT_NAME)_marker ]; then \
			echo "  🔄 Notebook changed - converting source..."; \
			$(MAKE) convert-single NOTEBOOK_FILE="$(PROJECT_SRC)/index.ipynb" || exit 1; \
			touch /tmp/.jekyll_rebuild_trigger; \
			changed=1; \
		fi; \
		if [ -f "$(PROJECT_SRC)/index.md" ] && [ "$(PROJECT_SRC)/index.md" -nt /tmp/.project_$(PROJECT_NAME)_marker ]; then \
			$(MAKE) index || exit 1; \
		fi; \
		if [ -d "$(PROJECT_SRC)/$(NOTEBOOK_SOURCE)" ]; then \
			for notebook in $(PROJECT_SRC)/$(NOTEBOOK_SOURCE)/*.ipynb; do \
				[ -f "$$notebook" ] || continue; \
				if [ "$$notebook" -nt /tmp/.project_$(PROJECT_NAME)_marker ]; then \
					echo "  🔄 Lesson notebook changed - converting source..."; \
					$(MAKE) convert-single NOTEBOOK_FILE="$$notebook" || exit 1; \
					touch /tmp/.jekyll_rebuild_trigger; \
					changed=1; \
				fi; \
			done; \
		fi; \
		if [ -d "$(PROJECT_SRC)/navigation" ]; then \
			for notebook in "$(PROJECT_SRC)"/navigation/*.ipynb; do \
				[ -f "$$notebook" ] || continue; \
				if [ "$$notebook" -nt /tmp/.project_$(PROJECT_NAME)_marker ]; then \
					$(MAKE) convert-single NOTEBOOK_FILE="$$notebook" || exit 1; \
					touch /tmp/.jekyll_rebuild_trigger; \
					changed=1; \
				fi; \
			done; \
		fi; \
		if [ -d "$(PROJECT_SRC)/js" ]; then \
			for file in $$(find $(PROJECT_SRC)/js -type f -newer /tmp/.project_$(PROJECT_NAME)_marker 2>/dev/null); do \
				echo "  🔄 JS changed: $$file (updating assets)"; \
				$(MAKE) assets 2>&1 | grep -v "cp:"; \
				changed=1; \
				break; \
			done; \
		fi; \
		if [ -d "$(PROJECT_SRC)/data" ]; then \
			for file in $$(find $(PROJECT_SRC)/data -type f -newer /tmp/.project_$(PROJECT_NAME)_marker 2>/dev/null); do \
				echo "  🔄 Data changed: $$file (updating assets)"; \
				$(MAKE) assets 2>&1 | grep -v "cp:"; \
				changed=1; \
				break; \
			done; \
		fi; \
		if [ -d "$(PROJECT_SRC)/services" ]; then \
           for file in $$(find $(PROJECT_SRC)/services -type f -newer /tmp/.project_$(PROJECT_NAME)_marker 2>/dev/null); do \
               echo "  🔄 Services changed: $$file (updating assets)"; \
               $(MAKE) assets 2>&1 | grep -v "cp:"; \
               changed=1; \
               break; \
           done; \
       	fi; \
		if [ -d "$(PROJECT_SRC)/sass" ]; then \
			for file in $$(find $(PROJECT_SRC)/sass -type f -newer /tmp/.project_$(PROJECT_NAME)_marker 2>/dev/null); do \
				echo "  🔄 SASS changed: $$file (updating assets)"; \
				$(MAKE) assets 2>&1 | grep -v "cp:"; \
				changed=1; \
				break; \
			done; \
		fi; \
		if [ -d "$(PROJECT_SRC)/images" ]; then \
			for file in $$(find $(PROJECT_SRC)/images -type f -newer /tmp/.project_$(PROJECT_NAME)_marker 2>/dev/null); do \
				echo "  🔄 Image changed: $$file (updating assets)"; \
				$(MAKE) assets 2>&1 | grep -v "cp:"; \
				changed=1; \
				break; \
			done; \
		fi; \
		touch -r "$$SCAN_MARKER" /tmp/.project_$(PROJECT_NAME)_marker; \
		sleep 2; \
	done

###########################################
# Documentation Targets
###########################################

docs:
	@if [ -d "docs" ]; then \
		echo "📚 Publishing $(PROJECT_NAME) documentation..."; \
		mkdir -p $(DOCS_DEST); \
		for doc in docs/*.md docs/*.html; do \
			if [ -f "$$doc" ]; then \
				filename=$$(basename "$$doc"); \
				cmp -s "$$doc" "$(DOCS_DEST)/$(DATE_OF_CREATION)-$(PROJECT_NAME)-$$filename" || \
					cp "$$doc" "$(DOCS_DEST)/$(DATE_OF_CREATION)-$(PROJECT_NAME)-$$filename" || exit 1; \
			fi; \
		done; \
		echo "✓ Documentation published to _posts/projects/$(PROJECT_NAME)/"; \
	fi

docs-clean:
	@rm -rf $(DOCS_DEST)

.PHONY: build index assets notebooks convert convert-single clean watch docs docs-clean
