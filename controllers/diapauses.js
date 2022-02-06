const express = require("express");
const Diapause = require("../models/diapause");
const router = express.Router();

const {
  diapauseCreatedAdmin,
  diapauseEndedUser
} = require("../controllers/notification");

// Create Diapause
router.post('/add', (req, res, next) => {
  const diapause = new Diapause( {
    creatorId: req.body.creatorId,
    creatorPseudo: req.body.creatorPseudo,
    creatorEmail: req.body.creatorEmail,
    period: {
      startDate: req.body.period.startDate,
      endDate: req.body.period.endDate
    },
    species: req.body.species,
    colonyId: req.body.colonyId,
    status: req.body.status,
    startTemperature: req.body.startTemperature,
    currentTemperature: [

    ],
    socketRef: req.body.socketRef
  });
  diapause.save()
  .then(async (createdDiapause) => {
    console.log('save successfull!');
    res.status(200).json({
      message: "diapause successfully created",
      diapauseId: createdDiapause._id
    })
    await diapauseCreatedAdmin(createdDiapause, createdDiapause.socketRef);
  });
});

// POST Change status
router.post('/status/:colonyId', async(req, res, next) => {
  console.log('try changing status', req.body.status);

  const statusDiapause = await Diapause.findOneAndUpdate(
    {
      $or: [
        {
          $and: [
            { status: 'scheduled' },
            { 'colonyId': req.params.colonyId },
          ]
        },
        {
          $and: [
            { status: 'ended' },
            { 'colonyId': req.params.colonyId },
          ]
        },
        {
          $and: [
            { status: 'active' },
            { 'colonyId': req.params.colonyId },
          ]
        }
      ]
    },
    { "$set": {
      "status": req.body.status}
    }
)
  .then(async diapause => {
    if(diapause) {
      console.log('la diapause', diapause.creatorId, diapause.status);

      if (req.body.status === 'ended') {
        console.log('status is ended so we save notification', diapause.creatorId);
        await diapauseEndedUser(diapause, diapause.creatorId);
      }
      return res.status(200).json({
        message: 'Diapause successfully status changed',
        diapause: diapause
      });
    } else {
      res.status(404).json({message: 'no diapause found!'});
    }
  });
})

// POST Change endedSaw
router.post('/endedSaw/:colonyId', async(req, res, next) => {
  console.log('try changing endedSaw to true', req.body.endedSaw);

  const endedSaw = await Diapause.findOneAndUpdate(
    {
      $and: [
        { status: 'ended' },
        { 'colonyId': req.params.colonyId },
      ]
    },
    { "$set": {
      "endedSaw": req.body.endedSaw}
    }
)
  .then(diapause => {
    if(diapause) {
      console.log('result is -->', diapause.endedSaw)
      return res.status(200).json({
        message: 'Diapause successfully endedSaw changed',
        diapause: diapause
      });
    } else {
      res.status(404).json({message: 'no diapause found!'});
    }
  });
});

// POST Update current temperature
router.post('/update/:colonyId', async(req, res, next) => {
  const currentTemperature = await Diapause.findOneAndUpdate(
    {
      $or: [
        {
          $and: [
            { status: 'active' },
            { 'colonyId': req.params.colonyId },
          ]
        }
      ]
    },
    { "$push": {
      "currentTemperature": {temperature: req.body.currentTemperature, date: new Date()},
    }
    }
)

  .then(diapause => {
    if(diapause) {
      console.log('result of updating diapause is -->', diapause)
      return res.status(200).json({
        message: 'Diapause successfully temperature changed',
        diapause: diapause
      });
    } else {
      res.status(404).json({message: 'no diapause found!'});
    }
  });
})

// GET Diapause by colonyId
router.get('/:colonyId', async(req, res, next) => {
  await Diapause.find(
    {
      $or: [
        {
          $and: [
            { status: 'active' },
            { 'colonyId': req.params.colonyId },
          ]
        },
        {
          $and: [
            { status: 'scheduled' },
            { 'colonyId': req.params.colonyId },
          ]
        },
        {
          $and: [
            { status: 'ended' },
            { 'colonyId': req.params.colonyId },
          ]
        }
      ]
    }
  )
  .then(diapause => {
    if(diapause) {
      console.log('result is -->', diapause)
      return res.status(200).json({
        message: 'Diapause successfully loaded',
        diapause: diapause
      });
    } else {
      res.status(404).json({message: 'no diapause found!'});
    }
  });
});

// GET All archived Diapauses
router.get('/archived/:species', async(req, res, next) => {
  await Diapause.find(
    {
      $and: [
        { status: 'archived' },
        { 'species': req.params.species },
      ]
    }
  )
  .then(diapauses => {
    if(diapauses) {
      console.log('result is -->', diapauses)
      return res.status(200).json({
        message: 'Archived Diapauses successfully loaded',
        diapause: diapauses
      });
    } else {
      res.status(404).json({message: 'no diapause found!'});
    }
  });
});

// GET All active Diapauses
router.get('/active/:species', async(req, res, next) => {
  await Diapause.find(
    {
      $and: [
        { status: 'active' },
        { 'species': req.params.species },
      ]
    }
  )
  .then(diapauses => {
    if(diapauses) {
      console.log('result is -->', diapauses)
      return res.status(200).json({
        message: 'Active Diapauses successfully loaded',
        diapause: diapauses
      });
    } else {
      res.status(404).json({message: 'no diapause found!'});
    }
  });
});

// DELETE Diapause by colonyId
router.delete('/delete/:colonyId', async(req, res, next) => {
  console.log('try delete');
  await Diapause.deleteOne(
    {
      $or: [
        {
          $and: [
            { status: 'active' },
            { 'colonyId': req.params.colonyId },
          ]
        },
        {
          $and: [
            { status: 'scheduled' },
            { 'colonyId': req.params.colonyId },
          ]
        },
        {
          $and: [
            { status: 'ended' },
            { 'colonyId': req.params.colonyId },
          ]
        }
      ]
    }
  )
  .then(diapause => {
    if(diapause) {
      console.log('result is -->', diapause)
      return res.status(200).json({
        message: 'Diapause successfully deleted',
        diapause: diapause
      });
    } else {
      res.status(404).json({message: 'no diapause found!'});
    }
  });
});

// Get ALL Diapauses

module.exports = router;
