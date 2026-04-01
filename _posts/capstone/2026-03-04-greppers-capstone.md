---
toc: false
layout: post
title: Greppers — SFI Foundation
description: SFI Foundation capstone project by Greppers
permalink: /capstone/greppers/
---

<style>
  .sfi-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    max-width: 800px;
    margin: 3rem auto;
  }
  .sfi-link-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem;
    border: 2px solid #1e3a5f;
    border-radius: 1rem;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    text-align: center;
  }
  .sfi-link-box:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    border-color: #2563eb;
  }
  .sfi-link-box .sfi-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  .sfi-link-box .sfi-label {
    font-size: 1.25rem;
    font-weight: 600;
  }
  .sfi-link-box .sfi-desc {
    font-size: 0.9rem;
    margin-top: 0.5rem;
    opacity: 0.7;
  }
  @media (max-width: 600px) {
    .sfi-links {
      grid-template-columns: 1fr;
    }
  }
</style>

<div class="sfi-links">
  <a href="https://sfifoundation.opencodingsociety.com" class="sfi-link-box" target="_blank" rel="noopener">
    <div class="sfi-icon">🌐</div>
    <div class="sfi-label">SFI Foundation Website</div>
    <div class="sfi-desc">sfifoundation.opencodingsociety.com</div>
  </a>
  <a href="{{ '/capstone/greppers/infographic/' | relative_url }}" class="sfi-link-box">
    <div class="sfi-icon">📊</div>
    <div class="sfi-label">SFI Foundation Infographic</div>
    <div class="sfi-desc">View the capstone infographic</div>
  </a>
</div>