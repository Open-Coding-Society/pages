---
layout: post
title: "Seattle"
description: "Roadtrip through Seattle and learn UI while you're there!"
permalink: /west-coast/analytics/seattle/
parent: "Analytics/Admin"
team: "Cool Collaborators"
submodule: 4
author: "Cool Collaborators"
date: 2025-10-21
microblog: true
footer: 
    previous: /west-coast/analytics/sanfrancisco/
    home: /west-coast/travel/
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Seattle Landmarks - Progress Bar Lessons</title>
<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #2c5f7c, #1a3f56);
  min-height: 100vh;
  padding: 20px;
  color: #000;
}

body.loading {
  overflow: hidden;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2c5f7c, #1a3f56);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.loading-screen.hidden {
  opacity: 0;
  visibility: hidden;
}

.truck-container {
  position: relative;
  width: 300px;
  height: 150px;
  margin-bottom: 40px;
}

.truck {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 80px;
  animation: truckBounce 0.5s ease-in-out infinite;
}

@keyframes truckBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-4px); }
}

.truck-cab {
  position: absolute;
  left: 0;
  bottom: 20px;
  width: 60px;
  height: 50px;
  background: linear-gradient(135deg, #ff6b35, #d94515);
  border-radius: 8px 8px 0 0;
  border: 3px solid #a83610;
}

.truck-windshield {
  position: absolute;
  top: 5px;
  left: 8px;
  width: 35px;
  height: 25px;
  background: linear-gradient(135deg, rgba(135,206,235,0.8), rgba(100,149,237,0.6));
  border-radius: 4px;
  border: 2px solid #333;
}

.truck-cargo {
  position: absolute;
  right: 0;
  bottom: 20px;
  width: 110px;
  height: 60px;
  background: linear-gradient(135deg, #4a7c4e, #3a6b3f);
  border-radius: 4px;
  border: 3px solid #2d5016;
}

.cargo-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
}

.truck-wheel {
  position: absolute;
  bottom: 0;
  width: 24px;
  height: 24px;
  background: radial-gradient(circle, #333 40%, #555 40%, #555 60%, #333 60%);
  border-radius: 50%;
  border: 3px solid #222;
  animation: wheelRotate 0.6s linear infinite;
}

@keyframes wheelRotate {
  to { transform: rotate(360deg); }
}

.wheel-front { left: 15px; }
.wheel-back1 { right: 80px; }
.wheel-back2 { right: 50px; }

.road {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: #333;
  overflow: hidden;
}

.road-line {
  position: absolute;
  top: 2px;
  height: 4px;
  width: 30px;
  background: #fff;
  animation: roadMove 1s linear infinite;
}

.road-line:nth-child(1) { left: 0%; }
.road-line:nth-child(2) { left: 20%; }
.road-line:nth-child(3) { left: 40%; }
.road-line:nth-child(4) { left: 60%; }
.road-line:nth-child(5) { left: 80%; }

@keyframes roadMove {
  to { transform: translateX(-100px); }
}

.loading-text {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  animation: loadingPulse 1.5s ease-in-out infinite;
}

@keyframes loadingPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-bar {
  width: 300px;
  height: 8px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #69be28, #4a7c4e);
  border-radius: 4px;
  animation: loadingProgress 2s ease-in-out forwards;
  box-shadow: 0 0 10px rgba(105,190,40,0.6);
}

@keyframes loadingProgress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
}

.landmark-section {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,.5);
  margin-bottom: 40px;
  color: #000;
  display: none;
}

/* Space Needle Styles */
.needle-scene {
  background: linear-gradient(180deg, #708090 0%, #a9b5c1 60%, #d3dce6 100%);
  width: 100%;
  height: 500px;
  position: relative;
}

.seattle-sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 70%;
}

.rain-drop {
  position: absolute;
  width: 2px;
  height: 20px;
  background: linear-gradient(180deg, transparent, rgba(255,255,255,.6));
  top: -30px;
  animation: rain 1.5s linear infinite;
}

@keyframes rain {
  to { top: 110%; }
}

.space-needle {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 500px;
}

.needle-base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 60px;
  background: linear-gradient(135deg, #a0a0a0, #808080);
  border-radius: 12px;
  border: 4px solid #606060;
  box-shadow: 0 8px 20px rgba(0,0,0,.4);
}

.needle-legs {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  height: 100px;
}

