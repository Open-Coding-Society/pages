---
layout: opencs
title: Messages
description: Your groups and direct messages in one place.
permalink: /dm
search_exclude: true
---
{%- comment -%}
Messages (/dm): your groups and direct messages, side by side. Groups moved here from
/student/groups. The layout is OCS grammar (_sass/open-coding/README.md); the message
list and composer use the chat classes the course chats share (.announcement-chat), so
the page has no stylesheet of its own; its one layout class, ocs__split--aside, is in
the grammar. The behavior is in _projects/systems/messages/js/, started by
messages-page.js at the bottom; README.md in that folder explains how it fits together.
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

<section class="announcement-chat" aria-labelledby="messagesTitle">
  <div class="chat-header">
    <div class="chat-heading">
      <span class="chat-badge" aria-hidden="true"><i class="fas fa-comments"></i></span>
      <div class="chat-heading-text">
        <h2 class="chat-title" id="messagesTitle">Messages</h2>
        <p class="chat-subtitle">Your groups and direct messages.</p>
      </div>
    </div>
    <span class="chat-status-pill" id="messagesStatusPill">
      <span class="chat-status-dot" aria-hidden="true"></span>
      <span class="chat-status" id="messagesStatus">loading…</span>
    </span>
  </div>

  <div class="chat-body">
    <p class="chat-preview-note" id="messagesSignedOut" hidden>
      <i class="fas fa-lock" aria-hidden="true"></i> Sign in to see your groups and send messages.
    </p>
    <p class="ocs__text" id="messagesNotice" role="status"></p>

    <div class="ocs__split ocs__split--aside">
      <nav class="ocs__stack" aria-label="Conversations">
        <div class="ocs__card-header">
          <h3 class="ocs__section-title">Groups</h3>
          <button type="button" class="ocs__btn small" id="messagesFindGroup" disabled>Find a group</button>
        </div>
        <div class="ocs__stack" id="messagesGroupList"></div>
        <div class="ocs__card-header">
          <h3 class="ocs__section-title">Direct messages</h3>
          <button type="button" class="ocs__btn small" id="messagesNewChat" disabled>New chat</button>
        </div>
        <div class="ocs__stack" id="messagesDmList"></div>
        <button type="button" class="ocs__btn hidden" id="messagesFormGroups">Form groups for a class</button>
      </nav>

      <section class="ocs__stack" aria-labelledby="messagesThreadTitle">
        <div class="ocs__card-header">
          <h3 class="ocs__section-title" id="messagesThreadTitle">Pick a conversation</h3>
          <small class="ocs__text" id="messagesThreadSubtitle"></small>
        </div>
        <div class="ocs__links hidden" id="messagesGroupActions">
          <button type="button" class="ocs__btn small" id="messagesMembers">Members</button>
          <button type="button" class="ocs__btn small" id="messagesFiles">Files</button>
          <button type="button" class="ocs__btn small" id="messagesLeaveGroup">Leave</button>
        </div>
        <div class="chat-messages" id="messagesLog" role="log" aria-live="polite"></div>
        <form class="chat-form" id="messagesForm" autocomplete="off">
          <button class="chat-send dm-cancel-edit" id="messagesCancelEdit" type="button" hidden>Cancel</button>
          <button class="chat-send" id="messagesSend" type="submit" disabled>Send</button>
        </form>
        <p class="dm-form-status" id="messagesFormStatus" role="alert" hidden></p>
      </section>
    </div>
  </div>
</section>

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

<div class="ocs__modal hidden" id="findGroupDialog" role="dialog" aria-modal="true" aria-labelledby="findGroupTitle">
  <div class="ocs__modal-card ocs__stack">
    <div class="ocs__modal-header">
      <h3 class="ocs__modal-title" id="findGroupTitle">Find a group</h3>
      <button type="button" class="ocs__btn small" data-close aria-label="Close">&times;</button>
    </div>
    <form class="ocs__stack" id="groupSearchForm" role="search">
      <div class="ocs__field">
        <label class="ocs__label" for="groupSearch">Group name</label>
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
    <form class="ocs__stack" id="createGroupForm">
      <h4 class="ocs__section-title">Make a group</h4>
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

<div class="ocs__modal hidden" id="filesDialog" role="dialog" aria-modal="true" aria-labelledby="filesTitle">
  <div class="ocs__modal-card ocs__stack">
    <div class="ocs__modal-header">
      <h3 class="ocs__modal-title" id="filesTitle">Files</h3>
      <button type="button" class="ocs__btn small" data-close aria-label="Close" data-focus>&times;</button>
    </div>
    <div class="ocs__table-wrap hidden" id="filesTable">
      <table class="ocs__table">
        <thead><tr><th>File</th><th>Action</th></tr></thead>
        <tbody id="filesList"></tbody>
      </table>
    </div>
    <form class="ocs__stack" id="filesForm">
      <div class="ocs__field">
        <label class="ocs__label" for="filesInput">Share a file with the group</label>
        <input class="ocs__input" id="filesInput" type="file">
      </div>
      <div class="ocs__links">
        <button type="submit" class="ocs__btn accent fill" id="filesUpload">Share file</button>
      </div>
    </form>
    <p class="ocs__text" id="filesStatus" role="status"></p>
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

<script type="module">
  import { javaURI, javaWebSocketURI, pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
  import * as richText from '{{ site.baseurl }}/assets/js/chat/rich-text.js';
  import { startMessagesPage } from '{{ site.baseurl }}/assets/js/projects/messages/messages-page.js';

  startMessagesPage({ config: { javaURI, javaWebSocketURI, pythonURI, fetchOptions }, richText });
</script>
