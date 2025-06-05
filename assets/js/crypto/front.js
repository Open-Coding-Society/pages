import { login, pythonURI, javaURI, fetchOptions } from '../api/config.js';
import audioManager from './audio.js';

console.log("front.js is loaded.");

let userEmail = "";
let userBalance = localStorage.getItem("userBalance");
let isOnline = navigator.onLine; // Add online status check
let updateInterval;
let monitorInterval;

// Define showNotification globally at the top of your script
window.showNotification = function (message, isError = false) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${isError ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded shadow-lg`;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
};

async function fetchUser() {
  console.log("Attempting to fetch user...");
  try {
    const response = await fetch(javaURI + `/api/person/get`, fetchOptions);
    console.log("User fetch response status:", response.status);
    if (response.ok) {
      const userInfo = await response.json();
      userEmail = userInfo.email;
      console.log("Successfully fetched user email:", userEmail);
      localStorage.setItem("userEmail", userEmail);
      fetchUserBalance(); // Fetch balance after getting the email
    } else if (response.status === 401 || response.status === 201) {
      console.log("Guest user detected");
      document.getElementById('user-balance').innerText = "0.00";
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

function updateBalance(balance) {
  const formattedBalance = parseFloat(balance).toFixed(2);
  const balanceElement = document.getElementById('user-balance');
  if (balanceElement) {
    balanceElement.innerText = formattedBalance;
    localStorage.setItem("userBalance", formattedBalance);
  }
}

async function fetchUserBalance() {
  console.log("Attempting to fetch balance for email:", userEmail);
  if (!userEmail) {
    console.error("User email not found, skipping balance fetch.");
    return;
  }
  try {
    const balanceUrl = `${javaURI}/api/mining/mining-status`;
    console.log("Fetching balance from:", balanceUrl);
    const response = await fetch(balanceUrl, fetchOptions);
    console.log("Balance fetch response status:", response.status);
    if (!response.ok) throw new Error(`Failed to fetch balance: ${response.status}`);
    const balanceData = await response.json();
    console.log("Received balance data:", balanceData);
    updateBalance(balanceData.userBalance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    document.getElementById('user-balance').innerText = "Error";
  }
}

// Update balance every 15 minutes
setInterval(fetchUserBalance, 900000);

// Initial fetch
fetchUser();

// Make functions globally available
window.openActiveGPUsModal = function () {
  const modal = document.getElementById('active-gpus-modal');
  modal.classList.remove('hidden');
  updateActiveGPUsList();
};

window.closeActiveGPUsModal = function () {
  const modal = document.getElementById('active-gpus-modal');
  modal.classList.add('hidden');
};

function updateActiveGPUsList() {
  const container = document.getElementById('active-gpus-list');
  container.innerHTML = '';
  if (!window.stats || !window.stats.gpus) {
    container.innerHTML = '<p class="text-gray-400 text-center">No active GPUs found</p>';
    return;
  }

  const gpuGroups = {};
  window.stats.gpus.forEach(gpu => {
    if (gpu.isActive) {
      if (!gpuGroups[gpu.id]) {
        gpuGroups[gpu.id] = {
          ...gpu,
          quantity: gpu.quantity || 0,
          hashrate: gpu.hashrate || 0,
          power: gpu.power || 0,
          temp: gpu.temp || 0
        };
      }
    }
  });

  if (Object.keys(gpuGroups).length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center">No active GPUs found</p>';
    return;
  }

  Object.values(gpuGroups).forEach(gpu => {
    const card = document.createElement('div');
    card.className = 'gpu-card';
    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-blue-400">${gpu.name || 'Unknown GPU'}</h3>
            <span class="text-green-400 text-lg font-bold">x${gpu.quantity}</span>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-gray-400 mb-2">Performance (Per GPU)</p>
              <div class="space-y-2">
                <p class="text-white">⚡ ${gpu.hashrate.toFixed(2)} MH/s</p>
                <p class="text-white">🔌 ${gpu.power}W</p>
                <p class="text-white">🌡️ ${gpu.temp}°C</p>
                <p class="text-white">📊 ${(gpu.hashrate / gpu.power).toFixed(3)} MH/W</p>
              </div>
            </div>
            <div>
              <p class="text-gray-400 mb-2">Total Output</p>
              <div class="space-y-2">
                <p class="text-white">⚡ ${(gpu.hashrate * gpu.quantity).toFixed(2)} MH/s</p>
                <p class="text-white">🔌 ${gpu.power * gpu.quantity}W</p>
                <p class="text-emerald-400">✅ All Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

let countdownInterval;
let miningTimeLeft = 900; // 15 minutes in seconds

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startCountdown() {
    const countdownElement = document.getElementById('mining-countdown');
    const timerElement = document.getElementById('countdown-timer');
    const miningButton = document.getElementById('start-mining');
    
    // Check if mining is actually active before starting countdown
    fetchWithRetry(`${javaURI}/api/mining/state`, fetchOptions)
        .then(state => {
            if (!state.isMining) {
                stopCountdown();
                return;
            }
            
            countdownElement.classList.remove('hidden');
            countdownElement.classList.add('visible');
            miningButton.classList.add('loading');
            
            // Get the actual time left from the server if available
            const serverTimeLeft = state.timeLeft || 900;
            miningTimeLeft = serverTimeLeft;
            timerElement.textContent = formatTime(miningTimeLeft);
            
            if (countdownInterval) clearInterval(countdownInterval);
            
            countdownInterval = setInterval(async () => {
                miningTimeLeft--;
                timerElement.textContent = formatTime(miningTimeLeft);
                
                if (miningTimeLeft <= 0) {
                    clearInterval(countdownInterval);
                    try {
                        // Check mining state before restarting
                        const state = await fetchWithRetry(`${javaURI}/api/mining/state`, fetchOptions);
                        if (state.isMining) {
                            await updateMiningStats();
                            startCountdown(); // Only restart if still mining
                        } else {
                            stopCountdown();
                        }
                    } catch (error) {
                        console.error('Error checking mining state:', error);
                        stopCountdown();
                    }
                }
            }, 1000);
        })
        .catch(error => {
            console.error('Error checking mining state:', error);
            stopCountdown();
        });
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    const countdownElement = document.getElementById('mining-countdown');
    const miningButton = document.getElementById('start-mining');
    
    countdownElement.classList.remove('visible');
    countdownElement.classList.add('hidden');
    miningButton.classList.remove('loading');
}

// Add periodic state sync
let stateSyncInterval;

function startStateSync() {
    if (stateSyncInterval) clearInterval(stateSyncInterval);
    stateSyncInterval = setInterval(async () => {
        try {
            const state = await fetchWithRetry(`${javaURI}/api/mining/state`, fetchOptions);
            if (!state.isMining && countdownInterval) {
                stopCountdown();
            }
        } catch (error) {
            console.error('Error syncing state:', error);
        }
    }, 900000); // Sync every 15 min
}

function stopStateSync() {
    if (stateSyncInterval) {
        clearInterval(stateSyncInterval);
        stateSyncInterval = null;
    }
}

// Update the startPeriodicUpdates function
async function startPeriodicUpdates() {
    if (!isOnline) {
        showNotification('No internet connection', true);
        return;
    }
    
    // Clear any existing intervals
    if (updateInterval) clearInterval(updateInterval);
    if (monitorInterval) clearInterval(monitorInterval);
    
    // Start state sync
    startStateSync();
    
    // Update stats every 15 minutes
    updateInterval = setInterval(async () => {
        if (isOnline) {
            await updateMiningStats();
        }
    }, 900000);
    
    // Real-time monitoring every 30 seconds
    monitorInterval = setInterval(async () => {
        if (!isOnline) return;
        
        try {
            const stats = await fetchWithRetry(`${javaURI}/api/mining/stats`, {
                ...fetchOptions,
                method: 'GET',
                cache: 'no-cache'
            });
            
            // Update critical UI elements
            if (stats.hashrate !== undefined) {
                document.getElementById('hashrate').textContent = `${parseFloat(stats.hashrate).toFixed(2)} MH/s`;
            }
            if (stats.shares !== undefined) {
                document.getElementById('shares').textContent = stats.shares;
            }
            if (stats.pendingBalance !== undefined) {
                document.getElementById('pending-balance').textContent = parseFloat(stats.pendingBalance).toFixed(8);
            }
            
            // Update charts
            updateCharts(stats);
        } catch (error) {
            console.error('Real-time monitor error:', error);
        }
    }, 900000); // update chart every 15 min
}

// Update the stopPeriodicUpdates function
function stopPeriodicUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
    stopStateSync();
}

// Update the toggleMining function with better error handling
window.toggleMining = async function () {
    try {
        const button = document.getElementById('start-mining');
        button.disabled = true;
        
        const options = {
            ...fetchOptions,
            method: 'POST',
            cache: 'no-cache'
        };
        
        const result = await fetchWithRetry(`${javaURI}/api/mining/toggle`, options);
        
        updateMiningButton(result.isMining);
        if (result.isMining) {
            startPeriodicUpdates();
            startCountdown();
            audioManager.play('miningStart');
            audioManager.toggleBGM(); // Start BGM when mining starts
        } else {
            stopPeriodicUpdates();
            stopCountdown();
            audioManager.play('miningStop');
            audioManager.stopAll(); // Stop BGM when mining stops
        }
        
        // Update all balances after mining state change
        await updateAllBalances();
        await updateMiningStats();
    } catch (error) {
        console.error('Error toggling mining:', error);
        showNotification('Error toggling mining state: ' + error.message, true);
        // Try to recover the correct state
        await recoverMiningState();
    } finally {
        const button = document.getElementById('start-mining');
        if (button) {
            button.disabled = false;
        }
    }
};

// Update the updateMiningButton function
function updateMiningButton(isActive) {
    const button = document.getElementById('start-mining');
    if (button) {
        if (isActive) {
            button.textContent = 'Stop Mining';
            button.className = 'mining-button start-mining active loading';
        } else {
            button.textContent = 'Start Mining';
            button.className = 'mining-button start-mining';
        }
    } else {
        console.error('Mining button not found');
    }
}

let hashrateChart, profitChart;

// Initialize charts and setup
document.addEventListener('DOMContentLoaded', async () => {
  try {
    initializeCharts();
    setupEventListeners();
    await initializeMiningState();
    // Initialize audio system
    if (window.audioManager) {
        // Update volume icon based on initial state
        window.audioManager.updateVolumeIcon();
        
        // Add click sound to buttons
        document.querySelectorAll('button, a').forEach(element => {
            element.addEventListener('click', () => {
                window.audioManager.play('click');
            });
        });
    }
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

function setupEventListeners() {
  document.getElementById('gpu-shop').addEventListener('click', openGpuShop);
}

function initializeCharts() {
  const hashrateCtx = document.getElementById('hashrate-chart').getContext('2d');
  hashrateChart = new Chart(hashrateCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Hashrate (MH/s)',
        data: [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x'
          },
          pan: { enabled: true }
        }
      }
    }
  });

  const profitCtx = document.getElementById('profit-chart').getContext('2d');
  profitChart = new Chart(profitCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Profit (USD)',
        data: [],
        borderColor: '#BE0102',
        backgroundColor: 'rgba(190, 1, 2, 0.2)',
        borderWidth: 3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x'
          },
          pan: { enabled: true }
        }
      }
    }
  });
}

async function fetchCurrentEnergyPlan() {
    try {
        const response = await fetch(`${javaURI}/api/mining/energy`, {
            ...fetchOptions,
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Please log in to view energy plan');
            } else {
                throw new Error(`Failed to fetch energy plan (Status: ${response.status})`);
            }
        }
        
        const data = await response.json();
        const energyPlanElement = document.getElementById('current-energy-plan');
        
        if (data && data.supplierName) {
            energyPlanElement.textContent = `${data.supplierName} (${data.EEM || '0.00'} EEM)`;
            energyPlanElement.className = 'stat-value text-green-400';
        } else {
            energyPlanElement.textContent = 'No Energy Plan';
            energyPlanElement.className = 'stat-value text-red-400';
        }
    } catch (error) {
        console.error('Error fetching energy plan:', error);
        const energyPlanElement = document.getElementById('current-energy-plan');
        energyPlanElement.textContent = 'Error Loading Plan';
        energyPlanElement.className = 'stat-value text-red-400';
    }
}

async function initializeMiningState() {
    try {
        const response = await fetch(`${javaURI}/api/mining/state`, fetchOptions);
        if (!response.ok) {
            throw new Error('Failed to fetch mining state');
        }
        const state = await response.json();
        
        // Update UI with persisted state
        updateMiningButton(state.isMining);
        if (state.isMining) {
            startPeriodicUpdates();
            startCountdown();
        }
        
        // Initialize pool info
        const currentSymbol = localStorage.getItem('currentMiningCrypto') || 'BTC';
        updatePoolInfo(currentSymbol);
    } catch (error) {
        console.error('Error initializing mining state:', error);
        showNotification('Error loading mining state. Please try again.');
    }
}

// API Calls
async function loadGPUs() {
    try {
        const options = {
            ...fetchOptions,
            method: 'GET',
            cache: 'no-cache'
        };
        const response = await fetch(`${javaURI}/api/mining/shop`, options);
        const gpus = await response.json();
        console.log('GPUs:', gpus); // Log the GPUs to check the structure
        renderGpuShop(gpus);
    } catch (error) {
        console.error('Error loading GPUs:', error);
    }
}

window.toggleGPU = async function (gpuId) {
    try {
        const options = {
            ...fetchOptions,
            method: 'POST',
            cache: 'no-cache'
        };
        const response = await fetch(`${javaURI}/api/mining/gpu/toggle/${gpuId}`, options);
        const result = await response.json();
        if (result.success) {
            showNotification(result.message);
            // 局部更新GPU卡片
            const gpuCard = document.querySelector(`[data-gpu-id="${gpuId}"]`);
            if (gpuCard) {
                const button = gpuCard.querySelector('button');
                button.innerHTML = `
                            <span class="text-lg">${result.isActive ? '⏸️' : '▶️'}</span>
                            ${result.isActive ? 'Deactivate' : 'Activate'}
                        `;
                button.className = `w-full ${result.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} 
                            px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2`;
            }
            await updateMiningStats();
        } else {
            showNotification(result.message || 'Failed to toggle GPU');
        }
    } catch (error) {
        console.error('Error toggling GPU:', error);
        showNotification('Error toggling GPU: ' + error.message);
    }
}

window.buyGpu = async function (gpuId, quantity) {
    try {
        const options = {
            ...fetchOptions,
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify({ quantity: quantity })
        };
        const response = await fetch(`${javaURI}/api/mining/gpu/buy/${gpuId}`, options);
        const result = await response.json();
        if (response.ok) {
            // Play the buying GPU sound effect
            if (window.audioManager) {
                window.audioManager.play('buyingGPU');
            }
            showNotification(result.message);
            await updateMiningStats();
            await loadGPUs();
        } else {
            showNotification(result.message || 'Failed to buy GPU');
        }
    } catch (error) {
        console.error('Error buying GPU:', error);
        showNotification('Error buying GPU: ' + error.message);
    }
}

// Update the updateMiningStats function with better error handling
async function updateMiningStats() {
    try {
        const options = {
            ...fetchOptions,
            method: 'GET',
            cache: 'no-cache'
        };
        
        // First fetch the stats with retry
        const stats = await fetchWithRetry(`${javaURI}/api/mining/stats`, options);
        
        // Try to fetch GPU shop data, but don't fail if it errors
        let gpuPriceMap = {};
        try {
            const gpus = await fetchWithRetry(`${javaURI}/api/mining/shop`, options);
            gpus.forEach(gpu => {
                gpuPriceMap[gpu.id] = gpu.price;
            });
        } catch (shopError) {
            console.warn('Error fetching GPU shop data:', shopError);
        }
        
        // Add prices to the stats.gpus array
        if (stats.gpus) {
            stats.gpus = stats.gpus.map(gpu => ({
                ...gpu,
                price: gpuPriceMap[gpu.id] || gpu.price || 0
            }));
        } else {
            stats.gpus = [];
        }
        
        updateDisplay(stats);
        renderGpuInventory(stats);
        updateCharts(stats);
    } catch (error) {
        console.error('Error updating mining stats:', error);
        showNotification('Failed to fetch mining data, check your connection', true);
        // Reset UI to safe state
        document.getElementById('hashrate').textContent = '0 MH/s';
        document.getElementById('shares').textContent = '0';
        document.getElementById('gpu-temp').textContent = '0°C';
        document.getElementById('power-draw').textContent = '0W';
    }
}

// UI Updates
function updateDisplay(stats) {
    // Log incoming data
    console.log('Updating display with stats:', stats);
    // Parse BTC values
    const btcBalance = parseFloat(stats.btcBalance) || 0;
    const pendingBalance = parseFloat(stats.pendingBalance) || 0;
    const totalBTC = btcBalance + pendingBalance;
    // Update BTC displays
    document.getElementById('btc-balance').textContent = btcBalance.toFixed(8);
    document.getElementById('pending-balance').textContent = pendingBalance.toFixed(8);
    // Calculate and update USD value
    let usdValue;
    if (stats.totalBalanceUSD) {
        usdValue = stats.totalBalanceUSD;
    } else {
        usdValue = (totalBTC * 45000).toFixed(2);
    }
    document.getElementById('usd-value').textContent = `$${usdValue}`;

    // Calculate daily revenue based on hashrate
    const hashrate = parseFloat(stats.hashrate) || 0;
    const dailyRevenue = (hashrate * 86400 * 0.00000001 * 45000).toFixed(2); // Calculate based on hashrate
    document.getElementById('daily-revenue').textContent = `$${dailyRevenue}`;
    
    // Log the values being displayed
    console.log('Display values:', {
        btcBalance: btcBalance.toFixed(8),
        pendingBalance: pendingBalance.toFixed(8),
        totalBTC: totalBTC.toFixed(8),
        usdValue: usdValue
    });
    // Add small random fluctuations to temperature and power
    const tempVariation = Math.random() * 2 - 1; // Random variation ±1°C
    const powerVariation = Math.random() * 10 - 5; // Random variation ±5W
    // Get base values
    const baseTemp = parseFloat(stats.averageTemperature) || 0;
    const basePower = parseFloat(stats.powerConsumption) || 0;
    // Calculate new values with fluctuations
    const newTemp = Math.max(30, Math.min(90, baseTemp + tempVariation)); // Keep between 30-90°C
    const newPower = Math.max(0, basePower + powerVariation); // Keep above 0W
    // Update display elements
    document.getElementById('hashrate').textContent = `${(parseFloat(stats.hashrate) || 0).toFixed(2)} MH/s`;
    document.getElementById('shares').textContent = stats.shares || 0;
    document.getElementById('gpu-temp').textContent = `${newTemp.toFixed(1)}°C`;
    document.getElementById('power-draw').textContent = `${newPower.toFixed(0)}W`;
    document.getElementById('power-cost').textContent = `$${(typeof stats.powerCost === 'number' ? stats.powerCost : 0).toFixed(2)}`;
    // Update GPU count display
    if (stats.gpus && stats.gpus.length > 0) {
        const totalGPUs = stats.gpus.reduce((sum, gpu) => sum + gpu.quantity, 0);
        const activeGPUs = stats.gpus.reduce((sum, gpu) => gpu.isActive ? sum + gpu.quantity : sum, 0);
        document.getElementById('current-gpu').textContent =
            `${activeGPUs} Active of ${totalGPUs} GPUs (Click to view)`;
    } else {
        document.getElementById('current-gpu').textContent = 'No GPUs';
    }
    // Add color indicators for temperature
    const tempElement = document.getElementById('gpu-temp');
    if (newTemp >= 80) {
        tempElement.className = 'stat-value text-red-500'; // Hot
    } else if (newTemp >= 70) {
        tempElement.className = 'stat-value text-yellow-500'; // Warm
    } else {
        tempElement.className = 'stat-value text-green-500'; // Good
    }
    // Store stats globally for modal access
    window.stats = stats;
}

function renderGpuInventory(stats) {
    const inventoryElement = document.getElementById('gpu-inventory');
    if (!inventoryElement) return;
    inventoryElement.innerHTML = '';
    const gpus = stats?.gpus || [];
    if (!gpus.length) {
        inventoryElement.innerHTML = '<p class="text-gray-400 text-center">No GPUs in inventory</p>';
        return;
    }
    // Create gpuGroups object to group GPUs by ID
    const gpuGroups = {};
    gpus.forEach(gpu => {
        const gpuId = gpu.id;
        if (!gpuGroups[gpuId]) {
            gpuGroups[gpuId] = {
                ...gpu,
                quantity: gpu.quantity || 0,
                activeCount: gpu.isActive ? (gpu.quantity || 0) : 0
            };
        }
    });
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 gap-6 p-4';
    Object.values(gpuGroups).forEach(gpu => {
        const gpuCard = document.createElement('div');
        gpuCard.className = 'bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 pb-12 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] border border-gray-700/50 backdrop-blur-sm relative';
        gpuCard.dataset.gpuId = gpu.id;
        // Fix property names to match the backend data
        const hashrate = parseFloat(gpu.hashrate) || 0;
        const power = parseFloat(gpu.power) || 0;
        const temp = parseFloat(gpu.temp) || 0;
        const price = parseFloat(gpu.price) || 0;
        const dailyRevenue = hashrate * 86400 * 0.00000001;
        const dailyPowerCost = (power * 24 / 1000 * 0.12);
        const dailyProfit = dailyRevenue - dailyPowerCost;
        const sellPrice = (price * 0.8).toFixed(2); // Calculate 80% of original price
        gpuCard.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-8">
                            <div class="flex-1">
                                <h3 class="text-xl font-bold text-white mb-1">${gpu.name}</h3>
                                <p class="text-blue-400/80 text-sm">${gpu.activeCount} of ${gpu.quantity} Active</p>
                            </div>
                            <div class="text-sm bg-gray-800/50 p-3 rounded-lg">
                                <div class="text-blue-400 font-semibold mb-2">Performance</div>
                                <p class="text-white/90">⚡ ${hashrate.toFixed(2)} MH/s</p>
                                <p class="text-white/90">🔌 ${power.toFixed(0)}W</p>
                                <p class="text-white/90">🌡️ ${temp.toFixed(1)}°C</p>
                            </div>
                            <div class="text-sm bg-gray-800/50 p-3 rounded-lg">
                                <div class="text-green-400 font-semibold mb-2">Daily Estimates</div>
                                <p class="text-green-400/90">💰 $${dailyRevenue.toFixed(2)}</p>
                                <p class="text-red-400/90">💡 -$${dailyPowerCost.toFixed(2)}</p>
                                <p class="text-blue-400/90">📈 $${dailyProfit.toFixed(2)}</p>
                            </div>
                            <div class="text-sm bg-gray-800/50 p-3 rounded-lg">
                                <div class="text-purple-400 font-semibold mb-2">Total & Info</div>
                                <p class="text-purple-400/90">Total: $${(dailyProfit * gpu.quantity).toFixed(2)}</p>
                                <p class="text-yellow-400/90">Sell: $${sellPrice}</p>
                                <p class="text-blue-400/90">Eff: ${(hashrate / power).toFixed(3)} MH/W</p>
                            </div>
                        </div>
                    </div>
                    <div class="absolute bottom-4 right-6 flex items-center space-x-3">
                        <span class="text-green-400/90 text-lg font-bold bg-gray-800/80 px-3 py-1 rounded-lg border border-gray-700/30">x${gpu.quantity}</span>
                        <button onclick="showSellModal(${gpu.id}, '${gpu.name}', ${gpu.quantity}, ${sellPrice})"
                                class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-0.5">
                            Sell GPU
                        </button>
                    </div>
                `;
        container.appendChild(gpuCard);
    });
    inventoryElement.appendChild(container);
}

