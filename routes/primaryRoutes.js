const data = require("../src/data.json");
const db = require("../src/" + data.database);

const seo = require("../src/seo.json");

if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

function authorizeRequest(request, reply, next){

    const URL = request.url
    const ISAUTH = request.session.isAuthenticated
    
    /* 
     *  All Unauthorized and 
     *  /api prefixed urls
     *  NOT ALLOWED except
     *  some valid urls
     */

    if( ISAUTH === undefined && URL.startsWith("/api/")){
        console.log(request.url)

        VALID_URLS = ["/api/authenticate"]
        if(VALID_URLS.indexOf(URL) == -1){
            return reply.send({status: "error", reason: "not authorized" })
        }
    }
    
    next()
}

async function checkAuthorized(request, reply){
    console.log("checking authorization")
    return reply.send({ status: "ok" })
}

async function home(request, reply) {
    return reply.view("/src/pages/index.hbs", {seo: seo});
};

async function authenticate(request, reply) {
    const { password } = request.body;
    const ADMIN_KEY = process.env.ADMIN_KEY
    if (password == ADMIN_KEY) {
        request.session.isAuthenticated = true;
        return reply.send({ status: "ok" });
    }
    return reply.send({ status: "error" });
};

async function logout(request, reply){
    if(request.session.isAuthenticated){
        request.session.destroy();
        return reply.redirect("/");
    }else{
        return reply.type("json").send({error:"user not found to logout"});
    }
}

async function totalChannels(request, reply){
    // functions will be converted to string
    // only will be executed in the client side
    const home = function (){defaultState();}
    const game = function (){overlayState();setOverlayState('embed','https://scratch.mit.edu/projects/904596842/embed')}
    const   tv = function (){console.log("tv")}

    const channels = [
        {label: "home", exec: home.toString()},
        {label: "game", exec: game.toString()},
        {label: "t.v.", exec:   tv.toString()}
    ]
    return reply.send(channels)
}

async function totalMembers(request, reply){
    const response = await db.getMembers()
    console.log(response)
    return reply.send(response)
}

module.exports = {
    home,
    authenticate,
    logout,
    authorizeRequest,
    checkAuthorized,

    totalChannels,
    totalMembers
}