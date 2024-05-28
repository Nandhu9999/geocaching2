const bcrypt = require("bcrypt");
const User = require("../models/User");
const {
  LOCALIZATION,
  LANGUAGES_LIST,
  getIndiaTime,
  getTimeIcon,
  getSunIndex,
} = require("../src/localization");
const Inventory = require("../models/Inventory");

const INVENTORY = {
  found: [
    {
      name: "tree",
      icon: "🌲",
    },
  ],
};

const GAME = {
  maxCount: 100,
};

module.exports = {
  index: (request, reply) => {
    const { lang } = request.query;
    const langCode = lang || "en";
    const localization = LOCALIZATION[langCode];
    return reply.view("/src/pages/landing", { lang: langCode, localization });
  },
  login: async (request, reply) => {
    const { email, password } = request.body;
    console.log({ email, password });
    const langCode = "en";
    const localization = LOCALIZATION[langCode];
    try {
      const hashedPassword = password || (await bcrypt.hash(password, 10));
      const user = await User.findOne({
        where: { email, pass: hashedPassword },
        attributes: ["id", "name", "email", "admin", "score", "collected"],
      });
      if (!!user) {
        request.session.isAuthenticated = true;
        request.session.user = user.dataValues;
        return reply.redirect("/game#");
      } else {
        return reply.view("/src/pages/landing", {
          loginError: "invalid login attempt",
          lang: langCode,
          localization,
        });
      }
    } catch (err) {
      return reply.view("/src/pages/landing", {
        loginError: "invalid login attempt",
        lang: langCode,
        localization,
      });
    }
  },
  register: async (request, reply) => {
    const { email, password, passwordConfirm } = request.body;
    console.log({ email, password, passwordConfirm });
    if (email == "" || email.indexOf("@") == -1) {
      return reply.view("/src/pages/register.hbs", {
        error: "Invalid email address",
      });
    }

    if (!password || password !== passwordConfirm) {
      return reply.view("/src/pages/register.hbs", {
        error: "Password did not match",
      });
    }
    if (await User.findOne({ where: { email } })) {
      return reply.view("/src/pages/register.hbs", {
        error: "Email already exists",
      });
    }

    try {
      const hashedPassword = password || (await bcrypt.hash(password, 10));
      await User.create({ email, pass: hashedPassword });
      const user = await User.findOne({
        where: { email, pass: hashedPassword },
        attributes: ["id", "name", "email", "admin", "score", "collected"],
      });
      request.session.isAuthenticated = true;
      request.session.user = user.dataValues;
    } catch (err) {
      return reply.view("/src/pages/register.hbs", {
        error: err,
      });
    }
    return reply.redirect("/game?new=1");
  },
  game: async (request, reply) => {
    const { new: isNew } = request.query;
    const ACCOUNT = request.session.user;
    return reply.view("/src/pages/main.hbs", {
      game: GAME,
      account: ACCOUNT,
      gameScreen: true,
      newUser: isNew || false,
    });
  },

  inventory: async (request, reply) => {
    const ACCOUNT = request.session.user;
    const INVENTORY_FOUND = await Inventory.findAll({
      where: { userId: ACCOUNT.id },
    });
    return reply.view("/src/pages/inventory.hbs", {
      game: GAME,
      account: ACCOUNT,
      collection: { INVENTORY_FOUND },
      gameScreen: false,
    });
  },

  createGeocache: (request, reply) => {
    const ACCOUNT = request.session.user;
    return reply.view("/src/pages/createGeocache.hbs", {
      game: GAME,
      account: ACCOUNT,
      gameScreen: false,
    });
  },
};
