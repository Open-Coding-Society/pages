---
layout: post
title: Setting up utterances
description: Learn how to set up utterances for your blog. Utterances is a tool that allows you to have comments on your blog posts.
categories: ['DevOps', 'GitHub Pages']
permalink: /github/pages/utterances
author: Trevor Huang
menu: nav/github_pages.html
toc: True
comments: True
---

## What is utterances?
> Utterances is a comments widget built on Github which allows you to comment on blog posts using GitHub Pages
- When you comment on a blog post, utterances will create a GitHub issue in the designated repository to store the comments
- You need to authenticate with your Github account as this prevents spam
- If you scroll down to the bottom of a page, you can see if utterances are there or not
- If you cloned one of open-coding-society repositories, utterances.html will be within your blog's _includes folder

## How to install
- Visit this page [Utterances](https://github.com/apps/utterances) and press the button that says "install"
- Select the option which applies utterances to all of your repositories
- You can check if it was installed correctly by going to your repository
    - Repository --> Settings --> Github apps (this is under integrations)
    - You should see utterances under installed Github apps


## How to use
- If Github pages was set up correctly, then posts/ipynb files using **hacks** and **tangibles** should have utterances enabled
- If the category is not a hack or tangible, OR utterances is not working for whatever reason, then use the script below to enable utterances on the post


```python
<!-- Use this script to add comments to your blog posts manually
<script src="https://utteranc.es/client.js"
        repo="{{ site.github_username }}/{{ site.github_repo | default: site.baseurl | remove: "/" }}"
        issue-term="title"
        label="blogpost-comment"
        theme="github-light"
        crossorigin="anonymous"
        async>
</script>
-->
```

## Troubleshooting/Common Mistakes
- Make sure that the category is a hack or a tangible. **Utterances will not automatically work on plans**
    - Use the script above if you want comments on posts such as plans
- Check if GitHub Pages is working
    - Go to your repository on Github. Settings -> Pages -> Change deploy from branch to Github Actions
        - If this wasn't done, the website wouldn't exist and utterances would only work on localhost
