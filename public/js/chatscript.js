import { socketObj } from "./socketClient.js"
import { randomUUID } from "./utils.js"

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
        username: "username",
        messageid: `msgid${randomUUID(24)}`,
        content: textArea.innerText,
        timestamp: Date.now(),
        pfp: ""
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

    $(".chatlogs").appendChild(msg.tag)
}

export class MessageCreator{

    constructor({username, messageid, timestamp, content, pfp}){
        this.username  = username
        this.timestamp = timestamp
        this.content   = content
        this.pfp       = pfp

        this.tag            = document.createElement("div");
        this.tag.id         = messageid
        this.tag.innerHTML  = `<div data-col1></div><div data-col2></div>`
    }

    autoGenerateFormat(){
        this.setMsgHeaders()
        this.setTextContent()
    }

    setMsgHeaders(){
        const textHeader = document.createElement("div")
        textHeader.innerHTML = `<div class="msgheader" unselectable="on">${this.username} | ${this.timestamp}</div>`
        this.tag.querySelector("[data-col2]").prepend(textHeader)
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