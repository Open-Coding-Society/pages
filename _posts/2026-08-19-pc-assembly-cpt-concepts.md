---
layout: post
codemirror: true
title: "PC Assembly: Create Performance Task Concepts"
description: Learn every AP CSP Create Performance Task concept through one PC assembly theme.
permalink: /pc-assembly
search_exclude: false
---

# PC Assembly: Create Performance Task Concepts

**Team:** Adhvay Iyer, Rohan Chandra, Ishan Shrivastava, Ishan Jha, Ishan Khandelwal, and Vayun Shekhar

This notebook uses one theme throughout: assembling the parts of a desktop computer in the correct order. The user chooses a component and its destination. A correct component snaps into place; an incorrect component returns to the parts tray. Every example below connects that program idea to a CPT requirement.

# Code Runner Concepts

Each runner starts in College Board pseudocode. Use the language dropdown to switch the entire example between Pseudocode, Python, and Java. Each language keeps its own edited draft while you switch.

---

## Output

**CPT Requirement:** Your program must produce output visible to the user. College Board pseudocode uses `DISPLAY()` to show results. In the PC assembly program, output tells the builder which part is next and whether a placement was correct.

{% capture pc_output_challenge %}
Display the current PC part and where it should be installed.
{% endcapture %}

{% capture pc_output_code %}
currentPart ← "CPU"
targetSlot ← "CPU socket"

DISPLAY("Current part: " + currentPart)
DISPLAY("Install in: " + targetSlot)
{% endcapture %}

{% include runners/code.html
  runner_id="pc-output"
  language="pseudocode"
  variants_key="output"
  local_python=true
  challenge=pc_output_challenge
  code=pc_output_code
  height="220px"
%}

**Expected output**

```text
Current part: CPU
Install in: CPU socket
```

---

## Input

**CPT Requirement:** Your program must get input from the user. College Board pseudocode uses `INPUT()` to collect data. In this project, the builder supplies a part and a destination.

{% capture pc_input_challenge %}
Ask the builder to choose a PC part and its destination, then display both choices.
{% endcapture %}

{% capture pc_input_code %}
selectedPart ← INPUT("Choose a PC part:")
selectedSlot ← INPUT("Choose its destination:")

DISPLAY("Selected part: " + selectedPart)
DISPLAY("Selected destination: " + selectedSlot)
{% endcapture %}

{% include runners/code.html
  runner_id="pc-input"
  language="pseudocode"
  variants_key="input"
  local_python=true
  challenge=pc_input_challenge
  code=pc_input_code
  height="230px"
%}

**Example output (if the user chose "CPU" and "CPU socket")**

```text
Selected part: CPU
Selected destination: CPU socket
```

---

## List

**CPT Requirement:** Your program must use a list to manage multiple related values. The ordered `parts` list stores every component without requiring a separate variable for each one. College Board pseudocode lists begin at index 1.

{% capture pc_list_challenge %}
Store the PC components in assembly order and display each component with a loop.
{% endcapture %}

{% capture pc_list_code %}
parts ← ["CPU", "RAM", "M.2 SSD", "CPU cooler", "Power supply", "Motherboard", "Graphics card", "Power cables"]

DISPLAY("Parts in this build: " + LENGTH(parts))

FOR EACH part IN parts
{
  DISPLAY(part)
}
{% endcapture %}

{% include runners/code.html
  runner_id="pc-list"
  language="pseudocode"
  variants_key="list"
  local_python=true
  challenge=pc_list_challenge
  code=pc_list_code
  height="300px"
%}

**Expected output**

```text
Parts in this build: 8
CPU
RAM
M.2 SSD
CPU cooler
Power supply
Motherboard
Graphics card
Power cables
```

---

## Procedure

**CPT Requirement:** You must create at least one student-developed procedure with parameters. The procedure must be called and contribute to the program. This procedure accepts a part and a target, then returns whether they match.

{% capture pc_procedure_challenge %}
Create and call a procedure that checks whether the CPU was placed in the CPU socket.
{% endcapture %}

{% capture pc_procedure_code %}
PROCEDURE isCorrectTarget(partName, targetName)
{
  RETURN(partName = "CPU" AND targetName = "CPU socket")
}

