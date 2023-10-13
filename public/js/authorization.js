import { defaultState } from "./frameState.js"
import { socketInit } from "./socketClient.js"
import { randomUUID } from "./utils.js"

// console.log("authorization.js")

export const authObj = {
    verifying: false,
    AUTHORIZED: false,
    uid: "",
    account: {
        username: "",
        pfp:""
    }
}

const authModal = $("#authModal")
const authForm = $("#authModal form")

export async function checkAuth(){
    if (authObj.verifying) return

    async function validateSessions(){
        try{
            const rresponse = await fetch("/api/authorize")
            const response = await rresponse.json();
            return response
        } catch {
            return { status: "error" }
        }
    }
    
    authObj.verifying = true
    const response = await validateSessions();
    authObj.verifying = false

    if(response && response.status == "ok"){
        console.log("SESSIONS: ✅")
        authObj.AUTHORIZED       = true
        const accountItem        = JSON.parse(window.localStorage.getItem("account"))
        authObj.uid              = accountItem.uid
        authObj.account.username = accountItem.username
        userActivate()
        return
    }

    authObj.AUTHORIZED = false
    authModal.showModal()
}

async function authenticateUser(e){
    e.preventDefault();
    authForm.querySelector("button").innerText = "loading.."
    
    async function validateForm(username = null, password = null){
        
        if (!password){
            return "invalid"
        }
        try{
            const rresponse = await fetch("/api/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    username: username,
                    password: password
                })
            })
            const response = await rresponse.json();
            return response
        } catch {
            return { status: "error" }
        }
    }
    
    const username = e.target[0].value
    const password = e.target[1].value

    const response = await validateForm(username, password)
    authForm.querySelector("button").innerText = "submit"

    if (!response){
        e.target[0].value = ""
        alert("error")
        return
    }
    else if(response.status == "error"){
        e.target[0].value = ""
        alert("server error", response.message)
    }
    else if(response.status == "ok"){
        authObj.AUTHORIZED = true
        authObj.account.username = username

        const accountItem = {
            uid      : randomUUID(8),
            username : username,
            pfp      : ""
        }

        window.localStorage.setItem("account", JSON.stringify(accountItem))
        userActivate()
        authModal.close()
    }
}

function forceClose(e){
    if (!authObj.AUTHORIZED){
        e.preventDefault();
        authModal.showModal()
    }
}

if (authObj.AUTHORIZED == false) checkAuth()
authModal.addEventListener("close", forceClose)
authForm.addEventListener("submit",authenticateUser)

function userActivate(){
    if (authObj.AUTHORIZED){
        socketInit()
        defaultState;
    }
}