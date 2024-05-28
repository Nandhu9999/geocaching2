const db = require("../database");
const Geocache = require("../models/Geocache");

module.exports = {
  getGeocaches: async (request, reply) => {
    const geocacheList = await Geocache.findAll();
    return reply.send({ path: "getGeocaches", geocacheList });
  },
  getGeocacheById: (request, reply) => {
    return reply.send({ path: "getGeocacheById" });
  },
  createGeocache: (request, reply) => {
    const { email, password, confirmPassword } = request.body;
    return reply.send({ path: "createGeocache" });
  },
  modifyGeocache: (request, reply) => {
    return reply.send({ path: "modifyGeocache" });
  },
};
