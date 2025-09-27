--- 
layout: post
breadcrumb: True
toc: True
title: GitHub Pages Jekyll
description: Learn about the power of GitHub Pages and Jekyll
categories: ['GitHub Pages']
permalink: /github/pages/jekyll
comments: True
---

<div class="lesson-part" data-part="1">
    <h2>GitHub Pages and Jekyll</h2>
    <p>
        GitHub Pages leverages the power of Jekyll to transform your Markdown and HTML files into a static website. 
    </p>
    <ol>
        <li><strong>Front Matter</strong>: All Markdown (<code>.md</code>) and Jupyter Notebook (<code>.ipynb</code>) files with front matter are processed into a static data structure, making their keys and values accessible to the GitHub Pages system via Jekyll.</li>
        <li><strong>Jekyll Language</strong>: Jekyll can access all site-wide keys and values defined in <code>_config.yml</code>, as well as individual page front matter keys and values. This allows for dynamic organization and rendering of documents based on their metadata.</li>
    </ol>
    <hr>
    <h3>Jekyll and Liquid</h3>
    <p>
        The primary purpose of Jekyll within GitHub Pages is to help developers create dynamic web pages. By using site and page front matter, you can organize and render pages based on data. <strong>Liquid</strong> provides the templating syntax that allows you to dynamically generate content within your Jekyll templates. In essence, Jekyll is the system, and Liquid is the templating language.
    </p>
    <p>
        Jekyll and Liquid provide programming constructs that are essential in all programming environments. These constructs are particularly relevant to concepts required by AP (CSP, CSA) and college articulated courses (CSSE, Data Structures).
    </p>
    <p>
        Below are these key elements as defined in Liquid.
    </p>
    <ul>
        <li><strong>Variable Assignments</strong>: This assigns all the posts in the site to the variable <code>rawposts</code>.
            <pre><code>
{% raw %}
{% assign rawposts = site.posts %}
{% endraw %}
</code></pre>
        </li>
<li><strong>Conditionals</strong>: This checks if the number of posts is greater than zero.
<pre><code>
{% raw %}
{%- if posts.size > 0 -%}
  <!-- conditional code here -->
{%- endif -%}
{% endraw %}
</code></pre>
</li>
<li><strong>Loops</strong>: This iterates through each post in the site's posts.
<pre><code>
{% raw %}
{%- for post in site.posts -%}
  <!-- repeating code here -->
{%- endfor -%}
{% endraw %}
</code></pre>
</li>
<li><strong>Include</strong>: Include (HTML)
<pre><code>
{% raw %}
{%- include post_list_image_card.html -%}
{% endraw %}
</code></pre>
</li>
</ul>
    <div class="frq-box" data-frq-id="1" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
        <b>FRQ 1:</b> Explain the relationship between Jekyll and Liquid. What is the role of <strong>Front Matter</strong> in making data accessible to both?<br><br>
        <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
        <button class="grade-button" style="margin-top: 10px;">Grade</button>
        <div class="feedback-box"></div>
    </div>
</div>
<div class="lesson-part" data-part="2" style="display:none;">
    <hr>
    <h2>Language Comparisons</h2>
    <p>
        Since we are mentioning essential programming constructs, following are examples of similar constructs in languages you will be exposed to in the CompSci pathway at Del Norte High School.
    </p>
    <h3>JavaScript</h3>
    <pre><code>
// Variable Assignments
var rawposts = site.posts;

// Conditionals
if (posts.length > 0) {
// conditional code here
}

// Loops
for (let post of site.posts) {
// repeating code here
}

// Include (Function)
import { function } from './file.js';
</code></pre>
    <h3>AP CSP Pseudocode</h3>
    <pre><code>
// Variable Assignments
rawposts ← site.getPosts()

// Conditionals, they use language "Selection"
IF (LENGTH(posts) > 0) {
// conditional code here
}

// Loops, the use language "Interaction"
FOR EACH post IN site.getPosts() {
// repeating code here
}

// Include (Procedure)
INCLUDE function FROM file
</code></pre>
    <h3>Python</h3>
    <pre><code>
#Variable Assignments
rawposts = site.posts

#Conditionals
if len(posts) > 0:
pass  # conditional code here in place of pass

#Loops
for post in site.posts:
pass  # repeating code here in place of pass

#Include (Function)
from file.py import function
</code></pre>
    <h3>Java</h3>
    <pre><code>
import java.util.List;

// Variable Assignments
List &lt;Post&gt; rawposts = site.getPosts();

// Conditionals
if (posts.size() > 0) {
// conditional code here
}

// Loops
for (Post post : site.getPosts()) {
// repeating code here
}

// Include (Method)
import static com.example.file.function;
</code></pre>
    <div class="frq-box" data-frq-id="2" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
        <b>FRQ 2:</b> Compare the Liquid <strong>Loop</strong> construct to its equivalent in <strong>Python</strong>. How do both achieve the concept of iteration?<br><br>
        <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
        <button class="grade-button" style="margin-top: 10px;">Grade</button>
        <div class="feedback-box"></div>
    </div>
