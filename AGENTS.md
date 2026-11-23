<!-- 
NOTE: This file is written in Chinese because it is 30-40% more token-efficient and information-dense than English. 
As AGENTS.md expands, this optimized format helps prevent the AI agent from experiencing context forgetting 
while preserving all critical instructions. The agent must still communicate with the user in English. 
-->

# 智能体编程指南

## 核心原则

### 单一职责原则

* 每个函数、类和模块都应只有一个明确的修改原因。
* 避免处理多重关注点的“上帝函数”。
* 如果你在描述一个函数时使用了“和”，它很可能违反了单一职责原则。
* 倾向于使用组合，而不是庞大的多用途单元。

### 简单胜于精巧

* 倾向于可读的代码，而不是“自作聪明”的抽象。
* 避免过早优化。
* 如果初级工程师无法在30秒内理解 → 请简化。

### 显式胜于隐式

* 让依赖关系可见。
* 避免隐藏的状态变化。
* 避免“魔法行为”（隐式全局变量、副作用）。
* 尽可能隔离 I/O、网络和文件系统操作。

## 架构规则

### 关注点分离

将逻辑划分为清晰的层级：

* UI / 接口层
* 业务逻辑层
* 数据 / 持久层
* 工具 / 助手（纯函数）
**智能体规则：** 除非有明确理由，否则绝不要将数据访问与业务逻辑混合。

### 基于功能的模块化

* 倾向于模块化的文件，而不是大型单体文件。
* 保持合理的文件大小（软规则：<300–500行）。
* 按功能分组，而不是按类型分组（通常更适合系统扩展）。
* 除非规模需要，否则优先选择模块化单体架构，而不是微服务。

## 系统特定规则

### 生态系统与工具默认设置

* **优先使用 SASS：** 使用 SASS (`.scss`) 进行样式设计，而不是标准 CSS 或内联样式。
* **SASS 兼容性：** 当前 Jekyll 使用 Ruby Sass；透明颜色使用 `rgba(0, 0, 0, 0.15)`，不要使用它无法编译的 `rgb(0 0 0 / 15%)` 语法。需通过 Makefile 的 Jekyll 构建验证。
* **使用 `_projects`：** 利用 `_projects/` 目录中的模块化项目自动注册系统来创建新项目。
* **系统扩展：** 在现有系统内工作并在需要时进行扩展，而不是创建全新的并行架构。
* **日历页面约定：** `navigation/calendar.md` 里的布局和弹层样式要放到 SCSS 中，用语义化 class 代替 utility 风格的内联类。
* **日历事件编辑：** Spring 的 `PUT /api/calendar/edit/{id}` 拒绝空 `period` 或 `description`；无课程事件发送 `Personal`。关联文档存于描述末行（`Linked doc: <url>`，见 `_projects/systems/calendar/js/CalendarDocLinks.js`）；测试：`node --test tests/calendar_doc_links.test.mjs`。事件文字来自任何已登录账户，所以 `/student/calendar` 经 `CalendarSafeHtml`（`_projects/systems/calendar/js/CalendarSafeHtml.js`）把它放进页面：描述经 DOMPurify 清理（未加载时改为转义，保存时由 `editorHtml` 读回编辑器的文字，格式不会丢失），标题、姓名与群组标签（日历格、CS Pathway 列表、Issues 列表与看板）一律转义。新增把事件值写进 HTML 的地方也要经过它；测试：`node --test tests/calendar_safe_html.test.mjs`。
* **代码提交选择：** 代码提交（`assignment_submission_type: code`）只发送学生点了“Add to submission”的 runner（四种 runner 的 challenge box 中的切换按钮，见 `_includes/runners/fragments/submission-toggle.html`）；选择存于 `<storageKey>__submit`，默认不选，课程作者无需标记。未选的 runner 不阻止提交；0 个已选或已选未保存时阻止。逻辑在 `runner-io.js`（`setRunnerSelected`、`submissionStatus`、`readRunners({ selectedOnly: true })`、`runnerSelectionSummary`）与 `runner-submission.js`（切换按钮、提交面板计数、`submissionError`），两个提交处理函数共用。Gist 清单的 `runners` 列出跳过的 runner；Spring 的 `AssignmentAiGradingService` 据此提示 AI：练习 runner 不扣分，评分标准或加权 hack 要求而缺失的作业按未尝试计。测试：`node --test tests/runner_submission_selection.test.mjs`，Spring 的 `AssignmentAiGradingRunnerSelectionTest`。
* **Runner dependencies:** `BaseRunner` 为可编辑 Code/Pseudocode、UI/HTML、Game runner 挂载共享依赖选择框（Reflection 除外）。注释头用 `@provides Name`、`@dependency Name`、`@end Name`，名称后可加语言（如 `scss`）。只读取同页原始 provider 的已保存代码，不读取依赖副本；仅替换边界内正文，Update all 先全部校验，覆盖本地修改前确认。转移后未保存时 `data-dependency-dirty` 阻止提交。源码：`assets/js/pages/runners/core/DependencyBlocks.js`、`RunnerDependencies.js`，用法见 README。测试：`node --test tests/runner_dependencies.test.mjs tests/runner_dependency_controls.test.mjs tests/runner_submission_selection.test.mjs`。
* **跨域 API：** 供 `pages.opencodingsociety.com` 调用的 Spring API 端点要显式允许带凭据的跨域请求。
* **文档：** 必要时为困难或复杂的实现创建详细文档。
* **注释：** 为非平凡的逻辑添加注释，但要保持简短，重点关注“为什么”而不是“是什么”。
* **提问：** 如果系统级约束、需求或模式不清楚，请在继续之前暂停并向用户提问。

### 项目工作流

* 以 [Makefile](Makefile) 为唯一指令来源；常用目标 `make`/`make serve-current`、`make dev`、`make stop`、`make convert`、`make convert-single`（细节见 [README.md](README.md)）。
* 顺序很关键：stop → build projects → convert notebooks/docx → split courses → jekyll serve（以 [Makefile](Makefile) 为准）。
* 项目构建后必须运行 [SASS 导入生成器](scripts/generate_sass_imports.py)，以创建 `_sass/projects/_all.scss`；`build-registered-projects` 负责此依赖，避免 Jekyll 的 `projects/all` 导入失败。
* 已删除的项目：旧检出会保留已删除项目被 git 忽略的生成物，而 `clean-registered-projects` 只清理 `.makeprojects` 中登记的项目。因此 `build-registered-projects`、`build-dev-projects` 和 `make clean` 都会运行 `clean-removed-projects`（[scripts/clean_removed_projects.rb](scripts/clean_removed_projects.rb)）。若 git 在项目文件夹 `_projects/<category>/<name>/` 中列不出任何文件（已跟踪或新增），它会删除以该名称命名的生成物：`_posts/projects/<name>/` 及其索引帖、`assets/js/projects/<name>/` 等其他 `projects/<name>/` 副本、生成的 `Makefile`，以及 `.project-distribution-cache/<name>.json` 和其中记录的文件。Jupyter 的 `.ipynb_checkpoints` 不算源文件。它绝不删除已跟踪文件或现有项目的生成物，所以删除项目的 PR 可以一并删除只被其生成物使用的文件。测试：`bundle exec ruby scripts/test_clean_removed_projects.rb`。
* 项目 Makefile 使用模板生成；不要为共享浏览器库添加本地 npm 清单、`.gitignore` 或 Makefile 覆盖。共享运行时库放在 `assets/js/vendor/`，保留许可证和版本说明；常规构建无需 npm 安装。
* 项目 `index.md` 默认发布为 post；应用首页可在 `distribution.json` 中将它映射到 `navigation/projects/<name>/index.md`，模板不会再发布 post 副本。旧 post 只有在未跟踪且与源相同时才会删除，否则构建报错。Grades 首页使用此方式；详见 [_projects/REGISTRATION.md](_projects/REGISTRATION.md)。测试：`bundle exec ruby scripts/test_system_project_distribution.rb`。

### 源文件与生成文件

