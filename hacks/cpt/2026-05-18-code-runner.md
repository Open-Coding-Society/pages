---
layout: post
courses: { csse: {week: 4}, csp: {week: 13}, csa: {week: 17 } }
codemirror: true
breadcrumb: True
title: CPT Guide - Code Runner
description: Build a lesson using multiple code runners on a page.  This modular approach allows you to create interactive lessons, more code -- less words.
permalink: /cpt/code
---

## CPT Guide Code Runner
The Create Performance Task (CPT) requires a program that demonstrates core computational thinking concepts.

Your program must include:

- Input: user interaction
- Output: program-generated result
- List: collection of data items
- Procedure: reusable function with parameter
- Algorithm: sequencing, selection, iteration

## CPT Guide Home

<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
  <a href="https://davidmadnhs.github.io/CPTGuidePages/cpt" style="text-decoration: none;">
    <div style="background-color: rgb(32, 122, 201); color: white; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
      Code Runner Guide
    </div>
  </a>
</div>

## CPT Components Draft
{% capture challenge_components %}
{% endcapture %}

{% capture code_components %}
{% endcapture %}

{% include code-runner.html
   runner_id="runner_components"
   language="python"
   challenge=challenge_components
   code=code_components
%}

## Input
{% capture challenge_input %}
{% endcapture %}

{% capture code_input %}
{% endcapture %}

{% include code-runner.html
   runner_id="runner_input"
   language="python"
   challenge=challenge_input
   code=code_input
   height="350px"
%}

## Output
{% capture challenge_output %}
{% endcapture %}

{% capture code_output %}
{% endcapture %}

{% include code-runner.html
   runner_id="runner_output"
   language="python"
   challenge=challenge_output
   code=code_output
   height="350px"
%}

## List
{% capture challenge_list %}
{% endcapture %}

{% capture code_list %}
{% endcapture %}

{% include code-runner.html
   runner_id="runner_list"
   language="python"
   challenge=challenge_list
   code=code_list
   height="350px"
%}

## Procedure
{% capture challenge_procedure %}
{% endcapture %}

{% capture code_procedure %}
{% endcapture %}

{% include code-runner.html
   runner_id="runner_procedure"
   language="python"
   challenge=challenge_procedure
   code=code_procedure
   height="350px"
%}

## Algorithm
{% capture challenge_algorithm %}
{% endcapture %}

{% capture code_algorithm %}
{% endcapture %}

{% include code-runner.html
   runner_id="runner_algorithm"
   language="python"
   challenge=challenge_algorithm
   code=code_algorithm
   height="350px"
%}

## CPT Backend Draft
{% capture challenge_backend %}
{% endcapture %}

{% capture code_backend %}
{% endcapture %}

{% include code-runner.html
   runner_id="runner_backend"
   language="python"
   challenge=challenge_backend
   code=code_backend
%}
