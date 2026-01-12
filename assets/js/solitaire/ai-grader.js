// assets/js/solitaire/ai-grader.js
// Client-only Gemini reflection grader that plugs into .lesson-quiz
// Saves results in localStorage keyed by path.

function readLessonConfig() {
  try {
    const el = document.getElementById("lesson-config");
    return el ? JSON.parse(el.textContent || "{}") : null;
  } catch { return null; }
}

function extractKeyPointsFromDOM() {
  const root = document.querySelector(".post-content");
  if (!root) return [];
  const headings = Array.from(root.querySelectorAll("h2,h3"));
  const want = /key\s*points|takeaways|what\s*you\s*learned|summary/i;

  let list = null;
  const targetHeading = headings.find(h => want.test((h.textContent || "")));
  if (targetHeading) {
    let n = targetHeading.nextElementSibling;
    while (n && !/UL|OL/.test(n.tagName)) n = n.nextElementSibling;
    if (n && /UL|OL/.test(n.tagName)) list = n;
  }
  if (!list) list = root.querySelector("ul,ol");
  if (!list) return [];
  return Array.from(list.querySelectorAll("li"))
    .map(li => li.innerText.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function getRubricDefault() {
  return [
    "definitions_or_vocabulary",
    "examples_or_code_snippets",
    "accuracy_of_explanations",
    "ties_to_lesson_objectives"
  ];
}

function gatherLessonSignals() {
  const cfg = readLessonConfig() || {};
  const lessonEl = document.querySelector(".post-content");
  const lessonText = lessonEl ? lessonEl.innerText : "";
  const title = (document.querySelector(".lesson-content h1")?.innerText || "").trim()
            || cfg.title || document.title;
  const model = cfg.model || "gemini-1.5-flash";
  return { lessonText, title, model };
}


// Use FULL lesson content as the rubric/ground truth.
function buildScoringPrompt({ lessonText, responseText, title }) {
  return `
You are grading a student's short reflection after a lesson titled: "${title}".

Use the ENTIRE LESSON_CONTENT below as the rubric/ground truth. Do not use any external knowledge.
Derive what "good" looks like directly from this content and grade the student only on that basis.

Return STRICT JSON with:
- "score": integer 0–100 (basic = 0–39, emerging = 40–59, proficient = 60–84, advanced = 85–100)
- "reasoning": 1–3 sentences, concise and specific
- "tips": 2–4 concrete improvement tips as an array of short strings
- "rubricCriteria": 2–6 short labels you derive from the LESSON_CONTENT (e.g., "key_concepts", "worked_examples", "correct_explanations", "application_to_problem")

Be strict on correctness and specificity. Reward responses that reflect this particular lesson; penalize vague or off-topic statements.

LESSON_CONTENT:
"""${(lessonText || "").slice(0, 60000)}"""

STUDENT_RESPONSE:
"""${(responseText || "").slice(0, 4000)}"""
  `.trim();
}


function getApiKey() {
  const input = document.getElementById("gemini-key");
  if (input && input.value.trim()) return input.value.trim();
  const meta = document.querySelector('meta[name="gemini-api-key"]');
  return meta?.content?.trim() || "";
}

function getLessonAndResponse() {
  const lessonEl = document.querySelector(".post-content");
  const reflectionEl = document.getElementById("reflection-box");
  return {
    lessonText: lessonEl ? lessonEl.innerText : "",
    responseText: reflectionEl ? reflectionEl.value.trim() : ""
  };
}

(function attachScoringUI() {
  // Add a button + output only if the quiz block exists
  const quiz = document.querySelector(".lesson-quiz");
  if (!quiz) return;
  // If the layout already includes a button/output, don't duplicate.
  if (!document.getElementById("score-reflection")) {
    const btn = document.createElement("button");
    btn.id = "score-reflection";
    btn.className = "btn";
    btn.textContent = "🤖 Get AI Score";
    quiz.appendChild(btn);
  }
  if (!document.getElementById("ai-score-output")) {
    const out = document.createElement("div");
    out.id = "ai-score-output";
    out.style.marginTop = ".5rem";
    quiz.appendChild(out);
  }
})();

async function backoffFetch(url, options, retries = 2, baseDelayMs = 1200) {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url, options);
    if (res.status !== 429) return res;
    if (i === retries) return res;
    await new Promise(r => setTimeout(r, baseDelayMs * (i + 1)));
  }
}

async function scoreWithGemini(apiKey, promptText, model = "gemini-1.5-flash") {
  if (!apiKey) throw new Error("Missing Gemini API key.");
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=` +
    encodeURIComponent(apiKey);
  const body = {
    contents: [{ role: "user", parts: [{ text: promptText }]}],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 400,
      responseMimeType: "application/json"
    }
  };
  const res = await backoffFetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res?.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Gemini error (${res?.status || "?"}): ${txt || res?.statusText || "Unknown error"}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  const clean = jsonStart !== -1 ? text.slice(jsonStart, jsonEnd + 1) : "{}";
  return JSON.parse(clean);
}

function persistScore(lessonKey, payload) {
  const key = `score-${lessonKey}`;
  const record = { ...payload, ts: Date.now(), rubricVersion: 1 };
  localStorage.setItem(key, JSON.stringify(record));
  return record;
}

function renderScore(targetEl, payload) {
  targetEl.innerHTML = `
    <div style="background:#1f2020;border:1px solid #333;border-radius:8px;padding:12px;">
      <strong>AI Score:</strong> ${payload.score}/100
      <div style="opacity:.85;margin-top:.25rem">${payload.reasoning || ""}</div>
      ${
        Array.isArray(payload.tips) && payload.tips.length
          ? `<div style="margin-top:.5rem"><em>Tips:</em><ul>${
              payload.tips.map(t => `<li>${t}</li>`).join("")
            }</ul></div>`
          : ""
      }
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const scoreBtn = document.getElementById("score-reflection");
  const out = document.getElementById("ai-score-output");
  if (!scoreBtn || !out) return;

  // Show any previous score for this lesson
  const current = window.location.pathname.split("/").pop() || window.location.pathname;
  const existing = localStorage.getItem(`score-${current}`);
  if (existing) {
    try { renderScore(out, JSON.parse(existing)); } catch {}
  }

  scoreBtn.addEventListener("click", async () => {
    out.textContent = "Scoring with Gemini…";
    try {
      const apiKey = getApiKey();
      const { lessonText, responseText } = getLessonAndResponse();
      if (!responseText) throw new Error("Please write your reflection first.");

      const signals = gatherLessonSignals();
      const promptText = buildScoringPrompt({
        lessonText,
        responseText,
        title: signals.title
      });
      const result = await scoreWithGemini(apiKey, promptText, signals.model);

      const payload = {
        score: Math.max(0, Math.min(100, parseInt(result.score ?? 0, 10))),
        reasoning: String(result.reasoning ?? ""),
        tips: Array.isArray(result.tips) ? result.tips.slice(0, 4).map(String) : [],
        rubricCriteria: Array.isArray(result.rubricCriteria) ? result.rubricCriteria : []
      };
      const saved = persistScore(current, payload);
      renderScore(out, saved);
    } catch (err) {
      out.textContent = "❌ " + (err?.message || err);
    }
  });
});
