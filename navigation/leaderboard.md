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

<script>
  // Get course from URL parameters or use default
  const urlParams = new URLSearchParams(window.location.search);
  const CURRENT_COURSE = urlParams.get('course') || 'csp';
  const LEADERBOARD_KEY = `${CURRENT_COURSE}-leaderboard`;
  const USER_STATS_KEY = `${CURRENT_COURSE}-user-stats`;

  // Initialize user stats structure
  function initializeUserStats() {
    const defaultStats = {
      username: localStorage.getItem('student-username') || 'Anonymous',
      totalCompleted: 0,
      totalItems: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      weeklyProgress: {},
      badges: [],
      xp: 0
    };
    try {
      const stored = localStorage.getItem(USER_STATS_KEY);
      return stored ? { ...defaultStats, ...JSON.parse(stored) } : defaultStats;
    } catch (e) {
      return defaultStats;
    }
  }

  // Refresh leaderboard display
  function refreshLeaderboardDisplay() {
    const leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    const currentUser = initializeUserStats();
    const tbody = document.getElementById('leaderboard-body');

    if (!tbody) return;

    tbody.innerHTML = '';

    if (leaderboard.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No leaderboard data yet. Complete lessons to appear on the leaderboard!</td></tr>';
      return;
    }

    leaderboard.forEach((user, index) => {
      const rank = index + 1;
      const isCurrentUser = user.username === currentUser.username;
      const completionRate = user.totalItems > 0
        ? ((user.totalCompleted / user.totalItems) * 100).toFixed(1)
        : 0;

      const row = document.createElement('tr');
      if (isCurrentUser) row.classList.add('current-user');

      row.innerHTML = `
        <td class="rank-cell ${rank <= 3 ? 'top-3' : ''}">
          #${rank}
        </td>
        <td>
          <div class="student-cell">
            <div class="student-avatar">${user.username[0].toUpperCase()}</div>
            <span>${user.username}${isCurrentUser ? ' (You)' : ''}</span>
          </div>
        </td>
        <td>${completionRate}%</td>
        <td>${user.currentStreak} days</td>
        <td>${user.xp}</td>
        <td class="badges-cell">
          ${generateBadges(user)}
        </td>
      `;

      tbody.appendChild(row);
    });

    updateUserStatsDisplay(currentUser, leaderboard);
  }

  // Generate badge icons based on user achievements
  function generateBadges(user) {
    const badges = [];

    if (user.currentStreak >= 7) badges.push('🔥 7+ Streak');
    if (user.currentStreak >= 30) badges.push('🌟 30+ Streak');
    if (user.xp >= 1000) badges.push('⭐ 1000+ XP');
    if (user.longestStreak >= 14) badges.push('🏆 14+ Best');

    const weeklyCompleteCount = Object.values(user.weeklyProgress || {})
      .filter(w => w.completed === w.total).length;
    if (weeklyCompleteCount >= 5) badges.push('📚 Weekly Master');

    return badges.map(b => `<span class="badge-icon" title="${b}">${b.split(' ')[0]}</span>`).join('');
  }

  // Update user stats display in the stat cards
  function updateUserStatsDisplay(user, leaderboard) {
    const rank = leaderboard.findIndex(u => u.username === user.username) + 1;
    const completionRate = user.totalItems > 0
      ? ((user.totalCompleted / user.totalItems) * 100).toFixed(1)
      : 0;

    document.getElementById('user-rank').textContent = rank > 0 ? `#${rank}` : '--';
    document.getElementById('user-streak').textContent = `${user.currentStreak} days`;
    document.getElementById('user-xp').textContent = user.xp;
    document.getElementById('user-completion').textContent = `${completionRate}%`;
  }

  // Sort leaderboard by different criteria
  function sortLeaderboard(criteria) {
    const leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');

    leaderboard.sort((a, b) => {
      switch(criteria) {
        case 'completion':
          const aRate = a.totalItems > 0 ? a.totalCompleted / a.totalItems : 0;
          const bRate = b.totalItems > 0 ? b.totalCompleted / b.totalItems : 0;
          return bRate - aRate;
        case 'streak':
          return b.currentStreak - a.currentStreak;
        case 'xp':
        default:
          return b.xp - a.xp;
      }
    });

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    refreshLeaderboardDisplay();
  }

  // Initialize charts
  function initializeCharts() {
    createWeeklyProgressChart();
    createQuestTimeline();
  }

  // Create weekly progress chart
  function createWeeklyProgressChart() {
    const canvas = document.getElementById('weekly-progress-chart');
    if (!canvas) return;

    const stats = initializeUserStats();
    const weeklyData = stats.weeklyProgress || {};

    const weeks = Object.keys(weeklyData).sort((a, b) => parseInt(a) - parseInt(b));
    const completionRates = weeks.map(week => {
      const data = weeklyData[week];
      return data.total > 0 ? (data.completed / data.total) * 100 : 0;
    });

    // Show placeholder if no data
    if (weeks.length === 0) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#999';
      ctx.textAlign = 'center';
      ctx.font = '14px sans-serif';
      ctx.fillText('Complete lessons to see your progress!', canvas.width / 2, canvas.height / 2);
      return;
    }

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: weeks.map(w => `Week ${w}`),
        datasets: [{
          label: 'Completion %',
          data: completionRates,
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1f1f1f',
            titleColor: '#ffffff',
            bodyColor: '#e0e0e0'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#999999' },
            grid: { color: '#2a2a2a' }
          },
          x: {
            ticks: { color: '#999999' },
            grid: { color: '#2a2a2a' }
          }
        }
      }
    });
  }

  // Create quest completion timeline
  function createQuestTimeline() {
    const container = document.getElementById('quest-timeline');
    if (!container) return;

    const stats = initializeUserStats();
    const weeklyProgress = stats.weeklyProgress || {};

    // Build timeline from weekly progress
    const timeline = [];
    Object.entries(weeklyProgress).forEach(([weekNum, data]) => {
      if (data.completedDate) {
        timeline.push({
          title: `Week ${weekNum} Completed`,
          week: weekNum,
          date: new Date(data.completedDate)
        });
      }
    });

    // Sort by date (most recent first)
    timeline.sort((a, b) => b.date - a.date);

    if (timeline.length === 0) {
      container.innerHTML = '<p style="color: #999; text-align: center;">No completed quests yet. Start learning!</p>';
      return;
    }

    container.innerHTML = timeline.slice(0, 10).map(item => `
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-title">${item.title}</div>
          <div class="timeline-date">Week ${item.week} • ${item.date.toLocaleDateString()}</div>
        </div>
      </div>
    `).join('');
  }

  // Initialize page
  document.addEventListener('DOMContentLoaded', function() {
    refreshLeaderboardDisplay();
    initializeCharts();

    // Add click listeners for sortable columns
    document.querySelectorAll('.leaderboard-table th.sortable').forEach(header => {
      header.addEventListener('click', function() {
        const sortBy = this.dataset.sort;
        sortLeaderboard(sortBy);
      });
    });

    // Prompt for username if not set
    if (!localStorage.getItem('student-username')) {
      const username = prompt('Enter your name for the leaderboard:');
      if (username) {
        localStorage.setItem('student-username', username);
        refreshLeaderboardDisplay();
      }
    }
  });
</script>

