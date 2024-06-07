const bcrypt = require("bcrypt");

function ifConditionFunction(v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function passwordHashFn(password) {
  return await bcrypt.hash(password, 10);
}
async function comparePasswordFn(password, hash) {
  return await bcrypt.compare(password, hash);
}

function generateRandomString(
  length,
  { symbols = false, numbers = false } = {}
) {
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz${
    numbers ? "0123456789" : ""
  }${symbols ? "!@#$%^&*()_+[]{}|;:,.<>?" : ""}`;
  let randomString = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomString += characters[randomIndex];
  }
  return randomString;
}

const dbFilePath = "./src/.data/db.sqlite";
module.exports = {
  dbFilePath,
  passwordHashFn,
  numberWithCommas,
  comparePasswordFn,
  ifConditionFunction,
  generateRandomString,
};
