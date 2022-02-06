const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

const colonySchema = mongoose.Schema({
  id: { type: String, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true },
  species: { type: String, required: false },
  creationDate: { type: String, required: true },
  name: { type: String, required: true },
  polyGyne: { type: Boolean, required: false },
  polyGyneCount: { type: Number, required: false },
  gyneName: { type: String, required: false },
  counter: {
    minorCount: { type: Number, required: true },
    mediumCount: { type: Number, required: true },
    majorCount: { type: Number, required: true },
    polymorph: { type: Boolean, required: true },
    polyCount: { type: Number, required: false },
    breed: { type: Boolean, required: false },
    breedCount: { type: Number, required: false }
    // breedEggCount
    // breedNympheCount / breedCocoonCount
  }
});
colonySchema.plugin(normalize);

module.exports = mongoose.model('Colony', colonySchema);
