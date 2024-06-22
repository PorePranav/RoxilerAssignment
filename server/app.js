const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const transactionRouter = require('./routers/transactionRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/transactions', transactionRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
