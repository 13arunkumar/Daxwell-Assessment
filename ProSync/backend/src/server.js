require('dotenv').config();
const connectDatabase = require('./config/database');
const app = require('./app');

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`ProSync API server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;
