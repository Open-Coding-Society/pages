---
layout: post
microblog: True
categories: [Python Flask]
title: Microblog Article
description: A new way to have others engage with your articles through microblogging.
author: John Mortensen
permalink: /microblog
---

## Microblogging

The premise is to have an engaging way to chat on articles.

## See Microblog Live

Look at [/plagiarism/2]({{site.baseurl}}/plagiarism/2), [/plagiarism/3]({{site.baseurl}}/plagiarism/3), [/plagiarism/4]({{site.baseurl}}/plagiarism/4)


### Frontmatter

Observe the frontmatter on these pages; it now includes `microblog: True` to enable microblogging.

## Microblogging: Engage Your Readers

Microblogging adds a real-time, interactive chat panel to your articles, allowing readers to comment, ask questions, and discuss content directly alongside your lesson or post. This feature is designed to boost engagement and foster community around your content.

### How It Works

- A floating "Microblog" button appears on pages with microblogging enabled.
- Clicking the button opens a side panel where users can read and post short messages.
- The panel is mobile-friendly and overlays the main content without disrupting the reading experience.
- All microblog logic and dependencies are managed centrally, so you only need to enable it in your page’s frontmatter.

### Enabling Microblogging


To add microblogging to any article or lesson, simply include the following in your page’s frontmatter.  **The permalink is your topic.**

```yaml
---
layout: post
microblog: True
title: Your Article Title
description: Brief description of your article.
author: Your Name
permalink: /your-path
---
```

- Set `microblog: True` to activate the feature.

### To Test Microblogging

In your project directory with your virtual environment (venv) activated:

```sh
git pull
./scripts/db_init.py # if you have database trouble
python main.py
```

### Key Files

- `_includes/microblog_foundation.html` — Code that injects the microblog overlay one the screen.
- `assets/js/api/microblog.js` — Handles the microblog panel’s interactivity and API calls.

### API Reference

For developers: see the [Microblog API reference]({{site.baseurl}}/microblog/reference) for details on backend integration and customization.
