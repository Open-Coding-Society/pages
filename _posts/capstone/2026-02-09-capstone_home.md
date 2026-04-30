---
microblog: true
toc: False
layout: post
tailwind: True
infoGraph: capstone_infograph
title: Capstone Projects
description: Design-Based Research (DBR) capstone projects solving real-world problems through iterative design, implementation, and analysis. Each project features ML, database work, and advanced data structures (e.g., graphs). Projects must be deployed and accessible through this infographic.
courses: {'csse': {'week': 25}}
type: capstone
categories: Capstone
permalink: /capstone/
sticky_rank: 1
---

<link rel="stylesheet" href="/assets/css/new-capstone.css">

<div class="capstone-action-buttons">
  <button id="editCapstoneFab" class="new-capstone-fab" title="Edit capstone" aria-label="Edit capstone" style="bottom: 100px;">✎</button>
  <button id="ncFab" class="new-capstone-fab" title="Create new capstone" aria-label="Create new capstone">+</button>
</div>

## Capstone Infographics Home


<h2>Design-Based Research (DBR) Capstone Projects</h2>

<style>
#capstone-grid > div {
  min-height: 10rem;
  transition: box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}
#capstone-grid > div a img {
  height: 7rem;
  width: auto;
  max-width: 7rem;
  object-fit: contain;
  display: block;
}
#capstone-grid > div:hover {
  border-color: rgba(59,130,246,0.45);
  box-shadow: 0 0 0 2px rgba(59,130,246,0.22), 0 6px 18px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}

/* Tech stack tooltip */
.capstone-tech-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  z-index: 50;
  background: #141414;
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 7px;
  padding: 7px 9px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.16s ease;
  min-width: 160px;
  max-width: 280px;
}
#capstone-grid > div:hover .capstone-tech-tooltip {
  opacity: 1;
}
.capstone-tech-tt-tag {
  background: rgba(255,255,255,0.11);
  color: #e5e7eb;
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
}
</style>

<div class="mb-4 grid gap-4 md:grid-cols-[minmax(max-content,1fr)_minmax(0,420px)] md:items-center">
  <div class="flex flex-wrap gap-2">
    <button id="show-all" class="px-3 py-1 bg-gray-200 rounded mr-2">All</button>
    <button id="show-csa" class="px-3 py-1 bg-blue-200 rounded mr-2">CSA</button>
    <button id="show-csp" class="px-3 py-1 bg-blue-200 rounded mr-2">CSP</button>
    <a href="{% post_url 2026-04-13-capstone_home_documentation %}" class="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded text-sm text-slate-900 hover:bg-gray-100" title="Open Capstone Home Documentation">
      <span class="mr-2">📄</span>Documentation
    </a>
  </div>
  <div class="flex flex-col items-start sm:items-end">
    <input id="project-search" type="search" placeholder="Search projects, descriptions, or team members" class="w-full min-w-[240px] rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300" />
    <p id="search-status" class="mt-2 text-xs text-gray-500">Showing all projects.</p>
  </div>
</div>


<script>
// Tech stacks sourced from _data/capstone_card_tech.yml — keyed by exact card title
var _capstoneTech = {% assign ct = site.data.capstone_card_tech %}{{ ct | jsonify }};
</script>

<script>
// Full project data sourced from _data/*_infograph.yml files via Liquid
var _capstoneData = {};
{% for pair in site.data %}{% assign _d = pair[1] %}{% if _d.Topics %}{% for _t in _d.Topics %}_capstoneData[{{ _t.title | jsonify }}] = {{ _t | jsonify }};
{% endfor %}{% endif %}{% endfor %}
</script>

