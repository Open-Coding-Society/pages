# Shared page viewer

`toolbar.js` provides `setViewerLink` for previous/next controls and
`mountViewerAction` for optional existing controls such as Microblog.
`fitViewerAbove` reserves space when another fixed viewer is underneath, and
returns a cleanup function for hosts that unmount. Courses
uses the helper inside its reader; each application owns its own navigation,
URLs, and state. `open-coding/mixins/_viewer.scss` provides their common toolbar
layout.

`section-navigation.js` supports a sidebar hub whose pages show one section at
a time. `followSectionHash` opens the section named by the URL and marks the
current sidebar links, with an optional access check. The host owns the pages,
sidebar markup, section rendering, and authorization. Grades uses the shared
`aesthetihawk` layout for its sidebar and phone menu; navigating to another
page still follows a normal link.

For a standalone viewer, set `page_viewer` on eligible pages with `label`,
`item`, `home`, `activation_param`, and `script`. The site shell includes
`_includes/page-viewer.html` only for those pages. When the activation query
parameter is present, it loads the shared toolbar and the application's script,
then calls `startViewer(bar, toolbar)`. The adapter populates links and status,
and may mount an existing action in `[data-viewer-actions]`. No application
logic or backend is built into the shared shell.

Capstone assigns this metadata to catalog projects, game-directory pages, and
their URL descendants at build time. Its adapter keeps its own filtered order
and return state. Courses keeps its reader's existing shell and document order.
