---
layout: opencs
permalink: /documentation/migration-runbook
title: Cockpit Migration Runbook
description: The audited procedure for running a schema update against the Spring and Flask production databases.
---

<div class="api-docs migration-runbook">

  <div class="api-header">
    <h2>Cockpit Migration Runbook</h2>
    <p>An audit of the Spring and Flask migration scripts, the fixes applied to them, and the exact order to run a production schema update. Neither script pair was safe to run as written.</p>
  </div>

  <div class="api-content">

    <div class="runbook-toc">
      <div class="toc-title">Contents</div>
      <ol>
        <li><span class="toc-num">—</span><a href="#verdict">Verdict</a></li>
        <li><span class="toc-num">—</span><a href="#findings">What was broken</a></li>
        <li><span class="toc-num">—</span><a href="#changes">What changed</a></li>
        <li><span class="toc-num">00</span><a href="#preflight">Preflight</a></li>
        <li><span class="toc-num">01</span><a href="#spring-sqlite">Spring (SQLite)</a></li>
        <li><span class="toc-num">01b</span><a href="#spring-mysql">Spring (MySQL)</a></li>
        <li><span class="toc-num">02</span><a href="#flask">Flask migration</a></li>
        <li><span class="toc-num">—</span><a href="#rollback">Rollback</a></li>
      </ol>
    </div>

    <div class="info-box info">
      <strong>Who this is for.</strong>
      <span>Whoever is running the next production database migration. It contains no credentials and no connection strings — everything sensitive lives in the <code>.env</code> file on cockpit and never in this document. If a step below needs a password, it means read it from <code>.env</code>, not from here.</span>
    </div>

    <!-- ============================================================ -->
    <!-- VERDICT                                                       -->
    <!-- ============================================================ -->
    <section id="verdict">
      <p class="phase-label">Answer first</p>
      <h3 class="orange">No — neither set would have migrated everything</h3>

      <p>Both pairs reported success while losing data, and the Spring pair would have left production in an unrecoverable state.</p>

      <div class="panel border-left orange">
        <div class="panel-title orange">Spring</div>
        <p><code>mysqlbackup.py</code> silently omitted every table whose id is a MySQL <code>AUTO_INCREMENT</code> column. That keyword is a syntax error in SQLite, so the <code>CREATE TABLE</code> failed and the loop moved on to the next table. The codebase has 34 entities using <code>GenerationType.IDENTITY</code>. The script then printed <em>"Backup Complete — Total tables backed up: N"</em> using the full source count.</p>
      </div>

      <div class="panel border-left orange">
        <div class="panel-title orange">Spring, worse</div>
        <p><code>mysqlrestore.py</code> drops every table in production first, then rebuilds from the SQLite backup. The rebuild emitted <code>DEFAULT 'NULL'</code> — a literal four-character string — on columns it had also downgraded to <code>LONGTEXT</code>. MySQL rejects any default on a <code>TEXT</code> column (error 1101), so <code>CREATE TABLE</code> would have failed for essentially every table with a nullable varchar — <em>after</em> production had already been dropped, with no dump taken.</p>
      </div>

      <div class="panel border-left orange">
        <div class="panel-title orange">Flask</div>
        <p>Three tables — <code>leaderboard</code>, <code>elementary_leaderboard_events</code>, <code>skill_snapshots</code> — had no export or import endpoint at all. Since step 4 of the documented workflow runs <code>db_init.py</code> on production, which calls <code>drop_all()</code>, those tables are destroyed there and never restored. <code>db_init.py</code> also printed <em>"Backup not supported for production database"</em> and dropped everything anyway.</p>
      </div>

      <div class="info-box warning">
        <strong>Spring is not on MySQL today.</strong>
        <span><code>DB_URL</code> turned out to be commented out in Spring's <code>.env</code>, so Spring has been running on the local SQLite file, not RDS, for some time. The defects above are all real and all still worth fixing, but they were latent rather than live — the broken MySQL path had not been exercised. Flask <em>is</em> on production MySQL, so its findings apply directly. Spring's live migration is the SQLite phase below.</span>
      </div>

      <div class="info-box success">
        <strong>Evidence.</strong>
        <span>These are not readings of the code. The schema translators were run as pure functions against real <code>SHOW CREATE TABLE</code> output and against all 130 tables in <code>spring/schema_full.txt</code>. The <code>AUTO_INCREMENT</code> failure and the <code>DEFAULT 'NULL'</code> output were both reproduced directly. After the fixes, every parseable table produces legal MySQL.</span>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- FINDINGS                                                      -->
    <!-- ============================================================ -->
    <section id="findings">
      <p class="phase-label">Audit</p>
      <h3 class="accent">What was broken</h3>

      <p>Ordered by consequence. <strong>Data loss</strong> means rows that existed in production would not exist after the migration, with no error raised. <strong>Breaks prod</strong> means the migration itself fails partway, after something destructive has already run. <strong>No recovery</strong> means nothing would have caught it and nothing would have undone it.</p>

      <h4>Spring</h4>
      <div class="findings-table">
        <table>
          <thead>
            <tr><th>Impact</th><th>Defect</th><th>Where</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="sev loss">Data loss</span></td>
              <td>Column-level <code>AUTO_INCREMENT</code> was never stripped, so SQLite rejected the <code>CREATE TABLE</code> and the table was skipped entirely. Affects all 34 <code>GenerationType.IDENTITY</code> entities. Reported as a successful backup.</td>
              <td class="where">mysqlbackup.py</td>
            </tr>
            <tr>
              <td><span class="sev loss">Data loss</span></td>
              <td>Restore excluded all <code>HT_*</code> / <code>HTE_*</code> Envers audit tables but dropped them from MySQL first. The code comment claimed Hibernate would recreate them; the app runs <code>ddl-auto=none</code>, so it will not — and every write to an audited entity then fails.</td>
              <td class="where">mysqlrestore.py</td>
            </tr>
            <tr>
              <td><span class="sev breaks">Breaks prod</span></td>
              <td><code>DEFAULT NULL</code> round-tripped into <code>DEFAULT 'NULL'</code>, applied to columns already downgraded to <code>LONGTEXT</code>. MySQL error 1101 — after <code>drop_all_tables()</code> had run.</td>
              <td class="where">mysqlrestore.py</td>
            </tr>
            <tr>
              <td><span class="sev breaks">Breaks prod</span></td>
              <td>Schema degraded on every round trip: <code>varchar(255)</code>, <code>datetime(6)</code>, <code>bit(1)</code> and <code>json</code> all became <code>LONGTEXT</code>; every index, <code>UNIQUE</code> key and foreign key was dropped.</td>
              <td class="where">mysqlrestore.py</td>
            </tr>
            <tr>
              <td><span class="sev breaks">Breaks prod</span></td>
              <td>The production schema update ran through that same translator — <code>db_init.py</code> built a local SQLite schema and converted it to MySQL rather than letting Hibernate emit native DDL.</td>
              <td class="where">db_init.py</td>
            </tr>
            <tr>
              <td><span class="sev loss">Data loss</span></td>
              <td>A duplicate-key error skipped the entire table's data, printed one line, and still counted the table as restored.</td>
              <td class="where">mysqlrestore.py</td>
            </tr>
            <tr>
              <td><span class="sev risk">No recovery</span></td>
              <td>No dump taken before dropping production, and no row-count verification in either direction.</td>
              <td class="where">both</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>Flask</h4>
      <div class="findings-table">
        <table>
          <thead>
            <tr><th>Impact</th><th>Defect</th><th>Where</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="sev loss">Data loss</span></td>
              <td><code>leaderboard</code>, <code>elementary_leaderboard_events</code> and <code>skill_snapshots</code> had no export or import endpoint. <code>db_init.py</code> on production drops them; nothing puts them back.</td>
              <td class="where">data_export_import_api.py</td>
            </tr>
            <tr>
              <td><span class="sev risk">No recovery</span></td>
              <td><code>db_init.py</code> printed "Backup not supported for production database", then ran <code>drop_all()</code> — no rollback point for a MySQL target.</td>
              <td class="where">db_init.py</td>
            </tr>
            <tr>
              <td><span class="sev loss">Data loss</span></td>
              <td>The <code>_game_profile</code> column was dropped in both directions — never passed to the <code>User</code> constructor on import.</td>
              <td class="where">both scripts + API</td>
            </tr>
            <tr>
              <td><span class="sev loss">Data loss</span></td>
              <td>The seed-user filter listed a non-existent <code>DEFAULT_UID</code> key and missed <code>USER_UID</code> and <code>MY_UID</code>. Those users' real production rows were pulled, then discarded locally as "already exists".</td>
              <td class="where">db_utils.py</td>
            </tr>
            <tr>
              <td><span class="sev risk">Silent</span></td>
              <td>Failures inside a batched upload were never added to <code>failed_endpoints</code>, so a batched type could lose rows and the run still reported success.</td>
              <td class="where">db_restore-sqlite2prod.py</td>
            </tr>
            <tr>
              <td><span class="sev risk">Silent</span></td>
              <td>Only <code>users</code> and <code>sections</code> were treated as critical on export; any other endpoint could fail and the migration continued.</td>
              <td class="where">db_migrate-prod2sqlite.py</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- WHAT CHANGED                                                  -->
    <!-- ============================================================ -->
    <section id="changes">
      <p class="phase-label">Fixes applied</p>
      <h3 class="green">What changed</h3>

      <p>Every defect above is fixed in the current scripts. Three structural changes are worth understanding before you run anything.</p>

      <h4>Spring no longer translates schemas</h4>
      <p><code>mysqlbackup.py</code> now records each table's exact <code>SHOW CREATE TABLE</code> output and source row count into a <code>__migration_meta__</code> table inside the backup file. The restore replays that DDL verbatim, so types, indexes, <code>UNIQUE</code> keys and foreign keys survive intact instead of being re-derived from SQLite type affinities.</p>
      <p>For a production update the schema does not come from the backup at all. <code>db_init.py</code> now runs Spring Boot against the target directly with <code>ddl-auto=create</code>, so Hibernate emits native DDL for the current entities. <code>restore --keep-target-schema</code> then loads data into that schema, inserting only the columns both sides share and reporting which columns were added or dropped.</p>

      <h4>Both sides now verify themselves</h4>
      <p>Flask gained <code>GET /api/export/counts</code>, which returns row counts for every model. The pull and push scripts call it and print a table-by-table reconciliation, exiting non-zero on any shortfall. Spring re-counts every table against the backup after restoring. Nothing reports success on a partial transfer any more.</p>

      <h4>Rollback points are mandatory</h4>
      <p>Both <code>db_init.py</code> scripts and <code>mysqlrestore.py</code> take a <code>mysqldump</code> before anything destructive and refuse to continue if it fails. Overrides exist (<code>ALLOW_NO_BACKUP=true</code>, <code>--skip-safety-dump</code>) but you should not need them.</p>

      <h4>One entry point instead of five</h4>
      <p>Spring had accumulated three overlapping migration pairs — the HTTP-based <code>db_prod2local</code> / <code>db_local2prod</code> from the SQLite era, the <code>db_mysql2local</code> / <code>db_local2mysql</code> merge variants, and <code>mysqlbackup</code> / <code>mysqlrestore</code> — plus a dead one-off, <code>db_prod_to_mysql.py</code>, that shelled out to a script which no longer existed. Five helpers were copy-pasted across three files, and <code>db_local2mysql.py</code> carried an entirely separate MySQL writer that received none of the fixes above.</p>
      <p>Everything shared now lives in <code>mysql_common.py</code>, and <code>db_migrate.py</code> is the single entry point: <code>status</code>, <code>check</code>, <code>backup</code>, <code>init</code>, <code>restore</code>. It calls straight into the existing implementations rather than reimplementing them, so there is still exactly one backup path and one restore path. The five superseded scripts have been removed.</p>

      <div class="info-box success">
        <strong>The anti-drift check.</strong>
        <span>The MySQL-to-SQLite and SQLite-to-MySQL type maps are inverse functions in two different files, and nothing structural keeps them inverse — that drift is exactly what turned every <code>VARCHAR</code> and <code>DATETIME</code> into <code>LONGTEXT</code>. <code>db_migrate.py check</code> pushes every table through both directions and fails on any degradation. It needs no database and no driver, so it runs in CI. It earned its place immediately: on its first run it caught a regression in the previous day's fix — the type substitutions were matching <strong>column names</strong>, not just types, and this schema has columns literally named <code>timestamp</code> and <code>text</code>. Substitutions now skip backtick-quoted identifiers.</span>
      </div>

      <h4>Files touched</h4>
      <div class="panel border-left accent">
        <div class="panel-title accent">spring/ and spring-tracking/</div>
        <p><code>scripts/mysql_common.py</code> (new), <code>scripts/db_migrate.py</code> (new), <code>scripts/sqlite_migrate.py</code> (new), <code>scripts/mysqlbackup.py</code>, <code>scripts/mysqlrestore.py</code>, <code>scripts/db_init.py</code>, <code>README.md</code>. The five superseded scripts were deleted.</p>
      </div>
      <div class="panel border-left accent">
        <div class="panel-title accent">flask/</div>
        <p><code>api/data_export_import_api.py</code>, <code>scripts/db_utils.py</code>, <code>scripts/db_migrate-prod2sqlite.py</code>, <code>scripts/db_restore-sqlite2prod.py</code>, <code>scripts/db_init.py</code>, <code>README.md</code>.</p>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- PREFLIGHT                                                     -->
    <!-- ============================================================ -->
    <section id="preflight">
      <p class="phase-label">Phase 00</p>
      <h3 class="accent">Preflight</h3>

      <p>Do all of this before touching either service. Run the two migrations one at a time, fully finishing Spring before starting Flask.</p>

      <ol>
        <li>Commit and push the script changes, and merge them — production pulls this code.</li>
        <li>Confirm <code>mysqldump</code> and <code>mysql</code> are on PATH on cockpit: <code>which mysqldump mysql</code>.</li>
        <li>Confirm the Python venvs have <code>mysql-connector-python</code> (Spring) and <code>requests</code> (Flask).</li>
        <li>Spring <code>.env</code> on cockpit: <code>DB_URL</code>, <code>DB_USERNAME</code>, <code>DB_PASSWORD</code> pointing at the RDS instance — only if you intend to run the MySQL phase.</li>
        <li>Flask <code>.env</code> on your dev machine: <code>ADMIN_UID</code> and <code>ADMIN_PASSWORD</code> set to the <strong>production</strong> admin credentials.</li>
        <li>Take an RDS snapshot from the AWS console. This is your last line of defence and it is independent of anything the scripts do.</li>
        <li>Pick a low-traffic window. There is a period where each service is down, or serving new code against an old schema.</li>
      </ol>

      <p>Then confirm what you are pointed at, and that the schema translation is sound, from the <code>spring</code> repo:</p>
      <pre><code>python3 scripts/db_migrate.py status
