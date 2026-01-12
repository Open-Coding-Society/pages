---
layout: post
title: Media Bias Game
permalink: /media/leaderboard
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <table id="leaderboard-table" border="1" style="width: 50%; margin: 0 auto;">
        <thead>
            <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody id="leaderboard-body">
            <!-- Leaderboard rows will be inserted here -->
        </tbody>
    </table>
    <script type="module">
        import {javaURI} from '{{site.baseurl}}/assets/js/api/config.js';
        console.log(javaURI);
        document.addEventListener("DOMContentLoaded", function() {
            fetch(javaURI+'/api/media/') // Assuming this is the correct API URL
                .then(response => response.json())
                .then(data => {
                    const leaderboardBody = document.getElementById("leaderboard-body");
                    leaderboardBody.innerHTML = '';
                    data.forEach(entry => {
                        const row = document.createElement("tr");
                        const rankCell = document.createElement("td");
                        rankCell.textContent = entry.rank;
                        const usernameCell = document.createElement("td");
                        usernameCell.textContent = entry.username;
                        const scoreCell = document.createElement("td");
                        scoreCell.textContent = entry.score;
                        row.appendChild(rankCell);
                        row.appendChild(usernameCell);
                        row.appendChild(scoreCell);
                        leaderboardBody.appendChild(row);
                    });
                })
                .catch(error => console.error('Error fetching leaderboard:', error));
        });
    </script>
</body>
</html>
