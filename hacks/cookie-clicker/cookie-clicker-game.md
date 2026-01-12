---
layout: opencs
title: Cookie Clicker Game
permalink: /cookie-clicker-game/
---

<!-- Main container with grid layout: 1 column for shop, 3 columns for the game -->
<div class="grid grid-cols-4 gap-4 aspect-square">

  <!-- SHOP Section -->
  <div class="col-span-1 p-4 shadow-lg border-8 border-double border-yellow-800 bg-yellow-100 rounded-xl flex flex-col gap-2 overflow-y-auto" id="shop-container">
      <!-- Shop title -->
      <div class="text-xl font-bold mb-4 text-center">SHOP</div>

      <!-- Upgrade buttons with costs -->
      <button id="autoClickerBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mb-2">
        👵Grandma (Cost: 69)
      </button>

      <button id="cursorBtn"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 mb-2 rounded shadow">
        🖱️ Cursor (Cost: 15)
      </button>

      <button id="factoryBtn"
          class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 mb-2 rounded shadow">
        🏭 Factory (Cost: 500)
      </button>

      <button id="bankBtn"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mb-2 rounded shadow">
        🏦 Bank (Cost: 67410)
      </button>

      <button id="templeBtn"
          class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 mb-2 rounded shadow">
        ⛪ Mango temple (Cost: 50000)
      </button>

      <button id="chaoticOhioBtn"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 mb-2 rounded shadow">
        ⏳ Chaotic Ohio (Cost: 6700000)
      </button>
  </div>

  <!-- GAME Section -->
  <div id="game-area" class="col-span-3 flex flex-col items-center justify-between p-4 bg-yellow-100 rounded-xl shadow-xl border-8 border-double border-yellow-800">

      <!-- Top section (Title + Counter) -->
      <div class="text-center">
          <!-- Game title -->
          <div class="relative z-10 text-5xl font-extrabold text-yellow-900 drop-shadow-lg tracking-wide whitespace-nowrap">
              🍪 Cookie Clicker
          </div>

          <!-- Cookie counter -->
          <div id="counter" class="relative z-10 mt-2 text-xl font-semibold text-yellow-900">
              Cookies: <span id="cookie-count" class="font-bold text-yellow-700">0</span>
          </div>
      </div>

      <!-- Middle section (Clickable Cookie) -->
      <div id="cookie" 
          class="relative z-10 w-48 h-48 bg-cover bg-center rounded-full cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 ease-out flex items-center justify-center bg-amber-200 border-4 border-amber-400">
          <!-- Cookie image -->
          <img src="{{site.baseurl}}/hacks/cookie-clicker/assets/baseCookie.png" class="w-full h-full rounded-full select-none pointer-events-none" />
      </div>

      <!-- Bottom section (Lesson/Docs link) -->
      <div id="lesson-info" class="relative z-10 text-center bg-yellow-200/70 px-6 py-3 rounded-lg shadow border border-yellow-400">
          <span class="font-semibold text-brown-800">Add your own feature:</span>
          <!-- Link to documentation -->
          <a href="/cookie-clicker-game-docs/" target="_blank" class="text-blue-600 hover:underline ml-2">
              Click here
          </a>
      </div>
  </div>
</div>

<!-- TailwindCSS framework -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Game logic script (external JS file) -->
<script src="{{site.baseurl}}/hacks/cookie-clicker/cookie-clicker-game.js"></script>
