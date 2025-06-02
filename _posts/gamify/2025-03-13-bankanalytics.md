---
layout: fortunefindersBank
title: Bank Analytics
permalink: /gamify/bankanalytics
---

<style>
  :root {
    --primary-color: #ff9800;
    --background-color: #1f1f1f;
    --text-color: #ffffff;
    --chart-grid-color: rgba(255, 255, 255, 0.1);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .game-card {
    background-color: #2d2d2d;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .chart-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .chart-container {
    height: 400px;
    position: relative;
  }

  .game-title {
    color: var(--primary-color);
    border-left: 4px solid var(--primary-color);
    padding-left: 1rem;
    margin: 0 0 1.5rem 0;
  }

  .toggle-container {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .toggle-button {
    background: none;
    border: 1px solid currentColor;
    color: var(--text-color);
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s;
  } 

  .toggle-button.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    font-weight: bold;
  }

  .error-message {
    color: #ff6b6b;
    text-align: center;
    padding: 2rem;
  }

  .demo-warning {
    color: #ffd700;
    text-align: center;
    padding: 1rem;
    border: 1px solid #ffd700;
    border-radius: 4px;
    margin: 1rem 0;
  }

  .loading-message {
    color: var(--primary-color);
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
  }

  .user-info {
    background-color: #3d3d3d;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-left: 4px solid var(--primary-color);
  }

  .user-info h3 {
    color: var(--primary-color);
    margin: 0 0 0.5rem 0;
  }

  .user-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #555;
  }

  .stat-value {
    font-weight: bold;
  }

  .back-button {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    margin-bottom: 1rem;
    transition: background-color 0.3s;
  }

  .back-button:hover {
    background: #e68900;
    color: white;
    text-decoration: none;
  }
</style>

<div class="container">
  <h1 class="text-light">Game Analytics Dashboard</h1>

  <div id="loadingMessage" class="loading-message">
    Loading user data and analytics...
  </div>

  <div id="errorMessage" class="error-message" style="display: none;">
    Failed to load analytics data. Please check your connection and try again.
  </div>

  <div id="mainContent" style="display: none;">
    <div id="userInfo" class="user-info" style="display: none;">
      <h3 id="userName">User Analytics</h3>
      <div class="user-stats" id="userStats">
        <!-- User stats will be populated here -->
      </div>
    </div>
    <div class="game-card">
      <h2 class="game-title">Individual Game Analytics</h2>
      <div class="toggle-container" id="toggleButtons">
        <button class="toggle-button active" data-game="dice">Dice</button>
        <button class="toggle-button active" data-game="poker">Poker</button>
        <button class="toggle-button active" data-game="mines">Mines</button>
        <button class="toggle-button active" data-game="blackjack">Blackjack</button>
      </div>
      <div class="chart-container">
        <canvas id="combinedChart"></canvas>
      </div>
    </div>
    <div class="chart-grid">
      <div class="game-card">
        <h3 class="game-title">Dice</h3>
        <div class="chart-container">
          <canvas id="diceChart"></canvas>
        </div>
      </div>                  
      <div class="game-card">
        <h3 class="game-title">Poker</h3>
        <div class="chart-container">
          <canvas id="pokerChart"></canvas>
        </div>
      </div>
      <div class="game-card">
        <h3 class="game-title">Mines</h3>
        <div class="chart-container">
          <canvas id="minesChart"></canvas>
        </div>
      </div>
      <div class="game-card">
        <h3 class="game-title">Blackjack</h3>
        <div class="chart-container">
          <canvas id="blackjackChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</div>
<script src="{{site.baseurl}}/assets/js/api/config.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script type="module">
import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
/**
 * @fileoverview Bank Analytics Dashboard
 * 
 * This module provides a comprehensive analytics dashboard for tracking game performance
 * across multiple casino games including Dice, Poker, Mines, and Blackjack.
 * 
 * Features:
 * - Real-time data visualization using Chart.js
 * - Individual game performance tracking
 * - Combined analytics view with toggle functionality and timestamp-based visualization
 * - Responsive design with dark theme
 * - Dynamic data fetching from backend APIs
 * - URL parameter and session-based user identification
 * - User analytics display with risk assessment
 * - Enhanced chart visualization with visible data points from first transaction
 * 
 * @author Your Name
 * @version 1.1.0
 */
