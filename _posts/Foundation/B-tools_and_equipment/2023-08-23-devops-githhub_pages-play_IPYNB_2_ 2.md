---
layout: post
title: Tools Play using JavaScript
description: JavaScript, HTML, CSS and Markdown are the primary coding languages used by bloggers when developing in the GitHub Pages system. Student developers can learn functionality while adding functionality to their GitHub pages website.
categories: ['JavaScript']
toc: True
comments: True
---

## GitHub Pages Coding Introduction 
Building the entire frontend GitHub Pages web application requires knowledge of HTML, CSS, and JavaScript. GitHub Pages has built-in support for an additional content language called Markdown, which is a shorthand complement to HTML. Markdown is focused on creating static content.

- **HTML** is responsible for the content
- **Markdown** is a shorthand way of writing content
- **CSS** adds styling to the web page content
- **JavaScript** adds functionality and interactivity

In GitHub Pages, Jekyll serves as the build framework. It takes our choice of theme specified in the `_config.yml` file, along with our Markdown, HTML, and notebook files, to construct a complete static website. A significant portion of the frontend design work has already been done for users through the selection and use of a theme; this greatly reduces the need to code in CSS.

Jekyll converts Markdown (.md) files into HTML. Behind the scenes of GitHub Pages, Jekyll and the Liquid programming language build and programmatically construct each Markdown file into a specific web page. Markdown provides a straightforward way to start with GitHub Pages development. **In a Markdown file, you can exclusively use Markdown syntax or incorporate HTML, CSS, and JavaScript** based on your expertise and experience.

### What is Static Content?
Static content refers to web pages that are delivered to the user's browser exactly as stored, without any server-side processing or dynamic content generation. This means the content remains the same for every user and does not change unless the source files are manually updated. Static websites are typically faster, more secure, and easier to deploy compared to dynamic websites, which require server-side processing to generate content on-the-fly.

### Adding Dynamics to GitHub Pages
Through the use of JavaScript and the fetch of data through APIs (backed by servers), developers are able to customize GitHub Pages to support data change. As we explore the portfolio_2025, we will see JavaScript games, login systems, and data that appear very dynamic.

### Nighthawk Pages
While this introduction covers the basics of creating static content with GitHub Pages, our classroom GitHub Pages will delve deeper into more advanced topics. We will explore how to integrate dynamic content, use advanced JavaScript techniques, and leverage APIs to create more interactive and engaging web pages.

---

## Markdown to HTML
This notebook will describe and show code fragments to help get the student developer ready for coding and committing changes to GitHub.

All the documents we have been discussing to this point in time were primarily written as ipynb documents that were converted to md. Each md file is converted to an html file.

Since HTML, CSS, and JavaScript are the only files understood by the common web browsers, you will see the _site directory being constructed and updated every time we run make. Those primary browser files and content (ie images) are the only file types that end up in the site directory.

### GitHub Pages index.md
In GitHub Pages you can define code in Markdown. The **index.md uses markdown** to define a page about CompSci courses at Del Norte High School.  This pages is entirely markdoown and contains static references to images, that are in the images directory.

### Markdown fragment. 
Here is a small markdown fragment that was a part of the index.md at one time.

    ```markdown
    ## Build your Home Page here 
    # Investing in your Technical Future
    > Explore the Computer Science Pathway at Del Norte High School and invest in your technical skills. All Del Norte CompSci classes are designed to provide a real-world development experience. Class time includes tech talks (lectures), peer collaboration, communication with teachers, critical thinking while coding, and creativity in projects. Grading is focused on time invested, participation with peers, and engagement in learning.
    - Introduction to concepts and requirements by the teacher
    - Project-based learning with teacher support
    - Peer communication and collaboration
    - Coding, developer operations, and critical thinking
    - Creativity, research, and utilizing ChatGPT
    - Class work with approximately 2-3 hours of homework per week

    ![csse]({{site.baseurl}}/images/ccr.png)
    ```
