const axios = require("axios");
const config = require("../appConfig.js");
const Geocache = require("../models/Geocache");
const GeocacheProperties = require("../models/GeocacheProperties.js");
const Quiz = require("../models/Quiz.js");
const User = require("../models/User.js");

async function insertNewGeocacheToDb({
  name = "",
  scientific_name = "",
  origin = "",
  properties = "",
  score = 0,
  lat = 0,
  lng = 0,
}) {
  await GeocacheProperties.create({
    name,
    scientific_name,
    origin,
    properties,
    score,
  });
  await Geocache.create({
    scientific_name: scientific_name,
    lat,
    lng,
  });
}

module.exports = {
  getGeocaches: async (request, reply) => {
    const geocacheList = await Geocache.findAll();
    return reply.send({ success: true, geocacheList });
  },
  getGeocacheById: async (request, reply) => {
    const { id } = request.params;
    const geocacheProperties = await GeocacheProperties.findOne({
      where: { id },
    });
    const geocaches = await Geocache.findAll({
      where: { id },
    });
    return reply.send({ success: true, geocacheProperties, geocaches });
  },
  getGeocacheQuiz: async (request, reply) => {
    try {
      const { id: geocacheId } = request.params;
      const geocache = await Geocache.findOne({
        where: { id: geocacheId },
      });

      const geocacheQuiz = await Quiz.findAll({
        where: { scientific_name: geocache.scientific_name },
        attributes: ["id", "scientific_name", "question", "options"],
      });
      const randomId = Math.floor(Math.random() * geocacheQuiz.length);
      const quiz = geocacheQuiz[randomId];
      return reply.send({
        success: true,
        quiz,
      });
    } catch (err) {
      console.log("getGeocacheQuiz error:", err);
      return reply.send({ success: false, error: err.message });
    }
  },
  submitGeocacheQuiz: async (request, reply) => {
    try {
      const { scientific_name, quiz_id, answer } = request.body;
      const submission = await Quiz.findOne({
        where: { id: quiz_id, answer },
      });
      console.log(submission);
      if (submission) {
        const ACCOUNT = request.session.user;
        const user = await User.findOne({
          where: { id: ACCOUNT.id },
          attributes: ["id", "name", "email", "admin", "score", "collected"],
        });
        const geocache = await GeocacheProperties.findOne({
          where: { scientific_name },
        });
        await user.update({
          score: user.score + geocache.score,
        });
        await user.save();
        request.session.user = user.dataValues;
        return reply.send({
          success: true,
          isCorrect: true,
          score: user.score,
        });
      } else {
        return reply.send({ success: true, isCorrect: false });
      }
    } catch (err) {
      return reply.send({ success: false, error: err.message });
    }
  },
  createGeocache: async (request, reply) => {
    try {
      const { imageData, geocacheName, location } = request.body;
      console.log({ geocacheName, location });
      const ACCOUNT = request.session.user;
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${config.GOOGLE_LLM_API_KEY}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: "Does the following image contain a tree? Respond only with 'yes' or 'no'.",
              },
              {
                inlineData: {
                  mimeType: "image/png",
                  data: imageData.replace(/^data:image\/(png|jpg);base64,/, ""),
                },
              },
            ],
          },
        ],
      };

      const { data: llmResponse } = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const isValid =
        llmResponse.candidates[0].content.parts[0].text.includes("yes");
      if (isValid) {
        // TODO: check if geocache already exists
        console.log("checking if valid geocache");
        const geocache = await GeocacheProperties.findOne({
          where: { scientific_name: geocacheName },
        });
        if (geocache) {
          // existing geocache type
          console.log("geocache already exists");
          await Geocache.create({
            scientific_name: geocache,
            lat,
            lng,
          });
        } else {
          // new geocache type
          console.log("new geocache type");
          const NEW_GEOCACHE_SCORE = 10;
          const NEW_GEOCACHE_PROPS = `Found by ${ACCOUNT.name}`;
          await insertNewGeocacheToDb({
            name: geocacheName,
            scientific_name: geocacheName,
            origin: "unknown",
            properties: NEW_GEOCACHE_PROPS,
            score: NEW_GEOCACHE_SCORE,
            lat: location.lat,
            lng: location.lng,
          });
        }
      }
      return reply.send({
        success: true,
        path: "createGeocache",
        isValid,
      });
    } catch (err) {
      console.log("createGeocache error:", err);
      return reply.send({ success: false, error: err.message });
    }
  },
  modifyGeocache: (request, reply) => {
    return reply.send({ success: true, path: "modifyGeocache" });
  },

  // INTERNAL FUNCTIONS
  insertNewGeocacheToDb,
};
