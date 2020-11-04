// mailgun dependencies
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

// auth with out mailgun API key and domain
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.EMAIL_DOMAIN,
  },
};

// create a mailer
const nodemailerMailgun = nodemailer.createTransport(mg(auth));

// SEND MAIL
// const user = {
//   email: "tasfia.dev@gmail.com",
//   name: "Tas",
//   age: "23",
// };

// export send mail function
module.exports.sendMail = (user, req, res) => {
  // send an email to the user's email with a provided template
  nodemailerMailgun
    .sendMail({
      from: "no-reply@example.com",
      to: "user.email",
      subject: "Hey Tas, you nice, keep going",
      template: {
        name: "email.handlebars",
        engine: "handlebars",
        context: user,
      },
    })
    // once mail is sent, redirect to the purchased pet's page
    .then((info) => {
      console.log("Response: " + info);
      res.redirect(`/pets/${req.params.id}`);
    })
    // catch error and redirect to the purchased pet's page
    .catch((err) => {
      console.log("Error: " + err);
      res.redirect(`/pets/${req.params.id}`);
    });
}

// nodemailerMailgun
//   .sendMail({
//     from: "no-reply@example.com",
//     to: user.email,
//     subject: "Hey Tas, you nice, keep going",
//     template: {
//       name: "email.handlebars",
//       engine: "handlebars",
//       context: user,
//     }
//   })
//   .then((info) => {
//     console.log("Response: " + info);
//   })
//   .catch((err) => {
//     console.log("Error: " + err);
//   });