function updateCharts(stats) {
    if (!stats) {
        console.warn('updateCharts called without stats');
        return;
    }

    const MAX_DATA_POINTS = 50; // Maximum number of data points to keep
    const now = new Date().toLocaleTimeString();

    // Update hashrate chart
    if (hashrateChart) {
        const numericHashrate = parseFloat(stats.hashrate) || 0;
        
        // Remove old data points if exceeding limit
        while (hashrateChart.data.labels.length >= MAX_DATA_POINTS) {
            hashrateChart.data.labels.shift();
            hashrateChart.data.datasets[0].data.shift();
        }
        
        hashrateChart.data.labels.push(now);
        hashrateChart.data.datasets[0].data.push(numericHashrate);
        hashrateChart.update('none');
    }

    // Update profit chart
    if (profitChart) {
        const dailyRevenue = typeof stats.dailyRevenue === 'number' ? stats.dailyRevenue : 0;
        const powerCost = typeof stats.powerCost === 'number' ? stats.powerCost : 0;
        const totalBalanceUSD = parseFloat(stats.totalBalanceUSD) || 0;
        const totalProfit = totalBalanceUSD + powerCost;
        
        // Remove old data points if exceeding limit
        while (profitChart.data.labels.length >= MAX_DATA_POINTS) {
            profitChart.data.labels.shift();
            profitChart.data.datasets[0].data.shift();
        }
        
        profitChart.data.labels.push(now);
        profitChart.data.datasets[0].data.push(totalProfit);
        profitChart.update('none');
    }
}

