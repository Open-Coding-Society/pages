---
layout: post
title: Your Analytics
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

  .page-header {
    margin-bottom: 32px;
  }

  .page-header h1 {
    color: #ffffff;
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  .page-header p {
    color: #9ca3af;
    font-size: 14px;
    margin: 0;
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
    background: #0f0f0f;
    border: 1px solid #1f1f1f;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .back-link:hover {
    background: #1a1a1a;
    border-color: #60a5fa;
  }

  .filter-btn {
    padding: 8px 16px;
    background: #0f0f0f;
    border: 1px solid #1f1f1f;
    border-radius: 6px;
    color: #e0e0e0;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }

  .filter-btn:hover {
    background: #1a1a1a;
    border-color: #2a2a2a;
  }

  .filter-btn:focus {
    outline: none;
    border-color: #60a5fa;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: #0f0f0f;
    border: 1px solid #1f1f1f;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s;
  }

  .stat-card:hover {
    border-color: #2a2a2a;
  }

  .stat-card.highlight {
    border-color: #60a5fa;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.05) 0%, transparent 100%);
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    font-size: 18px;
  }

  .stat-icon.rank { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
  .stat-icon.streak { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
  .stat-icon.xp { background: rgba(96, 165, 250, 0.15); color: #60a5fa; }
  .stat-icon.completion { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
  .stat-icon.certificates { background: rgba(168, 85, 247, 0.15); color: #a855f7; }

  .stat-label {
    color: #6b7280;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .stat-value {
    color: #ffffff;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.2;
  }

  .stat-subtitle {
    color: #6b7280;
    font-size: 12px;
    margin-top: 4px;
  }

  /* Leaderboard Section */
  .leaderboard-section {
    background: #0a0a0a;
    border: 1px solid #1f1f1f;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #1f1f1f;
  }

  .section-title {
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title i {
    color: #60a5fa;
    font-size: 16px;
  }

  .section-controls {
    display: flex;
    gap: 12px;
  }

  /* Leaderboard Table */
  .leaderboard-table {
    width: 100%;
    border-collapse: collapse;
  }

  .leaderboard-table thead {
    background: #0f0f0f;
  }

  .leaderboard-table th {
    padding: 14px 20px;
    text-align: left;
    color: #6b7280;
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #1f1f1f;
  }

  .leaderboard-table th.sortable {
    cursor: pointer;
    user-select: none;
    transition: color 0.2s;
  }

  .leaderboard-table th.sortable:hover {
    color: #60a5fa;
  }

  .leaderboard-table th.sortable i {
    margin-left: 6px;
    font-size: 10px;
    opacity: 0.5;
  }

  .leaderboard-table tbody tr {
    border-bottom: 1px solid #1f1f1f;
    transition: background 0.2s;
  }

  .leaderboard-table tbody tr:last-child {
    border-bottom: none;
  }

  .leaderboard-table tbody tr:hover {
    background: #0f0f0f;
  }

  .leaderboard-table tbody tr.current-user {
    background: rgba(96, 165, 250, 0.08);
  }

  .leaderboard-table td {
    padding: 16px 20px;
    color: #e0e0e0;
    font-size: 14px;
  }

  .rank-cell {
    font-weight: 700;
    font-size: 16px;
    color: #6b7280;
    width: 60px;
  }

  .rank-cell.gold { color: #fbbf24; }
  .rank-cell.silver { color: #9ca3af; }
  .rank-cell.bronze { color: #cd7c2f; }

  .student-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .student-avatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, #1f1f1f 0%, #0f0f0f 100%);
    border: 1px solid #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #60a5fa;
    font-weight: 600;
    font-size: 14px;
  }

  .student-info {
    display: flex;
    flex-direction: column;
  }

  .student-name {
    color: #ffffff;
    font-weight: 500;
  }

  .student-tag {
    color: #60a5fa;
    font-size: 11px;
    font-weight: 500;
  }

  .badges-cell {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    font-size: 11px;
    color: #9ca3af;
  }

  .badge i {
    font-size: 10px;
  }

  .badge.streak { border-color: rgba(239, 68, 68, 0.3); color: #ef4444; }
  .badge.xp { border-color: rgba(96, 165, 250, 0.3); color: #60a5fa; }
  .badge.certificate { border-color: rgba(168, 85, 247, 0.3); color: #a855f7; }
  .badge.master { border-color: rgba(34, 197, 94, 0.3); color: #22c55e; }

  /* Analytics Section */
  .analytics-section {
    background: #0a0a0a;
    border: 1px solid #1f1f1f;
    border-radius: 16px;
    overflow: hidden;
  }

  .analytics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: #1f1f1f;
  }

  .analytics-card {
    background: #0a0a0a;
    padding: 24px;
  }

  .analytics-card h3 {
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .analytics-card h3 i {
    color: #60a5fa;
    font-size: 14px;
  }

  #quest-timeline {
    max-height: 280px;
    overflow-y: auto;
  }

  #quest-timeline::-webkit-scrollbar {
    width: 4px;
  }

  #quest-timeline::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  #quest-timeline::-webkit-scrollbar-thumb {
    background: #2a2a2a;
    border-radius: 2px;
  }

  .timeline-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #1f1f1f;
  }

  .timeline-item:last-child {
    border-bottom: none;
  }

  .timeline-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #60a5fa;
    margin-top: 6px;
    flex-shrink: 0;
  }

  .timeline-dot.certificate {
    background: #a855f7;
  }

  .timeline-content {
    flex: 1;
  }

  .timeline-title {
    color: #e0e0e0;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 2px;
  }

  .timeline-meta {
    color: #6b7280;
    font-size: 12px;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
  }

  .empty-state i {
    font-size: 32px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .empty-state p {
    margin: 0;
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .analytics-grid {
      grid-template-columns: 1fr;
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .section-controls {
      width: 100%;
    }

    .section-controls .filter-btn {
      flex: 1;
    }
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
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

  <!-- Page Header -->
  <div class="page-header">
    <h1>Your Analytics</h1>
    <p>Track your progress and see how you rank among your peers</p>
  </div>

  <!-- Stats Overview -->
  <div class="stats-grid">
    <div class="stat-card highlight">
      <div class="stat-icon rank">
        <i class="fas fa-trophy"></i>
      </div>
      <div class="stat-label">Your Rank</div>
      <div class="stat-value" id="user-rank">--</div>
      <div class="stat-subtitle" id="rank-change"></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon streak">
        <i class="fas fa-fire"></i>
      </div>
      <div class="stat-label">Current Streak</div>
      <div class="stat-value" id="user-streak">0</div>
      <div class="stat-subtitle">days</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon xp">
        <i class="fas fa-bolt"></i>
      </div>
      <div class="stat-label">Total XP</div>
      <div class="stat-value" id="user-xp">0</div>
      <div class="stat-subtitle">experience points</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon completion">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="stat-label">Completion</div>
      <div class="stat-value" id="user-completion">0%</div>
      <div class="stat-subtitle" id="completion-detail">0 of 0 items</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon certificates">
        <i class="fas fa-award"></i>
      </div>
      <div class="stat-label">Certificates</div>
      <div class="stat-value" id="user-certificates">0</div>
      <div class="stat-subtitle">earned</div>
    </div>
  </div>

  <!-- Leaderboard Section -->
  <div class="leaderboard-section">
    <div class="section-header">
      <h2 class="section-title">
        <i class="fas fa-ranking-star"></i>
        Rankings
      </h2>
      <div class="section-controls">
        <select id="leaderboard-sort" class="filter-btn">
          <option value="xp">Sort by XP</option>
          <option value="completion">Sort by Completion</option>
          <option value="streak">Sort by Streak</option>
          <option value="certificates">Sort by Certificates</option>
        </select>
      </div>
    </div>
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Student</th>
          <th class="sortable" data-sort="completion">Completion <i class="fas fa-sort"></i></th>
          <th class="sortable" data-sort="streak">Streak <i class="fas fa-sort"></i></th>
          <th class="sortable" data-sort="xp">XP <i class="fas fa-sort"></i></th>
          <th>Achievements</th>
        </tr>
      </thead>
      <tbody id="leaderboard-body">
        <!-- Populated by JavaScript -->
      </tbody>
    </table>
  </div>

  <!-- Analytics Section -->
  <div class="analytics-section">
    <div class="section-header">
      <h2 class="section-title">
        <i class="fas fa-chart-line"></i>
        Progress Analytics
      </h2>
    </div>
    <div class="analytics-grid">
      <div class="analytics-card">
        <h3><i class="fas fa-chart-area"></i> Weekly Progress</h3>
        <canvas id="weekly-progress-chart" height="200"></canvas>
      </div>
      <div class="analytics-card">
        <h3><i class="fas fa-award"></i> Certificates Earned</h3>
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
  const STORAGE_KEY = `${CURRENT_COURSE}-lesson-completion`;
  const CERTIFICATES_KEY = `${CURRENT_COURSE}-earned-certificates`;

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
      earnedCertificates: [],
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

  // NEW: Sync user stats with current completion data and build weekly progress
  function syncUserStatsFromCompletion() {
    const stats = initializeUserStats();
    const completionData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    
    // Get total items from stored count (set by timeline page)
    const totalItems = parseInt(localStorage.getItem(`${CURRENT_COURSE}-total-items`) || '0');
    
    // Recalculate totals from completion data
    const allCompletedItems = Object.values(completionData).filter(Boolean).length;
    stats.totalCompleted = allCompletedItems;
    stats.totalItems = totalItems;
    
    // NEW: Build weekly progress from completion data
    // This simulates having week data by analyzing completed items
    if (allCompletedItems > 0) {
      // Create sample weekly progress based on total completion
      // In a real scenario, items would have week associations
      const estimatedWeeks = Math.ceil(totalItems / 10); // Assume ~10 items per week
      const completedPerWeek = Math.floor(allCompletedItems / estimatedWeeks);
      
      for (let week = 1; week <= estimatedWeeks; week++) {
        const weekTotal = 10; // Assume 10 items per week
        const weekCompleted = week < estimatedWeeks ? completedPerWeek : (allCompletedItems % estimatedWeeks || completedPerWeek);
        
        stats.weeklyProgress[week] = {
          total: weekTotal,
          completed: Math.min(weekCompleted, weekTotal),
          completedDate: weekCompleted === weekTotal ? new Date().toISOString() : null
        };
      }
    }
    
    // Recalculate XP
    calculateXP(stats);
    
    // Save updated stats
    saveUserStats(stats);
    
    return stats;
  }

  // Save user stats to localStorage
  function saveUserStats(stats) {
    try {
      localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
      
      // Also update leaderboard
      updateLeaderboard(stats);
    } catch (e) {
      console.error('Error saving user stats:', e);
    }
  }

  // Update leaderboard with current user's stats
  function updateLeaderboard(userStats) {
    let leaderboard = [];
    try {
      leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    } catch(e) {
      leaderboard = [];
    }
    
    // Find and update or add current user
    const userIndex = leaderboard.findIndex(u => u.username === userStats.username);
    if (userIndex >= 0) {
      leaderboard[userIndex] = userStats;
    } else {
      leaderboard.push(userStats);
    }
    
    // Sort by XP (default)
    leaderboard.sort((a, b) => b.xp - a.xp);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  }

  // Calculate XP based on completion
  function calculateXP(stats) {
    // Base XP: 10 per completed item
    let xp = stats.totalCompleted * 10;
    
    // Bonus: 50 XP per completed week
    const completedWeeks = Object.values(stats.weeklyProgress || {})
      .filter(w => w.completed === w.total && w.total > 0).length;
    xp += completedWeeks * 50;
    
    // Bonus: Streak multiplier
    if (stats.currentStreak >= 7) xp += 100;
    if (stats.currentStreak >= 14) xp += 200;
    if (stats.currentStreak >= 30) xp += 500;
    
    // Bonus: Certificate XP
    const certs = getEarnedCertificatesCount(stats);
    xp += certs * 100;
    
    stats.xp = xp;
  }

  // Get earned certificates count
  function getEarnedCertificatesCount(user) {
    let storedCerts = [];
    try {
      storedCerts = JSON.parse(localStorage.getItem(CERTIFICATES_KEY) || '[]');
    } catch(e) {}
    
    return storedCerts.length;
  }

  // Get earned certificates with details
  function getEarnedCertificatesWithDetails() {
    let storedCerts = [];
    try {
      storedCerts = JSON.parse(localStorage.getItem(CERTIFICATES_KEY) || '[]');
    } catch(e) {}
    
    // Sort by earned date (most recent first)
    return storedCerts.sort((a, b) => new Date(b.earnedDate) - new Date(a.earnedDate));
  }

  // Refresh leaderboard display
  function refreshLeaderboardDisplay() {
    const leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    const currentUser = syncUserStatsFromCompletion();
    const tbody = document.getElementById('leaderboard-body');

    if (!tbody) return;

    tbody.innerHTML = '';

    if (leaderboard.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <i class="fas fa-users"></i>
              <p>No leaderboard data yet. Complete lessons to appear on the leaderboard.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    leaderboard.forEach((user, index) => {
      const rank = index + 1;
      const isCurrentUser = user.username === currentUser.username;
      const completionRate = user.totalItems > 0
        ? ((user.totalCompleted / user.totalItems) * 100).toFixed(1)
        : 0;
      const certificatesCount = getEarnedCertificatesCount(user);

      let rankClass = '';
      if (rank === 1) rankClass = 'gold';
      else if (rank === 2) rankClass = 'silver';
      else if (rank === 3) rankClass = 'bronze';

      const row = document.createElement('tr');
      if (isCurrentUser) row.classList.add('current-user');

      row.innerHTML = `
        <td class="rank-cell ${rankClass}">#${rank}</td>
        <td>
          <div class="student-cell">
            <div class="student-avatar">${user.username[0].toUpperCase()}</div>
            <div class="student-info">
              <span class="student-name">${user.username}</span>
              ${isCurrentUser ? '<span class="student-tag">You</span>' : ''}
            </div>
          </div>
        </td>
        <td>${completionRate}%</td>
        <td>${user.currentStreak} days</td>
        <td>${user.xp.toLocaleString()}</td>
        <td class="badges-cell">
          ${generateBadges(user)}
        </td>
      `;

      tbody.appendChild(row);
    });

    updateUserStatsDisplay(currentUser, leaderboard);
  }

  // Generate badge elements based on user achievements
  function generateBadges(user) {
    const badges = [];
    const certs = getEarnedCertificatesCount(user);

    if (user.currentStreak >= 7) {
      badges.push('<span class="badge streak"><i class="fas fa-fire"></i> ' + user.currentStreak + ' Day Streak</span>');
    }
    if (user.xp >= 500) {
      badges.push('<span class="badge xp"><i class="fas fa-bolt"></i> ' + (user.xp >= 1000 ? '1K+' : '500+') + ' XP</span>');
    }
    if (certs > 0) {
      badges.push('<span class="badge certificate"><i class="fas fa-award"></i> ' + certs + ' Cert' + (certs > 1 ? 's' : '') + '</span>');
    }
    
    const weeklyCompleteCount = Object.values(user.weeklyProgress || {})
      .filter(w => w.completed === w.total && w.total > 0).length;
    if (weeklyCompleteCount >= 3) {
      badges.push('<span class="badge master"><i class="fas fa-star"></i> Week Master</span>');
    }

    return badges.length > 0 ? badges.join('') : '<span style="color: #6b7280;">—</span>';
  }

  // Update user stats display in the stat cards
  function updateUserStatsDisplay(user, leaderboard) {
    const rank = leaderboard.findIndex(u => u.username === user.username) + 1;
    const completionRate = user.totalItems > 0
      ? ((user.totalCompleted / user.totalItems) * 100).toFixed(1)
      : 0;
    const certificatesCount = getEarnedCertificatesCount(user);

    document.getElementById('user-rank').textContent = rank > 0 ? '#' + rank : '--';
    document.getElementById('user-streak').textContent = user.currentStreak;
    document.getElementById('user-xp').textContent = user.xp.toLocaleString();
    document.getElementById('user-completion').textContent = completionRate + '%';
    document.getElementById('completion-detail').textContent = user.totalCompleted + ' of ' + user.totalItems + ' items';
    document.getElementById('user-certificates').textContent = certificatesCount;

    // Show rank position context
    const rankChange = document.getElementById('rank-change');
    if (rank > 0 && leaderboard.length > 1) {
      rankChange.textContent = 'of ' + leaderboard.length + ' students';
    }
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
        case 'certificates':
          return getEarnedCertificatesCount(b) - getEarnedCertificatesCount(a);
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
    createCertificatesTimeline();
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
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Complete lessons to see your progress', canvas.width / 2, canvas.height / 2);
      return;
    }

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: weeks.map(w => 'Week ' + w),
        datasets: [{
          label: 'Completion',
          data: completionRates,
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#60a5fa',
          pointBorderColor: '#0a0a0a',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1f1f1f',
            titleColor: '#ffffff',
            bodyColor: '#e0e0e0',
            borderColor: '#2a2a2a',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return context.parsed.y.toFixed(1) + '% complete';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { 
              color: '#6b7280',
              font: { size: 11 },
              callback: function(value) {
                return value + '%';
              }
            },
            grid: { color: '#1f1f1f' }
          },
          x: {
            ticks: { 
              color: '#6b7280',
              font: { size: 11 }
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  // Create certificates timeline
  function createCertificatesTimeline() {
    const container = document.getElementById('quest-timeline');
    if (!container) return;

    const certificates = getEarnedCertificatesWithDetails();

    if (certificates.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-award"></i>
          <p>No certificates earned yet. Complete weeks to earn certificates!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = certificates.map(cert => {
      // Use skill name if available, otherwise use theme
      const displayName = cert.skill || cert.theme || 'Certificate Earned';
      
      return `
        <div class="timeline-item">
          <div class="timeline-dot certificate"></div>
          <div class="timeline-content">
            <div class="timeline-title">${displayName}</div>
            <div class="timeline-meta">${formatDate(new Date(cert.earnedDate))}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Format date for display
  function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return days + ' days ago';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Initialize page
  document.addEventListener('DOMContentLoaded', function() {
    // SYNC STATS FIRST before displaying anything
    syncUserStatsFromCompletion();
    
    refreshLeaderboardDisplay();
    initializeCharts();

    // Sort dropdown handler
    const sortSelect = document.getElementById('leaderboard-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        sortLeaderboard(this.value);
      });
    }

    // Add click listeners for sortable columns
    document.querySelectorAll('.leaderboard-table th.sortable').forEach(header => {
      header.addEventListener('click', function() {
        const sortBy = this.dataset.sort;
        sortLeaderboard(sortBy);
        
        // Update dropdown to match
        if (sortSelect) sortSelect.value = sortBy;
      });
    });
  });
</script>