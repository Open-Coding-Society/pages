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
## Capstone Infographics Home


<h2>Design-Based Research (DBR) Capstone Projects</h2>

<div class="mb-4">
  <button id="show-all" class="px-3 py-1 bg-gray-200 rounded mr-2">All</button>
  <button id="show-csa" class="px-3 py-1 bg-blue-200 rounded mr-2">CSA</button>
  <button id="show-csp" class="px-3 py-1 bg-blue-200 rounded">CSP</button>
</div>

<script>
function filterClass(cls) {
  document.querySelectorAll('.capstone-item').forEach(el=>{
     el.style.display = cls==='all' || el.classList.contains(cls) ? '' : 'none';
  });
}
document.getElementById('show-all').onclick=()=>filterClass('all');
document.getElementById('show-csa').onclick=()=>filterClass('CSA');
document.getElementById('show-csp').onclick=()=>filterClass('CSP');
</script>

Below are the capstone infographic pages created by student groups. Click an image or title to open the full infographic and project page.


<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 my-6">


   <!-- Slack Messaging Platform -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-02-06-slack-messaging-capstone %}">
           <img src="/images/capstone/database_defenders.png" alt="Slack Messaging Platform - Real-Time Collaborative Chat" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-slack-messaging-capstone %}">Slack Messaging Platform</a></h3>
           <p class="text-sm text-gray-700">A full-stack Slack-style messaging platform with real-time channels, message threading, AI-powered task extraction, and admin moderation — deployed to messaging.opencodingsociety.com.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Anvay Vahia, Mihir Bapat, Yash Parikh</p>
       </div>
   </div>


   <!-- Educators Capstone -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-02-06-educators-capstone %}">
           <img src="/images/capstone/educators_icon.png" alt="Educators - Temporal Wayfinding for CS Learning" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-educators-capstone %}">Educators</a></h3>
           <p class="text-sm text-gray-700">An educational platform that helps CS newcomers build mental models for temporal problem-solving in software development.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Nithika Vivek, Eshika Pallpotu, Saanvi Dogra</p>
       </div>
   </div>


   <!-- Hunger Heroes -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-02-06-hunger-heroes-capstone %}">
           <img src="/images/capstone/hunger_heroes.svg" alt="Hunger Heroes - Food Redistribution Platform" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-hunger-heroes-capstone %}">Hunger Heroes</a></h3>
           <p class="text-sm text-gray-700">A community-driven platform connecting restaurants, grocery stores, and individuals with excess fresh food to local shelters, food banks, and families in need.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Ahaan, Shaurya, Arnav</p>
       </div>
   </div>


   <!-- Quant Game -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-02-06-quant-game-capstone %}">
           <img src="/images/capstone/quant-trading-game.png" alt="Quantitative Trading Bot capstone infographic preview image" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-06-quant-game-capstone %}">Quantitative Trading Bot</a></h3>
           <p class="text-sm text-gray-700">We are developing a quantitative trading bot that predicts short-term stock movement using market indicators and real-time financial news sentiment.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Anvay, Sai, Aashray</p>
       </div>
   </div>


   <!-- Bud-E -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-02-08-bud-e-capstone %}">
           <img src="/images/capstone/bud_e.png" alt="Bud-E - Productivity Gamification Through Virtual Pet" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-08-bud-e-capstone %}">Bud-E</a></h3>
           <p class="text-sm text-gray-700">Bud-E is a browser extension that gamifies productivity through a persistent virtual pet that grows when users stay focused on whitelisted websites and degrades when they navigate to distracting sites.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aadi Bhat, Pranav Santhosh, Nolan Hightower</p>
       </div>
   </div>


   <!-- Granolaa -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-02-08-granolaa-capstone %}">
           <img src="/images/capstone/granolaa.png" alt="Granolaa - Local-First Screen and Webcam Monitoring" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-08-granolaa-capstone %}">Granolaa</a></h3>
           <p class="text-sm text-gray-700">Granolaa is a local monitoring application that streams live screen and webcam feeds over local HTTP URLs, viewable in any browser without cloud infrastructure.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Aadi Bhat, Pranav Santhosh, Nolan Hightower</p>
       </div>
   </div>


   <!-- Wayfinding Pages -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-02-08-wayfinding-pages-capstone %}">
           <img src="/images/capstone/wayfinding_logo.png" alt="Wayfinding Pages - Sorting Groups Based on your Persona" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-02-08-wayfinding-pages-capstone %}">Wayfinding Pages</a></h3>
           <p class="text-sm text-gray-700">A system that transforms social collaboration from subjective evaluation into measurable, visible signals for team formation and persona-based matching.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Ruta, Vibha, Risha</p>
       </div>
   </div>

   <!-- Greppers -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg">
       <a href="{% post_url 2026-03-04-greppers-capstone %}">
           <div class="w-28 h-28 flex items-center justify-center bg-blue-900 text-white text-3xl font-bold rounded">SFI</div>
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-04-greppers-capstone %}">Greppers</a></h3>
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
   <div class="flex items-start space-x-4 p-4 border rounded-lg">
       <a href="{{ '/capstone/powayorchestra/' | relative_url }}">
           <img src="{{ '/images/capstone/powayorchestra.jpg' | relative_url }}" alt="Poway Symphonic Orchestra capstone project" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{{ '/capstone/powayorchestra/' | relative_url }}">Poway Symphonic Orchestra</a></h3>
           <p class="text-sm text-gray-700">A performing-arts capstone experience highlighting concerts, musicians, ticketing, donor support, and community music enrichment for the Poway Symphonic Orchestra.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Wi-Fighters (Meryl, Kailyn, Hope, Laya)</p>
       </div>
   </div>

   <!-- Binary Beasts -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA">
       <a href="{% post_url 2026-03-06-pybl-capstone %}">
           <img src="/images/capstone/pybl.png" alt="PYBL capstone preview image" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-06-pybl-capstone %}">Binary Beasts</a></h3>
           <p class="text-sm text-gray-700">Combined PYBL + Poway NEC capstone infographics on one page: youth basketball operations and emergency preparedness information architecture improvements.</p>
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
           <p class="text-sm text-gray-700">Empowering individuals with intellectual and developmental disabilities through year-round esports and community programs across San Diego and Imperial Counties.</p>
           <p class="text-xs text-gray-500 mt-2">Team: Rudra Darshan Sathwik</p>
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
           <p class="text-sm text-gray-700">A sobriety tracker that analyzes daily biometric and mood data to predict a user's relapse risk and proactively deliver personalized interventions before a crisis occurs</p>
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

   <!-- RCR: Poway-Midland Railroad Project - ADD THIS ENTIRE BLOCK -->
   <div class="flex items-start space-x-4 p-4 border rounded-lg">
       <a href="{% post_url 2026-03-06-rcr-poway-midland-capstone %}">
           <img src="https://static.vecteezy.com/system/resources/previews/034/949/404/non_2x/simple-steam-train-icon-illustration-design-steam-locomotive-symbol-template-vector.jpg" alt="RCR Poway-Midland Railroad Digital Experience" class="w-28 h-28 object-cover rounded" />
       </a>
       <div>
           <h3 class="text-lg font-semibold"><a href="{% post_url 2026-03-06-rcr-poway-midland-capstone %}">RCR: Poway-Midland Railroad</a></h3>
           <p class="text-sm text-gray-700">Modernizing the Poway-Midland Railroad website with interactive features, real-time train schedules, virtual tours, GPS tracking, educational coding games, and volunteer management tools.</p>
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
