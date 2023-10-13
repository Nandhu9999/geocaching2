console.log("frameState.js")

export function defaultState(){
    document.querySelector("main").dataset.state = "default"
    
    document.querySelector(".mainheader").classList.remove("hide")
    document.querySelector(".maincontent").classList.remove("hide")
    document.querySelector(".mainfooter").classList.remove("hide")
    
    document.querySelector(".overlayFrame").classList.add("hide")
    document.querySelector(".overlayChatWindow").classList.add("hide")
}

export function overlayState(){
    document.querySelector("main").dataset.state = "overlay"

    document.querySelector(".overlayFrame").classList.remove("hide")
    
    document.querySelector(".mainheader").classList.add("hide")
    document.querySelector(".maincontent").classList.add("hide")
    document.querySelector(".mainfooter").classList.add("hide")

}

export function setOverlayState(type, link){
    if(type == "embed"){

        const iframe = document.createElement("iframe")
        iframe.src               = link + "?autostart=true"
        iframe.allowtransparency = "false" 
        iframe.width             = "980"
        iframe.height            = "100%"
        iframe.frameborder       = "0" 
        iframe.scrolling         = "no"
        iframe.allowfullscreen   = "true"
        iframe.style.position    = "absolute"
        iframe.style.left        = "50%"
        iframe.style.translate   = "-50% 0"

        document.querySelector(".overlayFrame").innerHTML   = ""
        document.querySelector(".overlayFrame").appendChild(iframe)
        
        const chatButton = document.createElement('div');
        chatButton.classList = "chatButton";
        chatButton.onclick = () => { setChatOverlay(true) }
        document.querySelector(".overlayFrame").appendChild(chatButton)
    }
}


function setChatOverlay(open){
    if(open == true){
        document.querySelector(".overlayChatWindow").classList.remove("hide")
        document.querySelector(".chatButton").classList.add("hide")
        
        document.querySelector(".overlayChatWindow .overlayHeader .closeOchat")
                .addEventListener("click", ()=>{
                    setChatOverlay(false)
                })

        document.querySelector(".overlayChatWindow .overlayHeader .expandOchat")
                .addEventListener("click", ()=>{
                    defaultState()
                })
    }
    else if(open == false){
        document.querySelector(".overlayChatWindow").classList.add("hide")
        document.querySelector(".chatButton").classList.remove("hide")
    }
}