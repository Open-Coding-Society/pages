---
layout: base
title: Energy Store
type: page
permalink: /crypto/energy-store
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Energy Store</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>

<link rel="stylesheet" href="crypto.scss">

<body>
    <div class="main-content container mx-auto mt-8">
        <!-- Page Title -->
        <h1 class="text-3xl font-bold text-center mb-6">⚡Energy Store</h1>
        <!-- Energy Store Section -->
        <div id="energy-store" class="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 class="text-xl font-bold text-green-400 mb-4">🛒 Available Energy Plans</h2>
            <div id="supplier-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
                <!-- Energy plan cards -->
                <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 class="text-2xl font-semibold text-green-400">Tesla Energy</h3>
                    <p class="text-lg mt-2">EEM: 0.12</p>
                    <button class="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onclick="buyEnergyPlan('Tesla Energy', 0.12)">Buy</button>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 class="text-2xl font-semibold text-green-400">Duke Energy</h3>
                    <p class="text-lg mt-2">EEM: 0.15</p>
                    <button class="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onclick="buyEnergyPlan('Duke Energy', 0.15)">Buy</button>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 class="text-2xl font-semibold text-green-400">Pacific Gas and Electric</h3>
                    <p class="text-lg mt-2">EEM: 0.18</p>
                    <button class="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onclick="buyEnergyPlan('Pacific Gas and Electric', 0.18)">Buy</button>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 class="text-2xl font-semibold text-green-400">NextEra Energy</h3>
                    <p class="text-lg mt-2">EEM: 0.21</p>
                    <button class="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onclick="buyEnergyPlan('NextEra Energy', 0.21)">Buy</button>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 class="text-2xl font-semibold text-green-400">Southern Company</h3>
                    <p class="text-lg mt-2">EEM: 0.24</p>
                    <button class="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onclick="buyEnergyPlan('Southern Company', 0.24)">Buy</button>
                </div>
            </div>
        </div>
    </div>
    <script>
        // Function to handle the "Buy" button click
        async function buyEnergyPlan(supplierName, eem) {
            try {
                // Prepare data to send in POST request
                const data = {
                    supplierName: supplierName,
                    eem: eem
                };
                // Send a POST request to the backend
                const response = await fetch('/chenergy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                // Check if the response is OK
                if (response.ok) {
                    const result = await response.json();
                    alert(`Successfully bought plan: ${supplierName} with EEM: ${eem}`);
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (error) {
                console.error('Error buying energy plan:', error);
                alert('Failed to process your purchase. Please try again later.');
            }
        }
    </script>
</body>
</html>
