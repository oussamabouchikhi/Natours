const path = require('path');

const express       = require('express');
const morgan        = require('morgan');
const rateLimit     = require('express-rate-limit');
const helmet        = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss           = require('xss-clean');
const hpp           = require('hpp');

const tourRouter   = require('./routes/tourRoutes');
const userRouter   = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const app = express();

// 1) MIDDLEWARES

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

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
app.use(xss());

// Prevent paramter pollution (if some params are duplicated it uses the last one)
// [whitelist]: params allowed to be duplicated
app.use(hpp({
  whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
}));

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

app.get('/', (req, res) => {
  res.status(200).render('base');
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

module.exports = app;
