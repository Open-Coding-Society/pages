---
layout: opencs
title: Logout
permalink: /logout
search_exclude: true
---

<script type="module">
    import { pythonURI, javaURI, fetchOptions, springEnabled } from '{{site.baseurl}}/assets/js/api/config.js';
    import { createBackends } from '{{site.baseurl}}/assets/js/login/backend.js';
    import { createSession } from '{{site.baseurl}}/assets/js/login/session.js';
    import { handleLogout } from '{{site.baseurl}}/assets/js/api/logout.js';
    // logout
    await handleLogout(createSession(createBackends({ pythonURI, javaURI, fetchOptions, springEnabled })));
    // redirect to login page
    window.location.href = "{{site.baseurl}}/login";
</script>
