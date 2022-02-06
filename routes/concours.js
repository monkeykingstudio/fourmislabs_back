const express = require("express");
const router = express.Router();
const Concours = require('../models/concours');

// Get ALL registered users
router.get('/',
  (req, res, next) => {
  Concours.find()
  .then(users => {
    if(users) {
      res.status(200).json({
        message: 'users fetched!',
        users: users
      });
    } else {
      res.status(404).json({message: 'users not found!'});
    }
  });
});


// Post new registered user
router.post('/add', async (req, res, next) => {
    console.log('registering user to event', req.body.email);
    const newUser = new Concours({
      userId: req.user._id,
      email: req.body.email,
      facebook: ''
    });

    const userExists = await Concours.exists({  email: req.body.email });
    if (userExists) {
    console.log("User exists");
    res.status(404).json({message: 'user already registered!'});
    } else {
      newUser.save((err, user) => {
        if (err) {
          console.log('error !!!!');
          return res.status(401).send({ err });
        } else {
          console.log('NEW USER', user);
          res.status(201).json({message: 'user registered to event!'});
        }
      });
    }
    
});

router.post('/facebook', async (req, res, next) => {
  console.log('posting on facebook', req.body.person);
  await Concours.findOneAndUpdate({userId: req.user._id},
  { "$set": {
    "facebook": req.body.person
  }
  })
  .then((facebook) => {
    res.status(200).json({
      message: 'updated facebook'
    });
  });
})



module.exports = router;
