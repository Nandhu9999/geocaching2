console.log("authorization.js")
export let AUTHORIZED = false;

const authModal = $("#authModal")
const authForm = $("#authModal form")

async function checkAuth(){
    console.log("checking...")
    async function validateSessions(){
        try{
            const rresponse = await fetch("/api/authorize")
            const response = await rresponse.json();
            return response
        } catch {
            return { status: "error" }
        }
    }
    
    const response = await validateSessions();
    
    if(response &&  response.status == "ok"){
        console.log("session is active")
        AUTHORIZED = true
        return 
    }

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
        authModal.close()
    }
}

if (AUTHORIZED == false) checkAuth()
authForm.addEventListener("submit",authenticateUser)