* Courses owns curriculum composition and shared navigation in [_projects/systems/courses/](_projects/systems/courses/); [Blogs](_projects/systems/blogs/README.md) owns document layouts, catalog, completion helpers and viewer styles. See [architecture](_projects/systems/courses/docs/ARCHITECTURE.md). Both are `:dev` projects with disjoint distribution manifests. Edit sources, not published copies. Blogs renders canonical lesson bodies/forms inside Courses' reader shell; `course-document-player.html` handles course home/sprint/week/Blogs pages and legacy fallback. Standalone Blogs must work without Courses. Submission/Runners remain shared dependencies; Grading derives from Submission. On old checkouts publish Courses before Blogs to release cached ownership; never delete caches indiscriminately. Tests: `bundle exec ruby scripts/test_blogs_system.rb`, `bundle exec ruby scripts/test_course_distribution.rb`. Restart watchers after boundary/template changes.
* The Blogs catalog ([_projects/systems/blogs/_includes/blog-catalog.html](_projects/systems/blogs/_includes/blog-catalog.html)) supports `post_filter: <flag>`, `post_search: true` and title/description highlights via [_projects/systems/blogs/js/post-search.js](_projects/systems/blogs/js/post-search.js). Through `blog-reader.html`, `course=<course>` includes every document declaring that course, including shared documents, but excludes `reader_redirect_url` pages. Card links carry `context=course&course=<course>`. Search preserves `?q=` and uses text-node `<mark>` highlights. Keep the OCS `ocs__split` field with `size="1"` and the count on its own line for mobile Safari. Tests: `bundle exec ruby scripts/test_blog_catalog.rb`, `node --test tests/post_search.test.mjs`.
* Blogs' "Mark Lesson Complete" buttons ([lesson-completion.js](_projects/systems/blogs/js/lesson-completion.js) on FRQ pages, `lesson-completion-bigsix.js` on the Big Six lessons) keep completion in the browser only: `completedLessons` in `localStorage`, plus the Big Six hub's `bigsix:<module>:lesson:<n>` keys. Flask and Spring have no `/api/lessons/complete` route, so a click sends no request. Don't add calls to routes the backends don't have: the post layout's `ocs-analytics-enhanced.js` posted to Spring routes that never existed and `code-runner-analytics.js` never parsed, so both were deleted; the site-wide tracker already counts copies and Run clicks for `/api/ocs-analytics/save`. Test: `node --test tests/mark_complete_button.test.mjs`.

* Course home sources are [_projects/systems/courses/navigation/](_projects/systems/courses/navigation/). Preserve `/navigation/courses/<course>/`; use `layout: post` and `player_page: {course: <course>, kind: home}` to share the sidebar and existing announcement/calendar UI. Home, sprint, week and Blogs pages (any `player_page`) are hosted in the document reader shell via `host_in_reader` in `lesson_player_pages.rb` and `reader/overview.html`; `course-document-player.html` is only the fallback when the reader is not installed. Reader course navigation (`reader/reader.rb`) lists every course-placed document, the same set as the week overview; `search_exclude`/`hide` only remove it from Topics (`topics: false`). Sprint and week rows come from one `folder()` helper in `reader/js/browser.js`: the `S<n>`/`W<n>` pill (`ocs__btn small pill` holding the arrow) toggles, the title opens the overview, and `<` `>` step through those overviews in course order. Reader SCSS reuses OCS elements and tokens (`ocs__tree`, `$sizes`, `$spacing-*`) rather than custom pills or markers. Test: `bundle exec ruby scripts/test_document_reader.rb`. Course pills must resolve `current_course` on lessons, not only `page.course`. Encode Liquid values in JavaScript with `jsonify`, especially quoted titles. Validate with `bundle exec ruby scripts/test_course_landing_pages.rb` and a mobile navigation check.
* The reader's course selector lists all configured OCS courses using `COURSE_ORDER`, not only `page.document_reader.courses`. A shared document switches context in place; a course without the document opens its home via `courseEntryUrl`. Keep document membership unchanged, and save the previous navigation state before leaving. Test: `node --test tests/document_reader.test.mjs`.
* Shared viewer controls live in [assets/js/pages/viewer/](assets/js/pages/viewer/); the foundation mounts `page-viewer.html` only for pages with `page_viewer` metadata, never a Capstone-specific include. Capstone's generator opts in catalog projects, CSSE games and their URL descendants; Courses retains its own reader and order. When both viewers appear, `fitViewerAbove` keeps the fixed reader below the shared toolbar as it resizes. Microblog remains optional and uses one existing button. Tests: `node --test tests/capstone.test.mjs tests/document_reader.test.mjs tests/microblog_forms.test.mjs`; `bundle exec ruby scripts/test_capstone.rb` and `scripts/test_document_reader.rb`.
* Shared hub section navigation lives in `assets/js/pages/viewer/section-navigation.js`. Grades uses it with the `aesthetihawk` sidebar layout; the old `assets/js/grades/page-sections.js` re-exports it for cached pages. Page links still navigate normally, while hashes switch sections and respect the page's access check. Test: `node --test _projects/systems/grades/tests/page_sections.test.mjs`.
* Course navigation state is owned by [_projects/systems/courses/js/player/course-navigation-state.js](_projects/systems/courses/js/player/course-navigation-state.js): preserve sections, scroll, and last document per course/panel. Blogs stays in the main pane while the last document is highlighted for resuming; do not redirect or change completion. Expand selected ancestors idempotently, never by toggling. Do not rebuild mobile navigation on resize. Test: `node --test tests/course_navigation_state.test.mjs`.
* Top-menu course entry uses [_projects/systems/courses/js/player/course-entry.js](_projects/systems/courses/js/player/course-entry.js) and `[data-course-entry]` to link directly to `/navigation/courses/<course>/` (Home/Announcements), not Blogs or the legacy chooser/catalog. Keep the last document highlighted in the navigation panel without redirecting to it. Blogs breadcrumbs show Home > selected course > Blogs. Persist `ocs-selected-course` on course visits; use enrolled selections for signed-in users and `_config.yml`'s `default_course` for new visitors. Test: `node --test tests/course_entry.test.mjs`.

* 源文件在 [notebook sources](_notebooks/) 与 [docx sources](_docx/)；转换后的 Markdown 输出到 [generated posts](_posts/)（生成物，不要手工改）。
* 共享文档保留 title/permalink、courses、categories；无需新 id 或 YAML 名单。[_projects/systems/courses/reader/](_projects/systems/courses/reader/) 提供 Course/Topics 导航；切换不重新挂载 runner/提交表单。原链接默认课程导航；`?context=topics` 或 `?context=course&course=<course>` 选择视图。提交 contentUrl 和 runner key 不含 query。旧 `/topics/view/` 与课程后缀 URL 仅为兼容跳转；[scripts/split_multi_course_files.py](scripts/split_multi_course_files.py) 不再复制正文或修改 notebook。旧课程作业历史不合并、不删除；新提交用原 permalink。测试：`bundle exec ruby scripts/test_document_reader.rb`、`node --test tests/document_reader.test.mjs`。不要手改旧 `*_content.md` 或课程拆分生成物。
* 课程播放器页面（每门课的 `/<course>/sprint-<n>/`、`/<course>/week-<w>/`、`/<course>/week-<w>/chat/`、`/<course>/blogs/`）没有源文件：由 [_projects/systems/courses/plugins/lesson_player_pages.rb](_projects/systems/courses/plugins/lesson_player_pages.rb) 在构建时根据项目 `data/<course>.yml` 生成，周页面和聊天页面只为有 lesson 的周生成。页面内容改 [_projects/systems/courses/_includes/player-pages/](_projects/systems/courses/_includes/player-pages/)；[_projects/systems/courses/_includes/lesson-sidebar-nav.html](_projects/systems/courses/_includes/lesson-sidebar-nav.html) 中的链接必须使用相同的 URL。测试：`bundle exec ruby scripts/test_player_pages.rb`。
* Notebook/DOCX 转换规则见 [scripts/convert_notebooks.py](scripts/convert_notebooks.py) 与 [scripts/convert_docx.py](scripts/convert_docx.py)。
* MCQ 的 `<!-- MCQ_RUNNER: ... -->` 必须是独立 Markdown cell 的第一行，后接 JSON fence；标题和说明放前一个 cell，否则只会显示 JSON。测试：`venv/bin/python -m unittest discover -s tests -p test_convert_mcq_runner.py`。
* 项目 notebook（包括 GameBuilder）从 `_projects/<category>/<project>/` 直接转换到 `_posts/projects/<project>/`；旧 `_notebooks/projects/` 副本不再参与全局转换或拆分。共享模板每项目一次批量调用（默认最多 4 workers），缓存 `.notebook-conversion-cache/` 按源/转换器内容和输出状态失效；相同 Markdown 不重写。`CONVERT_FLAGS=--force` 强制转换。`make dev` 不再清理和重复转换；改管线后重启 watcher。Makefile 生成器刷新未跟踪模板副本，保留已跟踪覆盖；持久修改改 [_projects/_template/Makefile](_projects/_template/Makefile)。验证：`venv/bin/python -m unittest discover -s tests -p test_convert_notebooks.py`。
* CSA 内容按 `cs112 → cs113 → csa1 → csa2 → ds2` 优先级归属到 `_projects/lessons/` 的注册项目；`notebooks/` 与 `docs/` 必须平铺，迁移保留 permalink 和 `courses.csa.week`。`articulation` 只表示课程对应，不表示获得学分。草稿用 `lesson_status: draft` 与 `planned_week`，不要设置 `courses`：时间线不会按 `hide` 排除课程。详见 [_projects/REGISTRATION.md](_projects/REGISTRATION.md)。验证：`node --test tests/csa_curriculum.test.mjs`。
* CSA 13–37 周按 `_data/csa.yml` 编排：每教学周最多三篇主文档；已对应 CS112 的 AP FRQ runner 可作为 `lesson_type: ap-practice` 补充练习超出限额，放在匹配教学周，题名/文件名以主题开头，保留 permalink。补充选课见 `tests/fixtures/csa_frq_practice.json`，主文档见 `tests/fixtures/csa_week_schedule.json`；其他例题为无周次参考。总结、AP 复习、展示和期末周用清单链接旧课，不新增作业。缺口用 `lesson_notes` 显示。移动源后只清理确认无源的生成文件，防止旧标题/周次重新发布。
* AP FRQ 分类号与历史题号必须分离：`ap_frq_category` 为 1 方法/控制、2 类设计、3 一维数组/ArrayList、4 二维数组；`ap_exam_year`/`ap_exam_question` 保存历史身份。题名如 `FRQ 3 - Array or ArrayList Manipulation - 2017 Exam Q1 - CS112`；按题目实际练习审核分类，不按旧题名或历史序号推断。旧题可能跨技能；9 分说明针对四题制分类，不改历史评分。frontmatter description 用纯文本，不含 Liquid 或 `#`：卡片不会递归渲染变量，转换器未引号输出会截断 YAML 注释。
* CS112/CS113 报告按 MiraCosta 原始五节与 Lab Outline 编排，映射在 `_data/cs112_topics.json` 与 `_data/cs113_topics.json`，共用 `curriculum-outline-report.html`；以稳定 permalink 匹配，不按文件名或 AP 分类。显示当前题名/周次、缺口、PBL 延伸；草稿明确未完成。新增未映射课程仍显示，删除课程不生成死链接。CS113 自实现层为差异化延伸，不把库调用当作实现掌握。增删源时同步映射与覆盖说明。验证：`bundle exec ruby scripts/test_cs112_report.rb` 与 `bundle exec ruby scripts/test_cs113_report.rb`。

