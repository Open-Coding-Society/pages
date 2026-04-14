---
layout: post
title: Terminal Simulator Documentation
permalink: /tools/terminal-simulator-documentation/
---

# Interactive Terminal Simulator Documentation

## Quick Start (TL;DR)

Add this one line to any lesson markdown file:

```liquid
{% include tools/interactive-terminal-simulator.html %}
```

Students can now type commands like `ls`, `mkdir`, `touch`, `cat`, `echo > file`, and `cd`. Changes display instantly. Refresh the page to reset.

**Multiple simulators on one page:**
```liquid
{% include tools/interactive-terminal-simulator.html id="section-1" %}
{% include tools/interactive-terminal-simulator.html id="section-2" %}
```

---

## Overview

**The Interactive Terminal Simulator** is a reusable Jekyll component that brings a safe, browser-based shell experience directly into lesson pages. Students practice real command-line skills—navigating directories, creating files, running git commands—without needing a real terminal.

**File Location:** `_includes/tools/interactive-terminal-simulator.html`

**Type:** Jekyll Liquid Include (HTML/CSS/JavaScript)

**Dependencies:** None (pure vanilla JavaScript, no external libraries)

---

## Why This Component Exists (The Problem It Solves)

**The Classroom Challenge:**
- Students use different operating systems (Windows, Mac, Linux)
- Real terminal access is hard to set up across a school network
- Accidents in a real terminal have consequences
- Environment setup distracts from learning concepts

**The Technical Reality:**
- Can't guarantee consistent behavior across devices
- Installation varies widely
- Debugging "why didn't that work?" becomes complicated

**This Component Solves It:**
✅ **Works everywhere** — Any device with a browser (Chrome, Firefox, Safari, Edge)  
✅ **Completely safe** — No real files can be harmed  
✅ **Consistent** — Every student sees identical output  
✅ **Instant** — Commands execute immediately with clear feedback  
✅ **Reversible** — Refresh the page to start fresh  
✅ **Multiple instances** — Run many simulators on one page independently

---

## Key Features

### 1. **Complete Command Support**
The simulator implements 12 core commands that mirror real shell behavior:

| Command | Purpose | Example |
|---------|---------|---------|
| `ls` | List directory contents | `ls` → shows files/folders |
| `cd <folder>` | Change directory | `cd documents` |
| `cd ..` | Move up one level | `cd ..` |
| `pwd` | Print working directory | `pwd` → `/home/documents` |
| `mkdir <folder>` | Create folder | `mkdir projects` |
| `touch <file>` | Create empty file | `touch notes.txt` |
| `cat <file>` | Read file contents | `cat notes.txt` |
| `echo "text" > <file>` | Write/overwrite file | `echo "hello" > greeting.txt` |
| `echo "text" >> <file>` | Append to file | `echo "world" >> greeting.txt` |
| `git clone <url>` | Clone repository | `git clone https://github.com/user/repo` |
| `clear` | Clear terminal output | `clear` |
| `help` | List all commands | `help` |

### 2. **Realistic Mock Filesystem**
The simulator includes a pre-populated filesystem structure:
```
/home/
  ├── documents/
  │   └── notes.txt (contains: "Remember to run ./scripts/activate.sh")
  └── downloads/
      └── image.png (simulated binary file)
```

Students can:
- Navigate between folders with `cd`
- Create new files and directories
- Write and overwrite file contents
- Clone repositories (which creates realistic folder structures)

