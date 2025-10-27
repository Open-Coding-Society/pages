---
layout: fortunefinders
title: Media Bias Game
permalink: /media
---

<style>
body {
    background-color: #181414;
    color: white;
    margin: 0;
    font-family: system-ui, sans-serif;
}
.button-class {
    background-color: rgb(71, 167, 75) !important; /* Nighthawk Green */
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 30px;
}
.collapsible-btn {
    background-color: rgb(71, 167, 75) !important; /* Nighthawk Green */
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 30px;
}
.collapsible-btn:hover {
  background-color: #0056b3;
}
.arrow {
  display: inline-block;
  margin-left: 8px;
  transition: transform 0.3s ease;
}
.collapsible-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-bottom: 0;
}
.collapsible-btn.active .arrow {
  transform: rotate(180deg);
}
.collapsible-btn.active + .collapsible-content {
  margin-bottom: 20px; /* Adds space when expanded */
}
.bin {
  width: 30%;
  padding: 10px;
  border: 1px solid rgb(71, 167, 75);
  min-height: 100px;
}
</style>
<br>
<h1>Media Bias Game</h1><br>
<button class="collapsible-btn" onclick="toggleCollapse(this)">Leaderboard<span class="arrow"> ▼</span></button>
<div class="collapsible-content">
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
</div>
<script>
function toggleCollapse(btn) {
    btn.classList.toggle("active"); // Toggle the active class on the button
    let content = btn.nextElementSibling;
    let arrow = btn.querySelector(".arrow"); // Select the arrow inside the button
    // Toggle content visibility
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
    // Rotate arrow correctly
    arrow.style.transform = content.style.maxHeight ? "rotate(180deg)" : "rotate(0deg)";
}
</script>
<p>Drag the images into the correct bins (Left, Center, or Right). You have 3 lives!</p>
<div id="username-container" style="margin-bottom: 20px;">
    <p id="display-username" style="font-size: 18px; margin-top: 10px;">Username: <span id="current-username">Guest</span></p>
</div>
<div id="info" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
    <div id="lives" style="font-size: 24px;">Lives: 😺😺😺</div>
    <div id="score" style="font-size: 24px;">Score: 0</div>
</div>
<div id="bins" style="display: flex; justify-content: space-around; margin-bottom: 20px;">
    <div class="bin" data-bin="Left">Left</div>
    <div class="bin" data-bin="Center">Center</div>
    <div class="bin" data-bin="Right">Right</div>