### 项目注册与样式
* Topics 与 Capstone 分发到通用 `projects/<name>/` 目录，包括 `navigation/projects/`、`_data/projects/`、`_plugins/projects/`；共享布局用 `_layouts/projects/<name>/` 和 `layout: projects/<name>/<layout>`。页面保留 permalink，数据用 `site.data.projects.<name>`，include 用 `projects/<name>/<file>`。不用项目专属 ignore；共享模板和已删除项目清理器负责清理。迁移保留分发 cache，让 publisher 清除旧路径。验证：`bundle exec ruby scripts/test_system_project_distribution.rb`。
* Topics prominence comes from [_projects/systems/topics/data/topics_primary.yml](_projects/systems/topics/data/topics_primary.yml), not a `topics:` document field. The sidebar has one key Topic Filter and one More Categories checkbox list, with no duplicate Browse/shortcut lists. More Categories shows remaining categories with at least five documents, sorted by count with alphabetical ties; a selected low-count category stays visible for clearing. Search indexes category names as well as document text. OR/AND (`ocs__btn` with `aria-pressed`, OR by default, `?match=and`) applies across both checkbox groups: OR matches any selection and AND requires every selection. Count shared documents once. Search shows highlighted title cards followed by body/description/category matches, with no duplicate title results and no filter escape. Render highlights with plain-text nodes and Lunr positions.
* Systems 是精选 Topic Filter；系统的 `docs/ARCHITECTURE.md` 使用 `categories: [Systems]` 和稳定的 `/systems/<name>/architecture/` permalink，并说明视图及数据来源。`build-system-docs` 发布所有有架构文档的注册系统（包括非 `:dev` 系统）的 docs；`build-dev-projects` 调用它，确保全新 dev 构建也能索引。测试：`bundle exec ruby scripts/test_topics.rb`。
* [Topics](_projects/systems/topics/README.md) uses `categories` as independent reference filters, combined by the Topics prominence rule, never weeks or `lesson_topic`/`lesson_language`. `/topics/` replaces Search; `/search/` redirects. Landing shows primary-topic sections with scrollable unit cards; OR/AND is visible in Topic Filters. Cards and Lunr results open original permalinks with `context=topics&topics_view=1`; the shared viewer returns to filters and steps through the actual deduplicated displayed order, including practice and text hits, saved with scroll positions in session storage. Without a matching snapshot, show that stepping is unavailable. The viewer hides the Courses reader navigation when present and also supports bespoke layouts; preserve interactive content, submission identity and chat. `/topics/view/` only redirects, including old per-course copies. Use `projects/topics/topics-browser.html course_context=true` for course-hosted cards with week labels and ordinary course links. Tests: `bundle exec ruby scripts/test_topics.rb`, `node --test tests/topics.test.mjs`.
* Topics practice links need `.topics-browser__practice .ocs__btn.small` specificity: shared button size rules are emitted again later and otherwise force a one-line height. Keep links at least two lines tall and able to grow. Center the search X without a transform, because shared disabled-button rules remove it.
* CSSE game-directory posts appear at the bottom of the Capstone grid through `_includes/capstone-games.html`; this metadata can include lessons as well as games. `/cs-pathway/games/` redirects to `/capstone/?course=CSSE`, and the CS Pathway menu's CSSE link points there. Keep the legacy route working and preserve the Capstone year-filter fallback for cards without a year.
* Capstone 页面专用 HTML/Liquid 直接放在 `_posts/capstone/` 的所属 Markdown 中；只有导航、页脚、重复卡片和 OCS 看板等共享组件保留 include，既有 YAML 数据仍放 `_data/`。原平铺与 `websites/` 帖子按 `capstone_project.school_year` 放进 `<school_year>/`；辅助帖用顶层 `school_year`，缺失时按日期以八月为学年起点补齐，保留文件名与 permalink。不移动 `Intelligence/`、`OCS-in-a-Kit/`、`Presence/`、`Jarvis3000/`。嵌入 HTML 用 `markdownlint-capture`、`markdownlint-disable`、`markdownlint-restore` 注释局部关闭并恢复规则，不用 `raw` 阻止 Liquid 执行。验证：`bundle exec ruby scripts/test_capstone_posts.rb`。
* 学院报告用 `supporting_lessons` 映射 Java 库 permalink，与归属 `lessons` 分离；保持 Java 源归属、articulation、周次不变，标记辅助参考并在导航加入 `/navigation/java-reference/`。判断缺口先审核现有 Java 内容。验证：`bundle exec ruby scripts/test_java_curriculum_references.rb`。

