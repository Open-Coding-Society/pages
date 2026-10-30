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
* **日历事件编辑：** Spring 的 `PUT /api/calendar/edit/{id}` 拒绝空 `period` 或 `description`；无课程事件发送 `Personal`。关联文档存于描述末行（`Linked doc: <url>`，见 `_projects/systems/calendar/js/CalendarDocLinks.js`）；测试：`node --test tests/calendar_doc_links.test.mjs`。
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

### 源文件与生成文件

* Courses owns curriculum composition in [_projects/systems/courses/](_projects/systems/courses/); [Blogs](_projects/systems/blogs/README.md) owns shared document layouts, catalog/reader, completion helpers and viewer styles. See [architecture](_projects/systems/courses/docs/ARCHITECTURE.md). Both are `:dev` projects using the shared generated Makefile and disjoint distribution manifests. Edit sources, not root generated copies. The Blogs post layout delegates course rendering to Courses' `course-document-player.html`; standalone documents must render without Courses. Submission/Runners remain shared dependencies; Grading derives from Submission. On old checkouts publish Courses before Blogs to release cached ownership; never delete caches indiscriminately. Tests: `bundle exec ruby scripts/test_blogs_system.rb`, `bundle exec ruby scripts/test_course_distribution.rb`. Restart watchers after boundary/template changes.
* The Blogs catalog ([_projects/systems/blogs/_includes/blog-catalog.html](_projects/systems/blogs/_includes/blog-catalog.html)) reads page front matter: `post_filter: <flag>` keeps the posts whose flag is `true`, and `post_search: true` adds a search bar that filters the cards by title and description ([_projects/systems/blogs/js/post-search.js](_projects/systems/blogs/js/post-search.js); `?q=` keeps the query, as in Topics; matches are highlighted with a native `<mark>` built from text nodes in each card's title link and description, which `post_list_image_card.html` marks `data-post-search-field` while the search is on). Through `blog-reader.html` a host passes `course=<course>` (only posts whose `courses` names that course alone, the course player's rule) and `search=true`; each course's Blogs page passes both. The bar is OCS components only; `ocs__split` sets the field's width because an input's `size` renders far wider in Safari than in Chrome and overflows a 320px phone; the count sits on its own line so the split never stretches the field. Tests: `bundle exec ruby scripts/test_blog_catalog.rb`, `node --test tests/post_search.test.mjs`.

* Course home sources are [_projects/systems/courses/navigation/](_projects/systems/courses/navigation/). Preserve `/navigation/courses/<course>/`; use `layout: post` and `player_page: {course: <course>, kind: home}` to share the sidebar and existing announcement/calendar UI. Course pills must resolve `current_course` on lessons, not only `page.course`. Encode Liquid values in JavaScript with `jsonify`, especially quoted titles. Validate with `bundle exec ruby scripts/test_course_landing_pages.rb` and a mobile navigation check.
* Course navigation state is owned by [_projects/systems/courses/js/player/course-navigation-state.js](_projects/systems/courses/js/player/course-navigation-state.js): preserve sections, scroll, and last document per course/panel. Blogs stays in the main pane while the last document is highlighted for resuming; do not redirect or change completion. Expand selected ancestors idempotently, never by toggling. Do not rebuild mobile navigation on resize. Test: `node --test tests/course_navigation_state.test.mjs`.
* Top-menu course entry uses [_projects/systems/courses/js/player/course-entry.js](_projects/systems/courses/js/player/course-entry.js) and `[data-course-entry]` to link directly to `/navigation/courses/<course>/` (Home/Announcements), not Blogs or the legacy chooser/catalog. Keep the last document highlighted in the navigation panel without redirecting to it. Blogs breadcrumbs show Home > selected course > Blogs. Persist `ocs-selected-course` on course visits; use enrolled selections for signed-in users and `_config.yml`'s `default_course` for new visitors. Test: `node --test tests/course_entry.test.mjs`.

