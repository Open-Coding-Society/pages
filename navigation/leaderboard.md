---
layout: post
title: Course Leaderboard
description: View student rankings, progress analytics, and achievements
permalink: /leaderboard
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
  .leaderboard-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px;
  }

  .back-nav {
    margin-bottom: 24px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #60a5fa;
    text-decoration: none;
    font-size: 14px;
    padding: 8px 16px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .back-link:hover {
    background: #252525;
    border-color: #60a5fa;
  }

  .filter-btn {
    padding: 8px 16px;
    background: transparent;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    color: #e0e0e0;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }

  .filter-btn:hover {
    background: #1a1a1a;
  }

  .leaderboard-container {
    background: #111111;
    border: 1px solid #1f1f1f;
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 24px;
  }

  .leaderboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .leaderboard-header h2 {
    color: #ffffff;
    margin: 0;
    font-size: 1.75rem;
  }

  .leaderboard-controls {
    display: flex;
    gap: 12px;
  }

  .leaderboard-stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: #0f0f0f;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.2s;
  }

  .stat-card:hover {
    border-color: #60a5fa;
    transform: translateY(-2px);
  }

  .stat-icon {
    font-size: 32px;
    flex-shrink: 0;
  }

  .stat-content {
    flex: 1;
  }

  .stat-label {
    color: #999999;
    font-size: 13px;
    margin-bottom: 4px;
  }

  .stat-value {
    color: #ffffff;
    font-size: 24px;
    font-weight: 600;
  }

  .leaderboard-table-container {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #2a2a2a;
  }

  .leaderboard-table {
    width: 100%;
    border-collapse: collapse;
  }

  .leaderboard-table thead {
    background: #0f0f0f;
  }

  .leaderboard-table th {
    padding: 16px;
    text-align: left;
    color: #60a5fa;
    font-weight: 600;
    border-bottom: 2px solid #2a2a2a;
  }

  .leaderboard-table th.sortable {
    cursor: pointer;
    user-select: none;
  }

  .leaderboard-table th.sortable:hover {
    color: #93c5fd;
  }

  .leaderboard-table tbody tr {
    border-bottom: 1px solid #1f1f1f;
    transition: background 0.2s;
  }

  .leaderboard-table tbody tr:hover {
    background: #0f0f0f;
  }

  .leaderboard-table tbody tr.current-user {
    background: rgba(96, 165, 250, 0.1);
    border-left: 3px solid #60a5fa;
  }

  .leaderboard-table td {
    padding: 16px;
    color: #e0e0e0;
  }

  .rank-cell {
    font-weight: 700;
    font-size: 18px;
  }

  .rank-cell.top-3 {
    color: #fbbf24;
  }

  .student-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .student-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #60a5fa, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
  }

  .badges-cell {
    display: flex;
    gap: 4px;
  }

  .badge-icon {
    font-size: 20px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .badge-icon:hover {
    opacity: 1;
    transform: scale(1.2);
  }

  /* Analytics Dashboard */
  .analytics-dashboard {
    background: #111111;
    border: 1px solid #1f1f1f;
    border-radius: 16px;
    padding: 32px;
  }

  .analytics-dashboard h2 {
    color: #ffffff;
    margin-bottom: 24px;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
  }

  .chart-card {
    background: #0f0f0f;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 24px;
  }

  .chart-card h3 {
    color: #ffffff;
    margin: 0 0 20px 0;
    font-size: 16px;
  }

  #quest-timeline {
    max-height: 300px;
    overflow-y: auto;
  }

  .timeline-item {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #1f1f1f;
  }

  .timeline-item:last-child {
    border-bottom: none;
  }

  .timeline-marker {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #60a5fa;
    margin-top: 4px;
    flex-shrink: 0;
  }

  .timeline-content {
    flex: 1;
  }

  .timeline-title {
    color: #ffffff;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .timeline-date {
    color: #999999;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    .charts-grid {
      grid-template-columns: 1fr;
    }

    .leaderboard-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .leaderboard-controls {
      width: 100%;
      flex-direction: column;
    }

    .leaderboard-stats-overview {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>

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


