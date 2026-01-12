---
layout: post 
tailwind: True
title: Backend Development Quest
description: >
  Learn about database structures, types, and integration with frontend for real-world full-stack development
author: CSP 2025-26
permalink: /west-coast/sports/
lxdData:
  Title: "Backend Development Modules"
  Description: "Master backend development and database integration skills!"
  Topics:
    - Title: "San Diego"
      Genre: "Project Creation"
      Level: 1
      Description: "Stop 1: San Diego — Connecting to the Data Field"
      Categories: ["Backend", "Flask", "Spring", "Databases"]
      Video: "/west-coast/backend/submodule_1-video"
      Lessons: "/west-coast/backend/submodule_1/"
      Image1: "/images/west-coast/petcopark.webp"
    - Title: "Los Angeles"
      Genre: "Project Creation"
      Level: 2
      Description: "Stop 2: Los Angeles — Filtering the Playbook"
      Categories: ["Backend", "Flask", "Spring", "Databases"]
      Video: "/west-coast/backend/submodule_2-video"
      Lessons: "/west-coast/backend/submodule_2/"
      Image2: "/images/west-coast/sofistadium.jpg"
    - Title: "San Francisco"
      Genre: "Project Creation"
      Level: 3
      Description: "Stop 3: San Francisco — Analyzing Performance Data"
      Categories: ["Backend", "Flask", "Spring", "Databases"]
      Video: "/west-coast/backend/submodule_3-video"
      Lessons: "/west-coast/backend/submodule_3/"
      Image3: "/images/west-coast/chasecenter.jpg"
    - Title: "Seattle"
      Genre: "Project Creation"
      Level: 4
      Description: "Stop 4: Seattle — Updating the Leaderboard"
      Categories: ["Backend", "Flask", "Spring", "Databases"]
      Video: "/west-coast/backend/submodule_4-video"
      Lessons: "/west-coast/backend/submodule_4/"
      Image4: "/images/west-coast/seattlestadiums.webp"
footer:
  home: /west-coast/sports/
  next: /west-coast/backend/submodule_1/
---

<style>
  .quest-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 3rem 1rem;
  }
  
  .quest-header {
    text-align: center;
    color: white;
    margin-bottom: 3rem;
    animation: fadeIn 0.8s ease-in;
  }
  
  .quest-header h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  
  .quest-header p {
    font-size: 1.25rem;
    opacity: 0.95;
  }
  
  .modules-grid {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .module-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    animation: slideUp 0.6s ease-out;
    animation-fill-mode: both;
    cursor: pointer;
  }
  
  .module-card:nth-child(1) { animation-delay: 0.1s; }
  .module-card:nth-child(2) { animation-delay: 0.2s; }
  .module-card:nth-child(3) { animation-delay: 0.3s; }
  .module-card:nth-child(4) { animation-delay: 0.4s; }
  
  .module-card:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.6);
  }
  
  .module-card:hover .module-header {
    filter: brightness(1.1);
  }
  
  .module-header {
    padding: 2rem;
    color: white;
    text-align: center;
    position: relative;
    transition: filter 0.3s ease;
  }
  
  .module-header.san-diego {
    background: linear-gradient(135deg, #FFC425 0%, #FF8C00 100%);
  }
  
  .module-header.los-angeles {
    background: linear-gradient(135deg, #552583 0%, #FDB927 100%);
  }
  
  .module-header.san-francisco {
    background: linear-gradient(135deg, #AA0000 0%, #B3995D 100%);
  }
  
  .module-header.seattle {
    background: linear-gradient(135deg, #002244 0%, #69be28 100%);
  }
  
  .module-level {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255,255,255,0.3);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }
  
  .module-card:hover .module-level {
    background: rgba(255,255,255,0.5);
    transform: scale(1.1);
  }
  
  .module-header h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .module-header p {
    opacity: 0.95;
    font-size: 1rem;
  }
  
  .module-body {
    padding: 2rem;
  }
  
  .module-body h3 {
    color: #2c3e50;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .module-body p {
    color: #555;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  .module-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .tag {
    background: #f0f0f0;
    padding: 0.4rem 0.8rem;
    border-radius: 15px;
    font-size: 0.85rem;
    color: #666;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .module-card:hover .tag {
    background: #e0e0e0;
    transform: translateY(-2px);
  }
  
  .module-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .btn {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .btn-primary:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
  
  .btn-secondary {
    background: #f8f9fa;
    color: #2c3e50;
    border: 2px solid #e0e0e0;
  }
  
  .btn-secondary:hover {
    background: #e9ecef;
    border-color: #667eea;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .quest-header h1 {
      font-size: 2rem;
    }
    
    .modules-grid {
      grid-template-columns: 1fr;
    }
    
    .module-actions {
      flex-direction: column;
    }
  }
</style>

<div class="quest-container">
  <div class="quest-header">
    <h1>🚀 Backend Development Quest</h1>
    <p>Master backend development and database integration skills!</p>
  </div>
  
  <div class="modules-grid">
    {% for topic in page.lxdData.Topics %}
      <div class="module-card">
        <div class="module-header {% if topic.Title == 'San Diego' %}san-diego{% elsif topic.Title == 'Los Angeles' %}los-angeles{% elsif topic.Title == 'San Francisco' %}san-francisco{% else %}seattle{% endif %}">
          <span class="module-level">Level {{ topic.Level }}</span>
          <h2>{{ topic.Title }}</h2>
          <p>{{ topic.Genre }}</p>
        </div>
        
        <div class="module-body">


          <h3>{{ topic.Description }}</h3>
          <img src="{{topic.Image1}}">
          <img src="{{topic.Image2}}">
          <img src="{{topic.Image3}}">
          <img src="{{topic.Image4}}">
          <div class="module-tags" alt="Petco Park">
            {% for category in topic.Categories %}
            <span class="tag">{{ category }}</span>
            {% endfor %}
          </div>
          
          <div class="module-actions">
            <a href="{{ topic.Lessons }}" class="btn btn-primary">Start Learning</a>
            <a href="{{ topic.Video }}" class="btn btn-secondary">Watch Video</a>
          </div>
        </div>
      </div>
    {% endfor %}
  </div>
</div>
