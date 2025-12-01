---
layout: chatbot
title: "Submodule 1: Overall Analytics & Grades"
description: "Submodule 1 of Analytics/Admin Mini-Quest"
permalink: /cs-portfolio-quest/analytics/submodule_1/
parent: "Analytics/Admin"
team: "Curators"
submodule: 1
categories: [CSP, Submodule, Analytics/Admin]
tags: [analytics, submodule, curators]
author: "Curators Team: Nikhil, Rohan, Pranav, Shriya, Samhita, Adi"
date: 2025-10-22
microblog: true
---

# Submodule 1: Overall Analytics & Grades

[Return to Analytics and Mastery Certificate Quest]({{ site.baseurl }}/cs-portfolio-quest/analytics/)

<style>
  .analytics-container {
    background-color: #121212;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    padding: 2rem;
    min-height: 100vh;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .metric-card {
    background: #1e1e1e;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .metric-title {
    color: #b0b0b0;
    font-size: 0.9rem;
  }

  .metric-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .metric-value {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
  }

  .metric-subtitle {
    color: #808080;
    font-size: 0.85rem;
  }

  .insights-card {
    background: linear-gradient(135deg, #ea8c33 0%, #d67324 100%);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .insights-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .insights-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .insights-subtitle {
    opacity: 0.9;
    font-size: 0.9rem;
  }

  .insights-content {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .insights-text {
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .recommendation {
    display: flex;
    gap: 0.5rem;
    line-height: 1.6;
  }

  .insights-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    opacity: 0.9;
  }

  .live-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .chart-card {
    background: #1e1e1e;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .chart-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  .chart-container {
    position: relative;
    height: 300px;
  }

  .bottom-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
  }

  .download-section {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
    padding-bottom: 2rem;
  }

  .download-btn {
    background: linear-gradient(135deg, #ea8c33 0%, #d67324 100%);
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 12px rgba(234, 140, 51, 0.3);
  }

  .download-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(234, 140, 51, 0.4);
  }

  .download-btn:disabled {
    cursor: wait;
    opacity: 0.8;
  }

  canvas {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .analytics-container {
      padding: 1rem;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    
    .bottom-grid {
      grid-template-columns: 1fr;
    }
  }

  #lessonCompleteButton {
    display: none !important;
  }
</style>

<div class="analytics-container">
  <!-- Metrics Grid -->
  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-title">Total Study Time</span>
        <div class="metric-icon" style="background: rgba(234, 140, 51, 0.2);">⏱️</div>
      </div>
      <div class="metric-value" id="total-studytime">0h</div>
      <div class="metric-subtitle">Well done!</div>
    </div>
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-title">Modules Completed</span>
        <div class="metric-icon" style="background: rgba(147, 51, 234, 0.2);">📚</div>
      </div>
      <div class="metric-value" id="modules-complete">0</div>
      <div class="metric-subtitle" id="modules-incomplete">0 in progress</div>
    </div>
  </div>

  <!-- AI Insights Card -->
  <div class="insights-card">
    <div class="insights-header">
      <div>
        <div class="insights-title">AI Performance Insights</div>
        <div class="insights-subtitle">Generated by Gemini AI</div>
      </div>
      <div style="font-size: 1.5rem;">📈</div>
    </div>
    <div class="insights-content">
      <div class="insights-text">
        Loading your personalized insights...
      </div>
      <div class="recommendation" style="display: none;">
        <span>💡</span>
        <div></div>
      </div>
    </div>
    <div class="insights-footer">
      <span>Last updated: Loading...</span>
      <div class="live-indicator">
        <div class="live-dot"></div>
        <span>Live</span>
      </div>
    </div>
  </div>

  <!-- Weekly Study Time Chart -->
  <div class="chart-card">
    <div class="chart-title">Study Time by Module</div>
    <div class="chart-container">
      <canvas id="timeChart"></canvas>
    </div>
  </div>

  <!-- Bottom Charts Grid -->
  <div class="bottom-grid">
    <div class="chart-card">
      <div class="chart-title">Completion Per Module</div>
      <div class="chart-container">
        <canvas id="completionChart"></canvas>
      </div>
    </div>
  </div>

<!-- "They call me the soupmaker, but they call him the soupdrinker" - Rohan Bojja -->
<canvas id="simpleRadar" width="400" height="400"></canvas>

  <!-- Download Button -->
  <div class="download-section">
    <button id="downloadBtn" class="download-btn">
      <span style="font-size: 1.2rem;">📄</span>
      Download Analytics Report (PDF)
    </button>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

<script type="module">
  import { javaURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
  import { pythonURI } from '{{ site.baseurl }}/assets/js/api/config.js';

  const API_KEY = 'AIzaSyAwUorzifmPEIX6M74Kd_as-C-7Ih6UyLs';

  async function getCredentials() {
        try {
            const res = await fetch(`${pythonURI}/api/id`, {
                ...fetchOptions,
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (res.ok) {
                const data = await res.json();
                const username = data.uid;
                console.log(username);
                return username;
            } else {
                console.log(`Request failed for with status ${res.status}`);
            }
        } catch (err) {
            console.log(`Error: ${err}`);
        }
  }

  async function getLessonData() {
      const username = await getCredentials();
      try {
          const res = await fetch(`${javaURI}/api/stats`, {
              ...fetchOptions,
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              },
          });

          if (!res.ok) {
              console.log(`Request failed with status ${res.status}`);
              return;
          }

          const data = await res.json();
          console.log("All data", data);

          const filtered = data.filter(item => item.username === username);
          console.log(`Data for ${username}:`, filtered);

          const totalTime = filtered.reduce((sum, item) => sum + (item.time || 0), 0);
          console.log(`Total time spent:`, totalTime);
          const modulesComplete = filtered.length
          console.log(`Modules Completed:`, modulesComplete);
          const modulesIncomplete = 24 - filtered.length
          console.log(`Modules Incomplete:`, modulesIncomplete);

          // Define modules and total submodules
          const modules = {
              'AI Usage': 3,
              'Backend Development': 6,
              'Data Visualization': 3,
              'Frontend Development': 6,
              'Resume Building': 6
          };

          // Initialize result object
          const moduleStats = {};
          Object.keys(modules).forEach(m => {
              moduleStats[m] = { time: 0, percentComplete: 0 };
          });

          // Sum time and count finished submodules per module
          const finishedCounts = {};
          Object.keys(modules).forEach(m => finishedCounts[m] = 0);

          filtered.forEach(item => {
              const mod = item.module;
              if (modules[mod] !== undefined) {
                  // Sum time
                  moduleStats[mod].time += item.time || 0;

                  // Count finished submodules
                  if (item.finished) finishedCounts[mod] += 1;
              }
          });

          // Compute percent completion per module
          Object.keys(modules).forEach(m => {
              const totalSubmodules = modules[m];
              const finished = finishedCounts[m];
              moduleStats[m].percentComplete = (finished / totalSubmodules) * 100;
          });

          console.log(`Module stats for ${username}:`, moduleStats);

          return {
            username,
            totalTime,
            modulesComplete,
            modulesIncomplete,
            moduleStats,
            filteredData: filtered
          };
      } catch (err) {
          console.log(`Error: ${err}`);
      }
  }

  /* ===== FIXED: safer chart creation and axis handling ===== */
  function createCharts(timeData, completionData) {
    console.log("In create charts function");

    // Guard canvases exist
    const timeCanvas = document.getElementById('timeChart');
    const completionCanvas = document.getElementById('completionChart');
    if (!timeCanvas || !completionCanvas) {
      console.warn('Missing timeChart or completionChart canvas.');
      return;
    }

    const numericTimeData = timeData.map(v => Number(v) || 0);
    const maxTime = Math.max(...numericTimeData);
    const safeSuggestedMax = maxTime > 0 ? Math.ceil(maxTime * 1.1) : 10;

    const weeklyCtx = timeCanvas.getContext('2d');
    new Chart(weeklyCtx, {
      type: 'line',
      data: {
        labels: ['Frontend Dev.', 'Backend Dev.', 'Data Viz.', 'Resume', 'AI Usage'],
        datasets: [{
          label: 'Time (minutes)',
          data: numericTimeData,
          borderColor: '#ea8c33',
          backgroundColor: 'rgba(234, 140, 51, 0.1)',
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: '#ea8c33',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#ea8c33',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            // FIX: use suggestedMax so axis never collapses when all zeros
            suggestedMax: safeSuggestedMax,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#b0b0b0' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#b0b0b0' }
          }
        }
      }
    });

    // Completion Per Module Chart
    const numericCompletion = completionData.map(v => Number(v) || 0);
    const accuracyCtx = completionCanvas.getContext('2d');
    new Chart(accuracyCtx, {
      type: 'bar',
      data: {
        labels: ['Frontend Dev.', 'Backend Dev.', 'Data Viz.', 'Resume', 'AI Usage'],
        datasets: [{
          data: numericCompletion,
          backgroundColor: '#ea8c33',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#ea8c33',
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 100,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#b0b0b0' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#b0b0b0' }
          }
        }
      }
    });
  }

  /* ===== FIXED: make categories chart optional so absence doesn't crash page ===== */
  const categoriesEl = document.getElementById('categoriesChart');
  if (categoriesEl) {
    const categoriesCtx = categoriesEl.getContext('2d');
    new Chart(categoriesCtx, {
      type: 'doughnut',
      data: {
        labels: ['Programming', 'Data Science', 'Web Development', 'Algorithms'],
        datasets: [{
          data: [35, 28, 22, 15],
          backgroundColor: ['#ea8c33', '#d67324', '#c56520', '#b4581c'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: { color: '#b0b0b0', padding: 20 }
          },
          tooltip: {
            backgroundColor: '#ea8c33',
            padding: 12,
            cornerRadius: 8
          }
        }
      }
    });
  } else {
    console.info('categoriesChart canvas not found; skipping categories chart.');
  }

  async function updateAnalytics() {
    const lessonData = await getLessonData();
    if (!lessonData) return;

    // Update total study time
    const totalTimeEl = document.getElementById("total-studytime");
    if (totalTimeEl) {
        totalTimeEl.innerText = `${(lessonData.totalTime / 60).toFixed(1)}h`;
    }

    // Update modules complete
    const modulesCompleteEl = document.getElementById("modules-complete");
    if (modulesCompleteEl) {
        modulesCompleteEl.innerText = lessonData.modulesComplete;
    }

    // Update modules incomplete
    const modulesIncompleteEl = document.getElementById("modules-incomplete");
    if (modulesIncompleteEl) {
        modulesIncompleteEl.innerText = `${lessonData.modulesIncomplete} in progress`;
    }

    // update charts data
    const moduleStats = lessonData.moduleStats
    const frontendTime = moduleStats["Frontend Development"].time, frontendCompletion = moduleStats["Frontend Development"].percentComplete
    const backendTime = moduleStats["Backend Development"].time, backendCompletion = moduleStats["Backend Development"].percentComplete
    const datavizTime = moduleStats["Data Visualization"].time, datavizCompletion = moduleStats["Data Visualization"].percentComplete
    const resumeTime = moduleStats["Resume Building"].time, resumeCompletion = moduleStats["Resume Building"].percentComplete
    const aiTime = moduleStats["AI Usage"].time, aiCompletion = moduleStats["AI Usage"].percentComplete
    const timeData = [frontendTime, backendTime, datavizTime, resumeTime, aiTime]
    const completionData = [frontendCompletion, backendCompletion, datavizCompletion, resumeCompletion, aiCompletion]
    console.log("Time data", timeData)
    console.log("Completion Data", completionData)
    createCharts(timeData, completionData);

    return lessonData;
  }

  // AI INSIGHTS GENERATION
  async function generateAIInsights(analyticsData) {
      if (!analyticsData) return null;

      const { username, totalTime, modulesComplete, modulesIncomplete, moduleStats } = analyticsData;
      
      let analyticsContext = `Current User: ${username}\n\n`;
      analyticsContext += `Overall Statistics:\n`;
      analyticsContext += `- Total Study Time: ${totalTime.toFixed(1)} minutes (${(totalTime / 60).toFixed(1)} hours)\n`;
      analyticsContext += `- Modules Completed: ${modulesComplete} out of 25\n`;
      analyticsContext += `- Modules In Progress: ${modulesIncomplete}\n\n`;
      
      analyticsContext += `Module-Specific Breakdown:\n`;
      Object.entries(moduleStats).forEach(([moduleName, stats]) => {
          analyticsContext += `${moduleName}: ${stats.time.toFixed(1)} minutes spent, ${stats.percentComplete.toFixed(1)}% complete\n`;
      });

      const prompt = `You are an AI learning analytics assistant. Based on the following student data, generate a personalized performance insight.

${analyticsContext}

Generate a brief, encouraging performance insight that:
1. Highlights their key achievements (be specific with numbers from their actual data)
2. Identifies their strongest area based on completion percentage or time spent
3. Provides ONE actionable recommendation for improvement

Keep it conversational, positive, and concise (3-4 sentences total). Be specific about their numbers. Format with natural paragraph breaks.`;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

      try {
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }]
              })
          });

          if (!response.ok) {
              console.error('API Error:', response.status);
              return null;
          }

          const data = await response.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
      } catch (error) {
          console.error('Error generating insights:', error);
          return null;
      }
  }

  async function updateInsightsCard() {
      const lessonData = await getLessonData();
      if (!lessonData) {
          console.log("No lesson data available for insights");
          return;
      }

      const insightsText = document.querySelector('.insights-text');
      const recommendationDiv = document.querySelector('.recommendation');
      
      insightsText.innerHTML = '<span style="opacity: 0.7;">🤖 Generating personalized insights...</span>';
      recommendationDiv.style.display = 'none';

      const insight = await generateAIInsights(lessonData);
      
      if (insight) {
          const lines = insight.split('\n').filter(l => l.trim());
          const recIndex = lines.findIndex(l => 
              l.toLowerCase().includes('recommend') || 
              l.toLowerCase().includes('consider') ||
              l.toLowerCase().includes('focus on') ||
              l.toLowerCase().includes('try')
          );
          
          if (recIndex !== -1) {
              insightsText.innerHTML = lines.slice(0, recIndex).join(' ');
              recommendationDiv.innerHTML = `<span>💡</span><div>${lines.slice(recIndex).join(' ')}</div>`;
              recommendationDiv.style.display = 'flex';
          } else {
              insightsText.innerHTML = insight.replace(/\n/g, '<br>');
              recommendationDiv.style.display = 'none';
          }
      } else {
          insightsText.innerHTML = `You've completed ${lessonData.modulesComplete} modules and spent ${(lessonData.totalTime / 60).toFixed(1)} hours learning. Great job staying consistent! Keep up the momentum to reach your learning goals.`;
          recommendationDiv.style.display = 'none';
      }

      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {  
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
      });
      document.querySelector('.insights-footer span').textContent = `Last updated: Today at ${timeString}`;
  }

  // Run both functions
  updateAnalytics();
  updateInsightsCard();

  // PDF Download functionality
  const downloadBtn = document.getElementById('downloadBtn');
  downloadBtn.addEventListener('click', async function() {
    const button = this;
    const originalText = button.innerHTML;
    button.innerHTML = '<span style="font-size: 1.2rem;">⏳</span> Generating PDF...';
    button.disabled = true;
    try {
      const { jsPDF } = window.jspdf;
      const container = document.querySelector('.analytics-container');
      // Hide the download button temporarily
      const downloadSection = document.querySelector('.download-section');
      downloadSection.style.display = 'none';
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#121212',
        logging: false
      });
      // Show the button again
      downloadSection.style.display = 'flex';
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('edulearn-analytics-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      button.innerHTML = originalText;
      button.disabled = false;
    }
  });
