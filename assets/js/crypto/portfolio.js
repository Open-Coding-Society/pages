import { javaURI, fetchOptions } from '../api/config.js';
// Function to open the cryptocurrency details modal

console.log("portfolio.js is loaded.");

// Expose functions to global scope
window.openCryptoDetailsModal = function() {
    const modal = document.getElementById('crypto-details-modal');
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open'); // Add class to body
    loadCryptoBalances();
    loadAvailableCryptocurrencies();
};

// Function to close the cryptocurrency details modal
window.closeCryptoDetailsModal = function() {
    const modal = document.getElementById('crypto-details-modal');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open'); // Remove class from body
};

// Function to load cryptocurrency balances
function loadCryptoBalances() {
    console.log('Fetching crypto balances from: /api/mining/balances backend endpoint.');
    // Get currently selected cryptocurrency from localStorage or default to BTC
    const currentMining = localStorage.getItem('currentMiningCrypto') || 'BTC';
    // Sample data to display when backend is unavailable
    const sampleData = {
        balances: [
            {
                name: "Bitcoin",
                symbol: "BTC",
                logoUrl: "https://i.ibb.co/DgwJM9TQ/image.png",
                price: 45000.0,
                confirmedBalance: "0.00025000",
                pendingBalance: "0.00010000",
                confirmedUSD: "11.25",
                pendingUSD: "4.50",
                totalUSD: "15.75",
                algorithm: "SHA-256",
                difficulty: "Very High",
                minPayout: 0.001,
                blockReward: 6.25
            },
            {
                name: "Ethereum",
                symbol: "ETH",
                logoUrl: "https://i.ibb.co/v6Z6bsVK/image.png",
                price: 3000.0,
                confirmedBalance: "0.00300000",
                pendingBalance: "0.00050000",
                confirmedUSD: "9.00",
                pendingUSD: "1.50",
                totalUSD: "10.50",
                algorithm: "Ethash",
                difficulty: "High",
                minPayout: 0.01,
                blockReward: 2.0
            },
            {
                name: "Litecoin",
                symbol: "LTC",
                logoUrl: "https://i.ibb.co/ZpBmmZrN/image.png",
                price: 80.0,
                confirmedBalance: "0.15000000",
                pendingBalance: "0.05000000",
                confirmedUSD: "12.00",
                pendingUSD: "4.00",
                totalUSD: "16.00",
                algorithm: "Scrypt",
                difficulty: "Medium",
                minPayout: 0.02,
                blockReward: 12.5
            },
            {
                name: "Monero",
                symbol: "XMR",
                logoUrl: "https://i.ibb.co/m5yHc70m/image.png",
                price: 170.0,
                confirmedBalance: "0.01000000",
                pendingBalance: "0.00500000",
                confirmedUSD: "1.70",
                pendingUSD: "0.85",
                totalUSD: "2.55",
                algorithm: "RandomX",
                difficulty: "Medium",
                minPayout: 0.01,
                blockReward: 0.6
            }
        ],
        totalUSD: "44.80",
        currentMining: currentMining // Use the saved cryptocurrency
    };
    // Try to fetch from the API first
    const balanceUrl = `${javaURI}/api/mining/balances`;
    console.log("Fetching balance from:", balanceUrl);
    fetch(balanceUrl, fetchOptions)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received balances data:', data);
            displayCryptoBalances(data);
        })
        .catch(error => {
            console.error('Error loading crypto balances:', error);
            // Display sample data instead
            console.log('Using sample data instead');
            displayCryptoBalances(sampleData);
        });
}
// Function to display cryptocurrency balances
function displayCryptoBalances(data) {
    const container = document.getElementById('crypto-balances-container');
    if (!data.balances || data.balances.length === 0) {
        container.innerHTML = '<p class="text-gray-400">No cryptocurrency balances found.</p>';
        return;
    }
    let html = '';
    // Current mining
    const currentMining = data.currentMining || 'BTC';
    html += `<p class="text-sm text-blue-400 mb-4">Currently mining: <span class="font-bold">${currentMining}</span></p>`;
    // Total value
    html += `<p class="text-xl mb-6">Total value: <span class="font-bold text-green-400">$${data.totalUSD}</span></p>`;
    // Individual balances
    data.balances.forEach(balance => {
        html += `
        <div class="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <img src="${balance.logoUrl}" alt="${balance.symbol}" class="w-10 h-10 mr-3">
                    <div>
                        <h3 class="text-lg font-semibold">${balance.name} (${balance.symbol})</h3>
                        <p class="text-gray-400">$${typeof balance.price === 'number' ? balance.price.toLocaleString() : balance.price}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold">${balance.confirmedBalance} ${balance.symbol}</p>
                    <p class="text-yellow-400">${balance.pendingBalance} ${balance.symbol} pending</p>
                    <p class="text-green-400">$${balance.totalUSD}</p>
                </div>
            </div>
            <!-- Pool Info Section -->
            <div class="mt-3 pt-3 border-t border-gray-700 grid grid-cols-4 gap-2 text-sm">
                <div>
                    <p class="text-gray-400">Algorithm</p>
                    <p>${balance.algorithm}</p>
                </div>
                <div>
                    <p class="text-gray-400">Difficulty</p>
                    <p>${balance.difficulty}</p>
                </div>
                <div>
                    <p class="text-gray-400">Min Payout</p>
                    <p>${balance.minPayout} ${balance.symbol}</p>
                </div>
                <div>
                    <p class="text-gray-400">Block Reward</p>
                    <p>${balance.blockReward} ${balance.symbol}</p>
                </div>
            </div>
        </div>
        `;
    });
    container.innerHTML = html;
}
// Function to load available cryptocurrencies
function loadAvailableCryptocurrencies() {
    console.log('Fetching cryptocurrencies from: http://localhost:8585/api/mining/cryptocurrencies');
    // Sample cryptocurrency data to display when backend is unavailable
    const sampleCryptos = [
        {
            id: 1,
            name: "Bitcoin",
            symbol: "BTC",
            price: 45000.0,
            logoUrl: "https://i.ibb.co/DgwJM9TQ/image.png",
            algorithm: "SHA-256",
            blockReward: 6.25,
            difficulty: "Very High",
            minPayout: 0.001
        },
        {
            id: 2,
            name: "Ethereum",
            symbol: "ETH",
            price: 3000.0,
            logoUrl: "https://i.ibb.co/v6Z6bsVK/image.png",
            algorithm: "Ethash",
            blockReward: 2.0,
            difficulty: "High",
            minPayout: 0.01
        },
        {
            id: 3,
            name: "Litecoin",
            symbol: "LTC",
            price: 80.0,
            logoUrl: "https://i.ibb.co/ZpBmmZrN/image.png",
            algorithm: "Scrypt",
            blockReward: 12.5,
            difficulty: "Medium",
            minPayout: 0.02
        },
        {
            id: 4,
            name: "Monero",
            symbol: "XMR",
            price: 170.0,
            logoUrl: "https://i.ibb.co/m5yHc70m/image.png",
            algorithm: "RandomX",
            blockReward: 0.6,
            difficulty: "Medium",
            minPayout: 0.01
        }
    ];
    // Try to fetch from the API first
    const currencyUrl = `${javaURI}/api/mining/cryptocurrencies`;
    console.log("Fetching currencies from:", currencyUrl);
    fetch(currencyUrl, fetchOptions)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(cryptos => {
            console.log('Received cryptocurrencies data:', cryptos);
            displayCryptocurrencies(cryptos);
        })
        .catch(error => {
            console.error('Error loading cryptocurrencies:', error);
            // Display sample data instead
            console.log('Using sample cryptocurrency data instead');
            displayCryptocurrencies(sampleCryptos);
        });
}
// Function to display cryptocurrencies
function displayCryptocurrencies(cryptos) {
    const container = document.getElementById('crypto-selection-container');
    if (!cryptos || cryptos.length === 0) {
        container.innerHTML = '<p class="text-gray-400">No cryptocurrencies available.</p>';
        return;
    }
    let html = '';
    cryptos.forEach(crypto => {
        // Use the same image URLs as the balance display section
        let logoUrl;
        switch(crypto.symbol) {
            case 'BTC':
                logoUrl = 'https://i.ibb.co/DgwJM9TQ/image.png';
                break;
            case 'ETH':
                logoUrl = 'https://i.ibb.co/v6Z6bsVK/image.png';
                break;
            case 'LTC':
                logoUrl = 'https://i.ibb.co/ZpBmmZrN/image.png';
                break;
            case 'XMR':
                logoUrl = 'https://i.ibb.co/m5yHc70m/image.png';
                break;
            default:
                logoUrl = crypto.logoUrl;
        }
        html += `
        <div class="bg-gray-800 rounded-lg p-3 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
             onclick="selectCryptocurrency('${crypto.symbol}')">
            <div class="flex items-center">
                <img src="${logoUrl}" alt="${crypto.symbol}" class="w-8 h-8 mr-2">
                <div>
                    <h4 class="font-semibold">${crypto.symbol}</h4>
                    <p class="text-xs text-gray-400">${crypto.name}</p>
                </div>
            </div>
        </div>
        `;
    });
    container.innerHTML = html;
}
// Function to select a cryptocurrency for mining
function selectCryptocurrency(symbol) {
    console.log(`Selecting cryptocurrency: ${symbol}`);
    // Save the selected cryptocurrency to localStorage
    localStorage.setItem('currentMiningCrypto', symbol);
    // Try to call the API first
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
            loadCryptoBalances(); // Refresh the balances display
            updateMiningStats(); // Refresh mining stats
        } else {
            showNotification(`Failed to select ${symbol}`, 'error');
        }
    })
    .catch(error => {
        console.error('Error selecting cryptocurrency:', error);
        // Simulate success even if the API call failed
        showNotification(`Now mining ${symbol} (simulated)`, 'success');
        // Manually update the UI with the new cryptocurrency
        document.getElementById('crypto-balances-container').querySelectorAll('.text-blue-400').forEach(el => {
            if (el.textContent.includes('Currently mining:')) {
                el.innerHTML = `Currently mining: <span class="font-bold">${symbol}</span>`;
            }
        });
        // Update mining stats
        updateMiningStats();
    });
}