---
layout: finance
title: Crypto Portfolio
type: issues
permalink: /crypto/portfolio
---

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
    }

    h1 {
        color: #333;
        margin-top: 20px;
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
        margin-bottom: 20px;
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
    .balance-container {
        background-color: #ffad00; /* Gold background */
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        color: #fff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s;
    }

    .balance-container:hover {
        transform: scale(1.05);
    }

    .balance-title {
        font-size: 1.2em;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .balance-amount {
        font-size: 2em;
        font-weight: 700;
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
        max-width: 500px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
        position: relative;
        color: #333;
    }

    .chart-container {
        height: 300px;
        margin: 20px 0;
    }

    .modal-close {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        font-size: 18px;
        color: #333;
    }

    .btn {
        padding: 10px 20px;
        margin: 10px;
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

    .btn-close {
        background-color: #555;
    }

    input[type="number"], input[type="text"] {
        width: 80%;
        padding: 8px;
        margin: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
    }
</style>


<div class="container">
    <div class="balance-container">
        <div class="balance-title">Current Balance</div>
        <div class="balance-amount" id="user-balance">Loading...</div>
    </div>

    <div class="crypto-list" id="crypto-list-container"></div>
</div>

<!-- Modal -->
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
        <!-- Search Bar -->
    <div class="container">
        <input type="text" id="crypto-search" placeholder="Search Crypto..." oninput="searchCrypto()">
        <div id="search-results"></div>
    </div>
</div>
<!-- Comparison Section in Modal -->
<div class="modal" id="compare-modal">
    <div class="modal-content">
        <span class="modal-close" onclick="closeCompareModal()">&times;</span>
        <h2>Crypto Comparison</h2>
        <div class="compare-inputs">
            <input type="text" id="crypto-compare-1" placeholder="Enter first crypto symbol">
            <input type="text" id="crypto-compare-2" placeholder="Enter second crypto symbol">
            <input type="number" id="compare-days" placeholder="Number of days">
            <button class="btn btn-buy" onclick="compareCryptos()">Compare</button>
        </div>
        <div id="compare-result"></div>
        <button class="btn btn-close" onclick="closeCompareModal()">Close</button>
    </div>
</div>
<!-- Button to trigger comparison modal -->
<div class="container">
    <button class="btn btn-buy" onclick="openCompareModal()">Compare Cryptos</button>
</div>

<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    let userEmail = "";
    let userBalance = localStorage.getItem("userBalance");

    async function fetchUser() {
        try {
            const response = await fetch(javaURI + `/api/person/get`, fetchOptions);
            if (response.ok) {
                const userInfo = await response.json();
                userEmail = userInfo.email;
                console.log("User email:", userEmail);
                document.getElementById('display-username').textContent = userInfo.name;
                localStorage.setItem("userEmail", userEmail);
                fetchUserBalance(); // Fetch balance after getting the email
            } else if (response.status === 401 || response.status === 201) {
                console.log("Guest");
                document.getElementById('display-username').textContent = "Guest";
                document.getElementById('user-balance').innerText = "0.00";
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

        // Make sure this function is in the global scope
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
                <div class="crypto-item" onclick="openModal(${JSON.stringify(crypto)})">
                    <strong>${crypto.name} (${crypto.symbol})</strong><br>
                    Price: $${crypto.price.toFixed(2)}
                </div>
            `;
        } catch (error) {
            console.error("Error searching crypto:", error);
        }
    }
    window.searchCrypto = searchCrypto;

// Make sure your HTML uses the function correctly, like this:
// <input type="text" id="crypto-search" oninput="searchCrypto()" placeholder="Search cryptocurrencies...">
    function updateBalance(balance) {
        const formattedBalance = parseFloat(balance).toFixed(2);
        document.getElementById('user-balance').innerText = formattedBalance;
        localStorage.setItem("userBalance", formattedBalance);
    }
    window.openCompareModal = function () {
        document.getElementById('compare-modal').style.display = 'flex';
    };
    window.closeCompareModal = function () {
        document.getElementById('compare-modal').style.display = 'none';
        document.getElementById('compare-result').innerHTML = "";
    };
    window.compareCryptos = async function () {
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
            console.error("Error comparing cryptos:", error);
            alert("Error fetching comparison data.");
        }
    };

    async function fetchUserBalance() {
        try {
            const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
            
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
            throw new Error("Response is not JSON");
            }

            const userData = await response.json();
            
            // Ensure the balance element exists
            const balanceElement = document.getElementById('user-balance');
            if (!balanceElement) {
            throw new Error("Balance element not found in DOM");
            }
            
            // Format balance with proper decimal places
            const balance = Number(userData.banks.balance).toFixed(2x);
            balanceElement.textContent = `$${balance}`;
            
        } catch (error) {
            console.error("Error loading balance:", error);
            const balanceElement = document.getElementById('user-balance');
            if (balanceElement) {
            balanceElement.textContent = "$0.00";
            }
        }
    }

    setInterval(fetchUserBalance, 5000);

    fetchUser();

    async function fetchCryptos() {
        try {
            const response = await fetch(`${javaURI}/api/crypto/live`, fetchOptions);
            if (!response.ok) throw new Error(`Failed to fetch crypto data: ${response.status}`);
            const container = document.getElementById('crypto-list-container');
            container.innerHTML = '';
            const cryptos = await response.json();
            cryptos.forEach(crypto => {
                const item = document.createElement('div');
                item.className = 'crypto-item';
                item.innerHTML = `<strong>${crypto.name}</strong><br>$${crypto.price.toFixed(2)}`;
                item.onclick = () => openModal(crypto);
                container.appendChild(item);
            });
        } catch (error) {
            console.error('Error fetching cryptos:', error);
        }
    }

    let cryptoChart;
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
                }
            });
        } catch (error) {
            console.error("Error fetching trend data:", error);
        }
    }

    window.openModal = function (crypto) {
        document.getElementById('modal-crypto-name').innerText = crypto.name;
        document.getElementById('modal-crypto-price').innerText = crypto.price.toFixed(2);
        document.getElementById('modal-crypto-change').innerText = crypto.changePercentage.toFixed(2);
        document.getElementById('crypto-modal').style.display = 'flex';
        fetchCryptoTrend(crypto.symbol.toLowerCase());
    };

    window.closeModal = function () {
        document.getElementById('crypto-modal').style.display = 'none';
    };

    window.buyCrypto = async function () {
        const cryptoId = document.getElementById('modal-crypto-name').innerText;
        const usdAmount = document.getElementById('buy-amount').value;
        if (usdAmount) {
            try {
                const response = await fetch(`${javaURI}/api/crypto/buy`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userEmail, cryptoId, usdAmount })
                });
                const message = await response.text();
                alert(message);
                fetchCryptos(); // Refresh data
            } catch (error) {
                console.error("Error buying crypto:", error);
            }
        }
    };

    window.sellCrypto = async function () {
        const cryptoId = document.getElementById('modal-crypto-name').innerText;
        const cryptoAmount = document.getElementById('sell-amount').value;
        if (cryptoAmount) {
            try {
                const response = await fetch(`${javaURI}/api/crypto/sell`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userEmail, cryptoId, cryptoAmount })
                });
                const message = await response.text();
                alert(message);
                fetchCryptos(); // Refresh data
            } catch (error) {
                console.error("Error selling crypto:", error);
            }
        }
    };

    fetchUserBalance();
    fetchCryptos();
</script>a