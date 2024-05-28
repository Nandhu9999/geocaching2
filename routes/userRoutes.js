const userController = require("../controllers/UserController");

async function userRoutes(fastify, options) {
  fastify.get("/users", userController.getUsers);
  fastify.get("/users/:id", userController.getUserById);
  fastify.post("/users/create", userController.createUser);
  fastify.post("/users/modify", userController.modifyUser);
  fastify.delete("/users/delete", userController.deleteUser);
  fastify.post("/users/locate", userController.compareUserLocation);
}

module.exports = userRoutes;