### HTML conversion.  
This HTML **conversion** of the Markdown fragment.  This is produced by GitHub Pages using Jekyll, by running the make command. This is the process of programmatically converting a Markdown to HTML. You can find all the converted md to html files in the _site directory, they get updated each time you type make.

    ```html
    <div class="language-markdown highlighter-rouge"><div class="highlight"><pre class="highlight"><code>  
    ## Build your Home Page here 
    # Investing in your Technical Future
    <span class="gt">  &gt; Explore the Computer Science Pathway at Del Norte High School and invest in your technical skills. All Del Norte CompSci classes are designed to provide a real-world development experience. Class time includes tech talks (lectures), peer collaboration, communication with teachers, critical thinking while coding, and creativity in projects. Grading is focused on time invested, participation with peers, and engagement in learning.</span>
    <span class="p">  -</span> Introduction to concepts and requirements by the teacher
    <span class="p">  -</span> Project-based learning with teacher support
    <span class="p">  -</span> Peer communication and collaboration
    <span class="p">  -</span> Coding, developer operations, and critical thinking
    <span class="p">  -</span> Creativity, research, and utilizing ChatGPT
    <span class="p">  -</span> Class work with approximately 2-3 hours of homework per week

    !<span class="p">[</span><span class="nv">csse</span><span class="p">](</span><span class="sx">/teacher/images/ccr.png</span><span class="p">)</span>
    </code></pre></div>    
    </div>
    ```

---

## Images

In GitHub Pages, you can **insert images** in HTML or Markdown.

There are many image examples using markdown in the index.md file, this are reading content from the images directory.

The Teacher finds the HTML \<img\> easier to work with for embedding links when it is necessary to control size.  This example shows Markdown syntax for embedding images, but students can also use HTML syntax with the <img> tag.

