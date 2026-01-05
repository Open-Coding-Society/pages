---
layout: post 
title: Student Toolkit - Insertion Sort Simulation
description: Insertion Sort animation to help visualize the sorting algorithm; meant to pair with student_toolkit sorting part 1 team teach lesson
permalink: /toolkit-sorting-insertion-simulation
author: Anusha Khobare, Eshaan Kumar, Matthew Wang
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insertion Sort Visualization</title>
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
        .shifting {
            background-color: red !important;
        }
        pre {
            text-align: left;
            display: inline-block;
            padding: 10px;
            border-radius: 5px;
            background-color: rgb(48, 48, 48)!important; /* Dark gray background */
            font-size: 14px;
        }
        .highlight {
            background-color: yellow !important;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Insertion Sort Visualization</h1>
    <div class="container" id="bar-container"></div>
    <button onclick="startSorting()">Start Sorting</button>
    <button onclick="resetBars()">Reset</button>
    <p id="status"></p>

    <pre id="code">
void insertion_sort(int A[], int n) {
    for (int i = 1; i < n; i++) {
        int key = A[i];
        int j = i - 1;

        while (j >= 0 && A[j] > key) {
            A[j + 1] = A[j];
            j--;
        }

        A[j + 1] = key;
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

        async function insertionSort() {
            let bars = document.querySelectorAll(".bar");
            let statusText = document.getElementById("status");

            for (let i = 1; i < arr.length; i++) {
                highlightCode(2);
                let key = arr[i];
                let j = i - 1;
                bars[i].classList.add("selected");
                statusText.textContent = `Step ${i}: Insert A[${i}] = ${key} into sorted part`;
                await new Promise(resolve => setTimeout(resolve, delay));

                highlightCode(4);
                while (j >= 0 && arr[j] > key) {
                    highlightCode(5);
                    bars[j].classList.add("comparing");
                    statusText.textContent = `Comparing A[${j}] = ${arr[j]} with key = ${key}`;

                    await new Promise(resolve => setTimeout(resolve, delay));

                    highlightCode(6);
                    arr[j + 1] = arr[j];
                    bars[j + 1].classList.add("shifting");
                    statusText.textContent = `Shifting A[${j}] = ${arr[j]} to position ${j + 1}`;
                    await new Promise(resolve => setTimeout(resolve, delay));

                    bars[j].classList.remove("comparing");
                    bars[j + 1].classList.remove("shifting");

                    j--;
                }

                highlightCode(9);
                arr[j + 1] = key;
                statusText.textContent = `Placed key = ${key} at position ${j + 1}`;
                await new Promise(resolve => setTimeout(resolve, delay));

                createBars();
                bars = document.querySelectorAll(".bar");
            }

            highlightCode(10);
            statusText.textContent = "Sorting Complete!";
        }

        function startSorting() {
            insertionSort();
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
