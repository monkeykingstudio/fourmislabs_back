const express = require("express");
const BreedingSheet = require("../models/breedingSheet");
const router = express.Router();
const {
  breedingSheetValidationAdmin,
  breedingSheetUpdate,
  breedingSheetDelete,
  breedingSheetApproved
} = require("../controllers/notification");

// Create new one
router.post('/', (req, res, next) => {

  const newSheet = new BreedingSheet ({
    creator: req.user._id,
    creatorPseudo: req.body.creatorPseudo,
    status: req.body.status,
    genre: req.body.genre,
    species: req.body.species,
    family: req.body.family,
    subfamily: req.body.subfamily,
    tribu: req.body.tribu,
    gynePictures: req.body.gynePictures,
    pictures: req.body.pictures,
    regions: req.body.regions,
    foods: req.body.foods,
    difficulty: req.body.difficulty,
    polygyne: req.body.polygyne,
    polymorphism: req.body.polymorphism,
    semiClaustral: req.body.semiClaustral,
    needDiapause: req.body.needDiapause,
    trophalaxy: req.body.trophalaxy,
    drinker: req.body.drinker,
    driller: req.body.driller,
    gyneSize: req.body.gyneSize,
    maleSize: req.body.maleSize,
    majorSize: req.body.majorSize,
    workerSize: req.body.workerSize,
    gyneLives: req.body.gyneLives,
    workerLives: req.body.workerLives,
    temperature: req.body.temperature,
    diapauseTemperature: req.body.diapauseTemperature,
    hygrometry: req.body.hygrometry,
    diapausePeriod: req.body.diapausePeriod,
    swarmingPeriod: req.body.swarmingPeriod,
    nestType: req.body.nestType,
    maxPopulation: req.body.maxPopulation,
    sources: req.body.sources,
    characteristics: req.body.characteristics
  });

  newSheet.save()
  .then(async (createdSheet) => {
    await res.status(200).json({
      message: "sheet created with success",
      sheetId: createdSheet._id
    });

    await breedingSheetValidationAdmin(createdSheet, req.body.socketRef);
  });
});

// Update diapause
router.post('/updiapause/:id', async(req, res, next) => {
  console.log('DATA ID', req.params.id);
  console.log('DATA temperatures', req.body.temperatures);
  console.log('DATA needs', req.body.needs);
  console.log('DATA months', req.body.months);

  const updateSheet = await BreedingSheet.findOneAndUpdate({ _id: req.params.id },
    { "$set": {
      "needDiapause": req.body.needs,
      "diapauseTemperature": req.body.temperatures,
      "diapausePeriod": req.body.months }
    })
  .then(async (diapause) => {
    await breedingSheetUpdate(req.body.species, req.body.dataNotification, 'diapause');

    res.status(200).json({
      message: 'update diapause done'
    });
  });
});

// Update behaviors
router.post('/upbehaviors/:id', async(req, res, next) => {
  console.log('DATA ID', req.params.id);
  console.log('DATA behaviors', req.body.behaviors);

  const updateSheet = await BreedingSheet.findOneAndUpdate({ _id: req.params.id },
    { "$set": {
      "polygyne": req.body.polyGyne,
      "semiClaustral": req.body.claustral,
      "driller": req.body.driller,
      "drinker": req.body.drinker }
    })
  .then(async (behavior) => {
    await breedingSheetUpdate(req.body.species, req.body.dataNotification, 'behaviors');

    res.status(200).json({
      message: 'update behaviors done'
    });
  });
});

// Update foods
router.post('/upfood/:id', async(req, res, next) => {
  console.log('DATA ID', req.params.id);
  console.log('DATA FOODS', req.body.foods);
  const updateSheet = await BreedingSheet.findOneAndUpdate({ _id: req.params.id }, {foods: req.body.foods},
    async (error, sheet) => {
      if(error) {
        return console.log('error while updating');
      }
      await breedingSheetUpdate(req.body.species, req.body.dataNotification, 'food');

      return res.status(200).json({sheet});
    })
});

// Update geography
router.post('/upgeo/:id', async(req, res, next) => {
  console.log('DATA ID', req.params.id);
  console.log('DATA GEO', req.body.geography);
  const updateSheet = await BreedingSheet.findOneAndUpdate({ _id: req.params.id }, {regions: req.body.geography},
    async (error, sheet) => {
      if(error) {
        return console.log('error while updating');
      }
      await breedingSheetUpdate(req.body.species, req.body.dataNotification, 'geography');

      return res.status(200).json({sheet});
    })
});

// Update morphism
router.post('/upmorphism/:id', async(req, res, next) => {

  const updateSheet = await BreedingSheet.findOneAndUpdate({ _id: req.params.id },
    { "$set": { //TODO BUG pourquoi doit on inverser workerSize et majorSize ??????
      "polymorphism": req.body.polyMorphism,
      "gyneSize": req.body.gyneSize,
      "maleSize": req.body.maleSize,
      "majorSize": req.body.workerSize,
      "workerSize": req.body.majorSize,
      "gyneLives": req.body.gyneLives,
      "workerLives": req.body.workerLives
    }
    })
  .then(async (morphism) => {
    await breedingSheetUpdate(req.body.species, req.body.dataNotification, 'morphism');

    res.status(200).json({
      message: 'update morphism done'
    });
  });
});

// Update characteristics
router.post('/upchara/:id', async(req, res, next) => {
  const updateSheet = await BreedingSheet.findOneAndUpdate({ _id: req.params.id },
    { "$set": {
      "characteristics": req.body.characteristics,
    }
    })
  .then(async (chara) => {
    await breedingSheetUpdate(req.body.species, req.body.dataNotification, 'characteristics');

    res.status(200).json({
      message: 'update characteristics done'
    });
  });
});