* 源文件在 [notebook sources](_notebooks/) 与 [docx sources](_docx/)；转换后的 Markdown 输出到 [generated posts](_posts/)（生成物，不要手工改）。
* 多课程拆分文件（`*_csp.md`/`*_csa.md`/`*_csse.md`/`*_content.md`）为生成物，禁止手改；规则见 [scripts/split_multi_course_files.py](scripts/split_multi_course_files.py)。
* 课程播放器页面（每门课的 `/<course>/sprint-<n>/`、`/<course>/week-<w>/`、`/<course>/week-<w>/chat/`、`/<course>/blogs/`）没有源文件：由 [_projects/systems/courses/plugins/lesson_player_pages.rb](_projects/systems/courses/plugins/lesson_player_pages.rb) 在构建时根据项目 `data/<course>.yml` 生成，周页面和聊天页面只为有 lesson 的周生成。页面内容改 [_projects/systems/courses/_includes/player-pages/](_projects/systems/courses/_includes/player-pages/)；[_projects/systems/courses/_includes/lesson-sidebar-nav.html](_projects/systems/courses/_includes/lesson-sidebar-nav.html) 中的链接必须使用相同的 URL。测试：`bundle exec ruby scripts/test_player_pages.rb`。
* Notebook/DOCX 转换规则见 [scripts/convert_notebooks.py](scripts/convert_notebooks.py) 与 [scripts/convert_docx.py](scripts/convert_docx.py)。
* 项目 notebook（包括 GameBuilder）从 `_projects/<category>/<project>/` 直接转换到 `_posts/projects/<project>/`；旧 `_notebooks/projects/` 副本不再参与全局转换或拆分。共享模板每项目一次批量调用（默认最多 4 workers），缓存 `.notebook-conversion-cache/` 按源/转换器内容和输出状态失效；相同 Markdown 不重写。`CONVERT_FLAGS=--force` 强制转换。`make dev` 不再清理和重复转换；改管线后重启 watcher。Makefile 生成器刷新未跟踪模板副本，保留已跟踪覆盖；持久修改改 [_projects/_template/Makefile](_projects/_template/Makefile)。验证：`venv/bin/python -m unittest discover -s tests -p test_convert_notebooks.py`。
* CSA 内容按 `cs112 → cs113 → csa1 → csa2 → ds2` 优先级归属到 `_projects/lessons/` 的注册项目；`notebooks/` 与 `docs/` 必须平铺，迁移保留 permalink 和 `courses.csa.week`。`articulation` 只表示课程对应，不表示获得学分。草稿用 `lesson_status: draft` 与 `planned_week`，不要设置 `courses`：时间线不会按 `hide` 排除课程。详见 [_projects/REGISTRATION.md](_projects/REGISTRATION.md)。验证：`node --test tests/csa_curriculum.test.mjs`。
* CSA 13–37 周按 `_data/csa.yml` 编排：每教学周最多三篇主文档；已对应 CS112 的 AP FRQ runner 可作为 `lesson_type: ap-practice` 补充练习超出限额，放在匹配教学周，题名/文件名以主题开头，保留 permalink。补充选课见 `tests/fixtures/csa_frq_practice.json`，主文档见 `tests/fixtures/csa_week_schedule.json`；其他例题为无周次参考。总结、AP 复习、展示和期末周用清单链接旧课，不新增作业。缺口用 `lesson_notes` 显示。移动源后只清理确认无源的生成文件，防止旧标题/周次重新发布。
* AP FRQ 分类号与历史题号必须分离：`ap_frq_category` 为 1 方法/控制、2 类设计、3 一维数组/ArrayList、4 二维数组；`ap_exam_year`/`ap_exam_question` 保存历史身份。题名如 `FRQ 3 - Array or ArrayList Manipulation - 2017 Exam Q1 - CS112`；按题目实际练习审核分类，不按旧题名或历史序号推断。旧题可能跨技能；9 分说明针对四题制分类，不改历史评分。frontmatter description 用纯文本，不含 Liquid 或 `#`：卡片不会递归渲染变量，转换器未引号输出会截断 YAML 注释。
* CS112/CS113 报告按 MiraCosta 原始五节与 Lab Outline 编排，映射在 `_data/cs112_topics.json` 与 `_data/cs113_topics.json`，共用 `curriculum-outline-report.html`；以稳定 permalink 匹配，不按文件名或 AP 分类。显示当前题名/周次、缺口、PBL 延伸；草稿明确未完成。新增未映射课程仍显示，删除课程不生成死链接。CS113 自实现层为差异化延伸，不把库调用当作实现掌握。增删源时同步映射与覆盖说明。验证：`bundle exec ruby scripts/test_cs112_report.rb` 与 `bundle exec ruby scripts/test_cs113_report.rb`。

