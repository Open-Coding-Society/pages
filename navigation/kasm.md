---
layout: post
title: Kasm Workspaces
description: A central blogging hub for user and development documentation for the Kasm Cloud Workspaces Project
categories: [Kasm]
permalink: /kasm/pages/intro
author: Mr. Mortensen, Rachit Jaiswal, Tanisha Patil, Torin Wolff, Isabel Marilla
menu: nav/kasm_cloud.html
toc: false
---

> Our Cloud Workspaces project aims to provide all students with equitable access to powerful computing resources, regardless of the device they own or use, by utilizing cloud-based desktop environments.

<style>
    .system-diagram {
        display: block;
        max-width: 100%;
        margin: 20px auto;
        border-radius: 8px;
        transition: transform 0.3s ease;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .system-diagram:hover {
        transform: scale(1.05);
    }

    .diagram-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0.3s, opacity 0.3s ease;
    }

    .diagram-overlay img {
        max-width: 90%;
        max-height: 90%;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    .diagram-overlay.visible {
        visibility: visible;
        opacity: 1;
    }
</style>

---

## KasmV2 Overview

To get insights into how the Nighthawk Coding Society (NCS) made KasmV2 continue reading this overview.

<img src="{{site.baseurl}}/kasm_design/kasm_diagram.png" alt="System Diagram" class="system-diagram" onclick="toggleDiagram()">

<div class="diagram-overlay" id="diagram-overlay" onclick="toggleDiagram()">
    <img src="{{site.baseurl}}/kasm_design/kasm_diagram.png" alt="Enlarged System Diagram">
</div>

<script>
    function toggleDiagram() {
        const overlay = document.getElementById('diagram-overlay');
        overlay.classList.toggle('visible');
    }
</script>

### 1. Frontend: Student Registration & Backend: Business Logic

#### Systems

- Frontend [ncs.github.io](https://pages.opencodingsociety.com/duallogin)
- Backend [flask2025.ncs.com](https://flask.opencodingsociety.com/login?next=/users/table2)

#### Overview

- **Frontend/Web Form**: A GitHub Pages web application is used to gather required user information and send user data to the Python/Flask backend.
- **Backend/Database**: The data sent from the web application is stored in AWS RDS (Amazon Web Services Relational Database Service) using SQL connection services.
- **Business Logic**: The Python/Flask backend, upon successful save, sends user information via an API to enable access to KASM Workspaces.

#### Users in KASM Workspaces

<img src="{{site.baseurl}}/kasm_design/kasm_users.png" alt="Kasm User Illustration">

### 2. KASM MultiServer

KASM presents workspaces to the user. Upon request by the user to launch a workspace session, KASM supplies an AWS computing resource and streams a session of that workspace to the user's browser. In the Del Norte Computer Science classrooms, the customized workspace contains Visual Studio Code and support for coding languages such as Python, Java, and JavaScript.

#### Infrastructure Management

To provide the KASM MultiServer features, KASM requires servers and agents. The Web Server, Database Server, and Connection Server manage KASM resources. These servers are the heart of KASM and need to be set up to enable MultiServer capabilities.

To configure these servers, Nighthawk developers have created tools and utilities to spin up these KASM servers.

- **Shell Programming**: Scripts that simplify and drive the setup process.
- **Terraform**: A tool that specializes in creating and sizing AWS servers.
- **Ansible**: A tool that specializes in the configuration management of servers. This is used to make the AWS servers into KASM workers.

<img src="{{site.baseurl}}/kasm_design/kasm_install.png" alt="Kasm install">

### 3. KASM UI

#### KASM User UI

<img src="{{site.baseurl}}/kasm_design/kasm_desktop.png" alt="Kasm workspace in Browser">

#### KASM Admin UI

Workspaces and the extensive Workspace Registry are key components of the KASM system. Activating a workspace is where the user's work begins.

Workspaces are developed according to the classroom's needs and then presented to users within the system. The UI allows for limiting usage according to groups.

Essentially, this is like installing all the necessary tools on a single user's laptop and then propagating that configuration and settings to every other user in the room.

#### Workspaces Links

- KASM Admin UI [kasm.ncs.com](https://kasm.nighthawkcodingsociety.com/):
- Del Norte Registry [ncs.com/registry](https://open-coding-society.github.io/kasm_registry/1.0/)
- DockerHub [docker/ncs/pusd](https://hub.docker.com/repository/docker/open-coding-society/pusd-student-ubuntu/general)
- GitHub CompSci Template [github/kasm-ubuntu](https://github.com/open-coding-society/Kasm-Ubuntu22.04-Image-Template)

#### Workspace Registry

KASM provides ready made workspaces that can be used directly or as a template for your spcific customizations.  In Del Norte CompSci, we have customized on top of a KASM provided template.  The customizations were to meet tools and configurations that were not provided directly by KASM.

This illustration shows some of the A's through D's available in the KASM registry.  Also, contained in the registry is one of Del Norte CompSci's customizations.

<img src="{{site.baseurl}}/kasm_design/kasm_registry.png" alt="Kasm registry">

### Costs

A projected cost comparison of the AWS/KASM solution versus traditional classroom fixed workstation costs. This comparison ignores some risks/changes:

1. Consulting services for KASM sizing and planning.
2. IT job skills changing from multiple site "Desktop Technicians" to a centralized cloud "DevOps Engineer".
3. Size of monitor, assuming a Chromebook is sufficient.
4. This study is based on a 1/5 usage ratio, or approximately 40 out of 200 CompSci students using AWS KASM Workspaces. Del Norte HS CompSci students are encouraged to set up and use their own computers. However, the predominantly 9th/10th grade classroom has 20 to 30 students using AWS KASM Workspaces.

| **Description**                                                                                                      | **Cost/Details**                                                                                          |
|----------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| **Projected monthly cost to support 2 classrooms of users**                                               | $600                                                                                                       |
| **Yearly license purchase (KASM)**                                                                                   | $2,100                                                                                                     |
| **Normal school year duration**                                                                                      | 10 months                                                                                                  |
| **Total yearly scaling cost for supporting two classrooms and eight CS classes**                                     | $8,100                                                                                                     |
| **Cost comparison (iMac)**                                                                                           | One iMac: $1,500                                                                                           |
| **Total cost of the program (compared to iMacs)**                                                                    | Equivalent to 5 iMacs for the entire year, supporting hundreds of students rather than 20 per iMac         |
| **Cost comparison (PC)**                                                                                             | One PC: $1,700                                                                                             |
| **Benefit of cloud-based system**                                                                                    | No local IT time or costs spent on setting up, delivering, connecting PCs, or managing hardware/software breakdowns |
| **Advantage of KASM over PCs**                                                                                       | Spin up new machines in seconds with costs similar to image management costs                               |
| **Hardware management**                                                                                              | AWS dynamically switches hardware without extra cost; always access to the latest hardware                 |
| **PC lifecycle (4-5 years)**                                                                                         | KASM: $40,500 over 5 years, 2 classrooms                                                                   |
| **Cost comparison over 5 years**                                                                                     | PCs: $80,000 for one cycle of 40 PCs, 1 classroom (approximate, depending on make and configuration)       |
| **Overall district savings**                                                                                         | KASM cuts costs to 25% for the district every 5 years while providing the latest hardware and software      |
| **Additional benefit**                                                                                               | Accessible from home, allowing students to use resources after school without additional connectivity software (e.g., SplashTop) |

#### AWS Costs (AWS Cloud Compute)

AWS costs using Single User system to current Multi User system.  Summer costs were a result of ongoing Development.

<img src="{{site.baseurl}}/kasm_design/aws_costs.png" alt="AWS costs">

#### Usage Patterns (3 Weeks of Data)

It is easy for a teacher or program administrator to see if students are making use of available resources. By putting activities into the cloud, data insights are now at our fingertips.

1. Elementary and middle school labs are now online and utilized when needed, eliminating idle labs.
2. Concurrent usage may require scheduling lab days, optimizing the use of cloud-based concurrent licenses.
3. Homework capability is always available, providing the same experience at home as at school without the need for specialized desktop/laptop software.

<img src="{{site.baseurl}}/kasm_design/kasm_usage.png" alt="Kasm usage">