correctPlacement ← isCorrectTarget("CPU", "CPU socket")
DISPLAY("Correct placement: " + correctPlacement)
{% endcapture %}

{% include runners/code.html
   runner_id="pc-procedure"
   language="pseudocode"
   variants_key="procedure"
   local_python=true
   challenge=pc_procedure_challenge
   code=pc_procedure_code
   height="390px"
%}

**Expected output**

```text
Correct placement: true
```

---

## Sequence

**CPT Concept:** Sequencing means statements execute in order. A PC must also be assembled in a sensible order: prepare the motherboard, mount it, and then connect the remaining components.

{% capture pc_sequence_challenge %}
Display four motherboard-preparation steps in the order they occur.
{% endcapture %}

{% capture pc_sequence_code %}
step ← 1
DISPLAY("Step " + step + ": Seat the CPU")

step ← step + 1
DISPLAY("Step " + step + ": Install the RAM")

step ← step + 1
DISPLAY("Step " + step + ": Install the M.2 SSD")

step ← step + 1
DISPLAY("Step " + step + ": Mount the CPU cooler")
{% endcapture %}

{% include runners/code.html
  runner_id="pc-sequence"
  language="pseudocode"
  variants_key="sequence"
  local_python=true
  challenge=pc_sequence_challenge
  code=pc_sequence_code
  height="330px"
%}

**Expected output**

```text
Step 1: Seat the CPU
Step 2: Install the RAM
Step 3: Install the M.2 SSD
Step 4: Mount the CPU cooler
```

---

## Selection

**CPT Requirement:** Your algorithm must include selection with `IF` or `IF/ELSE`. Selection lets the program keep a correct part in place or return an incorrect part to the tray.

{% capture pc_selection_challenge %}
Check a selected component. If it is the expected part, snap it in; otherwise return it to the tray.
{% endcapture %}

{% capture pc_selection_code %}
expectedPart ← "CPU"
selectedPart ← INPUT("Choose the first part:")

IF (selectedPart = expectedPart)
{
  DISPLAY("Correct! " + selectedPart + " snapped into place.")
}
ELSE
{
  DISPLAY("Incorrect. " + selectedPart + " returned to the parts tray.")
  DISPLAY("Install " + expectedPart + " first.")
}
{% endcapture %}

{% include runners/code.html
   runner_id="pc-selection"
   language="pseudocode"
   variants_key="selection"
   local_python=true
   challenge=pc_selection_challenge
   code=pc_selection_code
   height="360px"
%}

**Example output (if the user selected "CPU")**

```text
Correct! CPU snapped into place.
```

---

## Iteration

**CPT Requirement:** Your algorithm must include iteration using a loop. Iteration lets one block of code process every PC component instead of repeating similar statements eight times.

{% capture pc_iteration_challenge %}
Loop through the ordered parts list and display one installation instruction for each component.
{% endcapture %}

{% capture pc_iteration_code %}
parts ← ["CPU", "RAM", "M.2 SSD", "CPU cooler", "Power supply", "Motherboard", "Graphics card", "Power cables"]
step ← 1

FOR EACH part IN parts
{
  DISPLAY("Step " + step + ": Install " + part)
  step ← step + 1
}
{% endcapture %}

{% include runners/code.html
  runner_id="pc-iteration"
  language="pseudocode"
  variants_key="iteration"
  local_python=true
  challenge=pc_iteration_challenge
  code=pc_iteration_code
  height="320px"
%}

**Expected output**

```text
Step 1: Install CPU
Step 2: Install RAM
Step 3: Install M.2 SSD
Step 4: Install CPU cooler
Step 5: Install Power supply
Step 6: Install Motherboard
Step 7: Install Graphics card
Step 8: Install Power cables
```

---

## Complete Algorithm

**CPT Requirement:** Your main algorithm must integrate sequencing, selection, and iteration to solve a meaningful problem. This procedure processes a list in order, checks each simulated placement, records the result, and returns the number of successful installations.

{% capture pc_algorithm_challenge %}
Run a complete PC assembly algorithm that combines a list, procedure, sequence, selection, iteration, and a return value.
{% endcapture %}