function renderGpuShop(gpus) {
    const gpuListElement = document.getElementById('gpu-list');
    if (!gpuListElement) {
        console.error('GPU list element not found');
        return;
    }
    
    gpuListElement.innerHTML = '';
    // Group GPUs by category
    const categories = {
        'Free Starter GPU': gpus.filter(gpu => gpu.price === 0),
        'Budget GPUs ($10000-20000)': gpus.filter(gpu => gpu.price > 0 && gpu.price <= 20000),
        'Mid-Range GPUs ($20000-50000)': gpus.filter(gpu => gpu.price > 20000 && gpu.price <= 50000),
        'High-End GPUs ($50000-100000)': gpus.filter(gpu => gpu.price > 50000 && gpu.price <= 100000),
        'Premium GPUs ($100000+)': gpus.filter(gpu => gpu.price > 100000)
    };

    Object.entries(categories).forEach(([category, categoryGpus]) => {
        if (categoryGpus.length === 0) return;
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = `text-xl font-bold mb-4 mt-6 ${getCategoryColor(category)}`;
        categoryHeader.textContent = category;
        gpuListElement.appendChild(categoryHeader);
        
        categoryGpus.forEach(gpu => {
            const gpuCard = createGpuCard(gpu, category);
            gpuListElement.appendChild(gpuCard);
        });
    });
}

