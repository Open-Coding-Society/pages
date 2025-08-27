PORT ?= 4500
LOG_FILE = /tmp/jekyll$(PORT).log

SHELL = /bin/bash -c
.SHELLFLAGS = -e

NOTEBOOK_FILES := $(shell find _notebooks -name '*.ipynb')
DESTINATION_DIRECTORY = _posts
MARKDOWN_FILES := $(patsubst _notebooks/%.ipynb,$(DESTINATION_DIRECTORY)/%_IPYNB_2_.md,$(NOTEBOOK_FILES))

default: serve-current
	@echo "Terminal logging starting, watching server for regeneration..."
	@(tail -f $(LOG_FILE) | awk '/Server address:/ { serverReady=1 } \
	serverReady && /^ *Regenerating:/ { regenerate=1 } \
	regenerate { \
		if (/^[[:blank:]]*$$/) { regenerate=0 } \
		else { \
			print; \
			if ($$0 ~ /_notebooks\/.*\.ipynb/) { system("make convert &") } \
		} \
	}') 2>/dev/null &
	@for ((COUNTER = 0; ; COUNTER++)); do \
		if grep -q "Server address:" $(LOG_FILE); then \
			echo "Server started in $$COUNTER seconds"; \
			break; \
		fi; \
		if [ $$COUNTER -eq 120 ]; then \
			echo "Server timed out after $$COUNTER seconds."; \
			echo "Review errors from $(LOG_FILE)."; \
			cat $(LOG_FILE); \
			exit 1; \
		fi; \
		sleep 1; \
	done
	@sed '$$d' $(LOG_FILE)

# Theme switching: copy config and Gemfile for the theme
use-minima:
	@cp _themes/minima/_config.yml _config.yml
	@cp _themes/minima/Gemfile Gemfile
	@cp _themes/minima/opencs.html _layouts/opencs.html
	@cp _themes/minima/page.html _layouts/page.html
	@cp _themes/minima/post.html _layouts/post.html

use-text:
	@cp _themes/text/_config.yml _config.yml
	@cp _themes/text/Gemfile Gemfile
	@cp _themes/text/opencs.html _layouts/opencs.html
	@cp _themes/text/page.html _layouts/page.html
	@cp _themes/text/post.html _layouts/post.html
	@cp _themes/text/navigation.yml _data/navigation.yml

use-cayman:
	@cp _themes/cayman/_config.yml _config.yml
	@cp _themes/cayman/Gemfile Gemfile
	@cp _themes/cayman/opencs.html _layouts/opencs.html
	@cp _themes/cayman/page.html _layouts/page.html
	@cp _themes/cayman/post.html _layouts/post.html

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
serve-current: stop convert
	@echo "Starting server with current config/Gemfile..."
	@@nohup bundle install && bundle exec jekyll serve -H 127.0.0.1 -P $(PORT) > $(LOG_FILE) 2>&1 & \
		PID=$$!; \
		echo "Server PID: $$PID"
	@@until [ -f $(LOG_FILE) ]; do sleep 1; done
	@for ((COUNTER = 0; ; COUNTER++)); do \
		if grep -q "Server address:" $(LOG_FILE); then \
			echo "Server started in $$COUNTER seconds"; \
			grep "Server address:" $(LOG_FILE); \
			break; \
		fi; \
		if [ $$COUNTER -eq 120 ]; then \
			echo "Server timed out after $$COUNTER seconds."; \
			echo "Review errors from $(LOG_FILE)."; \
			cat $(LOG_FILE); \
			exit 1; \
		fi; \
		sleep 1; \
	done

# Build with selected theme
build-minima: use-minima build-current
build-text: use-text build-current
build-cayman: use-cayman build-current
build-so-simple: use-so-simple build-current
build-yat: use-yat build-current

build-current: clean
	@bundle install
	@bundle exec jekyll clean
	@bundle exec jekyll build

# General serve/build for whatever is current
serve: serve-current
build: build-current

# Notebook conversion
convert: $(MARKDOWN_FILES)
$(DESTINATION_DIRECTORY)/%_IPYNB_2_.md: _notebooks/%.ipynb
	@mkdir -p $(@D)
	@python3 -c "from scripts.convert_notebooks import convert_notebooks; convert_notebooks()"

clean: stop
	@echo "Cleaning converted IPYNB files..."
	@find _posts -type f -name '*_IPYNB_2_.md' -exec rm {} +
	@echo "Cleaning Github Issue files..."
	@find _posts -type f -name '*_GithubIssue_.md' -exec rm {} +
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
	@rm -f $(LOG_FILE)

reload:
	@make stop
	@make

refresh:
	@make stop
	@make clean
	@make

help:
	@echo "Available Makefile commands:"
	@echo "  make serve-minima   - Switch to Minima and serve"
	@echo "  make serve-text     - Switch to TeXt and serve"
	@echo "  make serve-cayman   - Switch to Cayman and serve"
	@echo "  make serve-so-simple   - Switch to So Simple and serve"
	@echo "  make serve-yat      - Switch to Yat and serve"
	@echo "  make serve          - Serve with current config"
	@echo "  make build-minima   - Switch to Minima and build"
	@echo "  make build-text     - Switch to TeXt and build"
	@echo "  make build-cayman   - Switch to Cayman and build"
	@echo "  make build-so-simple   - Switch to So Simple and build"
	@echo "  make build-yat      - Switch to Yat and build"
	@echo "  make build          - Build with current config"
	@echo "  make clean          - Remove generated files"
	@echo "  make stop           - Stop server and logging"
	@echo "  make reload         - Stop and restart server"
	@echo "  make refresh        - Stop, clean, and restart server"
	@echo "  make convert        - Convert notebooks to Markdown"