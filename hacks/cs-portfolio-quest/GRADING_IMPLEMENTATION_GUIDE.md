# Grade Collection System - Implementation Guide

## Overview

This guide explains how to implement the grading function in each submodule so that the grade collection system (`grades.js`) can automatically collect student names and grades.

## Quick Start

Each submodule should implement a JavaScript function called `getStudentGrade()` that returns student information.

### Basic Implementation

Add this to the bottom of your submodule's `<script>` section:

```javascript
/**
 * Returns the student's name and grade for this submodule
 * This function is called by the grade collection system
 */
function getStudentGrade() {
    return {
        name: "Student Name",      // or use: localStorage.getItem('studentName')
        grade: 85                   // The student's grade (0-100)
    };
}

// Make it available globally
window.getStudentGrade = getStudentGrade;
```

## Implementation Examples

### Example 1: Simple Static Grade

If your submodule has a quiz or assessment that stores results in localStorage:

```javascript
function getStudentGrade() {
    const studentName = localStorage.getItem('studentName') || 'Anonymous';
    const quizScore = localStorage.getItem('frontend-submodule-1-score') || 0;
    
    return {
        name: studentName,
        grade: parseInt(quizScore)
    };
}

window.getStudentGrade = getStudentGrade;
```

### Example 2: Calculate Grade from Multiple Activities

If your submodule tracks multiple activities:

```javascript
function getStudentGrade() {
    const studentName = localStorage.getItem('studentName') || 'Anonymous';
    
    // Get scores from different activities
    const quizScore = parseInt(localStorage.getItem('quiz-score') || 0);
    const labScore = parseInt(localStorage.getItem('lab-score') || 0);
    const homeworkScore = parseInt(localStorage.getItem('homework-score') || 0);
    
    // Calculate weighted average
    const finalGrade = (quizScore * 0.5) + (labScore * 0.3) + (homeworkScore * 0.2);
    
    return {
        name: studentName,
        grade: Math.round(finalGrade)
    };
}

window.getStudentGrade = getStudentGrade;
```

### Example 3: Check Completion Status

If your submodule tracks completion of lessons:

```javascript
function getStudentGrade() {
    const studentName = localStorage.getItem('studentName') || 'Anonymous';
    
    // Check which lessons are completed
    const lesson1Complete = localStorage.getItem('lesson-1-complete') === 'true';
    const lesson2Complete = localStorage.getItem('lesson-2-complete') === 'true';
    const lesson3Complete = localStorage.getItem('lesson-3-complete') === 'true';
    
    // Calculate grade based on completion (33.33% per lesson)
    let grade = 0;
    if (lesson1Complete) grade += 33.33;
    if (lesson2Complete) grade += 33.33;
    if (lesson3Complete) grade += 33.34;
    
    return {
        name: studentName,
        grade: Math.round(grade)
    };
}

window.getStudentGrade = getStudentGrade;
```

### Example 4: Interactive Module with Real-time Scoring

```javascript
// Track student progress throughout the module
let studentProgress = {
    name: '',
    quizAttempts: 0,
    correctAnswers: 0,
    totalQuestions: 10,
    labCompleted: false
};

// Update progress when student completes activities
function submitQuiz(answers) {
    studentProgress.quizAttempts++;
    studentProgress.correctAnswers = calculateCorrectAnswers(answers);
    
    // Save to localStorage
    localStorage.setItem('module-progress', JSON.stringify(studentProgress));
}

function completeLabActivity() {
    studentProgress.labCompleted = true;
    localStorage.setItem('module-progress', JSON.stringify(studentProgress));
}

// Grade function for collection system
function getStudentGrade() {
    // Load saved progress
    const saved = localStorage.getItem('module-progress');
    if (saved) {
        studentProgress = JSON.parse(saved);
    }
    
    // Calculate grade
    const quizGrade = (studentProgress.correctAnswers / studentProgress.totalQuestions) * 70;
    const labGrade = studentProgress.labCompleted ? 30 : 0;
    const totalGrade = quizGrade + labGrade;
    
    return {
        name: studentProgress.name || localStorage.getItem('studentName') || 'Anonymous',
        grade: Math.round(totalGrade)
    };
}

window.getStudentGrade = getStudentGrade;
```

## Best Practices

### 1. Student Name Management

Use a consistent way to store and retrieve student names across all submodules:

```javascript
// At the beginning of your submodule, prompt for name if not set
if (!localStorage.getItem('studentName')) {
    const name = prompt('Please enter your name:');
    if (name) {
        localStorage.setItem('studentName', name);
    }
}
```

### 2. Use Unique Storage Keys

Prefix your localStorage keys with the submodule identifier:

```javascript
localStorage.setItem('frontend-submodule-1-score', score);
localStorage.setItem('frontend-submodule-1-completed', 'true');
```

### 3. Handle Missing Data

Always provide default values:

```javascript
function getStudentGrade() {
    const studentName = localStorage.getItem('studentName') || 'Anonymous';
    const score = parseInt(localStorage.getItem('module-score') || 0);
    
    return {
        name: studentName,
        grade: score
    };
}
```

### 4. Validate Grade Range

