---
layout: page
title: Facial Recognition Login
permalink: /facial-login
search_exclude: true
show_reading_time: false
---

<style>
    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding-top: 20px;
    }

    video, canvas {
        border-radius: 10px;
        margin-top: 10px;
    }

    .capture-button, .submit-button {
        margin-top: 10px;
        padding: 10px 20px;
        font-size: 1rem;
        cursor: pointer;
        border-radius: 5px;
        border: none;
        transition: 0.3s;
    }

    .capture-button {
        background-color: #007bff;
        color: white;
    }

    .submit-button {
        background-color: #28a745;
        color: white;
    }

    .capture-button:hover {
        background-color: #0056b3;
    }

    .submit-button:hover {
        background-color: #1e7e34;
    }

    video {
        transform: scaleX(-1); /* Mirror live preview */
    }

    #imagePreviewContainer img {
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        border: 2px solid #ccc;
        border-radius: 10px;
        margin-top: 10px;
    }
</style>

<div class="login-container">
    <h1>Facial Recognition Login</h1>
    <video id="video" width="320" height="240" autoplay></video>
    <canvas id="canvas" width="320" height="240" style="display: none;"></canvas>

    <img id="capturedImage" style="display: none;" width="320" height="240">

    <div id="imagePreviewContainer" style="margin-top: 10px;">
        <h3 style="margin-bottom: 5px;">Captured Image:</h3>
        <img id="previewImage" src="" style="display: none;" width="320" height="240">
    </div>

    <button class="capture-button" onclick="captureImage()">Capture Image</button>
    <button class="submit-button" onclick="submitImage()" disabled>Analyze Mood</button>
    <button class="submit-button" onclick="testSad()" style="background-color: #ffc107; color: black;">Test Sad</button>
    
    <h3 id="moodResult" style="margin-top: 20px;"></h3>
</div>

<script type="module">
import { fetchOptions, baseurl } from '{{ site.baseurl }}/assets/js/api/config.js';

const pythonURI = "http://localhost:8001";

window.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const capturedImage = document.getElementById('capturedImage');
    const previewImage = document.getElementById('previewImage');
    const submitButton = document.querySelector('.submit-button');

    // Start webcam stream
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Camera access denied: ", err);
        });

    // Capture image from video and show preview
    function captureImage() {
        const context = canvas.getContext('2d');

        context.save();
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();

        const imageData = canvas.toDataURL('image/png');

        // Show preview images
        capturedImage.src = imageData;
        capturedImage.style.display = 'block';

        previewImage.src = imageData;
        previewImage.style.display = 'block';

        submitButton.disabled = false;
    }

    // Submit image to backend for facial authentication
    function submitImage() {
        const imageData = canvas.toDataURL('image/png');
        sendImage(imageData);
    }

    const testSadImage = "data:image/jpeg;base64,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";

    function testSad() {
        sendImage(testSadImage);
    }

    function sendImage(imageData) {
        const moodResult = document.getElementById('moodResult');

        fetch(`${pythonURI}/api/mood/detect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ image: imageData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.mood) {
                moodResult.innerText = `Detected Mood: ${data.mood}`;
                moodResult.style.color = "green";
                // alert(`Detected Mood: ${data.mood}`);
            } else {
                moodResult.innerText = `Error: ${data.error || 'Unknown error'}`;
                moodResult.style.color = "red";
            }
        })
        .catch(error => {
            console.error('Error submitting image:', error);
            moodResult.innerText = "Something went wrong. Please try again.";
            moodResult.style.color = "red";
        });
    }

    // Expose functions to global scope
    window.captureImage = captureImage;
    window.submitImage = submitImage;
    window.testSad = testSad;
});
</script>