// Update gyne pictures
router.post('/gynepictures/:id', async(req, res, next) => {
  console.log('DATA ID', req.params.id);
  console.log('DATA GYNE', req.body.gynePictures);
  const updateSheet = await BreedingSheet.findOneAndUpdate({ _id: req.params.id }, {gynePictures: req.body.gynePictures},
    async (error, sheet) => {
      if(error) {
        return console.log('error while updating');
      }
      await breedingSheetUpdate(req.body.species, req.body.dataNotification, 'gyne pictures');

      return res.status(200).json({sheet});
    })
});

// Update pictures
router.post('/pictures/:id', async(req, res, next) => {
  console.log('DATA ID', req.params.id);
  console.log('DATA PICTURES', req.body.pictures);
  const updateSheet = await BreedingSheet.findOneAndUpdate({ _id: req.params.id }, {pictures: req.body.pictures},
    async (error, sheet) => {
      if(error) {
        return console.log('error while updating');
      }
      await breedingSheetUpdate(req.body.species, req.body.dataNotification, 'pictures');

      return res.status(200).json({sheet});
    })
});

// Update primary
router.post('/primary/:id', async(req, res, next) => {

  const updateSheet = await BreedingSheet.findOneAndUpdate({ _id: req.params.id },
    { "$set": {
      "temperature": req.body.temperature,
      "hygrometry": req.body.hygrometry,
      "family": req.body.family,
      "subfamily": req.body.subfamily,
      "genre": req.body.genre,
      "tribu": req.body.tribu,
      "difficulty": req.body.difficulty,
      }
    })
  .then(async (primary) => {
    await breedingSheetUpdate(req.body.species, req.body.dataNotification, 'primary');
    await res.status(200).json({
      message: 'update primary DATA done'
    });
  });
});

// Find by Species
router.get('/:species', async(req, res, next) => {
  await BreedingSheet.findOne({species: req.params.species},
    (error, sheet) => {
      if(error) {
        return console.log('no breeding sheet found for this species');
      }
      return res.status(200).json({sheet});
    })
  .populate('creator');
});

// Find by ID
router.get('/:id', async(req, res, next) => {
  console.log(req.params.id);
  await BreedingSheet.findOne({ _id: req.params.id },
    (error, sheet) => {
      if(error) {
        return console.log('no breedsheet found for this ID');
      }
      console.log('sheet', sheet);

      return res.status(200).json({
        sheet: sheet,
        message: 'breedsheet found!'
      });
    })
});

// Get ALL
router.get('/', async(req, res, next) => {
  await BreedingSheet.find()
  .populate('creator')
  .then(documents => {
    res.status(200).json({
      message: 'breeding sheets succesfully loaded',
      breedingSheets: documents
    });
  });
});

// Get with filtering
router.get('/filter/search', async(req, res, next) => {

  await BreedingSheet.find(
    {
      $and: [
        {
          status: {
            $ne: "pending"
          }
        },
        {
        'family': req.query.family !== 'all' ? req.query.family : { $ne: req.query.family}
        },
        {
        'subfamily': req.query.subfamily !== 'all' ? req.query.subfamily : { $ne: req.query.subfamily}
        },
        {
        'genre': req.query.genre !== 'all' ? req.query.genre : { $ne: req.query.genre}
        },
        {
        'tribu': req.query.tribu !== 'all' ? req.query.tribu : { $ne: req.query.tribu}
        },
        {
        'difficulty': req.query.difficulty !== '0' ? req.query.difficulty : { $ne: req.query.difficulty}
        },
        {
        'regions': req.query.region !== 'all' ? { $in: [req.query.region] }: { $ne: req.query.region}
        },
        {
        'polygyne': req.query.polygyne !== 'all' ? req.query.polygyne :  { $in: [ true, false ] }
        },
        {
        'needDiapause': req.query.diapause !== 'all' ? req.query.diapause : { $in: [ true, false ] }
        }
      ]
    }
  )
  .populate('creator')
  .then(documents => {
    res.status(200).json({
      message: 'filtered breeding sheets succesfully loaded',
      breedingSheets: documents
    });
  });
});

// approve breedsheet
router.post('/approve/:id', async (req, res, next) => {
  const approveSheet = await BreedingSheet.findOneAndUpdate({ _id: req.params.id },
    { "$set": {
      "status": 'approved'
      }
    })
  .then(async (approve) => {
    console.log(`approved sheet: , ${approve}`);
    await res.status(200).json({
      message: 'breedsheet approved!'
    });
  });
});

//  Approve Notification breedsheet
router.post('/approvenotif/:id', async (req, res, next) => {
  await breedingSheetApproved(req.body.reciever, req.body.species, req.body.userNotification, req.body.adminNotification)
  .then(async (approve) => {
    console.log(`approve notifications sent`);
    await res.status(200).json({
      message: 'breedsheet approve notification sent!'
    });
  })
});

 // Delete breedsheet
router.delete('/:id', async (req, res, next) => {
  await BreedingSheet.deleteOne({ _id: req.params.id })
  .then((result) => {
    res.status(200).json({
      message: 'breedsheet deleted!'
    });
  })
});

//  Delete Notification breedsheet
router.post('/:id', async (req, res, next) => {
  await breedingSheetDelete(req.body.reciever, req.body.species, req.body.userNotification, req.body.adminNotification)
  .then((result) => {
    res.status(200).json({
      message: 'breedsheet delete notification sent!'
    });
  })
});

module.exports = router;
