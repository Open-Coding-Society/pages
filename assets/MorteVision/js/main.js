let javaURI;
let mappingURI
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    javaURI = "ws://localhost:8085/websocket";
    mappingURI = "http://localhost:8085/api/mortevision"
} else {
    javaURI = "wss://spring2025.nighthawkcodingsociety.com/websocket";
    mappingURI = "https://spring2025.nighthawkcodingsociety.com/api/mortevision"
}

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

const socket = new WebSocket(javaURI);
let videoStreamGlobal;
let globalPeer;

socket.onmessage = async function (event) {
    const messageData = JSON.parse(event.data);
    switch (messageData["context"]) {
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
    
    await peer.setRemoteDescription(remotedesc);
    videoStreamGlobal.getTracks().forEach(track => peer.addTrack(track, videoStreamGlobal));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    
    sendMessage({
        context: "viewerAcceptClient",
        sdp: answer.sdp,
        returnID: messageData["returnID"]
    });
}

async function captureScreen() {
    try {
        let mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: "always" },
            audio: false
        });
        
        document.getElementById("streamOffline").style.display = "none";
        document.getElementById("mortStream").style.display = "block";
        document.getElementById("mortStream").srcObject = mediaStream;
        
        document.getElementById("endBroadcastButton").style.display = "flex";
        document.getElementById("broadcastButton").style.display = "none";
        
        return mediaStream;
    } catch (ex) {
        console.log("Error occurred", ex);
        document.getElementById("endBroadcastButton").style.display = "none";
    }
}

async function broadcast() {
    const stream = await captureScreen();
    videoStreamGlobal = stream;
    document.getElementById("mortStream").srcObject = stream;
    sendMessage({ context: "broadcastRequest" });
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
    const peer = new RTCPeerConnection(servers);
    peer.addTransceiver("video", { direction: "recvonly" });
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    
    peer.onicecandidate = (e) => {
        if (e.candidate) {
            sendMessage({ context: "iceToStreamerClient", candidate: JSON.stringify(e.candidate.toJSON()) });
        }
    };
    
    globalPeer = peer;
    sendMessage({ context: "viewerOfferClient", sdp: offer.sdp });
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

setInterval(checkForStreams, 1000);
function checkForStreams()
{
    fetch(mappingURI+"/isStreamActive",
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
          if(data == "true")
          {
            document.getElementById("StreamOfflineHead").innerText = "A Stream Was Found!"
          }
        })
        .catch(error => {
          console.error("There was a problem with the fetch", error);
        });
}
