---
toc: true
layout: post
data: flask
title: Flask Anatomy
description: Navigate the OCS Flask starter, from application setup and API routes to models, templates, and API testing.
courses:
  csp:
    week: 9
permalink: "/flask/anatomy"
author: Anusha Khobare, Isabel Marilla
breadcrumb: true
lesson_group: Flask
---

<!-- markdownlint-disable MD033 -->

<p class="ocs__description">The Open Coding Society Flask starter is the backend beside your Pages frontend. The tree below shows selected files in that repository, not every feature. Follow a filename to its explanation.</p>

<nav aria-label="Flask repository structure">
  <div class="ocs__tree-item"><strong>flask/</strong></div>
  <div class="ocs__tree">
    <div class="ocs__tree-item"><a href="#init-py" data-flask-path="__init__.py"><code>__init__.py</code></a> - shared application and configuration</div>
    <div class="ocs__tree-item"><a href="#main-py" data-flask-path="main.py"><code>main.py</code></a> - routes, blueprints, and server startup</div>
    <div class="ocs__tree-item"><a href="#demo-app" data-flask-path="app.py"><code>app.py</code></a> - separate introductory demo</div>
    <div class="ocs__tree-item"><a href="#api-folder" data-flask-path="api"><code>api/</code></a></div>
    <div class="ocs__tree">
      <div class="ocs__tree-item"><a href="#users-py" data-flask-path="api/user.py"><code>user.py</code></a> - user API endpoints</div>
      <div class="ocs__tree-item"><code data-flask-path="api/section.py">section.py</code> - section API endpoints</div>
      <div class="ocs__tree-item"><a href="#microblog-api" data-flask-path="api/microblog_api.py"><code>microblog_api.py</code></a> - authenticated microblog requests</div>
      <div class="ocs__tree-item"><a href="#api-testing" data-flask-path="api/user_auth.http"><code>user_auth.http</code></a> - authentication requests</div>
      <div class="ocs__tree-item"><a href="#api-testing" data-flask-path="api/user_crud.http"><code>user_crud.http</code></a> - manual CRUD checks</div>
    </div>
    <div class="ocs__tree-item"><a href="#models-folder" data-flask-path="model"><code>model/</code></a></div>
    <div class="ocs__tree">
      <div class="ocs__tree-item"><a href="#user-py" data-flask-path="model/user.py"><code>user.py</code></a> - users and related persistence</div>
      <div class="ocs__tree-item"><code data-flask-path="model/post.py">post.py</code> - post persistence</div>
      <div class="ocs__tree-item"><a href="#microblog-api" data-flask-path="model/microblog.py"><code>microblog.py</code></a> - microblog persistence</div>
    </div>
    <div class="ocs__tree-item"><a href="#jokes-api" data-flask-path="hacks"><code>hacks/</code></a></div>
    <div class="ocs__tree">
      <div class="ocs__tree-item"><a href="#jokes-api" data-flask-path="hacks/joke.py"><code>joke.py</code></a> - jokes API blueprint</div>
      <div class="ocs__tree-item"><a href="#jokes-api" data-flask-path="hacks/jokes.py"><code>jokes.py</code></a> - file-backed jokes data</div>
    </div>
    <div class="ocs__tree-item"><code>scripts/</code></div>
    <div class="ocs__tree">
      <div class="ocs__tree-item"><a href="#db-init-py" data-flask-path="scripts/db_init.py"><code>db_init.py</code></a> - database reset and seed workflow</div>
    </div>
    <div class="ocs__tree-item"><a href="#dashboard-html" data-flask-path="templates"><code>templates/</code></a></div>
    <div class="ocs__tree">
      <div class="ocs__tree-item"><code data-flask-path="templates/index.html">index.html</code></div>
      <div class="ocs__tree-item"><code data-flask-path="templates/login.html">login.html</code></div>
      <div class="ocs__tree-item"><code data-flask-path="templates/u2table.html">u2table.html</code></div>
    </div>
    <div class="ocs__tree-item"><a href="#styles-css" data-flask-path="static"><code>static/</code></a> - assets and JavaScript served by Flask</div>
    <div class="ocs__tree-item"><a href="#instance-folder" data-flask-path="instance"><code>instance/</code></a> - runtime data, uploads, and local databases</div>
    <div class="ocs__tree-item"><a href="#requirements-txt" data-flask-path="requirements.txt"><code>requirements.txt</code></a> - Python dependencies</div>
    <div class="ocs__tree-item"><a href="#deployment" data-flask-path="Dockerfile"><code>Dockerfile</code></a> - production container</div>
  </div>
