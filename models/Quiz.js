const { DataTypes } = require("sequelize");
const db = require("../database");

const Quiz = db.define(
  "Quiz",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    scientific_name: { type: DataTypes.STRING },
    question: { type: DataTypes.STRING },
    options: { type: DataTypes.STRING },
    answer: { type: DataTypes.STRING },
  },
  {
    timestamps: false, // Disable the createdAt and updatedAt columns
  }
);

module.exports = Quiz;
