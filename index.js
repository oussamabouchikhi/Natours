const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit http requests from the same IP to 100req/hour
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});
// Apply this middleware for routes that starts with api
app.use('/api', limiter);

// Read data from body & limit to 10kb
app.use(express.json({ limit: '10kb' }));

// Sanitize data against NoSQL query injecion
app.use(mongoSanitize());

// Sanitize data against XSS
app.use(xss())

// Serve static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