/**
 * Configuration object containing game-specific settings including colors,
 * labels, and API endpoints for data retrieval.
 * 
 * @constant {Object} gameConfig
 * @property {Object} dice - Dice game configuration
 * @property {Object} poker - Poker game configuration  
 * @property {Object} mines - Mines game configuration
 * @property {Object} blackjack - Blackjack game configuration
 */
const gameConfig = {
  'dice': { color: '#FFCE56', label: 'Dice', endpoint: '/profitmap/dice' },
  'poker': { color: '#FF6384', label: 'Poker', endpoint: '/profitmap/poker' },
  'mines': { color: '#9966FF', label: 'Mines', endpoint: '/profitmap/mines' },
  'blackjack': { color: '#4BC0C0', label: 'Blackjack', endpoint: '/profitmap/blackjack' }
};
/**
 * Global variable storing the current user's person ID
 * @type {number|null}
 */
let personId = null;
/**
 * Chart.js instance for the combined analytics view
 * @type {Chart|null}
 */
let combinedChart = null;
/**
 * Object containing Chart.js instances for individual game charts
 * @type {Object<string, Chart>}
 */
const individualCharts = {};
/**
 * Extracts person ID from URL parameters.
 * Supports direct linking to specific user analytics.
 * 
 * @function getPersonIdFromUrl
 * @returns {number|null} The person ID from URL parameters, or null if not found
 */
function getPersonIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramPersonId = urlParams.get('personId');
  console.log('PersonId from URL:', paramPersonId);
  return paramPersonId ? parseInt(paramPersonId, 10) : null;
}
/**
 * Fetches the current user's person ID from the backend API session.
 * This ID is required for all subsequent data requests when no URL parameter exists.
 * 
 * @async
 * @function fetchPersonIdFromSession
 * @returns {Promise<number>} The user's person ID from session
 * @throws {Error} When API request fails or response is invalid
 */
async function fetchPersonIdFromSession() {
  try {
    console.log('Fetching person ID from session...');
    const personResponse = await fetch(`${javaURI}/api/person/get`, fetchOptions);
    if (!personResponse.ok) {
      throw new Error(`Failed to fetch person data: ${personResponse.status} ${await personResponse.text()}`);
    }
    const personData = await personResponse.json();
    console.log('Person data from session:', personData);
    if (!personData.id) {
      throw new Error("Could not determine user ID from session");
    }
    return personData.id;
  } catch (error) {
    console.error('Error fetching person ID from session:', error);
    throw error;
  }
}
/**
 * Fetches comprehensive user analytics data including balance, loan info, and risk assessment.
 * 
 * @async
 * @function fetchUserAnalytics
 * @param {number} personId - The user's person ID
 * @returns {Promise<Object>} User analytics data object
 * @throws {Error} When API request fails or returns invalid data
 */