python3 scripts/db_migrate.py check</code></pre>

      <div class="info-box info">
        <strong><code>check</code> must exit 0.</strong>
        <span>It needs no database and no driver, so it is safe to run anywhere. It reads <code>schema_full.txt</code>, which is a point-in-time fixture and goes stale as entities are added — use <code>check --live</code> to read the schema from the configured MySQL server instead.</span>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- SPRING - SQLITE                                                -->
    <!-- ============================================================ -->
    <section id="spring-sqlite">
      <p class="phase-label">Phase 01 · do this one</p>
      <h3 class="green">Spring migration — SQLite</h3>

      <p>Spring's <code>.env</code> had <code>DB_URL</code> commented out, so <code>application.properties</code> fell back to <code>jdbc:sqlite:volumes/sqlite.db</code>. Spring has been writing to that local file, not RDS. <strong>That file is the live production database</strong>; the RDS <code>springdatabase</code> is a stale snapshot from the April cutover.</p>

      <div class="info-box warning">
        <strong>Do not migrate the RDS copy.</strong>
        <span>It has 116 tables and no Envers audit tables at all, versus 130 in the SQLite schema. Restoring it over your live file would roll Spring back to April.</span>
      </div>

      <div class="info-box warning">
        <strong>Never <code>cp</code> the database.</strong>
        <span>It runs in WAL mode, so a plain copy of <code>sqlite.db</code> taken while Spring is up can miss everything still in the <code>-wal</code> file, or capture a torn page. <code>db_migrate.py backup</code> uses SQLite's online backup API instead, which is consistent against a live database.</span>
      </div>

      <ol class="steps">
        <li class="step verify">
          <div class="step-num">01</div>
          <div class="step-body">
            <p class="step-title">Confirm which database you are on<span class="step-where">gate</span></p>
            <pre><code>python3 scripts/db_migrate.py status</code></pre>
            <p>Must print <code>Mode: SQLITE</code> and a file path. If it prints <code>Mode: MYSQL</code>, then <code>DB_URL</code> is set and you want the MySQL phase below instead. Note the table and row counts — they are your before-picture.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">02</div>
          <div class="step-body">
            <p class="step-title">Fix the backups directory if needed<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>sudo chown -R $(id -u):$(id -g) volumes/</code></pre>
            <p>An <code>unable to open database file</code> error here means <code>volumes/backups/</code> is root-owned, created that way by Docker. The backup checks this up front and tells you the fix, but you can clear it now.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">03</div>
          <div class="step-body">
            <p class="step-title">Back up the live database<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>python3 scripts/db_migrate.py backup</code></pre>
            <p>Writes <code>volumes/backups/sqlite_backup_&lt;ts&gt;.db</code> and verifies every table's row count against the live file. Note the filename — you need it in step 7.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">04</div>
          <div class="step-body">
            <p class="step-title">Gate — the backup must exit clean<span class="step-where">gate</span></p>
            <pre><code>echo $?   <span class="c"># must print 0</span></code></pre>
            <p>The run must end with <em>"All tables and all rows accounted for."</em> Copy the file off the box as well — it is a complete database, so a copy is a complete rollback.</p>
          </div>
        </li>

        <li class="step destructive">
          <div class="step-num">05</div>
          <div class="step-body">
            <p class="step-title">Take Spring down and update the code<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>docker compose down
