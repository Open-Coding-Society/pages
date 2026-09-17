---
layout: post
courses: {'csp': {'week': 1}}
toc: True
comments: False
title: 3.10 Lists
description: This is the comprehensive lesson for Big Idea 3.10, Lists.
permalink: /csp/big-idea-3/lists/p4/lesson
---

# AP Computer Science Principles

## Big Idea 3.10: Lists

---
layout: post
courses: {'csp': {'week': 1}}
toc: True
comments: False
title: 3.10 Lists
description: This is the comprehensive lesson for Big Idea 3.10, Lists.
permalink: /csp/big-idea-3/lists/p4/lesson
---

## Big Idea 3.10: Lists

Three short lessons, each with a 5 minute Popcorn Hack you do in class. One 10 minute Homework Hack at the end pulls all three together, graded as a single point.

| Lesson | Topic | Popcorn Hack (5 min) |
| ------ | ----- | -------------------- |
| 1 | What lists are, creating, indexing | Four foods, predict the output |
| 2 | Sum and average | Live class data accumulator |
| 3 | Counting frequencies and filtering | Class season survey |

---

## 1. LxD Cycle Process

**Empathize:** Students coming from single value variables write `score1`, `score2`, `score3` and then cannot loop over them. They assume the first item sits at position 1, they forget to initialize `total = 0`, and they try to count categories with a pile of separate counter variables.

**Define:**

- **POV:** CSP students need lists, the accumulator pattern, and dictionaries because separate variables cannot be looped, counted, or grown, and because none of them scale to data you have not seen in advance.
- **Learning Goal:** Students will create and index lists, total and average them with an explicit loop, and count and filter them.

**Ideate:**

- **HMW Question:** How might we make a silent wrong answer as visible as a crash?
- **Activity:** Three short predict then run activities, each with a deliberate failure the class has to fix.

**Prototype and Test:** The trial run showed students engaged faster with data they supplied in the moment, so two of the three popcorn hacks use live class data instead of a teacher example. An earlier version graded each lesson separately and ran long, so grading was consolidated into one homework at the end.

---

## 2. Lesson Plan

**Learning Objective:** By the end of these three lessons, you will be able to create a list, access any element by index, total and average a numeric list with a loop, count how often each value appears, and filter a list by a condition.

**Success Criteria:** Given any list, you can state its length, name the index of the first and last elements, produce a correct total and average without crashing on an empty list, and build a frequency count and a filtered list without altering the original.

> [!IMPORTANT]
> Submission rules for every hack in this unit:
> - Python only, and keep the `# UI_RUNNER` comment line at the top of each cell.
> - Use loops, not list comprehensions. AP pseudocode maps to explicit loops.
> - Run every cell and confirm the printed output before submitting.
> - Print your results. A cell with no output scores zero.

---

### Lesson 1: What Is a List?

#### Tech Talk (3 minutes)

A list is one variable holding an ordered collection of values.

- **Ordered:** elements keep their position.
- **Indexed:** positions start at **0**, not 1.
- **Mutable:** you can change, add, and remove elements.
- **Duplicates allowed:** the same value can appear many times.

The last valid index is always `len(list) - 1`. Asking for `len(list)` itself is the most common list error in CSP.

#### Code Examples

**A. Simple: Creating Lists**

```python
# List of integers
ages = [15, 16, 17, 15, 16]

# List of strings
colors = ["red", "blue", "green", "red"]

# List of mixed types
mixed = [42, "hello", 3.14, True]

print(ages)
print(colors)
print(mixed)
```

**B. Intermediate: Accessing Elements**

```python
fruits = ["apple", "banana", "cherry", "date"]

print(fruits[0])    # apple  - first element
print(fruits[2])    # cherry - third element
print(fruits[-1])   # date   - last element
print(len(fruits))  # 4      - how many elements
```

**C. Complex: Changing a List**

