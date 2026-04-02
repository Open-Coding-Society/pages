// ============================================================
//  vocab.js — Vocabulary fill-in-the-blank
//  Path: assets/js/bigsix/backend/vocab.js
// ============================================================

export class Vocab {
  #vocabMap;

  constructor(vocabMap) {
    this.#vocabMap = vocabMap;
  }

  init() {
    Object.entries(this.#vocabMap).forEach(([id, items]) => {
      this.#renderVocab(id, items);
      const num = id.replace('vocab', '');
      document.getElementById(`gradeVocab${num}Btn`)
        ?.addEventListener('click', () => this.#gradeVocab(id, items));
      document.getElementById(`resetVocab${num}Btn`)
        ?.addEventListener('click', () => {
          document.getElementById(`${id}-score`).style.display = 'none';
          this.#renderVocab(id, items);
        });
    });
  }

  #renderVocab(vocabId, items) {
    const box = document.getElementById(vocabId);
    if (!box) return;
    box.innerHTML = items.map((item, i) => `
      <div class="vocab-item">
        <div class="vocab-clue">
          ${item.clue}<br>
          <span class="hint">Hint: ${item.hint}</span>
        </div>
        <input class="vocab-input" id="${vocabId}-inp-${i}" placeholder="?" maxlength="10"/>
      </div>`).join('');
  }

  #gradeVocab(vocabId, items) {
    let correct = 0;
    items.forEach((item, i) => {
      const inp = document.getElementById(`${vocabId}-inp-${i}`);
      if (!inp) return;
      const ok = inp.value.trim().toUpperCase() === item.answer.toUpperCase();
      if (ok) correct++;
      inp.classList.toggle('correct',  ok);
      inp.classList.toggle('wrong',   !ok && inp.value.trim() !== '');
    });
    const scoreEl = document.getElementById(`${vocabId}-score`);
    if (scoreEl) {
      scoreEl.style.display = '';
      scoreEl.textContent   = `${correct} / ${items.length}`;
      scoreEl.className     = 'score-badge' + (correct === items.length ? ' perfect' : '');
    }
  }
}
