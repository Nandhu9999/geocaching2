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
  passwordHashFn,
  comparePasswordFn,
  generateRandomString,
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
      message: "",
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
          error: "Incorrect password",
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
          error: "User does not exist",
          lang: langCode,
          localization,
          seo,
        });
      }
    } catch (err) {
      console.error(err);
      return reply.view("/src/pages/landing", {
        error: "Invalid login attempt",
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
      const hashedPassword = await passwordHashFn(password);
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
    const newPassword = generateRandomString(12, {
      symbols: false,
      numbers: true,
    });
    user.pass = await passwordHashFn(newPassword);
    user.save();

    await MAIL.sendPasswordForgotMail({
      to: email,
      new_password: newPassword,
      link: `${request.headers.origin}/reset?email=${email}`,
    });

    const { lang } = request.query;
    const langCode = lang || "en";
    const localization = LOCALIZATION[langCode];
    return reply.view("/src/pages/landing", {
      lang: langCode,
      localization,
      message: "Open your email to reset your password",
      seo,
    });
  },
  reset: async (request, reply) => {
    const { email, passwordOld, passwordNew } = request.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return reply.view("/src/pages/reset.hbs", {
        error: "Email not found",
        seo,
      });
    }
    const { pass: hashedUserPassword } = user;

    if (!(await comparePasswordFn(passwordOld, hashedUserPassword))) {
      // Entered incorrect old password
      console.log("> Invalid Password attempt for the account:", email);
      return reply.view("/src/pages/reset.hbs", {
        error: "Your old password is invalid.",
      });
    } else {
      // Successfully reset password
      user.pass = await passwordHashFn(passwordNew);
      await user.save();
      await MAIL.sendPasswordResetMail({ to: email });
      return reply.redirect("/#login");
    }
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
