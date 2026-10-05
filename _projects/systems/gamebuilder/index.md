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
    <div class="ocs__gamebuilder-header-actions">
      <a href="{{ '/gamebuilder/' | relative_url }}" aria-label="Open the original GameBuilder" title="Open the original GameBuilder">GameBuilder v1</a>
      <a href="{{ '/gamebuilder/doc' | relative_url }}" target="_blank" rel="noopener noreferrer" aria-label="GameBuilder asset documentation" title="GameBuilder asset documentation">Asset docs</a>
    </div>
  </header>

  <header class="ocs__gamebuilder-workbench-header">
    <h1>GameBuilder Workbench</h1>
    <button class="ocs__btn" type="button" data-action="toggle-builder" aria-expanded="true" aria-controls="gamebuilder-builder-panel">Hide builder</button>
  </header>

  <p class="ocs__gamebuilder-status" data-role="status" data-state="info" role="status" aria-live="polite">Loading starter assets and GAME_RUNNER…</p>

  <div class="ocs__gamebuilder-workspace" data-role="workspace">
    <section class="ocs__card ocs__gamebuilder-builder" id="gamebuilder-builder-panel" data-role="builder-panel" aria-labelledby="gamebuilder-builder-title">
      <header class="ocs__gamebuilder-panel-header">
        <h2 class="ocs__section-title" id="gamebuilder-builder-title">Level setup</h2>
        <button class="ocs__btn primary" type="button" data-action="generate">Generate / Sync Code</button>
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
        <p class="ocs__gamebuilder-form-help">Positions are proportions of the runner canvas. Movement uses WASD.</p>
      </form>
    </section>

    <section class="ocs__gamebuilder-runner" aria-label="Game code and preview">
      {% include runners/game.html runner_id="gamebuilder-v2" editor_height="24rem" output_height="28rem" hide_challenge="true" code="" %}
    </section>
  </div>
</div>

<script type="module" src="{{ '/assets/js/projects/gamebuilder/app.mjs' | relative_url }}"></script>
<!-- markdownlint-enable MD033 MD010 MD012 -->
