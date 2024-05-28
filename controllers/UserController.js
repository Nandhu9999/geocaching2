const db = require("../database");
const Inventory = require("../models/Inventory");
const User = require("../models/User");

module.exports = {
  getUsers: async (request, reply) => {
    const userList = await User.findAll({
      // attributes: ["id", "name", "email", "admin"],
    });
    return reply.send({ path: "getUsers", userList });
  },
  getUserById: async (request, reply) => {
    const { id } = request.params;
    const user = await User.findAll({
      attributes: ["id", "name", "email", "admin"],
      where: {
        id: Number(id),
      },
    });
    const inventory = await Inventory.findAll({
      where: { userId: Number(id) },
    });
    return reply.send({ path: "getUserById", user, inventory });
  },
  createUser: (request, reply) => {
    const { email, password, confirmPassword } = request.body;
    try {
      if (password == confirmPassword) {
        const hashedPass = password;
        User.findOrCreate({
          email: email,
          pass: password,
        });
        return reply.send({ path: "createUser", success: true });
      }
    } catch (err) {
      return reply.send({ path: "createUser", success: false, error: err });
    }
  },
  deleteUser: (request, reply) => {
    return reply.send({ path: "deleteUser" });
  },
  modifyUser: (request, reply) => {
    return reply.send({ path: "modifyUser" });
  },
  compareUserLocation: (request, reply) => {
    return reply.send({ path: "compareUserLocation" });
  },
};
