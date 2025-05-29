---
toc: True
layout: post
title: Build a Markdown Page
description: JavaScript, HTML, CSS and Markdown are coding languages used by bloggers when developing in the GitHub Pages system. By using these languages, student developers can add functionality to their GitHub pages site.
menu: nav/github_pages.html
permalink: /github/pages/markdown
categories: ['GitHub Pages']
type: ccc
---

## HTML Fragments and Markdown

**Building a front-end web application requires HTML, CSS, and JavaScript**. HTML is responsible for the content, CSS adds styling to the web page, and JavaScript adds functionality and interactivity.  **Markdown is a shorthand way of writing HTML**, the GitHub pages system transforms the Markdown into HTML.

In GitHub Pages, **Jekyll serves as the build framework**. It takes your **choice of theme specified in the `_config.yml` file**, along with your Markdown, HTML, and notebook files, to construct a website.

A significant portion of the **frontend design work** has been done for you **through the selection and use of a theme**; this greatly **reduces the need to extensively write in CSS**.

Jekyll converts Markdown (.md) files into HTML. Behind the scenes of GitHub Pages, Jekyll and Liquid programming language build and programmatically construct each Markdown file into a specific web page. Markdown provides a straightforward way to start with GitHub Pages development. **In an IPYNB or a Markdown file, you can exclusively use Markdown syntax or incorporate HTML, CSS, and JavaScript** based on your expertise and experience.


## Code Fragments

> This section is intended to describe and show code fragments.  The purpose is to get the student developer ready for coding and commiting changes to their personal GitHub Pages and support meeting goals for their mini project.

### GitHub Pages index.md

In GitHub Pages, you can define code in Markdown. The pages **index.md uses markdown** to define a page about CompSci courses at Del Norte High School.

- Markdown fragment. The markdown fragment is written by the developer and is an example of how to start a home page using Markdown.

    ```markdown
    ## Build your Home Page here 
    # Investing in your Technical Future
    > Explore the Computer Science Pathway at Del Norte High School and invest in your technical skills. All Del Norte CompSci classes are designed to provide a real-world development experience. Class time includes tech talks (lectures), peer collaboration, communication with teachers, critical thinking while coding, and creativity in projects. Grading is focused on time invested, participation with peers, and engagement in learning.
    - Introduction to concepts and requirements by the teacher
    - Project-based learning with teacher support
    - Peer teams, team work, communication and collaboration
    - Student presentations, peer teaching, and peer grading
    - Coding, Development, DevOps, and critical thinking
    - Creativity, research, and utilizing ChatGPT
    - Classroom work 3-4 hours, with approximately 2-3 hours of homework per week

    ![csse]({{site.baseurl}}/images/ccr.png)
    ```

- HTML conversion.  The HTML <mark>conversion of the Markdown fragment produced by GitHub Pages using Jekyll</mark>. This is programmatically converted from Markdown to HTML.

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

### Images

In GitHub Pages, you can <mark>insert images</mark> in HTML or Markdown.  The Teacher finds \<img\> easier to work with for embedding links when trying to control size.  This example shows Markdown syntax for embedding images, but students can also use HTML syntax with the \<img\> tag.

