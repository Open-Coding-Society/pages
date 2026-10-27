---
layout: opencs
permalink: /documentation/migration-runbook
title: Cockpit Database Upgrade Runbook
description: Exactly how to upgrade the Spring and Flask production databases on cockpit, which procedure to use for which kind of change, and how to roll back.
---

<div class="api-docs migration-runbook">

  <div class="api-header">
    <h2>Cockpit Database Upgrade Runbook</h2>
    <p>How to take a Spring or Flask code change that touches the database from a merged PR to production on cockpit, without losing a row. Every procedure here has been run against production; the last runs are listed at the bottom.</p>
  </div>

  <div class="api-content">

    <div class="runbook-toc">
      <div class="toc-title">Contents</div>
      <ol>
        <li><span class="toc-num">—</span><a href="#which">Which procedure do I need?</a></li>
        <li><span class="toc-num">—</span><a href="#prs">Merging the fixes this depends on</a></li>
        <li><span class="toc-num">00</span><a href="#preflight">Preflight (both)</a></li>
        <li><span class="toc-num">01</span><a href="#spring">Spring: schema change</a></li>
        <li><span class="toc-num">02</span><a href="#flask-add">Flask: new tables (in place)</a></li>
        <li><span class="toc-num">02b</span><a href="#flask-columns">Flask: new or changed columns</a></li>
        <li><span class="toc-num">02c</span><a href="#flask-rebuild">Flask: full rebuild (last resort)</a></li>
        <li><span class="toc-num">03</span><a href="#code-only">Code-only upgrade (both)</a></li>
        <li><span class="toc-num">—</span><a href="#rollback">Rollback</a></li>
        <li><span class="toc-num">—</span><a href="#pitfalls">Pitfalls we have hit</a></li>
        <li><span class="toc-num">—</span><a href="#history">Upgrade log</a></li>
      </ol>
    </div>

    <div class="info-box info">
      <strong>Who this is for.</strong>
      <span>Whoever deploys the next Spring or Flask change on cockpit. It contains no credentials. Where a step needs one, it reads it from the <code>.env</code> file on cockpit — never paste a password into a command, a chat, or this page.</span>
    </div>

    <!-- ============================================================ -->
    <!-- WHICH PROCEDURE                                               -->
    <!-- ============================================================ -->
    <section id="which">
      <p class="phase-label">Answer first</p>
      <h3 class="accent">Which procedure do I need?</h3>

      <p>Decide from what the incoming commits change, not from how big they are. The two apps differ because their databases differ:</p>
      <ul>
        <li><strong>Spring</strong> runs on the SQLite file <code>~/open/spring/volumes/sqlite.db</code> (<code>DB_URL</code> is commented out in its <code>.env</code>). Hibernate runs with <code>ddl-auto=none</code>, so it never changes the schema on its own — new code against an old schema fails at runtime.</li>
        <li><strong>Flask</strong> runs on MySQL in AWS RDS (database <code>user_management</code>). SQLAlchemy's <code>create_all()</code> can add missing <em>tables</em> but never columns.</li>
      </ul>

      <div class="findings-table">
        <table>
          <thead>
            <tr><th>App</th><th>What the incoming commits change</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Both</td>
              <td>No entity / model changes</td>
              <td class="where"><a href="#code-only">03 · code-only</a></td>
            </tr>
            <tr>
              <td>Spring</td>
              <td>Any <code>@Entity</code> change: new entity, field, column, join table</td>
              <td class="where"><a href="#spring">01 · backup → init → restore</a></td>
            </tr>
            <tr>
              <td>Flask</td>
              <td>New models (new tables) only</td>
              <td class="where"><a href="#flask-add">02 · db_upgrade.py</a></td>
            </tr>
            <tr>
              <td>Flask</td>
              <td>New column on an existing table</td>
              <td class="where"><a href="#flask-columns">02b · ALTER, then 02</a></td>
            </tr>
            <tr>
              <td>Flask</td>
              <td>Column type changes, renames, or anything an <code>ALTER</code> cannot express</td>
              <td class="where"><a href="#flask-rebuild">02c · full rebuild</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Do one app at a time. Finish Spring — up, smoke-tested — before starting Flask.</p>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- PR SERIES                                                     -->
    <!-- ============================================================ -->
    <section id="prs">
      <p class="phase-label">Before the next upgrade</p>
      <h3 class="orange">Merging the fixes this depends on</h3>

      <p>Four fixes came out of the 2026-10-21 upgrade. Until they are merged, parts of this runbook fail on production. They are independent of each other — none conflicts with another, and all three Flask PRs were test-merged together — so the order below is about <em>risk</em>, not about breaking the build.</p>

      <div class="findings-table">
        <table>
          <thead>
            <tr><th>#</th><th>PR</th><th>Needs</th><th>Without it</th><th>After pulling on cockpit</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td><a href="https://github.com/Open-Coding-Society/spring/pull/218">spring#218</a> — runner image compiles before switching user</td>
              <td>nothing</td>
              <td><span class="sev breaks">Breaks prod</span> every <code>docker compose up --build</code> of spring fails at <code>javac Runner.java</code></td>
              <td><code>docker compose up -d --build</code>; no DB change</td>
            </tr>
            <tr>
              <td>2</td>
              <td><a href="https://github.com/Open-Coding-Society/flask/pull/105">flask#105</a> — restore keeps <code>active</code> / <code>last_verified</code></td>
              <td>nothing</td>
              <td><span class="sev loss">Data loss</span> a full rebuild (02c) brings every account back <em>inactive</em></td>
              <td><code>git pull && docker compose up -d --build</code>; no DB change. Must be <strong>deployed</strong> before any 02c run</td>
            </tr>
            <tr>
              <td>3</td>
              <td><a href="https://github.com/Open-Coding-Society/flask/pull/106">flask#106</a> — <code>db_init.py</code> mysqldump works on RDS</td>
              <td>nothing</td>
              <td><span class="sev breaks">Breaks prod</span> <code>db_init.py</code> cannot take its backup on RDS, so 02c stops at step 1</td>
              <td><code>git pull</code>; script only</td>
            </tr>
            <tr>
              <td>4</td>
              <td><a href="https://github.com/Open-Coding-Society/flask/pull/107">flask#107</a> — <code>scripts/db_upgrade.py</code></td>
              <td>nothing as documented here; PR 3 only if you run it where <code>mysqldump</code> exists without <code>--backup-file</code></td>
              <td><span class="sev risk">Risk</span> procedure 02 falls back to a hand-typed <code>create_all()</code> (shown in 02)</td>
              <td><code>git pull && docker compose up -d --build</code>; then <code>--check</code> should say <em>Up to date</em></td>
            </tr>
            <tr>
              <td>5</td>
              <td>this page</td>
              <td>reads best after 1–4</td>
              <td>—</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p><strong>Recommended order:</strong> 1 (unblocks every Spring deploy), then 2 + 3 + 4 together on Flask, deployed in one <code>git pull && docker compose up -d --build</code>. Each PR description has its own "How to merge" section with the check to run afterwards.</p>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- PREFLIGHT                                                     -->
    <!-- ============================================================ -->
    <section id="preflight">
      <p class="phase-label">Phase 00</p>
      <h3 class="accent">Preflight (both apps)</h3>

      <ol class="steps">
        <li class="step">
          <div class="step-num">01</div>
          <div class="step-body">
            <p class="step-title">Get a shell on cockpit<span class="step-where">dev machine</span></p>
            <pre><code>ssh cockpit                 <span class="c"># Host cockpit → cockpit.opencodingsociety.com, user ubuntu</span></code></pre>
            <p>If SSH hangs with <code>Connection timed out during banner exchange</code> while the sites still load, sshd is wedged, not the box. Use the Cockpit web console instead: <a href="https://cockpit.opencodingsociety.com">cockpit.opencodingsociety.com</a> → <strong>Terminal</strong>. Every command below works there.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">02</div>
          <div class="step-body">
            <p class="step-title">Confirm the checkout is clean and see what is coming<span class="step-where">cockpit · open/spring and open/flask</span></p>
            <pre><code>cd ~/open/spring            <span class="c"># or ~/open/flask; branch is master / main</span>