</div>
<div id="images" style="display: flex; flex-wrap: wrap; gap: 10px;">
    <script>
        const imageFiles = [
            { src: "atlanticL.png", company: "Atlantic", bin: "Left" },
            { src: "buzzfeedL.png", company: "Buzzfeed", bin: "Left" },
            { src: "cnnL.png", company: "CNN", bin: "Left" },
            { src: "epochR.png", company: "Epoch Times", bin: "Right" },
            { src: "forbesC.png", company: "Forbes", bin: "Center" },
            { src: "hillC.png", company: "The Hill", bin: "Center" },
            { src: "nbcL.png", company: "NBC", bin: "Left" },
            { src: "newsweekC.png", company: "Newsweek", bin: "Center" },
            { src: "nytL.png", company: "NY Times", bin: "Left" },
            { src: "voxL.png", company: "Vox", bin: "Left" },
            { src: "wtR.png", company: "Washington Times", bin: "Right" },
            { src: "bbcC.png", company: "BBC", bin: "Center" },
            { src: "callerR.png", company: "The Daily Caller", bin: "Right" },
            { src: "dailywireR.png", company: "Daily Wire", bin: "Right" },
            { src: "federalistR.png", company: "Federalist", bin: "Right" },
            { src: "foxR.png", company: "Fox News", bin: "Right" },
            { src: "marketwatchC.png", company: "MarketWatch", bin: "Center" },
            { src: "newsmaxR.png", company: "Newsmax", bin: "Right" },
            { src: "nprL.png", company: "NPR", bin: "Left" },
            { src: "reutersC.png", company: "Reuters", bin: "Center" },
            { src: "wsjC.png", company: "Wall Street Journal", bin: "Center" },
            { src: "abcL.png", company: "ABC", bin: "Left"},
            { src: "timeL.png", company: "Time", bin: "Left"},
            { src: "yahooL.png", company: "Yahoo News", bin: "Left"},
            { src: "newsnationC.png", company: "News Nation", bin: "Center"},
            { src: "reasonC.png", company: "Reason News", bin: "Center"},
            { src: "sanC.png", company: "SAN News", bin: "Center"},
            { src: "nypR.png", company: "New York Post", bin: "Right"},
            { src: "upwardR.png", company: "Upward News", bin: "Right"},
            { src: "cbnR.png", company: "CBN", bin: "Right"}
        ];
        function getRandomImages(imageFiles) {
            const leftImages = imageFiles.filter(item => item.bin === "Left");
            const rightImages = imageFiles.filter(item => item.bin === "Right");
            const centerImages = imageFiles.filter(item => item.bin === "Center");
            const getRandomSubset = (arr) => {
                const shuffled = arr.sort(() => 0.5 - Math.random());
                return shuffled.slice(0, 7);
            };
            const randomLeftImages = getRandomSubset(leftImages);
            const randomRightImages = getRandomSubset(rightImages);
            const randomCenterImages = getRandomSubset(centerImages);
            const combined = [
                ...randomLeftImages,
                ...randomRightImages,
                ...randomCenterImages
            ];
            const shuffledFinal = combined.sort(() => 0.5 - Math.random());
            return shuffledFinal;
        }
        const randomImages = getRandomImages(imageFiles);
        randomImages.forEach((file, index) => {
            const imgHTML = `
                <img src="{{site.baseurl}}/media/assets/${file.src}" 
                    class="image" 
                    draggable="true" 
                    id="img-${index}" 
                    data-company="${file.company}" 
                    data-bin="${file.bin}" 
                    style="width: 80px; height: auto; border: 1px solid black; padding: 5px;">
            `;
            document.getElementById('images').innerHTML += imgHTML;
        });
    </script>
</div>
<button class="button-class" id="submit" style="margin-top: 20px;">Submit</button>
<script type="module">
    import {javaURI, fetchOptions} from "{{site.baseurl}}/assets/js/api/config.js";
    const bins = document.querySelectorAll('.bin');
    const images = document.querySelectorAll('.image');
    const livesElement = document.getElementById('lives');
    const scoreElement = document.getElementById('score');
    const usernameInput = document.getElementById('username');
    const displayUsername = document.getElementById('current-username');
    let lives = 3;
    let score = 0;
    async function fetchUser() {
        const response = await fetch(javaURI + `/api/person/get`, fetchOptions);
        if (response.ok) {
            const userInfo = await response.json();
            const person = userInfo.name;
            console.log(person);
            displayUsername.textContent = person;
        } else if (response.status === 401 || response.status === 201) {
            // 401 is the code for unauthorized
            console.log("guest");
            displayUsername.textContent = "Guest";
        }
    }
    fetchUser()
    images.forEach(img => {
        img.addEventListener('dragstart', e => {
            e.dataTransfer.setData('image-id', e.target.id);
        });
    });
    bins.forEach(bin => {
        bin.addEventListener('dragover', e => e.preventDefault());
        bin.addEventListener('drop', e => {
            const imageId = e.dataTransfer.getData('image-id');
            const img = document.getElementById(imageId);
            if (img.dataset.bin === bin.dataset.bin) {
                bin.appendChild(img);
                score++;
                scoreElement.innerText = `Score: ${score}`;
            } else {
                lives--;
                livesElement.innerText = `Lives: ${"😺".repeat(lives)}`;
                if (lives === 0) {
                    alert(`Game over! ${displayUsername.innerText}, your final score: ${score}`);
                    postScore(displayUsername.innerText, score);
                    location.reload();
                }
            }
        });
    });
    function postScore(username, finalScore) {
        fetch(`${javaURI}/api/media/score/${username}/${finalScore}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                console.log('Score successfully saved!');
            } else {
                console.error('Failed to save score');
            }
        })
        .catch(error => {
            console.error('Error saving score:', error);
        });
    }
    document.getElementById('submit').addEventListener('click', () => {
        alert(`${displayUsername.innerText}, your final score: ${score}`);
        postScore(displayUsername.innerText, score);
        location.reload();
    });
</script>