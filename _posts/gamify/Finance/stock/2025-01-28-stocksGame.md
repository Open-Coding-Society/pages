---
layout: fortunefinders
permalink: /stocks/game
title: Stocks Game
---

<html lang="en">
    <title>Stocks Game - Simulate 5 Years</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
      font-family: Arial, sans-serif;
      background-color: #0f0f0f;
      color: #fff;
      margin: 0;
      padding: 0;
    }
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            background-color: #001f3f;
            color: #fff;
        }
        .container {
            padding: 30px;
            text-align: center;
        }
        .search-container {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
        }
        .search-container input {
            padding: 12px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            background-color: #6ab8f9;
        }
        .search-button {
            background-color: #ff8c00;
            color: #fff;
            border: none;
            padding: 12px 20px;
            cursor: pointer;
            font-size: 16px;
            border-radius: 4px;
        }
        .money-display {
            font-size: 24px;
            font-weight: bold;
            color: #2e7d32;
            margin-bottom: 20px;
        }
        .selected-stocks {
            width: 50%;
            background-color: #121212;
            padding: 20px;
            border-radius: 8px;
            color: white;
            margin: 0 auto;
        }
        .selected-stocks table {
            width: 100%;
            border-collapse: collapse;
            background-color: #1e1e1e;
        }
        .selected-stocks th, .selected-stocks td {
            padding: 12px;
            border-bottom: 1px solid #444;
            text-align: left;
        }
        .simulate-button {
            background-color: #001f3f;
            color: white;
            padding: 15px;
            font-size: 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
        }
        .simulate-button:hover {
            background-color: #ff8c00;
        }
    </style>

    <div class="container">
        <h1>Stock Market Simulation Game</h1>
        <p>Pick stocks and simulate their growth over 5 years!</p>
        <div class="money-display" id="moneyDisplay">Balance: $10,000</div>
        <div class="search-container">
            <input type="text" id="stockSearch" placeholder="Search Stock Symbol">
            <input type="number" id="stockQuantity" placeholder="Qty" min="1">
            <button class="search-button" onclick="addStock()">Add Stock</button>
        </div>
        <div class="selected-stocks">
            <h2>Your Selected Stocks</h2>
            <table id="stockTable">
                <tr>
                    <th>Stock</th>
                    <th>Shares</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
            </table>
        </div>
        <button class="simulate-button" onclick="submitStocks()">Submit Stocks</button>
    </div>
    <script type="module">
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    window.javaURI = javaURI; // Make sure javaURI is accessible globally
    const STOCK_API = "https://nitdpython.stu.nighthawkcodingsociety.com/api/stocks/price_five_years_ago/";
    let balance = 10000;
    let userStocks = {};
    document.getElementById("moneyDisplay").textContent = `Balance: $${balance.toFixed(2)}`;
    async function getStockPrice(symbol) {
        try {
            const response = await fetch(`${STOCK_API}${symbol}`);
            if (!response.ok) throw new Error("Stock not found.");
            const data = await response.json();
            return data.price_five_years_ago;
        } catch (err) {
            console.error("Stock fetch error:", err);
            return null;
        }
    }
    async function addStock() {
        const stockSymbol = document.getElementById("stockSearch").value.trim().toUpperCase();
        const quantity = parseInt(document.getElementById("stockQuantity").value.trim(), 10);
        if (!stockSymbol || isNaN(quantity) || quantity <= 0) {
            alert("Enter a valid stock symbol and quantity.");
            return;
        }
        const stockPrice = await getStockPrice(stockSymbol);
        if (stockPrice === null) {
            alert("Stock not found.");
            return;
        }
        const totalCost = stockPrice * quantity;
        if (totalCost > balance) {
            alert("Insufficient funds!");
            return;
        }
        balance -= totalCost;
        userStocks[stockSymbol] = (userStocks[stockSymbol] || 0) + quantity;
        updateUI();
    }
    function removeStock(symbol) {
        if (!userStocks[symbol]) return;
        getStockPrice(symbol).then(stockPrice => {
            balance += stockPrice * userStocks[symbol];
            delete userStocks[symbol];
            updateUI();
        });
    }
    function updateUI() {
        document.getElementById("moneyDisplay").textContent = `Balance: $${balance.toFixed(2)}`;
        const table = document.getElementById("stockTable");
        table.innerHTML = `
            <tr>
                <th>Stock</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Action</th>
            </tr>
        `;
        Object.keys(userStocks).forEach(symbol => {
            getStockPrice(symbol).then(price => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${symbol}</td>
                    <td>${userStocks[symbol]}</td>
                    <td>$${price.toFixed(2)}</td>
                    <td><button onclick="removeStock('${symbol}')">Sell</button></td>
                `;
                table.appendChild(row);
            });
        });
    }
    function getCredentialsJava() {
        const URL = javaURI + '/api/person/get';
        return fetch(URL, fetchOptions)
            .then(response => {
                if (response.status !== 200) {
                    console.error("HTTP status code: " + response.status);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (data === null) return null;
                console.log(data);
                return data;
            })
            .catch(err => {
                console.error("Fetch error: ", err);
                return null;
            });
    }
    async function submitStocks() {
    const stockList = Object.entries(userStocks).map(([symbol, quantity]) => ({
        stockSymbol: symbol,
        quantity: quantity
    }));

    const credentials = await getCredentialsJava(); // Get user data
    const email = credentials?.email; // Extract email
    const payload = { username: email, stocks: stockList };

    console.log("Submitting payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(`${javaURI}/stocks/table/simulateStocks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.text(); // Get raw response as text
        console.log("Server response:", result);

        if (!response.ok) {
            alert("Error submitting stocks: " + result);
            return;
        }

        // Extract updated balance from response
        const match = result.match(/Updated Balance: (\d+(\.\d+)?)/); // Regex to extract balance
        if (match) {
            balance = parseFloat(match[1]); // Update balance variable
            document.getElementById("moneyDisplay").textContent = `Balance: $${balance.toFixed(2)}`;
        }

        alert("Stocks successfully simulated!");
        userStocks = {}; // Reset selected stocks after simulation
        updateUI();
    } catch (err) {
        console.error("Stock simulation error:", err);
    }

}
async function getUserBalance() {
try {
const credentials = await getCredentialsJava(); // Fetch user data
const userId = credentials?.id; // Extract user ID

        if (!userId) {
            console.error("User ID not found in credentials.");
            return;
        }

        const balanceResponse = await fetch(`${javaURI}/api/person/${userId}/balance`, fetchOptions);

        if (!balanceResponse.ok) {
            console.error("Failed to fetch balance. HTTP Status:", balanceResponse.status);
            return;
        }

        const balanceData = await balanceResponse.json();
        balance = parseFloat(balanceData.balance); // Update global balance variable

        // Update UI
        document.getElementById("moneyDisplay").textContent = `Balance: $${balance.toFixed(2)}`;
    } catch (error) {
        console.error("Error fetching user balance:", error);
    }

}

// Run on page load
window.onload = getUserBalance;

    // Make functions globally available
    window.addStock = addStock;
    window.removeStock = removeStock;
    window.submitStocks = submitStocks;

</script>
</html>
