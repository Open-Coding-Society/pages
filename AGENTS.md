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
* **使用 `_projects`：** 利用 `_projects/` 目录中的模块化项目自动注册系统来创建新项目。
* **系统扩展：** 在现有系统内工作并在需要时进行扩展，而不是创建全新的并行架构。
* **日历页面约定：** `navigation/calendar.md` 里的布局和弹层样式要放到 SCSS 中，用语义化 class 代替 utility 风格的内联类。
* **跨域 API：** 供 `pages.opencodingsociety.com` 调用的 Spring API 端点要显式允许带凭据的跨域请求。
* **文档：** 必要时为困难或复杂的实现创建详细文档。
* **注释：** 为非平凡的逻辑添加注释，但要保持简短，重点关注“为什么”而不是“是什么”。
* **提问：** 如果系统级约束、需求或模式不清楚，请在继续之前暂停并向用户提问。

### 项目工作流

* 以 [Makefile](Makefile) 为唯一指令来源；常用目标 `make`/`make serve-current`、`make dev`、`make stop`、`make convert`、`make convert-single`（细节见 [README.md](README.md)）。
* 顺序很关键：stop → build projects → convert notebooks/docx → split courses → jekyll serve（以 [Makefile](Makefile) 为准）。
* 项目构建后必须运行 [SASS 导入生成器](scripts/generate_sass_imports.py)，以创建 `_sass/projects/_all.scss`；`build-registered-projects` 负责此依赖，避免 Jekyll 的 `projects/all` 导入失败。

### 源文件与生成文件

* 源文件在 [notebook sources](_notebooks/) 与 [docx sources](_docx/)；转换后的 Markdown 输出到 [generated posts](_posts/)（生成物，不要手工改）。
* 多课程拆分文件（`*_csp.md`/`*_csa.md`/`*_csse.md`/`*_content.md`）为生成物，禁止手改；规则见 [scripts/split_multi_course_files.py](scripts/split_multi_course_files.py)。
* Notebook/DOCX 转换规则见 [scripts/convert_notebooks.py](scripts/convert_notebooks.py) 与 [scripts/convert_docx.py](scripts/convert_docx.py)。

### 项目注册与样式

* 新项目遵循 [_projects/REGISTRATION.md](_projects/REGISTRATION.md) 注册/构建约定；架构示例见 [_projects/ARCHITECTURE.md](_projects/ARCHITECTURE.md)。
* 样式优先使用 SCSS；主题切换与样式约定见 [README.md](README.md)。

### 后端边界

* 后端服务位于 [node_backend/README.md](node_backend/README.md)，与站点构建流程分离；改动前先阅读该文档。

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

## 群组与实时聊天（Groups & realtime chat）

* **架构：** 群聊客户端使用 SockJS + STOMP.js（CDN 加载），连接 Spring 后端（Pirna-spring）的 `/ws-chat` 端点。发送到 `/app/groups.chat`，订阅 `/topic/group/${groupId}`；事件含 message/joinGroup/typing/heartbeat(25s)/文件图片，用 JSON event-key 集合去重并自动重连。
* **端点分支：** localhost 直连 `${protocol}//${host}:8589/ws-chat`，生产环境走 `javaURI + '/ws-chat'`（nginx 转发 8589）。注意：`groups.js` 与 `lesson_chat.html` 中 8589 端口是硬编码的（代码注释标记为待迁移到 config.js）；`assets/js/api/config.js` 已导出 `javaWebSocketURI` 但聊天代码尚未使用。
* **代码重复警告：** 聊天逻辑存在于多处——规范源是 [assets/js/projects/student-management-groups/groups.js](assets/js/projects/student-management-groups/groups.js)（"CHAT FUNCTIONALITY" 段），但 [_includes/group_dashboard.html](_includes/group_dashboard.html) 与 [_includes/lesson_chat.html](_includes/lesson_chat.html) 内嵌了副本；修改后必须手动同步这些 include，否则行为不一致。
* **课程聊天约定：** lesson 页面通过 frontmatter `chat: true` 启用，共享 backbone 群组 `"lessons"`，以 `[[lesson:<url>]]` 标记按页面隔离。

## 导师（Mentor）功能与 Capstone 页

