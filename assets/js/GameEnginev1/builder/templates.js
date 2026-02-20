// Templates utility for GameBuilder (v1)
// Exposes `GameTemplatesV1` on window with functions that return code snippets
(function (global) {
  const tpl = {};

  tpl.playerData = function ({ name, p, ui, keypress, bg }) {
    return `const playerData = {
            id: '${name}',
            src: ${p.src.startsWith('/') ? "'" + p.src + "'" : "path + \"" + p.src + "\""},
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: ${ui.pX?.value || 0}, y: ${ui.pY?.value || 0} },
            pixels: { height: ${p.h}, width: ${p.w} },
            orientation: { rows: ${p.rows}, columns: ${p.cols} },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: Math.min(1, ${p.rows} - 1), start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: Math.min(2, ${p.rows} - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
            right: { row: Math.min(1, ${p.rows} - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, ${p.rows} - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, ${p.rows} - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(1, ${p.rows} - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
            upLeft: { row: Math.min(2, ${p.rows} - 1), start: 0, columns: 3, rotate: Math.PI/16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: ${keypress}
        };`;
  };

  tpl.npcData = function ({ index, nId, nMsg, nSprite, nX, nY }) {
    return `const npcData${index} = {
            id: '${nId}',
            greeting: '${nMsg}',
            src: path + "${nSprite.src}",
            SCALE_FACTOR: 8,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: ${nX}, y: ${nY} },
            pixels: { height: ${nSprite.h}, width: ${nSprite.w} },
            orientation: { rows: ${nSprite.rows}, columns: ${nSprite.cols} },
            down: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['${nMsg}'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };`;
  };

  global.GameTemplatesV1 = tpl;
})(window);