function createGpuCard(gpu, category) {
    const card = document.createElement('div');
    card.className = `gpu-card mb-4 ${getCategoryClass(category)}`;
    // Calculate daily estimates
    const dailyRevenue = (gpu.hashRate || 0) * 86400 * 0.00000001;
    const dailyPowerCost = (gpu.powerConsumption || 0) * 24 / 1000 * 0.12;
    const dailyProfit = dailyRevenue - dailyPowerCost;
    const roi = dailyProfit > 0 ? (gpu.price / dailyProfit) : Infinity;
    // Add quantity selector for non-starter GPUs
    const isStarterGPU = gpu.price === 0;
    const quantitySelector = isStarterGPU ? '' : `
                <div class="flex flex-col items-end gap-2">
                    <div class="flex items-center">
                        <label class="text-gray-400 mr-2">Quantity:</label>
                        <select id="quantity-${gpu.id}" class="bg-gray-700 rounded px-2 py-1" 
                                data-price="${gpu.price}"
                                data-gpu-id="${gpu.id}"
                                onchange="updateTotalPrice(${gpu.id}, ${gpu.price}); updateShopTotalCost()">
                            ${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}">${n}</option>`).join('')}
                        </select>
                    </div>
                    <div class="text-gray-400">
                        Total: $<span id="total-${gpu.id}">0</span>
                    </div>
                </div>
            `;
    // Show owned quantity if owned
    const ownedQuantity = gpu.quantity > 0 ?
        `<p class="text-green-400 text-sm">Owned: ${gpu.quantity}</p>` : '';
    card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="text-lg font-bold ${getCategoryColor(category)}">${gpu.name}</h3>
                        ${ownedQuantity}
                        <div class="grid grid-cols-2 gap-4 mt-2">
                            <div class="text-sm">
                                <p class="text-gray-400">Performance</p>
                                <p class="text-white">⚡ ${(gpu.hashRate || 0).toFixed(2)} MH/s</p>
                                <p class="text-white">🔌 ${(gpu.powerConsumption || 0).toFixed(0)}W</p>
                                <p class="text-white">🌡️ ${(gpu.temp || 0).toFixed(1)}°C</p>
                            </div>
                            <div class="text-sm">
                                <p class="text-gray-400">Daily Estimates</p>
                                <p class="text-green-400">💰 $${dailyRevenue.toFixed(2)}</p>
                                <p class="text-red-400">💡 -$${dailyPowerCost.toFixed(2)}</p>
                                <p class="text-blue-400">📈 $${dailyProfit.toFixed(2)}</p>
                            </div>
                        </div>
                        <div class="mt-2 text-sm">
                            <p class="text-gray-400">Efficiency: ${((gpu.hashRate || 0) / (gpu.powerConsumption || 1)).toFixed(3)} MH/W</p>
                            <p class="text-gray-400">ROI: ${roi.toFixed(1)} days</p>
                        </div>
                    </div>
                    <div class="text-right ml-4 flex flex-col items-end">
                        <p class="text-xl font-bold ${getCategoryColor(category)} mb-2">
                            ${gpu.price === 0 ? 'FREE' : '$' + gpu.price.toLocaleString()}
                        </p>
                        ${quantitySelector}
                    </div>
                </div>
            `;
    // After creating the card, attach the event listener
    setTimeout(() => {
        const quantitySelect = document.getElementById(`quantity-${gpu.id}`);
        if (quantitySelect) {
            quantitySelect.addEventListener('change', function () {
                const gpuId = this.dataset.gpuId;
                const basePrice = parseFloat(this.dataset.price);
                updateTotalPrice(gpuId, basePrice);
                updateShopTotalCost();
            });
        }
    }, 0);
    return card;
}

