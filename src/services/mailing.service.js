const nodemailer = require("nodemailer");
const config = require("../../appConfig");

class MailService {
  transporter = null;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.EMAIL.host,
      port: config.EMAIL.port,
      secure: true,
      auth: {
        user: config.EMAIL.user,
        pass: config.EMAIL.pass,
      },
    });
  }

  async sendMail({
    to = ["nandhakumar2058@gmail.com"],
    from = config.EMAIL.user,
    subject = "Test Email",
    text = "",
    html = "This is a test email from... <h1>AmritaTrees</h1>",
  }) {
    try {
      return await this.transporter.sendMail({ to, from, subject, text, html });
    } catch (err) {
      throw err;
    }
  }

  async sendForgotMail({ to = "", new_password = "" }) {
    try {
      await this.sendMail({
        to,
        subject: "Forgot Password",
        html: `
        <p>Hello User,</p>
        <p>It looks like you've forgotten your password.</p>
        <p>Here is your newly auto-generated password: <strong>${new_password}</strong></p>
        <p>Please log in and change your password to something more secure.</p>
        <p>Thank you,</p>
        <p>The AmritTrees Team</p>
        `,
      });
    } catch (err) {
      throw err;
    }
  }
  async sendNewRegisterMail({ to = "" }) {
    try {
      await this.sendMail({
        to,
        subject: "Welcome New User!",
        html: `
        <p>Hello User,</p>
        <p>Welcome to AmritaTrees!</p>
        <p>We are thrilled to have you on our platform.</p>
        <p>Please log in and get started with your journey.</p>
        <p>Thank you,</p>
        <p>The AmritaTrees Team</p>
        `,
      });
    } catch (err) {
      throw err;
    }
  }
}
module.exports = MailService;
