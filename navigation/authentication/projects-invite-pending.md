---
layout: aesthetihawk
title: Invite Pending
permalink: /projects/invite-pending
active_tab: projects
comments: false
---

<div class="max-w-xl">
  <div class="bg-neutral-800 rounded-lg shadow-md p-8 border border-neutral-700 text-center">
    <div class="mx-auto mb-4 w-14 h-14 rounded-full bg-indigo-600/20 flex items-center justify-center">
      <svg class="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
      </svg>
    </div>
    <h2 class="text-lg font-semibold mb-2">Invite Pending</h2>
    <p id="invite-pending-detail" class="text-neutral-400 mb-6">Your request to mentor this project has been recorded.</p>
    <p class="text-sm text-neutral-500 mb-6">An organization admin still needs to review and accept your request before you're connected with the team. This status doesn't update automatically yet — check back after an admin has reviewed it.</p>
    <a href="{{site.baseurl}}/projects" class="inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition">Back to Projects</a>
  </div>
</div>

<script>
  (function () {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    if (title) {
      document.getElementById('invite-pending-detail').textContent =
        'Your request to mentor "' + title + '" has been recorded.';
    }
  })();
</script>
