# Makefile Guide

A reference for the custom commands in this project's Makefile, plus a beginner's introduction to writing your own.

---

## What is a Makefile?

A `Makefile` is a file that defines shell commands under named **targets**. Instead of typing a long command every time, you run `make <target>` and Make executes the recipe for you.

```
make serve        # runs whatever "serve" is defined to do
make from-list    # runs the "from-list" recipe
```

Make was originally built for compiling C programs, but it works great as a task runner for any project.

---

## Basic Makefile Syntax

```makefile
target-name: dependency1 dependency2
	@shell command here
	@another command
```

- **target-name** — what you type after `make`
- **dependencies** — other targets that must run first (optional)
- **recipe lines** — the shell commands to execute, each indented with a **tab** (not spaces)
- **`@`** — suppresses echoing the command itself; without it, Make prints the command before running it

### Variables

```makefile
PORT ?= 4500          # define with a default (can be overridden: make PORT=8080)
HOST := localhost      # define statically

serve:
	bundle exec jekyll serve -P $(PORT) -H $(HOST)
```

- `$(VAR)` — expand a variable
- `?=` — set only if not already set
- `:=` — always set

### `.PHONY`

```makefile
.PHONY: serve clean build
```

Tells Make these names are commands, not files. Without this, if a file named `serve` existed in the repo, `make serve` would do nothing (thinking the file is already "built"). Always declare your custom commands in `.PHONY`.

---

## Reading Extra Arguments from the Command Line

The trickiest part of this Makefile's custom commands is passing a second word as an argument, like:

```
make specific fault_tolerance.ipynb
make scope csp
```

Make doesn't natively support arguments the way a shell script does. The pattern used here works around that:

```makefile
# Step 1 — capture the second word at parse time
ifeq (specific,$(firstword $(MAKECMDGOALS)))
  _SPECIFIC_TARGET := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(if $(_SPECIFIC_TARGET),$(eval $(_SPECIFIC_TARGET):;@:))
endif

# Step 2 — re-capture it at run time inside the recipe
specific: bundle-install
	$(eval _SPECIFIC_TARGET := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS)))
	@echo "Argument was: $(_SPECIFIC_TARGET)"
```

**Why two captures?**

- The `ifeq` block runs at **parse time** (when Make reads the file). It grabs the argument early so Make knows the second word isn't a real target — the `$(eval ...:;@:)` line creates a dummy no-op rule for it so Make doesn't error out.
- The `$(eval ...)` inside the recipe runs at **execution time** so the variable is available when the shell commands run.

**Key Make functions used:**

| Function | What it does |
|---|---|
| `$(firstword ...)` | Returns the first word of a list |
| `$(wordlist 2,N,LIST)` | Returns words 2 through N from LIST |
| `$(words LIST)` | Returns the count of words in a list |
| `$(MAKECMDGOALS)` | Built-in variable — all targets typed on the command line |
| `$(eval ...)` | Evaluates a string as Makefile syntax at runtime |

---

## Custom Commands Added to This Project

### `make scope [csp|csa|csse|all]`

Does a clean Jekyll build without running notebook conversion or project builds. Optionally limits which `_posts` subdirectory is included.

```
make scope          # builds all _posts
make scope csp      # builds only _posts/CSP
make scope csse     # builds only _posts/CSSE
```

**How it works:** Creates a temporary `_jekyll_core_scope.yml` that lists all *other* `_posts` subdirectories under `exclude:`, then passes it to Jekyll alongside the main config. Jekyll merges the two configs and skips the excluded directories.

```makefile
ifeq (scope,$(firstword $(MAKECMDGOALS)))
  _CORE_SCOPE := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(if $(_CORE_SCOPE),$(eval $(_CORE_SCOPE):;@:))
endif
scope: bundle-install
	$(eval _CORE_SCOPE := $(or $(_CORE_SCOPE),all))
	...
```

`$(or $(_CORE_SCOPE),all)` returns `_CORE_SCOPE` if it has a value, otherwise `all` — a clean way to set a default.

