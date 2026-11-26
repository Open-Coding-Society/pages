---
layout: opencs
title: Member app demo
description: A demo of a members app built from OCS systems, for a made-up investment group. Every member, series and message in it is made up.
permalink: /community/demo/
search_exclude: true
---
{%- comment -%}
The Community system's demo, for a made-up investment group. README.md in
_projects/systems/community explains how it fits together.

Everything shown is made up and stays in the browser: js/demo-store.js holds the data and
the rules a server would check, and js/demo-backend.js answers the same calls OCS Messages
makes to Spring, so the chats are Messages' own thread pane. The words are in
data/texts.yml and the organization's setup (names, colors, channels) in data/demo.yml. The
look is its colors given to the OCS theme engine; the page has no stylesheet of its own.

The starter at the bottom imports the other systems' modules with site.baseurl and hands
them to CommunityApp, so Community's modules only import each other with ./ paths.
{%- endcomment -%}
{%- assign text = site.data.projects.community.texts -%}
{%- assign setup = site.data.projects.community.demo -%}
<div class="ocs__container ocs__stack" data-community>
  <div class="ocs__card ocs__stack">
    <div class="ocs__card-header">
      <div>
        <h2 class="ocs__section-title">{{ setup.org.name }}</h2>
        <small>{{ setup.org.tagline }} · {{ text.app.title }}</small>
      </div>
      <span class="ocs__status-pill ocs__status-pill--warn">{{ text.app.demo }}</span>
    </div>
    <div class="ocs__callout">{{ text.app.made_up }}</div>
    <details data-community-controls>
      <summary>{{ text.app.controls }}</summary>
      <div class="ocs__stack">
        <div class="ocs__split">
          <div class="ocs__field">
            <label class="ocs__label" for="communityViewer">{{ text.app.viewing_as }}</label>
            <select class="ocs__input" id="communityViewer"></select>
          </div>
          <div class="ocs__field">
            <label class="ocs__label" for="communityLook">{{ text.app.look }}</label>
            <select class="ocs__input" id="communityLook"></select>
          </div>
        </div>
        <small>{{ text.app.built_from }}</small>
      </div>
    </details>
  </div>

  <div class="ocs__tabs ocs__tabs--fit">
    <ul class="ocs__tabs-list" id="communityTabs" role="tablist" aria-label="{{ text.app.sections }}"></ul>
  </div>
  <p class="ocs__text" id="communityNotice" role="status" hidden></p>
  <div class="ocs__tabs-panels" id="communityPanels"></div>
</div>

<div class="ocs__modal hidden" id="communityScheduleDialog" role="dialog" aria-modal="true" aria-labelledby="communityScheduleTitle">
  <form class="ocs__modal-card ocs__stack" id="communityScheduleForm">
    <div class="ocs__modal-header">
      <h3 class="ocs__modal-title" id="communityScheduleTitle">{{ text.schedule.title }}</h3>
      <button type="button" class="ocs__btn small" data-close aria-label="{{ text.schedule.close }}">&times;</button>
    </div>
    <div class="ocs__field">
      <label class="ocs__label" for="communityScheduleName">{{ text.schedule.name }}</label>
      <input class="ocs__input" id="communityScheduleName" type="text" autocomplete="off" required data-focus>
    </div>
    <div class="ocs__split">
      <div class="ocs__field">
        <label class="ocs__label" for="communityScheduleDate">{{ text.schedule.day }}</label>
        <input class="ocs__input" id="communityScheduleDate" type="date" required>
      </div>
      <div class="ocs__field">
        <label class="ocs__label" for="communityScheduleTime">{{ text.schedule.time }}</label>
        <input class="ocs__input" id="communityScheduleTime" type="time">
      </div>
    </div>
    <p class="ocs__text" id="communityScheduleStatus" role="status"></p>
    <div class="ocs__modal-actions">
      <button type="button" class="ocs__btn" data-close>{{ text.schedule.cancel }}</button>
      <button type="submit" class="ocs__btn accent fill" id="communityScheduleSave">{{ text.schedule.save }}</button>
    </div>
  </form>
</div>

<div class="ocs__modal hidden" id="communityReplyDialog" role="dialog" aria-modal="true" aria-labelledby="communityReplyTitle">
  <form class="ocs__modal-card ocs__stack" id="communityReplyForm">
    <div class="ocs__modal-header">
      <h3 class="ocs__modal-title" id="communityReplyTitle">{{ text.reply.title }}</h3>
      <button type="button" class="ocs__btn small" data-close aria-label="{{ text.reply.cancel }}">&times;</button>
    </div>
    <div class="dm dm--embed" id="communityReplyQuote"></div>
    <small>{{ text.reply.hint }}</small>
    <div class="ocs__field" id="communityReplyGroupField">
      <label class="ocs__label" for="communityReplyGroup">{{ text.reply.group }}</label>
      <select class="ocs__input" id="communityReplyGroup"></select>
    </div>
    <div id="communityReplyComposer"></div>
    <p class="ocs__text" id="communityReplyStatus" role="status"></p>
    <div class="ocs__modal-actions">
      <button type="button" class="ocs__btn" data-close>{{ text.reply.cancel }}</button>
      <button type="submit" class="ocs__btn accent fill" id="communityReplySend">{{ text.reply.send }}</button>
    </div>
  </form>
