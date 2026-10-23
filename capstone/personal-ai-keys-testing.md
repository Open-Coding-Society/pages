# Personal AI keys: local verification

This feature is being tested on isolated `personal-ai-keys` branches. No commits or pushes
are required to test it. Existing runner-feedback work remains in its original checkout.

## What to verify

The Profile page has independent Gemini and Groq controls directly below the existing
Gist controls, using OCS styling. Inputs clear after successful or failed saves; status
never includes the stored key. Disconnecting one provider leaves the other connected.

Grading order: personal Gemini → personal Groq → system Gemini → system Groq, using the
submission author even when a teacher requests regrading. Missing keys or grading failure
must leave the submission saved for manual review.

## Repeatable automated checks

Executed October 14, 2026, against upstream Pages `8bb02a139` and Spring `1f9fb561`
plus the uncommitted `personal-ai-keys` changes:

| Check | Result |
| --- | --- |
| Spring compilation and complete test suite | PASS: 186 tests, zero failures/errors/skips |
| AI Profile behavior | PASS: 9 tests |
| Existing Gist Profile behavior | PASS: 5 tests |
| Existing creator dashboard | PASS: 4 tests |
| `bundle check` | PASS |
| Unchanged Makefile `make build` | PASS; required network access for the configured remote theme |
| Generated Profile HTML and SASS | Both provider controls and their styles were generated |

Spring's MVC tests actually send test GET/PUT/DELETE requests through its routing and JSON
serialization, using in-memory SQLite and mocked provider validation. They verify anonymous
JSON `401`, secret-free successful saves, rejection of request-body attempts to choose another
owner, invalid replacement preservation, `204` disconnect, and rejected origins/providers.
These are isolated MVC tests, not a running-backend or live-provider claim.

One sandbox rerun could not self-attach Mockito's agent. Rerunning with the installed
Byte Buddy agent explicitly supplied through Maven's `argLine` passed; no build configuration
was changed to work around the sandbox.

Run `node tests/test_ai_connections.mjs` from the Pages feature worktree for status, saves,
replacement failure, disconnect, missing server configuration, authentication failure,
and network-failure behavior. Existing Gist tests must also remain passing.

Spring tests cover encryption, owner/provider binding, migration, excluded credential
exports, metadata-only validation, exact fallback order, operational failures, safety
refusals, malformed output, original grading scale, submission identity verification,
teacher permissions, and keeping saved submissions when grading fails.

## Local acceptance and compatibility history

### Redesigned Profile integration — October 23, 2026

Integrated Pages upstream `9a29b407d` without restoring its retired Profile layout.
AI connection sources now live in `_projects/systems/profile/_includes/` and `js/`
and are published by the existing distribution manifest. The card follows the new
shared OCS grammar with no page stylesheet; it appears after Gist only when Spring
is enabled. The existing setup checklist is unchanged: personal AI keys are optional.

The source-layout checks cover both providers, independent forms, direct setup links,
baseurl-safe configuration injection and omission of all AI controls/starters on
Flask-only sites. The 25 Node tests and 5 layout tests pass. Spring was fast-forwarded
to `c1d576e6`, which already contains the backend feature; all 230 Spring tests pass.
Upstream's paused self-assessment behavior and submission-author validation are retained.
No encryption key, environment file, database or rubric was changed for this integration.

The Makefile build passed after publication of the final sources. An isolated Firefox
check with mocked API responses verified that saving a fake Gemini key shows connected
status, clears the input and reveals only Gemini's Disconnect button. Mobile browser
verification was blocked by repeated tool-approval timeouts; it is not claimed as passed.

### Current upstream integration — October 21, 2026

Integrated Pages `08fd2d85c` and Spring `e5a7650b` on the `personal-ai-keys` branches.
The SASS import conflict was resolved by retaining both upstream imports and the AI
connection import; upstream grading timestamps and queue behavior were preserved.
The complete Spring suite passed **226 tests**, with zero failures/errors/skips.
The **9 AI-profile and 5 Gist-profile tests**, `bundle check`, Makefile build, and
whitespace checks passed. Generated Profile HTML contains both direct key-creation links.

The user reported successful local testing after integration. This is user-reported
local acceptance, not an agent-observed production or exhaustive provider-path test.
Production configuration and acceptance checks remain required in Spring's
`docs/personal-ai-keys.md`.

### Upstream compatibility check — October 16, 2026

Integrated upstream Spring `e9009a54` into the uncommitted feature work, including
`a65ff9af`'s weighted-hack grading. The complete Spring suite passed: **195 tests,
zero failures, errors, or skips**. The 9 AI Profile and 5 existing Gist Profile tests
also passed. No real AI requests were made for this compatibility check.

Upstream's mock-HTTP weighted-grading tests remain in place, adapted to the provider
client constructor. Added integration cases verify that the submission author's routing
receives hack instructions, the weighted score overrides the model's overall score,
and a response missing required hack scores does not become a saved grade. A controlled
mock response yields `0.25` despite an overall `0.9`; this demonstrates the calculation,
not a real provider's judgment of the user's starter-code submission.

Existing local assignment data is not refreshed by a code update. The older rubric and
absent hack weights must be addressed through the existing authorized assignment-data
workflow before claiming a local/deployed grading comparison. No stored rubrics, grades,
credentials, or submissions were manually rewritten in this compatibility check.

Real provider key validation and a real local submission require supplied eligible,
school-approved test accounts/keys and local Spring configuration. Mocked results are not
evidence that these live paths passed. Do not paste keys into this report or source control.
Record sanitized provider selection, response status, and the saved submission ID only.

See Spring's `docs/personal-ai-keys.md` for the required configuration and production checklist.
Production rollout remains subject to school/provider eligibility and privacy review.
