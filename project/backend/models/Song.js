const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: String, required: true },
  releaseYear: { type: Number, required: true }
});

module.exports = mongoose.model('Song', SongSchema);
