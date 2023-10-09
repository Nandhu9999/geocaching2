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
    const widgetActive = widgetOpts.classList.contains("active")
    console.log(widgetActive ? "open" : "close", "widgets")

    if ( widgetActive ){
        $(".widgetDialog").close();
    } else {
        $(".widgetDialog").show();
    }

    textArea.focus()
}

function textareaClicked(){

}

function sendClicked(){
    appendMessage(textArea.innerText)
    textArea.innerText = ""
    textArea.focus()
}

function appendMessage(msg){
    const p = document.createElement("p")
    p.innerText = msg
    $(".chatlogs").append(p)
}





systemInit();