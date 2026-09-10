---
layout: post
title: Futures Trading Redirect
permalink: /gamify/fortuneFinders/futures/trading
---

<script>
  (function redirectToFuturesMiniGame() {
    var base = ("{{ site.baseurl }}" || "").replace(/\/$/, "");
    var target = base + "/gamify/fortuneFinders/futures";
    var suffix = window.location.search + window.location.hash;
    window.location.replace(target + suffix);
  })();
</script>

<p>Redirecting to Futures Trading...</p>
