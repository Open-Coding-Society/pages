# Mission Tools AI NPC flow: completed challenge system, mission-level integration, and next-step roadmap

## Description
We have built out the first working version of the Mission Tools AI NPC experience and wired it into the CS pathway mission level. The work centers on a reusable AI challenge system that can generate a question, accept a student response, evaluate it, and feed the result back into level progression. The implementation is split between the reusable engine in [AiChallengeNpc.js](assets/js/GameEnginev1.1/essentials/AiChallengeNpc.js) and the mission-specific orchestration in [GameLevelCsPath2Mission.js](_projects/cs-pathway-game/levels/GameLevelCsPath2Mission.js).

The current state is more than a proof of concept: the mission level now has desk-specific AI knowledge, repeat-question protection, structured grading output, loading and error handling, and a visible mission scoreboard that updates when students solve challenges.

## User Story
As a student moving through the Mission Tools level, I want to interact with AI-powered desk NPCs that ask short, topic-specific questions, so that I can practice the relevant material, receive immediate feedback on my answer, and see my mission progress update as I complete each station.

## Technical Details
The reusable AI layer now handles the generic conversation and challenge pipeline. It builds the backend payload, posts to the AI endpoint, parses the response, and normalizes grading into a simple verdict plus feedback format. The mission level uses that layer instead of reimplementing AI logic per desk.

The mission-level implementation adds the following pieces:
- A desk knowledge base with topic-specific expertise and sample questions for The Admin, The Archivist, The SDLC Master, and The Scrum Master.
- Prompt templates for question generation and answer evaluation, including strict response formatting for grading.
- Challenge startup flow that opens the NPC UI, shows a loading message, restores pending work when needed, and arms the answer submission handler only after the question is ready.
- Retry and deduplication logic so the same desk does not keep repeating recent questions.
- In-world loading feedback through a toast-based “Desk AI is thinking...” state rather than a full-screen blocker.
- Chat history recording for both question and answer interactions.
- Progress tracking that awards completion only when a desk is solved correctly, with a lock that prevents repeat solves from counting until every station has been cleared once.
- A persistent mission scoreboard UI in the bottom-right corner that reflects the player’s progress.

The strongest completed work so far is the connection between the general-purpose AI NPC utility and the mission-specific progression system. In practice, that means the level now behaves like a playable challenge loop instead of just a static desk interaction.

## Future Plans
The next phase should focus on making the system more durable and more content-rich:
- Persist mission progress and desk state across reloads so a student can leave and return without losing challenge state.
- Expand the desk library with more mission stations or additional challenge variants per desk.
- Add a more deterministic fallback when the AI backend is unavailable, so the level still remains playable offline or during service failures.
- Improve answer evaluation reliability and add tests around repeat-question detection, progress gating, and pending challenge restoration.
- Add more polished UX feedback for success, failure, retry, and completion states.
- Consider analytics or event logging for mission usage so we can see where students struggle and where the challenge prompts need tuning.

## Suggested Acceptance Criteria
- Each mission desk can generate a unique AI question and accept a short answer.
- Correct answers advance mission progress and update the scoreboard.
- Previously solved desks do not double-count progress until all desks have been cleared once.
- The challenge UI shows loading, failure, and retry states clearly.
- Mission chat history remains available for review during the session.
- The level can recover a pending challenge when a desk is reopened.