git status -sb              <span class="c"># modified tracked files? stop and find out why before pulling</span>
git fetch
git log --oneline HEAD..@{u}</code></pre>
            <p>Untracked files (<code>??</code>) are fine. Modified tracked files (<code> M</code>) are local edits someone made on the server; check that the incoming commits do not touch them (<code>git diff --name-only HEAD @{u}</code>), or <code>git pull --ff-only</code> will refuse.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">03</div>
          <div class="step-body">
            <p class="step-title">Decide which procedure — read the schema delta<span class="step-where">cockpit</span></p>
            <p>Spring — list incoming files that are (or were) JPA entities:</p>
            <pre><code>cd ~/open/spring
for f in $(git diff --name-only HEAD @{u} -- '*.java'); do
  (git show @{u}:$f 2>/dev/null; git show HEAD:$f 2>/dev/null) | grep -qE '@Entity|@Embeddable' && echo "$f"
done
git diff HEAD @{u} -- '*.java' | grep -E '^\+\+\+|^[+-]\s*@(Entity|Table|Column|JoinColumn|JoinTable|ManyToOne|OneToMany|ManyToMany|ElementCollection)|^[+-]\s*private [A-Za-z<>, ]+ [a-zA-Z]+;'</code></pre>
            <p>Flask — list column and table definitions that change:</p>
            <pre><code>cd ~/open/flask
