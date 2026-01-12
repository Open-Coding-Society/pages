let javaURI;
let mvURI //mortrevision
let mappingURI

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    mvURI = "ws://localhost:8585/websocket";
    javaURI = "http://localhost:8585";
    mappingURI = "http://localhost:8585/api/mortevision"
} else {
    javaURI = "https://spring.opencodingsociety.com";
    mvURI = "wss://spring.opencodingsociety.com/websocket";
    mappingURI = "https://spring.opencodingsociety.com/api/mortevision"
}

let assignment = null;
let currentQueue = [];

let person;

document.getElementById('addQueue').addEventListener('click', addToQueue);
document.getElementById('removeQueue').addEventListener('click', removeFromQueue);

let timerInterval;
let timerlength;
let queueUpdateInterval;

const URL = javaURI + "/api/assignments/"
console.log(URL)

const servers = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun.l.google.com:5349",
                "stun:stun1.l.google.com:3478",
                "stun:stun1.l.google.com:5349",
                "stun:stun2.l.google.com:19302",
                "stun:stun2.l.google.com:5349",
                "stun:stun3.l.google.com:3478",
                "stun:stun3.l.google.com:5349",
                "stun:stun4.l.google.com:19302",
                "stun:stun4.l.google.com:5349"
            ],
        },
    ],
    iceCandidatePoolSize: 10,
};

const socket = new WebSocket(mvURI);
let videoStreamGlobal;
let globalPeer;

async function broadcast() {
    // const stream = await captureScreen();
    // videoStreamGlobal = stream;
    // document.getElementById("mortStream").srcObject = stream;
    // sendMessage({ context: "broadcastRequest" });
    captureScreen()
        .then(stream => {
            videoStreamGlobal = stream;
            document.getElementById("mortStream").srcObject = stream;
            sendMessage({ context: "broadcastRequest" });
        })
        .catch(error => {
            console.error("Error during broadcast:", error);
        });
}

async function stopBroadcast() {
    if (!videoStreamGlobal) {
        return;
    }
    videoStreamGlobal.getTracks().forEach(track => track.stop())
    sendMessage({ context: "stopBroadcast" })
}


socket.onmessage = async function (event) {
    const messageData = JSON.parse(event.data);
    switch (messageData["context"]) {
        case "broadcastRequestServer":
            watch() //:( await used to be here
            break;
        case "viewerOfferServer":
            viewerOfferServer(messageData);
            break;
        case "viewerAcceptServer":
            viewerAcceptServer(messageData);
            break;
        case "iceToStreamerServer":
        case "iceToViewerServer":
            globalPeer.addIceCandidate(new RTCIceCandidate(JSON.parse(messageData["candidate"])));
            break;
    }
};

function sendMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error("WebSocket connection is not open.");
    }
}

async function viewerOfferServer(messageData) {
    const peer = new RTCPeerConnection(servers);
    globalPeer = peer;

    let remotedesc = new RTCSessionDescription({
        type: "offer",
        sdp: messageData["sdp"]
    });

    peer.onicecandidate = (e) => {
        if (e.candidate) {
            sendMessage({ context: "iceToViewerClient", candidate: JSON.stringify(e.candidate.toJSON()) });
        }
    };

    // await peer.setRemoteDescription(remotedesc);
    // videoStreamGlobal.getTracks().forEach(track => peer.addTrack(track, videoStreamGlobal));
    // const answer = await peer.createAnswer();
    // await peer.setLocalDescription(answer);

    // sendMessage({
    //     context: "viewerAcceptClient",
    //     sdp: answer.sdp,
    //     returnID: messageData["returnID"]
    // });
    //goodbye awaits
    return peer.setRemoteDescription(remotedesc)
        .then(() => {
            videoStreamGlobal.getTracks().forEach(track => peer.addTrack(track, videoStreamGlobal));
            return peer.createAnswer();
        })
        .then(answer => {
            return peer.setLocalDescription(answer).then(() => answer);
        })
        .then(answer => {
            sendMessage({
                context: "viewerAcceptClient",
                sdp: answer.sdp,
                returnID: messageData["returnID"]
            });
        })
        .catch(error => {
            console.error("Error in viewerOfferServer:", error);
        });
}

// async function captureScreen() {
//     try {
//         let mediaStream = await navigator.mediaDevices.getDisplayMedia({
//             video: { cursor: "always" },
//             audio: false
//         });

//         document.getElementById("streamOffline").style.display = "none";
//         document.getElementById("mortStream").style.display = "block";
//         document.getElementById("mortStream").srcObject = mediaStream;

//         // document.getElementById("endBroadcastButton").style.display = "flex";

//         return mediaStream;
//     } catch (ex) {
//         // console.log("Error occurred", ex);
//         // document.getElementById("endBroadcastButton").style.display = "none";
//     }
// }

