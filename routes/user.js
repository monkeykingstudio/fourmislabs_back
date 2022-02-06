const express = require("express");
const router = express.Router();
const User = require('../models/user');

// Get ALL
router.get('/',
  (req, res, next) => {
  User.find()
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

// Get one by ID
router.get('/:id',
  (req, res, next) => {
  User.findById(req.params.id)
  .then(user => {
    if(user) {
      console.log(user)
      res.status(200).json({
        message: 'user found!',
        user: user
      });
    } else {
      res.status(404).json({message: 'user not found!'});
    }
  });
});

// Set lastLogin
// router.post('/:id', (req, res, next) => {
//   console.log(req.body.lastLogin);
//   console.log(req.params.id);
//   const userLogin = User.findOneAndUpdate({ _id: req.params.id }, {lastLogin: req.body.lastLogin})
//   .then(result => {
//     res.status(200).json({
//       message: 'user last login updated',
//       result: result
//     });
//   });
// });


module.exports = router;