async function fetchUserAnalytics(personId) {
  try {
    console.log('Fetching user analytics for personId:', personId);
    const response = await fetch(`${javaURI}/bank/analytics/person/${personId}`, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch user analytics: ${response.status}`);
    }
    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error('Invalid analytics data received');
    }
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    throw error;
  }
}
/**
 * Displays user information and statistics in the dashboard header.
 * Shows balance, loan amount, interest rate, and risk category with color coding.
 * 
 * @function displayUserInfo
 * @param {Object} analyticsData - User analytics data from API
 * @param {string} analyticsData.username - User's display name
 * @param {number} analyticsData.userId - User's ID
 * @param {number} analyticsData.balance - Current account balance
 * @param {number} analyticsData.loanAmount - Outstanding loan amount
 * @param {number} analyticsData.dailyInterestRate - Daily interest rate percentage
 * @param {number} analyticsData.riskCategory - Risk category (0=low, 1=medium, 2=high)
 * @param {string} analyticsData.riskCategoryString - Human-readable risk category
 */
function displayUserInfo(analyticsData) {
  const userInfoDiv = document.getElementById('userInfo');
  const userNameElement = document.getElementById('userName');
  const userStatsElement = document.getElementById('userStats');
  const username = analyticsData.username || `User ${analyticsData.userId}`;
  userNameElement.textContent = `${username} - Analytics Dashboard`;
  /**
   * Returns appropriate color for risk category display.
   * 
   * @function getRiskColor
   * @param {number} riskCategory - Risk category (0, 1, or 2)
   * @returns {string} CSS color value
   */
  function getRiskColor(riskCategory) {
    switch(riskCategory) {
      case 0: return '#00ff7f'; // Low risk - green
      case 1: return '#ffcc00'; // Medium risk - yellow
      case 2: return '#ff6666'; // High risk - red
      default: return '#ffffff';
    }
  }
  userStatsElement.innerHTML = `
    <div class="stat-item">
      <span>Balance:</span>
      <span class="stat-value" style="color: #00ff7f;">$${Number(analyticsData.balance).toFixed(2)}</span>
    </div>
    <div class="stat-item">
      <span>Loan Amount:</span>
      <span class="stat-value" style="color: #ff6666;">$${Number(analyticsData.loanAmount).toFixed(2)}</span>
    </div>
    <div class="stat-item">
      <span>Daily Interest Rate:</span>
      <span class="stat-value" style="color: #ffcc00;">${Number(analyticsData.dailyInterestRate).toFixed(2)}%</span>
    </div>
    <div class="stat-item">
      <span>Risk Category:</span>
      <span class="stat-value" style="color: ${getRiskColor(analyticsData.riskCategory)};">${analyticsData.riskCategoryString}</span>
    </div>
  `;
  userInfoDiv.style.display = 'block';
}
/**
 * Processes raw transaction data into chart-ready format.
 * Sorts transactions chronologically and calculates running totals.
 * 
 * @function processTransactions
 * @param {Array<Array>} transactions - Array of [timestamp, amount] pairs
 * @returns {Object} Processed data object containing labels, values, and running totals
 * @returns {Array<string>} returns.labels - Time-formatted labels for chart x-axis
 * @returns {Array<number>} returns.values - Individual transaction amounts
 * @returns {Array<number>} returns.runningTotal - Cumulative sum of all transactions
 */
function processTransactions(transactions) {
  console.log('Processing transactions:', transactions);
  if (!transactions || transactions.length === 0) {
    console.log('No transactions found');
    return { labels: [], values: [], runningTotal: [] };
  }
  // Sort transactions by timestamp
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateA - dateB;
  });
  const labels = [];
  const values = [];
  const runningTotal = [];
  let total = 0;
  sortedTransactions.forEach(([timestamp, amount]) => {
    const date = new Date(timestamp);
    const timeLabel = date.toLocaleTimeString();
    console.log('Processing:', timeLabel, amount);
    labels.push(timeLabel);
    values.push(Number(amount));
    total += Number(amount);
    runningTotal.push(total);
  });
  console.log('Processed data:', { labels, values, runningTotal });
  return { labels, values, runningTotal };
}
/**
 * Creates a Chart.js line chart for an individual game.
 * Displays the running total of profits/losses over time.
 * 
 * @function createChart
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
 * @param {string} game - Game identifier (dice, poker, mines, blackjack)
 * @param {Object} data - Processed transaction data from processTransactions()
 * @returns {Chart} Chart.js instance for the created chart
 */
function createChart(ctx, game, data) {
  if (individualCharts[game]) {
    individualCharts[game].destroy();
  }
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: `${gameConfig[game].label} Running Total`,
        data: data.runningTotal,
        borderColor: gameConfig[game].color,
        backgroundColor: `${gameConfig[game].color}20`,
        tension: 0.2,
        fill: true                          
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#ffffff20' },
          ticks: { color: '#fff' }
        },             
        x: {             
          grid: { color: '#ffffff10' },             
          ticks: { color: '#fff' }             
        }
      },             
      plugins: {             
        legend: { labels: { color: '#fff' } }             
      }
    }             
  });                          
}
/**
 * Creates a combined chart showing all games' performance on a unified timeline.
 * Modified to show lines from the first data point using timestamp-based visualization,
 * ensuring that single-day data is properly displayed with visible chart lines.
 * 
 * @function createCombinedChart
 * @param {Object<string, Array>} gameData - Object containing processed data for each game
 * @param {Array<Array>} gameData[game] - Array of [timestamp, amount] pairs for each game
 */
function createCombinedChart(gameData) {
  const ctx = document.getElementById('combinedChart').getContext('2d');
  if (combinedChart) {
    combinedChart.destroy();
  }
  // Create a unified timestamp set for proper spacing
  const timestampSet = new Set();
  // Collect all unique timestamps from all games
  Object.entries(gameData).forEach(([game, rawData]) => {
    if (rawData && rawData.length > 0) {
      rawData.forEach(([timestamp]) => {
        timestampSet.add(timestamp);
      });
    }
  });
  // Sort timestamps chronologically
  const sortedTimestamps = Array.from(timestampSet).sort((a, b) => new Date(a) - new Date(b));
  // Create readable labels from timestamps
  const sortedLabels = sortedTimestamps.map(timestamp => {
    const date = new Date(timestamp);
    // Use both date and time for better granularity
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  });
  const datasets = [];
  // Process each game's data
  Object.entries(gameData).forEach(([game, rawData]) => {
    if (!rawData || rawData.length === 0) {
      // Create empty dataset for games with no data
      datasets.push({
        label: gameConfig[game].label,
        data: new Array(sortedTimestamps.length).fill(null),
        borderColor: gameConfig[game].color,
        backgroundColor: `${gameConfig[game].color}30`,
        tension: 0.2,
        fill: false,
        spanGaps: true,
        hidden: false,
        pointRadius: 4,
        pointHoverRadius: 6
      });
      return;
    }
    // Create timestamp balance map
    const timestampBalanceMap = {};
    let cumulativeBalance = 0;
    // Sort transactions by timestamp
    const sortedTransactions = [...rawData].sort((a, b) => new Date(a[0]) - new Date(b[0]));
    // Calculate cumulative balance for each timestamp
    sortedTransactions.forEach(([timestamp, amount]) => {
      const value = parseFloat(amount) || 0;
      cumulativeBalance += value;
      timestampBalanceMap[timestamp] = cumulativeBalance;
    });
    // Map sorted timestamps to their corresponding balance values
    const dataPoints = sortedTimestamps.map(timestamp => {
      if (timestampBalanceMap.hasOwnProperty(timestamp)) {
        return timestampBalanceMap[timestamp];
      }
      // For timestamps without data, use the previous cumulative balance or null
      const prevTimestamp = sortedTimestamps.find(ts => 
        new Date(ts) < new Date(timestamp) && timestampBalanceMap.hasOwnProperty(ts)
      );
      return prevTimestamp ? timestampBalanceMap[prevTimestamp] : null;
    });
    datasets.push({
      label: gameConfig[game].label,
      data: dataPoints,
      borderColor: gameConfig[game].color,
      backgroundColor: `${gameConfig[game].color}30`,
      tension: 0.2,
      fill: false,
      spanGaps: true,
      hidden: false,
      pointRadius: 4,
      pointHoverRadius: 6
    });
  });
  combinedChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sortedLabels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { 
          beginAtZero: true, 
          grid: { color: '#ffffff20' }, 
          ticks: { color: '#fff' } 
        },
        x: { 
          grid: { color: '#ffffff10' }, 
          ticks: { 
            color: '#fff',
            maxTicksLimit: 8, // Limit number of x-axis labels for better readability
            maxRotation: 45,
            minRotation: 0
          } 
        }
      },
      plugins: { 
        legend: { labels: { color: '#fff' } },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: function(tooltipItems) {
              return tooltipItems[0].label;
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      elements: {
        line: {
          borderWidth: 2
        },
        point: {
          radius: 4,
          hoverRadius: 6
        }
      }
    }
  });
}
/**
 * Fetches game transaction data from backend APIs for all configured games.
 * Uses the current user's person ID to retrieve personalized data.
 * 
 * @async
 * @function fetchGameData
 * @returns {Promise<Object<string, Array>>} Object containing transaction arrays for each game
 * @throws {Error} When person ID is not available or API requests fail
 */
async function fetchGameData() {
  if (!personId) {
    throw new Error('Person ID not available');
  }
  const gameData = {};
  try {
    // Fetch data for each game using dynamic user ID
    for (const [game, config] of Object.entries(gameConfig)) {
      const endpoint = `${javaURI}/bank/${personId}${config.endpoint}`;
      console.log(`Fetching data for ${game} from ${endpoint}`);
      try {
        const response = await fetch(endpoint, fetchOptions);
        if (response.ok) {
          const data = await response.json();
          console.log(`Data for ${game}:`, data);
          gameData[game] = data;
        } else {
          console.warn(`Failed to fetch ${game} data: HTTP ${response.status}`);
          gameData[game] = [];
        }
      } catch (error) {
        console.error(`Error fetching ${game} data:`, error);
        gameData[game] = [];
      }
    }
    console.log('All game data:', gameData);
    return gameData;
  } catch (error) {
    console.error('Error in fetchGameData:', error);
    throw error;
  }
}
/**
 * Main data loading function that orchestrates the entire data fetching and chart creation process.
 * Fetches user ID, retrieves user analytics and game data, processes transactions, and creates all charts.
 * 
 * @async
 * @function loadData
 * @returns {Promise<Object>} Processed game data used for chart creation
 * @throws {Error} When any step in the data loading process fails
 */
async function loadData() {
  try {
    // First try to get personId from URL, then from session
    personId = getPersonIdFromUrl();
    if (!personId) {
      console.log('No personId in URL, fetching from session...');
      personId = await fetchPersonIdFromSession();
    }
    console.log('Using personId:', personId);
    // Fetch user analytics data to display user info
    const analyticsData = await fetchUserAnalytics(personId);
    displayUserInfo(analyticsData);
    // Then fetch game data using the person ID
    const rawGameData = await fetchGameData();
    // Process data for each game
    const processedGameData = {};
    Object.keys(gameConfig).forEach(game => {
      const rawData = rawGameData[game] || [];
      console.log(`Processing ${game} data:`, rawData);
      processedGameData[game] = processTransactions(rawData);
      // Create individual chart
      const ctx = document.getElementById(`${game}Chart`)?.getContext('2d');
      if (ctx) {
        console.log(`Creating chart for ${game}`);
        individualCharts[game] = createChart(ctx, game, processedGameData[game]);
      }
    });
    // Create combined chart with raw data for better timestamp-based handling
    createCombinedChart(rawGameData);
    return processedGameData;
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}
/**
 * Shows the main dashboard content and hides loading/error messages.
 * Called when data loading completes successfully.
 * 
 * @function showMainContent
 */
function showMainContent() {
  document.getElementById('loadingMessage').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';
}
/**
 * Shows the error message and hides other UI elements.
 * Called when data loading fails.
 * 
 * @function showError
 */
function showError() {
  document.getElementById('loadingMessage').style.display = 'none';
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'block';
}
/**
 * Main initialization function that sets up the dashboard when the DOM is ready.
 * Loads data, creates charts, and sets up event listeners for interactive elements.
 * 
 * @async
 * @function init
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Initializing analytics dashboard...');   
    const processedData = await loadData();
    // Show main content
    showMainContent();
    /**
     * Event handler for toggle buttons in the combined chart.
     * Allows users to show/hide individual game datasets.
     * 
     * @param {Event} e - Click event from toggle button
     */
    document.querySelectorAll('.toggle-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const game = e.target.dataset.game;
        const isActive = e.target.classList.contains('active');
        e.target.classList.toggle('active', !isActive);                             
        if (combinedChart) {
          const dataset = combinedChart.data.datasets
            .find(d => d.label === gameConfig[game].label);
          if (dataset) {
            dataset.hidden = isActive;
            combinedChart.update();
          }
        }
      });
    });
    console.log('Analytics dashboard initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
    showError();
  }
});
</script>