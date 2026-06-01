---
layout: post
title: "CS 113 Final Project — CS Pathway"
date: 2026-06-01 10:00:00 -0700
author: Ahaan
categories: [cs113, final-project, games]
---

## Final Reflection

Throughout this project, I moved beyond small isolated features and built a connected learning system. Instead of treating each level as a separate assignment, I had to think like both a programmer and an engineer: planning features, organizing task flow, debugging issues, documenting design decisions, and keeping the game understandable for future students and contributors.

One of the clearest examples of this growth is how the game connects level progression, shared presentation logic, and persistence. The task catalog in `pathwayTaskCatalog.js`, the shared UI behavior in `Present.js`, and the level code in files like `GameLevelCsPath1CodeHub.js` and `GameLevelCsPath2Mission.js` all work together to create one coherent experience instead of disconnected screens. That forced me to think carefully about structure, reuse, and how players move through the game.

Another important part of the project was persistence and state. The profile and backend sync work in `persistentProfile.js` pushed me to handle user data more carefully, while the analytics and mission logic showed how collections, maps, sets, sorting, and other CS 113 concepts can support real gameplay. Those choices matter because they make the project feel like a system rather than just a demo.

This project also made me think more about ethics, accessibility, and project impact. CS Pathway is meant to lower the barrier to computer science by helping students build confidence early, so the design has to be readable, usable, and welcoming. I still see room to improve keyboard accessibility, help text, and feedback for players, but the current version already reflects the idea that good software is not only functional — it should also be clear, inclusive, and useful to the people who use it.

Key Terms & Code Evidence
-------------------------