```python
tasks = ["homework", "dishes", "practice"]

tasks[1] = "laundry"        # replace by index
tasks.append("study")       # add to the end
tasks.remove("practice")    # remove by value

print(tasks)                # ['homework', 'laundry', 'study']

for i in range(len(tasks)):
    print(i, tasks[i])
```

#### Interactive: Index Rail

Type your own list, then click any element or ask for an index. Ask for one that does not exist and you get the same error Python raises.

<section class="ocs__card" id="rail-lab">
  <p>
    <label for="rail-items">Your list, comma separated</label>
    <input type="text" id="rail-items" size="40" value="pizza, sushi, tacos, ramen">
  </p>
  <p>
    <label for="rail-ask">Get index</label>
    <input type="number" id="rail-ask" value="0">
    <button type="button" id="rail-go">Get element</button>
  </p>
  <ul id="rail-list"></ul>
  <p class="ocs__status" id="rail-out"></p>
</section>

<script>
(function () {
  var items = document.getElementById('rail-items');
  if (!items) return;
  var ask = document.getElementById('rail-ask');
  var rail = document.getElementById('rail-list');
  var out = document.getElementById('rail-out');
  var data = [];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function draw(active) {
    rail.innerHTML = '';
    if (data.length === 0) {
      rail.innerHTML = '<li><em>Empty list. Add some items above.</em></li>';
      return;
    }
    data.forEach(function (v, k) {
      var li = document.createElement('li');
      var label = 'index ' + k + ' or index ' + (k - data.length) + ': ' + v;
      if (k === active) {
        li.innerHTML = '<strong>' + esc(label) + '</strong> <span class="ocs__badge">selected</span>';
      } else {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.addEventListener('click', function () { show(k); });
        li.appendChild(b);
      }
      rail.appendChild(li);
    });
  }

  function show(idx) {
    var n = data.length;
    if (n === 0) {
      draw(-1);
      out.innerHTML = '<strong>IndexError: list index out of range.</strong> The list is empty, so no index works.';
      return;
    }
    var real = idx < 0 ? n + idx : idx;
    if (real < 0 || real >= n) {
      draw(-1);
      out.innerHTML = '<strong>IndexError: list index out of range.</strong> Valid indexes are 0 to ' +
        (n - 1) + ', or -1 to -' + n + '. You asked for ' + idx + '.';
      return;
    }
    draw(real);
    ask.value = idx;
    out.innerHTML = 'items[' + idx + '] is <strong>' + esc(data[real]) + '</strong>. ' +
      'The same element is items[' + (idx < 0 ? real : real - n) + ']. ' +
      'len(items) is ' + n + ', so the last valid index is ' + (n - 1) + '.';
  }

  function reset() {
    data = items.value.split(',').map(function (x) { return x.trim(); })
      .filter(function (x) { return x.length; });
    show(0);
  }

  items.addEventListener('input', reset);
  document.getElementById('rail-go').addEventListener('click', function () {
    show(parseInt(ask.value, 10) || 0);
  });
  reset();
})();
</script>

#### Popcorn Hack (5 minutes)

> [!TIP]
> Predict first, then run. Paste your four line prediction in chat before you execute the cell.

**Task:** Write a list of four foods you like. Predict the output of all four print statements, then run the cell and fix the one that breaks.

```python
# UI_RUNNER: Lists Popcorn 1

foods = ["pizza", "sushi", "tacos", "ramen"]   # swap in your own four

print(foods[0])
print(foods[-1])
print(len(foods))
print(foods[4])   # predict this before running
```

**Expected direction:** the first three print the first food, the last food, and `4`. The fourth raises `IndexError` because valid indexes are 0 through 3. Fix it to `foods[3]`.

**Discussion prompt:** Why is the last index `len(foods) - 1`?

---

### Lesson 2: Sum and Average

#### Tech Talk (3 minutes)

The accumulator pattern has three parts and they must happen in this order.

1. **Initialize** a running total to `0` before the loop.
2. **Add** each element to the total inside the loop.
3. **Use** the total after the loop finishes.

