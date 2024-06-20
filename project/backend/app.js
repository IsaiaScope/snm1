const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use((res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
	next();
});
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', true);
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch(err => {
		console.error('Error connecting to MongoDB:', err);
	});

const userSchema = new mongoose.Schema({
	nome: String,
	cognome: String,
	username: { type: String },
	email: { type: String, required: true, unique: true },
	password: String,
	eta: Number,
	preferenzeMusicali: [String],
	gruppiMusicali: [String],
});

const User = mongoose.model('User', userSchema);

app.post('/api/users/register', async (req, res) => {
	const {
		nome,
		cognome,
		username,
		email,
		password,
		eta,
		preferenzeMusicali,
		gruppiMusicali,
	} = req.body;
	console.log(`🧊 ~ req.body: `, req.body);

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			nome,
			cognome,
			username,
			email,
			password: hashedPassword,
			eta,
			preferenzeMusicali,
			gruppiMusicali,
		});

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'email already exists' });
		}

		await newUser.save();
		res.status(201).json({ message: 'User registered successfully' });
	} catch (err) {
		res.status(500).json({ message: 'Error registering user', error: err });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