* Flask sources belong to [_projects/lessons/flask/](_projects/lessons/flask/) with flat `notebooks/` and `docs/`. Keep a `flask` category or a `courses` placement on every source and preserve map `/python/flask/csp/`. The API hub `/python/flask/api` links only Jokes, Users, and Microblog; CSP placements sit on Anatomy and the Flask map (Week 9) and the API hub (Week 10); then students read Flask source for further API learning. Teach VS Code REST Client with the backend's shared `baseUrl`, prompted authentication, and `.http` files, not Postman. Trace users (`api/user.py`, `model/user.py`), jokes (`hacks/joke.py`, file-backed `hacks/jokes.py`), and microblog (`api/microblog_api.py`, `model/microblog.py`); distinguish manual checks from automated tests. Detailed model/SQL teaching belongs in a separate series. Retired API material is reviewed in the non-published `API_MATERIAL_REVIEW.md`; do not recreate duplicate API tutorials. Non-API Flask references remain. Publish docs before splitting the multi-course map. Test: `bundle exec ruby scripts/test_flask_project.rb`.
* 新项目遵循 [_projects/REGISTRATION.md](_projects/REGISTRATION.md) 注册/构建约定；架构示例见 [_projects/ARCHITECTURE.md](_projects/ARCHITECTURE.md)。
* 课堂管理与已迁移的洗手间 notebook 属于 [_projects/systems/class_manage/](_projects/systems/class_manage/README.md)（`:dev`）；旧版作业提交与评分页属于 Grades。保留 permalink；旧检出的被忽略 notebook 输出由 `clean-removed-projects` 清理。验证：`bundle exec ruby scripts/test_system_project_distribution.rb`、`bundle exec ruby scripts/test_clean_removed_projects.rb`。
* 样式优先使用 SCSS；主题切换与样式约定见 [README.md](README.md)。
* 主题预设（[assets/js/user-preferences.js](assets/js/user-preferences.js)）会用 `!important` 把所有 `span`、`div`、`p`、`li` 和标题改成主题文字色。按钮的图标和文字要直接写在 `ocs__btn` 里（像 [_layouts/post.html](_layouts/post.html) 的 Submit 按钮），不要包在 `<span>` 里，否则 `fill` 按钮上的文字会变成主题文字色，可能看不清。
* **语法复用：** 新的 `ocs__` 元素用 [mixins/_panel.scss](_sass/open-coding/mixins/_panel.scss) 的 `surface`（边框、圆角、面板与文字色）、`accent-tint`（悬停或选中的强调色调）、`kicker`（小号大写标签），加上 `@extend .ocs__truncate` 与 `$radius-pill` 组成，只写自己独有的部分；各元素复用什么见 [_sass/open-coding/README.md](_sass/open-coding/README.md) 的 Shared pieces 表。`open-coding/_main.scss` 最先导入 `_panel.scss`；项目自己的样式表（`assets/css/projects/<name>/main.scss`）不经过它，所以项目会导入的 mixin 文件（如 `_grid.scss`）要自己 `@import "panel"`。`_panel.scss` 被导入多次，只用 `//` 注释：`/* */` 注释每导入一次就在 CSS 里多写一份。
* 主题对比度：[assets/js/user-preferences.js](assets/js/user-preferences.js) 中每个预设与节日主题的文字色和强调色，在页面和 `--panel` 上都至少 4.5:1（WCAG AA），强调色填充上的页面色文字也是；`--text-muted`（在各表面上 4.5:1）和输入框边框（`--field-border`，3:1）由引擎按对比度推算。OCS 语法里，强调色色调（`color-mix(... var(--pref-accent-color) ...)`）上的文字用 `--pref-text-color`，强调色只用于边框和色调。Markdown 表格的表头、斑马纹和边框用 `base/_tables.scss` 里的主题变量。改预设颜色时，把旧的 bg/text/accent 加进 `RETIRED_THEME_COLORS`，这样保存了旧颜色的学生会改用新颜色。测试：`node --test tests/theme_contrast.test.mjs`。
* Profile（`/profile`）是系统套件 [_projects/systems/profile/](_projects/systems/profile/README.md)；改源文件，不改 `projects/profile/` 下的发布副本。`index.md` 直接使用 `opencsplus`；`data/` 管理 Profile 与工具页的默认侧栏及 mentor 侧栏。`distribution.json` 用 `standard: true` 发布目录，另映射首页与旧 JS 兼容路径；其启动脚本用 `{{ site.baseurl }}` 导入 `assets/js/api/config.js` 与 Login 的 `assets/js/login/backend.js`，用 `createProfile(createBackends({ pythonURI, javaURI, fetchOptions, springEnabled }))` 创建 profile 后传给 `initProfilePage({ profile })`，所以各模块之间只用 `./` 路径导入，不要加 `../` 导入。临时 `/profile/v2` 已移除。见[其架构](_projects/systems/profile/docs/ARCHITECTURE.md)。所有载入与保存都经过 `js/profile-backend.js` 的两个类：`FlaskProfile` 是核心（帐户字段、课程、persona 与技能自评，都存在 Flask），`SpringProfile extends FlaskProfile` 还会把每个字段保存到 Spring 的副本（`POST /api/person/update`，与 Flask 的 `PUT /api/user` 一起发送，并等待两者），课程变更后更新 Spring 的课程群组（`PUT /api/groups/class-memberships`），并提供 Face ID；页面只看 `profile.usesSpring`，不读 `springEnabled`。Gist 与 AI 连接卡片由各自的 include 启动，只在有 Spring 的站点出现。表单的载入值必须在异步加载填好字段之后再记录：之前与仍为空的字段比较，使 Save 重发所有字段（包括 User ID）并弹出“will be logged out”提示。仅 Flask 的站点（`spring: false`）在 Profile、`/login`、`/logout` 的脚本和导航栏中都不调用 Spring（`/signup` 与 `/guestlogin` 仍会调用，见 Login 一条）；`config.js` 和 profile 页面设有 `regenerate: true`，所以增量构建也会应用对 `spring` 的修改。测试：`node --test tests/profile_model.test.mjs tests/profile_backend.test.mjs tests/profile_page.test.mjs tests/profile_starter.test.mjs tests/test_gist_connection.mjs`（`profile_page` 在 Messages 系统的 fake DOM 上运行真实模块）。
* Login（`/login`、`/signup`、`/guestlogin`、`/logout` 和导航栏的登录状态）是系统套件 [_projects/systems/login/](_projects/systems/login/README.md)，注册为 `systems/login:dev`；改源文件，不改发布副本（`navigation/authentication/login.md`、`logout.md`、`guestlogin.md`、`navigation/signup.md`、`assets/js/api/logout.js`、`passwordRules.js`、`passwordFields.js`、`reverify.js` 与 `assets/js/login/`）。原有的脚本保留 `assets/js/api/` 中的发布路径；导航栏脚本发布到 `assets/js/login/navbar-login.js`，因为它不再在加载时运行，而是等页眉调用 `startNavbarLogin`，换用新路径可避免浏览器把新的页眉与缓存的旧 `login.js` 搭配使用。发布的脚本不经过 Liquid 渲染，所以每个页面的启动脚本用 `{{ site.baseurl }}` 导入 `config.js` 等共享函数，用 `createSession(createBackends({ pythonURI, javaURI, fetchOptions, springEnabled }))` 创建会话后传入：`/login` 传给 `startLoginPage`，站点页眉传给 `startNavbarLogin`，`/logout` 传给 `handleLogout(session)`。模块不导入 `config.js`，不用 `../`，只导入本系统发布在同一目录的文件；只有启动脚本读取 `springEnabled`，`login-page.js` 与 `navbar-login.js` 用 `session.usesSpring` 判断，导航栏的主题同步另用页眉传入的 Spring 后端（仅 Flask 的站点为 `null`）。注册、登录、登出与当前用户由 `js/session.js` 中的两个类处理：`FlaskSession` 是核心，`SpringSession extends FlaskSession` 在 `super` 之后执行 Spring 的步骤（登录时同时登录两个后端），Spring 失败只报告、不抛出。`/signup` 与 `/guestlogin` 还不读取 `springEnabled`。测试：`node --test _projects/systems/login/tests/*.test.mjs _projects/systems/courses/tests/course_entry.test.mjs tests/microblog_review.test.mjs`。
* v2 页面：ocs__ 改版就是主页面：`/dashboard`（布局 `dashboard-v2`）、`/analytics-dashboard`、`/submissions`、`/student/calendar`、`/student/bathroom_pass` 与 `/student/view-grades`。Grades 的 Analytics、Retrospective 和 Submissions 内容在各自的 `pages/*.md` 中，使用 `opencsplus` 和 `{::nomarkdown}` 保留 HTML 与脚本；Grades 样式不再带 `-v2` 名称。Grades 的临时 `/v2` 地址已删除；Dashboard、Calendar 与 Bathroom Pass 的 `/v2` 地址仍重定向到主页面。改样式直接改主页面，不要再建平行副本。Grades 的每个样式和 `_sass/open-coding/` 里剩余的 `*-v2.scss` 都必须在 `_main.scss` 中导入：合并冲突曾悄悄丢掉三个，页面就失去了样式。测试：`node --test tests/v2_pages.test.mjs`。
* Grades（顶栏 Topics 旁的 Grades，`/grades/`）是系统套件 [_projects/systems/grades/](_projects/systems/grades/README.md)：Grades 中心、View Grades、Analytics Dashboard（含 Grade Predictor）、Retrospective 与 Submissions 的页面、布局、include、JS 与样式都在这里，以 `distribution.json` 的 `standard: true` 发布到各自的 `projects/grades/` 目录，permalink 不变；首页与旧 JS 兼容路径是例外，发布副本被 git 忽略；改源文件，不改副本。这些页面设 `sidebar: grades_sidebar` 和 `sidebar_project: grades`，显示自己的侧栏（`data/grades_sidebar.yml`）；Profile 与工具页使用 `_data/projects/profile/profile_sidebar.yml`，其中不再列评分页面。`_includes/aesthetihawk/sidebar.html` 按页面的 `sidebar:` 和可选的 `sidebar_project:` 选数据文件；`sidebar:` 与 `active_tab` 必须写在页面自己的 front matter 里（`page` 读不到布局的 front matter）。中心只链接已有页面与分区，分为 Grade、Reflect、Submissions 三组，链接在 `data/grades_hub.yml`，不要另建平行页面。Analytics Dashboard、Retrospective 与 Submissions 没有标签栏：侧栏在每页下方以 `ocs__tree` 缩进列出其分区（`data/grades_sidebar.yml` 的 `children`），各自链接到 `页面#分区`。每个分区元素带 `data-section="<名称>"`，`js/page-sections.js`（`followSectionHash`）在载入和 `hashchange` 时显示哈希指定的分区；名称未知或查看者不能打开（非管理员的 All Submissions）时显示第一个分区，并给带 `data-sidebar-section` 的侧栏链接（只有当前页面的）设 `aria-current`。教师看到时，`creator-dashboard.js` 把该分区的侧栏链接改名为“Teacher Dashboard”。宽度 768px 及以下时，`_layouts/opencsplus.html` 隐藏侧栏，并在页面上方的 `<details>` Menu 中再放一份同一 include，传 `id_prefix="phone-"` 以免 id 重复。各页面自己检查角色，中心与侧栏只用 `audience` 标注教师链接；`spring_path` 链接由 `config.js` 的 `javaURI` 补全，`spring: false` 时不显示。Blogs 与 Courses 加载 `assets/js/projects/grades/submissions/grading.js`；旧 JS 路径通过 `compatibility/` 保持可用。见[其架构](_projects/systems/grades/docs/ARCHITECTURE.md)。测试：`bundle exec ruby scripts/test_grades_hub.rb`（每个中心链接和侧栏分区的页面与 `data-section` 都必须存在）与 `node --test _projects/systems/grades/tests/page_sections.test.mjs`。
* UI Builder（`/ui-builder/`）是系统套件 [_projects/systems/ui-builder/](_projects/systems/ui-builder/README.md)（注册为 `systems/ui-builder`，不带 `:dev`：文件很多，所以 `make dev` 不构建它，完整的 `make` 才构建），见[其架构](_projects/systems/ui-builder/docs/ARCHITECTURE.md)。编辑器顶栏的 Preview/Code 在预览与代码视图之间切换：代码视图（`editor-code.js`，排版在 `pretty-html.js`，只加换行与缩进）逐块显示页面文件的 HTML，用 Rouge 的 `.highlight` 类上色，并附注册表的 `code_note` 与 `text.code_classes` 说明；新块或框架要写 `code_note`，渲染器用到新的 `ocs__` 类要写它的说明（`tests/editor-code.test.mjs` 检查）。页面是由 section 和块组成的 JSON 文档，由 `render.js` 经 `vnode.js` 的标签与属性白名单渲染成 OCS 语法；作者写的文字永远是文字，富文本经 `rich-text.js` 清理后再检查链接，导出的页面文件把 `{` `}` 转义，Liquid 不会执行。注册表（块、字段、限制、模板与全部可见文字）在 `data/ui_builder.yml`，学校内容在 `data/ui_builder_school.yml`，编辑器文字在 `data/ui_builder_editor.yml`（`tests/editor-strings.test.mjs` 检查编辑器用到的每个键）；代码里不写可见文字。Spring（`mvc/uibuilder`）按键名校验文档：URL 只放在 `url`/`src`/`image`/`link` 键，富文本只放在 `body`，API 映射以 `_path` 结尾。`url-rules.js` 与 Spring 的 `urlIssue` 一样按原样读取地址，并像 JavaScript 那样去掉首尾空白；`rich-html.js`（供 `page-rules.js` 使用）读取富文本的方式与 Spring 相同（同样的标签规则与字符引用，属性值按 jsoup 的方式解码），它没有 HTML 解析器，所以把 Spring 的元素与属性检查用在它找到的每个标签上，因此可能拒绝 Spring 接受的残缺标记，但绝不会反过来；发布时与 Spring 一样拒绝 `url`/`src`/`image`/`link` 值和富文本 `href`/`src` 中指向学生本机的地址（`isLoopbackHost` 即 Spring 的同名列表，包括 `[::]` 与映射到 IPv6 的 `127.x`，主机按原样读取），草稿可以保留，画廊图片除外；API 块的 `list_path` 为 `""` 表示尚未选择（`listIn` 也用于已发布页面，只猜回复本身这个列表或其中由对象组成的列表），`"."` 表示整个回复，无可猜或为 `"."` 时单个对象即一项；Test connection 统计块将显示的项，Show code 读取相同的项（`""` 时其代码像块一样猜列表）并把每项画成卡片，Test 不会改写已选的列表；slug 遵循注册表的 `limits.slug_pattern`（即 Spring 的 `ui-builder.limits.slug-pattern`），`url-rules.js` 的 `slugMatches` 检查格式，`slugIssue` 还检查保留词。改规则、字段或限制时两边一起改（Spring 的 `UiBuilderSpecRules` 或 `ui-builder.limits.*`），并同步两边逐字节相同的 fixture（`tests/fixtures/specs/valid` 与 `invalid`，以及 Spring 的 `src/test/resources/ui-builder/`；`specs/client/` 只供 Pages 测试使用）。工具注意：Write/Edit 工具会把 `\uXXXX` 转义（包括 `\u003c`）写成字面字符，写完用 python 以 `chr(92)` 修正并 `node --check`。
* UI Builder 运行时：每个页面的启动脚本（`pages/*.md`）按 `config.js` 的 `springEnabled` 只选一次存储类（`SpringPageStore` 或 `LocalPageStore`）；之后编辑器只看 `store.capabilities`，不看 `springEnabled`，仅 Flask 的站点不向 Spring 发任何请求。`spring: false` 时页面存在浏览器，需要 Spring 的块在块菜单里关闭，访客反馈也在内（反馈按发布地址归档，而只有 Spring 能发布）。查看器（`/ui-builder/view/`）依次接受 `?page=<slug>`（已发布，须符合注册表的 slug 格式）、`?draft=<id>`（编辑者与教师）、`?local=<id>`（本浏览器）；它拒绝在框架里运行，仅 Flask 的站点只打开 `?local`。看板块要等点击“Show our board”才加载，能编辑该页面的人除外（GitHub 每个网络每小时只允许 60 次请求）。反馈读取 Flask 公开的 `GET /api/microblog/page/<key>`，话题路径为 `/ui-builder/view/?page=<slug>`，并用 `microblog.js` 的 `createPost` 发帖。画布是 `/ui-builder/canvas/` 的同源 iframe，用 nonce 握手；它不挂载实时块，其布局不能引入 `head-custom.html`（网站的快捷键、统计与脚本）。测试：`node --test _projects/systems/ui-builder/tests/*.test.mjs`、`bundle exec ruby scripts/test_ui_builder.rb` 与 `node --test tests/ui_builder.test.mjs`（它逐个导入测试文件，新测试文件也要加进去）。
* 课程主页的公告没有标题框：聊天的日历按钮和连接状态在周日历的标题行里。`mountWeekView({ tools })` 把它们交给 `WeekRowTools.place`（Courses 的 `js/announcement-calendar/calendar-feed.js`）：`start` 放在 `<` `>` 之前，`end` 经 `ocs__card-header` 放到最右（手机上换行）。聊天只在 `[data-hook="calendar-tools"]` 中找一次，之后每个新的周视图（先 live，连接失败后 preview）把它们移进自己的行。不传 `tools` 时周视图不变（日历卡片）。测试：`node --test tests/week_row_tools.test.mjs` 与 `bundle exec ruby scripts/test_course_landing_pages.rb`。
* 看板与日历卡片可由页面自己的数据生成：`{% include ocs_kanban_board.html template=true %}` 与 `{% include ocs_calendar_card.html template=true %}` 只输出 `<template data-ocs-template=…>` 里的空卡片，页面级 JSON 由 `ocs_kanban_board_data.html` 与 `ocs_calendar_card_data.html` 各写一次。`assets/js/kanban-board.js` 导出 `createKanbanSection`、`mountKanbanBoard`、`mountAll`；`calendar-card.js`（源码在 Courses 的 `js/announcement-calendar/`）导出 `createCalendarCardSection`、`mountCalendarCard`、`mountAll`。生成的卡片带 `data-mounted="manual"`，只由 mount 函数挂载，`unmount()` 移除它加的监听。现有 include 调用的输出逐字节不变（`bundle exec ruby scripts/test_kanban_board.rb`、`scripts/test_calendar_card.rb`）。测试：`node --test tests/kanban_board.test.mjs tests/calendar_card.test.mjs`。
* 日历滚动条（`{% include ocs_calendar_ticker.html %}`，源码在 Courses 的 `_includes/` 与 `js/announcement-calendar/calendar-ticker.js`）位于每个课程主页的公告上方。`TickerItems`（纯函数）挑出该课程从今天到前瞻期最后一天的事件。前瞻期由 `_config.yml` 的 `calendar_ticker` 设定，include 把它写在滚动条的 data 属性上：`school_days_ahead` 个上课日（`lastDay` 跳过周末、假期与停课日），没有学校周数据时为 `days_ahead` 天，未设定时为 5 与 7。事件自己的提醒（日历页面的 Ticker alert，存于描述中 `Linked doc:` 行之前的 `Alert: N days before` 一行，由 Calendar 系统的 `CalendarAlerts.js` 读写，事件窗口把它显示为单独字段）取代前瞻期：从日期前 N 天开始显示，最多 `alert_limit_days` 天（未设定时为 30），能读取提醒时向 Spring 请求到那一天。事件标为 Today、Tomorrow 或短日期，同一天内 P0 在前并带 Urgent 标签，并经 Calendar 系统的 `splitLinkedDoc` 链接到关联文档（没有文档、文档在其他网站或文档就是本页时打开 `/student/calendar`：任何已登录账户都能添加事件，所以主页从不直接链接到站外）。`CalendarTicker` 用 `textContent` 把两份列表填进 include 的隐藏外壳（第二份 `aria-hidden`，链接 `tabindex="-1"`），只在链接换行时加 `ocs__ticker--moving`，并按列表宽度设置 `--ocs-ticker-duration`。Spring 日历只回应已登录访客：401/403、出错或没有事件时不显示；`spring: false` 时 include 不输出任何内容。`systems/calendar` 不是 `:dev`，所以 `CalendarDocLinks.js` 与 `CalendarAlerts.js` 各自只在 `site.static_files` 中时才导入。测试：`node --test tests/calendar_ticker.test.mjs tests/calendar_alerts.test.mjs`、`bundle exec ruby scripts/test_calendar_ticker.rb` 与 `scripts/test_course_landing_pages.rb`。
* Mermaid 图源里不要写 `var(--panel)` 或 `style` 色值：括号会被当成节点语法。颜色由 [_includes/mermaid.html](_includes/mermaid.html) 读取偏好变量，并由 [user-preferences.scss](_sass/open-coding/theme/user-preferences.scss) 的 `.mermaid` 规则在主题切换后保持同步。
* **课程反馈（Lesson Feedback）：** 源码在 [_projects/systems/lesson-feedback/](_projects/systems/lesson-feedback/README.md)（注册为 `systems/lesson-feedback:dev`，因为 Courses 与 Blogs 页面会引用其生成的 include），数据存于 Spring 的 `/api/lesson-feedback`（`mvc/lessonfeedback`）。只在同时有 `assignment: true` 和 `team_teach: true` 的页面显示：这类页面总会显示 microblog 面板（`base.html`），其中 Chat、Suggestions 旁的 Ratings 标签页放课程步骤，Submit Assignment 内是提交步骤。所有提交作业的人都要评价，包括教学团队（`assignment_creator_uids`）和教师。Ratings 不是频道（`data-panel`，不是 `data-channel`），切换时 `activeChannel` 保持不变，从不显示或创建帖子；microblog 帖子的名字和正文须经 `escapeHtml` 再插入 HTML。三个提交处理函数（`course-document-player.html` 与 `post.html` 源文件）先 `await` `beforeSubmit()`，反馈未完成或未保存就不提交；未完成时聚焦第一个缺少的字段。Spring 执行同一规则：`scripts/sync_assignments.py` 发送 `teamTeach`（仅同步机器人可设置）到 `Assignment.teamTeach`，在提交者的反馈完成之前 `AssignmentSubmissionHistoryService.submit` 返回 `LESSON_FEEDBACK_REQUIRED`（409），所以给课程设置 `team_teach` 之前先部署 Spring。Lesson Summary 实时更新（无最少人数，不等关闭），只在 `/submissions` 的 Teacher Dashboard 上：团队授课课程的 Lesson Summary 按钮打开 `lesson-feedback-teacher.js`（发散条形图、表格视图和不署名的评论）；Spring 只允许教师和指定评分者读取，创建者不能。两个表单的 `idPrefix` 必须不同，否则同名单选按钮会互相清除。测试：`node --test _projects/systems/lesson-feedback/tests/`（在 `\\wsl` 路径上用 Windows `node.exe` 时逐个列出文件）与 `node --test tests/test_creator_dashboard.mjs`。