Average is `total / len(list)`. Two traps:

- Initializing `total` inside the loop resets it every pass.
- Dividing by `len(list)` when the list is empty raises `ZeroDivisionError`.

#### Code Examples

**A. Simple: Sum**

```python
scores = [78, 85, 92, 88, 95]

total = 0
for score in scores:
    total += score

print(f"Total points: {total}")   # Total points: 438
```

**B. Intermediate: Average with Rounding**

```python
scores = [78, 85, 92, 88, 95]

total = 0
for score in scores:
    total += score

average = total / len(scores)
print(f"Average score: {round(average, 2)}")   # Average score: 87.6
```

**C. Complex: Safe Average as a Function**

```python
def safe_average(numbers):
    if len(numbers) == 0:
        return None

    total = 0
    for n in numbers:
        total += n
    return total / len(numbers)

print(safe_average([78, 85, 92, 88, 95]))   # 87.6
print(safe_average([]))                     # None
```

#### Interactive: Accumulator Stepper

Press Step to run the loop one pass at a time. The line that is running is bold. Clear the list and run it again to see the crash.

<section class="ocs__card" id="acc-lab">
  <p>
    <label for="acc-items">Numbers, comma separated</label>
    <input type="text" id="acc-items" size="40" value="78, 85, 92, 88, 95">
  </p>
  <p>
    <button type="button" id="acc-step">Step</button>
    <button type="button" id="acc-run">Run all</button>
    <button type="button" id="acc-reset">Reset</button>
  </p>
  <ul id="acc-rail"></ul>
  <pre id="acc-code"></pre>
  <ul id="acc-state"></ul>
  <p class="ocs__status" id="acc-out"></p>
</section>

<script>
(function () {
  var box = document.getElementById('acc-items');
  if (!box) return;
  var railEl = document.getElementById('acc-rail');
  var codeEl = document.getElementById('acc-code');
  var stateEl = document.getElementById('acc-state');
  var outEl = document.getElementById('acc-out');
  var stepBtn = document.getElementById('acc-step');
  var runBtn = document.getElementById('acc-run');

  var CODE = [
    'total = 0',
    'for score in scores:',
    '    total += score',
    'average = total / len(scores)',
    'print(total, round(average, 2))'
  ];
  var nums = [], frames = [], at = 0, timer = null;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function build() {
    var f = [{ line: 0, i: -1, total: 0, avg: null, err: false }];
    var t = 0;
    nums.forEach(function (v, k) {
      t += v;
      f.push({ line: 2, i: k, total: t, avg: null, err: false });
    });
    if (nums.length === 0) {
      f.push({ line: 3, i: -1, total: 0, avg: null, err: true });
    } else {
      f.push({ line: 3, i: -1, total: t, avg: t / nums.length, err: false });
      f.push({ line: 4, i: -1, total: t, avg: t / nums.length, err: false });
    }
    return f;
  }

  function render() {
    var fr = frames[at];

    codeEl.innerHTML = CODE.map(function (l, k) {
      return k === fr.line ? '<strong>' + esc(l) + '</strong>' : esc(l);
    }).join('\n');

    railEl.innerHTML = '';
    if (nums.length === 0) {
      railEl.innerHTML = '<li><em>Empty list. Run it and see what breaks.</em></li>';
    } else {
      nums.forEach(function (v, k) {
        var li = document.createElement('li');
        var text = 'index ' + k + ': ' + v;
        if (k === fr.i) {
          li.innerHTML = '<strong>' + esc(text) + '</strong> <span class="ocs__badge">reading now</span>';
        } else if (k < fr.i || (fr.i === -1 && at > 0)) {
          li.innerHTML = '<em>' + esc(text) + '</em> already added';
        } else {
          li.textContent = text;
        }
        railEl.appendChild(li);
      });
    }

    var avg = fr.avg === null ? 'not computed yet' : String(Math.round(fr.avg * 100) / 100);
    stateEl.innerHTML =
      '<li>current element: <strong>' + (fr.i >= 0 ? nums[fr.i] : 'none') + '</strong></li>' +
      '<li>total: <strong>' + fr.total + '</strong></li>' +
      '<li>len(scores): ' + nums.length + '</li>' +
      '<li>average: ' + avg + '</li>';

    if (fr.err) {
      outEl.innerHTML = '<strong>ZeroDivisionError: division by zero.</strong> len(scores) is 0. ' +
        'Guard it with an if statement that checks the length before dividing.';
    } else if (at === frames.length - 1 && nums.length > 0) {
      outEl.innerHTML = 'Finished. Total is <strong>' + fr.total + '</strong> and the average is <strong>' +
        avg + '</strong>, because ' + fr.total + ' divided by ' + nums.length + ' is ' + avg + '.';
    } else if (at === 0) {
      outEl.innerHTML = 'total starts at 0 <em>before</em> the loop begins. Press Step.';
    } else {
      outEl.innerHTML = 'Pass ' + at + ' of ' + nums.length + '. Added ' + nums[fr.i] +
        ', so total is now ' + fr.total + '.';
    }

    var done = at >= frames.length - 1;
    stepBtn.disabled = done;
    runBtn.disabled = done;
  }

  function reset() {
    if (timer) { clearInterval(timer); timer = null; }
    nums = box.value.split(',').map(function (x) { return Number(x.trim()); })
      .filter(function (n) { return !isNaN(n); });
    frames = build();
    at = 0;
    render();
  }

  stepBtn.addEventListener('click', function () {
    if (at < frames.length - 1) { at += 1; render(); }
  });
  runBtn.addEventListener('click', function () {
    if (timer) return;
    timer = setInterval(function () {
      if (at >= frames.length - 1) { clearInterval(timer); timer = null; return; }
      at += 1; render();
    }, 700);
  });
  document.getElementById('acc-reset').addEventListener('click', reset);
  box.addEventListener('input', reset);
  reset();
})();
</script>

