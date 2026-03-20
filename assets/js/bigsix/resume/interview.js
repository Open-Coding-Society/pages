// interview.js
// RESPONSIBILITY: ELIO interview TTS question delivery and audio recording.

window.Resume = window.Resume || {};

const QUESTIONS = [
  'Tell me about yourself.',
  'Describe a project you are proud of.',
  'How do you handle team conflict?',
  'What are your greatest strengths?',
  'Where do you see yourself in 5 years?',
  'Do you have any questions for us?',
];

let currentQuestion = 0;
let mediaRecorder   = null;
let recordedChunks  = [];

function speakText(text) {
  if (!text || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function askQuestion() {
  const q = QUESTIONS[currentQuestion % QUESTIONS.length];
  document.getElementById('elioQuestion').textContent = q;
  speakText(q);
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedChunks = [];
    mediaRecorder  = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.start();
    document.getElementById('recordingIndicator').classList.remove('hidden');
  } catch {
    alert('Microphone access is required for recording.');
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    document.getElementById('recordingIndicator').classList.add('hidden');
  }
}

function downloadRecording() {
  if (!recordedChunks.length) { alert('No recording found. Press Record first.'); return; }
  const blob = new Blob(recordedChunks, { type: 'audio/webm' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'interview.webm' });
  a.click();
  URL.revokeObjectURL(url);
}

// ── ORCHESTRATOR: Wire all ELIO and recording buttons ────────────────────────
Resume.initInterview = function() {
  document.getElementById('startInterviewBtn').addEventListener('click', () => { currentQuestion = 0; askQuestion(); });
  document.getElementById('nextQuestionBtn').addEventListener('click',  () => { currentQuestion++; askQuestion(); });
  document.getElementById('endInterviewBtn').addEventListener('click',  () => {
    document.getElementById('elioQuestion').textContent = 'Session ended. Great practice!';
    window.speechSynthesis.cancel();
  });
  document.getElementById('startRecordingBtn').addEventListener('click', startRecording);
  document.getElementById('stopRecordingBtn').addEventListener('click',  stopRecording);
  document.getElementById('downloadRecBtn').addEventListener('click',    downloadRecording);
};