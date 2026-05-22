require('dotenv').config();
const connectDB             = require('./config/db');
const app                   = require('./app');
const { startPushScheduler } = require('./utils/pushScheduler');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  startPushScheduler();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
