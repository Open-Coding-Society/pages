---
layout: finance
title: Crypto Portfolio
type: issues
permalink: /crypto/portfolio
---

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crypto Portfolio</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  h1 {
    color: #333;
    margin-top: 40px;
    text-align: center;
  }

  .container {
    max-width: 1000px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .top-controls {
    margin-bottom: 20px;
  }

  .btn {
    padding: 10px 20px;
    margin: 10px 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: #fff;
    font-size: 1em;
  }

  .btn-buy {
    background-color: #4CAF50;
  }

  .btn-sell {
    background-color: #f44336;
  }

  input[type="number"],
  input[type="text"] {
    width: 80%;
    padding: 8px;
    margin: 10px auto;
    border-radius: 5px;
    border: 1px solid #ccc;
    display: block;
  }

  .crypto-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    overflow-y: auto;
    max-height: 400px;
    padding: 10px;
    background-color: #fafafa;
    border-radius: 10px;
    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .crypto-item {
    background-color: #333;
    color: #fff;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    text-align: center;
    width: 120px;
    transition: transform 0.2s;
  }

  .crypto-item:hover {
    transform: scale(1.05);
    background-color: #444;
  }

  .modal {
    display: none;
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 420px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
    color: #333;
  }

  .chart-container {
    height: 200px;
    margin: 20px 0;
  }

  canvas#crypto-chart {
    max-height: 180px;
    width: 100%;
  }

  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 18px;
    color: #333;
  }

  .error-message {
    color: #f44336;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 5px;
    margin: 10px 0;
  }

  .loading-message {
    color: #2196F3;
    padding: 10px;
    background-color: #e3f2fd;
    border-radius: 5px;
    margin: 10px 0;
  }

  /* Hide top navigation bar elements */
  header.site-header,
  .navbar-top,
  .top-nav,
  .main-navbar,
  .header-bar {
    display: none !important;
  }
</style>

<div class="container">
  <h1>Crypto Portfolio</h1>

  <!-- 🔝 Top controls moved above crypto list -->
  <div class="top-controls">
    <button class="btn btn-buy" onclick="openHoldingsModal()">View Current Holdings</button>
    <button class="btn btn-sell" onclick="openHistoryModal()">View Purchase History</button>
    <input type="text" id="crypto-search" placeholder="Search Crypto..." oninput="searchCrypto()">
    <div id="search-results"></div>
  </div>

  <!-- 🔽 Crypto List -->
  <div class="crypto-list" id="crypto-list-container">
    <div class="loading-message">Loading cryptocurrencies...</div>
  </div>
</div>

<!-- 🔳 MODALS (holdings, history, etc.) -->
<div class="modal" id="crypto-modal">
  <div class="modal-content">
    <span class="modal-close" onclick="closeModal()">&times;</span>
    <h2 id="modal-crypto-name">Crypto Details</h2>
    <p>Current Price: $<span id="modal-crypto-price"></span></p>
    <p>Change (24h): <span id="modal-crypto-change"></span>%</p>
    <div class="chart-container">
      <canvas id="crypto-chart"></canvas>
    </div>
    <label for="buy-amount">Amount in USD to buy:</label>
    <input type="number" id="buy-amount" placeholder="Enter amount in USD">
    <button class="btn btn-buy" onclick="buyCrypto()">Buy</button>
    <label for="sell-amount">Amount to sell (in crypto):</label>
    <input type="number" id="sell-amount" placeholder="Enter amount in crypto">
    <button class="btn btn-sell" onclick="sellCrypto()">Sell</button>
    <button class="btn btn-close" onclick="closeModal()">Close</button>
  </div>
</div>

<div class="modal" id="holdingsModal">
  <div class="modal-content">
    <span class="modal-close" onclick="closeHoldingsModal()">&times;</span>
    <h3>Your Crypto Holdings</h3>
    <table id="cryptoHoldingsModalTable">
      <tr><th>Crypto</th><th>Amount</th></tr>
    </table>
  </div>
</div>

<div class="modal" id="historyModal">
  <div class="modal-content">
    <span class="modal-close" onclick="closeHistoryModal()">&times;</span>
    <h3>Crypto Transaction History</h3>
    <table id="fullCryptoHistoryTable">
      <tr><th>Type</th><th>Crypto Amount</th><th>Dollar Value</th><th>Timestamp</th></tr>
    </table>
  </div>
</div>

<!-- 🧠 Add your JavaScript here -->
<script type="module">
// Keep your entire script block from previous version
</script>

</body>
</html>

<script type="module">
import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

