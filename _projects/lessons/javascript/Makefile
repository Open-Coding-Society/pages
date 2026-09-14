PROJECT_NAME = javascript
WORKSPACE_ROOT = ../../..
WORKSPACE_ROOT_ABS = $(abspath $(WORKSPACE_ROOT))
SOURCE_ROOT = notebooks
DEST_ROOT = $(WORKSPACE_ROOT)/_notebooks/CSSE/JavaScriptLessons
DEST_ROOT_ABS = $(abspath $(DEST_ROOT))
PAGE_DEST = $(WORKSPACE_ROOT)/_posts/projects/2026-09-13-javascript.md
STALE_PAGE_DEST = $(WORKSPACE_ROOT)/_posts/projects/2026-04-15-javascript.md

NOTEBOOKS = $(shell find $(SOURCE_ROOT) -maxdepth 1 -type f -name '*.ipynb')

.PHONY: build index notebooks convert clean

build: index notebooks convert
	@echo "$(PROJECT_NAME) lesson project built successfully"

index:
	@mkdir -p "$$(dirname "$(PAGE_DEST)")"
	@cp index.md "$(PAGE_DEST)"

notebooks:
	@mkdir -p "$(DEST_ROOT)"
	@for notebook in $(NOTEBOOKS); do \
		filename=$$(basename "$$notebook"); \
		cp "$$notebook" "$(DEST_ROOT)/$$filename"; \
	done

convert: notebooks
	@for notebook in $(NOTEBOOKS); do \
		filename=$$(basename "$$notebook"); \
		(cd "$(WORKSPACE_ROOT_ABS)" && "$(WORKSPACE_ROOT_ABS)/venv/bin/python3" "$(WORKSPACE_ROOT_ABS)/scripts/convert_notebooks.py" "$(DEST_ROOT_ABS)/$$filename") >/dev/null || exit 1; \
	done

clean:
	@rm -f "$(PAGE_DEST)" "$(STALE_PAGE_DEST)"
	@for notebook in $(NOTEBOOKS); do \
		filename=$$(basename "$$notebook"); \
		rm -f "$(DEST_ROOT)/$$filename"; \
	done
