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
microblog: true
footer: 
    home: /west-coast/travel/
    next: /west-coast/analytics/sandiego/
---
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Los Angeles Roadtrip — Complete Journey</title>
<style>
/* ===== CSS Variables ===== */
:root {
  --intro-bg: #009688;
  --teal-light: #4DB6AC;
  --night-gradient-start: #0f0c29;
  --night-gradient-mid: #302b63;
  --night-gradient-end: #24243e;
  --transition-duration: 4000ms;
}

/* ===== Base Styles ===== */
body {
  background: var(--intro-bg);
  overflow-x: hidden;
  overflow-y: auto;
  font-family: 'Open Sans', sans-serif;
  margin: 0;
}

.hidden {
  display: none;
}

/* ===== Truck Intro Animation (3s + fade out) ===== */
:root{
  --intro-duration: 3s;
}

.intro-section {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--intro-bg);
  z-index: 10;
  /* Fade the entire intro away by the end of the timeline */
  animation: introFade var(--intro-duration) ease-in forwards;
}

/* Keep the caption; it will inherit the fade from the parent */
.intro-section p {
  color: #fff;
  font-weight: 800;
  margin-top: 18px;
  text-shadow: 0 2px 12px rgba(0,0,0,.35);
}

.loop-wrapper {
  margin: 0 auto;
  position: relative;
  display: block;
  width: 600px;
  height: 250px;
  overflow: hidden;
  border-bottom: 3px solid #fff;
  color: #fff;
}

/* Landscape Elements */
.mountain {
  position: absolute;
  right: -900px;
  bottom: -20px;
  width: 2px;
  height: 2px;
  box-shadow:
    0 0 0 50px var(--teal-light),
    60px 50px 0 70px var(--teal-light),
    90px 90px 0 50px var(--teal-light),
    250px 250px 0 50px var(--teal-light),
    290px 320px 0 50px var(--teal-light),
    320px 400px 0 50px var(--teal-light);
  transform: rotate(130deg);
  animation: mtn var(--intro-duration) linear;
}

.hill {
  position: absolute;
  right: -900px;
  bottom: -50px;
  width: 400px;
  border-radius: 50%;
  height: 20px;
  box-shadow:
    0 0 0 50px var(--teal-light),
    -20px 0 0 20px var(--teal-light),
    -90px 0 0 50px var(--teal-light),
    250px 0 0 50px var(--teal-light),
    290px 0 0 50px var(--teal-light),
    620px 0 0 50px var(--teal-light);
  animation: hill var(--intro-duration) linear;
}

.tree {
  position: absolute;
  height: 100px;
  width: 35px;
  bottom: 0;
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/tree.svg) no-repeat;
  animation: tree var(--intro-duration) linear;
}
.tree:nth-child(2){ animation: tree2 var(--intro-duration) linear .15s; }
.tree:nth-child(3){ animation: tree3 var(--intro-duration) linear .05s; }

.rock {
  margin-top: -17%;
  height: 2%;
  width: 2%;
  bottom: -2px;
  border-radius: 20px;
  position: absolute;
  background: #ddd;
  animation: rock var(--intro-duration) linear;
}

/* Vehicle */
.truck,
.wheels {
  transition: all ease;
  width: 85px;
  margin-right: -60px;
  bottom: 0;
  right: 50%;
  position: absolute;
  background: #eee;
}

.truck {
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/truck.svg) no-repeat;
  background-size: contain;
  height: 60px;
  animation: truck var(--intro-duration) ease .08s;
}

.truck::before {
  content: " ";
  position: absolute;
  width: 25px;
  box-shadow:
    -30px 28px 0 1.5px #fff,
    -35px 18px 0 1.5px #fff;
  /* 2 quick gusts within the 3s window */
  animation: wind 1s ease 2;
}

.wheels {
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/wheels.svg) no-repeat;
  height: 15px;
  margin-bottom: 0;
  animation: truck var(--intro-duration) ease .001s;
}

/* ===== Keyframes ===== */
@keyframes tree   { 0% { transform: translate(1350px); } 100% { transform: translate(-50px); } }
@keyframes tree2  { 0% { transform: translate(650px);  } 100% { transform: translate(-50px); } }
@keyframes tree3  { 0% { transform: translate(2750px); } 100% { transform: translate(-50px); } }
@keyframes rock   { 0% { right: -200px; } 100% { right: 2000px; } }

@keyframes truck {
  0%,100% { transform: translateY(0); }
  6%  { transform: translateY(0); }
  7%  { transform: translateY(-6px); }
  9%  { transform: translateY(0); }
  10% { transform: translateY(-1px); }
  11% { transform: translateY(0); }
}

