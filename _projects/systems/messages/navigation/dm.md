---
layout: opencs
title: Messages
description: Your groups and direct messages in one place.
permalink: /dm
search_exclude: true
full_width: true
---
{%- comment -%}
Messages (/dm): your groups and direct messages, side by side.

The look is this project's own: _projects/systems/messages/sass/, scoped entirely under
.dm. It deliberately does not use .announcement-chat (the course-chat skin) any more --
those rules are nested inside that class in _projects/systems/courses/sass/main.scss, so
dropping the class detaches them and leaves the course chats untouched.

The `chat-*` and `ocs__*` class names that remain are the ones js/message-log.js,
js/sidebar.js and the dialog modules generate at runtime; they are restyled under .dm
rather than replaced, so no behaviour changes. Every id here is looked up by
js/messages-page.js -- renaming one silently breaks a control.

The behaviour is in _projects/systems/messages/js/, started by messages-page.js at the
bottom; README.md in that folder explains how it fits together.

The page fills the window under the site header instead of sitting in the reading
column: `full_width: true` above is the site's own switch for that (it widens the
layout's wrapper), and sass/_layout.scss takes the rest of the room. The page title
and the connection status live at the top of the conversation list, so the list and
the open conversation each start with a bar of the same height.
{%- endcomment -%}
{%- assign message_courses = "csse,csp,csa,csh" | split: "," -%}
{%- capture course_options -%}
{%- for code in message_courses -%}
{%- assign course_code = code | upcase -%}
<option value="{{ course_code }}">{{ site.data[code].course.title | default: course_code }}</option>
{%- endfor -%}
{%- endcapture -%}
{%- capture period_options -%}
{%- for period in (1..5) -%}<option value="{{ period }}">Period {{ period }}</option>{%- endfor -%}
{%- endcapture -%}

