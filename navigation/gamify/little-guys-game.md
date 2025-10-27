---
layout: post
title: Little Guys
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Game</title>
    <style>
        /* Make the canvas fill the screen */
        html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #000;
        }
        canvas {
            display: block;
        }
    </style>
</head>
<body>

<canvas id="game"></canvas>

<script>
    import { Camera } from '{{ base.url }}/assets/js/gamify/cameraController.js';
    '/home/spenc/jTri1/pages/assets/js/gamify/cameraController.js'
    import { Entity } from '{{ base.url }}/assets/js/gamify/entity.js';
    import { Transform } from '{{ base.url }}/assets/js/gamify/tools.js';
    import { distance, toRadians, pointAt } from '{{ base.url }}/essentials.js';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();


    const Mouse = {
        x: 0,
        y: 0,
        down: false,
        moving: false
    };

    const camera = new Camera();
    const drag = new Camera();
    const selectedID = -1;


    var entities = [];
    const entityImg = './pages/images/gamify/creators/little-guy.png';

    function spawnEntities(n) {
        for (let i = 0; i < n; i++) {
            entities.push(new Entity(0, 0, entityImg));
        }
    };

    updateEntities() {
        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];
            e.update();

            const package = {e.transform.position.x + canvas.width/2, e.transform.positon.y + e.ystep + canvas.width/2, 48 * camera.zoom, 56 * camera.zoom e};

            ctx.drawImg(...package);

            entities[i] = e;
        }
    };


    spawnEntities(10);
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        updateEntities();

        if (Mouse.down && Mouse.moving) {
            const dif = distance(Mouse.x, Mouse.y, lastMouse.x, lastMouse.y);
            const dir = pointAt(Mouse.x, Mouse.y, lastMouse.x, lastMouse.y);

            drag.move(dif, dir);
            camera.follow(drag);

        } else {
            lastMouse = Mouse;
        }

        requestAnimationFrame(loop);
    };

    loop();



    window.addEventListener('mousemove', e => {
        Mouse.x = e.clientX;
        Mouse.y = e.clientY;
        if (Mouse = lastMouse) {
            Mouse.moving = false;
        } else {
            Mouse.moving = true;
        }
    });

    window.addEventListener('mousedown', () => Mouse.down = true);
    window.addEventListener('mouseup', () => Mouse.down = false);
</script>
</body>
</html>