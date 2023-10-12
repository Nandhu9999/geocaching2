import { socketInit } from "./socketClient.js"

// console.log("authorization.js")

export const authObj = {
    verifying: false,
    AUTHORIZED: false
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
        authObj.AUTHORIZED = true
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
    
    const response = await validateForm("",e.target[0].value)
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
    }
}