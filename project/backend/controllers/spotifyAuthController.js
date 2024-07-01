const querystring = require('querystring');
const generateRandomString = require('../utils/randomString');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URL;
const redirect_uri_after_login = process.env.SPOTIFY_REDIRECT_URL_AFTER_LOGIN;
const stateKey = process.env.SPOTIFY_STATE_KEY;
const url_token = process.env.SPOTIFY_URL_TOKEN;
const url_user = process.env.SPOTIFY_URL_USER;
const url_auth = process.env.SPOTIFY_URL_AUTH;
const headers = {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Authorization':
		'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
};

async function login(req, res) {
	const state = generateRandomString(16);
	res.cookie(stateKey, state);

	const scope =
		'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-library-read user-library-modify';
	res.redirect(
		url_auth +
			querystring.stringify({
				response_type: 'code',
				client_id,
				scope,
				redirect_uri,
				state,
			})
	);
}

async function callback(req, res) {
	const code = req.query.code || null;
	const state = req.query.state || null;
	const storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect(
			redirect_uri_after_login +
				querystring.stringify({
					error: 'state_mismatch',
				})
		);
	} else {
		res.clearCookie(stateKey);
		const authOptions = {
			method: 'POST',
			headers,
			body: new URLSearchParams({
				code: code,
				redirect_uri,
				grant_type: 'authorization_code',
			}),
		};

		try {
			const response = await fetch(url_token, authOptions);
			const body = await response.json();
			if (response.ok) {
				const access_token = body.access_token;
				const refresh_token = body.refresh_token;
				const options = {
					method: 'GET',
					headers: { 'Authorization': 'Bearer ' + access_token },
				};

				const userProfileResponse = await fetch(url_user, options);
				const { id: spotifyId, uri: spotifyUri } = await userProfileResponse.json();

				const twentyYearsInMs = 365 * 24 * 60 * 60 * 1000; // 1 years in milliseconds
				const expires = new Date(Date.now() + twentyYearsInMs);

				res.cookie('spotifyAccessToken', access_token, {
					httpOnly: true,
					secure: true,
					expires,
				});
				res.cookie('spotifyRefreshToken', refresh_token, {
					httpOnly: true,
					secure: true,
					expires,
				});
				res.cookie('spotifyaccessTokenExpiresAt', Date.now() + 60 * 60 * 1000, {
					httpOnly: true,
					secure: true,
					expires,
				});
				res.cookie('spotifyId', spotifyId, {
					httpOnly: false,
					secure: true,
					expires,
				});
				res.cookie('spotifyUri', spotifyUri, {
					httpOnly: false,
					secure: true,
					expires,
				});

				res.redirect(redirect_uri_after_login);
			} else {
				res.redirect(
					redirect_uri_after_login +
						querystring.stringify({
							error: 'error retrieving spotify data',
						})
				);
			}
		} catch (error) {
			console.log(`🧊 ~ error: `, error);
			res.redirect(
				redirect_uri_after_login +
					querystring.stringify({
						error: 'invalid_token',
					})
			);
		}
	}
}

// just for testing purpose
async function refresh(req, res) {
	const refresh_token = req.query.refresh_token;
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
		if (response.ok) {
			const access_token = body.access_token;
			// Refresh token might not be returned by Spotify on refresh token request
			const new_refresh_token = body.refresh_token
				? body.refresh_token
				: refresh_token;
			res.json({
				access_token,
				refresh_token: new_refresh_token,
			});
		} else {
			res.status(response.status).json({ error: 'Failed to refresh token' });
		}
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	refresh,
	login,
	callback,
};
