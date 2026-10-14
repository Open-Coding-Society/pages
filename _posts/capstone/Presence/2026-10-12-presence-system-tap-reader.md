---
toc: false
layout: post
title: Classroom Presence System, Tap Reader Build
description: Our own tap reader, a Raspberry Pi 3 and an RC522 RFID board in a 3D-printed case, replacing the CrowPi.
permalink: /capstone/presence-system/tap-reader/
year: "2026-2027"
rp_active: tapreader
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Tap Reader Build</div>
    <h1 class="rfid-presence-title">Building our own tap reader</h1>
    <p class="ocs__description">A Raspberry Pi 3 and an RC522 RFID board in a 3D-printed case, replacing the CrowPi.</p>
  </div>

  {% include presence-system-nav.html %}

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/tap-reader-hero.svg" alt="The finished reader, a Raspberry Pi 3 and RC522 board in a 3D-printed case, mounted on the wall by the classroom door. A student taps the tag on their laptop and the dashboard shows Vibha is present.">
    <p class="ocs__description">The plan: our own reader by the door, a Pi 3 and an RC522 in a printed case.</p>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/tap-reader-inside.svg" alt="Exploded view of the reader, top to bottom: 3D-printed case lid, RC522 RFID board, Raspberry Pi 3, 3D-printed case base.">
    <p class="ocs__description">What's inside: lid, RC522, Pi 3, base.</p>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/tap-reader-wiring.svg" alt="Wiring from the RC522 to the Raspberry Pi 3 GPIO header: SDA to pin 24, SCK to pin 23, MOSI to pin 19, MISO to pin 21, IRQ not connected, GND to pin 6, RST to pin 22, 3.3V to pin 1. The RC522 runs on 3.3 volts, never 5 volts.">
    <p class="ocs__description">Wiring: SPI0 to the Pi header, the mfrc522 library's default pins. 3.3 V, never 5 V.</p>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/tap-reader-software.svg" alt="Software flow: the RC522 reads the card ID, the mfrc522 Python library passes it to reader.py, which posts the tap to the presence API, Flask records it, and the dashboard shows Present. Only the reader hardware changes; the library, reader.py, the API, Flask and the dashboard stay the same.">
    <p class="ocs__description">Only the reader hardware changes. Everything after it stays the same.</p>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/tap-reader-timeline.svg" alt="Build timeline: RC522 ordered (done), parts arrive, wire it and read a first card, reader.py integration, Shay prints the case, assembly, mount by the door and test, classroom pilot.">
    <p class="ocs__description">Build timeline: the RC522 is ordered, and everything else comes next.</p>
  </div>

<div class="ocs__card">
    <div class="ocs__grid ocs__grid--card">
      <div class="ocs__grid-cell">
        <img class="ocs__image-frame ocs__image-frame--thumbnail" src="{{ site.baseurl }}/images/presence-system/tap-reader-part-pi3.svg" alt="">
        <strong>Raspberry Pi 3</strong>
        <span class="ocs__status-pill ocs__status-pill--good">Have</span>
      </div>
      <div class="ocs__grid-cell">
        <img class="ocs__image-frame ocs__image-frame--thumbnail" src="{{ site.baseurl }}/images/presence-system/tap-reader-part-rc522.svg" alt="">
        <strong>RC522 kit · ~$14</strong>
        <span class="ocs__status-pill ocs__status-pill--warn">Ordered</span>
      </div>
      <div class="ocs__grid-cell">
        <img class="ocs__image-frame ocs__image-frame--thumbnail" src="{{ site.baseurl }}/images/presence-system/tap-reader-part-fobs.svg" alt="">
        <strong>Cards + fobs</strong>
        <span class="ocs__status-pill ocs__status-pill--neutral">In the kit</span>
      </div>
      <div class="ocs__grid-cell">
        <img class="ocs__image-frame ocs__image-frame--thumbnail" src="{{ site.baseurl }}/images/presence-system/tap-reader-part-case.svg" alt="">
        <strong>Case</strong>
        <span class="ocs__status-pill ocs__status-pill--neutral">3D printed</span>
      </div>
      <div class="ocs__grid-cell">
        <img class="ocs__image-frame ocs__image-frame--thumbnail" src="{{ site.baseurl }}/images/presence-system/tap-reader-part-cables.svg" alt="">
        <strong>GPIO board + cables</strong>
        <span class="ocs__status-pill ocs__status-pill--good">Have</span>
      </div>
    </div>
    <!-- Replace this callout with:
         <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pi3-parts.jpg" alt="Raspberry Pi 3 with GPIO extension board and ribbon cable"> -->
    <p class="ocs__callout">Photo of the Pi 3, GPIO board and ribbon cable goes here</p>
    <p class="ocs__description">Parts: most are already here, and the RC522 kit is on order.</p>
  </div>

