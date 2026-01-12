---
layout: fortunefinders
title: Crypto Mining Simulator BACKUP
permalink: /crypto/miningbackup
---

<!-- ATTENTION! The following locations are where you may find different places to edit different things -->\
<!-- Any CSS or styling adjustments should be done @ {base}/assets/css/crypto.css  -->

<html lang="en">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-zoom/2.0.1/chartjs-plugin-zoom.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://unpkg.com/intro.js/minified/introjs.min.css" rel="stylesheet">
    <script src="https://unpkg.com/intro.js/minified/intro.min.js"></script>
    <link rel="stylesheet" href="{{site.baseurl}}/assets/css/crypto.css"/>
    <div id="notification" class="notification"></div>
    <div class="main-content">
        <div class="container mx-auto pt-20">
            <!-- Core Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Wallet -->
                <div class="dashboard-card">
                    <h2>Wallet</h2>
                    <div class="grid gap-2">
                        <div>
                            <div class="stat-label">Crypto Balance</div>
                            <div class="stat-value text-green-400" id="btc-balance">0.00000000</div>
                        </div>
                        <div>
                            <div class="stat-label">Pending Crypto Balance</div>
                            <div class="stat-value text-yellow-400" id="pending-balance">0.00000000</div>
                            <script type="module" src="{{site.baseurl}}/assets/js/crypto/portfolio.js"></script>
                            <span class="text-sm text-blue-400 cursor-pointer hover:underline mt-1 inline-block" onclick="openCryptoDetailsModal()">View all crypto balances &rarr;</span>
                        </div>
                        <div>
                            <div class="stat-label">USD Value</div>
                            <div class="stat-value text-green-400" id="usd-value">$0.00</div>
                        </div>
                        <div>
                            <div class="stat-label" id="pool-info-label"></div>
                            <div class="stat-value text-yellow-400" id="pool-info-value"></div>
                        </div>
                    </div>
                </div>
                <!-- Mining Stats -->
                <div class="dashboard-card">
                    <h2>Mining Stats</h2>
                    <div class="grid gap-2">
                        <div>
                            <div class="stat-label">Hashrate</div>
                            <div class="stat-value text-purple-400" id="hashrate">0 MH/s</div>
                        </div>
                        <div>
                            <div class="stat-label">Shares</div>
                            <div class="stat-value text-purple-400" id="shares">0</div>
                        </div>
                    </div>
                </div>
                <!-- Hardware -->
                <div class="dashboard-card">
                    <h2>Hardware</h2>
                    <div class="grid gap-2">
                        <div>
                            <div class="stat-label">Current GPU</div>
                            <div class="stat-value text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" 
                                 onclick="openActiveGPUsModal()" 
                                 id="current-gpu">
                                No GPU
                            </div>
                        </div>
                        <div>
                            <div class="stat-label">GPU Temperature</div>
                            <div class="stat-value text-blue-400" id="gpu-temp">0°C</div>
                        </div>
                        <div>
                            <div class="stat-label">Power Draw</div>
                            <div class="stat-value text-blue-400" id="power-draw">0W</div>
                        </div>
                        <div>
                            <div class="stat-label">Current Energy Plan</div>
                            <div class="stat-value text-green-400" id="current-energy-plan">Loading...</div>
                            <script type="module">
                                import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
                                async function fetchCurrentEnergyPlan() {
                                    const planElem = document.getElementById('current-energy-plan');
                                    if (!planElem) return;
                                    try {
                                    const response = await fetch(`${javaURI}/api/mining/energy`, {
                                        ...fetchOptions,
                                        credentials: 'include'
                                    });
                                    if (!response.ok) {
                                        if (response.status === 401) {
                                        throw new Error('Please log in');
                                        } else {
                                        throw new Error(`Failed to fetch (Status: ${response.status})`);
                                        }
                                    }
                                    const data = await response.json();
                                    planElem.textContent = data.supplierName
                                        ? `${data.supplierName} (EEM: ${data.EEM || '0.00'})`
                                        : 'No supplier selected';
                                    } catch (error) {
                                    planElem.textContent = error.message || 'Error loading energy plan';
                                    }
                                }
                                document.addEventListener('DOMContentLoaded', fetchCurrentEnergyPlan);
                            </script>
                        </div>
                    </div>
                </div>
                <!-- Profitability -->
                <div class="dashboard-card">
                    <h2>Profitability</h2>
                    <div class="grid gap-2">
                        <div>
                            <div class="stat-label">24h Revenue</div>
                            <div class="stat-value text-red-400" id="daily-revenue">$0.00</div>
                        </div>
                        <div>
                            <div class="stat-label">Power Cost</div>
                            <div class="stat-value text-red-400" id="power-cost">$0.00</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Mining Controls -->
            <div class="flex flex-col items-center gap-4">
                <div class="flex flex-row justify-center items-center gap-4">
                    <a href="{{site.baseurl}}/crypto/energy" class="mining-button energy-plan">
                        <span>Energy Plan</span>
                    </a>
                    <script type="module" src="{{site.baseurl}}/assets/js/crypto/front.js"></script>
                    <button id="start-mining" class="mining-button start-mining" onclick="toggleMining()">
                        <span>Start Mining</span>
                    </button>
                    <a href="{{site.baseurl}}/crypto/energy-store" class="mining-button energy-store">
                        <span>Energy Store</span>
                    </a>
                    <!-- Volume Control Button -->
                    <div class="volume-control" title="Toggle Sound">
                        <button onclick="audioManager.toggleMute()" class="mining-button bg-gray-800 hover:bg-gray-700 text-blue-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/30">
                            <span class="text-lg font-bold" id="volume-icon">🔊</span>
                        </button>
                    </div>
                    <!-- Tutorial Help Button -->
                    <div class="tutorial-help-button" title="Interactive Tutorial">
                        <button onclick="startTutorial()" class="mining-button bg-gray-800 hover:bg-gray-700 text-green-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-green-500/30">
                            <span class="text-lg font-bold">?</span>
                        </button>
                    </div>
                </div>
                <!-- Mining Countdown Timer -->
                <div id="mining-countdown" class="mt-4 hidden">
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                        <span class="text-lg font-mono text-red-400">Next Reward in: <span id="countdown-timer">15:00</span></span>
                    </div>
                </div>
            </div>
            <!-- Performance Charts -->
            <div class="flex flex-col gap-4 mt-4">
                <div class="text-sm text-gray-400 text-center">
                    Drag to pan horizontally • Use mouse wheel to zoom • Double click to reset
                </div>
                <div class="chart-container">
                    <canvas id="hashrate-chart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="profit-chart"></canvas>
                </div>
            </div>
            <!-- GPU Inventory -->
            <div class="dashboard-card mt-4 bg-gray-900 p-6 rounded-lg">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">My GPU Inventory</h2>
                    <button id="gpu-shop" 
                            class="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg 
                                   font-medium transition-colors duration-200 flex items-center gap-2">
                        <span>🛒</span>
                        GPU Shop
                    </button>
                </div>
                <div id="gpu-inventory" class="min-h-[400px]">
                </div>
            </div>
        </div>
    </div>
    <!-- Tutorial Welcome Modal -->
    <div id="tutorial-welcome" class="tutorial-welcome hidden">
        <h2>Welcome to Crypto Mining Simulator!</h2>
        <p>Would you like to take a quick tour of the mining interface?</p>
        <div class="tutorial-buttons">
            <button class="tutorial-button tutorial-button-primary" onclick="startTutorial()">Start Tour</button>
            <button class="tutorial-button tutorial-button-tertiary" onclick="skipTutorial()">SKIP</button>
            <button class="tutorial-button tutorial-button-tertiary" onclick="neverShowTutorial()">Never Show</button>
        </div>
    </div>
    <script type="module" src="{{site.baseurl}}/assets/js/crypto/tutorial.js"></script>
    <!-- GPU Shop Modal -->
    <div id="gpu-shop-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[80vh] overflow-hidden">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">GPU Shop</h2>
                <button onclick="closeGpuShop()" class="text-gray-400 hover:text-white text-3xl">&times;</button>
            </div>
            <div class="overflow-y-auto pr-2" style="max-height: calc(80vh - 100px);">
                <div id="gpu-list" class="grid gap-4">
                    <!-- GPUs will be inserted here -->
                </div>
            </div>
            <!-- Total Cost Footer -->
            <div id="total-cost-footer" class="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 backdrop-blur-sm p-4 flex justify-between items-center"
                 style="border-top: 3px solid transparent;
                        background: rgba(17, 24, 39, 0.95);
                        animation: rgb-border-breathe 3s ease-in-out infinite;">
                <div class="text-2xl font-bold text-white">Total Cost:</div>
                <div class="flex items-center gap-4">
                    <div class="text-3xl font-bold text-white">
                        USD: <span id="shop-total-cost">0</span>
                    </div>
                    <button onclick="buySelectedGPUs()" 
                            class="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                        Buy Selected GPUs
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Add this right before the closing </body> tag -->
    <div id="active-gpus-modal" class="active-gpus-modal hidden">
        <div class="active-gpus-content">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-blue-400">Active GPUs</h2>
                <button onclick="closeActiveGPUsModal()" 
                        class="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div id="active-gpus-list">
                <!-- GPUs will be listed here -->
            </div>
        </div>
    </div>
    <div id="sellModal">
        <div id="sellModalContent"></div>
    </div>
    <!-- Replace the entire crypto-details-modal div with this updated version -->
    <div id="crypto-details-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-gray-900 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
            <!-- Header -->
            <div class="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-white">Your Cryptocurrency Balances</h2>
                <button onclick="closeCryptoDetailsModal()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            <!-- Main content - scrollable -->
            <div class="overflow-y-auto flex-grow p-4" style="overflow-y: auto !important;">
                <div id="crypto-balances-container">
                    <!-- Crypto balances will be loaded here dynamically -->
                    <div class="animate-pulse">
                        <div class="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div class="h-24 bg-gray-800 rounded mb-4"></div>
                        <div class="h-24 bg-gray-800 rounded mb-4"></div>
                        <div class="h-24 bg-gray-800 rounded mb-4"></div>
                    </div>
                </div>
                <!-- Cryptocurrency selection -->
                <div class="mt-8 border-t border-gray-700 pt-4">
                    <h3 class="text-xl font-bold text-white mb-4">Change Mining Cryptocurrency</h3>
                    <div id="crypto-selection-container" class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <!-- Cryptocurrency options will be loaded here dynamically -->
                        <div class="animate-pulse">
                            <div class="h-16 bg-gray-800 rounded"></div>
                        </div>
                        <div class="animate-pulse">
                            <div class="h-16 bg-gray-800 rounded"></div>
                        </div>
                        <div class="animate-pulse">
                            <div class="h-16 bg-gray-800 rounded"></div>
                        </div>
                        <div class="animate-pulse">
                            <div class="h-16 bg-gray-800 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>