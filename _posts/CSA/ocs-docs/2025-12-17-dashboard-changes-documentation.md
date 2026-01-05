---
layout: post
title: Dashboard breakdown documentation
permalink: /docs/dashboardchanges
---

# The dashboard.html file - issues:
- There are currently 1980 lines of code inside the dashboard .html file
- The size of the file makes the dashboard file is difficult to work with, since the dashboard has six different tabs 
- To optimize workflows and efficiency of the dashboard section on pages, the file will be split, moving code to different files

# the process:
- dashboard.html will stay to hold the structure, and the following files are added:
    - githubanalytics.html
    - gradepredictor.html
    - gradeanalytics.html
    - feedback.html
    - dashboardhelp.html
    - preferences.html


# the changes:
- lines 73-132: githubanalytics.html
- lines 134-238: gradepredictor.html
- lines 479-484: feedback.html
- lines 488-604: dashboardhelp.html
- lines 606-1216: preferences.html
- lines 1218-1223: gradeanalytics.html