#### Popcorn Hack (5 minutes)

> [!TIP]
> Live data. Six students call out one number each, then everyone uses the same list.

**Task:** Collect six values from the class, such as hours of sleep last night. Compute the total and the average rounded to two decimals. Then empty the list and run it again.

```python
# UI_RUNNER: Lists Popcorn 2

sleep = [7, 6, 8, 5, 7, 9]   # replace with the class's real numbers

total = 0
for hours in sleep:
    total += hours

print("Total:", total)
print("Average:", round(total / len(sleep), 2))

# Now set sleep = [] and run again. What happens?
```

**Expected direction:** total `42`, average `7.0`. On the empty list the cell raises `ZeroDivisionError`. Add an `if len(sleep) == 0:` guard that prints `"No data yet"` instead.

**Discussion prompt:** Why does the empty list crash instead of printing `0`?

---

### Lesson 3: Counting Frequencies and Filtering

#### Tech Talk (3 minutes)

Two patterns, both built on a single loop.

**Frequency counting** uses one dictionary for any number of categories.

- Start with an empty dictionary.
- For each item: if the key already exists, add 1. Otherwise set it to 1.

**Filtering** builds one new list and leaves the original untouched.

- Start with an empty list.
- For each item: if the condition is true, `append()` it to the new list.

Never remove items from a list while looping over it. Build a new one instead.

#### Code Examples

**A. Simple: Frequency Count**

```python
seasons = ["winter", "summer", "fall", "summer", "summer", "spring", "fall"]

frequency = {}
for season in seasons:
    if season in frequency:
        frequency[season] += 1
    else:
        frequency[season] = 1

print(frequency)
# {'winter': 1, 'summer': 3, 'fall': 2, 'spring': 1}
```

**B. Intermediate: Filtering**

