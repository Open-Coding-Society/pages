---
layout: opencs
title: 3.1 Variable Introduction
description: Introduction to Variables
permalink: /csp/big-idea-3
toc: False
comments: False
---

<link rel="stylesheet" href="{{site.baseurl}}/assets/css/csp_home.css">

<div class="graph-container">
    <svg id="arrows-svg">
        <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="rgba(255, 255, 255, 0.3)" />
        </marker>
        </defs>
    </svg>
    <div class="tooltip" id="tooltip"></div>
</div>

<script>
    const lessons = {
        '3.1': {
            title: 'Variables & Assignments',
            subpages: [
                { name: 'Lesson', link: '/csp/variables/zombies' },
                { name: 'JS Homework', link: '/js/variables/zombies/hw' },
                { name: 'Python Homework', link: '/python/variables/zombies/hw' }
            ],
            connectsTo: ['3.2'],
            style: { top: 120, left: 100, width: 180, height: 180 }
        },
        '3.2': {
            title: 'Data Abstraction',
            subpages: [
                { name: 'Lesson', link: '/csp/big-idea-3/p3' },
                { name: 'JS Homework', link: '/csp/collaborators/javascript/big-idea-3/dataabstraction/p3/homework' }
            ],
            connectsTo: ['3.3'],
            style: { top: 350, left: 400, width: 200, height: 200 }
        },
        '3.3': {
            title: 'Mathematical Expressions',
            subpages: [
                { name: 'Lesson', link: '/csp/big-idea-3/p3' },
                { name: 'Python Homework', link: '/csp/python/mathexpressions/collaborators/homework' }
            ],
            connectsTo: ['3.3'],
            style: { top: 350, left: 400, width: 200, height: 200 }
        }
    };

    const container = document.querySelector('.graph-container');
    
    Object.entries(lessons).forEach(([number, lesson]) => {
        const node = document.createElement('div');
        node.className = 'node';
        node.style.width = `${lesson.style.width}px`;
        node.style.height = `${lesson.style.height}px`;
        node.style.top = `${lesson.style.top}px`;
        node.style.left = `${lesson.style.left}px`;

        node.innerHTML = `
            <div class="node-number">${number}</div>
            <div class="node-title">${lesson.title}</div>
        `;

        container.appendChild(node);
        lesson.element = node; // store reference for arrows & events
    });


    const tooltip = document.getElementById('tooltip');
    const svg = document.getElementById('arrows-svg');

    // Function to get center point of a node
    function getNodeCenter(node) {
        const rect = node.getBoundingClientRect();
        const containerRect = document.querySelector('.graph-container').getBoundingClientRect();
        return {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2
        };
    }

    // Function to draw curved arrow between two nodes
    function drawArrow(fromNode, toNode) {
        const from = getNodeCenter(fromNode);
        const to = getNodeCenter(toNode);
        
        // Calculate control point for curve
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        
        // Offset control point perpendicular to line for curve
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const offsetX = -dy / len * 50;
        const offsetY = dx / len * 50;
        
        const controlX = midX + offsetX;
        const controlY = midY + offsetY;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'arrow');
        path.setAttribute('d', `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`);
        svg.appendChild(path);
    }

    // Generate all arrows based on connections
    Object.entries(lessons).forEach(([number, lesson]) => {
        lesson.connectsTo.forEach(targetNum => {
            if (lessons[targetNum]) {
            drawArrow(lesson.element, lessons[targetNum].element);
            }
        });

        lesson.element.addEventListener('mouseenter', () => {
            tooltip.innerHTML = `
            <div class="tooltip-title">${number} - ${lesson.title}</div>
            <ul class="tooltip-list">
                ${lesson.subpages.map(sp => {
                    return `<li><a href="/csp/big-idea-3/${lesson.title.toLowerCase().replace(/\s+/g, '-')}/p3/${sp.toLowerCase().replace(/\s+/g, '-')}"">${sp}</a></li>`;
                }).join('')}
            </ul>
            `;
            const rect = lesson.element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            tooltip.style.left = (rect.left - containerRect.left + rect.width / 2) + 'px';
            tooltip.style.top = (rect.bottom - containerRect.top + 20) + 'px';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.classList.add('active');
        });

        lesson.element.addEventListener('mouseleave', () => {
            setTimeout(() => {
            if (!tooltip.matches(':hover')) tooltip.classList.remove('active');
            }, 50);
        });

        lesson.element.addEventListener('click', () => {
            alert(`Navigating to lesson ${number}`);
        });
    });

    // Keep tooltip visible when hovering over it
    tooltip.addEventListener('mouseleave', () => {
        const hoveredNode = Array.from(nodes).find(n => n.matches(':hover'));
        if (!hoveredNode) {
            tooltip.classList.remove('active');
        }
    });
</script>
