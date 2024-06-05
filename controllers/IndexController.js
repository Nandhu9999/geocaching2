const seo = require("../src/seo.json");
const User = require("../models/User");
const {
  LOCALIZATION,
  LANGUAGES_LIST,
  getIndiaTime,
  getTimeIcon,
  getSunIndex,
} = require("../src/localization");
const Inventory = require("../models/Inventory");
const {
  hashPasswordFn,
  comparePasswordFn,
} = require("../src/services/server-helper.service.js");
const MailService = require("../src/services/mailing.service.js");
const MAIL = new MailService();

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
    return reply.view("/src/pages/landing", {
      lang: langCode,
      localization,
      seo,
    });
  },
  login: async (request, reply) => {
    const { email, password } = request.body;
    console.log({ email, password });
    const langCode = "en";
    const localization = LOCALIZATION[langCode];
    try {
      const { pass: userHashedPassword } = await User.findOne({
        where: { email },
      });
      if (!(await comparePasswordFn(password, userHashedPassword))) {
        return reply.view("/src/pages/landing", {
          loginError: "password did not match",
          lang: langCode,
          localization,
          seo,
        });
      }

      const user = await User.findOne({
        where: { email },
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
          seo,
        });
      }
    } catch (err) {
      console.error(err);
      return reply.view("/src/pages/landing", {
        loginError: "invalid login attempt",
        lang: langCode,
        localization,
        seo,
      });
    }
  },
  register: async (request, reply) => {
    const { email, password, passwordConfirm } = request.body;
    console.log({ email, password, passwordConfirm });
    if (email == "" || email.indexOf("@") == -1) {
      return reply.view("/src/pages/register.hbs", {
        error: "Invalid email address",
        seo,
      });
    }

    if (!password || password !== passwordConfirm) {
      return reply.view("/src/pages/register.hbs", {
        error: "Password did not match",
        seo,
      });
    }
    if (await User.findOne({ where: { email } })) {
      return reply.view("/src/pages/register.hbs", {
        error: "Email already exists",
        seo,
      });
    }

    try {
      const hashedPassword = await hashPasswordFn(password);
      const name = email.split("@")[0];
      await User.create({ email, name, pass: hashedPassword });
      const user = await User.findOne({
        where: { email, pass: hashedPassword },
        attributes: ["id", "name", "email", "admin", "score", "collected"],
      });
      request.session.isAuthenticated = true;
      request.session.user = user.dataValues;
    } catch (err) {
      return reply.view("/src/pages/register.hbs", {
        error: err,
        seo,
      });
    }
    await MAIL.sendNewRegisterMail({ to: email });
    return reply.redirect("/game?new=1");
  },
  forgot: async (request, reply) => {
    const { email } = request.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return reply.view("/src/pages/forgot.hbs", {
        error: "Email not found",
        seo,
      });
    }
    await MAIL.sendForgotMail({ to: email });
    return reply.view("/src/pages/landing.hbs", {
      popup_message: "Check your email for further instructions",
      seo,
    });
  },

  game: async (request, reply) => {
    const { new: isNew } = request.query;
    const ACCOUNT = request.session.user;
    return reply.view("/src/pages/main.hbs", {
      game: GAME,
      account: ACCOUNT,
      gameScreen: true,
      newUser: isNew || false,
      seo,
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
      seo,
    });
  },

  createGeocache: (request, reply) => {
    const ACCOUNT = request.session.user;
    return reply.view("/src/pages/createGeocache.hbs", {
      game: GAME,
      account: ACCOUNT,
      gameScreen: false,
      seo,
    });
  },
};
