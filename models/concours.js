const mongoose = require('mongoose');

const concoursSchema = mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  facebook: { type: Object, required: false, default: '' }
});

module.exports = mongoose.model('Concours', concoursSchema);
