console.log("chatscript.js")

function containerSize(){
    const { x, y, width, height } = navigator.virtualKeyboard.boundingRect;

    $("#container").style.height = `calc(100% - ${height}px)`;
}

if ("virtualKeyboard" in navigator) {
    navigator.virtualKeyboard.overlaysContent = true;
    navigator.virtualKeyboard.addEventListener("geometrychange", containerSize);
}