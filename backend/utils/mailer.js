const nodemailer = require("nodemailer");
const path = require('path');
require("dotenv").config({
  path: path.resolve(__dirname, '.env'),
});

// Validate environment variables
if (
  !process.env.MAIL_USER ||
  !process.env.MAIL_PASSWORD ||
  !process.env.TO_EMAIL
) {
  console.error(
    "Please provide MAIL_USER, MAIL_PASSWORD, and TO_EMAIL in your environment variables."
  );
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Mail options
const mailOptions = {
  from: {
    name: "Megunticookmarket Notifier",
    address: process.env.MAIL_USER,
  },
  to: process.env.TO_EMAIL,
  subject: "Catering Inquiry",
};

const sendMail = async (mail) => {
  try {
    console.log("inside the send mail function");
    await transporter.sendMail({ ...mailOptions, html: mail });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error(error);
  }
};

// Export transporter and mail options
module.exports = { transporter, mailOptions, sendMail };
