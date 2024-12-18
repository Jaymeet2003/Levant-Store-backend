const express = require("express");

const { sendMail } = require("../utils/mailer");
const { inquiryEmailTemplate } = require("../utils/generateEmailTemplate");

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("this is the req", req.body);
  try {
    const mail = inquiryEmailTemplate(
      req.body.name,
      req.body.email,
      req.body.number,
      req.body["how-did-you-find-us"],
      req.body["number-of-guest"],
      req.body.occasion,
      req.body.date,
      req.body.venue,
      req.body.message
    );
    console.log("this is the mail", mail, "now sending it");
    await sendMail(mail);
    res.send("inquiry received");
  } catch (error) {
    res.send("Error sending email", error);
  }
});

module.exports = router;
