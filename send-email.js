const nodemailer = require("nodemailer");
const ejs = require("ejs");

const config = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "munkudo@gmail.com",
    pass: "hxugkscnayfkowon",
  },
};

exports.sendMailCreateUser = async (to, subject, data) => {
  // Create a transporter object to send emails
  let transporter = nodemailer.createTransport(config);

  // Render the HTML template using EJS
  let html = await ejs.renderFile("./template/email/create-user.ejs", data);

  // Define the email options
  let mailOptions = {
    from: '"rnd" munkudo@gmail.com',
    to: to,
    subject: subject,
    html: html,
  };

  // Send the email
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

exports.sendMailChangePassword = async (to, subject, data) => {
  console.log(to, subject, data);
  // Create a transporter object to send emails
  let transporter = nodemailer.createTransport(config);

  // Render the HTML template using EJS
  let html = await ejs.renderFile("./template/email/change-password.ejs", data);

  // Define the email options
  let mailOptions = {
    from: '"rnd" munkudo@gmail.com',
    to: to,
    subject: subject,
    html: html,
  };

  // Send the email
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