</div>
<div class="lesson-part" data-part="3" style="display:none;">
    <hr>
    <h2>Blogging Example Code</h2>
    <p>
        A core part of this project is the <code>blogs</code> layout (<code>_layouts/blogs.html</code>). This file is used to organize the blog list on the website. Read the comments in the code and consider making changes to the data or code to alter the appearance of the blogs. Try to modify the blog layout to better suit your needs or preferences.
    </p>
    <pre><code>
{% raw %}
&lt;!-- This inserts content from the page using this layout --&gt;
{{ content | markdownify }}

&lt;!-- Get all posts --&gt;
{% assign rawposts = site.posts %}

&lt;!-- Hide posts if front matter flag hide:true --&gt;
{% assign posts = '' | split:'' %}
{% for post in rawposts %}
  {% if post.hide != true %}
    {% assign posts = posts | push: post %}
  {% endif %}
{% endfor %}

&lt;!-- Sort posts by rank, then date, put posts with "sticky_posts: 1" front matter at the top --&gt;
{% assign grouped_posts = posts | group_by: "sticky_rank" | sort: "name", "last" %}
{% assign sticky_posts = '' | split:'' %}
{% assign non_sticky_posts = '' | split:'' %}
&lt;!-- Split posts into sticky and non-sticky --&gt;
{% for gp in grouped_posts %}
  {%- if gp.name == "" -%}
    {% assign non_sticky_posts = gp.items | sort: "date" | reverse %}
  {%- else %}
    {% assign sticky_posts = sticky_posts | concat: gp.items %}
  {%- endif %}
{% endfor %}

