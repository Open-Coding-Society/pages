---
microblog: true
toc: false
layout: post
title: Classroom Presence System, Roadmap
description: What works now, what's next, and what waits until the research data supports it.
permalink: /capstone/presence-system/phases/
year: "2026-2027"
rp_active: phases
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
{% assign data = site.data.presence_system_infograph %}
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Roadmap</div>
    <h1 class="rfid-presence-title">From contact tap to contactless presence</h1>
    <p class="ocs__description">What works now, what's next, and what waits until the data supports it.</p>
  </div>

  {% include presence-system-nav.html %}

<div class="ocs__card">
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead><tr><th>Issue</th><th>Mentor feedback</th><th>Status</th><th>Where it is</th></tr></thead>
        <tbody>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/10" target="_blank" rel="noopener">#10</a></td><td>Pacemakers and implants: check reader frequencies, cite research, opt-out</td><td><span class="ocs__status-pill ocs__status-pill--warn">Documented</span></td><td>Research page, <a href="/capstone/presence-system/summary/">Medical Device Considerations</a>. To do: datasheet and FCC ID</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/10" target="_blank" rel="noopener">#10</a></td><td>"Zero" teacher effort is inaccurate</td><td><span class="ocs__status-pill ocs__status-pill--good">Done</span></td><td>Research question and H3 now say very low effort: the teacher reviews exceptions</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/10" target="_blank" rel="noopener">#10</a></td><td>Phase 5: district cost research</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Planned</span></td><td>Phase 5 card below. Research only, not a build</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/10" target="_blank" rel="noopener">#10</a></td><td>Yearly time lost to attendance</td><td><span class="ocs__status-pill ocs__status-pill--good">Done</span></td><td><a href="/capstone/presence-system/">Overview</a>: about 30 hours a year. To do: measure the 10 minutes</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>CSSE sprints: Phase 3, then Phase 4 by MVP</td><td><span class="ocs__status-pill ocs__status-pill--warn">Draft</span></td><td>Sprint plan below. Confirm what Phase 3 and 4 mean</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>Deeper OCS integration</td><td><span class="ocs__status-pill ocs__status-pill--good">Merged</span></td><td>Presence API merged into OCS (PRs #96, #97); deploy pending. <a href="/capstone/presence-system/technical/">Technical</a> page updated</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>One story per page, cartoon and real (N@TM)</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Planned</span></td><td>For N@TM; not started</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>Keep the pipeline-page documentation style</td><td><span class="ocs__status-pill ocs__status-pill--good">Kept</span></td><td><a href="/capstone/presence-system/pipeline/">How It Works</a> is the template</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>Circular enclosure, open only at the tap area</td><td><span class="ocs__status-pill ocs__status-pill--warn">Designing</span></td><td><a href="/capstone/presence-system/tap-reader/">Tap Reader Build</a>: requirements and test plan</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>Measure and scale the 3D-printed parts</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Planned</span></td><td>Tap Reader Build: measure, test print, then final print</td></tr>
        </tbody>
      </table>
    </div>
    <p class="ocs__description">Mentor feedback tracker: what we heard in the first two reviews, and where each item stands.</p>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pipeline-roadmap.svg" alt="Where it&#x27;s going. Now: tap the laptop tag on the CrowPi, working. Next: tap plus a camera face check. Later: walk through the front or back door and a UHF reader reads the laptop tag automatically.">
    <p class="ocs__description">Where it's going: today a tap, next a face check, later no tap at all.</p>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pipeline-plan.svg" alt="Plan: done through October 11, today&#x27;s review, camera around October 19, second tap reader, Cycle 1 minutes accuracy, then a classroom pilot.">
    <p class="ocs__description">Plan: next up is the camera with the Jarvis team.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead><tr><th>Part</th><th>Status</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td>Tap reader</td><td><span class="ocs__status-pill ocs__status-pill--good">Working</span></td><td>Raspberry Pi 4 with a Waveshare PN532 NFC HAT, S50 cards</td></tr>
          <tr><td>Presence API in OCS</td><td><span class="ocs__status-pill ocs__status-pill--good">Merged</span></td><td>PRs #96 and #97: rooms, schedules in the database, backup/restore</td></tr>
          <tr><td>Deploy to the OCS server</td><td><span class="ocs__status-pill ocs__status-pill--warn">Pending</span></td><td>With the OCS deploy team</td></tr>
          <tr><td>Live dashboard</td><td><span class="ocs__status-pill ocs__status-pill--warn">Local</span></td><td>Works on our local OCS; goes live with the Pages PR after deploy</td></tr>
          <tr><td>Self-registration</td><td><span class="ocs__status-pill ocs__status-pill--warn">Built</span></td><td>Students register their own card; PR after deploy</td></tr>
          <tr><td>Camera check</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Next</span></td><td>Jarvis team; date to be set</td></tr>
          <tr><td>Enclosure</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Designing</span></td><td>Circular, open only at the tap area</td></tr>
        </tbody>
      </table>
    </div>
    <p class="ocs__description">Status today: what works, what's next, and what's ordered.</p>
  </div>

  <div class="ocs__card">
    <div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><thead><tr><th>Stage</th><th>What it was</th></tr></thead><tbody><tr><td>Classroom pilot</td><td>Hardening the tap system for a real class period: a deck of RFID-stickered playing cards (one per student), a production backend and admin dashboard, real auth, off SQLite.</td></tr><tr><td>UHF doorway transition</td><td>Swap the tap pad for contactless UHF reads at a single door-table rig, tags mounted on laptops instead of tapped, and the start of a Camera Events contract with the face-scanning system.</td></tr><tr><td>Full room-scale presence</td><td>Front and back door UHF detection, full RFID and camera correlation, the complete presence-state machine (present, tardy, stepped out, left early, opted out, tamper) running live in the trial room.</td></tr></tbody></table></div>
    <p class="ocs__description">Later stages. These were paused until the research data supported them; after the 10/12 review the direction is to move into Phase&nbsp;3 and reach Phase&nbsp;4 by MVP (sprint plan below).</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead><tr><th>Sprint</th><th>Goal</th><th>Phase</th><th>Demo at the end</th><th>Owner</th></tr></thead>
        <tbody>
          <tr><td>1 (done, Oct 5&ndash;20)</td><td>OCS integration: presence API merged into OCS, generic rooms, schedules in the database, backup/restore, Pi&nbsp;4 PN532 reader, S50 cards</td><td>2 (classroom pilot) started</td><td>Tap a card, OCS dashboard shows Present in about 2 seconds</td><td>Vibha</td></tr>
          <tr><td>2 (next)</td><td>Deployed pilot: OCS deploy, dashboard and self-registration on Pages, production room and cards, enclosure v1 test print, camera connection with Jarvis</td><td>2 (classroom pilot) done</td><td>A real class period tracked on deployed OCS; students register their own cards</td><td>assign</td></tr>
          <tr><td>3</td><td>Doorway reader and research Cycle&nbsp;1: reader at the door for enter and exit, minutes compared with a hand log (H2), camera face check on taps</td><td>3</td><td>Minutes report for one class next to the hand log</td><td>assign</td></tr>
          <tr><td>4 (MVP)</td><td>Room-scale presence: RFID and camera correlated, presence states live, teacher reviews exceptions only (H3 measured)</td><td>4</td><td>One class period run end to end, teacher effort timed</td><td>assign</td></tr>
        </tbody>
      </table>
    </div>
    <p class="ocs__description">CSSE sprint plan (draft): each sprint has a goal, a phase, and a demo. Dates and owners to set; confirm with the mentor what Phase&nbsp;3 and Phase&nbsp;4 mean (the hardware stages above, or a renumbered plan).</p>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">Phase 5: district deployment feasibility (research, not a build)</h3>
    <p class="rfid-presence-about">From the first peer review (<a href="https://github.com/vibha1019/crowpi-attendance/issues/10" target="_blank" rel="noopener">#10</a>): what would it cost PUSD to run this for every classroom once Phase&nbsp;4 works?</p>
    <ul class="ocs__checklist">
      <li class="open"><span class="ocs__checklist-box"></span><span>Hosting: cloud, district servers, or a hybrid (processing on each Pi, central storage).</span></li>
      <li class="open"><span class="ocs__checklist-box"></span><span>Hardware per classroom at scale: readers, cameras, Pis, cards per student, and bulk pricing.</span></li>
      <li class="open"><span class="ocs__checklist-box"></span><span>Running costs: replacement cards, failed hardware, IT staff time, monitoring and updates.</span></li>
      <li class="open"><span class="ocs__checklist-box"></span><span>Privacy and compliance: FERPA and California student data law (encryption, audits, retention limits).</span></li>
      <li class="open"><span class="ocs__checklist-box"></span><span>Compare the yearly cost with the instructional time recovered (about 30 hours per class per year, see the Overview).</span></li>
    </ul>
    <p class="rfid-presence-about">Back-of-envelope, with placeholder numbers: about 20 events per student per day &times; 35,000 students &times; 180 days &asymp; 126 million events a year; at about 200 bytes each that is roughly 25&nbsp;GB, which is small. The real costs are likely hardware, camera processing, and staff time, not storage. Replace the placeholders with PUSD enrollment and measurements from our own logs.</p>
  </div>

  <details>
    <summary>Talking points and details</summary>

    <div class="ocs__card">
      <h3 class="ocs__section-title">How the build is staged</h3>
      <p class="rfid-presence-about">The hardest part of this project, antennas that reliably detect presence without a tap, is deliberately last. The build is staged so each phase produces something usable and testable on its own.</p>
    </div>
    <div class="ocs__card"><p class="rfid-presence-about"><strong>Phase 1 reflects the current working prototype.</strong> This is a hardware rollout roadmap, a different axis from the research cycles in the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a>. See <a href="/capstone/presence-system/summary/">Research</a> for how the project's framing itself changed.</p></div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Plan, with dates</h3>
      <ul class="ocs__checklist">
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Sep</strong> CrowPi tap reaches OCS</span></li>
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Oct 5</strong> Shared presence API, bell schedule, live dashboard</span></li>
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Oct 6</strong> Camera endpoints ready on our side</span></li>
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Oct 11</strong> Live demo working</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>Oct 16</strong> Camera connection test (Jarvis)</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>~Oct 19</strong> Camera face check on every tap</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>TBD</strong> Second tap reader (ordered)</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>TBD</strong> Cycle 1: minutes within 2 min of a hand log (H2)</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>TBD</strong> Classroom pilot</span></li>
      </ul>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Later, If Data Supports It</h3>
      <p class="rfid-presence-about">The <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a> explicitly pauses this hardware work until the research cycles show which input is actually worth deepening: "None of it answers a research question until data shows RFID is the right input." Kept here as a condensed record of the plan, not an active workstream.</p>
    </div>
    <div class="ocs__card"><h3 class="ocs__section-title">Hardware phases</h3><div class="ocs__diagram"><pre class="mermaid">%%{init: { "flowchart": { "htmlLabels": false, "diagramPadding": 16 } } }%%
flowchart LR
    	P1["Phase 1
    Contact-Tap Prototype
    current"] -.next: see the sprint plan.-> LATER["Later, if data
    supports it:
    UHF, room-scale"]</pre></div></div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Phase 1: goal</h3>
      <p class="rfid-presence-about">Prove the core read, log, and dashboard loop end to end, cheaply, before investing in UHF hardware or camera integration.</p>
    </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Phase 1: how it works today</h3>
        <div class="ocs__diagram">
          <pre class="mermaid">%%{init: { "flowchart": { "htmlLabels": false, "diagramPadding": 16 } } }%%
flowchart LR
        S["Student taps
    their card"] --> R["CrowPi scan pad
    13.56MHz MIFARE"]
        R --> F["Flask backend
    logs UID + timestamp"]
        F --> DB[(SQLite)]
        DB --> D["Dashboard
    shows scan events"]</pre>
        </div>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Phase 1: what's running</h3>
        <ul class="ocs__entity-list">
          <li><strong>Reader</strong>: CrowPi board, one scan pad</li>
          <li><strong>Tags</strong>: 13.56MHz MIFARE Classic, 10 demo tags</li>
          <li><strong>Backend</strong>: Flask dev server</li>
          <li><strong>Database</strong>: SQLite</li>
          <li><strong>Frontend</strong>: rough scan-event dashboard</li>
        </ul>
        <div class="ocs__callout">
          Contact-based (tap), single reader, no camera correlation yet. This validates the concept, not the target hardware described on the <a href="/capstone/presence-system/technical/">Technical</a> page. See <a href="/capstone/presence-system/phases/">Roadmap</a> for the demo tag SKU.
        </div>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Phase 1: acceptance criteria</h3>
        <ul class="ocs__checklist">
          <li class="done"><span class="ocs__checklist-box"></span><span>CrowPi board with one scan pad, 13.56MHz MIFARE Classic tags, 10 demo tags</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Basic Flask backend logging reads to SQLite</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Rough dashboard showing scan events</span></li>
        </ul>
      </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Funding overview</h3>
      <p class="rfid-presence-about">What's already covered, and the itemized hardware behind the RFID track. Later hardware stages are priced for reference but are not an active funding ask; see the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a> for why that work is paused.</p>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Current Funding Status</h3>
      <div class="rfid-presence-table-wrap">
        <table class="ocs__table rfid-presence-table">
          <thead>
            <tr>
              <th>Stage</th>
              <th>Funding status</th>
              <th>What it needs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Contact-Tap Prototype (current)</td>
              <td>
                <span class="rfid-presence-pill rfid-presence-pill-good">No new funding needed</span>
              </td>
              <td>Runs on the CrowPi board and demo tags the team already has; see bill of materials below for the tag SKU.</td>
            </tr>
            <tr>
              <td>Later hardware stages</td>
              <td>
                <span class="rfid-presence-pill rfid-presence-pill-neutral">No active ask, paused</span>
              </td>
              <td>Priced below for reference. Not requested until the research cycles show this hardware is worth building.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Current Bill of Materials</h3>
      <p class="rfid-presence-about">Already covered by hardware the team has on hand. Listed here for reference and as the SKU to re-order from if more demo tags are needed.</p>
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
              <td>The demo tags currently used with the CrowPi reader. Same MIFARE Classic 1K family the real student tags would need if the classroom pilot resumes, so this is also the reference SKU for scaling that order up.</td>
              <td>
                <a href="https://www.amazon.com/dp/B0F9FC5133" target="_blank" rel="noopener">Amazon</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Paused Hardware Stages, Priced for Reference</h3>
      <p class="rfid-presence-about">Not an active funding ask. Priced now so a real number exists if the research cycles show this hardware is worth building; see the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a> for why it's paused.</p>
      <h4>Classroom pilot: adhesive tags</h4>
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
              <td>Same chip family as the current keychain tags, so it works with the existing CrowPi reader unchanged. Small enough to apply directly to a playing card face. One 40-pack comfortably covers a 20 to 34 student class with spares for misprints or reissues.</td>
              <td>
                <a href="https://www.amazon.com/Adhesive-Stickers-Self-Adhesive-Commercial-Proximity/dp/B0G1M659Q7" target="_blank" rel="noopener">Amazon</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h4>UHF doorway transition</h4>
      <p class="rfid-presence-about">Room and door-table setup are confirmed. The teacher supplied concrete RF specs for the initial door-table test rig below.</p>
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
      <strong>Rough UHF-stage estimate:</strong> the items with confirmed pricing above total roughly
      <strong>$30 to $50</strong> (cable, test antenna, and a small batch of tamper and Alien H3 tags), reference pricing only, not a current request. The Pi/HAT kit and on-metal tag pack prices still need to be pulled from their current listings before a full estimate can be finalized, whenever this stage actually resumes.</div>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Open Questions, If This Stage Resumes</h3>
      <ul class="ocs__checklist">
        <li class="open">
          <span class="ocs__checklist-box"></span>
          <span>Room measurements: actual dimensions and door layout of the confirmed classroom would be needed to size a full-room antenna upgrade and produce a real cost estimate.</span>
        </li>
        <li class="open">
          <span class="ocs__checklist-box"></span>
          <span>Confirmed Pi/HAT and on-metal-tag pricing: current listing prices would need to be pulled to finalize a real total.</span>
        </li>
      </ul>
    </div>
  </details>

  {% include presence-system-pager.html %}

  {% include presence-system-team.html %}
</div>
