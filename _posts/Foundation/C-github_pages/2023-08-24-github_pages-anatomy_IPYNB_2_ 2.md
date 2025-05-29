---
layout: post
title: Anatomy of GitHub Pages
description: Learn the Files and development work flow of GitHub Pages.  This includes working with you home page, theme, markdown, and more.
categories: ['GitHub Pages']
permalink: /github/pages/anatomy
menu: nav/github_pages.html
toc: True
comments: True
---

## Anatomy of GitHub Pages files
> Discuss how to develop a home page, code, run local server test, and then sync to deploy to GitHub Pages.
- Review tools setup and make in README.md to support this lesson.  

## Files and Directories in this Project
> Here are some defintion to key files and directories in this project

- `README.md`: This file contains instructions and background information about the project. It is a standard file present in all properly set up GitHub projects.

- `index.md`: This is the source file for the home page of the project. It is a standard file for all GitHub Pages projects. Note that Markdown (.md) files are converted to HTML by the Jekyll build process. HTML files are the only file type that is rendered on a website.

- `_notebooks`: This directory contains Jupyter Notebook (.ipynb) files. These files are converted to Markdown (.md) files by the Makefile rules in the build process. The Markdown files are then converted to HTML by the Jekyll build process.

- `_posts`: This directory contains Markdown (.md) files that will be part of the website. These files are formatted similarly to index.md and include frontmatter (metadata coded in YAML) and Markdown, HTML, JavaScript, and CSS source code. You will also find Liquid code in these files, which is used to generate Markdown, HTML, JavaScript, and CSS.

- `_data`: This directory is the standard location for storing data files that support the _posts or _notebooks directories.

- `images`: This directory is the standard location for storing image files (JPEG, PNG, etc.) that support the _posts or _notebooks directories.

- `_config.yml`: This file contains YAML definitions (key-value properties) used to build the Jekyll website.

- `.gitignore`: This file specifies elements to be excluded from version control. Files are excluded when they are derived from the original source and not considered part of the project's source code. In the VSCode Explorer, you may notice some files appearing dimmed, indicating that they are purposely excluded by the rules in .gitignore.

- `layouts`: This directory contains HTML files used by Jekyll to generate the structure of the website, including blogs, schedules, and home pages. Each post or notebook specifies a layout in its frontmatter, which determines how the content is presented.

- `scripts`: This directory contains scripts such as `convert_notebooks.py`, which converts Jupyter Notebook (.ipynb) files into Markdown (.md) files. These scripts automate parts of the build process, ensuring that content is properly formatted for the website.

Please note that there are many other key files and directories in a GitHub Pages project, but we will highlight those as the development progresses.


### Configuration Notes, behind the scenses
The `_config.yml` file is the configuration file for Jekyll. It is a YAML file that defines the configuration of the site. The configuration file can be used to set site-wide variables, and can be used to set variables for specific environments (development, production, etc).

Often in code we use the `site.baseurl` to indentfy the path to files.  GitHub actions uses this location in its build to identify the name of the project.  Be sure the values of these keys match your GitHub Repo.

```yml
github_repo: "pages" 
baseurl: "/pages"
```

Many remote theme files are commented out, you can only have one at a time.  The Teacher is in favor of using the `minima` theme. To change these themes it could require many other changes to make it effective.  Themes and related CSS changes are below, but they are not complete.  IMO, you would need to disable minima or reorganize a lot of files.

```yml
# theme requirements
remote_theme: pages-themes/midnight@v0.2.0
# remote_theme: pages-themes/dinky@v0.2.0
# remote_theme: pages-themes/minimal@v0.2.0
# remote_theme: pages-themes/hacker@v0.2.0
# remote_theme: pages-themes/cayman@v0.2.0
# remote_theme: pages-themes/time-machine@v0.2.0
```

Under _includes/theme you will see directories that correspond to your selection.  In each of these directories there is a base.html.   This is the foundation for the page:  head, body, footer.  When you select a layout in the frontmatter of your pages, it ultimately includes the base.html from one of these directories.   To understand how a web page is formed, these are excellent studies.

## Customizations.
> Each student should perform customization to their project.  This is an opportunity to learn a few concepts from 'teacher' repository and then customize your own page to your personal interests.  

### Customize a Page
The home page to  other pages is a common first step in building a project.  To start you will need to form your `index.md` in your project, which behind the scenes is generated into an `index.html` by the GitHub Pages build process. 

### Change Title
 Every page should have a `title`.  Here is frontmatter sample.  This uses the _layouts/page.html that reads the frontmatter title and places it at the top page.  

```yml
---
layout: page
title: My Title
---
```

If you look at the page layout you will see it includes base, or base.html according to the selected theme.  This nesting is foundation of how GitHub Pages and Jekyll work.

Look at some of the layouts that form schedule, search, blogs, and each post.  Between this structure and Jekyll you can automate almost any reconfiguration of the notebooks and posts.

### Making a Submenu
> There are many submenus made in `_includes/nav`.
- ```index.md``` is the file that contains markdown for a submenu
- ```_includes/nav/home.html``` contains code for submenu, it is included in every page in this dialog
- ```{{site.baseurl}}``` refers to baseurl defined in _config.yml, this is the localtion of all files in WebSite.   Note, this changes as you run on localhost and deployed; make sure you remember to use this for locations of files in site.

```html
<table>
    <tr>
        <td><img src="{{site.baseurl}}//images/logo.png" height="60" title="Frontend" alt=""></td>
        <td><a href="{{site.baseurl}}/index">Course</a></td>
        <td><a href="{{site.baseurl}}/home/table">Table</a></td>
        <td><a href="{{site.baseurl}}/home/about">About</a></td>
    </tr>
</table>
```

Look how the same submenu is included on all of the pages it calls, you will notices this in the frontmatter menu key.

### Style revolves around _sass
> In the `_sass` folder there are many theme files.   Remeber that are themes are `remote` as designated in the `_config.yml` line.  However, some files are placed in the _sass directory to make customizations.  It is best to only have files in your project that you need to customize.

The  `_sass/minima` folder is a theme with many subthemes that can be changed in the `_sass/minima/custom-styles.scss` file.  In the below example `_dracula`.  You could switch to leaf, hacker, hamilton, etc.  Then you will want to decide if you want `dark-mode`.  Always include the `nighthawk/main` as it has customization to style for Nighthawk Pagees.


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

