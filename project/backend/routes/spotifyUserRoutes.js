const express = require('express');
const router = express.Router();
const spotifyUserController = require('../controllers/spotifyUserController');
const spotifyMiddleware = require('../middleware/spotify');

// https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile

router
	.get('/me', spotifyMiddleware, spotifyUserController.me)
	.get('/get', spotifyMiddleware, spotifyUserController.get);

module.exports = router;
