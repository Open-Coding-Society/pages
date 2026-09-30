---
layout: post
assignment: true
points: 1
assignment_submission_type: code
assignment_creator_uids:
  - "psai-github"
title: SASS Inputs
description: Learn the OCS SASS input grammar and refactor hardcoded input styles into reusable classes.
categories: [SASS, Inputs]
lesson_language: SASS
lesson_topic: Inputs
lesson_source: OCS
lesson_type: lesson
codemirror: true
microblog: true
permalink: /sass/inputs/
author: Open Coding Society
---

# OCS SASS Inputs — PVO

## 1. Reference Guide

### Key Vocabulary

| Term | Meaning |
| --- | --- |
| **Input** | A control that lets a user enter or select data. |
| **Value** | The data currently stored in an input. |
| **Placeholder** | A short hint shown when an input is empty. |
| **Label** | Text that identifies what an input is asking for. |
| **Modifier** | A reusable class such as `small`, `medium`, `large`, or `gradient` that changes an input's appearance. |
| **Submit** | An action that sends or processes the user's current input values. |

### Input Anatomy

An HTML `<input>` is a form control that lets a user give data to a web page.

The most important pieces are:

| Part | What it does |
| --- | --- |
| `type` | Chooses the kind of input, such as `text`, `email`, `number`, or `password`. |
| `value` | The data currently stored in the input. In JavaScript, `input.value` is normally a string. |
| `placeholder` | A short hint shown when the field is empty. It is not a replacement for a real label. |
| `name` | The key used when a traditional HTML form submits the field. |
| `class` | Controls reusable styling. In this lesson we use the OCS SASS input grammar. |

A simple input looks like this:

```html
<label for="student-name">Name</label>
<input
  id="student-name"
  name="resourceRequest"
  type="text"
  class="ocs__input medium"
  placeholder="Enter your name"
>
```

**HTML defines the input, SASS styles it, and JavaScript reads its value.**

### OCS Input Grammar

| Class / Modifier | Purpose | Example |
| --- | --- | --- |
| `ocs__input` | Base input role | `<input class="ocs__input">` |
| `small` | Compact input | `<input class="ocs__input small">` |
| `medium` | Standard input size | `<input class="ocs__input medium">` |
| `large` | Large input | `<input class="ocs__input large">` |
| `gradient` | Gradient style | `<input class="ocs__input gradient">` |

Modifiers can be combined:

```html
<input
  type="text"
  class="ocs__input large gradient"
  placeholder="Assistance Category"
>
```


## 2. LxD Cycle Process

### Empathize

