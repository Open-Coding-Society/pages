---
layout: post
title: "CPT Guide"
description: "Build the APCSP CPT project through a quest to assist students in fulfilling the collegeboard requirements."
permalink: /cpt/home
parent: "CPT Guide"
---
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CPT Guide</title>

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        /* DARK COLLEGEBOARD BLUE BACKGROUND */
        body {
            font-family: 'Georgia', serif;
            overflow-x: hidden;
            background: #0A2A66; /* College Board Blue */
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .bg-gradient {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0A2A66 0%, #02183D 100%);
            z-index: -1;
        }

        /* STATIC LARGE BACKGROUND ICONS */
        .static-bg {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 0;
            pointer-events: none;
        }

        .bg-icon {
            position: absolute;
            font-size: 9rem;
            opacity: 0.08;
            user-select: none;
        }

        /* Positioning */
        .bg-icon:nth-child(1) { top: 8%; left: 5%; }
        .bg-icon:nth-child(2) { top: 18%; right: 8%; }
        .bg-icon:nth-child(3) { bottom: 12%; left: 12%; }
        .bg-icon:nth-child(4) { bottom: 10%; right: 18%; }
        .bg-icon:nth-child(5) { top: 50%; left: 40%; }

        /* MOVING BLUE ACORN */
        .acorn {
            position: fixed;
            bottom: 40px;
            font-size: 4rem;
            animation: move 12s linear infinite;
            z-index: 5;
            opacity: 0.9;
            filter: hue-rotate(180deg) brightness(1.4);
        }

        @keyframes move {
            0% { left: -120px; }
            100% { left: calc(100% + 120px); }
        }

        /* MAIN UI */
        .container {
            text-align: center;
            z-index: 10;
        }

        h1 {
            font-size: 4.5rem;
            color: #FFD700;
            margin-bottom: 10px;
            letter-spacing: 0.1em;
            text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
        }

        .subtitle {
            font-size: 1.6rem;
            color: #DDE6FF;
            margin-bottom: 40px;
            font-style: italic;
        }

        /* CPT GUIDE BUTTON */
        .start-button {
            display: inline-block;
            padding: 20px 50px;
            font-size: 1.5rem;
            font-weight: bold;
            color: #0A2A66;
            background: #FFD700;
            border-radius: 12px;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .start-button:hover {
            transform: scale(1.08);
            background: #FFEA75;
            box-shadow: 0 0 25px #FFD700;
        }
    </style>
</head>

<body>

    <!-- STATIC BACKGROUND ICONS -->
    <div class="static-bg">
        <div class="bg-icon">✏️</div>
        <div class="bg-icon">📄</div>
        <div class="bg-icon">📘</div>
        <div class="bg-icon">🌰</div>
        <div class="bg-icon">📝</div>
    </div>

    <!-- MOVING BLUE ACORN -->
    <div class="acorn">🌰</div>

    <div class="container">
        <h1>CPT GUIDE</h1>
        <p class="subtitle">Journey Through the AP CSP Project</p>

        <a href="/CPTGuidePages/cpt" class="start-button">
            Enter CPT Guide
        </a>
    </div>


</body>
</html>