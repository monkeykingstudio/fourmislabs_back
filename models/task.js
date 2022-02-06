const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

const taskSchema = mongoose.Schema({
  id: { type: String, required: false },
  parentId: {type: String, required: false},
  colonyId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" , required: true },
  creationDate: { type: Date, required: true, default: Date.now },
  automatic: { type: Boolean, default: true, required: false },
  title: { type: String, required: true },
  description: { type: String, default: 'no description provided', required: false },
  duration: { type: Number, required: false },
  recurent: { type: Boolean, required: false },
  every: { type: String, required: false },
  toDo: { type: Boolean, default: false, required: true }
});
taskSchema.plugin(normalize);

module.exports = mongoose.model('Task', taskSchema);
