---
layout: post
title: Wayfinding 3-31 Review
description: Our Project Alignment with CS 113 Credits
permalink: /wayfinding331
author: Risha, Vibha, Ruta
---

<div id="capstone-table"></div>

<style>
  #capstone-table table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    background: #0f172a; /* deep navy */
    border-radius: 8px;
    overflow: hidden;
  }

  #capstone-table th, #capstone-table td {
    padding: 12px 14px;
    border-bottom: 1px solid #1e293b;
    text-align: left;
  }

  #capstone-table th {
    background: #1e293b;
    color: #e2e8f0;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  #capstone-table td {
    color: #cbd5f5;
  }

  #capstone-table tr:hover {
    background: #1e293b;
    transition: background 0.2s ease;
    cursor: pointer;
  }

  /* status tags */
  .tag {
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .implemented {
    background: rgba(34,197,94,0.15);
    color: #4ade80;
  }

  .partial {
    background: rgba(251,191,36,0.15);
    color: #facc15;
  }

  .planned {
    background: rgba(148,163,184,0.15);
    color: #94a3b8;
  }

  /* FIXED DETAIL BOX */
  #capstone-detail {
    margin-top: 14px;
    padding: 14px;
    border-radius: 8px;
    background: #1e293b; /* match table hover */
    color: #e2e8f0;
    border: 1px solid #334155;
    transition: all 0.2s ease;
  }

  #capstone-detail b {
    color: #93c5fd;
    font-size: 15px;
  }
</style>

<script>
(function () {
  const data = [
    {
      obj: "Lists",
      status: "Implemented",
      cls: "implemented",
      desc: "Skill history + reflections stored as arrays",
      detail: "Used to track skill progression, reflections, and activity logs over time for dashboard visualization."
    },
    {
      obj: "Maps",
      status: "Implemented",
      cls: "implemented",
      desc: "Key-value skill + user data",
      detail: "JSON-based structures store skill categories and allow fast lookup of student profiles."
    },
    {
      obj: "Sets",
      status: "Partial",
      cls: "partial",
      desc: "Unique roles / tags",
      detail: "Prevents duplicate role assignments and repeated skill categories."
    },
    {
      obj: "2D Grid",
      status: "Implemented",
      cls: "implemented",
      desc: "Game movement system",
      detail: "Used in persona game to track player/NPC positions and interactions."
    },
    {
      obj: "Searching",
      status: "Implemented",
      cls: "implemented",
      desc: "API data retrieval",
      detail: "Retrieves student skill snapshots and persona-linked data from backend."
    },
    {
      obj: "Sorting",
      status: "Implemented",
      cls: "implemented",
      desc: "Timeline ordering",
      detail: "Sorts skill history chronologically for accurate progression display."
    },
    {
      obj: "Traversal",
      status: "Implemented",
      cls: "implemented",
      desc: "Iterating data + game objects",
      detail: "Loops through snapshots and game entities for rendering and logic."
    },
    {
      obj: "Randomization",
      status: "Implemented",
      cls: "implemented",
      desc: "Dynamic NPC prompts",
      detail: "Adds variation to persona game interactions."
    }
  ];

  const container = document.getElementById("capstone-table");

  let html = `
    <table>
      <tr>
        <th>Objective</th>
        <th>Status</th>
        <th>Summary</th>
      </tr>
  `;

  data.forEach((d, i) => {
    html += `
      <tr data-i="${i}">
        <td>${d.obj}</td>
        <td><span class="tag ${d.cls}">${d.status}</span></td>
        <td>${d.desc}</td>
      </tr>
    `;
  });

  html += `</table><div id="capstone-detail">Hover a row to see details.</div>`;
  container.innerHTML = html;

  const detailBox = document.getElementById("capstone-detail");

  container.querySelectorAll("tr[data-i]").forEach(row => {
    row.addEventListener("mouseenter", () => {
      const d = data[row.dataset.i];
      detailBox.innerHTML = `<b>${d.obj}</b><br>${d.detail}`;
    });
  });
})();
</script>