<table>
  <thead>
    <tr>
      <th>Term</th>
      <th>Short Definition</th>
      <th>Example in cs-pathway-game (file)</th>
      <th>Notes / evidence</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Collections / Lists</td>
      <td>Ordered groups of related values.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/data/pathwayTaskCatalog.js">pathwayTaskCatalog.js</a></td>
      <td>The task catalog is an array of milestone objects — concrete list/collection usage.</td>
    </tr>
    <tr>
      <td>Stacks / Queues</td>
      <td>LIFO or FIFO structures for ordered processing.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/levels/GameLevelCsPath3Analytics.js">GameLevelCsPath3Analytics.js</a></td>
      <td>Uses array-based <code>queue</code> and line processing for analytics rendering.</td>
    </tr>
    <tr>
      <td>Trees</td>
      <td>Hierarchical structures with parent-child relationships.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/data/pathwayTaskCatalog.js">pathwayTaskCatalog.js</a></td>
      <td><code>PATHWAY_COURSE_TASKS</code> shows nested course→tasks mapping, analogous to tree structures.</td>
    </tr>
    <tr>
      <td>Sets</td>
      <td>Unique collections used for membership checks.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/levels/GameLevelCsPath2Mission.js">GameLevelCsPath2Mission.js</a></td>
      <td><code>new Set()</code> is used to track station states and completed tasks.</td>
    </tr>
    <tr>
      <td>Dictionaries / Maps</td>
      <td>Key-value lookups for fast access.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/levels/GameLevelCsPath3Analytics.js">GameLevelCsPath3Analytics.js</a></td>
      <td>Uses <code>new Map()</code> for day buckets and lookup tables in analytics.</td>
    </tr>
    <tr>
      <td>Graphs</td>
      <td>Nodes and edges representing relationships.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/docs/CS-PATHWAY.md">CS-PATHWAY.md</a></td>
      <td>Graph algorithms are a course objective; not directly implemented in the game yet.</td>
    </tr>
    <tr>
      <td>Searching</td>
      <td>Finding a value or record in a dataset.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/services/PathwayTimelineBuilder.js">PathwayTimelineBuilder.js</a></td>
      <td>Traverses task collections and uses <code>.map</code>/<code>.filter</code> patterns to assemble timelines.</td>
    </tr>
    <tr>
      <td>Sorting</td>
      <td>Ordering data by a rule or comparator.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/levels/PersonaTrial.js">PersonaTrial.js</a></td>
      <td><code>.sort()</code> used to rank and select primary persona results.</td>
    </tr>
    <tr>
      <td>Hashing</td>
      <td>Transforming data for security or quick comparison.</td>
      <td>Backend / security (not in frontend)</td>
      <td>Hashing is a backend concern; document in blog if implemented server-side.</td>
    </tr>
    <tr>
      <td>Algorithm Analysis</td>
      <td>Describing efficiency with Big-O or resource costs.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/levels/GameLevelCsPath3Analytics.js">GameLevelCsPath3Analytics.js</a></td>
      <td>Aggregation and bucketing code are good places to document Big-O analysis.</td>
    </tr>
    <tr>
      <td>Abstraction / Encapsulation</td>
      <td>Hiding details behind a clean interface.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/model/ProfileManager.js">ProfileManager.js</a></td>
      <td>Encapsulates profile operations behind a clear API.</td>
    </tr>
    <tr>
      <td>Inheritance / Polymorphism</td>
      <td>Specialized classes sharing a common base behavior.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/levels/GameLevelCsPath1CodeHub.js">GameLevelCsPath1CodeHub.js</a></td>
      <td>Level classes extend a shared base and override behavior per level.</td>
    </tr>
    <tr>
      <td>Design Patterns</td>
      <td>Reusable solutions like MVC or Factory.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/docs/CS-PATHWAY.md">CS-PATHWAY.md</a></td>
      <td>Docs describe MVC-like separation; models/services reflect those patterns.</td>
    </tr>
    <tr>
      <td>Version Control</td>
      <td>Tracking changes with Git and pull requests.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages">Repository / commits</a></td>
      <td>Link PRs and commits in your blog to show Git practices.</td>
    </tr>
    <tr>
      <td>Testing</td>
      <td>Checking that code behaves as intended.</td>
      <td>(not present)</td>
      <td>Add JUnit/JS tests and coverage reports to satisfy CS 113 testing evidence.</td>
    </tr>
    <tr>
      <td>Build Tools</td>
      <td>Tools that build or automate the project.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/Makefile">Makefile</a></td>
      <td><code>make</code> targets handle build and conversion steps used by the project.</td>
    </tr>
    <tr>
      <td>Debugging</td>
      <td>Finding and fixing defects using logs or tools.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/model/persistentProfile.js">persistentProfile.js</a></td>
      <td>Console logs and warnings illustrate debug messaging for network/auth fallbacks.</td>
    </tr>
    <tr>
      <td>API Development</td>
      <td>Designing endpoints for programmatic access.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/model/persistentProfile.js">persistentProfile.js</a></td>
      <td>Shows fetch calls and backend sync patterns for persistence.</td>
    </tr>
    <tr>
      <td>Database Integration</td>
      <td>Saving and querying structured data.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/docs/CS-PATHWAY.md">CS-PATHWAY.md</a></td>
      <td>LocalStorage-first persistence with optional backend sync; full DB integration is backend scope.</td>
    </tr>
    <tr>
      <td>Docker</td>
      <td>Packaging software in containers.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/node_backend/Dockerfile">node_backend/Dockerfile</a></td>
      <td>Dockerfile exists for backend service image.</td>
    </tr>
    <tr>
      <td>DNS Configuration</td>
      <td>Connecting a domain name to a host.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/CNAME">CNAME</a></td>
      <td>Project root includes a CNAME for custom domain setup.</td>
    </tr>
    <tr>
      <td>nginx</td>
      <td>Reverse proxy for serving sites or APIs.</td>
      <td>(not included)</td>
      <td>Add nginx config when wiring a reverse proxy for production deployment.</td>
    </tr>
    <tr>
      <td>CI/CD</td>
      <td>Automated build and deployment pipelines.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/.github/workflows/jekyll-gh-pages.yml">.github/workflows/jekyll-gh-pages.yml</a></td>
      <td>GitHub Actions workflow automates build and deployment of the site.</td>
    </tr>
    <tr>
      <td>Code Comments</td>
      <td>Inline explanations that document intent.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/levels/Present.js">Present.js</a></td>
      <td>Code includes inline comments that explain intent and usage.</td>
    </tr>
    <tr>
      <td>API Documentation</td>
      <td>Written reference for endpoints and payloads.</td>
      <td>(not included)</td>
      <td>Add OpenAPI/Postman collections for backend endpoints to satisfy CS 113 documentation evidence.</td>
    </tr>
    <tr>
      <td>Help System</td>
      <td>Built-in guidance for users and contributors.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/docs/CS-PATHWAY.md">CS-PATHWAY.md</a></td>
      <td>Design docs and help guidance exist; expand to an in-app searchable help view to meet the deliverable.</td>
    </tr>
    <tr>
      <td>Blog Portfolio</td>
      <td>Published writing that shows process and evidence.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/tree/main/_posts">_posts/</a></td>
      <td>Use this post and linked artifacts to build your CS 113 blog portfolio.</td>
    </tr>
    <tr>
      <td>Project Impact / Ethical Considerations</td>
      <td>Why the project matters and how it handles people responsibly.</td>
      <td><a href="https://github.com/Open-Coding-Society/pages/blob/main/_projects/games/cs-pathway/docs/CS-PATHWAY.md">CS-PATHWAY.md</a></td>
      <td>Docs discuss identity-first design, privacy, and pedagogy — include these reflections in your final write-up.</td>
    </tr>
  </tbody>
</table>