* **角色来源：** `ROLE_MENTOR` 定义在 Spring 端（外部仓库 `Open-Coding-Society/spring`），不在本仓库；Flask 侧的角色是单一字符串列（无 `ROLE_MENTOR`）。前端一律通过 `GET {javaURI}/api/person/get` 检查 `roles.some(r => r.name === 'ROLE_MENTOR')`（同 `_includes/nav/homejava.html` 的 `getCredentialsJava()` 模式），不要在 Flask 侧另建一套角色判断。
* **Student/Mentor 视图是推导出来的，不是选出来的：** 登录页曾经有一个 Student/Mentor 开关（`ocsLoginRole` 存 `localStorage`），因与注册表单自身的角色选择器重复，已移除。判断视图一律用 `assets/js/api/role-view.js` 的 `viewFor(roles)`——就是 `roles.includes('ROLE_MENTOR')`，因为 Spring 的真实角色是唯一权威来源。导师侧边栏 = 学生侧边栏去掉 `bathroom_pass`（`_includes/aesthetihawk/sidebar-list.html` 的 `exclude` 参数）再加上 `_data/aesthetihawk_sidebar_mentor.yml`；Bathroom Pass 相关 UI（侧边栏、工具包按钮、个人资料的人脸注册）在导师视图中必须保持隐藏。侧边栏选择仍缓存在 `localStorage`（`ocsMentorSidebar`，登出时由 `clearMentorSidebarCache()` 清除），纯粹是为了避免异步角色检查完成前闪现错误的侧边栏——这是渲染层面的优化，不是第二个真相来源。
* **导师审核后端在 `~/spring-admin`（CSA-Admin-OCS/spring），不是 `~/spring`：** 导师注册 `POST /api/person/create` 带 `accountType: "mentor"` 与必填 `businessEmail` → `ROLE_PENDING` + `MentorTicket`；管理员在 `/mvc/person/read` 的 “Mentor Approval Requests” 批准 → `ROLE_MENTOR`。登录时 `ROLE_PENDING` 且 `GET /api/person/mentor/ticket/status` 为 pending → `/login` 显示 “Verification Pending” 并登出 Spring。真正的访问控制在 Spring `SecurityConfig`（`ROLE_PENDING` 只能访问 `/api/person/get`、工单状态和登出）。`/login` 顶部的 Student/Mentor 选择器（`data-account-role` 的两个 `ocs__btn pill`，选中者加 `accent fill`；样式在 `_sass/open-coding/elements/forms/login-role.scss`，基于 OCS `info-panel` mixin 与主题变量，页面无内联样式。注意主题对所有 `<p>` 强制 `color: ... !important`，需要自定义颜色的文字用 `<div>`；全局 `.error { padding: 20px }` 会泄漏到 `.validation-message.error`）只切换注册表单：导师不填学号/学校、不走 Google 步骤，直接由 `signupMentor()` 注册到 Spring（Flask 无导师账号）；学生流程不变；导航栏登录状态（`assets/js/api/login.js`）先查 Flask `/api/id`，失败再查 Spring `/api/person/get`，所以只存在于 Spring 的导师也会显示姓名；导师横幅（`status-indicators/mentor-badge.scss`）位于页面正常流中、紧贴 header 之下；只存在于 Flask 的学生账号（Spring 无记录）登录时 Flask 成功即可进入 `/profile`。
* **导师申请项目需审批后才有权限：** 在 `/capstone` 点 Apply 只创建待审批的 `CapstoneApplication`（按钮显示 Pending approval / Approved ✓ / Not approved，状态来自 `GET /api/capstones/mine` 与 `/applications/mine`）。管理员在 Spring `/mvc/capstone/read` 批准后，导师才被加入项目（卡片上的 Approved ✓ 与 Chat），并且——若管理员在同页 “Student Group” 列为项目关联了学生群组（`PUT /api/capstones/{id}/group`）——同时成为该群组的 mentor，从而能在 capstone 卡片上的 Chat 给学生发消息。移除导师或取消关联会一并收回群组权限（`CapstoneGroupLinkService`）。
* **导师的项目聊天（仪表盘 Messages 标签 + capstone 卡片 Chat）：** 共用 `assets/js/chat/groupChatPanel.js`，外观与课程公告/每周聊天相同（同样的 `.announcement-chat` 标记，样式在 `forms/course-chat.scss`，是从 lessons 分支 courses Sass 原样复制的——合并 lessons 后删除该文件；富文本编辑器 `assets/js/chat/rich-text.js` 也从 lessons 复制）。仪表盘 Messages 标签（`assets/js/aesthetihawk/dashboard/mentorCapstoneChat.js`）只在导师视图且至少有一个已批准项目（`GET /api/capstones/mine`）时显示，每个项目对应其关联学生群组的聊天；未关联群组时显示提示。卡片上的 “Mentors (n)”/“💬 Chat” 在 `assets/js/capstone/cardTools.js`。发送走 REST `POST /api/groups/chat/{id}/messages`（后端检查成员或 mentor），实时接收走 SockJS/STOMP `/topic/group/{id}`；注意 STOMP `/app/groups.chat` 本身不做成员检查（每周聊天依赖此行为）。群聊消息存 S3，本地无 AWS 配置时只实时投递不保存。
* **导师账号可切换到学生视图：** 导师横幅（`_layouts/aesthetihawk.html`）和导航栏姓名下拉菜单（`assets/js/api/login.js`）都有 “Switch to student view / Switch to mentor view” 按钮，调用 `role-view.js` 的 `switchView(roles)`，把选择存到 `localStorage`（`ocsViewAs`）并刷新页面。`viewFor(roles)` = 有 `ROLE_MENTOR` 且未选学生视图才是 mentor。学生视图下：普通学生侧边栏、无 capstone 的 Apply/Skip/Interested、无 My Projects/导师 Messages。仅影响显示，权限仍由 Spring 决定；登录和登出时 `clearRoleViewCache()` 会重置为账号本身的视图。
* **导师的 Apply/Skip/Interested 操作内联在 `navigation/capstone.md` 中：** 每张项目卡片底部常驻的操作行（Apply Now / Interested / Skip，受实时 `ROLE_MENTOR` 检查门控；按钮为 `ocs__btn`，布局与状态样式在 `_sass/open-coding/elements/grids/capstone-cards.scss`，含所有访客可见的卡片 “Links” 菜单）是该文件顶部的一段内联 `<script type="module">`，并非独立的 `assets/js/*.js` 文件。项目身份用其归一化页面 URL（`cardUrl()`）标识，与 `capstone/projects.json`（由 `scripts/sync_capstones.py` 同步到 Spring 后端的机器可读项目列表）匹配，解析出 `POST {javaURI}/api/capstones/{id}/apply` 所需的数字 id。Interested/Skip 没有后端接口——仅通过浏览器 `localStorage`（`ocsMentorInterested` / `ocsMentorSkipped`）记录。
* **Capstone 页的"新建/编辑 capstone"流程尚无真实后端持久化：** `assets/js/new-capstone.js` 与 `navigation/capstone.md` 内联的"新建/编辑 capstone"仅写入 `sessionStorage`，并非真实后端。新增任何"保存到账号"的功能前，先确认 Spring 端点是否存在；若不存在，参照上面导师操作的模式——本地 `localStorage` 缓存 + 尝试远程同步 + 失败时 `console.error`/`console.warn` 记录上下文（不要静默吞掉），并写清所需的端点契约。
* **评论/微博客复用：** 需要"按某个实体加评论"的功能，优先复用现有 `assets/js/api/microblog.js`（Flask `/api/microblog`），通过自定义 `topicPath`（如 `capstone:<slug>`）隔离范围，而不是新建评论后端；若要复用完整侧边面板 UI，注意 `_includes/microblog_foundation.html` 被多个页面共享，谨慎直接改动，优先新建轻量组件调用同一套 API。

## 反模式

### 上帝函数

* 避免做太多事情的函数。坚持单一职责原则。

### 隐藏的副作用

* 通过保持明确且记录良好的副作用来确保可预测性。

### 过度设计

* **你需要它吗 (YAGNI)：** 除非现在需要，否则不要构建功能。避免推测性的泛化。
* 仅在保证正确性后才进行优化（优化前进行性能分析）。
