const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const {
    nome,
    cognome,
    username,
    email,
    password,
    eta,
    preferenzeMusicali,
    gruppiMusicali,
  } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      nome,
      cognome,
      username,
      email,
      password: hashedPassword,
      eta,
      preferenzeMusicali,
      gruppiMusicali,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Credenziali non valide' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({ message: 'Credenziali non valide' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ message: 'Errore durante il login' });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    res.json(user);
  } catch (error) {
    console.error('Errore nel recupero del profilo:', error);
    res.status(500).json({ message: 'Errore nel recupero del profilo' });
  }
});

router.put('/update', auth, async (req, res) => {
  const {
    nome,
    cognome,
    username,
    email,
    eta,
    preferenzeMusicali,
    gruppiMusicali,
  } = req.body;

  const updatedData = {
    nome,
    cognome,
    username,
    email,
    eta,
    preferenzeMusicali,
    gruppiMusicali,
  };

  try {
    let user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updatedData },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del profilo:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del profilo' });
  }
});

router.delete('/delete', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    await User.findByIdAndDelete(req.userId);

    res.json({ message: 'Utente eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'utente:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'utente' });
  }
});

module.exports = router;
