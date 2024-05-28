const indexController = require("../controllers/IndexController");

async function indexRoutes(fastify, options) {
  fastify.get("/", indexController.index);
  fastify.post("/", indexController.login);
  fastify.get("/register", (request, reply) => {
    return reply.view("/src/pages/register.hbs", {});
  });
  fastify.post("/register", indexController.register);
  fastify.get("/forgot", (request, reply) => {
    return reply.view("/src/pages/forgot.hbs", {});
  });
  fastify.get("/healthz", (request, reply) => {
    return reply.send({ status: "OK" }).code(200);
  });
  /*
   *  APPLICATION RELATED ROUTES
   */
  fastify.get("/game", indexController.game);
  fastify.get("/inventory", indexController.inventory);
  fastify.get("/leaderboards", (request, reply) => {
    return reply.view("/src/pages/leaderboards.hbs", {});
  });
  fastify.get("/create", indexController.createGeocache);
}

module.exports = indexRoutes;