// Utility functions
function getCategoryColor(category) {
    const colors = {
        'Free Starter GPU': 'text-green-400',
        'Budget GPUs ($10000-20000)': 'text-blue-400',
        'Mid-Range GPUs ($20000-50000)': 'text-purple-400',
        'High-End GPUs ($50000-100000)': 'text-orange-400',
        'Premium GPUs ($100000+)': 'text-red-400'
    };
    return colors[category] || 'text-white';
}

function getCategoryClass(category) {
    const classes = {
        'Free Starter GPU': 'starter',
        'Budget GPUs ($10000-20000)': 'budget',
        'Mid-Range GPUs ($20000-50000)': 'mid-range',
        'High-End GPUs ($50000-100000)': 'high-end',
        'Premium GPUs ($100000+)': 'premium'
    };
    return classes[category] || '';
}

function openGpuShop() {
    const modal = document.getElementById('gpu-shop-modal');
    modal.classList.remove('hidden');
    loadGPUs(); // Load GPUs when opening the shop
}

window.closeGpuShop = function() {
    const modal = document.getElementById('gpu-shop-modal');
    modal.classList.add('hidden');
};

// Close modal when clicking outside
document.getElementById('gpu-shop-modal').addEventListener('click', (e) => {
    if (e.target.id === 'gpu-shop-modal') {
        e.target.classList.add('hidden');
    }
});

