---
layout: post
title: "Los Angeles"
description: "Submodule 2 of Backend Development Mini-Quest"
permalink: /west-coast/backend/submodule_2/
parent: "Backend Development"
team: "Zombies"
submodule: 2
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, zombies]
author: "Zombies Team"
date: 2025-10-21
---

# Submodule 2

# Submodule 1

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Los Angeles Sports API Demo</title>
    <style>
        /* Chargers/Clippers Theme */
        :root {
            /* Chargers Powder Blue/Vibrant Blue */
            --chargers-blue: #0080C6; 
            /* Chargers Sunshine Yellow/Gold */
            --chargers-yellow: #FFC72C;
            /* Clippers Red */
            --clippers-red: #D11342;
            /* Navy/Dark Blue Background */
            --navy-dark: #001F3F; 
            /* White/Light Text */
            --white-text: #F8F8F8;
            /* Light Gray Box Background */
            --light-bg: #F0F0F0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            /* Gradient: Dark Navy to Blue/Purple for a dynamic feel */
            background: linear-gradient(135deg, var(--navy-dark) 0%, #1f4070 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .header {
            /* Header: Dark Navy */
            background: var(--navy-dark);
            color: var(--white-text);
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.2em;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            /* Highlight header text with Yellow */
            color: var(--chargers-yellow); 
        }

        .header p {
            opacity: 0.9;
            font-size: 1.1em;
        }

        .concept-box {
            /* Light Gray Box with Chargers Blue border */
            background: var(--light-bg);
            padding: 25px;
            border-left: 5px solid var(--chargers-blue); 
            margin: 25px;
            border-radius: 8px;
        }

        .concept-box h2 {
            color: var(--navy-dark) !important;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .concept-box p {
            color: #333 !important; /* Dark text for contrast */
            line-height: 1.6;
            font-weight: 500;
        }

        .concept-box p strong {
            color: var(--clippers-red) !important; /* Bold text in Red */
        }

        .api-section {
            padding: 30px;
        }

        .api-section h2 {
            color: var(--navy-dark) !important;
        }

        .endpoint-card {
            /* Card Gradient: Powder Blue to Red */
            background: linear-gradient(135deg, var(--chargers-blue) 0%, var(--clippers-red) 100%); 
            color: white !important;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .endpoint-card:hover {
            transform: translateY(-5px);
            /* Hover Shadow based on the Blue */
            box-shadow: 0 10px 30px rgba(0, 128, 198, 0.4);
        }

        .endpoint-card h3 {
            font-size: 1.4em;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            /* Heading text white */
            color: var(--white-text) !important; 
            font-weight: 600;
        }

        .endpoint-path {
            /* Path text background in Yellow */
            background: rgba(255, 199, 44, 0.9);
            padding: 8px 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
            font-size: 0.95em;
            /* Path text in Navy */
            color: var(--navy-dark) !important; 
            font-weight: 700;
        }

        .endpoint-card p {
            color: var(--white-text) !important;
            opacity: 0.95;
        }

        .response-area {
            /* Response Area: Dark Navy */
            background: var(--navy-dark);
            /* Highlight text in Yellow for terminal look */
            color: var(--chargers-yellow); 
            padding: 20px;
            border-radius: 8px;
            margin-top: 15px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
            display: none;
        }

        .response-area.active {
            display: block;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .key-learning {
            /* Key Learning: Solid Clippers Red background */
            background: var(--clippers-red); 
            color: white;
            padding: 25px;
            margin: 25px;
            border-radius: 12px;
            text-align: center;
        }

        .key-learning h3 {
            margin-bottom: 10px;
            font-size: 1.3em;
        }

        .stadium-icon {
            display: inline-block;
            font-size: 1.5em;
        }

        .btn {
            background: white;
            color: var(--chargers-blue); /* Button text in Chargers Blue */
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 10px;
            transition: all 0.3s;
        }

        .btn:hover {
            background: var(--chargers-blue);
            color: white;
            transform: scale(1.05);
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }

        .info-item {
            background: rgba(0, 0, 0, 0.05); /* Very light background for info grid */
            padding: 12px;
            border-radius: 6px;
        }

        .info-label {
            font-size: 0.85em;
            opacity: 0.8;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 1.2em;
            font-weight: bold;
        }
    </style>
</head>
