---
layout: finance
title: Bank Analytics
permalink: /gamify/bankanalytics
---
<html lang="en">

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
    .nav-link-custom {
        transition: transform 0.3s;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 6px;
    }
    .nav-link-custom:hover {
        background-color: #ff9800;
        transform: scale(1.1);
    }
    th.custom-th {
        background-color: #ff9800;
        color: #000;
        text-transform: uppercase;
        font-size: 14px;
    }
    td.custom-td {
        background-color: #2a2a2a;
        border-bottom: 1px solid #444;
        transition: background 0.3s;
    }
    tr:hover td.custom-td {
        background-color: #ff22a6;
        color: #fff;
    }
</style>
<body class="m-0 p-0" style="font-family: 'Poppins', sans-serif; background-color: #121212; color: #fff;">

<br>
<h1 class="text-center">Bank Analytics</h1>

<div class="container my-4">
    <div class="row g-4">
        <!-- User Details Section -->
        <div class="col-md">
            <div class="p-4 rounded shadow" style="background-color: #1f1f1f;">
                <div class="mb-4 text-start">
                    <h2 class="mb-3" style="color: #ff9800;">User Analytics</h2>
                    <div class="p-3 rounded" style="background-color: #2a2a2a;">
                        <div class="mb-3" style="font-size: 18px;">
                            <span style="color: #ff9800; margin-right: 10px;">Username:</span>
                            <span class="name">Loading...</span>
                        </div>
                        <div class="mb-3" style="font-size: 18px;">
                            <span style="color: #ff9800; margin-right: 10px;">Account Balance:</span>
                            <span class="balance">Loading...</span>
                        </div>
                        <div class="mb-3" style="font-size: 18px;">
                            <span style="color: #ff9800; margin-right: 10px;">Total Transactions:</span>
                            <span class="total-transactions">0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Balance Chart Section -->
<div class="container my-4">
    <div class="p-4 rounded shadow" style="background-color: #1f1f1f;">
        <h2 class="mb-3" style="color: #ff9800;">Balance Change History</h2>
        <div class="p-3 mb-3 rounded" style="background-color: #2a2a2a;">
            <label for="categorySelect" class="me-2">Select Category:</label>
            <select id="categorySelect" class="form-select d-inline-block w-auto" style="background-color: #3a3a3a; border: 1px solid #ff9800; color: #fff;">
                <option value="">Select a category</option>
                <option value="poker">Poker</option>
                <option value="blackjack">Blackjack</option>
                <option value="dices">Dices</option>
            </select>
        </div>
        <div class="chart-container" style="height: 400px;">
            <canvas id="balanceChart"></canvas>
        </div>
    </div>
</div>

<script type="module">
import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

let userId = null;
let balanceChart = null;

async function fetchUserDetails() {
    try {
        const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        
        userId = userData.id;
        
        document.querySelector('.name').textContent = userData.uid || "Unknown";
        document.querySelector('.balance').textContent = `$${Number(userData.balance).toFixed(2)}`;
        
        initCategoryDropdown();
        fetchProfitData('poker');
    } catch (error) {
        console.error("Error fetching user data:", error);
        document.querySelector('.name').textContent = "Error loading user";
    }
}

function initCategoryDropdown() {
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.addEventListener('change', (e) => {
        if (e.target.value) {
            fetchProfitData(e.target.value);
        } else {
            clearChart();
        }
    });
}

async function fetchProfitData(category) {
    if (!userId) return;

    try {
        const response = await fetch(`${javaURI}/bank/${userId}/profitmap/${category}`, {
            ...fetchOptions,
            method: 'GET'
        });
        
        if (!response.ok) throw new Error(`Failed to fetch ${category} data`);
        const transactions = await response.json();
        updateChart(category, transactions);
    } catch (error) {
        console.error(`Error fetching ${category} data:`, error);
        clearChart();
    }
}

function updateChart(category, transactions) {
    if (!transactions || !Array.isArray(transactions)) {
        clearChart();
        return;
    }
    
    document.querySelector('.total-transactions').textContent = transactions.length;
    
    const timestamps = [];
    const profits = [];
    
    transactions.forEach(transaction => {
        if (Array.isArray(transaction) && transaction.length >= 2) {
            let timestamp;
            try {
                timestamp = new Date(transaction[0]).toLocaleDateString();
            } catch (e) {
                timestamp = new Date().toLocaleDateString();
            }
            
            let profit = 0;
            if (typeof transaction[1] === 'number') {
                profit = transaction[1];
            } else if (typeof transaction[1] === 'string') {
                profit = parseFloat(transaction[1]) || 0;
            }
            
            timestamps.push(timestamp);
            profits.push(profit);
        }
    });
    
    const cumulativeBalance = [];
    let balance = 0;
    for (const profit of profits) {
        balance += profit;
        cumulativeBalance.push(balance);
    }
    
    const chartData = {
        labels: timestamps,
        datasets: [
            {
                label: `Balance Changes - ${category}`,
                data: profits,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                tension: 0.1
            },
            {
                label: `Cumulative Balance - ${category}`,
                data: cumulativeBalance,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                tension: 0.1
            }
        ]
    };
    
    const ctx = document.getElementById('balanceChart').getContext('2d');
    
    if (balanceChart) {
        balanceChart.data = chartData;
        balanceChart.update();
    } else {
        balanceChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Balance Change History',
                        color: '#ffffff'
                    },
                    legend: {
                        labels: { color: '#ffffff' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            color: '#ffffff',
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }
}

function clearChart() {
    if (balanceChart) {
        balanceChart.data.labels = [];
        balanceChart.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        balanceChart.update();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchUserDetails();
});
</script>
</body>
</html>
