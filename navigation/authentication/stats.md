---
layout: post
title: Stats
permalink: /stats
menu: nav/homejava.html
search_exclude: true
show_reading_time: false
---
<html>
 <h2>Input Your Stats</h2>
    <form id="statsForm">
        <fieldset>
            <legend>Exercise Stats</legend>
            <label for="exerciseDate">Date (YYYY-MM-DD):</label>
            <input type="date" id="exerciseDate" name="exerciseDate" required><br><br>
            <label for="exerciseDuration">Duration (in minutes):</label>
            <input type="number" id="exerciseDuration" name="exerciseDuration" min="1" required><br><br>
            <label for="exerciseType">Type of Exercise:</label>
            <input type="text" id="exerciseType" name="exerciseType" required><br><br>
        </fieldset>
        <iframe src="{{site.baseurl}}/exercisegraph" width="400" height="100" frameborder="0"></iframe>
        <fieldset>
            <legend>Sleep Stats</legend>
            <label for="sleepDate">Date (YYYY-MM-DD):</label>
            <input type="date" id="sleepDate" name="sleepDate" required><br><br>
            <label for="sleepHours">Hours Slept:</label>
            <input type="number" id="sleepHours" name="sleepHours" min="1" max="24" required><br><br>
            <label for="sleepQuality">Quality of Sleep:</label>
            <select id="sleepQuality" name="sleepQuality">
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="poor">Poor</option>
            </select><br><br>
        </fieldset>
        <button type="submit">Submit Stats</button>
    </form>
<script type="module">
    import { fetchOptions, javaURI } from '{{site.baseurl}}/assets/js/api/config.js';
    document.getElementById('statsForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from refreshing the page   
        // Get input values
        const exerciseDate = document.getElementById('exerciseDate').value;
        const exerciseDuration = document.getElementById('exerciseDuration').value;
        const exerciseType = document.getElementById('exerciseType').value;
        const sleepDate = document.getElementById('sleepDate').value;
        const sleepHours = document.getElementById('sleepHours').value;
        const sleepQuality = document.getElementById('sleepQuality').value;
        // Create the stat map object to send to the backend
        const statMap = {
            "exercise": {
                "date": exerciseDate,
                "duration": exerciseDuration,
                "type": exerciseType
            },
            "sleep": {
                "date": sleepDate,
                "hours": sleepHours,
                "quality": sleepQuality
            }
        };
        // Call the API to send the stats
        sendPersonStats(statMap);
    });
    async function sendPersonStats(statMap) {
        try {
            // Use fetchOptions to configure the request
            const response = await fetch(`${javaURI}/api/person/setStats`, {
                ...fetchOptions,
                method: 'POST', // Overriding the method to POST
                body: JSON.stringify(statMap) // Adding the statMap as the request body
            });
            if (response.ok) {
                const personData = await response.json(); // Get the updated Person object from the server
                console.log("Person stats updated successfully:", personData);
                alert("Stats updated successfully!");
            } else {
                console.error("Failed to update stats, status:", response.status);
                alert("Failed to update stats.");
            }
        } catch (error) {
            console.error("Error during the API request:", error);
            alert("Error during API request.");
        }
    }
    <iframe src="{{site.baseurl}}/sleepgraph" width="400" height="100" frameborder="0"></iframe>



    
</script>


<html>