// Update the total price function to properly format numbers
function updateTotalPrice(gpuId, basePrice) {
    const quantitySelect = document.getElementById(`quantity-${gpuId}`);
    const totalSpan = document.getElementById(`total-${gpuId}`);
    if (quantitySelect && totalSpan) {
        const quantity = parseInt(quantitySelect.value);
        const total = quantity > 0 ? basePrice * quantity : 0;
        totalSpan.textContent = total.toLocaleString();
    }
}

function updateShopTotalCost() {
    let total = 0;
    document.querySelectorAll('[id^="quantity-"]').forEach(select => {
        const quantity = parseInt(select.value);
        if (quantity > 0) {  // Only include if quantity is greater than 0
            const basePrice = parseFloat(select.dataset.price);
            if (!isNaN(basePrice)) {
                total += basePrice * quantity;
            }
        }
    });
    document.getElementById('shop-total-cost').textContent = total.toLocaleString();
}

// Make the functions globally available
window.updateTotalPrice = updateTotalPrice;
window.updateShopTotalCost = updateShopTotalCost;

window.buySelectedGPUs = async function () {
    const purchases = [];
    document.querySelectorAll('[id^="quantity-"]').forEach(select => {
        const quantity = parseInt(select.value);
        const gpuId = select.dataset.gpuId;
        if (quantity > 0) {
            purchases.push({ gpuId, quantity });
        }
    });
    if (purchases.length === 0) {
        showNotification('Please select at least one GPU to buy');
        return;
    }
    // Process each purchase
    for (const purchase of purchases) {
        await buyGpu(purchase.gpuId, purchase.quantity);
    }
};

