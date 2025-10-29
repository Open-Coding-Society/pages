---
layout: opencs
microblog: True 
tailwind: True
title: Travel Quest — Food Route
description: >
  🎒 Progressive road-trip learning: San Diego → LA → SF → Seattle. Build dishes, query menus, handle transactions, and master database cleanup through coastal cuisine adventures.
author: Hope F.
permalink: /west-coast/food/
lxdData:
  Title: "🍕 Food Route — Back-End & Databases"
  Description: "Progressive road-trip learning: build dishes, query menus, handle transactions, and master database cleanup through coastal cuisine adventures."
  XP_System:
    Total_Available: 500
    Badges: ["First Insert", "Query Master", "Transactional Pro", "Cleanup Crew"]
  Cities:
    - Name: "San Diego"
      Icon: "☀️"  
      Image: "/images/SD.jpg"  
      Theme: "Yellow & Surfboard"
      Unlocked: true
      Description: "Fresh ingredients meet database creation. Build your first dishes by learning INSERT operations and data modeling."
      Challenge: "CREATE: Build the Baja Bowl - Design dish records and ingredient relationships"
      Analogy: "The database is your kitchen pantry — organize ingredients (fields) and recipes (records) so chefs (applications) can cook reliably."
      XP_Reward: 100
    - Name: "Los Angeles"
      Icon: "🌴"
      Image: "/images/LA.jpg" 
      Theme: "Pastel Neon & Taco Truck"
      Unlocked: false
      Description: "Food truck paradise! Learn to search, filter, and efficiently query your growing database of dishes."
      Challenge: "READ: Food Truck Tasting - Master filtering, search, and performance optimization"
      Analogy: "Think of querying like being a food critic — you need to find exactly what you're looking for quickly in a sea of options."
      XP_Reward: 100
      Unlock_Condition: "Complete San Diego activities"
    - Name: "San Francisco"
      Icon: "🌁"
      Image: "/images/SF.jpg"  
      Theme: "Foggy Blue & Sourdough"
      Unlocked: false
      Description: "Gourmet pop-up kitchen! Master updating records safely with transactions and conflict resolution."
      Challenge: "UPDATE: Gourmet Pop-Up - Handle menu changes, conflicts, and maintain data consistency"
      Analogy: "Updating data is like editing a shared recipe — you need to handle conflicts when multiple chefs want to make changes."
      XP_Reward: 150
      Unlock_Condition: "Complete Los Angeles activities"
    - Name: "Seattle"
      Icon: "🌲"
      Image: "/images/SEA.jpg"  
      Theme: "Teal & Salmon"
      Unlocked: false
      Description: "Sustainable cleanup and analytics! Master deletion strategies and build insightful reports from your data."
      Challenge: "DELETE & ANALYZE: Sustainable Cleanup - Implement archival strategies and generate analytics"
      Analogy: "Managing data lifecycle is like sustainable cooking — sometimes you preserve ingredients, sometimes you compost them."
      XP_Reward: 150
      Unlock_Condition: "Complete San Francisco activities"
---
{%- include tailwind/quests/west-coast-food.html -%}
