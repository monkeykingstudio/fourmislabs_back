const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = mongoose.Schema
({
  id: { type: String, required: false },
  pseudo: { type: String, required: false },
  email: { type: String, unique: true, dropDups: true, required: true },
  hashPassword: { type: String, default: 'client', required: true },
  created: { type: Date, default: Date.now(), required: true },
  role: { type: String, default: 'user', required: true },
  newsletter: { type: Boolean, required: false },
  is_verified: { type: Boolean, default: false, required: true },
  coloCount: { type: Array, default: [], required: true },
  lastLogin: { type: Date, default: null, required: false },
  isConnected: { type: Boolean, default: false, required: false }


  // TODO champ colonies: [{ type: Schema.Types.ObjectId, ref: 'Colony' }]
  // picture: { type: String, required: false },
});

UserSchema.methods.comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

UserSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.'
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
