socket.on("viewAcceptServer", function (data) {
    viewAcceptServer(data)
})

let globalPeer

socket.on("sendIceToViewersServer", function (data) {
    console.log("recieved candidate" + data["candidate"])
    globalPeer.addIceCandidate(data["candidate"])
})

async function consume() {
    const peer = new RTCPeerConnection(servers)
    peer.onicecandidate = (e) => {socket.emit("sendIceToStreamerClient", {candidate:e.candidate })}
    peer.addTransceiver("video", { direction: "recvonly" });
    // peer.onnegotiationneeded = () => consumeNegotiation(peer)
    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    // peer.onicecandidate = (e) => peer.addIceCandidate(e.candidate)
    globalPeer = peer
    let payload =
    {
        type: "offer",
        sdp: offer.sdp
    }
    socket.emit("viewOfferClient", payload)
}

async function viewAcceptServer(data) {
    let remotedesc = new RTCSessionDescription()
    remotedesc.sdp = data["sdp"]
    remotedesc.type = "answer"
    globalPeer.setRemoteDescription(remotedesc)
    globalPeer.ontrack = (g) => {
        console.log(g.streams[0])
        document.getElementById("mortStream").srcObject = g.streams[0]
        document.getElementById("mortStream").style.display = "block"
        document.getElementById("streamOffline").style.display = "none"
    }
    //  globalPeer.addTransceiver("video", { direction: "recvonly" })
    globalPeer.onnegotiationneeded = (e) => {
        globalPeer.ontrack = (g) => {
            console.log("fired here for some reason")
            document.getElementById("mortStream").srcObject = g.streams[0]
            document.getElementById("mortStream").style.display = "block"
            document.getElementById("streamOffline").style.display = "none"
        }
    }

}

