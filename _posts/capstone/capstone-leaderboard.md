---
layout: post
title: Capstone Leaderboard
description: Top 10 most upvoted capstone projects
permalink: /capstone/leaderboard/
toc: false
tailwind: true
---

<link rel="stylesheet" href="/assets/css/upvote.css">
<link rel="stylesheet" href="/assets/css/trending-leaderboard.css">

<style>
.leaderboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.leaderboard-header {
    text-align: center;
    margin-bottom: 3rem;
}

.leaderboard-header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
}

.leaderboard-header p {
    color: #cbd5e1;
    font-size: 1.1rem;
}

.leaderboard-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.leaderboard-stat-card {
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 0.75rem;
    text-align: center;
}

.stat-value {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.leaderboard-table-wrapper {
    background: rgba(15, 23, 42, 0.4);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 0.75rem;
    overflow: hidden;
}

.empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #94a3b8;
}

.empty-state-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}
</style>

<div class="leaderboard-container">
    <div class="leaderboard-header">
        <h1>🏆 Capstone Leaderboard</h1>
        <p>Top 10 most upvoted capstone projects</p>
    </div>
    
    <div class="leaderboard-stats" id="leaderboard-stats">
        <!-- Populated by JavaScript -->
    </div>
    
    <div class="leaderboard-table-wrapper">
        <table class="capstone-leaderboard" id="leaderboard-table">
            <thead>
                <tr>
                    <th style="width: 10%">Rank</th>
                    <th>Project Title</th>
                    <th style="width: 20%; text-align: right;">Upvotes</th>
                </tr>
            </thead>
            <tbody id="leaderboard-tbody">
                <tr>
                    <td colspan="3" style="text-align: center; padding: 2rem; color: #64748b;">
                        Loading leaderboard...
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<script src="/assets/js/upvote-system.js"></script>
<script src="/assets/js/capstone-upvote-helper.js"></script>

<script>
(function() {
    const helper = new CapstoneProjectHelper({
        apiBase: window.javaURI ? window.javaURI + '/api/projects' : 'http://localhost:8585/api/projects',
        userId: null // Leaderboard is public
    });
    
    async function loadLeaderboard() {
        try {
            const projects = await helper.getLeaderboard(10);
            
            if (projects.length === 0) {
                document.getElementById('leaderboard-tbody').innerHTML = `
                    <tr>
                        <td colspan="3">
                            <div class="empty-state">
                                <div class="empty-state-icon">📊</div>
                                <p>No upvoted projects yet. Be the first to upvote!</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            
            // Calculate total likes
            const totalLikes = projects.reduce((sum, p) => sum + (p.likes || 0), 0);
            const avgLikes = projects.length > 0 ? Math.round(totalLikes / projects.length) : 0;
            
            // Update stats
            document.getElementById('leaderboard-stats').innerHTML = `
                <div class="leaderboard-stat-card">
                    <div class="stat-value">${projects.length}</div>
                    <div class="stat-label">Top Projects</div>
                </div>
                <div class="leaderboard-stat-card">
                    <div class="stat-value">${totalLikes}</div>
                    <div class="stat-label">Total Upvotes</div>
                </div>
                <div class="leaderboard-stat-card">
                    <div class="stat-value">${avgLikes}</div>
                    <div class="stat-label">Average Upvotes</div>
                </div>
            `;
            
            // Render table
            const tbody = document.getElementById('leaderboard-tbody');
            tbody.innerHTML = projects.map((project, index) => {
                const rankClass = index === 0 ? 'leaderboard-rank-1' : 
                                 index === 1 ? 'leaderboard-rank-2' : 
                                 index === 2 ? 'leaderboard-rank-3' : '';
                
                return `
                    <tr>
                        <td>
                            <div class="leaderboard-rank ${rankClass}">
                                ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                            </div>
                        </td>
                        <td class="leaderboard-title">${helper.escapeHtml(project.title)}</td>
                        <td style="text-align: right;">
                            <div class="leaderboard-likes">
                                <span class="leaderboard-likes-icon">👍</span>
                                <span class="leaderboard-likes-count">${project.likes || 0}</span>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
            
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            document.getElementById('leaderboard-tbody').innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; color: #ef4444; padding: 2rem;">
                        Failed to load leaderboard. Please try again later.
                    </td>
                </tr>
            `;
        }
    }
    
    // Load leaderboard on page load
    document.addEventListener('DOMContentLoaded', loadLeaderboard);
    
    // Auto-refresh leaderboard every 30 seconds
    setInterval(loadLeaderboard, 30000);
})();
</script>
