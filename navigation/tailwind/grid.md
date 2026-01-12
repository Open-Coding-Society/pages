---
layout: tailwind 
title: Tailwind Grid 
description: An example of body content specific to a page using grid
permalink: /tailwind/grid
hide: true
---

<!-- 
  Tailwind Grid Example with Menu and Main Content

  This file demonstrates the use of Tailwind CSS to create a responsive grid layout.
  The grid is defined with custom column and row sizes using `grid-cols-*` and `grid-rows-*`.
  It also includes dark mode support with `dark:*` classes for styling.

  Key Features:
  - A centered content block with a message and custom checkmarks.
  - Dynamic light and dark mode styling for text and background.
  - Decorative borders and background patterns using Tailwind's advanced utilities.

  Reference for Grid:
    grid-cols-[12rem_1fr]
    - 12rem: The first column has a fixed width of 12rem (192px).
    - 1fr: The second column takes up 1 fraction of the available space.

    grid-rows-[4rem_auto]
    - 4rem: The first row has a fixed height of 4rem (64px).
    - auto: The second row adjusts its height based on its content.

    col-start-2 row-start-1
    - Positions the title in the second column and first row of the grid.

    col-start-2 row-start-2
    - Positions the main content in the second column and second row of the grid.

  Note:
  - Use this as reference to build a grid structure, content, or styles to suit your needs.
-->
<div class="relative grid grid-cols-[12rem_1fr] grid-rows-[4rem_auto] bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
  <!-- Left Menu -->
  <div class="col-start-1 row-span-full bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
    <!-- Profile Picture -->
    <div class="flex justify-center mb-6">
      <img class="w-24 h-24 rounded-full border-4 border-gray-800 dark:border-gray-100" src="{{site.baseurl}}/images/logo.png" alt="Profile Picture" />
    </div>
    <!-- Navigation Links -->
    <nav class="space-y-4">
      <a href="#profile" class="block font-medium">Profile</a>
      <a href="#messages" class="block font-medium">Messages</a>
      <a href="#settings" class="block font-medium">Settings</a>
    </nav>
  </div>

  <!-- Title -->
  <div class="col-start-2 row-start-1 flex items-center justify-center bg-gray-200 dark:bg-gray-800 border-b border-gray-400 dark:border-gray-600">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Messages</h1>
  </div>

  <!-- Main Content -->
  <div class="col-start-2 row-start-2 p-4">
    <div class="border rounded-lg">
      <div class="rounded-xl p-10 text-sm/7 text-gray-700 bg-gray-200 dark:bg-gray-950">
        <img class="size-12 shrink-0" src="{{site.baseurl}}/images/tailwind_logo.jpg" alt="ChitChat Logo" />
        <div class="text-xl font-medium text-bg-gray-950 dark:text-gray-700">ChitChat</div>
        <p class="text-gray-500 dark:text-gray-400">You have a new message from Tailwind!</p>
        <ul class="space-y-3">
          <li class="flex">
            <svg class="h-[1lh] w-5.5 shrink-0" viewBox="0 0 22 22" fill="none" stroke-linecap="square">
              <circle cx="11" cy="11" r="11" class="fill-sky-400/25" />
              <circle cx="11" cy="11" r="10.5" class="stroke-sky-400/25" />
              <path d="M8 11.5L10.5 14L14 8" class="stroke-sky-800 dark:stroke-sky-300" />
            </svg>
            <p class="ml-3">
              Customizing a layout using
              <code class="font-mono font-medium text-gray-100">grid</code>
            </p>
          </li>
          <li class="flex">
            <svg class="h-[1lh] w-5.5 shrink-0" viewBox="0 0 22 22" fill="none" stroke-linecap="square">
              <circle cx="11" cy="11" r="11" class="fill-sky-400/25" />
              <circle cx="11" cy="11" r="10.5" class="stroke-sky-400/25" />
              <path d="M8 11.5L10.5 14L14 8" class="stroke-sky-800 dark:stroke-sky-300" />
            </svg>
            <p class="ml-3">
              Build a menu and content with
              <code class="font-mono font-medium text-gray-100">col, row</code>
            </p>
          </li>
          <li class="flex">
            <svg class="h-[1lh] w-5.5 shrink-0" viewBox="0 0 22 22" fill="none" stroke-linecap="square">
              <circle cx="11" cy="11" r="11" class="fill-sky-400/25" />
              <circle cx="11" cy="11" r="10.5" class="stroke-sky-400/25" />
              <path d="M8 11.5L10.5 14L14 8" class="stroke-sky-800 dark:stroke-sky-300" />
            </svg>
            <p class="ml-3">Learn more using Flexbox and Grid</p>
          </li>
        </ul>
        <hr class="my-4 w-full border-gray-400 dark:border-gray-600" />
        <a href="https://tailwindcss.com/docs/flex-basis">Read the reference docs &rarr;</a>
      </div>
    </div>
  </div>
</div>
