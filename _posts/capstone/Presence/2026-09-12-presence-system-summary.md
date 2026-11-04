---
microblog: true
toc: false
layout: post
title: Classroom Presence System, Research
description: The research question, hypotheses, research cycles, and how results are checked against ground truth.
permalink: /capstone/presence-system/summary/
year: "2026-2027"
rp_active: summary
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
{% assign data = site.data.presence_system_infograph %}
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Research</div>
    <h1 class="rfid-presence-title">Can classroom presence be measured with very low teacher effort?</h1>
    <p class="ocs__description"><strong>Can classroom presence be measured with very low teacher effort?</strong> Four hypotheses, tested in design-based research cycles against a hand-logged ground truth.</p>
  </div>

  {% include presence-system-nav.html %}

  <div class="ocs__card">
    <div class="ocs__grid ocs__grid--card">
      <div class="ocs__grid-cell">
        <span class="ocs__badge">H1</span>
        <p><strong>Presence accuracy at least as good as roll call</strong></p>
        <p>Low-risk claim, roll call's own bar is low.</p>
      </div>
      <div class="ocs__grid-cell">
        <span class="ocs__badge">H2</span>
        <p><strong>Minutes within 2 min of ground truth per period</strong></p>
        <p>Genuinely tight for a tap mechanism: accuracy depends on when a student remembers to tap, not continuous sensing. This may get rejected for contact-tap specifically, which would still be a real, useful finding.</p>
      </div>
      <div class="ocs__grid-cell">
        <span class="ocs__badge">H3</span>
        <p><strong>Very low teacher effort: the teacher reviews exceptions instead of taking attendance</strong></p>
        <p>"Zero" overstated it (mentor feedback): exceptions still need a person, such as a forgotten or dead card, a visitor, a substitute, or a schedule change. Target to measure, not assume: under 1 minute per period on typical days. One-time setup (enrollment, card registration) is counted separately.</p>
      </div>
      <div class="ocs__grid-cell">
        <span class="ocs__badge">H4</span>
        <p><strong>A combination of inputs beats any single input</strong></p>
        <p>Supported by the sensor-fusion literature already cited, but a poorly correlated combination can introduce more failure points than either signal alone. Testing this, not assuming it.</p>
      </div>
    </div>
    <p class="ocs__description">Four hypotheses. Each research cycle below tests one of them.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__diagram"><pre class="mermaid">%%{init: { "flowchart": { "htmlLabels": false, "diagramPadding": 16 } } }%%
