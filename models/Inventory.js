const { DataTypes, Model } = require("sequelize");
const db = require("../database");
const User = require("./User");
const GeocacheProperties = require("./GeocacheProperties");

class Inventory extends Model {}

Inventory.init(
  {},
  {
    sequelize: db,
    modelName: "Inventory",
    timestamps: false,
  }
);

// Define the many-to-many relationship between User and GeocacheProperties
User.belongsToMany(GeocacheProperties, {
  through: Inventory,
  foreignKey: "userId",
});
GeocacheProperties.belongsToMany(User, {
  through: Inventory,
  foreignKey: "geocacheId",
});

module.exports = Inventory;
