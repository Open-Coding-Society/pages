---
layout: post
title: "Microblogging Vault"
description: "Microblog Vault"
permalink: /digital-famine/microblog/vault/
parent: "AI Usage"
team: "Unzippers"
submodule: 1
categories: [CSP, Submodule, Microblogging]
tags: [microblogging, submodule, unzippers]
author: "Krishna Visvanath, Sloane Sommers, Lucas M"
date: 2025-10-21
breadcrumb: true
---

<html lang="en">
<head>
<meta charset="utf-8">
<title>Code Access Terminal</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
  body {
    font-family: SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
    background: #111;
    color: #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    overflow: auto;
    padding-bottom: 6rem;
    position: relative;
  }

  h2 {
    margin-bottom: 20px;
    letter-spacing: 1px;
    z-index: 2;
  }

  .terminal {
    position: relative;
    display: flex;
    align-items: center;
    z-index: 2;
  }

  input#code {
    width: 260px;
    padding: 10px 14px;
    font-size: 1rem;
    background: #000;
    font-family: inherit;
    border: 2px solid #555;
    border-radius: 4px;
    color: #0f0;
    outline: none;
    letter-spacing: 1px;
  }

  input#code:focus {
    border-color: #888;
  }

  .status-light {
    position: absolute;
    left: -18px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #d00;
    animation: blink-red 1s infinite;
  }

  @keyframes blink-red {
    0%, 50%, 100% { opacity: 1; background: #d00; }
    25%, 75% { opacity: 0.3; }
  }

  @keyframes blink-green {
    0%, 50%, 100% { opacity: 1; background: #0d0; }
    25%, 75% { opacity: 0.3; }
  }

  /* small shake for wrong codes */
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    50% { transform: translateX(6px); }
    75% { transform: translateX(-4px); }
    100% { transform: translateX(0); }
  }
  .terminal.shake {
    animation: shake 360ms ease-in-out;
  }

  button {
    margin-top: 16px;
    padding: 10px 18px;
    font-size: 1rem;
    border: none;
    background: #333;
    color: #eee;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
    z-index: 2;
  }

  button:hover {
    background: #555;
  }

  #out {
    margin-top: 12px;
    text-align: center;
    font-size: 0.9rem;
    z-index: 2;
  }

  /* Doors layer */
  #doors {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    transition: transform 2s ease-in-out;
    z-index: 1; /* behind UI */
    pointer-events: none;
  }

  .door {
    flex: 1;
    background: linear-gradient(#222, #111);
    transition: transform 2s ease-in-out;
  }

  .door.left {
    border-right: 2px solid #333;
  }

  .door.right {
    border-left: 2px solid #333;
  }

  .doors-open .door.left {
    transform: translateX(-100%);
  }

  .doors-open .door.right {
    transform: translateX(100%);
  }

  /* Cake layer */
  #cake-section {
    position: absolute;
    top: 62%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    opacity: 0;
    transition: opacity 1.5s ease-in-out 1s;
    z-index: 3; /* above doors */
  }

  /* hide small output text when access granted so it doesn't overlap the cake */
  .doors-open #out {
    opacity: 0;
    pointer-events: none;
  }

  .doors-open #cake-section {
    opacity: 1;
  }

  #cake-section h3 {
    margin: 0 0 8px;
    font-size: 1.6rem;
    font-weight: 700;
    color: #2ecc71;
    font-family: inherit;
    letter-spacing: 1px;
  }

  #cake-section p {
    margin: 0 0 14px;
    font-size: 1.05rem;
    color: #dfeee0;
    font-family: inherit;
  }

  #cake-section img {
    width: 320px;
    max-width: calc(100% - 48px);
    height: auto;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.8);
    display: block;
    margin: 0 auto 14px;
  }

  #cake-section button {
    display: inline-block;
    margin: 10px auto 18px;
    padding: 14px 24px;
    font-size: 1.05rem;
    border: 2px solid #27ae60;
    background: linear-gradient(#39d27a, #2ecc71);
    color: #05250a;
    font-weight: 700;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(34,139,34,0.25);
    cursor: pointer;
  }

  #cake-section button:hover {
    transform: translateY(-2px);
  }

</style>
</head>
<body>

<h2>Access Verification Terminal</h2>

<div class="terminal">
  <input id="code" type="text" autocomplete="off" placeholder="Enter access code">
  <div class="status-light" id="status-light"></div>
</div>

<div id="out"></div>

<div id="doors">
  <div class="door left"></div>
  <div class="door right"></div>
</div>

<div id="cake-section">
  <h2>Access Granted</h2>
  <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiyDRuMxLUUyNkbDfMOxqFjQzwOLI8hUsC5E5a5NVIqSPeDWONt6UouQyBuZuWbMqlfUy3sMJsrMMcQ8DEeNVbJYDhiew-JoN3_LbCa27ahv0W9v9LLb8kHFyoX7PvaRRsSTBRyR9dCUbs/s1600/the_cake_is_a_lie_portal.jpg" alt="Portal Cake">
  <button onclick="window.location.href='{{ base.siteurl }}/digital-famine/'">Continue</button>
</div>

<!-- CryptoJS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>

<script>
  const KEY_STR = "meow mroww meoww";
  const STORED_CIPHERTEXT = "6e4b7871f58d3e221921f62c7ae9371df338d24e78248e0dd4c8a480beb5014a";

  const codeEl = document.getElementById('code');
  const light = document.getElementById('status-light');
  const out = document.getElementById('out');
  const doors = document.getElementById('doors');
  const leftDoor = document.querySelector('#doors .door.left');
  const rightDoor = document.querySelector('#doors .door.right');

  function encryptAes128EcbHex(plaintext) {
    const key = CryptoJS.enc.Utf8.parse(KEY_STR);
    const cp = CryptoJS.AES.encrypt(plaintext, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return cp.ciphertext.toString(CryptoJS.enc.Hex);
  }

  function verify() {
    console.log('[vault] Verify clicked, input:', codeEl.value);
    const code = (codeEl.value || "").trim();
    if (!code) {
      out.textContent = "Please enter a code.";
      return;
    }

    const computed = encryptAes128EcbHex(code);
    console.log('[vault] computed:', computed, ' expected:', STORED_CIPHERTEXT);
    if (computed === STORED_CIPHERTEXT) {
      out.textContent = "Code accepted.";
      light.style.animation = "blink-green 1s infinite";
      document.body.classList.add("doors-open");
      doors.classList.add("doors-open");
      // remove any inline forced transforms if present
      if (leftDoor) leftDoor.style.transform = '';
      if (rightDoor) rightDoor.style.transform = '';
      console.log('[vault] doors-open class added to body and #doors');
    } else {
      out.textContent = "Access denied.";
      light.style.animation = "blink-red 1s infinite";
      // small visible feedback
      const terminal = document.querySelector('.terminal');
      if (terminal) {
        terminal.classList.remove('shake');
        // force reflow to restart animation
        void terminal.offsetWidth;
        terminal.classList.add('shake');
      }
    }
  }

   codeEl.addEventListener('keydown', (e) => {
     if (e.key === 'Enter') {
         e.preventDefault();
         console.log('[vault] Enter pressed');
         verify();
      }
    });
</script>
</body>
</html>

