const querystring = require('querystring');
const generateRandomString = require('../utils/randomString');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const redirect_uri_after_login = process.env.SPOTIFY_REDIRECT_URI_AFTER_LOGIN;
const stateKey = process.env.SPOTIFY_STATE_KEY;
const url = 'https://accounts.spotify.com/api/token';
const url_user = 'https://api.spotify.com/v1/me';
const headers = {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Authorization':
		'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
};

async function login(req, res) {
	const state = generateRandomString(16);
	res.cookie(stateKey, state);

	const scope = 'user-read-private user-read-email';
	res.redirect(
		'https://accounts.spotify.com/authorize?' +
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
				redirect_uri: redirect_uri,
				grant_type: 'authorization_code',
			}),
		};

		try {
			const response = await fetch(url, authOptions);
			const body = await response.json();
			if (response.ok) {
				const access_token = body.access_token;
				const refresh_token = body.refresh_token;
				const options = {
					method: 'GET',
					headers: { 'Authorization': 'Bearer ' + access_token },
				};

				// use the access token to access the Spotify Web API
				const userProfileResponse = await fetch(url_user, options);
				const userProfileBody = await userProfileResponse.json();
				console.log(userProfileBody);

				res.redirect(
					redirect_uri_after_login +
						querystring.stringify({
							access_token: access_token,
							refresh_token: refresh_token,
						})
				);
			} else {
				res.redirect(
					redirect_uri_after_login +
						querystring.stringify({
							error: 'error retrieving spotify data',
						})
				);
			}
		} catch (error) {
			res.redirect(
				redirect_uri_after_login +
					querystring.stringify({
						error: 'invalid_token',
					})
			);
		}
	}
}

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
		const response = await fetch(url, authOptions);
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