### 后端边界

* **Microblog 系统：** 源码在 [_projects/systems/microblog/](_projects/systems/microblog/README.md)，注册为 `systems/microblog:dev`；共享模板无需清单即可发布到通用 `projects/microblog/` 目录，`/review` permalink 不变。依赖 Login 密码规则、共享 API 配置和 Lesson Feedback。保留旧分发缓存，让下次构建清除旧文件；修改模板后重启项目 watcher。测试：`bundle exec ruby scripts/test_system_project_distribution.rb`、`node --test tests/microblog_*.test.mjs`。

* 后端服务位于 [node_backend/README.md](node_backend/README.md)，与站点构建流程分离；改动前先阅读该文档。
* **手机评审页：** 项目页的 Microblog 面板有 **QR code** 按钮，生成指向 `/review?topic=<页面 permalink>` 的二维码（[_projects/systems/microblog/pages/review.md](_projects/systems/microblog/pages/review.md)）。访客只填姓名和评论：页面用 `guestCredentials`（[_projects/systems/microblog/js/microblog-review.js](_projects/systems/microblog/js/microblog-review.js)）暗中创建 Flask 来宾账号（`POST /api/user` 带 `accountType: guest`，需教师开着 Guest Window）、登录并发到该话题；密码是独立的加密随机值，绝不能由帖子里可见的用户名推出。二维码由 `assets/js/vendor/qrcode.js` 按需加载绘制。页面标题用 `h2`：某项目样式表把全站 `h1` 设为 `display: none`。测试：`node --test tests/microblog_review.test.mjs`。
* **Microblog 搜索与问卷：** 面板的搜索框（`matchesSearch`）匹配帖子正文、作者、话题、问卷选项和回复，代替 DataTables 自带搜索（`searching: false`），输入时用上次获取的数据重绘，不重新请求。新帖可附问卷：选项存于帖子的 `data.survey.options`（2–6 个，`normalizeSurveyOptions`），投票是标记回复 `[[microblog:vote]] <选项序号>`，按服务器记录的 `userId` 每人取最后一票（`getSurveyResults`）；投票属于 `isStatusMarker`，不显示为回复、不计入通知。编辑帖子不能改问卷（票按序号指向选项）；帖子已解决时问卷关闭。测试：`node --test tests/microblog_surveys.test.mjs tests/microblog_forms.test.mjs`。
* **反馈表单：** 全站的“Issue ⁇”按钮（[_includes/feedback_foundation.html](_includes/feedback_foundation.html)）发送到 Flask 的 `POST /api/feedback/`，Flask 保存反馈并在 Open-Coding-Society/pages 开一个 `[User Feedback]` issue。Flask 返回前 Submit 保持禁用（“Sending...”），因为每次 POST 都会开一个 issue，等待时再点一次曾开出重复 issue（#1387-#1390）。一分钟内相同标题、内容和 uid 的反馈，Flask 也只返回已保存的那份，不再开新 issue（`Feedback.recent_duplicate`，见 Flask README）。
* **统计脚本（Analytics tracker）：** [assets/js/ocs-analytics-tracker.js](assets/js/ocs-analytics-tracker.js) 每 30 秒及访客离开页面时检查一次：自上次成功保存后有点击或按键，就把页面上的活动发到 Spring 的 `POST /api/ocs-analytics/save`（quest 页面每次都发，保存失败的数据会再发）。这些数据只有 Spring 保存和读取（`/analytics-dashboard` 的 OCS Analytics 标签页、CS Pathway 的 Assessment Observatory 关卡）。`_includes/head-custom.html` 只在 `site.spring != false` 时加载它：仅 Flask 的站点（`spring: false`）得到不含它的同一页头，`spring: true` 或未设置 `spring` 的站点照常加载。加载它的页面都引入远程主题的 `head.html`：jekyll-remote-theme 每次构建都把主题下载到新的临时目录，并在 Jekyll 退出时删除，所以 Jekyll 把这些页面算作已修改，增量构建会重新渲染它们，修改 `spring` 后无需 `make clean`；换成 gem 主题就不会这样。`head-custom.html` 仍为每个页面设置 `window.javaURI`，因为其他脚本也读取它。测试：`bundle exec ruby scripts/test_analytics_tracker_include.rb`。
* **评分生命周期：** 作业关闭前，教师和学生助教（作业创建者、指定评分者）在 Submissions 页面评分（全部提交表格、编辑弹窗、[creator-dashboard.js](_projects/systems/grades/js/submissions/creator-dashboard.js) 的“Assignments You Created”）：保存的分数即人工覆盖，“AI re-grade”请 AI 重新评分，“Use AI grade”（`DELETE /api/submissions/grade/{id}`）移除覆盖。所有评分请求和结果文案都在 [grading.js](_projects/systems/grades/js/submissions/grading.js)：Spring 返回类型化的 `outcome` 和 `grading` 状态（有效分、AI 分、人工分、`revision`、`closed`），页面按 outcome 显示文案；课程提交表单（Blogs `post.html`、Courses `course-document-player.html` 源文件）也使用其 `readGradingResponse`。务必发送屏幕上显示的 `revision`（否则 `STALE_REVISION`，409）。新内容即新版本：AI 重新评分，人工覆盖解除。教师在 Spring 的 tracker 中关闭作业后分数即为最终分（`grading.closed`，显示“Final”）：页面输入只读、隐藏编辑和评分操作；重新评分请求、相似性检查和申诉改由教师在 tracker 中审查。界面只用 OCS 语法（状态标签、`ocs__modal` 历史与 `ocs__tree` 时间线、`ocs__callout`、`ocs__links`），不用内联颜色。教师和管理员（`user-info` 的 `isAdmin` 包含 `ROLE_TEACHER`）看到的该标签为“Teacher Dashboard”，列出全部作业（与 Spring `/managed` 端点一致），其他人只看到自己创建的作业。Topic 过滤器使用课程 frontmatter 的 `categories`（作为 `topics` 写入 `assets/data/assignment-course-manifest.json`），同时筛选课程列表和提交表格。“Re-run AI grading”对筛选后的提交逐个调用 `POST /api/submissions/ai-grade/{id}`，跳过已关闭作业和教师评分。测试：`node --test tests/test_submission_grading.mjs tests/test_creator_dashboard.mjs`。

