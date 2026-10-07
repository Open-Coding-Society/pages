---
layout: opencs
title: GameBuilder Workbench v2
description: GameBuilder Workbench v2 using GAME_RUNNER and standard Game Code.
permalink: /gamebuilder/v2/
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="ocs__gamebuilder-system ocs__container ocs__gamebuilder-workbench" data-gamebuilder-workbench data-base-url="{{ site.baseurl }}">
  <header class="ocs__gamebuilder-header">
    {% include projects/cs-pathway/cs-pathway-menu.html %}
  </header>

  <header class="ocs__gamebuilder-workbench-header">
    <h1>GameBuilder Workbench</h1>
    <button class="ocs__btn" type="button" data-action="toggle-builder" aria-expanded="true" aria-controls="gamebuilder-builder-panel">Hide builder</button>
  </header>

  <div class="ocs__gamebuilder-workspace" data-role="workspace">
    <section class="ocs__card ocs__gamebuilder-builder" id="gamebuilder-builder-panel" data-role="builder-panel" aria-labelledby="gamebuilder-builder-title">
      <header class="ocs__gamebuilder-panel-header">
        <h2 class="ocs__section-title" id="gamebuilder-builder-title">Level setup</h2>
        <div class="ocs__gamebuilder-panel-actions" role="group" aria-label="Builder actions">
          <button class="ocs__btn utility ocs__btn--icon" type="button" data-action="clear-builder" title="Clear panel to starter settings (keep runner code)" aria-label="Clear Builder">
            <span class="ocs__btn-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 6V3h12v3h4v2H2V6h4zm2 0h8V5H8v1zM5 10h14l-1 12H6L5 10zm4 2v8h2v-8H9zm4 0v8h2v-8h-2z"/></svg></span>
          </button>
          <button class="ocs__btn utility ocs__btn--icon" type="button" data-action="pull" title="Pull supported settings from runner code" aria-label="Pull Code into Builder">
            <span class="ocs__btn-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m10 4-8 8 8 8 1.4-1.4L5.8 13H22v-2H5.8l5.6-5.6L10 4z"/></svg></span>
          </button>
          <button class="ocs__btn utility ocs__btn--icon" type="button" data-action="generate" title="Push generated code to runner" aria-label="Push Builder to Code">
            <span class="ocs__btn-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m14 4 8 8-8 8-1.4-1.4 5.6-5.6H2v-2h16.2l-5.6-5.6L14 4z"/></svg></span>
          </button>
          <p class="ocs__gamebuilder-status ocs__gamebuilder-action-feedback" data-role="status" role="status" aria-live="polite"></p>
        </div>
      </header>
      <form class="ocs__gamebuilder-form" data-role="builder-form">
        <label>
          Game name
          <input class="ocs__input" name="game-name" type="text" required value="My Game">
        </label>
        <fieldset>
          <legend>Environment</legend>
          <label>
            Background
            <select class="ocs__input" name="background" required></select>
          </label>
        </fieldset>
        <fieldset>
          <legend>Player</legend>
          <label>
            Name
            <input class="ocs__input" name="player-name" type="text" required value="Player">
          </label>
          <label>
            Sprite
            <select class="ocs__input" name="player-sprite" required></select>
          </label>
          <label>
            X position (0–1)
            <input class="ocs__input" name="player-x" type="number" min="0" max="1" step="0.01" required value="0.5">
          </label>
          <label>
            Y position (0–1)
            <input class="ocs__input" name="player-y" type="number" min="0" max="1" step="0.01" required value="0.8">
          </label>
        </fieldset>
        <fieldset class="ocs__gamebuilder-npcs" data-role="npcs-fieldset">
          <legend>NPCs</legend>
          <button class="ocs__btn ocs__gamebuilder-add-npc" type="button" data-action="add-npc">Add NPC</button>
          <p class="ocs__gamebuilder-npc-empty" data-role="npc-empty">No NPCs added yet.</p>
          <div class="ocs__gamebuilder-npc-list" data-role="npc-list"></div>
        </fieldset>
        <fieldset class="ocs__gamebuilder-barriers" data-role="barriers-fieldset">
          <legend>Spline barriers</legend>
          <p class="ocs__gamebuilder-form-help">Click the preview to add points. Undo removes the last point; finish the barrier from its card.</p>
          <button class="ocs__btn" type="button" data-action="add-barrier">Add spline barrier</button>
          <p class="ocs__gamebuilder-barrier-empty" data-role="barrier-empty">No barriers added yet.</p>
          <div class="ocs__gamebuilder-barrier-list" data-role="barrier-list"></div>
        </fieldset>
        <p class="ocs__gamebuilder-form-help">Player and NPC positions use proportions of the runner canvas. Movement uses WASD.</p>
      </form>
    </section>

    <section class="ocs__gamebuilder-runner" aria-label="Game code and preview">
      {% include runners/game.html runner_id="gamebuilder-v2" editor_height="24rem" output_height="28rem" hide_challenge="true" workspace_controls=true code="" %}
    </section>
  </div>
</div>

<script type="module" src="{{ '/assets/js/projects/gamebuilder/app.mjs' | relative_url }}"></script>
<!-- markdownlint-enable MD033 MD010 MD012 -->
