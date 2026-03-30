---
toc: False
layout: post
tailwind: True
infoGraph: capstone_infograph
title: Capstone Projects
description: Design-Based Research (DBR) capstone projects solving real-world problems through iterative design, implementation, and analysis. Each project features ML, database work, and advanced data structures (e.g., graphs). Projects must be deployed and accessible through this infographic.
courses: {'csse': {'week': 25}}
type: capstone
categories: [Capstone]
permalink: /capstone/
sticky_rank: 1
---
## Capstone Marketplace


<h2>Design-Based Research (DBR) Capstone Marketplace</h2>

<div class="mb-4">
  <input id="search-input" type="text" placeholder="Search projects by description..." class="px-3 py-1 border rounded mr-2 w-full sm:w-auto mb-2" style="min-width:260px;" />
</div>

<div class="mb-4">
  <button id="show-all" class="px-3 py-1 bg-gray-200 rounded mr-2">All</button>
  <button id="show-csa" class="px-3 py-1 bg-blue-200 rounded mr-2">CSA</button>
  <button id="show-csp" class="px-3 py-1 bg-blue-200 rounded">CSP</button>
</div>

<script>
var currentFilter = 'all';

function filterItems() {
  var query = document.getElementById('search-input').value.toLowerCase().trim();
  document.querySelectorAll('.project-card').forEach(function(el) {
    var isCategorized = el.classList.contains('capstone-item');
    var matchesClass = !isCategorized || currentFilter === 'all' || el.classList.contains(currentFilter);
    var desc = (el.getAttribute('data-description') || '').toLowerCase();
    var titleEl = el.querySelector('h3');
    var title = titleEl ? titleEl.textContent.toLowerCase() : '';
    var matchesSearch = !query || desc.includes(query) || title.includes(query);
    el.style.display = (matchesClass && matchesSearch) ? '' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('show-all').onclick = function() { currentFilter = 'all'; filterItems(); };
  document.getElementById('show-csa').onclick = function() { currentFilter = 'CSA'; filterItems(); };
  document.getElementById('show-csp').onclick = function() { currentFilter = 'CSP'; filterItems(); };
  document.getElementById('search-input').addEventListener('input', filterItems);
});

function copyCloneUrl(url) {
  navigator.clipboard.writeText('git clone ' + url).then(function() {
    var toast = document.getElementById('clone-toast');
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
    }, 2000);
  });
}
</script>

<div id="clone-toast" style="position:fixed;bottom:24px;right:24px;background:#1f2937;color:#fff;padding:8px 16px;border-radius:6px;font-size:13px;opacity:0;pointer-events:none;transition:opacity 0.3s;z-index:9999;">
  Clone URL copied!
</div>

Browse and explore all capstone projects. Use the search bar to find projects by keyword, or filter by course below.


