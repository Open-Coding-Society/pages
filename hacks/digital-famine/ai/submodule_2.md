---
layout: post
title: "Prompt Engineering"
description: "Using different Prompts"
permalink: /digital-famine/ai/submodule_2/
breadcrumb: true
microblog: true
parent: "AI Usage"
team: "Debuggers"
submodule: 2
categories: [CSP, Submodule, AIUsage]
tags: [ai, prompts, debuggers]
author: "Debuggers Team - Ruchika Kench, Anishka Sanghvi"
date: 2025-10-21
---

# Prompt Engineering

## Why is prompt engineering important?
Prompt engineering is both an art and a science. It empowers users to unlock the full potential of AI systems by communicating with them effectively and generate the output they want. No matter your purpose of using AI, mastering prompt engineering can really enhance your productivity and lead to more accurate responses by AI to your commands.

## How does AI respond to user prompts?
Generative AI, like ChatGPT and Claude use natural language processing and machine learning to respond to the prompts we give. This combination helps AI respond to users like it is talking to another human (natural language processing) and can learn from your input (machine learning).

## Types of different prompts:
 - Text Prompts
    - Example: Typing a command to AI to describe the difference between climate change and global warming.

 - Voice Commands
    - Example: Asking AI to recognize a song after playing the audio to the microphone input button.

 - Visual Prompts
    - Example: Sending a picture of your family to AI and asking it to convert the picture to a Renaissance style painting.

# How to use prompt engineering with different prompts
## Text Prompts
✅ What to Do:


- Be specific and clear

✅ Good: "Write a 3-paragraph summary of the book Animal Farm by George Orwell with emphasis on motifs present in the book."

❌ Bad: "Tell me about Animal Farm by George Orwell."



- Give context

✅ Good: "I'm a high school student. Can you explain the basic principles of quantum physics in simple terms?"

❌ Bad: "Explain quantum physics."



- Use examples or structure

✅ Good: "Create a to-do list for a destination wedding in Switzerland with the activities pasted below. Format it with bullet points."

❌ Bad: "Help me plan a wedding."



- Set the tone or style

✅ Good: "Write a funny tweet about coffee addiction."

❌ Bad: "Write something about coffee."



Impact:

Clear prompts = more accurate, useful, and creative responses.

Vague prompts = generic or off-topic answers.


## Voice Commands
Voice prompts are used in smart assistants (like Siri, Alexa, or AI chat apps with voice input).

✅ What to Do:


- Speak naturally but clearly

✅ Good: "Set a reminder for 3 PM today to call Mom."

❌ Bad: "Set a Reminder… Mom… later."



- Use short, complete sentences

✅ Good: "What's the weather like in London tomorrow?"

❌ Bad: "London weather?"



- Avoid background noise

Speak in a quiet space so the AI can understand you better.



- Use follow-up questions

✅ Good: "Who is Marie Curie?" → "What did she discover?"
This helps the AI stay in context.



Impact:

Clear voice commands = faster, more accurate responses.

Mumbled or fragmented speech = misinterpretation or errors.


## Visual Prompts
Visual prompts involve uploading or showing images to AI (like asking it to describe, analyze, or generate something based on a picture).

✅ What to Do:


- Use high-quality images

✅ Good: A clear photo of a plant for identification.

❌ Bad: A blurry or dark image.



- Add a text prompt with the image

✅ Good: "What kind of insect is this?" (with a photo)

❌ Bad: Just uploading the image with no context.



- Ask specific questions about the image

✅ Good: "What's the architectural style of this building?"

❌ Bad: "What do you think?"



- Use visual + text for creative tasks

✅ Good: "Generate a painting of this dog with flower with a black and white color scheme, painted with watercolors."

❌ Bad: "Make this better."



Impact:

Clear visuals + context = accurate analysis or creative output.
Unclear images or vague prompts = poor results or confusion.

## Types of AI prompt engineering (from MIT Sloan Teaching and Learning Technologies)

