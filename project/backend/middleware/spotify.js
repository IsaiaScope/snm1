const url_token = process.env.SPOTIFY_URL_TOKEN;
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const headers = {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Authorization':
		'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
};

async function refresh(refresh_token) {
	const authOptions = {
		method: 'POST',
		headers,
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refresh_token,
		}),
	};

	try {
		const response = await fetch(url_token, authOptions);
		const body = await response.json();
		if (response.status === 200) {
			const access_token = body.access_token;
			// Refresh token might not be returned by Spotify on refresh token request
			const new_refresh_token = body.refresh_token
				? body.refresh_token
				: refresh_token;
			return {
				access_token,
				refresh_token: new_refresh_token,
			};
		} else {
			return { error: 'Failed to refresh token' };
		}
	} catch (error) {
		return { error: 'Internal Server Error' };
	}
}

const spotifyMiddleware = async (req, res, next) => {
	const refreshToken = req.cookies['spotifyRefreshToken'];
	const accessToken = req.cookies['spotifyAccessToken'];
	const accessTokenExpiresAt = req.cookies['spotifyaccessTokenExpiresAt'];

	if (!refreshToken || !accessToken) {
		return res.status(401).json({ error: 'No spotify token found' });
	}

	console.log(
		`🧊 [TOKEN EXPIRE IN (m)]`,
		(accessTokenExpiresAt - Date.now()) / 60 / 1000
	);
	if (accessTokenExpiresAt - Date.now() > 30 * 1000) {
		req.spotifyAccessToken = accessToken;
		return next();
	} else {
		const { error, access_token, refresh_token } = await refresh(refreshToken);

		if (error || !access_token || !refresh_token) {
			return res.status(500).json({ error: error || 'Failed to refresh token' });
		}

		res.cookie('spotifyAccessToken', access_token, {
			httpOnly: true,
			secure: true,
		});
		res.cookie('spotifyRefreshToken', refresh_token, {
			httpOnly: true,
			secure: true,
		});
		res.cookie('spotifyaccessTokenExpiresAt', Date.now() + 60 * 60 * 1000, {
			httpOnly: true,
			secure: true,
		});

		req.spotifyAccessToken = access_token;
		return next();
	}
};

module.exports = spotifyMiddleware;
