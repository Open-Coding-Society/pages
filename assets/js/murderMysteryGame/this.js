this.classes = [
  { class: GameEnvBackground, data: image_data_background },
  { class: Player, data: sprite_data_player },
  { class: Npc, data: sprite_data_npc },
  { class: Enemy, data: sprite_data_enemy },
  { class: Arrow, data: sprite_data_arrow } // Register Arrow
];

// Example game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const obj of gameEnv.gameObjects) {
        obj.update && obj.update();
        obj.draw && obj.draw(ctx);
    }
    requestAnimationFrame(gameLoop);
}