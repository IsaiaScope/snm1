const createParams = require('../utils/createParams');
const url_user = process.env.SPOTIFY_URL_USER;

async function my(req, res) {
	try {
		const spotifyAccessToken = req.spotifyAccessToken;
		const { market, limit, offset } = req.query;

		const user = await fetch(
			`${url_user}/tracks${createParams({ market, limit, offset })}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${spotifyAccessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);
		const _user = await user.json();
		res.json(_user);
	} catch (error) {
		console.error('Error fetching user:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	my,
};