git pull</code></pre>
            <p>Port 8585 must be free for the next step, which is why the container comes down first.</p>
          </div>
        </li>

        <li class="step destructive">
          <div class="step-num">06</div>
          <div class="step-body">
            <p class="step-title">Rebuild the schema from the entities<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>python3 scripts/db_migrate.py init</code></pre>
            <p>Takes its own verified backup, deletes the old file, then boots Spring Boot with <code>ddl-auto=create</code> to build a fresh schema and seed data. Your real data is in the backup from step 3, not in this file.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">07</div>
          <div class="step-body">
            <p class="step-title">Load your data into the new schema<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>python3 scripts/db_migrate.py restore \
    --backup-file volumes/backups/sqlite_backup_&lt;ts&gt;.db</code></pre>
            <p>Clears the seed rows and loads the backup into the columns both schemas share. Columns your change added take their defaults; <code>*_seq</code> tables come across intact, so Hibernate keeps allocating ids where it left off rather than restarting at 1 and colliding.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">08</div>
          <div class="step-body">
            <p class="step-title">Gate — every table must reconcile<span class="step-where">gate</span></p>
            <p>Must end with <em>"All tables verified: target row counts match the backup."</em> Read the two lists above it first:</p>
            <ul>
              <li><strong>Schema differences absorbed</strong> — confirm each dropped column is intentional.</li>
              <li><strong>Tables the new schema no longer has</strong> — those rows were <em>not</em> restored.</li>
            </ul>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">09</div>
          <div class="step-body">
            <p class="step-title">Bring Spring up and smoke test<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>docker compose up -d --build
