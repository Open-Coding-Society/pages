---
layout: post
title: "Golden Gate Bridge"
description: 
permalink: /west-coast/travel/sf/golden/
date: 2025-10-21
---

<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Golden Gate Bridge — Continuous Scene</title>
<style>
  :root{
    --sky-day:#9ed0ff; --sky-dusk:#ffb5a7; --sky-night:#0b1a3a;
    --water1:#3a6ea5; --water2:#244b74; --fog:#ffffff;
    --bridge:#c03a2b; --cable:#9a2d23; --road:#2a2a2a; --rail:#444;
    --car1:#ffd166; --car2:#ef476f; --car3:#06d6a0; --car4:#118ab2;
    --boat:#efefef; --buoy:#ff5b5b; --light:#fff98a;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{min-height:100%;background:#0b1a3a;color:#fff}
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;overflow-x:hidden;overflow-y:auto}

  /* Scene container - fixed height */
  .scene{position:relative;width:100%;height:80vh;perspective:1200px;opacity:1;transition:opacity .8s ease;overflow:hidden;} 

  /* Animated sky gradient (day→dusk→night→dawn cycle) */
  .sky{position:absolute;inset:0;z-index:0;}
  .sky::before{content:"";position:absolute;inset:0;
    background:linear-gradient(to bottom,var(--sky-day),#bfe3ff 60%, #e4f1ff 100%);
    animation: skyCycle 60s linear infinite;
    will-change:background;
  }
  @keyframes skyCycle{
    0%{background:linear-gradient(to bottom,var(--sky-day),#bfe3ff 60%, #e4f1ff)}
    25%{background:linear-gradient(to bottom,var(--sky-dusk),#ffd6c9 60%, #ffe9e2)}
    50%{background:linear-gradient(to bottom,var(--sky-night),#102a57 60%, #1a3a6b)}
    75%{background:linear-gradient(to bottom,#1c3b6f 0%, #a6c6ff 60%, #d9ecff)}
    100%{background:linear-gradient(to bottom,var(--sky-day),#bfe3ff 60%, #e4f1ff)}
  }

  /* Sun / Moon */
  .orb{position:absolute;left:-10vmin;top:10vmin;width:12vmin;height:12vmin;border-radius:50%;
       background:radial-gradient(circle at 35% 35%, #fff, #ffd27d 60%, rgba(255,210,125,0) 70%);
       filter:blur(0.5px);mix-blend-mode:screen;animation: orbPath 60s linear infinite;}
  @keyframes orbPath{
    0%{transform:translate(5vw,10vh)}
    25%{transform:translate(35vw,-5vh)}
    50%{transform:translate(75vw,8vh)}
    75%{transform:translate(45vw,20vh)}
    100%{transform:translate(5vw,10vh)}
  }

  /* Distant hills */
  .hills{position:absolute;inset:auto 0 35vh 0; height:30vh; z-index:1; overflow:hidden;}
  .hills::before{content:"";position:absolute;inset:-10vh -10vw 0 -10vw;border-radius:50% 50% 0 0 / 100% 100% 0 0;
    background:linear-gradient(to bottom, #4c7a9f, #375b7a); filter:blur(0.5px);
    transform:translateY(10vh);
  }

  /* Water with subtle waves */
  .water{position:absolute;inset:auto 0 0 0;height:40vh;background:linear-gradient(to bottom,var(--water1),var(--water2));
         z-index:2;}
  .ripples{position:absolute;inset:0;background:
      repeating-linear-gradient( to right, rgba(255,255,255,.12) 0 2px, transparent 2px 12px),
      radial-gradient(ellipse at 50% 20%, rgba(255,255,255,.12), transparent 60%),
      radial-gradient(ellipse at 40% 30%, rgba(255,255,255,.08), transparent 60%);
      opacity:.35;animation: drift 30s linear infinite;mix-blend-mode:screen}
  @keyframes drift{from{background-position:0 0,0 0,0 0} to{background-position:600px 0, 400px 0, 800px 0}}

  /* Fog layers */
  .fog{position:absolute;inset:0;z-index:3;pointer-events:none}
  .fog > span{position:absolute;left:-40vw;width:140vw;height:30vh;background:radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.7), rgba(255,255,255,0) 60%);
              filter:blur(10px);animation: fogMove 90s linear infinite;}
  .fog .f1{top:10vh;animation-duration:95s;opacity:.25}
  .fog .f2{top:22vh;animation-duration:85s;opacity:.18}
  .fog .f3{top:5vh; animation-duration:75s;opacity:.15}
  @keyframes fogMove{from{transform:translateX(0)} to{transform:translateX(60vw)}}

  /* Bridge group */
  .bridge{position:absolute;left:0;right:0;bottom:30vh;height:40vh;z-index:4;pointer-events:none}
  svg{position:absolute;inset:0; width:100%; height:100%;}

  /* Road deck overlay for cars */
  .deck{position:absolute;left:0;right:0;bottom:48.7vh;height:14px;background:var(--road);z-index:6; box-shadow:0 4px 10px rgba(0,0,0,.4)}
  .rail{position:absolute;left:0;right:0;bottom:calc(48.7vh + 10px);height:6px;background:linear-gradient(90deg,#666 0 50%, #555 50% 100%); background-size:16px 6px;opacity:.75}

  /* Cars */
  .cars{position:absolute;left:-10vw;right:-10vw;bottom:calc(48.7vh + 4px);height:16px;z-index:7}
  .car{position:absolute;bottom:0;width:28px;height:12px;border-radius:2px;background:var(--car1);box-shadow:0 2px 0 #0006 inset, 0 2px 4px rgba(0,0,0,.45);animation: drive linear infinite; will-change:transform;}
  .car::before,.car::after{content:"";position:absolute;bottom:-2px;width:6px;height:6px;border-radius:50%;background:#111;box-shadow:inset 0 0 0 2px #333}
  .car::before{left:4px} .car::after{right:4px}
  @keyframes drive {from{transform:translateX(-15vw)} to{transform:translateX(115vw)}}

  /* Boats */
  .boats{position:absolute;left:-20vw;right:-20vw;bottom:10vh;height:8vh;z-index:3}
  .boat{position:absolute;bottom:1vh;width:80px;height:16px;background:var(--boat);border-radius:0 0 8px 8px;box-shadow:0 8px 10px -8px rgba(0,0,0,.7);
        animation: sail linear infinite;}
  .boat::before{content:"";position:absolute;left:20px;bottom:16px;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:22px solid #f7f7f7;
                filter:drop-shadow(0 2px 0 rgba(0,0,0,.25))}
  @keyframes sail{from{transform:translateX(120vw)} to{transform:translateX(-140vw)}}

  /* Buoys */
  .buoy{position:absolute;bottom:11vh;width:10px;height:16px;background:var(--buoy);border-radius:2px;box-shadow:0 0 6px rgba(255,0,0,.6);animation: bob 4s ease-in-out infinite}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}

  /* Interaction: parallax tilt */
  .overlay{position:absolute;inset:0;z-index:9;}
  .hint{position:absolute;right:12px;bottom:12px;background:rgba(0,0,0,.85);color:#fff;padding:8px 12px;border-radius:12px;font-size:12px;backdrop-filter:blur(4px)}

  /* Lesson content */
  .lesson{background:#0b1a3a;padding:60px 20px;color:#fff}
  .lesson .container{max-width:800px;margin:0 auto}
  .lesson h1{font-size:2.5em;color:#fff;margin-bottom:30px}
  .lesson h2{font-size:2em;color:#fff;margin-top:40px;margin-bottom:20px}
  .lesson h3{font-size:1.5em;color:#fff;margin-top:30px;margin-bottom:15px}
  .lesson p{line-height:1.8;margin-bottom:15px;font-size:1.1em;color:#fff}
  .lesson ul{margin:20px 0 20px 30px;color:#fff}
  .lesson li{margin-bottom:10px;line-height:1.6;color:#fff}
  .example-box{background:rgba(255,255,255,.1);border-left:4px solid #c03a2b;padding:20px;margin:30px 0;border-radius:8px;color:#fff}
  .example-box strong{color:#fff}
  .example-box label{color:#fff}
  input{background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.3);color:#fff;padding:10px;font-size:16px;border-radius:5px}
  input::placeholder{color:rgba(255,255,255,.6)}
  button{background:#c03a2b;color:#fff;padding:12px 24px;font-size:16px;border:none;border-radius:5px;cursor:pointer;font-weight:600}
  button:hover{background:#d04232}
  #feedback{color:#fff}
  
  @media (prefers-reduced-motion: reduce){
    .sky::before,.orb,.ripples,.fog > span,.car,.boat{animation:none !important}
  }
</style>
</head>
<body>

<div class="scene" id="scene">
  <div class="sky"></div>
  <div class="orb" aria-hidden="true"></div>
  <div class="hills"></div>

  <div class="bridge" aria-label="Golden Gate Bridge">
    <svg viewBox="0 0 1600 600" preserveAspectRatio="none" role="img" aria-label="Golden Gate Bridge silhouette">
      <defs>
        <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <mask id="fadeMask"><rect x="0" y="300" width="1600" height="300" fill="url(#fade)"/></mask>
      </defs>

      <rect x="0" y="320" width="1600" height="6" fill="#222" opacity=".8"/>

      <g fill="var(--bridge)">
        <rect x="300" y="160" width="44" height="200" rx="6" />
        <rect x="1100" y="140" width="44" height="220" rx="6" />
        <rect x="290" y="190" width="64" height="10" opacity=".9"/>
        <rect x="290" y="230" width="64" height="10" opacity=".9"/>
        <rect x="1090" y="170" width="64" height="10" opacity=".9"/>
        <rect x="1090" y="210" width="64" height="10" opacity=".9"/>
      </g>

      <path id="cable1" d="M0,320 L300,160 C 500,300 900,300 1100,140 L1600,320" stroke="var(--cable)" stroke-width="6" fill="none"/>
      <path id="cable2" d="M0,320 L300,160 C 500,315 900,315 1100,140 L1600,320" stroke="var(--cable)" stroke-width="4" fill="none"/>

      <g id="hangers" stroke="var(--cable)" stroke-width="2"></g>

      <g mask="url(#fadeMask)" opacity=".25" transform="scale(1,-1) translate(0,-640)">
        <rect x="0" y="320" width="1600" height="6" fill="#000"/>
        <g fill="#000">
          <rect x="300" y="160" width="44" height="200" rx="6" />
          <rect x="1100" y="140" width="44" height="220" rx="6" />
          <rect x="290" y="190" width="64" height="10"/>
          <rect x="290" y="230" width="64" height="10"/>
          <rect x="1090" y="170" width="64" height="10"/>
          <rect x="1090" y="210" width="64" height="10"/>
        </g>
        <path d="M0,320 L300,160 C 500,300 900,300 1100,140 L1600,320" stroke="#000" stroke-width="6" fill="none"/>
        <path d="M0,320 L300,160 C 500,315 900,315 1100,140 L1600,320" stroke="#000" stroke-width="4" fill="none"/>
      </g>
    <script type="application/ecmascript"><![CDATA[
      (function(){
        const svg = document.currentScript.ownerSVGElement;
        const hangers = svg.getElementById('hangers');
        const path = svg.getElementById('cable1');
        if(!hangers || !path || !path.getTotalLength) return;
        const length = path.getTotalLength();
        function yAtX(targetX){
          let a=0, b=length, pt;
          for(let i=0;i<18;i++){
            const m=(a+b)/2; pt = path.getPointAtLength(m);
            if(pt.x < targetX) a = m; else b = m;
          }
          return pt.y;
        }
        for(let x=60;x<1540;x+=20){
          const y = yAtX(x);
          const line = document.createElementNS('http://www.w3.org/2000/svg','line');
          line.setAttribute('x1',x); line.setAttribute('x2',x);
          line.setAttribute('y1',y); line.setAttribute('y2',320);
          hangers.appendChild(line);
        }
      })();
    ]]></script>
    </svg>
  </div>

  <div class="deck"></div>
  <div class="rail" style="z-index:6"></div>

  <div class="cars" id="cars"></div>
  <div class="boats" id="boats"></div>
  <div class="buoy" style="left:22vw"></div>
  <div class="buoy" style="left:68vw;animation-duration:5.6s"></div>

  <div class="water">
    <div class="ripples"></div>
  </div>

  <div class="fog" aria-hidden="true">
    <span class="f1"></span>
    <span class="f2"></span>
    <span class="f3"></span>
  </div>

  <div class="overlay" id="overlay" aria-hidden="true"></div>
  <div class="hint">Move mouse for parallax effect</div>
</div>

<main class="lesson">
  <div class="container">
    <h1>UI Hierarchy: Golden Gate Bridge</h1>

    <h2>What is UI Hierarchy?</h2>
    <p>UI hierarchy guides users' eyes to what matters most—just like the Golden Gate Bridge's iconic towers instantly grab your attention against the San Francisco skyline. Think of it as organizing information from most important (the towers) to supporting details (the roadway).</p>

    <h2>The 3 Levels of Hierarchy</h2>

    <h3># H1: Primary (The Towers)</h3>
    <p>Most important—commanding like the 746-foot Art Deco towers. In Markdown, use # for your main page title. This is the biggest heading.</p>
    <ul>
      <li>Markdown: # Main Page Title</li>
      <li>HTML: &lt;h1&gt;Main Page Title&lt;/h1&gt;</li>
      <li>Use only once per page</li>
    </ul>

    <h3>## H2: Secondary (The Cables)</h3>
    <p>Supporting sections—like the suspension cables connecting everything. In Markdown, use ## for major sections.</p>
    <ul>
      <li>Markdown: ## Section Title</li>
      <li>HTML: &lt;h2&gt;Section Title&lt;/h2&gt;</li>
      <li>Use for main sections of your page</li>
    </ul>

    <h3>### H3: Tertiary (The Roadway)</h3>
    <p>Subsections and details—individual lanes and railings. In Markdown, use ### for subsections.</p>
    <ul>
      <li>Markdown: ### Subsection Title</li>
      <li>HTML: &lt;h3&gt;Subsection Title&lt;/h3&gt;</li>
      <li>Use for subsections within H2 areas</li>
    </ul>

    <h2>Why Heading Hierarchy Matters</h2>
    <p>The number of hashtags (#) determines importance and size. One hashtag (#) is biggest and most important. Two hashtags (##) is smaller and less important. Three hashtags (###) is smallest. This creates structure for screen readers and search engines.</p>
    <p>Always start with # and nest logically: # → ## → ###. Never skip levels (don't jump from # to ###).</p>

    <h2>Real Example: Bridge Website</h2>
    <div class="example-box">
      <p><strong># Cross the Golden Gate Bridge</strong></p>
      <p><strong>## San Francisco's Icon Since 1937</strong></p>
      <p><strong>### Visitor Information</strong></p>
      <p><strong>### History and Construction</strong></p>
      <p><strong>## Plan Your Visit</strong></p>
      <p><strong>### Parking and Transit</strong></p>
      <p><strong>### Best Photo Spots</strong></p>
    </div>

    <h2>Common Mistakes</h2>
    <ul>
      <li>Using multiple # headings on one page—use only one</li>
      <li>Skipping levels—going from # to ### without ##</li>
      <li>Using headings just to make text bigger—use them for structure</li>
      <li>Not organizing content logically—plan your hierarchy like the bridge's design</li>
    </ul>

    <h2>Quick Tips</h2>
    <ul>
      <li>One # per page (your main title)</li>
      <li>Use ## for major sections</li>
      <li>Use ### for subsections within those sections</li>
      <li>The fewer hashtags, the more important (and bigger) the heading</li>
      <li>Think of it like an outline—main point, sub-points, details</li>
    </ul>

    <h2>Test Your Knowledge Quiz!</h2>
    <p>Practice creating a heading hierarchy for a Golden Gate Bridge website. Type your headings below:</p>
    <div class="example-box">
      <label for="practice1" style="display:block;margin-bottom:10px;font-weight:600;color:#fff">Main page title (use #):</label>
      <input type="text" id="practice1" placeholder="# Your title here" style="width:100%;margin-bottom:20px;">
      
      <label for="practice2" style="display:block;margin-bottom:10px;font-weight:600;color:#fff">First major section (use ##):</label>
      <input type="text" id="practice2" placeholder="## Your section here" style="width:100%;margin-bottom:20px;">
      
      <label for="practice3" style="display:block;margin-bottom:10px;font-weight:600;color:#fff">A subsection (use ###):</label>
      <input type="text" id="practice3" placeholder="### Your subsection here" style="width:100%;margin-bottom:20px;">
      
      <button onclick="checkHierarchy()">Check My Hierarchy</button>
      <div id="feedback" style="margin-top:20px;padding:15px;border-radius:5px;display:none;"></div>
    </div>
  </div>
</main>
<script>
function checkHierarchy() {
  const input1 = document.getElementById('practice1').value.trim();
  const input2 = document.getElementById('practice2').value.trim();
  const input3 = document.getElementById('practice3').value.trim();
  const feedback = document.getElementById('feedback');
  
  let messages = [];
  let correct = 0;
  
  if(input1.startsWith('# ') && !input1.startsWith('## ')) {
    messages.push('✅ Perfect! Your main title uses one #');
    correct++;
  } else {
    messages.push('❌ Main title should start with one # (not ## or ###)');
  }
  
  if(input2.startsWith('## ') && !input2.startsWith('### ')) {
    messages.push('✅ Great! Your section uses ##');
    correct++;
  } else {
    messages.push('❌ Section should start with ## (two hashtags)');
  }
  
  if(input3.startsWith('### ')) {
    messages.push('✅ Excellent! Your subsection uses ###');
    correct++;
  } else {
    messages.push('❌ Subsection should start with ### (three hashtags)');
  }
  
  feedback.style.display = 'block';
  if(correct === 3) {
    feedback.style.background = 'rgba(76,175,80,.3)';
    feedback.style.border = '2px solid #4CAF50';
    feedback.style.color = '#a5d6a7';
    feedback.innerHTML = '<strong>🎉 Perfect hierarchy!</strong><br>' + messages.join('<br>') + '<br><br>You understand heading structure!';
  } else {
    feedback.style.background = 'rgba(255,193,7,.3)';
    feedback.style.border = '2px solid #FFC107';
    feedback.style.color = '#ffd54f';
    feedback.innerHTML = '<strong>Keep trying!</strong><br>' + messages.join('<br>');
  }
}
</script>

<script>
(function(){
  const carsEl = document.getElementById('cars');
  const boatsEl = document.getElementById('boats');
  const scene = document.getElementById('scene');

  const rnd=(a=1,b=0)=>Math.random()*(a-b)+b;
  const pick=a=>a[Math.floor(Math.random()*a.length)];

  const carColors=['var(--car1)','var(--car2)','var(--car3)','var(--car4)'];
  function spawnCar(){
    const car=document.createElement('div'); car.className='car';
    car.style.background=pick(carColors);
    const dir = Math.random()<0.5?1:-1;
    const dur = rnd(12,6);
    car.style.animationDuration = dur+'s';
    if(dir<0){
      car.style.transform='scaleX(-1)';
      car.animate([
        {transform:'translateX(115vw) scaleX(-1)'},
        {transform:'translateX(-15vw) scaleX(-1)'}
      ], {duration: dur*1000, iterations: Infinity, easing:'linear'});
    }
    carsEl.appendChild(car);
    const glow=document.createElement('div');
    glow.style.cssText='position:absolute;right:-4px;top:3px;width:4px;height:3px;border-radius:2px;background:rgba(255,255,200,.9);box-shadow:0 0 8px 3px rgba(255,255,200,.9)';
    if(Math.random()<.6) car.appendChild(glow);
    setTimeout(()=>{ if(car.isConnected) car.remove(); }, dur*1000*1.2);
  }
  setInterval(spawnCar, 1300);
  for(let i=0;i<6;i++) spawnCar();

  function spawnBoat(){
    const boat=document.createElement('div'); boat.className='boat';
    boat.style.left=rnd(0,100)+'vw';
    boat.style.animationDuration=rnd(65,35)+'s';
    boat.style.animationDelay = (-Math.random()*10)+'s';
    boatsEl.appendChild(boat);
    setTimeout(()=>{ if(boat.isConnected) boat.remove();}, 70000);
  }
  setInterval(spawnBoat, 8000);
  for(let i=0;i<3;i++) spawnBoat();

  let targetRX=0,targetRY=0,rx=0,ry=0;
  function onMove(x,y){
    const cx=window.innerWidth/2, cy=window.innerHeight/2;
    targetRY = (x-cx)/cx * 4;
    targetRX = -(y-cy)/cy * 3;
  }
  window.addEventListener('mousemove', e=> onMove(e.clientX,e.clientY));
  window.addEventListener('touchmove', e=>{ if(e.touches[0]) onMove(e.touches[0].clientX,e.touches[0].clientY); }, {passive:true});

  function raf(){
    rx += (targetRX - rx)*0.05; ry += (targetRY - ry)*0.05;
    scene.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const water=document.querySelector('.water');
  let t=0; setInterval(()=>{ t+=0.04; water.style.transform=`translateY(${Math.sin(t)*1.5}px)`; }, 50);
})();
</script>
</body>
</html>