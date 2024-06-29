const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Accesso negato. Nessun token fornito.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.user.id;
    next();
  } catch (error) {
    console.error('Errore di autenticazione:', error);
    res.status(401).json({ message: 'Token non valido.' });
  }
}

module.exports = auth;
