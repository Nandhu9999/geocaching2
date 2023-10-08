console.log("chatscript.js")

function containerSize(){
    const { x, y, width, height } = navigator.virtualKeyboard.boundingRect;

    $("#container").style.height = `calc(100% - ${height}px)`;
}

if ("virtualKeyboard" in navigator) {
    navigator.virtualKeyboard.overlaysContent = true;
    navigator.virtualKeyboard.addEventListener("geometrychange", containerSize);
}

const widgetOpts = $("#widget")
const textArea = $("#textarea")
const sendBtn = $("#send")

widgetOpts.addEventListener("click", widgetClicked)
textArea.addEventListener("click", textareaClicked)

sendBtn.addEventListener("click", sendClicked)
textArea.addEventListener("keypress", (e)=>{
    if( e.code == "Enter" && e.shiftKey == false ){
        sendClicked();
        e.preventDefault();
    }
})

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