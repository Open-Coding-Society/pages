---
layout: tailwind
title: Your Analytics
permalink: /analytics
search_exclude: true
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
<div class="tab flex border border-gray-300 rounded-t-lg overflow-hidden">
    <button class="tablinks bg-transparent float-left border-none outline-none cursor-pointer px-4 py-3 text-lg hover:bg-gray-600 transition duration-300" onclick="openTab(event, 'Github')">Github</button>
    <button class="tablinks bg-transparent float-left border-none outline-none cursor-pointer px-4 py-3 text-lg hover:bg-gray-600 transition duration-300" onclick="openTab(event, 'Grades')">Grades</button>
</div>
<div id="Github" class="tabcontent hidden p-3 border border-gray-300 border-t-0 rounded-b-lg bg-green-900">
    <h3 class="pl-8 animate__animated animate__fadeIn">Github</h3>
    <!-- Modal Structure -->
    <div id="dataModal" class="modal hidden fixed z-10 left-0 top-0 w-full h-full overflow-auto bg-black bg-opacity-40 pt-16">
        <div class="modal-content bg-slate-700 mx-auto my-20 p-5 border border-gray-400 w-4/5 rounded-lg shadow-md shadow-red-500">
            <span class="close float-right text-gray-400 text-2xl font-bold hover:text-black cursor-pointer">&times;</span>
            <pre id="modalData"></pre>
        </div>
    </div>
    <!-- Analytics Page -->
    <div class="container flex justify-start w-full max-w-[1200px] py-5 box-border animate__animated animate__fadeIn">
        <div id="profile" class="profile flex items-start max-w-[800px] w-full bg-slate-800 p-5 rounded-lg shadow-md">
            <div class="left-side flex flex-col items-start mr-5">
                <img id="avatar" class="avatar rounded-full w-[100px] h-[100px] mb-5" src="" alt="User Avatar">
                <p id="username"></p>
            </div>
            <div class="details">
                <p id="profile-url"></p>
                <p id="issues-count"></p>
                <p id="prs-count"></p>
                <p id="commits-count"></p>
                <p id="line-change"></p>
                <p id="repos-url"></p>
                <p id="public-repos"></p>
                <p id="public-gists"></p>
                <p id="followers"></p>
                <p id="following"></p>
            </div>
        </div>
        <!-- Commit cards will be inserted here -->
        <div id="commitCardsContainer" style="margin-top: 20px;"></div>
    </div>
    <div id="admin-user-search" class="my-6 p-4 bg-slate-800 rounded-lg shadow-md text-white max-w-md">
        <h3 class="text-lg font-semibold mb-2">🔍 Search User by UID (Admin Only)</h3>
        <div class="flex items-center gap-3">
            <input
                type="text"
                id="uid-input"
                placeholder="Enter UID"
                class="px-4 py-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full"
            />
            <button
                id="uid-search-btn"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
            >
                Search
            </button>
        </div>
        <p id="uid-error" class="text-red-400 mt-2 text-sm"></p>
    </div>
    <div id="admin-summary-container" class="mt-6"></div>
    <div id="admin-commitCardsContainer" class="grid gap-4 mt-4"></div>
</div>

<!-- Grades Tab -->
<div id="Grades" class="tabcontent hidden p-3 border border-gray-300 border-t-0 rounded-b-lg">
    <div class="container flex justify-start w-full max-w-[1200px] py-5 box-border">
        <div class="components w-full">
            <div class="chart-section" id="userGradeSection">
                <h2 class="text-xl font-semibold mb-2">🎓 Your Grade</h2>
                <p id="userGrade">Loading your grade...</p>
                <button id="predictGradeBtn" class="mt-2 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition">Predict Grade</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    function openTab(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }
</script>