@keyframes wind { 0%,100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
@keyframes mtn  { 100% { transform: translateX(-2000px) rotate(130deg); } }
@keyframes hill { 100% { transform: translateX(-2000px); } }

/* Fade the entire intro out and make it non-interactive afterward */
@keyframes introFade {
  0%, 80% { opacity: 1; }
  100% { opacity: 0; pointer-events: none; visibility: hidden; }
}

/* ===== GRIFFITH OBSERVATORY SCENE ===== */
.griffith-scene {
  position: relative;
  min-height: 100vh;
  padding-bottom: 220px;
  background: linear-gradient(
    var(--night-gradient-start),
    var(--night-gradient-mid) 55%,
    var(--night-gradient-end)
  );
}

/* Stars */
.twinkle {
  width: 3px;
  height: 3px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 8px #fff;
  position: absolute;
  animation: twinkle 2s ease-in-out infinite;
}

.twinkle.t2 {
  animation-delay: 0.4s;
  top: 18%;
}

.twinkle.t3 {
  animation-delay: 0.8s;
  top: 28%;
}

.twinkle.t4 {
  animation-delay: 1.2s;
  top: 46%;
}

/* Comets */
.comet {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px #fff;
  top: 20%;
  left: -100px;
  position: absolute;
  animation: comet 7s linear infinite;
}

.comet::after {
  content: "";
  position: absolute;
  width: 90px;
  height: 2px;
  right: 8px;
  top: 3px;
  background: linear-gradient(to right, #fff, transparent);
}

.comet.c2 {
  top: 40%;
  animation-delay: 1.6s;
}

.comet.c3 {
  top: 60%;
  animation-delay: 3.2s;
}

/* Planets */
.planet {
  border-radius: 50%;
  position: absolute;
  animation: spin-planet 22s linear infinite;
}

.planet.mars {
  width: 56px;
  height: 56px;
  background: radial-gradient(circle at 30% 30%, #ff6b4a, #cd5c3a);
  top: 14%;
  left: 10%;
  box-shadow: 0 0 26px rgba(255, 107, 74, 0.55);
}

.planet.jupiter {
  width: 78px;
  height: 78px;
  background: radial-gradient(circle at 30% 30%, #ffa726, #ff8a50);
  top: 48%;
  right: 10%;
  box-shadow: 0 0 34px rgba(255, 167, 38, 0.55);
  animation-duration: 26s;
}

.moon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #fff5e1, #ffe4b5);
  border-radius: 50%;
  position: absolute;
  top: 24%;
  right: 14%;
  box-shadow: 0 0 36px rgba(255, 245, 225, 0.8);
  animation: float 7.5s ease-in-out infinite;
}

/* Layers: skyline and hills */
.layer {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
}

.skyline {
  bottom: 56px;
  height: 110px;
  background:
    linear-gradient(transparent 35%, rgba(255,255,255,0.06)),
    repeating-linear-gradient(90deg, rgba(0,0,0,0.0) 0 48px, rgba(0,0,0,0.0) 48px 56px),
    linear-gradient(#13192c, #0e1426);
  mask:
    radial-gradient(120px 40px at 12% 70%, #000 98%, transparent 100%),
    radial-gradient(80px 30px at 28% 72%, #000 98%, transparent 100%),
    radial-gradient(100px 34px at 46% 75%, #000 98%, transparent 100%),
    radial-gradient(140px 40px at 62% 72%, #000 98%, transparent 100%),
    radial-gradient(120px 36px at 78% 70%, #000 98%, transparent 100%),
    radial-gradient(90px 30px at 90% 73%, #000 98%, transparent 100%);
  animation: skyline-parallax 20s linear infinite;
  opacity: 0.75;
}

.haze {
  bottom: 84px;
  height: 90px;
  background: radial-gradient(60% 100% at 50% 100%, rgba(180,180,220,0.15), transparent 70%);
  filter: blur(2px);
  animation: haze-drift 14s ease-in-out infinite;
}

@keyframes skyline-parallax {
  0% { transform: translateX(0); }
  100% { transform: translateX(-60px); }
}

@keyframes haze-drift {
  0%, 100% { transform: translateX(0); opacity: 0.35; }
  50% { transform: translateX(10px); opacity: 0.5; }
}

/* Observatory Complex */
.observatory {
  position: absolute;
  bottom: 84px;
  left: 50%;
  transform: translateX(-50%);
  width: 480px;
  height: 200px;
  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  align-items: end;
  gap: 10px;
}

/* Wings and colonnade */
.wing {
  position: relative;
  height: 120px;
  background: linear-gradient(#d8d8d8, #bdbdbd);
  border: 4px solid #8e8e8e;
  border-radius: 6px;
}

.colonnade {
  position: relative;
  height: 120px;
  background: linear-gradient(#e2e2e2, #cfcfcf);
  border: 4px solid #8e8e8e;
  border-radius: 6px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: end;
  padding: 0 10px 10px;
  box-shadow: inset 0 -6px 0 rgba(0,0,0,0.06);
}

.pillar {
  height: 70px;
  background: linear-gradient(#f0f0f0, #d8d8d8);
  border: 2px solid #9a9a9a;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
  animation: subtle-pulse 6s ease-in-out infinite;
}

@keyframes subtle-pulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.05); }
}

/* Domes */
.dome {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 110px;
  top: -100px;
  background: radial-gradient(circle at 50% 20%, #f3f3f3, #cfcfcf 70%);
  border: 4px solid #8f8f8f;
  border-bottom: none;
  border-radius: 140px 140px 0 0;
  overflow: visible;
  box-shadow: 0 6px 0 rgba(0,0,0,0.08);
  animation: dome-sway 9s ease-in-out infinite;
}

.dome.small {
  width: 100px;
  height: 80px;
  top: -70px;
  animation-duration: 11s;
}

@keyframes dome-sway {
  0%, 100% { transform: translateX(-50%) rotate(0deg); }
  50% { transform: translateX(-50%) rotate(0.4deg); }
}

/* Dome shutters */
.shutter {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 70%;
  background: #888;
  border-radius: 2px;
}

/* Telescope beam */
.beam {
  position: absolute;
  left: 50%;
  top: 30%;
  transform-origin: left center;
  width: 320px;
  height: 4px;
  background: linear-gradient(90deg, rgba(255,255,230,0.65), rgba(255,255,230,0.05));
  filter: blur(0.5px);
  border-radius: 4px;
  animation: beam-sweep 14s ease-in-out infinite;
  mix-blend-mode: screen;
}

.beam.small {
  width: 220px;
  opacity: 0.8;
  animation-duration: 16s;
}

@keyframes beam-sweep {
  0% { transform: translateX(-50%) rotate(-8deg); }
  50% { transform: translateX(-50%) rotate(14deg); }
  100% { transform: translateX(-50%) rotate(-8deg); }
}

/* Roof lights */
.roof-light {
  position: absolute;
  bottom: 110px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 8px;
  background: radial-gradient(60% 100% at 50% 100%, rgba(255,255,200,0.35), transparent 70%);
  filter: blur(1px);
  animation: light-glow 5s ease-in-out infinite;
}

@keyframes light-glow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* Palms (foreground) */
.palms {
  position: absolute;
  bottom: 76px;
  left: 50%;
  width: 520px;
  transform: translateX(-50%);
  height: 80px;
  pointer-events: none;
}

.palm {
  position: absolute;
  bottom: 0;
  width: 6px;
  height: 70px;
  background: #1d2a33;
  border-radius: 3px;
  transform-origin: bottom center;
  animation: palm-sway 7s ease-in-out infinite;
}

.palm:nth-child(1) { left: 10px; animation-delay: -1s; }
.palm:nth-child(2) { left: 80px; animation-delay: -2s; }
.palm:nth-child(3) { right: 60px; animation-delay: -1.6s; }
.palm:nth-child(4) { right: 10px; animation-delay: -2.3s; }

.palm::before,
.palm::after {
  content: "";
  position: absolute;
  bottom: 64px;
  left: 50%;
  width: 80px;
  height: 20px;
  transform: translateX(-50%);
  background:
    radial-gradient(12px 8px at 20% 50%, #2a3e4b 60%, transparent 62%),
    radial-gradient(12px 8px at 40% 50%, #2a3e4b 60%, transparent 62%),
    radial-gradient(12px 8px at 60% 50%, #2a3e4b 60%, transparent 62%),
    radial-gradient(12px 8px at 80% 50%, #2a3e4b 60%, transparent 62%);
}

.palm::after { transform: translateX(-50%) rotate(14deg); }
.palm::before { transform: translateX(-50%) rotate(-14deg); }

@keyframes palm-sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(1.2deg); }
}

/* Caption */
.caption {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 22px;
  color: #e9e9ff;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.35);
  padding: 8px 14px;
  border-radius: 10px;
}

/* ===== Keyframe Animations - Scene ===== */
@keyframes twinkle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(2.2);
    opacity: 1;
  }
}

@keyframes comet {
  to {
    left: 110%;
  }
}

@keyframes spin-planet {
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-18px);
  }
}

/* ===== HOLLYWOOD SIGN SCENE ===== */
.hollywood-scene {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(#8fd0ff 0%, #cfefff 60%, #eaf6ff 100%);
}

.hill-shape {
  position: absolute;
  bottom: 0;
  width: 60%;
  height: 40%;
  background: radial-gradient(circle at 50% 100%, #6fb36a 0%, #518f57 70%);
  left: var(--x);
  border-radius: 50% 50% 0 0;
  filter: brightness(.95);
}

.sign {
  position: absolute;
  bottom: 46%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  filter: drop-shadow(0 6px 10px rgba(0,0,0,.25));
}

.sign .ltr {
  width: 28px;
  height: 68px;
  background: #fff;
  border: 5px solid #eaeaea;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 22px;
  color: #333;
}

/* ===== UNIVERSAL STUDIOS SCENE ===== */
.universal-scene {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #87ceeb 0%, #b0d8f0 40%, #e8b4b8 70%, #ffcccb 100%);
  overflow: hidden;
}

/* Sun */
.sun {
  position: absolute;
  top: 10%;
  right: 15%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle at 35% 35%, #fff9e6, #ffeb3b, #ff9800);
  border-radius: 50%;
  box-shadow: 0 0 100px rgba(255, 235, 59, .9);
  animation: sunPulse 4s ease-in-out infinite;
}

@keyframes sunPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

/* Clouds */
.cloud {
  position: absolute;
  background: #fff;
  border-radius: 100px;
  opacity: .9;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: #fff;
  border-radius: 50%;
}

.cloud1 {
  width: 120px;
  height: 40px;
  top: 15%;
  left: 10%;
  animation: cloudFloat 40s linear infinite;
}

.cloud1::before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 20px;
}

.cloud1::after {
  width: 80px;
  height: 80px;
  top: -40px;
  right: 20px;
}

.cloud2 {
  width: 100px;
  height: 35px;
  top: 25%;
  left: 50%;
  animation: cloudFloat 35s linear infinite;
  animation-delay: -10s;
}

.cloud2::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.cloud2::after {
  width: 70px;
  height: 70px;
  top: -35px;
  right: 15px;
}

.cloud3 {
  width: 90px;
  height: 30px;
  top: 10%;
  left: 70%;
  animation: cloudFloat 45s linear infinite;
  animation-delay: -20s;
}

.cloud3::before {
  width: 45px;
  height: 45px;
  top: -22px;
  left: 12px;
}

.cloud3::after {
  width: 60px;
  height: 60px;
  top: -30px;
  right: 12px;
}

@keyframes cloudFloat {
  0% { transform: translateX(-150px); }
  100% { transform: translateX(calc(100vw + 150px)); }
}

/* Mountains/Buildings */
.mountains {
  position: absolute;
  bottom: 35%;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to bottom, #8b7d6b, #6b5d4f);
  clip-path: polygon(0 100%, 0 80%, 8% 70%, 15% 85%, 22% 60%, 30% 75%, 40% 55%, 48% 70%, 58% 50%, 65% 65%, 75% 45%, 82% 60%, 90% 55%, 95% 70%, 100% 65%, 100% 100%);
  box-shadow: inset 0 20px 40px rgba(0, 0, 0, .2);
}

/* Ground + Plaza */
.ground {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 35%;
  background: linear-gradient(to bottom, #8fbc8f, #6b8e6b, #556b55);
  box-shadow: inset 0 15px 30px rgba(0, 0, 0, .2);
}

.plaza {
  position: absolute;
  bottom: 30%;
  left: 0;
  width: 100%;
  height: 60px;
  background: repeating-linear-gradient(90deg, #d4c4b0 0px, #d4c4b0 80px, #c9b89d 80px, #c9b89d 160px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, .15);
}

/* Universal Globe */
.globe-container {
  position: absolute;
  bottom: 40%;
  left: 50%;
  transform: translateX(-50%);
  animation: globeFloat 6s ease-in-out infinite;
  z-index: 5;
}

.globe {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #64b5f6, #2196f3, #1565c0);
  box-shadow: inset -25px -25px 50px rgba(0, 0, 0, .4), inset 25px 25px 50px rgba(255, 255, 255, .15), 0 20px 60px rgba(0, 0, 0, .5);
}

.globe::before {
  content: '';
  position: absolute;
  top: 25px;
  left: 35px;
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, .2);
  border-radius: 50%;
  filter: blur(15px);
}

.latitude {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, .25);
}

.lat1 { top: 25%; }
.lat2 { top: 50%; }
.lat3 { top: 75%; }

.longitude {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, .25);
}

.lon1 { left: 25%; }
.lon2 { left: 50%; }
.lon3 { left: 75%; }

.globe-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 220px;
  border: 4px solid rgba(255, 255, 255, .4);
  border-radius: 50%;
}

.universal-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, .6), 0 0 20px rgba(255, 255, 255, .4);
  letter-spacing: 3px;
}

@keyframes globeFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-15px); }
}

/* DROP TOWER RIDE */
.drop-tower {
  position: absolute;
  right: 10%;
  bottom: 31%;
  width: 140px;
  height: 260px;
  z-index: 4;
  pointer-events: none;
}

.dt-base {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 18px;
  border-radius: 6px;
  background: linear-gradient(to bottom, #666, #333);
  box-shadow: 0 8px 18px rgba(0, 0, 0, .55);
}

.dt-shaft {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 100%;
  background: linear-gradient(180deg, #9aa1a6, #7c858b);
  border: 3px solid #5b6368;
  border-radius: 10px;
  box-shadow: inset 0 0 12px rgba(0, 0, 0, .35), 0 8px 20px rgba(0, 0, 0, .35);
}

.dt-rail {
  position: absolute;
  bottom: 0;
  width: 6px;
  height: 100%;
  background: linear-gradient(#bbb, #888);
  border-radius: 6px;
}

.dt-rail.left { left: 18px; }
.dt-rail.right { right: 18px; }

.dt-light {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffd54f;
  box-shadow: 0 0 10px #ffd54f, 0 0 18px rgba(255, 213, 79, .7);
}

.dt-light.l1 { top: 12%; }
.dt-light.l2 { top: 28%; }
.dt-light.l3 { top: 44%; }
.dt-light.l4 { top: 60%; }
.dt-light.l5 { top: 76%; }

.dt-car {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);
  width: 110px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(180deg, #ff7043, #c0392b);
  border: 3px solid #9b2c22;
  box-shadow: 0 10px 22px rgba(0, 0, 0, .55);
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 8px 6px;
  animation: dropCycle 7.5s ease-in-out infinite;
  will-change: transform;
}

.seat {
  width: 16px;
  height: 18px;
  background: #263238;
  border-radius: 3px 3px 2px 2px;
}

.harness {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 92%;
  height: 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, #222, #111);
  border: 2px solid #333;
}

.dt-cable {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1.5px;
  height: 100%;
  background: rgba(30, 30, 30, .8);
}

.dt-cable.c1 { transform: translateX(-28px); }
.dt-cable.c2 { transform: translateX(0); }
.dt-cable.c3 { transform: translateX(28px); }

.car-window {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 22px;
  height: 10px;
  background: rgba(135, 206, 235, .7);
  border-radius: 3px;
  box-shadow: 26px 0 0 rgba(135, 206, 235, .7), 52px 0 0 rgba(135, 206, 235, .7);
}

@keyframes dropCycle {
  0% { transform: translate(-50%, 0); }
  35% { transform: translate(-50%, -170px); }
  45% { transform: translate(-50%, -180px); }
  55% { transform: translate(-50%, -180px); }
  66% { transform: translate(-50%, 0); animation-timing-function: cubic-bezier(.1, .9, .2, 1); }
  74% { transform: translate(-50%, -22px); }
  82% { transform: translate(-50%, 0); }
  100% { transform: translate(-50%, 0); }
}

/* ROLLER COASTER */
.coaster-area {
  position: absolute;
  bottom: 38%;
  left: 5%;
  width: 350px;
  height: 160px;
  z-index: 2;
}

.track-support {
  position: absolute;
  bottom: 0;
  width: 5px;
  background: linear-gradient(to bottom, #666, #333);
  box-shadow: 2px 0 5px rgba(0, 0, 0, .4);
}

.support-1 { left: 12%; height: 35px; }
.support-2 { left: 25%; height: 70px; }
.support-3 { left: 38%; height: 50px; }
.support-4 { left: 51%; height: 95px; }
.support-5 { left: 64%; height: 60px; }
.support-6 { left: 77%; height: 110px; }
.support-7 { left: 90%; height: 45px; }

.track-curve {
  position: absolute;
  border: 5px solid #444;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .5);
}

.curve-1 {
  bottom: 0;
  left: 0;
  width: 120px;
  height: 70px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 100%;
}

.curve-2 {
  bottom: 0;
  left: 110px;
  width: 110px;
  height: 100px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 100%;
}

.curve-3 {
  bottom: 0;
  left: 210px;
  width: 90px;
  height: 60px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 100%;
}

.curve-4 {
  bottom: 0;
  right: 0;
  width: 100px;
  height: 115px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 100%;
}

.coaster-train {
  position: absolute;
  width: 50px;
  height: 32px;
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  border-radius: 10px 10px 5px 5px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .6);
  animation: coasterRide 9s ease-in-out infinite;
}

.train-windows {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 14px;
  height: 10px;
  background: rgba(52, 152, 219, .7);
  border-radius: 3px;
  box-shadow: 18px 0 0 rgba(52, 152, 219, .7);
}

.train-wheels {
  position: absolute;
  bottom: -12px;
  left: 10px;
  width: 12px;
  height: 12px;
  background: #222;
  border-radius: 50%;
  border: 2px solid #444;
  box-shadow: 25px 0 0 #222, 25px 0 0 0 2px #444;
}

@keyframes coasterRide {
  0% { left: -60px; bottom: 0; transform: rotate(0); }
  12% { left: 11%; bottom: 58px; transform: rotate(-18deg); }
  25% { left: 24%; bottom: 18px; transform: rotate(12deg); }
  37% { left: 36%; bottom: 88px; transform: rotate(-22deg); }
  50% { left: 50%; bottom: 28px; transform: rotate(15deg); }
  62% { left: 64%; bottom: 105px; transform: rotate(-20deg); }
  75% { left: 78%; bottom: 15px; transform: rotate(10deg); }
  88% { left: 92%; bottom: 5px; transform: rotate(5deg); }
  100% { left: 110%; bottom: 0; transform: rotate(0); }
}

/* FOOD STANDS */
.stand {
  position: absolute;
  bottom: 31%;
  width: 60px;
  z-index: 4;
}

.popcorn { right: 25%; }
.hotdog { right: 42%; }
.icecream { left: 22%; }
.pretzel { left: 38%; }
.soda { left: 54%; }

.stand-canopy {
  width: 80px;
  height: 18px;
  border-radius: 50% 50% 0 0;
  position: relative;
  left: -10px;
  box-shadow: 0 5px 12px rgba(0, 0, 0, .4);
}

.stand-canopy::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 25px;
  background: #7f8c8d;
  border-radius: 3px;
}

.stand-canopy::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, .3);
}

.popcorn .stand-canopy { background: linear-gradient(to bottom, #e74c3c, #c0392b); }
.hotdog .stand-canopy { background: linear-gradient(to bottom, #f39c12, #d68910); }
.icecream .stand-canopy { background: linear-gradient(to bottom, #ff69b4, #ff1493); }
.pretzel .stand-canopy { background: linear-gradient(to bottom, #8e44ad, #71368a); }
.soda .stand-canopy { background: linear-gradient(to bottom, #3498db, #2980b9); }

.stand-counter {
  width: 60px;
  height: 55px;
  background: linear-gradient(to bottom, #d4a574, #c49563);
  border-radius: 8px;
  margin-top: 12px;
  box-shadow: 0 5px 12px rgba(0, 0, 0, .3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

/* PEOPLE */
.visitor {
  position: absolute;
  bottom: 30%;
  width: 18px;
  height: 44px;
  z-index: 6;
}

.visitor-head {
  width: 16px;
  height: 16px;
  background: #f4d03f;
  border-radius: 50%;
  margin: 0 auto 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
}

.visitor-body {
  width: 18px;
  height: 22px;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 3px 6px rgba(0, 0, 0, .3);
}

.visitor-legs {
  position: relative;
  width: 18px;
  height: 18px;
}

.visitor-leg {
  position: absolute;
  bottom: 0;
  width: 7px;
  height: 18px;
  background: #34495e;
  border-radius: 4px;
}

.leg-l {
  left: 2px;
  animation: stepLeft .6s ease-in-out infinite;
}

.leg-r {
  right: 2px;
  animation: stepRight .6s ease-in-out infinite;
}

@keyframes stepLeft {
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(-35deg); }
}

@keyframes stepRight {
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(35deg); }
}

.v1 { animation: moveRight 14s linear infinite; }
.v1 .visitor-body { background: #e74c3c; }

.v2 { animation: moveLeft 16s linear infinite; animation-delay: 4s; }
.v2 .visitor-body { background: #3498db; }

.v3 { animation: moveRight 15s linear infinite; animation-delay: 8s; }
.v3 .visitor-body { background: #2ecc71; }

.v4 { animation: moveLeft 17s linear infinite; animation-delay: 2s; }
.v4 .visitor-body { background: #9b59b6; }

.v5 { animation: moveRight 13s linear infinite; animation-delay: 10s; }
.v5 .visitor-body { background: #f39c12; }

.v6 { animation: moveLeft 18s linear infinite; animation-delay: 6s; }
.v6 .visitor-body { background: #1abc9c; }

.v7 { animation: moveRight 16s linear infinite; animation-delay: 12s; }
.v7 .visitor-body { background: #e67e22; }

@keyframes moveRight {
  0% { left: -60px; }
  100% { left: calc(100% + 60px); }
}

@keyframes moveLeft {
  0% { left: calc(100% + 60px); }
  100% { left: -60px; }
}

/* Title + Marquee */
.title {
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 100;
}

.title h1 {
  font-size: 52px;
  font-weight: 900;
  color: #fff;
  text-shadow: 4px 4px 10px rgba(0, 0, 0, .8), 0 0 40px rgba(255, 255, 255, .6);
  letter-spacing: 5px;
  margin-bottom: 8px;
}

.title p {
  font-size: 22px;
  color: #ffd700;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, .8);
  letter-spacing: 3px;
  font-weight: bold;
}

.marquee {
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, .85);
  padding: 14px 0;
  overflow: hidden;
  z-index: 100;
}

.marquee-text {
  display: inline-block;
  white-space: nowrap;
  animation: scroll 30s linear infinite;
  color: #ffd700;
  font-size: 17px;
  font-weight: bold;
  letter-spacing: 2px;
}

@keyframes scroll {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

/* ===== WALK OF FAME SCENE ===== */
.walkoffame-scene {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(#87CEEB, #B0D4E3);
}

.sidewalk {
  position: absolute;
  inset: auto 0 0 0;
  height: 140px;
  background: linear-gradient(#d9c2a1, #af8f73);
  border-top: 4px solid #8b7355;
}

.star {
  width: 68px;
  height: 68px;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  bottom: 38px;
  left: -120px;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, .55));
  position: absolute;
  animation: stars 9s linear infinite;
}

.star.s2 { animation-delay: 2.2s; }
.star.s3 { animation-delay: 4.4s; }
.star.s4 { animation-delay: 6.6s; }

@keyframes stars {
  to { transform: translateX(1300px); }
}

.chinese-theatre {
  position: absolute;
  bottom: 140px;
  left: 8%;
  width: 180px;
  height: 200px;
}

.theatre-roof {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 60px;
  background: linear-gradient(#c41e3a, #8b0000);
  clip-path: polygon(10% 100%, 0% 30%, 50% 0%, 100% 30%, 90% 100%);
}

.theatre-body {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 140px;
  background: linear-gradient(#f4e4c1, #d4c4a1);
  border: 3px solid #a89060;
}

.theatre-pillars {
  position: absolute;
  top: 20px;
  left: 10px;
  right: 10px;
  bottom: 0;
}

.pillar-wof {
  position: absolute;
  width: 18px;
  height: 120px;
  background: #c9b896;
  border: 2px solid #a89060;
  bottom: 0;
}

.pillar-wof:nth-child(1) { left: 0; }
.pillar-wof:nth-child(2) { left: 40%; }
.pillar-wof:nth-child(3) { right: 0; }

.capitol-records {
  position: absolute;
  bottom: 140px;
  right: 12%;
  width: 90px;
  height: 220px;
}

.capitol-base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 180px;
  background: linear-gradient(#f8f8f8, #d4d4d4);
  border-radius: 45px 45px 0 0;
  border: 3px solid #b8b8b8;
}

.capitol-ring {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 12px;
  background: #2c5f8d;
  border-radius: 50%;
}

.capitol-ring:nth-child(1) { top: 30px; }
.capitol-ring:nth-child(2) { top: 70px; }
.capitol-ring:nth-child(3) { top: 110px; }
.capitol-ring:nth-child(4) { top: 150px; }

.capitol-top {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #ff4444, #cc0000);
  border-radius: 50%;
  border: 3px solid #990000;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: .3; }
}

.dolby-theatre {
  position: absolute;
  bottom: 140px;
  left: 35%;
  width: 160px;
  height: 180px;
}

.dolby-body {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 140px;
  background: linear-gradient(#2c3e50, #1a252f);
  border: 3px solid #000;
}

.dolby-marquee {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 50px;
  background: #ffd700;
  border: 4px solid #ffaa00;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 11px;
  color: #000;
  letter-spacing: 1px;
}

.dolby-marquee:before {
  content: "OSCARS";
}

.marquee-lights {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: repeating-linear-gradient(90deg, #fff 0 8px, #ffd700 8px 16px);
  animation: marquee-scroll .6s linear infinite;
}

@keyframes marquee-scroll {
  to { transform: translateX(-16px); }
}

/* ===== Lesson Content ===== */
.lesson-content {
  background: #000;
  color: #fff;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1, h2, h3 {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 10px 0;
}

p {
  color: #fff;
  font-size: 16px;
  margin: 10px 0;
}

pre {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  color: #fff;
  font-size: 14px;
}

code {
  color: #fff;
  font-size: 14px;
}

.example-section {
  margin: 40px 0;
  padding: 30px;
  background: #1a1a1a;
  border-radius: 10px;
}

.demo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: linear-gradient(to bottom, #1a1a2e 0%, #0f3460 50%, #16213e 100%);
  border-radius: 10px;
  position: relative;
  margin-top: 20px;
  overflow: hidden;
}

.button-container {
  margin-bottom: 50px;
  z-index: 10;
}

button {
  background-color: #e74c3c;
  color: white;
  padding: 25px 50px;
  font-size: 24px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  text-transform: uppercase;
}

button:hover {
  background-color: #c0392b;
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

#observatoryContainer {
  opacity: 0;
  transform: scale(0.5) translateY(50px);
  transition: all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
}

#observatoryContainer.show {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.observatory-demo {
  position: relative;
  width: 300px;
  height: 200px;
}

.dome-demo {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 60px;
  background: radial-gradient(circle at 50% 20%, #f3f3f3, #c8c8c8);
  border-radius: 120px 120px 0 0;
  border: 3px solid #8e8e8e;
  border-bottom: none;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  animation: domeAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: 0.3s;
}

.dome-demo::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 30px;
  background: #6e6e6e;
  border-radius: 4px;
}

.telescope {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: #555;
  border-radius: 50%;
  animation: telescopeGlow 2s ease-in-out infinite;
  animation-delay: 1.2s;
}

.building-demo {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 70px;
  background: linear-gradient(to bottom, #e8e8e8 0%, #c4c4c4 100%);
  border: 3px solid #8e8e8e;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  animation: buildingAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: 0.1s;
}

.window {
  position: absolute;
  background: #ffd700;
  border: 2px solid #fff;
  animation: windowGlow 2s ease-in-out infinite;
}

.window1 {
  top: 15px;
  left: 30px;
  width: 25px;
  height: 30px;
  animation-delay: 1.2s;
}

.window2 {
  top: 15px;
  left: 70px;
  width: 25px;
  height: 30px;
  animation-delay: 1.4s;
}

.window3 {
  top: 15px;
  right: 70px;
  width: 25px;
  height: 30px;
  animation-delay: 1.6s;
}

.window4 {
  top: 15px;
  right: 30px;
  width: 25px;
  height: 30px;
  animation-delay: 1.8s;
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.star-demo {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle-demo 3s ease-in-out infinite;
}

.star1 { top: 20%; left: 15%; animation-delay: 0s; }
.star2 { top: 30%; left: 80%; animation-delay: 0.5s; }
.star3 { top: 15%; left: 45%; animation-delay: 1s; }
.star4 { top: 25%; left: 65%; animation-delay: 1.5s; }
.star5 { top: 35%; right: 20%; animation-delay: 2s; }
.star6 { top: 10%; right: 35%; animation-delay: 2.5s; }

@keyframes buildingAppear {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes domeAppear {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes telescopeGlow {
  0%, 100% {
    box-shadow: 0 0 5px #4a9eff;
  }
  50% {
    box-shadow: 0 0 20px #4a9eff, 0 0 40px #4a9eff;
  }
}

@keyframes windowGlow {
  0%, 100% {
    opacity: 0.7;
    box-shadow: 0 0 5px #ffd700;
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 20px #ffd700, 0 0 30px #ffed4e;
  }
}

@keyframes twinkle-demo {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.8);
  }
}

/* ===== Quiz Section Styles ===== */
.quiz-section {
  background: #fff;
  color: #000;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.quiz-section h2 {
  color: #000;
  font-size: 24px;
  margin-bottom: 20px;
}

.quiz-section p {
  color: #000;
  font-size: 16px;
  margin-bottom: 20px;
}

.quiz-section label {
  color: #000;
  font-size: 16px;
  display: block;
  margin-bottom: 10px;
}

.quiz-section code {
  background: #f4f4f4;
  color: #000;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 14px;
}

.quiz-section input[type="text"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  background: #000 !important;
  color: #fff !important;
}

.quiz-section input[type="text"]::placeholder {
  color: #aaa;
}

.quiz-section button {
  margin-top: 10px;
}

.quiz-result {
  color: #000;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
}

.button-demo {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
}

.button-demo p {
  color: #000;
  font-size: 16px;
  margin-bottom: 15px;
}

/* Hollywood Sign Demo Styles */
.demo-container-hollywood {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: linear-gradient(to bottom, #87CEEB 0%, #87CEEB 60%, #d2b48c 60%, #8b7355 100%);
  border-radius: 10px;
  position: relative;
  margin-top: 20px;
}

#signContainer {
  opacity: 0;
  transform: scale(0.5) translateY(50px);
  transition: all 1s ease;
  z-index: 10;
}

#signContainer.show {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.hollywood-sign {
  display: flex;
  gap: 15px;
  perspective: 1000px;
}

.letter {
  font-size: 80px;
  font-weight: 900;
  color: white;
  text-shadow: 
    4px 4px 0 #2c3e50,
    -2px -2px 0 #34495e,
    2px -2px 0 #34495e,
    -2px 2px 0 #34495e,
    0 0 30px rgba(255,255,255,0.6),
    0 0 60px rgba(255,255,255,0.3);
  font-family: 'Arial Black', sans-serif;
  animation: letterPop 0.5s ease backwards;
}

.letter:nth-child(1) { animation-delay: 0.1s; }
.letter:nth-child(2) { animation-delay: 0.2s; }
.letter:nth-child(3) { animation-delay: 0.3s; }
.letter:nth-child(4) { animation-delay: 0.4s; }
.letter:nth-child(5) { animation-delay: 0.5s; }
.letter:nth-child(6) { animation-delay: 0.6s; }
.letter:nth-child(7) { animation-delay: 0.7s; }
.letter:nth-child(8) { animation-delay: 0.8s; }
.letter:nth-child(9) { animation-delay: 0.9s; }

@keyframes letterPop {
  from {
    opacity: 0;
    transform: rotateY(90deg) scale(0.3);
  }
  to {
    opacity: 1;
    transform: rotateY(0deg) scale(1);
  }
}

.hillside {
  position: absolute;
  bottom: 50px;
  width: 100%;
  height: 200px;
  overflow: hidden;
  z-index: 1;
}

.hill-demo {
  position: absolute;
  bottom: 0;
  background: #6b8e23;
  border-radius: 50% 50% 0 0;
}

.hill1 {
  left: 10%;
  width: 300px;
  height: 150px;
}

.hill2 {
  left: 35%;
  width: 350px;
  height: 180px;
}

.hill3 {
  right: 15%;
  width: 320px;
  height: 160px;
}

/* Universal Studios Demo Styles */
.demo-container-universal {
  background: #f5f5f5;
  padding: 30px;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#universalContainer {
  background: transparent;
  padding: 20px;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

#universalContainer.show {
  opacity: 1 !important;
  visibility: visible !important;
}

.globe-container-demo {
  position: relative;
  display: inline-block;
  animation: globeFloat 3s ease-in-out infinite;
}

.globe-demo {
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

.globe-demo::before {
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

.universal-text-demo {
  font-size: 32px;
  font-weight: 900;
  color: #fff;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.6);
  letter-spacing: 2px;
  z-index: 10;
}

/* Walk of Fame Demo Styles */
.demo-container-walk {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 500px;
  background: linear-gradient(to bottom, #87CEEB 0%, #b0d9f5 60%, #d4d4d4 100%);
  border-radius: 10px;
  position: relative;
  margin-top: 20px;
  overflow: hidden;
}

#walkContainer {
  opacity: 0;
  transition: all 1s ease;
  z-index: 5;
  position: absolute;
  bottom: 0;
  width: 100%;
}

#walkContainer.show {
  opacity: 1;
}

.sidewalk-demo {
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 0 30px;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.3);
}

.star-tile {
  position: relative;
  width: 100px;
  height: 120px;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  border: 3px solid #8b7355;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 
    inset 0 1px 3px rgba(255,255,255,0.3),
    inset 0 -1px 3px rgba(0,0,0,0.3),
    0 5px 10px rgba(0,0,0,0.3);
  animation: tileAppear 0.8s ease backwards;
}

.star-tile:nth-child(1) { animation-delay: 0.2s; }
.star-tile:nth-child(2) { animation-delay: 0.4s; }
.star-tile:nth-child(3) { animation-delay: 0.6s; }
.star-tile:nth-child(4) { animation-delay: 0.8s; }

.star-shape {
  font-size: 40px;
  color: #c71585;
  text-shadow: 
    1px 1px 2px rgba(0,0,0,0.3),
    0 0 5px rgba(199,21,133,0.5);
  margin-bottom: 5px;
}

.star-name {
  font-size: 9px;
  font-weight: 900;
  color: #2a2a2a;
  text-align: center;
  font-family: 'Arial', sans-serif;
  letter-spacing: 1px;
  line-height: 1.2;
  padding: 0 5px;
}

.person {
  position: absolute;
  bottom: 200px;
  width: 30px;
  animation: walk 8s linear infinite;
}

.person1 {
  left: -50px;
  animation-delay: 0s;
}

.person2 {
  left: -50px;
  animation-delay: 3s;
}

.person3 {
  left: -50px;
  animation-delay: 6s;
}

.person-body {
  width: 20px;
  height: 35px;
  background: #ff6b6b;
  border-radius: 5px 5px 0 0;
  margin: 0 auto;
}

.person-head {
  width: 15px;
  height: 15px;
  background: #ffcba4;
  border-radius: 50%;
  margin: 0 auto 2px;
}

.person-legs {
  display: flex;
  justify-content: center;
  gap: 3px;
}

.leg {
  width: 6px;
  height: 20px;
  background: #4a4a4a;
  animation: legWalk 0.6s ease-in-out infinite;
}

.leg:nth-child(2) {
  animation-delay: 0.3s;
}

@keyframes walk {
  from {
    left: -50px;
  }
  to {
    left: 100%;
  }
}

@keyframes legWalk {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(20deg);
  }
}

@keyframes tileAppear {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.buildings {
  position: absolute;
  bottom: 200px;
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding: 0 20px;
}

.building {
  background: linear-gradient(to bottom, #6a6a6a 0%, #4a4a4a 100%);
  border-radius: 5px 5px 0 0;
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.building1 {
  width: 60px;
  height: 100px;
}

.building2 {
  width: 50px;
  height: 120px;
}

.building3 {
  width: 70px;
  height: 90px;
}

.building4 {
  width: 55px;
  height: 110px;
}

/* Personalization Banner */
.personalization-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin: 20px auto;
  max-width: 800px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.personalization-banner h3 {
  margin: 0 0 10px;
  font-size: 24px;
  color: #fff;
}

.personalization-banner p {
  margin: 5px 0;
  font-size: 16px;
  color: #e4e4e7;
}

.personalization-banner .destinations-list {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.destination-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

/* ===== Accessibility: Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
</head>
<body>
<!-- Truck intro -->
<div class="intro-section" id="intro">
  <div class="loop-wrapper" role="img" aria-label="Driving through LA">
    <div class="mountain"></div>
    <div class="hill"></div>
    <div class="tree"></div>
    <div class="tree"></div>
    <div class="tree"></div>
    <div class="rock"></div>
    <div class="truck"></div>
    <div class="wheels"></div>
  </div>
  <p>Starting our LA roadtrip adventure…</p>
</div>

<!-- Personalization Banner -->
<div id="personalizationBanner" class="personalization-banner" style="display: none;">
  <h3>🎯 Your Personalized LA Experience</h3>
  <p>Based on your itinerary preferences, here are your selected destinations:</p>
  <div class="destinations-list" id="destinationsList"></div>
</div>

<!-- SECTION 1: GRIFFITH OBSERVATORY -->
<section class="griffith-scene scene-section" id="griffith" data-destination="Griffith Observatory" style="display: none;">
  <div class="twinkle" style="top:12%;left:12%"></div>
  <div class="twinkle t2" style="left:48%"></div>
  <div class="twinkle t3" style="left:72%"></div>
  <div class="twinkle t4" style="left:22%"></div>
  <div class="comet"></div>
  <div class="comet c2"></div>
  <div class="comet c3"></div>
  <div class="planet mars"></div>
  <div class="planet jupiter"></div>
  <div class="moon"></div>

  <div class="layer skyline"></div>
  <div class="layer haze"></div>

  <div class="observatory">
    <div class="wing">
      <div class="dome small">
        <div class="shutter"></div>
        <div class="beam small"></div>
      </div>
    </div>

    <div class="colonnade">
      <div class="pillar"></div>
      <div class="pillar"></div>
      <div class="pillar"></div>
      <div class="pillar"></div>
      <div class="pillar"></div>
      <div class="pillar"></div>
      <div class="pillar"></div>
      <div class="dome">
        <div class="shutter"></div>
        <div class="beam"></div>
      </div>
      <div class="roof-light"></div>
    </div>

    <div class="wing">
      <div class="dome small">
        <div class="shutter"></div>
        <div class="beam small"></div>
      </div>
    </div>
  </div>

  <div class="palms">
    <div class="palm"></div>
    <div class="palm"></div>
    <div class="palm"></div>
    <div class="palm"></div>
  </div>

  <div class="caption">🔭 Griffith Observatory — comets, planets & moonlit LA</div>
</section>

<!-- GRIFFITH LESSON -->
<div class="lesson-content lesson-section" data-destination="Griffith Observatory" style="display: none;">
  <div class="container">
    <h1>Los Angeles</h1>
    <h2>Griffith Observatory Button Lesson</h2>

    <h3>Step 1: Set Up Your HTML File</h3>
    <p>First, create a new file and save it as button.html. Every HTML file needs this basic structure:</p>
    <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My Button&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

    <p>What this means:</p>
    <p>&lt;!DOCTYPE html&gt; tells the browser this is an HTML file</p>
    <p>&lt;html&gt; wraps everything</p>
    <p>&lt;head&gt; contains information about the page</p>
    <p>&lt;body&gt; is where your visible content goes</p>

    <h3>Step 2: Create Your First Button</h3>
    <p>Inside the &lt;body&gt; tags, add a button:</p>
    <pre><code>&lt;body&gt;
    &lt;button&gt;Click Me!&lt;/button&gt;
&lt;/body&gt;</code></pre>

    <h3>Step 3: Make the Button Do Something</h3>
    <p>Add an onclick attribute to make something happen when clicked:</p>
    <pre><code>&lt;button onclick="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code></pre>

    <div class="example-section">
      <h3>Here's an example button!</h3>
      <div class="demo-container">
        <div class="stars">
          <div class="star-demo star1"></div>
          <div class="star-demo star2"></div>
          <div class="star-demo star3"></div>
          <div class="star-demo star4"></div>
          <div class="star-demo star5"></div>
          <div class="star-demo star6"></div>
        </div>

        <div class="button-container">
          <button onclick="generateObservatory()">Click for Griffith Observatory</button>
        </div>

        <div id="observatoryContainer">
          <div class="observatory-demo">
            <div class="building-demo">
              <div class="window window1"></div>
              <div class="window window2"></div>
              <div class="window window3"></div>
              <div class="window window4"></div>
            </div>
            <div class="dome-demo">
              <div class="telescope"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h2>Button Design Tips</h2>

    <h3>What is a Button?</h3>
    <p>A button triggers an action when clicked. Think of Griffith Observatory's telescope controls—clear, responsive, and purposeful. Good buttons work the same way.</p>

    <h3>The 3 Button States</h3>
    <p><strong>Default (Observatory at Rest)</strong> - How it looks normally—waiting to be clicked.</p>
    <p><strong>Hover (Dome Opening)</strong> - When you move your mouse over it—shows it's interactive.</p>
    <p><strong>Clicked (Telescope Activates)</strong> - The moment you click—confirms the action.</p>

    <h3>5 Design Tips</h3>
    
    <p><strong>1. Make it Bold</strong></p>
    <p>Like the iconic dome on Mount Hollywood—easy to see. Use size and contrast.</p>

    <p><strong>2. Use Clear Labels</strong></p>
    <p>"View Stars" is obvious—your button should be too. "Buy Now" not "Click Here". "Sign Up" not "Submit".</p>

    <p><strong>3. Show it's Clickable</strong></p>
    <p>The dome looks different from the building. Add rounded corners or shadows. Use hover effects.</p>

    <p><strong>4. Create Contrast</strong></p>
    <p>White dome against dark sky—maximum visibility. Button color should pop from the background.</p>

    <p><strong>5. Size Matters</strong></p>
    <p>Big enough to see and click easily. At least 44x44px on mobile.</p>

    <h3>Button Types</h3>
    <p><strong>Primary:</strong> Most important action (the main telescope)</p>
    <p><strong>Secondary:</strong> Supporting actions (smaller domes)</p>
    <p><strong>Tertiary:</strong> Minor actions (information plaques)</p>

    <h3>Common Mistakes</h3>
    <p>1. Vague labels like "Click" or "Submit"</p>
    <p>2. No hover effect</p>
    <p>3. Too many bold buttons</p>
    <p>4. Too small to tap</p>
    <p>5. Unclear what happens when clicked</p>

    <h3>Quick Tips</h3>
    <p>- Use action verbs: "Explore," "Discover," "View"</p>
    <p>- One primary button per section</p>
    <p>- Make it look clickable</p>
    <p>- Test on mobile</p>
  </div>
</div>


<!-- GRIFFITH QUIZ -->
<section class="quiz-section quiz-section-item" data-destination="Griffith Observatory" style="display: none;">
  <h2>🧠 Quick Quiz: Build Your Own Button!</h2>
  <p>Fill in the blanks to complete your HTML file. If you get both right, your button will appear!</p>

  <form id="button-quiz-1">
    <label for="q1-1">
      1️⃣ Complete this code structure to add a button inside the body: <br>
      <code>&lt;body&gt;<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&lt;________&gt;Click Me!&lt;/________&gt;<br>
      &lt;/body&gt;</code>
    </label><br>
    <input type="text" id="q1-1" placeholder="Type your answer here"><br><br>

    <label for="q1-2">
      2️⃣ Add the missing part to make your button show an alert when clicked: <br>
      <code>&lt;button ________="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code>
    </label><br>
    <input type="text" id="q1-2" placeholder="Type your answer here"><br><br>

    <button type="button" onclick="checkAnswers1()">Check Answers</button>
  </form>

  <div id="quiz-result-1" class="quiz-result"></div>
  <div id="button-demo-1" class="button-demo"></div>
</section>

<!-- SECTION 2: HOLLYWOOD SIGN -->
<section class="hollywood-scene scene-section" id="hollywood" data-destination="Hollywood Sign" style="display: none;">
  <div class="hill-shape" style="--x:-10%"></div>
  <div class="hill-shape" style="--x:20%"></div>
  <div class="hill-shape" style="--x:55%"></div>
  <div class="sign">
    <div class="ltr">H</div>
    <div class="ltr">O</div>
    <div class="ltr">L</div>
    <div class="ltr">L</div>
    <div class="ltr">Y</div>
    <div class="ltr">W</div>
    <div class="ltr">O</div>
    <div class="ltr">O</div>
    <div class="ltr">D</div>
  </div>
  <div class="caption">⛰️ Hollywood Sign — Sunlit hills overlooking LA</div>
</section>

<!-- HOLLYWOOD LESSON -->
<div class="lesson-content lesson-section" data-destination="Hollywood Sign" style="display: none;">
  <div class="container">
    <h1>Los Angeles</h1>
    <h2>Hollywood Sign Button Lesson</h2>

    <h3>Step 1: Set Up Your HTML File</h3>
    <p>First, create a new file and save it as button.html. Every HTML file needs this basic structure:</p>
    <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;My Button&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

    <p>What this means:</p>
    <p>&lt;!DOCTYPE html&gt; tells the browser this is an HTML file</p>
    <p>&lt;html&gt; wraps everything</p>
    <p>&lt;head&gt; contains information about the page</p>
    <p>&lt;body&gt; is where your visible content goes</p>

    <h3>Step 2: Create Your First Button</h3>
    <p>Inside the &lt;body&gt; tags, add a button:</p>
    <pre><code>&lt;body&gt;
    &lt;button&gt;Click Me!&lt;/button&gt;
&lt;/body&gt;</code></pre>

    <h3>Step 3: Make the Button Do Something</h3>
    <p>Add an onclick attribute to make something happen when clicked:</p>
    <pre><code>&lt;button onclick="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code></pre>

    <div class="example-section">
      <h3>Here's an example button!</h3>
      <div class="demo-container-hollywood">
        <div class="hillside">
          <div class="hill-demo hill1"></div>
          <div class="hill-demo hill2"></div>
          <div class="hill-demo hill3"></div>
        </div>
        <div class="button-container">
          <button onclick="generateHollywoodSign()">Click for Hollywood Sign</button>
        </div>
        <div id="signContainer">
          <div class="hollywood-sign">
            <div class="letter">H</div>
            <div class="letter">O</div>
            <div class="letter">L</div>
            <div class="letter">L</div>
            <div class="letter">Y</div>
            <div class="letter">W</div>
            <div class="letter">O</div>
            <div class="letter">O</div>
            <div class="letter">D</div>
          </div>
        </div>
      </div>
    </div>

    <h2>Button Design Tips</h2>

    <h3>What is a Button?</h3>
    <p>A button triggers an action when clicked. Think of the Hollywood Sign—bold, impossible to miss, and tells you exactly what it is. Good buttons work the same way.</p>

    <h3>The 3 Button States</h3>
    <p><strong>Default (Sign at Dawn)</strong> - How it looks normally—waiting to be clicked.</p>
    <p><strong>Hover (Spotlights On)</strong> - When you move your mouse over it—shows it's interactive.</p>
    <p><strong>Clicked (Lights Flash)</strong> - The moment you click—confirms the action.</p>

    <h3>5 Design Tips</h3>
    
    <p><strong>1. Make it Bold</strong></p>
    <p>Like 45-foot tall letters—easy to see. Use size and contrast.</p>

    <p><strong>2. Use Clear Labels</strong></p>
    <p>"HOLLYWOOD" is obvious—your button should be too. "Buy Now" not "Click Here". "Sign Up" not "Submit".</p>

    <p><strong>3. Show it's Clickable</strong></p>
    <p>The sign looks different from the hills. Add rounded corners or shadows. Use hover effects.</p>

    <p><strong>4. Create Contrast</strong></p>
    <p>White letters on brown hillside—maximum visibility. Button color should pop from the background.</p>

    <p><strong>5. Size Matters</strong></p>
    <p>Big enough to see and click easily. At least 44x44px on mobile.</p>

    <h3>Button Types</h3>
    <p><strong>Primary:</strong> Most important action (the main sign)</p>
    <p><strong>Secondary:</strong> Supporting actions (smaller signs)</p>
    <p><strong>Tertiary:</strong> Minor actions (trail markers)</p>

    <h3>Common Mistakes</h3>
    <p>1. Vague labels like "Click" or "Submit"</p>
    <p>2. No hover effect</p>
    <p>3. Too many bold buttons</p>
    <p>4. Too small to tap</p>
    <p>5. Unclear what happens when clicked</p>

    <h3>Quick Tips</h3>
    <p>- Use action verbs: "Download," "Shop," "Join"</p>
    <p>- One primary button per section</p>
    <p>- Make it look clickable</p>
    <p>- Test on mobile</p>
  </div>
</div>

<!-- HOLLYWOOD QUIZ -->
<section class="quiz-section quiz-section-item" data-destination="Hollywood Sign" style="display: none;">
  <h2>🧠 Quick Quiz: Build Your Own Button!</h2>
  <p>Fill in the blanks to complete your HTML file. If you get both right, your button will appear!</p>

  <form id="button-quiz-2">
    <label for="q2-1">
      1️⃣ Complete this code structure to add a button inside the body: <br>
      <code>&lt;body&gt;<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&lt;________&gt;Click Me!&lt;/________&gt;<br>
      &lt;/body&gt;</code>
    </label><br>
    <input type="text" id="q2-1" placeholder="Type your answer here"><br><br>

    <label for="q2-2">
      2️⃣ Add the missing part to make your button show an alert when clicked: <br>
      <code>&lt;button ________="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code>
    </label><br>
    <input type="text" id="q2-2" placeholder="Type your answer here"><br><br>

    <button type="button" onclick="checkAnswers2()">Check Answers</button>
  </form>

  <div id="quiz-result-2" class="quiz-result"></div>
  <div id="button-demo-2" class="button-demo"></div>
</section>


<!-- SECTION 3: UNIVERSAL STUDIOS -->
<section class="universal-scene scene-section" id="universal" data-destination="Universal Studios" style="display: none;">
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
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
      </div>
    </div>
  </div>

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

  <div class="stand popcorn"><div class="stand-canopy"></div><div class="stand-counter">🍿</div></div>
  <div class="stand hotdog"><div class="stand-canopy"></div><div class="stand-counter">🌭</div></div>
  <div class="stand icecream"><div class="stand-canopy"></div><div class="stand-counter">🍦</div></div>
  <div class="stand pretzel"><div class="stand-canopy"></div><div class="stand-counter">🥨</div></div>
  <div class="stand soda"><div class="stand-canopy"></div><div class="stand-counter">🥤</div></div>

  <div class="visitor v1"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v2"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v3"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v4"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v5"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v6"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>
  <div class="visitor v7"><div class="visitor-head"></div><div class="visitor-body"></div><div class="visitor-legs"><div class="visitor-leg leg-l"></div><div class="visitor-leg leg-r"></div></div></div>

  <div class="marquee">
    <div class="marquee-text">
      🎬 WELCOME TO UNIVERSAL STUDIOS HOLLYWOOD • FEATURING: WIZARDING WORLD OF HARRY POTTER • JURASSIC WORLD • TRANSFORMERS • THE MUMMY • SUPER NINTENDO WORLD
    </div>
  </div>
</section>

<!-- UNIVERSAL LESSON -->
<div class="lesson-content lesson-section" data-destination="Universal Studios" style="display: none;">
  <div class="container">
    <h1>Los Angeles</h1>
    <h2>Universal Studios Button Lesson</h2>

    <h3>Step 1: Set Up Your HTML File</h3>
    <p>First, create a new file and save it as button.html. Every HTML file needs this basic structure:</p>
    <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My Button&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

    <p>What this means:</p>
    <p>&lt;!DOCTYPE html&gt; tells the browser this is an HTML file</p>
    <p>&lt;html&gt; wraps everything</p>
    <p>&lt;head&gt; contains information about the page</p>
    <p>&lt;body&gt; is where your visible content goes</p>

    <h3>Step 2: Create Your First Button</h3>
    <p>Inside the &lt;body&gt; tags, add a button:</p>
    <pre><code>&lt;body&gt;
    &lt;button&gt;Click Me!&lt;/button&gt;
&lt;/body&gt;</code></pre>

    <h3>Step 3: Make the Button Do Something</h3>
    <p>Add an onclick attribute to make something happen when clicked:</p>
    <pre><code>&lt;button onclick="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code></pre>

    <div class="example-section">
      <h3>Here's an example button!</h3>
      <div class="demo-container-universal">
        <div class="button-container">
          <button onclick="generateUniversal()">Click for Universal Studios</button>
        </div>

        <div id="universalContainer">
          <div class="globe-container-demo">
            <div class="globe-demo">
              <div class="universal-text-demo">UNIVERSAL</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h2>Button Design Tips</h2>

    <h3>What is a Button?</h3>
    <p>A button triggers an action when clicked. Think of the Universal globe—bold, recognizable, and inviting. Great buttons work the same way!</p>

    <h3>The 3 Button States</h3>
    <p><strong>Default (Globe at Rest)</strong> - How it looks normally—waiting to be clicked.</p>
    <p><strong>Hover (Globe Glowing)</strong> - When you move your mouse over it—shows it's interactive.</p>
    <p><strong>Clicked (Globe Spinning)</strong> - The moment you click—confirms the action.</p>

    <h3>5 Design Tips</h3>
    
    <p><strong>1. Make it Bold</strong></p>
    <p>Like the Universal globe—easy to spot from anywhere. Use size and contrast to make your button stand out.</p>

    <p><strong>2. Use Clear Labels</strong></p>
    <p>Say "Buy Tickets" not "Click Here". Say "Enter Park" not "Submit". Be specific about what happens when clicked!</p>

    <p><strong>3. Show it's Clickable</strong></p>
    <p>Add rounded corners, shadows, and hover effects. Your button should look inviting and interactive.</p>

    <p><strong>4. Create Contrast</strong></p>
    <p>Blue globe against bright sky = maximum visibility. Make your button color pop from the background.</p>

    <p><strong>5. Size Matters</strong></p>
    <p>Big enough to tap easily on mobile. Aim for at least 44×44 pixels.</p>

    <h3>Button Types</h3>
    <p><strong>Primary:</strong> Most important action (the main entrance)</p>
    <p><strong>Secondary:</strong> Supporting actions (ride entrances)</p>
    <p><strong>Tertiary:</strong> Minor actions (information booths)</p>

    <h3>Common Mistakes</h3>
    <p>1. Vague labels like "Click" or "Submit"</p>
    <p>2. No hover effect</p>
    <p>3. Too many bold buttons competing</p>
    <p>4. Too small to tap on mobile</p>
    <p>5. Unclear what happens when clicked</p>

    <h3>Quick Tips</h3>
    <p>- Use action verbs like "Explore", "Buy", or "Enter"</p>
    <p>- Keep one primary button per section</p>
    <p>- And most importantly—make it look clickable!</p>
  </div>
</div>

<!-- UNIVERSAL QUIZ -->
<section class="quiz-section quiz-section-item" data-destination="Universal Studios" style="display: none;">
  <h2>🧠 Quick Quiz: Build Your Own Button!</h2>
  <p>Fill in the blanks to complete your HTML file. If you get both right, your button will appear!</p>

  <form id="button-quiz-3">
    <label for="q3-1">
      1️⃣ Complete this code structure to add a button inside the body: <br>
      <code>&lt;body&gt;<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&lt;________&gt;Click Me!&lt;/________&gt;<br>
      &lt;/body&gt;</code>
    </label><br>
    <input type="text" id="q3-1" placeholder="Type your answer here"><br><br>

    <label for="q3-2">
      2️⃣ Add the missing part to make your button show an alert when clicked: <br>
      <code>&lt;button ________="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code>
    </label><br>
    <input type="text" id="q3-2" placeholder="Type your answer here"><br><br>

    <button type="button" onclick="checkAnswers3()">Check Answers</button>
  </form>

  <div id="quiz-result-3" class="quiz-result"></div>
  <div id="button-demo-3" class="button-demo"></div>
</section>

<!-- SECTION 4: WALK OF FAME -->
<section class="walkoffame-scene scene-section" id="walkoffame" data-destination="Hollywood Walk of Fame" style="display: none;">
  <div class="chinese-theatre">
    <div class="theatre-roof"></div>
    <div class="theatre-body">
      <div class="theatre-pillars">
        <div class="pillar-wof"></div>
        <div class="pillar-wof"></div>
        <div class="pillar-wof"></div>
      </div>
    </div>
  </div>
  <div class="capitol-records">
    <div class="capitol-top"></div>
    <div class="capitol-base">
      <div class="capitol-ring"></div>
      <div class="capitol-ring"></div>
      <div class="capitol-ring"></div>
      <div class="capitol-ring"></div>
    </div>
  </div>
  <div class="dolby-theatre">
    <div class="dolby-marquee">
      <div class="marquee-lights"></div>
    </div>
    <div class="dolby-body"></div>
  </div>
  <div class="sidewalk"></div>
  <div class="star s1"></div>
  <div class="star s2"></div>
  <div class="star s3"></div>
  <div class="star s4"></div>
  <div class="caption">⭐ Hollywood Walk of Fame — stars & landmarks</div>
</section>

<!-- WALK OF FAME LESSON -->
<div class="lesson-content lesson-section" data-destination="Hollywood Walk of Fame" style="display: none;">
  <div class="container">
    <h1>Los Angeles</h1>
    <h2>Hollywood Walk of Fame Button Lesson</h2>

    <h3>Step 1: Set Up Your HTML File</h3>
    <p>First, create a new file and save it as button.html. Every HTML file needs this basic structure:</p>
    <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My Button&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

    <p>What this means:</p>
    <p>&lt;!DOCTYPE html&gt; tells the browser this is an HTML file</p>
    <p>&lt;html&gt; wraps everything</p>
    <p>&lt;head&gt; contains information about the page</p>
    <p>&lt;body&gt; is where your visible content goes</p>

    <h3>Step 2: Create Your First Button</h3>
    <p>Inside the &lt;body&gt; tags, add a button:</p>
    <pre><code>&lt;body&gt;
    &lt;button&gt;Click Me!&lt;/button&gt;
&lt;/body&gt;</code></pre>

    <h3>Step 3: Make the Button Do Something</h3>
    <p>Add an onclick attribute to make something happen when clicked:</p>
    <pre><code>&lt;button onclick="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code></pre>

    <div class="example-section">
      <h3>Here's an example button!</h3>
      <div class="demo-container-walk">
        <div class="button-container">
          <button onclick="generateWalk()">Click for Walk of Fame</button>
        </div>
        <div id="walkContainer">
          <div class="buildings">
            <div class="building building1"></div>
            <div class="building building2"></div>
            <div class="building building3"></div>
            <div class="building building4"></div>
          </div>
          <div class="person person1">
            <div class="person-head"></div>
            <div class="person-body"></div>
            <div class="person-legs">
              <div class="leg"></div>
              <div class="leg"></div>
            </div>
          </div>
          <div class="person person2">
            <div class="person-head"></div>
            <div class="person-body"></div>
            <div class="person-legs">
              <div class="leg"></div>
              <div class="leg"></div>
            </div>
          </div>
          <div class="person person3">
            <div class="person-head"></div>
            <div class="person-body"></div>
            <div class="person-legs">
              <div class="leg"></div>
              <div class="leg"></div>
            </div>
          </div>
          <div class="sidewalk-demo">
            <div class="star-tile">
              <div class="star-shape">★</div>
              <div class="star-name">MARILYN<br>MONROE</div>
            </div>
            <div class="star-tile">
              <div class="star-shape">★</div>
              <div class="star-name">CHARLIE<br>CHAPLIN</div>
            </div>
            <div class="star-tile">
              <div class="star-shape">★</div>
              <div class="star-name">ELVIS<br>PRESLEY</div>
            </div>
            <div class="star-tile">
              <div class="star-shape">★</div>
              <div class="star-name">MICHAEL<br>JACKSON</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h2>Button Design Tips</h2>

    <h3>What is a Button?</h3>
    <p>A button triggers an action when clicked. Think of the Hollywood Walk of Fame stars—each one catches your attention and invites interaction. Good buttons work the same way.</p>

    <h3>The 3 Button States</h3>
    <p><strong>Default (Star on Sidewalk)</strong> - How it looks normally—waiting to be clicked.</p>
    <p><strong>Hover (Star Shining)</strong> - When you move your mouse over it—shows it's interactive.</p>
    <p><strong>Clicked (Camera Flash)</strong> - The moment you click—confirms the action.</p>

    <h3>5 Design Tips</h3>

    <p><strong>1. Make it Bold</strong></p>
    <p>Like the gold stars on gray concrete—easy to see. Use size and contrast.</p>

    <p><strong>2. Use Clear Labels</strong></p>
    <p>Each star has a name—your button should be clear too. "Get Tickets" not "Click Here". "See Stars" not "Submit".</p>

    <p><strong>3. Show it's Clickable</strong></p>
    <p>Stars stand out from the sidewalk. Add rounded corners or shadows. Use hover effects.</p>

    <p><strong>4. Create Contrast</strong></p>
    <p>Gold against gray—maximum visibility. Button color should pop from the background.</p>

    <p><strong>5. Size Matters</strong></p>
    <p>Big enough to see and click easily. At least 44x44px on mobile.</p>

    <h3>Button Types</h3>
    <p><strong>Primary:</strong> Most important action (the famous stars)</p>
    <p><strong>Secondary:</strong> Supporting actions (building entrances)</p>
    <p><strong>Tertiary:</strong> Minor actions (street signs)</p>

    <h3>Common Mistakes</h3>
    <p>1. Vague labels like "Click" or "Submit"</p>
    <p>2. No hover effect</p>
    <p>3. Too many bold buttons</p>
    <p>4. Too small to tap</p>
    <p>5. Unclear what happens when clicked</p>

    <h3>Quick Tips</h3>
    <p>- Use action verbs: "Explore," "Find," "Visit"</p>
    <p>- One primary button per section</p>
    <p>- Make it look clickable</p>
    <p>- Test on mobile</p>
  </div>
</div>

<!-- WALK OF FAME QUIZ -->


<script>
// Load itinerary from localStorage and show only selected destinations
(function() {
  try {
    const itineraryData = localStorage.getItem('westCoastItinerary');
    
    if (itineraryData) {
      const itinerary = JSON.parse(itineraryData);
      
      // Check if Los Angeles data exists
      if (itinerary.cities && itinerary.cities['Los Angeles']) {
        const laDestinations = itinerary.cities['Los Angeles'].destinations;
        
        // Show personalization banner
        const banner = document.getElementById('personalizationBanner');
        const destinationsList = document.getElementById('destinationsList');
        
        if (laDestinations && laDestinations.length > 0) {
          banner.style.display = 'block';
          
          // Display selected destinations in banner
          destinationsList.innerHTML = laDestinations.map(dest => 
            `<div class="destination-badge">${dest}</div>`
          ).join('');
          
          // Show only the sections for selected destinations
          const allScenes = document.querySelectorAll('.scene-section');
          const allLessons = document.querySelectorAll('.lesson-section');
          const allQuizzes = document.querySelectorAll('.quiz-section-item');
          
          // Hide all sections first
          allScenes.forEach(scene => scene.style.display = 'none');
          allLessons.forEach(lesson => lesson.style.display = 'none');
          allQuizzes.forEach(quiz => quiz.style.display = 'none');
          
          // Show only selected destinations
          laDestinations.forEach(destination => {
            // Show scene
            const scene = document.querySelector(`.scene-section[data-destination="${destination}"]`);
            if (scene) scene.style.display = 'block';
            
            // Show lesson
            const lesson = document.querySelector(`.lesson-section[data-destination="${destination}"]`);
            if (lesson) lesson.style.display = 'block';
            
            // Show quiz
            const quiz = document.querySelector(`.quiz-section-item[data-destination="${destination}"]`);
            if (quiz) quiz.style.display = 'block';
          });
        } else {
          // No destinations selected, show all
          showAllDestinations();
        }
      } else {
        // No LA data, show all
        showAllDestinations();
      }
    } else {
      // No itinerary data, show all
      showAllDestinations();
    }
  } catch (error) {
    console.error('Error loading itinerary:', error);
    // On error, show all
    showAllDestinations();
  }
})();

function showAllDestinations() {
  const allScenes = document.querySelectorAll('.scene-section');
  const allLessons = document.querySelectorAll('.lesson-section');
  const allQuizzes = document.querySelectorAll('.quiz-section-item');
  
  allScenes.forEach(scene => scene.style.display = 'block');
  allLessons.forEach(lesson => lesson.style.display = 'block');
  allQuizzes.forEach(quiz => quiz.style.display = 'block');
}

// Hide intro after 4 seconds
setTimeout(() => {
  const intro = document.getElementById('intro');
  if (intro) {
    intro.classList.add('hidden');
  }
}, 4000);

// Demo button functions
function generateObservatory() {
  const container = document.getElementById('observatoryContainer');
  container.classList.remove('show');
  setTimeout(() => {
    container.classList.add('show');
  }, 50);
}

function generateHollywoodSign() {
  const container = document.getElementById('signContainer');
  container.classList.remove('show');
  setTimeout(() => {
    container.classList.add('show');
  }, 50);
}

function generateUniversal() {
  const container = document.getElementById('universalContainer');
  container.classList.remove('show');
  setTimeout(() => {
    container.classList.add('show');
  }, 50);
}

function generateWalk() {
  const container = document.getElementById('walkContainer');
  container.classList.remove('show');
  setTimeout(() => {
    container.classList.add('show');
  }, 50);
}

// Quiz functions
function checkAnswers1() {
  const a1 = document.getElementById("q1-1").value.trim().toLowerCase();
  const a2 = document.getElementById("q1-2").value.trim().toLowerCase();
  const result = document.getElementById("quiz-result-1");
  const demo = document.getElementById("button-demo-1");
  demo.innerHTML = "";
  let score = 0;

  if (a1 === "button") score++;
  if (a2 === "onclick") score++;

  result.textContent = "✅ You got " + score + "/2 correct!";

  if (score === 2) {
    demo.innerHTML = `
      <p>🎉 Great job! Here's your working button:</p>
      <button onclick="alert('Hello!')">Click Me!</button>
    `;
  }
}

function checkAnswers2() {
  const a1 = document.getElementById("q2-1").value.trim().toLowerCase();
  const a2 = document.getElementById("q2-2").value.trim().toLowerCase();
  const result = document.getElementById("quiz-result-2");
  const demo = document.getElementById("button-demo-2");
  demo.innerHTML = "";
  let score = 0;

  if (a1 === "button") score++;
  if (a2 === "onclick") score++;

  result.textContent = "✅ You got " + score + "/2 correct!";

  if (score === 2) {
    demo.innerHTML = `
      <p>🎉 Great job! Here's your working button:</p>
      <button onclick="alert('Hello!')">Click Me!</button>
    `;
  }
}

function checkAnswers3() {
  const a1 = document.getElementById("q3-1").value.trim().toLowerCase();
  const a2 = document.getElementById("q3-2").value.trim().toLowerCase();
  const result = document.getElementById("quiz-result-3");
  const demo = document.getElementById("button-demo-3");
  demo.innerHTML = "";
  let score = 0;

  if (a1 === "button") score++;
  if (a2 === "onclick") score++;

  result.textContent = "✅ You got " + score + "/2 correct!";

  if (score === 2) {
    demo.innerHTML = `
      <p>🎉 Great job! Here's your working button:</p>
      <button onclick="alert('Hello!')">Click Me!</button>
    `;
  }
}

function checkAnswers4() {
  const a1 = document.getElementById("q4-1").value.trim().toLowerCase();
  const a2 = document.getElementById("q4-2").value.trim().toLowerCase();
  const result = document.getElementById("quiz-result-4");
  const demo = document.getElementById("button-demo-4");
  demo.innerHTML = "";
  let score = 0;

  if (a1 === "button") score++;
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
<!-- 🌍 Destination Finder Tool -->
<div style="padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #dee2e6;">
  <h3 style="margin-top: 0; color: #495057;">AI-Powered Destination Finder</h3>

  <label>Search a Place or Interest:</label>
  <textarea id="user-search-input" placeholder="e.g., beaches, hiking, Paris, ancient history..." style="min-height: 80px; width: 100%; padding: 8px; resize: vertical;"></textarea>
  
  <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #007bff;" onclick="generateDestination()">
      🔍 Search Destination
    </button>
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #28a745;" onclick="saveDestination()">
      💾 Save Destination
    </button>
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #17a2b8;" onclick="loadDestination()">
      📂 Load Saved
    </button>
  </div>

  <div id="ai-status" style="margin-top: 10px; padding: 8px; border-radius: 4px; display: none;"></div>

  <!-- Destination Info -->
  <div id="destination-info" style="margin-top: 15px; display: none; border-left: 4px solid #007bff; padding: 12px; border-radius: 4px;">
    <h4 id="dest-name" style="margin: 0; color: #007bff;"></h4>
    <p id="dest-country" style="font-weight: bold; margin: 5px 0;"></p>
    <p id="dest-description" style="color: #495057;"></p>
    <p><strong>🗓 Best Time to Visit:</strong> <span id="dest-best-time"></span></p>
    <p><strong>🌤️ Climate:</strong> <span id="dest-climate"></span></p>
    <p><strong>📍 Suggested Activities:</strong> <span id="dest-activities"></span></p>
  </div>
</div>

<script>
// 🌍 Status message helper
function showAIStatus(message, type) {
  const statusDiv = document.getElementById("ai-status");
  statusDiv.textContent = message;
  statusDiv.style.display = "block";

  switch (type) {
    case "loading":
      statusDiv.style.backgroundColor = "#cce5ff";
      statusDiv.style.color = "#004085";
      break;
    case "success":
      statusDiv.style.backgroundColor = "#d1ecf1";
      statusDiv.style.color = "#0c5460";
      break;
    case "error":
      statusDiv.style.backgroundColor = "#f8d7da";
      statusDiv.style.color = "#721c24";
      break;
  }

  if (type !== "loading") {
    setTimeout(() => (statusDiv.style.display = "none"), 5000);
  }
}

// 🌍 Example destinations (can be replaced with AI/Gemini API later)
const DESTINATIONS = [
  {
    keywords: ["beach", "tropical", "ocean"],
    name: "Maui",
    country: "Hawaii, USA",
    description: "A lush island paradise famous for golden beaches, waterfalls, and volcanic landscapes.",
    bestTime: "April to October",
    climate: "Warm tropical",
    activities: "Snorkeling, hiking Haleakalā, surfing, scenic drives along Hana Highway"
  },
  {
    keywords: ["mountain", "hiking", "nature", "alps"],
    name: "Zermatt",
    country: "Switzerland",
    description: "A picturesque alpine village located at the base of the iconic Matterhorn mountain.",
    bestTime: "June to September (hiking), December to March (skiing)",
    climate: "Cool mountain climate",
    activities: "Hiking, skiing, cable car rides, glacier tours"
  },
  {
    keywords: ["history", "ancient", "ruins"],
    name: "Athens",
    country: "Greece",
    description: "The birthplace of democracy and home to ancient landmarks like the Parthenon.",
    bestTime: "April to June, September to October",
    climate: "Mediterranean",
    activities: "Museum visits, walking tours, exploring Acropolis, Greek cuisine"
  },
  {
    keywords: ["art", "romantic", "europe"],
    name: "Florence",
    country: "Italy",
    description: "A Renaissance treasure known for its art, architecture, and cuisine.",
    bestTime: "May to September",
    climate: "Warm Mediterranean",
    activities: "Visiting the Uffizi Gallery, Duomo climb, wine tasting in Tuscany"
  },
  {
    keywords: ["wildlife", "adventure", "africa", "safari"],
    name: "Serengeti National Park",
    country: "Tanzania",
    description: "A vast ecosystem renowned for the Great Migration and diverse African wildlife.",
    bestTime: "June to October",
    climate: "Warm dry savanna",
    activities: "Safari drives, wildlife photography, balloon safaris"
  }
];

// 🌍 Generate Destination
function generateDestination() {
  const query = document.getElementById("user-search-input").value.trim().toLowerCase();
  if (!query) {
    showAIStatus("⚠️ Please enter a place or theme to search.", "error");
    return;
  }

  showAIStatus("🔍 Searching destinations...", "loading");

  // Find matching destination
  const found = DESTINATIONS.find(dest =>
    dest.keywords.some(k => query.includes(k))
  );

  if (found) {
    displayDestination(found);
    showAIStatus("✅ Destination found!", "success");
  } else {
    // Fallback destination
    displayDestination({
      name: "Kyoto",
      country: "Japan",
      description:
        "A serene city known for its traditional temples, cherry blossoms, and tea culture.",
      bestTime: "March to May, October to November",
      climate: "Mild temperate",
      activities: "Temple visits, tea ceremonies, exploring Arashiyama bamboo forest"
    });
    showAIStatus("🌸 No exact match found, but here's a great suggestion: Kyoto!", "success");
  }
}

// 🌍 Display destination info
function displayDestination(dest) {
  document.getElementById("destination-info").style.display = "block";
  document.getElementById("dest-name").textContent = dest.name;
  document.getElementById("dest-country").textContent = dest.country;
  document.getElementById("dest-description").textContent = dest.description;
  document.getElementById("dest-best-time").textContent = dest.bestTime;
  document.getElementById("dest-climate").textContent = dest.climate;
  document.getElementById("dest-activities").textContent = dest.activities;
}

// 🌍 Save to localStorage
function saveDestination() {
  const data = {
    input: document.getElementById("user-search-input").value.trim(),
    name: document.getElementById("dest-name").textContent,
    country: document.getElementById("dest-country").textContent,
    description: document.getElementById("dest-description").textContent,
    bestTime: document.getElementById("dest-best-time").textContent,
    climate: document.getElementById("dest-climate").textContent,
    activities: document.getElementById("dest-activities").textContent,
    timestamp: new Date().toISOString()
  };

  if (!data.name) {
    showAIStatus("⚠️ Please generate a destination before saving.", "error");
    return;
  }

  localStorage.setItem("destination-finder-saved", JSON.stringify(data));
  showAIStatus("✅ Destination saved successfully!", "success");
}

// 🌍 Load saved destination
function loadDestination() {
  const saved = localStorage.getItem("destination-finder-saved");
  if (!saved) {
    showAIStatus("⚠️ No saved destination found.", "error");
    return;
  }

  const data = JSON.parse(saved);
  displayDestination(data);
  document.getElementById("user-search-input").value = data.input;
  const saveDate = new Date(data.timestamp).toLocaleString();
  showAIStatus(`📂 Loaded saved destination (Saved: ${saveDate})`, "success");
}
</script>
Share your experiences on the microblog!
</body>
</html>