## 编码标准

### 命名规范

命名应：

* 解释**意图**，而不是实现。
* 避免使用缩写，除非是标准缩写。
* 在整个代码库中保持一致。
* 示例：使用 `normalizeUserTransactionData()` 而不是 `procData2()`。

### 错误处理

* **快速失败：** 尽早验证输入，立即抛出包含清晰信息的错误，不要默默忽略失败。
* **防御性编程：** 假设输入无效或恶意，为边缘情况添加保护，绝不信任外部数据源。
* **纪律：** 绝不默默吞没异常。在错误中始终包含上下文，并在适当的地方使用类型化/自定义错误。

### 日志记录规则

* 记录有意义的事件，而不是噪音。
* 日志应回答：**发生了什么以及为什么？**
* 避免记录敏感数据。

## 测试规则

* **Platformer 碰撞：** 玩家保持圆形；`Barrier` 在共享 `GameObject.isCollision` 中使用完整矩形表面（默认缩减为零），不是细长平台中心的小圆。相切算接触，接触面由法向确定。游戏只处理落地/顶头响应，不覆盖检测器；落地后同步 canvas，再检测其他对象。测试要调用真实 `collisionChecks`，覆盖平台端部落地、持续支撑、W 跳跃与走出边缘，不能只伪造 `touchPoints`。验证：`node --import ./assets/js/GameEnginev1.1/test/register-assets.mjs --test assets/js/GameEnginev1.1/test/barrier-collision.test.mjs _projects/games/platformer/tests/platformer-player.test.mjs`，并在浏览器检查。

