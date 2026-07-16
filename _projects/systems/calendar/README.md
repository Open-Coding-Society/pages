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
├── calendar.md                 # Main calendar page (deployed to navigation/)
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
- **Page**: `navigation/calendar.md`
- **JavaScript**: `assets/js/projects/calendar/`
- **SASS**: `_sass/projects/calendar/`
- **CSS**: `assets/css/projects/calendar/`

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
# Build calendar project (from workspace root)
make -C _projects/systems/calendar build

# Or build all registered projects
make build-registered-projects

# Watch for changes (auto-rebuild)
make -C _projects/systems/calendar watch

# Clean distribution files (removes page and assets)
make -C _projects/systems/calendar clean
```

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

1. **New date utdeployed to `/student/calendar` via:
1. **Source**: `_projects/systems/calendar/calendar.md`
2. **Build**: Makefile copies to `navigation/calendar.md`
3. **Jekyll**: Processes the page with `aesthetihawk` layout

The page requires:
- `tailwind: true` for utility classes
- `active_tab: calendar` for sidebar highlighting
- Scripts loaded via `_includes/calendar.html`
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