.leg {
  position: absolute;
  width: 10px;
  background: linear-gradient(135deg, #b8b8b8, #808080);
  border: 3px solid #606060;
  bottom: 0;
  border-radius: 5px;
  box-shadow: 2px 2px 8px rgba(0,0,0,.3);
}

.leg.l1 { 
  left: 10px; 
  height: 100px;
  transform: rotate(-25deg); 
  transform-origin: bottom center; 
}

.leg.l2 { 
  left: 40%; 
  height: 90px;
  transform: rotate(-12deg); 
  transform-origin: bottom center; 
}

.leg.l3 { 
  right: 40%; 
  height: 90px;
  transform: rotate(12deg); 
  transform-origin: bottom center; 
}

.leg.l4 { 
  right: 10px; 
  height: 100px;
  transform: rotate(25deg); 
  transform-origin: bottom center; 
}

.needle-shaft {
  position: absolute;
  bottom: 160px;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 240px;
  background: linear-gradient(90deg, #d0d0d0 0%, #a0a0a0 50%, #d0d0d0 100%);
  border: 3px solid #707070;
  border-radius: 11px;
  box-shadow: inset 0 0 15px rgba(0,0,0,.25), 4px 0 12px rgba(0,0,0,.3);
}

.saucer-bottom {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 30px;
  background: linear-gradient(180deg, #888, #666);
  border-radius: 50%;
  border: 4px solid #555;
  box-shadow: 0 12px 30px rgba(0,0,0,.5);
}

.observation-deck {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 70px;
  background: linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 50%, #c8c8c8 100%);
  border-radius: 50%;
  border: 5px solid #a0a0a0;
  box-shadow: 0 15px 35px rgba(0,0,0,.5), inset 0 -10px 20px rgba(0,0,0,.1);
}

.observation-deck:before {
  content: "";
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 22px;
  background: linear-gradient(180deg, #e8e8e8, #d0d0d0);
  border-radius: 50%;
  border: 4px solid #a0a0a0;
  box-shadow: 0 -5px 15px rgba(0,0,0,.2);
}

.observation-deck:after {
  content: "";
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 12px;
  background: linear-gradient(180deg, #b8b8b8, #909090);
  border-radius: 50%;
}

.deck-windows {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.deck-window {
  width: 10px;
  height: 22px;
  background: linear-gradient(180deg, rgba(135,206,235,.8), rgba(100,149,237,.6));
  border: 2px solid #707070;
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgba(255,255,255,.5);
}

.roof-ring {
  position: absolute;
  top: 55px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 30px;
  background: linear-gradient(180deg, #d0d0d0, #a8a8a8);
  border-radius: 50%;
  border: 4px solid #888;
  box-shadow: 0 8px 20px rgba(0,0,0,.4);
}

.needle-top {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 70px;
  background: linear-gradient(90deg, #f0f0f0 0%, #c0c0c0 50%, #f0f0f0 100%);
  border-radius: 14px;
  border: 3px solid #909090;
  box-shadow: 0 6px 15px rgba(0,0,0,.4);
}

.top-cap {
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 25px;
  background: radial-gradient(ellipse at 50% 30%, #e8e8e8, #b8b8b8);
  border-radius: 50%;
  border: 3px solid #888;
}

.antenna {
  position: absolute;
  top: -55px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 60px;
  background: linear-gradient(180deg, #888, #606060);
  border-radius: 3px;
  box-shadow: 2px 2px 6px rgba(0,0,0,.4);
}

.antenna-light {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #ff3333, #cc0000);
  border-radius: 50%;
  box-shadow: 0 0 25px #ff0000, 0 0 50px rgba(255,0,0,.6);
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 40%, 60%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.3; transform: translateX(-50%) scale(0.9); }
}

.city-building {
  position: absolute;
  bottom: 20%;
  background: linear-gradient(135deg, #7a8a99, #5a6a79);
  border: 2px solid #3a4a59;
  border-radius: 4px 4px 0 0;
}

.b1 { left: 15%; width: 60px; height: 100px; }
.b2 { left: 25%; width: 50px; height: 130px; }
.b3 { right: 20%; width: 70px; height: 90px; }
.b4 { right: 10%; width: 55px; height: 110px; }

.window-grid {
  position: absolute;
  inset: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.window {
  background: rgba(255,255,150,.8);
  border-radius: 2px;
}

.ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20%;
  background: linear-gradient(180deg, #4a5a6a 0%, #3a4a5a 100%);
}

/* Pike Place Market Styles */
.pike-scene {
  background: linear-gradient(180deg, #87CEEB 0%, #a8c8d8 60%, #c8d8e8 100%);
  width: 100%;
  height: 500px;
  position: relative;
}

.market-sign {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 450px;
  height: 120px;
  background: linear-gradient(135deg, #c41e3a, #a01828);
  border: 8px solid #8b1520;
  border-radius: 8px;
  display: grid;
  place-items: center;
  box-shadow: 0 12px 30px rgba(0,0,0,.4);
}

.market-sign-text {
  color: #fff;
  font-weight: 800;
  font-size: 36px;
  letter-spacing: 4px;
  text-shadow: 3px 3px 6px rgba(0,0,0,.6);
}

.clock {
  position: absolute;
  top: 18%;
  left: 15%;
  width: 60px;
  height: 60px;
  background: #fff;
  border: 6px solid #333;
  border-radius: 50%;
  box-shadow: 0 6px 15px rgba(0,0,0,.3);
}

.clock-hand {
  position: absolute;
  background: #333;
  transform-origin: bottom;
  left: 50%;
  bottom: 50%;
}

.hour-hand {
  width: 4px;
  height: 18px;
  margin-left: -2px;
  animation: rotateHour 120s linear infinite;
}

.minute-hand {
  width: 3px;
  height: 24px;
  margin-left: -1.5px;
  animation: rotateMinute 10s linear infinite;
}

@keyframes rotateHour {
  to { transform: rotate(360deg); }
}

@keyframes rotateMinute {
  to { transform: rotate(360deg); }
}

.market-awning {
  position: absolute;
  bottom: 35%;
  left: 10%;
  right: 10%;
  height: 80px;
  background: repeating-linear-gradient(
    90deg,
    #ff6b35 0px,
    #ff6b35 40px,
    #fff 40px,
    #fff 80px
  );
  border: 4px solid #d94515;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 8px 20px rgba(0,0,0,.3);
}

.market-stall {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35%;
  background: linear-gradient(180deg, #8b6f47 0%, #6d5838 100%);
}

.crate {
  position: absolute;
  width: 60px;
  height: 50px;
  background: linear-gradient(135deg, #d2a679, #b88a5c);
  border: 3px solid #8b6f47;
  border-radius: 4px;
  bottom: 35%;
}

.crate.c1 { left: 20%; }
.crate.c2 { left: 35%; bottom: 40%; }
.crate.c3 { right: 25%; }

.fish {
  position: absolute;
  width: 50px;
  height: 25px;
  background: linear-gradient(135deg, #a8d8ea, #79c7e3);
  border-radius: 50% 50% 50% 0;
  bottom: 45%;
  left: 30%;
  animation: throwFish 3s ease-in-out infinite;
  transform-origin: center;
  border: 2px solid #5aa8c0;
}

.fish-eye {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #000;
  border-radius: 50%;
  top: 6px;
  left: 8px;
}

.fish-tail {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 15px solid #79c7e3;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
}

@keyframes throwFish {
  0%, 100% { left: 30%; bottom: 45%; transform: rotate(0deg); }
  50% { left: 60%; bottom: 65%; transform: rotate(360deg); }
}

.vendor {
  position: absolute;
  bottom: 35%;
  width: 40px;
  height: 70px;
}

.vendor.v1 { left: 25%; }
.vendor.v2 { right: 30%; }

.vendor-head {
  width: 28px;
  height: 28px;
  background: radial-gradient(circle at 40% 30%, #ffd4a3, #e6b88a);
  border-radius: 50%;
  margin: 0 auto 4px;
  border: 2px solid #cc9966;
}

.vendor-body {
  width: 40px;
  height: 35px;
  background: linear-gradient(135deg, #ff6b35, #d94515);
  margin: 0 auto;
  border-radius: 8px;
  border: 2px solid #a83610;
}

/* Mount Rainier Styles */
.rainier-scene {
  background: linear-gradient(180deg, #87CEEB 0%, #a4c8e1 40%, #d5e5f0 100%);
  width: 100%;
  height: 500px;
  position: relative;
}

.mountain-sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 65%;
}

.mountain-cloud {
  position: absolute;
  background: rgba(255,255,255,.75);
  border-radius: 100px;
  animation: driftCloud 35s linear infinite;
}

.mc1 {
  width: 120px;
  height: 50px;
  top: 15%;
  left: -150px;
}

.mc1:before {
  content: "";
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,.75);
  border-radius: 50%;
  top: -25px;
  left: 30px;
}

.mc2 {
  width: 100px;
  height: 45px;
  top: 25%;
  left: -200px;
  animation-delay: 10s;
}

@keyframes driftCloud {
  to { transform: translateX(calc(100vw + 250px)); }
}

.mount-rainier {
  position: absolute;
  bottom: 35%;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 350px;
}

.mountain-peak {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 250px solid transparent;
  border-right: 250px solid transparent;
  border-bottom: 350px solid #8a9ba8;
  filter: drop-shadow(0 10px 30px rgba(0,0,0,.3));
}

.snow-cap {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 150px solid transparent;
  border-right: 150px solid transparent;
  border-bottom: 200px solid #fff;
  filter: drop-shadow(0 0 20px rgba(255,255,255,.8));
}

.glacier {
  position: absolute;
  width: 80px;
  height: 150px;
  background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(200,220,240,.7));
  top: 140px;
  clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
}

.g1 { left: 35%; }
.g2 { right: 35%; }

.forest-base {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35%;
  background: linear-gradient(180deg, #2d5016 0%, #1e3a0f 100%);
}

.tree {
  position: absolute;
  bottom: 35%;
  width: 30px;
  height: 80px;
}

.tree-trunk {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 25px;
  background: #5a3a1f;
  border-radius: 2px;
}

.tree-foliage {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 60px solid #2d5016;
}

.tree.t1 { left: 15%; }
.tree.t2 { left: 25%; bottom: 32%; }
.tree.t3 { left: 35%; }
.tree.t4 { right: 30%; }
.tree.t5 { right: 20%; bottom: 33%; }
.tree.t6 { right: 10%; }

.deer {
  position: absolute;
  bottom: 35%;
  left: 45%;
  width: 50px;
  height: 60px;
  animation: graze 6s ease-in-out infinite;
}

.deer-body {
  width: 40px;
  height: 30px;
  background: linear-gradient(135deg, #8b6f47, #6d5838);
  border-radius: 40%;
  position: absolute;
  bottom: 20px;
  border: 2px solid #5a3a1f;
}

.deer-head {
  width: 20px;
  height: 24px;
  background: #8b6f47;
  border-radius: 50% 50% 40% 40%;
  position: absolute;
  top: 0;
  left: 0;
  border: 2px solid #5a3a1f;
}

.antler {
  position: absolute;
  width: 3px;
  height: 15px;
  background: #5a3a1f;
  top: -2px;
}

.antler.left { left: 4px; transform: rotate(-20deg); }
.antler.right { right: 4px; transform: rotate(20deg); }

.antler:before {
  content: "";
  position: absolute;
  width: 3px;
  height: 8px;
  background: #5a3a1f;
  top: 4px;
  left: -3px;
  transform: rotate(-45deg);
}

.deer-leg {
  width: 6px;
  height: 20px;
  background: #6d5838;
  position: absolute;
  bottom: 0;
  border-radius: 2px;
  border: 1px solid #5a3a1f;
}

.dl1 { left: 8px; }
.dl2 { left: 18px; }
.dl3 { right: 10px; }
.dl4 { right: 2px; }

@keyframes graze {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(30px); }
}

.eagle {
  position: absolute;
  width: 40px;
  height: 18px;
  top: 20%;
  left: -60px;
  animation: soar 20s linear infinite;
}

.eagle:before,
.eagle:after {
  content: "";
  position: absolute;
  width: 20px;
  height: 12px;
  background: transparent;
  border-top: 4px solid #5a3a1f;
  border-radius: 50%;
}

.eagle:before {
  left: 0;
  animation: eagleFlap 2s ease-in-out infinite;
}

.eagle:after {
  right: 0;
  animation: eagleFlap 2s ease-in-out infinite reverse;
}

@keyframes soar {
  to { left: 110%; top: 30%; }
}

@keyframes eagleFlap {
  0%, 100% { transform: rotateX(0deg); }
  50% { transform: rotateX(40deg); }
}

/* Lumen Field Styles */
.lumen-scene {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  width: 100%;
  height: 500px;
  position: relative;
}

.stadium-lights {
  position: absolute;
  width: 100%;
  height: 100%;
}

.light-tower {
  position: absolute;
  width: 30px;
  height: 120px;
  background: linear-gradient(135deg, #555, #333);
  border: 2px solid #222;
  border-radius: 4px;
}

.lt1 { top: 15%; left: 10%; }
.lt2 { top: 15%; right: 10%; }
.lt3 { bottom: 40%; left: 8%; }
.lt4 { bottom: 40%; right: 8%; }

.light-beam {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 60px;
  background: radial-gradient(ellipse at 50% 0%, rgba(255,255,150,.4), transparent 70%);
  animation: lightPulse 3s ease-in-out infinite;
}

@keyframes lightPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.stadium-structure {
  position: absolute;
  bottom: 20%;
  left: 10%;
  right: 10%;
  height: 180px;
  background: linear-gradient(135deg, #2c5f7c, #1a3f56);
  border: 4px solid #0d2a3a;
  border-radius: 80px 80px 0 0;
  box-shadow: inset 0 -20px 40px rgba(0,0,0,.4);
}

.stadium-seats {
  position: absolute;
  inset: 20px;
  background: repeating-linear-gradient(
    180deg,
    #4a7c4e 0px,
    #4a7c4e 8px,
    #3a6b3f 8px,
    #3a6b3f 16px
  );
  border-radius: 60px 60px 0 0;
}

.football-field {
  position: absolute;
  bottom: 20%;
  left: 15%;
  right: 15%;
  height: 25%;
  background: linear-gradient(90deg, #2d5016 0%, #3a6b3f 50%, #2d5016 100%);
  border: 3px solid #fff;
}

.yard-line {
  position: absolute;
  width: 2px;
  height: 100%;
  background: rgba(255,255,255,.6);
  left: var(--x);
}

.midfield {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: 800;
  color: rgba(255,255,255,.3);
}

.football-player {
  position: absolute;
  bottom: 23%;
  width: 30px;
  height: 60px;
  animation: run 4s linear infinite;
}

.player-helmet {
  width: 26px;
  height: 20px;
  background: linear-gradient(135deg, #002244, #69be28);
  border-radius: 50% 50% 30% 30%;
  margin: 0 auto 2px;
  border: 2px solid #001122;
  position: relative;
}

.facemask {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 8px;
  border: 2px solid #ccc;
  border-radius: 0 0 8px 8px;
  border-top: none;
}

.jersey {
  width: 30px;
  height: 28px;
  background: linear-gradient(135deg, #002244, #003366);
  margin: 0 auto;
  border-radius: 6px;
  border: 2px solid #001122;
}

.player-legs {
  display: flex;
  justify-content: space-around;
  padding: 0 6px;
}

.player-leg {
  width: 10px;
  height: 20px;
  background: #e8e8e8;
  border-radius: 4px;
  border: 1px solid #ccc;
}

@keyframes run {
  0% { left: 15%; }
  100% { left: 85%; }
}

.football {
  position: absolute;
  bottom: 35%;
  left: 40%;
  width: 20px;
  height: 12px;
  background: linear-gradient(135deg, #8b4513, #654321);
  border-radius: 50%;
  border: 2px solid #5a3010;
  animation: spiral 4s ease-in-out infinite;
}

.laces {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 2px;
  background: #fff;
}

@keyframes spiral {
  0%, 100% { left: 40%; bottom: 35%; transform: rotate(0deg); }
  50% { left: 70%; bottom: 50%; transform: rotate(720deg); }
}

/* Shared Styles */
.label {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255,255,255,.95);
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 20px;
  color: #1a3f56;
  box-shadow: 0 8px 20px rgba(0,0,0,.3);
}

.content {
  padding: 60px 80px;
  background: white;
  color: #000 !important;
}

.content h1 {
  font-size: 2.5em;
  color: #000 !important;
  margin-bottom: 30px;
}

.content h2 {
  font-size: 2em;
  color: #000 !important;
  margin-top: 50px;
  margin-bottom: 20px;
}

.content h3 {
  font-size: 1.5em;
  color: #000 !important;
  margin-top: 30px;
  margin-bottom: 15px;
}

.content p {
  line-height: 1.8;
  margin-bottom: 15px;
  font-size: 1.1em;
  color: #000 !important;
}

.content ul {
  margin: 20px 0 20px 30px;
  color: #000 !important;
}

.content li {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #000 !important;
}

.example-box {
  background: #f0f8ff;
  border-left: 4px solid #2c5f7c;
  padding: 20px;
  margin: 30px 0;
  border-radius: 8px;
  color: #000 !important;
}

.example-box strong {
  color: #000 !important;
}

.quiz-section {
  padding: 60px 80px;
  background: linear-gradient(135deg, #002244, #003366);
  color: #fff;
  display: none;
}

.quiz-section h1 {
  font-size: 2.5em;
  color: #69be28 !important;
  margin-bottom: 15px;
  text-align: center;
}

.subtitle {
  color: #87CEEB;
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.2em;
}

.question {
  background: rgba(255,255,255,.1);
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  border: 2px solid rgba(255,255,255,.2);
  transition: all 0.3s ease;
}

.question.correct {
  border-color: #69be28;
  background: rgba(105,190,40,.15);
  animation: successPulse 0.5s ease;
}

@keyframes successPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.question-number {
  color: #69be28;
  font-weight: 700;
  font-size: 1.3em;
  margin-bottom: 15px;
}

.question-text {
  color: #ffffff;
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 20px;
}

.fill-blank {
  display: inline-block;
  background: rgba(255,255,255,.2);
  border: 2px solid #69be28;
  border-radius: 8px;
  padding: 10px 18px;
  color: #ffffff;
  font-size: 1em;
  min-width: 180px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
}

.fill-blank::placeholder {
  color: rgba(255,255,255,.5);
}

.fill-blank:focus {
  border-color: #87CEEB;
  background: rgba(255,255,255,.3);
  box-shadow: 0 0 0 3px rgba(135,206,235,.2);
}

.fill-blank.correct {
  border-color: #69be28;
  background: rgba(105,190,40,.3);
}

.feedback {
  margin-top: 15px;
  padding: 15px;
  border-radius: 8px;
  font-weight: 600;
  display: none;
}

.feedback.show {
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.feedback.correct {
  background: rgba(105,190,40,.3);
  color: #69be28;
  border: 2px solid #69be28;
}

.feedback.incorrect {
  background: rgba(239,68,68,.2);
  color: #ff6b6b;
  border: 2px solid #ff6b6b;
}

.progress-reward {
  margin-top: 20px;
  padding: 25px;
  background: rgba(105,190,40,.1);
  border: 2px solid #69be28;
  border-radius: 12px;
  display: none;
}

.progress-reward.show {
  display: block;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.progress-reward h3 {
  color: #69be28;
  margin-bottom: 15px;
  font-size: 1.3em;
}

.progress-reward p {
  color: #ffffff;
  margin-bottom: 15px;
}

.progress-bar-demo {
  position: relative;
  width: 100%;
  height: 40px;
  background: rgba(255,255,255,.2);
  border-radius: 20px;
  overflow: hidden;
  margin: 20px 0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #69be28, #4a7c4e);
  border-radius: 20px;
  transition: width 2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1em;
  box-shadow: 0 2px 8px rgba(105,190,40,.4);
}

.completion-message {
  background: linear-gradient(135deg, #69be28, #4a7c4e);
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  display: none;
  margin-top: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,.3);
}

.completion-message.show {
  display: block;
  animation: bounceIn 0.6s ease;
}

@keyframes bounceIn {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.completion-message h2 {
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 2em;
}

.completion-message p {
  color: #ffffff;
  font-size: 1.2em;
}

.hint {
  color: #87CEEB;
  font-size: 0.9em;
  font-style: italic;
  margin-top: 10px;
}

/* Personalization Banner Styles */
.personalization-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin: 20px auto;
  max-width: 1200px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  display: none;
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

@media (max-width: 768px) {
  .content {
    padding: 40px 30px;
  }
  
  .content h1 {
    font-size: 2em;
  }
  
  .content h2 {
    font-size: 1.6em;
  }
  
  .quiz-section {
    padding: 40px 30px;
  }
  
  .quiz-section h1 {
    font-size: 2em;
  }
  
  .fill-blank {
    min-width: 150px;
    font-size: 0.9em;
  }
}
</style>
</head>
<body class="loading">

<!-- Personalization Banner -->
<div id="personalizationBanner" class="personalization-banner">
  <h3>🎯 Your Personalized Seattle Experience</h3>
  <p>Based on your itinerary preferences, here are your selected destinations:</p>
  <div class="destinations-list" id="destinationsList"></div>
</div>

<div class="loading-screen" id="loadingScreen">
  <div class="loading-text">Loading Seattle Landmarks...</div>
  
  <div class="truck-container">
    <div class="truck">
      <div class="truck-cab">
        <div class="truck-windshield"></div>
      </div>
      <div class="truck-cargo">
        <div class="cargo-text">PROGRESS<br>LESSONS</div>
      </div>
      <div class="truck-wheel wheel-front"></div>
      <div class="truck-wheel wheel-back1"></div>
      <div class="truck-wheel wheel-back2"></div>
    </div>
    
    <div class="road">
      <div class="road-line"></div>
      <div class="road-line"></div>
      <div class="road-line"></div>
      <div class="road-line"></div>
      <div class="road-line"></div>
    </div>
  </div>
  
  <div class="loading-bar">
    <div class="loading-progress"></div>
  </div>
</div>

<div class="main-container">

<!-- Space Needle Section -->
<div class="landmark-section" data-destination="Space Needle">
  <div class="needle-scene">
    <div class="label">🗼 Space Needle</div>
    <div class="seattle-sky">
      <div class="rain-drop" style="left: 15%; animation-delay: 0s;"></div>
      <div class="rain-drop" style="left: 25%; animation-delay: 0.3s;"></div>
      <div class="rain-drop" style="left: 35%; animation-delay: 0.6s;"></div>
      <div class="rain-drop" style="left: 45%; animation-delay: 0.2s;"></div>
      <div class="rain-drop" style="left: 55%; animation-delay: 0.8s;"></div>
      <div class="rain-drop" style="left: 65%; animation-delay: 0.4s;"></div>
      <div class="rain-drop" style="left: 75%; animation-delay: 0.1s;"></div>
      <div class="rain-drop" style="left: 85%; animation-delay: 0.7s;"></div>
    </div>
    <div class="city-building b1">
      <div class="window-grid">
        <div class="window"></div><div class="window"></div><div class="window"></div>
        <div class="window"></div><div class="window"></div><div class="window"></div>
        <div class="window"></div><div class="window"></div><div class="window"></div>
      </div>
    </div>
    <div class="city-building b2">
      <div class="window-grid">
        <div class="window"></div><div class="window"></div><div class="window"></div>
        <div class="window"></div><div class="window"></div><div class="window"></div>
        <div class="window"></div><div class="window"></div><div class="window"></div>
      </div>
    </div>
    <div class="city-building b3">
      <div class="window-grid">
        <div class="window"></div><div class="window"></div><div class="window"></div>
        <div class="window"></div><div class="window"></div><div class="window"></div>
      </div>
    </div>
    <div class="city-building b4">
      <div class="window-grid">
        <div class="window"></div><div class="window"></div><div class="window"></div>
        <div class="window"></div><div class="window"></div><div class="window"></div>
        <div class="window"></div><div class="window"></div><div class="window"></div>
      </div>
    </div>
    <div class="space-needle">
      <div class="needle-top">
        <div class="antenna">
          <div class="antenna-light"></div>
        </div>
        <div class="top-cap"></div>
      </div>
      <div class="roof-ring"></div>
      <div class="observation-deck">
        <div class="deck-windows">
          <div class="deck-window"></div>
          <div class="deck-window"></div>
          <div class="deck-window"></div>
          <div class="deck-window"></div>
          <div class="deck-window"></div>
          <div class="deck-window"></div>
          <div class="deck-window"></div>
          <div class="deck-window"></div>
          <div class="deck-window"></div>
          <div class="deck-window"></div>
        </div>
      </div>
      <div class="saucer-bottom"></div>
      <div class="needle-shaft"></div>
      <div class="needle-legs">
        <div class="leg l1"></div>
        <div class="leg l2"></div>
        <div class="leg l3"></div>
        <div class="leg l4"></div>
      </div>
      <div class="needle-base"></div>
    </div>
    <div class="ground"></div>
  </div>
  
  <div class="content">
    <h1>Progress Bar Lesson: Space Needle Theme</h1>

    <h2>What is a Progress Bar?</h2>
    <p>A progress bar shows how much of a task is complete. Think of the Space Needle—visitors riding the elevator up 520 feet to the observation deck, watching floor numbers light up as you ascend. It shows where you are and how much is left.</p>

    <h2>The 3 Parts of a Progress Bar</h2>

    <h3>The Track (The Full Tower)</h3>
    <p>From ground level to the top deck—represents the total task.</p>
    <ul>
      <li>Background bar showing the complete distance</li>
    </ul>

    <h3>The Fill (Floors Climbed)</h3>
    <p>Progress up the tower—shows how far you've come.</p>
    <ul>
      <li>Colored bar that grows as you complete the task</li>
    </ul>

    <h3>The Label (Floor Display)</h3>
    <p>Digital floor counter in the elevator—tells you exactly where you are.</p>
    <ul>
      <li>Text showing percentage or "Level 3 of 5"</li>
    </ul>

    <h2>5 Design Tips</h2>

    <h3>1. Make it Visible</h3>
    <p>Like the bright floor display in the elevator—easy to see in any light.</p>
    <ul>
      <li>Use clear colors with good contrast</li>
      <li>Make it big enough to notice</li>
    </ul>

    <h3>2. Show Real Progress</h3>
    <p>Like the smooth elevator ride—accurate and honest.</p>
    <ul>
      <li>Update smoothly as tasks complete</li>
      <li>Never fake progress or go backwards</li>
    </ul>

    <h3>3. Use Iconic Colors</h3>
    <p>Space Needle white and orange create recognizable style.</p>
    <ul>
      <li>Match your brand colors</li>
      <li>Use color to show status (green = good, red = error)</li>
    </ul>

    <h3>4. Add Context</h3>
    <p>Like the elevator operator's announcements—tell users what's happening.</p>
    <ul>
      <li>"Loading... 60%"</li>
      <li>"Step 3 of 5 complete"</li>
    </ul>

    <h3>5. Keep it Simple</h3>
    <p>Don't overcomplicate like confusing observation levels.</p>
    <ul>
      <li>One bar, clear message</li>
      <li>Avoid fancy animations that distract</li>
    </ul>

    <h2>Common Mistakes</h2>
    <ul>
      <li>No feedback—users don't know if anything is happening</li>
      <li>Jumping progress—going from 10% to 90% instantly feels fake</li>
      <li>Stuck at 99%—like an elevator frozen between floors</li>
      <li>Too small—like trying to read the floor display from outside</li>
      <li>No message—progress without context confuses users</li>
    </ul>

    <h2>Quick Example</h2>
    <div class="example-box">
      <p><strong>Good:</strong> "Uploading to cloud... [████████░░] 80% - Floor 4 of 5"</p>
      <p><strong>Bad:</strong> [░░░░░░░░░░] (no message, unclear progress)</p>
    </div>

    <h2>Quick Tips</h2>
    <ul>
      <li>Always show feedback when users wait</li>
      <li>Smooth animations feel more professional (like the elevator)</li>
      <li>Add estimated time if possible: "About 40 seconds to top"</li>
      <li>Use motion to show it's working, not frozen</li>
      <li>Celebrate completion—like reaching the stunning 360° view!</li>
    </ul>
  </div>
  
  <div class="quiz-section">
    <h1>🎯 Progress Bar Quiz</h1>
    <p class="subtitle">Test your knowledge of progress bar design principles!</p>
    
    <div class="question" id="needle-q1">
      <div class="question-number">Question 1</div>
      <div class="question-text">
        When designing a progress bar, you should use 
        <input type="text" class="fill-blank" id="needle-answer1" placeholder="Your answer..."> 
        animations to make the bar feel professional and show that the task is actively running.
      </div>
      <p class="hint">💡 Hint: The opposite of jerky or jumpy</p>
      <div class="feedback" id="needle-feedback1"></div>
      <div class="progress-reward" id="needle-reward1">
        <h3>✅ Correct! Watch the difference:</h3>
        <p><strong>Smooth Animation:</strong></p>
        <div class="progress-bar-demo">
          <div class="progress-fill" id="needle-progress1" style="width: 0%">0%</div>
        </div>
        <p style="font-size: 0.95em; margin-top: 12px; color: #69be28;">Smooth progress feels natural and professional!</p>
      </div>
    </div>
    
    <div class="question" id="needle-q2">
      <div class="question-number">Question 2</div>
      <div class="question-text">
        A common mistake is making the progress bar too 
        <input type="text" class="fill-blank" id="needle-answer2" placeholder="Your answer..."> 
        which makes it hard for users to see and track their progress.
      </div>
      <p class="hint">💡 Hint: Not big enough</p>
      <div class="feedback" id="needle-feedback2"></div>
      <div class="progress-reward" id="needle-reward2">
        <h3>🌟 Excellent! Size matters:</h3>
        <p><strong>Processing files...</strong></p>
        <div class="progress-bar-demo">
          <div class="progress-fill" id="needle-progress2" style="width: 0%">0%</div>
        </div>
        <p style="font-size: 0.95em; margin-top: 12px; color: #69be28;">A visible progress bar keeps users informed and engaged!</p>
      </div>
    </div>
    
    <div class="completion-message" id="needle-completion">
      <h2>🏆 Quiz Complete!</h2>
      <p>You've mastered the key principles of progress bar design!</p>
      <p style="margin-top: 15px; font-size: 1.1em;">Ready to build better user experiences! 🎉</p>
    </div>
  </div>
</div>

<!-- Pike Place Market Section -->
<div class="landmark-section" data-destination="Pike Place Market">
  <div class="pike-scene">
    <div class="label">🐟 Pike Place Market</div>
    <div class="clock">
      <div class="clock-hand hour-hand"></div>
      <div class="clock-hand minute-hand"></div>
    </div>
    <div class="market-sign">
      <div class="market-sign-text">PUBLIC MARKET</div>
    </div>
    <div class="market-awning"></div>
    <div class="crate c1"></div>
    <div class="crate c2"></div>
    <div class="crate c3"></div>
    <div class="fish">
      <div class="fish-eye"></div>
      <div class="fish-tail"></div>
    </div>
    <div class="vendor v1">
      <div class="vendor-head"></div>
      <div class="vendor-body"></div>
    </div>
    <div class="vendor v2">
      <div class="vendor-head"></div>
      <div class="vendor-body"></div>
    </div>
    <div class="market-stall"></div>
  </div>
  
  <div class="content">
    <h1>Progress Bar Lesson: Pike Place Market Theme</h1>

    <h2>What is a Progress Bar?</h2>
    <p>A progress bar shows how much of a task is complete. Think of Pike Place Market—shoppers moving through vendor stalls from the fish market to the flower stands, checking items off their list. It shows where you are and how much is left.</p>

    <h2>The 3 Parts of a Progress Bar</h2>

    <h3>The Track (The Full Market)</h3>
    <p>From the famous Pike Place sign to the last vendor—represents the total task.</p>
    <ul>
      <li>Background bar showing the complete distance</li>
    </ul>

    <h3>The Fill (Stalls Visited)</h3>
    <p>Progress through the market—shows how far you've come.</p>
    <ul>
      <li>Colored bar that grows as you complete the task</li>
    </ul>

    <h3>The Label (Vendor Signs)</h3>
    <p>Clear signs at each stall—tells you exactly where you are.</p>
    <ul>
      <li>Text showing percentage or "3 of 10 items checked out"</li>
    </ul>

    <h2>5 Design Tips</h2>

    <h3>1. Make it Visible</h3>
    <p>Like the bright vendor signs—easy to see in the busy market.</p>
    <ul>
      <li>Use clear colors with good contrast</li>
      <li>Make it big enough to notice</li>
    </ul>

    <h3>2. Show Real Progress</h3>
    <p>Like crossing items off your shopping list—accurate and honest.</p>
    <ul>
      <li>Update smoothly as tasks complete</li>
      <li>Never fake progress or go backwards</li>
    </ul>

    <h3>3. Use Market Colors</h3>
    <p>Bright produce colors and fresh fish tones create energy.</p>
    <ul>
      <li>Match your brand colors</li>
      <li>Use color to show status (green = good, red = error)</li>
    </ul>

    <h3>4. Add Context</h3>
    <p>Like vendor shouts calling out specials—tell users what's happening.</p>
    <ul>
      <li>"Processing payment... 60%"</li>
      <li>"2 of 5 items added to cart"</li>
    </ul>

    <h3>5. Keep it Simple</h3>
    <p>Don't overcomplicate like a crowded Saturday morning.</p>
    <ul>
      <li>One bar, clear message</li>
      <li>Avoid fancy animations that distract</li>
    </ul>

    <h2>Common Mistakes</h2>
    <ul>
      <li>No feedback—users don't know if anything is happening</li>
      <li>Jumping progress—going from 10% to 90% instantly feels fake</li>
      <li>Stuck at 99%—like waiting in the checkout line forever</li>
      <li>Too small—like trying to read price signs from across the aisle</li>
      <li>No message—progress without context confuses users</li>
    </ul>

    <h2>Quick Example</h2>
    <div class="example-box">
      <p><strong>Good:</strong> "Adding to cart... [████████░░] 80% - Almost done!"</p>
      <p><strong>Bad:</strong> [░░░░░░░░░░] (no message, unclear progress)</p>
    </div>

    <h2>Quick Tips</h2>
    <ul>
      <li>Always show feedback when users wait</li>
      <li>Smooth animations feel more professional</li>
      <li>Add estimated time if possible: "About 30 seconds remaining"</li>
      <li>Use motion to show it's working, not frozen</li>
      <li>Celebrate completion—like finding the perfect bouquet!</li>
    </ul>
  </div>
  
  <div class="quiz-section">
    <h1>🎯 Progress Bar Quiz</h1>
    <p class="subtitle">Test your knowledge of progress bar design principles!</p>
    
    <div class="question" id="pike-q1">
      <div class="question-number">Question 1</div>
      <div class="question-text">
        When designing a progress bar, you should use 
        <input type="text" class="fill-blank" id="pike-answer1" placeholder="Your answer..."> 
        animations to make the bar feel professional and show that the task is actively running.
      </div>
      <p class="hint">💡 Hint: The opposite of jerky or jumpy</p>
      <div class="feedback" id="pike-feedback1"></div>
      <div class="progress-reward" id="pike-reward1">
        <h3>✅ Correct! Watch the difference:</h3>
        <p><strong>Smooth Animation:</strong></p>
        <div class="progress-bar-demo">
          <div class="progress-fill" id="pike-progress1" style="width: 0%">0%</div>
        </div>
        <p style="font-size: 0.95em; margin-top: 12px; color: #69be28;">Smooth progress feels natural and professional!</p>
      </div>
    </div>
    
    <div class="question" id="pike-q2">
      <div class="question-number">Question 2</div>
      <div class="question-text">
        A common mistake is making the progress bar too 
        <input type="text" class="fill-blank" id="pike-answer2" placeholder="Your answer..."> 
        which makes it hard for users to see and track their progress.
      </div>
      <p class="hint">💡 Hint: Not big enough</p>
      <div class="feedback" id="pike-feedback2"></div>
      <div class="progress-reward" id="pike-reward2">
        <h3>🌟 Excellent! Size matters:</h3>
        <p><strong>Processing files...</strong></p>
        <div class="progress-bar-demo">
          <div class="progress-fill" id="pike-progress2" style="width: 0%">0%</div>
        </div>
        <p style="font-size: 0.95em; margin-top: 12px; color: #69be28;">A visible progress bar keeps users informed and engaged!</p>
      </div>
    </div>
    
    <div class="completion-message" id="pike-completion">
      <h2>🏆 Quiz Complete!</h2>
      <p>You've mastered the key principles of progress bar design!</p>
      <p style="margin-top: 15px; font-size: 1.1em;">Ready to build better user experiences! 🎉</p>
    </div>
  </div>
</div>

<!-- Mount Rainier Section -->
<div class="landmark-section" data-destination="Mount Rainier National Park">
  <div class="rainier-scene">
    <div class="label">⛰️ Mount Rainier</div>
    
    <div class="mountain-sky">
      <div class="mountain-cloud mc1"></div>
      <div class="mountain-cloud mc2"></div>
    </div>
    
    <div class="mount-rainier">
      <div class="mountain-peak">
        <div class="snow-cap"></div>
        <div class="glacier g1"></div>
        <div class="glacier g2"></div>
      </div>
    </div>
    
    <div class="tree t1">
      <div class="tree-trunk"></div>
      <div class="tree-foliage"></div>
    </div>
    <div class="tree t2">
      <div class="tree-trunk"></div>
      <div class="tree-foliage"></div>
    </div>
    <div class="tree t3">
      <div class="tree-trunk"></div>
      <div class="tree-foliage"></div>
    </div>
    <div class="tree t4">
      <div class="tree-trunk"></div>
      <div class="tree-foliage"></div>
    </div>
    <div class="tree t5">
      <div class="tree-trunk"></div>
      <div class="tree-foliage"></div>
    </div>
    <div class="tree t6">
      <div class="tree-trunk"></div>
      <div class="tree-foliage"></div>
    </div>
    
    <div class="deer">
      <div class="deer-head">
        <div class="antler left"></div>
        <div class="antler right"></div>
      </div>
      <div class="deer-body"></div>
      <div class="deer-leg dl1"></div>
      <div class="deer-leg dl2"></div>
      <div class="deer-leg dl3"></div>
      <div class="deer-leg dl4"></div>
    </div>
    
    <div class="eagle"></div>
    
    <div class="forest-base"></div>
  </div>
  
  <div class="content">
    <h1>Progress Bar Lesson: Mount Rainier National Park Theme</h1>

    <h2>What is a Progress Bar?</h2>
    <p>A progress bar shows how much of a task is complete. Think of Mount Rainier National Park—hikers watching trail markers count up to the summit, or the elevation gain on your climb. It shows where you are and how much is left.</p>

    <h2>The 3 Parts of a Progress Bar</h2>

    <h3>The Track (The Trail)</h3>
    <p>The full trail from Paradise to the summit—represents the total task.</p>
    <ul>
      <li>Background bar showing the complete distance</li>
    </ul>

    <h3>The Fill (Miles Hiked)</h3>
    <p>Progress up the mountain—shows how far you've come.</p>
    <ul>
      <li>Colored bar that grows as you complete the task</li>
    </ul>

    <h3>The Label (Trail Marker)</h3>
    <p>Elevation signs and mile markers—tells you exactly where you are.</p>
    <ul>
      <li>Text showing percentage or "3 of 10 miles complete"</li>
    </ul>

    <h2>5 Design Tips</h2>

    <h3>1. Make it Visible</h3>
    <p>Like trail markers visible through the mist—easy to see from anywhere.</p>
    <ul>
      <li>Use clear colors with good contrast</li>
      <li>Make it big enough to notice</li>
    </ul>

    <h3>2. Show Real Progress</h3>
    <p>Like elevation markers on the trail—accurate and honest.</p>
    <ul>
      <li>Update smoothly as tasks complete</li>
      <li>Never fake progress or go backwards</li>
    </ul>

    <h3>3. Use Nature Colors</h3>
    <p>Mountain blues and forest greens create calm focus.</p>
    <ul>
      <li>Match your brand colors</li>
      <li>Use color to show status (green = good, red = error)</li>
    </ul>

    <h3>4. Add Context</h3>
    <p>Like a trail map—tell users what's happening.</p>
    <ul>
      <li>"Uploading photos... 60%"</li>
      <li>"2 of 5 forms completed"</li>
    </ul>

    <h3>5. Keep it Simple</h3>
    <p>Don't overcomplicate like confusing trail junctions.</p>
    <ul>
      <li>One bar, clear message</li>
      <li>Avoid fancy animations that distract</li>
    </ul>

    <h2>Common Mistakes</h2>
    <ul>
      <li>No feedback—users don't know if anything is happening</li>
      <li>Jumping progress—going from 10% to 90% instantly feels fake</li>
      <li>Stuck at 99%—like being 100 feet from the summit forever</li>
      <li>Too small—like trying to read a trail sign from a mile away</li>
      <li>No message—progress without context confuses users</li>
    </ul>

    <h2>Quick Example</h2>
    <div class="example-box">
      <p><strong>Good:</strong> "Processing images... [████████░░] 80% - 2 minutes left"</p>
      <p><strong>Bad:</strong> [░░░░░░░░░░] (no message, unclear progress)</p>
    </div>

    <h2>Quick Tips</h2>
    <ul>
      <li>Always show feedback when users wait</li>
      <li>Smooth animations feel more professional</li>
      <li>Add estimated time if possible: "About 2 minutes remaining"</li>
      <li>Use motion to show it's working, not frozen</li>
      <li>Celebrate completion—like reaching the summit!</li>
    </ul>
  </div>
  
    <div class="quiz-section">
    <h1>🎯 Progress Bar Quiz</h1>
    <p class="subtitle">Test your knowledge of progress bar design principles!</p>
    
    <div class="question" id="rainier-q1">
      <div class="question-number">Question 1</div>
      <div class="question-text">
        When designing a progress bar, you should use 
        <input type="text" class="fill-blank" id="rainier-answer1" placeholder="Your answer..."> 
        animations to make the bar feel professional and show that the task is actively running.
      </div>
      <p class="hint">💡 Hint: The opposite of jerky or jumpy</p>
      <div class="feedback" id="rainier-feedback1"></div>
      <div class="progress-reward" id="rainier-reward1">
        <h3>✅ Correct! Watch the difference:</h3>
        <p><strong>Smooth Animation:</strong></p>
        <div class="progress-bar-demo">
          <div class="progress-fill" id="rainier-progress1" style="width: 0%">0%</div>
        </div>
        <p style="font-size: 0.95em; margin-top: 12px; color: #69be28;">Smooth progress feels natural and professional!</p>
      </div>
    </div>
    
    <div class="question" id="rainier-q2">
      <div class="question-number">Question 2</div>
      <div class="question-text">
        A common mistake is making the progress bar too 
        <input type="text" class="fill-blank" id="rainier-answer2" placeholder="Your answer..."> 
        which makes it hard for users to see and track their progress.
      </div>
      <p class="hint">💡 Hint: Not big enough</p>
      <div class="feedback" id="rainier-feedback2"></div>
      <div class="progress-reward" id="rainier-reward2">
        <h3>🌟 Excellent! Size matters:</h3>
        <p><strong>Processing files...</strong></p>
        <div class="progress-bar-demo">
          <div class="progress-fill" id="rainier-progress2" style="width: 0%">0%</div>
        </div>
        <p style="font-size: 0.95em; margin-top: 12px; color: #69be28;">A visible progress bar keeps users informed and engaged!</p>
      </div>
    </div>
    
    <div class="completion-message" id="rainier-completion">
      <h2>🏆 Quiz Complete!</h2>
      <p>You've mastered the key principles of progress bar design!</p>
      <p style="margin-top: 15px; font-size: 1.1em;">Ready to build better user experiences! 🎉</p>
    </div>
  </div>
</div>

<!-- Lumen Field Section -->
<div class="landmark-section" data-destination="Lumen Field">
  <div class="lumen-scene">
    <div class="label">🏈 Lumen Field</div>
    
    <div class="stadium-lights">
      <div class="light-tower lt1">
        <div class="light-beam"></div>
      </div>
      <div class="light-tower lt2">
        <div class="light-beam"></div>
      </div>
      <div class="light-tower lt3">
        <div class="light-beam"></div>
      </div>
      <div class="light-tower lt4">
        <div class="light-beam"></div>
      </div>
    </div>
    
    <div class="stadium-structure">
      <div class="stadium-seats"></div>
    </div>
    
    <div class="football-field">
      <div class="yard-line" style="--x: 20%"></div>
      <div class="yard-line" style="--x: 40%"></div>
      <div class="yard-line" style="--x: 60%"></div>
      <div class="yard-line" style="--x: 80%"></div>
      <div class="midfield">12</div>
    </div>
    
    <div class="football-player">
      <div class="player-helmet">
        <div class="facemask"></div>
      </div>
      <div class="jersey"></div>
      <div class="player-legs">
        <div class="player-leg"></div>
        <div class="player-leg"></div>
      </div>
    </div>
    
    <div class="football">
      <div class="laces"></div>
    </div>
  </div>
  
  <div class="content">
    <h1>Progress Bar Lesson: Lumen Field Theme</h1>

    <h2>What is a Progress Bar?</h2>
    <p>A progress bar shows how much of a task is complete. Think of Lumen Field—fans watching the game clock count down, or the "12th Man" flag raising before kickoff. It shows where you are and how much is left.</p>

    <h2>The 3 Parts of a Progress Bar</h2>

    <h3>The Track (The Field)</h3>
    <p>The full 100 yards—represents the total task.</p>
    <ul>
      <li>Background bar showing the complete distance</li>
    </ul>

    <h3>The Fill (Yards Gained)</h3>
    <p>Progress down the field—shows how far you've come.</p>
    <ul>
      <li>Colored bar that grows as you complete the task</li>
    </ul>

    <h3>The Label (Scoreboard)</h3>
    <p>Game stats and time remaining—tells you exactly where you are.</p>
    <ul>
      <li>Text showing percentage or "3 of 10 steps complete"</li>
    </ul>

    <h2>5 Design Tips</h2>

    <h3>1. Make it Visible</h3>
    <p>Like the giant scoreboard—easy to see from anywhere.</p>
    <ul>
      <li>Use clear colors with good contrast</li>
      <li>Make it big enough to notice</li>
    </ul>

    <h3>2. Show Real Progress</h3>
    <p>Like yard markers on the field—accurate and honest.</p>
    <ul>
      <li>Update smoothly as tasks complete</li>
      <li>Never fake progress or go backwards</li>
    </ul>

    <h3>3. Use Team Colors</h3>
    <p>Seahawks blue and green create excitement.</p>
    <ul>
      <li>Match your brand colors</li>
      <li>Use color to show status (green = good, red = error)</li>
    </ul>

    <h3>4. Add Context</h3>
    <p>Like the play clock—tell users what's happening.</p>
    <ul>
      <li>"Uploading files... 60%"</li>
      <li>"2 of 5 questions answered"</li>
    </ul>

    <h3>5. Keep it Simple</h3>
    <p>Don't overcomplicate like a confusing penalty call.</p>
    <ul>
      <li>One bar, clear message</li>
      <li>Avoid fancy animations that distract</li>
    </ul>

    <h2>Common Mistakes</h2>
    <ul>
      <li>No feedback—users don't know if anything is happening</li>
      <li>Jumping progress—going from 10% to 90% instantly feels fake</li>
      <li>Stuck at 99%—like being at the 1-yard line forever</li>
      <li>Too small—like trying to read the scoreboard from the parking lot</li>
      <li>No message—progress without context confuses users</li>
    </ul>

    <h2>Quick Example</h2>
    <div class="example-box">
      <p><strong>Good:</strong> "Processing images... [████████░░] 80% - 2 minutes left"</p>
      <p><strong>Bad:</strong> [░░░░░░░░░░] (no message, unclear progress)</p>
    </div>

    <h2>Quick Tips</h2>
    <ul>
      <li>Always show feedback when users wait</li>
      <li>Smooth animations feel more professional</li>
      <li>Add estimated time if possible: "About 2 minutes remaining"</li>
      <li>Use motion to show it's working, not frozen</li>
      <li>Celebrate completion—like a touchdown celebration!</li>
    </ul>
  </div>
  
  <div class="quiz-section">
    <h1>🎯 Progress Bar Quiz</h1>
    <p class="subtitle">Test your knowledge of progress bar design principles!</p>
    
    <div class="question" id="lumen-q1">
      <div class="question-number">Question 1</div>
      <div class="question-text">
        When designing a progress bar, you should use 
        <input type="text" class="fill-blank" id="lumen-answer1" placeholder="Your answer..."> 
        animations to make the bar feel professional and show that the task is actively running.
      </div>
      <p class="hint">💡 Hint: The opposite of jerky or jumpy</p>
      <div class="feedback" id="lumen-feedback1"></div>
      <div class="progress-reward" id="lumen-reward1">
        <h3>✅ Correct! Watch the difference:</h3>
        <p><strong>Smooth Animation:</strong></p>
        <div class="progress-bar-demo">
          <div class="progress-fill" id="lumen-progress1" style="width: 0%">0%</div>
        </div>
        <p style="font-size: 0.95em; margin-top: 12px; color: #69be28;">Smooth progress feels natural and professional!</p>
      </div>
    </div>
    
    <div class="question" id="lumen-q2">
      <div class="question-number">Question 2</div>
      <div class="question-text">
        A common mistake is making the progress bar too 
        <input type="text" class="fill-blank" id="lumen-answer2" placeholder="Your answer..."> 
        which makes it hard for users to see and track their progress.
      </div>
      <p class="hint">💡 Hint: Not big enough</p>
      <div class="feedback" id="lumen-feedback2"></div>
      <div class="progress-reward" id="lumen-reward2">
        <h3>🌟 Excellent! Size matters:</h3>
        <p><strong>Processing files...</strong></p>
        <div class="progress-bar-demo">
          <div class="progress-fill" id="lumen-progress2" style="width: 0%">0%</div>
        </div>
        <p style="font-size: 0.95em; margin-top: 12px; color: #69be28;">A visible progress bar keeps users informed and engaged!</p>
      </div>
    </div>
    
    <div class="completion-message" id="lumen-completion">
      <h2>🏆 Quiz Complete!</h2>
      <p>You've mastered the key principles of progress bar design!</p>
      <p style="margin-top: 15px; font-size: 1.1em;">Ready to build better user experiences! 🎉</p>
    </div>
  </div>
</div>

</div>

<script>
// Load itinerary from localStorage and show only selected destinations
(function() {
  try {
    const itineraryData = localStorage.getItem('westCoastItinerary');
    
    if (itineraryData) {
      const itinerary = JSON.parse(itineraryData);
      
      // Check if Seattle data exists
      if (itinerary.cities && itinerary.cities['Seattle']) {
        const seattleDestinations = itinerary.cities['Seattle'].destinations;
        
        // Show personalization banner
        const banner = document.getElementById('personalizationBanner');
        const destinationsList = document.getElementById('destinationsList');
        
        if (seattleDestinations && seattleDestinations.length > 0) {
          banner.style.display = 'block';
          
          // Display selected destinations in banner
          destinationsList.innerHTML = seattleDestinations.map(dest => 
            `<div class="destination-badge">${dest}</div>`
          ).join('');
          
          // Show only the sections for selected destinations
          const allSections = document.querySelectorAll('.landmark-section');
          
          // Hide all sections first
          allSections.forEach(section => section.style.display = 'none');
          
          // Show only selected destinations
          seattleDestinations.forEach(destination => {
            const section = document.querySelector(`.landmark-section[data-destination="${destination}"]`);
            if (section) {
              section.style.display = 'block';
              
              // Also show the lesson and quiz content within this section
              const lesson = section.querySelector('.content');
              const quiz = section.querySelector('.quiz-section');
              if (lesson) lesson.style.display = 'block';
              if (quiz) quiz.style.display = 'block';
            }
          });
        } else {
          // No destinations selected, show all
          showAllDestinations();
        }
      } else {
        // No Seattle data, show all
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
  const allSections = document.querySelectorAll('.landmark-section');
  allSections.forEach(section => {
    section.style.display = 'block';
    const lesson = section.querySelector('.content');
    const quiz = section.querySelector('.quiz-section');
    if (lesson) lesson.style.display = 'block';
    if (quiz) quiz.style.display = 'block';
  });
}

// Loading screen
window.addEventListener('load', function() {
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('hidden');
    document.body.classList.remove('loading');
  }, 2000);
});

const answers = {
  q1: ['smooth', 'fluid', 'seamless'],
  q2: ['small', 'tiny', 'little']
};

const landmarks = ['needle', 'pike', 'rainier', 'lumen'];
const correctCounts = {};

landmarks.forEach(landmark => {
  correctCounts[landmark] = 0;
});

function animateProgress(elementId, targetWidth) {
  const progressBar = document.getElementById(elementId);
  let width = 0;
  const interval = setInterval(() => {
    if (width >= targetWidth) {
      clearInterval(interval);
    } else {
      width += 2;
      progressBar.style.width = width + '%';
      progressBar.textContent = width + '%';
    }
  }, 30);
}

function checkAnswer(landmark, questionNum) {
  const input = document.getElementById(`${landmark}-answer${questionNum}`);
  const feedback = document.getElementById(`${landmark}-feedback${questionNum}`);
  const reward = document.getElementById(`${landmark}-reward${questionNum}`);
  const question = document.getElementById(`${landmark}-q${questionNum}`);
  
  const userAnswer = input.value.trim().toLowerCase();
  const correctAnswers = answers[`q${questionNum}`];
  
  if (correctAnswers.includes(userAnswer)) {
    feedback.textContent = questionNum === 1 ? '✓ Perfect! Smooth animations are key!' : '✓ Exactly! Visibility is crucial!';
    feedback.className = 'feedback correct show';
    input.className = 'fill-blank correct';
    question.className = 'question correct';
    reward.className = 'progress-reward show';
    input.disabled = true;
    
    setTimeout(() => {
      const targetWidth = questionNum === 1 ? 65 : 100;
      animateProgress(`${landmark}-progress${questionNum}`, targetWidth);
    }, 300);
    
    correctCounts[landmark]++;
    
    if (correctCounts[landmark] === 2) {
      setTimeout(() => {
        document.getElementById(`${landmark}-completion`).className = 'completion-message show';
      }, 2500);
    }
  } else if (userAnswer !== '') {
    feedback.textContent = '✗ Not quite! Check the lesson and try again!';
    feedback.className = 'feedback incorrect show';
    setTimeout(() => {
      feedback.className = 'feedback incorrect';
    }, 2000);
  }
}

landmarks.forEach(landmark => {
  // Only add event listeners if the elements exist (for selected destinations)
  const answer1 = document.getElementById(`${landmark}-answer1`);
  const answer2 = document.getElementById(`${landmark}-answer2`);
  
  if (answer1) {
    answer1.addEventListener('input', () => checkAnswer(landmark, 1));
    answer1.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkAnswer(landmark, 1);
    });
  }
  
  if (answer2) {
    answer2.addEventListener('input', () => checkAnswer(landmark, 2));
    answer2.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkAnswer(landmark, 2);
    });
  }
});
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