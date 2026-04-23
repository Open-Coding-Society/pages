# Make Helper Project
# Generic targets: build, clean, docs, watch
# Called from main Makefile via: make -C _projects/make-helper <target>

PROJECT_NAME := $(notdir $(CURDIR))
WORKSPACE_ROOT := ../..

.PHONY: build clean docs watch

build:
	@mkdir -p $(WORKSPACE_ROOT)/logs
	@echo "✅ $(PROJECT_NAME) helper is ready"
	@echo "  Run: python _projects/$(PROJECT_NAME)/run_make.py"

clean:
	@echo "🧹 Cleaning $(PROJECT_NAME) helper artifacts..."
	@rm -f $(WORKSPACE_ROOT)/logs/make-helper.ready 2>/dev/null || true
	@echo "✓ cleaned"

docs:
	@echo "📚 $(PROJECT_NAME) helper does not publish project docs automatically."

watch:
	@echo "👀 $(PROJECT_NAME) helper has no live watcher; run the wrapper manually when needed."
