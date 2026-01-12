---
layout: page
title: Grade Analytics 
permalink: /student/analytics
search_exclude: true
show_reading_time: false 
---

<title>Grades Analytics</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<div class="container">
    <h1>📊 Grades Analytics</h1>
    <!-- Assignment Selection Dropdown -->
    <label for="assignmentSelect">Choose an Assignment:</label>
    <select id="assignmentSelect"></select>
    <!-- Histogram Section -->
    <div class="chart-section" id="histogramSection">
        <h2>📈 Histogram of Grades</h2>
        <canvas id="histogram"></canvas>
    </div>
    <!-- Pie Chart Section -->
    <div class="chart-section" id="pieChartSection">
        <h2>🍰 Pie Chart of Grade Distribution</h2>
        <canvas id="pieChart"></canvas>
    </div>
    <!-- Box and Whisker Plot Section -->
    <div class="chart-section" id="boxPlotSection">
        <h2>📦 Box and Whisker Plot</h2>
        <div id="boxPlot"></div>
    </div>
    <div class="chart-section" id="userGradeSection">
        <h2>🎓 Your Grade</h2>
        <p id="userGrade">Loading your grade...</p>
    </div>

</div>
<script type="module">
    import { javaURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
    document.getElementById('assignmentSelect').addEventListener('change', fetchGrades);
    // Fetch grades based on selected assignment
    // Load assignments for dropdown
    async function loadAssignments() {
    const options = {
        URL: `${javaURI}/api/synergy/grades`, // Correct endpoint
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
        assignmentSelect.innerHTML = ""; // Clear existing options
        // Populate dropdown with assignment IDs
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
        // Fetch grades for the selected assignment
        const gradesResponse = await fetch(`${javaURI}/api/analytics/assignment/${assignmentId}/grades`, fetchOptions);
        if (!gradesResponse.ok) {
            throw new Error(`Failed to fetch grades data: ${gradesResponse.status}`);
        }
        const gradesText = await gradesResponse.text(); // Get the raw response text
        console.log("Grades Response Text:", gradesText);
        if (!gradesText) {
            throw new Error("Response body is empty");
        }
        const gradesData = JSON.parse(gradesText); // Parse the response if it's valid
        const grades = gradesData.grades;
        console.log("grades:", grades);
        // Fetch user-specific grades for the assignment
        const userResponse = await fetch(`${javaURI}/api/analytics/assignment/${assignmentId}/student/grade`, fetchOptions);
        if (!userResponse.ok) {
            throw new Error(`Failed to fetch user-specific grades: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        console.log("Grades Data:", grades);
        console.log("User Data:", userData);
        // Update charts with grades data
        createHistogram(grades);
        createPieChart(grades);
        createBoxPlot(grades);
        showCharts();
        // Optionally, display user-specific data on the page
        displayUserData(userData);
    } catch (error) {
        console.error("Error fetching or parsing grades:", error.message);
    }
}
    let histogram;
    function createHistogram(grades) {
        const ctx = document.getElementById('histogram').getContext('2d');
        if (histogram) histogram.destroy();
        const bins = {
            '0-10%': grades.filter(g => g < 0.1).length,
            '10-20%': grades.filter(g => g >= 0.1 && g < 0.2).length,
            '20-30%': grades.filter(g => g >= 0.2 && g < 0.3).length,
            '30-40%': grades.filter(g => g >= 0.3 && g < 0.4).length,
            '40-50%': grades.filter(g => g >= 0.4 && g < 0.5).length,
            '50-60%': grades.filter(g => g >= 0.5 && g < 0.6).length,
            '60-70%': grades.filter(g => g >= 0.6 && g < 0.7).length,
            '70-80%': grades.filter(g => g >= 0.7 && g < 0.8).length,
            '80-90%': grades.filter(g => g >= 0.8 && g < 0.9).length,
            '90-100%': grades.filter(g => g >= 0.9).length
        };
        histogram = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(bins), // 10% ranges as labels
                datasets: [{
                    data: Object.values(bins), // Frequencies for each range
                    backgroundColor: 'rgba(255, 193, 7, 0.6)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Number of Students' } // Label for y-axis
                    },
                    x: {
                        title: { display: true, text: 'Grade Ranges (%)' } // Label for x-axis
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        color: '#ffa726'
                    },
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                }
            }
        });
    }
    let pieChart;
    function createPieChart(grades) {
        const ctx = document.getElementById('pieChart').getContext('2d');
        const gradeRanges = {
            'A (90-100)': grades.filter(g => g >= .90).length,
            'B (80-89)': grades.filter(g => g >= .80 && g < .90).length,
            'C (70-79)': grades.filter(g => g >= .70 && g < .80).length,
            'D (60-69)': grades.filter(g => g >= .60 && g < .70).length,
            'F (< 60)': grades.filter(g => g < .60).length
        };
        if (pieChart) pieChart.destroy();
        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(gradeRanges),
                datasets: [{
                    label: 'Grade Distribution',
                    data: Object.values(gradeRanges),
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)', 
                        'rgba(75, 192, 192, 0.6)', 
                        'rgba(255, 206, 86, 0.6)', 
                        'rgba(255, 159, 64, 0.6)', 
                        'rgba(255, 99, 132, 0.6)'  
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: { display: true, text: 'Grade Distribution Pie Chart', color: '#ffa726' },
                    legend: { labels: { color: '#ffffff' } }
                }
            }
        });
    }
    let thereIsABoxPlot = false;
    function createBoxPlot(grades) {
        if (!thereIsABoxPlot) {thereIsABoxPlot = true;}
        else { Plotly.purge(document.getElementById("boxPlot")); }
        const trace = {
            y: grades,
            type: 'box',
            name: 'Grades',
            marker: { color: 'rgba(255, 193, 7, 0.6)' },
            line: { color: '#ffa726' }
        };
        const data = [trace];
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
        document.getElementById('histogramSection').classList.add('visible');
        document.getElementById('pieChartSection').classList.add('visible');
        document.getElementById('boxPlotSection').classList.add('visible');
    }
    window.onload = loadAssignments;
    function displayUserData(userData) {
    const userGradeElement = document.getElementById('userGrade');
        // Check if userData is a primitive (e.g., a number or string)
        if (userData) {
            userGradeElement.textContent = `Your grade for this assignment is: ${userData}`;
        }
        else {
            console.warn("Unexpected User Data Structure:", userData);
            userGradeElement.textContent = "No grade available for this assignment.";
        }
    }


</script>
