module.exports = {
  PORT: process.env.PORT || 5000,
  HOST: "0.0.0.0" || "127.0.0.1" || "localhost",
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  ADMIN_EMAIL: "amritatrees@gmail.com",
  ADMIN_PASS: process.env.ADMIN_KEY,

  GOOGLE_LLM_API_KEY: process.env.GOOGLE_LLM_API_KEY,

  EMAIL: {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    user: "amritatrees@gmail.com",
    pass: process.env.AMRITATREES_APP_PASS,
  },
};
