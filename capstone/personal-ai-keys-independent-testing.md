# Independent test prompt: personal AI keys in the redesigned Profile

Please independently test this feature and write an evidence-based report. This is a
testing task, not permission to redesign, fix, commit, push, reopen a PR, or deploy anything.
Read each repository's `AGENTS.md` first. Ask about missing credentials or setup instead
of guessing. Keep unrelated work untouched and use local test data, never production.

## Context and exact code to test

OCS already has assignments, submissions, AI grading and personal GitHub Gist tokens.
This change adds optional personal Gemini/Groq keys and adapts their controls to the
new Profile system. An earlier Pages PR was closed because it targeted the retired UI.
The backend feature is already merged upstream; do not implement a second backend.

| Repository | Fetch from | Branch |
| --- | --- | --- |
| Pages | https://github.com/AAApages/AAApages.git | `personal-ai-keys` |
| Spring | https://github.com/AAApages/AAAspring.git | `personal-ai-keys` |
| Flask | Existing OCS Flask checkout | Its normal compatible branch; no AI-feature changes required |

Fetch these fork branches explicitly. Do not accidentally test Pages `main`, the old
Gist branch, or an unrelated local branch. If checkouts exist, use clean worktrees
rather than discarding edits or cloning over them. If they do not exist, clone the
two URLs above with `--branch personal-ai-keys` into new directories. Record each
repository's actual branch and full commit SHA before testing; ask if the working
tree is unexpectedly dirty. Do not merge newer upstream during this fixed-version test.

Canonical Pages sources:

- `_projects/systems/profile/layouts/profile.html`
- `_projects/systems/profile/_includes/profile-ai-connections.html`
- `_projects/systems/profile/js/ai-connections.js`

Root `_layouts/profile.html` and `assets/js/profile/` are generated copies, not edit
targets. Read `_projects/systems/profile/README.md` and Spring's
`docs/personal-ai-keys.md` for architecture and configuration details.

## Local setup

1. Follow the repositories' README setup using Java **21**, Node, Ruby/Bundler, and
   the Pages Python virtual environment/dependencies. Reuse working installations.
2. Use a local Spring database, not a production database URL. Do not run database-reset,
   reseeding, production-import, or production-export scripts. If no usable local test
   account/assignment exists, ask the owner for an approved fixture/setup procedure.
3. Use an ignored local Spring `.env` or runtime environment. Do not print existing
   secrets. Ensure these settings exist:

   | Setting | Purpose |
   | --- | --- |
   | `AI_KEY_ENCRYPTION_KEY` | Stable Base64-encoded 32-byte local encryption key |
   | `GROQ_GRADING_MODEL` | `qwen/qwen3.8-27b` matches the tested configuration; verify account access |
   | `jwt.cookie.secure=false` | Local HTTP cookies only, never a production recommendation |
   | `jwt.cookie.same-site=Lax` | Local cookie setting |
   | `GIST_TOKEN_ENCRYPTION_KEY` | Preserve the existing key if testing existing Gist connections |

   If an encryption key already exists, keep it. For a genuinely new local setup,
   generate one with `openssl rand -base64 32` and store it privately; never publish
   the output. System Gemini settings and optional `GROQ_API_KEY` are only needed for
   their respective system fallback paths. Check the configured Gemini model endpoint.

4. Run Spring from the tested checkout: `./mvnw spring-boot:run` (HTTP **8585**;
   websocket connector **8589**). Use the existing Flask README to start Flask on
   **8587**; ask for that checkout if unavailable. Do not invent a Flask run command.
5. Keep Pages `_config.yml` at `spring: true` for the normal test. Run `make` from the
   tested Pages checkout. Open **http://localhost:4500/profile**. Use `localhost`
   consistently for browser login and services; do not use a LAN hostname that could
   select production API URLs. Verify Network requests target local services.
6. Sign in through the local Pages login with an approved account present in both
   backends. A Flask login alone does not establish a Spring session. Obtain passwords
   privately from the owner, not source comments or guesswork.
7. Request eligible, school-approved test keys privately. Create keys at
   https://aistudio.google.com/api-keys and https://console.groq.com/keys if needed.
   Do not create provider accounts for ineligible users, enable billing, spend money,
   or use student-sensitive content without approval. If keys are unavailable, run
   mocks and mark live-provider tests BLOCKED, not passed.

## Automated checks

From Pages, run separately:

```bash
node tests/test_ai_connections.mjs
node tests/test_gist_connection.mjs
node tests/profile_model.test.mjs
bundle exec ruby tests/test_ai_profile_layout.rb
bundle check
make build
```

