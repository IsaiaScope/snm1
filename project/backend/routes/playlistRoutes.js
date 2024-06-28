const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

// Crea una nuova playlist
router.post('/', auth, async (req, res) => {
  const { title, description, tags, songs } = req.body;
  try {
    const playlist = new Playlist({
      userId: req.user.id,
      title,
      description,
      tags,
      songs
    });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella creazione della playlist', error });
  }
});

// Leggi tutte le playlist dell'utente
router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.user.id }).populate('songs');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero delle playlist', error });
  }
});

// Aggiorna una playlist
router.put('/:id', auth, async (req, res) => {
  const { title, description, tags, songs } = req.body;
  try {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description, tags, songs },
      { new: true }
    );
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist non trovata' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento della playlist', error });
  }
});

// Cancella una playlist
router.delete('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist non trovata' });
    }
    res.json({ message: 'Playlist cancellata con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella cancellazione della playlist', error });
  }
});

module.exports = router;
