const express = require("express");
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
// const multer = require('multer');
const config = require("../config");
require('dotenv').config()


// const MIME_TYPE_MAP = {
//   'image/png': 'png',
//   'image/jpeg': 'jpg',
//   'image/jpg': 'jpg'
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("Invalid mime type");
//     if (isValid) {
//       error = null;
//     }
//     cb(error, "images");
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname
//       .toLowerCase()
//       .split(" ")
//       .join("-");
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     cb(null, fileName + "-" + Date.now() + "." + ext);
//   }
// });


router.post('/login', (req, res, next) => {
  console.log('/login')
  User.findOne(
    {
      email: req.body.email,
    }, async (err, user) => {
    if (err) throw err;
    if (!user) return res.status(401).json({ message: 'Authentication failed. No user found!' });
    if (user) {
      const userLogin = await User.findOneAndUpdate({ _id: user._id }, { lastLogin: new Date(Date.now()) });
      const userConnected = await User.findOneAndUpdate({ _id: user._id }, { isConnected: true });

      if (!user.comparePassword(req.body.password, user.hashPassword))
        return res.status(401).json({ message: 'Authentication failed. Wrong password!' });
      let tokens = jwt.sign({
        email: user.email,
        pseudo: user.pseudo,
        _id: user._id,
        lastLogin: user.lastLogin,
        // picture: user.picture,
        created: user.created,
        is_verified: user.is_verified,
        newsletter: user.newsletter,
        role: user.role
      }, `${process.env.JWT_KEY}`, {
        expiresIn: '2h'
      });

      return res.status(200).json({
        token: tokens,
        // expiresIn: 3600,
        pseudo: user.pseudo,
        email: user.email,
        // picture: user.picture,
        created: user.created,
        _id: user._id,
        lastLogin: user.lastLogin,
        is_verified: user.is_verified,
        newsletter: user.newsletter,
        role: user.role
      });
    }
  }
  );
});

router.post('/logout', (req, res, next) => {
  console.log(req.body.email);
  User.findOne(
    {
      email: req.body.email,
    }, async (err, user) => {
    console.log(user)
    if (err) throw err;
    if (!user) return res.status(401).json({ message: 'No user found!' });
    if (user) {
      const userConnected = await User.findOneAndUpdate({ _id: user._id }, { isConnected: false });

      return res.status(200).json({
        message: 'ok'
      });
    } else {
      console.log('no user', user)
    }
  }
  );
});

router.post('/unconnect', async (req, res, next) => {
  const userConnected = await User.findOneAndUpdate({ email: req.body.email }, { isConnected: false });
  return res.status(200).json({
    message: 'ok'
  });
})

router.post('/register', async (req, res) => {
  console.log('registering user')

  // let upload = multer({ storage: storage, limits: {fileSize: .5 * 512 * 512} }).single('picture');
  // upload(req, res, function(err) {
  //   if (req.fileValidationError) {
  //     console.log(req);
  //     return res.status(500).json({
  //       error: 'validation error!!',
  //       err: err
  //     });
  //   }
  //   else if (err instanceof multer.MulterError && multer.MulterError.message == 'File too large') {
  //       return res.status(500).json({
  //         err: err
  //       });
  //   }
  //   else if (err) {
  //     return res.status(500).json({
  //       err: 'my uknown error',
  //       err: err
  //     });
  //   }

  //   const url = req.protocol + "://" + req.get("host");

  // })

  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    pseudo: req.body.pseudo,
    is_verified: false,
    role: req.body.role,
    newsletter: req.body.newsletter,
    lastlogin: null,
    isConnected: false
  });

  // picture: url + "/images/" + req.file.filename,

  newUser.hashPassword = await bcrypt.hashSync(req.body.password, 10);
  // console.log(newUser);
  // res.json( newUser.hashPassword);
  // return;

  newUser.save((err, user) => {
    if (err) {
      return res.status(401).send({ err });
    }
    if (user) {
      console.log('NEW USER')
      user.hashPassword = undefined;
      return res.status(201).json({ user });
    }
  });
});

module.exports = router;
