const express = require('express');
const pool = require('./config/db');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');

function createHealthHandler(pool) {
  return async (req, res) => {
    try {
      await pool.query('SELECT 1');
      res.status(200).json({ status: 'ok', db: 'ok' });
    } catch (err) {
      res.status(503).json({ status: 'error', db: 'error' });
    }
  };
}

const app = express();
app.use(express.json());
app.use(requestLogger);
app.get('/health', createHealthHandler(pool));
app.use('/auth', authRoutes);

app.use(errorHandler);

module.exports = { app, createHealthHandler };
