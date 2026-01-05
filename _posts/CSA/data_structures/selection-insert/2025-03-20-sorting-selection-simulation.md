---
layout: post 
title: Student Toolkit - Selection Sort Simulation
description: Selection Sort animation to help visualize the sorting algorithm; meant to pair with student_toolkit sorting part 1 team teach lesson
permalink: /toolkit-sorting-selection-simulation
author: Anusha Khobare, Eshaan Kumar, Matthew Wang
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selection Sort Visualization</title>
    <style>
        body {
            text-align: center;
            font-family: Arial, sans-serif;
        }
        .container {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            height: 300px;
            margin: 20px auto;
            gap: 5px;
        }
        .bar {
            width: 30px;
            background-color: steelblue;
            text-align: center;
            color: white;
            font-size: 14px;
            transition: 0.5s;
        }
        .selected {
            background-color: orange !important;
        }
        .comparing {
            background-color: yellow !important;
        }
        .swapping {
            background-color: red !important;
        }
        pre {
            text-align: left;
            display: inline-block;
            padding: 10px;
            border-radius: 5px;
            background-color: rgb(48, 48, 48)!important; /* Dark gray background */
            color: white; /* Ensure text is visible */
            font-size: 14px;
            overflow-x: auto; /* Allow horizontal scrolling if needed */
        }
        .highlight {
            background-color: yellow !important; /* Highlight background */
            color: black !important; /* Ensure highlighted text is visible */
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Selection Sort Visualization</h1>
    <div class="container" id="bar-container"></div>
    <button onclick="startSorting()">Start Sorting</button>
    <button onclick="resetBars()">Reset</button>
    <p id="status"></p>

    <pre id="code">
void selection_sort(int A[], int n) {
    int minimum; 

    for(int i = 0; i < n-1; i++) {  
        minimum = i;  
        
        for(int j = i+1; j < n; j++) {  
            if(A[j] < A[minimum]) {  
                minimum = j;  
            }
        }  

        swap(A[minimum], A[i]);  
    }  
}
    </pre>

    <script>
        let arr = [45, 10, 30, 60, 25, 5, 15];
        let delay = 1000;

        function createBars() {
            const container = document.getElementById("bar-container");
            container.innerHTML = "";
            arr.forEach(value => {
                let bar = document.createElement("div");
                bar.classList.add("bar");
                bar.style.height = value * 5 + "px";
                bar.textContent = value;
                container.appendChild(bar);
            });
        }

        function highlightCode(line) {
            let codeBlock = document.getElementById("code");
            let lines = codeBlock.innerHTML.split("\n");
            for (let i = 0; i < lines.length; i++) {
                lines[i] = lines[i].replace('<span class="highlight">', "").replace("</span>", "");  
            }
            lines[line] = `<span class="highlight">${lines[line]}</span>`;
            codeBlock.innerHTML = lines.join("\n");
        }

        async function selectionSort() {
            let bars = document.querySelectorAll(".bar");
            let statusText = document.getElementById("status");

            for (let i = 0; i < arr.length - 1; i++) {
                highlightCode(4); 
                let minimum = i;
                bars[i].classList.add("selected");
                statusText.textContent = `Step ${i + 1}: Selecting minimum from index ${i} to ${arr.length - 1}`;
                await new Promise(resolve => setTimeout(resolve, delay));

                highlightCode(6);
                for (let j = i + 1; j < arr.length; j++) {
                    highlightCode(7);
                    bars[j].classList.add("comparing");
                    statusText.textContent = `Comparing A[${j}] = ${arr[j]} with A[${minimum}] = ${arr[minimum]}`;
                    await new Promise(resolve => setTimeout(resolve, delay));

                    if (arr[j] < arr[minimum]) {
                        highlightCode(8);
                        bars[minimum].classList.remove("selected");
                        minimum = j;
                        bars[minimum].classList.add("selected");
                        statusText.textContent = `New minimum found at index ${minimum}: ${arr[minimum]}`;
                    }
                    bars[j].classList.remove("comparing");
                }

                if (minimum !== i) {
                    highlightCode(11);
                    statusText.textContent = `Swapping A[${i}] = ${arr[i]} with A[${minimum}] = ${arr[minimum]}`;
                    bars[i].classList.add("swapping");
                    bars[minimum].classList.add("swapping");
                    await new Promise(resolve => setTimeout(resolve, delay));

                    [arr[i], arr[minimum]] = [arr[minimum], arr[i]];

                    createBars();
                    bars = document.querySelectorAll(".bar");
                }

                bars[i].classList.remove("selected", "swapping");
            }

            highlightCode(12);
            statusText.textContent = "Sorting Complete!";
        }

        function startSorting() {
            selectionSort();
        }

        function resetBars() {
            arr = [45, 10, 30, 60, 25, 5, 15];
            createBars();
            document.getElementById("status").textContent = "";
            highlightCode(0);
        }

        window.onload = createBars;
    </script>
</body>
</html>
