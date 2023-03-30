const nodemailer = require("nodemailer");
const ejs = require("ejs");

const config = {
  host: process.env.HOST_SMTP,
  port: process.env.PORT_SMTP,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.USER_SMTP,
    pass: process.env.PASSWORD_SMTP,
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
  transporter.close();
};

exports.sendMailChangePassword = async (to, subject, data) => {
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
  transporter.close();
};

exports.sendPayslipToUser = async (to, subject, data, buffer) => {
  // Create a transporter object to send emails
  let transporter = nodemailer.createTransport(config);

  // Render the HTML template using EJS
  let html = await ejs.renderFile("./template/email/payslip.ejs", data);

  // Define the email options
  let mailOptions = {
    from: '"rnd" munkudo@gmail.com',
    to: to,
    subject: subject,
    html: html,
    attachments: [{ filename: "paylsip.pdf", content: buffer }],
  };

  // Send the email
  let info = await transporter.sendMail(mailOptions);

  
  console.log("Message sent: %s", info.messageId, mailOptions);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  transporter.close();
};
