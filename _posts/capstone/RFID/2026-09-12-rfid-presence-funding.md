---
microblog: true
toc: false
layout: post
title: RFID Presence, Funding & Budget
description: Bill of materials, cost estimates, and the funding ask by phase for the RFID + camera-correlated classroom presence project.
permalink: /capstone/rfid-presence/funding/
year: "2026-2027"
rp_active: funding
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
<div class="rfid-presence-header">
  <div class="ocs__badge">Funding &amp; Budget</div>
  <h1 class="rfid-presence-title">Bill of Materials &amp; Funding Ask</h1>
  <p class="ocs__description">What's already covered, what the next phase needs, and the itemized hardware behind it.</p>
</div>{% include rfid-presence-nav.html %}
<div class="ocs__card">
  <h3 class="ocs__section-title">Funding Need by Phase</h3>
  <div class="rfid-presence-table-wrap">
    <table class="ocs__table rfid-presence-table">
      <thead>
        <tr>
          <th>Phase</th>
          <th>Funding status</th>
          <th>What it needs</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Phase 1, Contact-Tap Prototype</td>
          <td>
            <span class="rfid-presence-pill rfid-presence-pill-good">No new funding needed</span>
          </td>
          <td>Runs on the CrowPi board and demo tags the team already has; see Phase 1 bill of materials below for the tag SKU.</td>
        </tr>
        <tr>
          <td>Phase 2, Classroom Pilot</td>
          <td>
            <span class="rfid-presence-pill rfid-presence-pill-warn">Small ask</span>
          </td>
          <td>Adhesive RFID stickers for the full class (20 or more units), applied one per playing card, same MIFARE Classic 1K family as the demo tags. No new reader hardware; see Phase 2 bill of materials below.</td>
        </tr>
        <tr>
          <td>Phase 3, UHF Doorway Transition</td>
          <td>
            <span class="rfid-presence-pill rfid-presence-pill-bad">Main ask, see bill of materials below</span>
          </td>
          <td>UHF Pi HAT, antenna, cable, and tamper-evident, on-metal, and UHF tags for a single door-table rig.</td>
        </tr>
        <tr>
          <td>Phase 4, Full Room-Scale</td>
          <td>
            <span class="rfid-presence-pill rfid-presence-pill-neutral">Future ask, quantities to be determined</span>
          </td>
          <td>A second reader and antenna set for the back door, plus higher-gain antennas and enclosures for full-room coverage. Sizing depends on the confirmed classroom's dimensions; see open questions below.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div class="ocs__card">
  <h3 class="ocs__section-title">Phase 1 Bill of Materials</h3>
  <p class="rfid-presence-about">Already covered by hardware the team has on hand. Listed here for reference and as the SKU to re-order from if more demo tags are needed, or to scale up for Phase 2.</p>
  <div class="rfid-presence-table-wrap">
    <table class="ocs__table rfid-presence-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Spec</th>
          <th>Est. cost</th>
          <th>Notes</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>MIFARE Classic 1K keychain RFID fob (pack of 10)</td>
          <td>ISO14443A, 13.56MHz, S50 chip, ABS+PC keychain fob, roughly 40&#215;30&#215;3mm</td>
          <td>$7.99 per 10-pack ($0.80/tag)</td>
          <td>The demo tags currently used with the CrowPi reader in Phase 1. Same MIFARE Classic 1K family Phase 2's real student tags will need, so this is also the reference SKU for scaling that order up.</td>
          <td>
            <a href="https://www.amazon.com/dp/B0F9FC5133" target="_blank" rel="noopener">Amazon</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div class="ocs__card">
  <h3 class="ocs__section-title">Phase 2 Bill of Materials</h3>
  <p class="rfid-presence-about">Adhesive stickers to apply one per playing card, one per student. Same MIFARE Classic 1K chip as the Phase 1 demo tags, so no reader changes are needed.</p>
  <div class="rfid-presence-table-wrap">
    <table class="ocs__table rfid-presence-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Spec</th>
          <th>Est. cost</th>
          <th>Notes</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>MIFARE Classic 1K round adhesive NFC/RFID sticker (pack of 40)</td>
          <td>ISO14443A, 13.56MHz, 1K byte memory, 1 inch (25mm) round, self-adhesive</td>
          <td>$7.97 per 40-pack (about $0.20/tag)</td>
          <td>Same chip family as the Phase 1 keychain tags, so it works with the existing CrowPi reader unchanged. Small enough to apply directly to a playing card face. One 40-pack comfortably covers a 20 to 34 student class with spares for misprints or reissues.</td>
          <td>
            <a href="https://www.amazon.com/Adhesive-Stickers-Self-Adhesive-Commercial-Proximity/dp/B0G1M659Q7" target="_blank" rel="noopener">Amazon</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div class="ocs__card">
  <h3 class="ocs__section-title">Phase 3 Bill of Materials</h3>
  <p class="rfid-presence-about">Room and door-table setup are confirmed; hardware itself is not purchased yet. The teacher supplied concrete RF specs for the initial door-table test rig below.</p>
  <div class="rfid-presence-table-wrap">
    <table class="ocs__table rfid-presence-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Spec</th>
          <th>Est. cost</th>
          <th>Notes</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Rainy UHF Pi HAT (Complete Kit)</td>
          <td>865 to 870MHz (EU) or 915 to 928MHz (US), up to 200 tags/sec, 18 to 26dBm adjustable power, EPC Gen2V2 / ISO 18000-63, Cortex-M4 (ThinkMagic M6e Nano)</td>
          <td>To be confirmed, check listing</td>
          <td>The kit our teacher linked. Compatible with Pi 3/4/5/Zero/Zero 2W.</td>
          <td>
            <a href="https://shop.sb-components.co.uk/products/rainy-uhf-pi-hat-complete-kit" target="_blank" rel="noopener">shop.sb-components.co.uk</a>
          </td>
        </tr>
        <tr>
          <td>Raspberry Pi 4 Kit with UHF HAT</td>
          <td>Bundles a Pi 4 with the HAT above</td>
          <td>To be confirmed, check listing</td>
          <td>Simpler single order if we don't already have a spare Pi.</td>
          <td>
            <a href="https://shop.sb-components.co.uk/products/raspberry-pi-4-kit-with-uhf-hat" target="_blank" rel="noopener">shop.sb-components.co.uk</a>
          </td>
        </tr>
        <tr>
          <td>U.FL (IPEX) to SMA female bulkhead pigtail cable</td>
          <td>RG178, roughly 10 to 15cm, kept short to avoid signal loss at 900MHz</td>
          <td>About $5 per pair</td>
          <td>Adapts the HAT's onboard U.FL connector to a standard SMA test antenna.</td>
          <td>
            <a href="https://www.amazon.com/Custom-Cables-Group-LLC-Bulkhead/dp/B01CWJ5JS4" target="_blank" rel="noopener">Amazon</a>
          </td>
        </tr>
        <tr>
          <td>Test antenna: 5dBi 900MHz omnidirectional whip, SMA male</td>
          <td>868/915MHz</td>
          <td>About $7 to $15</td>
          <td>Starting antenna for the door-table setup. Reader output power needs 20 to 26dBm; below that, range drops under 1m.</td>
          <td>
            <a href="https://us.amazon.com/NOYITO-900MHz-Antenna-Omnidirectional-Connector/dp/B07HLKKHCM" target="_blank" rel="noopener">Amazon</a>
          </td>
        </tr>
        <tr>
          <td>Tamper-evident UHF tag (self-destructive antenna)</td>
          <td>Antenna breaks on removal</td>
          <td>About $0.10 per tag</td>
          <td>Matches the tamper-proof requirement directly.</td>
          <td>
            <a href="https://www.rfidtagworld.com/products/Self-destructive-tag/Tamper-UHF-Tag/Tamper-UHF-Tag_4910.html" target="_blank" rel="noopener">rfidtagworld.com</a>
          </td>
        </tr>
        <tr>
          <td>On-metal UHF tag (anti-metal, pack of 10)</td>
          <td>ISO18000-6C, EPC Class1 Gen2, waterproof</td>
          <td>To be confirmed, check listing</td>
          <td>Confirmed good by teacher for laptop-lid mounting; standard UHF tags detune badly near metal.</td>
          <td>
            <a href="https://www.amazon.com/Metal-ISO18000-6C-Class1-Waterproof-Outdoor/dp/B079NM6GDN" target="_blank" rel="noopener">Amazon</a>
          </td>
        </tr>
        <tr>
          <td>Standard adhesive UHF inlay tag, Alien H3 chip (pack of 100)</td>
          <td>ISO18000-6C, long range</td>
          <td>About $0.15 to $0.25 per tag ($15 to $25 per pack)</td>
          <td>Teacher recommends Alien H3 or Impinj Monza 4/5 chips. Larger inlays reach 3 to 4m range; micro or button tags drop to 1 to 2m. Use on non-metal mount points.</td>
          <td>
            <a href="https://www.amazon.com/AZ9662-ISO18000-6C-Range-73-5x21-2mm-Adhesive/dp/B01LYBKMYM" target="_blank" rel="noopener">Amazon</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="ocs__callout">
  <strong>Rough Phase 3 estimate:</strong> the items with confirmed pricing above total roughly
  <strong>$30 to $50</strong>(cable, test antenna, and a small batch of tamper and Alien H3 tags). The Pi/HAT kit and on-metal tag pack prices still need to be pulled from their current listings before a full ask total can be finalized.</div>
