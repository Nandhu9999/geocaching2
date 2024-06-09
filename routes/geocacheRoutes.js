const geocacheController = require("../controllers/GeocacheController.js");

async function geocacheRoutes(fastify, options) {
  fastify.get("/geocache", geocacheController.getGeocaches);
  fastify.get("/geocache/:id", geocacheController.getGeocacheById);
  fastify.get("/geocache/quiz/:id", geocacheController.getGeocacheQuiz);
  fastify.post("/geocache/submit", geocacheController.submitGeocacheQuiz);
  fastify.post("/geocache/create", geocacheController.createGeocache);
  fastify.post("/geocache/modify", geocacheController.modifyGeocache);
}

module.exports = geocacheRoutes;