</div>

<div class="ocs__modal hidden" id="communityReportDialog" role="dialog" aria-modal="true" aria-labelledby="communityReportTitle">
  <form class="ocs__modal-card ocs__stack" id="communityReportForm">
    <div class="ocs__modal-header">
      <h3 class="ocs__modal-title" id="communityReportTitle">{{ text.report.title }}</h3>
      <button type="button" class="ocs__btn small" data-close aria-label="{{ text.report.cancel }}">&times;</button>
    </div>
    <fieldset class="ocs__stack" id="communityReportPick">
      <legend class="ocs__label">{{ text.report.pick }}</legend>
    </fieldset>
    <div class="ocs__field">
      <label class="ocs__label" for="communityReportReason">{{ text.report.reason }}</label>
      <select class="ocs__input" id="communityReportReason"></select>
    </div>
    <div class="ocs__field">
      <label class="ocs__label" for="communityReportNote">{{ text.report.note }}</label>
      <textarea class="ocs__input" id="communityReportNote" rows="3" maxlength="500"></textarea>
    </div>
    <p class="ocs__text" id="communityReportStatus" role="status"></p>
    <div class="ocs__modal-actions">
      <button type="button" class="ocs__btn" data-close>{{ text.report.cancel }}</button>
      <button type="submit" class="ocs__btn accent fill" id="communityReportSend">{{ text.report.send }}</button>
    </div>
  </form>
</div>

<div class="ocs__modal hidden" id="communityNewDialog" role="dialog" aria-modal="true" aria-labelledby="communityNewTitle">
  <form class="ocs__modal-card ocs__stack" id="communityNewForm">
    <div class="ocs__modal-header">
      <h3 class="ocs__modal-title" id="communityNewTitle">{{ text.inbox.new }}</h3>
      <button type="button" class="ocs__btn small" data-close aria-label="{{ text.inbox.cancel }}">&times;</button>
    </div>
    <small id="communityNewRule"></small>
    <div class="ocs__field">
      <label class="ocs__label" for="communityNewTo">{{ text.inbox.to }}</label>
      <select class="ocs__input" id="communityNewTo" data-focus></select>
    </div>
    <p class="ocs__text" id="communityNewStatus" role="status"></p>
    <div class="ocs__modal-actions">
      <button type="button" class="ocs__btn" data-close>{{ text.inbox.cancel }}</button>
      <button type="submit" class="ocs__btn accent fill">{{ text.inbox.start }}</button>
    </div>
  </form>
</div>

<script type="application/json" id="communitySetup">{{ setup | jsonify | replace: "</", "<\/" }}</script>
<script type="application/json" id="communityTexts">{{ text | jsonify | replace: "</", "<\/" }}</script>
<script type="module">
  import * as richText from '{{ site.baseurl }}/assets/js/chat/rich-text.js';
  import { encodeEventMarker, extractEventMarkers, formatShortDate } from '{{ site.baseurl }}/assets/js/chat/calendar/calendar-model.js';
  import { mountWeekView } from '{{ site.baseurl }}/assets/js/chat/calendar/calendar-feed.js';
  import { getSurveyResults, normalizeSurveyOptions } from '{{ site.baseurl }}/assets/js/projects/microblog/microblog.js';
  import { createThread } from '{{ site.baseurl }}/assets/js/projects/messages/thread.js';
  import { createMessageLog } from '{{ site.baseurl }}/assets/js/projects/messages/message-log.js';
  import { classifyGroupEvent, groupMessage } from '{{ site.baseurl }}/assets/js/projects/messages/messages-model.js';
  import { Conversation } from '{{ site.baseurl }}/assets/js/projects/messages/conversation-model.js';
  import { createDialog, saveBlob } from '{{ site.baseurl }}/assets/js/projects/messages/dialogs.js';
  import { initScheduleDialog } from '{{ site.baseurl }}/assets/js/projects/messages/schedule-dialog.js';
  import { plainText } from '{{ site.baseurl }}/assets/js/projects/messages/schedule-model.js';
  import { CommunityApp } from '{{ site.baseurl }}/assets/js/projects/community/community-app.js';
  import { DemoBackend } from '{{ site.baseurl }}/assets/js/projects/community/demo-backend.js';
  import { DemoStore } from '{{ site.baseurl }}/assets/js/projects/community/demo-store.js';
  import { Texts } from '{{ site.baseurl }}/assets/js/projects/community/texts.js';

  const read = id => JSON.parse(document.getElementById(id).textContent);
  const setup = read('communitySetup');
  const texts = new Texts(read('communityTexts'));
  const store = new DemoStore(setup, { encodeEventMarker, extractEventMarkers });
  const backend = new DemoBackend(store, {
    texts, plainText, stripChatMarkers: richText.stripChatMarkers, normalizeSurveyOptions, extractPinMarker: Conversation.extractPinMarker,
  });
  const kit = {
    richText, createThread, createMessageLog, classifyGroupEvent, groupMessage, Conversation, createDialog, saveBlob,
    initScheduleDialog, extractEventMarkers, formatShortDate, mountWeekView, getSurveyResults,
  };
  const app = new CommunityApp({
    root: document.querySelector('[data-community]'), setup, texts, backend, kit, sitePreferences: window.SitePreferences,
  });
  app.start();
</script>