- See index.md for !\[\]\(\) syntax for images, or reference [Markdown images](https://www.markdownguide.org/basic-syntax/#images-1)

- Or use "img" tage referencing [HTML images](https://www.w3schools.com/html/html_images.asp)


### Becoming a Web Developer

Let's say we wanted to share the key languages we are studying in a `blog article about tools and equipment`. Notice that the only the first image is in this example and it is kind of big. So, I abandoned this idea. But there is code commented out in this cell that is starting to look better. Perhaps you want to give it a try.

1. **HTML** - HyperText Markup Language 5 officially introduced in 2014
2. **CSS** - Cascading Style Sheets is somewhere between CSS2.1 in 2011 and CSS3 today
3. **JavaScript** - Programming language for web development, ES11 introduced in 2020
4. **Markdown** - Started in 2004. There is a flavor called GitHub flavored Markdown (GFM)

![HTML, CSS, and JavaScript](https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg)

<!--
<img src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" alt="HTML, CSS, and JavaScript" width="300">
-->

### Living in the World

Let's say someone in CompSci wants to share places they have lived on their index.md page. Notice the size and orientation is a 1x4 grid through CSS.

#### Tag rules for GitHub Pages
As we code and use chat bots to assist, we need to know certain `Tag rules` for code in GitHub pages.  Remember these as otherwise you may run into `unpredictable issues`.

- **Not necessary tags.** GitHub Pages does not require a `<head>`, `<body>`, or `<html>` tags. All markdown files are generated and those tags are added on conversion from md to html.

- **Required tags.** Notice the usage of the `<style>` tag, later we will see usage and need of the `<script>` tag.

<style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
    }
    .grid-item {
        text-align: center;
    }
    .grid-item img {
        width: 100%;
        height: auto;
    }
</style>

<div class="grid-container">
    <div class="grid-item">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg" alt="California Flag">
        <p>California - forever</p>
    </div>
    <div class="grid-item">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Oregon.svg" alt="Oregon Flag">
        <p>Oregon - 9 years</p>
    </div>
    <div class="grid-item">
        <img src="https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg" alt="England Flag">
        <p>England - 2 years</p>
    </div>
    <div class="grid-item">
        <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Hawaii.svg" alt="Hawaii Flag">
        <p>Hawaii - 2 years</p>
    </div>
</div>

## Saying Hello

Somebody had an idea that we could make a phrase caption for how to say hello added to "Living in the World" idea for my index.md page.  

Think about adding option, how many lines of code would you need to add?  Once you think about that question you should think about, How can I do that in a coding way?  Here are some thoughts...

1. We have learned from Shell Script Linux Help, we can make our original ideas more efficient
2. As a coder, you must believe that there is a coding solution, like JavaScript, helps make HTML and CSS more efficient.

Development Log

- Started with outline of what needed to be accomlished (see included Javascript)
- After creating this outline, copilot to finish the code.  It took 2 tries for ChatGPT to get it right wikipedia naming write using variables.
- Then between chat and the Teacher serveral iterations were made to make it friendly to a new coder and more uniform in organization of data on screen.

```javascript
<style>
    // Style looks pretty compact, but it has a repeat 4, what if we wanted it dynamic
</style>

<!-- This is orignal grid_container class, but now we are adding an id for JavaScript -->
<div class "grid_container" id="grid_container">
    <!-- We are hoping to make the insides with a JavaScript object -->
</div>

<script>
    // 1. Make a connection to the HTML container
    var container = document.getElementById("grid_container");

    // 2. Define a Javascript object for our data
    var living_in_the_world = {
        {"flag": "Flag_of_California", "time_lived": "Forever", "greeting": "Hey"},
        {"flag": "Flag_of_Oregon", "time_lived": "9-years", "greeting": "Hello"},
        {"flag": "Flag_of_England", "time_lived": "2-years", "greeting": "Alright mate"},
        {"flag": "Flag_of_Oregon", "time_lived": "2-years", "greeting": "Aloha"},
    }; 
    
    // 3a. Consider how to update style count for size of container
    // 3b. Build a grid items inside of our container for each row of data
    for (var row of living_in_the_world) {
        // make a "div" with "class grid_item "div" for each row
        // add "img" tag and "p" tags for data
    }
</script>
```



```python
%%html

<style>
    /* Style looks pretty compact, trace grid-container and grid-item in the code */
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* Dynamic columns */
        gap: 10px;
    }
    .grid-item {
        text-align: center;
    }
    .grid-item img {
        width: 100%;
        height: 100px; /* Fixed height for uniformity */
        object-fit: contain; /* Ensure the image fits within the fixed height */
    }
    .grid-item p {
        margin: 5px 0; /* Add some margin for spacing */
    }
</style>

<!-- This grid_container class is for the CSS styling, the id is for JavaScript connection -->
<div class="grid-container" id="grid_container">
    <!-- content will be added here by JavaScript -->
</div>

<script>
    // 1. Make a connection to the HTML container defined in the HTML div
    var container = document.getElementById("grid_container"); // This container connects to the HTML div

    // 2. Define a JavaScript object for our http source and our data rows for the Living in the World grid
    var http_source = "https://upload.wikimedia.org/wikipedia/commons/";
    var living_in_the_world = [
        {"flag": "0/01/Flag_of_California.svg", "greeting": "Hey", "description": "California - forever"},
        {"flag": "b/b9/Flag_of_Oregon.svg", "greeting": "Hi", "description": "Oregon - 9 years"},
        {"flag": "b/be/Flag_of_England.svg", "greeting": "Alright mate", "description": "England - 2 years"},
        {"flag": "e/ef/Flag_of_Hawaii.svg", "greeting": "Aloha", "description": "Hawaii - 2 years"},
    ]; 
    
    // 3a. Consider how to update style count for size of container
    // The grid-template-columns has been defined as dynamic with auto-fill and minmax

    // 3b. Build grid items inside of our container for each row of data
    for (const location of living_in_the_world) {
        // Create a "div" with "class grid-item" for each row
        var gridItem = document.createElement("div");
        gridItem.className = "grid-item";  // This class name connects the gridItem to the CSS style elements
        // Add "img" HTML tag for the flag
        var img = document.createElement("img");
        img.src = http_source + location.flag; // concatenate the source and flag
        img.alt = location.flag + " Flag"; // add alt text for accessibility

        // Add "p" HTML tag for the description
        var description = document.createElement("p");
        description.textContent = location.description; // extract the description

        // Add "p" HTML tag for the greeting
        var greeting = document.createElement("p");
        greeting.textContent = location.greeting;  // extract the greeting

        // Append img and p HTML tags to the grid item DIV
        gridItem.appendChild(img);
        gridItem.appendChild(description);
        gridItem.appendChild(greeting);

        // Append the grid item DIV to the container DIV
        container.appendChild(gridItem);
    }
</script>
```



<style>
    /* Style looks pretty compact, trace grid-container and grid-item in the code */
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* Dynamic columns */
        gap: 10px;
    }
    .grid-item {
        text-align: center;
    }
    .grid-item img {
        width: 100%;
        height: 100px; /* Fixed height for uniformity */
        object-fit: contain; /* Ensure the image fits within the fixed height */
    }
    .grid-item p {
        margin: 5px 0; /* Add some margin for spacing */
    }
</style>

