---
layout: opencs
title: Logout
permalink: /logout
search_exclude: true
---

<script type="module">
    import { handleLogout } from '{{site.baseurl}}/assets/js/api/logout.js';
    // logout
    await handleLogout();
    // redirect to login page
    window.location.href = "{{site.baseurl}}/login";
</script>
