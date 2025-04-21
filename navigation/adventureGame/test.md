---
layout: base
title: Adventure Game Test
permalink: /gamify/test
---
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Person High Scores</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 2rem;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        table {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            border-collapse: collapse;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #009879;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f3f3f3;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        .loading {
            text-align: center;
            margin: 2rem;
        }
        .error {
            color: red;
            text-align: center;
            margin: 2rem;
        }
    </style>
</head>
<body>
    <h1>Adventure Game High Scores</h1>
    <div id="tableContainer">
        <p class="loading">Loading data...</p>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Fetch data from the API
            fetch('http://localhost:8085/api/people')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Create table with the data
                    renderTable(data);
                })
                .catch(error => {
                    document.getElementById('tableContainer').innerHTML = 
                        `<p class="error">Error loading data: ${error.message}. Make sure your API is running at http://localhost:8085/api/people</p>`;
                });
        });
        function renderTable(people) {
            // Sort people by high score (age) in descending order
            people.sort((a, b) => b.age - a.age); 
            const tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>High Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${people.map(person => `
                            <tr>
                                <td>${person.name}</td>
                                <td>${person.age}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;      
            document.getElementById('tableContainer').innerHTML = tableHTML;
        }
    </script>
</body>
</html>