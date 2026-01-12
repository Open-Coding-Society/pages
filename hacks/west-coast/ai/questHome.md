---
layout: post 
tailwind: True
title: AI Usage Quest
description: >
  Learn to prompt AI to create your itinerary, data visualization, and learn about the core concepts and limitations of AI!
author: CSP 2025-26
permalink: /west-coast/ai/
lxdData:
  Title: "AI Usage Modules"
  Description: "Master AI tools, prompting techniques, and storage concepts for efficient development!"
  Topics:
    - Title: "Key 1"
      Genre: "Assessment"
      Level: 1
      Description: "Team-defined AI usage module"
      Categories: ["ChatGPT", "Prompting", "AI Limitations", "Generation"]
      Video: "/west-coast/ai/submodule_1-video"
      Lessons: "/west-coast/ai/submodule_1/"
      Image: "/images/WC_AI_Submodule1.png"
      Alt: "AI Key 1"
    - Title: "Key 2"
      Genre: "Assessment"
      Level: 2
      Description: "Team-defined AI usage module"
      Categories: ["ChatGPT", "Prompting", "AI Limitations", "Generation"]
      Video: "/west-coast/ai/submodule_2-video"
      Lessons: "/west-coast/ai/submodule_2/"
      Image: "/images/WC_AI_Submodule2.png"
      Alt: "AI Key 2"
      RequiresLevel: 1
    - Title: "Key 3"
      Genre: "Assessment"
      Level: 3
      Description: "Team-defined AI usage module"
      Categories: ["ChatGPT", "Prompting", "AI Limitations", "Generation"]
      Video: "/west-coast/ai/submodule_3-video"
      Lessons: "/west-coast/ai/submodule_3/"
      Image: "/images/WC_AI_Submodule3.webp"
      Alt: "AI Key 3"
      RequiresLevel: 2
    - Title: "Key 4"
      Genre: "Assessment"
      Level: 4
      Description: "Team-defined AI usage module"
      Categories: ["ChatGPT", "Prompting", "AI Limitations", "Generation"]
      Video: "/west-coast/ai/submodule_4-video"
      Lessons: "/west-coast/ai/submodule_4/"
      Image: "/images/WC_AI_Submodule4RM.png"
      Alt: "AI Key 4"
      RequiresLevel: 3
---
{%- include tailwind/quests/west-coast-AI.html -%}


<!-- Lock/Unlock Logic -->
<style>
.quest-locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  display: none;
  pointer-events: all;
}

[data-module].quest-locked .quest-locked-overlay {
  display: block !important;
}

[data-module].quest-locked {
  pointer-events: none;
}
</style>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname;
    if (!currentPath.includes('/west-coast/ai')) {
        return;
    }
    
    // Wait for the page to fully render
    setTimeout(function() {
        const modules = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
        
        modules.forEach((module, index) => {
            const card = document.querySelector(`[data-module="${module}"]`);
            if (!card) return;
            
            // Make card position relative for overlay
            card.style.position = 'relative';
            
            // Create and add overlay
            const overlay = document.createElement('div');
            overlay.className = 'quest-locked-overlay';
            overlay.innerHTML = '<img src="/images/locked-overlay.svg" alt="Locked" style="width: 100%; height: 100%; object-fit: cover;">';
            card.insertBefore(overlay, card.firstChild);
            
            const level = index + 1;
            const previousLevel = level - 1;
            
            // Check if previous level is completed
            const isAvailable = level === 1 || localStorage.getItem(`ai-module-c${previousLevel}-completed`) === 'true';
            
            if (!isAvailable) {
                card.classList.add('quest-locked');
            } else {
                card.classList.remove('quest-locked');
            }
        });
    }, 100);
});
</script>