flowchart LR
		C0["Cycle 0, done
RFID reader to OCS
Tested: can a tap reach OCS?
Issue #3"] --> C1["Cycle 1, tests H2
Input-agnostic API, roster, minutes
Measure roll call baseline
minutes correct?"]
		C1 --> C2["Cycle 2, tests H3
Who's missing view and report
Short class trial, RFID only
teacher does nothing?"]
		C2 --> C3["Cycle 3, tests H4
Add QR or face to same API
Side by side with RFID
which input wins?"]
		C3 --> C4["Cycle 4, tests H1 + main
Classroom pilot
2 to 4 weeks, one class
H1 to H4 decided"]</pre></div>
    <p class="ocs__description">Research cycles: each one tests a hypothesis. Cycle 0, a tap reaching OCS, is done.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__diagram"><pre class="mermaid">%%{init: { "flowchart": { "htmlLabels": false, "diagramPadding": 16 } } }%%
flowchart LR
		RFID["RFID tap"] --> API[One Event API
student, room, time, direction]
		QR["QR scan"] --> API
		FACE["Face scan"] --> API
		API --> ENGINE[Presence Engine
+ bell schedule + roster]
		ENGINE --> MISSING["Who's missing now"]
		ENGINE --> MINUTES["Minutes report"]</pre></div>
    <p class="ocs__description">The intervention: every input feeds one event API, and the outputs are measured against ground truth.</p>
  </div>

  <div class="ocs__card">
    <div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><tbody><tr><td>Ground Truth</td><td>A student observer hand-logs every entry and exit; a second observer checks them, a standard dual-rater design.</td></tr><tr><td>Measures</td><td>Agreement rate, minutes error, teacher actions per period, missed and false events per input, teacher and student survey.</td></tr><tr><td>Findings</td><td>Each hypothesis is accepted or rejected, with limitations and design lessons carried back into OCS, not just a pass/fail on RFID.</td></tr></tbody></table></div>
    <p class="ocs__description">Ground truth: a student observer's hand log is the answer key the system is scored against.</p>
  </div>

  <div class="ocs__card">
    <div class="rfid-presence-table-wrap">
      <table class="ocs__table rfid-presence-table">
        <thead><tr><th>When</th><th>Change</th><th>Why</th></tr></thead>
        <tbody>
          <tr>
            <td>Phase 1</td>
            <td>Built a single-input, contact-tap RFID prototype: CrowPi reader, Flask backend, dashboard.</td>
            <td>Prove the core read-log-display loop end to end, cheaply, before investing in harder hardware. See <a href="https://github.com/vibha1019/crowpi-attendance/issues/3" target="_blank" rel="noopener">Issue&nbsp;#3</a>.</td>
          </tr>
          <tr>
            <td>2026-09-18</td>
            <td>Reframed the project around a research question instead of a technology. Added hypotheses H1&ndash;H4, a design-based research cycle plan, and a ground-truth evaluation methodology.</td>
            <td>Review feedback pointed out the project had drifted into "an RFID project" rather than a presence system, and was missing key objectives visible in the teacher communication and survey. See the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a>.</td>
          </tr>
          <tr>
            <td>2026-10-12</td>
            <td>Second mentor review. Adopted his direction: CSSE sprints toward Phase&nbsp;4 by MVP, deeper OCS integration, one story per page with cartoon and real versions for N@TM, and a circular enclosure that is open only at the tap area.</td>
            <td>See the feedback tracker on the <a href="/capstone/presence-system/phases/">Roadmap</a> page and <a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">issue #15</a>.</td>
          </tr>
          <tr>
            <td>2026-10-19</td>
            <td>Integrated into OCS upstream: the presence API was merged into the shared OCS backend (PRs #96 and #97) with generic rooms, schedules in the database instead of code, Resource-style endpoints, and backup/restore. Switched the reader to a Raspberry Pi&nbsp;4 with a Waveshare PN532 NFC HAT and S50 cards.</td>
            <td>Mentor feedback asked for visible progress integrating with OCS, and for rooms (not just classrooms) so it also works for events. The PN532 HAT plugs straight onto the Pi, with no loose wiring.</td>
          </tr>
          <tr>
            <td>2026-09-21</td>
            <td>Split into three parallel input tracks, RFID, QR, and face scan, each with an owner: Vibha (RFID), Ruta (QR), Kush (Camera). Added a shared index issue and moved cross-cutting requirements (attendance reporting, roster import, door monitor) out of any single track.</td>
            <td>RFID alone can't answer RQ4 (which input works best) or test H4 (does combining inputs beat any single one). The three tracks needed to exist and be comparable before Cycle&nbsp;3 could run. See the <a href="https://github.com/vibha1019/crowpi-attendance/issues/9" target="_blank" rel="noopener">Presence System Index</a>.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="ocs__description">Iterations: how the project's framing changed, and why.</p>
  </div>

  <details>
    <summary>Talking points and details</summary>

    <div class="ocs__card">
      <h3 class="ocs__section-title">Design-Based Research Cycles</h3>
      <p class="rfid-presence-about">Each cycle: question, build, test, analyze, reflect, repeat if it fails.</p><div class="ocs__callout">Cycle 1 requires an input-agnostic API. What's built today (<a href="/capstone/presence-system/technical/">Technical</a>) is explicitly RFID-shaped, an <code>/api/rfid/scan</code> endpoint and an <code>RfidTag</code> model in OCS. That needs generalizing to a generic presence-event API before QR or face can plug into the same pipeline in Cycle 3. Flagged now so it's planned rather than discovered mid-cycle.</div>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">The Intervention Being Tested</h3>
      <p class="rfid-presence-about">RFID tap, QR scan, and face scan are the independent variable. Who's missing now and the minutes report are the dependent variables, measured against ground truth below.</p>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Evaluating Against Ground Truth</h3>
      <div class="ocs__callout">The hand-logging ground truth is new data collection beyond what the existing privacy and governance decisions (<a href="/capstone/presence-system/summary/">Research</a>) currently cover, opt-in face scanning and team's-own-data-only testing. It needs its own consent treatment before the Cycle&nbsp;4 classroom pilot runs, not an assumption that it's already covered.</div>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">About the iterations log</h3>
      <p class="rfid-presence-about">Design-based research runs in cycles of build, test, reflect, and redesign (see the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a>). This page is that reflect-and-redesign step made visible, instead of scattered as "used to be X" notes across the other pages.</p>
    </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">The Idea, in One Paragraph</h3>
        <p class="rfid-presence-question">The goal is to know each student's actual instructional minutes in the room and who's currently missing, without a teacher taking or visually verifying attendance. Three inputs are being evaluated toward that goal: RFID tap (Vibha), QR scan (Ruta), and face scan (Kush), each tracked separately in the <a href="https://github.com/vibha1019/crowpi-attendance/issues/9" target="_blank" rel="noopener">Presence System Index</a>. The rest of this page zooms into the most-developed pairing so far: RFID tap correlated with an existing face-scanning camera system built by a teammate on another OCS project.</p>
        <p class="rfid-presence-question">Mount a tamper-evident RFID tag on each student's own laptop, not a wearable badge, since laptops are far less likely to be left in a locker, and read it at the classroom door. That tells us the <strong>device</strong> is present. The camera separately tells us the <strong>student</strong> is present. Neither signal alone is trustworthy attendance: a laptop can sit in the room while its owner is in the bathroom, and a face can be recognized without the device belonging to that class period. Correlating RFID and camera against the bell schedule and per-period roster produces a real presence determination for that pairing.</p>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Why the RFID + Camera Pairing Is Designed This Way</h3>
        <div class="rfid-presence-table-wrap">
          <table class="ocs__table rfid-presence-table">
            <thead><tr><th>Decision</th><th>In plain terms</th></tr></thead>
            <tbody>
              <tr><td>Tag on the <strong>laptop</strong>, not a badge</td><td>Students carry laptops to every class and rarely leave them behind. A badge is far easier to forget or leave in a bag.</td></tr>
              <tr><td>RFID + camera, not RFID alone</td><td>RFID proves the device is in the room. Camera proves the person is. Both are needed to know the student is actually present.</td></tr>
              <tr><td>Tamper-evident tags</td><td>The tag's antenna physically breaks if peeled off, so a student can't hand their tag to a friend to fake attendance.</td></tr>
              <tr><td>Attendance counted only in a bell-schedule window</td><td>A tag read in the hallway an hour later doesn't get mistaken for attendance in that period.</td></tr>
              <tr><td>States beyond present/absent (for example "stepped out")</td><td>Real classrooms have bathroom breaks and late arrivals. A binary present/absent flag would misreport both as absences.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="ocs__callout">
          The full technical rationale, state model, and data schema are on the <a href="/capstone/presence-system/technical/">Technical</a> page.
        </div>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Privacy, Scope &amp; Governance</h3>
        <p class="rfid-presence-about">Set by the teacher in the room-approval discussion. These are the boundaries mentors should know the project operates inside.</p>
        <ul class="ocs__checklist">
          <li class="done"><span class="ocs__checklist-box"></span><span>A student can always opt out of tapping and be checked in manually by the teacher, for medical or any other reason (see Medical Device Considerations below).</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Face scanning is opt-in. A student can decline and still get correct device-only presence tracking. That is a policy choice, not a system failure.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Scope is one CS classroom, for now. No wider rollout is planned or implied at this stage.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>The project is fully open. Implementation is shared with anyone who asks, and nothing is treated as confidential.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Security review is mentor-led rather than a formal school-IT process, given the single-room scope and open-sharing policy.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Testing uses only the team's own data. No real student data is used beyond what the team itself provides.</span></li>
        </ul>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Where It Stands Today</h3>
        <p class="rfid-presence-about">The RFID track has a working tap reader: a Raspberry Pi&nbsp;4 with a Waveshare PN532 NFC HAT reading S50 (MIFARE Classic) cards at 13.56&nbsp;MHz. The presence API it posts to is merged into the shared OCS backend (PRs #96 and #97), with rooms, schedules stored in the database, and backup/restore for upgrades. Deployment to the OCS server is pending. End to end (tap, OCS backend, live dashboard showing Present within about 2 seconds) runs on our local copy of OCS today.</p>
        <div class="ocs__callout">
          What comes next, and the mentor feedback it answers, is on the <a href="/capstone/presence-system/phases/">Roadmap</a> page.
        </div>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Medical Device Considerations</h3>
        <p class="rfid-presence-about">Raised in our first peer review (<a href="https://github.com/vibha1019/crowpi-attendance/issues/10" target="_blank" rel="noopener">issue #10</a>): some people, such as those with pacemakers or implantable cardioverter-defibrillators (ICDs), may be sensitive to RFID readers.</p>
        <div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table">
          <thead><tr><th>Reader</th><th>Band</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Waveshare PN532 NFC HAT</td><td>HF, 13.56&nbsp;MHz, contact range (a few cm)</td><td>In use now</td></tr>
            <tr><td>RC522 board (CrowPi built-in, earlier plan)</td><td>HF, 13.56&nbsp;MHz</td><td>Earlier prototype</td></tr>
            <tr><td>UHF doorway reader</td><td>UHF, 902&ndash;928&nbsp;MHz (US)</td><td>Later phases only, not built</td></tr>
          </tbody>
        </table></div>
        <p class="rfid-presence-about">The system is <strong>not</strong> UHF today; every reader we run is HF. An FDA-led lab study (Seidman et al., <em>Heart Rhythm</em> 7(1), 2010) tested 15 pacemakers and 15 ICDs against low-frequency (134&nbsp;kHz), high-frequency (13.56&nbsp;MHz), and UHF (915&nbsp;MHz) readers. Low-frequency readers caused most reactions. High-frequency readers, like ours, caused reactions in 6% of pacemaker tests and 1% of ICD tests, only at close range (at most 22.5&nbsp;cm for pacemakers and 7.5&nbsp;cm for ICDs). UHF caused none. The authors and the FDA did not consider it an urgent public health risk, and the FDA had no field reports of RFID interference with these devices. The FDA's advice to patients who feel symptoms near a reader is to move away and contact their doctor.</p>
        <ul class="ocs__checklist">
          <li class="done"><span class="ocs__checklist-box"></span><span>Readers are mounted at the door at hand height, where people pass through briefly, not where anyone sits or stands for long.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>A tap is a short read at a few centimeters; the reader is not used for long-range or continuous scanning.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Opt-out: any student can skip tapping and be checked in manually by the teacher.</span></li>
          <li class="open"><span class="ocs__checklist-box"></span><span>To do: cite the PN532 HAT's datasheet (frequency, transmit power) and FCC ID.</span></li>
          <li class="open"><span class="ocs__checklist-box"></span><span>To do: before any UHF phase, note where the reader sits within FCC Part 15 power limits and keep transmit power at the minimum that reads reliably.</span></li>
        </ul>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Prior Research &amp; Comparable Systems</h3>
        <p class="rfid-presence-about">This research is specific to the RFID and camera pairing above; QR has a separate, much smaller literature base not yet reviewed here. A survey of academic work, related patents, commercial products, and regulatory sources reviewed before finalizing this design, covering classroom attendance systems directly and the underlying RF, sensor-fusion, and UX questions the design depends on (on-body tag reliability, antenna diversity, tag co-location interference, clock synchronization, and audible read confirmation). This is a September 2026 research snapshot, not a formal literature review or patent-clearance search; a proper IP-clearance pass should happen before any claim of novelty is made publicly.</p>

        <h3 class="ocs__section-title">Academic literature</h3>
        <div class="rfid-presence-table-wrap">
          <table class="ocs__table rfid-presence-table">
            <thead><tr><th>Paper</th><th>What it does</th><th>How this project differs</th></tr></thead>
            <tbody>
              <tr>
                <td><a href="https://www.researchgate.net/publication/357706883_In-Classroom_Faculty_Attendance_Monitoring_System_based_on_Ultra_High_Frequency_UHF_Radio_Frequency_Identification_RFID_with_Captured_Image_Cross-verification_Mechanism" target="_blank" rel="noopener">In-Classroom Faculty Attendance Monitoring System Based on UHF RFID with Captured Image Cross-verification</a></td>
                <td>The closest prior work found: UHF RFID reads paired with a captured image for cross-verification.</td>
                <td>Targets faculty, with a single-signal cross-check at read time. This project models device and person as two continuously tracked signals over a full period (bathroom breaks, tardies, opt-outs), with a bell-schedule-bound attendance window and tag lifecycle handling the paper doesn't cover.</td>
              </tr>
              <tr>
                <td><a href="https://arxiv.org/abs/2604.22697" target="_blank" rel="noopener">RFID-Based Non-Biometric Classroom Attendance System: Proxy Attendance Detection via Weight Sensor Integration</a></td>
                <td>Adds weight sensors to catch "buddy punching," where one student taps a friend's tag, without biometrics.</td>
                <td>Addresses the same proxy-attendance concern this project handles with tamper-evident tags (antenna breaks on removal), using a different mechanism worth comparing tradeoffs against.</td>
              </tr>
              <tr>
                <td><a href="https://www.researchgate.net/publication/308537776_The_Possibility_of_Using_RFID_System_to_Automate_and_Integrate_the_Attendance_of_Professors_and_Students_in_the_Classroom" target="_blank" rel="noopener">The Possibility of Using RFID System to Automate and Integrate the Attendance of Professors and Students in the Classroom</a></td>
                <td>General single-signal RFID-tap attendance automation.</td>
                <td>No second signal to verify the person, and no presence-state model beyond present/absent.</td>
              </tr>
              <tr>
                <td><a href="https://www.researchgate.net/publication/374245505_An_RFID-based_smart_school_attendance_and_monitoring_system" target="_blank" rel="noopener">An RFID-Based Smart School Attendance and Monitoring System</a></td>
                <td>General-purpose RFID school attendance and monitoring.</td>
                <td>Same gap: RFID only, with no device/person distinction.</td>
              </tr>
              <tr>
                <td><a href="https://ieeexplore.ieee.org/document/8974778" target="_blank" rel="noopener">Online Classroom Attendance System Based on RFID Technology and Cloud Computing</a></td>
                <td>Cloud-hosted RFID attendance pipeline.</td>
                <td>Solves the infrastructure and scale problem, not the trust problem this project targets.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="ocs__section-title">Related patents</h3>
        <div class="rfid-presence-table-wrap">
          <table class="ocs__table rfid-presence-table">
            <thead><tr><th>Patent</th><th>What it covers</th><th>How this project differs</th></tr></thead>
            <tbody>
              <tr>
                <td><a href="https://patents.google.com/patent/KR101710200B1/en" target="_blank" rel="noopener">KR101710200B1, Automatic Attendance System Using Face Recognition (Korea)</a></td>
                <td>An RFID tag on a student ID is read at a classroom terminal, which also captures a face photo; both are sent to a server with timestamp, device ID, and student number.</td>
                <td>Conceptually the closest patent found, combining RFID and face recognition. This project's tag lives on the student's own laptop rather than an ID card, is tamper-evident, has an explicit issue/tamper/retire lifecycle, and feeds a period-aware, multi-state presence model rather than a single logged read event. We are not claiming novelty over RFID plus face recognition as a general combination; the difference is in the presence-state modeling, governance layer, and phased hardware rollout.</td>
              </tr>
              <tr>
                <td><a href="https://patents.google.com/patent/US7095324B2/en" target="_blank" rel="noopener">US7095324B2, Tamper Evident Smart Label with RF Transponder (Intermec)</a></td>
                <td>An RF transponder label with propagation cuts in the antenna trace that sever on peel-removal, permanently disabling the tag's read response.</td>
                <td>Direct prior art for the laptop tag's tamper-evident requirement. Our tag lifecycle treats a severed antenna as a state transition (ACTIVE&nbsp;&rarr;&nbsp;TAMPERED) feeding the presence model, rather than just a disabled label.</td>
              </tr>
              <tr>
                <td><a href="https://patents.google.com/patent/US10565488B2/en" target="_blank" rel="noopener">US10565488B2, RFID Tag with Anti-Tamper Assembly (Intermec)</a></td>
                <td>A capacitive-sensing tamper design: a break-away structure changes the tag's capacitance on removal, which a microcontroller detects to disable the tag.</td>
                <td>A second, mechanically different tamper-evident approach (capacitive vs. severed-trace) worth evaluating for the on-metal laptop tag, where a simple frangible trace may be harder to route.</td>
              </tr>
              <tr>
                <td><a href="https://patents.google.com/patent/US9202091B2/en" target="_blank" rel="noopener">US9202091B2, RFID Reader with Camera, Video, and/or Audio Capture Device</a></td>
                <td>An RFID reader that triggers a facial-recognition image capture at the moment a badge is read, at a single fixed reader point.</td>
                <td>Prior art for pairing an RFID read with a camera capture generally. This project separates the two into independent, continuously-running signal streams (device and person) correlated after the fact, rather than one signal triggering the other at a single instant, which is needed because the camera and RFID reader are not colocated at one point in this design.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="ocs__section-title">Sensor-fusion &amp; occupancy-sensing research</h3>
        <p class="rfid-presence-about">Work validating the general approach of combining RFID with another sensing modality, beyond classroom attendance specifically, plus broader surveys of how occupancy sensing is done in buildings generally.</p>
        <div class="rfid-presence-table-wrap">
          <table class="ocs__table rfid-presence-table">
            <thead><tr><th>Work</th><th>Relevance</th></tr></thead>
            <tbody>
              <tr>
                <td><a href="https://arpa-e.energy.gov/programs-and-initiatives/search-all-projects/rfid-sensor-network-human-presence-sensing" target="_blank" rel="noopener">RFID Sensor Network for Human Presence Sensing (ARPA-E / University of Colorado Boulder)</a></td>
                <td>Combines an RFID sensor network with privacy-preserving microphones and low-resolution cameras for occupancy detection. Direct precedent for RFID plus visual-signal fusion at a systems level.</td>
              </tr>
              <tr>
                <td><a href="https://arxiv.org/pdf/2302.02952" target="_blank" rel="noopener">Fusion of Radio and Camera Sensor Data for Accurate Indoor Positioning</a></td>
                <td>Fusion algorithms that incorporate radio data into camera-based occupancy map frameworks. Relevant technique reference for the correlation engine.</td>
              </tr>
              <tr>
                <td><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11014381/" target="_blank" rel="noopener">Fundamentals, Algorithms, and Technologies of Occupancy Detection for Smart Buildings Using IoT Sensors</a></td>
                <td>Survey comparing PIR, acoustic, camera, HVAC, and WiFi/BLE occupancy-sensing modalities with a comparative analysis and sensor-fusion recommendation. Places RFID+camera in the broader landscape of occupancy-sensing options and why single-modality approaches generally underperform fused ones.</td>
              </tr>
              <tr>
                <td><a href="https://www.researchgate.net/publication/382221603" target="_blank" rel="noopener">A Review of Occupancy Sensing Technologies and Approaches in Smart Buildings</a> (2025)</td>
                <td>Recent comprehensive review comparing occupancy-sensing methods and sensor types across building types. Used to check this project's approach against current best practice rather than only classroom-attendance-specific literature.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="ocs__section-title">Commercial products</h3>
        <p class="rfid-presence-about">Vendors already selling RFID attendance to schools, as a baseline for what off-the-shelf already covers.</p>
        <div class="rfid-presence-table-wrap">
          <table class="ocs__table rfid-presence-table">
            <thead><tr><th>Vendor</th><th>What it offers</th></tr></thead>
            <tbody>
              <tr><td><a href="https://vmedulife.com/blog/academic-planning/rfid-student-attendance-system-the-future-of-smart-attendance-tracking-vmedulife/" target="_blank" rel="noopener">vmedulife</a></td><td>RFID student attendance automation for schools, colleges, and universities.</td></tr>
              <tr><td><a href="https://www.campus365.io/rfid-attendance/" target="_blank" rel="noopener">Campus 365</a></td><td>RFID attendance via ID cards or uniform-attached tags at checkpoints, deployed in hundreds of schools.</td></tr>
              <tr><td><a href="https://edunexttechnologies.com/rfid-student-attendance.php" target="_blank" rel="noopener">Edunext Technologies</a></td><td>Cost-effective RFID school attendance.</td></tr>
              <tr><td><a href="https://www.astiinfotech.com/rfid-attendance-management/" target="_blank" rel="noopener">ASTI Infotech (TRAKOM)</a></td><td>RFID-based digital attendance marking.</td></tr>
              <tr><td><a href="https://www.cirfid.com/applications/rfid-time-attendance-system" target="_blank" rel="noopener">Cirfid</a></td><td>RFID time-and-attendance system.</td></tr>
              <tr><td><a href="https://www.atlasrfidstore.com/rfid-insider/tracking-attendance-with-uhf-rfid/" target="_blank" rel="noopener">atlasRFIDstore, Tracking Attendance with UHF RFID</a></td><td>Vendor technical reference on UHF hardware for attendance tracking, useful as a hardware baseline rather than a full product.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="ocs__callout">
          None of the commercial products above appear to publicly describe combining RFID with camera-based person verification, a tamper-evident laptop-mounted device-presence model, or bell-schedule-bound attendance windows. That combination is this project's specific contribution.
        </div>

        <h3 class="ocs__section-title">Read reliability: bag orientation, on-body carry &amp; antenna diversity</h3>
        <p class="rfid-presence-about">The team flagged an open problem: a tagged laptop inside a closed backpack has no guaranteed orientation toward the reader, and UHF read reliability drops off-axis. The same physics is a bigger problem for a tag carried on the body (e.g. a phone in a pocket), since human tissue absorbs strongly at UHF. It turns out to be a known, actively studied RFID engineering problem rather than something specific to this project's design, and the standard mitigation (surrounding the doorway with multiple antennas instead of relying on one) is the same technique retail and library security gates already use.</p>
        <div class="rfid-presence-table-wrap">
          <table class="ocs__table rfid-presence-table">
            <thead><tr><th>Work</th><th>Relevance</th></tr></thead>
            <tbody>
              <tr>
                <td><a href="https://www.researchgate.net/publication/224684636_3D_Antenna_for_UHF_RFID_Tags_with_Eliminated_Read-Orientation_Sensitivity" target="_blank" rel="noopener">3D Antenna for UHF RFID Tags with Eliminated Read-Orientation Sensitivity</a></td>
                <td>A near-omnidirectional tag antenna designed specifically to eliminate orientation sensitivity. A candidate mitigation worth evaluating for Phase 3/4 instead of, or alongside, multiple reader antennas.</td>
              </tr>
              <tr>
                <td><a href="https://doi.org/10.3390/electronics15122744" target="_blank" rel="noopener">Enhancement of RFID Reliability in Cabinet Environments Using Dual-Band Operation</a></td>
                <td>Addresses read reliability in enclosed, RF-hostile spaces, analogous to a closed backpack.</td>
              </tr>
              <tr>
                <td><a href="https://www.academia.edu/99474548/Study_of_Material_Interference_in_a_RFID_Tag_Reading" target="_blank" rel="noopener">Study of Material Interference in RFID Tag Reading</a></td>
                <td>Confirms metal and material detuning as a primary driver of read failure, which informs the on-metal tag choice already in the bill of materials.</td>
              </tr>
              <tr>
                <td><a href="https://www.beontag.com/blog/rfid-read-range/" target="_blank" rel="noopener">RFID Read Range: What Really Affects It</a></td>
                <td>Practical vendor reference on the factors (power, polarization, orientation, material) behind the read-range numbers used in the <a href="/capstone/presence-system/phases/">Roadmap</a> page bill of materials.</td>
              </tr>
              <tr>
                <td><a href="https://onlinelibrary.wiley.com/doi/abs/10.1002/mop.27610" target="_blank" rel="noopener">Card-Type Slot Antenna for UHF RFID Tag Close to the Chest of a Human Body</a></td>
                <td>Measures on-body vs. free-space read range for a card-format UHF tag near the torso using a human-body phantom. The closest real analogue found to a phone tag carried in a pocket, quantifying how much body absorption degrades a card-format tag's range.</td>
              </tr>
              <tr>
                <td><a href="https://www.researchgate.net/publication/371305582_Effect_of_Human_Body_to_the_Read_Range_of_Radio_Frequency_Identification_Devices_Worn_in_Close_Proximity" target="_blank" rel="noopener">Effect of Human Body to the Read Range of RFID Devices Worn in Close Proximity</a></td>
                <td>Directly compares free-space vs. on-body read range and shows it diminishes substantially when worn, proposing a metamaterial mitigation. Further evidence that any future on-body (phone) tag is a fundamentally harder RF problem than the laptop tag.</td>
              </tr>
              <tr>
                <td><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5539847/" target="_blank" rel="noopener">Multiport Circular Polarized RFID-Tag Antenna for UHF Sensor Applications</a></td>
                <td>Peer-reviewed confirmation that circular polarization is the standard choice for dock-door, portal, and gate RFID deployments specifically because tag orientation is unpredictable as objects or people pass through, and linear-polarization mismatch causes 20&ndash;30&nbsp;dB of loss. Directly supports designing the classroom doorway as a multi-antenna, circularly-polarized portal rather than a single reader antenna.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="ocs__section-title">Tag co-location interference</h3>
        <p class="rfid-presence-about">If a second, personal-device tag is ever added alongside the laptop tag, both could end up in the same backpack. Whether they'd interfere with each other isn't something to assume either way; it's a measurable, previously-studied RF effect.</p>
        <div class="rfid-presence-table-wrap">
          <table class="ocs__table rfid-presence-table">
            <thead><tr><th>Work</th><th>Relevance</th></tr></thead>
            <tbody>
              <tr>
                <td><a href="https://ieeexplore.ieee.org/document/4619089/" target="_blank" rel="noopener">Effect of Antenna Mutual Coupling on the UHF Passive RFID Tag Detection</a></td>
                <td>Studies how the spacing and orientation of closely-spaced tag antennas reduces backscatter and detection range, the general phenomenon behind two tags in one bag degrading each other's reads.</td>
              </tr>
              <tr>
                <td><a href="https://ieeexplore.ieee.org/document/9158443/" target="_blank" rel="noopener">RF-Mirror: Mitigating Mutual Coupling Interference in Two-Tag Array Labeled RFID Systems</a></td>
                <td>Models and mitigates RSSI/phase distortion specifically from mutual coupling between two co-located tags on the same object, directly on point if a laptop tag and a personal-device tag end up sharing a bag, with a quantified impact rather than a hand-wavy concern.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="ocs__section-title">Phone-based / BLE attendance: why RFID instead of an app</h3>
        <p class="rfid-presence-about">A student's own phone could in principle provide presence data without any new tag at all, via Bluetooth Low Energy (BLE) beacons and an app. This has been tried in the classroom-attendance literature, and comparing against it clarifies why this project uses a dedicated RFID tag instead.</p>
        <div class="rfid-presence-table-wrap">
          <table class="ocs__table rfid-presence-table">
            <thead><tr><th>Work</th><th>Relevance</th></tr></thead>
            <tbody>
              <tr>
                <td><a href="https://ieeexplore.ieee.org/document/7350708/" target="_blank" rel="noopener">Student Attendance Management System with Bluetooth Low Energy Beacon and Android Devices</a></td>
                <td>BLE beacons plus an Android app for classroom attendance, one of the earlier peer-reviewed implementations of this approach.</td>
              </tr>
              <tr>
                <td><a href="https://ieeexplore.ieee.org/document/7848166/" target="_blank" rel="noopener">Smart Attendance Management Using Bluetooth Low Energy and Android</a></td>
                <td>A second, independent BLE-plus-app attendance implementation, useful for triangulating the common failure modes of this approach.</td>
              </tr>
              <tr>
                <td><a href="https://dl.acm.org/doi/10.1145/3702163.3702422" target="_blank" rel="noopener">A Prototype to Enhance Academic Attendance Using BLE Beacons</a> (2024)</td>
                <td>A recent (2024) BLE-beacon attendance prototype, showing the approach is still being actively tried rather than an abandoned dead end.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ocs__callout">
          All three BLE approaches above depend on the student running an app and keeping Bluetooth and location permissions on, a policy and compliance dependency this project avoids by using a passive RFID tag, which requires no app, no permissions, and no student action beyond carrying the tagged device. The tradeoff is that RFID needs dedicated reader hardware at the doorway, where BLE reuses infrastructure the student already carries.
        </div>

        <h3 class="ocs__section-title">Audible read confirmation: precedent</h3>
        <p class="rfid-presence-about">The team has discussed giving students an audible tone at the doorway on a successful read, so they get positive proof their crossing was registered rather than trusting a silent background scan. This is not a new idea in RFID systems generally.</p>
        <div class="rfid-presence-table-wrap">
          <table class="ocs__table rfid-presence-table">
            <thead><tr><th>Work</th><th>Relevance</th></tr></thead>
            <tbody>
              <tr>
                <td><a href="https://patents.google.com/patent/US20060208859A1/en" target="_blank" rel="noopener">US20060208859A1, System and Method for RFID Reader Operation</a></td>
                <td>Explicit prior art for an audible beep tone on every RFID read, with a configurable tone/volume and a distinct completion beep, close precedent for a doorway confirmation tone.</td>
              </tr>
              <tr>
                <td><a href="https://patents.google.com/patent/WO2000077700A1/en" target="_blank" rel="noopener">WO2000077700A1, Feedback System and Method for Reading of RFID Tags</a></td>
                <td>A second patent describing an audible beep specifically as read-confirmation feedback to the person carrying the tag.</td>
              </tr>
              <tr>
                <td><a href="https://www.bibliotheca.com/en-gb/rfid-in-libraries-technology-that-helps-extend-impact/" target="_blank" rel="noopener">RFID in Libraries</a> (Bibliotheca, vendor reference)</td>
                <td>Real-world deployment precedent: library RFID self-checkout and security gates use audible alerts for successful reads and improperly-checked-out items. Flagged as a vendor reference, not peer-reviewed, but directly on point as an existing UX pattern at a walk-through gate.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="ocs__section-title">Regulatory basis: FCC Part 15.247</h3>
        <p class="rfid-presence-about">The door portal's power budget is governed by federal rule, not a tuning choice, so it's worth citing the primary regulatory text rather than a vendor's paraphrase of it.</p>
        <div class="rfid-presence-table-wrap">
          <table class="ocs__table rfid-presence-table">
            <thead><tr><th>Source</th><th>What it says</th></tr></thead>
            <tbody>
              <tr>
                <td><a href="https://www.law.cornell.edu/cfr/text/47/15.247" target="_blank" rel="noopener">47 CFR &sect; 15.247</a> (Cornell Legal Information Institute mirror of the FCC rule)</td>
                <td>Sets a 1&nbsp;W maximum peak conducted output power for UHF systems in the 902&ndash;928&nbsp;MHz band (&sect;15.247(b)(2)&ndash;(3)), and requires conducted power to be reduced dB-for-dB for any directional antenna gain above 6&nbsp;dBi (&sect;15.247(b)(4)). The commonly quoted "4&nbsp;W EIRP" ceiling is the <em>derived</em> maximum under that 6&nbsp;dBi allowance (1&nbsp;W &times; ~4x from 6&nbsp;dBi gain), not a number stated directly in the rule, so it's worth being precise about when citing it.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="ocs__section-title">Clock synchronization for multi-sensor correlation</h3>
        <p class="rfid-presence-about">Correlating RFID and camera events depends entirely on both event streams' timestamps agreeing. A Raspberry Pi has no battery-backed clock by default, so this isn't a hypothetical concern.</p>
        <div class="rfid-presence-table-wrap">
          <table class="ocs__table rfid-presence-table">
            <thead><tr><th>Work</th><th>Relevance</th></tr></thead>
            <tbody>
              <tr>
                <td><a href="https://arxiv.org/abs/1806.02474" target="_blank" rel="noopener">A System for Clock Synchronization in an Internet of Things</a></td>
                <td>Documents IoT clock drift "on the order of seconds over relatively short time periods" under plain SNTP, and proposes an improved scheme, real measured evidence that NTP alone can be insufficient for correlating timestamped events across low-cost devices.</td>
              </tr>
              <tr>
                <td><a href="https://www.sciencedirect.com/science/article/pii/S2666307423000219" target="_blank" rel="noopener">Clock Synchronization in Industrial IoT and Potential Works in Precision Time Protocol: Review, Challenges and Future Directions</a></td>
                <td>Surveys why NTP/SNTP is inadequate for resource-constrained IoT nodes and reviews PTP (hardware-assisted, sub-microsecond) as the higher-end alternative, while noting its cost and complexity, useful context for why a low-cost battery-backed RTC, not full PTP, is the pragmatic choice for a Raspberry-Pi-based classroom system.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="ocs__section-title">How the RFID + camera pairing differs, in summary</h3>
        <ul class="ocs__checklist">
          <li class="done"><span class="ocs__checklist-box"></span><span>The tag is mounted on the student's own laptop, not a badge or ID card. It is a device-presence proxy, not a person-presence proxy.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Tags are tamper-evident, with an explicit issue, active, tampered/lost, and reissued/retired lifecycle.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Presence is a multi-state model (tardy, stepped out, left early, opted out, tamper) rather than a binary present/absent flag.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Attendance counts only inside a bell-schedule-bound window, evaluated against per-period expected enrollment.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>The camera signal carries an explicit opt-in governance model, built in from the start rather than added later.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>The hardware rollout is deliberately phased and currently paused after contact-tap: harder contactless work only resumes once the research cycles show it's worth building, not built up front on assumption.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>The doorway is designed as a multi-antenna, circularly-polarized portal from the start (the same antenna-diversity technique library and retail security gates use) rather than a single reader antenna, because tag orientation at a walk-through point is inherently unpredictable.</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>An audible read-confirmation tone at the doorway is being evaluated so a student has positive proof their crossing registered, rather than trusting a silent background scan, a pattern with real precedent in RFID reader hardware and library systems but not common in the classroom-attendance literature surveyed above.</span></li>
        </ul>
      </div>
  </details>

  {% include presence-system-pager.html %}

  {% include presence-system-team.html %}
</div>
