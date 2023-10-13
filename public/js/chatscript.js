import { authObj } from "./authorization.js";
import { socketObj } from "./socketClient.js"
import { getTimePrefix, randomUUID } from "./utils.js"

console.log("chatscript.js")

function containerSize(){
    const { x, y, width, height } = navigator.virtualKeyboard.boundingRect;
    $("#container").style.height = `calc(100% - ${height}px)`;
}

const widgetOpts = $("#widget")
const textArea = $("#textarea")
const sendBtn = $("#send")

function systemInit(){
    if ("virtualKeyboard" in navigator) {
        navigator.virtualKeyboard.overlaysContent = true;
        navigator.virtualKeyboard.addEventListener("geometrychange", containerSize);
    }

    widgetOpts.addEventListener("click", widgetClicked)
    textArea.addEventListener("click", textareaClicked)
    sendBtn.addEventListener("click", sendClicked)

    function KEYDOWN(e){
        if( e.code == "Enter" && e.shiftKey == false ){
            sendClicked();
            e.preventDefault();
        }
    }

    if( window.mobileAndTabletCheck ){textArea.addEventListener("keydown", KEYDOWN)}
    else {textArea.addEventListener("keydown", KEYDOWN)}

}

function widgetClicked(){
    widgetOpts.classList.toggle("active")
    updateWidgetState();
    textArea.focus();
}

function updateWidgetState(){
    const widgetActive = widgetOpts.classList.contains("active")
    // console.log(widgetActive ? "open" : "close", "widget")
    if ( widgetActive ){
        $(".widgetDialog").show();
    } else {
        $(".widgetDialog").close();
    }
}

function textareaClicked(){
    widgetOpts.classList.remove("active")
    updateWidgetState()

}

function sendClicked(){
    if(!textArea.innerText.trim()){return}

    const myMessage = {
        uid       : authObj.uid,
        username  : authObj.account.username,
        messageid : `msgid${randomUUID(12)}`,
        content   : textArea.innerText,
        timestamp : Date.now(),
        pfp       : authObj.account.pfp
    }

    textArea.innerText = ""
    textArea.focus()
    
    socketObj.io.emit("messageServer", myMessage)
    appendMessage(myMessage, 0.5)
}

export function appendMessage(data, opacity = 1){
    const msg = new MessageCreator(data)

    msg.autoGenerateFormat()
    msg.setOpacity(opacity)

    document.querySelector(".chatlogs").appendChild(msg.tag)
    // document.querySelector(".chatlogs2").appendChild(msg.tag)
}

export class MessageCreator{
    static lastuid = "";
    static sameUIDCount = 0;

    constructor({uid, username, messageid, timestamp, content, pfp}){
        this.uid       = uid
        this.username  = username
        this.timestamp = timestamp
        this.content   = content
        this.pfp       = pfp

        this.tag               = document.createElement("div");
        this.tag.id            = messageid
        this.tag.classList     = "usermessage"
        this.tag.oncontextmenu = "return false"
        this.tag.innerHTML     = `<div data-col1></div><div data-col2></div>`
    }

    autoGenerateFormat(){
        if(MessageCreator.lastuid != this.uid || MessageCreator.sameUIDCount > 5) {
            this.setMsgHeaders()
            this.tag.classList.add("hasHeader")
            this.setUserPfp()
            MessageCreator.sameUIDCount = 0
        }else{
            MessageCreator.sameUIDCount += 1
        }

        this.setTextContent()

        MessageCreator.lastuid = this.uid
    }

    setMsgHeaders(){
        const textHeader = document.createElement("div")
        textHeader.innerHTML = `
            <div class="msgheader" unselectable="on">${this.username} | ${getTimePrefix(this.timestamp)}</div>
        `
        this.tag.querySelector("[data-col2]").prepend(textHeader)
    }
    setUserPfp(){
        const userPfp = document.createElement("img")
        userPfp.src = this.pfp || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_v437iy1U9932C6L6Jzi8HBjgbzH4huC6rA&usqp=CAU"
        this.tag.querySelector("[data-col1]").appendChild(userPfp)
    }
    setTextContent(){
        const textContent = document.createElement("div")
        textContent.innerHTML = `<div class="msgcontent" unselectable="on">${this.content}</div>`
        this.tag.querySelector("[data-col2]").appendChild(textContent)
    }

    setOpacity(val){
        this.tag.style.opacity = val;
    }
}


systemInit();