curl -s https://spring.opencodingsociety.com/api/jokes/ | head -c 300</code></pre>
            <p>Then log in and confirm real user data is present. Compare <code>db_migrate.py status</code> against your step 1 numbers.</p>
          </div>
        </li>
      </ol>

      <div class="info-box success">
        <strong>Rollback is a file copy.</strong>
        <span>The backup is a complete database, so recovery does not need a script. Removing the stale <code>-wal</code> and <code>-shm</code> files matters — left behind, they can be replayed over the database you just restored.</span>
      </div>

      <pre><code>docker compose down
cp volumes/backups/sqlite_backup_&lt;ts&gt;.db volumes/sqlite.db
rm -f volumes/sqlite.db-wal volumes/sqlite.db-shm
docker compose up -d</code></pre>

      <h4>If you later move Spring to MySQL</h4>
      <p>Set <code>DB_URL</code> in <code>.env</code>, then run the MySQL phase below. Migrating the data across is the SQLite backup feeding <code>restore --keep-target-schema</code> after <code>init</code> has built the MySQL schema — the backup format is the same SQLite file either way. Treat that as its own change, on its own day, not bundled with a schema update.</p>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- SPRING - MYSQL                                                 -->
    <!-- ============================================================ -->
    <section id="spring-mysql">
      <p class="phase-label">Phase 01b · only once DB_URL is set</p>
      <h3 class="teal">Spring migration — MySQL</h3>

      <p>This is the procedure for when Spring actually runs on RDS. It does <strong>not</strong> apply while <code>DB_URL</code> is unset — the phase above is the live one. Keep this for when you make the move.</p>

      <ol class="steps">
        <li class="step">
          <div class="step-num">01</div>
          <div class="step-body">
            <p class="step-title">Pull production into a verified backup<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>source venv/bin/activate
