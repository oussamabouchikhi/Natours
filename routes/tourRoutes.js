const express = require('express');
const {getAllTours, checkBody, createTour, getTour, updateTour, deleteTour} = require('./../controllers/tourController');

const router = express.Router();

// Param middleware (runs when passing a param to our url)
// router.param('id', checkID);

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
