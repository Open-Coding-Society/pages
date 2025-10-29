---
layout: post
title: "Los Angeles"
description: "Roadtrip through LA and learn UI while you're there!"
permalink: /west-coast/analytics/losangeles/
parent: "Analytics/Admin"
team: "Cool Collaborators"
submodule: 1
author: "Cool Collaborators"
date: 2025-10-21
---

# Los Angeles 

## Content Coming Soon
This submodule will be developed by the Cool Collaborators team. 
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>LA Adventure — Fixed & Amped</title>
<style>
  :root{
    --bg1:#667eea;--bg2:#764ba2;--ink:#222;--muted:#666;
    --accent:#6c63ff;--accent2:#a16ae8;--shadow:0 30px 80px rgba(0,0,0,.35);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,Helvetica,sans-serif;
    background:linear-gradient(135deg,var(--bg1),var(--bg2));
    color:var(--ink);
    display:flex;align-items:center;justify-content:center;overflow:hidden;
  }

  /* App shell */
  .app{
    width:min(1280px,96vw); height:min(900px,94vh);
    background:#fff; border-radius:24px; box-shadow:var(--shadow);
    display:grid; grid-template-rows:auto 1fr; overflow:hidden; position:relative;
  }
  header{padding:16px 24px; display:flex; align-items:center; justify-content:space-between;
    background:linear-gradient(90deg,#fff 0%,#f7f5ff 100%); border-bottom:1px solid #ece9ff}
  header h1{font-size:clamp(20px,2.4vw,28px)}
  .crumb{color:#7a74a8}

  /* Screens */
  .screens{position:relative}
  .screen{position:absolute; inset:0; padding:32px; display:none}
  .screen.active{display:block; animation:fade .4s ease}
  @keyframes fade{from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:none}}
  h2.title{font-size:clamp(24px,2.4vw,32px); text-align:center; margin-bottom:8px}
  p.lead{color:var(--muted); text-align:center; margin-bottom:28px}

  .options{display:grid; gap:16px; width:min(900px,92%); margin:24px auto 8px;
    grid-template-columns:repeat(2,minmax(0,1fr))}
  @media (min-width:1000px){.options{grid-template-columns:repeat(3,minmax(0,1fr))}}
  .btn{
    background:linear-gradient(135deg,var(--accent),var(--accent2));
    color:#fff; border:0; border-radius:16px; padding:18px 22px; font-weight:700;
    box-shadow:0 12px 24px rgba(108,99,255,.25); cursor:pointer;
    transition:transform .18s ease, box-shadow .18s ease;
  }
  .btn:hover{transform:translateY(-3px); box-shadow:0 18px 32px rgba(108,99,255,.32)}

  /* Stage */
  .stage{width:100%; height:calc(100% - 120px); display:grid; place-items:center}
  .scene-wrap{
    width:min(1200px,95%); height:min(640px,72vh);
    border-radius:20px; overflow:hidden; position:relative;
    box-shadow:inset 0 0 0 1px #eae6ff, 0 16px 50px rgba(0,0,0,.18);
  }
  .desc{ text-align:center; color:#57557a; margin-top:14px }
  .back{ position:absolute; left:24px; bottom:24px }
  .back .btn{ background:#2e2e3a; box-shadow:0 10px 24px rgba(0,0,0,.25) }
  .back .btn:hover{ background:#444456 }

  /* Travel overlay (car aligned over dashed road) */
  .travel{ position:absolute; inset:0; display:none; place-items:center; z-index:50 }
  .travel.active{display:grid}
  .travel .bg{ position:absolute; inset:0; background:linear-gradient(#87CEEB,#98D8C8) }
  .travel .road{ position:absolute; left:0; right:0; bottom:28%; height:10px;
    background:repeating-linear-gradient(90deg,#fff 0 50px,transparent 50px 100px);
    animation:road 1.1s linear infinite }
  @keyframes road{from{transform:translateX(-100px)} to{transform:none}}
  .car{
    width:112px; height:54px; background:#ff2a2a; border-radius:12px; position:absolute;
    left:50%; transform:translateX(-50%); bottom:calc(28% + 12px);
    box-shadow:0 10px 24px rgba(0,0,0,.38); animation:shake .34s ease-in-out infinite;
  }
  .car:before{content:""; position:absolute; width:50px; height:30px; background:#8fe0ff; top:-18px; left:16px; border-radius:6px}
  .wheel{ position:absolute; bottom:-8px; width:22px; height:22px; background:#111; border-radius:50%; animation:spin .6s linear infinite }
  .wheel.l{left:10px}.wheel.r{right:10px}
  @keyframes spin{to{transform:rotate(360deg)}} @keyframes shake{50%{transform:translateX(-50%) translateY(-1px)}}
  .travel p{ position:absolute; bottom:calc(28% + 70px); font-weight:800; color:#fff; text-shadow:0 3px 18px rgba(0,0,0,.55) }

  /* Helpers */
  .abs{position:absolute}

  /* -------------------- SCENES -------------------- */

  /* 1) HOLLYWOOD WALK OF FAME — skyline, billboard, paparazzi, sliding stars */
  .hollywood{ background:linear-gradient(#87CEEB,#B0D4E3) }
  .skyline{ position:absolute; bottom:140px; left:0; right:0; height:34%;
    background:linear-gradient(#b9d2e6,#9ab8d1);
    clip-path:polygon(0 100%,0 40%,6% 44%,12% 36%,18% 44%,26% 30%,34% 46%,44% 28%,54% 42%,66% 34%,76% 48%,88% 36%,100% 44%,100% 100%) }
  .billboard{ position:absolute; bottom:52%; left:12%; width:220px; height:80px; background:#111; color:#fff;
    display:grid; place-items:center; border:6px solid #333; box-shadow:0 10px 18px rgba(0,0,0,.25) }
  .billboard:after{ content:"NEW RELEASE"; font-weight:800; letter-spacing:3px; animation:blink 1.2s steps(2) infinite }
  @keyframes blink{50%{opacity:.4}}
  .sidewalk{ position:absolute; inset:auto 0 0 0; height:140px; background:linear-gradient(#d9c2a1,#af8f73); border-top:4px solid #8b7355 }
  .star{ width:68px; height:68px; background:linear-gradient(135deg,#ffd700,#ffa500);
    clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
    bottom:38px; left:-120px; filter:drop-shadow(0 0 10px rgba(255,215,0,.55));
    animation:stars 9s linear infinite }
  .star.s2{animation-delay:2.2s}.star.s3{animation-delay:4.4s}.star.s4{animation-delay:6.6s}
  @keyframes stars{to{transform:translateX(1300px)}}
  .pap{ position:absolute; bottom:160px; left:10%; width:42px; height:86px; animation:walk 10s linear infinite }
  .flash{ position:absolute; width:18px; height:18px; background:#ffd700; border-radius:50%; top:30px; left:50%;
    transform:translateX(-50%); box-shadow:0 0 22px #ffd700; animation:pop 1.8s ease-in-out infinite }
  @keyframes pop{0%,90%,100%{opacity:0; transform:translateX(-50%) scale(0)}95%{opacity:1; transform:translateX(-50%) scale(2)}}
  .celebrity{ bottom:140px; left:-60px; width:44px; height:96px; animation:walk 8s linear infinite }
  @keyframes walk{to{left:110%}}
  .head{ width:36px; height:36px; background:radial-gradient(circle at 30% 30%,#ffe0bd,#ffcba4); border-radius:50%; margin:0 auto; border:3px solid #cc9966 }
  .body{ width:44px; height:34px; background:linear-gradient(135deg,#4a90e2,#357abd); margin:4px auto; border-radius:8px; border:3px solid #2e5f8a }
  .legs{ position:absolute; bottom:0; width:14px; height:26px; background:#2c3e50; border:2px solid #000; border-radius:4px }
  .legs.r{ right:12px } .legs.l{ left:12px }

  /* 2) GRIFFITH (kept) */
  .griffith{ background:linear-gradient(#0f0c29,#302b63 55%,#24243e) }
  .twinkle{ width:3px; height:3px; background:#fff; border-radius:50%; box-shadow:0 0 8px #fff; animation:tw 2s ease-in-out infinite }
  .twinkle.t2{ animation-delay:.4s; top:18% } .twinkle.t3{ animation-delay:.8s; top:28% } .twinkle.t4{ animation-delay:1.2s; top:46% }
  @keyframes tw{50%{transform:scale(2.2); opacity:1}}
  .comet{ width:8px; height:8px; background:#fff; border-radius:50%; box-shadow:0 0 10px #fff; top:20%; left:-100px; animation:comet 7s linear infinite }
  .comet:after{ content:""; position:absolute; width:90px; height:2px; right:8px; top:3px; background:linear-gradient(to right,#fff,transparent) }
  .comet.c2{ top:40%; animation-delay:1.6s } .comet.c3{ top:60%; animation-delay:3.2s }
  @keyframes comet{to{left:110%}}
  .planet{ border-radius:50%; position:absolute; animation:spin 22s linear infinite }
  .planet.mars{ width:56px; height:56px; background:radial-gradient(circle at 30% 30%,#ff6b4a,#cd5c3a); top:14%; left:10%; box-shadow:0 0 26px rgba(255,107,74,.55)}
  .planet.jupiter{ width:78px; height:78px; background:radial-gradient(circle at 30% 30%,#ffa726,#ff8a50); top:48%; right:10%; box-shadow:0 0 34px rgba(255,167,38,.55); animation-duration:26s }
  @keyframes spin{to{transform:rotate(360deg)}}
  .moon{ width:64px; height:64px; background:linear-gradient(135deg,#fff5e1,#ffe4b5); border-radius:50%; position:absolute; top:24%; right:14%; box-shadow:0 0 36px rgba(255,245,225,.8); animation:float 7.5s ease-in-out infinite }
  @keyframes float{50%{transform:translateY(-18px)}}
  .observatory{ position:absolute; bottom:84px; left:50%; transform:translateX(-50%); width:240px; height:130px }
  .dome{ position:absolute; top:0; left:50%; transform:translateX(-50%); width:96px; height:74px; background:linear-gradient(#e8e8e8,#c0c0c0); border:4px solid #999; border-radius:50% 50% 0 0 }
  .base{ position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:184px; height:64px; background:linear-gradient(#d3d3d3,#a9a9a9); border:4px solid #808080; border-radius:6px }

  /* 3) UNIVERSAL — ground, studios, rails+ties+supports, on-track cart */
  .universal{ background:linear-gradient(#87CEEB 0%, #98D8C8 60%, #bfe6ff 100%) }
  .ground{ position:absolute; inset:auto 0 0 0; height:34%; background:linear-gradient(#a2bf91,#7aa36c); box-shadow: inset 0 10px 20px rgba(0,0,0,.15) }
  .studios{ position:absolute; bottom:34%; left:0; right:0; height:26%;
    background:linear-gradient(#dcd8cf,#c8c3ba);
    clip-path:polygon(0 100%,0 35%,8% 30%,15% 45%,23% 34%,35% 46%,48% 28%,58% 40%,70% 30%,82% 48%,100% 32%,100% 100%) }
  .plaza{ position:absolute; bottom:34%; left:0; right:0; height:30px; background:repeating-linear-gradient(90deg,#e9e1d1 0 40px,#d4c7af 40px 80px) }
  .track-svg{ position:absolute; inset:0; pointer-events:none }
  .track-svg path{ stroke:#4b4b4b; stroke-width:12; fill:none; filter:drop-shadow(0 6px 8px rgba(0,0,0,.2)) }
  .ties path{ stroke:#6b5b4b; stroke-width:6; stroke-linecap:round }
  .supports line{ stroke:#3e3e3e; stroke-width:6; opacity:.7 }
  .coaster-cart{ width:60px; height:36px; background:linear-gradient(135deg,#e74c3c,#c0392b); border:3px solid #922b21; border-radius:10px; position:absolute; top:0; left:0; box-shadow:0 8px 16px rgba(0,0,0,.35);
    offset-path:path("M 80 520 C 200 420, 260 260, 380 220 S 620 210, 700 300 S 820 520, 1020 540");
    offset-rotate:auto; animation:ride 7.5s cubic-bezier(.37,.01,.27,1) infinite }
  .coaster-cart .rider{ position:absolute; width:22px; height:26px; background:#4a90e2; border:2px solid #2e5f8a; border-radius:50% 50% 0 0; top:-22px; left:19px }
  .coaster-cart .rider:before{ content:""; position:absolute; width:16px; height:16px; background:#ffe0bd; border:2px solid #cc9966; border-radius:50%; top:-14px; left:50%; transform:translateX(-50%) }
  @keyframes ride{0%{offset-distance:0%}50%{offset-distance:50%}100%{offset-distance:100%}}
  .gate{ position:absolute; bottom:34%; left:50%; transform:translateX(-50%); width:260px; height:190px; border:6px solid #ffd700; border-radius:22px;
    background:linear-gradient(135deg,rgba(255,215,0,.18),rgba(255,165,0,.18)) }
  .gate:before{ content:"UNIVERSAL"; position:absolute; top:22px; left:50%; transform:translateX(-50%); color:#ffd700; font-weight:800; letter-spacing:3px; text-shadow:0 4px 14px rgba(0,0,0,.5) }
  .fw{ position:absolute; width:8px; height:8px; background:#ffd700; border-radius:50%; animation:boom 2.2s ease-out infinite }
  .fw.f2{ left:64%; top:18%; animation-delay:.5s } .fw.f3{ left:42%; top:26%; animation-delay:1.1s }
  @keyframes boom{0%{transform:scale(1);opacity:1;box-shadow:0 0 0 0 #ffd700}45%{transform:scale(4);box-shadow:0 0 34px 16px #ffd700,20px 20px 30px 10px #ff6b6b}100%{transform:scale(1);opacity:0}}

  /* 4) SANTA MONICA PIER — pier over water, shoreline, sun, waves, ferris */
  .smp{ background:linear-gradient(#79c9ff 0%, #aee4ff 55%, #e6fbff 100%) }
  .sun{ position:absolute; top:6%; left:8%; width:70px; height:70px; border-radius:50%;
    background:radial-gradient(circle at 30% 30%,#fff8b0,#ffd46a); box-shadow:0 0 60px rgba(255,212,106,.6) }
  .shore{ position:absolute; inset:auto 0 38% 0; height:8%; background:linear-gradient(#f0deaa,#e3c98c) }
  .ocean{ position:absolute; inset:auto 0 0 0; height:38%; background:linear-gradient(#62b5ff 0%, #2f92ff 70%); overflow:hidden }
  .wave{ position:absolute; left:-20%; right:-20%; height:40px;
    background:radial-gradient(circle at 50% 120%, rgba(255,255,255,.8), rgba(255,255,255,0) 70%);
    top:0; opacity:.6; animation:wave 6s linear infinite }
  .wave.w2{ top:24px; opacity:.4; animation-duration:8s } .wave.w3{ top:48px; opacity:.35; animation-duration:10s }
  @keyframes wave{from{transform:translateX(-10%)} to{transform:translateX(10%)}}
  .pier{ position:absolute; bottom:38%; left:6%; width:60%; height:18px;
    background:repeating-linear-gradient(90deg,#9b6a3c 0 60px,#8a5c33 60px 120px); box-shadow:0 8px 14px rgba(0,0,0,.25); border-radius:4px }
  .pylon{ position:absolute; bottom:-110px; width:12px; height:110px; background:#5b3b20; left:var(--x) }
  .rail{ position:absolute; top:-18px; left:0; right:0; height:8px; background:#714c2a; border-radius:4px }
  .ferris{ position:absolute; bottom:46%; right:12%; width:220px; height:220px; border:6px solid #777; border-radius:50%;
    animation:spin 22s linear infinite; box-shadow:0 8px 18px rgba(0,0,0,.25) }
  .spoke{ position:absolute; top:50%; left:50%; width:2px; height:48%; background:#777; transform-origin:top; transform:rotate(var(--r)) translateY(-100%) }
  .car{ position:absolute; width:26px; height:18px; background:#ff7a7a; border:2px solid #b44747; border-radius:4px; top:100%; left:50%; transform:translate(-50%,0) }
  .gull{ position:absolute; width:28px; height:10px; border-top:3px solid rgba(255,255,255,.9); border-radius:50%; top:18%; left:70%; transform:rotate(-15deg); animation:gull 6s ease-in-out infinite }
  @keyframes gull{50%{transform:translateY(-10px) rotate(-10deg)}}

  /* 5) KOREATOWN — gate, neon, lanterns */
  .ktown{ background:linear-gradient(#fefefe,#f3f6ff) }
  .road{ position:absolute; inset:auto 0 0 0; height:160px; background:linear-gradient(#d8d3d0,#b7b0ad); border-top:4px solid #9b908b }
  .gate{ position:absolute; bottom:200px; left:50%; transform:translateX(-50%); width:600px; height:260px }
  .gate .roof{ position:absolute; top:0; left:50%; transform:translateX(-50%); width:600px; height:86px; background:linear-gradient(0deg,#176b87,#1f97b1); border-radius:0 0 18px 18px; box-shadow:0 14px 18px rgba(0,0,0,.18) }
  .gate .tiles{ position:absolute; inset:14px 20px auto 20px; height:12px; background:repeating-linear-gradient(90deg, rgba(255,255,255,.35) 0 14px, transparent 14px 28px) }
  .gate .beam{ position:absolute; top:98px; left:50%; transform:translateX(-50%); width:560px; height:26px; background:#b44; box-shadow:inset 0 -3px 0 #822 }
  .gate .post{ position:absolute; bottom:0; width:34px; height:160px; background:#9a3a3a; border:3px solid #762; left:var(--x) }
  .sign{ position:absolute; top:122px; left:50%; transform:translateX(-50%); background:#f9f1e1; border:3px solid #d7c5a0; width:240px; height:64px; display:grid; place-items:center; font-weight:800; letter-spacing:2px; color:#333; box-shadow:0 6px 14px rgba(0,0,0,.18) }
  .lantern{ position:absolute; bottom:230px; width:20px; height:20px; background:#ff4d4d; border:3px solid #a81818; border-radius:50%; left:var(--x); animation:float 3.2s ease-in-out infinite }
  @keyframes float{50%{transform:translateY(-8px)}}
  .neon{ position:absolute; bottom:190px; left:12%; width:160px; height:40px; background:#0c0c0c; border:4px solid #222; display:grid; place-items:center; color:#00ffd1; font-weight:800; letter-spacing:2px; text-shadow:0 0 14px #00ffd1; animation:flicker 2.6s infinite }
  .neon:nth-of-type(2){ left:auto; right:14%; color:#ff5ad1; text-shadow:0 0 14px #ff5ad1 }
  @keyframes flicker{10%,18%,32%{opacity:.4} 0%,12%,20%,100%{opacity:1}}

  /* 6) HOLLYWOOD SIGN (kept) */
  .sign-hills{ background:linear-gradient(#8fd0ff 0%, #cfefff 60%, #eaf6ff 100%)}
  .hill{ position:absolute; bottom:0; width:60%; height:40%; background:radial-gradient(circle at 50% 100%,#6fb36a 0%,#518f57 70%); left:var(--x); border-radius:50% 50% 0 0; filter:brightness(.95) }
  .sign{ position:absolute; bottom:46%; left:50%; transform:translateX(-50%); display:flex; gap:8px; filter:drop-shadow(0 6px 10px rgba(0,0,0,.25)) }
  .sign .ltr{ width:28px; height:68px; background:#fff; border:5px solid #eaeaea }
</style>
</head>
<body>
  <div class="app" id="app">
    <header>
      <h1>🌴 LA Adventure</h1>
      <div class="crumb" id="crumb">Choose a destination</div>
    </header>

    <div class="screens">
      <!-- START -->
      <section id="start" class="screen active" aria-labelledby="title-home">
        <h2 id="title-home" class="title">Pick your LA destination</h2>
        <p class="lead">Bigger scenes • real pier • proper coaster • LA vibes turned up.</p>
        <div class="options">
          <button class="btn" data-go="hollywood">⭐ Hollywood Walk of Fame</button>
          <button class="btn" data-go="griffith">🔭 Griffith Observatory</button>
          <button class="btn" data-go="universal">🎬 Universal Studios Hollywood</button>
          <button class="btn" data-go="ktown">🧧 Koreatown</button>
          <button class="btn" data-go="smp">🎡 Santa Monica Pier</button>
          <button class="btn" data-go="hillsign">⛰️ Hollywood Sign</button>
        </div>
      </section>

      <!-- HOLLYWOOD -->
      <section id="hollywood" class="screen" aria-labelledby="t1">
        <h2 id="t1" class="title">⭐ Hollywood Walk of Fame</h2>
        <div class="stage">
          <div class="scene-wrap hollywood">
            <div class="skyline"></div>
            <div class="billboard"></div>
            <div class="sidewalk"></div>

            <div class="star abs s1"></div>
            <div class="star abs s2"></div>
            <div class="star abs s3"></div>
            <div class="star abs s4"></div>

            <div class="pap">
              <div class="flash"></div>
              <div class="head"></div>
              <div class="body" style="background:#333; border-color:#000"></div>
            </div>

            <div class="celebrity abs" style="left:-60px">
              <div class="head"></div><div class="body"></div>
              <div class="legs l"></div><div class="legs r"></div>
            </div>
            <div class="celebrity abs" style="left:-120px; animation-delay:1.6s">
              <div class="head"></div>
              <div class="body" style="background:linear-gradient(135deg,#e74c3c,#c0392b); border-color:#922b21"></div>
              <div class="legs l"></div><div class="legs r"></div>
            </div>
          </div>
          <p class="desc">LA skyline, flashing paparazzi, and stars sliding down the boulevard ✨</p>
          <div class="back"><button class="btn" data-back>Explore another location</button></div>
        </div>
      </section>

      <!-- GRIFFITH -->
      <section id="griffith" class="screen" aria-labelledby="t2">
        <h2 id="t2" class="title">🔭 Griffith Observatory</h2>
        <div class="stage">
          <div class="scene-wrap griffith">
            <div class="twinkle abs" style="top:12%; left:12%"></div>
            <div class="twinkle abs t2" style="left:48%"></div>
            <div class="twinkle abs t3" style="left:72%"></div>
            <div class="twinkle abs t4" style="left:22%"></div>

            <div class="comet abs"></div>
            <div class="comet abs c2"></div>
            <div class="comet abs c3"></div>

            <div class="planet mars"></div>
            <div class="planet jupiter"></div>
            <div class="moon"></div>

            <div class="observatory">
              <div class="dome"></div><div class="base"></div>
            </div>
          </div>
          <p class="desc">Comets streak, planets spin, the lights of LA glow below 🌌</p>
          <div class="back"><button class="btn" data-back>Explore another location</button></div>
        </div>
      </section>

      <!-- UNIVERSAL -->
      <section id="universal" class="screen" aria-labelledby="t3">
        <h2 id="t3" class="title">🎬 Universal Studios Hollywood</h2>
        <div class="stage">
          <div class="scene-wrap universal">
            <div class="studios"></div>
            <div class="ground"></div>
            <div class="plaza"></div>

            <svg class="track-svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <g class="supports">
                <line x1="380" y1="235" x2="380" y2="520"/>
                <line x1="700" y1="315" x2="700" y2="555"/>
                <line x1="900" y1="500" x2="900" y2="560"/>
              </g>
              <path d="M80 520 C 200 420, 260 260, 380 220 S 620 210, 700 300 S 820 520, 1020 540"/>
              <path d="M80 535 C 200 435, 260 275, 380 235 S 620 225, 700 315 S 820 535, 1020 555"/>
              <g class="ties">
                <path d="M110 530 L110 545 M170 498 L170 514 M230 458 L230 476 M290 408 L290 428
                         M350 358 L350 378 M410 332 L410 352 M470 318 L470 338 M530 310 L530 330
                         M590 308 L590 328 M650 314 L650 334 M710 332 L710 352 M770 372 L770 392
                         M830 422 L830 442 M890 472 L890 492 M950 512 L950 532 M1010 544 L1010 564"/>
              </g>
            </svg>

            <div class="coaster-cart"><div class="rider"></div></div>
            <div class="gate"></div>

            <div class="fw" style="left:16%; top:12%"></div>
            <div class="fw f2"></div>
            <div class="fw f3"></div>
          </div>
          <p class="desc">Curved rails with ties & supports, a cart on-track, plus studio facades 🎆</p>
          <div class="back"><button class="btn" data-back>Explore another location</button></div>
        </div>
      </section>

      <!-- KOREATOWN -->
      <section id="ktown" class="screen" aria-labelledby="t4">
        <h2 id="t4" class="title">🧧 Koreatown</h2>
        <div class="stage">
          <div class="scene-wrap ktown">
            <div class="gate">
              <div class="roof"></div><div class="tiles"></div><div class="beam"></div>
              <div class="post" style="--x:40px"></div><div class="post" style="--x:526px"></div>
              <div class="sign">서울 한인타운</div>
            </div>
            <div class="neon">24H BBQ</div>
            <div class="neon" style="right:14%; left:auto">노래방</div>
            <div class="lantern" style="--x:28%"></div>
            <div class="lantern" style="--x:42%; animation-delay:.6s"></div>
            <div class="lantern" style="--x:58%; animation-delay:1.2s"></div>
            <div class="road"></div>
          </div>
          <p class="desc">Pagoda roof gate, neon signs, and floating lanterns over the street 🌃</p>
          <div class="back"><button class="btn" data-back>Explore another location</button></div>
        </div>
      </section>

      <!-- SANTA MONICA -->
      <section id="smp" class="screen" aria-labelledby="t5">
        <h2 id="t5" class="title">🎡 Santa Monica Pier</h2>
        <div class="stage">
          <div class="scene-wrap smp">
            <div class="sun"></div>
            <div class="pier">
              <div class="rail"></div>
              <div class="pylon" style="--x:4%"></div><div class="pylon" style="--x:12%"></div>
              <div class="pylon" style="--x:20%"></div><div class="pylon" style="--x:28%"></div>
              <div class="pylon" style="--x:36%"></div><div class="pylon" style="--x:44%"></div>
              <div class="pylon" style="--x:52%"></div>
            </div>
            <div class="ferris">
              <div class="spoke" style="--r:0deg"></div>
              <div class="spoke" style="--r:45deg"></div>
              <div class="spoke" style="--r:90deg"></div>
              <div class="spoke" style="--r:135deg"></div>
              <div class="car" style="transform: translate(-50%,0) rotate(0deg) translateY(-100%)"></div>
              <div class="car" style="transform: translate(-50%,0) rotate(45deg) translateY(-100%)"></div>
              <div class="car" style="transform: translate(-50%,0) rotate(90deg) translateY(-100%)"></div>
              <div class="car" style="transform: translate(-50%,0) rotate(135deg) translateY(-100%)"></div>
            </div>
            <div class="shore"></div>
            <div class="ocean"><div class="wave"></div><div class="wave w2"></div><div class="wave w3"></div></div>
            <div class="gull"></div>
          </div>
          <p class="desc">Real wooden pier over the water, shoreline, sun, waves, and a spinning wheel 🌊🎠</p>
          <div class="back"><button class="btn" data-back>Explore another location</button></div>
        </div>
      </section>

      <!-- HOLLYWOOD SIGN -->
      <section id="hillsign" class="screen" aria-labelledby="t6">
        <h2 id="t6" class="title">⛰️ Hollywood Sign</h2>
        <div class="stage">
          <div class="scene-wrap sign-hills">
            <div class="hill" style="--x:-10%"></div>
            <div class="hill" style="--x:20%"></div>
            <div class="hill" style="--x:55%"></div>
            <div class="sign">
              <div class="ltr">H</div><div class="ltr">O</div><div class="ltr">L</div><div class="ltr">L</div>
              <div class="ltr">Y</div><div class="ltr">W</div><div class="ltr">O</div><div class="ltr">O</div><div class="ltr">D</div>
            </div>
          </div>
          <p class="desc">Sunlit hills and the iconic letters overlooking LA ☀️</p>
          <div class="back"><button class="btn" data-back>Explore another location</button></div>
        </div>
      </section>
    </div>

    <!-- Travel overlay -->
    <div id="travel" class="travel" aria-hidden="true">
      <div class="bg"></div>
      <div class="road"></div>
      <div class="car"><div class="wheel l"></div><div class="wheel r"></div></div>
      <p>Driving to your destination…</p>
    </div>
  </div>

  <script>
    const screens=[...document.querySelectorAll('.screen')];
    const start=document.getElementById('start');
    const travel=document.getElementById('travel');
    const crumb=document.getElementById('crumb');

    document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
    document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',back));

    function go(id){
      travel.classList.add('active');
      showOnly(start);
      setTimeout(()=>{
        travel.classList.remove('active');
        const target=document.getElementById(id);
        showOnly(target);
        crumb.textContent=`Viewing: ${target.querySelector('.title').textContent}`;
      },1400);
    }
    function back(){ showOnly(start); crumb.textContent='Choose a destination' }
    function showOnly(el){ screens.forEach(s=>s.classList.remove('active')); el.classList.add('active'); }
    window.addEventListener('keydown',e=>{ if(e.key==='Escape' && !start.classList.contains('active')) back() });
  </script>
</body>
</html>


<html lang="en">
<head>
<meta charset="UTF-8"> 
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reveal Code Modal</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap" rel="stylesheet">
<style>
  :root {
  --bg1: #0f2027;
  --bg2: #203a43;
  --ink: #e5e5e5;
  --muted: #a1a1a1;
  --accent: #8a5cff;
  --accent2: #3fc1c9;
  --shadow: 0 30px 80px rgba(0, 0, 0, 0.65);
}

body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, Helvetica, sans-serif;
  background: linear-gradient(135deg, var(--bg1), var(--bg2));
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.app {
  width: min(1280px, 96vw);
  height: min(900px, 94vh);
  background: #1c1c27;
  border-radius: 24px;
  box-shadow: var(--shadow);
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
  position: relative;
}

header {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #1f1f2a 0%, #252537 100%);
  border-bottom: 1px solid #333;
}

header h1 {
  color: #fff;
}

.crumb {
  color: var(--muted);
}

.btn {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: 0;
  border-radius: 16px;
  padding: 18px 22px;
  font-weight: 700;
  box-shadow: 0 12px 24px rgba(108, 99, 255, 0.25);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 32px rgba(108, 99, 255, 0.4);
}

.desc {
  color: #c0c0d0;
}

.back .btn {
  background: #2e2e3a;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
}
.back .btn:hover {
  background: #444456;
}

  body {
    font-family: 'Poppins', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background: #f4f4f9;
  }

  .reveal-button {
    background: linear-gradient(90deg, #4facfe, #00f2fe); /* Blue gradient */
    border: none;
    color: white;
    padding: 25px 40px;
    font-size: 22px;
    font-weight: 500;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 6px 10px rgba(0,0,0,0.25);
  }

  .reveal-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 12px rgba(0,0,0,0.3);
  }

  /* Modal overlay */
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    justify-content: center;
    align-items: center;
  }

  /* Modal content box */
  .modal-content {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 25px;
    border-radius: 12px;
    width: 80%;
    max-width: 700px;
    font-family: "Courier New", monospace;
    font-size: 18px;
    white-space: pre-wrap;
    position: relative;
  }

  /* Close button */
  .close-btn {
    position: absolute;
    top: 12px;
    right: 15px;
    background: #ff5e5e;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
    line-height: 28px;
    text-align: center;
  }
</style>

</head>
<body>

<button class="reveal-button" onclick="openModal()">Click here to see how we made this</button>

<div class="modal" id="codeModal">
  <div class="modal-content">
    <button class="close-btn" onclick="closeModal()">×</button>
    code will be here:
  </div>
</div>

<script>
  function openModal() {
    document.getElementById('codeModal').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('codeModal').style.display = 'none';
  }

  // Close modal if user clicks outside the content box. 
  window.onclick = function(event) {
    const modal = document.getElementById('codeModal');
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }
</script>

</body>
</html>
