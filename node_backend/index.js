const { Server } = require("socket.io");
const { v4: uuidv4 } = require('uuid');

const io = new Server({ cors: { origin: "*" } });

io.on("connection", (socket) => {
  const id = uuidv4()
  socket.emit("id", id)
  socket.on("update", (data) => {
    console.log(data)
    io.emit("stateUpdate", data)
  })

  socket.on("disconnect", () => {
    io.emit("disconnection", id)
  })
});

io.listen(3000);