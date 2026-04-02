// ============================================================
//  certificates.js — OOP: Certificates & badges
//  Path: assets/js/bigsix/analytics/certificates.js
//
//  Owns everything related to the certificate step:
//    - Fetching the student's real name from the Python API
//    - Rendering the certificate onto an HTML <canvas>
//    - Triggering the PNG download
//    - Opening LinkedIn's "Add Certification" page pre-filled
//    - Wiring the download and LinkedIn buttons
//
//  EXPORTS:
//    CertificatePanel
// ============================================================

export class CertificatePanel {
  constructor(pythonURI, fetchOptions) {
    this.pythonURI    = pythonURI;
    this.fetchOptions = fetchOptions;
  }

  // ============================================================
  //  ORCHESTRATOR — init
  //  Sets cert date and wires buttons. Delegates all work to
  //  private methods. Called once on DOMContentLoaded.
  // ============================================================
  init() {
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'long',
      year:  'numeric',
    });

    // Show date on the cert card
    document.getElementById('certDate').textContent = dateStr;

    // Wire download button
    document.getElementById('btnDownload').addEventListener('click',
      () => this.#downloadCert('CS Portfolio Certificate', 'Open Coding Society', dateStr)
    );

    // Wire LinkedIn button
    document.getElementById('btnLinkedIn').addEventListener('click',
      () => this.#openLinkedIn('CS Portfolio Certificate')
    );
  }


  // ============================================================
  //  WORKER 1 — #fetchStudentName
  //  Single responsibility: get the logged-in user's display name.
  //  Falls back to 'Student Name' if the API is unavailable.
  // ============================================================
  async #fetchStudentName() {
    try {
      const res = await fetch(`${this.pythonURI}/api/id`, this.fetchOptions);
      if (res.ok) return (await res.json()).name || 'Student Name';
    } catch (err) {
      console.warn('Could not fetch student name:', err.message);
    }
    return 'Student Name';
  }


  // ============================================================
  //  WORKER 2 — #drawCertificate
  //  Single responsibility: render certificate onto canvas.
  //  Pure drawing function — no API calls, no downloads.
  // ============================================================
  #drawCertificate(ctx, width, height, name, course, org, date) {
    // Background
    ctx.fillStyle = '#f8f6f0';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth   = 25;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    // Title
    ctx.fillStyle = '#2c3e50';
    ctx.font      = 'bold 60px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 260);

    // Intro text
    ctx.font = '28px Arial';
    ctx.fillText('This is to certify that', width / 2, 380);

    // Recipient name — fetched dynamically from API
    ctx.fillStyle = '#ea8c33';
    ctx.font      = 'italic bold 52px Georgia';
    ctx.fillText(name, width / 2, 470);

    // Course line
    ctx.fillStyle = '#2c3e50';
    ctx.font      = '32px Arial';
    ctx.fillText(`has successfully completed ${course}`, width / 2, 570);

    // Org and date
    ctx.font      = '24px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(org, width / 2, 640);
    ctx.fillText(date, width / 2, 690);
  }


  // ============================================================
  //  WORKER 3 — #triggerDownload
  //  Single responsibility: convert canvas to PNG and download.
  // ============================================================
  #triggerDownload(canvas, filename) {
    const a    = document.createElement('a');
    a.download = `${filename}.png`;
    a.href     = canvas.toDataURL('image/png');
    a.click();
  }


  // ============================================================
  //  WORKER 4 — #downloadCert
  //  Single responsibility: orchestrate fetch → draw → download.
  // ============================================================
  async #downloadCert(course, org, date) {
    const name   = await this.#fetchStudentName();
    const canvas = document.getElementById('certCanvas');
    const ctx    = canvas.getContext('2d');

    canvas.width  = 1400;
    canvas.height = 1000;

    this.#drawCertificate(ctx, canvas.width, canvas.height, name, course, org, date);
    this.#triggerDownload(canvas, course.replace(/\s+/g, '_') + '_Certificate');
  }


  // ============================================================
  //  WORKER 5 — #openLinkedIn
  //  Single responsibility: open LinkedIn Add Certification page.
  // ============================================================
  #openLinkedIn(courseName) {
    const url = new URL('https://www.linkedin.com/profile/add');
    url.searchParams.append('name',             courseName);
    url.searchParams.append('organizationName', 'Open Coding Society');
    url.searchParams.append('issueYear',        new Date().getFullYear());
    url.searchParams.append('issueMonth',       new Date().getMonth() + 1);
    url.searchParams.append('certId',           `CSPORTFOLIO-${Date.now()}`);
    window.open(url.toString(), '_blank');
  }
}
