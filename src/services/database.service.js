const { Sequelize } = require("sequelize");
const { dbFilePath } = require("./server-helper.service.js");

const db = new Sequelize("geocaching-db", "user", "password", {
  dialect: "sqlite",
  host: dbFilePath,
});

module.exports = db;