async function captureScreen() {
    return navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false
    })
    .then((mediaStream) => {
        document.getElementById("streamOffline").style.display = "none";
        document.getElementById("mortStream").style.display = "block";
        document.getElementById("mortStream").srcObject = mediaStream;

        // document.getElementById("endBroadcastButton").style.display = "flex";

        return mediaStream;
    })
    .catch((ex) => {
        // console.log("Error occurred", ex);
        // document.getElementById("endBroadcastButton").style.display = "none";
    });
}



function viewerAcceptServer(messageData) {
    let remotedesc = new RTCSessionDescription({
        type: "answer",
        sdp: messageData["sdp"]
    });

    if (globalPeer.signalingState === "stable") {
        console.warn("Skipping setRemoteDescription because connection is already stable.");
        return;
    }

    globalPeer.setRemoteDescription(remotedesc)
        .then(() => {
            console.log("Remote description set successfully.");
        })
        .catch(error => {
            console.error("Failed to set remote description:", error);
        });

    globalPeer.ontrack = (event) => {
        document.getElementById("mortStream").srcObject = event.streams[0];
        document.getElementById("mortStream").style.display = "block";
        document.getElementById("streamOffline").style.display = "none";
    };
}

async function watch() {
    // const peer = new RTCPeerConnection(servers);
    // peer.addTransceiver("video", { direction: "recvonly" });
    // const offer = await peer.createOffer();
    // await peer.setLocalDescription(offer);

    // peer.onicecandidate = (e) => {
    //     if (e.candidate) {
    //         sendMessage({ context: "iceToStreamerClient", candidate: JSON.stringify(e.candidate.toJSON()) });
    //     }
    // };

    // globalPeer = peer;
    // sendMessage({ context: "viewerOfferClient", sdp: offer.sdp });
    const peer = new RTCPeerConnection(servers);
    peer.addTransceiver("video", { direction: "recvonly" });

    peer.createOffer()
        .then(offer => {
            return peer.setLocalDescription(offer).then(() => offer);
        })
        .then(offer => {
            peer.onicecandidate = (e) => {
                if (e.candidate) {
                    sendMessage({
                        context: "iceToStreamerClient",
                        candidate: JSON.stringify(e.candidate.toJSON())
                    });
                }
            };

            globalPeer = peer;
            sendMessage({
                context: "viewerOfferClient",
                sdp: offer.sdp
            });
        })
        .catch(error => {
            console.error("Error creating and sending offer:", error);
        });

}

socket.onerror = function (error) {
    console.error("WebSocket error: ", error);
};

socket.onclose = function (event) {
    console.log("WebSocket connection closed:", event);
};

socket.onopen = function (event) {
    console.log("WebSocket connection established.");
};

// setInterval(checkForStreams, 1000);
function checkForStreams() {
    fetch(mappingURI + "/isStreamActive",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response => {
            if (response.ok) {
                return response.text()
            }
            throw new Error("Network response failed")
        }).then(data => {
            document.getElementById("StreamOfflineHead").innerText = "Stream Offline"
            if (data == "true") {
                document.getElementById("StreamOfflineHead").innerText = "A Stream Was Found!"
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch", error);
        });
}

function startTimer() {
    broadcast();
    const waitingList = document.getElementById('waitingList');
    const firstInQueue = waitingList.children[0]?.textContent;

    // If person is not at the front or not part of the first group, block the timer
    if (!firstInQueue || (!firstInQueue.includes(person) && person !== firstInQueue)) {
        alert("You must be at the front of the queue to start the timer.");
        return;
    }

    let time = timerlength;
    const timerButton = document.getElementById('beginTimer');
    timerButton.textContent = 'End Timer';

    // Change the click behavior to END the timer
    timerButton.removeEventListener('click', startTimer);
    timerButton.addEventListener('click', endTimerEarly);

    timerInterval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.getElementById('timerDisplay').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} | Presentation Queue`;
        time--;
        if (time < 0) {
            clearInterval(timerInterval);
            moveToDoneQueue();
            stopBroadcast();
            alert("Timer is up! Your presentation is over.");

            resetTimerButton();
        }
    }, 1000);
}

function endTimerEarly() {
    clearInterval(timerInterval);
    moveToDoneQueue();
    alert("Timer ended early.");
    resetTimerButton();
}

function resetTimerButton() {
    const timerButton = document.getElementById('beginTimer');
    timerButton.textContent = 'Begin Timer';
    timerButton.removeEventListener('click', endTimerEarly);
    timerButton.addEventListener('click', startTimer);
    document.title = "Presentation Queue | Nighthawk Pages";
}

// ensure accessible outside of current module
window.startTimer = startTimer;

function fetchQueue() {
    fetch(URL + `getQueue/${assignment}`)
        .then(response => response.json())
        .then(data => updateQueueDisplay(data));
}

function fetchTimerLength() {
    console.log("test")
    fetch(URL + `getPresentationLength/${assignment}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            timerlength = data;
            document.getElementById('timerDisplay').textContent = `${Math.floor(timerlength / 60).toString().padStart(2, '0')}:${(timerlength % 60).toString().padStart(2, '0')}`;
        });
}