<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 12px; background-color: #f2f2f2; text-align: left;">Prompt Type</th>
      <th style="border: 1px solid #ddd; padding: 12px; background-color: #f2f2f2; text-align: left;">Description</th>
      <th style="border: 1px solid #ddd; padding: 12px; background-color: #f2f2f2; text-align: left;">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;"><strong>Zero-Shot Prompt</strong></td>
      <td style="border: 1px solid #ddd; padding: 12px;">Give simple and clear instructions without examples. Useful for a quick, general response.</td>
      <td style="border: 1px solid #ddd; padding: 12px;">"Summarize this article in 5 bullet points."</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;"><strong>Few-Shot Prompt</strong></td>
      <td style="border: 1px solid #ddd; padding: 12px;">Provide a few examples of what you want the AI to mimic. Helps the model learn your desired structure or tone.</td>
      <td style="border: 1px solid #ddd; padding: 12px;">"Here are 2 example summaries. Write a third in the same style."</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;"><strong>Instructional Prompt</strong></td>
      <td style="border: 1px solid #ddd; padding: 12px;">Include direct commands using verbs like "write", "explain", or "compare."</td>
      <td style="border: 1px solid #ddd; padding: 12px;">"Write an executive summary of this memo. Keep it under 100 words."</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;"><strong>Role-Based Prompt</strong></td>
      <td style="border: 1px solid #ddd; padding: 12px;">Ask the AI to assume a particular persona or viewpoint. Useful for creativity and domain-specific responses.</td>
      <td style="border: 1px solid #ddd; padding: 12px;">"You are an MBA professor preparing a lecture outline..."</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;"><strong>Contextual Prompt</strong></td>
      <td style="border: 1px solid #ddd; padding: 12px;">Include relevant background or framing before asking a question. Helps the AI tailor responses to a specific audience or setting.</td>
      <td style="border: 1px solid #ddd; padding: 12px;">"This text is for an undergrad course on behavioral econ. Rephrase it in simpler language."</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;"><strong>Meta Prompt / System Prompt</strong></td>
      <td style="border: 1px solid #ddd; padding: 12px;">Behind-the-scenes, system-level instructions that set the AI's behavior, tone, or scope before any user input. Typically written by the platform (e.g., OpenAI). You won't usually don't see or write these unless you're building your own AI tool.</td>
      <td style="border: 1px solid #ddd; padding: 12px;">"Always respond formally and cite real sources. Never guess."</td>
    </tr>
  </tbody>
</table>

## Final Tips for All Prompt Types

Think like a teacher: Explain what you want as if teaching someone new. Make sure to treat the context of your responses as if AI does not know what you want (like explaining instructions to a 5 year old) 

Iterate: If the first result isn't perfect, refine your prompt and re-explain what you expect from AI in your desired answer.

Use formatting: For text prompts, ask for bullet points, tables, or sections.

---

## Interactive Prompt Engineering Quiz

<div id="quiz-container">
  <div class="question-block" id="question1">
    <h3>Question 1: Which of the following is an example of a few-shot prompt?</h3>
    <div class="options">
      <button class="option-btn" onclick="checkAnswer(1, 'A', false)">A) "Summarize this article in 5 bullet points."</button>
      <button class="option-btn" onclick="checkAnswer(1, 'B', true)">B) "Here are 2 example summaries. Write a third in the same style."</button>
      <button class="option-btn" onclick="checkAnswer(1, 'C', false)">C) "You are a history teacher. Explain the causes of World War I."</button>
      <button class="option-btn" onclick="checkAnswer(1, 'D', false)">D) "Write a 200-word essay about climate change."</button>
    </div>
    <div id="feedback1" class="feedback"></div>
  </div>

  <div class="question-block" id="question2">
    <h3>Question 2: What is the main difference between a zero-shot prompt and an instructional prompt?</h3>
    <div class="options">
      <button class="option-btn" onclick="checkAnswer(2, 'A', false)">A) Zero-shot prompts are longer than instructional prompts</button>
      <button class="option-btn" onclick="checkAnswer(2, 'B', true)">B) Instructional prompts use direct command verbs while zero-shot prompts are simple instructions without examples</button>
      <button class="option-btn" onclick="checkAnswer(2, 'C', false)">C) Zero-shot prompts always include examples</button>
      <button class="option-btn" onclick="checkAnswer(2, 'D', false)">D) Instructional prompts require images</button>
    </div>
    <div id="feedback2" class="feedback"></div>
  </div>

  <div class="question-block" id="question3">
    <h3>Question 3: Which of the following demonstrates a contextual prompt?</h3>
    <div class="options">
      <button class="option-btn" onclick="checkAnswer(3, 'A', false)">A) "Explain photosynthesis."</button>
      <button class="option-btn" onclick="checkAnswer(3, 'B', false)">B) "Write something about biology."</button>
      <button class="option-btn" onclick="checkAnswer(3, 'C', true)">C) "This text is for an undergrad course on behavioral economics. Rephrase it in simpler language."</button>
      <button class="option-btn" onclick="checkAnswer(3, 'D', false)">D) "You are a scientist. Describe your work."</button>
    </div>
    <div id="feedback3" class="feedback"></div>
  </div>

  <div id="score-container" style="display: none;">
    <h3>Quiz Complete! 🎉</h3>
    <p id="final-score"></p>
    <button onclick="resetQuiz()" class="reset-btn">Try Again</button>
  </div>
