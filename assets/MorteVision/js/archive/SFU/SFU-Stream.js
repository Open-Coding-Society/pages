// import { javaURI } from '../../../../js/api/config.js';
// let bruh = "http://localhost:443"//https://justfornow.onrender.com"
// const servers = {
//     iceServers:[
//       {
//         urls:
//       [
//       "stun:stun.l.google.com:19302",
//       /*"stun:stun.l.google.com:5349",
//       "stun:stun1.l.google.com:3478",
//       "stun:stun1.l.google.com:5349",
//       "stun:stun2.l.google.com:19302",
//       "stun:stun2.l.google.com:5349",
//       "stun:stun3.l.google.com:3478",
//       "stun:stun3.l.google.com:5349",
//       "stun:stun4.l.google.com:19302",
//       "stun:stun4.l.google.com:5349"*/],
//       },
//     ],
//     iceCandidatePoolSize:10,
//   }
// async function streamerInit() {
//     // try {
//     //     firstInLine = document.getElementById("waitingList").firstElementChild.textContent;
//     // } catch {
//     //     alert('You are not first in line. Please wait your turn!')
//     // }
//     //if (person == firstInLine) {
//         //startTimer();
//         const stream = await captureScreen();
//         mediaStreamCloseOnly = stream
//         document.getElementById("mortStream").srcObject = stream;
//         const peer = streamerCreatePeer();
//         stream.getTracks().forEach(track => peer.addTrack(track, stream));
//         try
//         {
//         signalingServer.send(JSON.stringify({event: 'streamStarted'}));
//         }
//         catch
//         {
//             console.log("didnt send stream started")
//         }
//     //} else {
//         //alert('You are not first in line. Please wait your turn!')
//     //}
// }

// let streamPeerCloseOnly
// let mediaStreamCloseOnly

// let socket = io(bruh, { autoConnect: false });

// function streamerCreatePeer() {
//     const peer = new RTCPeerConnection(servers);
//     peer.onnegotiationneeded = () => streamerNegotiation(peer);
//     // peer.onicecandidate = async (e) => await peer.addIceCandidate(e.candidate)
//     peer.onicecandidate = (e) => {
//         if (e.candidate) {
//             console.log('ICE candidate');
//             socket.emit("clientIceStream", {candidate:e.candidate})
//         }
//     }
//     streamPeerCloseOnly = peer
//     return peer;
// }

// socket.on('serverIceStream', (data) => {
//     globalPeer.addIceCandidate(new RTCIceCandidate(data.candidate));
// });

// async function streamerNegotiation(peer) {
//     socket.connect()
//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);
//     const payload = {
//         sdp: peer.localDescription
//     };
//     socket.emit("broadcast", payload, (response) => {
//         const desc = new RTCSessionDescription(data);
//         peer.setRemoteDescription(desc).catch(e => console.log(e));
//     })
// }

// async function endStream()
// {
//     if(mediaStreamCloseOnly)
//     {
//     mediaStreamCloseOnly.getTracks().forEach(track => { track.stop()})
//     }
//     if(streamPeerCloseOnly)
//     {
//         streamPeerCloseOnly.close()
//     }
//     try
//     {
//     signalingServer.send(JSON.stringify({event: 'streamEnded'})); //pls dont exploit this
//     }
//     catch
//     {
//         console.log("didn't send stream ended")
//     }
//     document.getElementById("endBroadcastButton").style.display = "none"
//     document.getElementById("broadcastButton").style.display = "flex"
    
// }

// async function captureScreen() {
//     let mediaStream = null;
//     try {
//         mediaStream = await navigator.mediaDevices.getDisplayMedia({
//             video: {
//                 cursor: "always"
//             },
//             audio: false
//         }); //get user video and audio as a media stream
//         document.getElementById("streamOffline").style.display = "none"
//         document.getElementById("mortStream").style.display = "block"
//         document.getElementById("mortStream").srcObject = mediaStream
//         if(document.getElementById("endBroadcastButton").style.display == "none")
//         {
//             document.getElementById("endBroadcastButton").style.display = "flex"
//             document.getElementById("broadcastButton").style.display = "none"
//         }
//         return mediaStream;
//     } catch (ex) {
//         console.log("Error occurred", ex);
//         document.getElementById("endBroadcastButton").style.display = "none"
//     }
// }


// document.getElementById("broadcastButton").addEventListener("click",function(e)
// {
//     streamerInit()
// })

// document.getElementById("endBroadcastButton").addEventListener("click",function(e)
// {
//     endStream()
// })