{% capture pc_algorithm_code %}
PROCEDURE assembleComputer(parts, selectedParts)
{
  installedCount ← 0
  step ← 1

  FOR EACH selectedPart IN selectedParts
  {
    expectedPart ← parts[step]

    IF (selectedPart = expectedPart)
    {
      DISPLAY(selectedPart + " installed correctly.")
      installedCount ← installedCount + 1
      step ← step + 1
    }
    ELSE
    {
      DISPLAY(selectedPart + " returned. Next part is " + expectedPart + ".")
    }
  }

  RETURN(installedCount)
}

parts ← ["CPU", "RAM", "M.2 SSD", "CPU cooler"]
attempts ← ["Graphics card", "CPU", "RAM", "M.2 SSD", "CPU cooler"]
installed ← assembleComputer(parts, attempts)
DISPLAY("Installed correctly: " + installed + " of " + LENGTH(parts))
{% endcapture %}

{% include runners/code.html
   runner_id="pc-algorithm"
   language="pseudocode"
   variants_key="algorithm"
   local_python=true
   challenge=pc_algorithm_challenge
   code=pc_algorithm_code
   height="600px"
%}

**Expected output**

```text
Graphics card returned. Next part is CPU.
CPU installed correctly.
RAM installed correctly.
M.2 SSD installed correctly.
CPU cooler installed correctly.
Installed correctly: 4 of 4
```

---

## List Operations

**AP CSP Concept:** `APPEND`, `INSERT`, `REMOVE`, and `LENGTH` modify and measure lists. These operations can update the parts tray as components are added or installed.

{% capture pc_list_operations_challenge %}
Modify a PC parts tray with all four College Board list operations.
{% endcapture %}

{% capture pc_list_operations_code %}
partsTray ← ["CPU", "RAM"]
DISPLAY("Initial tray: " + partsTray)

APPEND(partsTray, "M.2 SSD")
DISPLAY("After APPEND: " + partsTray)

INSERT(partsTray, 2, "CPU cooler")
DISPLAY("After INSERT: " + partsTray)

REMOVE(partsTray, 1)
DISPLAY("After installing CPU: " + partsTray)

DISPLAY("Parts remaining: " + LENGTH(partsTray))
{% endcapture %}

{% include runners/code.html
  runner_id="pc-list-operations"
  language="pseudocode"
  variants_key="list_operations"
  local_python=true
  challenge=pc_list_operations_challenge
  code=pc_list_operations_code
  height="380px"
%}

**Expected output**

```text
Initial tray: CPU,RAM
After APPEND: CPU,RAM,M.2 SSD
After INSERT: CPU,CPU cooler,RAM,M.2 SSD
After installing CPU: CPU cooler,RAM,M.2 SSD
Parts remaining: 3
```

---

## Search Algorithm

**AP CSP Concept:** A linear search checks every list item until it finds a target. This algorithm searches the parts tray and returns its 1-based position, or `-1` when the part is absent.

{% capture pc_search_challenge %}
Search the parts tray for the graphics card and display its position.
{% endcapture %}

{% capture pc_search_code %}
PROCEDURE findPart(partsTray, targetPart)
{
  position ← 1

  FOR EACH part IN partsTray
  {
    IF (part = targetPart)
    {
      RETURN(position)
    }
    position ← position + 1
  }

  RETURN(-1)
}

partsTray ← ["CPU", "RAM", "M.2 SSD", "Graphics card"]
result ← findPart(partsTray, "Graphics card")
DISPLAY("Graphics card position: " + result)
{% endcapture %}

{% include runners/code.html
   runner_id="pc-search"
   language="pseudocode"
   variants_key="search"
   local_python=true
   challenge=pc_search_challenge
   code=pc_search_code
   height="480px"
%}

**Expected output**

```text
Graphics card position: 4
```

---

## Boolean Logic

**AP CSP Concept:** `AND`, `OR`, and `NOT` combine Boolean conditions. A part should snap in only when both the component and its destination are correct. The build is not finished while required parts remain.

{% capture pc_boolean_challenge %}
Use AND and NOT to decide whether a CPU should snap into place and whether the build is still in progress.
{% endcapture %}

{% capture pc_boolean_code %}
selectedPart ← "CPU"
selectedSlot ← "CPU socket"
expectedPart ← "CPU"
expectedSlot ← "CPU socket"
partsRemaining ← 7

correctPart ← selectedPart = expectedPart
correctSlot ← selectedSlot = expectedSlot

