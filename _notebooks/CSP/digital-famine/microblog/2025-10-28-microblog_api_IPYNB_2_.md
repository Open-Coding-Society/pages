---
layout: post
title: Microblog API
permalink: /digital-famine/microblog/api/
breadcrumb: True
footer:
  previous: /digital-famine/microblog/
  home: /digital-famine/
  next: /digital-famine/microblog/microb/
---

# Microblog API - Beginner's Guide

> **A simple social media backend built with Python - perfect for learning**

---

## What's Inside This Guide

- [What is This?](#-what-is-this)
- [Why Should I Care?](#-why-should-i-care)
- [What Do I Need?](#-what-do-i-need)
- [How to Run It](#-how-to-run-it)
- [What Can I Learn?](#-what-can-i-learn)
- [Easy Starter Activities](#-easy-starter-activities)

---

## What is This?

**Microblog API** is like a mini-Twitter backend. It's the server part of a social media app where:

- Users can sign up and log in
- Users can write posts
- Users can read other people's posts

**BUT** - this is just the backend. There's no pretty website or app interface. It's the "behind the scenes" code that makes everything work.

Think of it like this:
```
Instagram App (Frontend) ←→ Instagram's Servers (Backend like this!)
```

---

## Why Should I Care?

This project is great for **AP Computer Science Principles** because:

| Reason | Why It Matters |
|--------|----------------|
| **Covers AP CSP concepts** | Networks, data, the internet, and how apps work |
| **Uses Python** | You might already know some Python! |
| **See it work** | Not just theory - you can actually run it and test it |
| **Real-world example** | This is how actual apps like Instagram work |

**You don't need to understand all the code!** The goal is to:
- See how a backend works
- Try using an API
- Understand the basics of how data moves around

---

## What Do I Need?

### Option A: The Easy Way (Using Docker)
- A computer with **Docker Desktop** installed
- That's it!

### Option B: The Python Way
- Python 3 installed on your computer
- Basic command line knowledge (just copying and pasting commands)

**Don't worry if you don't know Docker or Python well yet!** The instructions below are step-by-step.

---

## How to Run It

### Easy Way: Docker (Recommended)

Think of Docker like a pre-made package that has everything ready to go.

#### Step 1: Get the code
Open your terminal and type:
```bash
git clone https://github.com/miguelgrinberg/microblog-api
cd microblog-api
```

#### Step 2: Set up the settings file
```bash
cp .env.example .env
```
*(This just copies a template file - you can skip editing it for now)*

#### Step 3: Start it up!
```bash
docker-compose up -d
```

Wait a minute for it to start...

#### Step 4: Check if it's working
Open your web browser and go to:
```
http://localhost:5000/docs
```

You should see a page with API documentation!

#### Step 5: Add some fake data to play with
```bash
docker-compose run --rm microblog-api bash -c "flask fake users 10 && flask fake posts 100"
```

Now you have 10 fake users and 100 fake posts to test with!

#### To stop it later:
```bash
docker-compose down
```

---

### Python Way (If Docker doesn't work)

#### Step 1: Get the code
```bash
git clone https://github.com/miguelgrinberg/microblog-api
cd microblog-api
```

#### Step 2: Set up Python environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Step 3: Set up the database
```bash
alembic upgrade head
flask fake users 10
flask fake posts 100
```

#### Step 4: Run it!
```bash
flask run
```

#### Step 5: Check it out
Open your browser to:
```
http://localhost:5000/docs
```

---

## Common Problem

**If you see an error about port 5000:**

On newer Macs, Apple uses port 5000 for something else. 

Quick fix - use a different port:
```bash
flask run --port=4000
```

Then visit `http://localhost:4000/docs` instead.

---

## What Can I Learn?

### For AP CSP, this project shows:

#### **The Internet**
- How do apps send and receive data?
- What is an API? (Answer: A way for programs to talk to each other!)

#### **Data**
- How is user information stored?
- What is a database?

#### **Security**
- How do apps know who you are?
- What is authentication?

#### **Abstraction**
- How complex systems are broken into smaller pieces
- Why we organize code into files and folders

---

## Easy Starter Activities

### Activity 1: Explore the API (5 minutes)
1. Go to `http://localhost:5000/docs`
2. Look at the list of endpoints (the different things the API can do)
3. Find the "GET /api/users" endpoint
4. Click "Try it out" and then "Execute"
5. See the list of fake users!

**What you learned:** How to send a request to an API and get data back

---

### Activity 2: Create a User (10 minutes)
1. Find the "POST /api/users" endpoint
2. Click "Try it out"
3. Fill in the example data (make up a username and email)
4. Click "Execute"
5. You just created a user!

**What you learned:** How apps send data to servers

---

### Activity 3: See the Posts (5 minutes)
1. Find "GET /api/posts"
2. Try it out
3. See all the fake posts that were created

**What you learned:** How social media apps get posts to show you

---


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Learning - Interactive Fill-in-the-Blanks</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-attachment: fixed;
            color: #333;
            line-height: 1.6;
            padding: 20px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #000000ff;
            font-size: 1.1rem;
        }
        
        .question-card {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 25px;
            margin-bottom: 25px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .question-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .question {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 15px;
            color: #2c3e50;
        }
        
        .answer-input {
            display: inline-block;
            width: 250px;
            height: 40px;
            border: 2px solid #3498db;
            border-radius: 5px;
            margin: 0 5px;
            padding: 0 10px;
            vertical-align: middle;
            background-color: #e8f4fc;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .answer-input:focus {
            outline: none;
            border-color: #2980b9;
            background-color: #d6eaf8;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
        }
        
        .answer-input.correct {
            border-color: #27ae60;
            background-color: #d5f4e6;
        }
        
        .answer-input.incorrect {
            border-color: #e74c3c;
            background-color: #fadbd8;
        }
        
        .button-group {
            margin-top: 15px;
        }
        
        .answer-btn {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background-color 0.3s ease;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        
        .answer-btn:hover {
            background-color: #2980b9;
        }
        
        .check-btn {
            background-color: #2ecc71;
        }
        
        .check-btn:hover {
            background-color: #27ae60;
        }
        
        .show-btn {
            background-color: #9b59b6;
        }
        
        .show-btn:hover {
            background-color: #8e44ad;
        }
        
        .reset-btn {
            background-color: #e74c3c;
        }
        
        .reset-btn:hover {
            background-color: #c0392b;
        }
        
        .feedback {
            margin-top: 15px;
            padding: 12px;
            background-color: #f8f9fa;
            border-left: 4px solid #3498db;
            border-radius: 0 5px 5px 0;
            display: none;
            animation: fadeIn 0.5s ease;
        }
        
        .feedback.correct {
            border-left-color: #27ae60;
            background-color: #d5f4e6;
        }
        
        .feedback.incorrect {
            border-left-color: #e74c3c;
            background-color: #fadbd8;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .score-container {
            text-align: center;
            margin-top: 30px;
            padding: 15px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .score {
            font-size: 1.5rem;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #000000ff;
            font-size: 0.9rem;
        }
        
        @media (max-width: 600px) {
            .container {
                padding: 10px;
            }
            
            .question-card {
                padding: 15px;
            }
            
            .answer-input {
                width: 100%;
                margin: 5px 0;
            }
            
            .button-group {
                text-align: center;
            }
            
            .answer-btn {
                width: 100%;
                margin: 5px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>API Learning - Interactive Fill-in-the-Blanks</h1>
            <p class="subtitle">Type your answers in the colored boxes and check them with the buttons</p>
        </header>
        
        <div class="question-card">
            <div class="question">Q: What is an API?</div>
            <p>A: It's <input type="text" class="answer-input" id="input1" placeholder="Type your answer here...">. Like how your Instagram app talks to Instagram's servers.</p>
            <div class="button-group">
                <button class="answer-btn check-btn" onclick="checkAnswer(1)">Check Answer</button>
                <button class="answer-btn show-btn" onclick="showAnswer(1)">Show Answer</button>
                <button class="answer-btn reset-btn" onclick="resetAnswer(1)">Reset</button>
            </div>
            <div class="feedback" id="feedback1"></div>
        </div>
        
        <div class="question-card">
            <div class="question">Q: What does this backend do?</div>
            <p>A: It <input type="text" class="answer-input" id="input2" placeholder="Type your answer here...">, and lets you get or add data through specific URLs.</p>
            <div class="button-group">
                <button class="answer-btn check-btn" onclick="checkAnswer(2)">Check Answer</button>
                <button class="answer-btn show-btn" onclick="showAnswer(2)">Show Answer</button>
                <button class="answer-btn reset-btn" onclick="resetAnswer(2)">Reset</button>
            </div>
            <div class="feedback" id="feedback2"></div>
        </div>
        
        <div class="question-card">
            <div class="question">Q: How do you test it?</div>
            <p>A: <input type="text" class="answer-input" id="input3" placeholder="Type your answer here..."> and try different endpoints.</p>
            <div class="button-group">
                <button class="answer-btn check-btn" onclick="checkAnswer(3)">Check Answer</button>
                <button class="answer-btn show-btn" onclick="showAnswer(3)">Show Answer</button>
                <button class="answer-btn reset-btn" onclick="resetAnswer(3)">Reset</button>
            </div>
            <div class="feedback" id="feedback3"></div>
        </div>
        
        <div class="question-card">
            <div class="question">Q: What technology is it built with?</div>
            <p>A: <input type="text" class="answer-input" id="input4" placeholder="Type your answer here...">, plus a database to store information.</p>
            <div class="button-group">
                <button class="answer-btn check-btn" onclick="checkAnswer(4)">Check Answer</button>
                <button class="answer-btn show-btn" onclick="showAnswer(4)">Show Answer</button>
                <button class="answer-btn reset-btn" onclick="resetAnswer(4)">Reset</button>
            </div>
            <div class="feedback" id="feedback4"></div>
        </div>
        
        <div class="question-card">
            <div class="question">Q: Can you explain how it works?</div>
            <p>A: When you visit a URL like <input type="text" class="answer-input" id="input5" placeholder="Type your answer here...">, the server looks at its database and sends back the user information as data.</p>
            <div class="button-group">
                <button class="answer-btn check-btn" onclick="checkAnswer(5)">Check Answer</button>
                <button class="answer-btn show-btn" onclick="showAnswer(5)">Show Answer</button>
                <button class="answer-btn reset-btn" onclick="resetAnswer(5)">Reset</button>
            </div>
            <div class="feedback" id="feedback5"></div>
        </div>
        
        <div class="score-container">
            <div class="score">Score: <span id="score">0</span>/5</div>
            <button class="answer-btn" onclick="resetAll()" style="margin-top: 10px;">Reset All Answers</button>
        </div>
        
        <div class="footer">
            <p>API Learning Exercise - Interactive Fill-in-the-Blanks Quiz</p>
        </div>
    </div>

    <script>
        // Define correct answers
        const correctAnswers = {
            1: "a way for programs to talk to each other",
            2: "stores users and posts",
            3: "Go to /docs in the browser",
            4: "Python and Flask (a web framework)",
            5: "/api/users"
        };
        
        // Define full answers for display
        const fullAnswers = {
            1: "It's a way for programs to talk to each other. Like how your Instagram app talks to Instagram's servers.",
            2: "It stores users and posts, and lets you get or add data through specific URLs.",
            3: "Go to /docs in the browser and try different endpoints.",
            4: "Python and Flask (a web framework), plus a database to store information.",
            5: "When you visit a URL like /api/users, the server looks at its database and sends back the user information as data."
        };
        
        let score = 0;
        const answeredQuestions = new Set();
        
        // Function to check answer
        function checkAnswer(questionNum) {
            const input = document.getElementById(`input${questionNum}`);
            const feedback = document.getElementById(`feedback${questionNum}`);
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = correctAnswers[questionNum].toLowerCase();
            
            // Clear previous styling
            input.classList.remove("correct", "incorrect");
            feedback.classList.remove("correct", "incorrect");
            
            if (userAnswer === correctAnswer) {
                // Correct answer
                input.classList.add("correct");
                feedback.classList.add("correct");
                feedback.innerHTML = `<strong>Correct!</strong> ${fullAnswers[questionNum]}`;
                feedback.style.display = "block";
                
                // Update score if not already counted
                if (!answeredQuestions.has(questionNum)) {
                    answeredQuestions.add(questionNum);
                    score++;
                    updateScore();
                }
            } else {
                // Incorrect answer
                input.classList.add("incorrect");
                feedback.classList.add("incorrect");
                feedback.innerHTML = `<strong>Incorrect.</strong> Try again or click "Show Answer" to see the correct answer.`;
                feedback.style.display = "block";
            }
        }
        
        // Function to show answer
        function showAnswer(questionNum) {
            const input = document.getElementById(`input${questionNum}`);
            const feedback = document.getElementById(`feedback${questionNum}`);
            
            input.value = correctAnswers[questionNum];
            input.classList.remove("incorrect");
            input.classList.add("correct");
            feedback.classList.remove("incorrect");
            feedback.classList.add("correct");
            feedback.innerHTML = `<strong>Answer:</strong> ${fullAnswers[questionNum]}`;
            feedback.style.display = "block";
            
            // Update score if not already counted
            if (!answeredQuestions.has(questionNum)) {
                answeredQuestions.add(questionNum);
                score++;
                updateScore();
            }
        }
        
        // Function to reset a single answer
        function resetAnswer(questionNum) {
            const input = document.getElementById(`input${questionNum}`);
            const feedback = document.getElementById(`feedback${questionNum}`);
            
            input.value = "";
            input.classList.remove("correct", "incorrect");
            feedback.classList.remove("correct", "incorrect");
            feedback.style.display = "none";
            
            // Remove from score if previously counted
            if (answeredQuestions.has(questionNum)) {
                answeredQuestions.delete(questionNum);
                score--;
                updateScore();
            }
        }
        
        // Function to reset all answers
        function resetAll() {
            for (let i = 1; i <= 5; i++) {
                resetAnswer(i);
            }
        }
        
        // Function to update score display
        function updateScore() {
            document.getElementById("score").textContent = score;
        }
        
        // Add keyboard event listeners for Enter key
        document.addEventListener('DOMContentLoaded', function() {
            for (let i = 1; i <= 5; i++) {
                const input = document.getElementById(`input${i}`);
                input.addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        checkAnswer(i);
                    }
                });
            }
        });
    </script>
</body>
</html>


---
## Simple Explanations

**Backend** = The server part of an app that stores data and does the work

**Frontend** = The part you see and click (the app or website)

**API** = Application Programming Interface - a way for programs to communicate

**Endpoint** = A specific URL that does one thing (like `/api/users` shows users)

**Database** = Where information is stored permanently

**Request** = Asking the server for something

**Response** = What the server sends back

---

## Summary for AP CSP

This project demonstrates:
- How the internet and networks work
- How data is stored and retrieved
- Basic security concepts
- How large programs are organized
- How apps communicate with servers

**Your goal:** Understand the big picture of how a backend works, not every detail of the code!

---

<div align="center">

### You've Got This!

**Don't worry about understanding everything. Just explore and learn!**

*Remember: Every expert programmer started exactly where you are now.* 

</div>

---

**Quick Reference:**
- GitHub: https://github.com/miguelgrinberg/microblog-api
