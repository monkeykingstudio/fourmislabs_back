const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

const notificationSchema = mongoose.Schema({
  senderId: { type: String, default: '', required: true },
  senderPseudo: { type: String, default: 'fourmislabs', required: true },
  recieverId: { type: String, required: false },
  message: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now() },
  read_by:[{
    readerId:{ type: String, required: false },
    read_at: { type: Date, default: Date.now, required: false }
  }],
  type: { type: String, required: true, default: 'global' },
  subType: { type: String, required: false, default: 'system' },
  url: { type: String, default: '', required: false },
  socketRef: { type: String, default: '', required: false }
});

notificationSchema.plugin(normalize);

module.exports = mongoose.model('Notification', notificationSchema);
