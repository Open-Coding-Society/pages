---
layout: opencs
title: "Connect 4 Challenges"
permalink: /connect4/lesson/challenges
---

# 🚀 Connect 4 Challenges
Fun, easy mini-tasks to practice what you learned in the lesson.

## 🎮 What to Expect
Short, beginner‑friendly tasks that take 5–10 minutes each. You’ll tweak small pieces of the existing code from the lesson. No frameworks, just HTML/CSS/JS.

Use the classes you saw in the lesson:
- `Player` (name, color, coins, time)
- `GameBoard` (grid, rows/cols, `placePiece`)
- `GameUI` (updates the screen)
- `Connect4Game` (glues everything together)

---

## 1) Color Theme Switcher (Easy, 5m)
Add a small toggle to switch between “Classic” and “Midnight” themes.

- Do This
  - Add two buttons above the game: Classic and Midnight.
  - When clicked, update CSS variables (`--red`, `--yellow`, `--blue`, `--card`).

- Check It
  - Colors change immediately without reloading.
  - Board and pieces use the new colors.

---

## 2) Column Highlight on Hover (Easy, 5m)
Make the column you’re about to drop in glow so it’s easy to aim.

- Do This
  - In `GameUI`, when the mouse moves over a hole, add a class like `.preview-col` to all holes with the same `data-col`.
  - Remove the class when the mouse leaves the board.

- Check It
  - Only one column is highlighted at a time.
  - No errors when moving the mouse quickly.

---

## 3) Drop “Click” Sound (Easy, 5m)
Play a short sound when the piece lands.

- Do This
  - Add an `<audio id="dropSound">` tag with a tiny click sound (you can use any short MP3 in `assets/audio/`).
  - After `placePiece(...)` succeeds, call `document.getElementById('dropSound').play()`.

- Check It
  - Sound plays only on valid drops.
  - No sound on invalid clicks.

---

## 4) Restart Confirmation (Easy, 5m)
Prevent accidental restarts with a simple confirm step.

- Do This
  - When the `Restart` button is clicked, show `confirm('Start a new game?')`.
  - Only restart if the user clicks OK.

- Check It
  - Cancel keeps the current game.
  - OK starts fresh.

---

## 5) Win Banner Emoji (Easy, 5–10m)
Make the win message more fun with emojis and color.

- Do This
  - In `GameUI.showWinMessage(message)`, add an emoji based on the winner:
    - Red wins → "🔴"; Yellow wins → "🟡"; Draw → "🤝".
  - Add a subtle glow around the banner.

- Check It
  - The right emoji shows every time.
  - Banner looks good on dark background.

---

## ✨ Bonus: Keyboard Drop (Optional, 10m)
Let players press Left/Right to move a “ghost” column and Enter to drop.

- Hints
  - Keep a `selectedCol` number in `Connect4Game`.
  - On keydown, update `selectedCol` and tell `GameUI` to highlight that column.
  - On Enter, reuse your regular click handler to drop.

---

## ✅ Turn‑In Checklist
<div id="c4-checklist" class="checklist">
  <label><input type="checkbox" data-key="theme"> I can switch themes with one click.</label>
  <label><input type="checkbox" data-key="highlight"> The current column highlights on hover.</label>
  <label><input type="checkbox" data-key="sound"> A click sound plays when a piece lands.</label>
  <label><input type="checkbox" data-key="confirm"> Restart asks for confirmation.</label>
  <label><input type="checkbox" data-key="banner"> The win banner shows the right emoji.</label>
  <label><input type="checkbox" data-key="keyboard"> (Bonus) I can play with the keyboard.</label>
</div>

<script>
// Simple persistent checklist (no external libs). Scoped by page path.
(function(){
  const KEY = 'c4Checklist:' + location.pathname;
  const box = document.getElementById('c4-checklist');
  if (!box) return;
  function load(){
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  }
  function save(state){ localStorage.setItem(KEY, JSON.stringify(state)); }
  const state = load();
  box.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    const k = cb.dataset.key;
    cb.checked = !!state[k];
    cb.addEventListener('change', () => {
      state[k] = cb.checked;
      save(state);
    });
  });
})();
</script>

<style>
/* Light styling that matches dark theme cards */
.checklist { display: grid; gap: .4rem; padding:.5rem 0; }
.checklist label { display:flex; align-items:center; gap:.5rem; cursor:pointer; }
.checklist input[type="checkbox"]{ width:1rem; height:1rem; accent-color:#22c55e; }
</style>

---

## 🔗 Helpful Links
- Lesson walkthrough: `/lesson/`
- Game page: `/`
