const url_user = process.env.SPOTIFY_URL_USER;
const userNotMeUrl = process.env.SPOTIFY_URL_USERS_NOT_ME;


async function me(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;

		const user = await fetch(url_user, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${spotifyAccessToken}`,
				'Content-Type': 'application/json',
			},
		});
		const _user = await user.json();
		res.json(_user);
	} catch (error) {
		console.error('Error fetching user:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
async function get(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { user_id } = req.query;

		const user = await fetch(`${userNotMeUrl}/${user_id}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${spotifyAccessToken}`,
				'Content-Type': 'application/json',
			},
		});
		const _user = await user.json();
		res.json(_user);
	} catch (error) {
		console.error('Error fetching user:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	get,
	me,
};
