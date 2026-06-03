// assets/js/ocs-bot/collegeboard.js
// -----------------------------------------------------------------------------
// AP exam knowledge so the assistant can generate COURSE-CORRECT practice for the
// student's actual course. Grounded in the current (2026) College Board specs.
// CSP and CSA are AP exams; CSSE is NOT (no AP exam / no FRQ).
// -----------------------------------------------------------------------------

export const EXAM = {
  csp: {
    name: 'AP Computer Science Principles',
    isAP: true,
    structure:
      'Section I: 70 multiple-choice questions, 120 min, 70% of the score ' +
      '(57 single-select, 5 single-select with a reading passage about a computing ' +
      'innovation, 8 multi-select "choose 2"). Section II: the through-course Create ' +
      'Performance Task (a program the student builds) plus an end-of-course Written ' +
      'Response of 2 questions about the student\'s OWN Create program, 60 min with the ' +
      'Personalized Project Reference, 30%.',
    note:
      'AP CSP has no classic Java FRQ. The closest to "FRQ" practice is (a) exam-style ' +
      'MCQ drills and (b) Create-PT written-response prompts about the student\'s own program.',
    bigIdeas: ['Creative Development', 'Data', 'Algorithms & Programming',
               'Computer Systems & Networks', 'Impact of Computing'],
    practiceKinds: {
      mcq: 'an exam-style multiple-choice question (4 options) on a Big Idea, in CSP ' +
           'pseudocode or plain language',
      written: 'a Create-PT-style written response about the student\'s own program ' +
               '(purpose/function, a student-developed procedure with a parameter, the ' +
               'algorithm inside it, and how it was tested)',
      reading: 'a single-select question with a short reading passage about a computing ' +
               'innovation and its data/privacy impact',
    },
  },
  csa: {
    name: 'AP Computer Science A',
    isAP: true,
    structure:
      'Digital exam (Bluebook). Section I: 40 multiple-choice, 90 min, 55%. ' +
      'Section II: 4 free-response questions in Java, 90 min, 45%, all assessing "Develop Code".',
    frqTypes: [
      { id: 1, title: 'Methods and Control Structures',
        desc: 'Write 2 methods (or 1 constructor + 1 method) of a given class. Requires ' +
              'iterative and/or conditional statements and calls to methods in the class; ' +
              'one part typically requires String methods.' },
      { id: 2, title: 'Class Design',
        desc: 'Design and implement a full class from a written specification and a table ' +
              'of interactions (constructor, instance variables, methods). A second class ' +
              'may be involved.' },
      { id: 3, title: 'Data Analysis with ArrayList',
        desc: 'Write 1 method that uses, analyzes, and manipulates data stored in an ArrayList.' },
      { id: 4, title: '2D Array',
        desc: 'Write 1 method that uses, analyzes, and manipulates data stored in a 2D array.' },
    ],
    rubric:
      'Each FRQ is scored on a points-based rubric by trained readers (historically 9 ' +
      'points; the digital format weights them roughly 5-7 each). Points are awarded for ' +
      'specific code behaviors: correct method header/return type, correct loop/traversal, ' +
      'correct conditional logic, correct use of the required structure ' +
      '(String / ArrayList / 2D array), and a correct return value. Style is not graded; ' +
      'correctness and the required structures are.',
    units: ['Primitive Types', 'Using Objects', 'Boolean Expressions & if', 'Iteration',
            'Writing Classes', 'Array', 'ArrayList', '2D Array', 'Inheritance', 'Recursion'],
  },
  csse: {
    name: 'Computer Science Software Engineering (CSSE)',
    isAP: false,
    note:
      'CSSE is NOT an AP College Board exam course. There is no AP exam and no FRQ. For ' +
      'CSSE, help with the project/quest work, software-engineering practices (design, ' +
      'testing, deployment, code review), and the gamify / game-dev tracks instead.',
  },
};

export function courseExam(course) { return EXAM[(course || '').toLowerCase()] || null; }
export function isAPCourse(course) { const e = courseExam(course); return !!(e && e.isAP); }

const PRACTICE_RE = new RegExp(
  '\\b(practice|frq|free[- ]?response|mcq|multiple[- ]?choice|quiz(\\s*me)?|drill|mock|' +
  'sample (question|problem|exam)|test me|study (for|question)|exam (question|practice)|' +
  'give me (a|an|some)\\b.*\\b(question|problem|frq))\\b', 'i');

export function looksLikePractice(text) { return PRACTICE_RE.test(text || ''); }

// System-prompt block teaching the model how to generate course-correct practice for
// THIS student's course. Empty string if course unknown.
export function practicePrompt(course) {
  const e = courseExam(course);
  if (!e) return '';
  if (!e.isAP) {
    return 'PRACTICE/EXAM CONTEXT: ' + e.note + ' If the student asks for AP practice or ' +
           'an FRQ, gently explain CSSE has no AP exam and offer software-engineering / ' +
           'project practice instead.';
  }
  if (e === EXAM.csa) {
    const types = e.frqTypes.map((t) => `Q${t.id} ${t.title}: ${t.desc}`).join('\n  ');
    return [
      'PRACTICE MODE — ' + e.name + ' (the student\'s course).',
      'Exam: ' + e.structure,
      'The 4 FRQ types are:\n  ' + types,
      'Scoring: ' + e.rubric,
      'When the student asks for a practice FRQ: use the type they request (or pick one), ' +
      'and write a realistic Java FRQ in the official style — a short scenario, any needed ' +
      'class skeleton in a ```java code block, and a clear "Write the method ..." ' +
      'instruction with the exact signature. Do NOT reveal the solution yet. Offer to grade ' +
      'their attempt. When they submit code, score it point-by-point against a rubric, then ' +
      'show a model solution.',
    ].join('\n');
  }
  // CSP
  const kinds = Object.entries(e.practiceKinds).map(([k, v]) => `- ${k}: ${v}`).join('\n');
  return [
    'PRACTICE MODE — ' + e.name + ' (the student\'s course).',
    'Exam: ' + e.structure,
    e.note,
    'Big Ideas: ' + e.bigIdeas.join(', ') + '.',
    'Practice you can generate:\n' + kinds,
    'Default to one exam-style MCQ unless they ask for written-response or Create-PT ' +
    'practice. Reveal the answer and a one-line explanation only AFTER the student answers, ' +
    'and tie it to the relevant Big Idea.',
  ].join('\n');
}
