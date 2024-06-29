const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const spotifyAuthController = require('../controllers/spotifyAuthController');

// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
// https://github.com/spotify/web-api-examples/blob/master/authorization/authorization_code/app.js

router
	.get('/refresh', spotifyAuthController.refresh)
	.get('/login', spotifyAuthController.login)
	.get('/callback', spotifyAuthController.callback);

module.exports = router;
