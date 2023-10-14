// console.log("sidebarscript.js")
import { authObj } from "./authorization.js"
import { updateUser } from "./chatscript.js"

// [!] DO NOT REMOVE
// these functions are used 
// inside the evaluated string.
import { defaultState, overlayState, setOverlayState } from "./frameState.js"
import { tempPfp } from "./utils.js"


export let CHANNELS = []
export let MEMBERS  = []

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

export async function updateSidebarContents(){
    CHANNELS = await (await fetch("/api/channels")).json()
    MEMBERS  = await (await fetch("/api/members")).json()

    if(Array.isArray(CHANNELS) && Array.isArray(MEMBERS)){
      updateChannelContents()    
      updateMembersContents()    
    } else {
        CHANNELS = []
        MEMBERS  = []
    }
}


function updateChannelContents(){
    const listContainer = sidebarLeft.querySelector("ul");
    listContainer.innerHTML = ""
    
    CHANNELS.forEach(({label, exec}) => {
        const listItem = document.createElement("li")
        listItem.innerText = label
        listItem.classList = "noSelect"
        const itemFunction = eval('(' + exec + ')');
        listItem.onclick = ()=>{itemFunction()}

        listContainer.appendChild(listItem)
    })
}

export function updateMembersContents(){
    const listContainer = sidebarRight.querySelector("ul");
    listContainer.innerHTML = ""
    
    MEMBERS.forEach(({socketid, username, pfp}) => {
        const listItem = document.createElement("li")
        listItem.innerHTML   = `${username}`
        listItem.classList   = "noSelect"
        listContainer.appendChild(listItem)
    })
}

const profileBar = $(".sidebarLeft .profile")

const profileModal = $("#profileModal")
const profileForm = $("#profileModal form")

const profileModalClose = $("#profileModal .modalClose")
profileBar.addEventListener("click", ()=>{
    
    if(authObj.account.pfp){profileModal.querySelector("img").src = authObj.account.pfp}
    if(authObj.account.username){profileModal.querySelector("h2").innerText = authObj.account.username}
    profileModal.showModal();
})
profileModalClose.addEventListener("click", ()=>{profileForm.reset(); profileModal.close();})
profileForm.addEventListener("submit", editProfile);
function editProfile(e){
    e.preventDefault();
    const username = e.target[0].value
    const pfp      = e.target[1].value

    updateUser(username, pfp)
    
    e.target[0].value = ""
    e.target[1].value = ""

    profileModal.close()
}