<div class="dm">

  <p class="dm__notice" id="messagesSignedOut" hidden>Sign in to see your groups and send messages.</p>
  <p class="dm__notice" id="messagesNotice" role="status"></p>

  <div class="dm__shell">

    <nav class="dm__aside" aria-label="Conversations">
      <header class="dm__masthead">
        <h1 class="dm__title" id="messagesTitle">Messages</h1>
        <button type="button" class="ocs__btn small hidden" id="messagesNotify" aria-pressed="false">Notify my phone</button>
        <span class="dm__status" id="messagesStatusPill">
          <span class="dm__status-dot" aria-hidden="true"></span>
          <span id="messagesStatus">loading…</span>
        </span>
      </header>
      <div class="dm__aside-scroll">
        {%- comment -%}
          Narrows the Groups and Direct messages lists below to the rows whose group
          name, class, period or people match (messages-model.js's
          matchesConversationSearch). Searching inside one chat is the box in its header.
        {%- endcomment -%}
        <form class="dm__find" role="search" autocomplete="off" onsubmit="return false">
          <input class="ocs__input" id="messagesConversationSearch" type="search" placeholder="Find a conversation" aria-label="Find a conversation by group or person" disabled>
        </form>
        <section class="dm__group">
          <div class="dm__group-head">
            <h2 class="dm__group-title">Groups</h2>
            <button type="button" class="dm__action" id="messagesFindGroup" disabled>Find or make</button>
          </div>
          <div class="dm__list" id="messagesGroupList"></div>
        </section>

        <section class="dm__group">
          <div class="dm__group-head">
            <h2 class="dm__group-title">Direct messages</h2>
            <button type="button" class="dm__action" id="messagesNewChat" disabled>New chat</button>
          </div>
          <div class="dm__list" id="messagesDmList"></div>
        </section>
      </div>
    </nav>

    <section class="dm__thread" aria-labelledby="messagesThreadTitle">
      <header class="dm__thread-head">
        <button type="button" class="dm__back" data-dm-back>Conversations</button>
        <div class="dm__thread-heading">
          <h2 class="dm__thread-title" id="messagesThreadTitle">Pick a conversation</h2>
          <small class="dm__thread-subtitle" id="messagesThreadSubtitle"></small>
        </div>
        {%- comment -%}
          Search inside the open direct message. message-search.js shows it only while a
          DM is open and enables it once someone is signed in; its matches list in the
          panel under the header.
        {%- endcomment -%}
        <form class="dm__search" id="messagesSearchForm" role="search" autocomplete="off" hidden>
          <input class="ocs__input" id="messagesSearch" type="search" placeholder="Search this chat" aria-label="Search this chat" disabled>
        </form>
        <div class="dm__thread-actions hidden" id="messagesGroupActions">
          <button type="button" class="dm__action" id="messagesMembers">Members</button>
          <button type="button" class="dm__action" id="messagesSharedButton" title="Files, media, links and pins"><i class="fas fa-folder-open" aria-hidden="true"></i> Shared</button>
          <button type="button" class="dm__action" id="messagesLeaveGroup">Leave</button>
        </div>
      </header>

      <div class="dm__search-panel" id="messagesSearchPanel" hidden>
        <p class="dm__search-status" id="messagesSearchStatus" role="status"></p>
        <div class="dm__list dm__search-results" id="messagesSearchResults"></div>
      </div>

      <div class="dm__log" id="messagesLog" role="log" aria-live="polite" tabindex="0"></div>

      {%- comment -%}
        Dropping files or folders anywhere on the open conversation shares them (a group
        chat) or attaches an image (any chat); js/composer-files.js shows this over the pane
        while something is dragged over it and words it for the conversation.
      {%- endcomment -%}
      <p class="dm__drop-hint" id="messagesDropHint" aria-hidden="true"></p>

      {%- comment -%}
        Files waiting to be shared with the next message (js/attachments.js), and their
        upload progress once Send is pressed.
      {%- endcomment -%}
      <div class="dm__tray" id="messagesAttachTray" hidden></div>

      {%- comment -%}
        The code box /code and /gist open (js/code-composer.js).
      {%- endcomment -%}
      <div class="dm__code-host" id="messagesCodeHost"></div>

      <div class="dm__attach-preview hidden" id="messagesImagePreview">
        <img id="messagesImageThumb" alt="Image attached to your next message">
        <button type="button" class="dm__action" id="messagesImageRemove">Remove</button>
      </div>

      {%- comment -%}
        The form is the composer's box. thread.js inserts the rich composer before the
        Cancel button; sass/_composer.scss gives it the box's whole first row and lines the
        controls up on the right beneath it, whatever order they come in here. Attach opens
        a menu (js/composer-files.js, the ocs__menu grammar) whose choices click one of the
        visually hidden file inputs: an image in any chat, and files or a folder in a group.
        The inputs are out of the tab order because the menu is how they are reached.
      {%- endcomment -%}
      <form class="dm__composer" id="messagesForm" autocomplete="off">
        {%- comment -%}
          The slash-command menu (js/command-menu.js) opens here, over the composer, when a
          message starts with "/".
        {%- endcomment -%}
        <div class="dm__command-host" id="messagesCommandHost"></div>
        <button class="dm__action dm-cancel-edit" id="messagesCancelEdit" type="button" hidden>Cancel</button>
        <div class="dm__attach" id="messagesAttach">
          <input class="dm__file-input" id="messagesImage" type="file" accept="image/*" tabindex="-1" aria-hidden="true">
          <input class="dm__file-input" id="messagesFilesInput" type="file" multiple tabindex="-1" aria-hidden="true">
          <input class="dm__file-input" id="messagesFolder" type="file" webkitdirectory multiple tabindex="-1" aria-hidden="true">
          <button class="dm__action" id="messagesAttachButton" type="button" disabled>
            <i class="fas fa-paperclip" aria-hidden="true"></i> Attach
          </button>
        </div>
        <button class="dm__send" id="messagesSend" type="submit" disabled>Send</button>
      </form>
      <p class="dm__form-status" id="messagesFormStatus" role="alert" hidden></p>
    </section>

  </div>

  <div class="ocs__modal hidden" id="newChatDialog" role="dialog" aria-modal="true" aria-labelledby="newChatTitle">
    <form class="ocs__modal-card ocs__stack" id="newChatForm">
      <div class="ocs__modal-header">
        <h3 class="ocs__modal-title" id="newChatTitle">New chat</h3>
        <button type="button" class="ocs__btn small" data-close aria-label="Close">&times;</button>
      </div>
      <div class="ocs__field">
        <label class="ocs__label" for="newChatSearch">Search people</label>
        <input class="ocs__input" id="newChatSearch" type="search" autocomplete="off" placeholder="Name or email" data-focus>
      </div>
      <div class="ocs__links" id="newChatResults"></div>
      <p class="ocs__text" id="newChatSelected"></p>
      <p class="ocs__text" id="newChatStatus" role="status"></p>
      <div class="ocs__modal-actions">
        <button type="button" class="ocs__btn" data-close>Cancel</button>
        <button type="submit" class="ocs__btn accent fill" id="newChatStart" disabled>Start chat</button>
      </div>
    </form>
  </div>

  <div class="ocs__modal hidden" id="scheduleDialog" role="dialog" aria-modal="true" aria-labelledby="scheduleHeading">
    <form class="ocs__modal-card ocs__stack" id="scheduleForm">
      <div class="ocs__modal-header">
        <h3 class="ocs__modal-title" id="scheduleHeading">Add to calendar</h3>
        <button type="button" class="ocs__btn small" data-close aria-label="Close">&times;</button>
      </div>
      <div class="ocs__field">
        <label class="ocs__label" for="scheduleTitle">Title</label>
        <input class="ocs__input" id="scheduleTitle" type="text" autocomplete="off" required data-focus>
      </div>
      <div class="dm__schedule-when">
        <div class="ocs__field">
          <label class="ocs__label" for="scheduleDate">Day</label>
          <input class="ocs__input" id="scheduleDate" type="date" required>
        </div>
        <div class="ocs__field">
          <label class="ocs__label" for="scheduleTime">Time (optional)</label>
          <input class="ocs__input" id="scheduleTime" type="time">
        </div>
      </div>
      <p class="ocs__text" id="scheduleStatus" role="status"></p>
      <div class="ocs__modal-actions">
        <button type="button" class="ocs__btn" data-close>Cancel</button>
        <button type="submit" class="ocs__btn accent fill" id="scheduleSave">Add event</button>
      </div>
    </form>
  </div>

  <div class="ocs__modal hidden" id="findGroupDialog" role="dialog" aria-modal="true" aria-labelledby="findGroupTitle">
    <div class="ocs__modal-card ocs__stack">
      <div class="ocs__modal-header">
        <h3 class="ocs__modal-title" id="findGroupTitle">Find or make a group</h3>
        <button type="button" class="ocs__btn small" data-close aria-label="Close">&times;</button>
      </div>
      <form class="ocs__stack" id="groupSearchForm" role="search">
        <div class="ocs__field">
          <label class="ocs__label" for="groupSearch">Search by group name</label>
          <input class="ocs__input" id="groupSearch" type="search" autocomplete="off" placeholder="Team Turing" data-focus>
        </div>
        <p class="ocs__text" id="groupSearchStatus" role="status"></p>
        <div class="ocs__table-wrap hidden" id="groupSearchTable">
          <table class="ocs__table">
            <thead><tr><th>Group</th><th>Class</th><th>Action</th></tr></thead>
            <tbody id="groupSearchResults"></tbody>
          </table>
        </div>
      </form>
      <p class="dm__or">or</p>
      <form class="ocs__stack" id="createGroupForm">
        <h4 class="ocs__section-title">Make a new group</h4>
        <div class="ocs__field">
          <label class="ocs__label" for="createGroupName">Name</label>
          <input class="ocs__input" id="createGroupName" type="text" maxlength="80" autocomplete="off" required>
        </div>
        <div class="ocs__grid--col2">
          <div class="ocs__field">
            <label class="ocs__label" for="createGroupCourse">Class</label>
            <select class="ocs__input" id="createGroupCourse" required>
              <option value="">Choose a class</option>
              {{ course_options }}
            </select>
          </div>
          <div class="ocs__field">
            <label class="ocs__label" for="createGroupPeriod">Period</label>
            <select class="ocs__input" id="createGroupPeriod" required>
              <option value="">Choose a period</option>
              {{ period_options }}
            </select>
          </div>
        </div>
        <p class="ocs__text" id="createGroupStatus" role="status"></p>
        <div class="ocs__links">
          <button type="submit" class="ocs__btn accent fill" id="createGroupSubmit">Make group</button>
        </div>
      </form>
      {%- comment -%}
        Teachers and admins only: messages-page.js takes `hidden` off this when the
        signed-in account may form groups, so it stays invisible to students. It lives
        in this dialog rather than the sidebar, which is why the inline script below
        closes this dialog when it is pressed -- otherwise the Form groups dialog would
        open stacked on top of this one.
      {%- endcomment -%}
      <button type="button" class="dm__action dm__action--block hidden" id="messagesFormGroups">Form groups for a class</button>
    </div>
  </div>

  <div class="ocs__modal hidden" id="membersDialog" role="dialog" aria-modal="true" aria-labelledby="membersTitle">
    <div class="ocs__modal-card ocs__stack">
      <div class="ocs__modal-header">
        <h3 class="ocs__modal-title" id="membersTitle">Members</h3>
        <button type="button" class="ocs__btn small" data-close aria-label="Close">&times;</button>
      </div>
      <div class="ocs__table-wrap">
        <table class="ocs__table">
          <thead><tr><th>Name</th><th>User ID</th><th>Action</th></tr></thead>
          <tbody id="membersList"></tbody>
        </table>
      </div>
      <div class="ocs__field">
        <label class="ocs__label" for="membersSearch">Add a classmate</label>
        <input class="ocs__input" id="membersSearch" type="search" autocomplete="off" placeholder="Name or email" data-focus>
      </div>
      <div class="ocs__links" id="membersResults"></div>
      <p class="ocs__text" id="membersStatus" role="status"></p>
      <section class="ocs__callout ocs__stack hidden" id="membersDeleteSection" aria-labelledby="membersDeleteTitle">
        <h4 class="ocs__section-title" id="membersDeleteTitle">Delete group</h4>
        <p class="ocs__text" id="membersDeleteWarning"></p>
        <div class="ocs__links">
          <button type="button" class="ocs__btn small alert-red" id="membersDelete">Delete this group</button>
        </div>
      </section>
    </div>
  </div>

  <div class="ocs__modal hidden" id="deleteGroupDialog" role="dialog" aria-modal="true" aria-labelledby="deleteGroupTitle" aria-describedby="deleteGroupWarning">
    <form class="ocs__modal-card ocs__stack" id="deleteGroupForm" autocomplete="off">
      <div class="ocs__modal-header">
        <h3 class="ocs__modal-title" id="deleteGroupTitle">Delete group?</h3>
        <button type="button" class="ocs__btn small" data-close aria-label="Close">&times;</button>
      </div>
      <p class="ocs__text" id="deleteGroupWarning"></p>
      <div class="ocs__field">
        <label class="ocs__label" for="deleteGroupName">Type <strong id="deleteGroupNameToType"></strong> to confirm</label>
        <input class="ocs__input" id="deleteGroupName" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" data-focus>
      </div>
      <p class="ocs__text" id="deleteGroupStatus" role="status"></p>
      <div class="ocs__modal-actions">
        <button type="button" class="ocs__btn" data-close>Cancel</button>
        <button type="submit" class="ocs__btn alert-red fill" id="deleteGroupConfirm" disabled>Delete group</button>
      </div>
    </form>
  </div>

  {%- comment -%}
    The Shared panel (js/conversation-panel.js): a group's Files (js/files-panel.js), and
    any conversation's Media, Links and Pinned, in the grammar's tabs. The script fills the
    tab bar.
  {%- endcomment -%}
  <div class="ocs__modal hidden" id="conversationPanel" role="dialog" aria-modal="true" aria-labelledby="conversationPanelTitle">
    <div class="ocs__modal-card ocs__modal-card--wide ocs__stack">
      <div class="ocs__modal-header">
        <h3 class="ocs__modal-title" id="conversationPanelTitle">Shared</h3>
        <button type="button" class="ocs__btn small" data-close aria-label="Close" data-focus>&times;</button>
      </div>
      <div class="ocs__tabs">
        <ul class="ocs__tabs-list" id="conversationPanelTabs"></ul>
      </div>
      <div class="ocs__tabs-panels">
        <div class="ocs__tabs-panel ocs__stack" id="conversationPanelFiles"></div>
        <div class="ocs__tabs-panel hidden" id="conversationPanelMedia"></div>
        <div class="ocs__tabs-panel hidden" id="conversationPanelLinks"></div>
        <div class="ocs__tabs-panel hidden" id="conversationPanelPinned"></div>
      </div>
      <p class="ocs__text" id="conversationPanelStatus" role="status"></p>
    </div>
  </div>

  {%- comment -%}
    /help (js/help-dialog.js): the keyboard shortcuts and every slash command.
  {%- endcomment -%}
  <div class="ocs__modal hidden" id="helpDialog" role="dialog" aria-modal="true" aria-labelledby="helpTitle">
    <div class="ocs__modal-card ocs__modal-card--wide ocs__stack">
      <div class="ocs__modal-header">
        <h3 class="ocs__modal-title" id="helpTitle">Commands and keys</h3>
        <button type="button" class="ocs__btn small" data-close aria-label="Close" data-focus>&times;</button>
      </div>
      <div class="ocs__stack dm__help" id="helpBody"></div>
    </div>
  </div>

  <div class="ocs__modal hidden" id="formGroupsDialog" role="dialog" aria-modal="true" aria-labelledby="formGroupsTitle">
    <div class="ocs__modal-card ocs__stack">
      <div class="ocs__modal-header">
        <h3 class="ocs__modal-title" id="formGroupsTitle">Form groups for a class</h3>
        <button type="button" class="ocs__btn small" data-close aria-label="Close">&times;</button>
      </div>
      <form class="ocs__stack" id="formGroupsForm">
        <p class="ocs__text">This regroups the students already in a group for the class and period, such as the class group. Flask matches personas when at least half of those students, and enough for two groups, have picked a persona on their Profile; otherwise the groups are random.</p>
        <div class="ocs__grid--col2">
          <div class="ocs__field">
            <label class="ocs__label" for="formCourse">Class</label>
            <select class="ocs__input" id="formCourse" required data-focus>
              <option value="">Choose a class</option>
              {{ course_options }}
            </select>
          </div>
          <div class="ocs__field">
            <label class="ocs__label" for="formPeriod">Period</label>
            <select class="ocs__input" id="formPeriod" required>
              <option value="">Choose a period</option>
              {{ period_options }}
            </select>
          </div>
          <div class="ocs__field">
            <label class="ocs__label" for="formSize">Students per group</label>
            <input class="ocs__input" id="formSize" type="number" min="2" max="10" value="4" required>
          </div>
          <div class="ocs__field">
            <label class="ocs__label" for="formPrefix">Name the groups</label>
            <input class="ocs__input" id="formPrefix" type="text" maxlength="40" placeholder="CSA P3 Team" aria-describedby="formPrefixHelp">
            <small id="formPrefixHelp">Each group gets a letter: CSA P3 Team A, CSA P3 Team B.</small>
          </div>
        </div>
        <details id="formPast">
          <summary>Add a past group's results (optional)</summary>
          <div class="ocs__stack">
            <div class="ocs__grid--col2">
              <div class="ocs__field">
                <label class="ocs__label" for="formPastSize">Students in that group</label>
                <input class="ocs__input" id="formPastSize" type="number" min="2" max="10" value="4">
              </div>
              <div class="ocs__field">
                <label class="ocs__label" for="formPastStudentRating">Student rating, 1 to 5</label>
                <input class="ocs__input" id="formPastStudentRating" type="number" min="1" max="5" value="4">
              </div>
              <div class="ocs__field">
                <label class="ocs__label" for="formPastTeacherRating">Teacher rating, 1 to 5</label>
                <input class="ocs__input" id="formPastTeacherRating" type="number" min="1" max="5" value="4">
              </div>
              <div class="ocs__field">
                <label class="ocs__label" for="formPastNote">Note</label>
                <input class="ocs__input" id="formPastNote" type="text" maxlength="160" placeholder="Clear roles, good communication">
              </div>
            </div>
            <fieldset class="ocs__stack">
              <legend class="ocs__label">Personas in that group</legend>
              <div class="ocs__links" id="formPastPersonas"></div>
            </fieldset>
          </div>
        </details>
        <div class="ocs__links">
          <button type="submit" class="ocs__btn accent fill" id="formSuggest">Suggest groups</button>
        </div>
        <p class="ocs__text" id="formStatus" role="status"></p>
      </form>
      <section class="ocs__stack hidden" id="formStaging" aria-labelledby="formStagingTitle">
        <h4 class="ocs__section-title" id="formStagingTitle">Suggested groups</h4>
        <p class="ocs__text" id="formMethod"></p>
        <div class="ocs__stack" id="formGroups"></div>
        <div class="ocs__modal-actions">
          <button type="button" class="ocs__btn" id="formRegroup">Regroup unlocked groups</button>
          <button type="button" class="ocs__btn accent fill" id="formSave">Save groups</button>
        </div>
      </section>
    </div>
  </div>