* Flask Markdown publication mirrors sources into `_posts/projects/flask/docs/` (not `_posts/flask/docs/`) so the shared project cleanup and ignore rules apply. Verify migration, cleanup, and republication with `bundle exec ruby scripts/test_course_distribution.rb`; edit sources under `_projects/lessons/flask/docs/`, never generated copies.

* **GameEnginev1.1 keyboard tests:** Scroll prevention belongs directly in [Player.js](assets/js/GameEnginev1.1/essentials/Player.js); keep game-specific input guards in subclasses. Reuse [keyboard-test-helper.mjs](assets/js/GameEnginev1.1/test/keyboard-test-helper.mjs) for synthetic keydown/keyup tests of real Player/subclass movement, without constructors or browser globals. Use `@assets` for shared test imports, preloading [register-assets.mjs](assets/js/GameEnginev1.1/test/register-assets.mjs); do not inject replacement engine source or change aliases to source-relative paths (project builds relocate modules). Usage and limits: [test README](assets/js/GameEnginev1.1/test/README.md). Run `node --import ./assets/js/GameEnginev1.1/test/register-assets.mjs --test assets/js/GameEnginev1.1/test/*.test.mjs _projects/games/racing-game/tests/racing-player.test.mjs` (Node 22.15+); browser checks are still needed for rendering, listeners, and actual scrolling.

### 行为驱动测试

* 测试应描述行为，而不是实现。
* 每条关键逻辑路径都应可测试。
* 逻辑优先使用单元测试，流程优先使用集成测试。

### 要求关键路径覆盖

* **智能体规则：** 如果代码改变了行为，请更新或添加测试。
* 确保确定性行为（除非明确需要，否则避免随机性，需要时固定种子）。

## 智能体行为规则

### 编码前计划

* 对于非平凡任务：在编码前写一个简短计划。
* 在实现前将其分解为多个步骤。

### 最小化差异

* 除非必要，否则优先考虑最小的差异，而不是重构。
* 无故不要重写正在工作的代码。

### 遵循现有模式

* 匹配现有代码库的风格和结构。
* 除非必要，不要引入新架构。
* **验证假设：** 如果不清楚，请谨慎推断并标记假设。绝不默默猜测关键需求。

### 自我更新与持续学习

* **同步更新文档：** 随着你在迭代中犯错、学习新的系统模式或约束，主动用重要的注意事项更新 `AGENTS.md`，并确保同步更新 `AGENTS_MD_DOCUMENTATION.md`（英文说明版本），以便系统随时间不断改进。

## 个人 AI 密钥

* **个人 AI 密钥：** 规范源是 `_projects/systems/profile/_includes/profile-ai-connections.html` 与 `js/ai-connections.js`；使用共享 OCS 控件，无页面样式表。启动 include 注入 `javaURI`，不从模块用 `../` 导入配置。只在 `site.spring != false` 时渲染，独立于个人信息与 Gist 保存，不作为必填 Setup 步骤。不要记录、回显或在浏览器存储密钥；每次保存尝试后清空输入。评分失败不阻止保存提交，学校部署前检查供应商资格/隐私条件。测试：`node tests/test_ai_connections.mjs`、`bundle exec ruby tests/test_ai_profile_layout.rb`。

## 群组与实时聊天（Groups & realtime chat）

