# Makefile — Robot Logic Game (local-only)
# This project builds and runs standalone via test.html.
# Use `make serve` to start a local HTTP server, then open the printed URL.

PROJECT_NAME = robot-logic-game
PORT ?= 8765

###########################################
# Serve the test page locally
###########################################

# Start a local HTTP server rooted at this directory so ES module imports work.
# Open http://localhost:$(PORT)/test.html in your browser.
serve:
	@echo "🤖 Serving $(PROJECT_NAME) at http://localhost:$(PORT)/test.html"
	@echo "   Press Ctrl+C to stop."
	@python3 -m http.server $(PORT) --bind 127.0.0.1

# Open the test page in the default browser (macOS).
# Assumes `make serve` is already running in another terminal.
open:
	@open "http://localhost:$(PORT)/test.html"

###########################################
# Housekeeping
###########################################

# Remove macOS / editor junk from this project.
clean:
	@find . -name ".DS_Store" -delete
	@echo "✓ Cleaned."

# No-op targets kept so the top-level workspace Makefile can still invoke
# build/assets/docs/docs-clean/watch without error. This project is local-only
# for now — it does not publish into the Jekyll site.
build assets docs docs-clean watch:
	@echo "↪ $(PROJECT_NAME): '$@' is a no-op (local-only project). Use 'make serve' to run."

.PHONY: serve open clean build assets docs docs-clean watch
