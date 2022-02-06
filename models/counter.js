const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

const counterSchema = mongoose.Schema({
  minorCount: { type: Number, required: true },
  mediumCount: { type: Number, required: true },
  majorCount: { type: Number, required: true },
  polymorph: { type: Boolean, required: true },
  polyCount: { type: Number, required: false },
  breed: { type: Boolean, required: false },
  breedCount: { type: Number, required: false }
});
counterSchema.plugin(normalize);

module.exports = mongoose.model('Counter', counterSchema);
