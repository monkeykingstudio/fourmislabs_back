const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require("../config");
require('dotenv').config()


let link;
let host;


let decodedToken = '';

router.get('/activate', verifyToken, (req,res,next) => {
console.log('received new email')
  // You can put additional check if user is activated or not
  // but that is left as an exercise.
  let promise = User.findOneAndUpdate({email: decodedToken.email}, {is_verified: true}).exec()

  promise.then((doc) => {
    return res.status(200).json({message:'Activated'});
  })

  promise.catch((err) => {
    return res.status(500).json({message:'Error in activating account'});
  })
})

router.post("/sendmail", (req, res, next) => {
  console.log('sending mail...');
    let user = req.body;
    sendMail(user, (err, info) => {
      console.log('Registration email has been sent');
      res.status(200).json({info});
    });
});

router.post("/breedtrash", (req, res, next) => {
  let user = req.body.user;
  let species = req.body.species;

  console.log(user);
  console.log('species:', species);

  sendBreedTrashMail(user, species, (err, info) => {
    console.log('Breedsheet suppression mail has been sent');
    res.status(200).json({info});
  });
});

router.post("/breedapprove", (req, res, next) => {
  let user = req.body.user;
  let species = req.body.species;

  console.log(user);
  console.log('species:', species);

  sendBreedApproveMail(user, species, (err, info) => {
    console.log('Breedsheet approval mail has been sent');
    res.status(200).json({info});
  });
});

router.post("/diapauseend", (req, res, next) => {
  let email = req.body.userEmail;
  let pseudo = req.body.userPseudo;
  let species = req.body.species;

  console.log(email);
  console.log('species:', species);

  sendDiapauseEndedMail(email, pseudo, species, (err, info) => {
    console.log('Ended diapause mail has been sent');
    res.status(200).json({info});
  });
});

async function sendMail(user, callback) {
  let activationToken = jwt.sign({
    email: user.email
  }, process.env.JWT_KEY, {
    expiresIn: '2h'
  });
  link = `http://www.fourmislabs.com/mail/activate?key=${activationToken}`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'fourmislabs@gmail.com',
      pass: 'hwptbtqecruplzsi'  //'xnbdwguuyjkfkiqm'
    }
  });
  let mailOptions = {
    from: `fourmislabs@gmail.com`,
    to: user.email,
    subject: 'Please confirm your Email account',
    html: `
    <h1>Hi ${user.pseudo} and welcome to FourmisLabs!</h1><br>
    Please click on the link to verify your email.<br>
    <a href="${link}">Click here to verify</a>`
  };
  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);
  callback(info);
}

async function sendBreedTrashMail(user, species, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'fourmislabs@gmail.com',
      pass: 'hwptbtqecruplzsi'
    }
  });
  let mailOptions = {
    from: `fourmislabs@gmail.com`,
    to: user.email,
    subject: `Your breedSheet ${species}`,
    html: `
    <h1>Hi ${user.pseudo}</h1><br>
    Your breedsheet does not respect standards and have been deleted by an administrator`
  };
  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);
  callback(info);
}

async function sendBreedApproveMail(user, species, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'fourmislabs@gmail.com',
      pass: 'hwptbtqecruplzsi'
    }
  });
  let mailOptions = {
    from: `fourmislabs@gmail.com`,
    to: user.email,
    subject: `Your breedSheet ${species} is approved!`,
    html: `
    <h1>Hi ${user.pseudo}</h1><br>
    Your breedsheet have been successfully reviewed  by an administrator and is approved! It is now accessible by every application's members including you :) Thank you for your contribution.`
  };
  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);
  callback(info);
}

async function sendDiapauseEndedMail(email, pseudo, species, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: 'fourmislabs@gmail.com',
      pass: 'hwptbtqecruplzsi'
  }
});
let mailOptions = {
  from: `fourmislabs@gmail.com`,
  to: email,
  subject: `Your diapause for species ${species} has come to and end!`,
  html: `
  <h1>Hi ${pseudo}</h1><br>
  Your diapause is done! Now is the time to heat them gradually, then to feed them. Also remember to check the water supply.
  Don't forget to click the 'archive' button if you want to share your diapause statistics with the community!`
};
// send mail with defined transport object
let info = await transporter.sendMail(mailOptions);
callback(info);
}

function verifyToken(req, res, next) {
  let token = req.query.token;

  jwt.verify(token, process.env.JWT_KEY, (err, tokendata) => {
    if (err) {
      return res.status(400).json({ message: ' Unauthorized request' });
    }
    if (tokendata) {
      decodedToken = tokendata;
      next();
    }
  });
}

module.exports = router;