IF (correctPart AND correctSlot)
{
  DISPLAY("The CPU snaps into place.")
}
ELSE
{
  DISPLAY("Return the part to the tray.")
}

IF (NOT (partsRemaining = 0))
{
  DISPLAY("The PC build is still in progress.")
}
{% endcapture %}

{% include runners/code.html
   runner_id="pc-boolean"
   language="pseudocode"
   variants_key="boolean"
   local_python=true
   challenge=pc_boolean_challenge
   code=pc_boolean_code
   height="500px"
%}

**Expected output**

```text
The CPU snaps into place.
The PC build is still in progress.
```

---

# JavaScript Prototype

The JavaScript version turns the algorithm into a browser interaction. Drag each component from the parts tray to its matching connection point in assembly order. Clicking a part and then a slot provides the same interaction for keyboard and touch users. Correct placements snap into the build; incorrect placements stay in the tray. The program records every attempt and displays the current accuracy.

{% capture pc_javascript_challenge %}
Run the PC assembly prototype. Try a wrong part first, then install all eight components in order. Identify the input, output, lists, procedure, selection, iteration, and Boolean expression in the code.
{% endcapture %}

{% capture pc_javascript_code %}
outputElement.innerHTML = '';

const parts = [
  { name: 'CPU', slot: 'CPU socket' },
  { name: 'RAM', slot: 'RAM slots' },
  { name: 'M.2 SSD', slot: 'M.2 slot' },
  { name: 'CPU cooler', slot: 'Cooler mount' },
  { name: 'Power supply', slot: 'PSU bay' },
  { name: 'Motherboard', slot: 'Board tray' },
  { name: 'Graphics card', slot: 'PCIe slot' },
  { name: 'Power cables', slot: 'Power headers' }
];

const attempts = [];
let currentStep = 0;
let selectedPart = -1;

const app = document.createElement('section');
const header = document.createElement('div');
const heading = document.createElement('h3');
const directions = document.createElement('p');
const nameLabel = document.createElement('label');
const builderName = document.createElement('input');
const status = document.createElement('p');
const progress = document.createElement('p');
const resetButton = document.createElement('button');
const layout = document.createElement('div');
const tray = document.createElement('div');
const caseArea = document.createElement('div');
const trayTitle = document.createElement('h4');
const caseTitle = document.createElement('h4');

heading.textContent = 'PC Assembly Bench';
directions.textContent = 'Drag a part to its slot in order, or click a part and then a slot.';
nameLabel.textContent = 'Builder name';
nameLabel.htmlFor = 'pc-builder-name';
builderName.id = 'pc-builder-name';
builderName.type = 'text';
builderName.placeholder = 'Enter your name';
builderName.autocomplete = 'name';
resetButton.type = 'button';
resetButton.textContent = 'Reset build';
trayTitle.textContent = 'Parts tray';
caseTitle.textContent = 'PC connection points';
status.setAttribute('role', 'status');
status.setAttribute('aria-live', 'polite');

// All appearance lives in _sass/open-coding/elements/buttons/variant-dragdrop.scss
app.className = 'ocs__dnd';
header.className = 'ocs__dnd-header';
builderName.className = 'ocs__dnd-input';
resetButton.className = 'ocs__dnd-reset';
layout.className = 'ocs__dnd-layout';
tray.className = 'ocs__dnd-panel';
caseArea.className = 'ocs__dnd-panel';
trayTitle.className = 'ocs__dnd-panel-title';
caseTitle.className = 'ocs__dnd-panel-title';
status.className = 'ocs__dnd-status';
progress.className = 'ocs__dnd-progress';

const partCards = [];
const slotButtons = [];

function calculateAccuracy(results) {
  let correctAttempts = 0;
  for (const result of results) {
    if (result === true) {
      correctAttempts += 1;
    }
  }
  return Math.round((correctAttempts / results.length) * 100);
}

function checkPlacement(partIndex, slotIndex) {
  const correctPart = partIndex === currentStep;
  const correctSlot = slotIndex === currentStep;
  return correctPart && correctSlot;
}

function updateProgress() {
  const accuracy = attempts.length === 0 ? 100 : calculateAccuracy(attempts);
  progress.textContent = 'Installed: ' + currentStep + '/' + parts.length + ' | Accuracy: ' + accuracy + '%';
}

