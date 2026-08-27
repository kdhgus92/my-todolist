const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const pool = require('./config/db');
const { corsOrigin, nodeEnv } = require('./config/env');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const categoriesRoutes = require('./routes/categories.routes');
const todosRoutes = require('./routes/todos.routes');

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
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(requestLogger);
app.get('/health', createHealthHandler(pool));

if (nodeEnv !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);
app.use('/todos', todosRoutes);

app.use(errorHandler);

module.exports = { app, createHealthHandler };