git diff --stat HEAD @{u} -- model/
git diff HEAD @{u} -- model/ | grep -E '^[+-].*(db\.Column|__tablename__|db\.Table\()'</code></pre>
            <p>Nothing printed → <a href="#code-only">code-only</a>. Then pick from the table in <a href="#which">Which procedure</a>.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">04</div>
          <div class="step-body">
            <p class="step-title">Pick a quiet time and tell people<span class="step-where">—</span></p>
            <p>Spring is fully down for the whole of procedure 01 (a few minutes; <code>init</code> boots the app). Flask stays up in 02 / 02b and is down for most of 02c.</p>
          </div>
        </li>
      </ol>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- SPRING                                                        -->
    <!-- ============================================================ -->
    <section id="spring">
      <p class="phase-label">Phase 01 · any Spring entity change</p>
      <h3 class="green">Spring: backup → init → restore</h3>

      <p><code>init</code> rebuilds an empty schema from the entities of the code you just pulled; <code>restore</code> loads the backup into it, copying every column both schemas share. New columns take their defaults, new tables start empty, and every existing row comes back — including the <code>*_seq</code> id tables and the <code>HT_*</code>/<code>HTE_*</code> tables, which Hibernate will not recreate.</p>

      <div class="info-box warning">
        <strong>Never start Spring between <code>init</code> and <code>restore</code>.</strong>
        <span>In that window the database holds only the handful of demo users <code>ModelInit</code> seeds. Starting the app then makes production a demo site. That is why step 06 runs both as one <code>nohup</code> command joined by <code>&&</code>.</span>
      </div>

      <h4>Rehearse first (dev machine, no production data)</h4>
      <p>Production data stays on cockpit. Rehearse the exact commit on a copy of your local dev database instead — it has the same 160-odd tables, so it proves <code>init</code> builds and <code>restore</code> reconciles on the new code:</p>
      <pre><code>cd spring && git fetch upstream
git worktree add --detach ../spring-rehearsal upstream/master
cp .env ../spring-rehearsal/.env           <span class="c"># DB_URL must stay commented out → SQLite</span>
mkdir -p ../spring-rehearsal/volumes/backups
python3 -c "import sqlite3; s=sqlite3.connect('volumes/sqlite.db'); d=sqlite3.connect('../spring-rehearsal/volumes/sqlite.db'); s.backup(d)"
cd ../spring-rehearsal
python3 scripts/db_migrate.py backup
B=$(ls -t volumes/backups/sqlite_backup_*.db | head -1)
FORCE_YES=true python3 scripts/db_migrate.py init && python3 scripts/db_migrate.py restore --backup-file "$B" --force</code></pre>
      <p>It must end with <code>Rows restored</code> equal to <code>Rows in backup</code> and <em>All tables verified</em>. Port 8585 must be free locally (<code>./dev.sh stop spring</code>). Remove the worktree afterwards with <code>git worktree remove ../spring-rehearsal</code>.</p>

      <h4>On production</h4>
      <ol class="steps">
        <li class="step verify">
          <div class="step-num">01</div>
          <div class="step-body">
            <p class="step-title">Confirm the target and note the before-picture<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>cd ~/open/spring