- See index.md for !\[\]\(\) syntax for images, or reference [Markdown images](https://www.markdownguide.org/basic-syntax/#images-1)
- Or use "img" tage referencing [HTML images](https://www.w3schools.com/html/html_images.asp)

### Links

HTML contains a `<``href>```` tag to <mark>create links</mark>. Students can use either HTML or Markdown syntax for links.

- Look up [HTML links](https://www.w3schools.com/html/html_links.asp) \<href\> or [Markdown links](https://www.markdownguide.org/basic-syntax/#links) \[\]\(\) syntax.  These should become easy and familiar.



## Changing the Theme
> Google "github pages themes"  or this [theme link](https://pages.github.com/themes/).   The purpose of this section is to help you change your Theme options.
- ```_config.yml``` contains commented out alternatives to themes (see '# theme requirements' cell below).  Try these themes by commenting out midnight them with # at front and remove comment # from the front of theme of choice.  After changing theme you will need to do a `make clean`  followed by a `make` to test.
-  ```_includes/head.html``` this file contains code to ensure page loads the proper JavaScript.  This is a partial effort at support.  You will need to follow README.md instruction of theme provider to finish convertion. FYI, the head.html is included from ```_layouts/default.html```  Go to [Themes](https://pages.github.com/themes/)  click on Theme and scroll down to README.md and review requirements.  Look their _layouts.html to understand requirements for integration.
- Reading README.md should become common practice when using a repository.  You should make sure your README has instructions.  Also, in the Theme case, the best way to understand and make your own customizations is to understand how Theme providers customized theirs.  Review these diligently if you want to become proficient and customizing your page.


### GitHub Pages Theme

A web page theme typically includes the layout of elements such as menus, headers, and footers, as well as colors, highlights, and fonts. The theme ensures a consistent look and feel across the entire web application.

After selecting a theme, **minimize custom styles on individual pages** to maintain a consistent and professional appearance. Relying on the predefined styles of the theme ensures a cohesive look and feel, enhancing the user experience and reinforcing your brand identity.

Note: Extensive CSS customization can be time-consuming and challenging for beginners. It's better to **learn the GitHub Pages way** for themes. 

Students should select a theme and work with Markdown or HTML fragments in notebooks and posts. Accept and work with the style provided by the theme.


### Remote Theme

- The design of GitHub pages allows us to **change themes** with the _config.yml file key/value, change the value to a [supported theme](https://pages.github.com/themes/).  Here is a portion of the config.yml, the ```#``` is a comment symbol.  Add a comment to midnight line, uncomment dinky line to try a new theme. Repeat the process until you find something you like. 

This is currently selected theme in your provided code.  To change themes you will comment out or remove the remote_theme line, the lines after are for minima but would be ignored as you select other themes.

```yml
remote_theme: jekyll/minima
minima:
  skin: dark
  social_links:
    - { platform: github, user_url: "https://github.com/open-coding-society"}
    - { platform: x, user_url: "https://x.com/NighthawkCoding/" }
    - { platform: youtube, user_url: "https://www.youtube.com/@nighthawkcodingsociety2868" }      
```

To select a different them you will uncomment one of the selected lines.  There are more themes out there than shown and there are several additional customization required.  You will be required to run **make** between each theme selection.  Be sure to look at and test several pages before you settle in, the don't all work.

```yml
# theme requirements
remote_theme: pages-themes/midnight@v0.2.0
# remote_theme: pages-themes/dinky@v0.2.0
# remote_theme: pages-themes/minimal@v0.2.0
# remote_theme: pages-themes/hacker@v0.2.0
# remote_theme: pages-themes/cayman@v0.2.0
# remote_theme: pages-themes/time-machine@v0.2.0
plugins:
- jekyll-remote-theme
```


### Minima Custom Syles

The Teacher and many students from previous years have focused on the **minima** theme.  This has allowed the developers on this theme to add elements to the **_sass/minima/custom-styles.sccs**.

1. The dracula them is most commonly used, but leaf and hacker are pretty well developed.  The Teacher favorite is leaf but it has some top navigation problems.
2. The dracula/dark-mode can be included on multiple themes.  This is a great way to preserve your eyeballs.
3. The inclusion of nighthawk main is some nighthawk customizations.   Thie is the **mimima way** for adding to style use proper Syntactically Awsesome Style Sheets (SASS).

```scss
// Comment in or Uncomment out the following themes to use them 

// Dark themes
//@import "minima/leaf/_leaf";  //Leaf theme
//@import "minima/hacker/jekyll-theme-hacker"; //Hacker theme 
@import "minima/dracula/_dracula";

// Light themes
//@import "minima/hamilton/main"; //Hamilton theme
//@import "minima/monophase/main"; //Monophase theme 
//@import "minima/minimal-mistakes/__minimal-mistakes"; //Minimal Mistakes theme 
// Mix Light themes with this if your eyes are bleeding 
@import "minima/dracula/dark-mode";

// Styles for nighthawk theme, do not remove
@import "nighthawk/main";
```
