const fs = require("fs");
const path = require("path");
const fastify = require("fastify")({logger: false,});

// CONFIG
const PORT = process.env.PORT || 3000
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

const data = require("./src/data.json");
const db = require("./src/" + data.database);

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),prefix: "/",
});

fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/view"), {
  engine: {handlebars: require("handlebars"),},
});

fastify.register(require('@fastify/cookie'), {
  secret: COOKIE_SECRET, // for cookies signature
  parseOptions: {}     // options for parsing cookies
})
fastify.register(require("@fastify/session"), {
  secret: SESSION_SECRET,
  saveUninitialized: true, 
  cookie: {
    secure:false, 
    httpOnly: true, 
    sameSite: true, 
    maxAge: 1000 * 60 * 60 * 24
  }
});

const {
  home, 
  authenticate,
  logout,
  authorizeRequest,
  checkAuthorized,
  totalChannels,
  totalMembers} = require("./routes/primaryRoutes")

const { socketConnection } = require("./routes/socketServer")

// HOOKS  
fastify.addHook("onRequest", authorizeRequest);

// ROUTES
fastify.get("/", home);
fastify.get("/api/logout", logout);
fastify.get("/api/authorize", checkAuthorized);

fastify.get("/api/channels", totalChannels);
fastify.get("/api/members", totalMembers);

fastify.post("/api/authenticate", authenticate);


// WEBSOCKET CONNECTION

fastify.register(require('fastify-socket.io'));
fastify.ready(async(err) => {
  if (err) throw err
  fastify.io.on('connection', socketConnection);
});


// Run the server and report out to the logs
fastify.listen(
  { port: PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
