const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

const authRouter = require('./routes/api/auth');
const usersRouter = require('./routes/api/users');
const transactionsRouter = require('./routes/api/transaction');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }),
);
app.use(express.json());
app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/transaction', transactionsRouter);

app.use((req, res) => {
  res.status(404).json({
    message: 'Not found',
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