---

### `make specific <filename>`

Converts a single notebook or docx file **and** serves Jekyll showing only that one post. Accepts the filename with or without extension.

```
make specific fault_tolerance.ipynb
make specific fault_tolerance       # also works
```

**How it works in two phases:**

1. **Find & convert** — searches the repo (excluding `_site`, `.git`, `venv`, `_posts`) for a file matching the name (or name + `.ipynb`/`.docx`). Calls `convert-single` or `convert-docx-single`.

2. **Isolate & serve** — strips the extension to get a base name, finds the matching file in `_posts`, then builds an exclude config that lists every other post in the same subdirectory plus every other subdirectory.

```makefile
# Find source and convert
FOUND=$$(find . \
    -not -path "./_site/*" \
    -not -path "./_posts/*" \
    \( -name "$(_SPECIFIC_TARGET)" -o -name "$(_SPECIFIC_TARGET).ipynb" \) \
    2>/dev/null | head -1)

# Strip extension to find the _posts match
BASE=$$(basename "$(_SPECIFIC_TARGET)" .ipynb)
POST=$$(find _posts -name "*$$BASE*" | head -1)
```

The `\( -name "A" -o -name "B" \)` syntax is a shell `find` OR group — matches either filename form.

---

### `make from-list`

Reads `buildset.txt` (one notebook filename per line), converts every notebook in the list, then serves Jekyll showing only those posts.

```
# buildset.txt
2026-04-24-fault_tolerance.ipynb
2026-03-15-binary_search.ipynb
```

```
make from-list
```

**How it works in three phases:**

1. **Convert all** — loops through `buildset.txt`, finds each source file, and converts it.

2. **Resolve posts** — loops again, strips extensions, finds each matching file in `_posts`, and writes the paths to a temp file `/tmp/_jekyll_fromlist_posts.txt`.

3. **Build exclude config** — iterates over every top-level `_posts` subdirectory:
   - If **none** of the resolved posts are in that directory → exclude the whole directory.
   - If **some** are → exclude only the individual files in that directory that aren't in the list.

```makefile
find _posts -mindepth 1 -maxdepth 1 -type d | sort | while IFS= read -r dir; do \
    if ! grep -q "^$$dir/" /tmp/_jekyll_fromlist_posts.txt; then \
        printf '  - %s\n' "$$dir" >> /tmp/_jekyll_fromlist.yml; \
    else \
        find "$$dir" -maxdepth 1 \( -name "*.md" -o -name "*.html" \) | while IFS= read -r f; do \
            if ! grep -qF "$$f" /tmp/_jekyll_fromlist_posts.txt; then \
                printf '  - %s\n' "$$f" >> /tmp/_jekyll_fromlist.yml; \
            fi; \
        done; \
    fi; \
done
```

---

## Writing Your Own Command

Here's a minimal template:

```makefile
# Simple command — no arguments
hello:
	@echo "Hello from Make!"
```

```makefile
# Command with a dependency
greet: hello
	@echo "Nice to meet you."
```

```makefile
# Command that accepts one argument: make say hello
ifeq (say,$(firstword $(MAKECMDGOALS)))
  _SAY_ARG := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(if $(_SAY_ARG),$(eval $(_SAY_ARG):;@:))
endif
say:
	$(eval _SAY_ARG := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS)))
	@if [ -z "$(_SAY_ARG)" ]; then echo "Usage: make say <word>"; exit 1; fi
	@echo "You said: $(_SAY_ARG)"
```

```makefile
# Add it to .PHONY so it always runs
.PHONY: hello greet say
```

**Common gotchas:**
- Indent recipe lines with a **tab**, not spaces — Make will error with `missing separator` if you use spaces.
- Each `@command \` line with `\` continuations is a single shell invocation. Variables set in one `@` block are not visible in the next `@` block — use a single block with `\` if you need shared state.
- `$$VAR` in a recipe means a shell variable (`$VAR`). A single `$` is reserved for Make variables.
