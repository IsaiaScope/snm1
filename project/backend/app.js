const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  nome: String,
  cognome: String,
  username: String,
  email: String,
  password: String,
  eta: Number,
  preferenzeMusicali: [String],
  gruppiMusicali: [String]
});

const User = mongoose.model('User', userSchema);

app.post('/api/users/register', async (req, res) => {
  const { nome, cognome, username, email, password, eta, preferenzeMusicali, gruppiMusicali } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      nome,
      cognome,
      username,
      email,
      password: hashedPassword,
      eta,
      preferenzeMusicali,
      gruppiMusicali
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
