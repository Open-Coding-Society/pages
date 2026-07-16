# Calendar System

A comprehensive calendar management system for the Open Coding Society platform, providing event scheduling, issue tracking, CS Pathway task management, and threaded discussions.

## Overview

The Calendar System is a full-featured dashboard that integrates:
- **FullCalendar** for visual event management
- **Event Management** with priority levels, groups, and breaks
- **Issue Tracking** with kanban boards and list views
- **CS Pathway Tasks** synced from user gameplay progress
- **Threaded Discussions** for issue comments and replies

## Architecture

### Source Structure

```
_projects/systems/calendar/
├── README.md                   # This file
├── Makefile                    # Build and deploy configuration (auto-generated)
├── index.md                    # Main calendar page (deployed to _posts/projects/)
├── js/                         # JavaScript modules
│   ├── CalendarData.js        # School calendar data + date utilities
│   ├── EventBuilder.js        # Event construction helpers
│   ├── CalendarApi.js         # Backend API communication
│   ├── CalendarUI.js          # DOM rendering + modals
│   ├── calendar.js            # Main orchestrator
│   └── CalendarTests.js       # Test suite
├── sass/                      # Stylesheets
│   └── main.scss             # Calendar styles (theme-aware)
└── docs/                      # Documentation
    └── MIGRATION.md          # Migration notes
```

### Distribution

When built via `make build`, files are copied to:
- **JavaScript**: `assets/js/projects/calendar/` (first)
- **SASS**: `_sass/projects/calendar/` (second)
- **CSS**: `assets/css/projects/calendar/` (third)
- **Page**: `_posts/projects/2026-04-15-calendar.md` (LAST - triggers Jekyll rebuild)

**Build Order is Critical**: The page is copied LAST to ensure all assets (JS/CSS/SASS) are in place before Jekyll processes the page. This prevents timing issues where Jekyll might try to build a page before its dependencies are ready.

**Note**: All distribution files are in `.gitignore` and regenerated during builds.

### Load Order

The calendar JavaScript modules are loaded via `_includes/calendar.html` in this order:

1. `CalendarData.js` — School calendar data + date utilities
2. `EventBuilder.js` — Event construction helpers
3. `CalendarApi.js` — Backend communication + error types
4. `CalendarUI.js` — DOM rendering + modals
5. `calendar.js` — Main orchestrator

## Features

### Event Management
- Create, edit, and delete calendar events
- Priority levels (P0-P3) with visual indicators
- Group assignment and filtering
- Break day management
- Recurring event support

### Issue Tracking
- GitHub-style issue creation and management
- Status tracking (open, in-progress, blocked, done)
- Priority assignment
- Tag-based organization
- Kanban board view
- List view with filtering
- Markdown support in descriptions
- Event linking

### CS Pathway Integration
- Auto-sync tasks from CS Pathway game
- Individual user timeline
- Task progress tracking
- Calendar integration for deadlines

### Discussion Threads
- Nested reply system for issues
- Real-time comment updates
- Markdown formatting
- Author attribution
- Timestamp tracking

## Theme System

The calendar uses CSS custom properties from `user-preferences.js` for theme consistency:

- `--pref-bg-color`, `--pref-text-color`
- `--pref-font-family`, `--pref-font-size`
- `--pref-accent-color`, `--pref-selection-color`
- `--panel`, `--panel-mid`, `--bg-0` through `--bg-3`
- `--text`, `--text-strong`, `--text-muted`
- `--accent`, `--ui-border`

Priority colors also use CSS custom properties:
- `--priority-p0` (Critical - Red)
- `--priority-p1` (High - Orange)
- `--priority-p2` (Medium - Yellow)
- `--priority-p3` (Low - Green)

## Development

### Building

```bash
# First-time setup: generate Makefiles for all registered projects
make generate-makefiles

# Build calendar project (from workspace root)
make -C _projects/systems/calendar build

# Or build all registered projects
make build-registered-projects

# Watch for changes (auto-rebuild)
make -C _projects/systems/calendar watch

# Clean distribution files (removes page and assets)
make -C _projects/systems/calendar clean
```

**Note**: 
- Direct project builds (`make -C _projects/systems/calendar build`) require the Makefile to exist
- `make dev` automatically generates Makefiles for all dev projects, so manual generation is only needed for standalone builds
- Project pages deploy to `_posts/projects/` directory (not version controlled)
- Jekyll watches `_posts/` and automatically triggers incremental rebuilds when pages change
- The page is copied LAST in the build chain to ensure all JS/CSS assets are ready first

### Dev Mode Control

Add `:dev` suffix in `_projects/.makeprojects` to control dev mode behavior:

**With `:dev`** (`systems/calendar:dev`):
- Auto-builds during `make dev`
- Auto-rebuilds on file changes
- Calendar available at `/student/calendar`

**Without `:dev`** (`systems/calendar`):
- Only builds during `make build` or explicit project build
- Calendar page NOT present during `make dev`
- Use for production-only features or when developing other systems

### Testing

The `CalendarTests.js` file contains comprehensive test suites for all calendar modules. Run tests by loading the test page or including the test script.

### Adding Features

## Page Deployment

The calendar page is deployed to `/student/calendar` via:
1. **Source**: `_projects/systems/calendar/calendar.md`
2. **Build**: Makefile copies to `_posts/projects/calendar.md` (LAST operation after all assets)
3. **Jekyll**: Detects new file in `_posts/` and triggers incremental rebuild with `aesthetihawk` layout

**Timing is Critical**: The page file is copied LAST to prevent Jekyll from building the page before JavaScript and CSS assets are ready.

The page requires:
- `permalink: /student/calendar` for the URL path
- `tailwind: true` for utility classes
- `active_tab: calendar` for sidebar highlighting
- Scripts loaded via `_includes/calendar.html`

## Backend Integration

The calendar communicates with the Spring Boot backend at:
- **Events**: `/api/calendar/events`
- **Issues**: `/api/Comment/issue`
- **Threads**: `/api/Comment/reply`
- **Groups**: `/api/Group`

All API calls use the `fetchOptions` configuration from `/assets/js/api/config.js` for authentication and CORS handling.

## Page Integration

The calendar is used on:
- `/student/calendar` (main calendar page)
- Embedded in other dashboards via `_includes/calendar.html`

The page uses the `aesthetihawk` layout and requires:
- `tailwind: true` for utility classes
- `active_tab: calendar` for sidebar highlighting

## Contributing

When modifying the calendar system:
1. Edit source files in `_projects/systems/calendar/`
2. Run `make build` to distribute changes
3. Test thoroughly across all tabs (Calendar, CS Pathway, Issues, Threads)
4. Ensure theme compatibility (test dark/light/sepia modes)
5. Update this README if adding new features

## Related Files

- **Layo Source**: `_projects/systems/calendar/calendar.md`
- **Page Build**: `navigation/calendar.md` (generated).html`
- **Include**: `_includes/calendar.html`
- **Page**: `navigation/calendar.md`
- **SASS Import**: `_sass/open-coding/_main.scss`
- **School Calendar Data**: `_data/school_calendar.yml`
