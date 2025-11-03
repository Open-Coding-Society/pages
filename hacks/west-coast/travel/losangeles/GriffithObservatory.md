---
layout: post
title: "Los Angeles"
description: "Roadtrip through LA and learn UI while you're there!"
permalink: /west-coast/analytics/losangeles/GriffithO
parent: "Analytics/Admin"
team: "Cool Collaborators"
submodule: 1
author: "Cool Collaborators"
date: 2025-10-21
---

<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Griffith Observatory — Roadtrip</title>
  <style>
    /* ===== CSS Variables ===== */
    :root {
      --intro-bg: #009688;
      --teal-light: #4DB6AC;
      --night-gradient-start: #0f0c29;
      --night-gradient-mid: #302b63;
      --night-gradient-end: #24243e;
      --transition-duration: 4000ms;
    }

    /* ===== Base Styles ===== */
    body {
      background: var(--intro-bg);
      overflow-x: hidden;
      overflow-y: auto;
      font-family: 'Open Sans', sans-serif;
      margin: 0;
    }

    .hidden {
      display: none;
    }

    /* ===== Truck Intro Animation ===== */
    .intro {
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      background: var(--intro-bg);
      z-index: 10;
    }

    .intro p {
      color: #fff;
      font-weight: 800;
      margin-top: 18px;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
    }

    .loop-wrapper {
      margin: 0 auto;
      position: relative;
      display: block;
      width: 600px;
      height: 250px;
      overflow: hidden;
      border-bottom: 3px solid #fff;
      color: #fff;
    }

    /* Landscape Elements */
    .mountain {
      position: absolute;
      right: -900px;
      bottom: -20px;
      width: 2px;
      height: 2px;
      box-shadow: 
        0 0 0 50px var(--teal-light),
        60px 50px 0 70px var(--teal-light),
        90px 90px 0 50px var(--teal-light),
        250px 250px 0 50px var(--teal-light),
        290px 320px 0 50px var(--teal-light),
        320px 400px 0 50px var(--teal-light);
      transform: rotate(130deg);
      animation: mtn 4s linear;
    }

    .hill {
      position: absolute;
      right: -900px;
      bottom: -50px;
      width: 400px;
      border-radius: 50%;
      height: 20px;
      box-shadow: 
        0 0 0 50px var(--teal-light),
        -20px 0 0 20px var(--teal-light),
        -90px 0 0 50px var(--teal-light),
        250px 0 0 50px var(--teal-light),
        290px 0 0 50px var(--teal-light),
        620px 0 0 50px var(--teal-light);
      animation: hill 4s 0s linear;
    }

    .tree {
      position: absolute;
      height: 100px;
      width: 35px;
      bottom: 0;
      background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/tree.svg) no-repeat;
      animation: tree 4s 0s linear;
    }

    .tree:nth-child(2) {
      animation: tree2 4s 0.15s linear;
    }

    .tree:nth-child(3) {
      animation: tree3 4s 0.05s linear;
    }

    .rock {
      margin-top: -17%;
      height: 2%;
      width: 2%;
      bottom: -2px;
      border-radius: 20px;
      position: absolute;
      background: #ddd;
      animation: rock 4s 0s linear;
    }

    /* Vehicle */
    .truck,
    .wheels {
      transition: all ease;
      width: 85px;
      margin-right: -60px;
      bottom: 0px;
      right: 50%;
      position: absolute;
      background: #eee;
    }

    .truck {
      background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/truck.svg) no-repeat;
      background-size: contain;
      height: 60px;
      animation: truck 4s 0.08s ease;
    }

    .truck::before {
      content: " ";
      position: absolute;
      width: 25px;
      box-shadow: 
        -30px 28px 0 1.5px #fff,
        -35px 18px 0 1.5px #fff;
      animation: wind 1.5s 0s ease 3;
    }

    .wheels {
      background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/wheels.svg) no-repeat;
      height: 15px;
      margin-bottom: 0;
      animation: truck 4s 0.001s ease;
    }

    /* ===== Keyframe Animations - Intro ===== */
    @keyframes tree {
      0% { transform: translate(1350px); }
      100% { transform: translate(-50px); }
    }

    @keyframes tree2 {
      0% { transform: translate(650px); }
      100% { transform: translate(-50px); }
    }

    @keyframes tree3 {
      0% { transform: translate(2750px); }
      100% { transform: translate(-50px); }
    }

    @keyframes rock {
      0% { right: -200px; }
      100% { right: 2000px; }
    }

    @keyframes truck {
      0%, 100% { transform: translateY(0); }
      6% { transform: translateY(0); }
      7% { transform: translateY(-6px); }
      9% { transform: translateY(0); }
      10% { transform: translateY(-1px); }
      11% { transform: translateY(0); }
    }

    @keyframes wind {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(3px); }
    }

    @keyframes mtn {
      100% { transform: translateX(-2000px) rotate(130deg); }
    }

    @keyframes hill {
      100% { transform: translateX(-2000px); }
    }

    /* ===== Night Sky Scene ===== */
    .scene {
      position: relative;
      min-height: 100vh;
      padding-bottom: 220px;
      background: linear-gradient(
        var(--night-gradient-start),
        var(--night-gradient-mid) 55%,
        var(--night-gradient-end)
      );
    }

    /* Stars */
    .twinkle {
      width: 3px;
      height: 3px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 8px #fff;
      position: absolute;
      animation: twinkle 2s ease-in-out infinite;
    }

    .twinkle.t2 {
      animation-delay: 0.4s;
      top: 18%;
    }

    .twinkle.t3 {
      animation-delay: 0.8s;
      top: 28%;
    }

    .twinkle.t4 {
      animation-delay: 1.2s;
      top: 46%;
    }

    /* Comets */
    .comet {
      width: 8px;
      height: 8px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 10px #fff;
      top: 20%;
      left: -100px;
      position: absolute;
      animation: comet 7s linear infinite;
    }

    .comet::after {
      content: "";
      position: absolute;
      width: 90px;
      height: 2px;
      right: 8px;
      top: 3px;
      background: linear-gradient(to right, #fff, transparent);
    }

    .comet.c2 {
      top: 40%;
      animation-delay: 1.6s;
    }

    .comet.c3 {
      top: 60%;
      animation-delay: 3.2s;
    }

    /* Planets */
    .planet {
      border-radius: 50%;
      position: absolute;
      animation: spin-planet 22s linear infinite;
    }

    .planet.mars {
      width: 56px;
      height: 56px;
      background: radial-gradient(circle at 30% 30%, #ff6b4a, #cd5c3a);
      top: 14%;
      left: 10%;
      box-shadow: 0 0 26px rgba(255, 107, 74, 0.55);
    }

    .planet.jupiter {
      width: 78px;
      height: 78px;
      background: radial-gradient(circle at 30% 30%, #ffa726, #ff8a50);
      top: 48%;
      right: 10%;
      box-shadow: 0 0 34px rgba(255, 167, 38, 0.55);
      animation-duration: 26s;
    }

    .moon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #fff5e1, #ffe4b5);
      border-radius: 50%;
      position: absolute;
      top: 24%;
      right: 14%;
      box-shadow: 0 0 36px rgba(255, 245, 225, 0.8);
      animation: float 7.5s ease-in-out infinite;
    }

    /* Layers: skyline and hills */
    .layer {
      position: absolute;
      left: 0;
      right: 0;
      pointer-events: none;
    }

    .skyline {
      bottom: 56px;
      height: 110px;
      background:
        linear-gradient(transparent 35%, rgba(255,255,255,0.06)),
        repeating-linear-gradient(90deg, rgba(0,0,0,0.0) 0 48px, rgba(0,0,0,0.0) 48px 56px),
        linear-gradient(#13192c, #0e1426);
      mask:
        radial-gradient(120px 40px at 12% 70%, #000 98%, transparent 100%),
        radial-gradient(80px 30px at 28% 72%, #000 98%, transparent 100%),
        radial-gradient(100px 34px at 46% 75%, #000 98%, transparent 100%),
        radial-gradient(140px 40px at 62% 72%, #000 98%, transparent 100%),
        radial-gradient(120px 36px at 78% 70%, #000 98%, transparent 100%),
        radial-gradient(90px 30px at 90% 73%, #000 98%, transparent 100%);
      animation: skyline-parallax 20s linear infinite;
      opacity: 0.75;
    }

    .haze {
      bottom: 84px;
      height: 90px;
      background: radial-gradient(60% 100% at 50% 100%, rgba(180,180,220,0.15), transparent 70%);
      filter: blur(2px);
      animation: haze-drift 14s ease-in-out infinite;
    }

    @keyframes skyline-parallax {
      0% { transform: translateX(0); }
      100% { transform: translateX(-60px); }
    }

    @keyframes haze-drift {
      0%, 100% { transform: translateX(0); opacity: 0.35; }
      50% { transform: translateX(10px); opacity: 0.5; }
    }

    /* Observatory Complex */
    .observatory {
      position: absolute;
      bottom: 84px;
      left: 50%;
      transform: translateX(-50%);
      width: 480px;
      height: 200px;
      display: grid;
      grid-template-columns: 1fr 1.4fr 1fr;
      align-items: end;
      gap: 10px;
    }

    /* Wings and colonnade */
    .wing {
      position: relative;
      height: 120px;
      background: linear-gradient(#d8d8d8, #bdbdbd);
      border: 4px solid #8e8e8e;
      border-radius: 6px;
    }

    .colonnade {
      position: relative;
      height: 120px;
      background: linear-gradient(#e2e2e2, #cfcfcf);
      border: 4px solid #8e8e8e;
      border-radius: 6px;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      align-items: end;
      padding: 0 10px 10px;
      box-shadow: inset 0 -6px 0 rgba(0,0,0,0.06);
    }

    .pillar {
      height: 70px;
      background: linear-gradient(#f0f0f0, #d8d8d8);
      border: 2px solid #9a9a9a;
      border-radius: 3px;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
      animation: subtle-pulse 6s ease-in-out infinite;
    }

    @keyframes subtle-pulse {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.05); }
    }

    /* Domes */
    .dome {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 140px;
      height: 110px;
      top: -100px;
      background: radial-gradient(circle at 50% 20%, #f3f3f3, #cfcfcf 70%);
      border: 4px solid #8f8f8f;
      border-bottom: none;
      border-radius: 140px 140px 0 0;
      overflow: visible;
      box-shadow: 0 6px 0 rgba(0,0,0,0.08);
      animation: dome-sway 9s ease-in-out infinite;
    }

    .dome.small {
      width: 100px;
      height: 80px;
      top: -70px;
      animation-duration: 11s;
    }

    @keyframes dome-sway {
      0%, 100% { transform: translateX(-50%) rotate(0deg); }
      50% { transform: translateX(-50%) rotate(0.4deg); }
    }

    /* Dome shutters */
    .shutter {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 4px;
      height: 70%;
      background: #888;
      border-radius: 2px;
    }

    /* Telescope beam */
    .beam {
      position: absolute;
      left: 50%;
      top: 30%;
      transform-origin: left center;
      width: 320px;
      height: 4px;
      background: linear-gradient(90deg, rgba(255,255,230,0.65), rgba(255,255,230,0.05));
      filter: blur(0.5px);
      border-radius: 4px;
      animation: beam-sweep 14s ease-in-out infinite;
      mix-blend-mode: screen;
    }

    .beam.small {
      width: 220px;
      opacity: 0.8;
      animation-duration: 16s;
    }

    @keyframes beam-sweep {
      0% { transform: translateX(-50%) rotate(-8deg); }
      50% { transform: translateX(-50%) rotate(14deg); }
      100% { transform: translateX(-50%) rotate(-8deg); }
    }

    /* Roof lights */
    .roof-light {
      position: absolute;
      bottom: 110px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 8px;
      background: radial-gradient(60% 100% at 50% 100%, rgba(255,255,200,0.35), transparent 70%);
      filter: blur(1px);
      animation: light-glow 5s ease-in-out infinite;
    }

    @keyframes light-glow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }

    /* Palms (foreground) */
    .palms {
      position: absolute;
      bottom: 76px;
      left: 50%;
      width: 520px;
      transform: translateX(-50%);
      height: 80px;
      pointer-events: none;
    }

    .palm {
      position: absolute;
      bottom: 0;
      width: 6px;
      height: 70px;
      background: #1d2a33;
      border-radius: 3px;
      transform-origin: bottom center;
      animation: palm-sway 7s ease-in-out infinite;
    }

    .palm:nth-child(1) { left: 10px; animation-delay: -1s; }
    .palm:nth-child(2) { left: 80px; animation-delay: -2s; }
    .palm:nth-child(3) { right: 60px; animation-delay: -1.6s; }
    .palm:nth-child(4) { right: 10px; animation-delay: -2.3s; }

    .palm::before,
    .palm::after {
      content: "";
      position: absolute;
      bottom: 64px;
      left: 50%;
      width: 80px;
      height: 20px;
      transform: translateX(-50%);
      background:
        radial-gradient(12px 8px at 20% 50%, #2a3e4b 60%, transparent 62%),
        radial-gradient(12px 8px at 40% 50%, #2a3e4b 60%, transparent 62%),
        radial-gradient(12px 8px at 60% 50%, #2a3e4b 60%, transparent 62%),
        radial-gradient(12px 8px at 80% 50%, #2a3e4b 60%, transparent 62%);
    }

    .palm::after { transform: translateX(-50%) rotate(14deg); }
    .palm::before { transform: translateX(-50%) rotate(-14deg); }

    @keyframes palm-sway {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(1.2deg); }
    }

    /* Caption */
    .caption {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 22px;
      color: #e9e9ff;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.35);
      padding: 8px 14px;
      border-radius: 10px;
    }

    /* ===== Keyframe Animations - Scene ===== */
    @keyframes twinkle {
      0%, 100% {
        transform: scale(1);
        opacity: 0.8;
      }
      50% {
        transform: scale(2.2);
        opacity: 1;
      }
    }

    @keyframes comet {
      to {
        left: 110%;
      }
    }

    @keyframes spin-planet {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-18px);
      }
    }

    /* ===== Lesson Content ===== */
    .lesson-content {
        background: #000;
        color: #fff;
        padding: 40px 20px;
        font-family: Arial, sans-serif;
        line-height: 1.6;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
    }

    h1, h2, h3 {
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        margin: 20px 0 10px 0;
    }

    p {
        color: #fff;
        font-size: 16px;
        margin: 10px 0;
    }

    pre {
        background: #1a1a1a;
        padding: 15px;
        border-radius: 5px;
        overflow-x: auto;
        color: #fff;
        font-size: 14px;
    }

    code {
        color: #fff;
        font-size: 14px;
    }

    .example-section {
        margin: 40px 0;
        padding: 30px;
        background: #1a1a1a;
        border-radius: 10px;
    }

    .demo-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        background: linear-gradient(to bottom, #1a1a2e 0%, #0f3460 50%, #16213e 100%);
        border-radius: 10px;
        position: relative;
        margin-top: 20px;
        overflow: hidden;
    }

    .button-container {
        margin-bottom: 50px;
        z-index: 10;
    }

    button {
        background-color: #e74c3c;
        color: white;
        padding: 25px 50px;
        font-size: 24px;
        font-weight: bold;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        text-transform: uppercase;
    }

    button:hover {
        background-color: #c0392b;
        transform: translateY(-3px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.4);
    }

    button:active {
        transform: translateY(0);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    #observatoryContainer {
        opacity: 0;
        transform: scale(0.5) translateY(50px);
        transition: all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        z-index: 10;
    }

    #observatoryContainer.show {
        opacity: 1;
        transform: scale(1) translateY(0);
    }

    .observatory-demo {
        position: relative;
        width: 300px;
        height: 200px;
    }

    .dome-demo {
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        width: 120px;
        height: 60px;
        background: radial-gradient(circle at 50% 20%, #f3f3f3, #c8c8c8);
        border-radius: 120px 120px 0 0;
        border: 3px solid #8e8e8e;
        border-bottom: none;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        animation: domeAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
        animation-delay: 0.3s;
    }

    .dome-demo::before {
        content: '';
        position: absolute;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 30px;
        background: #6e6e6e;
        border-radius: 4px;
    }

    .telescope {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        background: #555;
        border-radius: 50%;
        animation: telescopeGlow 2s ease-in-out infinite;
        animation-delay: 1.2s;
    }

    .building-demo {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 70px;
        background: linear-gradient(to bottom, #e8e8e8 0%, #c4c4c4 100%);
        border: 3px solid #8e8e8e;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        animation: buildingAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
        animation-delay: 0.1s;
    }

    .window {
        position: absolute;
        background: #ffd700;
        border: 2px solid #fff;
        animation: windowGlow 2s ease-in-out infinite;
    }

    .window1 {
        top: 15px;
        left: 30px;
        width: 25px;
        height: 30px;
        animation-delay: 1.2s;
    }

    .window2 {
        top: 15px;
        left: 70px;
        width: 25px;
        height: 30px;
        animation-delay: 1.4s;
    }

    .window3 {
        top: 15px;
        right: 70px;
        width: 25px;
        height: 30px;
        animation-delay: 1.6s;
    }

    .window4 {
        top: 15px;
        right: 30px;
        width: 25px;
        height: 30px;
        animation-delay: 1.8s;
    }

    .stars {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    .star {
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        animation: twinkle-demo 3s ease-in-out infinite;
    }

    .star1 { top: 20%; left: 15%; animation-delay: 0s; }
    .star2 { top: 30%; left: 80%; animation-delay: 0.5s; }
    .star3 { top: 15%; left: 45%; animation-delay: 1s; }
    .star4 { top: 25%; left: 65%; animation-delay: 1.5s; }
    .star5 { top: 35%; right: 20%; animation-delay: 2s; }
    .star6 { top: 10%; right: 35%; animation-delay: 2.5s; }

    @keyframes buildingAppear {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(30px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
        }
    }

    @keyframes domeAppear {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
        }
    }

    @keyframes telescopeGlow {
        0%, 100% {
            box-shadow: 0 0 5px #4a9eff;
        }
        50% {
            box-shadow: 0 0 20px #4a9eff, 0 0 40px #4a9eff;
        }
    }

    @keyframes windowGlow {
        0%, 100% {
            opacity: 0.7;
            box-shadow: 0 0 5px #ffd700;
        }
        50% {
            opacity: 1;
            box-shadow: 0 0 20px #ffd700, 0 0 30px #ffed4e;
        }
    }

    @keyframes twinkle-demo {
        0%, 100% {
            opacity: 0.3;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.8);
        }
    }

    /* ===== Accessibility: Reduced Motion ===== */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <!-- Truck intro -->
  <div class="intro" id="intro" role="region" aria-label="Introduction animation">
    <div class="loop-wrapper" role="img" aria-label="Driving up to Griffith Observatory at dusk">
      <div class="mountain" aria-hidden="true"></div>
      <div class="hill" aria-hidden="true"></div>
      <div class="tree" aria-hidden="true"></div>
      <div class="tree" aria-hidden="true"></div>
      <div class="tree" aria-hidden="true"></div>
      <div class="rock" aria-hidden="true"></div>
      <div class="truck" aria-hidden="true"></div>
      <div class="wheels" aria-hidden="true"></div>
    </div>
    <p>Winding up to Griffith Observatory…</p>
  </div>

  <!-- Scene -->
  <main class="scene hidden" id="scene" role="region" aria-label="Griffith Observatory night sky scene">
    <!-- Ambient sky objects -->
    <div class="twinkle" style="top:12%;left:12%" aria-hidden="true"></div>
    <div class="twinkle t2" style="left:48%" aria-hidden="true"></div>
    <div class="tw
    inkle t3" style="left:72%" aria-hidden="true"></div>
    <div class="twinkle t4" style="left:22%" aria-hidden="true"></div>
    <div class="comet" aria-hidden="true"></div>
    <div class="comet c2" aria-hidden="true"></div>
    <div class="comet c3" aria-hidden="true"></div>
    <div class="planet mars" aria-hidden="true"></div>
    <div class="planet jupiter" aria-hidden="true"></div>
    <div class="moon" aria-hidden="true"></div>

    <!-- LA skyline layers and haze -->
    <div class="layer skyline" aria-hidden="true"></div>
    <div class="layer haze" aria-hidden="true"></div>

    <!-- Griffith Observatory complex -->
    <div class="observatory" aria-label="Griffith Observatory">
      <!-- Left wing with small dome -->
      <div class="wing" aria-hidden="true">
        <div class="dome small" aria-hidden="true">
          <div class="shutter" aria-hidden="true"></div>
          <div class="beam small" aria-hidden="true"></div>
        </div>
      </div>

      <!-- Central colonnade with main dome and beam -->
      <div class="colonnade" aria-label="Central building with colonnade">
        <div class="pillar" aria-hidden="true"></div>
        <div class="pillar" aria-hidden="true"></div>
        <div class="pillar" aria-hidden="true"></div>
        <div class="pillar" aria-hidden="true"></div>
        <div class="pillar" aria-hidden="true"></div>
        <div class="pillar" aria-hidden="true"></div>
        <div class="pillar" aria-hidden="true"></div>
        <div class="dome" aria-label="Main dome">
          <div class="shutter" aria-hidden="true"></div>
          <div class="beam" aria-hidden="true"></div>
        </div>
        <div class="roof-light" aria-hidden="true"></div>
      </div>

      <!-- Right wing with small dome -->
      <div class="wing" aria-hidden="true">
        <div class="dome small" aria-hidden="true">
          <div class="shutter" aria-hidden="true"></div>
          <div class="beam small" aria-hidden="true"></div>
        </div>
      </div>
    </div>

    <!-- Foreground palms -->
    <div class="palms" aria-hidden="true">
      <div class="palm"></div>
      <div class="palm"></div>
      <div class="palm"></div>
      <div class="palm"></div>
    </div>

    <div class="caption">🔭 Griffith Observatory — comets, planets & moonlit LA</div>
  </main>

  <!-- Lesson Content -->
  <div class="lesson-content hidden" id="lessonContent">
    <div class="container">
        <h1>Los Angeles</h1>
        <h2>Griffith Observatory Button Lesson</h2>

        <h3>Step 1: Set Up Your HTML File</h3>
        <p>First, create a new file and save it as button.html. Every HTML file needs this basic structure:</p>
        <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My Button&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

        <p>What this means:</p>
        <p>&lt;!DOCTYPE html&gt; tells the browser this is an HTML file</p>
        <p>&lt;html&gt; wraps everything</p>
        <p>&lt;head&gt; contains information about the page</p>
        <p>&lt;body&gt; is where your visible content goes</p>

        <h3>Step 2: Create Your First Button</h3>
        <p>Inside the &lt;body&gt; tags, add a button:</p>
        <pre><code>&lt;body&gt;
    &lt;button&gt;Click Me!&lt;/button&gt;
&lt;/body&gt;</code></pre>

        <h3>Step 3: Make the Button Do Something</h3>
        <p>Add an onclick attribute to make something happen when clicked:</p>
        <pre><code>&lt;button onclick="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code></pre>

        <div class="example-section">
            <h3>Here's an example button!</h3>
            <div class="demo-container">
                <div class="stars">
                    <div class="star star1"></div>
                    <div class="star star2"></div>
                    <div class="star star3"></div>
                    <div class="star star4"></div>
                    <div class="star star5"></div>
                    <div class="star star6"></div>
                </div>

                <div class="button-container">
                    <button onclick="generateObservatory()">Click for Griffith Observatory</button>
                </div>

                <div id="observatoryContainer">
                    <div class="observatory-demo">
                        <div class="building-demo">
                            <div class="window window1"></div>
                            <div class="window window2"></div>
                            <div class="window window3"></div>
                            <div class="window window4"></div>
                        </div>
                        <div class="dome-demo">
                            <div class="telescope"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h2>Button Design Tips</h2>

        <h3>What is a Button?</h3>
        <p>A button triggers an action when clicked. Think of Griffith Observatory's telescope controls—clear, responsive, and purposeful. Good buttons work the same way.</p>

        <h3>The 3 Button States</h3>
        <p><strong>Default (Observatory at Rest)</strong> - How it looks normally—waiting to be clicked.</p>
        <p><strong>Hover (Dome Opening)</strong> - When you move your mouse over it—shows it's interactive.</p>
        <p><strong>Clicked (Telescope Activates)</strong> - The moment you click—confirms the action.</p>

        <h3>5 Design Tips</h3>
        
        <p><strong>1. Make it Bold</strong></p>
        <p>Like the iconic dome on Mount Hollywood—easy to see. Use size and contrast.</p>

        <p><strong>2. Use Clear Labels</strong></p>
        <p>"View Stars" is obvious—your button should be too. "Buy Now" not "Click Here". "Sign Up" not "Submit".</p>

        <p><strong>3. Show it's Clickable</strong></p>
        <p>The dome looks different from the building. Add rounded corners or shadows. Use hover effects.</p>

        <p><strong>4. Create Contrast</strong></p>
        <p>White dome against dark sky—maximum visibility. Button color should pop from the background.</p>

        <p><strong>5. Size Matters</strong></p>
        <p>Big enough to see and click easily. At least 44x44px on mobile.</p>

        <h3>Button Types</h3>
        <p><strong>Primary:</strong> Most important action (the main telescope)</p>
        <p><strong>Secondary:</strong> Supporting actions (smaller domes)</p>
        <p><strong>Tertiary:</strong> Minor actions (information plaques)</p>

        <h3>Common Mistakes</h3>
        <p>1. Vague labels like "Click" or "Submit"</p>
        <p>2. No hover effect</p>
        <p>3. Too many bold buttons</p>
        <p>4. Too small to tap</p>
        <p>5. Unclear what happens when clicked</p>

        <h3>Quick Tips</h3>
        <p>- Use action verbs: "Explore," "Discover," "View"</p>
        <p>- One primary button per section</p>
        <p>- Make it look clickable</p>
        <p>- Test on mobile</p>
    </div>
  </div>
  
<section class="quiz-section">
  <h2>🧠 Quick Quiz: Build Your Own Button!</h2>
  <p>Fill in the blanks to complete your HTML file. If you get both right, your button will appear!</p>

  <form id="button-quiz">
    <!-- Question 1 -->
    <label for="q1">
      1️⃣ Every HTML file starts with this declaration: <br>
      <code>&lt;!________ html&gt;</code>
    </label><br>
    <input type="text" id="q1" placeholder="Type your answer here"><br><br>

    <!-- Question 2 -->
    <label for="q2">
      2️⃣ Add the missing part to make your button show an alert when clicked: <br>
      <code>&lt;button ________="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code>
    </label><br>
    <input type="text" id="q2" placeholder="Type your answer here"><br><br>

    <button type="button" onclick="checkAnswers()">Check Answers</button>
  </form>

  <div id="quiz-result"></div>
  <div id="button-demo"></div>

  <script>
    function checkAnswers() {
      const a1 = document.getElementById("q1").value.trim().toLowerCase();
      const a2 = document.getElementById("q2").value.trim().toLowerCase();
      const result = document.getElementById("quiz-result");
      const demo = document.getElementById("button-demo");
      demo.innerHTML = "";
      let score = 0;

      if (a1 === "doctype") score++;
      if (a2 === "onclick") score++;

      result.textContent = "✅ You got " + score + "/2 correct!";

      if (score === 2) {
        demo.innerHTML = `
          <p>🎉 Great job! Here's your working button:</p>
          <button onclick="alert('Hello!')">Click Me!</button>
        `;
      }
    }
  </script>
</section>

  <script>
    // Constants
    const INTRO_DURATION = 4000;
    const INTRO_FAILSAFE = 6000;

    // Transition from intro to main scene
    const transitionToScene = () => {
      const introEl = document.getElementById('intro');
      const sceneEl = document.getElementById('scene');
      const lessonEl = document.getElementById('lessonContent');
      if (!introEl || !sceneEl) return;

      introEl.classList.add('hidden');
      sceneEl.classList.remove('hidden');
      document.body.style.background = 'linear-gradient(var(--night-gradient-start), var(--night-gradient-end))';

      if (introEl.parentNode) {
        introEl.parentNode.removeChild(introEl);
      }

      // Show lesson content after scene loads
      setTimeout(() => {
        if (lessonEl) {
          lessonEl.classList.remove('hidden');
        }
      }, 2000);
    };

    const scheduleTransition = () => {
      setTimeout(transitionToScene, INTRO_DURATION);
      setTimeout(transitionToScene, INTRO_FAILSAFE);
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      scheduleTransition();
    } else {
      document.addEventListener('DOMContentLoaded', scheduleTransition, { once: true });
    }

    window.addEventListener('load', () => {
      scheduleTransition();
      document.body.style.overflowY = 'auto';
    }, { once: true });

    // Button demo function
    function generateObservatory() {
        var observatoryContainer = document.getElementById('observatoryContainer');
        observatoryContainer.classList.remove('show');
        setTimeout(function() {
            observatoryContainer.classList.add('show');
        }, 50);
    }
  </script>
</body>
</html>