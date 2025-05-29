---
layout: none
permalink: /investments/home
title: Investments Home
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investments Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
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
        .navbar .logo {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .navbar .nav-buttons {
            display: flex;
            gap: 20px;
        }
        .navbar .nav-buttons a {
            color: #fff;
            text-decoration: none;
            font-size: 16px;
            padding: 8px 16px;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        .navbar .nav-buttons a:hover {
            background-color: #ff8c00;
        }
        .dashboard {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 40px;
        }
        .section {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .section h2 {
            margin-top: 0;
            text-align: center;
        }
        .chart-container {
            margin-top: 20px;
            height: 400px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="logo">Investments Dashboard</div>
        <div class="nav-buttons">
            <a href="{{site.baseurl}}/investments/home">Home</a>
            <a href="{{site.baseurl}}/stocks/home">Stocks</a>
            <a href="{{site.baseurl}}/crypto/portfolio">Crypto</a>
            <a onclick="logout()" href="{{site.baseurl}}/investments/login">Logout</a>
        </div>
    </nav>

    <!-- Dashboard Content -->
    <div class="dashboard">
        <!-- Stocks Section -->
        <div class="section">
            <h2>Stocks Overview</h2>
            <div class="chart-container">
                <canvas id="stocks-chart"></canvas>
            </div>
        </div>

        <!-- Crypto Section -->
        <div class="section">
            <h2>Crypto Overview</h2>
            <div class="chart-container">
                <canvas id="crypto-chart"></canvas>
            </div>
        </div>
    </div>

    <script>
        const stocks = [
            { name: 'Spotify', price: 297408 },
            { name: 'Apple', price: 142845 },
            { name: 'Google', price: 2823894 },
            { name: 'Facebook', price: 208123 },
            { name: 'Microsoft', price: 330456 }
        ];

        drawChart('stocks-chart', stocks.map(s => s.name), stocks.map(s => s.price), 'Stock Prices');

        // Fetch and populate crypto data dynamically
        async function fetchCryptos() {
            try {
                const response = await fetch('http://localhost:8585/api/crypto/live');
                if (!response.ok) throw new Error('Failed to fetch crypto data');
                const cryptos = await response.json();
                drawCryptoChart(cryptos);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
            }
        }

        function drawCryptoChart(cryptos) {
            const labels = cryptos.map(c => c.name);
            const data = cryptos.map(c => c.price);
            drawChart('crypto-chart', labels, data, 'Crypto Prices');
        }

        // General chart drawing function
        function drawChart(canvasId, labels, data, label) {
            const ctx = document.getElementById(canvasId).getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: data,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Assets' } },
                        y: { title: { display: true, text: 'Price (USD)' } }
                    }
                }
            });
        }

        fetchCryptos();
    </script>
</body>
</html>