</div>
<div class="ocs__card">
  <h3 class="ocs__section-title">Open Budget Questions</h3>
  <ul class="ocs__checklist">
    <li class="open">
      <span class="ocs__checklist-box"></span>
      <span>Sign-off: Phase 3 hardware purchase (HAT, cable, antenna, tags) still needs approval.</span>
    </li>
    <li class="open">
      <span class="ocs__checklist-box"></span>
      <span>Room measurements: actual dimensions and door layout of the confirmed classroom are needed to size the Phase 4 full-room antenna upgrade and produce a real cost estimate for that phase.</span>
    </li>
    <li class="open">
      <span class="ocs__checklist-box"></span>
      <span>Confirmed Pi/HAT and on-metal-tag pricing: current listing prices need to be pulled to finalize the Phase 3 total.</span>
    </li>
  </ul>
</div>
<div class="ocs__card">
<div class="ocs__team">
  <span class="ocs__team-label">Project Team</span>
  <span class="ocs__team-name">{{ data.Team | join: ", " }}</span>
</div>
<div class="ocs__status">Phase 1, Working Prototype</div>{% if data.Repo %}
<a href="{{ data.Repo }}" target="_blank" rel="noopener" class="ocs__btn accent fill">View Repo</a>{% endif %}</div></div>
<!-- markdownlint-enable MD033 MD010 MD012 -->
