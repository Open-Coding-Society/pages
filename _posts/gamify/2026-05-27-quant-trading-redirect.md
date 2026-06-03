---
layout: post
title: Quant Trading Redirect
permalink: /gamify/fortuneFinders/quant/trading
---

<script>
  (function redirectToQuantBot() {
    var base = ("{{ site.baseurl }}" || "").replace(/\/$/, "");
    var target = base + "/gamify/fortuneFinders/quant";
    var suffix = window.location.search + window.location.hash;
    window.location.replace(target + suffix);
  })();
</script>

<p>Redirecting to Quant Bot...</p>