&lt;!-- Generate Card for each Post --&gt;
{% assign sticky_posts = sticky_posts | sort: "sticky_rank", "last" %}
{% assign posts = sticky_posts | concat: non_sticky_posts %}
{%- if posts.size > 0 -%}
  {%- if page.list_title -%}
    &lt;h2 class="post-list-heading"&gt;{{ page.list_title }}&lt;/h2&gt;
  {%- endif -%}
  &lt;ul class="post-list"&gt;
    {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
    {%- for post in posts -%}
    &lt;li&gt;
      &lt;!-- This file can be found in _includes --&gt;
      {%- include post_list_image_card.html -%}
    &lt;/li&gt;
    {%- endfor -%}
  &lt;/ul&gt;
{%- endif -%}

{% endraw %}
</code></pre>
    <div class="frq-box" data-frq-id="3" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
        <b>FRQ 3:</b> Analyze the liquid code block in the blogging example. Describe the two filtering and sorting actions it performs on the posts.<br><br>
        <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
        <button class="grade-button" style="margin-top: 10px;">Grade</button>
        <div class="feedback-box"></div>
    </div>
</div>
<div class="lesson-part" data-part="4" style="display:none;">
    <hr>
    <h3>HTML Included Code</h3>
    <p>
        The block of code below is located in the system at <code>_includes/post_list_image_card.html</code>. This file is included in the blogs and generates the HTML for the card. If you want to change the style or appearance of the card output for the blogs, you should modify the <code>_includes/post_list_image_card.html</code> file.
    </p>
    <pre><code>
{% raw %}
&lt;!-- Box shadow and rounded corners, using Primer CSS classes https://github.com/primer/css --&gt;
&lt;div class="Box box-shadow-medium rounded-1 col-12"&gt;
  &lt;!-- Check if the post has an image --&gt;&lt;!-- Container for the post content, taking up 8 columns --&gt;
  &lt;div class="col-8 d-table-cell p-3"&gt;
      &lt;!-- Post title wrapped in an h3 tag --&gt;
      &lt;h3&gt;
        &lt;!-- Link to the post's URL with the post title as the link text --&gt;
        &lt;a class="post-link" href=""&gt; 
        &lt;/a&gt;
      &lt;/h3&gt;
      &lt;!-- Post description paragraph --&gt;
      &lt;p class="post-meta-description"&gt;&lt;/p&gt;
      &lt;!-- Post date paragraph, formatted according to the date_format variable --&gt;
      &lt;p class="post-meta"&gt;&lt;/p&gt;
  &lt;/div&gt;
&lt;/div&gt;
{% endraw %}
</code></pre>
    <div class="frq-box" data-frq-id="4" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
        <b>FRQ 4:</b> Based on the HTML included code, how is the display of the post image handled? What would happen if a post was missing the <code>image</code> front matter key?<br><br>
        <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
        <button class="grade-button" style="margin-top: 10px;">Grade</button>
        <div class="feedback-box"></div>
    </div>
</div>
<div class="lesson-part" data-part="5" style="display:none;">
    <hr>
    <h3>Conclusion</h3>
    <p>
        Jekyll and Liquid are powerful tools that extend the functionality of GitHub Pages beyond simple static hosting. By leveraging front matter and Liquid's programming constructs, developers can create complex, data-driven static websites, which serves as a valuable learning experience in modern web development principles.
    </p>
    <div class="frq-box" data-frq-id="5" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
        <b>FRQ 5:</b> Briefly summarize how the combination of <strong>Jekyll, Liquid, and Front Matter</strong> enables a static website to feel dynamic.<br><br>
        <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
        <button class="grade-button" style="margin-top: 10px;">Grade</button>
        <div class="feedback-box"></div>
    </div>
</div>

<script>
    const FRQ_QUESTIONS = {
        "1": "Explain the relationship between Jekyll and Liquid. What is the role of Front Matter in making data accessible to both?",
        "2": "Compare the Liquid Loop construct to its equivalent in Python. How do both achieve the concept of iteration?",
        "3": "Analyze the liquid code block in the blogging example. Describe the two filtering and sorting actions it performs on the posts.",
        "4": "Based on the HTML included code, how is the display of the post image handled? What would happen if a post was missing the image front matter key?",
        "5": "Briefly summarize how the combination of Jekyll, Liquid, and Front Matter enables a static website to feel dynamic."
    };

    document.addEventListener("DOMContentLoaded", () => {
        // Attach grade button handlers
        const gradeButtons = document.querySelectorAll(".grade-button");
        gradeButtons.forEach(button => {
            button.addEventListener("click", async () => {
                const frqBox = button.closest(".frq-box");
                const frqId = frqBox.dataset.frqId;
                const questionText = FRQ_QUESTIONS[frqId];
                const studentResponseTextArea = frqBox.querySelector("textarea");
                const feedbackBox = frqBox.querySelector(".feedback-box");
                const studentResponse = studentResponseTextArea.value.trim();

                if (!studentResponse) {
                    showModal("Please enter your response before submitting.");
                    return;
                }

                button.disabled = true;
                feedbackBox.style.display = "block";
                feedbackBox.innerHTML = '<div class="flex items-center space-x-2"><div class="loading-spinner"></div><span>Grading...</span></div>';

                try {
                    const systemPrompt = `
You are an expert tutor grading a student's answer to a free-response question about GitHub Pages and Jekyll.
Your task is to:
1. Determine a grade for the student's response based on the following 1-5 scale:
   - 5: The answer addresses all parts of the question and is detailed and comprehensive.
   - 4: The answer is correct and addresses most parts of the question.
   - 3: The answer is correct but may be incomplete or lack detail.
   - 2: The answer has significant inaccuracies or is incomplete.
   - 1: The answer is incorrect or does not address the question.
   Write the grade like this: "Grade: (1-5)/5"
2. Provide detailed, constructive feedback explaining the grade.
3. Offer very short suggestions on what the user could improve on, enough to give them a hint but not enough for them to figure out what to answer.
The question is: "${questionText}"
The student's response is: "${studentResponse}"
Format your final output with a clear heading for the grade and the feedback. Do not use markdown heading tags (like # or ##) as it messes with the display.
                    `;

                    const apiKey = "AIzaSyB3Ky_RSgPsdXBt5I32ZVWRZ09Ont5_xmQ";
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                    const payload = {
                        contents: [{
                            parts: [
                                { text: systemPrompt }
                            ]
                        }]
                    };

                    const response = await fetchWithBackoff(apiUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    const feedbackText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate feedback. Please try again.";
                    const formattedFeedback = feedbackText
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br>");
                    feedbackBox.innerHTML = formattedFeedback;

                    const gradeMatch = feedbackText.match(/Grade:\s*(\d)\/5/);
                    if (gradeMatch && parseInt(gradeMatch[1], 10) >= 4) {
                        const currentPart = parseInt(frqBox.closest(".lesson-part").dataset.part, 10);
                        const nextPart = document.querySelector(`.lesson-part[data-part="${currentPart + 1}"]`);
                        if (nextPart) {
                            nextPart.style.display = "block";
                            nextPart.scrollIntoView({ behavior: "smooth" });
                        }
                    }
                } catch (error) {
                    console.error("Error generating feedback:", error);
                    feedbackBox.innerHTML = '<span style="color:red;">An error occurred while grading. Please try again.</span>';
                } finally {
                    button.disabled = false;
                }
            });
        });

        // Persist textarea content
        document.querySelectorAll(".frq-box textarea").forEach((textarea, index) => {
            const key = "github_pages_frq_answer_" + index;
            const saved = localStorage.getItem(key);
            if (saved) {
                textarea.value = saved;
            }
            textarea.addEventListener("input", () => {
                localStorage.setItem(key, textarea.value);
            });
        });
    });

    function showModal(message) {
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <p>${message}</p>
                <button class="modal-button" onclick="this.closest('.modal').remove()">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    async function fetchWithBackoff(url, options, retries = 3, delay = 1000) {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, options);
                // Return successful response
                return response;
            } catch (err) {
                if (attempt === retries) throw err;
                // exponential backoff
                await new Promise(res => setTimeout(res, delay * Math.pow(2, attempt)));
            }
        }
    }
</script>