import { io } from "https://cdn.socket.io/4.5.0/socket.io.esm.min.js"
import { MEMBERS, updateSidebarContents, updateMembersContents } from "./sidebarscript.js";
import { checkAuth, authObj } from "./authorization.js";
import { appendMessage, appendVerifiedMessage } from "./chatscript.js";

export const socketObj = {
  reconnects: 0,
  io: undefined
}


export function socketInit(){
  const socket = io();
  socketObj.io = socket

  socket.on("connect", userConnected);
  
  socket.on("enter", userEntered)
  socket.on("exit", userExited)

  socket.on("messageGlobal", onMessageReceived)
  socket.on("messageVerified", messageVerified)

  socket.on("disconnect", () => {
    console.log("SOCKETIO: ❌")
    // checkAuth();
    // MEMBERS.length = 0
    // updateMembersContents()
  });

}

async function userConnected(){

  if (!socketObj.io.disconnected && authObj.AUTHORIZED ) {
    console.log(`SOCKETIO: ✅ (${socketObj.reconnects} reconnects)`)
    socketObj.reconnects += 1;
    
    socketObj.io.emit("join", authObj.account.username);
    updateSidebarContents();
  }
}

async function userEntered({socketid, username}){
  console.log(socketid, "joined")
  MEMBERS.push({socketid:socketid, username:username})
  updateMembersContents()
}

async function userExited({socketid}){
  console.log(socketid, "left")
  const idx = MEMBERS.findIndex((x) => x.socketid == socketid )
  MEMBERS.pop(idx)
  updateMembersContents()
}

function onMessageReceived(data){
  appendMessage(data)
}

function messageVerified({messageid}){
  appendVerifiedMessage(messageid)
}