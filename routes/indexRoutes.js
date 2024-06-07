const indexController = require("../controllers/IndexController");

async function indexRoutes(fastify, options) {
  fastify.get("/", indexController.index);
  fastify.post("/", indexController.login);
  fastify.get("/register", (request, reply) => {
    return reply.view("/src/pages/register.hbs", {});
  });
  fastify.post("/register", indexController.register);
  fastify.get("/logout", (request, reply) => {
    if (request.session.isAuthenticated) request.session.destroy();
    return reply.redirect("/");
  });
  fastify.get("/forgot", (request, reply) => {
    return reply.view("/src/pages/forgot.hbs", {});
  });
  fastify.post("/forgot", indexController.forgot);
  fastify.get("/reset", (request, reply) => {
    return reply.view("/src/pages/reset.hbs", {});
  });
  fastify.post("/reset", indexController.reset);
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
  /*
   *  ADMIN RELATED ROUTES
   */
  fastify.get("/admin", (request, reply) => {
    return reply.view("/src/pages/admin.hbs", {});
  });
}

module.exports = indexRoutes;