<script type="module">
    import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

    const profileLinksUrl = `${pythonURI}/api/analytics/github/user/profile_links`;
    const userProfileUrl = `${pythonURI}/api/analytics/github/user`;
    const commitsUrl = `${pythonURI}/api/analytics/github/user/commits`;
    const prsUrl = `${pythonURI}/api/analytics/github/user/prs`;
    const issuesUrl = `${pythonURI}/api/analytics/github/user/issues`;

    async function fetchData() {
        try {
            const profileLinksRequest = fetch(profileLinksUrl, fetchOptions);
            const userProfileRequest = fetch(userProfileUrl, fetchOptions);
            const commitsRequest = fetch(commitsUrl, fetchOptions);
            const prsRequest = fetch(prsUrl, fetchOptions);
            const issuesRequest = fetch(issuesUrl, fetchOptions);

            const [profileLinksResponse, userProfileResponse, commitsResponse, prsResponse, issuesResponse] = await Promise.all([
                profileLinksRequest,
                userProfileRequest,
                commitsRequest,
                prsRequest,
                issuesRequest
            ]);

            if (!profileLinksResponse.ok || !userProfileResponse.ok || !commitsResponse.ok || !prsResponse.ok || !issuesResponse.ok) {
                throw new Error('Failed to fetch one or more resources');
            }

            const profileLinks = await profileLinksResponse.json();
            const userProfile = await userProfileResponse.json();
            const commitsData = await commitsResponse.json();
            const prsData = await prsResponse.json();
            const issuesData = await issuesResponse.json();

            const commitsArray = commitsData.details_of_commits || [];
            const commitsCount = commitsData.total_commit_contributions || 0;
            const totalAdditions = commitsData.total_lines_added || 0;
            const totalDeletions = commitsData.total_lines_deleted || 0;
            document.getElementById('line-change').textContent = `➕ Total Additions: ${totalAdditions}, ➖ Deletions: ${totalDeletions}`;

            function calculateGradeFromCommits(commitCount) {
                if (commitCount > 20) return "90 % (A) ";
                if (commitCount >= 10) return "85 % (B)";
                if (commitCount >= 5) return "75 % (C)";
                return "55 % (F)";
            }

            document.getElementById('predictGradeBtn').addEventListener('click', () => {
                const commitGrade = calculateGradeFromCommits(commitsData.total_commit_contributions || 0);
                document.getElementById('userGrade').textContent = `Predicted Grade (by Commits): ${commitGrade}`;
            });

            const prsArray = prsData.pull_requests || [];
            const prsCount = prsArray.length || 0;
            const issuesArray = issuesData.issues || [];
            const issuesCount = issuesArray.length || 0;

            const username = userProfile.login || 'N/A';
            const profileUrl = profileLinks.profile_url || 'N/A';
            const avatarUrl = userProfile.avatar_url || '';
            const publicReposUrl = profileLinks.repos_url || 'N/A';
            const publicRepos = userProfile.public_repos || 'N/A';
            const publicGists = userProfile.public_gists || 'N/A';
            const followers = userProfile.followers || 'N/A';
            const following = userProfile.following || 'N/A';

            document.getElementById('avatar').src = avatarUrl;
            document.getElementById('username').textContent = `Username: ${username}`;
            document.getElementById('profile-url').innerHTML = `Profile URL: <a href="${profileUrl}" target="_blank">${profileUrl}</a>`;
            document.getElementById('public-repos').textContent = `Public Repos: ${publicRepos}`;
            document.getElementById('public-gists').textContent = `Public Gists: ${publicGists}`;
            document.getElementById('followers').textContent = `Followers: ${followers}`;
            document.getElementById('following').textContent = `Following: ${following}`;

            document.getElementById('commits-count').innerHTML = '<a href="#" class="info-link"><i class="fas fa-info-circle info-icon"></i></a>' + `Commits: ${commitsCount}`;
            document.querySelector('#commits-count .info-link').addEventListener('click', (event) => {
                event.preventDefault();
                showModal(commitsArray);
            });

            document.getElementById('prs-count').innerHTML = '<a href="#" class="info-link"><i class="fas fa-info-circle info-icon"></i></a>' + `Pull Requests: ${prsCount}`;
            document.querySelector('#prs-count .info-link').addEventListener('click', (event) => {
                event.preventDefault();
                showModal(prsArray);
            });

            document.getElementById('issues-count').innerHTML = '<a href="#" class="info-link"><i class="fas fa-info-circle info-icon"></i></a>' + `Issues: ${issuesCount}`;
            document.querySelector('#issues-count .info-link').addEventListener('click', (event) => {
                event.preventDefault();
                showModal(issuesArray);
            });

            // 🔽 Add this to render commit cards beneath profile
            console.log("Sample commit:", commitsArray[0]);

            renderCommitCards(commitsArray, username);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function renderCommitCards(commitsArray, username, container = document.getElementById("commitCardsContainer")) {
        container.innerHTML = "";

        if (!commitsArray.length) {
            container.innerHTML = `<p>No recent commits found.</p>`;
            return;
        }

        // Sort commits by date (most recent first)
        commitsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Limit to 10 most recent commits
        commitsArray.slice(0, 10).forEach((commit, index) => {
            const card = document.createElement("div");
            card.className = "card animate__animated animate__fadeInUp";
            card.style.backgroundColor = "#34495e";
            card.style.color = "#fff";
            card.style.padding = "15px";
            card.style.borderRadius = "10px";
            card.style.marginBottom = "10px";
            card.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            card.style.animationDelay = `${index * 0.1}s`;

            // Repo name (with link to commit URL)
            const repoLink = document.createElement("a");
            repoLink.href = commit.url;
            repoLink.target = "_blank";
            repoLink.textContent = commit.repository;
            repoLink.style.color = "#1abc9c";
            repoLink.style.textDecoration = "none";
            repoLink.style.fontWeight = "bold";

            // Commit message
            const message = document.createElement("p");
            message.textContent = `📝 ${commit.message}`;

            // Additions and deletions
            const linesChanged = document.createElement("p");
            linesChanged.textContent = `➕ +${commit.additions} / ➖ -${commit.deletions}`;
            linesChanged.style.fontSize = "0.9em";
            linesChanged.style.color = "#ccc";

            // Commit date
            const dateOnly = new Date(commit.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const dateElement = document.createElement("p");
            dateElement.textContent = `📅 ${dateOnly}`;
            dateElement.style.fontSize = "0.9em";
            dateElement.style.color = "#bbb";

            // Append elements to card
            card.appendChild(repoLink);
            card.appendChild(message);
            card.appendChild(linesChanged);
            card.appendChild(dateElement);

            // Append card to container
            container.appendChild(card);
        });
    }


    function jsonToHtml(json) {
        const jsonString = JSON.stringify(json, null, 2);
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        return jsonString.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
    }

    function showModal(data) {
        const modal = document.getElementById('dataModal');
        const modalData = document.getElementById('modalData');
        const closeBtn = document.getElementsByClassName('close')[0];

        modalData.innerHTML = jsonToHtml(data);
        modal.style.display = 'block';

        closeBtn.onclick = function () {
            modal.style.display = 'none';
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }

    fetchData();

    document.getElementById("uid-search-btn").addEventListener("click", async () => {
        const uid = document.getElementById("uid-input").value.trim();
        const errorEl = document.getElementById("uid-error");
        const summaryContainer = document.getElementById("admin-summary-container");
        const commitContainer = document.getElementById("admin-commitCardsContainer");

        errorEl.textContent = "";
        summaryContainer.innerHTML = "";
        commitContainer.innerHTML = "";

        if (!uid) {
            errorEl.textContent = "Please enter a UID.";
            return;
        }

        try {
            const response = await fetch(`${pythonURI}/api/analytics/commits/${uid}`, fetchOptions);

            if (!response.ok) {
                const err = await response.json();
                errorEl.textContent = err.message || "Failed to fetch user commit data.";
                return;
            }

            const data = await response.json();
            const commitData = data.commits?.details_of_commits || [];
            const commitCount = data.commits?.total_commit_contributions || 0;

            // Create and style summary card using CSS class
            const summaryCard = document.createElement("div");
            summaryCard.className = "summary-card bg-slate-800 text-white p-5 rounded-lg shadow max-w-xs text-center";

            summaryCard.innerHTML = `
                <img src="https://github.com/identicons/${uid}.png" alt="Avatar">
                <p><strong>UID:</strong> ${uid}</p>
                <p><strong>Total Commits:</strong> ${commitCount}</p>
            `;

            summaryContainer.appendChild(summaryCard);

            // Render commit cards in separate container
            renderCommitCards(commitData, uid, commitContainer);
        } catch (e) {
            errorEl.textContent = "Unexpected error.";
            console.error(e);
        }
    });
</script>


<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<script type="module">
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';


    function calculateAverageDuration(timeIn) {
        const visits = timeIn.split(',');
        let totalDuration = 0;
        visits.forEach(visit => {
            const [checkIn, checkOut] = visit.split('-');
            const formatTime = time => time.padStart(5, '0');
            const checkInTime = new Date('1970-01-01T' + formatTime(checkIn)).getTime();
            const checkOutTime = new Date('1970-01-01T' + formatTime(checkOut)).getTime();
            totalDuration += (checkOutTime - checkInTime) / 1000 / 60;
        });
        return totalDuration / visits.length;
    }

    function getTinkle(personName) {
        fetch(`${javaURI}/api/tinkle/${personName}`, { ...fetchOptions, credentials: 'include' })
            .then(response => response.ok ? response.json() : null)
            .then(data => {
                if (!data) return;
                const timeIn = data.timeIn;
                document.getElementById('num-times').textContent = timeIn.split(',').length;
                document.getElementById('avg-duration').textContent = calculateAverageDuration(timeIn).toFixed(2);
                updateChart(timeIn);
            })
            .catch(console.error);
    }

    function getPerson() {
        fetch(`${javaURI}/api/person/get`, { ...fetchOptions, credentials: 'include' })
            .then(response => response.ok ? response.json() : null)
            .then(data => { if (data) getTinkle(encodeURIComponent(data.name)); })
            .catch(console.error);
    }

    function getPeriod(time) {
        const periods = [
            ['08:35', '09:41'],
            ['09:46', '10:55'],
            ['11:37', '12:43'],
            ['13:18', '14:24'],
            ['14:29', '15:35']
        ];
        const t = new Date('1970-01-01T' + time).getTime();
        return periods.findIndex(([start, end]) => t >= new Date('1970-01-01T' + start).getTime() && t <= new Date('1970-01-01T' + end).getTime()) + 1;
    }

    function updateChart(timeIn) {
        const periodCounts = Array(5).fill(0);
        timeIn.split(',').forEach(visit => {
            const checkIn = visit.split('-')[0];
            const period = getPeriod(checkIn);
            if (period) periodCounts[period - 1]++;
        });
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['P1', 'P2', 'P3', 'P4', 'P5'],
                datasets: [{
                    label: 'Bathroom Usage',
                    data: periodCounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    }

    window.addEventListener('load', getPerson);
</script>

<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    let userId = -1;
    let grades = [];
    let assignment;

    function populateTable(grades) {
        const tableBody = document.getElementById("gradesTable").getElementsByTagName("tbody")[0];
        
        tableBody.innerHTML = "";

        grades.forEach(stugrade => {
            let row = tableBody.insertRow();

            let cell1 = row.insertCell(0);
            cell1.textContent = stugrade[1];

            let cell2 = row.insertCell(1);
            cell2.textContent = stugrade[0];
        });

        displayAverage(grades);
    }

    function displayAverage(grades) {
        let total = 0;
        let count = grades.length;

        grades.forEach(stugrade => {
            total += parseFloat(stugrade[0]); 
        });

        let average = (total / count).toFixed(2); 

        const averageDiv = document.getElementById("averageDiv");
        if (averageDiv) {
            averageDiv.innerHTML = `<strong>Average Grade: ${average}</strong>`;
        } else {
            const newAverageDiv = document.createElement("div");
            newAverageDiv.id = "averageDiv";
            newAverageDiv.innerHTML = `<strong>Average Grade: ${average}</strong>`;
            document.body.appendChild(newAverageDiv);
        }
    }

    async function getUserId() {
        const url_persons = `${javaURI}/api/person/get`;
        await fetch(url_persons, fetchOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Spring server response: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                userId = data.id;
            })
            .catch(error => {
                console.error("Java Database Error:", error);
            });
    }

    async function fetchAssignmentbyId(assignmentId) {
        try {
            const response = await fetch(javaURI + "/api/assignments/" + String(assignmentId), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch assignments: ${response.statusText}`);
            }

            const assignment = await response.text();
            return assignment;  

        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    }

    async function getGrades() {
        const urlGrade = javaURI + '/api/synergy/grades';

        try {
            const response = await fetch(urlGrade, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to get data: ' + response.statusText);
            }

            const data = await response.json();
            await getUserId();  

            for (const grade of data) {
                if (grade.studentId == userId) {
                    let stugrade = [];
                    stugrade.push(grade.grade);
                    
                    const assignmentDetails = await fetchAssignmentbyId(grade.assignmentId);
                    stugrade.push(assignmentDetails);
                    
                    grades.push(stugrade);
                }
            }

            populateTable(grades);

        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    }

    window.onload = async function() {
        await getUserId();
        await getGrades(); 
    };
</script>

<script type="module">
    import { javaURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
    document.getElementById('assignmentSelect').addEventListener('change', fetchGrades);

    async function loadAssignments() {
        const options = {
            URL: `${javaURI}/api/synergy/grades`,
            method: "GET",
            cache: "no-cache",
        };
        console.log(options.URL);
        try {
            const response = await fetch(options.URL, fetchOptions);
            if (!response.ok) {
                throw new Error(`Failed to load assignments: ${response.status}`);
            }
            const responseData = await response.json();
            const assignmentIds = [...new Set(responseData.map(item => item.assignmentId))];
            console.log("API Response Data:", responseData);
            console.log("assignment IDS:", assignmentIds);
            const assignmentSelect = document.getElementById('assignmentSelect');
            assignmentSelect.innerHTML = "";
            assignmentIds.forEach(id => {
                const option = document.createElement('option');
                option.value = id;
                option.text = `Assignment ${id}`;
                assignmentSelect.add(option);
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    async function fetchGrades() {
        const assignmentId = document.getElementById('assignmentSelect').value;
        const options = {
            method: "GET",
            cache: "no-cache",
        };
        try {
            const gradesResponse = await fetch(`${javaURI}/api/analytics/assignment/${assignmentId}/grades`, fetchOptions);
            if (!gradesResponse.ok) {
                throw new Error(`Failed to fetch grades data: ${gradesResponse.status}`);
            }
            const gradesText = await gradesResponse.text();
            console.log("Grades Response Text:", gradesText);
            if (!gradesText) {
                throw new Error("Response body is empty");
            }
            const gradesData = JSON.parse(gradesText);
            const grades = gradesData.grades;
            console.log("grades:", grades);
            const userResponse = await fetch(`${javaURI}/api/analytics/assignment/${assignmentId}/student/grade`, fetchOptions);
            if (!userResponse.ok) {
                throw new Error(`Failed to fetch user-specific grades: ${userResponse.status}`);
            }
            const userData = await userResponse.json();
            console.log("Grades Data:", grades);
            console.log("User Data:", userData);
            createBoxPlot(grades, userData);
            showCharts();
            displayUserData(userData);
        } catch (error) {
            console.error("Error fetching or parsing grades:", error.message);
        }
    }

    let thereIsABoxPlot = false;
    function createBoxPlot(grades, userData) {
        if (!thereIsABoxPlot) {
            thereIsABoxPlot = true;
        } else {
            Plotly.purge(document.getElementById("boxPlot"));
        }
        const trace = {
            y: grades,
            type: 'box',
            name: 'Grades',
            marker: { color: 'rgba(255, 193, 7, 0.6)' },
            line: { color: '#ffa726' }
        };
        const userTrace = {
            y: [userData],
            x: ['Grades'],  // Ensures the dot aligns with the box plot's category
            mode: 'markers',
            name: 'Your Grade',
            marker: { color: 'red', size: 10 }
        };

        const data = [trace, userTrace];
        const layout = {
            title: 'Grades Box and Whisker Plot',
            titlefont: { color: '#ffa726' },
            yaxis: { title: 'Grades', zeroline: false, color: '#ffffff' },
            paper_bgcolor: '#2c2c2e',
            plot_bgcolor: '#2c2c2e'
        };
        Plotly.newPlot('boxPlot', data, layout);
    }

    function showCharts() {
        document.getElementById('boxPlotSection').classList.add('visible');
    }

    window.onload = loadAssignments;

    function displayUserData(userData) {
        const userGradeElement = document.getElementById('userGrade');
        if (userData) {
            userGradeElement.textContent = `Your grade for this assignment is: ${userData}`;
        } else {
            console.warn("Unexpected User Data Structure:", userData);
            userGradeElement.textContent = "No grade available for this assignment.";
        }
    }
</script>