</nav>

<section id="init-py">
  <h2 class="ocs__section-title">Application Setup: __init__.py</h2>
  <p class="ocs__text">This module creates the shared Flask application and configures extensions including SQLAlchemy, Flask-Login, CORS, and Flask-Migrate. It reads environment settings, including values loaded from your local <code>.env</code>. Keep secrets out of version control.</p>
  <p class="ocs__text">This starter uses a shared application object, not a <code>create_app()</code> factory. Its setup includes:</p>
  <pre><code>app = Flask(__name__)
db = SQLAlchemy(app)</code></pre>
  <p class="ocs__text">The development server's default <code>FLASK_PORT</code> is <code>8587</code>; an environment setting can override it. CORS settings determine which frontend origins may make browser requests with credentials.</p>
</section>

<section id="main-py">
  <h2 class="ocs__section-title">Application Assembly: main.py</h2>
  <p class="ocs__text">The main module imports the shared objects, imports API blueprints and model classes, registers the blueprints, and defines server-rendered routes. These are excerpts from that assembly, not replacement files:</p>
  <pre><code>from __init__ import app, db, login_manager
from api.user import user_api

app.register_blueprint(user_api)</code></pre>
  <p class="ocs__text">For local development, activate the Flask repository's virtual environment and run the main module from that repository's root:</p>
  <pre><code>source venv/bin/activate
python main.py</code></pre>
  <p class="ocs__text">Its development entry point uses the configured port, debug mode, and <code>use_reloader=False</code>. The Pages frontend runs separately; this command does not start Jekyll.</p>
</section>

<section id="demo-app">
  <h2 class="ocs__section-title">Separate Demo: app.py</h2>
  <p class="ocs__text">The root <code>app.py</code> creates a different Flask application for an introductory example. It keeps an in-memory <code>InfoModel</code>, exposes <code>/api/data</code>, and defaults to port <code>5001</code> when run directly. It is not the full starter's entry point and does not replace the database-backed application assembled by <code>main.py</code>.</p>
</section>

<section id="api-folder">
  <h2 class="ocs__section-title">HTTP Interfaces: api/</h2>
  <p class="ocs__text">API modules define blueprints and resource handlers. A handler reads a request, validates inputs and permissions, calls the model or other supporting logic, and returns an HTTP response. A module must be registered with the shared application before its routes are available.</p>
  <p class="ocs__text">Examples in this repository include <code>user.py</code>, <code>section.py</code>, <code>post.py</code>, and <code>microblog_api.py</code>. A filename is not itself a route: combine the blueprint's prefix with its registered resource path.</p>
</section>

<section id="users-py">
  <h2 class="ocs__section-title">User Endpoints: api/user.py</h2>
  <p class="ocs__text">The user blueprint has the prefix <code>/api</code>. Flask-RESTful resources add paths such as <code>/authenticate</code>, <code>/id</code>, and <code>/user</code>.</p>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th scope="col">Request</th><th scope="col">Purpose</th></tr></thead>
      <tbody>
        <tr><td><code>POST /api/authenticate</code></td><td>Authenticate and issue the authentication cookie.</td></tr>
        <tr><td><code>GET /api/id</code></td><td>Read the currently authenticated user's identity.</td></tr>
        <tr><td><code>/api/user</code></td><td>User CRUD resource; input fields and permissions depend on the HTTP method.</td></tr>
      </tbody>
    </table>
  </div>
  <p class="ocs__text">The <code>/login</code> route in the main module serves the backend's HTML login flow. Do not confuse it with the JSON API's <code>/api/authenticate</code> endpoint.</p>