<script>
document.addEventListener('DOMContentLoaded', function(){
  const cards = Array.from(document.querySelectorAll('#capstone-grid > div'));
  const searchInput = document.getElementById('project-search');
  const status = document.getElementById('search-status');
  let currentType = 'all';
  let currentQuery = '';

  const linkMap = {
    "Oasis": {
      pageUrl: "https://pages.opencodingsociety.com/capstone/oasis/",
      frontendUrl: "https://github.com/Frogpants/community-backend",
      backendUrl: "https://github.com/Frogpants/community-backend"
    },
    "Wayfinding Pages": {
      pageUrl: "https://pages.opencodingsociety.com/capstone/wayfinding/",
      frontendUrl: "https://github.com/blackstar3092/wayfinding_pages",
      backendUrl: "https://github.com/blackstar3092/wayfinding_spring"
    },
    "HawkHub": {
      pageUrl: "https://pages.opencodingsociety.com/capstone/hawkhub/",
      frontendUrl: "https://github.com/SoniDhenuva/HawkHub",
      backendUrl: "https://github.com/SoniDhenuva/hawkhub_spring"
    },
    "NodCursor": {
      pageUrl: "https://pages.opencodingsociety.com/capstone/nodcursor/",
      frontendUrl: "https://github.com/aadibhat09/NodCursor",
      backendUrl: "https://github.com/aadibhat09/NodCursor"
    },
    "Pirna": {
      pageUrl: "https://pages.opencodingsociety.com/capstone/pirna/",
      frontendUrl: "https://github.com/adikatre/Pirna-pages",
      backendUrl: "https://github.com/adikatre/Pirna-spring"
    },
    "Hunger Heroes": {
      pageUrl: "https://pages.opencodingsociety.com/capstone/hunger-heroes/",
      frontendUrl: "https://github.com/Ahaanv19/hunger_heroes",
      backendUrl: "https://github.com/Ahaanv19/hunger_heroes_backend"
    },
    "College Bound": {
      pageUrl: "https://pages.opencodingsociety.com/capstone/college-bound/",
      frontendUrl: "https://github.com/collegeboundacademy/college-bound",
      backendUrl: "https://github.com/collegeboundacademy/college-bound-backend"
    },
    "Educators": {
      pageUrl: "https://pages.opencodingsociety.com/capstone/educators/",
      frontendUrl: "https://github.com/NithikaVivek/pages-educators",
      backendUrl: "https://github.com/NithikaVivek/spring-educators"
    },
    "SD Auto": {
      pageUrl: "https://pages.opencodingsociety.com/capstone/sd-auto/",
      frontendUrl: "https://github.com/Ahaanv19/SD_Auto_Frontend",
      backendUrl: "https://github.com/Ahaanv19/SD_Auto_Backend"
    },
    "SFI Foundation": {
      pageUrl: "https://pages.opencodingsociety.com/capstone/greppers/",
      frontendUrl: "http://sfifoundation.opencodingsociety.com",
      backendUrl: "https://greppers-be.opencodingsociety.com/"
    }
  };

  function normalize(text){ return text.toLowerCase().trim(); }
  function matchesType(card){ return currentType === 'all' || card.classList.contains(currentType); }
  function matchesSearch(card){
    const text = normalize(card.textContent);
    return !currentQuery || text.includes(currentQuery);
  }
  
  function updateStatus(count){
  const total = getTotalProjects();

  if(currentQuery){
    status.textContent = count
      ? `${count} of ${total} project${total === 1 ? '' : 's'} found for "${currentQuery}".`
      : `No projects match "${currentQuery}".`;
  } else {
    status.textContent = `${total} total project${total === 1 ? '' : 's'}.`;
  }
}
  function getTotalProjects(){
  return cards.length;
}
  function applyFilters(){
    let count = 0;
    cards.forEach(card=>{
      const visible = matchesType(card) && matchesSearch(card);
      card.style.display = visible ? '' : 'none';
      if(visible) count++;
    });
    updateStatus(count);
  }
  function setTypeFilter(type){
    currentType = type;
    applyFilters();
  }
  document.getElementById('show-all')?.addEventListener('click', ()=> setTypeFilter('all'));
  document.getElementById('show-csa')?.addEventListener('click', ()=> setTypeFilter('CSA'));
  document.getElementById('show-csp')?.addEventListener('click', ()=> setTypeFilter('CSP'));
  function closeAllPopups(){
    document.querySelectorAll('.capstone-popup').forEach(el=>el.classList.add('hidden'));
  }
  function buildPopup(card){
    const popup = card.querySelector('.capstone-popup');
    const list = popup.querySelector('.capstone-popup-links');
    list.innerHTML = '';
    const pageLink = card.dataset.pageUrl || card.querySelector('a')?.href || '';
    const links = [
      { label: 'Project Page', url: pageLink },
      { label: 'Frontend Repo', url: card.dataset.frontendUrl },
      { label: 'Backend Repo', url: card.dataset.backendUrl }
    ];
    links.forEach(link=>{
      if(link.url){
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.rel = 'noreferrer noopener';
        anchor.className = 'block rounded-lg px-3 py-2 text-sm text-slate-900 bg-white/90 hover:bg-white';
        anchor.textContent = link.label;
        list.appendChild(anchor);
      }
    });
  }
  function togglePopup(card){
    const popup = card.querySelector('.capstone-popup');
    if(!popup) return;
    if(popup.classList.contains('hidden')){
      closeAllPopups();
      buildPopup(card);
      popup.classList.remove('hidden');
    } else {
      popup.classList.add('hidden');
    }
  }

  cards.forEach(card=>{
    card.classList.add('relative');
    const titleAnchor = card.querySelector('h3 a');
    if(titleAnchor){
      const cardTitle = titleAnchor.textContent.trim();
      const mapped = linkMap[cardTitle];
      if(mapped){
        card.dataset.pageUrl = mapped.pageUrl;
        card.dataset.frontendUrl = mapped.frontendUrl;
        card.dataset.backendUrl = mapped.backendUrl;
      }
    }
    // Inject tech stack tooltip from _capstoneTech map
    const _ttTitle = titleAnchor ? titleAnchor.textContent.trim() : '';
    if(_ttTitle && typeof _capstoneTech !== 'undefined' && _capstoneTech[_ttTitle] && _capstoneTech[_ttTitle].length){
      const _tt = document.createElement('div');
      _tt.className = 'capstone-tech-tooltip';
      _tt.setAttribute('aria-hidden','true');
      _capstoneTech[_ttTitle].forEach(function(t){
        const _tag = document.createElement('span');
        _tag.className = 'capstone-tech-tt-tag';
        _tag.textContent = t;
        _tt.appendChild(_tag);
      });
      card.appendChild(_tt);
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'capstone-links-button absolute top-3 right-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white/90 text-xl text-slate-900 shadow-sm transition hover:bg-white';
    button.setAttribute('aria-label', 'Open project links');
    button.innerHTML = '📁';
    const popup = document.createElement('div');
    popup.className = 'capstone-popup hidden absolute right-3 top-14 z-30 w-64 rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-2xl';
    popup.style.backdropFilter = 'blur(14px)';
    popup.style.backgroundColor = 'rgba(15, 23, 42, 0.96)';
    popup.innerHTML = '<div class="capstone-popup-links space-y-2"></div>';
    button.addEventListener('click', event=>{
      event.stopPropagation();
      togglePopup(card);
    });
    card.appendChild(button);
    card.appendChild(popup);
  });

  document.addEventListener('click', event=>{
    if(!event.target.closest('.capstone-popup') && !event.target.closest('.capstone-links-button')){
      closeAllPopups();
    }
  });
  document.addEventListener('keydown', event=>{
    if(event.key === 'Escape') closeAllPopups();
  });     
  searchInput.addEventListener('input', event=>{
    currentQuery = normalize(event.target.value);
    applyFilters();
  });
  applyFilters();
});
</script>

Below are the capstone infographic pages created by student groups. Click an image or title to open the full infographic and project page.

<div id="capstone-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 my-6">


   <!-- Slack Messaging Platform -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url capstone/2026-02-06-slack-messaging-capstone %}">
           <img src="/images/capstone/database_defenders.png" alt="Slack Messaging Platform - Real-Time Collaborative Chat" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url capstone/2026-02-06-slack-messaging-capstone %}">Slack Messaging Platform</a></h3>
           <p class="text-sm text-gray-700">A full-stack Slack-style messaging platform with real-time channels, message threading, AI-powered task extraction, and admin moderation — deployed to messaging.opencodingsociety.com.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Anvay Vahia, Mihir Bapat, Yash Parikh</p>
       </div>
   </div>


   <!-- Educators Capstone -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url capstone/2026-02-06-educators-capstone %}">
           <img src="/images/capstone/educators_icon.png" alt="Educators - Temporal Wayfinding for CS Learning" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url capstone/2026-02-06-educators-capstone %}">Educators</a></h3>
           <p class="text-sm text-gray-700">An educational platform that helps CS newcomers build mental models for temporal problem-solving in software development.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Nithika Vivek, Eshika Pallpotu, Saanvi Dogra</p>
       </div>
   </div>


   <!-- Hunger Heroes -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url capstone/2026-02-06-hunger-heroes-capstone %}">
           <img src="/images/capstone/hunger_heroes.svg" alt="Hunger Heroes - Food Redistribution Platform" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url capstone/2026-02-06-hunger-heroes-capstone %}">Hunger Heroes</a></h3>
           <p class="text-sm text-gray-700">A community-driven platform connecting restaurants, grocery stores, and individuals with excess fresh food to local shelters, food banks, and families in need.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Ahaan, Shaurya, Arnav</p>
       </div>
   </div>


   <!-- Quant Game -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url capstone/2026-02-06-quant-game-capstone %}">
           <img src="/images/capstone/quant-trading-game.png" alt="Quantitative Trading Bot capstone infographic preview image" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url capstone/2026-02-06-quant-game-capstone %}">Quantitative Trading Bot</a></h3>
           <p class="text-sm text-gray-700">We are developing a quantitative trading bot that predicts short-term stock movement using market indicators and real-time financial news sentiment.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Anvay, Sai, Aashray</p>
       </div>
   </div>


   <!-- Bud-E -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url capstone/2026-02-08-bud-e-capstone %}">
           <img src="/images/capstone/bud_e.png" alt="Bud-E - Productivity Gamification Through Virtual Pet" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url capstone/2026-02-08-bud-e-capstone %}">Bud-E</a></h3>
           <p class="text-sm text-gray-700">Bud-E is a browser extension that gamifies productivity through a persistent virtual pet that grows when users stay focused on whitelisted websites and degrades when they navigate to distracting sites.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aadi Bhat, Pranav Santhosh, Nolan Hightower</p>
       </div>
   </div>


   <!-- Granolaa -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url capstone/2026-02-08-granolaa-capstone %}">
           <img src="/images/capstone/granolaa.png" alt="Granolaa - Local-First Screen and Webcam Monitoring" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url capstone/2026-02-08-granolaa-capstone %}">Granolaa</a></h3>
           <p class="text-sm text-gray-700">Granolaa is a local monitoring application that streams live screen and webcam feeds over local HTTP URLs, viewable in any browser without cloud infrastructure.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aadi Bhat, Pranav Santhosh, Nolan Hightower</p>
       </div>
   </div>


   <!-- Wayfinding Pages -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url capstone/2026-02-08-wayfinding-pages-capstone %}">
           <img src="/images/capstone/wayfinding_logo.png" alt="Wayfinding Pages - Sorting Groups Based on your Persona" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url capstone/2026-02-08-wayfinding-pages-capstone %}">Wayfinding Pages</a></h3>
           <p class="text-sm text-gray-700">A system that transforms social collaboration from subjective evaluation into measurable, visible signals for team formation and persona-based matching.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Ruta, Vibha, Risha</p>
       </div>
   </div>

   <!-- Greppers -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-04-greppers-capstone %}">
           <div class="w-28 h-28 flex items-center justify-center bg-blue-900 text-white text-3xl font-bold rounded">SFI</div>
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-04-greppers-capstone %}">SFI Foundation</a></h3>
           <p class="text-sm text-gray-700">SFI Foundation web modernization — ML-powered spec search, QR-based manufacturer verification, and a mobile-first UI redesign for motorsports safety certification.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aditya Srivastava, Dhyan Soni, Aaryav Lal</p>
       </div>
   </div>


   <!-- AutoTriage Pages -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-02-08-autotriage-capstone %}">
           <img src="/images/capstone/autotriage_logo.png" alt="AutoTriage - Triage project" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-08-autotriage-capstone %}">AutoTriage</a></h3>
           <p class="text-sm text-gray-700">A GitHub-native dev companion that builds issues for you, keeps your team aligned, and gives teachers a 30-second pulse on every group — without feeling like surveillance.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Neil, Nikhil, Shriya</p>
       </div>
   </div>
 <!-- Oasis Capstone -->
  <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
      <a href="{% post_url 2026-03-04-oasis-community-capstone %}">
          <img src="/images/capstone/oasis-logo.png" alt="Oasis Capstone" class="w-28 h-28 object-cover rounded" />
      </a>
      <div>
          <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-04-oasis-community-capstone %}">Oasis</a></h3>
          <p class="text-sm text-gray-700">A community building game focused on growing individual relationships and creating a community from that. This project is in relation to the non profit San Diego Oasis</p>
          <p class="text-xs text-gray-500 mt-2">Team: Spencer, Nora</p>
      </div>
  </div>


  <!-- Kora Capstone -->
  <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
      <a href="{% post_url 2026-02-06-kora-capstone %}">
          <img src="/images/capstone/kora.png" alt="Kora Capstone" class="w-28 h-28 object-cover rounded" />
      </a>
      <div>
          <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-kora-capstone %}">Kora Capstone</a></h3>
          <p class="text-sm text-gray-700">An AI-native property maintenance operating system that automates tenant requests, triages problems, matches vendors, and keeps operations moving without manual coordination.</p>
          <p class="text-xs text-gray-500 mt-2">Team: Manas, Akshay</p>
      </div>
  </div>


   <!-- Pirna Pages -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-02-13-pirna-capstone %}">
           <img src="/images/capstone/pirna_logo.png" alt="AutoTriage - Triage project" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-13-pirna-capstone %}">Pirna</a></h3>
           <p class="text-sm text-gray-700">Improve group-level communication and engagement on OCS through an integrated messaging system, while generating practical design principles for scalable, analytics-informed collaborative tools in educational platforms.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Nikhil, Rohan, Adi</p>
       </div>
   </div>

   <!-- Poway Symphonic Orchestra Capstone -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{{ '/capstone/powayorchestra/' | relative_url }}">
           <div class="w-28 h-28 overflow-hidden rounded bg-white">
               <img src="{{ '/images/pso_logo.png' | relative_url }}" alt="Poway Symphony Orchestra logo" class="w-full h-full object-cover scale-125" />
           </div>
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{{ '/capstone/powayorchestra/' | relative_url }}">Poway Symphony Orchestra</a></h3>
           <p class="text-sm text-gray-700">A design-based research capstone focused on improving the orchestra's digital presence through accessible navigation, stronger storytelling, responsive design, and clearer paths to attend, support, and explore performances.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Wi-Fighters (Meryl, Kailyn, Hope, Laya)</p>
       </div>
   </div>

   <!-- Poway NEC -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-06-powaynec-capstone %}">
           <img src="/images/capstone/powaynec-logo-white.png" alt="Poway NEC logo" class="w-56 h-32 object-contain rounded bg-emerald-950 p-2" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-06-powaynec-capstone %}">Poway Neighborhood Emergency Corps</a></h3>
           <p class="text-sm text-gray-700">Poway NEC capstone updates for preparedness access, including live risk information, emergency learning games, a chatbot, and account tools for volunteer coordination.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aneesh, Ethan, Samarth</p>
       </div>
   </div>

   <!-- College Bound Capstone -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-02-06-college-bound-capstone %}">
           <img src="/images/capstone/college_bound.jpeg" alt="College Bound Capstone" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-college-bound-capstone %}">College Bound</a></h3>
           <p class="text-sm text-gray-700">A website designed to provide a comprehensive guide to helping students prepare for college and effectively go through high school in preparation for the next stage of their educational career.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Xavier, Aranya, Trevor</p>
       </div>
   </div>

   <!-- HawkHub -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-02-06-hawkhub %}">
           <img src="/images/capstone/hawkhub.png" alt="HawkHub" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-hawkhub %}">HawkHub</a></h3>
           <p class="text-sm text-gray-700">A club management and community platform designed to streamline student-led club operations, engagement tracking, and leadership development.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Avika, Soni, Samhita</p>
       </div>
   </div>
   
   <!-- Doing Exceptional Deeds -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-09-doing-exceptional-deeds %}">
           <img src="/images/capstone/doing_exceptional_deeds.png" alt="Doing Exceptional Deeds - D.A.D. Non-profit Extension" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-doing-exceptional-deeds %}">Doing Exceptional Deeds</a></h3>
           <p class="text-sm text-gray-700">An extension for the Doing Exceptional Deeds non-profit website, uplifting individuals and strengthening communities through education-first programs.</p>
           <p class="text-xs text-gray-500 mt-2">Team: William Windle, Ethan Wong, Nicolas Diaz</p>
       </div>
   </div>

   <!-- ACS Cancer Infograph (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-05-acs-cancer-infograph %}">
           <img src="/images/capstone/acs_logo.png" alt="ACS Cancer Infograph — Interactive Body Map for Cancer Information" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-05-acs-cancer-infograph %}">ACS Cancer Infograph</a></h3>
           <p class="text-sm text-gray-700">Interactive human-body diagram consolidating ACS cancer information into one visual interface, letting users navigate by body region.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aashika, Anwita, Varada</p>
       </div>
   </div>


   <!-- Poway Woman's Club Capstone (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-09-poway-womans-club %}">
           <img src="/images/capstone/pwc_logo.png" alt="Poway Woman's Club — Website Refurbishment" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-poway-womans-club %}">Poway Woman's Club</a></h3>
           <p class="text-sm text-gray-700">Modernizing a 65-year-old community nonprofit's web presence with member portals, online payments, and a fresh UI — while preserving the heart of the original site.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Evan S, Maya D, Cyrus Z</p>
       </div>
   </div>

   <!-- UESL Foundation Capstone (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-05-uesl-capstone %}">
           <img src="/images/capstone/uesl_foundation.svg" alt="Unified Esports League Foundation logo — shield with game controller" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-05-uesl-capstone %}">UESL Foundation</a></h3>
           <p class="text-sm text-gray-700">Built an AI chatbot, accessible game engine with 8 IDD-friendly modes, and a social platform to extend UESL's reach for individuals with intellectual and developmental disabilities across San Diego.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Sathwik Kintada, Rudra B Joshi, Darshan</p>
       </div>
   </div>

   <!-- DeFlock SD Capstone (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-06-deflock-sd %}">
           <img src="/images/capstone/deflock-sd.png" alt="DeFlock SD - Fighting Mass Surveillance" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-06-deflock-sd %}">DeFlock SD</a></h3>
           <p class="text-sm text-gray-700">Crowdsourced map and tools to document ALPR surveillance in San Diego and support community resistance.</p>
           <p class="text-xs text-gray-500 mt-2">Team: TheFlockers (Adhav, Lucas, Perry)</p>
       </div>
   </div>

   <!-- Soroptimist International of Poway (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-08-sip-infograph %}">
           <img src="/images/sip/sip_logo.png" alt="Soroptimist International of Poway - Site Analysis" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-08-sip-infograph %}">Soroptimist International of Poway</a></h3>
           <p class="text-sm text-gray-700">We analyzed sipoway.com to document the organization's programs and recommend UI improvements that help donors, volunteers, and program applicants take action.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Anishka Sanghvi, Michelle Ji, Krishna Visvanath</p>
       </div>
   </div>

   <!-- Sentri (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-04-sentri-capstone %}">
           <img src="/images/capstone/sentri.png" alt="Sentri" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-04-sentri-capstone %}">Sentri</a></h3>
           <p class="text-sm text-gray-700">A comprehensive recovery ecosystem for the Poway Recovery Center that utilizes an intelligent guide to match users with specialized support programs, provides personalized meeting schedules, and tracks long-term sobriety milestones through a secure, high-fidelity user profile/dashboard</p>
           <p class="text-xs text-gray-500 mt-2">Team: Lilian Wu, Anika Marathe, Jaynee Chauhan</p>
        </div>
    </div>
   
   <!-- Friends of the Poway Library  (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-09-poway-library %}">
           <img src="/images/capstone/poway_library.png" alt="Friends of the Poway Library" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-poway-library %}">Friends of the Poway Library</a></h3>
           <p class="text-sm text-gray-700">Rebuilding the Friends of the Poway Library website with a live events calendar, volunteer portal, and donation flow.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Shayan Bhatti, Arnav Pallapotu, Tanay Paranjpe</p>
       </div>
   </div>

   <!-- DSA Website Redesign (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-09-dsa-website-redesign-blog %}">
           <img src="/images/capstone/dsa_redesign.svg" alt="DSA Website Redesign — Deputy Sheriffs' Association of San Diego County" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-dsa-website-redesign-blog %}">DSA Website Redesign</a></h3>
           <p class="text-sm text-gray-700">Redesign proposal for the Deputy Sheriffs' Association of San Diego County website — interactive dashboard, smart FAQ hub, and mega menu navigation.</p>
           <p class="text-xs text-gray-500 mt-2">Team: TheSprinters (Akhil, Neil, Moiz)</p>
       </div>
   </div>

   <!-- D.A.D. Website Redesign (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-09-dad-website-redesign-blog %}">
           <img src="/images/capstone/dad_redesign.svg" alt="D.A.D. Website Redesign — Doing Exceptional Deeds Nonprofit" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-dad-website-redesign-blog %}">D.A.D. Website Redesign</a></h3>
           <p class="text-sm text-gray-700">Redesign proposal for the Doing Exceptional Deeds nonprofit — impact-driven homepage, donation flow with impact visualization, and dedicated program pages with registration.</p>
           <p class="text-xs text-gray-500 mt-2">Team: TheSprinters (Akhil, Neil, Moiz)</p>
       </div>
   </div>

   <!-- RCR: Poway-Midland Railroad Project -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-06-rcr-poway-midland-capstone %}">
           <img src="https://static.vecteezy.com/system/resources/previews/034/949/404/non_2x/simple-steam-train-icon-illustration-design-steam-locomotive-symbol-template-vector.jpg" alt="RCR Poway-Midland Railroad Digital Experience" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-06-rcr-poway-midland-capstone %}">RCR: Poway-Midland Railroad</a></h3>
           <p class="text-sm text-gray-700">Modernizing the Poway-Midland Railroad website with an accounts system, interactive features, real-time train schedules, virtual tours, GPS tracking, and volunteer management tools.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Rebecca, Cyrus, Rishabh</p>
       </div>
   </div>

    <!-- Poway Veteran's Organization-->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
    <a href="{% post_url 2026-03-06-pvo-redesign-infographic %}">
        <img src="/images/capstone/poway-veterans-logo.png" alt="Poway Veterans Organization" class="w-28 h-28 object-cover rounded" />
    </a>
    <div>
        <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-06-pvo-redesign-infographic %}">Poway Veterans Organization</a></h3>
        <p class="text-sm text-gray-700">A guided 'Need Help? Start Here' pathway for the Poway Veterans Organization — simplified assistance application, document checklist, and urgent resource directory for veterans and families.</p>
        <p class="text-xs text-gray-500 mt-2">Team: API Pirates (Alice, Brandon, Aryan)</p>
    </div>