### 项目注册与样式
* Topics prominence comes from [_projects/systems/topics/data/topics_primary.yml](_projects/systems/topics/data/topics_primary.yml), not a `topics:` document field. Both selection boxes filter `categories`: boxes checked in the same box are alternatives (Java or Python), and the two boxes narrow each other (Java and Algorithms). The Topic Filter's OR/AND buttons (`ocs__btn` with `aria-pressed`, OR by default, `?match=and`) switch its own boxes to all-required (Java and Spring); Categories boxes stay alternatives in both modes. Search shows highlighted title cards followed by body/description excerpt matches, with no duplicate title results and no filter escape. Render highlights with plain-text nodes and Lunr positions.
* [Topics](_projects/systems/topics/README.md) uses `categories` as independent reference filters, combined by the rule in the Topics prominence bullet, never weeks or `lesson_topic`/`lesson_language`. `/topics/` replaces the Search menu; `/search/` redirects. Its generated `/topics/view/` documents keep interactive content and original submission identity but suppress course rendering/chat. Do not change original course routes. Card and Lunr results share one filtered collection. Use `topics-browser.html course_context=true` for course-hosted cards with week labels/original links. Test: `bundle exec ruby scripts/test_topics.rb` and `node --test tests/topics.test.mjs`.
* CSSE game-directory posts appear at the bottom of the Capstone grid through `_includes/capstone-games.html`; this metadata can include lessons as well as games. `/cs-pathway/games/` redirects to `/capstone/?course=CSSE`, and the CS Pathway menu's CSSE link points there. Keep the legacy route working and preserve the Capstone year-filter fallback for cards without a year.
* 学院报告用 `supporting_lessons` 映射 Java 库 permalink，与归属 `lessons` 分离；保持 Java 源归属、articulation、周次不变，标记辅助参考并在导航加入 `/navigation/java-reference/`。判断缺口先审核现有 Java 内容。验证：`bundle exec ruby scripts/test_java_curriculum_references.rb`。

