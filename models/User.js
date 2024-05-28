const { DataTypes } = require("sequelize");
const db = require("../database");

const User = db.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    pass: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    collected: { type: DataTypes.INTEGER, defaultValue: 0 },
    admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    disableGame: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    timestamps: false, // Disable the createdAt and updatedAt columns
  }
);

module.exports = User;
