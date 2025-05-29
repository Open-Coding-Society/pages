// let peerConnection

// async function startStream()
// {
//     let stream
//     try
//     {
//         stream = await captureScreen()
//     }
//     catch
//     {
//         console.error("can u js be normal man")
//     }
//     if (!peerConnection) {
//         peerConnection = createPeerConnection();
//     }
//     stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream)); //add media stream to each connected peer
// }

// async function viewStream()
// {
//     if(!peerConnection)
//     {
//         peerConnection = createPeerConnection()
//     }
//     if(peerConnection.getTransceivers().length === 0)
//     {
//     peerConnection.addTransceiver("video", { direction: "recvonly" }) //recieve only
//     peerConnection.addTransceiver("audio", { direction: "recvonly" })
//     document.getElementById("streamOffline").style.display = "none"
//     document.getElementById("mortStream").style.display = "block"
//     }

//     await peerNegotiation()
// }

// async function captureScreen() {
//     let mediaStream = null;
//     try {
//         mediaStream = await navigator.mediaDevices.getDisplayMedia({
//             video: {
//                 cursor: "always"
//             },
//             audio: true
//         }); //get user video and audio as a media stream
//         document.getElementById("streamOffline").style.display = "none"
//         document.getElementById("mortStream").style.display = "block"
//         document.getElementById("mortStream").srcObject = mediaStream
//         return mediaStream;
//     } catch (ex) {
//         console.log("Error occurred", ex);
//     }
// }


// function createPeerConnection()
// {
//     const peer = new RTCPeerConnection(servers)

//     peer.addTransceiver('video', {
//         direction: 'recvonly'
//       });
//       peer.addTransceiver('audio', {
//         direction: 'recvonly'
//       });

//     peer.onnegotiationneeded = () => peerNegotiation()
//     peer.onicecandidate = ({ candidate }) => {
//         if (candidate && signalingServer.readyState === signalingServer.OPEN) {
//           signalingServer.send(JSON.stringify({ target: id, type: 'candidate', payload: candidate }));
//         }
//       };
//     peer.ontrack = ({streams}) => {
//         document.getElementById("mortStream").srcObject = streams[0]
//         document.getElementById("mortStream").style.display = "block"
//         document.getElementById("streamOffline").style.display = "none"
//     }
//     return peer
// }


// async function peerNegotiation()
// {
//     if(!peerConnection)
//     {
//         peerConnection = createPeerConnection()
//     }
//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
//     signalingServer.send(JSON.stringify({ target: id, type: 'offer', payload: offer }));

// }

// let id
// signalingServer.onmessage = async(message) => {
//     const data = JSON.parse(message.data)
//     console.log(data.type)
//     switch(data.type)
//     {
//         case "init":
//             id = data.id
//         break;

//         case "offer":
//             if (!peerConnection) {
//                 peerConnection = createPeerConnection();
//             }
//             await peerConnection.setRemoteDescription(new RTCSessionDescription(data.payload)); // Ensure remote description is set
//             const answer = await peerConnection.createAnswer(); // Create answer only after setting remote description
//             await peerConnection.setLocalDescription(answer); // Set the local description
//             signalingServer.send(JSON.stringify({ target: data.payload.id, type: 'answer', payload: answer }));
//             // signalingServer.send(JSON.stringify({description: peerConnection.localDescription}));
//         break;

//         case "answer":
//             if (!peerConnection) {
//                 peerConnection = createPeerConnection();
//             }
//             await peerConnection.setRemoteDescription(new RTCSessionDescription(data.payload));
//         break;

//         case "candidate":
//             if (!peerConnection) {
//                 peerConnection = createPeerConnection();
//             }
//             await peerConnection.addIceCandidate(new RTCIceCandidate(data.payload));
//         break;
//     }
// }

// function toggleBroadcastButton(isVisible)
// {
//     if(isVisible)
//     {
//         document.getElementById("broadcastButton").style.display = "flex"
//         return
//     }
//     else
//     {
//         document.getElementById("broadcastButton").style.display = "none"
//     }
// }