</div>
  <!-- SD Auto (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-04-15-sd-auto-capstone %}">
           <div class="w-28 h-28 flex items-center justify-center bg-blue-600 text-white text-2xl font-bold rounded" style="background: linear-gradient(135deg, #3b82f6, #06b6d4);">SD Auto</div>
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-04-15-sd-auto-capstone %}">SD Auto</a></h3>
           <p class="text-sm text-gray-700">A full-stack intelligent routing platform that enhances daily commutes in San Diego through real-time traffic data, community hazard reporting, and AI-driven route optimization.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Ahaan, Arnav</p>
       </div>
   </div>

  <!-- FOPS -->
 <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-09-friends-of-poway-seniors-capstone %}">
           <img src="/images/capstone/fops.png" alt="AutoTriage - Triage project" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-09-friends-of-poway-seniors-capstone %}">Friends of Poway Seniors</a></h3>
           <p class="text-sm text-gray-700"> This refurbished site transforms Friends of Poway Seniors into a clean, intuitive hub with interactive Bingo, AI chatbot ML-powered event predictor, and volunteer signup—all accessible from one unified interface. With simplified navigation and prominent donation buttons, the platform makes it easy for elderly users and caregivers to access essential services while honoring the organization's mission. </p>
           <p class="text-xs text-gray-500 mt-2">Team: Nitya, Vivian, Virginia</p>
       </div>
   </div>

 <!-- Dynamic Event Calendar (CSP) -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSP">
       <a href="{% post_url 2026-03-08-Flask-and-Furious-capstone %}">
           <img src="/images/capstone/sph.png" alt="Dynamic Event Calendar — Safe Passage Heals" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-08-Flask-and-Furious-capstone %}">Dynamic Event Calendar and Media Management</a></h3>
           <p class="text-sm text-gray-700">A system of interactive web tools for Safe Passage Heals — centralizing community events through a dynamic event calendar, and media management (blog and admin interface).</p>
           <p class="text-xs text-gray-500 mt-2">Team: Ruchika Kench, Akshara Shankar, Avantika Chittari</p>
       </div>
   </div>