// 🟢 Modal: Holdings
function openHoldingsModal() {
    document.getElementById("holdingsModal").style.display = "flex";
    updateCryptoHoldingsTable();
}
function closeHoldingsModal() {
    document.getElementById("holdingsModal").style.display = "none";
}

// 🔴 Modal: History
function openHistoryModal() {
    document.getElementById("historyModal").style.display = "flex";
    updateCryptoHistoryTable();
}

function closeHistoryModal() {
    document.getElementById("historyModal").style.display = "none";
}

// 🛠️ Update Holdings Table
async function updateCryptoHoldingsTable() {
    try {
        const response = await fetch(`${javaURI}/api/crypto/holdings?email=${encodeURIComponent(userEmail)}`);
        const data = await response.json();
        const holdingsString = data?.holdings;
        const table = document.getElementById("cryptoHoldingsModalTable");

        table.innerHTML = `<tr><th>Crypto</th><th>Amount</th></tr>`;
        if (!holdingsString || holdingsString.trim() === "") {
            table.innerHTML += '<tr><td colspan="2">No holdings</td></tr>';
            return;
        }

        holdingsString.split(",").forEach(item => {
            const [cryptoId, amount] = item.split(":");
            const row = document.createElement("tr");
            row.innerHTML = `<td>${cryptoId.trim()}</td><td>${parseFloat(amount).toFixed(6)}</td>`;
            table.appendChild(row);
        });
    } catch (err) {
        console.error("🚨 Error loading holdings:", err);
    }
}

// 🛠️ Update History Table
async function updateCryptoHistoryTable() {
    try {
        const response = await fetch(`${javaURI}/api/crypto/history?email=${encodeURIComponent(userEmail)}`);
        const data = await response.json();
        const history = data?.cryptoHistory || "";
        const table = document.getElementById("fullCryptoHistoryTable");

        table.innerHTML = `
            <tr>
                <th>Type</th>
                <th>Crypto Amount</th>
                <th>Dollar Value</th>
                <th>Timestamp</th>
            </tr>`;

        if (!history.trim()) return;

        history.split("\n").forEach(tx => {
            const parsed = parseTransaction(tx);
            if (parsed) table.appendChild(createTransactionRow(parsed));
        });
    } catch (err) {
        console.error("🚨 Error loading history:", err);
    }
}

function parseTransaction(tx) {
    const regex = /(Bought|Sold)\s([\d.]+)\s([A-Z]+)\sfor\s\$([\d.]+)\sat\s([\d-:\s]+)/;
    const match = tx.match(regex);
    if (!match) return null;
    return {
        type: match[1],
        amount: `${match[2]} ${match[3]}`,
        value: `$${parseFloat(match[4]).toFixed(2)}`,
        timestamp: match[5]
    };
}

