import { javaURI } from '../../../../js/api/config.js';
let bruh = "https://justfornow.onrender.com"
const servers = {
    iceServers:[
      {
        urls:
      [
      "stun:stun.l.google.com:19302",
      /*"stun:stun.l.google.com:5349",
      "stun:stun1.l.google.com:3478",
      "stun:stun1.l.google.com:5349",
      "stun:stun2.l.google.com:19302",
      "stun:stun2.l.google.com:5349",
      "stun:stun3.l.google.com:3478",
      "stun:stun3.l.google.com:5349",
      "stun:stun4.l.google.com:19302",
      "stun:stun4.l.google.com:5349"*/],
      },
    ],
    iceCandidatePoolSize:10,
  }
let globalPeer

async function consumerInit() {
    const peer = await consumerCreatePeer()
    peer.addTransceiver("video", { direction: "recvonly" })
    globalPeer = peer
}

async function consumerCreatePeer() {
    const peer = new RTCPeerConnection(servers)
    peer.ontrack = ({streams}) => {
                document.getElementById("mortStream").srcObject = streams[0]
                document.getElementById("mortStream").style.display = "block"
                document.getElementById("streamOffline").style.display = "none"
            }
    peer.onnegotiationneeded = () => consumeNegotiation(peer)
    // peer.onicecandidate = async (e) => await peer.addIceCandidate(e.candidate)
    return peer
}

async function consumeNegotiation(peer) {
    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    const payload = {
        sdp: peer.localDescription
    }
    fetch(bruh+"/webrtc/consume",
        {
            method:"POST",
            body:JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
              },
        }).then(response => {
            if(response.ok)
            {
                console.log(response)
                return response.json()
            }
            console.log(response)
            throw new Error("consume endpoint failure");
        }).then(data =>{
            console.log(data)
            const desc = new RTCSessionDescription(data);
            peer.setRemoteDescription(desc).catch(e => console.log(e));
            peer.ontrack = consumerTrackHandler
        })
}

async function consumerTrackHandler(e) {
    console.log("test")
    document.getElementById("streamOffline").style.display = "none"
    document.getElementById("mortStream").style.display = "block"
    document.getElementById("mortStream").srcObject = e.streams[0]
    console.log(e)
}

document.getElementById("watchButton").addEventListener("click",function(e)
{
    consumerInit()
})