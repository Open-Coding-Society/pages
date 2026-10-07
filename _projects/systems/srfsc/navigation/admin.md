---
layout: opencs
title: SRFSC Council Admin
description: Admin tools for managing updates, events, volunteer signups, and hazard reports for the Scripps Ranch Fire Safe Council.
permalink: /capstone/srfsc/app/admin/
hide: true
search_exclude: true
---

<!-- markdownlint-disable MD033 -->
<div class="srfsc-app">
  {% include projects/srfsc/srfsc-nav.html active="admin" %}

  <section class="srfsc-panel srfsc-admin-gate" id="srfsc-admin-gate">
    <h1 class="srfsc-panel__title">Council admin</h1>
    <p id="srfsc-admin-gate-message">Checking your access…</p>
    <form class="srfsc-form srfsc-admin-key" id="srfsc-admin-key-form" novalidate>
      <label class="srfsc-field">Council admin key
        <input name="admin_key" type="password" required autocomplete="current-password">
      </label>
      <button class="ocs__btn alert-green fill small" type="submit">Unlock admin tools</button>
    </form>
  </section>

  <!-- Only revealed when the admin-only endpoints answer, i.e. the viewer is an Admin -->
  <section class="srfsc-panel srfsc-admin" id="srfsc-admin" hidden>
    <header class="srfsc-panel__header">
      <h1 class="srfsc-panel__title">Council admin</h1>
      <button class="ocs__btn small" type="button" id="srfsc-admin-forget">Forget key</button>
    </header>
    <div class="srfsc-admin__grid">
      <div>
        <h2>Hazard reports</h2>
        <div id="srfsc-admin-reports"></div>
        <h2>Volunteers</h2>
        <div id="srfsc-admin-volunteers"></div>
      </div>
      <div>
        <form class="srfsc-form" id="srfsc-admin-update-form" novalidate>
          <h2>Post an update</h2>
          <label class="srfsc-field">Title<input name="title" required maxlength="255"></label>
          <label class="srfsc-field">Category
            <select name="category"><option>News</option><option>Impact Story</option><option>Partner</option></select>
          </label>
          <label class="srfsc-field">Body<textarea name="body" rows="3" required maxlength="2000"></textarea></label>
          <button class="ocs__btn alert-green fill" type="submit">Publish</button>
          <p class="srfsc-form__status" aria-live="polite"></p>
        </form>
        <form class="srfsc-form" id="srfsc-admin-event-form" novalidate>
          <h2>Add an event</h2>
          <label class="srfsc-field">Title<input name="title" required maxlength="255"></label>
          <label class="srfsc-field">Type
            <select name="event_type">
              <option>Clearing Day</option><option>Block Meeting</option><option>Fire Safety Expo</option><option>Board Meeting</option>
            </select>
          </label>
          <label class="srfsc-field">Date<input name="event_date" type="date" required></label>
          <label class="srfsc-field">Location<input name="location" required maxlength="255"></label>
          <label class="srfsc-field">Description<textarea name="description" rows="2" maxlength="2000"></textarea></label>
          <button class="ocs__btn alert-yellow fill" type="submit">Add event</button>
          <p class="srfsc-form__status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  </section>

  {% include projects/srfsc/srfsc-footer.html %}
</div>

<script type="module">
  import { initSrfscAdmin } from '{{site.baseurl}}/assets/js/projects/srfsc/srfscAdmin.js';

  initSrfscAdmin();
</script>