</div>

<!-- Edit Capstone Modal -->
<div id="editCapstoneModal" style="display:none;position:fixed;inset:0;z-index:99000;background:rgba(0,0,0,0.82);overflow-y:auto;padding:28px 14px 56px;">
  <div class="nc-modal__panel">
    <button id="editCapstoneModalClose" class="nc-modal__close" aria-label="Close modal">×</button>
    <h2 class="nc-modal__title">Edit Capstone Project</h2>
    <p class="nc-modal__sub">Select a project and update its details.</p>
    <form id="editCapstoneForm" class="nc-form">
      <div class="nc-field">
        <label class="nc-label" for="editProjectSelect">Select Project <span>*</span></label>
        <select id="editProjectSelect" class="nc-select" required>
          <option value="">Choose a project...</option>
        </select>
      </div>
      <div class="nc-row-2">
        <div class="nc-field">
          <label class="nc-label" for="editTitle">Project Title <span>*</span></label>
          <input id="editTitle" name="title" type="text" class="nc-input" required />
        </div>
        <div class="nc-field">
          <label class="nc-label" for="editCourseCode">Course Code</label>
          <select id="editCourseCode" name="courseCode" class="nc-select">
            <option value="CSA">CSA</option>
            <option value="CSP">CSP</option>
          </select>
        </div>
      </div>
      <div class="nc-field">
        <label class="nc-label" for="editSubtitle">Subtitle</label>
        <input id="editSubtitle" name="subtitle" type="text" class="nc-input" />
      </div>
      <div class="nc-field">
        <label class="nc-label" for="editDescription">Description <span>*</span></label>
        <textarea id="editDescription" name="description" class="nc-textarea" rows="3" required></textarea>
      </div>
      <div class="nc-field">
        <label class="nc-label" for="editAbout">About</label>
        <textarea id="editAbout" name="about" class="nc-textarea" rows="4"></textarea>
      </div>
      <div class="nc-row-2">
        <div class="nc-field">
          <label class="nc-label" for="editStatus">Status</label>
          <select id="editStatus" name="status" class="nc-select">
            <option value="In Development">In Development</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
        <div class="nc-field">
          <label class="nc-label" for="editPageUrl">Project Page URL</label>
          <input id="editPageUrl" name="pageUrl" type="url" class="nc-input" />
        </div>
      </div>
      <div class="nc-row-2">
        <div class="nc-field">
          <label class="nc-label" for="editFrontendUrl">Frontend Repo URL</label>
          <input id="editFrontendUrl" name="frontendUrl" type="url" class="nc-input" />
        </div>
        <div class="nc-field">
          <label class="nc-label" for="editBackendUrl">Backend Repo URL</label>
          <input id="editBackendUrl" name="backendUrl" type="url" class="nc-input" />
        </div>
      </div>
      <div class="nc-section-title">Team Members</div>
      <div id="editTeamWrap" class="nc-tag-input">
        <div id="editTeamChips" class="nc-tag-input__chips"></div>
        <input id="editTeamInp" type="text" class="nc-tag-input__field" placeholder="Add team member..." />
        <input id="editTeamHidden" name="teamMembers" type="hidden" />
      </div>
      <div class="nc-section-title">Tech Stack</div>
      <div id="editTechWrap" class="nc-tag-input">
        <div id="editTechChips" class="nc-tag-input__chips"></div>
        <input id="editTechInp" type="text" class="nc-tag-input__field" placeholder="Add technology..." />
        <input id="editTechHidden" name="tech" type="hidden" />
      </div>
      <div class="nc-section-title">Key Points</div>
      <div class="nc-field">
        <textarea id="editKeyPoints" name="keyPoints" class="nc-textarea" rows="4" placeholder="One point per line"></textarea>
      </div>
      <div class="nc-section-title">Impact</div>
      <div class="nc-field">
        <textarea id="editImpact" name="impact" class="nc-textarea" rows="4" placeholder="One impact per line"></textarea>
      </div>
      <div class="nc-image-row">
        <div class="nc-field">
          <label class="nc-label">Project Image</label>
          <div class="nc-image-zone">
            <input id="editImage" name="image" type="file" accept="image/*" />
            <p class="nc-image-zone__text">Click to upload or drag image here</p>
          </div>
        </div>
        <div id="editImagePreview" class="nc-image-preview"></div>
      </div>
      <div class="nc-actions">
        <button type="submit" class="nc-submit">Update Project</button>
        <button type="button" id="editCancel" class="nc-cancel">Cancel</button>
        <div id="editStatus" class="nc-status"></div>
      </div>
    </form>
  </div>
