---
layout: post
feedback: true
hide: true
title: Open Coding Society
description: Redirect to Onboarding Adventure.
---

<script>
  const destination = window.location.hostname === "vanshikak210.github.io"
    ? "{{ site.baseurl }}/capstone/shoreline-volunteer/"
    : {{ '/onboarding/' | relative_url | jsonify }};
  window.location.replace(destination);
</script>
