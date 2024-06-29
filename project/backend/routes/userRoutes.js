const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router
	.post('/register', userController.register)
	.post('/login', userController.login)
	.get('/profile', auth, userController.profile)
	.put('/update', auth, userController.update)
	.delete('/delete', auth, userController.cancel);

module.exports = router;