python3 scripts/db_migrate.py status      <span class="c"># must say Mode: SQLITE; note Tables and Rows</span></code></pre>
          </div>
        </li>

        <li class="step">
          <div class="step-num">02</div>
          <div class="step-body">
            <p class="step-title">Stop Spring and pull<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>docker compose down
git pull --ff-only
git log --oneline -1                       <span class="c"># the commit you rehearsed</span></code></pre>
            <p>Pull <em>before</em> <code>init</code>, or <code>init</code> rebuilds the old schema. The app must be down: <code>init</code> needs port 8585, and the backup must not miss writes made after it.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">03</div>
          <div class="step-body">
            <p class="step-title">Back up the live database<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>python3 scripts/db_migrate.py backup</code></pre>
            <p>Uses SQLite's online backup API — never <code>cp</code> the file, it runs in WAL mode. If it fails with <code>unable to open database file</code>, <code>volumes/backups/</code> is root-owned: <code>sudo chown -R $(id -u):$(id -g) volumes/</code> and run it again.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">04</div>
          <div class="step-body">
            <p class="step-title">Gate — the backup is complete<span class="step-where">gate</span></p>
            <p>It must end with <em>All tables and all rows accounted for.</em> Pin the file in a variable so the path cannot be mistyped later:</p>
            <pre><code>B=volumes/backups/sqlite_backup_YYYYMMDD_HHMMSS.db     <span class="c"># the file it printed</span>
ls -l "$B" || echo "MISSING - STOP"</code></pre>
          </div>
        </li>

        <li class="step destructive">
          <div class="step-num">05</div>
          <div class="step-body">
            <p class="step-title">Rebuild the schema and reload the data<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>nohup bash -c "FORCE_YES=true python3 scripts/db_migrate.py init && python3 scripts/db_migrate.py restore --backup-file '$B' --force" \
  > ~/upgrade_$(date +%Y%m%d).log 2>&1 &
tail -f ~/upgrade_$(date +%Y%m%d).log</code></pre>
            <p><code>&&</code> means a failed <code>init</code> never reaches <code>restore</code>; <code>nohup</code> means a dropped SSH or web-console session cannot leave it half done. <code>init</code> boots the app with Maven, so expect a few minutes of <em>Waiting for Spring Boot....</em></p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">06</div>
          <div class="step-body">
            <p class="step-title">Gate — every row came back<span class="step-where">gate</span></p>
            <pre><code>DATABASE RESET COMPLETE
