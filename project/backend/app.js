const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));



// When strictQuery is set to true, Mongoose will ignore any fields in a query that are not defined in the schema. This is the default behavior in Mongoose 6 and earlier.

// When strictQuery is set to false, Mongoose will allow queries to include fields that are not defined in the schema. This will be the default behavior in Mongoose 7 and later.
mongoose.set("strictQuery", true);



mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to MongoDB');
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch(err => {
		console.error('Error connecting to MongoDB:', err.message);
	});
