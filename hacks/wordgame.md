---
layout: opencs
title: Word Game
permalink: /wordgame
---

<style>
    #wordCanvas { 
        border: 10px solid #000;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    
    h2 {
        text-align: center;
        margin-top: 20px;
    }
    #options {
        margin-top: 20px;
        margin-bottom: 10px;
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        background-color: #007BFF;
        color: white;
        border-radius: 5px;
    }
</style>

<h2 style="display: inline-block; margin-right: auto;">Word Game</h2>
<p>Select a game mode (string length) from the options menu and try to type the prompt as quickly and accurately as possible!</p>
<button style="float: right;" id="options">Options</button>
<p>WPM: <span class="wpm"></span></p>
<p>Accuracy: <span class="accuracy"></span></p>

<canvas id="wordCanvas" width="800" height="200"></canvas>

<script>
    const wordCanvas = document.getElementById('wordCanvas');
    const wordCtx = wordCanvas.getContext('2d');
    const optionsButton = document.getElementById('options');

    let currentString = "";
    let userInput = "";
    let startTime = null;
    let finished = false;
    let mistakes = 0;

    const short_strings = ["The quick brown fox jumps over the lazy dog", "Pack my box with five dozen liquor jugs", "How quickly daft jumping zebras vex", "Jinxed wizards pluck ivy from the quilt", "Bright vixens jump, dozy fowl quack", "Sphinx of black quartz, judge my vow", "Two driven jocks help fax my big quiz", "Five quacking zephyrs jolt my wax bed", "The five boxing wizards jump quickly", "Jackdaws love my big sphinx of quartz"];
    const medium_strings = ["Amazingly few discotheques provide jukeboxes", "Back in June we delivered oxygen equipment of the same size", "The public was amazed to view the quickness and dexterity of the juggler", "Jovial zanies quickly gave up their quest for the exotic fish", "The wizard quickly jinxed the gnomes before they vaporized", "All questions asked by five watched experts amaze the judge", "The job requires extra pluck and zeal from every young wage earner", "Crazy Frederick bought many very exquisite opal jewels", "We promptly judged antique ivory buckles for the next prize", "Sixty zippers were quickly picked from the woven jute bag"];
    const long_strings = ["The wizard quickly jinxed the gnomes before they vaporized just beyond the village gates", "Heavy boxes perform quick waltzes and jigs while the young fox plays his fiddle nearby", "My faxed joke won a pager in the cable TV quiz show, making everyone in the room laugh", "Back in the quaint valley, jovial hikers mixed exotic fruit juice and warm bread by the campfire", "The public was amazed to view the quickness and dexterity of the juggler as he performed his tricks", "Amazingly few discotheques provide jukeboxes, making it hard for music lovers to enjoy their favorite tunes", "We promptly judged antique ivory buckles for the next prize in the competition, impressing all the judges", "Crazy Frederick bought many very exquisite opal jewels from the ancient market in the old town square", "Sixty zippers were quickly picked from the woven jute bag by the skilled tailor in the bustling city", "Back in June we delivered oxygen equipment of the same size and shape to all the hospitals in the region"];

    function drawText(text) {
        wordCtx.clearRect(0, 0, wordCanvas.width, wordCanvas.height);
        wordCtx.font = '24px Arial';
        wordCtx.fillStyle = '#dededeff';
        wordCtx.textAlign = 'center';
    
        const maxWidth = wordCanvas.width - 20; // Leave some padding
        const lineHeight = 30; // Line height for wrapped text
        const lines = wrapText(text, maxWidth);
    
        const startY = (wordCanvas.height - lines.length * lineHeight) / 2; // Center vertically
        lines.forEach((line, index) => {
            wordCtx.fillText(line, wordCanvas.width / 2, startY + index * lineHeight);
        });
    }
    
    function wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
    
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = wordCtx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine); // Add the last line
        return lines;
    }

    function drawUserText(prompt, input) {
        wordCtx.clearRect(0, 0, wordCanvas.width, wordCanvas.height);
        wordCtx.font = '24px Arial';
        wordCtx.textAlign = 'left';
    
        const maxWidth = wordCanvas.width - 20; // Leave enough padding
        const lineHeight = 30; // Line height for wrapped text
        const lines = wrapText(prompt, maxWidth);
    
        const startY = (wordCanvas.height - lines.length * lineHeight) / 2; // Center vertically
    
        // Draw the prompt text line by line
        lines.forEach((line, lineIndex) => {
            const lineY = startY + lineIndex * lineHeight;
            const lineX = (wordCanvas.width - wordCtx.measureText(line).width) / 2; // Center each line
            wordCtx.fillStyle = '#dededeff';
            wordCtx.fillText(line, lineX, lineY);
    
            // Draw user input for the current line
            let currentX = lineX;
            const startCharIndex = lines.slice(0, lineIndex).join(' ').length + (lineIndex > 0 ? 1 : 0);
            const endCharIndex = startCharIndex + line.length;
    
            for (let i = startCharIndex; i < Math.min(input.length, endCharIndex); i++) {
                const char = input[i];
                const promptChar = prompt[i] || '';
                const color = char === promptChar ? 'green' : 'red';
                wordCtx.fillStyle = color;
                wordCtx.fillText(char, currentX, lineY);
                currentX += wordCtx.measureText(promptChar).width;
            }
        });
    }

    function updateStats(prompt, input, startTime) {
        // Accuracy calculation
        const totalTyped = input.length;
        const accuracy = totalTyped > 0 ? Math.round(((totalTyped - mistakes) / totalTyped) * 100) : 100;
        document.querySelector('.accuracy').textContent = accuracy + '%';

        // WPM calculation
        if (startTime) {
            const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
            const words = prompt.length / 5;
            const wpm = elapsed > 0 ? Math.round(words / elapsed) : 0;
            document.querySelector('.wpm').textContent = wpm;
        } else {
            document.querySelector('.wpm').textContent = '0';
        }
    }

    function finishGame(prompt, input, startTime) {
        finished = true;
        updateStats(prompt, input, startTime);
        alert('Finished! WPM: ' + document.querySelector('.wpm').textContent + ', Accuracy: ' + document.querySelector('.accuracy').textContent);
    }

    function startGame() {
        if (currentString === "") {
            alert("Please select a string length from the options menu.");
            return;
        }

        let stringArray;
        if (currentString === "short_strings") {
            stringArray = short_strings;
        } else if (currentString === "medium_strings") {
            stringArray = medium_strings;
        } else if (currentString === "long_strings") {
            stringArray = long_strings;
        }

        const randomIndex = Math.floor(Math.random() * stringArray.length);
        const selectedString = stringArray[randomIndex];
        userInput = "";
        mistakes = 0; // Reset mistakes at the start of the game
        finished = false;
        startTime = Date.now();
        drawText(selectedString);
        document.querySelector('.wpm').textContent = '0';
        document.querySelector('.accuracy').textContent = '100%';

        document.onkeydown = function (e) {
            if (finished) return;

            if (e.key.length === 1 && userInput.length < selectedString.length) {
                const nextChar = selectedString[userInput.length];
                if (e.key !== nextChar) {
                    mistakes++; // Increment mistakes for incorrect characters
                }
                userInput += e.key;
            } else if (e.key === 'Backspace' && userInput.length > 0) {
                userInput = userInput.slice(0, -1);
            }

            drawUserText(selectedString, userInput);
            updateStats(selectedString, userInput, startTime);

            if (userInput === selectedString) {
                finishGame(selectedString, userInput, startTime);
            }
        };
    }

    optionsButton.addEventListener('click', () => {
        const menu = document.createElement('div');
        menu.style.position = 'absolute';
        menu.style.width = '200px'; // Set a fixed width for the menu
        menu.style.border = '1px solid #ccc';
        menu.style.backgroundColor = '#fff';
        menu.style.padding = '10px';
        menu.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        menu.style.textAlign = 'center'; // Center-align the text inside the menu
    
        // Center the menu in the middle of the screen
        menu.style.top = `${window.innerHeight / 2 - 50}px`; // Adjust for menu height
        menu.style.left = `${window.innerWidth / 2 - 100}px`; // Adjust for menu width
    
        const shortOption = document.createElement('button');
        shortOption.textContent = 'Short Strings';
        shortOption.style.display = 'block';
        shortOption.style.margin = '10px 0';
        shortOption.addEventListener('click', () => {
            currentString = "short_strings";
            startGame();
            document.body.removeChild(menu);
        });
    
        const mediumOption = document.createElement('button');
        mediumOption.textContent = 'Medium Strings';
        mediumOption.style.display = 'block';
        mediumOption.style.margin = '10px 0';
        mediumOption.addEventListener('click', () => {
            currentString = "medium_strings";
            startGame();
            document.body.removeChild(menu);
        });
    
        const longOption = document.createElement('button');
        longOption.textContent = 'Long Strings';
        longOption.style.display = 'block';
        longOption.style.margin = '10px 0';
        longOption.addEventListener('click', () => {
            currentString = "long_strings";
            startGame();
            document.body.removeChild(menu);
        });
    
        menu.appendChild(shortOption);
        menu.appendChild(mediumOption);
        menu.appendChild(longOption);
        document.body.appendChild(menu);
    });
</script>