</section>

<section id="models-folder">
  <h2 class="ocs__section-title">Persistence: model/</h2>
  <p class="ocs__text">The directory is named <code>model</code>, singular. Its modules define database-backed entities and operations. They use the shared <code>db</code> object rather than creating a separate database connection for every API request.</p>
  <p class="ocs__text">Keep HTTP request handling in API modules and persistence responsibilities in model modules. The same model can support both JSON APIs and server-rendered administration pages.</p>
</section>

<section id="jokes-api">
  <h2 class="ocs__section-title">Jokes: HTTP Handler and File-Backed Data</h2>
  <p class="ocs__text">The blueprint in <code>hacks/joke.py</code> uses the prefix <code>/api/jokes</code>. It calls functions in <code>hacks/jokes.py</code>, which store JSON under the configured data folder. Start with read-only <code>GET /api/jokes/count</code> and <code>GET /api/jokes</code> requests in REST Client, then trace the calls to <code>countJokes()</code> and <code>getJokes()</code>.</p>
  <p class="ocs__text">This is a data layer without SQLAlchemy. Like and jeer requests change stored votes; the create handler is unfinished. Do not assume every registered operation has a complete implementation.</p>
</section>

<section id="microblog-api">
  <h2 class="ocs__section-title">Microblog: Authenticated API and Models</h2>
  <p class="ocs__text">The blueprint in <code>api/microblog_api.py</code> uses <code>/api</code> and registers the <code>/microblog</code> resource. Its CRUD handlers use <code>token_required()</code> and the <code>MicroBlog</code> and <code>Topic</code> classes from <code>model/microblog.py</code>.</p>
  <p class="ocs__text">After authenticating with the existing REST Client request, send <code>GET /api/microblog?limit=5</code>. Inspect the <code>microblogs</code> array and <code>count</code> field. Compare read filtering with the create handler's required <code>content</code>, 280-character limit, and optional <code>topicId</code>, <code>topicPath</code>, and <code>data</code>. Updates and deletes also check ownership or Admin permissions.</p>
</section>

<section id="user-py">
  <h2 class="ocs__section-title">User Persistence: model/user.py</h2>
  <p class="ocs__text">This module defines the user model and related persistence used by the starter. The API imports <code>User</code> from <code>model.user</code>. Read the actual model before choosing JSON field names or assuming a database column is called <code>username</code>.</p>
</section>

<section id="db-init-py">
  <h2 class="ocs__section-title">Database Reset: scripts/db_init.py</h2>
  <div class="ocs__callout" role="note">
    <p class="ocs__text"><strong>Destructive operation:</strong> this script can back up, drop and recreate database tables, then seed data. It is not just a harmless <code>db.create_all()</code> helper. Do not run it against a database you need to preserve without checking the selected database, backup, and restore plan.</p>
  </div>
  <p class="ocs__text">The script imports the assembled application's <code>app</code>, <code>db</code>, and <code>generate_data</code> from <code>main</code>. It performs schema operations inside an application context. Inspect its prompts and backup requirements with your teacher before resetting a development database.</p>
</section>


<section id="dashboard-html">
  <h2 class="ocs__section-title">Backend Views: templates/</h2>
  <p class="ocs__text">Flask uses Jinja templates for server-rendered pages such as <code>index.html</code>, <code>login.html</code>, and <code>u2table.html</code>. For example, the main module's user-table route queries users and passes them to <code>render_template("u2table.html", user_data=users)</code>.</p>
  <p class="ocs__text">These backend views are separate from the Pages site's Jekyll/Liquid templates. JSON API routes serve data to the Pages frontend; Jinja routes render HTML on the Flask server.</p>
</section>