<!-- This grid_container class is for the CSS styling, the id is for JavaScript connection -->
<div class="grid-container" id="grid_container">
    <!-- content will be added here by JavaScript -->
</div>

<script>
    // 1. Make a connection to the HTML container defined in the HTML div
    var container = document.getElementById("grid_container"); // This container connects to the HTML div

    // 2. Define a JavaScript object for our http source and our data rows for the Living in the World grid
    var http_source = "https://upload.wikimedia.org/wikipedia/commons/";
    var living_in_the_world = [
        {"flag": "0/01/Flag_of_California.svg", "greeting": "Hey", "description": "California - forever"},
        {"flag": "b/b9/Flag_of_Oregon.svg", "greeting": "Hi", "description": "Oregon - 9 years"},
        {"flag": "b/be/Flag_of_England.svg", "greeting": "Alright mate", "description": "England - 2 years"},
        {"flag": "e/ef/Flag_of_Hawaii.svg", "greeting": "Aloha", "description": "Hawaii - 2 years"},
    ]; 

    // 3a. Consider how to update style count for size of container
    // The grid-template-columns has been defined as dynamic with auto-fill and minmax

    // 3b. Build grid items inside of our container for each row of data
    for (const location of living_in_the_world) {
        // Create a "div" with "class grid-item" for each row
        var gridItem = document.createElement("div");
        gridItem.className = "grid-item";  // This class name connects the gridItem to the CSS style elements
        // Add "img" HTML tag for the flag
        var img = document.createElement("img");
        img.src = http_source + location.flag; // concatenate the source and flag
        img.alt = location.flag + " Flag"; // add alt text for accessibility

        // Add "p" HTML tag for the description
        var description = document.createElement("p");
        description.textContent = location.description; // extract the description

        // Add "p" HTML tag for the greeting
        var greeting = document.createElement("p");
        greeting.textContent = location.greeting;  // extract the greeting

        // Append img and p HTML tags to the grid item DIV
        gridItem.appendChild(img);
        gridItem.appendChild(description);
        gridItem.appendChild(greeting);

        // Append the grid item DIV to the container DIV
        container.appendChild(gridItem);
    }
</script>



## Multiple Ways of Coding

The `script` tag in the running example above contains JavaScript. This JavaScript is written in a style that is similar to other languages like Java and Python, making it easier for developers familiar with those languages to understand. However, be aware that code can be written in many styles, some of which may not be as friendly to the syntax of other coding languages.

JavaScript is unique in its `style` and `html` usages that are shown in this example. The interaction of JavaScript with these tags and its operation within a web browser is its unique purpose. As JavaScript and other languages develop their niches, they start to vary in aspects like syntax.

A pure JavaScript programmer might write the `script` section differently. Therefore, when you watch a coding video or request code from a chatbot, the code might vary, but the different coding styles and syntax changes essentially achieve the same result.

1. **Connecting to the HTML Container**:
   - The `container` declaration connects to the HTML element with the ID `grid_container`.

2. **Defining Data**:
   - The `http_source` holds the base URL for the flag images.
   - The `living_in_the_world` array contains objects representing different locations, each with a flag URL, greeting, and description.

3. **Building Grid Items**:
   - The loop iterates over each location in the `living_in_the_world` array.
   - For each location, a new `div` element with the class `grid-item` is created.
   - An `img` element is created for the flag, with the `src` attribute set to data from the `living_in_the_world` array.
   - Two `p` elements are created for the description and greeting.
   - These elements are appended to the `gridItem` div, which is then appended to the `container` div.

The code and examples showcase the use of modern JavaScript features to create a dynamic grid of items based on an array of data.

### Modern JavaScript Features

This example demonstrates several modern JavaScript features that are prevalent in contemporary JavaScript codebases.

