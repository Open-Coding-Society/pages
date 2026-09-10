---
layout: post
title: Literature Review & Research Depth
description: >
  Analyze at least three existing commercial, open-source, or academic
  attempts to solve your problem and synthesize the findings by theme.
courses: {'csh': {'week': 2}}
type: capstone
canonical_id: csh-literature-review
author: PLTW Capstone
---

## Week 2: Literature Review, Design Specs & Peer Review

Weeks 2 and 3 are combined this sprint: you'll draft your literature review
and your PRD/ethics work (see the [next assignment]({{ '/2026/07/27/csh-prd-ethics.html' | relative_url }}))
in the same week, then close out with a peer review — see the bottom of the
PRD post for the peer review checklist.

Draft your literature review, organized by theme (sample structure below):

- **Introduction to the Literature Review and Organization of Themes**
- **Literature Review Synthesis**
- **Theme 1, 2, 3, ...** — Group related sources under themes relevant to your problem space (e.g. cognitive load, tool-supported scaffolding, feedback loops, reflection/monitoring).
- **Conclusion / Summarize**
- **Conclusion / Reflect**

### Requirements

- Each person analyzes a **minimum of two** attempts in each category below:
  - **Academic research** via [Google Scholar](https://scholar.google.com)
  - **Invention / prior art** via [Google Patents](https://patents.google.com)
  - **Existing products** via general web search (commercial or open-source)
- Follow a similar format for each source.
- Critique each attempt's technical limitations.
- Cite all sources properly (APA format).

> ### Acadmic Research Summary Sheet (Example)
> **Search Type:** Academic (Google Scholar)  
> **Source (APA format):**  
> Bati-On, J. C., Kuizon, K. P., Catulpos, K. A. Y., Bonghanoy, J. B., & Agoylo, J. C., Jr. (2025). Automated attendance management with RFID and geospatial visualization. *Journal of Engineering Research and Reviews, 2*(2), 127–141. https://doi.org/10.5455/JERR.20250321070454  
>
> **Link:**  
> [Automated Attendance Management With RFID And Geospatial Visualization (PDF)](https://www.researchgate.net/profile/Jose-Agoylo-Jr-2/publication/391434645_Automated_Attendance_Management_With_RFID_And_Geospatial_Visualization/links/68254ea56b5a287c3041af90/Automated-Attendance-Management-With-RFID-And-Geospatial-Visualization.pdf)  
>
> **Artifact Summary:**  
> This study presents an automated attendance management system that combines RFID technology with geospatial visualization using Leaflet.js. Students use RFID cards to record attendance, while geolocation data is used to display their locations on an interactive map.  
>
> **Artifact Critique:**  
> This article validates monitoring student presence beyond initial attendance. A key limitation is smartphone/geolocation dependence. A passive UHF RFID entry/exit design can reduce privacy concerns and remove GPS dependency.

### Existing Patents (Prior Art)

- Search [Google Patents](https://patents.google.com) for existing patented approaches to your problem, separate from your three analyzed solutions above.
- This is a **prior-art search** — are you building on an idea someone already patented, and if so, how does your approach differ? (This is distinct from the IP/license clearance search in Week 2's PRD assignment, which checks whether *you're* violating anyone's IP.)

### Similar Solution Matrix

- Build a comparison matrix: your 3+ analyzed solutions (plus any relevant patents) as rows, and shared criteria (cost, target user, key features, limitations) as columns.
- This matrix is what makes your literature review comparative instead of just a list — it's what you'll point to when justifying why your solution is different or needed.
- Cite sources properly and link back to your research questions from Week 1.