// add user to waiting
function addToQueue() {
    let list = document.getElementById("notGoneList").children;
    let names = [];
    Array.from(list).forEach(child => {
        names.push(child.textContent);
    });
    if (names.includes(person)) {
        fetch(URL + `addToWaiting/${assignment}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([person])
        })
            .then(() => fetchQueue());
    } else {
        alert("ERROR: You are not in the working list.")
    }
}

// remove user from waiting
function removeFromQueue() {
    let list = document.getElementById("waitingList").children;
    let names = [];
    Array.from(list).forEach(child => {
        names.push(child.textContent);
    });
    if (names.includes(person)) {
        fetch(URL + `removeToWorking/${assignment}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([person])
        })
            .then(() => fetchQueue());
    } else {
        alert("ERROR: You are not in the waiting list.")
    }
}

// move user to completed
function moveToDoneQueue() {
    const firstPerson = [currentQueue[0]];
    fetch(URL + `doneToCompleted/${assignment}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firstPerson)
    })
        .then(() => fetchQueue());
}

// reset queue - todo: admin only
function resetQueue() {
    fetch(URL + `resetQueue/${assignment}`, {
        method: 'PUT'
    })
        .then(() => fetchQueue());
}

// add/remove a group from waiting list
function toggleGroupInQueue() {
    // ask for group names
    const groupName = prompt("Enter the group name to add/remove in the waiting queue:");
    if (!groupName || !groupName.trim()) {
        alert("Please enter a valid group name.");
        return;
    }

    const trimmedGroup = groupName.trim();

    // if group is in queue, remove group, else add group to queue
    const isInQueue = currentQueue.some(item => item === trimmedGroup);

    if (isInQueue) {
        // Now move the group to the completed queue endpoint
        fetch(URL + `doneToCompleted/${assignment}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([trimmedGroup])
        })
            .then(() => {
                alert(`Moved "${trimmedGroup}" to completed queue.`);
                fetchQueue();
            });
    } else {
        // add to queue
        fetch(URL + `addToWaiting/${assignment}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([trimmedGroup])
        })
            .then(() => {
                alert(`Added "${trimmedGroup}" to waiting queue.`);
                fetchQueue();
            });
    }
}

// update display - ran periodically
function updateQueueDisplay(queue) {
    currentQueue = queue.waiting;

    const notGoneList = document.getElementById('notGoneList');
    const waitingList = document.getElementById('waitingList');
    const doneList = document.getElementById('doneList');

    const notGoneElements = queue.working.map(person => `<div class="card">${person}</div>`);
    notGoneList.innerHTML = notGoneElements.join('');
    waitingList.innerHTML = queue.waiting.map(person => `<div class="card">${person}</div>`).join('');
    doneList.innerHTML = queue.completed.map(person => `<div class="card">${person}</div>`).join('');

    // Check and update global person variable
    if (!person.includes("|")) {
        const matchingPerson = queue.working.find(p => p.includes(person));
        if (matchingPerson) {
            person = matchingPerson; // Update global person variable
        }
    }
}

document.getElementById('beginTimer').addEventListener('click', startTimer);

// Start the interval to periodically update the queue
function startQueueUpdateInterval(intervalInSeconds) {
    if (queueUpdateInterval) clearInterval(queueUpdateInterval); // Clear existing interval if any
    queueUpdateInterval = setInterval(() => {
        console.log("Updating queue...");
        fetchQueue();
        fetchTimerLength();
    }, intervalInSeconds * 1000);
}

// Stop the interval for queue updates if needed
function stopQueueUpdateInterval() {
    if (queueUpdateInterval) clearInterval(queueUpdateInterval);
}

window.addEventListener('load', () => {
    fetchQueue();
    fetchUser();
    showAssignmentModal();
});

function fetchUser() {
    fetch(javaURI + `/api/person/get`, {
        method: 'GET',
        cache: "no-cache",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-Origin': 'client'
        }
    })
        .then(response => response.json())
        .then(userInfo => {
            person = userInfo.name;

            console.log(typeof person);
            if (typeof person == 'undefined') {
                alert("Error: You are not logged in. Redirecting you to the login page.")
                let loc = window.location.href
                loc = loc => loc.split('/').slice(0, -2).join('/') || loc;
                window.location.href = loc + "/login"
            }
        });
}

function showAssignmentModal() {
    const modal = document.getElementById('assignmentModal');
    const modalDropdown = document.getElementById('modalAssignmentDropdown');

    fetch(URL + 'debug')
        .then(response => response.json())
        .then(assignments => {
            modalDropdown.innerHTML = assignments.map(assignment =>
                `<option value="${assignment.id}">${assignment.name}</option>`
            ).join('');
        });

    modal.style.display = 'block';

    // Add event listener for the confirm button
    document.getElementById('confirmAssignment').addEventListener('click', () => {
        const selectedAssignment = modalDropdown.value;
        if (selectedAssignment) {
            assignment = selectedAssignment; // Set the global assignment variable
            fetchQueue();
            startQueueUpdateInterval(10);
            fetchTimerLength();
            modal.style.display = 'none';
        } else {
            alert('Please select an assignment.');
        }
    });
}

fetchQueue();
