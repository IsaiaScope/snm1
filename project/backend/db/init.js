const mongoose = require('mongoose');

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('[DEBUG] DB: Connessione riuscita');
};


const initDB = async () => {
  mongoose.set('strictQuery', true);
  try {
    await connect();
  } catch (error) {
    console.log('[DEBUG] DB: Connessione fallita', error);
  }
};

module.exports = initDB;