* Flask sources belong to [_projects/lessons/flask/](_projects/lessons/flask/) with flat `notebooks/` and `docs/`. Keep `categories: [flask]` for Topics and preserve map `/python/flask/csp/`. The API hub `/python/flask/api` links only Jokes (CSP Week 9), Users (Week 10), and Microblog (Week 11); then students read Flask source for further API learning. Teach VS Code REST Client with the backend's shared `baseUrl`, prompted authentication, and `.http` files, not Postman. Trace users (`api/user.py`, `model/user.py`), jokes (`hacks/joke.py`, file-backed `hacks/jokes.py`), and microblog (`api/microblog_api.py`, `model/microblog.py`); distinguish manual checks from automated tests. Detailed model/SQL teaching belongs in a separate series. Retired API material is reviewed in the non-published `API_MATERIAL_REVIEW.md`; do not recreate duplicate API tutorials. Non-API Flask references remain. Publish docs before splitting the multi-course map. Test: `bundle exec ruby scripts/test_flask_project.rb`.
* 新项目遵循 [_projects/REGISTRATION.md](_projects/REGISTRATION.md) 注册/构建约定；架构示例见 [_projects/ARCHITECTURE.md](_projects/ARCHITECTURE.md)。
* 样式优先使用 SCSS；主题切换与样式约定见 [README.md](README.md)。
* 主题预设（[assets/js/user-preferences.js](assets/js/user-preferences.js)）会用 `!important` 把所有 `span`、`div`、`p`、`li` 和标题改成主题文字色。按钮的图标和文字要直接写在 `ocs__btn` 里（像 [_layouts/post.html](_layouts/post.html) 的 Submit 按钮），不要包在 `<span>` 里，否则 `fill` 按钮上的文字会变成主题文字色，可能看不清。
* Profile（`/profile`）是系统套件 [_projects/systems/profile/](_projects/systems/profile/README.md)；改源文件，不改发布副本（`_layouts/profile.html`、`assets/js/profile/`、`navigation/authentication/profile.md`）。`layouts/profile.html` 只放标记（OCS 语法，无页面样式表）；其启动脚本用 `{{ site.baseurl }}` 导入共享函数（`assets/js/api/config.js`、`assets/js/api/profile.js`）并传给 `initProfilePage(api)`，所以各模块之间只用 `./` 路径导入，不要加 `../` 导入。`/profile/v2` 重定向到 `/profile`。见[其架构](_projects/systems/profile/docs/ARCHITECTURE.md)。表单的载入值必须在异步加载填好字段之后再记录：之前与仍为空的字段比较，使 Save 重发所有字段（包括 User ID）并弹出“will be logged out”提示。每个字段用共享的 `putUpdate`/`postUpdate`（结果为 true 或 false）保存到 Flask（`PUT /api/user`），`springEnabled`（`_config.yml` 的 `spring`）为 true 时也保存到 Spring（`POST /api/person/update`），并等待两者。仅 Flask 的站点（`spring: false`）在 Profile、注册、登录、登出和导航栏的私信提醒中都不调用 Spring；`config.js` 和 profile 页面设有 `regenerate: true`，所以增量构建也会应用对 `spring` 的修改。测试：`node --test tests/profile_model.test.mjs tests/test_gist_connection.mjs`。
* UI Builder（`/ui-builder/`）是系统套件 [_projects/systems/ui-builder/](_projects/systems/ui-builder/README.md)（注册为 `systems/ui-builder`，不带 `:dev`：文件很多，所以 `make dev` 不构建它，完整的 `make` 才构建），见[其架构](_projects/systems/ui-builder/docs/ARCHITECTURE.md)。编辑器顶栏的 Preview/Code 在预览与代码视图之间切换：代码视图（`editor-code.js`，排版在 `pretty-html.js`，只加换行与缩进）逐块显示页面文件的 HTML，用 Rouge 的 `.highlight` 类上色，并附注册表的 `code_note` 与 `text.code_classes` 说明；新块或框架要写 `code_note`，渲染器用到新的 `ocs__` 类要写它的说明（`tests/editor-code.test.mjs` 检查）。页面是由 section 和块组成的 JSON 文档，由 `render.js` 经 `vnode.js` 的标签与属性白名单渲染成 OCS 语法；作者写的文字永远是文字，富文本经 `rich-text.js` 清理后再检查链接，导出的页面文件把 `{` `}` 转义，Liquid 不会执行。注册表（块、字段、限制、模板与全部可见文字）在 `data/ui_builder.yml`，学校内容在 `data/ui_builder_school.yml`，编辑器文字在 `data/ui_builder_editor.yml`（`tests/editor-strings.test.mjs` 检查编辑器用到的每个键）；代码里不写可见文字。Spring（`mvc/uibuilder`）按键名校验文档：URL 只放在 `url`/`src`/`image`/`link` 键，富文本只放在 `body`，API 映射以 `_path` 结尾。`url-rules.js` 与 Spring 的 `urlIssue` 一样按原样读取地址，并像 JavaScript 那样去掉首尾空白；`rich-html.js`（供 `page-rules.js` 使用）读取富文本的方式与 Spring 相同（同样的标签规则与字符引用，属性值按 jsoup 的方式解码），它没有 HTML 解析器，所以把 Spring 的元素与属性检查用在它找到的每个标签上，因此可能拒绝 Spring 接受的残缺标记，但绝不会反过来；发布时与 Spring 一样拒绝 `url`/`src`/`image`/`link` 值和富文本 `href`/`src` 中指向学生本机的地址（`isLoopbackHost` 即 Spring 的同名列表，包括 `[::]` 与映射到 IPv6 的 `127.x`，主机按原样读取），草稿可以保留，画廊图片除外；API 块的 `list_path` 为 `""` 表示尚未选择（`listIn` 也用于已发布页面，只猜回复本身这个列表或其中由对象组成的列表），`"."` 表示整个回复，无可猜或为 `"."` 时单个对象即一项；Test connection 统计块将显示的项，Show code 读取相同的项（`""` 时其代码像块一样猜列表）并把每项画成卡片，Test 不会改写已选的列表；slug 遵循注册表的 `limits.slug_pattern`（即 Spring 的 `ui-builder.limits.slug-pattern`），`url-rules.js` 的 `slugMatches` 检查格式，`slugIssue` 还检查保留词。改规则、字段或限制时两边一起改（Spring 的 `UiBuilderSpecRules` 或 `ui-builder.limits.*`），并同步两边逐字节相同的 fixture（`tests/fixtures/specs/valid` 与 `invalid`，以及 Spring 的 `src/test/resources/ui-builder/`；`specs/client/` 只供 Pages 测试使用）。工具注意：Write/Edit 工具会把 `\uXXXX` 转义（包括 `\u003c`）写成字面字符，写完用 python 以 `chr(92)` 修正并 `node --check`。
* UI Builder 运行时：每个页面的启动脚本（`pages/*.md`）按 `config.js` 的 `springEnabled` 只选一次存储类（`SpringPageStore` 或 `LocalPageStore`）；之后编辑器只看 `store.capabilities`，不看 `springEnabled`，仅 Flask 的站点不向 Spring 发任何请求。`spring: false` 时页面存在浏览器，需要 Spring 的块在块菜单里关闭，访客反馈也在内（反馈按发布地址归档，而只有 Spring 能发布）。查看器（`/ui-builder/view/`）依次接受 `?page=<slug>`（已发布，须符合注册表的 slug 格式）、`?draft=<id>`（编辑者与教师）、`?local=<id>`（本浏览器）；它拒绝在框架里运行，仅 Flask 的站点只打开 `?local`。看板块要等点击“Show our board”才加载，能编辑该页面的人除外（GitHub 每个网络每小时只允许 60 次请求）。反馈读取 Flask 公开的 `GET /api/microblog/page/<key>`，话题路径为 `/ui-builder/view/?page=<slug>`，并用 `microblog.js` 的 `createPost` 发帖。画布是 `/ui-builder/canvas/` 的同源 iframe，用 nonce 握手；它不挂载实时块，其布局不能引入 `head-custom.html`（网站的快捷键、统计与脚本）。测试：`node --test _projects/systems/ui-builder/tests/*.test.mjs`、`bundle exec ruby scripts/test_ui_builder.rb` 与 `node --test tests/ui_builder.test.mjs`（它逐个导入测试文件，新测试文件也要加进去）。
* 看板与日历卡片可由页面自己的数据生成：`{% include ocs_kanban_board.html template=true %}` 与 `{% include ocs_calendar_card.html template=true %}` 只输出 `<template data-ocs-template=…>` 里的空卡片，页面级 JSON 由 `ocs_kanban_board_data.html` 与 `ocs_calendar_card_data.html` 各写一次。`assets/js/kanban-board.js` 导出 `createKanbanSection`、`mountKanbanBoard`、`mountAll`；`calendar-card.js`（源码在 Courses 的 `js/announcement-calendar/`）导出 `createCalendarCardSection`、`mountCalendarCard`、`mountAll`。生成的卡片带 `data-mounted="manual"`，只由 mount 函数挂载，`unmount()` 移除它加的监听。现有 include 调用的输出逐字节不变（`bundle exec ruby scripts/test_kanban_board.rb`、`scripts/test_calendar_card.rb`）。测试：`node --test tests/kanban_board.test.mjs tests/calendar_card.test.mjs`。
* Mermaid 图源里不要写 `var(--panel)` 或 `style` 色值：括号会被当成节点语法。颜色由 [_includes/mermaid.html](_includes/mermaid.html) 读取偏好变量，并由 [user-preferences.scss](_sass/open-coding/theme/user-preferences.scss) 的 `.mermaid` 规则在主题切换后保持同步。

