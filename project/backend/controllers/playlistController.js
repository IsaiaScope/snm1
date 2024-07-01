const createParams = require('../utils/createParams');
const userUrl = process.env.SPOTIFY_URL_USER;
const userNotMeUrl = process.env.SPOTIFY_URL_USERS_NOT_ME;
const spotifyUrl = process.env.SPOTIFY_URL;

async function currentList(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { offset, limit } = req.query;

		const playlists = await fetch(
			`${userUrl}/playlists${createParams({ offset, limit })}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${spotifyAccessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);
		const _playlists = await playlists.json();

		res.json(_playlists);
	} catch (error) {
		console.error('Error fetching user playlists:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

async function list(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { user_id, offset, limit } = req.query;

		const playlists = await fetch(
			`${userNotMeUrl}/${user_id}/playlists${createParams({ offset, limit })}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${spotifyAccessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);
		const _playlists = await playlists.json();

		res.json(_playlists);
	} catch (error) {
		console.error('Error fetching user playlists:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

async function trackList(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { playlist_id, market, limit, offset, additional_types } = req.query;

		const tracks = await fetch(
			`${spotifyUrl}/playlists/${playlist_id}/tracks${createParams({
				offset,
				limit,
				market,
				additional_types,
			})}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${spotifyAccessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);
		const _tracks = await tracks.json();

		res.json(_tracks);
	} catch (error) {
		console.error('Error fetching playlist tracks:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

// this api take around 2 minutes to update the playlist details on spotify's server
async function changeDetails(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { playlist_id, name, public, collaborative, description } = req.body;

		await fetch(`${spotifyUrl}/playlists/${playlist_id}`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${spotifyAccessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, public, collaborative, description }),
		});

		res.json({ message: 'Playlist details changed' });
	} catch (error) {
		console.error('Error changing playlist details:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

async function create(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { name, public, collaborative, description, user_id } = req.body;
		const data = await fetch(`${userNotMeUrl}/${user_id}/playlists`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${spotifyAccessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, public, collaborative, description }),
		});
		const _data = await data.json();

		res.json(_data);
	} catch (error) {
		console.error('Error creating playlists:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

async function unfollow(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { playlist_id } = req.body;
		await fetch(`${spotifyUrl}/playlists/${playlist_id}/followers`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${spotifyAccessToken}`,
				'Content-Type': 'application/json',
			},
		});
		res.json({ message: 'Playlist unfollowed' });
	} catch (error) {
		console.error('Error unfollowing playlist:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

async function follow(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { playlist_id, public = true } = req.body;
		await fetch(`${spotifyUrl}/playlists/${playlist_id}/followers`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${spotifyAccessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ public }),
		});
		res.json({ message: 'Playlist followed' });
	} catch (error) {
		console.error('Error following playlist:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

async function addTrack(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { playlist_id, position, uris } = req.body;
		// For example: {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M", "spotify:episode:512ojhOuo1ktJprKbVcKyQ"]}
		console.log(`${spotifyUrl}/playlists/${playlist_id}/tracks`);
		const data = await fetch(`${spotifyUrl}/playlists/${playlist_id}/tracks`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${spotifyAccessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ uris, position }),
		});
		const _data = await data.json();

		res.json(_data);
	} catch (error) {
		console.error('Error adding song to playlist:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

async function removeTrack(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { playlist_id, tracks, snapshot_id } = req.body;
		// { "tracks": [{ "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh" },{ "uri": "spotify:track:1301WleyT98MSxVHPZCA6M" }] }.
		const data = await fetch(`${spotifyUrl}/playlists/${playlist_id}/tracks`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${spotifyAccessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ tracks, snapshot_id }),
		});
		const _data = await data.json();

		res.json(_data);
	} catch (error) {
		console.error('Error removing song from playlist:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

async function categories(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { limit, offset, locale } = req.query;

		const categories = await fetch(
			`${spotifyUrl}/browse/categories${createParams({ limit, offset, locale })}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${spotifyAccessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);
		const _categories = await categories.json();

		res.json(_categories);
	} catch (error) {
		console.error('Error fetching categories:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

async function byCategory(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { category_id, limit, offset } = req.query;

		const playlists = await fetch(
			`${spotifyUrl}/browse/categories/${category_id}/playlists${createParams({
				limit,
				offset,
			})}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${spotifyAccessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);
		const _playlists = await playlists.json();

		res.json(_playlists);
	} catch (error) {
		console.error('Error fetching playlists by category:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	currentList,
	create,
	addTrack,
	removeTrack,
	trackList,
	changeDetails,
	list,
	unfollow,
	follow,
	categories,
	byCategory,
};