From Spring:

```bash
./mvnw clean compile
./mvnw test
```

Previous results were 25 Node tests, 5 layout tests, and 230 Spring tests. Rerun and
report your own results rather than copying these totals. These suites use mocks;
they do not prove live provider availability. If Mockito cannot attach in a sandbox,
report it and use the installed Byte Buddy agent only after checking its actual path.

## Browser and API checklist

Record PASS, FAIL or BLOCKED with expected versus actual behavior for each case.

1. **Profile regression:** the redesigned Account, Classes, Persona, Face ID and Gist
   controls remain present. AI appears after Gist, uses shared OCS styling, and is not
   a required Setup checklist item. Do not change a real user's UID or other profile
   settings just to test this feature.
2. **Responsive/accessibility:** check desktop and approximately 390px and 320px widths,
   keyboard focus, labels, readable status feedback, and no card/control overflow.
   Check both normal status and long model-configuration guidance. Mobile verification
   was not completed previously, so this is especially important.
3. **Independent saves:** save Gemini, then Groq. Each updates only its connection;
   neither submits the Account or Gist form. Inputs clear after success and failure.
   Connected status, Replace key and Disconnect appear correctly. Reload and confirm
   connections persist without revealing keys.
4. **Replacement/disconnection:** try a deliberately invalid replacement; the previous
   valid connection must remain. Disconnect one provider; the other stays connected.
   Disconnected buttons must be visually hidden. Reconnect only with owner approval.
5. **API boundaries:** authenticated `GET /api/ai-connections` returns availability and
   provider status/update times without credentials. Saves use
   `PUT /api/ai-connections/{gemini|groq}`; disconnect uses DELETE. Requests include
   credentials and `X-Origin: client`. Anonymous access is rejected. Use two isolated
   test accounts/sessions to confirm one user's connections do not appear for another.
   Never include PUT request bodies or cookie/header values in shared evidence.
6. **Gist regression:** with an approved test Gist connection, confirm connection status
   still loads. A code-submission smoke test also checks Gist export. Do not overwrite
   someone else's Gist token; use a dedicated account.
7. **Flask-only mode:** in an isolated Pages test worktree/configuration, temporarily
   use `spring: false`, rebuild and check `/profile`. AI and Gist cards/starters must be
   absent and Profile must not request `/api/ai-connections`. Restore the configuration
   afterward. Do not edit generated HTML to simulate this case.

## Grading smoke test and fallback

Use one approved local assignment and harmless test content. Label work
`PERSONAL AI KEY SMOKE TEST - <tester> - <date>`. Check that a submission record is
saved before judging whether grading succeeded. Do not create repeated duplicates;
reuse the record through authorized regrading when possible.

Expected order: **personal Gemini → personal Groq → system Gemini → system Groq**.
Credentials belong to the persisted submission author, not a teacher requesting regrade.
Group submissions use system credentials. No personal key is mandatory to save work.

- Run at most one initial live submission with an approved working key. Confirm the
  resulting saved grade/feedback, submitter, assignment and submission ID.
- With Gemini disconnected and Groq connected, verify personal Groq can be selected.
  This proves a missing-key transition, not a Gemini rate-limit transition.
- Test revoked keys, 402/429 responses, timeouts, outages, truncation, safety refusals,
  malformed output, exhaustion and group/teacher paths using existing mocked tests.
  Do not deliberately exhaust quota, revoke shared keys, or modify production settings.
  Report any extra live paths separately and obtain approval before spending quota.
- Operational failures advance fallback; safety refusals and invalid grading output
  stop the attempt. Complete failure must retain the submission for manual review.
- Do not expect an exact AI grade across repeated requests. Check rubric/weighted-score
  validation and persistence rather than treating a particular score as proof.

For local diagnostics, enable INFO for
`com.open.spring.mvc.aiconnections` and
`com.open.spring.mvc.assignments.AssignmentAiGradingService` in ignored local settings.
The controller/upload-service INFO loggers can confirm completed grade saves. Capture
only submission ID, provider/source, sanitized status/reason and persistence outcome;
provider-response receipt alone is not proof that a grade was saved.

## Deliverable

Return a Markdown report with commit SHAs, environment/ports, commands and actual test
counts, a PASS/FAIL/BLOCKED matrix, sanitized screenshots, and reproducible failures.
Separate automated/mocked results, your live observations and anything untested. Never
share API keys, cookies, JWTs, ciphertext, raw HAR files, or private student content.
Do not patch failures silently: identify the failing service/request/status and ask
before changing code. Do not commit, push, reopen PRs or deploy as part of this test.
