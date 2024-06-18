const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  eta: { type: Number, required: true },
  preferenzeMusicali: { type: [String], required: true },
  gruppiMusicali: { type: [String], required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
