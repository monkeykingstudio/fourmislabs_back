const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

const breedingSheetSchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  creatorPseudo: { type: String, required: false },
  creationDate: { type: String, default: Date.now(), required: true },
  status: { type: String, default: 'pending', required: true },
  id: { type: String, required: false },
  genre: { type: String, required: true },
  species: { type: String, required: true },
  family: { type: String, required: true },
  subfamily: { type: String, required: false },
  tribu: { type: String, required: false },
  gynePictures: { type:[], required: false },
  pictures: { type:[], required: false },
  regions: { type:[], required: true },
  foods: { type:[], required: true },
  difficulty: { type: Number, required: false },
  polygyne: { type: Boolean, required: true},
  polymorphism: { type: Boolean, required: true},
  semiClaustral: { type: Boolean, required: true},
  needDiapause: { type: Boolean, required: true},
  trophalaxy: { type: Boolean, required: false},
  drinker: { type: Boolean, required: false},
  driller: { type: Boolean, required: false},
  gyneSize: { type: Number, required: true},
  maleSize: { type: Number, required: false},
  majorSize: { type: Number, required: false},
  workerSize: { type: Number, required: true},
  gyneLives: { type: Number, required: true},
  workerLives: { type: Number, required: true},
  temperature: { type:[], required: true },
  diapauseTemperature: { type:[], required: true },
  hygrometry: { type:[], required: true },
  diapausePeriod: { type:[], required: false },
  swarmingPeriod: { type:[], required: false },
  nestType: { type: String, required: false},
  maxPopulation: { type: Number, required: true},
  sources: { type:[], required: false },
  characteristics: { type:String, required: false },
  socketRef: { type: String, required: false }
});
breedingSheetSchema.plugin(normalize);


module.exports = mongoose.model('breedingSheet', breedingSheetSchema);
