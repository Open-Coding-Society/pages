---
layout: fortunefindersBank
permalink: /leaderboard/overall-leaderboard
title: Leaderboard
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaderboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        /* General Styles */
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #121212;
            color: #ffffff;
            margin: 0;
            padding: 0;
        }

        /* Navigation Bar */
        .navbar {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 15px 0;
            background-color: #1c1c1c;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .nav-buttons {
            display: flex;
            gap: 15px;
        }

        .nav-buttons a {
            color: #ffffff;
            text-decoration: none;
            font-size: 16px;
            padding: 10px 20px;
            border-radius: 6px;
            transition: 0.3s;
        }

        .nav-buttons a:hover {
            background-color: #ff9800;
            transform: scale(1.1);
        }

        /* Leaderboard Container */
        .dashboard {
            padding: 40px;
            text-align: center;
        }

        /* Title Styling */
        .leaderboard-title {
            font-size: 32px;
            font-weight: bold;
            text-transform: uppercase;
            background: linear-gradient(90deg, #ff8c00, #ff22a6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
            padding-bottom: 10px;
            border-bottom: 3px solid #ff22a6;
            letter-spacing: 2px;
            margin-bottom: 20px;
        }

        /* Search Box Styling */
        .search-container {
            max-width: 800px;
            margin: 0 auto 25px;
            position: relative;
        }

        #leaderboard-search {
            width: 100%;
            padding: 12px 20px;
            border-radius: 6px;
            border: 2px solid #ff9800;
            background-color: #2a2a2a;
            color: white;
            font-size: 16px;
            transition: all 0.3s;
        }

        #leaderboard-search:focus {
            outline: none;
            box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
            border-color: #ffcc00;
        }

        /* Leaderboard Table */
        .leaderboard-table {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            border-collapse: collapse;
            background: #1f1f1f;
            border-radius: 8px;
            box-shadow: 0px 0px 15px rgba(255, 136, 0, 0.5);
            overflow: hidden;
        }

        th, td {
            padding: 15px 20px;
            text-align: left;
        }

        th {
            background-color: #ff9800;
            color: #000;
            font-size: 18px;
            text-transform: uppercase;
        }

        td {
            background-color: #2a2a2a;
            font-size: 16px;
            border-bottom: 1px solid #444;
            transition: background 0.3s;
        }

        tr:hover td {
            background-color: #ff22a6;
            color: #ffffff;
        }

        /* Cell Specific Styling */
        .rank {
            font-weight: bold;
            color: #ffcc00;
        }

        .balance {
            color: #00ff7f;
            font-weight: bold;
        }

        .name {
            font-weight: bold;
            color: #ffffff;
            cursor: pointer;
            text-decoration: underline;
            transition: color 0.2s;
            position: relative;
        }

        .name:hover {
            color: #ff9800;
        }

        .name::after {
            content: ' 📊';
            font-size: 14px;
            opacity: 0.7;
        }

        /* Click indicator */
        .user-row {
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .user-row:hover {
            transform: translateX(5px);
            box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
        }

        /* Loading and Error States */
        .loading-message, .error-message {
            text-align: center;
            padding: 20px;
            font-style: italic;
        }

        .loading-message {
            color: #ff9800;
        }

        .error-message {
            color: #ff4444;
        }

        .no-results {
            text-align: center;
            color: #ff9800;
            padding: 20px;
            font-style: italic;
        }

        /* Loading Animation */
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid #ff9800;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }

        /* Analytics Tooltip */
        .analytics-tooltip {
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .analytics-tooltip.show {
            opacity: 1;
        }

        /* Quick preview on hover */
        .user-preview {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2a2a2a;
            border: 2px solid #ff9800;
            border-radius: 8px;
            padding: 20px;
            z-index: 1001;
            display: none;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .user-preview h3 {
            margin-top: 0;
            color: #ff9800;
        }

        .preview-stat {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 4px 0;
            border-bottom: 1px solid #444;
        }

        .preview-stat:last-child {
            border-bottom: none;
        }
    </style>
</head>
<body>
    <!-- Dashboard -->
    <div class="dashboard">
        <h1 class="leaderboard-title">Banking Leaderboard</h1>
        
        <!-- Search Box -->
        <div class="search-container">
            <input type="text" id="leaderboard-search" placeholder="Search by username..." aria-label="Search users">
            <div id="search-status"></div>
        </div>
        
        <!-- Instructions -->
        <p style="color: #ff9800; margin-bottom: 30px; font-style: italic;">
            Click on any username to view their detailed analytics and profit graphs 📊
        </p>
        
        <!-- Leaderboard Table -->
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Balance</th>
                    <th>Username</th>
                    <th>Risk Level</th>
                </tr>
            </thead>
            <tbody id="top-users-table">
                <tr>
                    <td colspan="4" class="loading-message">
                        <div class="loading-spinner"></div>
                        Loading leaderboard data...
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Analytics tooltip -->
    <div id="analytics-tooltip" class="analytics-tooltip"></div>

    <!-- User preview popup -->
    <div id="user-preview" class="user-preview">
        <h3 id="preview-username"></h3>
        <div id="preview-content"></div>
        <p style="margin-top: 15px; font-size: 12px; color: #ccc; text-align: center;">
            Click to view full analytics
        </p>
    </div>

    <script type="module">
        import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

        // Global variables for user data storage
        let userAnalyticsCache = new Map();

        // Debounce function to limit API calls during typing
        function debounce(func, wait) {
            let timeout;
            return function() {
                const context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
            };
        }

        // Display loading state
        function showLoading() {
            $('#top-users-table').html(`
                <tr>
                    <td colspan="4" class="loading-message">
                        <div class="loading-spinner"></div>
                        Loading data...
                    </td>
                </tr>
            `);
        }

        // Fetch user analytics data for preview
        async function fetchUserAnalytics(userId) {
            if (userAnalyticsCache.has(userId)) {
                return userAnalyticsCache.get(userId);
            }

            try {
                const response = await fetch(`${javaURI}/bank/analytics/${userId}`, fetchOptions);
                if (!response.ok) throw new Error(`Failed to fetch analytics`);
                
                const result = await response.json();
                if (result.success && result.data) {
                    userAnalyticsCache.set(userId, result.data);
                    return result.data;
                }
            } catch (error) {
                console.error("Error fetching user analytics:", error);
            }
            return null;
        }

        // Show user preview popup
        async function showUserPreview(userId, event) {
            const analytics = await fetchUserAnalytics(userId);
            if (!analytics) return;

            const preview = $('#user-preview');
            const username = analytics.username || `User ${userId}`;
            $('#preview-username').text(username);

            const content = `
                <div class="preview-stat">
                    <span>Balance:</span>
                    <span style="color: #00ff7f;">$${Number(analytics.balance).toFixed(2)}</span>
                </div>
                <div class="preview-stat">
                    <span>Loan Amount:</span>
                    <span style="color: #ff6666;">$${Number(analytics.loanAmount).toFixed(2)}</span>
                </div>
                <div class="preview-stat">
                    <span>Interest Rate:</span>
                    <span style="color: #ffcc00;">${Number(analytics.dailyInterestRate).toFixed(2)}%</span>
                </div>
                <div class="preview-stat">
                    <span>Risk Category:</span>
                    <span style="color: ${getRiskColor(analytics.riskCategory)};">${analytics.riskCategoryString}</span>
                </div>
                <div class="preview-stat">
                    <span>Activities:</span>
                    <span>${getActivityCount(analytics.profitMap)} recorded</span>
                </div>
            `;

            $('#preview-content').html(content);
            preview.show();

            // Hide preview after 3 seconds or when mouse leaves
            setTimeout(() => preview.hide(), 3000);
        }

        // Get risk category color
        function getRiskColor(riskCategory) {
            switch(riskCategory) {
                case 0: return '#00ff7f'; // Low risk - green
                case 1: return '#ffcc00'; // Medium risk - yellow
                case 2: return '#ff6666'; // High risk - red
                default: return '#ffffff';
            }
        }

        // Get total activity count
        function getActivityCount(profitMap) {
            if (!profitMap) return 0;
            let total = 0;
            Object.values(profitMap).forEach(activities => {
                total += activities.length;
            });
            return total;
        }

        // Redirect to bank analytics page with personId
        function redirectToAnalytics(personId) {
            // Show loading indicator
            const $row = $(event.target).closest('tr');
            $row.css('opacity', '0.7');

            // Add loading text
            const originalContent = $row.find('.name').html();
            $row.find('.name').html('Loading analytics...');

            // Redirect with personId parameter
            setTimeout(() => {
                window.location.href = `{{site.baseurl}}/gamify/bankanalytics?personId=${personId}`;
            }, 500);
        }

        // Enhanced leaderboard fetch with analytics preview data
        async function fetchLeaderboard(searchQuery = '') {
            showLoading();

            try {
                let url = `${javaURI}/bank/leaderboard`;
                if (searchQuery) {
                    url = `${javaURI}/bank/leaderboard/search?query=${encodeURIComponent(searchQuery)}`;
                    $('#search-status').html(`<small>Searching for: "${searchQuery}"</small>`).css('color', '#ff9800');
                } else {
                    $('#search-status').empty();
                }

                const response = await fetch(url, fetchOptions);
                if (!response.ok) throw new Error(`Server responded with status ${response.status}`);

                const result = await response.json();
                if (!result.success || !result.data) {
                    throw new Error("Invalid data format received from server");
                }

                const $topUsersTable = $('#top-users-table');
                $topUsersTable.empty();

                if (result.data.length === 0) {
                    $topUsersTable.append(`
                        <tr>
                            <td colspan="4" class="no-results">
                                No users found matching "${searchQuery}"
                            </td>
                        </tr>
                    `);
                    return;
                }

                // Fetch analytics for all users to show risk levels and get personId
                for (const entry of result.data) {
                    const displayName = entry.username && entry.username !== "undefined" 
                        ? entry.username 
                        : `User ${entry.userId}`;

                    // Try to get cached analytics or fetch it
                    let riskInfo = 'Loading...';
                    let personId = null;
                    try {
                        const analytics = await fetchUserAnalytics(entry.userId);
                        if (analytics) {
                            riskInfo = `<span style="color: ${getRiskColor(analytics.riskCategory)};">${analytics.riskCategoryString}</span>`;
                            personId = analytics.personId; // Get the personId from analytics
                        }
                    } catch (e) {
                        riskInfo = 'N/A';
                    }

                    // Use personId if available, otherwise fallback to userId
                    const idForRedirect = personId || entry.userId;

                    const row = `
                        <tr class="user-row" 
                            onclick="redirectToAnalytics(${idForRedirect})" 
                            onmouseenter="showUserPreview(${entry.userId}, event)" 
                            onmouseleave="$('#user-preview').hide()" 
                            title="Click to view ${displayName}'s detailed analytics">
                            <td class="rank">${entry.rank}</td>
                            <td class="balance">$${Number(entry.balance).toFixed(2)}</td>
                            <td class="name">${displayName}</td>
                            <td>${riskInfo}</td>
                        </tr>
                    `;
                    $topUsersTable.append(row);
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
                $('#top-users-table').html(`
                    <tr>
                        <td colspan="4" class="error-message">
                            Error loading data: ${error.message}
                        </td>
                    </tr>
                `);
            }
        }

        // Initialize when DOM is ready
        $(document).ready(function() {
            // Initial load
            fetchLeaderboard();

            // Search functionality with debounce (350ms delay)
            $('#leaderboard-search').on('input', debounce(function() {
                const searchQuery = $(this).val().trim();
                fetchLeaderboard(searchQuery);
            }, 350));

            // Clear search when clicking 'x' in search field (IE/Edge support)
            $('#leaderboard-search').on('search', function() {
                if ($(this).val() === '') {
                    fetchLeaderboard();
                }
            });

            // Hide preview when clicking outside
            $(document).on('click', function(event) {
                if (!$(event.target).closest('#user-preview, .user-row').length) {
                    $('#user-preview').hide();
                }
            });

            // Make functions available globally
            window.redirectToAnalytics = redirectToAnalytics;
            window.showUserPreview = showUserPreview;
            window.fetchUserAnalytics = fetchUserAnalytics;
        });
    </script>
</body>
</html>