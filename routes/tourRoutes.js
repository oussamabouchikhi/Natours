const express = require('express');
const {
  aliasTopTours,
  getAllTours,
  getTourStats,
  getMonthlyPlan,
  checkBody,
  createTour,
  getTour,
  updateTour,
  deleteTour
} = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRouter');

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
  .get(getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('admin', 'lead-guide'), getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