python3 scripts/db_migrate.py backup</code></pre>
            <p>Writes <code>volumes/backups/mysql_backup_&lt;ts&gt;.db</code>. Note the exact filename — you need it in step 6.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">02</div>
          <div class="step-body">
            <p class="step-title">Gate — the backup must exit clean<span class="step-where">gate</span></p>
            <pre><code>echo $?   <span class="c"># must print 0</span></code></pre>
            <p>The summary must read <em>"All tables and all rows accounted for."</em> A non-zero exit lists every table that failed or came up short. Do not continue past this point on a failed backup — the rest of the phase destroys the only other copy.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">03</div>
          <div class="step-body">
            <p class="step-title">Copy the backup off cockpit<span class="step-where">dev machine</span></p>
            <pre><code>scp cockpit:~/open/spring/volumes/backups/mysql_backup_&lt;ts&gt;.db .</code></pre>
            <p>Optional but cheap. Point your local Spring at the copy and exercise the new code against real data before you commit to the production window.</p>
          </div>
        </li>

        <li class="step destructive">
          <div class="step-num">04</div>
          <div class="step-body">
            <p class="step-title">Take Spring down and update the code<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>docker compose down
git pull</code></pre>
            <p>Port 8585 must be free for the next step, which is why the container comes down first.</p>
          </div>
        </li>

        <li class="step destructive">
          <div class="step-num">05</div>
          <div class="step-body">
            <p class="step-title">Rebuild the MySQL schema with Hibernate<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>python3 scripts/db_migrate.py init</code></pre>
            <p>This drops and recreates every Hibernate-managed table on RDS — including the Envers <code>HT_*</code> / <code>HTE_*</code> audit tables and the <code>*_seq</code> id-allocation tables — and loads seed data. It boots Spring Boot temporarily with <code>ddl-auto=create</code>, so allow a few minutes. The DDL is native MySQL; no translation is involved.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">06</div>
          <div class="step-body">
            <p class="step-title">Load your data into the new schema<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>python3 scripts/db_migrate.py restore --keep-target-schema \
    --backup-file volumes/backups/mysql_backup_&lt;ts&gt;.db</code></pre>
            <p>Takes a <code>mysqldump</code> rollback point first, clears the seed rows, then loads the backup into the columns the old and new schemas share. Columns your schema change added are left at their defaults; columns it removed are listed explicitly.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">07</div>
          <div class="step-body">
            <p class="step-title">Gate — every table must reconcile<span class="step-where">gate</span></p>
            <p>Read the <strong>Restore Summary</strong>. It must end with <em>"All tables verified: MySQL row counts match the backup."</em> Review two lists before moving on:</p>
            <ul>
              <li><strong>Schema differences absorbed</strong> — confirm each dropped column really is intentional.</li>
              <li><strong>Tables the new schema no longer has</strong> — these rows were <em>not</em> restored. Confirm each removal is intentional.</li>
            </ul>
          </div>
        </li>

        <li class="step">
          <div class="step-num">08</div>
          <div class="step-body">
            <p class="step-title">Bring Spring back up<span class="step-where">cockpit · open/spring</span></p>
            <pre><code>docker compose up -d --build
