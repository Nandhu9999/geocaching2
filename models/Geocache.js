const { DataTypes } = require("sequelize");
const db = require("../database");

const Geocache = db.define(
  "Geocache",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    scientific_name: { type: DataTypes.STRING },
    lat: { type: DataTypes.FLOAT },
    lng: { type: DataTypes.FLOAT },
  },
  {
    timestamps: false, // Disable the createdAt and updatedAt columns
  }
);

module.exports = Geocache;