```python
ages = [12, 18, 15, 21, 17, 25, 14, 19]

adults = []
for age in ages:
    if age >= 18:
        adults.append(age)

print(adults)   # [18, 21, 25, 19]
print(ages)     # original unchanged
```

**C. Complex: Count, Then Filter the Counts**

```python
seasons = ["winter", "summer", "fall", "summer", "summer", "spring", "fall"]

frequency = {}
for season in seasons:
    if season in frequency:
        frequency[season] += 1
    else:
        frequency[season] = 1

popular = []
for season in frequency:
    if frequency[season] >= 2:
        popular.append(season)

print(popular)   # ['summer', 'fall']
```

#### Interactive: Count and Filter

Step through the counting loop and watch one dictionary replace a pile of counter variables. Then change the threshold and see which keys survive the filter.

<section class="ocs__card" id="freq-lab">
  <p>
    <label for="freq-items">Responses, comma separated</label>
    <input type="text" id="freq-items" size="40" value="winter, summer, fall, summer, summer, spring, fall">
  </p>
  <p>
    <label for="freq-thresh">Keep if count is at least</label>
    <input type="number" id="freq-thresh" value="2" min="1">
    <button type="button" id="freq-step">Step</button>
    <button type="button" id="freq-run">Run all</button>
    <button type="button" id="freq-reset">Reset</button>
  </p>
  <ul id="freq-rail"></ul>
  <pre id="freq-code"></pre>
  <ul id="freq-dict"></ul>
  <p class="ocs__status" id="freq-out"></p>
</section>