The [Poway Veterans Organization assistance form](https://powayveterans.org/request-assistance/) collects information such as a veteran's name, contact information, branch of service, and needs. A visitor must be able to understand each field quickly and enter information without fighting inconsistent styling.

**Reference problem:** if every field is styled differently with inline CSS or one-off classes, the form becomes harder to maintain and less consistent for the people using it.

### Define

- **POV:** PVO visitors need clear, consistent input fields because they may be entering important assistance or volunteer information and should not have to relearn the interface from field to field.
- **Learning Goal:** Students will build and style PVO-themed input controls with reusable OCS SASS classes, then connect the same user-input idea to AP CSP pseudocode.

### Ideate

**How might we** make PVO forms consistent while keeping the HTML simple?

Students will use one base class, a small set of modifiers, labels, and a submit interaction instead of writing custom styles for each field.

### Prototype

Build the interface in small steps:
1. one styled input;
2. an input with a size/style modifier;
3. an input plus a button and output;
4. the same interaction represented in College Board pseudocode.

### Test

Press **Run**, enter several different values, test an empty value, change the modifier classes, and check that the label, input, button, and output still make sense together.

---

## 3. College Board Requirements

AP Computer Science Principles includes the learning objective **CRD-2.F: "Design a program and its user interface."** The framework also describes user interactions as part of program requirements and notes that UI-layout diagrams can be part of program design.

**How this lesson connects:** the PVO examples require students to decide what information a user enters, how the input is presented, what happens when Submit is pressed, and what output appears afterward. The SASS controls presentation; the program logic controls the interaction.

### PVO UI Plan

```text
PVO visitor
    |
    v
[ Resource / volunteer input ]
    |
    v
[ Submit button ]
    |
    v
[ Program reads the value ]
    |
    v
[ Helpful result shown to user ]
```

---

## 4. Lesson Plan

**Learning Objective:** By the end of this lesson, you will be able to create PVO-themed input interfaces using `ocs__input` and explain how the same interaction is represented with College Board `INPUT()` and `DISPLAY()` pseudocode.

**Success Criteria:** You can:
- choose an appropriate HTML input type;
- apply `ocs__input` with the correct modifier;
- connect an input to a submit action;
- explain the difference between HTML, SASS, JavaScript, and pseudocode;
- complete the PVO homework without inline styles.

---

## 5. Tech Talk and Code Examples

### Tech Talk

**College Board idea:** a user interface is part of program design. In this lesson, the input is the part where the user gives information to the program.

- **HTML** creates the input, label, and button.
- **SASS** controls reusable visual styling.
- **JavaScript** reads browser input values and reacts to Submit.
- **AP CSP pseudocode** represents the same idea more generally with `INPUT()` and `DISPLAY()`.

**The Rule:** use the OCS input grammar instead of writing a new style for each PVO field.

- ✅ Do this: `<input type="text" class="ocs__input medium" placeholder="Resource needed">`
- ❌ Don't do this: `<input type="text" style="width:300px;padding:8px" placeholder="Resource needed">`


### Code Examples

#### A. Simple: Base Input

```html
<input type="text" class="ocs__input" placeholder="Veteran resource needed">
```

#### B. Intermediate: Size Modifiers

```html
<input type="text" class="ocs__input small" placeholder="Volunteer first name">
<input type="text" class="ocs__input large" placeholder="Search PVO resources...">
```

#### C. Complex: Combined Modifiers

```html
<input type="text" class="ocs__input large gradient" placeholder="Assistance category">
```

### Interactive UI Runner: Read an Input Value

This runner creates a real text input. Click **Run**, type into the rendered field, and watch JavaScript read the input's `.value`.

{% capture input_value_challenge %}
Run the example, type a PVO resource need into the input, and observe how the displayed value changes. Then edit the placeholder or size modifier and run it again.
{% endcapture %}

{% capture input_value_code %}
outputElement.innerHTML =
  '<div class="ocs__card">' +
    '<label for="input-value-demo">PVO resource</label>' +
    '<input id="input-value-demo" name="resourceRequest" type="text" class="ocs__input medium" placeholder="Type a resource, such as transportation">' +
    '<p id="input-value-result">Current value: ""</p>' +
  '</div>';

const field = outputElement.querySelector('#input-value-demo');
const result = outputElement.querySelector('#input-value-result');

field.addEventListener('input', () => {
  result.textContent = 'Current value: "' + field.value + '"';
});
{% endcapture %}

{% include runners/ui.html
   runner_id="sass-input-value-demo"
   challenge=input_value_challenge
   code=input_value_code
   height="300px"
   output_height="220px"
   autostart="true"
%}

### Interactive UI Runner: Test OCS Input Classes

This runner is useful for teaching the SASS part of the lesson. Change `sizeClass` to `small`, `medium`, or `large`; toggle `useGradient`; then click **Run**.

{% capture input_style_challenge %}
Experiment with the OCS input modifiers. Change the size and gradient setting, run the code, and compare the rendered input.
{% endcapture %}

{% capture input_style_code %}
outputElement.innerHTML = '';

const sizeClass = 'large';
const useGradient = true;

const label = document.createElement('label');
label.textContent = 'Volunteer email';
label.setAttribute('for', 'styled-input-demo');

const input = document.createElement('input');
input.id = 'styled-input-demo';
input.type = 'email';
input.placeholder = 'volunteer@example.com';
input.className = 'ocs__input ' + sizeClass + (useGradient ? ' gradient' : '');

const info = document.createElement('p');
info.textContent = 'Classes: ' + input.className;

outputElement.append(label, document.createElement('br'), input, info);
{% endcapture %}

{% include runners/ui.html
   runner_id="sass-input-style-demo"
   challenge=input_style_challenge
   code=input_style_code
   height="300px"
   output_height="220px"
   autostart="true"
%}

### Interactive UI Runner: Input + Button

This example shows the full flow: the user types data into an input, clicks a button, and JavaScript reads the value.

{% capture input_submit_challenge %}
Type a volunteer skill and click the rendered Submit button. Change the input type or size class and run the example again.
{% endcapture %}

{% capture input_submit_code %}
outputElement.innerHTML =
  '<div class="ocs__card">' +
    '<label for="message-input-demo">Volunteer skill</label>' +
    '<input id="message-input-demo" type="text" class="ocs__input medium" placeholder="Enter a skill, such as painting">' +
    '<button id="message-submit-demo" type="button" class="ocs__btn fill">Submit</button>' +
    '<p id="message-output-demo">No skill submitted yet.</p>' +
  '</div>';

const input = outputElement.querySelector('#message-input-demo');
const button = outputElement.querySelector('#message-submit-demo');
const message = outputElement.querySelector('#message-output-demo');

button.addEventListener('click', () => {
  message.textContent = input.value
    ? 'Submitted value: "' + input.value + '"'
    : 'Enter a value first.';
});
{% endcapture %}

{% include runners/ui.html
   runner_id="sass-input-submit-demo"
   challenge=input_submit_challenge
   code=input_submit_code
   height="320px"
   output_height="240px"
   autostart="true"
%}

### Code Runner: Input Values Are Strings

The visual runners show the browser control. This JavaScript Code Runner explains what happens to the data after it is read. Edit `rawAge` and click **Run**.

{% capture input_string_challenge %}
Change rawAge, run the code, and explain why Number(rawAge) is useful after reading a numeric value from an HTML input.
{% endcapture %}

{% capture input_string_code %}
const rawAge = "16";

console.log("Raw input value:", rawAge);
console.log("Raw type:", typeof rawAge);

const age = Number(rawAge);
console.log("Converted value:", age);
console.log("Converted type:", typeof age);
console.log("Next year:", age + 1);
{% endcapture %}

{% include runners/code.html
   runner_id="sass-input-string-demo"
   language="javascript"
   challenge=input_string_challenge
   code=input_string_code
%}

### Code Runner: Validate User Input

This example shows a common next step after collecting input: checking whether the value is acceptable.

{% capture input_validation_challenge %}
Try several emailValue strings and run the code. What makes the simple validation pass or fail?
{% endcapture %}

{% capture input_validation_code %}
const emailValue = "volunteer@example.com";

if (emailValue.trim() === "") {
  console.log("Please enter an email address.");
} else if (!emailValue.includes("@")) {
  console.log("That does not look like an email address.");
} else {
  console.log("Accepted:", emailValue);
}
{% endcapture %}

{% include runners/code.html
   runner_id="sass-input-validation-demo"
   language="javascript"
   challenge=input_validation_challenge
   code=input_validation_code
%}

### College Board Pseudocode Example

In AP CSP pseudocode, `INPUT()` gets data from the user and `DISPLAY()` shows output. This is the same interaction as the PVO HTML/SASS example, expressed without browser-specific code.

{% capture input_pseudocode_example %}
resource ← INPUT("What PVO resource are you looking for?")
DISPLAY("Searching PVO resources for: " + resource)
{% endcapture %}

{% include runners/code.html
   runner_id="sass-input-pseudocode-demo"
   language="pseudocode"
   code=input_pseudocode_example
%}

### Accessibility Tips

- Prefer a visible `<label>` for form fields.
- If a visible label is not available, provide an appropriate accessible name such as `aria-label`.
- Keep keyboard focus visible.
- Use the correct input `type` such as `email`, `number`, or `password` when appropriate.

---

## 6. Submit Details and Homework

### Submit Details

1. Create a notebook in your portfolio homework area: `_notebooks/homework`.
2. Add a markdown cell with the frontmatter below.
3. Add code cells for the Popcorn Hack and Homework Hack.
4. Keep `%%html` and the `UI_RUNNER` comment in each code cell.
5. Run each cell and verify the rendered result before submitting.

```raw
---
layout: post
title: SASS Inputs HW
categories: [SASS]
lesson_language: SASS
lesson_topic: Inputs HW
lesson_part: interactive
lesson_type: lesson
permalink: /sass/inputs-hw/
author: githubID
---
```

### Submission Safety Rules

> [!IMPORTANT]
> - Submit only your final class-based input markup for each hack.
> - Do not add custom CSS, inline styles, or made-up classes.
> - Keep `%%html` and the `UI_RUNNER` comment line in each notebook submission cell.
> - For new code, use `ocs__input` with the allowed modifiers: `small`, `medium`, `large`, and `gradient`.

### Popcorn Hack (In-Class)

> [!TIP]
> **2-minute challenge:** refactor the code, run it, and submit only the corrected markup.

**Task:** Replace the inline styling and made-up class below with the OCS input grammar.

```html
%%html
<!-- UI_RUNNER: Inputs Popcorn Base -->

<input type="text" style="width: 400px; border: 3px dashed purple;" placeholder="Search PVO resources...">
<input type="text" class="box" placeholder="Volunteer First Name">
```

**Expected direction:** one large, gradient-styled input and one compact plain input, both using `ocs__input`.

### Homework Hack

**Task:** Refactor this signup form. Remove all inline styles and made-up classes. Use `ocs__input` with the appropriate size and style modifiers, then run it with `UI_RUNNER`.

```html
%%html
<!-- UI_RUNNER: Inputs Homework Base -->

<input type="text" style="width: 500px; background: linear-gradient(to right, pink, purple);" placeholder="Assistance Category">
<input type="text" class="tinybox" placeholder="Volunteer First Name">
<input type="email" style="padding: 6px;" placeholder="Volunteer Email">
```

---

## Grading (1 Point Total)

### Classroom Rubric

- **0.2 points — Popcorn completion:** Student submitted a class-based refactor attempt and kept the code runnable with `%%html`.
- **0.8 points — Homework completion:**
  - **0.4 — input grammar:** Every input uses `ocs__input` with an appropriate size modifier.
  - **0.3 — style modifier:** The gradient field uses `gradient` instead of inline background or border styling.
  - **0.1 — accessibility:** Every input has a clear purpose through a label, placeholder, or accessible name.

### Quick Validation Checklist

- Present: `%%html` and the `UI_RUNNER` comment line in homework notebook cells.
- Absent: inline `style` attributes and made-up classes.
- Present: `ocs__input` on each submitted input.
- Present: appropriate `small`, `medium`, or `large` modifiers.
- Present: `gradient` where decorative gradient styling is required.

---

---

## 7. References

- [College Board — AP Computer Science Principles Course and Exam Description](https://apcentral.collegeboard.org/media/pdf/ap-computer-science-principles-course-and-exam-description.pdf)
- [College Board — AP Computer Science Principles course page](https://apcentral.collegeboard.org/courses/ap-computer-science-principles)
- [MDN — HTML input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)
- [Poway Veterans Organization](https://powayveterans.org/)
- [PVO — Apply for Assistance](https://powayveterans.org/request-assistance/)
