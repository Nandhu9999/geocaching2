// console.log("authorization.js")
export let AUTHORIZED = true;

const authModal = $("#authModal")
const authModalBtn = $("#authModal button")

function checkAuth(){
    console.log("checking...")
    authModal.showModal()
}

function confirmAuth(){
    console.log("confirming...")
    authModal.close()
}

if (AUTHORIZED == false) checkAuth()
authModalBtn.addEventListener("click",confirmAuth)