const data = require("../src/data.json");
const db = require("../src/" + data.database);

function socketConnection(socket){
  const connections = []
  console.info('🟢 socket    connected:', socket.id.slice(0, 5));

  socket.on("join", async(username)=>{
    db.addMember(socket.id, username)

    const userObj = {socketid: socket.id,username: username}

    socket.broadcast.emit("enter", userObj);
    connections.push(userObj)
  })

  socket.on("disconnect", async(data) => {
    console.log("🔴 socket disconnected:",socket.id.slice(0, 5));
    await db.deleteMember(socket.id)
    
    const idx = connections.findIndex((x) => x.socketid == socket.id )
    const userObj = connections[idx]

    socket.broadcast.emit("exit", userObj);
    connections.pop(idx)
  })
}



module.exports = {
  socketConnection
}