docker compose logs -f --tail=100</code></pre>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">09</div>
          <div class="step-body">
            <p class="step-title">Smoke test<span class="step-where">gate</span></p>
            <pre><code>curl -s https://spring.opencodingsociety.com/api/jokes/ | head -c 300</code></pre>
            <p>Then log in through the frontend and open a Groups page to confirm JWT cookies work. Finally, <strong>save an audited entity</strong> — edit a person, say. That exercises the Envers <code>HTE_*</code> tables, which is exactly what the old restore destroyed.</p>
          </div>
        </li>
      </ol>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- FLASK                                                          -->
    <!-- ============================================================ -->
    <section id="flask">
      <p class="phase-label">Phase 02</p>
      <h3 class="orange">Flask migration</h3>

      <p>The order differs from Spring, and from the older README, for one reason: the pull cannot verify itself until production is serving the new export endpoints. So the code deploy comes first.</p>

      <div class="info-box info">
        <strong>Why code first.</strong>
        <span>The pull script calls <code>/api/export/counts</code> and the three new export endpoints. None of them exist on production until you deploy. Deploying the Flask code alone is non-destructive — the app only creates or drops tables when <code>db_init.py</code> is run explicitly — so this is safe.</span>
      </div>

      <ol class="steps">
        <li class="step">
          <div class="step-num">01</div>
          <div class="step-body">
            <p class="step-title">Deploy the code, but not the schema<span class="step-where">cockpit · open/flask</span></p>
            <pre><code>git pull
