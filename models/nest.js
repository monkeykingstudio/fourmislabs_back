const mongoose = require('mongoose');

const nestSchema = mongoose.Schema({
    id: { type: String, required: false },
    creator: { type: String, required: true },
    creationDate: { type: Date, required: true },
    type: { type: String, required: true },
    visibility: { type: String, required: true },
    species: { type: String, required: true },
    name: { type: String, required: true },
    gyneName: { type: String, required: false },
    polyGyne: { type: Boolean, required: true },
    polyGyneCount: { type: Number, default: 0, required: true },
});

module.exports = mongoose.model('Nest', nestSchema);