Rows in backup:  N
Rows restored:   N          <span class="c"># must equal the line above</span>
All tables verified: target row counts match the backup.</code></pre>
            <p>All four lines, or do not start the app. If <code>init</code> succeeded but <code>restore</code> failed, re-run only the restore: <code>python3 scripts/db_migrate.py restore --backup-file "$B" --force</code>. Never re-run <code>init</code> at this point.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">07</div>
          <div class="step-body">
            <p class="step-title">Start Spring<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>docker compose up -d --build</code></pre>
            <p>If the build stops at <code>RUN javac Runner.java</code> with <em>error while writing Runner</em>, PR 1 (spring#218) is not merged yet. The database is fine; start with the previous runner image instead: <code>docker compose build web && docker compose up -d --no-build</code>.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">08</div>
          <div class="step-body">
            <p class="step-title">Smoke test<span class="step-where">gate</span></p>
            <pre><code>docker compose ps                                       <span class="c"># web and code_runner Up</span>
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8585/   <span class="c"># 302 (login redirect) = up</span>
python3 -c "
import sqlite3; c = sqlite3.connect('file:volumes/sqlite.db?mode=ro', uri=True)
print('tables', c.execute(\"select count(*) from sqlite_master where type='table'\").fetchone()[0])
print('person', c.execute('select count(*) from person').fetchone()[0])
print('integrity', c.execute('pragma quick_check').fetchone()[0])"
docker compose logs web --since 10m | grep -iE "Schema-validation|APPLICATION FAILED|Exception" | tail</code></pre>
            <p>Table count and <code>person</code> must match the before-picture (plus any new tables); integrity must be <code>ok</code>. Then log in through the site and open a page that uses the changed entity.</p>
          </div>
        </li>
      </ol>

      <div class="info-box info">
        <strong>If Spring moves back to RDS.</strong>
        <span>Once <code>DB_URL</code> is set, <code>db_migrate.py</code> switches to its MySQL code paths and the flow becomes <code>backup</code> → down → pull → <code>init</code> → <code>restore --keep-target-schema</code> → up. The <code>spring</code> README, section "Database Management Workflow with Scripts", has the exact commands. The RDS <code>springdatabase</code> is a stale April snapshot — do not restore it over the SQLite file.</span>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- FLASK ADDITIVE                                                -->
    <!-- ============================================================ -->
    <section id="flask-add">
      <p class="phase-label">Phase 02 · new Flask models only</p>
      <h3 class="teal">Flask: create the new tables in place</h3>

      <p>Nothing is dropped, nothing is reloaded, user ids do not change, and Flask stays up. This is how the nine presence tables went to production on 2026-10-21.</p>

      <ol class="steps">
        <li class="step">
          <div class="step-num">01</div>
          <div class="step-body">
            <p class="step-title">Back up RDS from the host<span class="step-where">cockpit · open/flask</span></p>
            <pre><code>cd ~/open/flask
OUT=instance/backups/user_management_$(date +%Y%m%d_%H%M%S)_pre_upgrade.sql
( eval "$(grep -E '^(DB_ENDPOINT|DB_USERNAME|DB_PASSWORD)=' .env)"
  MYSQL_PWD="$DB_PASSWORD" mysqldump --host="$DB_ENDPOINT" --port=3306 --user="$DB_USERNAME" \
    --single-transaction --set-gtid-purged=OFF --routines --triggers user_management > "$OUT" )
ls -l "$OUT"; tail -1 "$OUT"</code></pre>
            <p>The web container has no <code>mysqldump</code>, so this runs on the host. It loads only the three <code>DB_*</code> lines from <code>.env</code> — <code>source .env</code> breaks on other lines in that file — and the subshell keeps them out of your session.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">02</div>
          <div class="step-body">
            <p class="step-title">Gate — the dump is complete<span class="step-where">gate</span></p>
            <p>The last line must be <code>-- Dump completed on …</code>. If <code>mysqldump</code> instead says <code>FLUSH TABLES WITH READ LOCK … Access denied</code>, the <code>--set-gtid-purged=OFF</code> flag is missing. Delete any partial file before retrying.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">03</div>
          <div class="step-body">
            <p class="step-title">Deploy the code<span class="step-where">cockpit · open/flask</span></p>
            <pre><code>git pull --ff-only && git log --oneline -1
docker compose up -d --build</code></pre>
            <p>Safe before the schema: Flask only creates tables when told to. Pages for the new models error until step 05; everything else keeps working.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">04</div>
          <div class="step-body">
            <p class="step-title">Gate — only tables to add<span class="step-where">gate</span></p>
            <pre><code>docker compose exec web python scripts/db_upgrade.py --check</code></pre>
            <p>Exit 2 with a list under <em>Tables to create</em> → continue. <em>MISSING COLUMNS</em> → stop and do <a href="#flask-columns">02b</a> first. <em>Unused tables / columns (left in place)</em> are harmless leftovers (for example <code>users.kasm_server_needed</code>).</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">05</div>
          <div class="step-body">
            <p class="step-title">Create the tables<span class="step-where">cockpit · open/flask</span></p>
            <pre><code>docker compose exec web python scripts/db_upgrade.py --backup-file "$OUT"</code></pre>
            <p><code>instance/</code> is mounted into the container at the same relative path, so <code>$OUT</code> resolves inside it. The script refuses a missing or truncated dump, creates the tables, and re-counts every existing table.</p>
            <p>Before PR 4 (flask#107) is merged, the equivalent by hand is:</p>
            <pre><code>docker compose exec web python -c "from main import app, db; app.app_context().push(); db.create_all()"</code></pre>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">06</div>
          <div class="step-body">
            <p class="step-title">Gate and smoke test<span class="step-where">gate</span></p>
            <p>The script must end with <em>All N existing tables kept their row counts</em> and <em>Upgrade complete</em>; a second <code>--check</code> must say <em>Up to date</em>. Then:</p>
            <pre><code>curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8587/     <span class="c"># 200</span>
docker compose logs web --since 10m | grep -iE "error|traceback" | tail</code></pre>
            <p>Log in as a real (non-seed) user and open a page that uses the new model.</p>
          </div>
        </li>
      </ol>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- FLASK COLUMNS                                                 -->
    <!-- ============================================================ -->
    <section id="flask-columns">
      <p class="phase-label">Phase 02b · a new column on an existing Flask table</p>
      <h3 class="teal">Flask: add the column, then 02</h3>

      <p><code>create_all()</code> never alters an existing table, so a new column is one <code>ALTER TABLE</code>, applied <strong>before</strong> the code that reads it is deployed. The precedent is in <code>model/user.py</code>, next to <code>active</code> and <code>last_verified</code>: the PR that adds a column should carry its <code>ALTER</code> (and any backfill <code>UPDATE</code>) in a comment or its description.</p>

      <ol class="steps">
        <li class="step">
          <div class="step-num">01</div>
          <div class="step-body">
            <p class="step-title">Back up — exactly 02 step 01, and pass its gate<span class="step-where">cockpit · open/flask</span></p>
          </div>
        </li>
        <li class="step destructive">
          <div class="step-num">02</div>
          <div class="step-body">
            <p class="step-title">Apply the ALTER from the PR<span class="step-where">cockpit · open/flask</span></p>
            <pre><code>( eval "$(grep -E '^(DB_ENDPOINT|DB_USERNAME|DB_PASSWORD)=' .env)"
  MYSQL_PWD="$DB_PASSWORD" mysql --host="$DB_ENDPOINT" --user="$DB_USERNAME" user_management \
    -e "ALTER TABLE users ADD COLUMN example_flag BOOLEAN NOT NULL DEFAULT 0;" )</code></pre>
            <p>A <code>NOT NULL</code> column needs a <code>DEFAULT</code> or MySQL rejects it on a table that has rows. Think about what existing rows should hold — when <code>active</code> was added, every existing account was set to active with an explicit <code>UPDATE</code>, otherwise everyone would have been locked out.</p>
          </div>
        </li>
        <li class="step verify">
          <div class="step-num">03</div>
          <div class="step-body">
            <p class="step-title">Continue with 02 from step 03<span class="step-where">cockpit · open/flask</span></p>
            <p>Deploy, then <code>db_upgrade.py --check</code> must no longer list <em>MISSING COLUMNS</em>.</p>
          </div>
        </li>
      </ol>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- FLASK REBUILD                                                 -->
    <!-- ============================================================ -->
    <section id="flask-rebuild">
      <p class="phase-label">Phase 02c · last resort</p>
      <h3 class="orange">Flask: full rebuild (db_init + restore)</h3>

      <div class="info-box warning">
        <strong>Do not use this until PRs 2 and 3 are merged and deployed.</strong>
        <span>Without flask#105 every account comes back inactive (403 "Account pending verification" for everyone). Without flask#106 <code>db_init.py</code> cannot take its RDS backup and stops. It also gives every user a new id. Prefer 02 / 02b whenever they can express the change.</span>
      </div>

      <p>This drops every table on RDS and round-trips all data through the admin export/import API, so production's code and your local checkout must be the same commit. The full step list, with its gates, is in the <code>flask</code> README, section "Database Management Workflow with Scripts". In short:</p>
      <ol>
        <li>On cockpit: <code>git pull && docker compose up -d --build</code> (code first — the pull needs production's new export endpoints).</li>
        <li>On your machine, with the <strong>production</strong> admin in <code>.env</code> (<code>ADMIN_UID</code> / <code>ADMIN_PASSWORD</code>): <code>python scripts/db_migrate-prod2sqlite.py</code> — must exit 0, every table <code>ok</code>.</li>
        <li>Test locally against that data.</li>
        <li>On cockpit, in a Python environment with the app's requirements: <code>python scripts/db_init.py</code> — takes the <code>mysqldump</code>, then <code>drop_all()</code>, <code>create_all()</code>, seed data. Note the dump path.</li>
        <li>On your machine: <code>python scripts/db_restore-sqlite2prod.py</code> — must report a clean reconciliation; <code>+N extra</code> are seed rows, <code>MISSING</code> is a failure.</li>
        <li>Check that real accounts are still active: log in as a student and as a teacher.</li>
      </ol>
      <p>The pulled SQLite file is the only complete copy of production between steps 4 and 5. Do not delete it until step 5 reconciles.</p>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- CODE ONLY                                                     -->
    <!-- ============================================================ -->
    <section id="code-only">
      <p class="phase-label">Phase 03 · no entity / model changes</p>
      <h3 class="green">Code-only upgrade (both apps)</h3>

      <p>Still take a backup — it costs a minute and a bad release can write bad data.</p>
      <pre><code><span class="c"># Spring</span>
cd ~/open/spring
python3 scripts/db_migrate.py backup          <span class="c"># must end "All tables and all rows accounted for."</span>
git pull --ff-only && docker compose up -d --build

<span class="c"># Flask</span>
cd ~/open/flask
<span class="c"># 02 step 01 (mysqldump), pass its gate, then:</span>
git pull --ff-only && docker compose up -d --build</code></pre>
      <p>Smoke test as in 01 step 08 / 02 step 06. Rolling back is <code>git checkout &lt;previous commit&gt; && docker compose up -d --build</code>, because the database did not change.</p>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- ROLLBACK                                                      -->
    <!-- ============================================================ -->
    <section id="rollback">
      <p class="phase-label">If it goes wrong</p>
      <h3 class="orange">Rollback</h3>

      <h4>Spring — the backup file is a complete database</h4>
      <pre><code>cd ~/open/spring
docker compose down
git checkout &lt;previous commit&gt;                  <span class="c"># the old code matches the old schema</span>
cp "$B" volumes/sqlite.db
rm -f volumes/sqlite.db-wal volumes/sqlite.db-shm   <span class="c"># or the old WAL replays on top</span>
docker compose up -d --build</code></pre>
      <p>Do not start the <em>new</em> code on the old database: with <code>ddl-auto=none</code> the missing columns break every query that touches them.</p>

      <h4>Flask — load the dump back into RDS</h4>
      <pre><code>cd ~/open/flask
( eval "$(grep -E '^(DB_ENDPOINT|DB_USERNAME|DB_PASSWORD)=' .env)"
  MYSQL_PWD="$DB_PASSWORD" mysql --host="$DB_ENDPOINT" --user="$DB_USERNAME" user_management &lt; "$OUT" )
git checkout &lt;previous commit&gt; && docker compose up -d --build</code></pre>
      <p>After 02 alone, rolling back the code is usually enough — the new tables are unused by the old code. Load the dump when data was changed or lost.</p>

      <h4>Last line of defence</h4>
      <p>An RDS snapshot from the AWS console, taken before a 02c rebuild, restores the whole instance. Slow, and it discards everything written since.</p>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- PITFALLS                                                      -->
    <!-- ============================================================ -->
    <section id="pitfalls">
      <p class="phase-label">Learned the hard way</p>
      <h3 class="accent">Pitfalls we have hit</h3>

      <div class="findings-table">
        <table>
          <thead>
            <tr><th>Impact</th><th>What happens</th><th>Avoid it by</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="sev loss">Data loss</span></td>
              <td><code>cp sqlite.db</code> of a WAL database misses everything still in <code>sqlite.db-wal</code>.</td>
              <td class="where"><code>db_migrate.py backup</code> only</td>
            </tr>
            <tr>
              <td><span class="sev loss">Data loss</span></td>
              <td>Spring started between <code>init</code> and <code>restore</code> serves the seeded demo users as production.</td>
              <td class="where">01 step 05 as one <code>nohup … && …</code></td>
            </tr>
            <tr>
              <td><span class="sev loss">Data loss</span></td>
              <td>Flask full rebuild deactivates every account (before flask#105).</td>
              <td class="where">02 / 02b, or merge PR 2 first</td>
            </tr>
            <tr>
              <td><span class="sev breaks">Breaks prod</span></td>
              <td>New Spring code started on the old schema: missing columns, errors on every affected endpoint.</td>
              <td class="where">pull → init → restore → up, in that order</td>
            </tr>
            <tr>
              <td><span class="sev breaks">Breaks prod</span></td>
              <td><code>docker compose up --build</code> fails on <code>javac Runner.java</code> after <code>compose down</code> — Spring stays down.</td>
              <td class="where">merge spring#218; meanwhile <code>--no-build</code> for the runner</td>
            </tr>
            <tr>
              <td><span class="sev risk">Risk</span></td>
              <td><code>mysqldump</code> on RDS: <code>FLUSH TABLES WITH READ LOCK … Access denied</code>, no backup.</td>
              <td class="where"><code>--set-gtid-purged=OFF</code></td>
            </tr>
            <tr>
              <td><span class="sev risk">Risk</span></td>
              <td><code>source .env</code> fails part-way on an unquoted URL line, and exports every secret into your shell.</td>
              <td class="where">the <code>eval "$(grep -E '^(DB_…)=' .env)"</code> subshell</td>
            </tr>
            <tr>
              <td><span class="sev risk">Risk</span></td>
              <td>SSH hangs at <em>banner exchange</em>; a dropped session mid-<code>init</code> strands Spring half-migrated.</td>
              <td class="where">Cockpit web console; <code>nohup</code> for long steps</td>
            </tr>
            <tr>
              <td><span class="sev risk">Risk</span></td>
              <td><code>db_init.py</code> run under <code>sudo</code> once leaves <code>/tmp/db_init.log</code> root-owned; every later run dies before Spring starts.</td>
              <td class="where">never <code>sudo</code> the scripts; <code>rm /tmp/db_init.log</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- HISTORY                                                       -->
    <!-- ============================================================ -->
    <section id="history">
      <p class="phase-label">Record</p>
      <h3 class="accent">Upgrade log</h3>

      <div class="findings-table">
        <table>
          <thead>
            <tr><th>Date</th><th>App</th><th>Change</th><th>Procedure</th><th>Result</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-09-21</td><td>Spring</td><td>peer and self assessment tables</td><td>01</td>
              <td>63,698 rows preserved</td>
            </tr>
            <tr>
              <td>2026-09-28</td><td>Spring</td><td>direct messages (157 → 160 tables)</td><td>01</td>
              <td>71,360 rows preserved</td>
            </tr>
            <tr>
              <td>2026-10-21</td><td>Spring</td><td><code>1f9fb561</code> → <code>e5a7650b</code>: <code>assignment.hack_weights</code>, <code>assignment_submission.graded_at</code></td><td>01</td>
              <td>101,548 / 101,548 rows restored, 162 tables, integrity ok. Runner image reused (spring#218).</td>
            </tr>
            <tr>
              <td>2026-10-21</td><td>Flask</td><td><code>dac2786</code> → <code>b58c2f6</code>: 9 presence tables, <code>users.kasm_server_needed</code> retired</td><td>02 (by hand)</td>
              <td>19 → 28 tables on RDS, all 676 users still active, ids unchanged</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Add a row each time — date, commit range, procedure, and the reconciliation numbers.</p>
    </section>

    <div class="runbook-footer">
      <p>Versioned migrations (Flyway for Spring, Alembic for Flask) were prototyped as a replacement for the wipe-and-reload path and are <strong>not adopted</strong>; this runbook describes the procedures production actually uses. The proposal and its status are tracked in <a href="https://github.com/CSA-Admin-OCS/spring/issues/3">CSA-Admin-OCS/spring#3</a>.</p>
    </div>

  </div>
</div>
