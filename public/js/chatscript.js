import { authObj } from "./authorization.js";
import { socketObj } from "./socketClient.js"
import { getTimePrefix, randomUUID, tempPfp } from "./utils.js"

// console.log("chatscript.js")

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
    textArea.addEventListener("input", isTyping)
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

export function forceCloseWidget(){
    widgetOpts.classList.remove("active")
    updateWidgetState();
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
    
    if(socketObj.active){
        socketObj.io.emit("messageServer", myMessage)
        appendMessage(myMessage, 0.5)
    } else {
        console.log("socket disconnected..")
    }
}

let lastTypedTimestamp = 0;
function isTyping(){
    const currTimestamp = Date.now()
    if(currTimestamp - lastTypedTimestamp < 5000 || !textArea.innerText.trim())
        {return}
    
    lastTypedTimestamp = currTimestamp;
    if(socketObj.active){
        socketObj.io.emit("isTyping", null)
    } else {
        console.log("socket disconnected..")
    }
}

export function appendBulkMessages(msgsArray){
    msgsArray.forEach(msg=>{appendMessage(msg, 1)})
}

export function appendMessage(data, opacity = 1){
    const msg = new MessageCreator(data)

    msg.autoGenerateFormat()
    msg.setOpacity(opacity)

    $("#chatlogs").appendChild(msg.tag)
    const msgHeight = msg.getHeight()
    $(".maincontent").scrollBy( 0, msgHeight)
    $(".overlayChatlogs").scrollBy( 0, msgHeight)
}
export function appendVerifiedMessage(messageid){
    const message = $("#chatlogs").querySelector("#" + messageid)
    if (message) {message.style.opacity = 1}
}
export class MessageCreator{
    static lastMsg = {
        uid: "",
        username:"",
        timestamp: 0
    };
    static sameUIDCount = 0;
    constructor({uid, username, messageid, timestamp, content, pfp}){
        this.uid       = uid
        this.username  = username
        this.timestamp = timestamp
        this.content   = content
        this.pfp       = pfp

        this.tag               = document.createElement("div");
        this.tag.id            = messageid
        this.tag.classList     = "usermessage noSelect"
        this.tag.oncontextmenu = "return false"
        this.tag.innerHTML     = `<div data-col1></div><div data-col2></div>`
    }

    autoGenerateFormat(){
        // show msg header 
        // IF UID is newer
        // OR more than 5 messages from same uid 
        // OR been more than 5 mins from same uid
        // OR if the name is new
        if(   MessageCreator.lastMsg.uid != this.uid 
            || MessageCreator.sameUIDCount > 5 
            || MessageCreator.lastMsg.timestamp - Date.now() > 1000 * 60 * 5
            || MessageCreator.lastMsg.username != this.username
        ) {
            this.setMsgHeaders()
            this.setUserPfp()
            this.tag.classList.add("hasHeader")
            MessageCreator.sameUIDCount = 0
        }else{
            MessageCreator.sameUIDCount += 1
        }

        this.setTextContent()
        MessageCreator.lastMsg.uid       = this.uid
        MessageCreator.lastMsg.username  = this.username
        MessageCreator.lastMsg.timestamp = this.timestamp

        this.tag.addEventListener("pointerdown", this.msgTapped,true)
        this.tag.addEventListener("pointerup", this.msgTapRelease,true)
        this.tag.addEventListener("contextmenu", this.msgContextMenu,true)
    }

    setMsgHeaders(){
        const msgHeader = document.createElement("div")
        msgHeader.innerHTML = `
            <div class="msgheader" unselectable="on">
                <span data-username>${this.username}</span>
                <span data-timestamp>${getTimePrefix(this.timestamp)}</span>
            </div>`
        this.tag.querySelector("[data-col2]").prepend(msgHeader)
    }
    setUserPfp(){
        const userPfp = document.createElement("img")
        userPfp.src = this.pfp || tempPfp
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
    getHeight(){
        let headerHeight = 0
        if(this.tag.classList.contains("hasHeader")) headerHeight = 10
        return (this.tag.offsetHeight + headerHeight + 10)
    }
    msgTapped(e){
        let tempParent = e.target
        while (!tempParent.classList.contains("usermessage")){
            tempParent = tempParent.parentElement
        }
        tempParent.classList.add("highlightEffect")
        tempParent.dataset.touchdownTime = Date.now();
    }
    msgTapRelease(e){
        let tempParent = e.target
        while (!tempParent.classList.contains("usermessage")){
            tempParent = tempParent.parentElement
        }
        tempParent.classList.remove("highlightEffect")
        const longpressTime = Date.now() - tempParent.dataset.touchdownTime; 
        if (longpressTime > 250){
            MessageCreator.openCtxMenu(tempParent)
        }
    }
    msgContextMenu(e){
        e.preventDefault();
        let tempParent = e.target
        while (!tempParent.classList.contains("usermessage")){
            tempParent = tempParent.parentElement
        }
        MessageCreator.openCtxMenu(tempParent)
        return false;
    }
    static getSummary(tag){
        const summary = tag.cloneNode(true)
        summary.id = ""
        
        return summary
    }
    static openCtxMenu(tag){
        $("#userMessageModal").showModal();
        if( !window.mobileAndTabletCheck() ){
            $("#userMessageModal").classList.add("centerDisplay");
        }

    }
}

export function loadChatMessages(part = 0){
    if (!authObj.AUTHORIZED){return}
    /*
     * part system used to display only 
     * limited messages from entire corpus
     * maximum only two parts should be active
     */
    $("#chatlogs").innerHTML = `<h1 style="padding:10px;" class="noSelect">#chat</h1>`
}

systemInit();