<script>
(function () {
  var box = document.getElementById('freq-items');
  if (!box) return;
  var threshBox = document.getElementById('freq-thresh');
  var railEl = document.getElementById('freq-rail');
  var codeEl = document.getElementById('freq-code');
  var dictEl = document.getElementById('freq-dict');
  var outEl = document.getElementById('freq-out');
  var stepBtn = document.getElementById('freq-step');
  var runBtn = document.getElementById('freq-run');

  var CODE = [
    'frequency = {}',
    'for item in responses:',
    '    if item in frequency:',
    '        frequency[item] += 1',
    '    else:',
    '        frequency[item] = 1',
    '',
    'popular = []',
    'for item in frequency:',
    '    if frequency[item] >= threshold:',
    '        popular.append(item)'
  ];
  var words = [], frames = [], at = 0, timer = null;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function threshold() {
    return Math.max(1, parseInt(threshBox.value, 10) || 1);
  }

  function build() {
    var f = [{ line: 0, i: -1, counts: {}, keys: [], phase: 'init', hot: null, keep: [], drop: [] }];
    var counts = {}, keys = [];
    words.forEach(function (w, k) {
      var seen = Object.prototype.hasOwnProperty.call(counts, w);
      if (seen) { counts[w] += 1; } else { counts[w] = 1; keys.push(w); }
      f.push({
        line: seen ? 3 : 5, i: k, counts: Object.assign({}, counts),
        keys: keys.slice(), phase: 'count', hot: w, keep: [], drop: []
      });
    });
    var th = threshold();
    var keep = [], drop = [];
    f.push({
      line: 7, i: -1, counts: Object.assign({}, counts),
      keys: keys.slice(), phase: 'filter', hot: null, keep: [], drop: []
    });
    keys.forEach(function (key) {
      if (counts[key] >= th) { keep.push(key); } else { drop.push(key); }
      f.push({
        line: counts[key] >= th ? 10 : 9, i: -1, counts: Object.assign({}, counts),
        keys: keys.slice(), phase: 'filter', hot: key, keep: keep.slice(), drop: drop.slice()
      });
    });
    return f;
  }

  function render() {
    var fr = frames[at];

    codeEl.innerHTML = CODE.map(function (l, k) {
      var text = l === '' ? ' ' : l;
      return k === fr.line ? '<strong>' + esc(text) + '</strong>' : esc(text);
    }).join('\n');

    railEl.innerHTML = '';
    if (words.length === 0) {
      railEl.innerHTML = '<li><em>Empty list. Add some responses above.</em></li>';
    } else {
      words.forEach(function (v, k) {
        var li = document.createElement('li');
        var text = 'index ' + k + ': ' + v;
        if (k === fr.i) {
          li.innerHTML = '<strong>' + esc(text) + '</strong> <span class="ocs__badge">reading now</span>';
        } else if (k < fr.i || fr.phase === 'filter') {
          li.innerHTML = '<em>' + esc(text) + '</em> counted';
        } else {
          li.textContent = text;
        }
        railEl.appendChild(li);
      });
    }

    dictEl.innerHTML = '';
    if (fr.keys.length === 0) {
      dictEl.innerHTML = '<li><em>frequency is an empty dictionary</em></li>';
    } else {
      fr.keys.forEach(function (key) {
        var li = document.createElement('li');
        var text = key + ': ' + fr.counts[key];
        var badge = '';
        if (fr.phase === 'filter') {
          if (fr.keep.indexOf(key) > -1) { badge = ' <span class="ocs__badge">kept</span>'; }
          else if (fr.drop.indexOf(key) > -1) { badge = ' <span class="ocs__badge">skipped</span>'; }
        }
        li.innerHTML = (fr.hot === key ? '<strong>' + esc(text) + '</strong>' : esc(text)) + badge;
        dictEl.appendChild(li);
      });
    }

    var th = threshold();
    if (at === frames.length - 1 && fr.keys.length > 0) {
      outEl.innerHTML = 'Finished. popular is <strong>[' + esc(fr.keep.join(', ')) + ']</strong>. ' +
        fr.keep.length + ' of ' + fr.keys.length + ' values reached ' + th + ' or more.';
    } else if (fr.phase === 'count' && fr.hot) {
      outEl.innerHTML = fr.line === 3
        ? '<strong>' + esc(fr.hot) + '</strong> was already a key, so its count went up to ' + fr.counts[fr.hot] + '.'
        : '<strong>' + esc(fr.hot) + '</strong> is new, so it was added with a count of 1.';
    } else if (fr.phase === 'filter' && fr.hot) {
      outEl.innerHTML = fr.keep.indexOf(fr.hot) > -1
        ? esc(fr.hot) + ' has ' + fr.counts[fr.hot] + ', which reaches ' + th + '. <strong>Kept.</strong>'
        : esc(fr.hot) + ' has ' + fr.counts[fr.hot] + ', which is below ' + th + '. <strong>Skipped.</strong>';
    } else if (at === 0) {
      outEl.innerHTML = 'The dictionary starts empty. Press Step to read the first response.';
    } else {
      outEl.innerHTML = 'Counting is done. Now the second loop filters the keys.';
    }

    var done = at >= frames.length - 1;
    stepBtn.disabled = done;
    runBtn.disabled = done;
  }

  function reset() {
    if (timer) { clearInterval(timer); timer = null; }
    words = box.value.split(',').map(function (x) { return x.trim(); })
      .filter(function (x) { return x.length; });
    frames = build();
    at = 0;
    render();
  }

  stepBtn.addEventListener('click', function () {
    if (at < frames.length - 1) { at += 1; render(); }
  });
  runBtn.addEventListener('click', function () {
    if (timer) return;
    timer = setInterval(function () {
      if (at >= frames.length - 1) { clearInterval(timer); timer = null; return; }
      at += 1; render();
    }, 650);
  });
  document.getElementById('freq-reset').addEventListener('click', reset);
  box.addEventListener('input', reset);
  threshBox.addEventListener('input', reset);
  reset();
})();
</script>

#### Popcorn Hack (5 minutes)

> [!TIP]
> Live survey. Everyone types their favorite season in chat, then build the list from the real responses.

**Task:** Count the class responses, then filter to the seasons with two or more votes.

```python
# UI_RUNNER: Lists Popcorn 3

seasons = ["winter", "summer", "fall", "summer", "spring", "summer", "fall"]   # use real class data

# 1. Build a frequency dictionary
# 2. Print it
# 3. Build a list of seasons with 2 or more votes
# 4. Print that list
```

