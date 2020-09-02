const express = require('express');
const {
  aliasTopTours,
  getAllTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  checkBody,
  createTour,
  getTour,
  updateTour,
  deleteTour
} = require('./../controllers/tourController');
const {protect, restrictTo} = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Param middleware (runs when passing a param to our url)
// router.param('id', checkID);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(aliasTopTours, getAllTours)

router
  .route('/tour-stats')
  .get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin);
//                      /tours-within/233/center/-40,45/unit/mi'
// or with query string /tours-within?distance=233&center=40,45&unit=mi

router
  .route('/distance/:latlng/unit/:unit')
    .get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