<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 my-6">


   <!-- Slack Messaging Platform -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="A full-stack Slack-style messaging platform with real-time channels, message threading, AI-powered task extraction, and admin moderation — deployed to messaging.opencodingsociety.com.">
       <a href="{% post_url 2026-02-06-slack-messaging-capstone %}">
           <img src="/images/capstone/database_defenders.png" alt="Slack Messaging Platform - Real-Time Collaborative Chat" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-slack-messaging-capstone %}">Slack Messaging Platform</a></h3>
           <p class="text-sm text-gray-700">A full-stack Slack-style messaging platform with real-time channels, message threading, AI-powered task extraction, and admin moderation — deployed to messaging.opencodingsociety.com.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Anvay Vahia, Mihir Bapat, Yash Parikh</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/slack-messaging-platform')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>


   <!-- Educators Capstone -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="An educational platform that helps CS newcomers build mental models for temporal problem-solving in software development.">
       <a href="{% post_url 2026-02-06-educators-capstone %}">
           <img src="/images/capstone/educators_icon.png" alt="Educators - Temporal Wayfinding for CS Learning" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-educators-capstone %}">Educators</a></h3>
           <p class="text-sm text-gray-700">An educational platform that helps CS newcomers build mental models for temporal problem-solving in software development.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Nithika Vivek, Eshika Pallpotu, Saanvi Dogra</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/educators-capstone')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>


   <!-- Hunger Heroes -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="A community-driven platform connecting restaurants, grocery stores, and individuals with excess fresh food to local shelters, food banks, and families in need.">
       <a href="{% post_url 2026-02-06-hunger-heroes-capstone %}">
           <img src="/images/capstone/hunger_heroes.svg" alt="Hunger Heroes - Food Redistribution Platform" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-hunger-heroes-capstone %}">Hunger Heroes</a></h3>
           <p class="text-sm text-gray-700">A community-driven platform connecting restaurants, grocery stores, and individuals with excess fresh food to local shelters, food banks, and families in need.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Ahaan, Shaurya, Arnav</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/hunger-heroes')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>


   <!-- Quant Game -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="We are developing a quantitative trading bot that predicts short-term stock movement using market indicators and real-time financial news sentiment.">
       <a href="{% post_url 2026-02-06-quant-game-capstone %}">
           <img src="/images/capstone/quant-trading-game.png" alt="Quantitative Trading Bot capstone infographic preview image" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-quant-game-capstone %}">Quantitative Trading Bot</a></h3>
           <p class="text-sm text-gray-700">We are developing a quantitative trading bot that predicts short-term stock movement using market indicators and real-time financial news sentiment.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Anvay, Sai, Aashray</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/quant-trading-bot')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>


   <!-- Bud-E -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="Bud-E is a browser extension that gamifies productivity through a persistent virtual pet that grows when users stay focused on whitelisted websites and degrades when they navigate to distracting sites.">
       <a href="{% post_url 2026-02-08-bud-e-capstone %}">
           <img src="/images/capstone/bud_e.png" alt="Bud-E - Productivity Gamification Through Virtual Pet" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-08-bud-e-capstone %}">Bud-E</a></h3>
           <p class="text-sm text-gray-700">Bud-E is a browser extension that gamifies productivity through a persistent virtual pet that grows when users stay focused on whitelisted websites and degrades when they navigate to distracting sites.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aadi Bhat, Pranav Santhosh, Nolan Hightower</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/bud-e')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>


   <!-- Granolaa -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="Granolaa is a local monitoring application that streams live screen and webcam feeds over local HTTP URLs, viewable in any browser without cloud infrastructure.">
       <a href="{% post_url 2026-02-08-granolaa-capstone %}">
           <img src="/images/capstone/granolaa.png" alt="Granolaa - Local-First Screen and Webcam Monitoring" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-08-granolaa-capstone %}">Granolaa</a></h3>
           <p class="text-sm text-gray-700">Granolaa is a local monitoring application that streams live screen and webcam feeds over local HTTP URLs, viewable in any browser without cloud infrastructure.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aadi Bhat, Pranav Santhosh, Nolan Hightower</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/granolaa')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>


   <!-- Wayfinding Pages -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="A system that transforms social collaboration from subjective evaluation into measurable, visible signals for team formation and persona-based matching.">
       <a href="{% post_url 2026-02-08-wayfinding-pages-capstone %}">
           <img src="/images/capstone/wayfinding_logo.png" alt="Wayfinding Pages - Sorting Groups Based on your Persona" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-08-wayfinding-pages-capstone %}">Wayfinding Pages</a></h3>
           <p class="text-sm text-gray-700">A system that transforms social collaboration from subjective evaluation into measurable, visible signals for team formation and persona-based matching.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Ruta, Vibha, Risha</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/wayfinding-pages')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- Greppers -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg project-card relative" data-description="SFI Foundation web modernization — ML-powered spec search, QR-based manufacturer verification, and a mobile-first UI redesign for motorsports safety certification.">
       <a href="{% post_url 2026-03-04-greppers-capstone %}">
           <div class="w-28 h-28 flex items-center justify-center bg-blue-900 text-white text-3xl font-bold rounded">SFI</div>
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-04-greppers-capstone %}">Greppers</a></h3>
           <p class="text-sm text-gray-700">SFI Foundation web modernization — ML-powered spec search, QR-based manufacturer verification, and a mobile-first UI redesign for motorsports safety certification.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aditya Srivastava, Dhyan Soni, Aaryav Lal</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/greppers')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>


   <!-- AutoTriage Pages -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="A GitHub-native dev companion that builds issues for you, keeps your team aligned, and gives teachers a 30-second pulse on every group — without feeling like surveillance.">
       <a href="{% post_url 2026-02-08-autotriage-capstone %}">
           <img src="/images/capstone/autotriage_logo.png" alt="AutoTriage - Triage project" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-08-autotriage-capstone %}">AutoTriage</a></h3>
           <p class="text-sm text-gray-700">A GitHub-native dev companion that builds issues for you, keeps your team aligned, and gives teachers a 30-second pulse on every group — without feeling like surveillance.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Neil, Nikhil, Shriya</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/autotriage')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

 <!-- Oasis Capstone -->
  <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="A community building game focused on growing individual relationships and creating a community from that. This project is in relation to the non profit San Diego Oasis.">
      <a href="{% post_url 2026-03-04-oasis-community-capstone %}">
          <img src="/images/capstone/oasis-logo.png" alt="Oasis Capstone" class="w-28 h-28 object-cover rounded" />
      </a>
      <div>
          <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-04-oasis-community-capstone %}">Oasis</a></h3>
          <p class="text-sm text-gray-700">A community building game focused on growing individual relationships and creating a community from that. This project is in relation to the non profit San Diego Oasis</p>
          <p class="text-xs text-gray-500 mt-2">Team: Spencer, Nora</p>
      </div>
      <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/oasis-community')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
      </button>
  </div>


  <!-- Kora Capstone -->
  <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="An AI-native property maintenance operating system that automates tenant requests, triages problems, matches vendors, and keeps operations moving without manual coordination.">
      <a href="{% post_url 2026-02-06-kora-capstone %}">
          <img src="/images/capstone/kora.png" alt="Kora Capstone" class="w-28 h-28 object-cover rounded" />
      </a>
      <div>
          <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-kora-capstone %}">Kora Capstone</a></h3>
          <p class="text-sm text-gray-700">An AI-native property maintenance operating system that automates tenant requests, triages problems, matches vendors, and keeps operations moving without manual coordination.</p>
          <p class="text-xs text-gray-500 mt-2">Team: Manas, Akshay</p>
      </div>
      <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/kora-capstone')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
      </button>
  </div>


   <!-- Pirna Pages -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="Improve group-level communication and engagement on OCS through an integrated messaging system, while generating practical design principles for scalable, analytics-informed collaborative tools in educational platforms.">
       <a href="{% post_url 2026-02-13-pirna-capstone %}">
           <img src="/images/capstone/pirna_logo.png" alt="Pirna capstone" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-13-pirna-capstone %}">Pirna</a></h3>
           <p class="text-sm text-gray-700">Improve group-level communication and engagement on OCS through an integrated messaging system, while generating practical design principles for scalable, analytics-informed collaborative tools in educational platforms.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Nikhil, Rohan, Adi</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/pirna')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- Poway Symphonic Orchestra Capstone -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg project-card relative" data-description="A design-based research capstone focused on improving the orchestra's digital presence through accessible navigation, stronger storytelling, responsive design, and clearer paths to attend, support, and explore performances.">
       <a href="{{ '/capstone/powayorchestra/' | relative_url }}">
           <img src="{{ '/images/pso_logo.png' | relative_url }}" alt="Poway Symphony Orchestra logo" class="w-28 h-28 object-contain rounded bg-white p-2" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{{ '/capstone/powayorchestra/' | relative_url }}">Poway Symphony Orchestra</a></h3>
           <p class="text-sm text-gray-700">A design-based research capstone focused on improving the orchestra's digital presence through accessible navigation, stronger storytelling, responsive design, and clearer paths to attend, support, and explore performances.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Wi-Fighters (Meryl, Kailyn, Hope, Laya)</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/poway-symphony-orchestra')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- Binary Beasts -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="Combined PYBL + Poway NEC capstone infographics on one page: youth basketball operations and emergency preparedness information architecture improvements.">
       <a href="{% post_url 2026-03-06-pybl-capstone %}">
           <img src="/images/capstone/pybl.png" alt="PYBL capstone preview image" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-06-pybl-capstone %}">Binary Beasts</a></h3>
           <p class="text-sm text-gray-700">Combined PYBL + Poway NEC capstone infographics on one page: youth basketball operations and emergency preparedness information architecture improvements.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aneesh, Ethan, Samarth</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/binary-beasts')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- College Bound Capstone -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="A website designed to provide a comprehensive guide to helping students prepare for college and effectively go through high school in preparation for the next stage of their educational career.">
       <a href="{% post_url 2026-02-06-college-bound-capstone %}">
           <img src="/images/capstone/college_bound.jpeg" alt="College Bound Capstone" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-college-bound-capstone %}">College Bound</a></h3>
           <p class="text-sm text-gray-700">A website designed to provide a comprehensive guide to helping students prepare for college and effectively go through high school in preparation for the next stage of their educational career.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Xavier, Aranya, Trevor</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/college-bound')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- HawkHub -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA project-card relative" data-description="A club management and community platform designed to streamline student-led club operations, engagement tracking, and leadership development.">
       <a href="{% post_url 2026-02-06-hawkhub %}">
           <img src="/images/capstone/hawkhub.png" alt="HawkHub" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-hawkhub %}">HawkHub</a></h3>
           <p class="text-sm text-gray-700">A club management and community platform designed to streamline student-led club operations, engagement tracking, and leadership development.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Avika, Soni, Samhita</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/hawkhub')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- Doing Exceptional Deeds -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP project-card relative" data-description="An extension for the Doing Exceptional Deeds non-profit website, uplifting individuals and strengthening communities through education-first programs.">
       <a href="{% post_url 2026-03-09-doing-exceptional-deeds %}">
           <img src="/images/capstone/doing_exceptional_deeds.png" alt="Doing Exceptional Deeds - D.A.D. Non-profit Extension" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-doing-exceptional-deeds %}">Doing Exceptional Deeds</a></h3>
           <p class="text-sm text-gray-700">An extension for the Doing Exceptional Deeds non-profit website, uplifting individuals and strengthening communities through education-first programs.</p>
           <p class="text-xs text-gray-500 mt-2">Team: William Windle, Ethan Wong, Nicolas Diaz</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/doing-exceptional-deeds')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- ACS Cancer Infograph (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP project-card relative" data-description="Interactive human-body diagram consolidating ACS cancer information into one visual interface, letting users navigate by body region.">
       <a href="{% post_url 2026-03-05-acs-cancer-infograph %}">
           <img src="/images/capstone/acs_logo.png" alt="ACS Cancer Infograph — Interactive Body Map for Cancer Information" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-05-acs-cancer-infograph %}">ACS Cancer Infograph</a></h3>
           <p class="text-sm text-gray-700">Interactive human-body diagram consolidating ACS cancer information into one visual interface, letting users navigate by body region.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aashika, Anwita, Varada</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/acs-cancer-infograph')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>


   <!-- Poway Woman's Club Capstone (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP project-card relative" data-description="Modernizing a 65-year-old community nonprofit's web presence with member portals, online payments, and a fresh UI — while preserving the heart of the original site.">
       <a href="{% post_url 2026-03-09-poway-womans-club %}">
           <img src="/images/capstone/pwc_logo.png" alt="Poway Woman's Club — Website Refurbishment" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-poway-womans-club %}">Poway Woman's Club</a></h3>
           <p class="text-sm text-gray-700">Modernizing a 65-year-old community nonprofit's web presence with member portals, online payments, and a fresh UI — while preserving the heart of the original site.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Evan S, Maya D, Cyrus Z</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/poway-womans-club')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- UESL Foundation Capstone (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP project-card relative" data-description="Empowering individuals with intellectual and developmental disabilities through year-round esports and community programs across San Diego and Imperial Counties.">
       <a href="{% post_url 2026-03-05-uesl-capstone %}">
           <img src="/images/capstone/uesl_foundation.svg" alt="Unified Esports League Foundation logo — shield with game controller" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-05-uesl-capstone %}">UESL Foundation</a></h3>
           <p class="text-sm text-gray-700">Empowering individuals with intellectual and developmental disabilities through year-round esports and community programs across San Diego and Imperial Counties.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Rudra Darshan Sathwik</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/uesl-foundation')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- DeFlock SD Capstone (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP project-card relative" data-description="Crowdsourced map and tools to document ALPR surveillance in San Diego and support community resistance.">
       <a href="{% post_url 2026-03-06-deflock-sd %}">
           <img src="/images/capstone/deflock-sd.png" alt="DeFlock SD - Fighting Mass Surveillance" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-06-deflock-sd %}">DeFlock SD</a></h3>
           <p class="text-sm text-gray-700">Crowdsourced map and tools to document ALPR surveillance in San Diego and support community resistance.</p>
           <p class="text-xs text-gray-500 mt-2">Team: TheFlockers (Adhav, Lucas, Perry)</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/deflock-sd')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- Soroptimist International of Poway (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP project-card relative" data-description="We analyzed sipoway.com to document the organization's programs and recommend UI improvements that help donors, volunteers, and program applicants take action.">
       <a href="{% post_url 2026-03-08-sip-infograph %}">
           <img src="/images/sip/sip_logo.png" alt="Soroptimist International of Poway - Site Analysis" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-08-sip-infograph %}">Soroptimist International of Poway</a></h3>
           <p class="text-sm text-gray-700">We analyzed sipoway.com to document the organization's programs and recommend UI improvements that help donors, volunteers, and program applicants take action.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Anishka Sanghvi, Michelle Ji, Krishna Visvanath</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/soroptimist-poway')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- Sentri (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP project-card relative" data-description="A sobriety tracker that analyzes daily biometric and mood data to predict a user's relapse risk and proactively deliver personalized interventions before a crisis occurs.">
       <a href="{% post_url 2026-03-04-sentri-capstone %}">
           <img src="/images/capstone/sentri.png" alt="Sentri" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-04-sentri-capstone %}">Sentri</a></h3>
           <p class="text-sm text-gray-700">A sobriety tracker that analyzes daily biometric and mood data to predict a user's relapse risk and proactively deliver personalized interventions before a crisis occurs</p>
           <p class="text-xs text-gray-500 mt-2">Team: Lilian Wu, Anika Marathe, Jaynee Chauhan</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/sentri')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- Friends of the Poway Library  (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP project-card relative" data-description="Rebuilding the Friends of the Poway Library website with a live events calendar, volunteer portal, donation flow, and impact dashboard to match the quality of their community mission.">
       <a href="{% post_url 2026-03-09-poway-library %}">
           <img src="/images/capstone/poway_library.png" alt="Friends of the Poway Library" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-poway-library %}">Friends of the Poway Library</a></h3>
           <p class="text-sm text-gray-700">Rebuilding the Friends of the Poway Library website with a live events calendar, volunteer portal, donation flow, and impact dashboard to match the quality of their community mission.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Shayan Bhatti, Arnav Pallapotu, Tanay Paranjpe</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/poway-library')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- DSA Website Redesign (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP project-card relative" data-description="Redesign proposal for the Deputy Sheriffs' Association of San Diego County website — interactive dashboard, smart FAQ hub, and mega menu navigation.">
       <a href="{% post_url 2026-03-09-dsa-website-redesign-blog %}">
           <img src="/images/capstone/dsa_redesign.svg" alt="DSA Website Redesign — Deputy Sheriffs' Association of San Diego County" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-dsa-website-redesign-blog %}">DSA Website Redesign</a></h3>
           <p class="text-sm text-gray-700">Redesign proposal for the Deputy Sheriffs' Association of San Diego County website — interactive dashboard, smart FAQ hub, and mega menu navigation.</p>
           <p class="text-xs text-gray-500 mt-2">Team: TheSprinters (Akhil, Neil, Moiz)</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/dsa-website-redesign')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- D.A.D. Website Redesign (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP project-card relative" data-description="Redesign proposal for the Doing Exceptional Deeds nonprofit — impact-driven homepage, donation flow with impact visualization, and dedicated program pages with registration.">
       <a href="{% post_url 2026-03-09-dad-website-redesign-blog %}">
           <img src="/images/capstone/dad_redesign.svg" alt="D.A.D. Website Redesign — Doing Exceptional Deeds Nonprofit" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-dad-website-redesign-blog %}">D.A.D. Website Redesign</a></h3>
           <p class="text-sm text-gray-700">Redesign proposal for the Doing Exceptional Deeds nonprofit — impact-driven homepage, donation flow with impact visualization, and dedicated program pages with registration.</p>
           <p class="text-xs text-gray-500 mt-2">Team: TheSprinters (Akhil, Neil, Moiz)</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/dad-website-redesign')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- RCR: Poway-Midland Railroad Project -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg project-card relative" data-description="Modernizing the Poway-Midland Railroad website with interactive features, real-time train schedules, virtual tours, GPS tracking, educational coding games, and volunteer management tools.">
       <a href="{% post_url 2026-03-06-rcr-poway-midland-capstone %}">
           <img src="https://static.vecteezy.com/system/resources/previews/034/949/404/non_2x/simple-steam-train-icon-illustration-design-steam-locomotive-symbol-template-vector.jpg" alt="RCR Poway-Midland Railroad Digital Experience" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-06-rcr-poway-midland-capstone %}">RCR: Poway-Midland Railroad</a></h3>
           <p class="text-sm text-gray-700">Modernizing the Poway-Midland Railroad website with interactive features, real-time train schedules, virtual tours, GPS tracking, educational coding games, and volunteer management tools.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Rebecca, Cyrus, Rishabh</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/rcr-poway-midland')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

   <!-- Poway Veteran's Organization -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP project-card relative" data-description="A guided 'Need Help? Start Here' pathway for the Poway Veterans Organization — simplified assistance application, document checklist, and urgent resource directory for veterans and families.">
    <a href="{% post_url 2026-03-06-pvo-redesign-infographic %}">
        <img src="/images/capstone/poway-veterans-logo.png" alt="Poway Veterans Organization" class="w-28 h-28 object-cover rounded" />
    </a>
    <div>
        <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-06-pvo-redesign-infographic %}">Poway Veterans Organization</a></h3>
        <p class="text-sm text-gray-700">A guided 'Need Help? Start Here' pathway for the Poway Veterans Organization — simplified assistance application, document checklist, and urgent resource directory for veterans and families.</p>
        <p class="text-xs text-gray-500 mt-2">Team: API Pirates (Alice, Brandon, Aryan)</p>
    </div>
    <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/poway-veterans-org')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
    </button>
  </div>

  <!-- FOPS -->
  <div class="flex items-start space-x-4 p-4 border rounded-lg project-card relative" data-description="Diet tracker for the elderly.">
       <a href="{% post_url 2026-03-09-friends-of-poway-seniors-capstone %}">
           <img src="/images/capstone/fops.png" alt="Friends of Poway Seniors" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-friends-of-poway-seniors-capstone %}">Friends of Poway Seniors</a></h3>
           <p class="text-sm text-gray-700">Diet tracker for the elderly.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Nitya, Virginia, Ginny</p>
       </div>
       <button onclick="copyCloneUrl('https://github.com/PLACEHOLDER/friends-of-poway-seniors')" title="Copy clone URL" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
       </button>
   </div>

</div>
