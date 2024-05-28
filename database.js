const { Sequelize } = require("sequelize");
const { dbFilePath } = require("./serverHelper.js");

const db = new Sequelize("geocaching-db", "user", "password", {
  dialect: "sqlite",
  host: dbFilePath,
});

module.exports = db;
