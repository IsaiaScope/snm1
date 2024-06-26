// User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: String,
  cognome: String,
  username: String,
  email: { type: String, required: true, unique: true },
  password: String,
  eta: Number,
  preferenzeMusicali: [String],
  gruppiMusicali: [String],
});

module.exports = mongoose.model('User', userSchema);