<div class="ocs__card">
    <div class="ocs__grid ocs__grid--standard cols-2">
      <div class="ocs__grid-cell">
        <h4>Option D: for</h4>
        <ul class="ocs__checklist">
          <li class="done"><span class="ocs__checklist-box"></span><span>Costs a few dollars</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Works this week</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>No code changes</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Same fob IDs as today</span></li>
        </ul>
      </div>
      <div class="ocs__grid-cell">
        <h4>Watch out</h4>
        <ul class="ocs__checklist">
          <li class="open"><span class="ocs__checklist-box"></span><span><strong>Short cable:</strong> the Pi sits right behind the reader. Fix: Pi goes in the same case</span></li>
          <li class="open"><span class="ocs__checklist-box"></span><span><strong>Looks like a prototype.</strong> Fix: Shay's printed case</span></li>
        </ul>
      </div>
    </div>
    <p class="ocs__description">Why Option D, from our options doc: cheap, fast, and no code changes.</p>
  </div>


  <details>
    <summary>Talking points and details</summary>

    <div class="ocs__card">
        <h3 class="ocs__section-title">Talking points</h3>

        <h4>Why replace the CrowPi</h4>
        <p>The CrowPi is a whole learning kit (screen, keyboard and dozens of sensors in a suitcase-style case), and we only use its RFID reader. A small dedicated reader can be mounted by the door and left there, and it frees up the CrowPi.</p>

        <h4>Why build our own (Option D)</h4>
        <ul>
          <li>Costs a few dollars and can work this week (options doc).</li>
          <li>No code changes: <code>reader.py</code> already reads cards with the <code>mfrc522</code> Python library, the standard RC522 library, and the doc says the CrowPi uses the same chip. The fob IDs we've already registered should stay the same.</li>
          <li>Mr. Mortensen backed it: he's bringing supplies and ordering the RC522, and Shay is printing a case. Building it ourselves also means we control the hardware and can fix it.</li>
        </ul>

        <h4>What the RC522 is and how it connects</h4>
        <ul>
          <li>An RFID reader board built on NXP's MFRC522 chip. It works at 13.56 MHz and reads MIFARE cards like the S50 (MIFARE Classic 1K) cards and key fobs in the kit.</li>
          <li>It talks to the Pi over SPI: 8 wires to the GPIO header (see the wiring diagram). IRQ isn't used.</li>
          <li><strong>Power is 3.3 V only.</strong> The chip's supply range is 2.5–3.6 V and the absolute maximum is 4.0 V, so the Pi's 5 V pins would destroy it.</li>
          <li>SPI has to be switched on in the Pi's settings (<code>raspi-config</code> → Interface Options → SPI) before the library can see the board.</li>
        </ul>

        <h4>Who's doing what</h4>
        <ul>
          <li><strong>Mr. Mortensen:</strong> supplies, and the RC522 order.</li>
          <li><strong>Shay:</strong> prints the case and helps with assembly.</li>
          <li><strong>Us:</strong> wiring, software, and testing.</li>
        </ul>

        <h4>How we'll test it (planned, not done yet)</h4>
        <ol>
          <li><strong>First card read:</strong> the Pi prints the card's ID. Check it matches the ID already registered for that fob.</li>
          <li><strong>End to end:</strong> tap, then the dashboard shows Present. Same checks as the Postman demo.</li>
          <li><strong>Repeated taps:</strong> tap many times and count any missed or doubled reads.</li>
          <li><strong>Read distance:</strong> measure how far away a tag still reads, both bare and stuck on a laptop.</li>
        </ol>

        <h4>Open questions</h4>
        <ul>
          <li><strong>Network:</strong> the Pi 3 will hit the same school-wifi problem as the CrowPi (devices can't reach my laptop). Options: Ethernet, a phone hotspot, or hosting Flask somewhere both can reach.</li>
          <li><strong>PN532 HAT:</strong> do we need it at all, or is the RC522 enough?</li>
          <li><strong>Read range through a laptop or case:</strong> laptop bodies (often metal) can weaken 13.56 MHz reads. We need to test where the tag sits.</li>
        </ul>

        <h4>Sources</h4>
        <ul>
          <li>NXP MFRC522 data sheet: supply voltage 2.5–3.6 V (quick reference data), absolute maximum 4.0 V (limiting values). <a href="https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf">nxp.com/docs/en/data-sheet/MFRC522.pdf</a></li>
          <li>MFRC522-python library (v0.0.7), <code>MFRC522.py</code>: SPI bus 0, device 0 (CE0), BOARD pin numbering, reset on pin 22 by default. <a href="https://github.com/pimylifeup/MFRC522-python">github.com/pimylifeup/MFRC522-python</a></li>
          <li>Raspberry Pi SPI0 pins: MOSI 19, MISO 21, SCLK 23, CE0 24; 3.3 V on pin 1, GND on pin 6. <a href="https://pinout.xyz/pinout/spi">pinout.xyz/pinout/spi</a></li>
        </ul>
        <p class="ocs__callout">Not verified on hardware yet: the wiring, the first read, and read range. All of it is planned until the parts arrive.</p>
      </div>
  </details>

  {% include presence-system-pager.html %}

  {% include presence-system-team.html %}
</div>
