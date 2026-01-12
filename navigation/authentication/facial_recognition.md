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
    <button class="submit-button" onclick="submitImage()" disabled>Login</button>
</div>

<script type="module">
import { pythonURI } from '{{ site.baseurl }}/assets/js/api/config.js';

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

        fetch(`${pythonURI}/facial/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ image: imageData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Welcome back, ${data.user.name || data.user.uid}!`);
                window.location.href = '/pages/gamify'; // Redirect on success
            } else {
                alert('Face not recognized. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error submitting image:', error);
            alert('Something went wrong. Please try again.');
        });
    }

    // Expose functions to global scope
    window.captureImage = captureImage;
    window.submitImage = submitImage;
});
</script>