### 3. **WSL-Inspired Styling**
The terminal has a modern, professional appearance with semantic coloring:
- **Dark background** (#0e0e0e) matching modern terminal aesthetics
- **Colored prompt segments**:
  - `user@wsl` in green (#50fa7b)
  - Current directory in blue (#5fa8ff)
  - Typed commands in white (#ffffff)
- **Semantic line coloring** for different output types:
  - Welcome/info messages in cyan
  - Commands in white
  - General output in light gray
  - Error messages in red
  - Paths in blue

### 4. **Centralized Message Management**
All user-facing error messages and usage text are stored in a `MESSAGES` constant, making it easy to:
- Update wording consistently across all commands
- Add internationalization (translations)
- Debug user-facing strings
- See all messages at a glance

Example:
```javascript
const MESSAGES = {
  MKDIR_USAGE: "Usage: mkdir <folder>",
  MKDIR_EXISTS: (name) => "mkdir: cannot create directory '" + name + "': File exists",
  // ... more messages
};
```

### 5. **Maintainable Code Structure**
The code follows anti-ninja coding principles for maximum clarity:
- **Explicit function names** instead of abbreviations
- **Clear control flow** using if/else instead of compact ternaries
- **Readable variable names** (e.g., `repositoryName` instead of `repo`)
- **Step-by-step logic** instead of chained operations
- **Detailed comments** explaining intent and behavior

---

## How to Use in a Lesson

### Basic Inclusion
Include the simulator in any lesson markdown file:

```liquid
{% include tools/interactive-terminal-simulator.html %}
```

This creates a single simulator with default styling and an auto-generated ID.

### Multiple Simulators on One Page
Use the `id` parameter to create independent instances:

```liquid
<!-- Section 1: Navigation lesson -->
{% include tools/interactive-terminal-simulator.html id="lesson-nav" %}

<!-- Section 2: File operations lesson -->
{% include tools/interactive-terminal-simulator.html id="lesson-files" %}
```

Each simulator maintains its own **independent state**—changes in one don't affect the other.

### Physical Layout & Styling
The simulator is automatically styled:
- **Width:** 100% of its container (responsive)
- **Height:** Fixed 250px terminal window with auto-scrolling
- **Input field:** Positioned below terminal, auto-focuses for immediate typing
- **Scrolling behavior:** Auto-scrolls to latest output as commands execute

---

## Architecture & Code Organization

### High-Level Structure

```
interactive-terminal-simulator.html
├── <style> CSS theming
├── <div id="..."> Terminal output container
├── <input id="..."> Command input field
└── <script> JavaScript simulator engine
    ├── Configuration (MESSAGES constant)
    ├── State management (state object)
    ├── Utility functions (path operations, display)
    ├── Command handlers (mkdir, touch, cat, etc.)
    ├── Command dispatcher (runCommand function)
    └── Event listeners (keydown handler for input)
```

### State Management

The simulator maintains its state in a single `state` object:

```javascript
const state = {
  path: ["home"],  // Current directory as array segments
  fs: {
    "/home": {     // Root filesystem node
      type: "dir",
      children: {
        documents: { type: "dir", children: { ... } },
        downloads: { type: "dir", children: { ... } }
      }
    }
  }
};
```

**Why this structure?**
- `path` as an array makes `cd ..` trivial (just `pop()`)
- Nested `children` objects mimic real filesystem hierarchies
- Easy to validate: check `type === "dir"` before navigating
- Supports arbitrarily deep directory structures

### Command Dispatcher (Three-Stage Pattern)

Commands are processed in three stages:

```javascript
function runCommand(command) {
  // Stage 1: Exact command matches (no arguments)
  if (Object.prototype.hasOwnProperty.call(exactHandlers, command)) {
    return exactHandlers[command]();
  }
  
  // Stage 2: Prefix command matches (with arguments)
  for (const handler of prefixHandlers) {
    if (command.startsWith(handler.prefix)) {
      return handler.run(command.slice(handler.prefix.length).trim());
    }
  }
  
  // Stage 3: Fallback (unknown command)
  return MESSAGES.UNKNOWN_CMD;
}
```

This allows:
- Fast lookups for simple commands (`help`, `ls`, `pwd`, `clear`)
- Ordered matching for argument-based commands (first match wins)
- Clear error messages when command is unrecognized

### Function Categories

#### **Path & Navigation Functions**
- `getCurrentDirectoryPath()` — Returns `/home/documents` style path
- `getCurrentNode()` — Walks the filesystem tree to find current directory
- `listCurrentNames()` — Returns array of files/folders in current directory
- `getPromptPath()` — Converts `/home/...` to `~/...` for display

#### **Display Functions**
- `classifyOutput(text)` — Categorizes output for semantic coloring
- `print(text, role)` — Renders one line with role-based styling
- `printCommandLine(command)` — Renders colored prompt with user/path/command

#### **Command Handler Functions**
- `createDirectory(name)` — Implements `mkdir` logic
- `createFile(name)` — Implements `touch` logic
- `writeFile(name, text, shouldAppend)` — Implements `echo > file` and `echo >> file`
- `readFile(fileName)` — Implements `cat` logic
- `mockClone(url)` — Implements `git clone` (creates realistic repo structure)
- `echoToFile(expression)` — Parses and routes echo commands to `writeFile()`

---

## Styling & Theming

### CSS Classes

All styling uses class-based selectors for compatibility with Jekyll's Liquid template engine:

| Class | Purpose | Color |
|-------|---------|-------|
| `.terminal-sim` | Main container | Dark background #0e0e0e |
| `.terminal-sim-input` | Command input field | Dark background #111 |
| `.line` | Output line (base) | — |
| `.line-welcome` | Welcome/greeting message | Cyan #8be9fd |
| `.line-command` | Command as typed | White #ffffff |
| `.line-output` | Regular output | Light gray #eaeaea |
| `.line-error` | Error messages | Red #ff6b81 |
| `.line-path` | File paths | Blue #5fa8ff |
| `.prompt-user` | `user@wsl` part | Green #50fa7b |
| `.prompt-path` | Directory path part | Blue #5fa8ff |
| `.prompt-command` | Typed command part | White #ffffff |

### Customizing Colors

To adjust the theme, modify the color values in the `<style>` block:

```css
.terminal-sim {
  background: #0e0e0e;  /* Change main background */
  color: #eaeaea;       /* Change default text color */
}

.terminal-sim .line-error {
  color: #ff6b81;       /* Change error message color */
}

.terminal-sim .prompt-user {
  color: #50fa7b;       /* Change user prompt segment color */
}
```

---

## The MESSAGES Constant: Design & Usage

### Why Centralization Matters (Design Decision)

**The Problem We Solved:** User-facing messages were scattered throughout the code.

**Before centralization (problematic):**
```javascript
function createDirectory(name) {
  if (!name) return "Usage: mkdir <folder>";  // Message #1
  if (exists) return "mkdir: cannot create...";
}
function createFile(name) {
  if (!name) return "Usage: touch <file>";  // Message #2
}
function writeFile(name, text, append) {
  if (!name) return "Usage: echo <text> > <file>";  // Message #3
}
```

**Problems:**
- Wording inconsistencies between similar operations
- Hard to find and change all messages
- Impossible to translate or localize
- New developers don't know where messages are

**After centralization (current approach):**
```javascript
const MESSAGES = {
  MKDIR_USAGE: "Usage: mkdir <folder>",
  MKDIR_EXISTS: (name) => "mkdir: cannot create directory '" + name + "': File exists",
  TOUCH_USAGE: "Usage: touch <file>",
  ECHO_USAGE: "Usage: echo <text> > <file>",
  // All messages in one place
};

function createDirectory(name) {
  if (!name) return MESSAGES.MKDIR_USAGE;  // ← Reference constant
  if (exists) return MESSAGES.MKDIR_EXISTS(name);
}
```

**Benefits:**
- ✅ Single source of truth for all user feedback
- ✅ Consistent wording across all commands
- ✅ Update wording once, applies everywhere
- ✅ Easy to translate (localization)
- ✅ New developers know exactly where messages are stored

### Benefits of Centralization

1. **Single Source of Truth**: Update wording once, applies everywhere
2. **Consistency**: All similar operations show consistent error formats
3. **Localization**: Easy to translate all messages without hunting through code
4. **Debugging**: View all user-facing messages in one place
5. **Maintainability**: New developers quickly understand what messages exist

### Available Messages

```javascript
const MESSAGES = {
  // mkdir-related
  MKDIR_USAGE: "Usage: mkdir <folder>",
  MKDIR_EXISTS: (name) => "mkdir: cannot create directory '" + name + "': File exists",
  
  // touch-related
  TOUCH_USAGE: "Usage: touch <file>",
  
  // echo-related
  ECHO_USAGE: "Usage: echo <text> > <file>",
  ECHO_SYNTAX: "Usage: echo <text> > <file> or echo <text> >> <file>",
  ECHO_ISDIR: (name) => name + ": Is a directory",
  
  // cat-related
  CAT_NOTFOUND: (file) => "cat: " + file + ": No such file",
  
  // git-related
  GIT_USAGE: "Usage: git clone <url>",
  GIT_EXISTS: (name) => "fatal: destination path '" + name + "' already exists...",
  GIT_CLONE_MSG: (name) => "Cloning into '" + name + "'...\nremote: Simulated clone complete.",
  
  // cd-related
  CD_NOTFOUND: "Directory not found",
  
  // general
  UNKNOWN_CMD: "Unknown command (type 'help')"
};
```

---

## How to Extend: Adding New Commands

The simulator is designed for easy extension. Here's the exact pattern to follow:

### Example 1: Adding Simple `echo` (Print without file redirection)

Let's say you want students to type `echo hello` and see `hello` printed.

**Step 1: Add the message** to the `MESSAGES` constant at the top:
```javascript
const MESSAGES = {
  // ... existing messages ...
  ECHO_SIMPLE: "Usage: echo <text>"  // ← Add this
};
```

**Step 2: Write the handler function** (after state and utility functions):
```javascript
function echoToTerminal(text) {
  if (!text) {
    return MESSAGES.ECHO_SIMPLE;  // Show usage if no text provided
  }
  
  // Strip surrounding quotes so `echo "hello world"` shows: hello world
  if ((text.startsWith('"') && text.endsWith('"')) || 
      (text.startsWith("'") && text.endsWith("'"))) {
    text = text.slice(1, -1);
  }
  
  return text;  // Print the text as-is
}
```

**Step 3: Register in `prefixHandlers`** (order matters!):
```javascript
const prefixHandlers = [
  // ... existing handlers ...
  { 
    prefix: "echo ",
    run: echoToTerminal
  }
  // ⚠️  IMPORTANT: Must come BEFORE redirect handlers
  // Otherwise "echo hello > file" will match this first!
];
```

**Step 4: Add to `commandSpecs`** for help text:
```javascript
const commandSpecs = [
  // ... existing ...
  "echo <text>",          // ← New command
  "echo <text> > <file>",
  "echo <text> >> <file>"
];
```

**Test it:** Students can now type `echo hello` and see output.

### Example 2: Adding `rm` Command (Delete files)

**Step 1: Messages**
```javascript
const MESSAGES = {
  // ... existing ...
  RM_USAGE: "Usage: rm <file>",
  RM_NOTFOUND: (file) => "rm: cannot remove '" + file + "': No such file or directory",
  RM_ISDIR: "rm: is a directory"  // Safety: don't delete directories
};
```

**Step 2: Handler function**
```javascript
function removeFile(fileName) {
  const currentNode = getCurrentNode();
  if (!currentNode || !currentNode.children) {
    return MESSAGES.RM_NOTFOUND(fileName);
  }
  
  const target = currentNode.children[fileName];
  if (!target) {
    return MESSAGES.RM_NOTFOUND(fileName);
  }
  
  // Safety: prevent accidental directory deletion
  if (target.type === "dir") {
    return MESSAGES.RM_ISDIR;
  }
  
  delete currentNode.children[fileName];  // Remove the file
  return null;  // Success (no output)
}
```

**Step 3 & 4:** Register in handlers and commandSpecs (follow Example 1 pattern).

### Key Extension Principles

1. **Always centralize messages** — New messages go in the `MESSAGES` object
2. **Return null for success** — Successful commands produce no output
3. **Return error string for failure** — Error messages display in red
4. **Test prefix ordering** — Longer/more-specific prefixes before shorter ones
5. **Update help text** — Add command to `commandSpecs` so `help` shows it

---

## Maintaining & Updating Documentation

Since this is a shared teaching tool, **documentation must stay in sync with code changes**. Here's how to keep everything current:

### When You Change the Code

**Rule:** Update documentation immediately when you modify the simulator code.

**Example:** If you add a new command `grep` to the simulator:

1. **Update the component** — Add handler, message, register in prefixHandlers
2. **Update this documentation** — Add `grep` to the commands table, update examples if needed
3. **Keep `commandSpecs` and documentation in sync** — They should list identical commands

**Why This Matters:**
- Teachers rely on this documentation to grade student work
- Inconsistent documentation confuses students
- Version control tracks both code and docs together

### Documentation Review Process

Include these checks in code review:

- [ ] Is `commandSpecs` array identical to the commands table in documentation?
- [ ] Is the MESSAGES constant documented?
- [ ] Do examples match current behavior?
- [ ] Are there new commands? Add them to both code and documentation.
- [ ] Did you change error messages? Update both MESSAGES constant AND this doc.

---

## Testing & Debugging

### Common Issues & Solutions

#### **Issue: Command doesn't execute**
**Checklist:**
- ✓ Is the command in `commandSpecs` for help text?
- ✓ Is the handler registered in `exactHandlers` (no arguments) or `prefixHandlers` (with arguments)?
- ✓ Do prefix handlers include the space? `"mkdir "` not `"mkdir"`

#### **Issue: Error message not showing**
**Checklist:**
- ✓ Did you return the error string from your handler function?
- ✓ Is the error message in the `MESSAGES` object?
- ✓ Is the message referenced correctly? `MESSAGES.YOUR_MSG` not `MESSAGES.your_msg`

#### **Issue: Multiple simulators interfering**
**Checklist:**
- ✓ Are you using the `id` parameter on each include?
- ✓ Each simulator should have unique IDs to maintain separate state

#### **Issue: File contents not persisting**
**Behavior:** By design. Refresh = simulator resets  
**Why:** The filesystem only exists in browser memory (not server-side)  
**For Classroom:** This is actually good—students get a fresh start each session

---

## Classroom Usage Tips

### 1. **Scaffolded Command Introduction**
Introduce commands gradually across multiple lessons:
- **Lesson 1**: `ls`, `pwd`, `cd`
- **Lesson 2**: `mkdir`, `touch`, `cat`
- **Lesson 3**: `echo > file` and `echo >> file`
- **Lesson 4**: `git clone`

### 2. **Using Pre-populated Filesystem**
The simulator starts with `documents/notes.txt` and `downloads/image.png` to:
- Give students something to explore immediately
- Provide realistic-feeling directory structures
- Enable `cat` demonstrations without manual file creation

### 3. **Pairing with Lessons**
Effective classroom pattern:
1. **Explain** command in prose
2. **Show** command in simulator
3. **Provide** challenge: "Create a folder called `projects`, cd into it, create a file `readme.md`"
4. **Debrief**: Discuss what students saw and learned

### 4. **Accessibility Considerations**
- Input field has a placeholder: "Type a command (example: help)"
- Terminal output is semantic HTML (`<p>` tags) for screen readers
- Colors chosen with sufficient contrast for visibility
- Keyboard-only navigation supported (arrow keys, tab)

---

## Code Quality Standards

This file follows **anti-ninja coding principles** for maximum maintainability:

### ✅ What You'll Find
- **Explicit function names**: `getCurrentDirectoryPath()` not `getPath()`
- **Clear control flow**: `if (...) { ... } else { ... }` not `condition ? a : b`
- **Descriptive variables**: `shouldAppend` not `append`, `repositoryName` not `repo`
- **Detailed comments**: Every function explains its purpose and parameters
- **Single responsibility**: Each function does one thing well
- **Defensive coding**: Null checks and early returns prevent cascading errors

### ❌ What You Won't Find
- One-letter variable names (`n`, `x`, `i` in declarations)
- Compact ternary operators for complex logic
- Abbreviated command names (`mkd` for mkdir)
- Side effects hidden in getters
- Variable reuse for different purposes

---

## Performance Characteristics

The simulator is highly efficient:

- **Filesystem lookup**: O(depth) where depth is directory nesting level
- **Directory listing**: O(n) where n is number of items in directory
- **Command execution**: O(1) for exact matches, O(m) for prefix matches where m is number of commands
- **Memory**: ~2KB for entire simulator + filesystem structure

Suitable for:
- Single-page deployment
- Multiple simulators on same page
- Classroom use with 30+ simultaneous instances
- Mobile devices and low-power hardware

---

## Future Enhancement Ideas

1. **Variable Storage** - Implement `VAR=value` and `$VAR` substitution
2. **Globbing** - Support `*.txt` style file matching
3. **File Permissions** - Simulate read/write/execute permissions
4. **Shell History** - Arrow up/down to recall previous commands
5. **Piping** - Implement `command1 | command2` chaining
6. **Custom Themes** - Allow lesson creators to pass theme parameters
7. **Export/Import** - Download or share filesystem state
8. **Scoring** - Track commands executed for gamified lessons

---

## Technical Notes for Maintainers

### Jekyll Include Parameters
The file uses Liquid's `include` parameters:
```liquid
{% assign terminal_id = include.id | default: 'terminal-simulator' %}
{% assign input_id = terminal_id | append: '-input' %}
```

This allows customization while maintaining backwards compatibility.

### ID Scope Isolation
Each simulator instance is encapsulated:
- Unique `terminal_id` and `input_id` per include
- IIFE (Immediately Invoked Function Expression) provides local scope
- `const` declarations prevent accidental global pollution

### Browser Compatibility
Works on:
- Chrome/Edge 60+
- Firefox 55+
- Safari 11+
- All modern mobile browsers

No polyfills required. Uses only standard ES6 features and DOM APIs.

---

## Documentation Standards & Best Practices

This documentation file follows **GitHub's Guide to Effective Code Documentation**. Here's what that means for this component:

### How This Documentation Is Organized

**1. Simple Language for Humans** ✓
- No unnecessary jargon; "simulator" not "virtualized terminal shell environment"
- Explains the "why" before diving into the "how"
- Examples show real-world classroom usage, not just theoretical code

**2. Problem-Solution Format** ✓
- "Why this component exists" explains real classroom challenges
- Examples follow clear before/after patterns
- Design decisions (like MESSAGES centralization) are explained with problems they solve

**3. Code Examples** ✓
- Every concept includes working code
- Examples progress from simple (`echo hello`) to advanced (`git clone`)
- Both complete and minimal examples provided

**4. Consistency** ✓
- Section headings follow a predictable pattern
- Code formatting is uniform
- Technical terms defined on first use

**5. Kept in Sync** ✓
- Documentation reflects current code state
- Commands listed in docs match Code in `commandSpecs`
- Any code change requires documentation update

### How Teachers Should Use This Documentation

1. **Quick Start**: New to the simulator? Start at "Quick Start (TL;DR)"
2. **Understanding**: Want to know why it works? Read "Why This Component Exists"
3. **Integration**: Need to add it to lessons? See "How to Use in a Lesson"
4. **Troubleshooting**: Something broken? Check "Testing & Debugging"
5. **Integration**: Want to add features? Follow "How to Extend: Adding New Commands"

### How Developers Should Use This Documentation

1. **Architecture**: Start with "Architecture & Code Organization"
2. **Code Design**: See "The MESSAGES Constant" for design patterns
3. **Extension**: Follow "How to Extend" step-by-step to add commands
4. **Maintenance**: Check "Maintaining & Updating Documentation" before committing changes
5. **Debugging**: Use "Testing & Debugging" as your troubleshooting guide

---

## Summary

The Interactive Terminal Simulator is a production-ready learning tool that brings command-line education into the browser. Its clean, well-documented code and robust architecture make it easy to extend and adapt for various classroom scenarios.

**Key Takeaways:**
- Designed for **classrooms**, not research or production systems
- **Safe by design**—students can't damage anything
- **Extensible**—adding new commands takes 4 simple steps
- **Well-documented**—this file explains every aspect
- **Maintainable**—anti-ninja coding, centralized messages, clear architecture

**For Teachers:**
Use it as-is in your lessons. Follow the "Classroom Usage Tips" section for effective integration.

**For Developers:**
Study it as an example of clean, maintainable code architecture. Extend it by following the "How to Extend" pattern. Keep this documentation in sync with your changes.

**Questions?** Check the "Testing & Debugging" section or review the inline code comments in the component itself.

