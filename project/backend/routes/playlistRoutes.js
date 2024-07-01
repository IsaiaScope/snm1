const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const spotifyMiddleware = require('../middleware/spotify');

// https://developer.spotify.com/documentation/web-api/reference/get-playlist

router
	.get('/currentList', spotifyMiddleware, playlistController.currentList)
	.post('/create', spotifyMiddleware, playlistController.create)
	.post('/add-track', spotifyMiddleware, playlistController.addTrack)
	.delete('/remove-track', spotifyMiddleware, playlistController.removeTrack)
	.get('/track-list', spotifyMiddleware, playlistController.trackList)
	.put('/change-details', spotifyMiddleware, playlistController.changeDetails)
	.get('/list', spotifyMiddleware, playlistController.list)
	.delete('/unfollow', spotifyMiddleware, playlistController.unfollow)
	.get('/by-category', spotifyMiddleware, playlistController.byCategory)
	.get('/categories', spotifyMiddleware, playlistController.categories)
	.put('/follow', spotifyMiddleware, playlistController.follow);

module.exports = router;
