const express = require("express");
const Counter = require("../models/counter");
const Colony = require("../models/colony");
const router = express.Router();

// Get counter by ID
router.get('/:id', (req, res, next) => {
  // var query = req.query.counter;
  Colony.findById(req.params.id).then(document => {
    res.status(200).json({
      message: `counter found on ${document.name}, with ID ${req.params.id}`,
      counter: document.counter
    });
  });
});

// Update counter by ID
router.put('/:id', (req, res, next) => {
  const updateCounter = new Counter({
    minorCount: req.body.minorCount,
    mediumCount: req.body.mediumCount,
    majorCount: req.body.majorCount,
    polymorph: req.body.polymorph,
    polyCount: req.body.polyCount,
    breed: req.body.breed,
    breedCount: req.body.breedCount});
  Colony
  .findOne({ _id: req.params.id}, function(err, doc) {
    if (err)
    {
      // TODO: Handle the error!
    }
    if (! doc)
    {
      res.json(doc);
    }
    else {
      doc.counter.minorCount = req.body.minorCount;
      doc.counter.mediumCount = req.body.mediumCount;
      doc.counter.majorCount = req.body.majorCount;
      doc.counter.breedCount = req.body.breedCount;
      doc.counter.polyCount = req.body.polyCount;
      doc.counter.polymorph = req.body.polymorph;
      doc.counter.breed = req.body.breed;

      doc.save(function (err) {
        if (err)
        {
            // TODO: Handle the error!
        }
        res.json(doc);
      });
    }
  })
});

module.exports = router;