</div>

<style>
#quiz-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.question-block {
  margin-bottom: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.question-block h3 {
  color: #000000 !important;
  margin-bottom: 15px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-btn {
  padding: 15px;
  text-align: left;
  background-color: #e8f4f8;
  border: 2px solid #b8d4e0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  color: #000000;
  transition: all 0.3s ease;
}

.option-btn:hover {
  background-color: #d0e8f2;
  transform: translateX(5px);
}

.option-btn.correct {
  background-color: #d4edda;
  border-color: #28a745;
  color: #000000;
}

.option-btn.incorrect {
  background-color: #f8d7da;
  border-color: #dc3545;
  color: #000000;
}

.option-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.feedback {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
}

.feedback.correct {
  background-color: #d4edda;
  color: #155724;
}

.feedback.incorrect {
  background-color: #f8d7da;
  color: #721c24;
}

#score-container {
  text-align: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
}

#score-container h3 {
  color: #000000;
}

#score-container p {
  color: #000000;
}

.reset-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.reset-btn:hover {
  background-color: #0056b3;
}
</style>

<script>
let score = 0;
let questionsAnswered = 0;

function checkAnswer(questionNum, selectedOption, isCorrect) {
  const feedbackDiv = document.getElementById('feedback' + questionNum);
  const buttons = document.querySelectorAll('#question' + questionNum + ' .option-btn');
  
  // Disable all buttons for this question
  buttons.forEach(btn => btn.disabled = true);
  
  // Mark the selected button
  event.target.classList.add(isCorrect ? 'correct' : 'incorrect');
  
  // Show feedback
  if (isCorrect) {
    feedbackDiv.textContent = '✅ Correct! Great job!';
    feedbackDiv.className = 'feedback correct';
    score++;
  } else {
    feedbackDiv.textContent = '❌ Incorrect. Review the prompt types table above.';
    feedbackDiv.className = 'feedback incorrect';
  }
  
  questionsAnswered++;
  
  // Show final score after all questions answered
  if (questionsAnswered === 3) {
    setTimeout(() => {
      document.querySelectorAll('.question-block').forEach(block => block.style.display = 'none');
      document.getElementById('score-container').style.display = 'block';
      document.getElementById('final-score').textContent = `You scored ${score} out of 3!`;
    }, 1500);
  }
}

function resetQuiz() {
  score = 0;
  questionsAnswered = 0;
  
  // Reset all questions
  document.querySelectorAll('.question-block').forEach(block => {
    block.style.display = 'block';
  });
  
  // Reset all buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'incorrect');
  });
  
  // Clear feedback
  document.querySelectorAll('.feedback').forEach(feedback => {
    feedback.textContent = '';
    feedback.className = 'feedback';
  });
  
  // Hide score container
  document.getElementById('score-container').style.display = 'none';
}
</script>