### 后端边界

* 后端服务位于 [node_backend/README.md](node_backend/README.md)，与站点构建流程分离；改动前先阅读该文档。
* **评分生命周期：** 作业关闭前，教师和学生助教（作业创建者、指定评分者）在 Submissions 页面评分（全部提交表格、编辑弹窗、[creator-dashboard.js](assets/js/submissions/creator-dashboard.js) 的“Assignments You Created”）：保存的分数即人工覆盖，“AI re-grade”请 AI 重新评分，“Use AI grade”（`DELETE /api/submissions/grade/{id}`）移除覆盖。所有评分请求和结果文案都在 [grading.js](assets/js/submissions/grading.js)：Spring 返回类型化的 `outcome` 和 `grading` 状态（有效分、AI 分、人工分、`revision`、`closed`），页面按 outcome 显示文案；课程提交表单（Blogs `post.html`、Courses `course-document-player.html` 源文件）也使用其 `readGradingResponse`。务必发送屏幕上显示的 `revision`（否则 `STALE_REVISION`，409）。新内容即新版本：AI 重新评分，人工覆盖解除。教师在 Spring 的 tracker 中关闭作业后分数即为最终分（`grading.closed`，显示“Final”）：页面输入只读、隐藏编辑和评分操作；重新评分请求、相似性检查和申诉改由教师在 tracker 中审查。界面只用 OCS 语法（状态标签、`ocs__modal` 历史与 `ocs__tree` 时间线、`ocs__callout`、`ocs__links`），不用内联颜色。测试：`node --test tests/test_submission_grading.mjs tests/test_creator_dashboard.mjs`。

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