function updateStatus(message) {
  const nameInput = document.getElementById('pc-builder-name');
  const name = nameInput === null ? '' : nameInput.value.trim();
  status.textContent = name === '' ? message : name + ': ' + message;
}

function selectPart(index) {
  if (index < currentStep || partCards[index].disabled) {
    return;
  }
  selectedPart = index;
  partCards.forEach(function(card, cardIndex) {
    card.classList.toggle('is-selected', cardIndex === index);
  });
  updateStatus(parts[index].name + ' selected. Choose its destination.');
}

function placePart(partIndex, slotIndex) {
  const validPart = Number.isInteger(partIndex) && partIndex >= 0 && partIndex < parts.length;
  if (!validPart || partCards[partIndex].disabled) {
    updateStatus('Choose a part from the tray first.');
    return;
  }

  const isCorrect = checkPlacement(partIndex, slotIndex);
  attempts.push(isCorrect);

  if (isCorrect) {
    const installedPart = parts[partIndex];
    partCards[partIndex].disabled = true;
    partCards[partIndex].draggable = false;
    slotButtons[slotIndex].disabled = true;
    slotButtons[slotIndex].textContent = '✓ ' + installedPart.name + ' → ' + installedPart.slot;
    slotButtons[slotIndex].classList.remove('is-over');
    slotButtons[slotIndex].classList.add('is-filled');
    currentStep += 1;
    updateStatus('Correct! ' + installedPart.name + ' snapped into place.');
  } else {
    const expected = parts[currentStep];
    updateStatus('Incorrect. ' + parts[partIndex].name + ' returned to the tray. Install ' + expected.name + ' in ' + expected.slot + ' next.');
  }

  selectedPart = -1;
  partCards.forEach(function(card) {
    card.classList.remove('is-selected');
  });
  updateProgress();

  if (currentStep === parts.length) {
    updateStatus('PC assembly complete!');
  }
}

parts.forEach(function(part, index) {
  const partCard = document.createElement('button');
  partCard.type = 'button';
  partCard.textContent = part.name;
  partCard.draggable = true;
  partCard.setAttribute('aria-label', 'PC part: ' + part.name);
  partCard.className = 'ocs__drag-btn';
  partCard.addEventListener('click', function() {
    selectPart(index);
  });
  partCard.addEventListener('dragstart', function(event) {
    selectPart(index);
    event.dataTransfer.setData('text/plain', String(index));
    event.dataTransfer.effectAllowed = 'move';
  });
  partCards.push(partCard);
  tray.appendChild(partCard);

  const slotButton = document.createElement('button');
  slotButton.type = 'button';
  slotButton.textContent = part.slot;
  slotButton.setAttribute('aria-label', 'Install a part in ' + part.slot);
  slotButton.className = 'ocs__drop-btn';
  slotButton.addEventListener('click', function() {
    placePart(selectedPart, index);
  });
  slotButton.addEventListener('dragover', function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    slotButton.classList.add('is-over');
  });
  slotButton.addEventListener('dragleave', function() {
    slotButton.classList.remove('is-over');
  });
  slotButton.addEventListener('drop', function(event) {
    event.preventDefault();
    slotButton.classList.remove('is-over');
    const droppedPart = Number.parseInt(event.dataTransfer.getData('text/plain'), 10);
    placePart(droppedPart, index);
  });
  slotButtons.push(slotButton);
  caseArea.appendChild(slotButton);
});

resetButton.addEventListener('click', function() {
  attempts.length = 0;
  currentStep = 0;
  selectedPart = -1;
  partCards.forEach(function(card) {
    card.disabled = false;
    card.draggable = true;
    card.classList.remove('is-selected');
  });
  slotButtons.forEach(function(slotButton, index) {
    slotButton.disabled = false;
    slotButton.textContent = parts[index].slot;
    slotButton.classList.remove('is-filled', 'is-over');
  });
  updateStatus('Next part: ' + parts[currentStep].name);
  updateProgress();
});

