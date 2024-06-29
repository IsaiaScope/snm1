const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Song = require('../models/Song');

// Crea una nuova canzone
router.post('/', auth, async (req, res) => {
  const { title, artist, genre, duration, releaseYear } = req.body;
  try {
    const song = new Song({
      title,
      artist,
      genre,
      duration,
      releaseYear
    });
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella creazione della canzone', error });
  }
});

// Leggi tutte le canzoni
router.get('/', auth, async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero delle canzoni', error });
  }
});

// Aggiorna una canzone
router.put('/:id', auth, async (req, res) => {
  const { title, artist, genre, duration, releaseYear } = req.body;
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { title, artist, genre, duration, releaseYear },
      { new: true }
    );
    if (!song) {
      return res.status(404).json({ message: 'Canzone non trovata' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento della canzone', error });
  }
});

// Cancella una canzone
router.delete('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Canzone non trovata' });
    }
    res.json({ message: 'Canzone cancellata con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella cancellazione della canzone', error });
  }
});

module.exports = router;