<section id="styles-css">
  <h2 class="ocs__section-title">Backend Assets: static/</h2>
  <p class="ocs__text">The current repository has <code>static/assets/</code> and <code>static/js/</code>. Templates can reference these Flask-served assets. There is no root <code>static/styles.css</code> in this starter; check the actual asset directories before adding a stylesheet reference.</p>
</section>

<section id="instance-folder">
  <h2 class="ocs__section-title">Runtime Data: instance/</h2>
  <p class="ocs__text">Local SQLite data is stored under <code>instance/volumes/</code>, including <code>user_management.db</code>. Application configuration also creates upload and data directories under the instance folder. The database configuration can select MySQL when the required database environment settings are supplied. Treat runtime data and backups differently from source files.</p>
</section>

<section id="api-testing">
  <h2 class="ocs__section-title">API Checks: .http Request Files</h2>
  <p class="ocs__text">Open <code>api/user_auth.http</code> and <code>api/user_crud.http</code> in VS Code with the REST Client extension. The repository's <code>.vscode/settings.json</code> defines shared and environment-specific <code>baseUrl</code> values. Select the local environment before testing; keep credentials out of committed settings.</p>
  <p class="ocs__text">Authenticate separately, then send CRUD requests one at a time using disposable development records. These files are manual checks, not an automated test suite. Updating or deleting other users requires the appropriate permissions, and requests sent to the deployed environment can change real data.</p>
  <p class="ocs__text">Use REST Client to compare the user, jokes, and microblog interfaces. Check method, URL, status, response fields, and expected failures before connecting the frontend. Browser-only CORS behavior still needs a browser integration check.</p>
  <p class="ocs__text">Follow the <a href="{{ site.baseurl }}/python/flask/api">Flask API learning path</a>: Jokes, Users, and Microblog. Each lesson traces requests into the corresponding data/model calls; detailed model and SQL work belongs in a separate series.</p>
</section>

<section id="requirements-txt">
  <h2 class="ocs__section-title">Dependencies: requirements.txt</h2>
  <p class="ocs__text">Install the backend's Python dependencies into its own virtual environment from the Flask repository root:</p>
  <pre><code>source venv/bin/activate
pip install -r requirements.txt</code></pre>
</section>

<section id="deployment">
  <h2 class="ocs__section-title">Deployment: Dockerfile</h2>
  <p class="ocs__text">The container starts Gunicorn with <code>main:app</code>, importing the assembled application. This differs from running Flask's debug development server. The repository also contains <code>docker-compose.yml</code> and Nginx configuration; review those deployment settings separately from the local startup workflow.</p>
</section>

### Key Components

1. **Frontend (Dining Area)**:
   - **Customers (Users)**: Interact with the menu, place orders, and receive food.
   - **Menu (User Interface)**: Displays the options available to customers (e.g., list of users, forms to add new users).
   - **Order Form (Forms and Buttons)**: Allows customers to place orders (e.g., submit data).

2. **Backend API (Waiter)**:
   - **Takes Orders (HTTP Requests)**: Receives requests from customers (frontend) and delivers them to the kitchen (backend).
   - **Brings Food (HTTP Responses)**: Delivers the prepared food from the kitchen (backend) to the customers (frontend).

3. **Backend Model (Kitchen)**:
   - **Chefs (Server-side Logic)**: Prepare the food (process data, perform operations) according to user input. 
   - **Order Processing (Endpoints)**: Different stations in the kitchen handle different tasks (e.g., fetching user data, adding new users).

## Backend Model Example

The is a UML diagram. DRAW.io is also easy to use marketplace plugin to create a UML diagram for database planning. Create a UML diagram prior to creating a model file.

```text
+---------------------+
|        User         |
+--------------------------------+
| - name: String                 |
| - uid: String                  |
| - password: String             |
| - sections: List<SectionID>    |
| - kasm_server_needed: Boolean  |
| - ProfilePicture: Base64 String|
+--------------------------------+
          |
          | 1
          |         (1 * repersents one to many)
          | *
+----------------------+
|      Section         |
+----------------------+
| - SectionID: Integer |
| - Abbreviation: String |
| - Name: String       |
+----------------------+
```
