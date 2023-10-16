import { io } from "https://cdn.socket.io/4.5.0/socket.io.esm.min.js"
import { MEMBERS, updateMembersContents, saveProfileEdit } from "./sidebarscript.js";
import { authObj } from "./authorization.js";
import { appendMessage, appendVerifiedMessage } from "./chatscript.js";
import { closeLoader } from "./utils.js";

export const socketObj = {
  reconnects: 0,
  io: undefined,
  active: false
}


export function socketInit(){
  const socket = io();
  socketObj.io = socket

  socket.on("connect", userConnected);
  
  socket.on("enter", userEntered)
  socket.on("exit", userExited)

  socket.on("messageGlobal", onMessageReceived)
  socket.on("messageVerified", messageVerified)

  socket.on("pushUpdate", socketUpdateMessage)
  socket.on("updateProfileStatus", updateProfileStatus)

  socket.on("disconnect", () => {
    console.log("SOCKETIO: ❌")
    socketObj.active = false;
    // checkAuth();
    // MEMBERS.length = 0
    // updateMembersContents()
  });

}

async function userConnected(){

  if (!socketObj.io.disconnected && authObj.AUTHORIZED ) {
    console.log(`SOCKETIO: ✅ (${socketObj.reconnects} reconnects)`)
    socketObj.reconnects += 1;
    socketObj.active      = true;
    
    authObj.sid = socketObj.io.id

    socketObj.io.emit("join", authObj.account.username);
  }
}

async function userEntered({socketid, username}){
  console.log(socketid, `(${username}) joined`)
  MEMBERS.push({socketid:socketid, username:username})
  updateMembersContents()
}

async function userExited({socketid}){
  const idx = MEMBERS.findIndex((x) => x.socketid == socketid )
  console.log(socketid, `(${MEMBERS[idx].username}) left`)
  MEMBERS.pop(idx)
  updateMembersContents()
}

function onMessageReceived(data){
  appendMessage(data)
}

function messageVerified({messageid}){
  appendVerifiedMessage(messageid)
}

function socketUpdateMessage(data){
  console.log(data)
}

function updateProfileStatus(status){
  console.log("status")
  if(status == "ok"){
    saveProfileEdit()
    closeLoader()
  }
}