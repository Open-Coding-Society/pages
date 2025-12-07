---
layout: post
title: Course Leaderboard
description: View student rankings, progress analytics, and achievements
permalink: /leaderboard
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div class="leaderboard-page">
  <!-- Back Navigation -->
  <div class="back-nav">
    <a href="javascript:history.back()" class="back-link">
      <i class="fas fa-arrow-left"></i> Back to Course
    </a>
  </div>

  <!-- Leaderboard Container -->
  <div class="leaderboard-container">
    <div class="leaderboard-header">
      <h2>🏆 Course Leaderboard</h2>
      <div class="leaderboard-controls">
        <select id="leaderboard-scope" class="filter-btn">
          <option value="global">Global Rankings</option>
          <option value="friends">Friends Only</option>
          <option value="class">Class Rankings</option>
        </select>
        <select id="leaderboard-timeframe" class="filter-btn">
          <option value="alltime">All Time</option>
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
        </select>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="leaderboard-stats-overview">
      <div class="stat-card">
        <div class="stat-icon">🏅</div>
        <div class="stat-content">
          <div class="stat-label">Your Rank</div>
          <div class="stat-value" id="user-rank">--</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-content">
          <div class="stat-label">Current Streak</div>
          <div class="stat-value" id="user-streak">0 days</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <div class="stat-label">Total XP</div>
          <div class="stat-value" id="user-xp">0</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-label">Completion</div>
          <div class="stat-value" id="user-completion">0%</div>
        </div>
      </div>
    </div>

    <!-- Leaderboard Table -->
    <div class="leaderboard-table-container">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Student</th>
            <th class="sortable" data-sort="completion">Completion %</th>
            <th class="sortable" data-sort="streak">Streak</th>
            <th class="sortable" data-sort="xp">XP</th>
            <th>Badges</th>
          </tr>
        </thead>
        <tbody id="leaderboard-body">
          <!-- Populated by JavaScript -->
        </tbody>
      </table>
    </div>
  </div>

  <!-- Analytics Dashboard -->
  <div class="analytics-dashboard">
    <h2>📈 Your Progress Analytics</h2>
    <div class="charts-grid">
      <!-- Weekly Progress Chart -->
      <div class="chart-card">
        <h3>Weekly Progress Trend</h3>
        <canvas id="weekly-progress-chart"></canvas>
      </div>

      <!-- Quest Completion Timeline -->
      <div class="chart-card">
        <h3>Quest Completion Timeline</h3>
        <div id="quest-timeline"></div>
      </div>
    </div>
  </div>
</div>