- **`const` for Variable Declarations**: The `const` keyword is used for variable declarations, indicating that the variable's value will not change throughout the script. This is useful for defining constants and ensuring immutability.
- **Arrow Functions**: Arrow functions are used in the `forEach` loop. They provide a concise syntax for writing functions and are popular in functional programming styles.
- **Template Literals**: Template literals are used for string concatenation. They allow for embedding expressions within strings using backticks (`` ` ``) and `${}` syntax. This can make the code more readable and easier to write by keeping the evaluation and the string in close proximity, reducing the cognitive load on the developer.

```javascript
<script>
    // 1. Make a connection to the HTML container defined in the HTML div
    const container = document.getElementById("grid_container"); // This container connects to the HTML div

    // 2. Define a JavaScript object for our http source and our data rows for the Living in the World grid
    const http_source = "https://upload.wikimedia.org/wikipedia/commons/";
    const living_in_the_world = [
        {flag: "0/01/Flag_of_California.svg", greeting: "Hey", description: "California - forever"},
        {flag: "b/b9/Flag_of_Oregon.svg", greeting: "Hi", description: "Oregon - 9 years"},
        {flag: "b/be/Flag_of_England.svg", greeting: "Alright mate", description: "England - 2 years"},
        {flag: "e/ef/Flag_of_Hawaii.svg", greeting: "Aloha", description: "Hawaii - 2 years"},
    ]; 
    
    // 3a. Consider how to update style count for size of container
    // The grid-template-columns has been defined as dynamic with auto-fill and minmax

    // 3b. Build grid items inside of our container for each row of data
    living_in_the_world.forEach(location => {
        // Create a "div" with "class grid-item" for each row
        const gridItem = document.createElement("div");
        gridItem.className = "grid-item";  // This class name connects the gridItem to the CSS style elements

        // Add "img" HTML tag for the flag
        const img = document.createElement("img");
        img.src = `${http_source}${location.flag}`; // concatenate the source and flag
        img.alt = `${location.flag} Flag`; // add alt text for accessibility

        // Add "p" HTML tag for the description
        const description = document.createElement("p");
        description.textContent = location.description; // extract the description

        // Add "p" HTML tag for the greeting
        const greeting = document.createElement("p");
        greeting.textContent = location.greeting;  // extract the greeting

        // Append img and p HTML tags to the grid item DIV
        gridItem.appendChild(img);
        gridItem.appendChild(description);
        gridItem.appendChild(greeting);

        // Append the grid item DIV to the container DIV
        container.appendChild(gridItem);
    });
</script>

```

### Classic for Loop Example

This example contains a classic for loop that is common to almost every programming language. It demonstrates a traditional approach to iterating over an array and building HTML elements dynamically.

- **Three-Part For Loop**: Uses the three-part for loop structure: initialization of the index (`i`), loop comparison, and index increment.
- **Variable Declaration with `let`**: Uses `let` to define `i`, a variable that changes as the code logic progresses.

```javascript
<script>
    // 1. Make a connection to the HTML container defined in the HTML div
    const container = document.getElementById("grid_container"); // This container connects to the HTML div

    // 2. Define a JavaScript object for our http source and our data rows for the Living in the World grid
    const http_source = "https://upload.wikimedia.org/wikipedia/commons/";
    const living_in_the_world = [
        {flag: "0/01/Flag_of_California.svg", greeting: "Hey", description: "California - forever"},
        {flag: "b/b9/Flag_of_Oregon.svg", greeting: "Hi", description: "Oregon - 9 years"},
        {flag: "b/be/Flag_of_England.svg", greeting: "Alright mate", description: "England - 2 years"},
        {flag: "e/ef/Flag_of_Hawaii.svg", greeting: "Aloha", description: "Hawaii - 2 years"},
    ]; 
    
    // 3a. Consider how to update style count for size of container
    // The grid-template-columns has been defined as dynamic with auto-fill and minmax

    // 3b. Build grid items inside of our container for each row of data
    for (let i = 0; i < living_in_the_world.length; i++) {
        const location = living_in_the_world[i];

        // Create a "div" with "class grid-item" for each row
        const gridItem = document.createElement("div");
        gridItem.className = "grid-item";  // This class name connects the gridItem to the CSS style elements

        // Add "img" HTML tag for the flag
        const img = document.createElement("img");
        img.src = `${http_source}${location.flag}`; // concatenate the source and flag
        img.alt = `${location.flag} Flag`; // add alt text for accessibility

        // Add "p" HTML tag for the description
        const description = document.createElement("p");
        description.textContent = location.description; // extract the description

        // Add "p" HTML tag for the greeting
        const greeting = document.createElement("p");
        greeting.textContent = location.greeting;  // extract the greeting

        // Append img and p HTML tags to the grid item DIV
        gridItem.appendChild(img);
        gridItem.appendChild(description);
        gridItem.appendChild(greeting);

        // Append the grid item DIV to the container DIV
        container.appendChild(gridItem);
    }
</script>
