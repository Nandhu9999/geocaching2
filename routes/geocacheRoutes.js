const geocacheController = require("../controllers/GeocacheController.js");

async function geocacheRoutes(fastify, options) {
  fastify.get("/geocache", geocacheController.getGeocaches);
  fastify.get("/geocache/:id", geocacheController.getGeocacheById);
  fastify.post("/geocache/create", geocacheController.createGeocache);
  fastify.post("/geocache/modify", geocacheController.modifyGeocache);
}

module.exports = geocacheRoutes;
