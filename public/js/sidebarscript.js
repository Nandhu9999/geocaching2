console.log("sidebarscript.js")

const sidebarLeft = $(".sidebarLeft")
const sidebarRight = $(".sidebarRight")

const mainBlock = $("#container main")
const menuBtn = $("#menuBtn")
const usersBtn = $("#usersBtn")

let cooldown = 0

menuBtn.addEventListener("click", toggleSidebarLeft)
usersBtn.addEventListener("click", toggleSidebarRight)
mainBlock.addEventListener("click", clickedMain)

function toggleSidebarLeft(){
    sidebarLeft.classList.toggle("active");
    if ( sidebarLeft.classList.contains("active") ){
        cooldown = Date.now() + 100;
    }
}

function toggleSidebarRight(){
    sidebarRight.classList.toggle("active");
    if ( sidebarRight.classList.contains("active") ){
        cooldown = Date.now() + 100;
        sidebarLeft.classList.add("leftSidebarActive");
    }
}

function clickedMain(){
    if (Date.now() < cooldown) { return }

    sidebarLeft.classList.remove("active");
    sidebarRight.classList.remove("active");
    sidebarLeft.classList.remove("leftSidebarActive");
}