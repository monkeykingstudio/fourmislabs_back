const express = require("express");
const Colony = require("../models/colony");
const Task = require( "../models/task" );
const router = express.Router();
const User = require('../models/user');

// Get ALL from the current user
router.get ('', async (req, res, next) => {
    if(req.user !== undefined || req.user._id !== undefined) {
     await Colony.find({creator: req.user._id}).then(documents => {
        res.status(200).json({
          message: 'colonies succesfully loaded',
          colonies: documents
        });
      });
    }
    else {
      res.status(401).json({
        message: 'bad request !!'
      })
      throw new Error('action not authorized');
    }
});

// Get ALL
router.get('/allcolonies', (req, res, next) => {
  Colony.find()
  .then(documents => {
    if(documents) {
      res.status(200).json({
        message: 'colonies succesfully loaded',
        colonies: documents
      });
    } else {
      res.status(404).json({message: 'colonies not found!'});
    }
  });
});

// Get for requested user
router.get('/allcolonies/:id', async (req, res, next) => {
  await Colony.find({creator: req.params.id})
  .then(colos => {
    if(colos) {
      res.status(200).json({
        message: 'user colonies succesfully loaded',
        colonies: colos
      });
    } else {
      res.status(200).json({message: 'no colonies for this user'});
    }
  });
});

// Get one by ID
router.get('/:id', (req, res, next) => {
  Colony.findById(req.params.id).then(colony => {
    if(colony) {
      res.status(200).json(colony);
    } else {
      res.status(404).json({message: 'colony not found!'});
    }
  });
});

// Create Colony
router.post('/', (req, res, next) => {
  const colony = new Colony( {
    creator: req.user._id,
    creationDate: req.body.creationDate,
    name: req.body.name,
    gyneName: req.body.gyneName,
    polyGyne: req.body.polyGyne,
    polyGyneCount: req.body.polyGyneCount,
    species: req.body.species,
    counter: req.body.counter
  });
  colony.save()
  .then(async (createdColony) => {
    await User.findOneAndUpdate({ _id: req.user._id },  { $push: { coloCount: { colo: createdColony._id.toString() } } })
    res.status(200).json({
      message: "colony created with success",
      colonyId: createdColony._id
    });
  });
});

// Delete colony
router.delete('/:id', (req, res, next) => {
  Colony.deleteOne({ _id: req.params.id, creator: req.user._id })
  .then(async (result) => {
    await Task.deleteMany({ colonyId: req.params.id });
  })
  .then(async (result) => {
    await User.findOneAndUpdate({ _id: req.user._id },  { $pull: { coloCount:  { colo: req.params.id.toString() } } })
    res.status(200).json({
      message: "colony deleted with success",
      colonyId: req.params.id
    });
  });
});


module.exports = router;
