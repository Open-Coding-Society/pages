---
layout: fortunefinders
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

// Game configuration
const gameConfig = {
  'dice': { color: '#FFCE56', label: 'Dice', endpoint: '/profitmap/dice' },
  'poker': { color: '#FF6384', label: 'Poker', endpoint: '/profitmap/poker' },
  'mines': { color: '#9966FF', label: 'Mines', endpoint: '/profitmap/mines' },
  'blackjack': { color: '#4BC0C0', label: 'Blackjack', endpoint: '/profitmap/blackjack' }
};

// Global variables
let personId = null;
let combinedChart = null;
const individualCharts = {};

// Get user ID from session
async function fetchPersonId() {
  try {
    console.log('Fetching person ID...');
    const personResponse = await fetch(`${javaURI}/api/person/get`, fetchOptions);
    
    if (!personResponse.ok) {
      throw new Error(`Failed to fetch person data: ${personResponse.status} ${await personResponse.text()}`);
    }
    
    const personData = await personResponse.json();
    console.log('Person data:', personData);
    
    if (!personData.id) {
      throw new Error("Could not determine user ID from response");
    }
    
    personId = personData.id;
    console.log('Person ID:', personId);
    return personId;
  } catch (error) {
    console.error('Error fetching person ID:', error);
    throw error;
  }
}

// Data processing for individual games
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

// Create individual game chart
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

// Combined chart             
function createCombinedChart(gameData) {             
  const ctx = document.getElementById('combinedChart').getContext('2d');
  
  if (combinedChart) {
    combinedChart.destroy();
  }
  
  const datasets = [];
  let longestLabels = [];
  
  Object.entries(gameData).forEach(([game, data]) => {
    if (data.labels.length > longestLabels.length) {
      longestLabels = data.labels;
    }
    
    datasets.push({
      label: gameConfig[game].label,
      data: data.runningTotal,
      borderColor: gameConfig[game].color,
      backgroundColor: `${gameConfig[game].color}20`,
      tension: 0.2,
      hidden: false
    });
  });
                          
  combinedChart = new Chart(ctx, {
    type: 'line',       
    data: {
      labels: longestLabels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,             
      scales: {                          
        y: { beginAtZero: true, grid: { color: '#ffffff20' }, ticks: { color: '#fff' } },
        x: { grid: { color: '#ffffff10' }, ticks: { color: '#fff' } }
      },
      plugins: { legend: { labels: { color: '#fff' } } }
    }
  });
}

// Fetch game data from endpoints
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

// Data loading
async function loadData() {
  try {
    // First get the person ID
    await fetchPersonId();
    
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

    // Create combined chart
    createCombinedChart(processedGameData);

    return processedGameData;
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}

// Show/hide UI elements
function showMainContent() {
  document.getElementById('loadingMessage').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';
}

function showError() {
  document.getElementById('loadingMessage').style.display = 'none';
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'block';
}

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Initializing analytics dashboard...');
    
    const processedData = await loadData();
    
    // Show main content
    showMainContent();

    // Toggle functionality for combined chart
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