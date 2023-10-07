const fs = require("fs");
const path = require("path");
const fastify = require("fastify")({logger: false,});

fastify.register(require("@fastify/static"), {root: path.join(__dirname, "public"),prefix: "/",});

fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/view"), {
  engine: {handlebars: require("handlebars"),},
});

const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

const data = require("./src/data.json");
const db = require("./src/" + data.database);

/*
 * HOME ROUTE
*/

fastify.get("/", async (request, reply) => {
  return reply.view("/src/pages/index.hbs", {seo: seo});
});







// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
