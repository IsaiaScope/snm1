const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const spotifyMiddleware = require('../middleware/spotify');

// https://developer.spotify.com/documentation/web-api/reference/get-track

router
	.get('/my', spotifyMiddleware, trackController.my);

module.exports = router;
