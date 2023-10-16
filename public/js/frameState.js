import { authObj } from "./authorization.js";
import { socketObj } from "./socketClient.js"
import { appendMessage } from "./chatscript.js";
import { randomUUID, tempPfp } from "./utils.js"
import { toggleSidebarLeft, forceFocusMain, toggleSidebarRight } from "./sidebarscript.js";

// console.log("frameState.js")

export function updateUser(username, pfp){
    if ( username ) {authObj.account.username = username}
    if (      pfp ) {authObj.account.pfp      = pfp}

    const accountItem        = JSON.parse(window.localStorage.getItem("account"))
    accountItem.username     = authObj.account.username
    accountItem.pfp          = authObj.account.pfp

    window.localStorage.setItem("account", JSON.stringify(accountItem))
    updateUserDOMElements();
}

export function updateUserDOMElements(){
    $(".sidebarLeft .profile img").src = authObj.account.pfp || tempPfp
    $(".sidebarLeft .profile .usernameDisplay").innerText = authObj.account.username
}

export function defaultState(){
    document.querySelector("main").dataset.state = "default"
    
    document.querySelector(".mainheader").classList.remove("hide")
    document.querySelector(".maincontent").classList.remove("hide")
    document.querySelector(".mainfooter").classList.remove("hide")
    
    document.querySelector(".overlayFrame").classList.add("hide")
    document.querySelector(".overlayChatWindow").classList.add("hide")

    // move chatlogs to default chat space
    $(".maincontent").appendChild(document.getElementById("chatlogs"));

    // focus to main 
    forceFocusMain();
}

export function overlayState(){
    $("main").dataset.state = "overlay"
    
    $(".overlayFrame").classList.remove("hide")
    $(".overlayChatWindow").classList.add("hide")
    
    $(".mainheader").classList.add("hide")
    $(".maincontent").classList.add("hide")
    $(".mainfooter").classList.add("hide")

    // move chatlogs to overlay chat window
    $(".overlayChatlogs").append(document.getElementById("chatlogs"));

    // focus to main 
    forceFocusMain();
}

export function setOverlayState(type, media){
    if(type == "embed"){

        const iframe = document.createElement("iframe")
        iframe.src               = media.link + "?autostart=true"
        iframe.allowtransparency = "false" 
        iframe.width             = "980"
        iframe.height            = "100%"
        iframe.frameborder       = "0" 
        iframe.scrolling         = "no"
        iframe.allowfullscreen   = "true"
        iframe.style.position    = "absolute"
        iframe.style.left        = "50%"
        iframe.style.translate   = "-50% 0"

        $(".overlayFrame").innerHTML   = ""
        $(".overlayFrame").appendChild(iframe)
        
        const chatButton = document.createElement('div');
        chatButton.classList = "chatButton";
        chatButton.innerText = "💬"
        chatButton.onclick = () => { setChatOverlay(true) }
        $(".overlayFrame").appendChild(chatButton)

    }
    else if(type == "movie"){

        const movieFrame = document.createElement("video")
        const source     = document.createElement("source")
        const  track     = document.createElement("track")

        source.src       = media.stream
        source.type      = "video/mp4"
        track.src        = media.captions
        track.label      = "English"
        track.kind       = "captions"
        track.srclang    = "en-us"
        track.default    = true

        movieFrame.appendChild(source)    
        movieFrame.appendChild( track)    
        $(".overlayFrame").innerHTML   = ""
        $(".overlayFrame").appendChild(movieFrame)
    }
}


function setChatOverlay(open){
    if(open == true){
        $(".overlayChatWindow").classList.remove("hide")
        $(".chatButton").classList.add("hide")

        $(".overlayChatWindow .overlayHeader .expandOchannels").onclick = ()=>{toggleSidebarLeft()}
        $(".overlayChatWindow .overlayHeader .expandOmembers").onclick = ()=>{toggleSidebarRight()}

        // ################################################
        sendBtn.onclick = sendClicked
        function KEYDOWN(e){
            if( e.code == "Enter" && e.shiftKey == false ){
                sendClicked();e.preventDefault();
            }
        }
        if( window.mobileAndTabletCheck ){textArea.onkeydown = KEYDOWN}
        else {textArea.onkeypress = KEYDOWN}
        // ################################################
    }
    else if(open == false){
        $(".overlayChatWindow").classList.add("hide")
        $(".chatButton").classList.remove("hide")
    }
}

const closeChat = document.querySelector(".overlayChatWindow .closechat")
const textArea = document.querySelector(".overlayChatWindow .textarea")
const sendBtn = document.querySelector(".overlayChatWindow .send")

closeChat.addEventListener("click", ()=>{setChatOverlay(false)})

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
