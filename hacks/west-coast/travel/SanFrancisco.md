---
layout: post
title: "San Francisco"
description: "Submodule 2 of Analytics/Admin Mini-Quest"
permalink: /west-coast/analytics/submodule_2/
parent: "Analytics/Admin"
team: "Curators"
submodule: 2
categories: [CSP, Submodule, Analytics/Admin]
tags: [analytics, submodule, curators]
author: "Curators Team"
date: 2025-10-21
---

# San Francisco

## Content Coming Soon
This submodule will be developed by the Curators team.


<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"> 
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reveal Code Modal</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap" rel="stylesheet">
<style>
  body {
    font-family: 'Poppins', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background: #f4f4f9;
  }

  .reveal-button {
    background: linear-gradient(90deg, #4facfe, #00f2fe); /* Blue gradient */
    border: none;
    color: white;
    padding: 25px 40px;
    font-size: 22px;
    font-weight: 500;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 6px 10px rgba(0,0,0,0.25);
  }

  .reveal-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 12px rgba(0,0,0,0.3);
  }

  /* Modal overlay */
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    justify-content: center;
    align-items: center;
  }

  /* Modal content box */
  .modal-content {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 25px;
    border-radius: 12px;
    width: 80%;
    max-width: 700px;
    font-family: "Courier New", monospace;
    font-size: 18px;
    white-space: pre-wrap;
    position: relative;
  }

  /* Close button */
  .close-btn {
    position: absolute;
    top: 12px;
    right: 15px;
    background: #ff5e5e;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
    line-height: 28px;
    text-align: center;
  }
</style>
</head>
<body>

<button class="reveal-button" onclick="openModal()">Click here to see how we made this</button>

<div class="modal" id="codeModal">
  <div class="modal-content">
    <button class="close-btn" onclick="closeModal()">×</button>
    code will be here:
  </div>
</div>

<script>
  function openModal() {
    document.getElementById('codeModal').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('codeModal').style.display = 'none';
  }

  // Close modal if user clicks outside the content box. 
  window.onclick = function(event) {
    const modal = document.getElementById('codeModal');
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }
</script>

</body>
</html>
