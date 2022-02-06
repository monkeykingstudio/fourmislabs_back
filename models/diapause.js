const mongoose = require('mongoose');

const diapauseSchema = mongoose.Schema({
  period: { type: Object, required: true },
  species: { type: String, required: true },
  colonyId: { type: String, required: true },
  status: { type: String, default: 'unset',  required: true },
  startTemperature: { type: Number, default: 0, required: true },
  currentTemperature: { type: Array, default: [],  required: true },
  creatorId: { type: String, default: 'unset',  required: true },
  creatorPseudo: { type: String, default: 'unset',  required: true },
  creatorEmail: { type: String, required: false },
  socketRef: { type: String, required: false },
  endedSaw: { type: Boolean, default: false, required: false }
});

module.exports = mongoose.model('Diapause', diapauseSchema);
