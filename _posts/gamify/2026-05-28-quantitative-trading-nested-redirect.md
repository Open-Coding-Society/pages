---
layout: post
title: Quantitative Trading Nested Redirect
permalink: /gamify/fortuneFinders/quantitative/trading
---

<script>
  (function redirectToQuantBot() {
    var base = ("{{ site.baseurl }}" || "").replace(/\/$/, "");
    var target = base + "/gamify/fortuneFinders/quant";
    var suffix = window.location.search + window.location.hash;
    window.location.replace(target + suffix);
  })();
</script>

<p>Redirecting to Quantitative Trading...</p>