</script>


<script type="module">
  import { javaURI as spiderJavaURI, fetchOptions as spiderFetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
  import { pythonURI as spiderPythonURI } from '{{ site.baseurl }}/assets/js/api/config.js';

  async function spiderGetCredentialsForRadar() {
        try {
            const spiderRes = await fetch(`${spiderPythonURI}/api/id`, {
                ...spiderFetchOptions,
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (spiderRes.ok) {
                const spiderData = await spiderRes.json();
                const spiderUsername = spiderData.uid;
                return spiderUsername;
            } else {
                console.log(`Request failed for with status ${spiderRes.status}`);
            }
        } catch (spiderErr) {
            console.log(`Error: ${spiderErr}`);
        }
  }

  async function spiderGetLessonDataForRadar() {
      const spiderUsername = await spiderGetCredentialsForRadar();
      try {
          const spiderRes = await fetch(`${spiderJavaURI}/api/stats`, {
              ...spiderFetchOptions,
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              },
          });

          if (!spiderRes.ok) {
              console.log(`Request failed with status ${spiderRes.status}`);
              return null;
          }

          const spiderData = await spiderRes.json();
          const spiderFiltered = spiderData.filter(spiderItem => spiderItem.username === spiderUsername);

          // Define modules and total submodules
          const spiderModules = {
              'AI Usage': 3,
              'Backend Development': 4,
              'Data Visualization': 2,
              'Frontend Development': 6,
              'Resume Building': 6
          };

          // Initialize result object
          const spiderModuleStats = {};
          Object.keys(spiderModules).forEach(spiderM => {
              spiderModuleStats[spiderM] = { percentComplete: 0 };
          });

          // Count finished submodules per module
          const spiderFinishedCounts = {};
          Object.keys(spiderModules).forEach(spiderM => spiderFinishedCounts[spiderM] = 0);

          spiderFiltered.forEach(spiderItem => {
              const spiderMod = spiderItem.module;
              if (spiderModules[spiderMod] !== undefined) {
                  if (spiderItem.finished) spiderFinishedCounts[spiderMod] += 1;
              }
          });

          // Compute percent completion per module
          Object.keys(spiderModules).forEach(spiderM => {
              const spiderTotalSubmodules = spiderModules[spiderM];
              const spiderFinished = spiderFinishedCounts[spiderM];
              spiderModuleStats[spiderM].percentComplete = (spiderFinished / spiderTotalSubmodules) * 100;
          });

          return {
            username: spiderUsername,
            moduleStats: spiderModuleStats
          };
      } catch (spiderErr) {
          console.log(`Error: ${spiderErr}`);
          return null;
      }
  }

  async function spiderCreateRadarChart() {
    const spiderLessonData = await spiderGetLessonDataForRadar();
    
    const spiderCtx = document.getElementById('simpleRadar');

    if (!spiderLessonData || !spiderLessonData.moduleStats) {
      const spiderModules = [
        { name: 'Frontend', score: 0 },
        { name: 'Backend', score: 0 },
        { name: 'AI', score: 0 },
        { name: 'Data Viz', score: 0 },
        { name: 'Resume', score: 0 }
      ];

      const spiderLabels = spiderModules.map(spiderM => spiderM.name);
      const spiderScores = spiderModules.map(spiderM => spiderM.score);

      const spiderData = {
        labels: spiderLabels,
        datasets: [{
          label: 'No Data',
          data: spiderScores,
          borderColor: '#ea8c33',
          backgroundColor: 'rgba(234, 140, 51, 0.2)',
          borderWidth: 3,
          pointBackgroundColor: '#ea8c33'
        }]
      };

      const spiderConfig = {
        type: 'radar',
        data: spiderData,
        options: {
          scales: {
            r: {
              beginAtZero: true,
              suggestedMax: 100,
              pointLabels: { color: '#fff' },
              angleLines: { color: 'rgba(255,255,255,0.2)' },
              grid: { color: 'rgba(255,255,255,0.2)' },
              ticks: { color: '#fff' }
            }
          },
          plugins: {
            legend: { labels: { color: '#fff' } }
          }
        }
      };

      new Chart(spiderCtx, spiderConfig);
      return;
    }

    const spiderModuleStats = spiderLessonData.moduleStats;
    const spiderUsername = spiderLessonData.username;

    const spiderModules = [
      { name: 'Frontend', score: spiderModuleStats['Frontend Development'].percentComplete },
      { name: 'Backend', score: spiderModuleStats['Backend Development'].percentComplete },
      { name: 'AI', score: spiderModuleStats['AI Usage'].percentComplete },
      { name: 'Data Viz', score: spiderModuleStats['Data Visualization'].percentComplete },
      { name: 'Resume', score: spiderModuleStats['Resume Building'].percentComplete }
    ];

    const spiderLabels = spiderModules.map(spiderM => spiderM.name);
    const spiderScores = spiderModules.map(spiderM => spiderM.score);

    const spiderData = {
      labels: spiderLabels,
      datasets: [{
        label: spiderUsername,
        data: spiderScores,
        borderColor: '#ea8c33',
        backgroundColor: 'rgba(234, 140, 51, 0.2)',
        borderWidth: 3,
        pointBackgroundColor: '#ea8c33'
      }]
    };

    const spiderConfig = {
      type: 'radar',
      data: spiderData,
      options: {
        scales: {
          r: {
            beginAtZero: true,
            suggestedMax: 100,
            pointLabels: { color: '#fff' },
            angleLines: { color: 'rgba(255,255,255,0.2)' },
            grid: { color: 'rgba(255,255,255,0.2)' },
            ticks: { color: '#fff' }
          }
        },
        plugins: {
          legend: { labels: { color: '#fff' } }
        }
      }
    };

    new Chart(spiderCtx, spiderConfig);
  }

  spiderCreateRadarChart();
</script>
