const { DataTypes } = require("sequelize");
const db = require("../database");

const GeocacheProperties = db.define(
  "GeocacheProperties",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING },
    scientific_name: { type: DataTypes.STRING },
    origin: { type: DataTypes.STRING },
    properties: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    timestamps: false, // Disable the createdAt and updatedAt columns
  }
);

module.exports = GeocacheProperties;