// Add sell functionality
function showSellModal(gpuId, gpuName, maxQuantity, sellPrice) {
    const modal = document.getElementById('sellModal');
    const modalContent = document.getElementById('sellModalContent');
    modalContent.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 class="text-2xl font-bold text-white mb-4">Sell ${gpuName}</h2>
            <p class="text-gray-300 mb-4">Sell price: $${sellPrice} each</p>
            <div class="mb-4">
                <label class="text-gray-300 block mb-2">Quantity:</label>
                <input type="number" id="sellQuantity" 
                       min="1" max="${maxQuantity}" value="1" 
                       class="bg-gray-700 text-white px-3 py-2 rounded w-full"
                       onchange="updateSellTotal(${sellPrice})">
            </div>
            <p class="text-lg text-green-400 mb-4">
                Total value: $<span id="totalSellValue">${sellPrice}</span>
            </p>
            <div class="flex justify-end gap-4">
                <button onclick="closeSellModal()"
                        class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                    Cancel
                </button>
                <button onclick="confirmSell(${gpuId})"
                        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                    Confirm Sale
                </button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    updateSellTotal(sellPrice);
}

function updateSellTotal(sellPrice) {
    const quantity = parseInt(document.getElementById('sellQuantity').value) || 0;
    const total = (sellPrice * quantity).toFixed(2);
    document.getElementById('totalSellValue').textContent = total;
}

function closeSellModal() {
    document.getElementById('sellModal').style.display = 'none';
}

