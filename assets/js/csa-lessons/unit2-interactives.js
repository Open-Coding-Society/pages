/**
 * AP CSA Unit 2 Interactives (Selection and Iteration)
 *
 * Dependency-free widgets used by the Unit 2 lesson notebooks. Styles live in
 * _sass/open-coding/csa-unit2-interactive.scss (class prefix: u2-).
 *
 * Declarative widgets are written as plain HTML in a lesson and wired up on load:
 *   .u2-mcq    multiple choice (options carry data-correct / data-feedback)
 *   .u2-fill   short answer  (inputs carry data-answer, answers separated by |)
 *   .u2-order  put code lines in order (Parsons style)
 *   .u2-sort   drag or click items into labeled buckets
 *   .u2-quiz   scoreboard wrapper around .u2-mcq__q and .u2-fill__q blocks
 *
 * Programmatic widgets are built by calling a U2 function with a config:
 *   U2.trace(id, cfg)  step through code with a variable table and console
 *   U2.truth(id, cfg)  fill in a truth table and check it
 *   U2.live(id, cfg)   inputs drive which branch of the code runs
 *   U2.flow(id, cfg)   walk through a flowchart by answering its decisions
 *   U2.count(id, cfg)  predict, then count, statement executions
 */
(function (window, document) {
  'use strict';

  var MAX_TRACE_STEPS = 400;
  var PLAY_INTERVAL_MS = 900;

  // ---------------------------------------------------------------------------
  // Small DOM helpers
  // ---------------------------------------------------------------------------
  function qs(selector, root) { return (root || document).querySelector(selector); }
  function qsa(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'class') node.className = attrs[key];
        else if (key === 'html') node.innerHTML = attrs[key];
        else if (key === 'text') node.textContent = attrs[key];
        else if (key.indexOf('on') === 0) node.addEventListener(key.slice(2), attrs[key]);
        else node.setAttribute(key, attrs[key]);
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function shuffle(array) {
    var copy = array.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
    }
    return copy;
  }

  function button(label, kind, onClick) {
    return el('button', { type: 'button', class: 'u2-btn u2-btn--' + (kind || 'ghost'), text: label, onclick: onClick });
  }

  // Feedback boxes keep their base class and swap a --correct/--incorrect/--info modifier.
  function setFeedback(box, kind, html) {
    if (!box) return;
    if (!box.dataset.u2base) box.dataset.u2base = box.classList[0] || 'u2-feedback';
    var base = box.dataset.u2base;
    box.className = kind ? base + ' ' + base + '--' + kind : base;
    box.innerHTML = html || '';
  }

  function findOrCreateFeedback(container, className) {
    var box = qs('.' + className, container) || qs('.u2-feedback', container);
    if (!box) {
      box = el('div', { class: className });
      container.appendChild(box);
    }
    return box;
  }

  // ---------------------------------------------------------------------------
  // Completion badge (persisted per page + widget id in localStorage)
  // ---------------------------------------------------------------------------
  function storageKey(card) {
    return 'u2done:' + window.location.pathname + '#' + card.id;
  }

  function ensureBadge(card) {
    var header = qs('.u2-card__header', card);
    if (!header) return null;
    var badge = qs('.u2-card__badge', header);
    if (!badge) {
      badge = el('span', { class: 'u2-card__badge', text: 'Completed' });
      header.appendChild(badge);
    }
    return badge;
  }

  function markDone(card) {
    if (!card) return;
    card.classList.add('u2-card--done');
    ensureBadge(card);
    if (card.id) {
      try { window.localStorage.setItem(storageKey(card), '1'); } catch (err) { /* storage unavailable */ }
    }
  }

  function restoreDone(card) {
    if (!card || !card.id) return;
    try {
      if (window.localStorage.getItem(storageKey(card)) === '1') {
        card.classList.add('u2-card--done');
        ensureBadge(card);
      }
    } catch (err) { /* storage unavailable */ }
  }

  function announce(card, detail) {
    card.dispatchEvent(new CustomEvent('u2:answered', { bubbles: true, detail: detail }));
  }

  // ---------------------------------------------------------------------------
  // Code rendering shared by trace / live / count
  // ---------------------------------------------------------------------------
  function renderCode(lines) {
    var block = el('div', { class: 'u2-code' });
    lines.forEach(function (line) {
      block.appendChild(el('div', { class: 'u2-code__line', text: line === '' ? ' ' : line }));
    });
    return block;
  }

  function highlightLines(block, active, taken, skipped) {
    qsa('.u2-code__line', block).forEach(function (lineEl, index) {
      lineEl.classList.toggle('u2-code__line--active', (active || []).indexOf(index) !== -1);
      lineEl.classList.toggle('u2-code__line--taken', (taken || []).indexOf(index) !== -1);
      lineEl.classList.toggle('u2-code__line--skipped', (skipped || []).indexOf(index) !== -1);
    });
  }

  function renderConsole(label) {
    var wrap = el('div');
    wrap.appendChild(el('div', { class: 'u2-console__label', text: label || 'Output' }));
    var box = el('div', { class: 'u2-console' });
    wrap.appendChild(box);
    wrap.box = box;
    return wrap;
  }

  function setConsole(box, text) {
    if (text === '' || text === null || text === undefined) {
      box.innerHTML = '<span class="u2-console__empty">(no output yet)</span>';
    } else {
      box.textContent = text;
    }
  }

  function formatValue(value) {
    if (typeof value === 'string') return value;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'number' && !Number.isInteger(value)) return String(Math.round(value * 1000) / 1000);
    return String(value);
  }

  // ---------------------------------------------------------------------------
  // 1. Multiple choice
  // ---------------------------------------------------------------------------
  function initMcq(card) {
    var groups = qsa('.u2-mcq__q', card);
    if (!groups.length) groups = [card];
    var solved = 0;

    groups.forEach(function (group) {
      var options = qsa('.u2-mcq__option', group);
      if (!options.length) return;
      var feedback = findOrCreateFeedback(qs('.u2-mcq__options', group) ? qs('.u2-mcq__options', group).parentNode : group, 'u2-mcq__feedback');
      var done = false;
      var attempts = 0;

      options.forEach(function (option) {
        option.setAttribute('type', 'button');
        option.addEventListener('click', function () {
          if (done) return;
          var correct = option.dataset.correct === 'true';
          options.forEach(function (other) { other.classList.remove('u2-mcq__option--incorrect'); });
          if (correct) {
            done = true;
            solved += 1;
            option.classList.add('u2-mcq__option--correct');
            options.forEach(function (other) { if (other !== option) other.classList.add('u2-mcq__option--disabled'); });
            setFeedback(feedback, 'correct', option.dataset.feedback || '<strong>Correct.</strong>');
            announce(card, { widget: 'mcq', correct: true, firstTry: attempts === 0 });
            if (solved === groups.length) markDone(card);
          } else {
            attempts += 1;
            option.classList.add('u2-mcq__option--incorrect');
            setFeedback(feedback, 'incorrect', option.dataset.feedback || '<strong>Not quite.</strong> Try again.');
            announce(card, { widget: 'mcq', correct: false, firstTry: false });
          }
        });
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Short answer
  // ---------------------------------------------------------------------------
  function normalizeAnswer(text) {
    return String(text).trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function answerMatches(given, expected) {
    var normalizedGiven = normalizeAnswer(given);
    var compactGiven = normalizedGiven.replace(/\s+/g, '');
    return expected.split('|').some(function (candidate) {
      var normalizedCandidate = normalizeAnswer(candidate);
      if (normalizedGiven === normalizedCandidate) return true;
      if (compactGiven !== '' && compactGiven === normalizedCandidate.replace(/\s+/g, '')) return true;
      var a = parseFloat(normalizedGiven);
      var b = parseFloat(normalizedCandidate);
      return !isNaN(a) && !isNaN(b) && /^-?\d+(\.\d+)?$/.test(normalizedGiven) && a === b;
    });
  }

  function initFill(card) {
    var groups = qsa('.u2-fill__q', card);
    if (!groups.length) groups = [card];
    var solved = 0;

    groups.forEach(function (group) {
      var input = qs('.u2-fill__input', group);
      if (!input) return;
      var row = input.parentNode;
      var check = qs('.u2-fill__check', group);
      if (!check) {
        check = button('Check', 'primary');
        row.appendChild(check);
      }
      var feedback = findOrCreateFeedback(group, 'u2-fill__feedback');
      var done = false;
      var attempts = 0;

      function evaluate() {
        if (done) return;
        var expected = input.dataset.answer || '';
        if (answerMatches(input.value, expected)) {
          done = true;
          solved += 1;
          input.classList.remove('u2-fill__input--incorrect');
          input.classList.add('u2-fill__input--correct');
          input.disabled = true;
          setFeedback(feedback, 'correct', input.dataset.feedback || '<strong>Correct.</strong>');
          announce(card, { widget: 'fill', correct: true, firstTry: attempts === 0 });
          if (solved === groups.length) markDone(card);
        } else {
          attempts += 1;
          input.classList.add('u2-fill__input--incorrect');
          setFeedback(feedback, 'incorrect', input.dataset.hint || '<strong>Not quite.</strong> Check the code again and retry.');
          announce(card, { widget: 'fill', correct: false, firstTry: false });
        }
      }

      check.addEventListener('click', evaluate);
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') { event.preventDefault(); evaluate(); }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Ordering (Parsons style)
  // ---------------------------------------------------------------------------
  function initOrder(card) {
    var list = qs('.u2-order__list', card);
    if (!list) return;
    var items = qsa('.u2-order__item', list);
    if (items.length < 2) return;
    var feedback = findOrCreateFeedback(card.querySelector('.u2-card__body') || card, 'u2-order__feedback');
    var dragged = null;

    // Lines that share a data-group may appear in any order among themselves
    // (for example two variable declarations), so compare by group when one is set.
    function slotKey(item) { return item.dataset.group || ('pos' + item.dataset.pos); }
    items.forEach(function (item, index) {
      if (item.dataset.pos === undefined) item.dataset.pos = String(index);
    });
    var expectedKeys = items.slice().sort(function (a, b) { return Number(a.dataset.pos) - Number(b.dataset.pos); }).map(slotKey);

    items.forEach(function (item) {
      if (!qs('.u2-order__code', item)) {
        var text = item.textContent.replace(/^\n/, '').replace(/\s+$/, '');
        item.textContent = '';
        item.appendChild(el('span', { class: 'u2-order__code', text: text }));
      }
      item.insertBefore(el('span', { class: 'u2-order__handle', text: '☰', 'aria-hidden': 'true' }), item.firstChild);
      var moves = el('span', { class: 'u2-order__moves' });
      moves.appendChild(el('button', { type: 'button', text: '▲', title: 'Move up', 'aria-label': 'Move up', onclick: function () { moveItem(item, -1); } }));
      moves.appendChild(el('button', { type: 'button', text: '▼', title: 'Move down', 'aria-label': 'Move down', onclick: function () { moveItem(item, 1); } }));
      item.appendChild(moves);
      item.setAttribute('draggable', 'true');

      item.addEventListener('dragstart', function () { dragged = item; item.classList.add('dragging'); });
      item.addEventListener('dragend', function () { item.classList.remove('dragging'); qsa('.drag-over', list).forEach(function (n) { n.classList.remove('drag-over'); }); });
      item.addEventListener('dragover', function (event) { event.preventDefault(); if (dragged && dragged !== item) item.classList.add('drag-over'); });
      item.addEventListener('dragleave', function () { item.classList.remove('drag-over'); });
      item.addEventListener('drop', function (event) {
        event.preventDefault();
        item.classList.remove('drag-over');
        if (!dragged || dragged === item) return;
        var siblings = qsa('.u2-order__item', list);
        var from = siblings.indexOf(dragged);
        var to = siblings.indexOf(item);
        list.insertBefore(dragged, from < to ? item.nextSibling : item);
        clearMarks();
      });
    });

    function moveItem(item, direction) {
      var siblings = qsa('.u2-order__item', list);
      var index = siblings.indexOf(item);
      var target = index + direction;
      if (target < 0 || target >= siblings.length) return;
      list.insertBefore(item, direction < 0 ? siblings[target] : siblings[target].nextSibling);
      clearMarks();
    }

    function clearMarks() {
      qsa('.u2-order__item', list).forEach(function (item) {
        item.classList.remove('u2-order__item--correct', 'u2-order__item--incorrect');
      });
      setFeedback(feedback, null, '');
    }

    function scramble() {
      var current = qsa('.u2-order__item', list);
      var order = shuffle(current);
      var isSorted = order.every(function (item, index) { return Number(item.dataset.pos) === index; });
      if (isSorted) order.reverse();
      order.forEach(function (item) { list.appendChild(item); });
      clearMarks();
    }

    function check() {
      var current = qsa('.u2-order__item', list);
      var wrong = 0;
      current.forEach(function (item, index) {
        var ok = slotKey(item) === expectedKeys[index];
        item.classList.toggle('u2-order__item--correct', ok);
        item.classList.toggle('u2-order__item--incorrect', !ok);
        if (!ok) wrong += 1;
      });
      if (wrong === 0) {
        setFeedback(feedback, 'correct', card.dataset.success || '<strong>Correct order.</strong> The program reads top to bottom exactly as Java will run it.');
        announce(card, { widget: 'order', correct: true });
        markDone(card);
      } else {
        setFeedback(feedback, 'incorrect', '<strong>' + wrong + ' line' + (wrong === 1 ? ' is' : 's are') + ' out of place.</strong> Red lines need to move. ' + (card.dataset.hint || 'Think about what must happen first.'));
        announce(card, { widget: 'order', correct: false });
      }
    }

    var controls = el('div', { class: 'u2-controls' }, [
      button('Check order', 'success', check),
      button('Shuffle again', 'warn', scramble)
    ]);
    list.parentNode.insertBefore(controls, list.nextSibling);
    scramble();
  }

  // ---------------------------------------------------------------------------
  // 4. Sort into buckets
  // ---------------------------------------------------------------------------
  function initSort(card) {
    var pool = qs('.u2-sort__pool', card);
    var buckets = qsa('.u2-sort__bucket', card);
    if (!pool || !buckets.length) return;
    var items = qsa('.u2-sort__item', card);
    var selected = null;
    var dragged = null;

    function clearMarks() {
      items.forEach(function (item) { item.classList.remove('u2-sort__item--correct', 'u2-sort__item--incorrect'); });
      setFeedback(feedback, null, '');
    }

    function select(item) {
      if (selected === item) { item.classList.remove('u2-sort__item--selected'); selected = null; return; }
      if (selected) selected.classList.remove('u2-sort__item--selected');
      selected = item;
      item.classList.add('u2-sort__item--selected');
    }

    function place(item, target) {
      target.appendChild(item);
      item.classList.remove('u2-sort__item--selected');
      if (selected === item) selected = null;
      clearMarks();
    }

    items.forEach(function (item) {
      item.setAttribute('type', 'button');
      item.setAttribute('draggable', 'true');
      item.addEventListener('click', function () {
        if (item.parentNode !== pool) { place(item, pool); return; }
        select(item);
      });
      item.addEventListener('dragstart', function () { dragged = item; item.classList.add('dragging'); });
      item.addEventListener('dragend', function () { item.classList.remove('dragging'); dragged = null; });
    });

    buckets.concat([pool]).forEach(function (zone) {
      zone.addEventListener('click', function (event) {
        if (event.target.classList.contains('u2-sort__item')) return;
        if (selected && zone !== pool) place(selected, zone);
      });
      zone.addEventListener('dragover', function (event) { event.preventDefault(); zone.classList.add('drag-over'); });
      zone.addEventListener('dragleave', function () { zone.classList.remove('drag-over'); });
      zone.addEventListener('drop', function (event) {
        event.preventDefault();
        zone.classList.remove('drag-over');
        if (dragged) place(dragged, zone);
      });
    });

    function check() {
      var wrong = 0;
      var unplaced = 0;
      items.forEach(function (item) {
        var zone = item.parentNode;
        if (zone === pool) { unplaced += 1; return; }
        var ok = zone.dataset.bucket === item.dataset.bucket;
        item.classList.toggle('u2-sort__item--correct', ok);
        item.classList.toggle('u2-sort__item--incorrect', !ok);
        if (!ok) wrong += 1;
      });
      if (unplaced > 0) {
        setFeedback(feedback, 'info', '<strong>' + unplaced + ' item' + (unplaced === 1 ? '' : 's') + ' still in the pool.</strong> Place everything before checking.');
      } else if (wrong === 0) {
        setFeedback(feedback, 'correct', card.dataset.success || '<strong>All sorted correctly.</strong>');
        announce(card, { widget: 'sort', correct: true });
        markDone(card);
      } else {
        setFeedback(feedback, 'incorrect', '<strong>' + wrong + ' item' + (wrong === 1 ? ' is' : 's are') + ' in the wrong bucket.</strong> Click a red item to send it back to the pool and try again.');
        announce(card, { widget: 'sort', correct: false });
      }
    }

    function reset() {
      shuffle(items).forEach(function (item) { pool.appendChild(item); item.classList.remove('u2-sort__item--selected'); });
      selected = null;
      clearMarks();
    }

    var controls = el('div', { class: 'u2-controls' }, [
      button('Check buckets', 'success', check),
      button('Reset', 'warn', reset)
    ]);
    (qs('.u2-card__body', card) || card).appendChild(controls);
    var feedback = findOrCreateFeedback(qs('.u2-card__body', card) || card, 'u2-sort__feedback');
    reset();
  }

  // ---------------------------------------------------------------------------
  // 5. Step-by-step trace
  //    cfg = { code: [...lines], params: [{name,label,value,min,max,step,options}],
  //            run: function* (params, io) { yield {line, vars, note} },
  //            extra: function (vars) -> html string (optional) }
  // ---------------------------------------------------------------------------
  function traceWidget(id, cfg) {
    var card = document.getElementById(id);
    if (!card) return;
    var body = qs('.u2-card__body', card) || card;
    var steps = [];
    var index = 0;
    var timer = null;
    var paramInputs = {};

    var paramsBar = el('div', { class: 'u2-trace__params' });
    (cfg.params || []).forEach(function (param) {
      var input;
      if (param.options) {
        input = el('select');
        param.options.forEach(function (option) {
          input.appendChild(el('option', { value: String(option), text: String(option) }));
        });
        input.value = String(param.value);
      } else {
        input = el('input', { type: param.type || 'number', value: String(param.value) });
        if (param.min !== undefined) input.min = param.min;
        if (param.max !== undefined) input.max = param.max;
        if (param.step !== undefined) input.step = param.step;
        if (param.maxlength !== undefined) input.maxLength = param.maxlength;
      }
      input.addEventListener('change', rebuild);
      paramInputs[param.name] = { input: input, spec: param };
      paramsBar.appendChild(el('label', {}, [(param.label || param.name) + ' = ', input]));
    });
    if (cfg.params && cfg.params.length) body.appendChild(paramsBar);

    var code = renderCode(cfg.code);
    var vars = el('table', { class: 'u2-trace__vars' });
    var extra = el('div', { class: 'u2-trace__extra' });
    var consoleWrap = renderConsole('Console');
    var state = el('div', { class: 'u2-trace__state' }, [extra, vars, consoleWrap]);
    body.appendChild(el('div', { class: 'u2-trace__layout' }, [code, state]));
    var note = el('div', { class: 'u2-trace__note' });
    body.appendChild(note);

    var backBtn = button('Back', 'ghost', function () { stop(); go(index - 1); });
    var nextBtn = button('Next step', 'primary', function () { stop(); go(index + 1); });
    var playBtn = button('Play', 'success', function () { timer ? stop() : play(); });
    var resetBtn = button('Reset', 'warn', function () { stop(); go(0); });
    var counter = el('span', { class: 'u2-trace__counter' });
    body.appendChild(el('div', { class: 'u2-controls' }, [backBtn, nextBtn, playBtn, resetBtn, counter]));

    function readParams() {
      var values = {};
      Object.keys(paramInputs).forEach(function (name) {
        var entry = paramInputs[name];
        var raw = entry.input.value;
        if (entry.spec.type === 'text' || entry.spec.options) values[name] = raw;
        else {
          var num = Number(raw);
          if (isNaN(num)) num = Number(entry.spec.value);
          if (entry.spec.min !== undefined) num = Math.max(entry.spec.min, num);
          if (entry.spec.max !== undefined) num = Math.min(entry.spec.max, num);
          num = Math.round(num);
          entry.input.value = String(num);
          values[name] = num;
        }
      });
      return values;
    }

    function compute() {
      var io = {
        buffer: [],
        print: function (text) { this.buffer.push(String(text)); },
        println: function (text) { this.buffer.push((text === undefined ? '' : String(text)) + '\n'); }
      };
      steps = [];
      var iterator = cfg.run(readParams(), io);
      var result = iterator.next();
      while (!result.done && steps.length < MAX_TRACE_STEPS) {
        var step = result.value || {};
        var snapshot = {};
        Object.keys(step.vars || {}).forEach(function (key) { snapshot[key] = step.vars[key]; });
        steps.push({ line: step.line, vars: snapshot, note: step.note || '', out: io.buffer.join('') });
        result = iterator.next();
      }
      if (!steps.length) steps.push({ line: -1, vars: {}, note: '', out: '' });
    }

    function render() {
      var step = steps[index];
      var previous = index > 0 ? steps[index - 1] : null;
      highlightLines(code, step.line >= 0 ? [step.line] : []);

      vars.innerHTML = '';
      // Keys starting with __ carry data for cfg.extra and stay out of the table.
      var keys = Object.keys(step.vars).filter(function (key) { return key.indexOf('__') !== 0; });
      if (keys.length) {
        var head = el('tr', {}, [el('th', { text: 'Variable' }), el('th', { text: 'Value' })]);
        vars.appendChild(head);
        keys.forEach(function (key) {
          var changed = previous && String(previous.vars[key]) !== String(step.vars[key]);
          vars.appendChild(el('tr', {}, [
            el('td', { text: key }),
            el('td', { text: formatValue(step.vars[key]), class: changed ? 'changed' : '' })
          ]));
        });
      }
      extra.innerHTML = cfg.extra ? (cfg.extra(step.vars, index, step) || '') : '';
      setConsole(consoleWrap.box, step.out);
      note.innerHTML = step.note || (index === 0 ? 'Press <strong>Next step</strong> to begin.' : '');
      counter.textContent = 'Step ' + (index + 1) + ' / ' + steps.length;
      backBtn.disabled = index === 0;
      nextBtn.disabled = index >= steps.length - 1;
      if (index >= steps.length - 1) {
        stop();
        if (steps.length > 1) markDone(card);
      }
    }

    function go(target) {
      index = Math.max(0, Math.min(steps.length - 1, target));
      render();
    }

    function play() {
      if (index >= steps.length - 1) go(0);
      playBtn.textContent = 'Pause';
      timer = window.setInterval(function () {
        if (index >= steps.length - 1) { stop(); return; }
        go(index + 1);
      }, PLAY_INTERVAL_MS);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
      playBtn.textContent = 'Play';
    }

    function rebuild() {
      stop();
      compute();
      go(0);
    }

    rebuild();
  }

  // ---------------------------------------------------------------------------
  // 6. Truth table
  //    cfg = { vars: ['a','b'], cols: [{label, fn: function(values) -> boolean}] }
  // ---------------------------------------------------------------------------
  function truthWidget(id, cfg) {
    var card = document.getElementById(id);
    if (!card) return;
    var body = qs('.u2-card__body', card) || card;
    var rows = [];
    var total = 1 << cfg.vars.length;
    for (var r = 0; r < total; r++) {
      var values = {};
      cfg.vars.forEach(function (name, i) {
        values[name] = ((r >> (cfg.vars.length - 1 - i)) & 1) === 0; // true rows first
      });
      rows.push(values);
    }

    var table = el('table', { class: 'u2-truth__table' });
    var head = el('tr');
    cfg.vars.forEach(function (name) { head.appendChild(el('th', { text: name })); });
    cfg.cols.forEach(function (col) { head.appendChild(el('th', { class: 'expr', text: col.label })); });
    table.appendChild(head);

    var cells = [];
    rows.forEach(function (values) {
      var tr = el('tr');
      cfg.vars.forEach(function (name) {
        tr.appendChild(el('td', { class: 'u2-truth__given', text: values[name] ? 'true' : 'false' }));
      });
      cfg.cols.forEach(function (col) {
        var cell = el('td', { class: 'u2-truth__cell', text: '?', title: 'Click to cycle true / false' });
        cell.dataset.state = '';
        cell.expected = !!col.fn(values);
        cell.addEventListener('click', function () {
          var next = cell.dataset.state === '' ? 't' : (cell.dataset.state === 't' ? 'f' : '');
          setCell(cell, next);
          cell.classList.remove('u2-truth__cell--correct', 'u2-truth__cell--incorrect');
          setFeedback(feedback, null, '');
        });
        cells.push(cell);
        tr.appendChild(cell);
      });
      table.appendChild(tr);
    });
    body.appendChild(table);

    function setCell(cell, state) {
      cell.dataset.state = state;
      cell.classList.toggle('u2-truth__cell--t', state === 't');
      cell.classList.toggle('u2-truth__cell--f', state === 'f');
      cell.textContent = state === 't' ? 'true' : (state === 'f' ? 'false' : '?');
    }

    var feedback = el('div', { class: 'u2-truth__feedback' });

    function check() {
      var wrong = 0;
      var blank = 0;
      cells.forEach(function (cell) {
        if (cell.dataset.state === '') { blank += 1; cell.classList.remove('u2-truth__cell--correct', 'u2-truth__cell--incorrect'); return; }
        var ok = (cell.dataset.state === 't') === cell.expected;
        cell.classList.toggle('u2-truth__cell--correct', ok);
        cell.classList.toggle('u2-truth__cell--incorrect', !ok);
        if (!ok) wrong += 1;
      });
      if (blank > 0) {
        setFeedback(feedback, 'info', '<strong>' + blank + ' cell' + (blank === 1 ? '' : 's') + ' still blank.</strong> Click a cell to set it to true or false.');
      } else if (wrong === 0) {
        setFeedback(feedback, 'correct', cfg.success || '<strong>Every row is right.</strong>');
        announce(card, { widget: 'truth', correct: true });
        markDone(card);
      } else {
        setFeedback(feedback, 'incorrect', '<strong>' + wrong + ' cell' + (wrong === 1 ? ' is' : 's are') + ' wrong.</strong> ' + (cfg.hint || 'Evaluate each expression one row at a time.'));
        announce(card, { widget: 'truth', correct: false });
      }
    }

    function reveal() {
      cells.forEach(function (cell) {
        setCell(cell, cell.expected ? 't' : 'f');
        cell.classList.remove('u2-truth__cell--correct', 'u2-truth__cell--incorrect');
      });
      setFeedback(feedback, 'info', '<strong>Answers shown.</strong> Read each row and make sure you can explain it.');
    }

    function reset() {
      cells.forEach(function (cell) {
        setCell(cell, '');
        cell.classList.remove('u2-truth__cell--correct', 'u2-truth__cell--incorrect');
      });
      setFeedback(feedback, null, '');
    }

    body.appendChild(el('div', { class: 'u2-controls' }, [
      button('Check table', 'success', check),
      button('Reset', 'warn', reset),
      button('Show answers', 'ghost', reveal)
    ]));
    body.appendChild(feedback);
  }

  // ---------------------------------------------------------------------------
  // 7. Live sandbox
  //    cfg = { inputs: [{name,label,type,min,max,step,value,options}], code: [...],
  //            evaluate: function(values) -> { lines: [..], skipped: [..], output: string|array, explain: html } }
  // ---------------------------------------------------------------------------
  function liveWidget(id, cfg) {
    var card = document.getElementById(id);
    if (!card) return;
    var body = qs('.u2-card__body', card) || card;
    var inputs = {};
    var inputsBar = el('div', { class: 'u2-live__inputs' });
    var interactions = 0;

    (cfg.inputs || []).forEach(function (spec) {
      var input;
      var valueLabel = null;
      if (spec.type === 'select') {
        input = el('select');
        spec.options.forEach(function (option) { input.appendChild(el('option', { value: String(option), text: String(option) })); });
        input.value = String(spec.value);
      } else if (spec.type === 'checkbox') {
        input = el('input', { type: 'checkbox' });
        input.checked = !!spec.value;
      } else {
        input = el('input', { type: spec.type || 'number', value: String(spec.value) });
        if (spec.min !== undefined) input.min = spec.min;
        if (spec.max !== undefined) input.max = spec.max;
        if (spec.step !== undefined) input.step = spec.step;
        if (spec.maxlength !== undefined) input.maxLength = spec.maxlength;
        if (spec.type === 'range') valueLabel = el('span', { class: 'u2-live__value', text: String(spec.value) });
      }
      inputs[spec.name] = { input: input, spec: spec, valueLabel: valueLabel };
      var label = el('label', {}, [spec.label || spec.name, valueLabel ? ' = ' : '', valueLabel]);
      inputsBar.appendChild(el('div', { class: 'u2-live__field' }, [label, input]));
      input.addEventListener('input', function () { interactions += 1; update(); });
      input.addEventListener('change', function () { interactions += 1; update(); });
    });
    body.appendChild(inputsBar);

    var code = renderCode(cfg.code);
    var consoleWrap = renderConsole('Output');
    body.appendChild(el('div', { class: 'u2-live__layout' }, [code, consoleWrap]));
    var explain = el('div', { class: 'u2-live__explain' });
    body.appendChild(explain);

    function readValues() {
      var values = {};
      Object.keys(inputs).forEach(function (name) {
        var entry = inputs[name];
        var input = entry.input;
        if (entry.spec.type === 'checkbox') values[name] = input.checked;
        else if (entry.spec.type === 'select' || entry.spec.type === 'text') values[name] = input.value;
        else {
          var num = Number(input.value);
          if (isNaN(num) || input.value === '') num = Number(entry.spec.value);
          values[name] = entry.spec.decimals ? num : Math.round(num);
          if (entry.valueLabel) entry.valueLabel.textContent = formatValue(values[name]);
        }
      });
      return values;
    }

    function update() {
      var result = cfg.evaluate(readValues()) || {};
      highlightLines(code, result.lines || [], [], result.skipped || []);
      var output = Array.isArray(result.output) ? result.output.join('\n') : (result.output || '');
      setConsole(consoleWrap.box, output);
      explain.innerHTML = result.explain || '';
      if (interactions >= (cfg.doneAfter || 3)) markDone(card);
    }

    update();
  }

  // ---------------------------------------------------------------------------
  // 8. Flowchart walkthrough
  //    cfg = { nodes: [{id, type:'start'|'process'|'decision'|'end', text, next, yes, no}], maxSteps }
  // ---------------------------------------------------------------------------
  function flowWidget(id, cfg) {
    var card = document.getElementById(id);
    if (!card) return;
    var body = qs('.u2-card__body', card) || card;
    var nodesById = {};
    var nodeEls = {};
    var chart = el('div', { class: 'u2-flow__chart' });

    cfg.nodes.forEach(function (node) { nodesById[node.id] = node; });

    function nodeText(nodeId) {
      return nodesById[nodeId] ? '"' + nodesById[nodeId].text + '"' : '?';
    }

    cfg.nodes.forEach(function (node, i) {
      var nodeEl = el('div', { class: 'u2-flow__node u2-flow__node--' + node.type, text: node.text });
      nodeEls[node.id] = nodeEl;
      chart.appendChild(nodeEl);
      if (node.type === 'end') return;
      var following = cfg.nodes[i + 1];
      var followingId = following ? following.id : null;
      var jumps = [];
      if (node.type === 'decision') {
        if (node.yes !== followingId) jumps.push('Yes → ' + nodeText(node.yes));
        if (node.no !== followingId) jumps.push('No → ' + nodeText(node.no));
      } else if (node.next !== followingId) {
        jumps.push('then → ' + nodeText(node.next));
      }
      chart.appendChild(el('div', { class: 'u2-flow__arrow', text: '↓' }));
      if (jumps.length) chart.appendChild(el('div', { class: 'u2-flow__jump', text: jumps.join('    ') }));
    });

    var question = el('div', { class: 'u2-flow__question' });
    var log = el('div', { class: 'u2-flow__log' });
    var controls = el('div', { class: 'u2-controls' });
    var panel = el('div', { class: 'u2-flow__panel' }, [question, controls, log]);
    body.appendChild(el('div', { class: 'u2-flow__layout' }, [chart, panel]));

    var current = null;
    var stepCount = 0;
    var visited = [];

    function setCurrent(nodeId) {
      Object.keys(nodeEls).forEach(function (key) { nodeEls[key].classList.remove('u2-flow__node--active'); });
      current = nodesById[nodeId];
      stepCount += 1;
      nodeEls[nodeId].classList.add('u2-flow__node--active');
      nodeEls[nodeId].classList.add('u2-flow__node--visited');
      var entry = el('div', { html: '<strong>' + stepCount + '.</strong> ' + escapeHtml(current.text) });
      log.appendChild(entry);
      log.scrollTop = log.scrollHeight;
      renderControls();
    }

    function renderControls() {
      controls.innerHTML = '';
      if (!current) {
        question.textContent = 'Press Start to walk through the flowchart.';
        controls.appendChild(button('Start', 'primary', function () { reset(); setCurrent(cfg.nodes[0].id); }));
        return;
      }
      if (current.type === 'end') {
        question.innerHTML = '<strong>Finished</strong> in ' + stepCount + ' steps. ' + (cfg.finish || '');
        controls.appendChild(button('Run again', 'warn', function () { reset(); setCurrent(cfg.nodes[0].id); }));
        markDone(card);
        return;
      }
      if (stepCount > (cfg.maxSteps || 40)) {
        question.innerHTML = '<strong>This is looping a lot.</strong> ' + (cfg.loopWarning || 'Is there a way out of the loop? Try a different answer.');
      } else if (current.type === 'decision') {
        question.innerHTML = '<strong>Decision:</strong> ' + escapeHtml(current.text);
      } else {
        question.innerHTML = escapeHtml(current.text);
      }
      if (current.type === 'decision') {
        controls.appendChild(button('Yes', 'success', function () { logAnswer('Yes'); setCurrent(current.yes); }));
        controls.appendChild(button('No', 'warn', function () { logAnswer('No'); setCurrent(current.no); }));
      } else {
        controls.appendChild(button('Next', 'primary', function () { setCurrent(current.next); }));
      }
      controls.appendChild(button('Reset', 'ghost', reset));
    }

    function logAnswer(answer) {
      var last = log.lastElementChild;
      if (last) last.innerHTML += ' <strong>→ ' + answer + '</strong>';
    }

    function reset() {
      current = null;
      stepCount = 0;
      log.innerHTML = '';
      Object.keys(nodeEls).forEach(function (key) { nodeEls[key].classList.remove('u2-flow__node--active', 'u2-flow__node--visited'); });
      renderControls();
    }

    reset();
  }

  // ---------------------------------------------------------------------------
  // 9. Execution counter
  //    cfg = { code: [...], question, answer, explain, run: function(io) -> count }
  // ---------------------------------------------------------------------------
  function countWidget(id, cfg) {
    var card = document.getElementById(id);
    if (!card) return;
    var body = qs('.u2-card__body', card) || card;
    body.appendChild(renderCode(cfg.code));
    if (cfg.question) body.appendChild(el('p', { class: 'u2-card__prompt', html: cfg.question }));

    var input = el('input', { class: 'u2-count__input', type: 'number', placeholder: 'your guess' });
    var feedback = el('div', { class: 'u2-count__feedback' });
    var meter = el('div', { class: 'u2-count__meter' }, [
      el('div', { class: 'count-value', text: '0' }),
      el('div', { class: 'count-label', text: cfg.label || 'executions' })
    ]);
    var consoleWrap = renderConsole('Output');
    consoleWrap.classList.add('u2-count__console');
    setConsole(consoleWrap.box, '');
    var counted = false;
    var attempts = 0;

    function check() {
      var guess = Number(input.value);
      if (input.value === '' || isNaN(guess)) { setFeedback(feedback, 'info', 'Type a number first.'); return; }
      if (guess === cfg.answer) {
        input.classList.remove('u2-count__input--incorrect');
        input.classList.add('u2-count__input--correct');
        setFeedback(feedback, 'correct', '<strong>Correct: ' + cfg.answer + '.</strong> ' + (cfg.explain || ''));
        announce(card, { widget: 'count', correct: true, firstTry: attempts === 0 });
        markDone(card);
      } else {
        attempts += 1;
        input.classList.add('u2-count__input--incorrect');
        setFeedback(feedback, 'incorrect', '<strong>Not ' + guess + '.</strong> ' + (guess > cfg.answer ? 'Too high.' : 'Too low.') + ' Press <em>Run and count</em> to watch it happen, then explain why.');
        announce(card, { widget: 'count', correct: false, firstTry: false });
      }
    }

    function runAndCount() {
      if (counted) return;
      counted = true;
      var io = { buffer: [], print: function (t) { this.buffer.push(String(t)); }, println: function (t) { this.buffer.push((t === undefined ? '' : String(t)) + '\n'); } };
      var total = cfg.run ? cfg.run(io) : cfg.answer;
      var valueEl = qs('.count-value', meter);
      var shown = 0;
      var stepSize = Math.max(1, Math.ceil(total / 40));
      var timer = window.setInterval(function () {
        shown = Math.min(total, shown + stepSize);
        valueEl.textContent = String(shown);
        if (shown >= total) {
          window.clearInterval(timer);
          counted = false;
          setConsole(consoleWrap.box, io.buffer.join(''));
          if (!input.classList.contains('u2-count__input--correct')) {
            setFeedback(feedback, 'info', '<strong>It ran ' + total + ' times.</strong> ' + (cfg.explain || ''));
          }
        }
      }, 40);
    }

    input.addEventListener('keydown', function (event) { if (event.key === 'Enter') { event.preventDefault(); check(); } });
    body.appendChild(el('div', { class: 'u2-count__row' }, [input, button('Check', 'primary', check), button('Run and count', 'success', runAndCount)]));
    body.appendChild(el('div', { class: 'u2-count__display' }, [meter, consoleWrap]));
    body.appendChild(feedback);
  }

  // ---------------------------------------------------------------------------
  // 10. Quiz scoreboard
  // ---------------------------------------------------------------------------
  function initQuiz(card) {
    var questions = qsa('.u2-mcq__q, .u2-fill__q', card);
    if (!questions.length) return;
    var score = qs('.u2-quiz__score', card);
    if (!score) {
      score = el('div', { class: 'u2-quiz__score' });
      (qs('.u2-card__body', card) || card).appendChild(score);
    }
    var correct = 0;
    var firstTry = 0;

    function render() {
      var pct = Math.round((correct / questions.length) * 100);
      score.innerHTML =
        '<div class="score-label">Score</div>' +
        '<div class="score-value">' + correct + ' / ' + questions.length + '</div>' +
        '<div class="score-sub">' + firstTry + ' correct on the first try</div>' +
        '<div class="score-bar"><div class="score-fill" style="width:' + pct + '%"></div></div>';
    }

    card.addEventListener('u2:answered', function (event) {
      if (!event.detail || !event.detail.correct) return;
      correct += 1;
      if (event.detail.firstTry) firstTry += 1;
      render();
      if (correct >= questions.length) markDone(card);
    });
    render();
  }

  // ---------------------------------------------------------------------------
  // Bootstrap declarative widgets
  // ---------------------------------------------------------------------------
  function init(root) {
    var scope = root || document;
    qsa('.u2-mcq', scope).forEach(function (card) { if (!card.dataset.u2ready) { card.dataset.u2ready = '1'; initMcq(card); } });
    qsa('.u2-fill', scope).forEach(function (card) { if (!card.dataset.u2ready) { card.dataset.u2ready = '1'; initFill(card); } });
    qsa('.u2-order', scope).forEach(function (card) { if (!card.dataset.u2ready) { card.dataset.u2ready = '1'; initOrder(card); } });
    qsa('.u2-sort', scope).forEach(function (card) { if (!card.dataset.u2ready) { card.dataset.u2ready = '1'; initSort(card); } });
    qsa('.u2-quiz', scope).forEach(function (card) { if (!card.dataset.u2quiz) { card.dataset.u2quiz = '1'; initQuiz(card); } });
    qsa('.u2-card', scope).forEach(restoreDone);
  }

  var U2 = window.U2 || {};
  U2.init = init;
  U2.trace = function (id, cfg) { onReady(function () { traceWidget(id, cfg); restoreDone(document.getElementById(id)); }); };
  U2.truth = function (id, cfg) { onReady(function () { truthWidget(id, cfg); restoreDone(document.getElementById(id)); }); };
  U2.live = function (id, cfg) { onReady(function () { liveWidget(id, cfg); restoreDone(document.getElementById(id)); }); };
  U2.flow = function (id, cfg) { onReady(function () { flowWidget(id, cfg); restoreDone(document.getElementById(id)); }); };
  U2.count = function (id, cfg) { onReady(function () { countWidget(id, cfg); restoreDone(document.getElementById(id)); }); };
  window.U2 = U2;

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function () { init(document); });
})(window, document);