**Expected direction:** the dictionary has one key per unique season and the counts add up to the number of students. The filtered list is shorter than the number of unique seasons unless every season got two votes.

**Discussion prompt:** How many counter variables would this need without a dictionary, and what happens when a season nobody predicted shows up?

---

## 3. Homework Hack (10 minutes)

This is the only homework for the unit. It uses all three lessons on one dataset: the snack votes from a class party and what each one cost.

```python
# UI_RUNNER: Lists Homework

votes = ["chips", "cookies", "chips", "fruit", "cookies", "chips",
         "pretzels", "cookies", "chips", "fruit", "chips", "cookies"]

prices = [2, 3, 2, 4, 3, 2, 1, 3, 2, 4, 2, 3]

# LESSON 1 - indexing
# 1. Print how many votes were cast
# 2. Print the last vote WITHOUT hardcoding an index number

# LESSON 2 - sum and average
# 3. Use a loop to total prices (do NOT use sum())
# 4. Print "Total: <total>" and "Average: <average>" rounded to 2 decimals

# LESSON 3 - count and filter
# 5. Build a frequency dictionary of votes and print it
# 6. Build a list of snacks with 3 or more votes and print it
```

**Expected output shape:**

```text
12
cookies
Total: 31
Average: 2.58
{'chips': 5, 'cookies': 4, 'fruit': 2, 'pretzels': 1}
['chips', 'cookies']
```

---

## 4. Grading Plan (1 Point Total)

### Classroom Rubric

- **0.3 points: Popcorn completion.** 0.1 for each of the three in class hacks, submitted as a runnable cell with the fix applied.
- **0.7 points: Homework completion.**
  * **0.15 indexing:** correct `len()` and a last element found with `[-1]` or `len(votes) - 1`, not a hardcoded number.
  * **0.2 accumulator:** `total` initialized to `0` before the loop, added to inside it, and divided correctly with `round(..., 2)`.
  * **0.2 frequency dictionary:** correct counts for all four snacks using the if and else key pattern.
  * **0.15 filtering:** new list built with `append()`, threshold applied correctly, and `votes` left unmodified.

### Quick Validation Checklist

- Present: the `# UI_RUNNER` comment line.
- Present: `total = 0` on a line before the `for`, an empty `{}` before the counting loop, and an empty `[]` before the filter loop.
- Absent: `sum()`, list comprehensions, and any hardcoded index in step 2.
- Present: all six printed lines matching the expected output shape.

---

## Common Problems to Avoid

- Off by one errors. Indexing starts at 0.
- Index out of range. Do not access `list[5]` if the list has only 4 elements.
- Modifying a list while iterating over it. Build a new list instead.
- Forgetting to initialize variables. Set `total = 0` before summing.
- Use descriptive names like `student_names` instead of `list1`.
- Check for empty lists before accessing elements or dividing.
- Test edge cases: empty lists, single elements, all the same value.

## Summary

Lists store and organize collections of data. Across these three lessons you learned to access elements by index, compute a sum and an average with an accumulator loop, count the frequency of items with a dictionary, filter a list based on a condition, and guard against empty lists and out of range indexes.

## 5. Lesson Revisions and Feedback Evidence

- **Feedback received:** the Lesson 1 popcorn originally asked students to write and index three separate lists, which ran past five minutes.
- **Revision made:** cut it to one four item list with a predict then run step, so the reasoning happens before the typing.
- **Feedback received:** the empty list case in Lesson 2 was a bullet in the tech talk and students skipped over it.
- **Revision made:** moved it into the popcorn as a live crash students have to fix.
- **Feedback received:** three separate homework assignments across one week was too much load for a single big idea.
- **Revision made:** consolidated into one 10 minute homework on a shared dataset, graded as a single point, so students see all three patterns applied to the same data.