Ensure grades are between 0 and 100:

```javascript
function getStudentGrade() {
    let grade = calculateGrade();
    
    // Clamp between 0 and 100
    grade = Math.max(0, Math.min(100, grade));
    
    return {
        name: getStudentName(),
        grade: Math.round(grade)
    };
}
```

## Testing Your Implementation

### Test in Browser Console

Open your submodule page and test in the console:

```javascript
// Test the function exists
typeof getStudentGrade
// Should return: "function"

// Test calling it
getStudentGrade()
// Should return: {name: "Student Name", grade: 85}
```

### Test with Grade Collection System

1. Open `grade-collection-dashboard.html`
2. Use the "Test Single Submodule" feature in console:

```javascript
await CSPortfolioGrades.testSingleSubmodule('frontend', 1)
```

## Example Complete Submodule

Here's a complete example of a submodule with grading:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Frontend Submodule 1</title>
</head>
<body>
    <h1>Frontend Development - Lesson 1</h1>
    
    <div id="quiz">
        <h2>Quiz</h2>
        <div id="question1">
            <p>What is HTML?</p>
            <input type="radio" name="q1" value="correct"> HyperText Markup Language<br>
            <input type="radio" name="q1" value="wrong"> Hyperlinks and Text Markup Language
        </div>
        <!-- More questions... -->
        <button onclick="submitQuiz()">Submit Quiz</button>
    </div>
    
    <div id="results" style="display:none;">
        <h2>Your Score: <span id="score"></span></h2>
    </div>

    <script>
        // Initialize student
        let studentName = localStorage.getItem('studentName');
        if (!studentName) {
            studentName = prompt('Please enter your name:') || 'Anonymous';
            localStorage.setItem('studentName', studentName);
        }

        function submitQuiz() {
            // Calculate score
            let correct = 0;
            if (document.querySelector('input[name="q1"][value="correct"]').checked) {
                correct++;
            }
            // Check other questions...
            
            const totalQuestions = 10;
            const score = Math.round((correct / totalQuestions) * 100);
            
            // Save score
            localStorage.setItem('frontend-submodule-1-score', score);
            localStorage.setItem('frontend-submodule-1-completed', 'true');
            
            // Display result
            document.getElementById('score').textContent = score + '%';
            document.getElementById('results').style.display = 'block';
        }

        // GRADING FUNCTION FOR COLLECTION SYSTEM
        function getStudentGrade() {
            return {
                name: localStorage.getItem('studentName') || 'Anonymous',
                grade: parseInt(localStorage.getItem('frontend-submodule-1-score') || 0)
            };
        }

        // Make it globally accessible
        window.getStudentGrade = getStudentGrade;
    </script>
</body>
</html>
```

## Storage Structure Recommendations

Organize your localStorage like this:

```javascript
// Global
localStorage.setItem('studentName', 'John Doe');
localStorage.setItem('studentEmail', 'john@example.com');

// Per Category
localStorage.setItem('frontend-progress', '60%');
localStorage.setItem('backend-progress', '40%');

// Per Submodule
localStorage.setItem('frontend-submodule-1-score', '95');
localStorage.setItem('frontend-submodule-1-completed', 'true');
localStorage.setItem('frontend-submodule-1-timestamp', '2025-10-30T10:30:00Z');

// Per Activity
localStorage.setItem('frontend-submodule-1-quiz-score', '90');
localStorage.setItem('frontend-submodule-1-lab-score', '100');
localStorage.setItem('frontend-submodule-1-homework-score', '85');
```

## Troubleshooting

### Function Not Found

Make sure the function is defined at the global scope:

```javascript
// ✅ Correct - Global scope
function getStudentGrade() {
    return { name: "John", grade: 85 };
}
window.getStudentGrade = getStudentGrade;

// ❌ Wrong - Inside another function
document.addEventListener('DOMContentLoaded', function() {
    function getStudentGrade() {
        return { name: "John", grade: 85 };
    }
});
```

### Data Not Persisting

Check localStorage availability:

```javascript
function getStudentGrade() {
    if (typeof(Storage) === "undefined") {
        console.error("localStorage not available");
        return { name: "Anonymous", grade: 0 };
    }
    
    // ... rest of function
}
```

### Cross-Origin Issues

If testing locally, make sure you're using a local server (not `file://`):

```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

## FAQ

**Q: What if my submodule doesn't have a grade yet?**  
A: Return 0 as the grade, or implement partial credit based on progress.

**Q: Can I return additional data?**  
A: Yes! The system only requires `name` and `grade`, but you can add more:

```javascript
function getStudentGrade() {
    return {
        name: "John Doe",
        grade: 85,
        completedDate: "2025-10-30",
        timeSpent: 45,  // minutes
        attempts: 2
    };
}
```

**Q: How do I test without implementing the full submodule?**  
A: Create a simple test function that returns dummy data:

```javascript
function getStudentGrade() {
    return {
        name: "Test Student",
        grade: Math.floor(Math.random() * 100)  // Random grade for testing
    };
}
window.getStudentGrade = getStudentGrade;
```

## Support

For questions or issues, contact the CS Portfolio Quest development team.