</div>

<script>
  // Single-column behaviour only: below the mobile breakpoint the aside and the thread
  // occupy the same space, so opening a conversation shows the thread and the back
  // control returns to the list. Presentation only -- the modules are untouched.
  (function () {
    const page = document.querySelector('.dm');
    if (!page) return;
    // The page fills the window below the site header. How tall that header is depends
    // on the width and on the navbar's own content, so it is measured, not assumed:
    // --dm-top is where the page starts, and sass/_layout.scss takes the rest of the
    // height. Measured again when the window resizes and once everything has loaded,
    // since the logo and the fonts can change the header's height after first paint.
    const fit = () => {
      page.style.setProperty('--dm-top', `${Math.round(page.getBoundingClientRect().top + window.scrollY)}px`);
    };
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('load', fit);
    // A link straight to a conversation (/dm?dm=4, /dm?group=12) opens on that
    // conversation, so on a phone it has to start on the thread, not on the list.
    if (/[?&](dm|group)=/.test(window.location.search)) page.dataset.dmView = 'thread';
    // In the capture phase, before the row's own handler: opening a conversation redraws
    // both lists at once, so by the time the click bubbles up here the row that was
    // pressed is no longer in the page and `closest` cannot find the list it was in.
    // Listening on the way down sees the row while it is still there.
    page.addEventListener('click', event => {
      if (event.target.closest('[data-dm-back]')) {
        page.removeAttribute('data-dm-view');
        return;
      }
      if (event.target.closest('#messagesGroupList a, #messagesDmList a')) {
        // A middle click or a modifier key opens the row in a new tab; this one stays put.
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        page.dataset.dmView = 'thread';
        return;
      }
      // "Form groups for a class" lives inside the Find or make dialog, so close that
      // one before its own dialog opens on top. Adding `hidden` is what dialogs.js
      // itself does to close, so its isOpen() stays in step.
      if (event.target.closest('#messagesFormGroups')) {
        document.getElementById('findGroupDialog')?.classList.add('hidden');
      }
    }, true);
  }());
</script>

<script type="module">
  import { javaURI, javaWebSocketURI, pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
  import * as richText from '{{ site.baseurl }}/assets/js/chat/rich-text.js';
  import * as push from '{{ site.baseurl }}/assets/js/api/push-notifications.js';
  import { startMessagesPage } from '{{ site.baseurl }}/assets/js/projects/messages/messages-page.js';

  startMessagesPage({ config: { javaURI, javaWebSocketURI, pythonURI, fetchOptions }, richText, push });
</script>
