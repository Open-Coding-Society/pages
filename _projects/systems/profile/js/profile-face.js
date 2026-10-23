// Face ID on /profile: whether the student's face is registered, and the camera
// scanner that registers it. The Bathroom Pass identifies students with it.
export async function initFaceRegistration({ api, pill, openButton, modal, video, canvas, status, captureButton, onChange }) {
    const { javaURI, fetchOptions } = api;
    let stream = null;
    let uid = null;

    function show(isRegistered) {
        pill.textContent = isRegistered ? 'Registered' : 'Not registered';
        pill.className = `ocs__status-pill ocs__status-pill--${isRegistered ? 'good' : 'neutral'}`;
        openButton.textContent = isRegistered ? 'Register again' : 'Register your face';
        onChange?.(isRegistered);
    }

    let openCount = 0;
    async function open() {
        const attempt = ++openCount;
        modal.classList.remove('hidden');
        captureButton.disabled = true;
        status.textContent = 'Asking for your camera…';
        try {
            const opened = await navigator.mediaDevices.getUserMedia({ video: true });
            // Closed (or closed and reopened) while the browser was still asking: turn this camera straight off.
            if (attempt !== openCount || modal.classList.contains('hidden')) {
                opened.getTracks().forEach(track => track.stop());
                return;
            }
            stream = opened;
            video.addEventListener('loadedmetadata', () => {
                status.textContent = 'Camera on. Center your face, then press Capture.';
                captureButton.disabled = false;
                captureButton.focus();
            }, { once: true });
            video.srcObject = stream;
        } catch (error) {
            console.error('Camera error:', error);
            status.textContent = "Couldn't open your camera. Allow camera access for this site, then try again.";
        }
    }

    function close() {
        stream?.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
        modal.classList.add('hidden');
        openButton.focus();
    }

    async function capture() {
        if (!uid) {
            status.textContent = "Your account didn't load. Refresh the page and try again.";
            return;
        }
        if (!video.videoWidth || !video.videoHeight) {
            status.textContent = 'The camera is still starting. Try again in a moment.';
            return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const faceData = canvas.toDataURL('image/jpeg').split(',')[1];
        status.textContent = 'Registering…';
        captureButton.disabled = true;
        try {
            const response = await fetch(`${javaURI}/api/face/register`, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({ faceData }),
            });
            if (!response.ok) throw new Error(`the server answered ${response.status}`);
        } catch (error) {
            console.error('Face registration error:', error);
            status.textContent = 'Registration failed. Try again.';
            captureButton.disabled = false;
            return;
        }
        status.textContent = 'Registered.';
        show(true);
        setTimeout(close, 1200);
    }

    openButton.addEventListener('click', open);
    captureButton.addEventListener('click', capture);
    modal.querySelectorAll('[data-close-scanner]').forEach(button => button.addEventListener('click', close));
    modal.addEventListener('click', event => {
        if (event.target === modal) close();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) close();
    });

    try {
        const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
        if (!response.ok) throw new Error(`the server answered ${response.status}`);
        const person = await response.json();
        uid = person.uid ?? null;
        show(Boolean(person.faceData));
    } catch (error) {
        console.error('Error checking Face ID registration:', error);
        pill.textContent = 'Unavailable';
    }
}
