// ============================================================
//  frq.js — OOP: Free Response Question
//  Path: assets/js/bigsix/analytics/frq.js
//
//  Owns everything related to the FRQ step:
//    - Validating the student's answer before submission
//    - POSTing the question + answer to the grading endpoint
//    - Parsing the Gemini AI response
//    - Displaying feedback in the DOM
//    - Managing button disabled state during grading
//
//  EXPORTS:
//    FrqGrader
// ============================================================

export class FrqGrader {
  constructor(javaURI) {
    this.javaURI = javaURI;
  }

  // ============================================================
  //  ORCHESTRATOR — init
  //  Wires the grade button and coordinates the grading workflow.
  //  Called once on DOMContentLoaded.
  // ============================================================
  init() {
    const btn = document.getElementById('frq-grade-btn');
    const fb  = document.getElementById('frq-feedback');

    btn.addEventListener('click', async () => {
      const question = document.getElementById('frq-question').textContent.trim();
      const answer   = document.getElementById('frq-answer').value.trim();

      // Step 1: Validate — worker checks answer is non-empty
      if (!this.#validateAnswer(answer)) {
        fb.innerHTML = `<span style="color:var(--danger);">Please enter a response before grading.</span>`;
        return;
      }

      // Step 2: Set busy state — disable button, show loading text
      this.#setGradingState(btn, fb, true);

      try {
        // Step 3: Submit — worker POSTs to the grading endpoint
        const result = await this.#submitForGrading(question, answer);

        // Step 4: Parse — worker extracts and formats the feedback
        fb.innerHTML = this.#parseGeminiResponse(result);

      } catch (err) {
        fb.innerHTML = `<span style="color:var(--danger);">Grading error: ${err.message}</span>`;

      } finally {
        // Step 5: Always re-enable button whether grading succeeded or failed
        btn.disabled = false;
      }
    });
  }


  // ============================================================
  //  WORKER 1 — #validateAnswer
  //  Single responsibility: check the answer is non-empty.
  //  Pure function — no DOM access, easy to unit test.
  // ============================================================
  #validateAnswer(answer) {
    return answer.trim().length > 0;
  }


  // ============================================================
  //  WORKER 2 — #submitForGrading
  //  Single responsibility: POST question + answer to the grading
  //  endpoint and return the raw JSON response.
  //  Throws on any non-2xx so the caller can handle it.
  // ============================================================
  async #submitForGrading(question, answer) {
    const res = await fetch(`${this.javaURI}/api/gemini-frq/grade`, {
      method:      'POST',
      mode:        'cors',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ question, answer }),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return res.json();
  }


  // ============================================================
  //  WORKER 3 — #parseGeminiResponse
  //  Single responsibility: extract feedback text from the nested
  //  Gemini response and convert markdown to HTML.
  //  Pure function — no DOM access, no fetch calls.
  // ============================================================
  #parseGeminiResponse(result) {
    // Gemini nests the text at: candidates[0].content.parts[0].text
    const raw = result.candidates?.[0]?.content?.parts?.[0]?.text
      ?? 'No feedback returned.';

    // Convert **bold** markdown → <strong> and newlines → <br>
    return raw
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }


  // ============================================================
  //  WORKER 4 — #setGradingState
  //  Single responsibility: update button + feedback area to reflect
  //  whether grading is in progress or complete.
  // ============================================================
  #setGradingState(btn, fb, busy, msg = 'Grading…') {
    btn.disabled = busy;
    if (busy) fb.innerHTML = msg;
  }
}
