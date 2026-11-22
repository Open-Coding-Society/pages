# Class management

The classroom management and team-teach signup posts live in `pages/`.
Their original permalinks are preserved when the project publishes them to
`_posts/projects/class_manage/` through `distribution.json`.

Bathroom and hall-pass notebooks live in `notebooks/` and are converted directly
to the same project post directory. Edit these sources, not their generated posts.
The project is registered for both full and dev builds in `_projects/.makeprojects`.
The shared removed-project cleanup also removes these notebooks' old ignored
outputs when their sources have moved, so an older checkout does not publish
both copies.

Assignment submissions and grader view belong to `systems/grades`.

Tests: `bundle exec ruby scripts/test_system_project_distribution.rb` and
`bundle exec ruby scripts/test_clean_removed_projects.rb`.
