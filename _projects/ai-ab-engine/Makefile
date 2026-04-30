DATE_OF_CREATION = 2026-04-20
PROJECT_SRC = $(CURDIR)
PROJECT_NAME = $(notdir $(PROJECT_SRC))
NOTEBOOK_FILENAME = $(DATE_OF_CREATION)-$(PROJECT_NAME).ipynb

WORKSPACE_ROOT = ../..
JS_DEST = $(WORKSPACE_ROOT)/assets/js/projects/$(PROJECT_NAME)
CSS_DEST = $(WORKSPACE_ROOT)/assets/css/projects/$(PROJECT_NAME)
SASS_DEST = $(WORKSPACE_ROOT)/_sass/projects/$(PROJECT_NAME)
IMAGES_DEST = $(WORKSPACE_ROOT)/images/projects/$(PROJECT_NAME)
NOTEBOOK_DEST = $(WORKSPACE_ROOT)/_notebooks/projects/$(PROJECT_NAME)
DOCS_DEST = $(WORKSPACE_ROOT)/_posts/projects/$(PROJECT_NAME)

build:
	@mkdir -p $(NOTEBOOK_DEST)
	@if [ -f "notebook.src.ipynb" ]; then \
		cp notebook.src.ipynb $(NOTEBOOK_DEST)/$(NOTEBOOK_FILENAME) 2>/dev/null || true; \
	fi
	@$(MAKE) assets
	@echo "✅ $(PROJECT_NAME) built successfully"

assets:
	@if [ -d "js" ]; then mkdir -p $(JS_DEST); cp -r js/* $(JS_DEST)/ 2>/dev/null || true; fi
	@if [ -d "images" ]; then mkdir -p $(IMAGES_DEST); cp -r images/* $(IMAGES_DEST)/ 2>/dev/null || true; fi

clean:
	@rm -rf $(NOTEBOOK_DEST)/$(NOTEBOOK_FILENAME)
	@rm -rf $(JS_DEST) $(CSS_DEST) $(SASS_DEST) $(IMAGES_DEST)

docs:
	@if [ -d "docs" ]; then \
		mkdir -p $(DOCS_DEST); \
		for doc in docs/*.md; do \
			if [ -f "$$doc" ]; then \
				filename=$$(basename "$$doc"); \
				cp "$$doc" "$(DOCS_DEST)/$(DATE_OF_CREATION)-$(PROJECT_NAME)-$$filename" 2>/dev/null || true; \
			fi; \
		done; \
	fi

docs-clean:
	@rm -rf $(DOCS_DEST)

.PHONY: build assets clean docs docs-clean
