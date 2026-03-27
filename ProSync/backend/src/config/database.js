const mongoose = require('mongoose');

let connectionPromise = null;
let listenersRegistered = false;

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  try {
    const conn = await connectionPromise;

    if (!listenersRegistered) {
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });

      listenersRegistered = true;
    }

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDatabase;