* **Messages（`/dm`）：** 群组与私信在同一页面，源码在 [_projects/systems/messages/](_projects/systems/messages/README.md)（注册为 `systems/messages:dev`）；旧的 `/student/groups/` 与 `/student/groups/dashboard/` 重定向到 `/dm`。页面用 OCS 语法加 `sass/` 里限定在 `.dm` 下的样式。`conversation-embed.js` 的 `mountGroupChat`/`mountConversation` 把一个对话嵌入任意页面的元素里，返回 `Promise<{state, destroy()}>`；每个嵌入有自己的 socket，`destroy()` 断开并移除所有监听（UI Builder 的聊天块用它）。模块之间只用 `./` 导入；页面用 `{{ site.baseurl }}` 导入 `config.js` 与 `rich-text.js` 并传给 `startMessagesPage`。纯函数在 `messages-model.js` 与 `formation-model.js`。较新的模块只导出类，像 Java 把 `Math.random` 放在 `Math` 上一样：纯函数是一个类的静态方法（`SharedFiles.formatBytes(size)`、`FilesMarker.extract(body)`），有状态或界面的用 `new` 创建（`new ComposerFiles({ ... })`），状态放在私有字段里；每个类与方法写不含 HTML 的 JSDoc 注释。会被单独移除的监听写成箭头函数字段，添加与移除用同一个引用。`tests/module_classes.test.mjs` 在新模块导出类以外的东西时失败；旧模块（页面、pane、log、embed、models、dialogs、Add to calendar 的 `schedule-*.js` 与推送通知的 `notify-button.js`）暂时保留函数导出，因为其他系统按名字导入它们。测试：`node --test _projects/systems/messages/tests/*.test.mjs`。
* **群组文件与文件夹：** Messages 的 Attach 菜单与拖放把文件或整个文件夹放进输入框上方的托盘，Send 先上传（`group-files.js` 的 `GroupFiles`，每次三个，XHR 报告进度），再发送带 `[[files:…]]` 标记的消息（`files-model.js`：文件 `f~路径~大小`、文件夹 `d~路径~数量~大小`，`;` 分隔，标记字符转义为 `%XX`，位于回复标记之后）。文件夹里的文件保留路径（`team-site/css/main.css`）；跳过 `.git`、`node_modules` 等并计数；单个文件上限 35 MB（Spring 与 nginx 收 50 MB，base64 大三分之一）；重名变成 `name (2)`：页面只收到打开中会话的分享帧，所以 Send 与打开 Files 对话框时先 `GroupFiles.refresh()` 再读列表；Spring 不覆盖已分享的路径（同一路径正在写入时也拒绝），返回 409，页面把被拒的单个文件以下一个空名重传一次，文件夹里被拒的文件则不列入消息；文件夹 `.zip` 的 1 GB 上限按列表里的真实大小算，不信标记（任何人都能手打标记）。新的标记名要加进 `chat-reply.js` 的 `ANY_MARKER_PATTERN`，否则引用和搜索摘要会显示原文。私信只能附图片：Spring 只为群组保存文件。列表与下载用 Spring 新增的 `GET /api/groups/chat/{id}/files/index`、`/files/content?path=`（spring#280，已合并）；`sendFileServer` 帧只带文件名与大小，不再带字节。文件行、菜单、进度条是语法 `ocs__file`、`ocs__menu`、`ocs__progress`（`_sass/open-coding/elements/`），`.dm` 只负责位置。叠在另一个弹层上的弹层（Files 对话框上的文件查看器）在捕获阶段接住 Escape 并停止传播，一次 Escape 只关一层。测试：`node --test _projects/systems/messages/tests/*.test.mjs`。
* **协议：** SockJS + STOMP.js（cdnjs 加载）连接 Spring 的 `/ws-chat`（`config.js` 的 `javaWebSocketURI`，localhost 为 8589 端口）。Messages 页经 REST 发送（私信 `POST /api/dm/conversations/{id}/messages`，群组 `POST /api/groups/chat/{id}/messages` 带 `{message, image}`，发送者由 Spring 从登录会话取得），socket 只接收 `/topic/dm/{id}` 或 `/topic/group/{id}`。群组消息只保存发送者显示名，Spring 用它校验编辑和删除，所以发送时用账户名，也按名字识别自己的消息。课程聊天（announcement/lesson）也经同一个群组 REST 接口发送：Spring 的 JWT 过滤器只处理 `/api/` 请求，`/ws-chat` 握手拿不到登录身份，所以 STOMP `/app/groups.chat` 的 sendMessage 存不了消息。保存的消息用 `author`/`author_uid` 字段，socket 帧里同一个人仍叫 `sender`。
* **群组过滤：** `lessons`、`<course>-announcements` 是课程页聊天用的群组，已删除的周聊天留下的 `<course>-week-<n>` 也一样，都不在 Find a group 中显示；班级群组（CSSE、CSP、CSA、CSH，即 Spring 的 `courses.class-groups`）由 Profile 课程同步、日历会读取，所以不提供 Leave 或 Delete，Find a group 也不提供 Join（提示去 Profile 添加课程）。其他群组只有管理员能删除：入口在 Members 对话框底部，输入群组名后才调用 `DELETE /api/groups/{id}`。Spring 不检查是否为管理员；删除群组会连带删除其成绩和以该群组提交的作业，但不删除 S3 中按群组名保存的聊天和文件。
* **代码重复警告：** 课程聊天在 [_projects/systems/courses/_includes/](_projects/systems/courses/_includes/) 的 `announcement_chat.html`、`lesson_chat.html` 中各有一份，并仍硬编码 8589 端口（待改用 `javaWebSocketURI`）；修改协议时同步这些 include 与 Messages 的 `thread.js`。
* **课程聊天约定：** lesson 页面通过 frontmatter `chat: true` 启用，共享 backbone 群组 `"lessons"`，以 `[[lesson:<url>]]` 标记按页面隔离。
* **回复与粘贴图片：** 公告聊天（`announcement_chat.html`）和 Messages（`thread.js`/`message-log.js`）的回复以纯文本标记 `[[reply:<消息 id>|<发送者>|<摘录>]]` 放在正文开头（发送者与摘录经 URL 编码），因为净化器会去掉所有属性；渲染前取出并显示引用，编辑时保留标记。助手在 [assets/js/chat/chat-reply.js](assets/js/chat/chat-reply.js)，粘贴图片读取在 `chat-image.js`，都由 `rich-text.js` 再导出，所以 Messages 模块经页面传入的 `richText` 取得，不用 `../` 导入。`createRichComposer` 的 `onPasteImage(file)` 接收剪贴板图片；公告聊天的图片放在群组消息的 `image`。`chat-image.js` 的 `readImageFile` 与 Messages 的 `dialogs.js` 规则相同，两处一起改。Messages 侧栏的 “Find a conversation” 按群组名、课程、节次和成员过滤（`matchesConversationSearch`）；聊天内搜索仍是 `message-search.js`。新增聊天文字键时同步 UI Builder 注册表 `text.chat`（`blocks-live.test.mjs` 检查）。测试：`node --test tests/chat_reply.test.mjs _projects/systems/messages/tests/*.test.mjs`。
* **视频通话（Calls）：** `/calls/?group=<id>`、`?dm=<id>` 与 `?course=<代码>` 是系统套件 [_projects/systems/calls/](_projects/systems/calls/README.md)（注册为 `systems/calls:dev`，因为 `/dm` 会加载它的 `call-entry.js`），后端是 Spring 的 `mvc/calls` 与 LiveKit 服务器。两个开关默认都关：`_config.yml` 的 `calls: enabled: false` 与 Spring 的 `calls.enabled=false`；`spring: false` 的站点永远不显示通话。页面只用 OCS 语法（每人一个 `ocs__grid-cell`，人少时放在一行两个大格子的 `ocs__grid--col2` 里，人多时放在 `ocs__grid--card` 里；还有 `<video class="ocs__embed ocs__embed--video" playsinline>`、`ocs__avatar`、`ocs__status-pill`、`ocs__viewer` 与 `ocs__split--aside-end`），没有样式表；所有文字都在 `data/calls.yml`（`site.data.projects.calls.calls`）。YAML 的键不要叫 `off`、`on`、`yes` 或 `no`：Ruby 的 YAML 把它们读成布尔值。模块只导出类、只用 `./` 导入；livekit-client 2.23.0 只在 `/calls/` 由 `livekit-script.js` 从 cdnjs 带完整性哈希加载。Messages 里只有一个钩子：`CallEntry` 设置 Call 链接，收到 `callServer` 帧后先用 `GET /api/calls/{id}` 确认是同一群组或私信里正在进行的通话才显示 Join；通话关闭时 `/dm` 的输出与之前逐字节相同。测试：`node --test _projects/systems/calls/tests/*.test.mjs` 与 `bundle exec ruby scripts/test_calls_page.rb`。

## 反模式

### 上帝函数

* 避免做太多事情的函数。坚持单一职责原则。

### 隐藏的副作用

* 通过保持明确且记录良好的副作用来确保可预测性。

### 过度设计

* **你需要它吗 (YAGNI)：** 除非现在需要，否则不要构建功能。避免推测性的泛化。
* 仅在保证正确性后才进行优化（优化前进行性能分析）。