function createTransactionRow({ type, amount, value, timestamp }) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${type}</td><td>${amount}</td><td>${value}</td><td>${timestamp}</td>`;
    return row;
}


    let userEmail = "";
    let userBalance = 0;
    let cryptoChart;

    // Initialize the application
    document.addEventListener('DOMContentLoaded', function() {
        console.log("🚀 DOM fully loaded, initializing app...");
        initializeApp();
    });

    async function initializeApp() {
        try {
            await fetchUser();
            await fetchCryptos();
            
            // Set up periodic refresh
            setInterval(fetchCryptos, 30000); // Refresh every 30 seconds
            setInterval(fetchUserBalance, 10000); // Refresh balance every 10 seconds
        } catch (error) {
            console.error("❌ Error initializing app:", error);
            showError("Failed to initialize application");
        }
    }

    async function fetchUser() {
        try {
            const response = await fetch(javaURI + `/api/person/get`, fetchOptions);
            if (response.ok) {
                const userInfo = await response.json();
                userEmail = userInfo.email;
                console.log("✅ User email:", userEmail);
                await fetchUserBalance();
            } else if (response.status === 401 || response.status === 201) {
                console.log("👤 Guest user");
                userEmail = "guest";
            } else {
                throw new Error(`Failed to fetch user: ${response.status}`);
            }
        } catch (error) {
            console.error("❌ Error fetching user:", error);
            userEmail = "guest";
        }
    }

    async function fetchUserBalance() {
        if (userEmail === "guest") return;
        
        try {
            const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();
            
            if (userData.banks && userData.banks.balance !== undefined) {
                userBalance = Number(userData.banks.balance).toFixed(2);
                console.log("✅ User balance updated:", userBalance);
            }
            
        } catch (error) {
            console.error("❌ Error loading balance:", error);
            userBalance = "0.00";
        }
    }

    async function fetchCryptos() {
        console.log("📡 Fetching cryptocurrencies...");
        
        const container = document.getElementById('crypto-list-container');
        if (!container) {
            console.error("❌ Container element not found");
            return;
        }

        try {
            // Show loading state
            container.innerHTML = '<div class="loading-message">Loading cryptocurrencies...</div>';

            const response = await fetch(`${javaURI}/api/crypto/live`, fetchOptions);
            
            console.log("📊 API Response Status:", response.status);
            console.log("📊 API Response Headers:", response.headers);

            if (!response.ok) {
                throw new Error(`Failed to fetch crypto data. Status: ${response.status} ${response.statusText}`);
            }

            const responseText = await response.text();
            // console.log("📋 Raw response:", responseText);

            let cryptos;
            try {
                cryptos = JSON.parse(responseText);
            } catch (parseError) {
                console.error("❌ Failed to parse JSON:", parseError);
                throw new Error("Invalid JSON response from server");
            }

            console.log("✅ Parsed Cryptos:", cryptos);

            // Clear container
            container.innerHTML = '';

            if (!Array.isArray(cryptos)) {
                console.error("❌ Expected array, got:", typeof cryptos);
                throw new Error("Invalid data format: expected array");
            }

            if (cryptos.length === 0) {
                container.innerHTML = '<div class="error-message">No cryptocurrencies available</div>';
                return;
            }

            // Render cryptocurrencies
            cryptos.forEach((crypto, index) => {
                console.log(`🔢 Processing crypto [${index}]:`, crypto);

                // Validate crypto object
                if (!crypto || typeof crypto !== 'object') {
                    console.warn("⚠️ Invalid crypto object:", crypto);
                    return;
                }

                const name = crypto.name || crypto.id || 'Unknown';
                const symbol = crypto.symbol || '';
                const price = typeof crypto.price === 'number' ? crypto.price : 
                             typeof crypto.current_price === 'number' ? crypto.current_price : 0;

                const item = document.createElement('div');
                item.className = 'crypto-item';
                item.innerHTML = `
                    <strong>${name}${symbol ? ` (${symbol.toUpperCase()})` : ''}</strong><br>
                    $${price.toFixed(2)}
                `;
                
                item.onclick = () => openModal(crypto);
                container.appendChild(item);
            });

            console.log(`✅ Successfully rendered ${cryptos.length} cryptocurrencies`);

        } catch (error) {
            console.error("❌ Error in fetchCryptos():", error);
            showError(`Failed to load cryptocurrencies: ${error.message}`);
        }
    }

    function showError(message) {
        const container = document.getElementById('crypto-list-container');
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }

    // Search functionality
    async function searchCrypto() {
        const query = document.getElementById('crypto-search').value.trim();
        const resultsContainer = document.getElementById('search-results');
        
        if (query.length < 2) {
            resultsContainer.innerHTML = "";
            return;
        }
        
        try {
            const response = await fetch(`${javaURI}/api/crypto/search?cryptoId=${encodeURIComponent(query)}`, fetchOptions);
            
            if (!response.ok) {
                resultsContainer.innerHTML = "<p>No results found</p>";
                return;
            }
            
            const crypto = await response.json();
            resultsContainer.innerHTML = `
                <div class="crypto-item" onclick="openModal(${JSON.stringify(crypto).replace(/"/g, '&quot;')})">
                    <strong>${crypto.name} (${crypto.symbol})</strong><br>
                    Price: $${crypto.price.toFixed(2)}
                </div>
            `;
        } catch (error) {
            console.error("❌ Error searching crypto:", error);
            resultsContainer.innerHTML = "<p>Error searching cryptocurrencies</p>";
        }
    }

    // Modal functions
    function openModal(crypto) {
        console.log("🔍 Opening modal for:", crypto);
        
        const name = crypto.name || crypto.id || 'Unknown';
        const price = typeof crypto.price === 'number' ? crypto.price : 
                     typeof crypto.current_price === 'number' ? crypto.current_price : 0;
        const change = crypto.changePercentage || crypto.price_change_percentage_24h || 0;
        
        document.getElementById('modal-crypto-name').innerText = name;
        document.getElementById('modal-crypto-price').innerText = price.toFixed(2);
        document.getElementById('modal-crypto-change').innerText = change.toFixed(2);
        document.getElementById('crypto-modal').style.display = 'flex';
        
        // Fetch trend data
        const symbol = crypto.symbol || crypto.id || name.toLowerCase();
        fetchCryptoTrend(symbol);
    }

    function closeModal() {
        document.getElementById('crypto-modal').style.display = 'none';
        if (cryptoChart) {
            cryptoChart.destroy();
            cryptoChart = null;
        }
    }

    async function fetchCryptoTrend(cryptoId) {
        try {
            const response = await fetch(`${javaURI}/api/crypto/trend?cryptoId=${cryptoId}&days=7`, fetchOptions);
            if (!response.ok) throw new Error("Failed to fetch trend data");
            
            const prices = await response.json();
            
            const ctx = document.getElementById('crypto-chart').getContext('2d');
            if (cryptoChart) {
                cryptoChart.destroy();
            }
            
            cryptoChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: prices.length }, (_, i) => `Day ${i + 1}`),
                    datasets: [{
                        label: `${cryptoId} Price Trend`,
                        data: prices,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        } catch (error) {
            console.error("❌ Error fetching trend data:", error);
        }
    }

    // Trading functions
    async function buyCrypto() {
        const cryptoId = document.getElementById('modal-crypto-name').innerText;
        const usdAmount = document.getElementById('buy-amount').value;
        
        if (!usdAmount || usdAmount <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        
        if (userEmail === "guest") {
            alert("Please log in to buy cryptocurrencies");
            return;
        }
        
        try {
            const response = await fetch(`${javaURI}/api/crypto/buy`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, cryptoId, usdAmount: parseFloat(usdAmount) })
            });
            
            const message = await response.text();
            alert(message);
            
            if (response.ok) {
                document.getElementById('buy-amount').value = '';
                await fetchUserBalance();
            }
        } catch (error) {
            console.error("❌ Error buying crypto:", error);
            alert("Error processing purchase");
        }
    }

    async function sellCrypto() {
        const cryptoId = document.getElementById('modal-crypto-name').innerText;
        const cryptoAmount = document.getElementById('sell-amount').value;
        
        if (!cryptoAmount || cryptoAmount <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        
        if (userEmail === "guest") {
            alert("Please log in to sell cryptocurrencies");
            return;
        }
        
        try {
            const response = await fetch(`${javaURI}/api/crypto/sell`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, cryptoId, cryptoAmount: parseFloat(cryptoAmount) })
            });
            
            const message = await response.text();
            alert(message);
            
            if (response.ok) {
                document.getElementById('sell-amount').value = '';
                await fetchUserBalance();
            }
        } catch (error) {
            console.error("❌ Error selling crypto:", error);
            alert("Error processing sale");
        }
    }

    // Comparison functions
    function openCompareModal() {
        document.getElementById('compare-modal').style.display = 'flex';
    }

    function closeCompareModal() {
        document.getElementById('compare-modal').style.display = 'none';
        document.getElementById('compare-result').innerHTML = "";
    }

    async function compareCryptos() {
        const cryptoId1 = document.getElementById('crypto-compare-1').value.trim();
        const cryptoId2 = document.getElementById('crypto-compare-2').value.trim();
        const days = document.getElementById('compare-days').value;
        
        if (!cryptoId1 || !cryptoId2 || !days) {
            alert("Please fill all fields.");
            return;
        }
        
        try {
            const response = await fetch(`${javaURI}/api/crypto/compare?cryptoId1=${encodeURIComponent(cryptoId1)}&cryptoId2=${encodeURIComponent(cryptoId2)}&days=${days}`, fetchOptions);
            
            if (!response.ok) throw new Error("Failed to fetch comparison data.");
            
            const data = await response.json();
            const resultDiv = document.getElementById('compare-result');
            
            resultDiv.innerHTML = `
                <p><strong>${data.cryptoId1}:</strong> ${data.cryptoId1ChangePercent.toFixed(2)}%</p>
                <p><strong>${data.cryptoId2}:</strong> ${data.cryptoId2ChangePercent.toFixed(2)}%</p>
            `;
        } catch (error) {
            console.error("❌ Error comparing cryptos:", error);
            alert("Error fetching comparison data.");
        }
    }

    // Placeholder functions for buttons that don't have implementations yet
    function viewHoldings() {
        alert("Holdings view - implementation needed");
    }

    function viewHistory() {
        alert("Purchase history view - implementation needed");
    }

    // Make functions globally available
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.buyCrypto = buyCrypto;
    window.sellCrypto = sellCrypto;
    window.openCompareModal = openCompareModal;
    window.closeCompareModal = closeCompareModal;
    window.compareCryptos = compareCryptos;
    window.searchCrypto = searchCrypto;
    // window.viewHoldings = viewHoldings;
    // window.viewHistory = viewHistory;
    window.openHoldingsModal = openHoldingsModal;
    window.closeHoldingsModal = closeHoldingsModal;
    window.openHistoryModal = openHistoryModal;
    window.closeHistoryModal = closeHistoryModal;


</script>

</body>
</html>