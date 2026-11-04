---
microblog: true
toc: false
layout: post
title: "Classroom Presence System, Funding"
description: The $700 one-door pilot, the funding proposal spreadsheet, and what each piece of equipment in the room is for.
permalink: /capstone/presence-system/funding/
year: "2026-2027"
rp_active: funding
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Funding</div>
    <h1 class="rfid-presence-title">Funding &amp; pilot equipment</h1>
    <p class="ocs__description">The $700 one-door pilot, the full funding proposal, and what each piece of equipment in the room is for.</p>
  </div>

  {% include presence-system-nav.html %}

  <div class="ocs__card">
    <h2 class="ocs__section-title">$700 one-door pilot</h2>
    <p class="rfid-presence-about">A contactless doorway reader and a face-check camera for one classroom: students walk in and are logged automatically, with no roll call and no tapping a card. <span class="rfid-presence-pill rfid-presence-pill-good">Ordered, in the room</span></p>
    <div class="rfid-presence-table-wrap">
      <table class="ocs__table rfid-presence-table">
        <tbody>
          <tr><td>Hardware subtotal</td><td>$591.67</td></tr>
          <tr><td>Contingency (10%)</td><td>$59.17</td></tr>
          <tr><td>Total</td><td>$650.84</td></tr>
          <tr><td><strong>Funding request</strong> (rounded up to the nearest $50)</td><td><strong>$700.00</strong></td></tr>
        </tbody>
      </table>
    </div>
    <p class="rfid-presence-about">Why it's worth it: taking attendance costs a teacher about 5 minutes a day, roughly 15 hours of paid time a year (about $1,190 per teacher). Across Del Norte's ~103 teachers that is about $123,000 a year. At the base case the pilot pays for itself in about 105 school days.</p>
  </div>

  <div class="ocs__card">
    <h2 class="ocs__section-title">Funding proposal spreadsheet</h2>
    <p class="rfid-presence-about">Every item with quantity, price, store link, and order status.</p>
    <div class="rfid-presence-embed rfid-presence-embed-sheet">
      <iframe src="https://drive.google.com/file/d/1prCG_1tLLDGuew3H_XxS5xsiD1HVYux3/preview" title="Presence System funding proposal spreadsheet" loading="lazy"></iframe>
    </div>
    <a class="ocs__btn pill accent fill" href="https://docs.google.com/spreadsheets/d/1prCG_1tLLDGuew3H_XxS5xsiD1HVYux3/edit?gid=72123385#gid=72123385" target="_blank" rel="noopener">Open the spreadsheet</a>
  </div>

  <div class="ocs__card" id="pilot-equipment">
      <h3 class="ocs__section-title">Pilot Equipment (in the room)</h3>
      <p class="rfid-presence-about">The $700 one-door pilot (about $592 of hardware plus a 10% contingency) has been ordered, and the equipment is in the classroom. If you are picking up this project, this is what each piece is for. Prices, store links, and order status are in the spreadsheet above.</p>
      <div class="rfid-presence-table-wrap">
        <table class="ocs__table rfid-presence-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>What it's for</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Rainy UHF RFID HAT (5.5 dBi antenna)</td><td>The doorway reader. Snaps onto the Raspberry Pi and reads laptop tags from a few feet away, so students don't tap anything.</td><td>1</td></tr>
            <tr><td>DS3231 real-time clock</td><td>Keeps the Pi's clock accurate after it loses power. Minutes-present numbers are wrong if timestamps drift.</td><td>1 (4-pack, spares included)</td></tr>
            <tr><td>On-metal UHF laptop tags</td><td>The stickers for real laptops. Ordinary UHF tags stop working on a metal lid; these are built for metal.</td><td>40</td></tr>
            <tr><td>On-metal tag sample pack (5 sizes)</td><td>For testing which tag size reads best on real laptop lids before tagging the whole class.</td><td>1</td></tr>
            <tr><td>Practice UHF tags</td><td>Cheap tags for testing read range and angles. Use these, not the on-metal tags, for experiments.</td><td>100</td></tr>
            <tr><td>Self-destructive tamper UHF tags</td><td>Break if someone peels them off, so a tag can't be handed to a friend. Paper tags, so they may not read well on metal.</td><td>40</td></tr>
            <tr><td>Light stands, 2-pack</td><td>One holds the reader and antenna at the door, the other holds the face-check camera. No drilling into school walls.</td><td>1 pack</td></tr>
            <tr><td>Heavy-duty adhesive strips</td><td>Attach the antenna and reader to the stands and the door frame without screws.</td><td>8 sets</td></tr>
            <tr><td>Logitech MX Brio 4K webcam</td><td>The face-check camera. Plugs into the Mac mini and compares each student's face with their registered photo, so a tag handed to a friend gets caught.</td><td>1</td></tr>
            <tr><td>Elgato Key Light Neo + Neo Stand</td><td>Even, soft light on faces at the door, the cheapest way to make face matching more accurate. The stand holds the light at face height.</td><td>1 each</td></tr>
            <tr><td>Reusable cable ties</td><td>Keep the camera cable and power cords tidy and out of the doorway so no one trips.</td><td>100-pack</td></tr>
          </tbody>
        </table>
      </div>
    </div>


  {% include presence-system-pager.html %}

  {% include presence-system-team.html %}
</div>
