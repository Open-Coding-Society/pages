---
layout: post
title: "Grade Collection Dashboard"
description: "Automated grade collection system for CS Portfolio Quest submodules with mock data support"
permalink: /cs-portfolio-quest/grade-collection-dashboard/
parent: "CS Portfolio Quest"
team: "System Administration"
categories: [CSP, Analytics, Grades]
tags: [grades, analytics, dashboard, automation]
author: Akshay, Manas, Anvay, Gurshawn, Aashray
date: 2025-10-31
---

<h1>Grade Collection Dashboard</h1>

<div>
    <button onclick="startCollection(false)" id="collectBtn">Collect All Grades</button>
    <button onclick="startCollection(true)" id="mockBtn">Generate Mock Data</button>
    <button onclick="exportJSON()" id="jsonBtn" disabled>Export JSON</button>
    <button onclick="exportCSV()" id="csvBtn" disabled>Export CSV</button>
    <button onclick="clearResults()">Clear Results</button>
</div>

<div id="statusSection" style="display: none; margin-top: 20px; border: 1px solid #ccc; padding: 15px;">
    <h2>Collection Status</h2>
    <p>Total Submodules: <strong id="totalStat">0</strong></p>
    <p>Successful: <strong id="successStat">0</strong></p>
    <p>Not Implemented: <strong id="notImplStat">0</strong></p>
    <p>Errors: <strong id="errorStat">0</strong></p>
    <p>Unique Students: <strong id="studentsStat">0</strong></p>
    <p>Mock Data: <strong id="mockStat">0</strong></p>
    <p id="modeIndicator" style="display: none; margin-top: 10px;">
        <strong id="modeText"></strong>
    </p>
</div>

<div id="logSection" style="border: 1px solid #ccc; padding: 10px; margin: 20px 0; max-height: 300px; overflow-y: auto; font-family: monospace; background: #f5f5f5;">
    <div>[READY] Grade collection system initialized. Click "Collect All Grades" to begin.</div>
</div>

<div id="resultsSection" style="display: none; margin-top: 20px;">
    <h2>Student Results</h2>
    <div id="studentList"></div>
</div>

<script src="{{ site.baseurl }}/assets/js/grades.js"></script>
<script>
    let currentGradeData = null;

    function log(message) {
        const logSection = document.getElementById('logSection');
        const time = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.textContent = `[${time}] ${message}`;
        logSection.appendChild(entry);
        logSection.scrollTop = logSection.scrollHeight;
    }

    async function startCollection(forceMock = false) {
        const collectBtn = document.getElementById('collectBtn');
        const mockBtn = document.getElementById('mockBtn');
        collectBtn.disabled = true;
        mockBtn.disabled = true;
        collectBtn.textContent = 'Collecting...';
        mockBtn.textContent = 'Generating...';

        document.getElementById('statusSection').style.display = 'block';
        document.getElementById('jsonBtn').disabled = true;
        document.getElementById('csvBtn').disabled = true;

        log(forceMock ? 'Generating mock data...' : 'Starting grade collection...');

        try {
            currentGradeData = await CSPortfolioGrades.runGradeCollection(forceMock);

            document.getElementById('totalStat').textContent = currentGradeData.summary.total;
            document.getElementById('successStat').textContent = currentGradeData.summary.successful;
            document.getElementById('notImplStat').textContent = currentGradeData.summary.notImplemented;
            document.getElementById('errorStat').textContent = currentGradeData.summary.errors;
            document.getElementById('studentsStat').textContent = currentGradeData.summary.uniqueStudents.length;
            document.getElementById('mockStat').textContent = currentGradeData.summary.mock || 0;

            const modeIndicator = document.getElementById('modeIndicator');
            const modeText = document.getElementById('modeText');
            modeIndicator.style.display = 'block';
            
            if (currentGradeData.metadata.mode === 'mock') {
                modeText.textContent = 'Mode: Mock Data (Testing)';
            } else if (currentGradeData.metadata.mode === 'fallback_mock') {
                modeText.textContent = 'Mode: Fallback Mock Data (No real data available)';
            } else {
                modeText.textContent = 'Mode: Live Data';
            }

            log(`Collection complete! Found ${currentGradeData.summary.uniqueStudents.length} students`);

            document.getElementById('jsonBtn').disabled = false;
            document.getElementById('csvBtn').disabled = false;

            displayStudentResults();

        } catch (error) {
            log(`Error: ${error.message}`);
        } finally {
            collectBtn.disabled = false;
            mockBtn.disabled = false;
            collectBtn.textContent = 'Collect All Grades';
            mockBtn.textContent = 'Generate Mock Data';
        }
    }

    function displayStudentResults() {
        if (!currentGradeData) return;

        const resultsSection = document.getElementById('resultsSection');
        const studentList = document.getElementById('studentList');

        const byStudent = CSPortfolioGrades.organizeGradesByStudent(currentGradeData);
        
        if (Object.keys(byStudent).length === 0) {
            studentList.innerHTML = '<p>No student data available yet.</p>';
            resultsSection.style.display = 'block';
            return;
        }

        studentList.innerHTML = '';

        Object.values(byStudent).forEach(student => {
            const gradesByCategory = {};
            student.grades.forEach(g => {
                if (!gradesByCategory[g.category]) {
                    gradesByCategory[g.category] = [];
                }
                gradesByCategory[g.category].push(g);
            });

            const categoryDetails = Object.entries(gradesByCategory).map(([cat, grades]) => {
                const avg = (grades.reduce((sum, g) => sum + (g.grade || 0), 0) / grades.length).toFixed(1);
                return `<li>${cat}: ${grades.length} completed, Average: ${avg}%</li>`;
            }).join('');

            const studentDiv = document.createElement('div');
            studentDiv.style.border = '1px solid #ccc';
            studentDiv.style.padding = '15px';
            studentDiv.style.marginBottom = '15px';
            studentDiv.innerHTML = `
                <h3>${student.name} - ${student.averageGrade}%</h3>
                <p>${student.completedSubmodules} submodules completed</p>
                <ul>${categoryDetails}</ul>
            `;
            studentList.appendChild(studentDiv);
        });

        resultsSection.style.display = 'block';
    }

    function exportJSON() {
        if (!currentGradeData) {
            log('No data to export');
            return;
        }
        CSPortfolioGrades.exportGradesToJSON(currentGradeData);
        log('Exported grades to JSON file');
    }

    function exportCSV() {
        if (!currentGradeData) {
            log('No data to export');
            return;
        }
        CSPortfolioGrades.exportGradesToCSV(currentGradeData);
        log('Exported grades to CSV file');
    }

    function clearResults() {
        currentGradeData = null;
        document.getElementById('statusSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('logSection').innerHTML = '[READY] Grade collection system initialized.';
        document.getElementById('jsonBtn').disabled = true;
        document.getElementById('csvBtn').disabled = true;
        log('Results cleared');
    }
</script>