const nameField = document.createElement('div');
nameField.appendChild(nameLabel);
nameField.appendChild(builderName);
header.appendChild(nameField);
header.appendChild(resetButton);
tray.insertBefore(trayTitle, tray.firstChild);
caseArea.insertBefore(caseTitle, caseArea.firstChild);
layout.appendChild(tray);
layout.appendChild(caseArea);
app.appendChild(heading);
app.appendChild(directions);
app.appendChild(header);
app.appendChild(status);
app.appendChild(progress);
app.appendChild(layout);
outputElement.appendChild(app);

updateStatus('Next part: ' + parts[currentStep].name);
updateProgress();
{% endcapture %}

{% include runners/ui.html
   runner_id="pc-javascript"
   challenge=pc_javascript_challenge
   code=pc_javascript_code
   height="1100px"
   output_height="600px"
%}

**Example output (initial UI state)**

```text
Next part: CPU
Installed: 0/8 | Accuracy: 100%
```

---

# Full Program Prototype

The full program uses the same lists, procedure, selection, iteration, Boolean logic, and accuracy calculation. It starts in Python, and the dropdown also provides complete Pseudocode and Java versions. The editable sample attempts supply input because this web runner does not provide terminal standard input.

{% capture pc_python_challenge %}
Run the automatic sample build. Then change the sample values to try a different assembly order.
{% endcapture %}

{% capture pc_python_code %}
parts = ["CPU", "RAM", "M.2 SSD", "CPU cooler", "Power supply", "Motherboard", "Graphics card", "Power cables"]
slots = ["CPU socket", "RAM slots", "M.2 slot", "Cooler mount", "PSU bay", "Board tray", "PCIe slot", "Power headers"]
attempts = []
current_step = 0

# Sample choices keep this example runnable in the web code runner.
# Change these lists to test a different build order.
sample_attempts = [
    ("Graphics card", "PCIe slot"),
    ("CPU", "CPU socket"),
    ("RAM", "RAM slots"),
    ("M.2 SSD", "M.2 slot"),
    ("CPU cooler", "Cooler mount"),
    ("Power supply", "PSU bay"),
    ("Motherboard", "Board tray"),
    ("Graphics card", "PCIe slot"),
    ("Power cables", "Power headers"),
]
sample_index = 0

def check_placement(part_name, slot_name):
    correct_part = part_name.lower() == parts[current_step].lower()
    correct_slot = slot_name.lower() == slots[current_step].lower()
    return correct_part and correct_slot

while current_step < len(parts):
    print("\nNext part:", parts[current_step])
    selected_part, selected_slot = sample_attempts[sample_index]
    print("Choose a PC part:", selected_part)
    print("Choose its destination:", selected_slot)
    is_correct = check_placement(selected_part, selected_slot)
    attempts.append(is_correct)
    sample_index += 1

    if is_correct:
        print(selected_part, "snapped into place!")
        current_step += 1
    else:
        print("Incorrect placement. The part returned to the tray.")
        print("Hint:", parts[current_step], "goes in", slots[current_step])

correct_attempts = 0
for result in attempts:
    if result:
        correct_attempts += 1

accuracy = round((correct_attempts / len(attempts)) * 100)
print("\nPC assembly complete!")
print("Accuracy:", str(accuracy) + "%")
{% endcapture %}

{% include runners/code.html
   runner_id="pc-python"
   language="python"
   variants_key="prototype"
   python_code=pc_python_code
   local_python=true
   challenge=pc_python_challenge
   code=pc_python_code
   height="760px"
%}

**Sample output**

```text
Next part: CPU
Choose a PC part: Graphics card
Choose its destination: PCIe slot
Incorrect placement. The part returned to the tray.
Hint: CPU goes in CPU socket

Next part: CPU
Choose a PC part: CPU
Choose its destination: CPU socket
CPU snapped into place!
... (remaining steps omitted) ...
PC assembly complete!
Accuracy: 89%
```

---

# Reflection

JavaScript felt most natural for this project because it connects directly to browser buttons, visible output, and the snap-in interaction. Python made the algorithm shorter and easier to read, but its normal `input()` and `print()` interface is text-based. Pseudocode was the clearest planning language because it showed the lists, procedure, selection, iteration, and Boolean logic without extra browser or terminal syntax.

The main difference is how each language handles interaction. JavaScript creates and updates HTML elements with event listeners. Python normally pauses for terminal input and prints a response. Both languages still use the same underlying algorithm and data.