* **Messages（`/dm`）：** 群组与私信在同一页面，源码在 [_projects/systems/messages/](_projects/systems/messages/README.md)（注册为 `systems/messages:dev`）；旧的 `/student/groups/` 与 `/student/groups/dashboard/` 重定向到 `/dm`。页面用 OCS 语法加 `sass/` 里限定在 `.dm` 下的样式。`conversation-embed.js` 的 `mountGroupChat`/`mountConversation` 把一个对话嵌入任意页面的元素里，返回 `Promise<{state, destroy()}>`；每个嵌入有自己的 socket，`destroy()` 断开并移除所有监听（UI Builder 的聊天块用它）。模块之间只用 `./` 导入；页面用 `{{ site.baseurl }}` 导入 `config.js` 与 `rich-text.js` 并传给 `startMessagesPage`。纯函数在 `messages-model.js` 与 `formation-model.js`，测试：`node --test _projects/systems/messages/tests/*.test.mjs`。
* **协议：** SockJS + STOMP.js（cdnjs 加载）连接 Spring 的 `/ws-chat`（`config.js` 的 `javaWebSocketURI`，localhost 为 8589 端口）。Messages 页经 REST 发送（私信 `POST /api/dm/conversations/{id}/messages`，群组 `POST /api/groups/chat/{id}/messages` 带 `{message, image}`，发送者由 Spring 从登录会话取得），socket 只接收 `/topic/dm/{id}` 或 `/topic/group/{id}`。群组消息只保存发送者显示名，Spring 用它校验编辑和删除，所以发送时用账户名，也按名字识别自己的消息。课程聊天（announcement/week/lesson）仍经 STOMP `/app/groups.chat` 发送。
* **群组过滤：** `lessons`、`<course>-announcements`、`<course>-week-<n>` 是课程页聊天用的群组，不在 Find a group 中显示；班级群组（CSSE、CSP、CSA、CSH，即 Spring 的 `courses.class-groups`）由 Profile 课程同步、日历会读取，所以不提供 Leave 或 Delete，Find a group 也不提供 Join（提示去 Profile 添加课程）。其他群组只有管理员能删除：入口在 Members 对话框底部，输入群组名后才调用 `DELETE /api/groups/{id}`。Spring 不检查是否为管理员；删除群组会连带删除其成绩和以该群组提交的作业，但不删除 S3 中按群组名保存的聊天和文件。
* **代码重复警告：** 课程聊天在 [_projects/systems/courses/_includes/](_projects/systems/courses/_includes/) 的 `announcement_chat.html`、`week_chat.html`、`lesson_chat.html` 中各有一份，并仍硬编码 8589 端口（待改用 `javaWebSocketURI`）；修改协议时同步这些 include 与 Messages 的 `thread.js`。
* **课程聊天约定：** lesson 页面通过 frontmatter `chat: true` 启用，共享 backbone 群组 `"lessons"`，以 `[[lesson:<url>]]` 标记按页面隔离。

## 反模式

### 上帝函数

* 避免做太多事情的函数。坚持单一职责原则。

### 隐藏的副作用

* 通过保持明确且记录良好的副作用来确保可预测性。

### 过度设计

* **你需要它吗 (YAGNI)：** 除非现在需要，否则不要构建功能。避免推测性的泛化。
* 仅在保证正确性后才进行优化（优化前进行性能分析）。
