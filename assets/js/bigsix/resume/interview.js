// interview.js
// RESPONSIBILITY: ELIO interview TTS question delivery and audio recording.
// Registers onto window.Resume.

class InterviewRecorder {
  #questions = [
    'Tell me about yourself.',
    'Describe a project you are proud of.',
    'How do you handle team conflict?',
    'What are your greatest strengths?',
    'Where do you see yourself in 5 years?',
    'Do you have any questions for us?',
  ];

  #currentQuestion = 0;
  #mediaRecorder   = null;
  #recordedChunks  = [];

  #speakText(text) {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }

  #askQuestion() {
    const q = this.#questions[this.#currentQuestion % this.#questions.length];
    document.getElementById('elioQuestion').textContent = q;
    this.#speakText(q);
  }

  async #startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.#recordedChunks = [];
      this.#mediaRecorder   = new MediaRecorder(stream);
      this.#mediaRecorder.ondataavailable = e => { if (e.data.size > 0) this.#recordedChunks.push(e.data); };
      this.#mediaRecorder.start();
      document.getElementById('recordingIndicator').classList.remove('hidden');
    } catch {
      alert('Microphone access is required for recording.');
    }
  }

  #stopRecording() {
    if (this.#mediaRecorder && this.#mediaRecorder.state !== 'inactive') {
      this.#mediaRecorder.stop();
      document.getElementById('recordingIndicator').classList.add('hidden');
    }
  }

  #downloadRecording() {
    if (!this.#recordedChunks.length) { alert('No recording found. Press Record first.'); return; }
    const blob = new Blob(this.#recordedChunks, { type: 'audio/webm' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'interview.webm' });
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── ORCHESTRATOR: Wire all ELIO and recording buttons ──────────────────────
  init() {
    document.getElementById('startInterviewBtn').addEventListener('click', () => { this.#currentQuestion = 0; this.#askQuestion(); });
    document.getElementById('nextQuestionBtn').addEventListener('click',  () => { this.#currentQuestion++; this.#askQuestion(); });
    document.getElementById('endInterviewBtn').addEventListener('click',  () => {
      document.getElementById('elioQuestion').textContent = 'Session ended. Great practice!';
      window.speechSynthesis.cancel();
    });
    document.getElementById('startRecordingBtn').addEventListener('click', () => this.#startRecording());
    document.getElementById('stopRecordingBtn').addEventListener('click',  () => this.#stopRecording());
    document.getElementById('downloadRecBtn').addEventListener('click',    () => this.#downloadRecording());
  }
}

window.Resume = window.Resume || {};
Resume.InterviewRecorder = InterviewRecorder;
