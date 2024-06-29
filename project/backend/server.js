const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const userRoutes = require('./routes/userRoutes');
const spotifyAuthRoutes = require('./routes/spotifyAuthRoutes');
const initDB = require('./db/init');

const app = express();

(async () => {
	await initDB();
})();

// Middleware
app.use(bodyParser.json()).use(cors()).use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/spotify-auth', spotifyAuthRoutes);

// Start Server
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
	console.log(`Server is running`);
});