docker compose up -d --build</code></pre>
            <p>Do <strong>not</strong> run <code>db_init.py</code> yet. Production keeps its current data and simply gains the new endpoints.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">02</div>
          <div class="step-body">
            <p class="step-title">Gate — confirm the new endpoints are live<span class="step-where">gate</span></p>
            <p>Authenticate as the production admin, then hit <code>/api/export/counts</code>. It should return a count for all thirteen tables plus the two association tables. Keep this output — it is your before-picture.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">03</div>
          <div class="step-body">
            <p class="step-title">Pull production data to local<span class="step-where">dev machine · flask</span></p>
            <pre><code>python scripts/db_migrate-prod2sqlite.py</code></pre>
            <p>Fetches all thirteen tables, rebuilds the local schema, loads the data, then prints a production-vs-local reconciliation.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">04</div>
          <div class="step-body">
            <p class="step-title">Gate — the pull must exit clean<span class="step-where">gate</span></p>
            <pre><code>echo $?   <span class="c"># must print 0</span></code></pre>
            <p>Every table must read <code>ok</code>. Anything marked <code>MISSING</code> means those rows are not on your machine — and the next phase deletes them from production. The seed-user difference is accounted for automatically.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">05</div>
          <div class="step-body">
            <p class="step-title">Test locally<span class="step-where">dev machine · flask</span></p>
            <p>Run the app against the pulled data and exercise the areas your schema change touches. This is the last point where production is still intact.</p>
          </div>
        </li>

        <li class="step destructive">
          <div class="step-num">06</div>
          <div class="step-body">
            <p class="step-title">Apply the new schema to production<span class="step-where">cockpit · open/flask</span></p>
            <pre><code>python scripts/db_init.py</code></pre>
            <p>Takes a <code>mysqldump</code> to <code>instance/backups/</code> first and aborts if that fails. Then <code>drop_all()</code>, <code>create_all()</code>, and seed data. Note the dump path it prints.</p>
          </div>
        </li>

        <li class="step">
          <div class="step-num">07</div>
          <div class="step-body">
            <p class="step-title">Push your data back to production<span class="step-where">dev machine · flask</span></p>
            <pre><code>python scripts/db_restore-sqlite2prod.py</code></pre>
            <p>Uploads all thirteen types in dependency order, batching the large ones, then re-reads production's counts and prints a local-vs-production reconciliation.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">08</div>
          <div class="step-body">
            <p class="step-title">Gate — production must reconcile<span class="step-where">gate</span></p>
            <pre><code>echo $?   <span class="c"># must print 0</span></code></pre>
            <p>Rows marked <code>+N extra</code> on production are fine — that is seed data regenerated by <code>db_init.py</code>. Anything marked <code>MISSING</code> is not. Keep your local database until this passes; until then it is the only complete copy.</p>
          </div>
        </li>

        <li class="step verify">
          <div class="step-num">09</div>
          <div class="step-body">
            <p class="step-title">Smoke test<span class="step-where">gate</span></p>
            <p>Log in as a real (non-seed) user and confirm their profile, sections and grade data are intact. Load a leaderboard page and a page that reads skill snapshots — those are the three tables that previously would have come back empty.</p>
          </div>
        </li>
      </ol>

      <div class="info-box warning">
        <strong>Adding a new model?</strong>
        <span>It must be registered in three places or its data is lost on the next migration: <code>MIGRATED_MODELS</code> plus export/import endpoints in <code>api/data_export_import_api.py</code>, <code>EXPORT_ENDPOINTS</code> and a loader in <code>scripts/db_migrate-prod2sqlite.py</code>, and <code>IMPORT_ENDPOINTS</code> and a reader in <code>scripts/db_restore-sqlite2prod.py</code>. <code>/api/export/counts</code> is what catches the omission.</span>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- ROLLBACK                                                       -->
    <!-- ============================================================ -->
    <section id="rollback">
      <p class="phase-label">If it goes wrong</p>
      <h3 class="orange">Rollback</h3>

      <p>Three recovery points exist, in increasing order of blast radius. Use the narrowest one that covers the failure.</p>

      <h4>1 · The pre-drop dump (fastest)</h4>
      <p>Every destructive script writes one before it touches anything and prints the exact restore command. Spring's lands in <code>spring/volumes/backups/predrop_&lt;db&gt;_&lt;ts&gt;.sql</code>; Flask's in <code>flask/instance/backups/&lt;db&gt;_&lt;ts&gt;.sql</code>.</p>
      <pre><code>mysql -h &lt;host&gt; -P 3306 -u &lt;user&gt; -p &lt;database&gt; &lt; &lt;dump&gt;.sql</code></pre>

      <h4>2 · Rebuild Spring from the backup</h4>
      <p>Without <code>--keep-target-schema</code>, the restore rebuilds each table from the MySQL DDL recorded inside the backup — an exact reproduction of the source schema, not an approximation. On a SQLite target, rollback is the file copy shown in Phase 01 instead.</p>
      <pre><code>python3 scripts/db_migrate.py restore \
    --backup-file volumes/backups/mysql_backup_&lt;ts&gt;.db</code></pre>

      <h4>3 · The RDS snapshot</h4>
      <p>Restores the whole instance, both databases, to the moment before you started. Slow, and it discards anything written since — but it always works.</p>

      <div class="info-box success">
        <strong>One habit worth keeping.</strong>
        <span>The scripts now exit non-zero when a migration is incomplete, and all three READMEs describe where a new model must be registered. The reconciliation table is what turns "it printed Complete" into "every row is accounted for" — read it every time, not just this once.</span>
      </div>
    </section>

    <div class="runbook-footer">
      <p>The schema translators were verified against all 130 tables in <code>spring/schema_full.txt</code>; no script was executed against a live database during the audit. The same script set ships in <code>spring</code> and <code>spring-tracking</code> — all seven migration files are byte-identical between them, so a fix applied to one belongs in the other.</p>
    </div>

  </div>
</div>