// Update the confirmSell function with proper headers
window.confirmSell = async function (gpuId) {
    const quantity = parseInt(document.getElementById('sellQuantity').value);
    try {
        const response = await fetch(`${javaURI}/api/mining/gpu/sell/${gpuId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers
            },
            credentials: 'include',
            body: JSON.stringify({ quantity: quantity })
        });
        const result = await response.json();
        if (result.success) {
            window.showNotification(result.message);
            closeSellModal();
            await updateMiningStats();
            // Update user balance
            await fetchUserBalance();
        } else {
            window.showNotification(result.message || 'Failed to sell GPU', true);
        }
    } catch (error) {
        console.error('Error selling GPU:', error);
        window.showNotification('Error selling GPU: ' + error.message, true);
    }
};

window.toggleMining = toggleMining;
window.showSellModal = showSellModal;
window.updateSellTotal = updateSellTotal;
window.closeSellModal = closeSellModal;
window.confirmSell = confirmSell;

// Update the pool info display function
function updatePoolInfo(symbol) {
    const poolInfoLabel = document.getElementById('pool-info-label');
    const poolInfoValue = document.getElementById('pool-info-value');
    if (!poolInfoLabel || !poolInfoValue) return;

    // Get pool information based on the cryptocurrency
    const poolInfo = {
        'BTC': {
            algorithm: 'SHA-256',
            difficulty: 'Very High',
            minPayout: '0.001 BTC',
            blockReward: '6.25 BTC'
        },
        'ETH': {
            algorithm: 'Ethash',
            difficulty: 'High',
            minPayout: '0.01 ETH',
            blockReward: '2.0 ETH'
        },
        'LTC': {
            algorithm: 'Scrypt',
            difficulty: 'Medium',
            minPayout: '0.02 LTC',
            blockReward: '12.5 LTC'
        },
        'XMR': {
            algorithm: 'RandomX',
            difficulty: 'Medium',
            minPayout: '0.01 XMR',
            blockReward: '0.6 XMR'
        }
    };

    const info = poolInfo[symbol] || poolInfo['BTC']; // Default to BTC if symbol not found
    poolInfoLabel.innerHTML = `<span class="text-blue-400">Mining: ${symbol}</span>`;
    poolInfoValue.innerHTML = `
        <div class="text-sm">
            <p class="text-gray-400">Algorithm: ${info.algorithm}</p>
            <p class="text-gray-400">Difficulty: ${info.difficulty}</p>
            <p class="text-yellow-400">Min Payout: ${info.minPayout}</p>
            <p class="text-green-400">Block Reward: ${info.blockReward}</p>
        </div>
    `;
}

// Update the selectCryptocurrency function to include pool info update
window.selectCryptocurrency = function(symbol) {
    console.log(`Selecting cryptocurrency: ${symbol}`);
    localStorage.setItem('currentMiningCrypto', symbol);
    
    // Update pool information
    updatePoolInfo(symbol);
    
    const selectionUrl = `${javaURI}/api/mining/cryptocurrencies`;
    console.log("Sending to endpoint:", selectionUrl);
    fetch(selectionUrl, {
        method: 'POST'
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Received selection response:', data);
        if (data.success) {
            showNotification(`Now mining ${symbol}`, 'success');
            loadCryptoBalances();
            updateMiningStats();
        } else {
            showNotification(`Failed to select ${symbol}`, 'error');
        }
    })
    .catch(error => {
        console.error('Error selecting cryptocurrency:', error);
        showNotification(`Now mining ${symbol} (simulated)`, 'success');
        document.getElementById('crypto-balances-container').querySelectorAll('.text-blue-400').forEach(el => {
            if (el.textContent.includes('Currently mining:')) {
                el.innerHTML = `Currently mining: <span class="font-bold">${symbol}</span>`;
            }
        });
        updateMiningStats();
    });
};

// Initialize pool info on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentSymbol = localStorage.getItem('currentMiningCrypto') || 'BTC';
    updatePoolInfo(currentSymbol);
});

// Add cleanup function for charts
function cleanupCharts() {
    if (hashrateChart) {
        hashrateChart.destroy();
        hashrateChart = null;
    }
    if (profitChart) {
        profitChart.destroy();
        profitChart = null;
    }
}

// Add cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopPeriodicUpdates();
    stopStateSync();
    cleanupCharts();
});

// Add retry logic for API calls
async function fetchWithRetry(url, options, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            lastError = error;
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
            }
        }
    }
    throw lastError;
}

// Add missing functions
async function updateAllBalances() {
    try {
        await fetchUserBalance();
        await updateMiningStats();
    } catch (error) {
        console.error('Error updating balances:', error);
    }
}

async function recoverMiningState() {
    try {
        const state = await fetchWithRetry(`${javaURI}/api/mining/state`, fetchOptions);
        updateMiningButton(state.isMining);
        if (state.isMining) {
            startPeriodicUpdates();
            startCountdown();
        } else {
            stopPeriodicUpdates();
            stopCountdown();
        }
    } catch (error) {
        console.error('Error recovering mining state:', error);
        // Default to stopped state if recovery fails
        updateMiningButton(false);
        stopPeriodicUpdates();
        stopCountdown();
    }
}

// Add online/offline event listeners
window.addEventListener('online', () => {
    isOnline = true;
    showNotification('Back online');
    if (document.getElementById('start-mining').textContent === 'Stop Mining') {
        startPeriodicUpdates();
    }
});

window.addEventListener('offline', () => {
    isOnline = false;
    showNotification('You are offline', true);
    stopPeriodicUpdates();
});

// Initialize particle system when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create container for particles
    const container = document.createElement('div');
    container.id = 'crypto-particles';
    document.body.appendChild(container);

    // Add particles.js script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = function() {
        particlesJS("crypto-particles", {
            "particles": {
                "number": {
                    "value": 50,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": ["#00ff00", "#00ffff", "#3b82f6", "#f7931a", "#627eea"]
                },
                "shape": {
                    "type": ["circle", "triangle"],
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.6,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 4,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#00ff00",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    },
                    "push": {
                        "particles_nb": 3
                    }
                }
            },
            "retina_detect": true
        });
    };
    document.head.appendChild(script);
});