</div>

<script>
(function(){
  /* ── helpers ── */
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function lines(v){return String(v||'').split('\n').map(function(s){return s.trim();}).filter(Boolean);}

  /* ── build modal DOM once ── */
  var modal = document.createElement('div');
  modal.id = 'ncModal';
  modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:99000;background:rgba(0,0,0,0.82);overflow-y:auto;padding:28px 14px 56px;';
  modal.innerHTML = [
    '<div class="nc-modal__panel">',
      '<button id="ncClose" class="nc-modal__close" type="button">&#x00D7;</button>',
      '<h2 class="nc-modal__title">Submit a Capstone Project</h2>',
      '<p class="nc-modal__sub">Fill in the fields — your project will appear in the grid exactly like the others.</p>',
      '<form id="ncForm" class="nc-form" novalidate>',
        '<p class="nc-section-title">Project Info</p>',
        '<div class="nc-row-2">',
          '<div class="nc-field"><label class="nc-label">Project Name <span>*</span></label><input id="ncTitle" name="title" class="nc-input" type="text" placeholder="e.g. Hunger Heroes"></div>',
          '<div class="nc-field"><label class="nc-label">Tagline</label><input id="ncSub" name="subtitle" class="nc-input" type="text" placeholder="One-line hook"></div>',
        '</div>',
        '<div class="nc-row-2">',
          '<div class="nc-field"><label class="nc-label">Course</label><select name="courseCode" class="nc-select"><option value="CSA">CSA</option><option value="CSP">CSP</option><option value="CSSE">CSSE</option></select></div>',
          '<div class="nc-field"><label class="nc-label">Status</label><select name="status" class="nc-select"><option>In Development</option><option>Live</option><option>Completed</option></select></div>',
        '</div>',
        '<div class="nc-field"><label class="nc-label">Short Description</label><textarea name="description" class="nc-textarea" rows="3" placeholder="2-3 sentences shown on the homepage card"></textarea></div>',
        '<div class="nc-field"><label class="nc-label">Full About Paragraph</label><textarea name="about" class="nc-textarea" rows="3" placeholder="Shown on the project detail page"></textarea></div>',
        '<p class="nc-section-title">Team &amp; Tech</p>',
        '<div class="nc-field"><label class="nc-label">Team Members</label><div id="ncTeamWrap" class="nc-tag-input"><div id="ncTeamChips" class="nc-tag-input__chips"></div><input id="ncTeamInp" class="nc-tag-input__field" type="text" placeholder="Type a name, press Enter"></div><input type="hidden" id="ncTeamHidden" name="teamMembers"><p class="nc-help">Enter or comma after each name.</p></div>',
        '<div class="nc-field"><label class="nc-label">Tech Stack</label><div id="ncTechWrap" class="nc-tag-input"><div id="ncTechChips" class="nc-tag-input__chips"></div><input id="ncTechInp" class="nc-tag-input__field" type="text" placeholder="e.g. Python Flask, PostgreSQL"></div><input type="hidden" id="ncTechHidden" name="tech"><p class="nc-help">Enter or comma after each tag.</p></div>',
        '<p class="nc-section-title">Features &amp; Impact</p>',
        '<div class="nc-row-2">',
          '<div class="nc-field"><label class="nc-label">Key Features</label><textarea name="keyPoints" class="nc-textarea" rows="5" placeholder="One feature per line"></textarea><p class="nc-help">One per line.</p></div>',
          '<div class="nc-field"><label class="nc-label">Impact Bullets</label><textarea name="impact" class="nc-textarea" rows="5" placeholder="One bullet per line"></textarea><p class="nc-help">One per line.</p></div>',
        '</div>',
        '<p class="nc-section-title">Project Image</p>',
        '<div class="nc-image-row">',
          '<div id="ncImgPrev" class="nc-image-preview"></div>',
          '<div class="nc-image-zone"><input id="ncImage" type="file" accept="image/*"><p class="nc-image-zone__text">Click or drag image here<br><span style="font-size:.72rem">PNG / JPG / SVG</span></p></div>',
        '</div>',
        '<p class="nc-section-title">Links (optional)</p>',
        '<div class="nc-row-2">',
          '<div class="nc-field"><label class="nc-label">Live Page URL</label><input name="pageUrl" class="nc-input" type="text" placeholder="https://…"></div>',
          '<div class="nc-field"><label class="nc-label">Frontend Repo</label><input name="frontendUrl" class="nc-input" type="text" placeholder="https://github.com/…"></div>',
        '</div>',
        '<div class="nc-actions">',
          '<button type="submit" id="ncSubmitBtn" class="nc-submit">Create Project</button>',
          '<button type="button" id="ncCancel" class="nc-cancel">Cancel</button>',
          '<span id="ncStatus" class="nc-status"></span>',
        '</div>',
      '</form>',
    '</div>'
  ].join('');
  document.body.appendChild(modal);

  /* ── show / hide ── */
  function openModal(){modal.style.display='flex';modal.style.alignItems='flex-start';modal.style.justifyContent='center';document.body.style.overflow='hidden';}
  function closeModal(){modal.style.display='none';document.body.style.overflow='';}

  document.getElementById('ncFab').addEventListener('click', openModal);
  document.getElementById('ncClose').addEventListener('click', closeModal);
  document.getElementById('ncCancel').addEventListener('click', closeModal);
  modal.addEventListener('click', function(e){if(e.target===modal)closeModal();});
  document.addEventListener('keydown', function(e){if(e.key==='Escape')closeModal();});

  /* ── tag-chip inputs ── */
  function makeTagInput(wrapId, chipsId, inputId, hiddenId){
    var tags=[], chips=document.getElementById(chipsId), inp=document.getElementById(inputId), hidden=document.getElementById(hiddenId);
    function render(){
      chips.innerHTML=tags.map(function(t,i){return '<span class="nc-chip">'+esc(t)+'<button type="button" data-i="'+i+'">×</button></span>';}).join('');
      hidden.value=tags.join('\n');
    }
    function add(v){v=v.trim();if(v&&tags.indexOf(v)===-1){tags.push(v);render();}inp.value='';}
    inp.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===','){e.preventDefault();add(inp.value);}if(e.key==='Backspace'&&!inp.value&&tags.length){tags.pop();render();}});
    inp.addEventListener('blur',function(){add(inp.value);});
    chips.addEventListener('click',function(e){var b=e.target.closest('[data-i]');if(b){tags.splice(+b.dataset.i,1);render();}});
  }
  makeTagInput('ncTeamWrap','ncTeamChips','ncTeamInp','ncTeamHidden');
  makeTagInput('ncTechWrap','ncTechChips','ncTechInp','ncTechHidden');

  /* ── image preview ── */
  document.getElementById('ncImage').addEventListener('change',function(){
    var file=this.files[0]; if(!file)return;
    var reader=new FileReader();
    reader.onload=function(e){
      var prev=document.getElementById('ncImgPrev');
      prev.style.backgroundImage='url('+e.target.result+')';
      prev.classList.add('nc-image-preview--loaded');
    };
    reader.readAsDataURL(file);
  });

  /* ── resize image via canvas ── */
  function resizeImg(file,cb){
    var img=new Image(),url=URL.createObjectURL(file);
    img.onload=function(){
      var max=600,r=Math.min(max/img.width,max/img.height,1);
      var c=document.createElement('canvas');c.width=Math.round(img.width*r);c.height=Math.round(img.height*r);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      URL.revokeObjectURL(url);cb(c.toDataURL('image/jpeg',0.78));
    };
    img.onerror=function(){URL.revokeObjectURL(url);cb(null);};
    img.src=url;
  }

  /* ── card injection ── */
  function injectCard(p){
    var grid=document.getElementById('capstone-grid'); if(!grid)return;
    var href='/capstone/view/?id='+encodeURIComponent(p.id);
    var imgHtml=p.imageUrl
      ? '<img src="'+p.imageUrl+'" alt="'+esc(p.title)+'" class="w-28 h-28 object-cover rounded">'
      : '<div class="w-28 h-28 flex items-center justify-center bg-blue-900 text-white text-2xl font-bold rounded">'+esc((p.title||'?').slice(0,3).toUpperCase())+'</div>';
    var team=Array.isArray(p.teamMembers)?p.teamMembers.join(', '):String(p.teamMembers||'');
    var course=(p.courseCode||'CSA').toUpperCase();
    var div=document.createElement('div');
    div.className='flex items-start space-x-4 p-4 border rounded-lg capstone-item relative '+course;
    div.innerHTML='<a href="'+esc(href)+'">'+imgHtml+'</a><div><h3 class="text-lg font-semibold"><a href="'+esc(href)+'">'+esc(p.title)+'</a></h3><p class="text-sm text-gray-700">'+esc(p.description||'')+'</p><p class="text-xs text-gray-500 mt-2">Team: '+esc(team)+'</p></div>';
    grid.prepend(div);
    div.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  /* ── form submit ── */
  document.getElementById('ncForm').addEventListener('submit', function(e){
    e.preventDefault();
    var title=this.querySelector('[name="title"]').value.trim();
    var statusEl=document.getElementById('ncStatus');
    if(!title){statusEl.textContent='Project name is required.';statusEl.className='nc-status nc-status--err';return;}
    var btn=document.getElementById('ncSubmitBtn');
    btn.disabled=true;btn.textContent='Creating…';statusEl.textContent='';
    var form=this;
    function finish(imgUrl){
      var p={
        id:'local_'+Date.now(),
        title:title,
        subtitle:form.querySelector('[name="subtitle"]').value.trim(),
        description:form.querySelector('[name="description"]').value.trim(),
        about:form.querySelector('[name="about"]').value.trim(),
        courseCode:form.querySelector('[name="courseCode"]').value,
        status:form.querySelector('[name="status"]').value,
        tech:lines(form.querySelector('[name="tech"]').value),
        teamMembers:lines(form.querySelector('[name="teamMembers"]').value),
        keyPoints:lines(form.querySelector('[name="keyPoints"]').value),
        impact:lines(form.querySelector('[name="impact"]').value),
        pageUrl:form.querySelector('[name="pageUrl"]').value.trim(),
        frontendUrl:form.querySelector('[name="frontendUrl"]').value.trim(),
        imageUrl:imgUrl
      };
      try{var all=JSON.parse(sessionStorage.getItem('ncLP')||'[]');all.push(p);sessionStorage.setItem('ncLP',JSON.stringify(all));}catch(er){}
      injectCard(p);
      statusEl.textContent='✓ Project added!';statusEl.className='nc-status nc-status--ok';
      form.reset();
      document.getElementById('ncTeamChips').innerHTML='';document.getElementById('ncTeamHidden').value='';
      document.getElementById('ncTechChips').innerHTML='';document.getElementById('ncTechHidden').value='';
      var prev=document.getElementById('ncImgPrev');prev.style.backgroundImage='';prev.classList.remove('nc-image-preview--loaded');
      btn.disabled=false;btn.textContent='Create Project';
      setTimeout(closeModal,1100);
    }
    var imgFile=document.getElementById('ncImage').files[0];
    if(imgFile){resizeImg(imgFile,finish);}else{finish(null);}
  });

  // ── Edit Modal Functions ──
  function openEditModal(){
    var modal=document.getElementById('editCapstoneModal');
    modal.style.display='flex';modal.style.alignItems='flex-start';modal.style.justifyContent='center';document.body.style.overflow='hidden';
  }
  function closeEditModal(){
    var modal=document.getElementById('editCapstoneModal');
    modal.style.display='none';document.body.style.overflow='';
  }

  // Populate project select
  function populateProjectSelect(){
    var select=document.getElementById('editProjectSelect');
    select.innerHTML='<option value="">Choose a project...</option>';
    for(var title in _capstoneData){
      var option=document.createElement('option');
      option.value=title;
      option.textContent=title;
      select.appendChild(option);
    }
  }

  // Populate form with project data
  function populateForm(title){
    var data=_capstoneData[title];
    if(!data)return;
    document.getElementById('editTitle').value=data.title||'';
    document.getElementById('editCourseCode').value=data.courseCode||'CSA';
    document.getElementById('editSubtitle').value=data.subtitle||'';
    document.getElementById('editDescription').value=data.description||'';
    document.getElementById('editAbout').value=data.about||'';
    document.getElementById('editStatus').value=data.status||'In Development';
    document.getElementById('editPageUrl').value=data.pageUrl||'';
    document.getElementById('editFrontendUrl').value=data.frontendUrl||'';
    document.getElementById('editBackendUrl').value=data.backendUrl||'';
    document.getElementById('editKeyPoints').value=Array.isArray(data.keyPoints)?data.keyPoints.join('\n'):(data.keyPoints||'');
    document.getElementById('editImpact').value=Array.isArray(data.impact)?data.impact.join('\n'):(data.impact||'');

    // Team members
    var teamTags=Array.isArray(data.teamMembers)?data.teamMembers:(data.teamMembers?data.teamMembers.split('\n').map(function(s){return s.trim();}).filter(Boolean):[]);
    updateTagInput('editTeamWrap','editTeamChips','editTeamInp','editTeamHidden',teamTags);

    // Tech stack
    var techTags=Array.isArray(data.tech)?data.tech:(data.tech?data.tech.split('\n').map(function(s){return s.trim();}).filter(Boolean):[]);
    updateTagInput('editTechWrap','editTechChips','editTechInp','editTechHidden',techTags);

    // Image preview
    var preview=document.getElementById('editImagePreview');
    if(data.imageUrl){
      preview.style.backgroundImage='url('+data.imageUrl+')';
      preview.classList.add('nc-image-preview--loaded');
    }else{
      preview.style.backgroundImage='';preview.classList.remove('nc-image-preview--loaded');
    }
  }

  // Helper to update tag inputs
  function updateTagInput(wrapId,chipsId,inputId,hiddenId,tags){
    var chips=document.getElementById(chipsId);
    var hidden=document.getElementById(hiddenId);
    chips.innerHTML=tags.map(function(t,i){return '<span class="nc-chip">'+esc(t)+'<button type="button" data-i="'+i+'" aria-label="Remove '+esc(t)+'">×</button></span>';}).join('');
    hidden.value=tags.join('\n');
  }

  // Event listeners for edit modal
  document.getElementById('editCapstoneFab').addEventListener('click',function(){
    populateProjectSelect();
    openEditModal();
  });
  document.getElementById('editCapstoneModalClose').addEventListener('click',closeEditModal);
  document.getElementById('editCancel').addEventListener('click',closeEditModal);
  document.getElementById('editCapstoneModal').addEventListener('click',function(e){if(e.target===this)closeEditModal();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.getElementById('editCapstoneModal').style.display!=='none')closeEditModal();});

  document.getElementById('editProjectSelect').addEventListener('change',function(){
    var title=this.value;
    if(title){populateForm(title);}
  });

  // Tag inputs for edit
  function makeTagInput(wrapId,chipsId,inputId,hiddenId){
    var wrap=document.getElementById(wrapId),chips=document.getElementById(chipsId),inp=document.getElementById(inputId),hidden=document.getElementById(hiddenId);
    var tags=[];
    function render(){
      chips.innerHTML=tags.map(function(t,i){return '<span class="nc-chip">'+esc(t)+'<button type="button" data-i="'+i+'" aria-label="Remove '+esc(t)+'">×</button></span>';}).join('');
      hidden.value=tags.join('\n');
    }
    inp.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===','){
        e.preventDefault();
        var val=inp.value.trim();
        if(val&&!tags.includes(val)){tags.push(val);render();}
        inp.value='';
      }
      if(e.key==='Backspace'&&!inp.value&&tags.length){tags.pop();render();}
    });
    inp.addEventListener('blur',function(){
      var val=inp.value.trim();
      if(val&&!tags.includes(val)){tags.push(val);render();}
      inp.value='';
    });
    chips.addEventListener('click',function(e){
      var btn=e.target.closest('button[data-i]');
      if(btn){tags.splice(+btn.dataset.i,1);render();}
    });
    return {tags:tags,render:render};
  }
  var editTeamTag=makeTagInput('editTeamWrap','editTeamChips','editTeamInp','editTeamHidden');
  var editTechTag=makeTagInput('editTechWrap','editTechChips','editTechInp','editTechHidden');

  // Image upload for edit
  document.getElementById('editImage').addEventListener('change',function(){
    var file=this.files[0];if(!file)return;
    var reader=new FileReader();
    reader.onload=function(e){
      document.getElementById('editImagePreview').style.backgroundImage='url('+e.target.result+')';
      document.getElementById('editImagePreview').classList.add('nc-image-preview--loaded');
    };
    reader.readAsDataURL(file);
  });

  // Form submit (placeholder)
  document.getElementById('editCapstoneForm').addEventListener('submit',function(e){
    e.preventDefault();
    var statusEl=document.getElementById('editStatus');
    statusEl.textContent='✓ Project updated (frontend only)';
    statusEl.className='nc-status nc-status--ok';
    setTimeout(function(){
      closeEditModal();
      statusEl.textContent='';statusEl.className='nc-status';
    },2000);
  });

})();
</script>
