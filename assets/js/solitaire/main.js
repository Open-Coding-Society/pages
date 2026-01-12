// /assets/js/solitaire/main.js
import { UI } from './ui.js';
import { Game } from './game.js';
import { Controller } from './controller.js';

// Bootstrap
const ui = new UI();
const game = new Game(ui);
const controller = new Controller(game, ui);
ui.setController(controller);

// Button wiring (IDs preserved)
document.getElementById('new_game').onclick = () => controller.startNewGame();
document.getElementById('new_game1').onclick = () => controller.startNewGame();
document.getElementById('menu_return').onclick = () => controller.showMenu();
document.getElementById('restart_btn').onclick = () => controller.restart();
document.getElementById('hint_btn').onclick = () => controller.hint();
document.getElementById('undo_btn').onclick = () => controller.undo();
document.getElementById('play_again_btn').onclick = () => controller.restart();

// Keyboard: press Space on menu to start
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && ui.menu.style.display !== 'none') controller.startNewGame();
});

// Initial screen
ui.showMenu();

// ----- Instructions Modal (unchanged behavior) -----
const modal = document.getElementById("instructions_modal");
const instructionsBtn = document.getElementById("instructions");
const closeBtn = document.getElementsByClassName("close")[0];

if (instructionsBtn && modal && closeBtn) {
  instructionsBtn.onclick = function() { modal.style.display = "block"; }
  closeBtn.onclick = function() { modal.style.display = "none"; }
  window.addEventListener('click', function(event) {
    if (event.target === modal) modal.style.display = "none";
  });
  document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
    }
  });
  // Match original behavior:
  document.body.style.overflow = "hidden";
  document.body.style.overflow = "auto";
}
