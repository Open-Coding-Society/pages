---
layout: post
title: "AI APIs"
description: "Going over how to use AI APIs"
permalink: /digital-famine/ai/submodule_3/
breadcrumb: true
microblog: true
parent: "AI Usage"
team: "Debuggers"
submodule: 3
categories: [CSP, Submodule, AIUsage]
tags: [ai, API, flask, debuggers]
author: "Debuggers Team - Lilian Wu, Rebecca Yan"
date: 2025-10-21
---

# Submodule 3


## ❗️What is AI API
An AI API (Application Programming Interface) is a set of rules that allows developers to integrate artificial intelligence capabilities, such as natural language processing, image recognition, and data analysis, into their own applications without building the AI models from scratch. It acts as a bridge, enabling software to communicate with and use AI services by sending requests and receiving responses. For example, when you're using Google, Uber, ApplePay, or anything that needs AI analysis, you're using AIAPI, it combined our world digitaly.

## Microblog System Architecture: Layered AI Approach
This article is the main technical reference for the microblog system, which uses a layered approach to enable interactive, AI-powered microblogging on any lesson or article page.

## Architectural Overview
1. Layout Layer (_layouts/opencs.html):

Handles the inclusion of all required dependencies (Tailwind CSS, jQuery, and microblog scripts).
Injects the microblog overlay panel and floating button into the page.
Reads frontmatter (e.g., microblog: True) to determine whether to activate the microblog UI.
Ensures the microblog panel is available and styled consistently across all enabled pages.

2. JavaScript Layer (assets/js/api/microblog.js):

Handles all UI interactivity: opening/closing the panel, posting, replying, and updating the display.
Manages API calls to the backend (fetching, posting, reacting, etc.).
Implements error handling, loading states, and user feedback.
Uses modern JavaScript patterns (Promises, async/await) for robust, maintainable code.

3. Backend/API Layer:

Provides RESTful endpoints for microblog operations (GET, POST, reply, react).
Can be extended or replaced as needed for different deployments.
## Code

 ``` html
 // Basic Promise Pattern - Instructor demonstrates live

function fetchMicroblogPosts() {
    const apiUrl = 'http://127.0.0.1:8887/api/microblog';
    
    return fetch(apiUrl)
        .then(response => {
            // Instructor explains: Always check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Microblog posts retrieved:', data);
            return data; // Return for further chaining
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            // Instructor demonstrates: Always provide user feedback
            displayErrorMessage('Failed to load posts. Please try again.');
            return []; // Return empty array as fallback
        });
}
 ```
