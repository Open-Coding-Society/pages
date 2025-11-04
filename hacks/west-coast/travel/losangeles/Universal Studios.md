---
layout: post
title: "Los Angeles"
description: "Roadtrip through LA and learn UI while you're there!"
permalink: /west-coast/analytics/losangeles/US
parent: "Analytics/Admin"
team: "Cool Collaborators"
submodule: 1
author: "Cool Collaborators"
date: 2025-10-21
---
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Universal Studios — Roadtrip</title>
<style>
/* ===== Truck intro (3s) ===== */
body{background:#009688;font-family:'Open Sans',sans-serif;margin:0;padding:0}
.loop-wrapper{margin:0 auto;position:relative;display:block;width:600px;height:250px;overflow:hidden;border-bottom:3px solid #fff;color:#fff}
.mountain{position:absolute;right:-900px;bottom:-20px;width:2px;height:2px;box-shadow:0 0 0 50px #4DB6AC,60px 50px 0 70px #4DB6AC,90px 90px 0 50px #4DB6AC,250px 250px 0 50px #4DB6AC,290px 320px 0 50px #4DB6AC,320px 400px 0 50px #4DB6AC;transform:rotate(130deg);animation:mtn 10s linear infinite}
.hill{position:absolute;right:-900px;bottom:-50px;width:400px;border-radius:50%;height:20px;box-shadow:0 0 0 50px #4DB6AC,-20px 0 0 20px #4DB6AC,-90px 0 0 50px #4DB6AC,250px 0 0 50px #4DB6AC,290px 0 0 50px #4DB6AC,620px 0 0 50px #4DB6AC;animation:hill 3s linear infinite}
.tree,.tree:nth-child(2),.tree:nth-child(3){position:absolute;height:100px;width:35px;bottom:0;background:url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/tree.svg) no-repeat}
.rock{margin-top:-17%;height:2%;width:2%;bottom:-2px;border-radius:20px;position:absolute;background:#ddd}
.truck,.wheels{transition:all ease;width:85px;margin-right:-60px;bottom:0px;right:50%;position:absolute;background:#eee}
.truck{background:url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/truck.svg) no-repeat;background-size:contain;height:60px}
.truck:before{content:" ";position:absolute;width:25px;box-shadow:-30px 28px 0 1.5px #fff,-35px 18px 0 1.5px #fff}
.wheels{background:url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/wheels.svg) no-repeat;height:15px;margin-bottom:0}
.tree{animation:tree 1.5s 0s linear infinite}
.tree:nth-child(2){animation:tree2 1s .15s linear infinite}
.tree:nth-child(3){animation:tree3 4s .05s linear infinite}
.rock{animation:rock 2s -.53s linear infinite}
.truck{animation:truck 3s .08s ease infinite}
.wheels{animation:truck 3s .001s ease infinite}
.truck:before{animation:wind 1s 0s ease infinite}
@keyframes tree{0%{transform:translate(1350px)}100%{transform:translate(-50px)}}
@keyframes tree2{0%{transform:translate(650px)}100%{transform:translate(-50px)}}
@keyframes tree3{0%{transform:translate(2750px)}100%{transform:translate(-50px)}}
@keyframes rock{0%{right:-200px}100%{right:2000px}}
@keyframes truck{0%{}6%{transform:translateY(0)}7%{transform:translateY(-6px)}9%{transform:translateY(0)}10%{transform:translateY(-1px)}11%{transform:translateY(0)}100%{}}
@keyframes wind{0%{}50%{transform:translateY(3px)}100%{}}
@keyframes mtn{100%{transform:translateX(-2000px) rotate(130deg)}}
@keyframes hill{100%{transform:translateX(-2000px)}}
.intro{position:fixed;inset:0;display:grid;place-items:center;background:#009688;z-index:10}
.intro p{color:#fff;font-weight:800;margin-top:18px;text-shadow:0 2px 12px rgba(0,0,0,.35)}
/* ===== Scene: Universal Studios ===== */
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Universal Studios Hollywood</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Arial',sans-serif;overflow-x:hidden;background:#1a1a2e}
.scene{
  position:relative;width:100%;min-height:100vh;
  background:linear-gradient(to bottom,#87ceeb 0%,#b0d8f0 40%,#e8b4b8 70%,#ffcccb 100%);
  overflow:hidden;
}

/* Sun */
.sun{position:absolute;top:10%;right:15%;width:120px;height:120px;
  background:radial-gradient(circle at 35% 35%,#fff9e6,#ffeb3b,#ff9800);
  border-radius:50%;box-shadow:0 0 100px rgba(255,235,59,.9);animation:sunPulse 4s ease-in-out infinite}
@keyframes sunPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}

/* Clouds */
.cloud{position:absolute;background:#fff;border-radius:100px;opacity:.9}
.cloud::before,.cloud::after{content:'';position:absolute;background:#fff;border-radius:50%}
.cloud1{width:120px;height:40px;top:15%;left:10%;animation:cloudFloat 40s linear infinite}
.cloud1::before{width:60px;height:60px;top:-30px;left:20px}
.cloud1::after{width:80px;height:80px;top:-40px;right:20px}
.cloud2{width:100px;height:35px;top:25%;left:50%;animation:cloudFloat 35s linear infinite;animation-delay:-10s}
.cloud2::before{width:50px;height:50px;top:-25px;left:15px}
.cloud2::after{width:70px;height:70px;top:-35px;right:15px}
.cloud3{width:90px;height:30px;top:10%;left:70%;animation:cloudFloat 45s linear infinite;animation-delay:-20s}
.cloud3::before{width:45px;height:45px;top:-22px;left:12px}
.cloud3::after{width:60px;height:60px;top:-30px;right:12px}
@keyframes cloudFloat{0%{transform:translateX(-150px)}100%{transform:translateX(calc(100vw + 150px))}}

/* Mountains/Buildings */
.mountains{
  position:absolute;bottom:35%;left:0;width:100%;height:40%;
  background:linear-gradient(to bottom,#8b7d6b,#6b5d4f);
  clip-path:polygon(0 100%,0 80%,8% 70%,15% 85%,22% 60%,30% 75%,40% 55%,48% 70%,58% 50%,65% 65%,75% 45%,82% 60%,90% 55%,95% 70%,100% 65%,100% 100%);
  box-shadow:inset 0 20px 40px rgba(0,0,0,.2);
}

/* Ground + Plaza */
.ground{position:absolute;bottom:0;left:0;width:100%;height:35%;background:linear-gradient(to bottom,#8fbc8f,#6b8e6b,#556b55);box-shadow:inset 0 15px 30px rgba(0,0,0,.2)}
.plaza{
  position:absolute;bottom:30%;left:0;width:100%;height:60px;
  background:repeating-linear-gradient(90deg,#d4c4b0 0px,#d4c4b0 80px,#c9b89d 80px,#c9b89d 160px);
  box-shadow:0 5px 20px rgba(0,0,0,.15)
}

/* Universal Globe */
.globe-container{position:absolute;bottom:40%;left:50%;transform:translateX(-50%);animation:globeFloat 6s ease-in-out infinite;z-index:5}
.globe{
  position:relative;width:180px;height:180px;border-radius:50%;
  background:radial-gradient(circle at 35% 35%,#64b5f6,#2196f3,#1565c0);
  box-shadow:inset -25px -25px 50px rgba(0,0,0,.4),inset 25px 25px 50px rgba(255,255,255,.15),0 20px 60px rgba(0,0,0,.5)
}
.globe::before{content:'';position:absolute;top:25px;left:35px;width:70px;height:70px;background:rgba(255,255,255,.2);border-radius:50%;filter:blur(15px)}
.latitude{position:absolute;left:0;right:0;height:2px;background:rgba(255,255,255,.25)}
.lat1{top:25%}.lat2{top:50%}.lat3{top:75%}
.longitude{position:absolute;top:0;bottom:0;width:2px;background:rgba(255,255,255,.25)}
.lon1{left:25%}.lon2{left:50%}.lon3{left:75%}
.globe-ring{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:220px;height:220px;border:4px solid rgba(255,255,255,.4);border-radius:50%}
.universal-text{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  font-size:36px;font-weight:900;color:#fff;
  text-shadow:3px 3px 6px rgba(0,0,0,.6),0 0 20px rgba(255,255,255,.4);letter-spacing:3px
}
@keyframes globeFloat{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-15px)}}

/* === DROP TOWER RIDE (replaces ferris wheel) === */
.drop-tower{
  position:absolute;
  right:10%;
  bottom:31%;              /* sit on plaza */
  width:140px;
  height:260px;
  z-index:4;
  pointer-events:none;
}

/* base platform */
.dt-base{
  position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);
  width:160px;height:18px;border-radius:6px;
  background:linear-gradient(to bottom,#666,#333);
  box-shadow:0 8px 18px rgba(0,0,0,.55);
}

/* shaft */
.dt-shaft{
  position:absolute;bottom:0;left:50%;transform:translateX(-50%);
  width:26px;height:100%;
  background:linear-gradient(180deg,#9aa1a6,#7c858b);
  border:3px solid #5b6368;border-radius:10px;
  box-shadow:inset 0 0 12px rgba(0,0,0,.35),0 8px 20px rgba(0,0,0,.35)
}

/* side guide rails */
.dt-rail{position:absolute;bottom:0;width:6px;height:100%;background:linear-gradient(#bbb,#888);border-radius:6px}
.dt-rail.left{left:18px}
.dt-rail.right{right:18px}

/* tower lights */
.dt-light{
  position:absolute;left:50%;transform:translateX(-50%);
  width:8px;height:8px;border-radius:50%;
  background:#ffd54f;box-shadow:0 0 10px #ffd54f,0 0 18px rgba(255,213,79,.7)
}
.dt-light.l1{top:12%}.dt-light.l2{top:28%}.dt-light.l3{top:44%}.dt-light.l4{top:60%}.dt-light.l5{top:76%}

/* car + harness */
.dt-car{
  position:absolute;left:50%;bottom:0;transform:translate(-50%,0);
  width:110px;height:44px;border-radius:10px;
  background:linear-gradient(180deg,#ff7043,#c0392b);
  border:3px solid #9b2c22;box-shadow:0 10px 22px rgba(0,0,0,.55);
  display:flex;align-items:flex-end;justify-content:space-around;padding:0 8px 6px;
  animation:dropCycle 7.5s ease-in-out infinite;
  will-change:transform
}

.seat{width:16px;height:18px;background:#263238;border-radius:3px 3px 2px 2px}
.harness{
  position:absolute;top:-10px;left:50%;transform:translateX(-50%);
  width:92%;height:12px;border-radius:12px;
  background:linear-gradient(180deg,#222,#111);border:2px solid #333
}

/* thin cables */
.dt-cable{
  position:absolute;top:0;left:50%;transform:translateX(-50%);
  width:1.5px;height:100%;background:rgba(30,30,30,.8)
}
.dt-cable.c1{transform:translateX(-28px)}
.dt-cable.c2{transform:translateX(0)}
.dt-cable.c3{transform:translateX(28px)}

/* car windows */
.car-window{position:absolute;top:10px;left:10px;width:22px;height:10px;background:rgba(135,206,235,.7);border-radius:3px;box-shadow:26px 0 0 rgba(135,206,235,.7),52px 0 0 rgba(135,206,235,.7)}

/* ride motion: rise, brief hold, fast drop, bounce, settle */
@keyframes dropCycle{
  0%   { transform:translate(-50%,0) }
  35%  { transform:translate(-50%,-170px) }  /* lift */
  45%  { transform:translate(-50%,-180px) }  /* tiny overshoot */
  55%  { transform:translate(-50%,-180px) }  /* hold */
  66%  { transform:translate(-50%,0); animation-timing-function:cubic-bezier(.1,.9,.2,1) } /* drop */
  74%  { transform:translate(-50%,-22px) }   /* bounce up */
  82%  { transform:translate(-50%,0) }       /* settle */
  100% { transform:translate(-50%,0) }
}

/* ROLLER COASTER (unchanged) */
.coaster-area{position:absolute;bottom:38%;left:5%;width:350px;height:160px;z-index:2}
.track-support{position:absolute;bottom:0;width:5px;background:linear-gradient(to bottom,#666,#333);box-shadow:2px 0 5px rgba(0,0,0,.4)}
.support-1{left:12%;height:35px}.support-2{left:25%;height:70px}.support-3{left:38%;height:50px}.support-4{left:51%;height:95px}.support-5{left:64%;height:60px}.support-6{left:77%;height:110px}.support-7{left:90%;height:45px}
.track-curve{position:absolute;border:5px solid #444;box-shadow:0 4px 10px rgba(0,0,0,.5)}
.curve-1{bottom:0;left:0;width:120px;height:70px;border-left:none;border-bottom:none;border-top-right-radius:100%}
.curve-2{bottom:0;left:110px;width:110px;height:100px;border-right:none;border-bottom:none;border-top-left-radius:100%}
.curve-3{bottom:0;left:210px;width:90px;height:60px;border-left:none;border-bottom:none;border-top-right-radius:100%}
.curve-4{bottom:0;right:0;width:100px;height:115px;border-right:none;border-bottom:none;border-top-left-radius:100%}
.coaster-train{position:absolute;width:50px;height:32px;background:linear-gradient(135deg,#f39c12 0%,#e67e22 100%);border-radius:10px 10px 5px 5px;box-shadow:0 6px 18px rgba(0,0,0,.6);animation:coasterRide 9s ease-in-out infinite}
.train-windows{position:absolute;top:8px;left:8px;width:14px;height:10px;background:rgba(52,152,219,.7);border-radius:3px;box-shadow:18px 0 0 rgba(52,152,219,.7)}
.train-wheels{position:absolute;bottom:-12px;left:10px;width:12px;height:12px;background:#222;border-radius:50%;border:2px solid #444;box-shadow:25px 0 0 #222,25px 0 0 0 2px #444}
@keyframes coasterRide{
  0%{left:-60px;bottom:0;transform:rotate(0)}
  12%{left:11%;bottom:58px;transform:rotate(-18deg)}
  25%{left:24%;bottom:18px;transform:rotate(12deg)}
  37%{left:36%;bottom:88px;transform:rotate(-22deg)}
  50%{left:50%;bottom:28px;transform:rotate(15deg)}
  62%{left:64%;bottom:105px;transform:rotate(-20deg)}
  75%{left:78%;bottom:15px;transform:rotate(10deg)}
  88%{left:92%;bottom:5px;transform:rotate(5deg)}
  100%{left:110%;bottom:0;transform:rotate(0)}
}

/* FOOD STANDS */
.stand{position:absolute;bottom:31%;width:60px;z-index:4}
.popcorn{right:25%}.hotdog{right:42%}.icecream{left:22%}.pretzel{left:38%}.soda{left:54%}
.stand-canopy{width:80px;height:18px;border-radius:50% 50% 0 0;position:relative;left:-10px;box-shadow:0 5px 12px rgba(0,0,0,.4)}
.stand-canopy::before{content:'';position:absolute;top:-5px;left:50%;transform:translateX(-50%);width:6px;height:25px;background:#7f8c8d;border-radius:3px}
.stand-canopy::after{content:'';position:absolute;bottom:0;left:0;right:0;height:4px;background:rgba(255,255,255,.3)}
.popcorn .stand-canopy{background:linear-gradient(to bottom,#e74c3c,#c0392b)}
.hotdog .stand-canopy{background:linear-gradient(to bottom,#f39c12,#d68910)}
.icecream .stand-canopy{background:linear-gradient(to bottom,#ff69b4,#ff1493)}
.pretzel .stand-canopy{background:linear-gradient(to bottom,#8e44ad,#71368a)}
.soda .stand-canopy{background:linear-gradient(to bottom,#3498db,#2980b9)}
.stand-counter{width:60px;height:55px;background:linear-gradient(to bottom,#d4a574,#c49563);border-radius:8px;margin-top:12px;box-shadow:0 5px 12px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:32px}

/* PEOPLE */
.visitor{position:absolute;bottom:30%;width:18px;height:44px;z-index:6}
.visitor-head{width:16px;height:16px;background:#f4d03f;border-radius:50%;margin:0 auto 2px;box-shadow:0 2px 4px rgba(0,0,0,.3)}
.visitor-body{width:18px;height:22px;border-radius:8px 8px 0 0;box-shadow:0 3px 6px rgba(0,0,0,.3)}
.visitor-legs{position:relative;width:18px;height:18px}
.visitor-leg{position:absolute;bottom:0;width:7px;height:18px;background:#34495e;border-radius:4px}
.leg-l{left:2px;animation:stepLeft .6s ease-in-out infinite}
.leg-r{right:2px;animation:stepRight .6s ease-in-out infinite}
@keyframes stepLeft{0%,100%{transform:rotate(0)}50%{transform:rotate(-35deg)}}
@keyframes stepRight{0%,100%{transform:rotate(0)}50%{transform:rotate(35deg)}}
.v1{animation:moveRight 14s linear infinite}.v1 .visitor-body{background:#e74c3c}
.v2{animation:moveLeft 16s linear infinite;animation-delay:4s}.v2 .visitor-body{background:#3498db}
.v3{animation:moveRight 15s linear infinite;animation-delay:8s}.v3 .visitor-body{background:#2ecc71}
.v4{animation:moveLeft 17s linear infinite;animation-delay:2s}.v4 .visitor-body{background:#9b59b6}
.v5{animation:moveRight 13s linear infinite;animation-delay:10s}.v5 .visitor-body{background:#f39c12}
.v6{animation:moveLeft 18s linear infinite;animation-delay:6s}.v6 .visitor-body{background:#1abc9c}
.v7{animation:moveRight 16s linear infinite;animation-delay:12s}.v7 .visitor-body{background:#e67e22}
@keyframes moveRight{0%{left:-60px}100%{left:calc(100% + 60px)}}
@keyframes moveLeft{0%{left:calc(100% + 60px)}100%{left:-60px}}

/* Title + Marquee */
.title{position:absolute;top:25px;left:50%;transform:translateX(-50%);text-align:center;z-index:100}
.title h1{font-size:52px;font-weight:900;color:#fff;text-shadow:4px 4px 10px rgba(0,0,0,.8),0 0 40px rgba(255,255,255,.6);letter-spacing:5px;margin-bottom:8px}
.title p{font-size:22px;color:#ffd700;text-shadow:3px 3px 6px rgba(0,0,0,.8);letter-spacing:3px;font-weight:bold}
.marquee{position:absolute;bottom:8px;left:0;width:100%;background:rgba(0,0,0,.85);padding:14px 0;overflow:hidden;z-index:100}
.marquee-text{display:inline-block;white-space:nowrap;animation:scroll 30s linear infinite;color:#ffd700;font-size:17px;font-weight:bold;letter-spacing:2px}
@keyframes scroll{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
#universalContainer.show {
  opacity: 1 !important;
  visibility: visible !important;
}

.demo-container {
  background: #f5f5f5;
  padding: 30px;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
}

.button-container {
  text-align: center;
  margin-bottom: 20px;
}

.button-container button {
  background: #2196f3;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(33,150,243,.3);
  transition: all 0.3s ease;
}

.button-container button:hover {
  background: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33,150,243,.4);
}

#universalContainer {
  background: transparent;
  padding: 20px;
  text-align: center;
}
</style>
</head>
<body>
<div class="scene">
  <div class="sun"></div>
  <div class="cloud cloud1"></div>
  <div class="cloud cloud2"></div>
  <div class="cloud cloud3"></div>

  <div class="title">
    <h1>UNIVERSAL STUDIOS</h1>
    <p>HOLLYWOOD</p>
  </div>

  <div class="mountains"></div>
  <div class="ground"></div>
  <div class="plaza"></div>

  <div class="globe-container">
    <div class="globe">
      <div class="latitude lat1"></div>
      <div class="latitude lat2"></div>
      <div class="latitude lat3"></div>
      <div class="longitude lon1"></div>
      <div class="longitude lon2"></div>
      <div class="longitude lon3"></div>
      <div class="universal-text">UNIVERSAL</div>
    </div>
    <div class="globe-ring"></div>
  </div>

  <!-- === DROP TOWER (new) === -->
  <div class="drop-tower">
    <div class="dt-base"></div>
    <div class="dt-rail left"></div>
    <div class="dt-rail right"></div>
    <div class="dt-shaft">
      <div class="dt-light l1"></div>
      <div class="dt-light l2"></div>
      <div class="dt-light l3"></div>
      <div class="dt-light l4"></div>
      <div class="dt-light l5"></div>
      <div class="dt-cable c1"></div>
      <div class="dt-cable c2"></div>
      <div class="dt-cable c3"></div>
      <div class="dt-car">
        <div class="harness"></div>
        <div class="car-window"></div>
        <div class="seat"></div><div class="seat"></div><div class="seat"></div><div class="seat"></div>
      </div>
    </div>
  </div>
  <!-- === END DROP TOWER === -->

  <!-- ROLLER COASTER -->
  <div class="coaster-area">
    <div class="track-support support-1"></div>
    <div class="track-support support-2"></div>
    <div class="track-support support-3"></div>
    <div class="track-support support-4"></div>
    <div class="track-support support-5"></div>
    <div class="track-support support-6"></div>
    <div class="track-support support-7"></div>
    <div class="track-curve curve-1"></div>
    <div class="track-curve curve-2"></div>
    <div class="track-curve curve-3"></div>
    <div class="track-curve curve-4"></div>
    <div class="coaster-train">
      <div class="train-windows"></div>
      <div class="train-wheels"></div>
    </div>
  </div>

  <!-- FOOD STANDS -->
  <div class="stand popcorn"><div class="stand-canopy"></div><div class="stand-counter">🍿</div></div>
  <div class="stand hotdog"><div class="stand-canopy"></div><div class="stand-counter">🌭</div></div>
  <div class="stand icecream"><div class="stand-canopy"></div><div class="stand-counter">🍦</div></div>
  <div class="stand pretzel"><div class="stand-canopy"></div><div class="stand-counter">🥨</div></div>
  <div class="stand soda"><div class="stand-canopy"></div><div class="stand-counter">🥤</div></div>

  <!-- VISITORS -->
  <div class="visitor v1"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v2"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v3"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v4"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v5"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v6"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v7"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>

  <div class="marquee">
    <div class="marquee-text">
      🎬 WELCOME TO UNIVERSAL STUDIOS HOLLYWOOD • FEATURING: WIZARDING WORLD OF HARRY POTTER • JURASSIC WORLD • TRANSFORMERS • THE MUMMY • SUPER
    </div>
  </div>
</div>
</body>
<!-- Truck intro -->
<div class="intro" id="intro">
<div class="loop-wrapper" role="img" aria-label="Driving up to Universal Studios">
<div class="mountain"></div>
<div class="hill"></div>
<div class="tree"></div><div class="tree"></div><div class="tree"></div>
<div class="rock"></div>
<div class="truck"></div>
<div class="wheels"></div>
</div>
<p>Heading to Universal Studios Hollywood…</p>
</div>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Universal Studios Button Lesson</title>
<style>
body {
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
  font-family: 'Arial', sans-serif;
  color: #fff;
  margin: 0;
  padding: 40px 20px;
}

.lesson-content {
  max-width: 800px;
  margin: 0 auto;
}

.container {
  background: rgba(255, 255, 255, 0.05);
  padding: 40px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

h1 {
  font-size: 48px;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #00d4ff, #7b2ff7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-size: 32px;
  color: #00d4ff;
  margin-top: 40px;
  margin-bottom: 20px;
}

h3 {
  font-size: 24px;
  color: #ffd700;
  margin-top: 30px;
  margin-bottom: 15px;
}

p {
  font-size: 18px;
  line-height: 1.6;
  color: #e0e0e0;
  margin-bottom: 15px;
}

.highlight {
  background: rgba(255, 215, 0, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  color: #ffd700;
  font-weight: bold;
}

.tip-box {
  background: rgba(33, 150, 243, 0.1);
  border-left: 4px solid #2196f3;
  padding: 20px;
  margin: 25px 0;
  border-radius: 8px;
}

.tip-box strong {
  color: #2196f3;
  display: block;
  margin-bottom: 10px;
  font-size: 20px;
}

/* Demo Section */
.example-section {
  margin: 50px 0;
  text-align: center;
}

.demo-container {
  background: #f5f5f5;
  padding: 50px 30px;
  border-radius: 16px;
  margin: 30px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.button-container button {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.button-container button:hover {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.6);
}

.button-container button:active {
  transform: translateY(-1px);
}

#universalContainer {
  background: transparent;
  padding: 20px;
  text-align: center;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#universalContainer.show {
  opacity: 1 !important;
  visibility: visible !important;
}

/* Universal Globe */
.globe-container {
  position: relative;
  display: inline-block;
  animation: globeFloat 3s ease-in-out infinite;
}

.globe {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #64b5f6, #2196f3, #1565c0);
  box-shadow: inset -25px -25px 50px rgba(0, 0, 0, 0.4),
              inset 25px 25px 50px rgba(255, 255, 255, 0.15),
              0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.globe::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 40px;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  filter: blur(20px);
}

.universal-text {
  font-size: 32px;
  font-weight: 900;
  color: #fff;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.6);
  letter-spacing: 2px;
  z-index: 10;
}

@keyframes globeFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.states-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.state-card {
  background: rgba(255, 255, 255, 0.08);
  padding: 20px;
  border-radius: 12px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;
}

.state-card:hover {
  transform: translateY(-5px);
  border-color: #ffd700;
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.2);
}

.state-card h4 {
  color: #ffd700;
  margin-bottom: 10px;
  font-size: 20px;
}

.emoji {
  font-size: 40px;
  display: block;
  margin-bottom: 10px;
}
</style>
</head>
<body>
<div class="lesson-content">
<div class="container">
<h1>Los Angeles</h1>
<h2>Learn Buttons at Universal Studios!</h2>

<p>Welcome to LA! Today we're learning about buttons—the clickable elements that make websites interactive. And what better way to learn than with the iconic <span class="highlight">Universal Studios globe</span>?</p>

<div class="example-section">
<h3>Try It Out!</h3>
<p>Click the button below to see the Universal globe appear:</p>

<div class="demo-container">
<div class="button-container">
<button onclick="generateUniversal()">Click for Universal Studios</button>
</div>

<div id="universalContainer" style="opacity: 0; visibility: hidden; transition: opacity 0.5s ease, visibility 0.5s ease;">
<div class="globe-container">
<div class="globe">
<div class="universal-text">UNIVERSAL</div>
</div>
</div>
</div>
</div>
</div>

<h2>What Makes a Great Button?</h2>

<p>Think of the Universal globe—it's <span class="highlight">bold</span>, <span class="highlight">recognizable</span>, and <span class="highlight">inviting</span>. Great buttons work the same way!</p>

<div class="states-grid">
<div class="state-card">
<h4>Default State</h4>
<p>Clear and ready to click</p>
</div>

<div class="state-card">
<h4>Hover State</h4>
<p>Shows it's interactive</p>
</div>

<div class="state-card">
<h4>Clicked State</h4>
<p>Confirms your action</p>
</div>
</div>

<h2>Quick Design Tips</h2>

<div class="tip-box">
<strong>1. Make it Bold</strong>
<p>Like the Universal globe—easy to spot from anywhere. Use size and contrast to make your button stand out.</p>
</div>

<div class="tip-box">
<strong>2. Use Clear Labels</strong>
<p>Say "Buy Tickets" not "Click Here". Say "Enter Park" not "Submit". Be specific about what happens when clicked!</p>
</div>

<div class="tip-box">
<strong>3. Show It's Clickable</strong>
<p>Add rounded corners, shadows, and hover effects. Your button should look inviting and interactive.</p>
</div>

<div class="tip-box">
<strong>4. Create Contrast</strong>
<p>Blue globe against bright sky = maximum visibility. Make your button color pop from the background.</p>
</div>

<div class="tip-box">
<strong>5. Size Matters</strong>
<p>Big enough to tap easily on mobile. Aim for at least 44×44 pixels.</p>
</div>

<h2>Common Mistakes to Avoid</h2>
<p>Vague labels like "Click" or "Submit"<br>
No hover effect<br>
Too many bold buttons competing<br>
Too small to tap on mobile<br>
Unclear what happens when clicked</p>

<h2>Ready to Code?</h2>
<p>Use action verbs like <span class="highlight">"Explore"</span>, <span class="highlight">"Buy"</span>, or <span class="highlight">"Enter"</span>. Keep one primary button per section. And most importantly—make it look clickable!</p>

<p style="margin-top: 40px; text-align: center; font-size: 24px;">Now you're ready to design amazing buttons!</p>
</div>
</div>

<script>
function generateUniversal() {
  var universalContainer = document.getElementById('universalContainer');
  universalContainer.classList.remove('show');
  setTimeout(function() {
    universalContainer.classList.add('show');
  }, 50);
}
</script>
</body>
</html>
<section class="quiz-section">
<h2>🧠 Quick Quiz: Build Your Own Button!</h2>
<p>Fill in the blanks to complete your HTML file. If you get both right, your button will appear!</p>
<form id="button-quiz">
<!-- Question 1 -->
<label for="q1">
      1️⃣ Every HTML file starts with this declaration: <br>
<code>&lt;!________ html&gt;</code>
</label><br>
<input type="text" id="q1" placeholder="Type your answer here"><br><br>
    <!-- Question 2 -->
    <label for="q2">
      2️⃣ Add the missing part to make your button show an alert when clicked: <br>
      <code>&lt;button ________="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code>
    </label><br>
    <input type="text" id="q2" placeholder="Type your answer here"><br><br>
    <button type="button" onclick="checkAnswers()">Check Answers</button>
</form>
<div id="quiz-result"></div>
<div id="button-demo"></div>
</section>
<script>
setTimeout(()=>{
document.getElementById('intro').classList.add('hidden');
document.getElementById('scene').classList.remove('hidden');
document.body.style.background='linear-gradient(#87CEEB,#bfe6ff)';
// Show lesson content after another delay
setTimeout(()=>{
document.getElementById('lessonContent').classList.remove('hidden');
    }, 2000);
}, 3000);
function generateUniversal() {
var universalContainer = document.getElementById('universalContainer');
universalContainer.classList.remove('show');
setTimeout(function() {
universalContainer.classList.add('show');
    }, 50);
}
function checkAnswers() {
const a1 = document.getElementById("q1").value.trim().toLowerCase();
const a2 = document.getElementById("q2").value.trim().toLowerCase();
const result = document.getElementById("quiz-result");
const demo = document.getElementById("button-demo");
demo.innerHTML = "";
let score = 0;
if (a1 === "doctype") score++;
if (a2 === "onclick") score++;
result.textContent = "✅ You got " + score + "/2 correct!";
if (score === 2) {
demo.innerHTML = `
          <p>🎉 Great job! Here's your working button:</p>
          <button onclick="alert('Hello!')">Click Me!</button>
        `;
      }
    }
</script>
</body>
</html>